import { describe, test, expect } from 'vitest';
import { 
  calculateCharacterStats, 
  calculateHPMax, 
  getProficiencyBonus,
  getSpellSlotsPerLevel, 
  getCasterType,
  getSpellcastingAbility,
  getSpellsKnownLimit,
  getSpellsPreparedLimit
} from '../5eCharacterCalculations';
import type { AbilityScore } from '../5eRulesEngine';

describe('5e Character Calculations', () => {
  const mockCharacterStats = {
    level: 5,
    abilities: { STR: 14, AGI: 16, VIT: 12, INT: 16, SENSE: 8, PRE: 8 },
    savingThrowProficiencies: ['INT', 'SENSE'] as never,
    skillProficiencies: ['arcana', 'investigation', 'perception'],
    skillExpertise: [],
    armorClass: 15,
    speed: 30
  };

  test('Calculate character stats', () => {
    const stats = calculateCharacterStats(mockCharacterStats);
    
    expect(stats.proficiencyBonus).toBe(3);
    expect(stats.systemFavorDie).toBe(6);
    expect(stats.systemFavorMax).toBe(4);
    expect(stats.abilityModifiers.STR).toBe(2);
    expect(stats.abilityModifiers.AGI).toBe(3);
    expect(stats.abilityModifiers.VIT).toBe(1);
    expect(stats.abilityModifiers.INT).toBe(3);
    expect(stats.abilityModifiers.SENSE).toBe(-1);
    expect(stats.abilityModifiers.PRE).toBe(-1);
    
    expect(stats.savingThrows.STR).toBe(2); // STR not proficient
    expect(stats.savingThrows.INT).toBe(6); // INT proficient: 3 + 3
    expect(stats.savingThrows.SENSE).toBe(2); // SENSE proficient: -1 + 3
    
    expect(stats.skills.perception).toBe(2); // perception: -1 + 3
    expect(stats.skills.arcana).toBe(6); // arcana: 3 + 3
    expect(stats.skills.investigation).toBe(6); // investigation: INT mod(3) + proficiency(3)
  });

  test('HP calculation', () => {
    // Level 1, d8 hit die, CON 14 (+2)
    const hp1 = calculateHPMax(1, 8, 2);
    expect(hp1).toBe(10); // 8 + 2
    
    // Level 5, d8 hit die, CON 14 (+2)
    const hp5 = calculateHPMax(5, 8, 2);
    expect(hp5).toBe(38); // 8 + 2 + 4 * (4 + 2 + 1) = 10 + 28 = 38
    
    // Level 10, d10 hit die, CON 16 (+3)
    const hp10 = calculateHPMax(10, 10, 3);
    expect(hp10).toBe(94); // 10 + 3 + 9 * (5 + 1 + 3) = 13 + 81 = 94
  });

  test('Spell slot calculations - Full caster', () => {
    const slots = getSpellSlotsPerLevel('full', 5);
    expect(slots[1]).toBe(4);
    expect(slots[2]).toBe(3);
    expect(slots[3]).toBe(2);
    expect(slots[4]).toBe(0);
    expect(slots[5]).toBe(0);
  });

  test('Spell slot calculations - Half caster', () => {
    const slots = getSpellSlotsPerLevel('half', 5);
    expect(slots[1]).toBe(4);
    expect(slots[2]).toBe(2);
    expect(slots[3]).toBe(0);
    expect(slots[4]).toBe(0);
    expect(slots[5]).toBe(0);
  });

  test('Spell slot calculations - Non-caster', () => {
    const slots = getSpellSlotsPerLevel('none', 10);
    expect(slots[1]).toBe(0);
    expect(slots[2]).toBe(0);
    expect(slots[3]).toBe(0);
    expect(slots[4]).toBe(0);
    expect(slots[5]).toBe(0);
  });

  test('Caster type detection', () => {
    expect(getCasterType('Mage')).toBe('full');
    expect(getCasterType('Esper')).toBe('full');
    expect(getCasterType('Herald')).toBe('full'); // Cleric = full caster
    expect(getCasterType('Idol')).toBe('full'); // Bard = full caster
    expect(getCasterType('Stalker')).toBe('half'); // Ranger = half caster
    expect(getCasterType('Technomancer')).toBe('artificer');
    expect(getCasterType('Contractor')).toBe('pact');
    expect(getCasterType('Destroyer')).toBe('none');
  });

  test('Spellcasting ability detection', () => {
    expect(getSpellcastingAbility('Mage')).toBe('INT');
    expect(getSpellcastingAbility('Esper')).toBe('PRE');
    expect(getSpellcastingAbility('Herald')).toBe('SENSE'); // Cleric uses Sense (Wisdom)
    expect(getSpellcastingAbility('Stalker')).toBe('SENSE');
    expect(getSpellcastingAbility('Summoner')).toBe('SENSE');
    expect(getSpellcastingAbility('Idol')).toBe('PRE');
    expect(getSpellcastingAbility('Destroyer')).toBeNull(); // Non-caster
  });

  test('Spells known limit', () => {
    // Esper (Sorcerer) - known caster
    const knownLimit = getSpellsKnownLimit('Esper', 5);
    expect(knownLimit).toBe(6); // Level + 1
    
    // Mage (Wizard) - prepared caster
    const preparedLimit = getSpellsPreparedLimit('Mage', 5, 3);
    expect(preparedLimit).toBe(8); // 3 + 5
    
    // Non-caster
    const nonCasterLimit = getSpellsKnownLimit('Destroyer', 5);
    expect(nonCasterLimit).toBeNull();
  });

  test('Spells prepared limit', () => {
    // INT 16 (+3) + Level 5 = 8 prepared spells
    const limit = getSpellsPreparedLimit('Mage', 5, 3);
    expect(limit).toBe(8);
    
    // Minimum 1 prepared spell
    const minLimit = getSpellsPreparedLimit('Mage', 1, -1);
    expect(minLimit).toBe(1);
  });
});
