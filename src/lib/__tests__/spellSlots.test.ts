import { describe, test, expect } from 'vitest';
import { getCharacterSpellSlots, castSpell, canCastSpell } from '../5eSpellSystem';
import type { Character } from '../5eRulesEngine';

describe('5e Spell Slot System', () => {
  const mockCharacter: Character = {
    id: 'test-char',
    name: 'Test Character',
    level: 5,
    job: 'Mage',
    abilities: { STR: 10, DEX: 14, CON: 12, INT: 16, WIS: 8, CHA: 8 },
    proficiencyBonus: 3,
    initiative: 2,
    armorClass: 12,
    hitPoints: { current: 25, max: 25, temp: 0 },
    hitDice: { current: 5, max: 5, size: 8 },
    speed: 30,
    conditions: [],
    exhaustionLevel: 0,
    savingThrowProficiencies: ['INT', 'WIS'],
    skillProficiencies: ['arcana', 'investigation'],
    skillExpertise: [],
    equipment: [],
    relics: [],
    attunedRelics: [],
    features: [],
    powers: [],
    systemFavor: { current: 2, max: 2, dieSize: 6 },
    notes: ''
  };

  test('Full caster level 5 has correct spell slots', () => {
    const slots = getCharacterSpellSlots(mockCharacter);
    expect(slots.level1).toBe(4);
    expect(slots.level2).toBe(3);
    expect(slots.level3).toBe(2);
    expect(slots.level4).toBe(0);
    expect(slots.level5).toBe(0);
  });

  test('Can cast spell if slot available', () => {
    const slots = getCharacterSpellSlots(mockCharacter);
    const mockSpell = {
      id: 'firebolt',
      name: 'Firebolt',
      level: 0,
      school: 'Evocation',
      castingTime: '1 action',
      range: '120 feet',
      duration: 'Instantaneous',
      components: 'V, S',
      concentration: false,
      ritual: false,
      description: 'A bolt of fire',
      classes: ['Mage']
    };

    expect(canCastSpell(mockCharacter, mockSpell, slots, [{ spellId: 'firebolt', prepared: true }])).toBe(true);
  });

  test('Cannot cast spell if no slot available', () => {
    const slots = { ...getCharacterSpellSlots(mockCharacter) };
    slots.level1 = 0; // No level 1 slots
    
    const mockSpell = {
      id: 'magic-missile',
      name: 'Magic Missile',
      level: 1,
      school: 'Evocation',
      castingTime: '1 action',
      range: '120 feet',
      duration: 'Instantaneous',
      components: 'V, S',
      concentration: false,
      ritual: false,
      description: 'Magic missiles',
      classes: ['Mage']
    };

    expect(canCastSpell(mockCharacter, mockSpell, slots, [])).toBe(false);
  });

  test('Cast spell consumes slot', () => {
    const slots = getCharacterSpellSlots(mockCharacter);
    const mockSpell = {
      id: 'magic-missile',
      name: 'Magic Missile',
      level: 1,
      school: 'Evocation',
      castingTime: '1 action',
      range: '120 feet',
      duration: 'Instantaneous',
      components: 'V, S',
      concentration: false,
      ritual: false,
      description: 'Magic missiles',
      classes: ['Mage']
    };

    const prepared = [{ spellId: 'magic-missile', prepared: true }];
    const result = castSpell(mockCharacter, mockSpell, slots, prepared);
    expect(result.success).toBe(true);
    expect(result.newSlots.level1).toBe(3); // Consumed 1 slot
  });
});
