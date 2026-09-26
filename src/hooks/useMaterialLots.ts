import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { clientChannelName } from "@/lib/realtimeChannel";

export type MaterialFamily =
	| "Anomaly Biological"
	| "Essence"
	| "Rift Botanical"
	| "Rift Mineral"
	| "Relic Material"
	| "Technical";

export interface MaterialDefinitionRow {
	id: string;
	name: string;
	family: MaterialFamily | null;
	unit: string | null;
	grade: string | null;
	rarity: string | null;
	source_revision: string;
	regulation_metadata: Record<string, unknown>;
	definition_metadata: Record<string, unknown>;
}

export interface MaterialLotRow {
	id: string;
	material_definition_id: string;
	owner_scope: "character" | "campaign";
	owner_character_id: string | null;
	owner_campaign_id: string | null;
	quantity: number;
	unit: string | null;
	grade: string | null;
	provenance_status:
		| "canonical"
		| "legacy-unknown"
		| "manual"
		| "harvested"
		| "crafted-output"
		| "imported";
	provenance_metadata: Record<string, unknown>;
	regulation_metadata: Record<string, unknown>;
	notes: string | null;
	row_version: number;
	legacy_character_material_id: string | null;
	created_at: string;
	updated_at: string;
}

export interface MaterialLotDiscoveryRow {
	id: string;
	lot_id: string;
	character_id: string;
	discovered_metadata: Record<string, unknown>;
	discovery_revision: number;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

type RpcClient = (
	fn: string,
	args: Record<string, unknown>,
) => Promise<{ data: unknown; error: { message: string } | null }>;
const callRpc = supabase.rpc as unknown as RpcClient;

const keys = {
	definitions: ["material-definitions-m1"] as const,
	lots: (characterId: string) => ["material-lots-m1", characterId] as const,
	discoveries: (characterId: string) =>
		["material-lot-discoveries-m1", characterId] as const,
};

function invalidateMaterialLots(
	queryClient: ReturnType<typeof useQueryClient>,
	characterId: string,
) {
	queryClient.invalidateQueries({ queryKey: keys.lots(characterId) });
	queryClient.invalidateQueries({ queryKey: keys.discoveries(characterId) });
	// Old crafting readers remain a compatibility projection during M1/M2.
	queryClient.invalidateQueries({ queryKey: ["character-materials", characterId] });
}

export function useMaterialLots(characterId: string | undefined) {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	useEffect(() => {
		if (!characterId || !isSupabaseConfigured) return;
		const channel = supabase
			.channel(clientChannelName(`material-lots-m1-${characterId}`))
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "material_lots",
					filter: `owner_character_id=eq.${characterId}`,
				},
				() => invalidateMaterialLots(queryClient, characterId),
			)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "material_lot_discoveries",
					filter: `character_id=eq.${characterId}`,
				},
				() => invalidateMaterialLots(queryClient, characterId),
			)
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [characterId, queryClient]);

	const definitionsQuery = useQuery({
		queryKey: keys.definitions,
		enabled: !!characterId && isSupabaseConfigured,
		staleTime: 5 * 60 * 1000,
		queryFn: async (): Promise<MaterialDefinitionRow[]> => {
			const { data, error } = await supabase
				.from("material_definitions" as never)
				.select("*")
				.order("name", { ascending: true });
			if (error) throw error;
			return (data ?? []) as unknown as MaterialDefinitionRow[];
		},
	});

	const lotsQuery = useQuery({
		queryKey: characterId ? keys.lots(characterId) : ["material-lots-m1", "_none"],
		enabled: !!characterId && isSupabaseConfigured,
		queryFn: async (): Promise<MaterialLotRow[]> => {
			if (!characterId) return [];
			const { data, error } = await supabase
				.from("material_lots" as never)
				.select("*")
				.eq("owner_scope", "character")
				.eq("owner_character_id", characterId)
				.order("created_at", { ascending: true });
			if (error) throw error;
			return (data ?? []).map((row) => {
				const value = row as unknown as MaterialLotRow;
				return { ...value, quantity: Number(value.quantity) };
			});
		},
	});

	const discoveriesQuery = useQuery({
		queryKey: characterId
			? keys.discoveries(characterId)
			: ["material-lot-discoveries-m1", "_none"],
		enabled: !!characterId && isSupabaseConfigured,
		queryFn: async (): Promise<MaterialLotDiscoveryRow[]> => {
			if (!characterId) return [];
			const { data, error } = await supabase
				.from("material_lot_discoveries" as never)
				.select("*")
				.eq("character_id", characterId)
				.order("created_at", { ascending: true });
			if (error) throw error;
			return (data ?? []) as unknown as MaterialLotDiscoveryRow[];
		},
	});

	const createLot = useMutation({
		retry: 1,
		mutationFn: async (input: {
			materialDefinitionId: string;
			quantity: number;
			notes?: string | null;
			operationId: string;
		}) => {
			if (!characterId) throw new Error("Character is required.");
			const { data, error } = await callRpc("create_material_lot_m1", {
				p_character_id: characterId,
				p_material_definition_id: input.materialDefinitionId,
				p_quantity: input.quantity,
				p_operation_id: input.operationId,
				p_notes: input.notes ?? null,
			});
			if (error) throw new Error(error.message);
			if (typeof data !== "string" || !data) {
				throw new Error("Material lot creation returned no id.");
			}
			return data;
		},
		onSuccess: () => {
			if (characterId) invalidateMaterialLots(queryClient, characterId);
			toast({ title: "Material lot added" });
		},
		onError: (error: Error) =>
			toast({
				title: "Could not add material lot",
				description: error.message,
				variant: "destructive",
			}),
	});

	const adjustLot = useMutation({
		retry: 1,
		mutationFn: async (input: {
			lotId: string;
			delta: number;
			expectedVersion: number;
			operationId: string;
		}) => {
			const { data, error } = await callRpc("adjust_material_lot_m1", {
				p_lot_id: input.lotId,
				p_delta: input.delta,
				p_expected_version: input.expectedVersion,
				p_operation_id: input.operationId,
			});
			if (error) throw new Error(error.message);
			return data;
		},
		onSuccess: () => {
			if (characterId) invalidateMaterialLots(queryClient, characterId);
		},
		onError: (error: Error) =>
			toast({
				title: "Could not update material lot",
				description: error.message,
				variant: "destructive",
			}),
	});

	return {
		definitions: definitionsQuery.data ?? [],
		lots: lotsQuery.data ?? [],
		discoveries: discoveriesQuery.data ?? [],
		isLoading:
			definitionsQuery.isLoading || lotsQuery.isLoading || discoveriesQuery.isLoading,
		createLot,
		adjustLot,
	};
}
