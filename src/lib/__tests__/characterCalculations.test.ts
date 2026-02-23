import { describe, test, expect } from 'vitest';
import { getCantripsKnownLimit } from '../characterCalculations';

describe('Cantrips Known Limit', () => {
  test('Mage cantrips scale 3/4/5', () => {
    expect(getCantripsKnownLimit('Mage', 1)).toBe(3);
    expect(getCantripsKnownLimit('Mage', 4)).toBe(4);
    expect(getCantripsKnownLimit('Mage', 10)).toBe(5);
  });

  test('Esper cantrips scale 4/5/6', () => {
    expect(getCantripsKnownLimit('Esper', 1)).toBe(4);
    expect(getCantripsKnownLimit('Esper', 4)).toBe(5);
    expect(getCantripsKnownLimit('Esper', 10)).toBe(6);
  });

  test('Non-casters return null', () => {
    expect(getCantripsKnownLimit('Destroyer', 5)).toBeNull();
    expect(getCantripsKnownLimit('Assassin', 5)).toBeNull();
  });
});
