import { describe, it, expect } from 'vitest';
import { calculateDifficulty, calculateXP } from './EncounterBuilder';

describe('EncounterBuilder helpers', () => {
  it('calculateXP multiplies monster XP by quantity', () => {
    const monster = ({ xp: 50 } as unknown) as Parameters<typeof calculateXP>[0];
    expect(calculateXP(monster, 3)).toBe(150);
  });

  it('calculateXP treats missing XP as 0', () => {
    const monster = ({ xp: null } as unknown) as Parameters<typeof calculateXP>[0];
    expect(calculateXP(monster, 3)).toBe(0);
  });

  it('calculateDifficulty returns expected tiers for level 1', () => {
    expect(calculateDifficulty(10, 1, 1)).toBe('easy');
    expect(calculateDifficulty(50, 1, 1)).toBe('medium');
    expect(calculateDifficulty(75, 1, 1)).toBe('hard');
    expect(calculateDifficulty(100, 1, 1)).toBe('deadly');
  });

  it('calculateDifficulty uses party-size multiplier', () => {
    // hunterCount=2 uses 1.5x multiplier → 34 XP becomes 51 adjusted → medium at level 1.
    expect(calculateDifficulty(34, 1, 2)).toBe('medium');
  });
});


