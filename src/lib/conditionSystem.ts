import type { Json } from "@/integrations/supabase/types";

// ─── Types ──────────────────────────────────────────────────
export interface ConditionEntry {
	id: string;
	conditionName: string;
	sourceType:
		| "spell"
		| "feature"
		| "item"
		| "manual"
		| "regent"
		| "environment";
	sourceId: string | null;
	sourceName: string;
	appliedAt: string; // ISO timestamp
	durationRounds: number | null; // null = indefinite
	remainingRounds: number | null;
	concentrationSpellId: string | null;
	isActive: boolean;
	notes?: string;
	[key: string]: Json | undefined;
}

export interface ConditionChange {
	type: "added" | "removed" | "expired" | "concentration_broken";
	condition: ConditionEntry;
	round?: number;
}

// ─── Condition Management ───────────────────────────────────

/**
 * Apply a new condition to a character
 */
export function applyCondition(
	conditions: ConditionEntry[],
	conditionName: string,
	sourceType: ConditionEntry["sourceType"],
	sourceName: string,
	options: {
		sourceId?: string;
		durationRounds?: number;
		concentrationSpellId?: string;
		notes?: string;
	} = {},
): { conditions: ConditionEntry[]; change: ConditionChange } {
	const entry: ConditionEntry = {
		id: `cond-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		conditionName: conditionName.toLowerCase(),
		sourceType,
		sourceId: options.sourceId ?? null,
		sourceName,
		appliedAt: new Date().toISOString(),
		durationRounds: options.durationRounds ?? null,
		remainingRounds: options.durationRounds ?? null,
		concentrationSpellId: options.concentrationSpellId ?? null,
		isActive: true,
		notes: options.notes,
	};

	return {
		conditions: [...conditions, entry],
		change: { type: "added", condition: entry },
	};
}

/**
 * Remove a specific condition by ID
 */
export function removeCondition(
	conditions: ConditionEntry[],
	conditionId: string,
): { conditions: ConditionEntry[]; change: ConditionChange | null } {
	const removed = conditions.find((c) => c.id === conditionId);
	if (!removed) return { conditions, change: null };

	return {
		conditions: conditions.filter((c) => c.id !== conditionId),
		change: { type: "removed", condition: removed },
	};
}

/**
 * Advance round — decrement remaining rounds and expire conditions
 */
export function advanceConditionRound(
	conditions: ConditionEntry[],
	currentRound: number,
): { conditions: ConditionEntry[]; changes: ConditionChange[] } {
	const changes: ConditionChange[] = [];
	const updated: ConditionEntry[] = [];

	for (const cond of conditions) {
		if (!cond.isActive) {
			updated.push(cond);
			continue;
		}

		if (cond.remainingRounds === null) {
			updated.push(cond); // Indefinite conditions don't expire
			continue;
		}

		const remaining = cond.remainingRounds - 1;
		if (remaining <= 0) {
			changes.push({ type: "expired", condition: cond, round: currentRound });
			// Don't add to updated — it's expired
		} else {
			updated.push({ ...cond, remainingRounds: remaining });
		}
	}

	return { conditions: updated, changes };
}

/**
 * Get active condition names (for backward compatibility with string[] format)
 */
export function getActiveConditionNames(
	conditions: ConditionEntry[],
): string[] {
	return [
		...new Set(
			conditions.filter((c) => c.isActive).map((c) => c.conditionName),
		),
	];
}

/**
 * Convert legacy string[] conditions to ConditionEntry[] format
 */
export function migrateLegacyConditions(
	legacyConditions: string[],
): ConditionEntry[] {
	return legacyConditions.map((name) => ({
		id: `cond-legacy-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		conditionName: name.toLowerCase(),
		sourceType: "manual" as const,
		sourceId: null,
		sourceName: "Manual",
		appliedAt: new Date().toISOString(),
		durationRounds: null,
		remainingRounds: null,
		concentrationSpellId: null,
		isActive: true,
	}));
}

export interface NormalizedCombatConditions {
	conditions: string[];
	advancedConditions: ConditionEntry[];
}

/**
 * Backfill a combatant's condition pair when hydrating from persisted or
 * external state. Writers such as the Encounter Builder → Initiative handoff
 * and saves that predate the advanced-conditions refactor may omit
 * `advancedConditions` — which the initiative roster render reads unguarded, so
 * a missing value crashes the whole tracker. This derives `advancedConditions`
 * from the legacy string `conditions` (and defends both fields against
 * non-array junk) so hydration is always safe.
 */
export function normalizeCombatConditions(source: {
	conditions?: unknown;
	advancedConditions?: unknown;
}): NormalizedCombatConditions {
	const conditions = Array.isArray(source.conditions)
		? source.conditions.filter((c): c is string => typeof c === "string")
		: [];
	const advancedConditions = Array.isArray(source.advancedConditions)
		? (source.advancedConditions as ConditionEntry[])
		: migrateLegacyConditions(conditions);
	return { conditions, advancedConditions };
}

/**
 * Clear conditions on Long Rest
 * Following existing "Fresh Start" logic — clears all conditions.
 */
export function clearConditionsOnLongRest(): ConditionEntry[] {
	return [];
}
