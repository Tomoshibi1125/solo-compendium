/**
 * Advanced Dice Engine - Digital Character Sheet Style
 * 
 * Comprehensive dice rolling with advantage, disadvantage, critical hits,
 * exploding dice, and advanced mechanics
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
  result: number;
  isNatural20: boolean;
  isNatural1: boolean;
  droppedRolls?: number[];
  criticalMultiplier?: number;
  explodedRolls?: number[];
  rerolledRolls?: Array<{original: number, rerolled: number}>;
}

export interface SkillCheckResult extends RollResult {
  skill: string;
  modifier: number;
  dc?: number;
  success?: boolean;
  degree?: 'critical_success' | 'success' | 'failure' | 'critical_failure';
}

export interface AttackResult extends RollResult {
  weapon: string;
  attackBonus: number;
  targetAC?: number;
  hit?: boolean;
  critical?: boolean;
  damage?: DamageResult;
}

export interface DamageResult {
  damageTypes: Record<string, number>;
  totalDamage: number;
  resistances: string[];
  vulnerabilities: string[];
  immunities: string[];
}

export interface InitiativeResult extends RollResult {
  initiative: number;
  dexterityBonus: number;
  otherBonuses: number[];
}

export interface SpellSaveResult extends RollResult {
  ability: string;
  saveBonus: number;
  dc: number;
  success: boolean;
  effects?: string[];
}

export interface DeathSaveResult extends RollResult {
  successes: number;
  failures: number;
  stabilized?: boolean;
  dead?: boolean;
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
function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll dice with advantage/disadvantage
 */
export function rollWithAdvantage(formula: string, advantage: 'advantage' | 'disadvantage' | 'normal'): RollResult {
  const roll = parseFormula(formula);
  const rolls: number[] = [];
  const droppedRolls: number[] = [];

  if (advantage === 'normal') {
    for (let i = 0; i < roll.dice; i++) {
      rolls.push(rollDie(roll.sides));
    }
  } else {
    // Roll twice and take the better/worse
    const roll1 = rollDie(roll.sides);
    const roll2 = rollDie(roll.sides);
    
    if (advantage === 'advantage') {
      rolls.push(Math.max(roll1, roll2));
      droppedRolls.push(Math.min(roll1, roll2));
    } else {
      rolls.push(Math.min(roll1, roll2));
      droppedRolls.push(Math.max(roll1, roll2));
    }
  }

  const total = rolls.reduce((sum, r) => sum + r, 0);
  const result = total + roll.modifier;

  return {
    formula,
    rolls,
    modifier: roll.modifier,
    total,
    result,
    isNatural20: rolls.some(r => r === 20),
    isNatural1: rolls.some(r => r === 1),
    droppedRolls,
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
    isNatural20: rolls.some(r => r === 20),
    isNatural1: rolls.some(r => r === 1),
    criticalMultiplier,
  };
}

/**
 * Roll with reroll mechanic (reroll dice below threshold)
 */
export function rollWithReroll(formula: string, rerollThreshold: number): RollResult {
  const roll = parseFormula(formula);
  const rolls: number[] = [];
  const rerolledRolls: Array<{original: number, rerolled: number}> = [];

  for (let i = 0; i < roll.dice; i++) {
    let dieResult = rollDie(roll.sides);
    const original = dieResult;
    
    while (dieResult <= rerollThreshold) {
      dieResult = rollDie(roll.sides);
    }
    
    if (original !== dieResult) {
      rerolledRolls.push({ original, rerolled: dieResult });
    }
    
    rolls.push(dieResult);
  }

  const total = rolls.reduce((sum, r) => sum + r, 0);
  const result = total + roll.modifier;

  return {
    formula,
    rolls,
    modifier: roll.modifier,
    total,
    result,
    isNatural20: rolls.some(r => r === 20),
    isNatural1: rolls.some(r => r === 1),
    rerolledRolls,
  };
}

/**
 * Roll with minimum value mechanic
 */
export function rollWithMinimum(formula: string, minimum: number): RollResult {
  const roll = parseFormula(formula);
  const rolls: number[] = [];

  for (let i = 0; i < roll.dice; i++) {
    let dieResult = rollDie(roll.sides);
    if (dieResult < minimum) {
      dieResult = minimum;
    }
    rolls.push(dieResult);
  }

  const total = rolls.reduce((sum, r) => sum + r, 0);
  const result = total + roll.modifier;

  return {
    formula,
    rolls,
    modifier: roll.modifier,
    total,
    result,
    isNatural20: rolls.some(r => r === 20),
    isNatural1: rolls.some(r => r === 1),
  };
}

/**
 * Roll with exploding dice mechanic
 */
export function rollExploding(formula: string, explodeOn: number): RollResult {
  const roll = parseFormula(formula);
  const rolls: number[] = [];
  const explodedRolls: number[] = [];

  for (let i = 0; i < roll.dice; i++) {
    let dieResult = rollDie(roll.sides);
    rolls.push(dieResult);
    
    // Explode dice that hit the threshold
    while (dieResult === explodeOn) {
      const explosionRoll = rollDie(roll.sides);
      explodedRolls.push(explosionRoll);
      rolls.push(explosionRoll);
      dieResult = explosionRoll;
    }
  }

  const total = rolls.reduce((sum, r) => sum + r, 0);
  const result = total + roll.modifier;

  return {
    formula,
    rolls,
    modifier: roll.modifier,
    total,
    result,
    isNatural20: rolls.some(r => r === 20),
    isNatural1: rolls.some(r => r === 1),
    explodedRolls,
  };
}

/**
 * Roll with compounding exploding dice
 */
export function rollCompounding(formula: string, compoundOn: number): RollResult {
  const roll = parseFormula(formula);
  const rolls: number[] = [];
  const explodedRolls: number[] = [];

  for (let i = 0; i < roll.dice; i++) {
    let dieResult = rollDie(roll.sides);
    let totalRoll = dieResult;
    
    // Compound dice that hit the threshold
    while (dieResult === compoundOn) {
      const explosionRoll = rollDie(roll.sides);
      explodedRolls.push(explosionRoll);
      totalRoll += explosionRoll;
      dieResult = explosionRoll;
    }
    
    rolls.push(totalRoll);
  }

  const total = rolls.reduce((sum, r) => sum + r, 0);
  const result = total + roll.modifier;

  return {
    formula,
    rolls,
    modifier: roll.modifier,
    total,
    result,
    isNatural20: rolls.some(r => r === 20),
    isNatural1: rolls.some(r => r === 1),
    explodedRolls,
  };
}

/**
 * Roll with penetrating exploding dice
 */
export function rollPenetrating(formula: string, penetrateOn: number): RollResult {
  const roll = parseFormula(formula);
  const rolls: number[] = [];
  const explodedRolls: number[] = [];

  for (let i = 0; i < roll.dice; i++) {
    let dieResult = rollDie(roll.sides);
    let totalRoll = dieResult;
    
    // Penetrating dice that hit the threshold
    while (dieResult === penetrateOn) {
      const explosionRoll = rollDie(roll.sides);
      explodedRolls.push(explosionRoll);
      totalRoll += explosionRoll - 1; // Subtract 1 for penetrating
      dieResult = explosionRoll;
    }
    
    rolls.push(totalRoll);
  }

  const total = rolls.reduce((sum, r) => sum + r, 0);
  const result = total + roll.modifier;

  return {
    formula,
    rolls,
    modifier: roll.modifier,
    total,
    result,
    isNatural20: rolls.some(r => r === 20),
    isNatural1: rolls.some(r => r === 1),
    explodedRolls,
  };
}

/**
 * Roll dice pool with different dice types
 */
export function rollDicePool(dice: Array<{count: number, sides: number}>): RollResult {
  const allRolls: number[] = [];
  const totalModifier = 0;
  let formula = '';

  dice.forEach((die, index) => {
    if (index > 0) formula += ' + ';
    formula += `${die.count}d${die.sides}`;
    
    for (let i = 0; i < die.count; i++) {
      allRolls.push(rollDie(die.sides));
    }
  });

  const total = allRolls.reduce((sum, r) => sum + r, 0);
  const result = total + totalModifier;

  return {
    formula,
    rolls: allRolls,
    modifier: totalModifier,
    total,
    result,
    isNatural20: allRolls.some(r => r === 20),
    isNatural1: allRolls.some(r => r === 1),
  };
}

/**
 * Roll and keep highest dice
 */
export function rollKeepHighest(formula: string, keepCount: number): RollResult {
  const roll = parseFormula(formula);
  const allRolls: number[] = [];

  // Roll all dice
  for (let i = 0; i < roll.dice; i++) {
    allRolls.push(rollDie(roll.sides));
  }

  // Sort and keep highest
  allRolls.sort((a, b) => b - a);
  const keptRolls = allRolls.slice(0, keepCount);
  const droppedRolls = allRolls.slice(keepCount);

  const total = keptRolls.reduce((sum, r) => sum + r, 0);
  const result = total + roll.modifier;

  return {
    formula,
    rolls: keptRolls,
    modifier: roll.modifier,
    total,
    result,
    isNatural20: keptRolls.some(r => r === 20),
    isNatural1: keptRolls.some(r => r === 1),
    droppedRolls,
  };
}

/**
 * Roll and keep lowest dice
 */
export function rollKeepLowest(formula: string, keepCount: number): RollResult {
  const roll = parseFormula(formula);
  const allRolls: number[] = [];

  // Roll all dice
  for (let i = 0; i < roll.dice; i++) {
    allRolls.push(rollDie(roll.sides));
  }

  // Sort and keep lowest
  allRolls.sort((a, b) => a - b);
  const keptRolls = allRolls.slice(0, keepCount);
  const droppedRolls = allRolls.slice(keepCount);

  const total = keptRolls.reduce((sum, r) => sum + r, 0);
  const result = total + roll.modifier;

  return {
    formula,
    rolls: keptRolls,
    modifier: roll.modifier,
    total,
    result,
    isNatural20: keptRolls.some(r => r === 20),
    isNatural1: keptRolls.some(r => r === 1),
    droppedRolls,
  };
}

/**
 * Apply ability modifier to roll
 */
export function applyAbilityModifier(roll: RollResult, ability: string, score: number): RollResult {
  const abilityModifier = Math.floor((score - 10) / 2);
  const newModifier = roll.modifier + abilityModifier;
  const newTotal = roll.total + abilityModifier;
  
  return {
    ...roll,
    modifier: newModifier,
    total: newTotal,
    result: newTotal,
  };
}

/**
 * Apply proficiency bonus to roll
 */
export function applyProficiencyBonus(roll: RollResult, level: number): RollResult {
  const proficiencyBonus = Math.ceil(level / 4) + 1;
  const newModifier = roll.modifier + proficiencyBonus;
  const newTotal = roll.total + proficiencyBonus;
  
  return {
    ...roll,
    modifier: newModifier,
    total: newTotal,
    result: newTotal,
  };
}

/**
 * Apply expertise (double proficiency) to roll
 */
export function applyExpertise(roll: RollResult, hasExpertise: boolean): RollResult {
  if (!hasExpertise) return roll;
  
  // Double the proficiency bonus (assuming it's already included)
  const expertiseBonus = roll.modifier; // This assumes modifier contains proficiency
  const newModifier = roll.modifier + expertiseBonus;
  const newTotal = roll.total + expertiseBonus;
  
  return {
    ...roll,
    modifier: newModifier,
    total: newTotal,
    result: newTotal,
  };
}

/**
 * Format roll result for display
 */
export function formatRollResult(roll: RollResult): string {
  const rollsStr = roll.rolls.join(' + ');
  
  if (roll.droppedRolls && roll.droppedRolls.length > 0) {
    const droppedStr = roll.droppedRolls.join(' + ');
    return `${rollsStr} (dropped: ${droppedStr})${roll.modifier >= 0 ? '+' : ''}${roll.modifier} = ${roll.result}`;
  }
  
  if (roll.explodedRolls && roll.explodedRolls.length > 0) {
    const explodedStr = roll.explodedRolls.join(' + ');
    return `${rollsStr} (exploded: ${explodedStr})${roll.modifier >= 0 ? '+' : ''}${roll.modifier} = ${roll.result}`;
  }
  
  if (roll.rerolledRolls && roll.rerolledRolls.length > 0) {
    const rerollStr = roll.rerolledRolls.map(r => `${r.original}→${r.rerolled}`).join(', ');
    return `${rollsStr} (rerolled: ${rerollStr})${roll.modifier >= 0 ? '+' : ''}${roll.modifier} = ${roll.result}`;
  }
  
  if (roll.modifier === 0) {
    return `${rollsStr} = ${roll.result}`;
  }
  
  return `${rollsStr}${roll.modifier >= 0 ? '+' : ''}${roll.modifier} = ${roll.result}`;
}

/**
 * Validate dice string format
 */
export function validateDiceString(diceString: string): boolean {
  if (!diceString || typeof diceString !== 'string') return false;
  
  // Basic pattern: NdS+/-M where N=dice count, S=sides, M=modifier
  const pattern = /^\d+d\d+(?:[+-]\d+)?$/;
  return pattern.test(diceString);
}

