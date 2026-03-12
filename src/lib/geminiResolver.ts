/**
 * Gemini Protocol Runtime Resolver
 *
 * Provides a deterministic modifier pipeline for Gemini (Sovereign) state.
 * Gemini fusions grant passive and active modifiers that interact with
 * class features and regent effects with strict precedence.
 *
 * Precedence (highest to lowest):
 *   1. Class features (always win on conflict)
 *   2. Gemini fusion effects
 *   3. Regent passive effects
 *   4. Item effects
 *
 * All functions are pure — callers provide state, functions return results.
 */

import type { ActiveEffectRef, GeminiStateRef } from "@/lib/domainEvents";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GeminiModifier {
	stat: string; // e.g. 'ac', 'attack_bonus', 'spell_save_dc', 'damage', 'speed', 'hp_max'
	value: number;
	operation: "add" | "set" | "multiply";
	source: string; // sovereign name or fusion ability name
	condition?: string; // optional condition like 'while_raging', 'on_crit'
}

export interface GeminiRuntimeState {
	sovereignId: string | null;
	sovereignName: string | null;
	isActive: boolean;
	fusionTheme: string | null;
	fusionStability: string | null;
	powerMultiplier: string | null;
	modifiers: GeminiModifier[];
	corruptionRisk: number; // 0-100 percentage
}

export interface FusionAbilityInput {
	name: string;
	description: string;
	stat?: string;
	value?: number;
	operation?: "add" | "set" | "multiply";
	condition?: string;
}

// ---------------------------------------------------------------------------
// Default / empty state
// ---------------------------------------------------------------------------

export const EMPTY_GEMINI_STATE: GeminiRuntimeState = {
	sovereignId: null,
	sovereignName: null,
	isActive: false,
	fusionTheme: null,
	fusionStability: null,
	powerMultiplier: null,
	modifiers: [],
	corruptionRisk: 0,
};

// ---------------------------------------------------------------------------
// Resolve modifiers from fusion abilities
// ---------------------------------------------------------------------------

const POWER_MULTIPLIER_MAP: Record<string, number> = {
	Stable: 1.0,
	Elevated: 1.25,
	Volatile: 1.5,
	Unstable: 1.75,
	Critical: 2.0,
};

const CORRUPTION_RISK_MAP: Record<string, number> = {
	Stable: 0,
	Elevated: 10,
	Volatile: 25,
	Unstable: 40,
	Critical: 60,
};

/**
 * Parse fusion abilities into concrete modifiers.
 */
export function resolveFusionModifiers(
	abilities: FusionAbilityInput[],
	sovereignName: string,
): GeminiModifier[] {
	const modifiers: GeminiModifier[] = [];

	for (const ability of abilities) {
		if (ability.stat && ability.value !== undefined) {
			modifiers.push({
				stat: ability.stat,
				value: ability.value,
				operation: ability.operation ?? "add",
				source: `${sovereignName}: ${ability.name}`,
				condition: ability.condition,
			});
		}
	}

	return modifiers;
}

/**
 * Build a full Gemini runtime state from saved sovereign data.
 */
export function buildGeminiRuntimeState(
	sovereignId: string | null,
	sovereignName: string | null,
	isActive: boolean,
	fusionTheme: string | null,
	fusionStability: string | null,
	powerMultiplier: string | null,
	abilities: FusionAbilityInput[],
): GeminiRuntimeState {
	if (!sovereignId || !isActive) {
		return EMPTY_GEMINI_STATE;
	}

	const modifiers = resolveFusionModifiers(
		abilities,
		sovereignName ?? "Unknown Sovereign",
	);

	return {
		sovereignId,
		sovereignName,
		isActive,
		fusionTheme,
		fusionStability,
		powerMultiplier,
		modifiers,
		corruptionRisk: CORRUPTION_RISK_MAP[fusionStability ?? ""] ?? 0,
	};
}

/**
 * Convert Gemini runtime state to the compact ref used in domain events.
 */
export function toGeminiStateRef(state: GeminiRuntimeState): GeminiStateRef {
	return {
		sovereignId: state.sovereignId,
		isActive: state.isActive,
		fusionTheme: state.fusionTheme,
		powerMultiplier: state.powerMultiplier,
	};
}

/**
 * Convert Gemini modifiers to ActiveEffectRef entries for domain events.
 */
export function toGeminiEffectRefs(
	state: GeminiRuntimeState,
): ActiveEffectRef[] {
	if (!state.isActive || !state.sovereignId) return [];

	return state.modifiers.map((mod) => ({
		sourceType: "gemini" as const,
		sourceId: state.sovereignId || "",
		effectName: mod.source,
		modifiers: {
			stat: mod.stat,
			value: mod.value,
			operation: mod.operation,
			condition: mod.condition ?? null,
		},
	}));
}

// ---------------------------------------------------------------------------
// Apply modifiers to a stat value (with precedence)
// ---------------------------------------------------------------------------

/**
 * Apply a list of modifiers to a base stat value.
 * Modifiers are applied in order: set → multiply → add.
 * Within each operation type, they are applied in source-priority order
 * (class > gemini > regent > item).
 */
export function applyModifiers(
	baseValue: number,
	modifiers: GeminiModifier[],
	activeConditions?: string[],
): number {
	// Filter by condition
	const applicable = modifiers.filter((mod) => {
		if (!mod.condition) return true;
		return activeConditions?.includes(mod.condition) ?? false;
	});

	// Group by operation
	const sets = applicable.filter((m) => m.operation === "set");
	const multiplies = applicable.filter((m) => m.operation === "multiply");
	const adds = applicable.filter((m) => m.operation === "add");

	let value = baseValue;

	// Apply 'set' (last one wins — highest priority source)
	if (sets.length > 0) {
		value = sets[sets.length - 1].value;
	}

	// Apply multiplies
	for (const mod of multiplies) {
		value = Math.floor(value * mod.value);
	}

	// Apply adds
	for (const mod of adds) {
		value += mod.value;
	}

	return value;
}

/**
 * Get the power multiplier as a numeric factor.
 */
export function getPowerMultiplierFactor(
	multiplierLabel: string | null,
): number {
	if (!multiplierLabel) return 1.0;
	return POWER_MULTIPLIER_MAP[multiplierLabel] ?? 1.0;
}
