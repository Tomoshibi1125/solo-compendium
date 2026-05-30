/**
 * DDB Parity Helpers — locked behavior for the P0/P1 remediation pass.
 *
 * Covers the new canonical paths added during the DDB-parity sweep:
 *  - acFormulas.getArmorClass (P0.1 canonical AC entry)
 *  - currency.normalizeWallet (P1.10 overflow cascade)
 *  - upcastScaling.parseUpcastScaling / applyUpcastToFormula (P1.5)
 *  - prerequisites.validatePrereq + parsePrerequisiteText (P1.8)
 *  - experience.checkLevelUpEligibility (P1.11)
 *  - featureEffects.sumHpPerLevel / sumHpFlat + calculateHPMax bake-in (P1.9)
 *  - advancedDiceEngine.applyCritical (P1.3)
 *  - sensesEngine.computePassiveScore + passiveStealth (P0.3 / P1.1)
 */

import { describe, expect, it } from "vitest";
import { calculateHPMax } from "@/lib/5eCharacterCalculations";
import { getArmorClass } from "@/lib/acFormulas";
import { applyCritical, rollCritical } from "@/lib/advancedDiceEngine";
import {
	formatWallet,
	normalizeWallet,
	walletFromLegacy,
	walletTotalBaseUnits,
} from "@/lib/currency";
import { checkLevelUpEligibility } from "@/lib/experience";
import { parsePrerequisiteText, validatePrereq } from "@/lib/prerequisites";
import { computePassiveScore, computeSenses } from "@/lib/sensesEngine";
import { applyUpcastToFormula, parseUpcastScaling } from "@/lib/upcastScaling";
import {
	FEAT_EFFECT_PRESETS,
	type FeatureEffect,
	sumHpFlat,
	sumHpPerLevel,
} from "@/types/featureEffects";

describe("P0.1 — Canonical AC (acFormulas.getArmorClass)", () => {
	it("picks highest of Unarmored vs Berserker UD for a Berserker", () => {
		const result = getArmorClass({
			abilities: { STR: 16, AGI: 14, VIT: 16, INT: 8, SENSE: 10, PRE: 10 },
			job: "Berserker",
		});
		// Unarmored: 10 + AGI(2) = 12
		// Berserker UD: 10 + AGI(2) + VIT(3) = 15
		expect(result.ac).toBe(15);
		expect(result.selectedFormula.id).toBe("berserker_ud");
	});

	it("respects shield +2 stacking on top of Berserker UD", () => {
		const result = getArmorClass({
			abilities: { STR: 16, AGI: 14, VIT: 16, INT: 8, SENSE: 10, PRE: 10 },
			job: "Berserker",
			equippedShield: {
				name: "Shield",
				baseAC: 2,
				armorType: "shield",
				magicBonus: 0,
			},
		});
		expect(result.ac).toBe(17); // 15 + 2 shield
		expect(result.shieldApplied).toBe(true);
	});

	it("picks Mage Armor formula when active and unarmored", () => {
		const result = getArmorClass({
			abilities: { STR: 10, AGI: 14, VIT: 10, INT: 16, SENSE: 10, PRE: 10 },
			job: "Mage",
			mageArmorActive: true,
		});
		// Unarmored: 10 + AGI(2) = 12
		// Mage Armor: 13 + AGI(2) = 15
		expect(result.ac).toBe(15);
		expect(result.selectedFormula.id).toBe("mage_armor");
	});

	it("medium armor caps AGI at +2", () => {
		const result = getArmorClass({
			abilities: { STR: 10, AGI: 18, VIT: 10, INT: 10, SENSE: 10, PRE: 10 },
			job: "Stalker",
			equippedArmor: {
				name: "Aether Plate",
				baseAC: 14,
				armorType: "medium",
				magicBonus: 0,
			},
		});
		// AGI(18)=+4, capped at +2 for medium → 14 + 2 = 16
		expect(result.ac).toBe(16);
	});
});

describe("P1.10 — Currency overflow normalization", () => {
	it("cascades raw mana up to higher denominations", () => {
		const normalized = normalizeWallet({ mana: 250 });
		expect(normalized).toEqual({ core: 0, gate: 2, crystal: 5, mana: 0 });
	});

	it("preserves total value across normalization", () => {
		const wallet = { core: 0, gate: 0, crystal: 0, mana: 1234 };
		const total = walletTotalBaseUnits(wallet);
		const normalized = normalizeWallet(wallet);
		expect(walletTotalBaseUnits(normalized)).toBe(total);
	});

	it("rolls 100 mana up to 1 gate", () => {
		const normalized = normalizeWallet({ mana: 100 });
		expect(normalized.gate).toBe(1);
		expect(normalized.mana).toBe(0);
	});

	it("formats wallet hiding zero denominations", () => {
		expect(formatWallet({ core: 0, gate: 2, crystal: 5, mana: 0 })).toBe(
			"2 GC 5 CrC",
		);
	});

	it("converts legacy wallet keys (pp/gp/sp/cp/ep) to RA shape", () => {
		const wallet = walletFromLegacy({ pp: 1, gp: 2, sp: 3, cp: 4, ep: 2 });
		expect(wallet.core).toBe(1);
		expect(wallet.gate).toBe(2);
		// 3 sp + (2 ep × 5 sp/ep) = 13 sp = 13 crystal
		expect(wallet.crystal).toBe(13);
		expect(wallet.mana).toBe(4);
	});

	it("preserve direction returns input unchanged", () => {
		const wallet = { core: 0, gate: 0, crystal: 0, mana: 250 };
		const normalized = normalizeWallet(wallet, "preserve");
		expect(normalized.mana).toBe(250);
	});
});

describe("P1.5 — Upcast scaling parser", () => {
	it("parses 'Each rank above D adds +1d10 cold' at +2 levels", () => {
		const result = parseUpcastScaling(
			1,
			3,
			"Each rank above D adds +1d10 cold damage",
		);
		expect(result.parsed).toBe(true);
		expect(result.upcastLevels).toBe(2);
		expect(result.additionalDamage).toBe("+2d10");
	});

	it("returns empty additional damage when castAtLevel = base", () => {
		const result = parseUpcastScaling(3, 3, "Each slot above 3rd adds +1d6");
		expect(result.upcastLevels).toBe(0);
		expect(result.additionalDamage).toBe("");
	});

	it("appends upcast to base damage formula", () => {
		const result = applyUpcastToFormula(
			"8d6",
			3,
			5,
			"Each slot above 3rd adds +1d6 fire",
		);
		expect(result).toBe("8d6+2d6");
	});

	it("passes through unchanged when text doesn't match a known pattern", () => {
		const result = applyUpcastToFormula(
			"5d8",
			3,
			5,
			"This spell becomes more thematically intense at higher levels",
		);
		expect(result).toBe("5d8");
	});
});

describe("P1.8 — Prerequisite validation", () => {
	const ctx = {
		level: 5,
		job: "Mage",
		abilities: { STR: 10, AGI: 14, VIT: 12, INT: 16, SENSE: 10, PRE: 10 },
		features: [{ name: "Spellcasting" }],
		proficiencies: ["Light armor"],
	};

	it("returns ok for satisfied prereq", () => {
		const result = validatePrereq({ minAbility: { INT: 13 } }, ctx);
		expect(result.ok).toBe(true);
		expect(result.missing).toEqual([]);
	});

	it("lists missing ability requirements", () => {
		const result = validatePrereq({ minAbility: { STR: 13 } }, ctx);
		expect(result.ok).toBe(false);
		expect(result.missing[0]).toContain("STR 13+");
	});

	it("checks required job", () => {
		const result = validatePrereq({ requiredJob: "Striker" }, ctx);
		expect(result.ok).toBe(false);
		expect(result.missing[0]).toContain("Striker");
	});

	it("parses text prerequisite 'Strength 13 or higher'", () => {
		const spec = parsePrerequisiteText("Strength 13 or higher");
		expect(spec?.minAbility?.STR).toBe(13);
	});

	it("parses multi-segment prerequisite text", () => {
		const spec = parsePrerequisiteText(
			"Dexterity 13 or higher; Proficiency with heavy armor",
		);
		expect(spec?.minAbility?.AGI).toBe(13);
		expect(spec?.requiredProficiency).toContain("heavy armor");
	});
});

describe("P1.11 — XP threshold eligibility", () => {
	it("flags eligibility when XP crosses level threshold", () => {
		// L1 = 0, L2 = 300, L3 = 900
		const result = checkLevelUpEligibility(1, 350, "xp");
		expect(result.canLevelUp).toBe(true);
		expect(result.availableLevel).toBe(2);
	});

	it("returns false in milestone mode regardless of XP", () => {
		const result = checkLevelUpEligibility(1, 100000, "milestone");
		expect(result.canLevelUp).toBe(false);
	});

	it("returns 0 xpToNext at level 20", () => {
		const result = checkLevelUpEligibility(20, 999999, "xp");
		expect(result.canLevelUp).toBe(false);
		expect(result.xpToNext).toBe(0);
	});

	it("reports correct xpToNext between thresholds", () => {
		// L1 → L2 needs 300 XP
		const result = checkLevelUpEligibility(1, 100, "xp");
		expect(result.canLevelUp).toBe(false);
		expect(result.xpToNext).toBe(200);
	});
});

describe("P1.9 — Structured feat effect bake-in", () => {
	it("Tough preset adds +2 HP per level", () => {
		const tough = FEAT_EFFECT_PRESETS.Tough;
		expect(sumHpPerLevel(tough)).toBe(2);
	});

	it("calculateHPMax bakes hp_per_level into the total", () => {
		// Level 5 Berserker (d12), VIT +3, no feats:
		//   L1: 12 + 3 = 15
		//   L2-5: 4 × (6 + 1 + 3) = 4 × 10 = 40
		//   Total: 55
		const base = calculateHPMax(5, 12, 3);
		expect(base).toBe(55);

		// Same character with Tough: +2/level × 5 levels = +10
		const withTough = calculateHPMax(5, 12, 3, FEAT_EFFECT_PRESETS.Tough);
		expect(withTough).toBe(65);
	});

	it("calculateHPMax bakes hp_flat as a one-time bump", () => {
		const flat: FeatureEffect[] = [{ kind: "hp_flat", value: 10 }];
		expect(sumHpFlat(flat)).toBe(10);
		const result = calculateHPMax(5, 12, 3, flat);
		expect(result).toBe(65); // base 55 + flat 10
	});

	it("returns base value when no structured effects supplied", () => {
		expect(calculateHPMax(5, 12, 3)).toBe(55);
		expect(calculateHPMax(5, 12, 3, null)).toBe(55);
		expect(calculateHPMax(5, 12, 3, [])).toBe(55);
	});
});

describe("P1.3 — Critical hit dice doubling", () => {
	it("rollCritical doubles dice count when isCritical=true", () => {
		const result = rollCritical("4d6", true);
		expect(result.rolls.length).toBe(8);
		expect(result.criticalMultiplier).toBe(2);
	});

	it("applyCritical adds a second set of dice to an existing roll", () => {
		const base = {
			formula: "2d8",
			rolls: [4, 5],
			modifier: 3,
			total: 9,
			result: 12,
			isNatural20: false,
			isNatural1: false,
		};
		const crit = applyCritical(base);
		expect(crit.rolls.length).toBe(4); // 2 original + 2 new
		expect(crit.criticalMultiplier).toBe(2);
		// total counts all dice; result adds the modifier on top
		expect(crit.result).toBe(crit.total + 3);
	});
});

describe("P0.3 / P1.1 — Passive scores canonical formula + stealth", () => {
	it("computePassiveScore is 10 + skill modifier", () => {
		expect(computePassiveScore(5)).toBe(15);
		expect(computePassiveScore(0)).toBe(10);
		expect(computePassiveScore(-1)).toBe(9);
	});

	it("computePassiveScore applies flat bonus (Observant +5)", () => {
		expect(computePassiveScore(5, 5)).toBe(20);
	});

	it("computeSenses exposes all four passives including stealth", () => {
		const senses = computeSenses(
			null, // job
			null, // path
			[], // regents
			[],
			[],
			3, // SENSE mod
			2, // INT mod
			2, // prof
			true, // perception proficient
			false, // investigation
			false, // insight
			false, // perception expertise
			false, // observant
			2, // dex/agi mod
			true, // stealth proficient
			false, // stealth expertise
		);
		expect(senses.passivePerception).toBe(15); // 10 + 3 + 2
		expect(senses.passiveInvestigation).toBe(12); // 10 + 2
		expect(senses.passiveInsight).toBe(13); // 10 + 3
		expect(senses.passiveStealth).toBe(14); // 10 + 2 + 2
	});
});
