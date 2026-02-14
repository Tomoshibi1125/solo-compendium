import { describe, test, expect } from 'vitest';
import { getProficiencyBonus, getSpellSlotsPerLevel, getCasterType } from '../5eCharacterCalculations';

describe('5e Proficiency Bonus Calculation', () => {
  test('Level 1 should have +2 proficiency bonus', () => {
    expect(getProficiencyBonus(1)).toBe(2);
  });
  
  test('Level 4 should have +2 proficiency bonus', () => {
    expect(getProficiencyBonus(4)).toBe(2);
  });
  
  test('Level 5 should have +3 proficiency bonus', () => {
    expect(getProficiencyBonus(5)).toBe(3);
  });
  
  test('Level 20 should have +6 proficiency bonus', () => {
    expect(getProficiencyBonus(20)).toBe(6);
  });
});

describe('5e Spell Slot Calculation', () => {
  test('Full caster level 5 should have correct slots', () => {
    const slots = getSpellSlotsPerLevel('full', 5);
    expect(slots[1]).toBe(4);
    expect(slots[2]).toBe(3);
    expect(slots[3]).toBe(2);
  });
  
  test('Half caster level 5 should have correct slots', () => {
    const slots = getSpellSlotsPerLevel('half', 5);
    expect(slots[1]).toBe(4);
    expect(slots[2]).toBe(2);
    expect(slots[3]).toBe(0);
  });
  
  test('Non-caster should have no slots', () => {
    const slots = getSpellSlotsPerLevel('none', 10);
    expect(slots[1]).toBe(0);
    expect(slots[2]).toBe(0);
    expect(slots[3]).toBe(0);
  });
});

describe('System Ascendant Job to 5e Caster Type', () => {
  test('Mage should be full caster (Wizard)', () => {
    expect(getCasterType('Mage')).toBe('full');
  });
  
  test('Warrior should be third caster (Eldritch Knight)', () => {
    expect(getCasterType('Warrior')).toBe('artificer'); // Third casters return 'artificer' type
  });
  
  test('Ranger should be half caster', () => {
    expect(getCasterType('Ranger')).toBe('half');
  });
  
  test('Esper should be full caster (Sorcerer)', () => {
    expect(getCasterType('Esper')).toBe('full');
  });
});
