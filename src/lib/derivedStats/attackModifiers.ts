import { type AbilityScore, getAbilityModifier } from "@/types/core-rules";

export function calculateAttackModifier(input: {
	abilityModifier: number;
	proficiencyBonus: number;
	proficient: boolean;
	bonus?: number;
}): number {
	return (
		input.abilityModifier +
		(input.proficient ? input.proficiencyBonus : 0) +
		(input.bonus ?? 0)
	);
}

export function chooseWeaponAttackAbility(input: {
	abilities: Record<AbilityScore, number>;
	isRanged: boolean;
	isFinesse: boolean;
}): AbilityScore {
	if (!input.isFinesse) return input.isRanged ? "AGI" : "STR";
	return getAbilityModifier(input.abilities.AGI) >
		getAbilityModifier(input.abilities.STR)
		? "AGI"
		: "STR";
}
