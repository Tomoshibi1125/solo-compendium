/**
 * HP Adjustment Math (D&D Beyond / 5e parity).
 *
 * Pure-logic helpers for applying damage and healing to a character's
 * HP / Temp HP totals. Extracted from `CharacterSheetV2` so the math is
 * unit-testable and so any future surface (party panel, NPC sheet, VTT
 * macro) can use the same formulas.
 *
 * Rules locked in here:
 *   - Damage absorbs Temp HP first (5e PHB p.198).
 *   - Damage at 0 HP triggers a death-save failure (caller wires this).
 *   - Massive damage (overflow ≥ HP max while transitioning to 0) is an
 *     instant kill — caller wires the death-save state mutation.
 *   - Healing is clamped to HP max and never reduces HP.
 *   - Any healing while at 0 HP wakes the character up — caller wires
 *     the death-save reset.
 */

export interface HpDamageResult {
	/** New HP total after applying the hit. */
	newHp: number;
	/** New Temp HP pool after the hit absorbed what it could. */
	newTempHp: number;
	/** Damage that "fell through" to actual HP after THP absorbed some. */
	hpLost: number;
	/** True if the character was already at 0 HP before this hit. */
	wasAtZero: boolean;
	/** True if this hit dropped the character to 0 HP. */
	droppedToZero: boolean;
	/** True if the RAW massive-damage rule should fire (instant kill). */
	massiveDamage: boolean;
	/**
	 * Overflow damage past the HP floor — feeds the death-save module's
	 * `applyDamageAtZero(damage, hpMax)` rule.
	 */
	overflowDamage: number;
}

export interface HpDamageInput {
	hpCurrent: number;
	hpMax: number;
	tempHp: number;
	damage: number;
}

/**
 * Apply a damage hit. Pure — does not mutate the input or persist
 * anywhere. Caller is responsible for writing the new HP/THP back to
 * storage and for wiring death-save consequences via
 * `applyDamageAtZero` / instant-kill state.
 */
export function applyDamage(input: HpDamageInput): HpDamageResult {
	const damage = Math.max(0, input.damage);
	if (damage === 0) {
		return {
			newHp: input.hpCurrent,
			newTempHp: input.tempHp,
			hpLost: 0,
			wasAtZero: input.hpCurrent === 0,
			droppedToZero: false,
			massiveDamage: false,
			overflowDamage: 0,
		};
	}

	const wasAtZero = input.hpCurrent === 0;

	// Temp HP absorbs first.
	const tempAbsorbed = Math.min(input.tempHp, damage);
	const newTempHp = input.tempHp - tempAbsorbed;
	const hpLost = damage - tempAbsorbed;

	const newHp = Math.max(0, input.hpCurrent - hpLost);
	const overflowDamage = Math.max(0, hpLost - input.hpCurrent);
	const droppedToZero = !wasAtZero && newHp === 0;
	const massiveDamage = droppedToZero && overflowDamage >= input.hpMax;

	return {
		newHp,
		newTempHp,
		hpLost,
		wasAtZero,
		droppedToZero,
		massiveDamage,
		overflowDamage,
	};
}

export interface HpHealResult {
	newHp: number;
	/** True if the character was at 0 HP before — caller resets death saves. */
	wasAtZero: boolean;
	/** Actual HP gained (clamped to HP max). */
	hpGained: number;
}

export interface HpHealInput {
	hpCurrent: number;
	hpMax: number;
	heal: number;
}

/**
 * Apply healing. Pure — clamps to HP max and never reduces HP.
 */
export function applyHealing(input: HpHealInput): HpHealResult {
	const heal = Math.max(0, input.heal);
	const wasAtZero = input.hpCurrent === 0;
	if (heal === 0) {
		return { newHp: input.hpCurrent, wasAtZero, hpGained: 0 };
	}
	const newHp = Math.min(input.hpMax, input.hpCurrent + heal);
	return {
		newHp,
		wasAtZero,
		hpGained: newHp - input.hpCurrent,
	};
}

export interface TempHpResult {
	/** New THP pool after applying the new source. */
	newTempHp: number;
	/** Whether the new source was used (RAW: only the larger pool sticks). */
	replaced: boolean;
}

/**
 * Apply a new Temporary HP source. RAW (PHB p.196): Temp HP doesn't
 * stack — when you receive a new pool, it overwrites the old pool only
 * if it's larger.
 */
export function applyTempHp(
	currentTempHp: number,
	newSource: number,
): TempHpResult {
	const incoming = Math.max(0, newSource);
	if (incoming > currentTempHp) {
		return { newTempHp: incoming, replaced: true };
	}
	return { newTempHp: currentTempHp, replaced: false };
}
