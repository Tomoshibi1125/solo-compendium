/**
 * Spell Save DC and Spell Attack Bonus regression tests (DDB / 5e parity).
 *
 * Locks in the canonical formulas:
 *   spellSaveDC = 8 + proficiency_bonus + spellcasting_ability_modifier
 *   spellAttackBonus = proficiency_bonus + spellcasting_ability_modifier
 *
 * Plus the per-job spellcasting ability mapping so casters never silently
 * regress to the wrong stat.
 */
import { describe, expect, it } from "vitest";
import {
	calculateSpellAttackBonus,
	calculateSpellSaveDC,
	getSpellcastingAbility,
	getSpellsKnownLimit,
	getSpellsPreparedLimit,
} from "@/lib/5eCharacterCalculations";
import type { AbilityScore } from "@/types/core-rules";

const baseAbilities = (
	overrides: Partial<Record<AbilityScore, number>> = {},
): Record<AbilityScore, number> => ({
	STR: 10,
	AGI: 10,
	VIT: 10,
	INT: 10,
	SENSE: 10,
	PRE: 10,
	...overrides,
});

describe("getSpellcastingAbility", () => {
	it("returns INT for arcane casters (Mage, Revenant, Technomancer)", () => {
		expect(getSpellcastingAbility("Mage")).toBe("INT");
		expect(getSpellcastingAbility("Revenant")).toBe("INT");
		expect(getSpellcastingAbility("Technomancer")).toBe("INT");
	});

	it("returns SENSE for nature/insight casters (Herald, Summoner, Stalker)", () => {
		expect(getSpellcastingAbility("Herald")).toBe("SENSE");
		expect(getSpellcastingAbility("Summoner")).toBe("SENSE");
		expect(getSpellcastingAbility("Stalker")).toBe("SENSE");
	});

	it("returns PRE for charisma-style casters (Esper, Contractor, Holy Knight, Idol)", () => {
		expect(getSpellcastingAbility("Esper")).toBe("PRE");
		expect(getSpellcastingAbility("Contractor")).toBe("PRE");
		expect(getSpellcastingAbility("Holy Knight")).toBe("PRE");
		expect(getSpellcastingAbility("Idol")).toBe("PRE");
	});

	it("returns null for non-casters and unknown jobs", () => {
		expect(getSpellcastingAbility("Destroyer")).toBeNull();
		expect(getSpellcastingAbility("Berserker")).toBeNull();
		expect(getSpellcastingAbility("Striker")).toBeNull();
		expect(getSpellcastingAbility(null)).toBeNull();
		expect(getSpellcastingAbility(undefined)).toBeNull();
		expect(getSpellcastingAbility("Definitely Not A Job")).toBeNull();
	});

	it("accepts a {name} object as well as a raw string", () => {
		expect(getSpellcastingAbility({ name: "Mage" })).toBe("INT");
	});
});

describe("calculateSpellSaveDC (8 + PB + ability mod)", () => {
	it("Mage L1 with INT 18 → DC 14 (8 + 2 + 4)", () => {
		const dc = calculateSpellSaveDC(1, "Mage", baseAbilities({ INT: 18 }));
		expect(dc).toBe(14);
	});

	it("Mage L1 with INT 10 → DC 10 (8 + 2 + 0)", () => {
		expect(calculateSpellSaveDC(1, "Mage", baseAbilities({ INT: 10 }))).toBe(
			10,
		);
	});

	it("Mage L5 with INT 18 → DC 15 (8 + 3 + 4)", () => {
		expect(calculateSpellSaveDC(5, "Mage", baseAbilities({ INT: 18 }))).toBe(
			15,
		);
	});

	it("Mage L9 with INT 20 → DC 17 (8 + 4 + 5)", () => {
		expect(calculateSpellSaveDC(9, "Mage", baseAbilities({ INT: 20 }))).toBe(
			17,
		);
	});

	it("Esper L1 with PRE 14 → DC 12 (8 + 2 + 2)", () => {
		expect(calculateSpellSaveDC(1, "Esper", baseAbilities({ PRE: 14 }))).toBe(
			12,
		);
	});

	it("Herald L3 with SENSE 16 → DC 13 (8 + 2 + 3)", () => {
		expect(
			calculateSpellSaveDC(3, "Herald", baseAbilities({ SENSE: 16 })),
		).toBe(13);
	});

	it("returns null for non-casters", () => {
		expect(calculateSpellSaveDC(5, "Destroyer", baseAbilities())).toBeNull();
	});

	it("uses the wrong-ability score (other ability is irrelevant)", () => {
		// Mage uses INT — so high PRE shouldn't increase DC.
		const dc = calculateSpellSaveDC(
			1,
			"Mage",
			baseAbilities({ INT: 10, PRE: 20 }),
		);
		expect(dc).toBe(10);
	});

	it("clamps to a sensible value when ability is unset (10 default → mod 0)", () => {
		expect(calculateSpellSaveDC(1, "Mage", baseAbilities())).toBe(10);
	});
});

describe("calculateSpellAttackBonus (PB + ability mod)", () => {
	it("Mage L1 with INT 18 → +6 (2 + 4)", () => {
		expect(
			calculateSpellAttackBonus(1, "Mage", baseAbilities({ INT: 18 })),
		).toBe(6);
	});

	it("Mage L5 with INT 18 → +7 (3 + 4)", () => {
		expect(
			calculateSpellAttackBonus(5, "Mage", baseAbilities({ INT: 18 })),
		).toBe(7);
	});

	it("Esper L1 with PRE 8 → +1 (2 + (-1))", () => {
		expect(
			calculateSpellAttackBonus(1, "Esper", baseAbilities({ PRE: 8 })),
		).toBe(1);
	});

	it("Holy Knight L17 with PRE 20 → +11 (6 + 5)", () => {
		expect(
			calculateSpellAttackBonus(17, "Holy Knight", baseAbilities({ PRE: 20 })),
		).toBe(11);
	});

	it("returns null for non-casters", () => {
		expect(
			calculateSpellAttackBonus(5, "Destroyer", baseAbilities()),
		).toBeNull();
	});

	it("matches PB progression at known thresholds", () => {
		// PB: lvl 1-4 = +2, 5-8 = +3, 9-12 = +4, 13-16 = +5, 17-20 = +6
		const intMod = (score: number) => Math.floor((score - 10) / 2);
		const cases: Array<{ level: number; pb: number }> = [
			{ level: 1, pb: 2 },
			{ level: 4, pb: 2 },
			{ level: 5, pb: 3 },
			{ level: 9, pb: 4 },
			{ level: 13, pb: 5 },
			{ level: 17, pb: 6 },
		];
		for (const { level, pb } of cases) {
			const bonus = calculateSpellAttackBonus(
				level,
				"Mage",
				baseAbilities({ INT: 16 }),
			);
			expect(bonus).toBe(pb + intMod(16));
		}
	});
});

describe("spell known/prepared count formulas", () => {
	it.each([
		["Esper", 1, 2],
		["Esper", 10, 11],
		["Contractor", 5, 6],
		["Idol", 20, 21],
	])("%s level %i knows level + 1 spells", (jobName, level, expected) => {
		expect(getSpellsKnownLimit(jobName, level)).toBe(expected);
	});

	it.each([
		"Mage",
		"Herald",
		"Holy Knight",
		"Summoner",
		"Destroyer",
	])("%s does not use the known-spells formula", (jobName) => {
		expect(getSpellsKnownLimit(jobName, 5)).toBeNull();
	});

	it.each([
		["Mage", 1, -1, 1],
		["Mage", 5, 4, 9],
		["Technomancer", 2, 3, 5],
		["Revenant", 7, 2, 9],
		["Stalker", 9, 4, 13],
		["Herald", 10, 5, 15],
		["Holy Knight", 13, 1, 14],
		["Summoner", 20, 3, 23],
	])("%s level %i prepares max(1, level + ability mod)", (jobName, level, abilityModifier, expected) => {
		expect(getSpellsPreparedLimit(jobName, level, abilityModifier)).toBe(
			expected,
		);
	});

	it.each([
		"Esper",
		"Contractor",
		"Idol",
		"Destroyer",
	])("%s does not use the prepared-spells formula", (jobName) => {
		expect(getSpellsPreparedLimit(jobName, 5, 4)).toBeNull();
	});
});
