/**
 * Death Save Tracker
 * Standard 5e death saving throw mechanics with Rift Ascendant integration.
 *
 * Rules:
 * - Activated when HP drops to 0 (but not instant-killed)
 * - Roll d20: 10+ = success, 9- = failure
 * - Natural 1 = 2 failures
 * - Natural 20 = regain 1 HP, reset saves
 * - 3 successes = stabilized
 * - 3 failures = death
 * - Taking damage at 0 HP = 1 failure (crit = 2 failures)
 * - Any healing = reset death saves and restore consciousness
 *
 * Rift Ascendant integration:
 * - "Death Defiance" (Rift Favor cost 2, level 5+) can prevent dropping to 0 HP
 * - Titan Regent: auto-stabilize (death saves always succeed)
 */

// ── Types ─────────────────────────────────────────────────────────────

export interface DeathSaveState {
	/** Whether death saves are currently active (HP = 0) */
	active: boolean;
	/** Number of successful death saves (0-3) */
	successes: number;
	/** Number of failed death saves (0-3) */
	failures: number;
	/** Character has stabilized (3 successes) */
	stabilized: boolean;
	/** Character is dead (3 failures) */
	dead: boolean;
}

export interface DeathSaveRollResult {
	/** Updated death save state */
	newState: DeathSaveState;
	/** HP regained (1 on natural 20, 0 otherwise) */
	hpRegained: number;
	/** Roll result for display */
	roll: number;
	/** Human-readable message for chat/UI */
	message: string;
	/** Whether this was a critical event (nat 1 or nat 20) */
	critical: boolean;
}

export interface DamageAtZeroResult {
	/** Updated death save state */
	newState: DeathSaveState;
	/** Human-readable message */
	message: string;
}

// ── Core Functions ────────────────────────────────────────────────────

/** Create a fresh death save state (no saves active) */
export function createDeathSaveState(): DeathSaveState {
	return {
		active: false,
		successes: 0,
		failures: 0,
		stabilized: false,
		dead: false,
	};
}

/** Create an active death save state (just dropped to 0 HP) */
export function activateDeathSaves(): DeathSaveState {
	return {
		active: true,
		successes: 0,
		failures: 0,
		stabilized: false,
		dead: false,
	};
}

/** Reset death saves (on healing or stabilization) */
export function resetDeathSaves(): DeathSaveState {
	return createDeathSaveState();
}

// ── Death Save Roll ───────────────────────────────────────────────────

/**
 * Process a death saving throw roll.
 *
 * @param current The current death save state
 * @param roll The d20 roll result (1-20)
 * @returns The result of the death save roll
 */
export function rollDeathSave(
	current: DeathSaveState,
	roll: number,
): DeathSaveRollResult {
	// If not active or already resolved, no-op
	if (!current.active || current.stabilized || current.dead) {
		return {
			newState: { ...current },
			hpRegained: 0,
			roll,
			message: "Death saves are not active.",
			critical: false,
		};
	}

	const newState: DeathSaveState = { ...current };

	// Natural 20: regain 1 HP, reset saves
	if (roll === 20) {
		return {
			newState: resetDeathSaves(),
			hpRegained: 1,
			roll,
			message:
				"⚡ NATURAL 20! The Rift refuses to let you fall. You regain 1 HP and become conscious!",
			critical: true,
		};
	}

	// Natural 1: 2 failures
	if (roll === 1) {
		newState.failures = Math.min(newState.failures + 2, 3);

		if (newState.failures >= 3) {
			newState.dead = true;
			newState.active = false;
			return {
				newState,
				hpRegained: 0,
				roll,
				message:
					"💀 NATURAL 1! Two death save failures. The System disconnects... you have died.",
				critical: true,
			};
		}

		return {
			newState,
			hpRegained: 0,
			roll,
			message: `⚠ NATURAL 1! Two death save failures (${newState.failures}/3).`,
			critical: true,
		};
	}

	// Normal roll: 10+ = success, 9- = failure
	if (roll >= 10) {
		newState.successes += 1;

		if (newState.successes >= 3) {
			newState.stabilized = true;
			newState.active = false;
			return {
				newState,
				hpRegained: 0,
				roll,
				message: `✓ Death save success (${newState.successes}/3). You are stabilized!`,
				critical: false,
			};
		}

		return {
			newState,
			hpRegained: 0,
			roll,
			message: `✓ Death save success (${newState.successes}/3 successes, ${newState.failures}/3 failures).`,
			critical: false,
		};
	}

	// Failure (roll < 10)
	newState.failures += 1;

	if (newState.failures >= 3) {
		newState.dead = true;
		newState.active = false;
		return {
			newState,
			hpRegained: 0,
			roll,
			message:
				"💀 Death save failure (3/3). The System disconnects... you have died.",
			critical: false,
		};
	}

	return {
		newState,
		hpRegained: 0,
		roll,
		message: `✗ Death save failure (${newState.successes}/3 successes, ${newState.failures}/3 failures).`,
		critical: false,
	};
}

// ── Damage at 0 HP ────────────────────────────────────────────────────

/**
 * Handle taking damage while at 0 HP.
 * - Any damage = 1 automatic failure
 * - Critical hit = 2 automatic failures
 *
 * @param current The current death save state
 * @param isCritical Whether the damage was from a critical hit
 */
export function takeDamageAtZeroHP(
	current: DeathSaveState,
	isCritical: boolean,
): DamageAtZeroResult {
	if (!current.active || current.dead || current.stabilized) {
		return {
			newState: { ...current },
			message: "Character is not making death saves.",
		};
	}

	const newState: DeathSaveState = { ...current };
	const failuresToAdd = isCritical ? 2 : 1;
	newState.failures = Math.min(newState.failures + failuresToAdd, 3);

	if (newState.failures >= 3) {
		newState.dead = true;
		newState.active = false;
		return {
			newState,
			message: isCritical
				? "💀 Critical damage at 0 HP! Two death save failures — you have died."
				: "💀 Damage at 0 HP! Death save failure — you have died.",
		};
	}

	return {
		newState,
		message: isCritical
			? `⚠ Critical damage at 0 HP! Two death save failures (${newState.failures}/3).`
			: `⚠ Damage at 0 HP! Automatic death save failure (${newState.failures}/3).`,
	};
}

// ── Drop to 0 HP Check ───────────────────────────────────────────────

/**
 * Determine what happens when a character takes enough damage to reach 0 HP.
 *
 * @param currentHP Current HP before damage
 * @param damage Amount of damage taken
 * @param maxHP Maximum HP (for instant death check)
 * @returns Whether to activate death saves or if instant death occurs
 */
export function shouldActivateDeathSaves(
	currentHP: number,
	damage: number,
	maxHP: number,
): {
	activate: boolean;
	instantKill: boolean;
	remainingDamage: number;
} {
	const hpAfterDamage = currentHP - damage;

	// Still alive
	if (hpAfterDamage > 0) {
		return { activate: false, instantKill: false, remainingDamage: 0 };
	}

	// Check for instant death: remaining damage >= max HP
	const overflow = Math.abs(hpAfterDamage);
	if (overflow >= maxHP) {
		return { activate: false, instantKill: true, remainingDamage: overflow };
	}

	// Normal 0 HP — activate death saves
	return { activate: true, instantKill: false, remainingDamage: overflow };
}

// ── Rift Ascendant Integration ────────────────────────────────────────

/**
 * Check if Death Defiance (Rift Favor) can prevent dropping to 0 HP.
 * Cost: 2 Rift Favor, requires level 5+.
 * Effect: Drop to 1 HP instead of 0. Once per long rest.
 *
 * @param level Character level
 * @param riftFavorCurrent Current Rift Favor points
 * @param deathDefianceUsedThisRest Whether Death Defiance was already used
 */
export function canUseDeathDefiance(
	level: number,
	riftFavorCurrent: number,
	deathDefianceUsedThisRest: boolean,
): boolean {
	return level >= 5 && riftFavorCurrent >= 2 && !deathDefianceUsedThisRest;
}
