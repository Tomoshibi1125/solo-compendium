import { type CustomModifier, sumCustomModifiers } from "@/lib/customModifiers";
import { getAbilityModifier } from "@/types/core-rules";

export interface ArmorClassStack {
	featureArmorClass: number;
	displayedArmorClass: number;
	featureACBonus: number;
	baseACValue: number;
	customAcBonus: number;
}

export function calculateArmorClassStack(input: {
	baseArmorClass: number;
	agilityScore: number;
	sigilArmorClass: number;
	customModifiers: CustomModifier[];
}): ArmorClassStack {
	const featureACBonus = sumCustomModifiers(input.customModifiers, "ac_bonus");
	const baseACValue = sumCustomModifiers(input.customModifiers, "ac_base");
	const customAcBonus = sumCustomModifiers(input.customModifiers, "ac");
	let featureArmorClass = input.baseArmorClass + featureACBonus;
	if (baseACValue > 0) {
		featureArmorClass = Math.max(
			featureArmorClass,
			baseACValue + getAbilityModifier(input.agilityScore) + featureACBonus,
		);
	}

	return {
		featureArmorClass,
		displayedArmorClass: input.sigilArmorClass + customAcBonus,
		featureACBonus,
		baseACValue,
		customAcBonus,
	};
}
