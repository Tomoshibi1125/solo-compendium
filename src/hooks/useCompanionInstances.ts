import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { CompanionInstanceRecord } from "@/lib/companionInstances";

const INSTANCE_KEY = (id: string) => ["companion-instance", id] as const;
const CHARACTER_KEY = (id: string) => ["character-companion-instances", id] as const;

const typedRow = (value: unknown): CompanionInstanceRecord =>
	value as CompanionInstanceRecord;

export function useCompanionInstance(instanceId: string | null | undefined) {
	return useQuery({
		queryKey: INSTANCE_KEY(instanceId ?? "_none"),
		enabled: !!instanceId && isSupabaseConfigured,
		queryFn: async (): Promise<CompanionInstanceRecord | null> => {
			if (!instanceId || !isSupabaseConfigured) return null;
			const { data, error } = await supabase
				.from("companion_instances" as never)
				.select("*")
				.eq("id", instanceId)
				.maybeSingle();
			if (error) throw error;
			return data ? typedRow(data) : null;
		},
	});
}

export function useCharacterCompanionInstances(characterId: string | undefined) {
	return useQuery({
		queryKey: CHARACTER_KEY(characterId ?? "_none"),
		enabled: !!characterId && isSupabaseConfigured,
		queryFn: async (): Promise<CompanionInstanceRecord[]> => {
			if (!characterId || !isSupabaseConfigured) return [];
			const filter = [
				`owner_character_id.eq.${characterId}`,
				`primary_handler_character_id.eq.${characterId}`,
				`combat_controller_character_id.eq.${characterId}`,
				`rider_character_id.eq.${characterId}`,
			].join(",");
			const { data, error } = await supabase
				.from("companion_instances" as never)
				.select("*")
				.or(filter)
				.order("created_at", { ascending: true });
			if (error) throw error;
			return (data ?? []).map(typedRow);
		},
	});
}

export function useRegisterCharacterVehicleMount() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			vehicleLinkId: string;
			sourceSnapshot: Json;
		}): Promise<string> => {
			if (!isSupabaseConfigured) throw new Error("Backend not configured.");
			const { data, error } = await (
				supabase.rpc as unknown as (
					fn: string,
					args: Record<string, unknown>,
				) => Promise<{ data: unknown; error: { message: string } | null }>
			)("register_character_vehicle_mount", {
				p_vehicle_link_id: input.vehicleLinkId,
				p_source_snapshot: input.sourceSnapshot,
			});
			if (error) throw new Error(error.message);
			if (typeof data !== "string" || data.length === 0) {
				throw new Error("Mount registration did not return a companion identity.");
			}
			return data;
		},
		onSuccess: (instanceId, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-vehicles", variables.characterId],
			});
			queryClient.invalidateQueries({ queryKey: CHARACTER_KEY(variables.characterId) });
			queryClient.invalidateQueries({ queryKey: INSTANCE_KEY(instanceId) });
		},
		onError: (error: Error) => {
			toast({
				title: "Mount identity could not be registered",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}
