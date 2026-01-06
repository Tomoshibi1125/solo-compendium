import { describe, it, expect, vi, afterEach } from 'vitest';
import { rollDiceString, formatRollResult } from './diceRoller';

describe('diceRoller', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rolls a single die with modifier deterministically', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0); // 1 on a d20

    const roll = rollDiceString('1d20+3');

    expect(roll.rolls).toEqual([1]);
    expect(roll.modifier).toBe(3);
    expect(roll.total).toBe(1);
    expect(roll.result).toBe(4);
    expect(formatRollResult(roll)).toBe('1+3 = 4');
  });

  it('rolls multiple dice with negative modifier deterministically', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // 1 on a d6
      .mockReturnValueOnce(0.999); // 6 on a d6

    const roll = rollDiceString('2d6-1');

    expect(roll.rolls).toEqual([1, 6]);
    expect(roll.modifier).toBe(-1);
    expect(roll.total).toBe(7);
    expect(roll.result).toBe(6);
    expect(formatRollResult(roll)).toBe('1 + 6-1 = 6');
  });

  it('throws on invalid dice strings', () => {
    expect(() => rollDiceString('not-a-roll')).toThrow(/invalid dice string/i);
  });
});


