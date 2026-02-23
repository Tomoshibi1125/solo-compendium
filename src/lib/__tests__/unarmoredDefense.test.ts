import { describe, test, expect } from 'vitest';
import { getUnarmoredDefenseBaseAC } from '../unarmoredDefense';

describe('Unarmored Defense', () => {
  test('Striker uses 10 + AGI mod + SENSE mod', () => {
    const ac = getUnarmoredDefenseBaseAC('Striker', {
      AGI: 16, // +3
      SENSE: 14, // +2
    });
    expect(ac).toBe(15);
  });

  test('Berserker uses 10 + AGI mod + VIT mod', () => {
    const ac = getUnarmoredDefenseBaseAC('Berserker', {
      AGI: 14, // +2
      VIT: 18, // +4
    });
    expect(ac).toBe(16);
  });

  test('Other jobs return null', () => {
    const ac = getUnarmoredDefenseBaseAC('Mage', { AGI: 18, SENSE: 18, VIT: 18 });
    expect(ac).toBeNull();
  });
});
