/**
 * Encounter difficulty vs DMG RAW (Jul 18 deep audit, Phase E).
 *
 * calculateDifficulty built its encounter multiplier from the PARTY size and
 * compared the result against a single character's threshold. RAW does the
 * opposite on both counts:
 *
 *   1. the multiplier scales with the NUMBER OF MONSTERS (1 → ×1, 2 → ×1.5,
 *      3-6 → ×2, 7-10 → ×2.5, 11-14 → ×3, 15+ → ×4);
 *   2. the comparison is against the PARTY threshold — the per-character
 *      value summed over the party.
 *
 * The two errors did not cancel: a party of four level-1 Ascendants facing
 * one 200 XP anomaly was reported "deadly" when RAW calls it medium, so a
 * Warden building to the readout would badly under-build every fight.
 * (singleMonsterXpBudget in the same file already had it right — a textbook
 * dual-stack disagreement.)
 *
 * DMG also shifts the multiplier one step for unusual party sizes: parties
 * of 1-2 use the next higher band, parties of 6+ the next lower one.
 */
import { describe, expect, it } from "vitest";
import {
	calculateDifficulty,
	encounterMultiplier,
	singleMonsterXpBudget,
} from "@/lib/encounterMath";

describe("encounterMultiplier (DMG monster-count bands)", () => {
	it("scales with monster count for a standard party", () => {
		expect(encounterMultiplier(1, 4)).toBe(1);
		expect(encounterMultiplier(2, 4)).toBe(1.5);
		expect(encounterMultiplier(3, 4)).toBe(2);
		expect(encounterMultiplier(6, 4)).toBe(2);
		expect(encounterMultiplier(7, 4)).toBe(2.5);
		expect(encounterMultiplier(10, 4)).toBe(2.5);
		expect(encounterMultiplier(11, 4)).toBe(3);
		expect(encounterMultiplier(15, 4)).toBe(4);
	});

	it("shifts one band up for small parties (1-2) and down for large (6+)", () => {
		// Two monsters: standard ×1.5 → small party ×2, large party ×1.
		expect(encounterMultiplier(2, 2)).toBe(2);
		expect(encounterMultiplier(2, 6)).toBe(1);
		// A lone monster still cannot drop below ×1 for a big party.
		expect(encounterMultiplier(1, 8)).toBe(1);
	});
});

describe("calculateDifficulty (party threshold, monster-count multiplier)", () => {
	it("a single 200 XP anomaly vs four level-1 characters is medium, not deadly", () => {
		// Party thresholds at L1 ×4: easy 100, medium 200, hard 300, deadly 400.
		expect(calculateDifficulty(200, 1, 4, 1)).toBe("medium");
	});

	it("scales across the bands for a standard party", () => {
		expect(calculateDifficulty(99, 1, 4, 1)).toBe("easy");
		expect(calculateDifficulty(300, 1, 4, 1)).toBe("hard");
		expect(calculateDifficulty(400, 1, 4, 1)).toBe("deadly");
	});

	it("applies the monster-count multiplier to the raw XP", () => {
		// Four 50 XP anomalies = 200 raw XP, ×2 for 3-6 monsters = 400 adjusted
		// → deadly against a level-1 party of four.
		expect(calculateDifficulty(200, 1, 4, 4)).toBe("deadly");
	});

	it("party size moves the threshold, not just the multiplier", () => {
		// The same 200 XP solo anomaly is deadly for a lone level-1 character
		// (threshold 100) but only medium for a party of four.
		expect(calculateDifficulty(200, 1, 1, 1)).toBe("deadly");
		expect(calculateDifficulty(200, 1, 4, 1)).toBe("medium");
	});

	it("agrees with singleMonsterXpBudget at the boundary", () => {
		// The budget helper says how much a solo monster may be worth before
		// exceeding a difficulty; difficulty of exactly that XP must match.
		for (const level of [1, 5, 11, 20]) {
			const budget = singleMonsterXpBudget(level, "deadly", 4);
			expect(calculateDifficulty(budget, level, 4, 1)).toBe("deadly");
			expect(calculateDifficulty(budget - 1, level, 4, 1)).not.toBe("deadly");
		}
	});
});
