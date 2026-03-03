import {
	type AdvantageState as ConditionAdvantageState,
	resolveRollModifiers,
} from "@/lib/conditionEffects";
import {
	type AdvantageState as CustomAdvantageState,
	type CustomModifier,
	resolveAdvantageFromCustomModifiers,
} from "@/lib/customModifiers";

export type AdvantageState = ConditionAdvantageState | CustomAdvantageState;

export function combineAdvantageStates(
	states: AdvantageState[],
): AdvantageState {
	let hasAdv = false;
	let hasDis = false;

	for (const state of states) {
		if (state === "advantage") hasAdv = true;
		if (state === "disadvantage") hasDis = true;
	}

	if (hasAdv && hasDis) return "normal";
	if (hasAdv) return "advantage";
	if (hasDis) return "disadvantage";
	return "normal";
}

export function resolveAdvantageForRoll(params: {
	conditions: string[];
	exhaustionLevel: number;
	rollType:
		| "attack_rolls"
		| "ability_checks"
		| "saving_throws"
		| "AGI_saves"
		| "STR_saves"
		| "VIT_saves"
		| "INT_saves"
		| "SENSE_saves"
		| "PRE_saves";
	customModifiers: CustomModifier[];
	customTargets?: Array<string | null | undefined>;
	uiOverride?: AdvantageState;
}): AdvantageState {
	const {
		conditions,
		exhaustionLevel,
		rollType,
		customModifiers,
		customTargets,
		uiOverride,
	} = params;

	const condType =
		rollType === "AGI_saves" || rollType === "STR_saves" ? rollType : rollType;
	const conditionMods = resolveRollModifiers(
		conditions,
		exhaustionLevel,
		condType as never,
	);
	const featureAdv = resolveAdvantageFromCustomModifiers(customModifiers, [
		rollType,
		...(customTargets ?? []),
	]);

	return combineAdvantageStates([
		conditionMods.advantageState,
		featureAdv,
		uiOverride ?? "normal",
	]);
}
