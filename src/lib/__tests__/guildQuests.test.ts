import { beforeEach, describe, expect, it } from "vitest";
import {
	acceptGuildQuestLocal,
	type GuildQuestRank,
	listLocalGuildQuests,
	QUEST_RANK_ORDER,
	questRewardsForRank,
	resolveGuildQuestLocal,
} from "@/lib/guildQuests";

const GUILDS_KEY = "solo-compendium.guilds.v1";
const MEMBERS_KEY = "solo-compendium.guilds.members.v1";

const seed = () => {
	localStorage.setItem(
		GUILDS_KEY,
		JSON.stringify([
			{
				id: "g-1",
				name: "Umbral Vanguard",
				description: null,
				motto: null,
				leader_user_id: "u-leader",
				campaign_id: null,
				share_code: "AB12CD",
				is_active: true,
				settings: {},
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				funds: { gate: 10 },
				contribution: 0,
			},
		]),
	);
	localStorage.setItem(
		MEMBERS_KEY,
		JSON.stringify([
			{
				id: "m-npc",
				guild_id: "g-1",
				user_id: null,
				character_id: null,
				npc_id: "npc-1",
				npc_name: "Glassline Scout",
				npc_data: { name: "Glassline Scout", leveling: { maxLevel: 10 } },
				role: "member",
				joined_at: new Date().toISOString(),
				npc_level: 2,
				npc_xp: 0,
				npc_leveling_mode: "auto",
			},
		]),
	);
};

describe("guild quest rewards", () => {
	it("scales rewards with rank", () => {
		const e = questRewardsForRank("E");
		const s = questRewardsForRank("S");
		expect(e).toEqual({
			currency: "gate",
			funds: 50,
			contribution: 20,
		});
		expect(s.funds).toBeGreaterThan(e.funds);
		expect(s.contribution).toBeGreaterThan(e.contribution);
		// monotonic across the ladder
		const funds = QUEST_RANK_ORDER.map(
			(r: GuildQuestRank) => questRewardsForRank(r).funds,
		);
		expect([...funds].sort((a, b) => a - b)).toEqual(funds);
	});
});

describe("guild quest local flow", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("accepts a contract and credits the guild + advances the squad on success", () => {
		seed();
		const quest = acceptGuildQuestLocal({
			guildId: "g-1",
			sourceQuestId: "q-e-01",
			title: "Beacon of the Lost",
			rank: "E",
		});
		expect(listLocalGuildQuests("g-1")).toHaveLength(1);

		// assign the NPC and resolve success
		const quests = JSON.parse(
			localStorage.getItem("solo-compendium.guilds.quests.v1") ?? "[]",
		);
		quests[0].assigned_member_ids = ["m-npc"];
		localStorage.setItem(
			"solo-compendium.guilds.quests.v1",
			JSON.stringify(quests),
		);

		resolveGuildQuestLocal({ questId: quest.id, success: true });

		const guild = JSON.parse(localStorage.getItem(GUILDS_KEY) ?? "[]")[0];
		expect(guild.funds.gate).toBe(10 + 50); // E-rank funds credited
		expect(guild.contribution).toBe(20);

		const member = JSON.parse(localStorage.getItem(MEMBERS_KEY) ?? "[]")[0];
		expect(member.npc_level).toBe(3); // milestone advance

		expect(
			listLocalGuildQuests("g-1").find((q) => q.id === quest.id)?.status,
		).toBe("completed");
	});

	it("marks a failed contract without crediting anything", () => {
		seed();
		const quest = acceptGuildQuestLocal({
			guildId: "g-1",
			sourceQuestId: "q-e-01",
			title: "Beacon of the Lost",
			rank: "E",
		});
		resolveGuildQuestLocal({ questId: quest.id, success: false });

		const guild = JSON.parse(localStorage.getItem(GUILDS_KEY) ?? "[]")[0];
		expect(guild.funds.gate).toBe(10); // unchanged
		expect(guild.contribution).toBe(0);
		expect(
			listLocalGuildQuests("g-1").find((q) => q.id === quest.id)?.status,
		).toBe("failed");
	});
});
