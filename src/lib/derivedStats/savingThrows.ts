import { type CustomModifier, sumCustomModifiers } from "@/lib/customModifiers";
import {
	ABILITY_NAMES,
	type AbilityScore,
	getAbilityModifier,
} from "@/types/core-rules";

const ABILITY_KEYS = Object.keys(ABILITY_NAMES) as AbilityScore[];

export function calculateSavingThrows(input: {
	abilities: Record<AbilityScore, number>;
	savingThrowProficiencies?: AbilityScore[] | null;
	proficiencyBonus: number;
	customModifiers: CustomModifier[];
}): Record<AbilityScore, number> {
	const proficiencies = new Set(input.savingThrowProficiencies ?? []);
	return ABILITY_KEYS.reduce(
		(acc, ability) => {
			acc[ability] =
				getAbilityModifier(input.abilities[ability]) +
				(proficiencies.has(ability) ? input.proficiencyBonus : 0) +
				sumCustomModifiers(input.customModifiers, "save", ability);
			return acc;
		},
		{} as Record<AbilityScore, number>,
	);
}
