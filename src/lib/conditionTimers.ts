import {
	type ConditionEntry,
	type ConditionRuntimeOptions,
	migrateLegacyConditions,
} from "./conditionSystem";

export type ConditionTimers = Record<string, number> | undefined;

/** Preserve the original string/timer cleanup API used by legacy tool state. */
export function cleanupExpiredConditions(
	conditions: string[],
	timers: ConditionTimers,
	nextRound: number,
): { conditions: string[]; timers: ConditionTimers } {
	if (!timers) return { conditions, timers };

	const expired = Object.entries(timers)
		.filter(([, expiresAt]) => expiresAt <= nextRound)
		.map(([name]) => name);
	if (expired.length === 0) return { conditions, timers };

	const nextTimers: Record<string, number> = { ...timers };
	for (const name of expired) delete nextTimers[name];
	return {
		conditions: conditions.filter((condition) => !expired.includes(condition)),
		timers: Object.keys(nextTimers).length > 0 ? nextTimers : undefined,
	};
}

function findTimer(
	conditionName: string,
	timers: ConditionTimers,
): number | undefined {
	if (!timers) return undefined;
	if (typeof timers[conditionName] === "number") return timers[conditionName];
	const normalized = conditionName.trim().toLowerCase();
	const match = Object.entries(timers).find(
		([name]) => name.trim().toLowerCase() === normalized,
	);
	return match?.[1];
}

/**
 * Adapt absolute-round legacy timers into the shared versioned lifecycle.
 * Untimed strings remain visibly legacy/manual and receive no invented
 * duration. Entries already expired at currentRound are omitted.
 */
export function adaptLegacyConditionTimers(
	conditions: readonly string[],
	timers: ConditionTimers,
	currentRound: number,
	options: ConditionRuntimeOptions = {},
): ConditionEntry[] {
	const migrated = migrateLegacyConditions([...conditions], options);
	return migrated.flatMap((entry) => {
		const expiresAt = findTimer(entry.conditionName, timers);
		if (expiresAt === undefined || !Number.isFinite(expiresAt)) return [entry];
		const remaining = Math.floor(expiresAt - currentRound);
		if (remaining <= 0) return [];
		return [
			{
				...entry,
				durationRounds: remaining,
				remainingRounds: remaining,
				duration: {
					unit: "round" as const,
					anchor: "round" as const,
					value: remaining,
					remaining,
				},
			},
		];
	});
}

/** Descriptive alias for callers migrating persisted timer state. */
export const legacyConditionTimersToEntries = adaptLegacyConditionTimers;
