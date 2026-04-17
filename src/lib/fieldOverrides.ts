/**
 * Per-Field Override System
 * Allows manual overrides on any derived character stat (AC, initiative, speed, etc.).
 * Equivalent to DDB's "Customize" sidebar.
 *
 * Two modes:
 * - "replace": Override the calculated value entirely
 * - "bonus": Add a flat bonus on top of the calculated value
 *
 * Overrides are stored as JSON on the character record.
 * UI should show overridden fields with a visual indicator (gold border / ⚙ icon).
 *
 * All functions are pure — callers provide state, functions return results.
 */

import type { CalculatedStats } from "./5eCharacterCalculations";

// ── Types ─────────────────────────────────────────────────────────────

export interface FieldOverride {
	/** Dot-path to the field, e.g. "armorClass", "initiative", "skills.stealth" */
	field: string;
	/** How to apply the override */
	mode: "replace" | "bonus";
	/** The override value */
	value: number;
	/** Optional reason for the override */
	reason?: string;
	/** Toggle on/off without deleting */
	active: boolean;
}

export interface OverrideResult {
	/** The final value after applying overrides */
	finalValue: number;
	/** Whether this field has any active overrides */
	isOverridden: boolean;
	/** List of active overrides on this field */
	overrides: FieldOverride[];
	/** The value before overrides were applied */
	calculatedValue: number;
}

// ── Single Field Override ─────────────────────────────────────────────

/**
 * Apply overrides to a single calculated field.
 *
 * If multiple overrides exist for the same field:
 * - "replace" overrides: the last active one wins
 * - "bonus" overrides: all are summed
 *
 * "replace" is applied first, then "bonus" is added on top.
 */
export function applyFieldOverride(
	calculatedValue: number,
	overrides: FieldOverride[],
	fieldName: string,
): OverrideResult {
	const fieldOverrides = overrides.filter(
		(o) => o.field === fieldName && o.active,
	);

	if (fieldOverrides.length === 0) {
		return {
			finalValue: calculatedValue,
			isOverridden: false,
			overrides: [],
			calculatedValue,
		};
	}

	let baseValue = calculatedValue;

	// Apply "replace" overrides (last one wins)
	const replaces = fieldOverrides.filter((o) => o.mode === "replace");
	if (replaces.length > 0) {
		baseValue = replaces[replaces.length - 1].value;
	}

	// Apply "bonus" overrides (sum all)
	const bonuses = fieldOverrides.filter((o) => o.mode === "bonus");
	const totalBonus = bonuses.reduce((sum, o) => sum + o.value, 0);

	return {
		finalValue: baseValue + totalBonus,
		isOverridden: true,
		overrides: fieldOverrides,
		calculatedValue,
	};
}

// ── Bulk Override Application ─────────────────────────────────────────

/** Fields on CalculatedStats that can be overridden */
const OVERRIDABLE_NUMERIC_FIELDS: Array<keyof CalculatedStats> = [
	"proficiencyBonus",
	"riftFavorDie",
	"riftFavorMax",
	"initiative",
	"armorClass",
	"speed",
	"passivePerception",
	"carryingCapacity",
	"spellSaveDC",
	"spellAttackBonus",
];

/**
 * Apply all overrides to a CalculatedStats object.
 * Returns a new object with overrides applied and a list of overridden field names.
 */
export function applyOverrides(
	calculatedStats: CalculatedStats,
	overrides: FieldOverride[],
): CalculatedStats & { overriddenFields: string[] } {
	const result = { ...calculatedStats } as CalculatedStats & {
		overriddenFields: string[];
	};
	result.overriddenFields = [];

	if (!overrides || overrides.length === 0) {
		return result;
	}

	// Apply top-level numeric field overrides
	for (const field of OVERRIDABLE_NUMERIC_FIELDS) {
		const current = calculatedStats[field];
		if (typeof current !== "number" && current !== null) continue;

		const overrideResult = applyFieldOverride(
			(current as number) ?? 0,
			overrides,
			field,
		);
		if (overrideResult.isOverridden) {
			(result as unknown as Record<string, unknown>)[field] =
				overrideResult.finalValue;
			result.overriddenFields.push(field);
		}
	}

	// Apply ability modifier overrides (e.g., "abilityModifiers.STR")
	const abilityKeys = ["STR", "AGI", "VIT", "INT", "SENSE", "PRE"] as const;
	result.abilityModifiers = { ...calculatedStats.abilityModifiers };
	for (const ability of abilityKeys) {
		const fieldName = `abilityModifiers.${ability}`;
		const overrideResult = applyFieldOverride(
			calculatedStats.abilityModifiers[ability],
			overrides,
			fieldName,
		);
		if (overrideResult.isOverridden) {
			result.abilityModifiers[ability] = overrideResult.finalValue;
			result.overriddenFields.push(fieldName);
		}
	}

	// Apply saving throw overrides (e.g., "savingThrows.STR")
	result.savingThrows = { ...calculatedStats.savingThrows };
	for (const ability of abilityKeys) {
		const fieldName = `savingThrows.${ability}`;
		const overrideResult = applyFieldOverride(
			calculatedStats.savingThrows[ability],
			overrides,
			fieldName,
		);
		if (overrideResult.isOverridden) {
			result.savingThrows[ability] = overrideResult.finalValue;
			result.overriddenFields.push(fieldName);
		}
	}

	// Apply skill overrides (e.g., "skills.stealth")
	result.skills = { ...calculatedStats.skills };
	for (const [skillName, skillValue] of Object.entries(
		calculatedStats.skills,
	)) {
		const fieldName = `skills.${skillName}`;
		const overrideResult = applyFieldOverride(skillValue, overrides, fieldName);
		if (overrideResult.isOverridden) {
			result.skills[skillName] = overrideResult.finalValue;
			result.overriddenFields.push(fieldName);
		}
	}

	return result;
}

// ── Override Management ───────────────────────────────────────────────

/** Create a new field override */
export function createOverride(
	field: string,
	mode: "replace" | "bonus",
	value: number,
	reason?: string,
): FieldOverride {
	return {
		field,
		mode,
		value,
		reason: reason ?? "",
		active: true,
	};
}

/** Toggle an override on/off */
export function toggleOverride(
	overrides: FieldOverride[],
	field: string,
	active: boolean,
): FieldOverride[] {
	return overrides.map((o) => (o.field === field ? { ...o, active } : o));
}

/** Remove all overrides for a specific field */
export function removeOverride(
	overrides: FieldOverride[],
	field: string,
): FieldOverride[] {
	return overrides.filter((o) => o.field !== field);
}

/** Get a human-readable summary of all active overrides */
export function getOverrideSummary(overrides: FieldOverride[]): string[] {
	return overrides
		.filter((o) => o.active)
		.map((o) => {
			const modeLabel = o.mode === "replace" ? "set to" : "bonus";
			const value =
				o.mode === "bonus" && o.value >= 0 ? `+${o.value}` : `${o.value}`;
			const reason = o.reason ? ` (${o.reason})` : "";
			return `${o.field}: ${modeLabel} ${value}${reason}`;
		});
}
