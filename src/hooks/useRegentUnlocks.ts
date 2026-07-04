import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isLocalCharacterId } from "@/lib/guestStore";
import { clientChannelName } from "@/lib/realtimeChannel";
import { REGENT_LABEL } from "@/lib/vernacular";

export interface RegentUnlock {
	id: string;
	character_id: string;
	regent_id: string;
	unlocked_at: string;
	quest_name: string;
	dm_notes: string | null;
	is_primary: boolean;
	caught_up_at_level: number | null;
	character?: {
		id: string;
		name: string;
	};
	regent?: {
		id: string;
		name: string;
		title: string;
		theme: string;
		description: string;
		image?: string;
		tags?: string[];
	};
}

/**
 * Bridge the canonical unlock (`character_regent_unlocks.regent_id`, e.g.
 * "umbral_regent") into `characters.regent_overlays` — the field the level-up
 * wizard's regent choice sources + ability grants and the Add* dialogs read.
 * Without this, a Warden-granted unlock would never surface regent picks.
 */
async function appendRegentOverlay(characterId: string, regentId: string) {
	const { data: char } = await supabase
		.from("characters")
		.select("regent_overlays")
		.eq("id", characterId)
		.single();
	const current = Array.isArray(char?.regent_overlays)
		? (char.regent_overlays as string[])
		: [];
	if (current.includes(regentId)) return;
	await supabase
		.from("characters")
		.update({ regent_overlays: [...current, regentId] })
		.eq("id", characterId);
}

async function removeRegentOverlay(characterId: string, regentId: string) {
	const { data: char } = await supabase
		.from("characters")
		.select("regent_overlays")
		.eq("id", characterId)
		.single();
	const current = Array.isArray(char?.regent_overlays)
		? (char.regent_overlays as string[])
		: [];
	if (!current.includes(regentId)) return;
	await supabase
		.from("characters")
		.update({ regent_overlays: current.filter((id) => id !== regentId) })
		.eq("id", characterId);
}

export function useRegentUnlocks(characterId: string) {
	const { toast } = useToast();

	const queryClient = useQueryClient();
	const {
		data: unlocks = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["regent-unlocks", characterId],
		queryFn: async () => {
			// Regent unlocks are Warden-granted (cloud campaigns only). Guest
			// characters can't receive them — return empty instead of hitting
			// the server with a `local_` id (400 + retry spam).
			if (isLocalCharacterId(characterId)) return [] as RegentUnlock[];
			const { data, error } = await supabase
				.from("character_regent_unlocks")
				.select(`
          *,
          regent:compendium_regents(
            id,
            name,
            title,
            theme,
            description,
            rank,
            image,
            tags
          )
        `)
				.eq("character_id", characterId)
				.order("unlocked_at", { ascending: false });

			if (error) throw error;
			return JSON.parse(JSON.stringify(data)) as RegentUnlock[];
		},
		enabled: !!characterId,
	});

	// Realtime: when a Warden unlocks a regent for this character, it must appear
	// on the player's open sheet without a refresh. character_regent_unlocks is
	// added to the supabase_realtime publication in migration 20260627*.
	useEffect(() => {
		if (!characterId || isLocalCharacterId(characterId)) return;
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
	}, [characterId, queryClient]);

	const unlockRegentMutation = useMutation({
		mutationFn: async ({
			regentId,
			questName,
			dmNotes,
			isPrimary = false,
		}: {
			regentId: string;
			questName: string;
			dmNotes?: string;
			isPrimary?: boolean;
		}) => {
			const { data, error } = await supabase
				.from("character_regent_unlocks")
				.insert({
					character_id: characterId,
					regent_id: regentId,
					quest_name: questName,
					dm_notes: dmNotes || null,
					is_primary: isPrimary,
				})
				.select()
				.single();

			if (error) throw error;
			// Bridge into regent_overlays so the level-up wizard + Add* dialogs see it.
			await appendRegentOverlay(characterId, regentId);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["regent-unlocks", characterId],
			});
			queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			queryClient.invalidateQueries({ queryKey: ["characters"] });
			toast({
				title: `${REGENT_LABEL} Unlocked`,
				description: "The regent has been successfully unlocked.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to Unlock",
				description:
					error.message || "An error occurred while unlocking the regent.",
				variant: "destructive",
			});
		},
	});

	const removeUnlockMutation = useMutation({
		mutationFn: async (unlockId: string) => {
			// Read the regent_id first so we can also drop it from regent_overlays.
			const { data: row } = await supabase
				.from("character_regent_unlocks")
				.select("regent_id")
				.eq("id", unlockId)
				.single();

			const { error } = await supabase
				.from("character_regent_unlocks")
				.delete()
				.eq("id", unlockId);

			if (error) throw error;
			if (row?.regent_id) {
				await removeRegentOverlay(characterId, row.regent_id);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["regent-unlocks", characterId],
			});
			queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			queryClient.invalidateQueries({ queryKey: ["characters"] });
			toast({
				title: "Unlock Removed",
				description: "The regent unlock has been removed.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to Remove",
				description:
					error.message || "An error occurred while removing the unlock.",
				variant: "destructive",
			});
		},
	});

	const updateUnlockMutation = useMutation({
		mutationFn: async ({
			unlockId,
			updates,
		}: {
			unlockId: string;
			updates: Partial<RegentUnlock>;
		}) => {
			// `regent`/`character` are client-side joins, not columns — the typed
			// client rejects them as excess properties on update.
			const {
				regent: _regent,
				character: _character,
				...columnUpdates
			} = updates;
			const { data, error } = await supabase
				.from("character_regent_unlocks")
				.update(columnUpdates)
				.eq("id", unlockId)
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["regent-unlocks", characterId],
			});
			toast({
				title: "Unlock Updated",
				description: "The regent unlock has been updated.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to Update",
				description:
					error.message || "An error occurred while updating the unlock.",
				variant: "destructive",
			});
		},
	});

	// Player spends a Warden-granted opportunity: pick a Regent (from three
	// stat-ranked candidates), create the unlock, bridge the overlay, and mark
	// the grant consumed. The grant credit is what gates this — players cannot
	// self-unlock without one (enforced by RLS on the grants table too).
	const consumeGrantMutation = useMutation({
		mutationFn: async ({
			grantId,
			regentId,
			questTitle,
			isPrimary = false,
		}: {
			grantId: string;
			regentId: string;
			questTitle: string;
			isPrimary?: boolean;
		}) => {
			const { data: unlock, error: unlockError } = await supabase
				.from("character_regent_unlocks")
				.insert({
					character_id: characterId,
					regent_id: regentId,
					quest_name: questTitle,
					is_primary: isPrimary,
				})
				.select()
				.single();
			if (unlockError) throw unlockError;

			await appendRegentOverlay(characterId, regentId);

			const { error: grantError } = await supabase
				.from("character_regent_unlock_grants")
				.update({
					consumed_at: new Date().toISOString(),
					consumed_unlock_id: unlock.id,
				})
				.eq("id", grantId);
			if (grantError) throw grantError;

			return unlock;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["regent-unlocks", characterId],
			});
			queryClient.invalidateQueries({
				queryKey: ["regent-unlock-grants", characterId],
			});
			queryClient.invalidateQueries({ queryKey: ["character", characterId] });
			queryClient.invalidateQueries({ queryKey: ["characters"] });
			toast({
				title: `${REGENT_LABEL} Attuned`,
				description: "Your chosen regent has awakened.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to Attune",
				description:
					error.message || "An error occurred while attuning the regent.",
				variant: "destructive",
			});
		},
	});

	return {
		unlocks,
		isLoading,
		error,
		unlockRegent: unlockRegentMutation.mutate,
		removeUnlock: removeUnlockMutation.mutate,
		updateUnlock: updateUnlockMutation.mutate,
		consumeGrant: consumeGrantMutation.mutate,
		consumeGrantAsync: consumeGrantMutation.mutateAsync,
		isUnlocking: unlockRegentMutation.isPending,
		isRemoving: removeUnlockMutation.isPending,
		isUpdating: updateUnlockMutation.isPending,
		isConsuming: consumeGrantMutation.isPending,
	};
}

// Hook for Wardens to manage regent unlocks for their campaign characters
export function useCampaignRegentUnlocks(campaignId: string) {
	const {
		data: campaignUnlocks = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["campaign-regent-unlocks", campaignId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("character_regent_unlocks")
				.select(`
          *,
          character:characters(id, name),
          regent:compendium_regents(
            id,
            name,
            title,
            theme,
            description,
            rank,
            image,
            tags
          )
        `)
				.filter(
					"character_id",
					"in",
					`(select id from characters where campaign_id = '${campaignId}')`,
				)
				.order("unlocked_at", { ascending: false });

			if (error) throw error;
			return JSON.parse(JSON.stringify(data || [])) as RegentUnlock[];
		},
		enabled: !!campaignId,
	});

	return {
		campaignUnlocks,
		isLoading,
		error,
	};
}

// Warden view: all UNSPENT regent-unlock credits across a campaign's characters.
export function useCampaignRegentUnlockGrants(campaignId: string) {
	const { data: campaignGrants = [], isLoading } = useQuery({
		queryKey: ["campaign-regent-unlock-grants", campaignId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("character_regent_unlock_grants")
				.select("*")
				.is("consumed_at", null)
				.filter(
					"character_id",
					"in",
					`(select id from characters where campaign_id = '${campaignId}')`,
				)
				.order("granted_at", { ascending: false });
			if (error) throw error;
			return JSON.parse(JSON.stringify(data || [])) as RegentUnlockGrant[];
		},
		enabled: !!campaignId,
	});

	return { campaignGrants, isLoading };
}

export interface RegentUnlockGrant {
	id: string;
	character_id: string;
	quest_id: string | null;
	quest_title: string;
	granted_by: string | null;
	granted_at: string;
	consumed_at: string | null;
	consumed_unlock_id: string | null;
}

/**
 * Warden-granted Regent-unlock opportunities ("credits") for a character.
 *
 * A regent unlocks only when the Warden confirms a generic regent-tagged quest
 * is complete: `grantRegentUnlock` inserts a credit (Warden-only, enforced by
 * RLS). The player then spends it via `useRegentUnlocks().consumeGrant`, picking
 * one of three stat-ranked regents. `grants` is the list of UNSPENT credits.
 */
export function useRegentUnlockGrants(characterId: string) {
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const { data: grants = [], isLoading } = useQuery({
		queryKey: ["regent-unlock-grants", characterId],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("character_regent_unlock_grants")
				.select("*")
				.eq("character_id", characterId)
				.is("consumed_at", null)
				.order("granted_at", { ascending: false });
			if (error) throw error;
			return JSON.parse(JSON.stringify(data || [])) as RegentUnlockGrant[];
		},
		enabled: !!characterId,
	});

	// Realtime: a Warden grant must appear on the player's open sheet without a
	// refresh (grants table is in the supabase_realtime publication).
	useEffect(() => {
		if (!characterId) return;
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
	}, [characterId, queryClient]);

	const grantMutation = useMutation({
		mutationFn: async ({
			questId,
			questTitle,
		}: {
			questId?: string | null;
			questTitle: string;
		}) => {
			const { data: authData } = await supabase.auth.getUser();
			const { data, error } = await supabase
				.from("character_regent_unlock_grants")
				.insert({
					character_id: characterId,
					quest_id: questId ?? null,
					quest_title: questTitle,
					granted_by: authData?.user?.id ?? null,
				})
				.select()
				.single();
			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["regent-unlock-grants", characterId],
			});
			toast({
				title: "Regent Quest Completed",
				description: `The character may now attune a ${REGENT_LABEL}.`,
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to Grant",
				description:
					error.message || "An error occurred while granting the unlock.",
				variant: "destructive",
			});
		},
	});

	const rescindMutation = useMutation({
		mutationFn: async (grantId: string) => {
			const { error } = await supabase
				.from("character_regent_unlock_grants")
				.delete()
				.eq("id", grantId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["regent-unlock-grants", characterId],
			});
		},
	});

	return {
		grants,
		availableCredits: grants.length,
		isLoading,
		grantRegentUnlock: grantMutation.mutate,
		grantRegentUnlockAsync: grantMutation.mutateAsync,
		isGranting: grantMutation.isPending,
		rescindGrant: rescindMutation.mutate,
	};
}
