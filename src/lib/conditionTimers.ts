export type ConditionTimers = Record<string, number> | undefined;

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
	for (const name of expired) {
		delete nextTimers[name];
	}

	const nextConditions = conditions.filter((c) => !expired.includes(c));

	return {
		conditions: nextConditions,
		timers: Object.keys(nextTimers).length > 0 ? nextTimers : undefined,
	};
}
