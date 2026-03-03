/**
 * Enhanced Condition System
 *
 * Upgrades the flat `conditions: string[]` to a structured system with
 * source tracking, duration, concentration linking, and round-based expiry.
 */

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
 * Remove all conditions linked to a concentration spell (when concentration breaks)
 */
export function breakConcentrationConditions(
	conditions: ConditionEntry[],
	spellId: string,
): { conditions: ConditionEntry[]; changes: ConditionChange[] } {
	const changes: ConditionChange[] = [];
	const updated = conditions.filter((c) => {
		if (c.concentrationSpellId === spellId) {
			changes.push({ type: "concentration_broken", condition: c });
			return false;
		}
		return true;
	});

	return { conditions: updated, changes };
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

/**
 * Check if a character has a specific active condition
 */
export function hasCondition(
	conditions: ConditionEntry[],
	conditionName: string,
): boolean {
	return conditions.some(
		(c) => c.isActive && c.conditionName === conditionName.toLowerCase(),
	);
}

/**
 * Get all conditions from a specific source (e.g., all conditions from a spell)
 */
export function getConditionsFromSource(
	conditions: ConditionEntry[],
	sourceId: string,
): ConditionEntry[] {
	return conditions.filter((c) => c.sourceId === sourceId && c.isActive);
}

/**
 * Get condition summary for display
 */
export function getConditionSummary(condition: ConditionEntry): string {
	const parts = [condition.conditionName];
	if (condition.remainingRounds !== null) {
		parts.push(`(${condition.remainingRounds} rounds)`);
	}
	if (condition.sourceName && condition.sourceType !== "manual") {
		parts.push(`from ${condition.sourceName}`);
	}
	return parts.join(" ");
}
