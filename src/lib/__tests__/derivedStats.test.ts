import { describe, expect, it } from "vitest";
import type { CustomModifier } from "@/lib/customModifiers";
import {
	calculateArmorClassStack,
	calculateAttackModifier,
	calculateInitiativeBreakdown,
	calculateSavingThrows,
	chooseWeaponAttackAbility,
} from "@/lib/derivedStats";
import type { AbilityScore } from "@/types/core-rules";

function modifier(partial: Partial<CustomModifier>): CustomModifier {
	return {
		id: partial.id ?? crypto.randomUUID(),
		type: partial.type ?? "bonus",
		target: partial.target ?? null,
		value: partial.value ?? 0,
		source: partial.source ?? "test",
		condition: partial.condition ?? null,
		enabled: partial.enabled ?? true,
	};
}

const abilities: Record<AbilityScore, number> = {
	STR: 14,
	AGI: 16,
	VIT: 12,
	INT: 10,
	SENSE: 8,
	PRE: 18,
};

describe("derived stat helpers", () => {
	it("calculates initiative bonuses and advantage state", () => {
		const result = calculateInitiativeBreakdown({
			agilityScore: 16,
			baseInitiative: 3,
			customModifiers: [
				modifier({ type: "initiative", value: 2 }),
				modifier({ type: "initiative_bonus", value: 1 }),
				modifier({ type: "advantage", target: "initiative", value: 0 }),
			],
		});

		expect(result.finalInitiative).toBe(6);
		expect(result.calculatedStatsInitiative).toBe(5);
		expect(result.advantage).toBe("advantage");
	});

	it("calculates saving throws from abilities, proficiencies, and custom saves", () => {
		const result = calculateSavingThrows({
			abilities,
			savingThrowProficiencies: ["STR", "PRE"],
			proficiencyBonus: 3,
			customModifiers: [
				modifier({ type: "save", target: "STR", value: 1 }),
				modifier({ type: "save", target: "all", value: 2 }),
				modifier({ type: "save", target: "AGI", value: 99, enabled: false }),
			],
		});

		expect(result).toEqual({
			STR: 8,
			AGI: 5,
			VIT: 3,
			INT: 2,
			SENSE: 1,
			PRE: 9,
		});
	});

	it("calculates armor-class stack values without changing displayed AC semantics", () => {
		const result = calculateArmorClassStack({
			baseArmorClass: 12,
			agilityScore: 16,
			sigilArmorClass: 15,
			customModifiers: [
				modifier({ type: "ac", value: 1 }),
				modifier({ type: "ac_bonus", value: 2 }),
				modifier({ type: "ac_base", value: 13 }),
			],
		});

		expect(result.featureArmorClass).toBe(18);
		expect(result.displayedArmorClass).toBe(16);
		expect(result.customAcBonus).toBe(1);
	});

	it("calculates attack modifiers and weapon attack ability choices", () => {
		expect(
			calculateAttackModifier({
				abilityModifier: 3,
				proficiencyBonus: 4,
				proficient: true,
				bonus: 1,
			}),
		).toBe(8);
		expect(
			calculateAttackModifier({
				abilityModifier: 3,
				proficiencyBonus: 4,
				proficient: false,
			}),
		).toBe(3);
		expect(
			chooseWeaponAttackAbility({
				abilities,
				isRanged: false,
				isFinesse: true,
			}),
		).toBe("AGI");
		expect(
			chooseWeaponAttackAbility({
				abilities,
				isRanged: true,
				isFinesse: false,
			}),
		).toBe("AGI");
		expect(
			chooseWeaponAttackAbility({
				abilities,
				isRanged: false,
				isFinesse: false,
			}),
		).toBe("STR");
	});
});
