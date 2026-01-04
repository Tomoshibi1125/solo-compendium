/**
 * Dice rolling utilities
 * Can be used for direct roll execution without navigation
 */

export interface DiceRoll {
  dice: string; // e.g., "1d20", "2d6+3"
  modifier: number;
  result: number;
  rolls: number[];
  timestamp: Date;
}

/**
 * Parse dice string (e.g., "1d20", "2d6+3", "1d8-1")
 */
export function parseDiceString(diceString: string): {
  count: number;
  sides: number;
  modifier: number;
} {
  const match = diceString.match(/(\d+)d(\d+)([+-]\d+)?/i);
  if (!match) {
    throw new Error(`Invalid dice string: ${diceString}`);
  }

  const count = parseInt(match[1] || '1', 10);
  const sides = parseInt(match[2] || '20', 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  return { count, sides, modifier };
}

/**
 * Roll dice
 */
export function rollDice(count: number, sides: number): number[] {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return rolls;
}

/**
 * Roll dice from string
 */
export function rollDiceString(diceString: string): DiceRoll {
  const { count, sides, modifier } = parseDiceString(diceString);
  const rolls = rollDice(count, sides);
  const result = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;

  return {
    dice: diceString,
    modifier,
    result,
    rolls,
    timestamp: new Date(),
  };
}

/**
 * Format roll result for display
 */
export function formatRollResult(roll: DiceRoll): string {
  const rollsStr = roll.rolls.join(' + ');
  const modifierStr = roll.modifier !== 0 
    ? ` ${roll.modifier >= 0 ? '+' : ''}${roll.modifier}`
    : '';
  return `${rollsStr}${modifierStr} = ${roll.result}`;
}

/**
 * Roll with advantage (roll twice, take higher)
 */
export function rollWithAdvantage(diceString: string, modifier: number = 0): {
  rolls: [DiceRoll, DiceRoll];
  result: number;
  advantage: boolean;
} {
  const { count, sides } = parseDiceString(diceString);
  const roll1 = rollDice(count, sides);
  const roll2 = rollDice(count, sides);
  
  const result1 = roll1.reduce((sum, r) => sum + r, 0) + modifier;
  const result2 = roll2.reduce((sum, r) => sum + r, 0) + modifier;
  
  const advantage = result1 >= result2;
  
  return {
    rolls: [
      { dice: diceString, modifier, result: result1, rolls: roll1, timestamp: new Date() },
      { dice: diceString, modifier, result: result2, rolls: roll2, timestamp: new Date() },
    ],
    result: advantage ? result1 : result2,
    advantage,
  };
}

/**
 * Roll with disadvantage (roll twice, take lower)
 */
export function rollWithDisadvantage(diceString: string, modifier: number = 0): {
  rolls: [DiceRoll, DiceRoll];
  result: number;
  advantage: boolean;
} {
  const { count, sides } = parseDiceString(diceString);
  const roll1 = rollDice(count, sides);
  const roll2 = rollDice(count, sides);
  
  const result1 = roll1.reduce((sum, r) => sum + r, 0) + modifier;
  const result2 = roll2.reduce((sum, r) => sum + r, 0) + modifier;
  
  const advantage = result1 <= result2;
  
  return {
    rolls: [
      { dice: diceString, modifier, result: result1, rolls: roll1, timestamp: new Date() },
      { dice: diceString, modifier, result: result2, rolls: roll2, timestamp: new Date() },
    ],
    result: advantage ? result1 : result2,
    advantage,
  };
}

