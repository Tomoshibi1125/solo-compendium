/**
 * Backward-compatible facade over the authoritative condition vocabulary in
 * conditionEffects.ts. New mechanical consumers should import that module
 * directly; this adapter preserves the character-sheet predicate API.
 */
import {
	CONDITION_EFFECTS,
	EXHAUSTION_TABLE,
	getExecutableConditionEffects,
	hasConditionMechanicalEffect,
	type MechanicalEffect,
} from "./conditionEffects";

export {
	CONDITION_CATALOG_IDS,
	CONDITION_EFFECTS,
	EXHAUSTION_TABLE,
	getConditionEffect,
	getExecutableConditionEffects,
	normalizeConditionId,
} from "./conditionEffects";

function normalizeLegacyTarget(value: string): string {
	switch (value.trim().toLowerCase()) {
		case "attack":
			return "attack_rolls";
		case "ability-check":
			return "ability_checks";
		case "agi-save":
			return "AGI_saves";
		case "str-save":
			return "STR_saves";
		case "sight-checks":
			return "sight_checks";
		case "hearing-checks":
			return "hearing_checks";
		default:
			return value;
	}
}

function firstSpeedModifier(
	effects: readonly MechanicalEffect[],
): number | "zero" | null {
	if (effects.some((effect) => effect.type === "speed_zero")) return "zero";
	const halved = effects.find((effect) => effect.type === "speed_halved");
	if (halved) return 0.5;
	const modifier = effects.find(
		(effect) => effect.type === "modifier" && effect.target === "speed",
	);
	return modifier?.value ?? null;
}

export function getActiveConditionEffects(conditions: string[]): {
	hasDisadvantage: (type: string) => boolean;
	hasAdvantageAgainst: (type: string) => boolean;
	cantTakeAction: (action: string) => boolean;
	autoFails: (check: string) => boolean;
	speedModifier: number | "zero" | null;
	isIncapacitated: boolean;
} {
	const effects = getExecutableConditionEffects(conditions);
	return {
		hasDisadvantage: (type: string) =>
			hasConditionMechanicalEffect(
				conditions,
				"disadvantage",
				normalizeLegacyTarget(type),
			),
		hasAdvantageAgainst: (type: string) =>
			hasConditionMechanicalEffect(
				conditions,
				"advantage",
				type === "attack"
					? "incoming_attack_rolls"
					: normalizeLegacyTarget(type),
				"against",
			),
		cantTakeAction: (action: string) =>
			hasConditionMechanicalEffect(conditions, "prohibited_action", action),
		autoFails: (check: string) =>
			hasConditionMechanicalEffect(
				conditions,
				"auto_fail",
				normalizeLegacyTarget(check),
			),
		speedModifier: firstSpeedModifier(effects),
		isIncapacitated: hasConditionMechanicalEffect(conditions, "incapacitated"),
	};
}

// Keep these imports visibly referenced for consumers that historically
// introspected this module while migrating to the authority module.
void CONDITION_EFFECTS;
void EXHAUSTION_TABLE;
