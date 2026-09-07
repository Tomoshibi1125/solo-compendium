import {
	type QueryClient,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { regents } from "@/data/compendium/regents";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { isLocalCharacterId } from "@/lib/guestStore";
import { clientChannelName } from "@/lib/realtimeChannel";
import {
	type CanonicalRegentId,
	resolveCanonicalRegentId,
} from "@/lib/regentIdentity";
import type { Regent } from "@/lib/regentTypes";
import { REGENT_LABEL } from "@/lib/vernacular";

type RegentUnlockRow =
	Database["public"]["Tables"]["character_regent_unlocks"]["Row"];
type RegentUnlockGrantRow =
	Database["public"]["Tables"]["character_regent_unlock_grants"]["Row"];

export type RegentIdentityIssue =
	| "legacy_uuid"
	| "unsupported_regent_id"
	| "missing_static_regent"
	| "missing_identity";

export type RegentUnlock = RegentUnlockRow & {
	/** The strict canonical identity used by all actionable client workflows. */
	resolved_regent_id: CanonicalRegentId | null;
	/** Canonical static metadata only; unresolved legacy rows intentionally stay null. */
	regent: Regent | null;
	identity_issue: RegentIdentityIssue | null;
	character?: {
		id: string;
		name: string;
	};
};

export type RegentUnlockGrant = RegentUnlockGrantRow;

const REGENTS_BY_ID = new Map(regents.map((regent) => [regent.id, regent]));

/**
 * Hydrate a flat unlock row without using the retired compendium relationship.
 * `legacy_regent_uuid` is preserved for Task 19 reconciliation, but is never
 * interpreted as a name/slug/canonical identity by the Task 8 client.
 */
export function hydrateRegentUnlock(
	row: RegentUnlockRow,
	character?: { id: string; name: string },
): RegentUnlock {
	const resolvedId = resolveCanonicalRegentId(row.regent_id);
	const regent = resolvedId ? (REGENTS_BY_ID.get(resolvedId) ?? null) : null;
	const canonicalId = regent ? resolvedId : null;

	let identityIssue: RegentIdentityIssue | null = null;
	if (!regent) {
		if (row.regent_id && resolvedId) identityIssue = "missing_static_regent";
		else if (row.regent_id) identityIssue = "unsupported_regent_id";
		else if (row.legacy_regent_uuid) identityIssue = "legacy_uuid";
		else identityIssue = "missing_identity";
	}

	return {
		...row,
		resolved_regent_id: canonicalId,
		regent,
		identity_issue: identityIssue,
		...(character ? { character } : {}),
	};
}

function isRemoteId(id: string): boolean {
	return id.length > 0 && !isLocalCharacterId(id);
}

function assertRemoteCharacter(characterId: string): void {
	if (!isRemoteId(characterId)) {
		throw new Error(
			`${REGENT_LABEL} unlocks are unavailable for local characters.`,
		);
	}
}

async function invalidateCharacterRegentWorkflow(
	queryClient: QueryClient,
	characterId: string,
): Promise<void> {
	await Promise.all([
		queryClient.invalidateQueries({
			queryKey: ["regent-unlocks", characterId],
		}),
		queryClient.invalidateQueries({
			queryKey: ["regent-unlock-grants", characterId],
		}),
		queryClient.invalidateQueries({ queryKey: ["character", characterId] }),
		queryClient.invalidateQueries({ queryKey: ["characters"] }),
		queryClient.invalidateQueries({
			queryKey: ["character-features", characterId],
		}),
		queryClient.invalidateQueries({ queryKey: ["features", characterId] }),
		queryClient.invalidateQueries({ queryKey: ["powers", characterId] }),
		queryClient.invalidateQueries({
			queryKey: ["character-techniques", characterId],
		}),
		queryClient.invalidateQueries({
			queryKey: ["character-spells", characterId],
		}),
		queryClient.invalidateQueries({
			queryKey: ["campaign-regent-unlocks"],
		}),
		queryClient.invalidateQueries({
			queryKey: ["campaign-regent-unlock-grants"],
		}),
	]);
}

async function fetchUnlockById(
	unlockId: string,
	characterId: string,
): Promise<RegentUnlock> {
	const { data, error } = await supabase
		.from("character_regent_unlocks")
		.select("*")
		.eq("id", unlockId)
		.eq("character_id", characterId)
		.single();
	if (error) throw error;
	if (!data) throw new Error("The consumed Regent unlock could not be loaded.");
	return hydrateRegentUnlock(data);
}

export function useRegentUnlocks(characterId: string) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const remoteCharacter = isRemoteId(characterId);

	const {
		data: unlocks = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["regent-unlocks", characterId],
		queryFn: async (): Promise<RegentUnlock[]> => {
			if (!remoteCharacter) return [];
			const { data, error: queryError } = await supabase
				.from("character_regent_unlocks")
				.select("*")
				.eq("character_id", characterId)
				.order("unlocked_at", { ascending: false });
			if (queryError) throw queryError;
			return (data ?? []).map((row) => hydrateRegentUnlock(row));
		},
		enabled: remoteCharacter,
	});

	useEffect(() => {
		if (!remoteCharacter) return;
		const channel = supabase
			.channel(clientChannelName(`regent-unlocks-${characterId}`))
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "character_regent_unlocks",
					filter: `character_id=eq.${characterId}`,
				},
				() => {
					queryClient.invalidateQueries({
						queryKey: ["regent-unlocks", characterId],
					});
				},
			)
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [characterId, queryClient, remoteCharacter]);

	const consumeGrantMutation = useMutation({
		mutationFn: async ({
			grantId,
			regentId,
		}: {
			grantId: string;
			regentId: string;
		}): Promise<RegentUnlock> => {
			assertRemoteCharacter(characterId);
			const canonicalId = resolveCanonicalRegentId(regentId);
			if (!canonicalId) {
				throw new Error("Choose a supported canonical Regent identity.");
			}
			const { data: unlockId, error: consumeError } = await supabase.rpc(
				"consume_regent_unlock_grant",
				{
					p_grant_id: grantId,
					p_regent_id: canonicalId,
				},
			);
			if (consumeError) throw consumeError;
			if (typeof unlockId !== "string" || !unlockId) {
				throw new Error("The Regent grant did not return an unlock identity.");
			}

			const unlock = await fetchUnlockById(unlockId, characterId);
			if (unlock.resolved_regent_id !== canonicalId) {
				throw new Error(
					"The consumed unlock did not resolve to the selected canonical Regent.",
				);
			}
			return unlock;
		},
		onSuccess: async () => {
			await invalidateCharacterRegentWorkflow(queryClient, characterId);
			toast({
				title: `${REGENT_LABEL} Attuned`,
				description: "Your chosen regent has awakened.",
			});
		},
		onError: (mutationError: Error) => {
			toast({
				title: "Failed to Attune",
				description:
					mutationError.message ||
					"An error occurred while attuning the regent.",
				variant: "destructive",
			});
		},
	});

	const setPrimaryMutation = useMutation({
		mutationFn: async (unlockId: string): Promise<string> => {
			assertRemoteCharacter(characterId);
			const { data, error: rpcError } = await supabase.rpc(
				"set_primary_regent_unlock",
				{ p_unlock_id: unlockId },
			);
			if (rpcError) throw rpcError;
			if (data !== unlockId) {
				throw new Error(
					"The server did not confirm the primary Regent unlock.",
				);
			}
			return data;
		},
		onSuccess: async () => {
			await invalidateCharacterRegentWorkflow(queryClient, characterId);
			toast({
				title: "Primary Regent Updated",
				description: "The primary regent has been updated.",
			});
		},
		onError: (mutationError: Error) => {
			toast({
				title: "Failed to Set Primary",
				description:
					mutationError.message || "The primary regent could not be updated.",
				variant: "destructive",
			});
		},
	});

	return {
		unlocks,
		isLoading,
		error,
		consumeGrantAsync: consumeGrantMutation.mutateAsync,
		isConsuming: consumeGrantMutation.isPending,
		setPrimary: setPrimaryMutation.mutate,
		setPrimaryAsync: setPrimaryMutation.mutateAsync,
		isSettingPrimary: setPrimaryMutation.isPending,
	};
}

export interface CampaignRegentRosterEntry {
	character_id: string;
	characters?: { id: string; name: string } | null;
}

function getCampaignRosterDetails(
	roster: readonly CampaignRegentRosterEntry[],
): {
	characterIds: string[];
	characterById: Map<string, { id: string; name: string }>;
} {
	const characterIds = Array.from(
		new Set(
			roster
				.map((entry) => entry.character_id)
				.filter((characterId) => isRemoteId(characterId)),
		),
	).sort();
	const allowedIds = new Set(characterIds);
	const characterById = new Map<string, { id: string; name: string }>();
	for (const entry of roster) {
		if (allowedIds.has(entry.character_id) && entry.characters) {
			characterById.set(entry.character_id, entry.characters);
		}
	}
	return { characterIds, characterById };
}

// Hook for Wardens to view Regent unlocks for the exact authoritative roster
// already rendered by CampaignRegentOversight: campaign_character_shares.
export function useCampaignRegentUnlocks(
	campaignId: string,
	roster: readonly CampaignRegentRosterEntry[],
) {
	const remoteCampaign = isRemoteId(campaignId);
	const { characterIds, characterById } = getCampaignRosterDetails(roster);
	const rosterKey = characterIds.join(",");

	const unlockQuery = useQuery<RegentUnlockRow[]>({
		queryKey: ["campaign-regent-unlocks", campaignId, rosterKey],
		queryFn: async () => {
			if (!remoteCampaign || characterIds.length === 0) return [];
			const { data, error } = await supabase
				.from("character_regent_unlocks")
				.select("*")
				.in("character_id", characterIds)
				.order("unlocked_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		},
		enabled: remoteCampaign && characterIds.length > 0,
	});

	return {
		campaignUnlocks: (unlockQuery.data ?? []).map((row) =>
			hydrateRegentUnlock(row, characterById.get(row.character_id)),
		),
		isLoading: unlockQuery.isLoading,
		error: unlockQuery.error,
	};
}

// Warden view: all unspent Regent-unlock credits for the rendered shared roster.
export function useCampaignRegentUnlockGrants(
	campaignId: string,
	roster: readonly CampaignRegentRosterEntry[],
) {
	const remoteCampaign = isRemoteId(campaignId);
	const { characterIds } = getCampaignRosterDetails(roster);
	const rosterKey = characterIds.join(",");

	const grantsQuery = useQuery({
		queryKey: ["campaign-regent-unlock-grants", campaignId, rosterKey],
		queryFn: async (): Promise<RegentUnlockGrant[]> => {
			if (!remoteCampaign || characterIds.length === 0) return [];
			const { data, error } = await supabase
				.from("character_regent_unlock_grants")
				.select("*")
				.in("character_id", characterIds)
				.is("consumed_at", null)
				.order("granted_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		},
		enabled: remoteCampaign && characterIds.length > 0,
	});

	return {
		campaignGrants: grantsQuery.data ?? [],
		isLoading: grantsQuery.isLoading,
		error: grantsQuery.error,
	};
}

/** Warden-only, actor-bound removal. Character ID is an invalidation target. */
export function useRemoveRegentUnlock() {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async ({
			unlockId,
			characterId,
		}: {
			unlockId: string;
			characterId: string;
		}): Promise<string> => {
			assertRemoteCharacter(characterId);
			const { data, error } = await supabase.rpc("remove_regent_unlock", {
				p_unlock_id: unlockId,
			});
			if (error) throw error;
			if (data !== unlockId) {
				throw new Error("The server did not confirm Regent unlock removal.");
			}
			return data;
		},
		onSuccess: async (_, variables) => {
			await invalidateCharacterRegentWorkflow(
				queryClient,
				variables.characterId,
			);
			toast({
				title: "Unlock Removed",
				description: "The regent unlock has been removed.",
			});
		},
		onError: (mutationError: Error) => {
			toast({
				title: "Failed to Remove",
				description:
					mutationError.message || "The Regent unlock could not be removed.",
				variant: "destructive",
			});
		},
	});

	return {
		removeUnlock: mutation.mutate,
		removeUnlockAsync: mutation.mutateAsync,
		isRemoving: mutation.isPending,
	};
}

/**
 * Warden-granted Regent-unlock opportunities (credits) for a character. Direct
 * insert/delete remains intentionally permitted by Task 8 RLS; consuming a
 * credit is handled only by consume_regent_unlock_grant above.
 */
export function useRegentUnlockGrants(characterId: string) {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const remoteCharacter = isRemoteId(characterId);

	const {
		data: grants = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["regent-unlock-grants", characterId],
		queryFn: async (): Promise<RegentUnlockGrant[]> => {
			if (!remoteCharacter) return [];
			const { data, error: queryError } = await supabase
				.from("character_regent_unlock_grants")
				.select("*")
				.eq("character_id", characterId)
				.is("consumed_at", null)
				.order("granted_at", { ascending: false });
			if (queryError) throw queryError;
			return data ?? [];
		},
		enabled: remoteCharacter,
	});

	useEffect(() => {
		if (!remoteCharacter) return;
		const channel = supabase
			.channel(clientChannelName(`regent-unlock-grants-${characterId}`))
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "character_regent_unlock_grants",
					filter: `character_id=eq.${characterId}`,
				},
				() => {
					queryClient.invalidateQueries({
						queryKey: ["regent-unlock-grants", characterId],
					});
				},
			)
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [characterId, queryClient, remoteCharacter]);

	const grantMutation = useMutation({
		mutationFn: async ({
			questId,
			questTitle,
		}: {
			questId?: string | null;
			questTitle: string;
		}) => {
			assertRemoteCharacter(characterId);
			const { data: authData, error: authError } =
				await supabase.auth.getUser();
			if (authError) throw authError;
			const { data, error: insertError } = await supabase
				.from("character_regent_unlock_grants")
				.insert({
					character_id: characterId,
					quest_id: questId ?? null,
					quest_title: questTitle,
					granted_by: authData.user?.id ?? null,
				})
				.select()
				.single();
			if (insertError) throw insertError;
			return data;
		},
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: ["regent-unlock-grants", characterId],
				}),
				queryClient.invalidateQueries({
					queryKey: ["campaign-regent-unlock-grants"],
				}),
			]);
			toast({
				title: "Regent Quest Completed",
				description: `The character may now attune a ${REGENT_LABEL}.`,
			});
		},
		onError: (mutationError: Error) => {
			toast({
				title: "Failed to Grant",
				description:
					mutationError.message ||
					"An error occurred while granting the unlock.",
				variant: "destructive",
			});
		},
	});

	return {
		grants,
		availableCredits: grants.length,
		isLoading,
		error,
		grantRegentUnlockAsync: grantMutation.mutateAsync,
		isGranting: grantMutation.isPending,
	};
}
