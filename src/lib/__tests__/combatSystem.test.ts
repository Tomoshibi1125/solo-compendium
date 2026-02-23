import { describe, test, expect } from 'vitest';
import { getAbilityModifier, getProficiencyBonus } from '../5eRulesEngine';
import { calculateHPMax } from '../characterCalculations';
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
  test('Armor class calculation - no armor (10 + AGI mod)', () => {
    const agiMod = getAbilityModifier(16); // +3
    const ac = 10 + agiMod;
    expect(ac).toBe(13);
  });

  test('Hit points calculation - level 1 (d8 + VIT mod)', () => {
    const vitMod = getAbilityModifier(14); // +2
    const hp = calculateHPMax(1, 8, vitMod);
    expect(hp).toBe(10); // 8 + 2
  });

  test('Hit points calculation - level 5 (d8 + VIT mod per level)', () => {
    const vitMod = getAbilityModifier(14); // +2
    const hp = calculateHPMax(5, 8, vitMod);
    expect(hp).toBe(38); // (8+2) + 4*(5+2) = 10 + 28
  });

  test('Proficiency bonus matches 5e standard', () => {
    expect(getProficiencyBonus(1)).toBe(2);
    expect(getProficiencyBonus(4)).toBe(2);
    expect(getProficiencyBonus(5)).toBe(3);
    expect(getProficiencyBonus(8)).toBe(3);
    expect(getProficiencyBonus(9)).toBe(4);
    expect(getProficiencyBonus(20)).toBe(6);
  });
});

describe('5e Combat Automation', () => {
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
