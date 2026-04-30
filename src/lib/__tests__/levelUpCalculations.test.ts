/**
 * Level-Up Math regression tests (D&D Beyond / 5e parity).
 *
 * Locks in the per-level formulas used by the level-up wizard and the
 * bulk-level-up roster action.
 */
import { describe, expect, it } from "vitest";
import {
	applyVitModToRoll,
	calculateAverageHPGain,
	calculateLevelUpScalarBumps,
	calculateMaxHPGain,
	calculateMinHPGain,
	calculateProficiencyBonusForLevel,
	calculateRiftFavorDie,
	calculateRiftFavorMax,
} from "@/lib/levelUpCalculations";

describe("calculateAverageHPGain", () => {
	it("d8 + VIT 0 → 5 (floor(8/2)+1)", () => {
		expect(calculateAverageHPGain(8, 0)).toBe(5);
	});

	it("d12 (Destroyer) + VIT 2 → 9 (floor(12/2)+1+2)", () => {
		expect(calculateAverageHPGain(12, 2)).toBe(9);
	});

	it("d6 (Mage) + VIT 1 → 5 (floor(6/2)+1+1)", () => {
		expect(calculateAverageHPGain(6, 1)).toBe(5);
	});

	it("d10 + VIT -1 → 5 (floor(10/2)+1-1)", () => {
		expect(calculateAverageHPGain(10, -1)).toBe(5);
	});
});

describe("calculateMaxHPGain", () => {
	it("d8 + VIT 2 → 10 (max roll + mod)", () => {
		expect(calculateMaxHPGain(8, 2)).toBe(10);
	});

	it("d12 + VIT 3 → 15", () => {
		expect(calculateMaxHPGain(12, 3)).toBe(15);
	});
});

describe("calculateMinHPGain (RAW: at least 1 HP per level)", () => {
	it("VIT mod 0 → 1", () => {
		expect(calculateMinHPGain(0)).toBe(1);
	});

	it("VIT mod 3 → 4", () => {
		expect(calculateMinHPGain(3)).toBe(4);
	});

	it("VIT mod -2 floors to 1, never below", () => {
		expect(calculateMinHPGain(-2)).toBe(1);
	});

	it("VIT mod -10 still produces 1", () => {
		expect(calculateMinHPGain(-10)).toBe(1);
	});
});

describe("applyVitModToRoll", () => {
	it("rolls of 1+ keep their VIT mod", () => {
		expect(applyVitModToRoll(5, 2)).toBe(7);
		expect(applyVitModToRoll(8, 0)).toBe(8);
	});

	it("clamps total to minimum 1 (negative VIT mod cannot zero a roll)", () => {
		expect(applyVitModToRoll(1, -3)).toBe(1);
		expect(applyVitModToRoll(2, -5)).toBe(1);
	});
});

describe("calculateProficiencyBonusForLevel (5e SRD)", () => {
	it.each([
		[1, 2],
		[2, 2],
		[3, 2],
		[4, 2],
		[5, 3],
		[8, 3],
		[9, 4],
		[12, 4],
		[13, 5],
		[16, 5],
		[17, 6],
		[20, 6],
	])("level %i → +%i", (level, expectedPB) => {
		expect(calculateProficiencyBonusForLevel(level)).toBe(expectedPB);
	});

	it("defensively returns 2 for sub-1 levels", () => {
		expect(calculateProficiencyBonusForLevel(0)).toBe(2);
		expect(calculateProficiencyBonusForLevel(-1)).toBe(2);
	});
});

describe("calculateRiftFavorDie (RA-specific scaling)", () => {
	it.each([
		[1, 4],
		[4, 4],
		[5, 6],
		[10, 6],
		[11, 8],
		[16, 8],
		[17, 10],
		[20, 10],
	])("level %i → d%i", (level, expectedDie) => {
		expect(calculateRiftFavorDie(level)).toBe(expectedDie);
	});
});

describe("calculateRiftFavorMax (RA-specific scaling)", () => {
	it.each([
		[1, 3],
		[4, 3],
		[5, 4],
		[10, 4],
		[11, 5],
		[16, 5],
		[17, 6],
		[20, 6],
	])("level %i → max %i uses", (level, expectedMax) => {
		expect(calculateRiftFavorMax(level)).toBe(expectedMax);
	});
});

describe("calculateLevelUpScalarBumps (composite)", () => {
	it("L5 transition produces PB +3, d6 rift favor, max 4", () => {
		expect(calculateLevelUpScalarBumps(5)).toEqual({
			level: 5,
			proficiency_bonus: 3,
			rift_favor_die: 6,
			rift_favor_max: 4,
		});
	});

	it("L17 transition produces PB +6, d10 rift favor, max 6", () => {
		expect(calculateLevelUpScalarBumps(17)).toEqual({
			level: 17,
			proficiency_bonus: 6,
			rift_favor_die: 10,
			rift_favor_max: 6,
		});
	});

	it("L1 baseline values", () => {
		expect(calculateLevelUpScalarBumps(1)).toEqual({
			level: 1,
			proficiency_bonus: 2,
			rift_favor_die: 4,
			rift_favor_max: 3,
		});
	});
});
