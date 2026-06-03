import { describe, expect, it } from "vitest";
import { regents as CANONICAL_REGENTS } from "@/data/compendium/regents";
import { calculateCharacterStats } from "@/lib/5eCharacterCalculations";
import {
	casterLevelContribution,
	computeGestaltSummary,
	getGestaltClassFeatures,
	getGestaltProficiencies,
	getGestaltSpellSlots,
	getRegentCasterFraction,
	getRegentHitDieContribution,
	normalizeSaveToCode,
	normalizeSkillToId,
	parseHitDieSize,
	resolveRegents,
} from "@/lib/regentGestalt";
import type { Regent } from "@/lib/regentTypes";

const umbral = CANONICAL_REGENTS.find((r) => r.id === "umbral_regent");

describe("regentGestalt — resolution", () => {
	it("resolves canonical regent ids to rich Regent class data", () => {
		const resolved = resolveRegents(["umbral_regent"]);
		expect(resolved).toHaveLength(1);
		expect(resolved[0].id).toBe("umbral_regent");
		expect(resolved[0].class_features?.length ?? 0).toBeGreaterThan(0);
	});

	it("skips unknown ids and handles empty input", () => {
		expect(resolveRegents(["does_not_exist"])).toHaveLength(0);
		expect(resolveRegents([])).toHaveLength(0);
		expect(resolveRegents(null)).toHaveLength(0);
	});
});

describe("regentGestalt — name normalization", () => {
	it("maps ability display names and codes to canonical codes", () => {
		expect(normalizeSaveToCode("Sense")).toBe("SENSE");
		expect(normalizeSaveToCode("Presence")).toBe("PRE");
		expect(normalizeSaveToCode("STR")).toBe("STR");
		expect(normalizeSaveToCode("nonsense")).toBeNull();
	});

	it("maps RA-themed skill names and ids to skill ids", () => {
		expect(normalizeSkillToId("Mana Flow")).toBe("arcana");
		expect(normalizeSkillToId("Cosmic Lore")).toBe("religion");
		expect(normalizeSkillToId("Stealth")).toBe("stealth");
		expect(normalizeSkillToId("intimidation")).toBe("intimidation");
		expect(normalizeSkillToId("not a skill")).toBeNull();
	});
});

describe("regentGestalt — additive hit dice", () => {
	it("parses hit-die strings", () => {
		expect(parseHitDieSize("1d12")).toBe(12);
		expect(parseHitDieSize("d8")).toBe(8);
		expect(parseHitDieSize(null)).toBe(0);
	});

	it("sums regent hit-die contributions (power-spike additive rule)", () => {
		if (!umbral) throw new Error("umbral_regent fixture missing");
		expect(getRegentHitDieContribution([umbral])).toBe(
			parseHitDieSize(umbral.hit_dice),
		);
		// Two regents stack additively.
		expect(getRegentHitDieContribution([umbral, umbral])).toBe(
			parseHitDieSize(umbral.hit_dice) * 2,
		);
	});
});

describe("regentGestalt — proficiency / saving-throw union", () => {
	it("unions and normalizes regent saves + skills", () => {
		if (!umbral) throw new Error("umbral_regent fixture missing");
		const profs = getGestaltProficiencies([umbral]);
		// umbral_regent saving_throws: ["Sense", "Presence"]
		expect(profs.savingThrows).toEqual(
			expect.arrayContaining(["SENSE", "PRE"]),
		);
		// skill_proficiencies include "Mana Flow" and "Cosmic Lore" → arcana/religion
		expect(profs.skills).toEqual(
			expect.arrayContaining(["arcana", "religion"]),
		);
		// no duplicates
		expect(new Set(profs.savingThrows).size).toBe(profs.savingThrows.length);
		expect(new Set(profs.skills).size).toBe(profs.skills.length);
	});
});

describe("regentGestalt — leveled class features (regent level == char level)", () => {
	it("only grants features at or below the character level, growing with level", () => {
		if (!umbral) throw new Error("umbral_regent fixture missing");
		const atL1 = getGestaltClassFeatures([umbral], 1);
		const atL5 = getGestaltClassFeatures([umbral], 5);
		const atL20 = getGestaltClassFeatures([umbral], 20);
		expect(atL1.every((f) => f.level <= 1)).toBe(true);
		expect(atL5.every((f) => f.level <= 5)).toBe(true);
		expect(atL5.length).toBeGreaterThan(atL1.length);
		expect(atL20.length).toBeGreaterThanOrEqual(atL5.length);
		// sorted by level
		for (let i = 1; i < atL20.length; i++) {
			expect(atL20[i].level).toBeGreaterThanOrEqual(atL20[i - 1].level);
		}
	});
});

describe("regentGestalt — spellcasting merge (Job + Regent only)", () => {
	it("computes PHB p.164 caster-level contributions", () => {
		expect(casterLevelContribution("full", 12)).toBe(12);
		expect(casterLevelContribution("half", 12)).toBe(6);
		expect(casterLevelContribution("third", 12)).toBe(4);
		expect(casterLevelContribution("none", 12)).toBe(0);
	});

	it("non-casting job + non-casting regent yields no slots", () => {
		const martialRegent = {
			id: "martial_test",
			name: "Martial Test",
			hit_dice: "1d12",
			// no spellcasting block → contributes no caster levels
		} as Regent;
		const slots = getGestaltSpellSlots("none", [martialRegent], 10);
		expect(Object.values(slots).every((n) => n === 0)).toBe(true);
		expect(getRegentCasterFraction(martialRegent)).toBe("none");
	});

	it("full-caster job alone matches full-caster slots at its level", () => {
		const slots = getGestaltSpellSlots("none", [], 5);
		// combined caster level 0 with no job fraction → empty; sanity for guard
		expect(slots[1]).toBe(0);
		const fullJob = getGestaltSpellSlots("full", [], 5);
		// Combined caster level 5 → 4/3/2 (PHB multiclass table row 5)
		expect(fullJob[1]).toBe(4);
		expect(fullJob[2]).toBe(3);
		expect(fullJob[3]).toBe(2);
		expect(fullJob[4]).toBe(0);
	});

	it("a spellcasting regent adds full caster levels to the merge", () => {
		const caster = CANONICAL_REGENTS.find((r) => r.spellcasting);
		if (!caster) return; // dataset may have none; guarded
		expect(getRegentCasterFraction(caster)).toBe("full");
		// half-caster job (lvl 10 → 5) + full regent (lvl 10 → 10) = 15 combined
		const slots = getGestaltSpellSlots("half", [caster], 10);
		// combined caster level 15 → 7th-level slots exist
		expect(slots[7]).toBeGreaterThan(0);
	});
});

describe("regentGestalt — summary", () => {
	it("computes an inactive summary with no regents", () => {
		const s = computeGestaltSummary([], 10);
		expect(s.active).toBe(false);
		expect(s.regentHitDieContribution).toBe(0);
		expect(s.features).toHaveLength(0);
	});

	it("computes an active summary for an unlocked regent", () => {
		if (!umbral) throw new Error("umbral_regent fixture missing");
		const s = computeGestaltSummary(["umbral_regent"], 8);
		expect(s.active).toBe(true);
		expect(s.regents).toHaveLength(1);
		expect(s.regentHitDieContribution).toBe(parseHitDieSize(umbral.hit_dice));
		expect(s.features.every((f: { level: number }) => f.level <= 8)).toBe(true);
		expect(s.proficiencies.savingThrows.length).toBeGreaterThan(0);
	});

	it("unions gestalt proficiencies into calculateCharacterStats (save/skill bonuses)", () => {
		const base = {
			level: 8, // proficiency bonus +3
			abilities: { STR: 10, AGI: 10, VIT: 10, INT: 10, SENSE: 10, PRE: 10 },
			savingThrowProficiencies: [] as Array<
				"STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE"
			>,
			skillProficiencies: [] as string[],
			skillExpertise: [] as string[],
		};
		const without = calculateCharacterStats(base);
		const withGestalt = calculateCharacterStats({
			...base,
			gestaltSavingThrowProficiencies: ["SENSE", "PRE"],
			gestaltSkillProficiencies: ["stealth", "arcana"],
		});
		// All scores are 10 (mod 0); PB is +3 at level 8.
		expect(without.savingThrows.SENSE).toBe(0);
		expect(withGestalt.savingThrows.SENSE).toBe(3);
		expect(withGestalt.savingThrows.PRE).toBe(3);
		expect(without.skills.stealth).toBe(0);
		expect(withGestalt.skills.stealth).toBe(3);
		expect(withGestalt.skills.arcana).toBe(3);
		// Non-granted save unaffected.
		expect(withGestalt.savingThrows.STR).toBe(0);
	});

	it("accepts a custom dataset for homebrew / tests", () => {
		const fake: Regent[] = [
			{
				id: "test_regent",
				name: "Test Regent",
				hit_dice: "1d10",
				saving_throws: ["Strength"],
				skill_proficiencies: ["Stealth"],
				class_features: [
					{ level: 1, name: "A", description: "", type: "passive" },
					{ level: 5, name: "B", description: "", type: "passive" },
				],
			} as Regent,
		];
		const s = computeGestaltSummary(["test_regent"], 3, fake);
		expect(s.active).toBe(true);
		expect(s.regentHitDieContribution).toBe(10);
		expect(s.proficiencies.savingThrows).toContain("STR");
		expect(s.proficiencies.skills).toContain("stealth");
		expect(s.features).toHaveLength(1); // only level-1 feature at char level 3
	});
});
