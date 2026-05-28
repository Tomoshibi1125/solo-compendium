import { type CustomModifier, sumCustomModifiers } from "@/lib/customModifiers";
import { getAbilityModifier } from "@/types/core-rules";

export interface ArmorClassStack {
	featureArmorClass: number;
	displayedArmorClass: number;
	featureACBonus: number;
	baseACValue: number;
	customAcBonus: number;
}

/**
 * Legacy feature-stacking AC calculator.
 *
 * **Canonical AC is now via `acFormulas.ts:getArmorClass` / the canonical
 * `calculateAC` path in `useArmorClass.ts`.** This stack still produces
 * the feature- and custom-modifier bonus terms that feed *into* the
 * canonical calculator (as `miscACBonus`), so it remains useful as a
 * bonus aggregator — just no longer the source of the displayed AC.
 *
 * @deprecated for direct AC consumption — read `armorClassDetail.total`
 * from the derived-stats hook instead. The bonus fields
 * (`featureACBonus`, `customAcBonus`) are still consumed by the
 * canonical calculator.
 */
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
