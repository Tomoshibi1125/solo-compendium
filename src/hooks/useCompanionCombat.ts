import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RpcError {
	message: string;
}

type RpcClient = (
	fn: string,
	args: Record<string, unknown>,
) => Promise<{ data: unknown; error: RpcError | null }>;

const callRpc: RpcClient = supabase.rpc as unknown as RpcClient;

function invalidateCombat(
	queryClient: ReturnType<typeof useQueryClient>,
	campaignId?: string | null,
) {
	if (campaignId) {
		queryClient.invalidateQueries({
			queryKey: ["campaigns", campaignId, "combat-session"],
		});
	}
	queryClient.invalidateQueries({ queryKey: ["companion-instances"] });
}

export function useAddCompanionToCombat() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			campaignId: string;
			sessionId: string;
			companionInstanceId: string;
			initiative?: number | null;
			initiativeMode?: "independent" | "linked" | null;
			anchorCharacterId?: string | null;
		}) => {
			const { data, error } = await callRpc("add_companion_to_combat", {
				p_session_id: input.sessionId,
				p_companion_instance_id: input.companionInstanceId,
				p_initiative: input.initiative ?? null,
				p_initiative_mode: input.initiativeMode ?? null,
				p_anchor_character_id: input.anchorCharacterId ?? null,
			});
			if (error) throw new Error(error.message);
			if (typeof data !== "string" || !data) {
				throw new Error("Companion combat link did not return an actor id.");
			}
			return data;
		},
		onSuccess: (_, variables) => {
			invalidateCombat(queryClient, variables.campaignId);
			toast({ title: "Companion linked to combat" });
		},
		onError: (error: Error) => {
			toast({
				title: "Could not link companion",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useRestCompanions() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			characterId: string;
			restKind: "short" | "long";
		}) => {
			const { data, error } = await callRpc("rest_companions_for_character", {
				p_character_id: input.characterId,
				p_rest_kind: input.restKind,
			});
			if (error) throw new Error(error.message);
			return typeof data === "number" ? data : Number(data ?? 0);
		},
		onSuccess: (count, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["character-companion-instances", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character_extras", variables.characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["character-vehicles", variables.characterId],
			});
			toast({
				title: "Companion rest resolved",
				description:
					count > 0
						? `${count} companion profile${count === 1 ? "" : "s"} applied.`
						: "No authored companion rest rules applied.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Companion rest failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useSetCompanionRider() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (input: {
			companionInstanceId: string;
			riderCharacterId: string;
			riderSize?: string | null;
			terrain?: string | null;
			hasTack?: boolean | null;
			isTrained?: boolean | null;
		}) => {
			const { error } = await callRpc("set_companion_rider", {
				p_companion_instance_id: input.companionInstanceId,
				p_rider_character_id: input.riderCharacterId,
				p_rider_size: input.riderSize ?? null,
				p_terrain: input.terrain ?? null,
				p_has_tack: input.hasTack ?? null,
				p_is_trained: input.isTrained ?? null,
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["companion-instances"] });
			toast({ title: "Rider assigned" });
		},
		onError: (error: Error) => {
			toast({
				title: "Rider assignment rejected",
				description: error.message,
				variant: "destructive",
			});
		},
	});
}

export function useClearCompanionRider() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (companionInstanceId: string) => {
			const { error } = await callRpc("clear_companion_rider", {
				p_companion_instance_id: companionInstanceId,
			});
			if (error) throw new Error(error.message);
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["companion-instances"] }),
	});
}
