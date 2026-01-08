/**
 * Dice rolling utilities for Solo Leveling 5e
 * Supports direct roll execution from action cards
 */

import { AppError } from '@/lib/appError';

export interface DiceRoll {
  dice: string; // e.g., "1d20", "2d6+3"
  rolls: number[];
  modifier: number;
  total: number;
  result: number; // total + modifier
}

/**
 * Parse a dice string (e.g., "1d20+3", "2d6", "1d8-1")
 */
function parseDiceString(diceStr: string): { count: number; sides: number; modifier: number } {
  const match = diceStr.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!match) {
    throw new AppError(`Invalid dice string: ${diceStr}`, 'INVALID_INPUT');
  }

  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  return { count, sides, modifier };
}

/**
 * Roll a single die
 */
function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll dice from a string (e.g., "1d20+3", "2d6")
 */
export function rollDiceString(diceStr: string): DiceRoll {
  const { count, sides, modifier } = parseDiceString(diceStr);
  const rolls: number[] = [];

  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides));
  }

  const total = rolls.reduce((sum, roll) => sum + roll, 0);
  const result = total + modifier;

  return {
    dice: diceStr,
    rolls,
    modifier,
    total,
    result,
  };
}

/**
 * Format roll result for display
 */
export function formatRollResult(roll: DiceRoll): string {
  if (roll.rolls.length === 1) {
    if (roll.modifier === 0) {
      return `${roll.result}`;
    }
    return `${roll.total}${roll.modifier >= 0 ? '+' : ''}${roll.modifier} = ${roll.result}`;
  }

  const rollsStr = roll.rolls.join(' + ');
  if (roll.modifier === 0) {
    return `${rollsStr} = ${roll.result}`;
  }
  return `${rollsStr}${roll.modifier >= 0 ? '+' : ''}${roll.modifier} = ${roll.result}`;
}
