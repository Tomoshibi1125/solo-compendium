/**
 * Advanced Dice Engine - Digital Character Sheet Style
 *
 * Comprehensive dice rolling with advantage, disadvantage, critical hits,
 * exploding dice, and advanced mechanics
 */

import { AppError } from "@/lib/appError";

interface DiceRoll {
	dice: number;
	sides: number;
	modifier: number;
	advantage?: "advantage" | "disadvantage" | "normal";
}

export interface RollResult {
	formula: string;
	rolls: number[];
	modifier: number;
	total: number;
	result: number;
	isNatural20: boolean;
	isNatural1: boolean;
	droppedRolls?: number[];
	criticalMultiplier?: number;
	explodedRolls?: number[];
	rerolledRolls?: Array<{ original: number; rerolled: number }>;
}

/**
 * Parse a dice formula string (e.g., "2d6+4", "1d20+5")
 */
function parseFormula(formula: string): DiceRoll {
	const match = formula.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
	if (!match) {
		throw new AppError(`Invalid dice formula: ${formula}`, "INVALID_INPUT");
	}

	return {
		dice: parseInt(match[1] || "1", 10),
		sides: parseInt(match[2], 10),
		modifier: parseInt(match[3] || "0", 10),
		advantage: "normal",
	};
}

/**
 * Roll a single die
 */
function rollDie(sides: number): number {
	return Math.floor(Math.random() * sides) + 1;
}

/**
 * Post-process a roll result to apply critical-hit dice doubling.
 *
 * D&D Beyond parity (and SRD 5e correctness): on a critical hit, ALL
 * damage dice are doubled, but flat modifiers (ability mod, magic +N,
 * Hex, Ascendant's Mark, etc.) are **not** doubled. This helper takes an
 * existing RollResult and produces a new one with the dice rolled again
 * (additional set of dice rolls of the same size and count).
 *
 * Extra-dice hooks (live — wired through the `extraDice` parameter below):
 *  - Brutal Critical (Berserker/Destroyer): extra weapon dice per crit, scaled
 *    by level, are threaded in via `src/lib/actionResolution.ts` and
 *    `src/hooks/useCombatActions.ts`.
 *  - Savage Attacks and similar reroll-/extra-dice-on-crit features build on the
 *    same `extraDice` hook.
 */
export function applyCritical(
	roll: RollResult,
	extraDice: number = 0,
): RollResult {
	// Parse the original formula to recover dice count + sides
	const parsed = parseFormula(roll.formula);
	const additionalDiceCount = parsed.dice + extraDice;
	const additionalRolls: number[] = [];
	for (let i = 0; i < additionalDiceCount; i++) {
		additionalRolls.push(rollDie(parsed.sides));
	}
	const newRolls = [...roll.rolls, ...additionalRolls];
	const newTotal = newRolls.reduce((sum, r) => sum + r, 0);
	const newResult = newTotal + (roll.modifier ?? 0);
	return {
		...roll,
		rolls: newRolls,
		total: newTotal,
		result: newResult,
		criticalMultiplier: 2,
		isNatural20: roll.isNatural20 || additionalRolls.some((r) => r === 20),
		// Callers needing the delta can compute it as
		// `newTotal - originalRoll.total`.
		droppedRolls: roll.droppedRolls,
		explodedRolls: roll.explodedRolls,
		rerolledRolls: roll.rerolledRolls,
	};
}

/**
 * Roll with critical hit confirmation
 */
export function rollCritical(formula: string, isCritical: boolean): RollResult {
	const roll = parseFormula(formula);
	const rolls: number[] = [];
	const criticalMultiplier = isCritical ? 2 : 1;

	for (let i = 0; i < roll.dice * criticalMultiplier; i++) {
		rolls.push(rollDie(roll.sides));
	}

	const total = rolls.reduce((sum, r) => sum + r, 0);
	const result = total + roll.modifier;

	return {
		formula,
		rolls,
		modifier: roll.modifier,
		total,
		result,
		isNatural20: rolls.some((r) => r === 20),
		isNatural1: rolls.some((r) => r === 1),
		criticalMultiplier,
	};
}
