/**
 * Regent Runtime Resolver
 *
 * Provides a deterministic modifier pipeline for Regent effects.
 * Regents grant passive and active modifiers that interact with class features
 * and Gemini effects with strict precedence.
 *
 * Precedence (highest to lowest):
 *   1. Class features (always win on conflict)
 *   2. Gemini fusion effects
 *   3. Regent passive effects
 *   4. Item effects
 *
 * All functions are pure — callers provide state, functions return results.
 */

import type { ActiveEffectRef, RegentRef } from "@/lib/domainEvents";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegentModifier {
	stat: string;
	value: number;
	operation: "add" | "set" | "multiply";
	source: string;
	condition?: string;
	isPassive: boolean;
}

export interface RegentRuntimeState {
	regentId: string;
	regentName: string;
	title: string;
	theme: string;
	isPrimary: boolean;
	unlockLevel: number;
	modifiers: RegentModifier[];
	damageType: string | null;
	corruptionRisk: string | null;
}

export interface RegentFeatureInput {
	name: string;
	description: string;
	level: number;
	isSignature: boolean;
	actionType?: string | null;
	stat?: string;
	value?: number;
	operation?: "add" | "set" | "multiply";
	condition?: string;
}

// ---------------------------------------------------------------------------
// Resolve regent modifiers from features
// ---------------------------------------------------------------------------

/**
 * Parse regent features into concrete modifiers.
 * Only includes features that are at or below the character's level.
 */
export function resolveRegentModifiers(
	features: RegentFeatureInput[],
	regentName: string,
	characterLevel: number,
): RegentModifier[] {
	const modifiers: RegentModifier[] = [];

	for (const feature of features) {
		if (feature.level > characterLevel) continue;

		if (feature.stat && feature.value !== undefined) {
			modifiers.push({
				stat: feature.stat,
				value: feature.value,
				operation: feature.operation ?? "add",
				source: `${regentName}: ${feature.name}`,
				condition: feature.condition,
				isPassive: feature.actionType === "passive" || !feature.actionType,
			});
		}
	}

	return modifiers;
}

/**
 * Build a full regent runtime state from DB data.
 */
export function buildRegentRuntimeState(
	regentId: string,
	regentName: string,
	title: string,
	theme: string,
	isPrimary: boolean,
	unlockLevel: number,
	damageType: string | null,
	corruptionRisk: string | null,
	features: RegentFeatureInput[],
	characterLevel: number,
): RegentRuntimeState {
	return {
		regentId,
		regentName,
		title,
		theme,
		isPrimary,
		unlockLevel,
		modifiers: resolveRegentModifiers(features, regentName, characterLevel),
		damageType,
		corruptionRisk,
	};
}

// ---------------------------------------------------------------------------
// Conversions for domain events
// ---------------------------------------------------------------------------

/**
 * Convert regent runtime state to the compact ref used in domain events.
 */
export function toRegentRef(state: RegentRuntimeState): RegentRef {
	return {
		regentId: state.regentId,
		regentName: state.regentName,
		isPrimary: state.isPrimary,
		theme: state.theme,
	};
}

/**
 * Convert regent modifiers to ActiveEffectRef entries for domain events.
 */
export function toRegentEffectRefs(
	state: RegentRuntimeState,
): ActiveEffectRef[] {
	return state.modifiers.map((mod) => ({
		sourceType: "regent" as const,
		sourceId: state.regentId,
		effectName: mod.source,
		modifiers: {
			stat: mod.stat,
			value: mod.value,
			operation: mod.operation,
			condition: mod.condition ?? null,
			isPassive: mod.isPassive,
		},
	}));
}

// ---------------------------------------------------------------------------
// Multi-regent resolution
// ---------------------------------------------------------------------------

/**
 * Merge modifiers from multiple regents into a single list.
 * Primary regent's modifiers take precedence when there's a conflict
 * on the same stat with 'set' operations.
 */
export function mergeRegentModifiers(
	regents: RegentRuntimeState[],
): RegentModifier[] {
	const primary = regents.find((r) => r.isPrimary);
	const secondary = regents.filter((r) => !r.isPrimary);

	const allModifiers: RegentModifier[] = [];

	// Primary first (higher priority)
	if (primary) {
		allModifiers.push(...primary.modifiers);
	}

	// Secondary modifiers, but skip 'set' operations on stats already set by primary
	const primarySetStats = new Set(
		primary?.modifiers
			.filter((m) => m.operation === "set")
			.map((m) => m.stat) ?? [],
	);

	for (const regent of secondary) {
		for (const mod of regent.modifiers) {
			if (mod.operation === "set" && primarySetStats.has(mod.stat)) {
				continue; // Primary wins
			}
			allModifiers.push(mod);
		}
	}

	return allModifiers;
}

/**
 * Apply regent modifiers to a base stat value.
 * Uses the same apply order as Gemini: set → multiply → add.
 */
export function applyRegentModifiers(
	baseValue: number,
	modifiers: RegentModifier[],
	activeConditions?: string[],
): number {
	const applicable = modifiers.filter((mod) => {
		if (!mod.condition) return true;
		return activeConditions?.includes(mod.condition) ?? false;
	});

	const sets = applicable.filter((m) => m.operation === "set");
	const multiplies = applicable.filter((m) => m.operation === "multiply");
	const adds = applicable.filter((m) => m.operation === "add");

	let value = baseValue;

	if (sets.length > 0) {
		value = sets[sets.length - 1].value;
	}

	for (const mod of multiplies) {
		value = Math.floor(value * mod.value);
	}

	for (const mod of adds) {
		value += mod.value;
	}

	return value;
}

// ---------------------------------------------------------------------------
// Level gating for regent unlocks
// ---------------------------------------------------------------------------

/**
 * Can a character unlock a regent at the given level?
 * Regents have a minimum unlock_level on their compendium entry.
 */
export function canUnlockRegent(
	characterLevel: number,
	regentUnlockLevel: number,
): { allowed: boolean; reason: string } {
	if (characterLevel >= regentUnlockLevel) {
		return {
			allowed: true,
			reason: `Regent unlocks at level ${regentUnlockLevel}.`,
		};
	}
	return {
		allowed: false,
		reason: `Regent requires level ${regentUnlockLevel}. Current level: ${characterLevel}.`,
	};
}

/**
 * Can a character activate the Gemini Protocol (requires 2+ regents)?
 */
export function canActivateGemini(unlockedRegentCount: number): {
	allowed: boolean;
	reason: string;
} {
	if (unlockedRegentCount >= 2) {
		return {
			allowed: true,
			reason: "Two or more regents unlocked — Gemini Protocol available.",
		};
	}
	return {
		allowed: false,
		reason: `Gemini Protocol requires 2 regents. Currently unlocked: ${unlockedRegentCount}.`,
	};
}
