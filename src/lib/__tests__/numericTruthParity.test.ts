import { describe, expect, it } from "vitest";
import {
	type CasterType,
	getSpellcastingAbility,
	getSpellSlotsPerLevel,
} from "@/lib/5eCharacterCalculations";
import {
	getAbilityModifier as engAbilityMod,
	getProficiencyBonus as engProf,
} from "@/lib/5eRulesEngine";
import { getSpellcastingAbilityForJob } from "@/lib/characterEngine";
import { getCRXP } from "@/lib/experience";
import { getMonsterCrStats } from "@/lib/monster5eTable";
import { getRegentHpContribution } from "@/lib/regentGestalt";
import {
	getAbilityModifier as coreAbilityMod,
	getProficiencyBonus as coreProf,
} from "@/types/core-rules";

/**
 * Numeric-truth + anti-drift guard. Locks the canonical RA/5e formulas that
 * surface in the UI and asserts the (intentionally) duplicated implementations
 * cannot silently diverge. Display formatting is covered elsewhere; this is
 * about the NUMBERS being canon-correct everywhere they are computed.
 */

const JOBS = [
	"Mage",
	"Revenant",
	"Technomancer",
	"Herald",
	"Summoner",
	"Stalker",
	"Esper",
	"Contractor",
	"Holy Knight",
	"Idol",
	"Destroyer",
	"Berserker",
	"Assassin",
	"Striker",
];

describe("numeric truth — canonical formulas", () => {
	it("proficiency bonus = ceil(level/4)+1 at tier boundaries", () => {
		expect(coreProf(1)).toBe(2);
		expect(coreProf(4)).toBe(2);
		expect(coreProf(5)).toBe(3);
		expect(coreProf(8)).toBe(3);
		expect(coreProf(9)).toBe(4);
		expect(coreProf(13)).toBe(5);
		expect(coreProf(17)).toBe(6);
		expect(coreProf(20)).toBe(6);
	});

	it("ability modifier = floor((score-10)/2)", () => {
		expect(coreAbilityMod(10)).toBe(0);
		expect(coreAbilityMod(8)).toBe(-1);
		expect(coreAbilityMod(1)).toBe(-5);
		expect(coreAbilityMod(20)).toBe(5);
		expect(coreAbilityMod(15)).toBe(2);
	});

	it("full-caster spell slots match the 5e table (L1, L5)", () => {
		const l1 = getSpellSlotsPerLevel("full" as CasterType, 1);
		expect(l1[1]).toBe(2);
		const l5 = getSpellSlotsPerLevel("full" as CasterType, 5);
		expect(l5[1]).toBe(4);
		expect(l5[2]).toBe(3);
		expect(l5[3]).toBe(2);
	});

	it("gestalt regent HP is additive: full die at L1, avg(die)=floor(d/2)+1 after", () => {
		expect(getRegentHpContribution(8, 1)).toBe(8);
		expect(getRegentHpContribution(8, 2)).toBe(8 + 5);
		expect(getRegentHpContribution(10, 3)).toBe(10 + 6 + 6);
		expect(getRegentHpContribution(0, 5)).toBe(0);
	});

	it("monster CR proficiency + XP match the 5e table", () => {
		expect(getMonsterCrStats("1")?.proficiency_bonus).toBe(2);
		expect(getMonsterCrStats("5")?.proficiency_bonus).toBe(3);
		expect(getCRXP("1")).toBe(200);
		expect(getCRXP("5")).toBe(1800);
	});
});

describe("numeric anti-drift — duplicated implementations must agree", () => {
	it("core-rules and 5eRulesEngine proficiency/ability-mod are identical", () => {
		for (let lvl = 1; lvl <= 20; lvl++) {
			expect(coreProf(lvl)).toBe(engProf(lvl));
		}
		for (let score = 1; score <= 30; score++) {
			expect(coreAbilityMod(score)).toBe(engAbilityMod(score));
		}
	});

	it("the two job→spellcasting-ability maps agree for all 14 jobs", () => {
		for (const job of JOBS) {
			expect(getSpellcastingAbility(job)).toBe(
				getSpellcastingAbilityForJob(job),
			);
		}
	});
});
