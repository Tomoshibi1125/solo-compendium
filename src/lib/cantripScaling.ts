/**
 * Cantrip Damage Scaling
 *
 * D&D Beyond parity: cantrip damage dice scale at levels 5, 11, and 17.
 * This module computes the correct number of damage dice for any cantrip
 * based on character level.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CantripScalingResult {
	diceCount: number;
	dieSize: number;
	formula: string;
	level: number;
}

// ---------------------------------------------------------------------------
// Core scaling function
// ---------------------------------------------------------------------------

/**
 * Get the number of damage dice a cantrip deals at a given character level.
 * Standard 5e: 1 die at level 1, 2 at level 5, 3 at level 11, 4 at level 17.
 */
export function getCantripDiceCount(characterLevel: number): number {
	if (characterLevel >= 17) return 4;
	if (characterLevel >= 11) return 3;
	if (characterLevel >= 5) return 2;
	return 1;
}

/**
 * Build the full damage formula for a cantrip given its base die size.
 * Example: Fire Bolt (d10) at level 5 → "2d10"
 */
export function getCantripDamageFormula(
	baseDieSize: number,
	characterLevel: number,
): CantripScalingResult {
	const diceCount = getCantripDiceCount(characterLevel);
	return {
		diceCount,
		dieSize: baseDieSize,
		formula: `${diceCount}d${baseDieSize}`,
		level: characterLevel,
	};
}

/**
 * Parse a cantrip's base damage string (e.g. "1d10") and return the
 * level-scaled formula.
 */
export function scaleCantripDamage(
	baseDamage: string,
	characterLevel: number,
): string {
	const match = baseDamage.match(/(\d+)?d(\d+)/i);
	if (!match) return baseDamage;

	const dieSize = parseInt(match[2], 10);
	const diceCount = getCantripDiceCount(characterLevel);
	return `${diceCount}d${dieSize}`;
}

// ---------------------------------------------------------------------------
// Common cantrip damage dice (for reference / validation)
// ---------------------------------------------------------------------------

export const COMMON_CANTRIP_DICE: Record<string, number> = {
	"Fire Bolt": 10,
	"Eldritch Blast": 10,
	"Sacred Flame": 8,
	"Chill Touch": 8,
	"Toll the Dead": 12,
	"Poison Spray": 12,
	"Ray of Frost": 8,
	"Shocking Grasp": 8,
	"Acid Splash": 6,
	"Produce Flame": 8,
	"Thorn Whip": 6,
	"Vicious Mockery": 4,
};
