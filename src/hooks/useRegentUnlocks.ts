import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { REGENT_LABEL } from "@/lib/vernacular";

export interface RegentUnlock {
	id: string;
	character_id: string;
	regent_id: string;
	unlocked_at: string;
	quest_name: string;
	dm_notes: string | null;
	is_primary: boolean;
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
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["regent-unlocks", characterId],
			});
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
			const { error } = await supabase
				.from("character_regent_unlocks")
				.delete()
				.eq("id", unlockId);

			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["regent-unlocks", characterId],
			});
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
			const { data, error } = await supabase
				.from("character_regent_unlocks")
				.update(updates)
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

	return {
		unlocks,
		isLoading,
		error,
		unlockRegent: unlockRegentMutation.mutate,
		removeUnlock: removeUnlockMutation.mutate,
		updateUnlock: updateUnlockMutation.mutate,
		isUnlocking: unlockRegentMutation.isPending,
		isRemoving: removeUnlockMutation.isPending,
		isUpdating: updateUnlockMutation.isPending,
	};
}

// Hook for Protocol Wardens to manage regent unlocks for their campaign characters
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

// Hook to get available regents for unlocking
export function useAvailableRegents(characterId: string) {
	const {
		data: availableRegents = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["available-regents", characterId],
		queryFn: async () => {
			// Get character's current unlocks
			const { data: currentUnlocks } = await supabase
				.from("character_regent_unlocks")
				.select("regent_id")
				.eq("character_id", characterId);

			const unlockedRegentIds = currentUnlocks?.map((u) => u.regent_id) || [];

			// Get all regents that aren't already unlocked
			const { data, error } = await supabase
				.from("compendium_regents")
				.select("*")
				.not("id", "in", `(${unlockedRegentIds.join(",")})`)
				.order("rank", { ascending: false })
				.order("name", { ascending: true });

			if (error) throw error;
			return data;
		},
		enabled: !!characterId,
	});

	return {
		availableRegents,
		isLoading,
		error,
	};
}
