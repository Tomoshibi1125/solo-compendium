import { describe, test, expect } from 'vitest';
import { getUnifiedArmorClass, getUnifiedHitPoints, getUnifiedProficiencyBonus } from '../unified/rulesEngine';
import { performConcentrationCheck } from '../5eCombatSystem';
import {
  initializeDeathSaves,
  takeDamageAtZeroHP,
  healAtZeroHP,
  needsDeathSaves,
  getDeathSaveStatus,
} from '../srd5e/deathSaves';
import {
  initializeConcentration,
  startConcentration,
  takeConcentrationDamage,
  endConcentration,
} from '../srd5e/concentration';

describe('5e Combat System Calculations', () => {
  test('Armor class calculation - no armor', () => {
    const character = {
      name: 'Test',
      class: 'warrior' as const,
      race: 'Human',
      background: 'Soldier',
      level: 5,
      abilities: { STR: 14, AGI: 16, VIT: 12, INT: 10, SENSE: 8, PRE: 8 },
      hp: 45,
      maxHp: 45,
      ac: 10,
      speed: 30,
      proficiencyBonus: 3,
      skills: {},
      equipment: [],
      features: [],
      spellSlots: {},
      preparedSpells: []
    };
    const ac = getUnifiedArmorClass(character as any, 'none');
    expect(ac).toBe(13); // 10 + AGI mod (3)
  });
  
  test('Armor class calculation - heavy armor', () => {
    const character = {
      level: 5,
      abilities: { STR: 14, AGI: 16, VIT: 12, INT: 10, SENSE: 8, PRE: 8 }
    };
    const ac = getUnifiedArmorClass(character as any, 'heavy');
    expect(ac).toBe(16); // Base AC for heavy armor
  });
  
  test('Hit points calculation - level 1', () => {
    const character = {
      level: 1,
      abilities: { STR: 14, AGI: 16, VIT: 14, INT: 10, SENSE: 8, PRE: 8 }
    };
    const hp = getUnifiedHitPoints(character as any, 'd8');
    expect(hp).toBe(10); // 8 + VIT mod (2)
  });
  
  test('Hit points calculation - level 5', () => {
    const character = {
      level: 5,
      abilities: { STR: 14, AGI: 16, VIT: 14, INT: 10, SENSE: 8, PRE: 8 }
    };
    const hp = getUnifiedHitPoints(character as any, 'd8');
    expect(hp).toBe(38); // 8 + 2 + 4 * (4 + 1 + 2) = 10 + 28 = 38
  });
  
  test('Proficiency bonus matches 5e standard', () => {
    expect(getUnifiedProficiencyBonus(1)).toBe(2);
    expect(getUnifiedProficiencyBonus(4)).toBe(2);
    expect(getUnifiedProficiencyBonus(5)).toBe(3);
    expect(getUnifiedProficiencyBonus(8)).toBe(3);
    expect(getUnifiedProficiencyBonus(9)).toBe(4);
    expect(getUnifiedProficiencyBonus(20)).toBe(6);
  });
});

describe('5e Combat Automation', () => {
  test('Concentration check DC is max(10, damage/2)', () => {
    const character = {
      id: 'c1',
      name: 'Test Mage',
      level: 5,
      abilities: { STR: 8, AGI: 14, VIT: 14, INT: 18, SENSE: 12, PRE: 10 },
      proficiency_bonus: 3,
      armor_class: 12,
      hp_current: 30,
      hp_max: 30,
      speed: 30,
      conditions: [],
      saving_throw_proficiencies: ['VIT' as const],
      skill_proficiencies: [],
      skill_expertise: [],
      equipment: [],
    };

    // Low damage → DC stays at 10
    const lowResult = performConcentrationCheck(character, 8);
    expect(lowResult.dc).toBe(10);
    expect(lowResult.damage).toBe(8);

    // High damage → DC = floor(damage/2)
    const highResult = performConcentrationCheck(character, 30);
    expect(highResult.dc).toBe(15); // floor(30/2)

    // Exactly 20 damage → DC 10 (20/2 = 10, same as floor)
    const exactResult = performConcentrationCheck(character, 20);
    expect(exactResult.dc).toBe(10);

    // 22 damage → DC 11
    const oddResult = performConcentrationCheck(character, 22);
    expect(oddResult.dc).toBe(11);
  });

  test('Death saving throw state machine tracks successes and failures', () => {
    let state = initializeDeathSaves();
    expect(state.deathSaveSuccesses).toBe(0);
    expect(state.deathSaveFailures).toBe(0);
    expect(needsDeathSaves(state)).toBe(true);

    // Accumulate 3 failures → dead
    state = { ...state, deathSaveFailures: 3 };
    expect(getDeathSaveStatus(state).status).toBe('dead');
    expect(needsDeathSaves(state)).toBe(false);

    // Reset and accumulate 3 successes → stable
    state = initializeDeathSaves();
    state = { ...state, deathSaveSuccesses: 3 };
    expect(getDeathSaveStatus(state).status).toBe('stable');
    expect(needsDeathSaves(state)).toBe(false);

    // Taking damage at 0 HP adds a failure
    state = initializeDeathSaves();
    state = takeDamageAtZeroHP(state, 5);
    expect(state.deathSaveFailures).toBe(1);

    // Massive damage (>=20) causes instant death
    state = initializeDeathSaves();
    state = takeDamageAtZeroHP(state, 25);
    expect(state.isDead).toBe(true);

    // Healing resets death saves
    state = { ...initializeDeathSaves(), deathSaveFailures: 2 };
    state = healAtZeroHP(state, 5);
    expect(state.deathSaveFailures).toBe(0);
    expect(state.deathSaveSuccesses).toBe(0);
  });

  test('Concentration state management: start, damage, end', () => {
    let state = initializeConcentration();
    expect(state.isConcentrating).toBe(false);

    // Start concentrating
    state = startConcentration(state, {
      id: 'spell-1',
      name: 'Bless',
      description: 'Bless spell',
      duration: 10,
    });
    expect(state.isConcentrating).toBe(true);
    expect(state.currentEffect?.name).toBe('Bless');

    // Take minor damage — concentration should hold
    state = takeConcentrationDamage(state, 5);
    expect(state.isConcentrating).toBe(true);

    // End concentration voluntarily
    state = endConcentration(state);
    expect(state.isConcentrating).toBe(false);
    expect(state.currentEffect).toBeNull();
  });
});
