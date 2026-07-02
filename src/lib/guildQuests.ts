// Guild quest rewards + local (guest-mode) store/operations. The reward math is
// pure and tested; the local resolve mirrors the SQL `resolve_guild_quest` RPC.

import {
	type GuildMember,
	loadLocalGuildMembers,
	loadLocalGuilds,
	saveLocalGuildMembers,
	saveLocalGuilds,
} from "@/hooks/useGuilds";
import { AppError } from "@/lib/appError";
import type { RaCurrencyId } from "@/lib/currency";
import { applyFundsDelta } from "@/lib/guildTreasury";

/**
 * Canon ranks run E–S. "SS" stays in the type for back-compat reads (older
 * quest rows may persist it) but is retired from the authoring ladder.
 */
export type GuildQuestRank = "E" | "D" | "C" | "B" | "A" | "S" | "SS";
export type GuildQuestStatus = "active" | "completed" | "failed";

/** Rift-contract rank ladder, weakest → strongest. */
export const QUEST_RANK_ORDER: GuildQuestRank[] = [
	"E",
	"D",
	"C",
	"B",
	"A",
	"S",
];

export interface GuildQuestRewards {
	currency: RaCurrencyId;
	funds: number;
	contribution: number;
}

export interface GuildQuest {
	id: string;
	guild_id: string;
	source_quest_id: string | null;
	title: string;
	rank: GuildQuestRank;
	status: GuildQuestStatus;
	assigned_member_ids: string[];
	rewards: GuildQuestRewards;
	created_at: string | null;
	resolved_at: string | null;
}

/** Reward scaling by rank (gate credits + contribution). */
export const questRewardsForRank = (
	rank: GuildQuestRank,
): GuildQuestRewards => {
	// E=1 … S=6; legacy persisted "SS" rows scale as S.
	const factor =
		rank === "SS"
			? QUEST_RANK_ORDER.length
			: QUEST_RANK_ORDER.indexOf(rank) + 1;
	return {
		currency: "gate",
		funds: 50 * factor,
		contribution: 20 * factor,
	};
};

const QUESTS_KEY = "solo-compendium.guilds.quests.v1";

export const loadLocalGuildQuests = (): GuildQuest[] => {
	if (typeof window === "undefined") return [];
	const raw = window.localStorage.getItem(QUESTS_KEY);
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as GuildQuest[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveLocalGuildQuests = (quests: GuildQuest[]) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
};

export const listLocalGuildQuests = (guildId: string): GuildQuest[] =>
	loadLocalGuildQuests().filter((q) => q.guild_id === guildId);

/** Accept a (canon/generated) quest into a guild's active board. */
export const acceptGuildQuestLocal = (params: {
	guildId: string;
	sourceQuestId: string | null;
	title: string;
	rank: GuildQuestRank;
}): GuildQuest => {
	const quest: GuildQuest = {
		id: crypto.randomUUID(),
		guild_id: params.guildId,
		source_quest_id: params.sourceQuestId,
		title: params.title,
		rank: params.rank,
		status: "active",
		assigned_member_ids: [],
		rewards: questRewardsForRank(params.rank),
		created_at: new Date().toISOString(),
		resolved_at: null,
	};
	saveLocalGuildQuests([...loadLocalGuildQuests(), quest]);
	return quest;
};

/** Assign the strike squad (guild member ids) to an active quest. */
export const assignGuildQuestSquadLocal = (params: {
	questId: string;
	memberIds: string[];
}): void => {
	const quests = loadLocalGuildQuests();
	const q = quests.find((x) => x.id === params.questId);
	if (!q) throw new AppError("Quest not found", "NOT_FOUND");
	q.assigned_member_ids = params.memberIds;
	saveLocalGuildQuests(quests);
};

/**
 * Resolve a quest. On success, credit the guild treasury / contribution and
 * advance assigned NPC members one milestone level.
 */
export const resolveGuildQuestLocal = (params: {
	questId: string;
	success: boolean;
}): void => {
	const quests = loadLocalGuildQuests();
	const q = quests.find((x) => x.id === params.questId);
	if (q?.status !== "active")
		throw new AppError("Quest not found or already resolved", "NOT_FOUND");

	if (params.success) {
		const guilds = loadLocalGuilds();
		const gIdx = guilds.findIndex((g) => g.id === q.guild_id);
		if (gIdx !== -1) {
			const g = guilds[gIdx];
			guilds[gIdx] = {
				...g,
				funds: applyFundsDelta(g.funds, q.rewards.currency, q.rewards.funds),
				contribution: (g.contribution ?? 0) + q.rewards.contribution,
			};
			saveLocalGuilds(guilds);
		}
		const members = loadLocalGuildMembers();
		let touched = false;
		const next = members.map((m: GuildMember) => {
			if (
				m.npc_id &&
				m.npc_level != null &&
				q.assigned_member_ids.includes(m.id)
			) {
				touched = true;
				return { ...m, npc_level: m.npc_level + 1, npc_xp: 0 };
			}
			return m;
		});
		if (touched) saveLocalGuildMembers(next);
	}

	q.status = params.success ? "completed" : "failed";
	q.resolved_at = new Date().toISOString();
	saveLocalGuildQuests(quests);
};
