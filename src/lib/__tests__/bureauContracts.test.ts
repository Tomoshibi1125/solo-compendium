import { beforeEach, describe, expect, it } from "vitest";

import { saveLocalGuilds } from "@/hooks/useGuilds";
import {
	acceptBureauContractLocal,
	closeBureauContractLocal,
	loadLocalBureauContracts,
	publishBureauContractLocal,
} from "@/lib/bureauContracts";
import {
	listLocalGuildQuests,
	resolveGuildQuestLocal,
} from "@/lib/guildQuests";

const GUILD_ID = "guild-bureau-test";

const seedGuild = () => {
	saveLocalGuilds([
		{
			id: GUILD_ID,
			name: "Ashline Vanguard",
			description: null,
			motto: null,
			leader_user_id: "user-1",
			campaign_id: null,
			share_code: "ABC123",
			is_active: true,
			settings: {},
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			contribution: 0,
			funds: { gate: 0 },
		},
	]);
};

describe("bureau dispatch board (local mode)", () => {
	beforeEach(() => {
		window.localStorage.clear();
		seedGuild();
	});

	it("publish → accept → resolve credits the guild (full 2D handoff)", () => {
		const contract = publishBureauContractLocal({
			publisherUserId: "warden-1",
			kind: "contract",
			title: "Containment: Threshold bleed",
			summary: "Seal the bleed before it widens.",
			rank: "C",
		});

		expect(loadLocalBureauContracts()[0]).toMatchObject({
			status: "published",
			rank: "C",
		});

		acceptBureauContractLocal({ contractId: contract.id, guildId: GUILD_ID });

		const accepted = loadLocalBureauContracts()[0];
		expect(accepted.status).toBe("accepted");
		expect(accepted.accepted_by_guild_id).toBe(GUILD_ID);

		// The contract landed on the guild's quest board via the existing flow.
		const quests = listLocalGuildQuests(GUILD_ID);
		expect(quests).toHaveLength(1);
		expect(quests[0]).toMatchObject({
			title: "Containment: Threshold bleed",
			rank: "C",
			status: "active",
			source_quest_id: `bureau:${contract.id}`,
		});

		// Resolving it credits treasury + contribution (rank C factor = 3).
		resolveGuildQuestLocal({ questId: quests[0].id, success: true });
		const resolved = listLocalGuildQuests(GUILD_ID)[0];
		expect(resolved.status).toBe("completed");
		expect(resolved.rewards).toMatchObject({
			currency: "gate",
			funds: 150,
			contribution: 60,
		});
	});

	it("a contract can only be accepted once", () => {
		const contract = publishBureauContractLocal({
			publisherUserId: "warden-1",
			kind: "contract",
			title: "Hunt: Rogue anomaly",
			rank: "B",
		});
		acceptBureauContractLocal({ contractId: contract.id, guildId: GUILD_ID });
		expect(() =>
			acceptBureauContractLocal({ contractId: contract.id, guildId: GUILD_ID }),
		).toThrow(/no longer available/);
		expect(listLocalGuildQuests(GUILD_ID)).toHaveLength(1);
	});

	it("alerts cannot be accepted as contracts", () => {
		const alert = publishBureauContractLocal({
			publisherUserId: "warden-1",
			kind: "alert",
			title: "Dungeon break: Transit Yards",
			rank: "A",
		});
		expect(() =>
			acceptBureauContractLocal({ contractId: alert.id, guildId: GUILD_ID }),
		).toThrow(/not found/i);
	});

	it("closing a posting removes it from the open board", () => {
		const contract = publishBureauContractLocal({
			publisherUserId: "warden-1",
			kind: "contract",
			title: "Recon: New threshold",
			rank: "E",
		});
		closeBureauContractLocal(contract.id);
		expect(loadLocalBureauContracts()[0].status).toBe("closed");
	});
});
