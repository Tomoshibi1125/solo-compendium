/**
 * Level-Up Math (D&D Beyond / 5e parity).
 *
 * Pure-logic module. Single source of truth for the formulas used by the
 * level-up wizard, the bulk-level-up roster action, and any ad-hoc roller.
 *
 * Formulas locked in here:
 *   - HP gain per level (average / max / min / rolled)
 *   - Proficiency Bonus by level
 *   - Rift Favor die size by level
 *   - Rift Favor max uses by level
 *
 * Each helper is independently unit-testable. Refactor consumers to call
 * these instead of duplicating the math inline.
 */

/**
 * Average HP gained on level-up.
 *
 * SRD: roll the hit die OR take the average. The average rule is
 * `floor(hitDie / 2) + 1`, then add the VIT (CON-equivalent) modifier.
 */
export function calculateAverageHPGain(
	hitDieSize: number,
	vitModifier: number,
): number {
	return Math.floor(hitDieSize / 2) + 1 + vitModifier;
}

/**
 * Maximum HP gain per level (max roll on the hit die + VIT mod).
 * Used to clamp manual entry / dice rolls in the level-up wizard.
 */
export function calculateMaxHPGain(
	hitDieSize: number,
	vitModifier: number,
): number {
	return hitDieSize + vitModifier;
}

/**
 * Minimum HP gain per level. RAW: gain at least 1 HP per level even
 * with a negative VIT modifier — `max(1, 1 + vitMod)`.
 */
export function calculateMinHPGain(vitModifier: number): number {
	return Math.max(1, 1 + vitModifier);
}

/**
 * Apply VIT modifier to a hit-die roll, clamped to the per-level minimum.
 */
export function applyVitModToRoll(roll: number, vitModifier: number): number {
	return Math.max(1, roll + vitModifier);
}

/**
 * Proficiency bonus by character level (5e standard).
 *
 * Levels 1-4 = +2, 5-8 = +3, 9-12 = +4, 13-16 = +5, 17-20 = +6.
 */
export function calculateProficiencyBonusForLevel(level: number): number {
	if (level < 1) return 2; // Defensive — RAW characters start at L1.
	return Math.ceil(level / 4) + 1;
}

/**
 * Rift Favor die size by level (RA-specific scaling).
 *
 *   1-4   → d4
 *   5-10  → d6
 *   11-16 → d8
 *   17+   → d10
 */
export function calculateRiftFavorDie(level: number): number {
	if (level <= 4) return 4;
	if (level <= 10) return 6;
	if (level <= 16) return 8;
	return 10;
}

/**
 * Rift Favor max uses by level (RA-specific scaling).
 *
 *   1-4   → 3
 *   5-10  → 4
 *   11-16 → 5
 *   17+   → 6
 */
export function calculateRiftFavorMax(level: number): number {
	if (level <= 4) return 3;
	if (level <= 10) return 4;
	if (level <= 16) return 5;
	return 6;
}

/**
 * Bundle of the on-level-up scalar bumps (PB + Rift Favor).
 *
 * Useful for callers that want a single object to spread into a character
 * update payload. HP gain is intentionally separate because the wizard
 * supports user choice (average / roll / manual).
 */
export interface LevelUpScalarBumps {
	level: number;
	proficiency_bonus: number;
	rift_favor_die: number;
	rift_favor_max: number;
}

export function calculateLevelUpScalarBumps(
	newLevel: number,
): LevelUpScalarBumps {
	return {
		level: newLevel,
		proficiency_bonus: calculateProficiencyBonusForLevel(newLevel),
		rift_favor_die: calculateRiftFavorDie(newLevel),
		rift_favor_max: calculateRiftFavorMax(newLevel),
	};
}
