import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
	type RegentUnlockGrant,
	useRegentUnlockGrants,
} from "@/hooks/useRegentUnlocks";
import { supabase } from "@/integrations/supabase/client";
import {
	type CanonicalRegentId,
	resolveCanonicalRegentId,
} from "@/lib/regentIdentity";
import { REGENT_LABEL } from "@/lib/vernacular";

export type RegentOffer = RegentUnlockGrant & {
	candidate_regent_ids: string[] | null;
	offer_version: number;
	configured_by: string | null;
	configured_at: string | null;
	request_id: string | null;
};

type RpcResult = Promise<{
	data: unknown;
	error: { message?: string } | null;
}>;

const callRpc = supabase.rpc as unknown as (
	name: string,
	args: Record<string, unknown>,
) => RpcResult;

function normalizeCandidates(values: readonly string[]): CanonicalRegentId[] {
	const resolved = values.flatMap((value) => {
		const canonical = resolveCanonicalRegentId(value);
		return canonical ? [canonical] : [];
	});
	if (resolved.length !== 3 || new Set(resolved).size !== 3) {
		throw new Error("A Regent offer requires exactly three distinct canonical Regents.");
	}
	return resolved;
}

export function getStoredRegentOfferCandidates(
	offer: RegentOffer | null | undefined,
): CanonicalRegentId[] | null {
	if (!offer?.candidate_regent_ids) return null;
	try {
		return normalizeCandidates(offer.candidate_regent_ids);
	} catch {
		return null;
	}
}

export function useRegentOffers(characterId: string) {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const legacy = useRegentUnlockGrants(characterId);
	const offers = legacy.grants as RegentOffer[];

	const invalidate = async () => {
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: ["regent-unlock-grants", characterId],
			}),
			queryClient.invalidateQueries({
				queryKey: ["campaign-regent-unlock-grants"],
			}),
		]);
	};

	const createMutation = useMutation({
		mutationFn: async ({
			questId,
			questTitle,
			candidateRegentIds,
			requestId,
		}: {
			questId?: string | null;
			questTitle: string;
			candidateRegentIds: readonly string[];
			requestId: string;
		}) => {
			const candidates = normalizeCandidates(candidateRegentIds);
			const { data, error } = await callRpc("create_regent_unlock_offer", {
				p_character_id: characterId,
				p_quest_id: questId ?? null,
				p_quest_title: questTitle,
				p_candidate_regent_ids: candidates,
				p_request_id: requestId,
			});
			if (error) throw new Error(error.message || "Failed to create Regent offer.");
			if (typeof data !== "string" || !data) {
				throw new Error("The server did not return a Regent offer identity.");
			}
			return data;
		},
		onSuccess: async () => {
			await invalidate();
			toast({
				title: `${REGENT_LABEL} Offer Created`,
				description: "The player can choose one of the three stored Regents.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to Create Offer",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const configureMutation = useMutation({
		mutationFn: async ({
			grantId,
			candidateRegentIds,
		}: {
			grantId: string;
			candidateRegentIds: readonly string[];
		}) => {
			const candidates = normalizeCandidates(candidateRegentIds);
			const { data, error } = await callRpc("configure_regent_unlock_offer", {
				p_grant_id: grantId,
				p_candidate_regent_ids: candidates,
			});
			if (error) throw new Error(error.message || "Failed to configure Regent offer.");
			if (typeof data !== "number") {
				throw new Error("The server did not return an offer version.");
			}
			return data;
		},
		onSuccess: async () => {
			await invalidate();
			toast({
				title: `${REGENT_LABEL} Offer Updated`,
				description: "The pending three-Regent offer is now authoritative.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to Configure Offer",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const revokeMutation = useMutation({
		mutationFn: async (grantId: string) => {
			const { data, error } = await callRpc("revoke_regent_unlock_offer", {
				p_grant_id: grantId,
			});
			if (error) throw new Error(error.message || "Failed to revoke Regent offer.");
			if (data !== grantId) {
				throw new Error("The server did not confirm Regent offer revocation.");
			}
			return grantId;
		},
		onSuccess: async () => {
			await invalidate();
			toast({
				title: `${REGENT_LABEL} Offer Revoked`,
				description: "The pending offer has been removed.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to Revoke Offer",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	return {
		offers,
		availableOffers: offers.length,
		isLoading: legacy.isLoading,
		error: legacy.error,
		createOfferAsync: createMutation.mutateAsync,
		isCreating: createMutation.isPending,
		configureOfferAsync: configureMutation.mutateAsync,
		isConfiguring: configureMutation.isPending,
		revokeOfferAsync: revokeMutation.mutateAsync,
		isRevoking: revokeMutation.isPending,
	};
}
