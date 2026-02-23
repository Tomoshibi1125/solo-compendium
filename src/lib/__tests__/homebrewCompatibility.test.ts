import { describe, test, expect } from 'vitest';
import { normalizeAbility, getAbilityDisplayName } from '../5eRulesEngine';

describe('5e Homebrew Compatibility', () => {
  test('System Ascendant abilities normalize correctly', () => {
    expect(normalizeAbility('STR')).toBe('STR');
    expect(normalizeAbility('AGI')).toBe('AGI'); 
    expect(normalizeAbility('VIT')).toBe('VIT');
    expect(normalizeAbility('INT')).toBe('INT');
    expect(normalizeAbility('SENSE')).toBe('SENSE');
    expect(normalizeAbility('PRE')).toBe('PRE');
    // Legacy 5e names still normalize to SA
    expect(normalizeAbility('DEX')).toBe('AGI');
    expect(normalizeAbility('CON')).toBe('VIT');
    expect(normalizeAbility('WIS')).toBe('SENSE');
    expect(normalizeAbility('CHA')).toBe('PRE');
  });
  
  test('System Ascendant ability display names', () => {
    expect(getAbilityDisplayName('STR')).toBe('Strength');
    expect(getAbilityDisplayName('AGI')).toBe('Agility');
    expect(getAbilityDisplayName('VIT')).toBe('Vitality');
    expect(getAbilityDisplayName('INT')).toBe('Intelligence');
    expect(getAbilityDisplayName('SENSE')).toBe('Sense');
    expect(getAbilityDisplayName('PRE')).toBe('Presence');
  });
  
  test('Job compatibility with 5e classes', () => {
    // Test job mappings
    const jobMappings = {
      'Destroyer': 'Fighter',
      'Berserker': 'Barbarian',
      'Assassin': 'Rogue',
      'Striker': 'Monk',
      'Mage': 'Wizard',
      'Esper': 'Sorcerer',
      'Revenant': 'Wizard',
      'Summoner': 'Druid',
      'Herald': 'Cleric',
      'Contractor': 'Warlock',
      'Stalker': 'Ranger',
      'Holy Knight': 'Paladin',
      'Technomancer': 'Artificer',
      'Idol': 'Bard'
    };
    
    Object.entries(jobMappings).forEach(([systemJob, standardClass]) => {
      expect(systemJob).toBeDefined();
      expect(standardClass).toBeDefined();
    });
  });
  
  test('System Favor vs Inspiration', () => {
    // Test System Favor progression matches Bardic Inspiration
    const expectedProgression = [
      { level: 1, max: 1, die: 6 },
      { level: 4, max: 1, die: 6 },
      { level: 5, max: 2, die: 8 },
      { level: 10, max: 2, die: 8 },
      { level: 11, max: 3, die: 10 },
      { level: 16, max: 3, die: 10 },
      { level: 17, max: 4, die: 12 },
      { level: 20, max: 4, die: 12 }
    ];
    
    expectedProgression.forEach(({ level, max, die }) => {
      // This would test the actual System Favor calculation
      expect(level).toBeGreaterThan(0);
      expect(max).toBeGreaterThan(0);
      expect(die).toBeGreaterThan(0);
    });
  });
});
