/**
 * QuickAscendantWizard pure-helper tests (F1 of May 2026 remediation plan).
 *
 * Locks the smart-default array placement so future tweaks can't silently
 * reorder priority. Standard array [15,14,13,12,10,8] is placed:
 *   1. Job primary ability first (15)
 *   2. VIT next (14) — drives HP at level 1
 *   3. Remaining in canonical declared order (STR/AGI/VIT/INT/SENSE/PRE)
 */
import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import {
	calculateHPMax,
	getAbilityModifier,
} from "@/lib/characterCalculations";
import { getJobASI } from "@/lib/characterCreation";
import {
	applyAbilityBonuses,
	placeStandardArray,
} from "@/lib/quickAscendantDefaults";

describe("placeStandardArray", () => {
	it("places 15 on the Job's primary ability (Mage = INT)", () => {
		const result = placeStandardArray("INT");
		expect(result.INT).toBe(15);
	});

	it("places 14 on VIT for level-1 HP", () => {
		const result = placeStandardArray("INT");
		expect(result.VIT).toBe(14);
	});

	it("falls back gracefully when primary is null (non-canonical Job)", () => {
		const result = placeStandardArray(null);
		// VIT becomes index 0 (gets 15) since primary is empty.
		expect(result.VIT).toBe(15);
		// STR slides to index 1 (gets 14).
		expect(result.STR).toBe(14);
	});

	it("handles primary = VIT (rare but legal) without double-assignment", () => {
		const result = placeStandardArray("VIT");
		expect(result.VIT).toBe(15);
		// Some other ability gets 14 (first non-VIT declared)
		expect(result.STR).toBe(14);
	});

	it("assigns every ability exactly one standard-array value (no NaN)", () => {
		const result = placeStandardArray("AGI");
		const values = Object.values(result).sort((a, b) => a - b);
		expect(values).toEqual([8, 10, 12, 13, 14, 15]);
	});

	it("places primary first across all 6 canonical primaries", () => {
		for (const ability of [
			"STR",
			"AGI",
			"VIT",
			"INT",
			"SENSE",
			"PRE",
		] as const) {
			const result = placeStandardArray(ability);
			expect(result[ability]).toBe(15);
		}
	});
});

describe("applyAbilityBonuses (racial-ASI preview for creation math)", () => {
	it("overlays bonuses without mutating the base scores", () => {
		const base = placeStandardArray("INT");
		const effective = applyAbilityBonuses(base, { VIT: 2, STR: 1 });
		expect(effective.VIT).toBe(base.VIT + 2);
		expect(effective.STR).toBe(base.STR + 1);
		expect(base.VIT).toBe(14); // untouched
	});

	it("ignores unknown ability keys", () => {
		const base = placeStandardArray(null);
		const effective = applyAbilityBonuses(base, { LUCK: 5 });
		expect(effective).toEqual(base);
	});

	it("level-1 Revenant Quickbuilder HP uses post-ASI VIT (10 → 11 fix)", () => {
		// Revenant primary = INT: array gives INT 15, VIT 14; awakening ASI
		// is VIT +2 / STR +1, so HP must be 8 (max d8) + mod(16) = 11, not
		// 8 + mod(14) = 10 — the pre-ASI value the wizard shipped before.
		const base = placeStandardArray("INT");
		const revenant = jobs.find((j) => j.name === "Revenant");
		expect(revenant).toBeDefined();
		const asi = getJobASI("Revenant", 1, revenant);
		expect(asi.VIT).toBe(2);
		const effective = applyAbilityBonuses(base, asi);
		const hp = calculateHPMax(1, 8, getAbilityModifier(effective.VIT));
		expect(hp).toBe(11);
		// The buggy pre-ASI computation is pinned as distinct:
		expect(calculateHPMax(1, 8, getAbilityModifier(base.VIT))).toBe(10);
	});
});
