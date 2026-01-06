import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseFormula, rollCheck, rollAttack, quickRoll } from './rollEngine';

describe('rollEngine', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parses formulas with implicit 1 die', () => {
    expect(parseFormula('d20+5')).toEqual({
      dice: 1,
      sides: 20,
      modifier: 5,
      advantage: 'normal',
    });
  });

  it('defaults to normal (no advantage/disadvantage) when omitted', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.2); // 5 on a d20

    const result = rollCheck(2);

    expect(result.rolls).toEqual([5]);
    expect(result.droppedRolls).toBeUndefined();
    expect(result.total).toBe(7);
    expect(result.isNatural20).toBe(false);
    expect(result.isNatural1).toBe(false);
  });

  it('handles advantage on d20 rolls (keeps higher, tracks dropped)', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.2) // 5
      .mockReturnValueOnce(0.7); // 15

    const result = rollCheck(0, 'advantage');

    expect(result.rolls).toEqual([15]);
    expect(result.droppedRolls).toEqual([5]);
    expect(result.total).toBe(15);
  });

  it('handles disadvantage on d20 rolls (keeps lower, tracks dropped)', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.999) // 20
      .mockReturnValueOnce(0); // 1

    const result = rollCheck(0, 'disadvantage');

    expect(result.rolls).toEqual([1]);
    expect(result.droppedRolls).toEqual([20]);
    expect(result.isNatural1).toBe(true);
    expect(result.isNatural20).toBe(false);
  });

  it('rollAttack doubles damage on a natural 20', () => {
    // Attack roll (d20): 20
    // Damage roll (1d6+2): 1
    // Crit damage roll (1d6+2): 4
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.999) // d20 -> 20
      .mockReturnValueOnce(0) // d6 -> 1
      .mockReturnValueOnce(0.5); // d6 -> 4

    const { attack, damage, critDamage } = rollAttack(5, '1d6+2', 'normal');

    expect(attack.isNatural20).toBe(true);
    expect(critDamage).toBeDefined();
    expect(damage.formula).toBe('1d6+2');
    expect(damage.rolls).toEqual([1, 4]);
    expect(damage.total).toBe(9); // (1+2) + (4+2)
  });

  it('quickRoll respects explicit normal', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.999); // 20
    const result = quickRoll('d20', 'normal');
    expect(result.rolls).toEqual([20]);
    expect(result.droppedRolls).toBeUndefined();
    expect(result.isNatural20).toBe(true);
  });
});


