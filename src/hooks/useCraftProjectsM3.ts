import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export interface CraftFormulaM3 {
	id: string;
	revision: string;
	name: string;
	recipe_id: string;
	discipline: string;
	requirement_snapshot: Record<string, number>;
	output_definition_id: string;
	output_quantity: number;
	work_minutes: number;
	ability: string;
	skill: string;
	dc: number;
	tool_names: string[];
	failure_policy: string;
}

export interface CraftProjectM3 {
	id: string;
	character_id: string;
	formula_id: string;
	formula_revision: string;
	formula_snapshot: Record<string, unknown>;
	status: "reserved" | "worked" | "completed" | "failed" | "cancelled";
	row_version: number;
	work_minutes: number;
	roll: number | null;
	ability_modifier: number | null;
	proficiency_bonus: number | null;
	total: number | null;
	dc: number | null;
	output_lot_id: string | null;
	created_at: string;
}

export interface CraftReservationM3 {
	id: string;
	lot_id: string;
	quantity: number;
	status: "active" | "released" | "consumed";
	reference_id: string;
}

type RpcClient = (
	fn: string,
	args: Record<string, unknown>,
) => Promise<{ data: unknown; error: { message: string } | null }>;
const callRpc = supabase.rpc as unknown as RpcClient;

const projectKey = (characterId: string) => ["craft-projects-m3", characterId];
const reservationKey = (characterId: string) => [
	"craft-reservations-m3",
	characterId,
];

function useCraftTransitionM3(
	fn: string,
	title: string,
	invalidate: () => void,
) {
	const { toast } = useToast();
	return useMutation({
		retry: 1,
		mutationFn: async (input: {
			projectId: string;
			expectedVersion: number;
			operationId: string;
		}) => {
			const { data, error } = await callRpc(fn, {
				p_project_id: input.projectId,
				p_expected_version: input.expectedVersion,
				p_operation_id: input.operationId,
			});
			if (error) throw new Error(error.message);
			return data as Record<string, unknown>;
		},
		onSuccess: (result) => {
			invalidate();
			toast({
				title: `${title}: ${String(result.status ?? "updated")}`,
				description:
					result.roll == null
						? undefined
						: `Roll ${result.roll} + ${Number(result.ability_modifier ?? 0) + Number(result.proficiency_bonus ?? 0)} = ${result.total} vs DC ${result.dc}`,
			});
		},
		onError: (error: Error) =>
			toast({
				title: `Could not ${title.toLowerCase()}`,
				description: error.message,
				variant: "destructive",
			}),
	});
}

export function useCraftProjectsM3(
	characterId: string | undefined,
	lotIds: string[],
) {
	const queryClient = useQueryClient();
	const { toast } = useToast();

	const formulasQuery = useQuery({
		queryKey: ["craft-formulas-m3"],
		queryFn: async (): Promise<CraftFormulaM3[]> => {
			const { data, error } = await supabase
				.from("craft_formulas_m3" as never)
				.select("*")
				.order("name");
			if (error) throw error;
			return (data ?? []) as unknown as CraftFormulaM3[];
		},
		enabled: !!characterId && isSupabaseConfigured,
		staleTime: 5 * 60 * 1000,
	});
	const projectsQuery = useQuery({
		queryKey: characterId
			? projectKey(characterId)
			: ["craft-projects-m3", "_none"],
		queryFn: async (): Promise<CraftProjectM3[]> => {
			if (!characterId) return [];
			const { data, error } = await supabase
				.from("craft_projects_m3" as never)
				.select("*")
				.eq("character_id", characterId)
				.order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as unknown as CraftProjectM3[];
		},
		enabled: !!characterId && isSupabaseConfigured,
	});
	const reservationsQuery = useQuery({
		queryKey: characterId
			? [...reservationKey(characterId), ...lotIds.toSorted()]
			: ["craft-reservations-m3", "_none"],
		queryFn: async (): Promise<CraftReservationM3[]> => {
			if (lotIds.length === 0) return [];
			const { data, error } = await supabase
				.from("material_lot_reservations" as never)
				.select("id, lot_id, quantity, status, reference_id")
				.in("lot_id", lotIds)
				.eq("status", "active");
			if (error) throw error;
			return (data ?? []).map((row) => {
				const reservation = row as unknown as CraftReservationM3;
				return { ...reservation, quantity: Number(reservation.quantity) };
			});
		},
		enabled: !!characterId && isSupabaseConfigured,
	});

	const invalidate = () => {
		if (!characterId) return;
		queryClient.invalidateQueries({ queryKey: projectKey(characterId) });
		queryClient.invalidateQueries({ queryKey: reservationKey(characterId) });
		queryClient.invalidateQueries({
			queryKey: ["material-lots-m1", characterId],
		});
		queryClient.invalidateQueries({
			queryKey: ["character-materials", characterId],
		});
	};
	const mutationError = (title: string) => (error: Error) =>
		toast({ title, description: error.message, variant: "destructive" });

	const reserve = useMutation({
		retry: 1,
		mutationFn: async (input: {
			formulaId: string;
			inputs: Array<{ lot_id: string; quantity: number }>;
			operationId: string;
		}) => {
			if (!characterId) throw new Error("Character is required.");
			const { data, error } = await callRpc("reserve_craft_project_m3", {
				p_character_id: characterId,
				p_formula_id: input.formulaId,
				p_inputs: input.inputs,
				p_operation_id: input.operationId,
			});
			if (error) throw new Error(error.message);
			return data;
		},
		onSuccess: () => {
			invalidate();
			toast({ title: "Materials reserved for project" });
		},
		onError: mutationError("Could not reserve materials"),
	});

	const work = useCraftTransitionM3(
		"work_craft_project_m3",
		"Project work",
		invalidate,
	);
	const resolve = useCraftTransitionM3(
		"resolve_craft_project_m3",
		"Project resolution",
		invalidate,
	);
	const cancel = useCraftTransitionM3(
		"cancel_craft_project_m3",
		"Project cancellation",
		invalidate,
	);

	return {
		formulas: formulasQuery.data ?? [],
		projects: projectsQuery.data ?? [],
		reservations: reservationsQuery.data ?? [],
		isLoading:
			formulasQuery.isLoading ||
			projectsQuery.isLoading ||
			reservationsQuery.isLoading,
		reserve,
		work,
		resolve,
		cancel,
	};
}
