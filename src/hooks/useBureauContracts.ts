import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import {
	acceptBureauContractLocal,
	type BureauContract,
	type BureauContractKind,
	closeBureauContractLocal,
	loadLocalBureauContracts,
	publishBureauContractLocal,
} from "@/lib/bureauContracts";
import { getLocalUserId } from "@/lib/guestStore";
import type { GuildQuestRank } from "@/lib/guildQuests";

export type { BureauContract } from "@/lib/bureauContracts";

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== "false";

const isLocalBureauStore = (): boolean =>
	!isSupabaseConfigured || import.meta.env.VITE_E2E === "true";

/** The Bureau dispatch board (alerts + contracts, newest first). */
export const useBureauContracts = () => {
	return useQuery({
		queryKey: ["bureau", "contracts"],
		queryFn: async (): Promise<BureauContract[]> => {
			if (isLocalBureauStore()) return loadLocalBureauContracts();
			const { data, error } = await supabase
				.from("bureau_contracts")
				.select("*")
				.order("created_at", { ascending: false });
			if (error) {
				if (guestEnabled) return loadLocalBureauContracts();
				throw error;
			}
			return (data ?? []) as unknown as BureauContract[];
		},
	});
};

/** Warden: publish a gate contract or dungeon-break alert. */
export const usePublishBureauContract = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (params: {
			kind: BureauContractKind;
			title: string;
			summary?: string | null;
			rank: GuildQuestRank;
			sourceQuestId?: string | null;
		}) => {
			if (isLocalBureauStore()) {
				publishBureauContractLocal({
					publisherUserId: getLocalUserId(),
					...params,
				});
				return;
			}
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) throw new Error("Sign in to publish Bureau postings");
			const { error } = await supabase.from("bureau_contracts").insert({
				publisher_user_id: user.id,
				kind: params.kind,
				title: params.title,
				summary: params.summary ?? null,
				rank: params.rank,
				source_quest_id: params.sourceQuestId ?? null,
			});
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["bureau", "contracts"] });
			toast({
				title:
					variables.kind === "alert" ? "Alert broadcast" : "Contract published",
				description:
					variables.kind === "alert"
						? "The dungeon-break alert is live on the board."
						: "Guilds can now accept this contract.",
			});
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to publish",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

/** Guild officer: accept a published contract onto the guild's quest board. */
export const useAcceptBureauContract = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (params: { contractId: string; guildId: string }) => {
			if (isLocalBureauStore()) {
				acceptBureauContractLocal(params);
				return;
			}
			const { error } = await supabase.rpc("accept_bureau_contract", {
				p_contract_id: params.contractId,
				p_guild_id: params.guildId,
			});
			if (error) throw error;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["bureau", "contracts"] });
			queryClient.invalidateQueries({
				queryKey: ["guilds", variables.guildId, "quests"],
			});
			toast({
				title: "Contract accepted",
				description: "Dispatched to your guild's quest board.",
			});
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

/** Warden: close (withdraw) one of their postings. */
export const useCloseBureauContract = () => {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	return useMutation({
		mutationFn: async (contractId: string) => {
			if (isLocalBureauStore()) {
				closeBureauContractLocal(contractId);
				return;
			}
			const { error } = await supabase
				.from("bureau_contracts")
				.update({ status: "closed" })
				.eq("id", contractId);
			if (error) throw error;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bureau", "contracts"] });
			toast({ title: "Posting closed" });
		},
		onError: (error: Error) => {
			toast({
				title: "Failed to close posting",
				description: error.message,
				variant: "destructive",
			});
		},
	});
};

export interface BureauLeaderboardRow {
	id: string;
	name: string;
	guild_rank: string | null;
	contribution: number;
	member_count: number;
}

/** The Bureau's "no guild too strong" balance board (active guilds, top 50). */
export const useBureauGuildLeaderboard = () => {
	return useQuery({
		queryKey: ["bureau", "leaderboard"],
		queryFn: async (): Promise<BureauLeaderboardRow[]> => {
			if (isLocalBureauStore()) {
				const { loadLocalGuilds, loadLocalGuildMembers } = await import(
					"@/hooks/useGuilds"
				);
				const members = loadLocalGuildMembers();
				return loadLocalGuilds()
					.filter((g) => g.is_active !== false)
					.map((g) => ({
						id: g.id,
						name: g.name,
						guild_rank: g.guild_rank ?? "E",
						contribution: g.contribution ?? 0,
						member_count: members.filter((m) => m.guild_id === g.id).length,
					}))
					.sort((a, b) => b.contribution - a.contribution)
					.slice(0, 50);
			}
			const { data, error } = await supabase.rpc("bureau_guild_leaderboard");
			if (error) throw error;
			return (data ?? []) as BureauLeaderboardRow[];
		},
	});
};
