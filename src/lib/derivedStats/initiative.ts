import {
	type CustomModifier,
	resolveAdvantageFromCustomModifiers,
	sumCustomModifiers,
} from "@/lib/customModifiers";
import { getAbilityModifier } from "@/types/core-rules";

export interface InitiativeBreakdown {
	finalInitiative: number;
	calculatedStatsInitiative: number;
	advantage: "normal" | "advantage" | "disadvantage";
	initiativeBonus: number;
	initiativeOnlyBonus: number;
}

export function calculateInitiativeBreakdown(input: {
	agilityScore: number;
	baseInitiative: number;
	customModifiers: CustomModifier[];
}): InitiativeBreakdown {
	const advantage = resolveAdvantageFromCustomModifiers(input.customModifiers, [
		"initiative",
		"initiative_advantage",
	]);
	const initiativeOnlyBonus = sumCustomModifiers(
		input.customModifiers,
		"initiative",
	);
	const initiativeBonus =
		initiativeOnlyBonus +
		sumCustomModifiers(input.customModifiers, "initiative_bonus");

	return {
		finalInitiative: getAbilityModifier(input.agilityScore) + initiativeBonus,
		calculatedStatsInitiative: input.baseInitiative + initiativeOnlyBonus,
		advantage,
		initiativeBonus,
		initiativeOnlyBonus,
	};
}
