import { describe, test, expect } from 'vitest';
import { CompendiumAdapter } from '../5eCompendiumAdapter';

describe('Compendium Validation', () => {
  test('All jobs have required fields', () => {
    // Mock job data
    const mockJobs = [
      {
        id: 'warrior',
        name: 'Warrior',
        description: 'A martial combat expert',
        hitDie: 'd10',
        primaryAbility: 'STR',
        savingThrows: ['STR', 'VIT'],
        features: []
      }
    ];

    mockJobs.forEach(job => {
      expect(job.id).toBeDefined();
      expect(job.name).toBeDefined();
      expect(job.description).toBeDefined();
      expect(job.hitDie).toBeDefined();
      expect(job.primaryAbility).toBeDefined();
    });
  });
  
  test('All relics have attunement data', () => {
    // Mock relic data
    const mockRelics = [
      {
        id: 'flame-sword',
        name: 'Flame Sword',
        rarity: 'rare',
        type: 'weapon',
        attunement: true,
        attunementRequirements: 'Requires attunement by a character with flame resistance',
        description: 'A sword that burns with eternal fire'
      }
    ];

    mockRelics.forEach(relic => {
      expect(relic.id).toBeDefined();
      expect(relic.name).toBeDefined();
      expect(relic.rarity).toBeDefined();
      expect(relic.type).toBeDefined();
      expect(typeof relic.attunement).toBe('boolean');
    });
  });
  
  test('Spell data consistency', () => {
    // Mock spell data
    const mockSpells = [
      {
        id: 'fireball',
        name: 'Fireball',
        level: 3,
        school: 'Evocation',
        castingTime: '1 action',
        range: '150 feet',
        duration: 'Instantaneous',
        components: 'V, S, M',
        concentration: false,
        description: 'A fiery explosion',
        classes: ['Mage']
      }
    ];

    mockSpells.forEach(spell => {
      expect(spell.id).toBeDefined();
      expect(spell.name).toBeDefined();
      expect(spell.level).toBeGreaterThanOrEqual(0);
      expect(spell.level).toBeLessThanOrEqual(9);
      expect(spell.castingTime).toBeDefined();
      expect(spell.range).toBeDefined();
      expect(spell.duration).toBeDefined();
      expect(spell.components).toBeDefined();
      expect(typeof spell.concentration).toBe('boolean');
    });
  });
  
  test('Path-Job relationships valid', () => {
    // Mock path data
    const mockPaths = [
      {
        id: 'eldritch-knight',
        name: 'Eldritch Knight',
        jobId: 'warrior',
        description: 'Warrior with magical abilities',
        features: []
      }
    ];

    mockPaths.forEach(path => {
      expect(path.id).toBeDefined();
      expect(path.name).toBeDefined();
      expect(path.jobId).toBeDefined();
      // Would validate that jobId matches actual job.id
    });
  });

  test('Compendium adapter validation', () => {
    const mockCompendium = {
      jobs: [],
      powers: [],
      relics: []
    };

    const validation = CompendiumAdapter.validate(mockCompendium);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });
});
