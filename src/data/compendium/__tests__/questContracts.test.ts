import { describe, expect, it } from "vitest";
import {
	getPrebuiltQuestContracts,
	PREBUILT_QUEST_CONTRACTS,
} from "@/data/compendium/quest-contracts";
import { QUEST_RANK_ORDER } from "@/lib/guildQuests";

describe("prebuilt quest contracts", () => {
	it("is a vast, varied library", () => {
		// "vast": a substantial number of contracts.
		expect(PREBUILT_QUEST_CONTRACTS.length).toBeGreaterThanOrEqual(36);
		// "varied": spans every rank and many contract types.
		const ranks = new Set(PREBUILT_QUEST_CONTRACTS.map((q) => q.rank));
		for (const r of QUEST_RANK_ORDER) expect(ranks.has(r)).toBe(true);
		const types = new Set(PREBUILT_QUEST_CONTRACTS.map((q) => q.type));
		expect(types.size).toBeGreaterThanOrEqual(6);
	});

	it("has unique ids and unique titles", () => {
		const ids = PREBUILT_QUEST_CONTRACTS.map((q) => q.id);
		expect(new Set(ids).size).toBe(ids.length);
		const titles = PREBUILT_QUEST_CONTRACTS.map((q) => q.title);
		expect(new Set(titles).size).toBe(titles.length);
	});

	it("is built in full (every contract has summary + objectives + rewards)", () => {
		for (const q of PREBUILT_QUEST_CONTRACTS) {
			expect(q.title.length).toBeGreaterThan(0);
			expect(q.summary.length).toBeGreaterThan(20);
			expect(q.objectives.length).toBeGreaterThanOrEqual(3);
			expect(q.objectives.every((o) => o.trim().length > 0)).toBe(true);
			expect(q.rewardNotes.length).toBeGreaterThan(0);
			expect(QUEST_RANK_ORDER).toContain(q.rank);
		}
	});

	it("filters by rank via getPrebuiltQuestContracts", () => {
		const all = getPrebuiltQuestContracts();
		expect(all).toHaveLength(PREBUILT_QUEST_CONTRACTS.length);
		const ssOnly = getPrebuiltQuestContracts("SS");
		expect(ssOnly.length).toBeGreaterThanOrEqual(1);
		expect(ssOnly.every((q) => q.rank === "SS")).toBe(true);
	});
});
