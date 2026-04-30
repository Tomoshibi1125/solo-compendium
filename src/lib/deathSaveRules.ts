/**
 * Death Save State Transitions (D&D Beyond / 5e RAW parity)
 *
 * Pure-logic module shared with the `useDeathSaves` React hook. Extracted
 * so the SRD rules (Nat 20 = regain 1 HP, Nat 1 = 2 failures, 3 successes
 * = stable, 3 failures = dead, massive damage at 0 HP = instant death,
 * any healing at 0 HP = reset) live in a single testable place.
 *
 * The hook bridges these transitions to React state and Supabase
 * persistence. Treat this module as the source of truth for the rules.
 */

export interface DeathSaveState {
	successes: number;
	failures: number;
	isStable: boolean;
	isDead: boolean;
}

export const INITIAL_DEATH_SAVE_STATE: DeathSaveState = {
	successes: 0,
	failures: 0,
	isStable: false,
	isDead: false,
};

/** Maximum saves of either kind before resolving. */
const MAX_TRACKED = 3;

/**
 * Apply a single death-save d20 roll to the current state.
 *
 * Pure function — does NOT mutate the input. Caller is responsible for
 * persisting the returned state.
 *
 * Rules:
 *   - Roll = 20 → reset all saves and regain 1 HP (caller wires HP).
 *   - Roll = 1 → +2 failures (death at 3).
 *   - Roll ≥ 10 → +1 success (stable at 3).
 *   - Otherwise → +1 failure (death at 3).
 */
export function applyDeathSaveRoll(
	state: DeathSaveState,
	roll: number,
): {
	newState: DeathSaveState;
	success: boolean;
	isNat20: boolean;
	isNat1: boolean;
	message: string;
} {
	const isNat20 = roll === 20;
	const isNat1 = roll === 1;

	if (isNat20) {
		return {
			newState: { ...INITIAL_DEATH_SAVE_STATE },
			success: true,
			isNat20: true,
			isNat1: false,
			message: "Natural 20! You regain 1 HP and are conscious.",
		};
	}

	if (isNat1) {
		const newFailures = Math.min(MAX_TRACKED, state.failures + 2);
		const isDead = newFailures >= MAX_TRACKED;
		return {
			newState: { ...state, failures: newFailures, isDead },
			success: false,
			isNat20: false,
			isNat1: true,
			message: isDead
				? "Natural 1! Two death save failures. You have died."
				: `Natural 1! Two failures (${newFailures}/3).`,
		};
	}

	if (roll >= 10) {
		const newSuccesses = Math.min(MAX_TRACKED, state.successes + 1);
		const isStable = newSuccesses >= MAX_TRACKED;
		return {
			newState: { ...state, successes: newSuccesses, isStable },
			success: true,
			isNat20: false,
			isNat1: false,
			message: isStable
				? `Success! You are stable (${newSuccesses}/3 successes).`
				: `Success (${newSuccesses}/3).`,
		};
	}

	const newFailures = Math.min(MAX_TRACKED, state.failures + 1);
	const isDead = newFailures >= MAX_TRACKED;
	return {
		newState: { ...state, failures: newFailures, isDead },
		success: false,
		isNat20: false,
		isNat1: false,
		message: isDead
			? `Failure. Three failures. You have died.`
			: `Failure (${newFailures}/3).`,
	};
}

/**
 * Apply damage taken while already at 0 HP.
 *
 * Massive-damage rule (PHB p.197): if a single hit deals ≥ HP max while
 * the target is at 0 HP, they die immediately. Otherwise the hit counts
 * as a single auto-failure (or two for a critical, handled by callers).
 */
export function applyDamageAtZero(
	state: DeathSaveState,
	damage: number,
	hpMax: number,
): DeathSaveState {
	if (damage >= hpMax) {
		return {
			successes: 0,
			failures: MAX_TRACKED,
			isStable: false,
			isDead: true,
		};
	}
	const newFailures = Math.min(MAX_TRACKED, state.failures + 1);
	return {
		...state,
		failures: newFailures,
		isDead: newFailures >= MAX_TRACKED,
		isStable: false,
	};
}

/**
 * Any healing while at 0 HP resets death saves and snaps the character
 * back to "conscious" (HP > 0 is the caller's responsibility).
 */
export function applyHealingAtZero(): DeathSaveState {
	return { ...INITIAL_DEATH_SAVE_STATE };
}

/** Mark the character as stable without changing successes/failures. */
export function applyStabilize(state: DeathSaveState): DeathSaveState {
	return { ...state, isStable: true };
}

/** Reset (e.g. after regaining HP normally). */
export function applyReset(): DeathSaveState {
	return { ...INITIAL_DEATH_SAVE_STATE };
}
