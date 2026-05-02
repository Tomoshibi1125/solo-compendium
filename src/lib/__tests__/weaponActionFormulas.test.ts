import { describe, expect, it } from "vitest";
import { resolveWeaponActionFormula } from "@/lib/weaponActionFormulas";
import type { AbilityScore } from "@/types/core-rules";

const baseAbilities: Record<AbilityScore, number> = {
	STR: 16,
	AGI: 10,
	VIT: 12,
	INT: 10,
	SENSE: 10,
	PRE: 10,
};

describe("weapon action formulas", () => {
	it("uses STR for normal melee weapon attacks and damage", () => {
		const formula = resolveWeaponActionFormula({
			abilities: baseAbilities,
			proficiencyBonus: 2,
			proficient: true,
			isRanged: false,
			isFinesse: false,
			damageDice: "1d8",
		});

		expect(formula.ability).toBe("STR");
		expect(formula.attackBonus).toBe(5);
		expect(formula.attackRoll).toBe("1d20+5");
		expect(formula.damageRoll).toBe("1d8+3");
	});

	it("uses AGI for ranged weapon attacks and damage", () => {
		const formula = resolveWeaponActionFormula({
			abilities: {
				...baseAbilities,
				STR: 20,
				AGI: 14,
			},
			proficiencyBonus: 2,
			proficient: true,
			isRanged: true,
			isFinesse: false,
			damageDice: "1d6",
		});

		expect(formula.ability).toBe("AGI");
		expect(formula.attackBonus).toBe(4);
		expect(formula.attackRoll).toBe("1d20+4");
		expect(formula.damageRoll).toBe("1d6+2");
	});

	it("uses the better STR or AGI modifier for finesse weapons", () => {
		const formula = resolveWeaponActionFormula({
			abilities: {
				...baseAbilities,
				STR: 12,
				AGI: 18,
			},
			proficiencyBonus: 3,
			proficient: true,
			isRanged: false,
			isFinesse: true,
			damageDice: "1d8",
		});

		expect(formula.ability).toBe("AGI");
		expect(formula.attackBonus).toBe(7);
		expect(formula.attackRoll).toBe("1d20+7");
		expect(formula.damageRoll).toBe("1d8+4");
	});

	it("preserves flat magical and sigil bonuses without treating requirements as bonuses", () => {
		const formula = resolveWeaponActionFormula({
			abilities: baseAbilities,
			proficiencyBonus: 2,
			proficient: true,
			isRanged: false,
			isFinesse: false,
			damageDice: "1d8",
			attackBonus: 1,
			damageBonus: "+2",
		});

		expect(formula.abilityModifier).toBe(3);
		expect(formula.attackBonus).toBe(6);
		expect(formula.damageRoll).toBe("1d8+5");
	});

	it("uses dice formulas for low-damage weapons like blowguns", () => {
		const formula = resolveWeaponActionFormula({
			abilities: {
				...baseAbilities,
				AGI: 16,
			},
			proficiencyBonus: 2,
			proficient: true,
			isRanged: true,
			isFinesse: false,
			damageDice: "1d4",
		});

		expect(formula.ability).toBe("AGI");
		expect(formula.attackBonus).toBe(5);
		expect(formula.damageRoll).toBe("1d4+3");
	});
});
