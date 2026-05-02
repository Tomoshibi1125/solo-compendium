/**
 * Power action formula regression tests (DDB / 5e parity).
 *
 * Locks in:
 *   - canonical RA job → casting ability mapping for power actions
 *   - 8 + PB + ability_mod save DCs
 *   - PB + ability_mod attack bonuses
 *   - additive equipment/sigil/custom bonuses
 *   - PRE fallback for non-casters with innate powers
 *   - explicit ability override (e.g. an item that says "uses STR")
 */
import { describe, expect, it } from "vitest";
import {
	resolvePowerActionFormula,
	resolvePowerCastingAbility,
} from "@/lib/powerActionFormulas";
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

describe("resolvePowerCastingAbility — canonical primary stat per job", () => {
	it.each([
		["Destroyer", "STR"],
		["Berserker", "STR"],
		["Assassin", "AGI"],
		["Striker", "AGI"],
		["Mage", "INT"],
		["Revenant", "INT"],
		["Technomancer", "INT"],
		["Herald", "SENSE"],
		["Summoner", "SENSE"],
		["Stalker", "SENSE"],
		["Esper", "PRE"],
		["Contractor", "PRE"],
		["Holy Knight", "PRE"],
		["Idol", "PRE"],
	] as const)("maps %s → %s", (job, expected) => {
		expect(resolvePowerCastingAbility(job)).toBe(expected);
	});

	it("falls back to PRE only for null/undefined/unknown jobs", () => {
		expect(resolvePowerCastingAbility(null)).toBe("PRE");
		expect(resolvePowerCastingAbility(undefined)).toBe("PRE");
		expect(resolvePowerCastingAbility("Definitely Not A Job")).toBe("PRE");
	});

	it("respects explicit ability override (item/feature says 'uses STR')", () => {
		expect(resolvePowerCastingAbility("Mage", "STR")).toBe("STR");
		expect(resolvePowerCastingAbility("Destroyer", "AGI")).toBe("AGI");
	});
});

describe("resolvePowerActionFormula", () => {
	it("Mage L1 INT 18 → +6 attack, DC 14", () => {
		const r = resolvePowerActionFormula({
			job: "Mage",
			abilities: baseAbilities({ INT: 18 }),
			proficiencyBonus: 2,
		});
		expect(r.ability).toBe("INT");
		expect(r.abilityModifier).toBe(4);
		expect(r.attackBonus).toBe(6);
		expect(r.saveDC).toBe(14);
	});

	it("Holy Knight L17 PRE 20 → +11 attack, DC 19", () => {
		const r = resolvePowerActionFormula({
			job: "Holy Knight",
			abilities: baseAbilities({ PRE: 20 }),
			proficiencyBonus: 6,
		});
		expect(r.ability).toBe("PRE");
		expect(r.attackBonus).toBe(11);
		expect(r.saveDC).toBe(19);
	});

	it("Herald L5 SENSE 16 → +6 attack, DC 14 (NOT INT)", () => {
		// Regression: prior implementation hard-coded SENSE/INT only and
		// would have used SENSE here for the wrong reason. Lock in via the
		// canonical job mapping.
		const r = resolvePowerActionFormula({
			job: "Herald",
			abilities: baseAbilities({ SENSE: 16, INT: 8 }),
			proficiencyBonus: 3,
		});
		expect(r.ability).toBe("SENSE");
		expect(r.attackBonus).toBe(6);
		expect(r.saveDC).toBe(14);
	});

	it("Esper L1 PRE 16 → +5 attack, DC 13 (NOT SENSE)", () => {
		// Regression: prior implementation defaulted to SENSE, which would
		// have given Esper the wrong DC entirely. Esper is a PRE caster.
		const r = resolvePowerActionFormula({
			job: "Esper",
			abilities: baseAbilities({ PRE: 16, SENSE: 8 }),
			proficiencyBonus: 2,
		});
		expect(r.ability).toBe("PRE");
		expect(r.attackBonus).toBe(5);
		expect(r.saveDC).toBe(13);
	});

	it("Contractor L9 PRE 18 → +8 attack, DC 16", () => {
		const r = resolvePowerActionFormula({
			job: "Contractor",
			abilities: baseAbilities({ PRE: 18 }),
			proficiencyBonus: 4,
		});
		expect(r.ability).toBe("PRE");
		expect(r.attackBonus).toBe(8);
		expect(r.saveDC).toBe(16);
	});

	it("Destroyer L5 STR 18 → +7 attack, DC 15 (uses STR, not PRE)", () => {
		const r = resolvePowerActionFormula({
			job: "Destroyer",
			abilities: baseAbilities({ STR: 18, PRE: 8 }),
			proficiencyBonus: 3,
		});
		expect(r.ability).toBe("STR");
		expect(r.abilityModifier).toBe(4);
		expect(r.attackBonus).toBe(7);
		expect(r.saveDC).toBe(15);
	});

	it("Berserker L9 STR 20 → +9 attack, DC 17", () => {
		const r = resolvePowerActionFormula({
			job: "Berserker",
			abilities: baseAbilities({ STR: 20, PRE: 8 }),
			proficiencyBonus: 4,
		});
		expect(r.ability).toBe("STR");
		expect(r.attackBonus).toBe(9);
		expect(r.saveDC).toBe(17);
	});

	it("Assassin L5 AGI 18 → +7 attack, DC 15 (uses AGI, not PRE)", () => {
		const r = resolvePowerActionFormula({
			job: "Assassin",
			abilities: baseAbilities({ AGI: 18, PRE: 8 }),
			proficiencyBonus: 3,
		});
		expect(r.ability).toBe("AGI");
		expect(r.attackBonus).toBe(7);
		expect(r.saveDC).toBe(15);
	});

	it("Striker L13 AGI 20 → +10 attack, DC 18", () => {
		const r = resolvePowerActionFormula({
			job: "Striker",
			abilities: baseAbilities({ AGI: 20, PRE: 8 }),
			proficiencyBonus: 5,
		});
		expect(r.ability).toBe("AGI");
		expect(r.attackBonus).toBe(10);
		expect(r.saveDC).toBe(18);
	});

	it("adds equipment / sigil / custom attack and DC bonuses on top", () => {
		const r = resolvePowerActionFormula({
			job: "Mage",
			abilities: baseAbilities({ INT: 18 }),
			proficiencyBonus: 2,
			attackBonus: 1,
			dcBonus: 2,
		});
		expect(r.attackBonus).toBe(7); // 6 + 1
		expect(r.saveDC).toBe(16); // 14 + 2
	});

	it("respects ability override (item-granted 'uses STR' power)", () => {
		const r = resolvePowerActionFormula({
			job: "Mage",
			abilities: baseAbilities({ INT: 8, STR: 18 }),
			proficiencyBonus: 2,
			abilityOverride: "STR",
		});
		expect(r.ability).toBe("STR");
		expect(r.attackBonus).toBe(6);
		expect(r.saveDC).toBe(14);
	});

	it("clamps to 10 when ability score is missing (mod 0)", () => {
		const r = resolvePowerActionFormula({
			job: "Mage",
			abilities: { ...baseAbilities(), INT: 10 },
			proficiencyBonus: 2,
		});
		expect(r.attackBonus).toBe(2);
		expect(r.saveDC).toBe(10);
	});
});
