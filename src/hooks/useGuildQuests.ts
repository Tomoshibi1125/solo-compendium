import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { shouldUseLocalGuildStore } from "@/hooks/useGuilds";
import { supabase } from "@/integrations/supabase/client";
import { guildAdminAction } from "@/lib/guildAdminAction";
import {
	acceptGuildQuestLocal,
	assignGuildQuestSquadLocal,
	type GuildQuest,
	type GuildQuestRank,
	listLocalGuildQuests,
	resolveGuildQuestLocal,
} from "@/lib/guildQuests";

export type { GuildQuest } from "@/lib/guildQuests";

/** A guild's quest board (active first, then resolved). */
export const useGuildQuests = (guildId: string | undefined) => {
	return useQuery({
		queryKey: ["guilds", guildId ?? "none", "quests"],
		queryFn: async (): Promise<GuildQuest[]> => {
			if (!guildId) return [];
			if (await shouldUseLocalGuildStore())
				return listLocalGuildQuests(guildId);
			const { data, error } = await supabase
				.from("guild_quests")
				.select("*")
				.eq("guild_id", guildId)
				.order("created_at", { ascending: false });
			if (error) throw error;
			return (data ?? []) as unknown as GuildQuest[];
		},
		enabled: !!guildId,
	});
};

/** Accept a (canon/generated) gate contract onto the guild's board. */
export const useAcceptGuildQuest = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (params: {
			guildId: string;
			sourceQuestId: string | null;
			title: string;
			rank: GuildQuestRank;
		}) => {
			if (await shouldUseLocalGuildStore()) {
				acceptGuildQuestLocal(params);
				return;
			}
			await guildAdminAction(params.guildId, "accept_quest", {
				source_quest_id: params.sourceQuestId,
				title: params.title,
				rank: params.rank,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "quests"],
			});
			toast({ title: "Contract accepted", description: "Added to the board." });
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to accept contract",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Assign the strike squad (member ids) to an active quest. */
export const useAssignQuestSquad = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (params: {
			guildId: string;
			questId: string;
			memberIds: string[];
		}) => {
			if (await shouldUseLocalGuildStore()) {
				assignGuildQuestSquadLocal({
					questId: params.questId,
					memberIds: params.memberIds,
				});
				return;
			}
			await guildAdminAction(params.guildId, "assign_quest_squad", {
				quest_id: params.questId,
				member_ids: params.memberIds,
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "quests"],
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to assign squad",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Resolve a quest success/fail (success credits the guild + advances NPCs). */
export const useResolveGuildQuest = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (params: {
			guildId: string;
			questId: string;
			success: boolean;
		}) => {
			if (await shouldUseLocalGuildStore()) {
				resolveGuildQuestLocal({
					questId: params.questId,
					success: params.success,
				});
				return;
			}
			const { error } = await supabase.rpc("resolve_guild_quest", {
				p_quest_id: params.questId,
				p_success: params.success,
			});
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "quests"],
			});
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "members"],
			});
			queryClient.invalidateQueries({ queryKey: ["guilds"] });
			toast({
				title: variables.success ? "Contract completed" : "Contract failed",
				description: variables.success
					? "Rewards credited to the guild."
					: "The contract was marked failed.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to resolve contract",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};
