/**
 * Skill modifier regression tests (DDB / 5e parity).
 *
 * Locks in:
 *   skill mod = ability mod + (proficient ? PB : 0) + (expertise ? PB : 0)
 *   passive   = 10 + skill mod
 *   skill→ability mapping (Athletics=STR, Stealth=AGI, Perception=SENSE, ...)
 */
import { describe, expect, it } from "vitest";
import {
	calculatePassiveSkill,
	calculateSkillModifier,
	getAllSkills,
} from "@/lib/skills";
import type { AbilityScore } from "@/types/core-rules";

const abilities = (
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

describe("calculateSkillModifier — base formula", () => {
	it("untrained returns just the ability modifier", () => {
		// Athletics = STR.  STR 14 → +2.
		expect(
			calculateSkillModifier("Athletics", abilities({ STR: 14 }), [], [], 2),
		).toBe(2);
	});

	it("proficient adds PB once", () => {
		// Stealth = AGI.  AGI 16 → +3, +2 PB → +5.
		expect(
			calculateSkillModifier(
				"Stealth",
				abilities({ AGI: 16 }),
				["Stealth"],
				[],
				2,
			),
		).toBe(5);
	});

	it("expertise adds PB twice (overrides plain proficiency)", () => {
		// Perception = SENSE.  SENSE 18 → +4, +2*2 PB = +4.  Total +8.
		expect(
			calculateSkillModifier(
				"Perception",
				abilities({ SENSE: 18 }),
				["Perception"],
				["Perception"],
				2,
			),
		).toBe(8);
	});

	it("expertise without listed proficiency still grants ×2 PB (DDB lets expertise apply standalone)", () => {
		expect(
			calculateSkillModifier(
				"Persuasion",
				abilities({ PRE: 16 }),
				[], // not in proficiencies
				["Persuasion"], // but in expertise
				3,
			),
		).toBe(3 + 6); // +3 PRE +6 expertise PB
	});

	it("unknown skill returns 0 (defensive)", () => {
		expect(
			calculateSkillModifier(
				"Underwater Basket Weaving",
				abilities({ STR: 18 }),
				[],
				[],
				6,
			),
		).toBe(0);
	});

	it("scales with PB through 5e tiers", () => {
		const lvl1 = calculateSkillModifier(
			"Investigation",
			abilities({ INT: 14 }),
			["Investigation"],
			[],
			2,
		);
		const lvl5 = calculateSkillModifier(
			"Investigation",
			abilities({ INT: 14 }),
			["Investigation"],
			[],
			3,
		);
		const lvl17 = calculateSkillModifier(
			"Investigation",
			abilities({ INT: 14 }),
			["Investigation"],
			[],
			6,
		);
		expect(lvl1).toBe(2 + 2);
		expect(lvl5).toBe(2 + 3);
		expect(lvl17).toBe(2 + 6);
	});

	it("negative ability modifier propagates", () => {
		expect(
			calculateSkillModifier("Athletics", abilities({ STR: 8 }), [], [], 2),
		).toBe(-1);
	});
});

describe("calculatePassiveSkill — DDB / 5e parity (passive = 10 + modifier)", () => {
	it("passive Perception with SENSE 14 + proficient + PB 2 = 14", () => {
		expect(
			calculatePassiveSkill(
				"Perception",
				abilities({ SENSE: 14 }),
				["Perception"],
				[],
				2,
			),
		).toBe(14);
	});

	it("untrained Perception with SENSE 10 = 10", () => {
		expect(
			calculatePassiveSkill("Perception", abilities({ SENSE: 10 }), [], [], 2),
		).toBe(10);
	});

	it("passive Investigation expert with INT 18, PB 4 = 10 + 4 + 8 = 22", () => {
		expect(
			calculatePassiveSkill(
				"Investigation",
				abilities({ INT: 18 }),
				["Investigation"],
				["Investigation"],
				4,
			),
		).toBe(22);
	});

	it("passive Insight not proficient with SENSE 16 = 10 + 3 = 13", () => {
		expect(
			calculatePassiveSkill("Insight", abilities({ SENSE: 16 }), [], [], 4),
		).toBe(13);
	});
});

describe("getAllSkills — RA skill catalog (17 5e skills with RA ability mapping)", () => {
	it("returns 17 skills mapped to RA abilities", () => {
		const all = getAllSkills();
		expect(all.length).toBe(17);
	});

	it("Athletics is STR-based", () => {
		const all = getAllSkills();
		const skill = all.find((s) => s.name === "Athletics");
		expect(skill?.ability).toBe("STR");
	});

	it.each([
		["Stealth", "AGI"],
		["Acrobatics", "AGI"],
		["Sleight of Hand", "AGI"],
		["Investigation", "INT"],
		["Arcana", "INT"],
		["History", "INT"],
		["Nature", "INT"],
		["Religion", "INT"],
		["Perception", "SENSE"],
		["Insight", "SENSE"],
		["Medicine", "SENSE"],
		["Survival", "SENSE"],
		["Deception", "PRE"],
		["Intimidation", "PRE"],
		["Performance", "PRE"],
		["Persuasion", "PRE"],
	])("%s is %s-based", (name, ability) => {
		const skill = getAllSkills().find((s) => s.name === name);
		expect(skill?.ability).toBe(ability);
	});
});
