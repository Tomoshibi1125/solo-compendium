/**
 * Advanced dice rolling engine with history tracking
 */

import { AppError } from '@/lib/appError';

export interface DiceRoll {
  dice: number;
  sides: number;
  modifier: number;
  advantage?: 'advantage' | 'disadvantage' | 'normal';
}

export interface RollResult {
  formula: string;
  rolls: number[];
  modifier: number;
  total: number;
  isNatural20: boolean;
  isNatural1: boolean;
  droppedRolls?: number[];
}

/**
 * Parse a dice formula string (e.g., "2d6+4", "1d20+5")
 */
export function parseFormula(formula: string): DiceRoll {
  const match = formula.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
  if (!match) {
    throw new AppError(`Invalid dice formula: ${formula}`, 'INVALID_INPUT');
  }

  return {
    dice: parseInt(match[1] || '1', 10),
    sides: parseInt(match[2], 10),
    modifier: parseInt(match[3] || '0', 10),
    advantage: 'normal',
  };
}

/**
 * Roll a single die
 */
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Execute a dice roll
 */
export function roll(diceRoll: DiceRoll): RollResult {
  const { dice, sides, modifier } = diceRoll;
  // Treat missing advantage/disadvantage as normal
  const advantage = diceRoll.advantage ?? 'normal';
  const rolls: number[] = [];
  let droppedRolls: number[] | undefined;

  // Handle advantage/disadvantage for d20 rolls
  if (sides === 20 && dice === 1 && advantage !== 'normal') {
    const roll1 = rollDie(sides);
    const roll2 = rollDie(sides);
    
    if (advantage === 'advantage') {
      rolls.push(Math.max(roll1, roll2));
      droppedRolls = [Math.min(roll1, roll2)];
    } else {
      rolls.push(Math.min(roll1, roll2));
      droppedRolls = [Math.max(roll1, roll2)];
    }
  } else {
    // Normal rolls
    for (let i = 0; i < dice; i++) {
      rolls.push(rollDie(sides));
    }
  }

  const rollSum = rolls.reduce((sum, r) => sum + r, 0);
  const total = rollSum + modifier;

  const isNatural20 = sides === 20 && rolls.some(r => r === 20);
  const isNatural1 = sides === 20 && rolls.every(r => r === 1);

  const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  const formula = `${dice}d${sides}${modifier !== 0 ? modifierStr : ''}`;

  return {
    formula,
    rolls,
    modifier,
    total,
    isNatural20,
    isNatural1,
    droppedRolls,
  };
}

/**
 * Quick roll from formula string
 */
export function quickRoll(formula: string, advantage?: 'advantage' | 'disadvantage' | 'normal'): RollResult {
  const parsed = parseFormula(formula);
  parsed.advantage = advantage ?? 'normal';
  return roll(parsed);
}

/**
 * Roll an ability check or saving throw
 */
export function rollCheck(
  modifier: number,
  advantage?: 'advantage' | 'disadvantage' | 'normal'
): RollResult {
  return roll({
    dice: 1,
    sides: 20,
    modifier,
    advantage: advantage ?? 'normal',
  });
}

/**
 * Roll attack with damage
 */
export function rollAttack(
  attackModifier: number,
  damageFormula: string,
  advantage?: 'advantage' | 'disadvantage' | 'normal'
): { attack: RollResult; damage: RollResult; critDamage?: RollResult } {
  const attack = rollCheck(attackModifier, advantage);
  const damage = quickRoll(damageFormula);

  // Critical hit - roll damage twice
  if (attack.isNatural20) {
    const critDamage = quickRoll(damageFormula);
    return {
      attack,
      damage: {
        ...damage,
        total: damage.total + critDamage.total,
        rolls: [...damage.rolls, ...critDamage.rolls],
      },
      critDamage,
    };
  }

  return { attack, damage };
}

/**
 * Roll multiple dice and sum them
 */
export function rollMultiple(formulas: string[]): { results: RollResult[]; grandTotal: number } {
  const results = formulas.map(f => quickRoll(f));
  const grandTotal = results.reduce((sum, r) => sum + r.total, 0);
  return { results, grandTotal };
}

/**
 * Format roll result for display
 */
export function formatRollResult(result: RollResult): string {
  const rollsStr = result.rolls.length > 1 
    ? `[${result.rolls.join(' + ')}]`
    : `[${result.rolls[0]}]`;
  
  const modStr = result.modifier !== 0 
    ? ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}` 
    : '';
  
  let prefix = '';
  if (result.isNatural20) prefix = '🎯 Critical! ';
  if (result.isNatural1) prefix = '💀 Critical Fail! ';

  return `${prefix}${result.formula}: ${rollsStr}${modStr} = **${result.total}**`;
}
