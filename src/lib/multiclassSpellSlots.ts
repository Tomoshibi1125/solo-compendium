/**
 * Multiclass Spell Slot Calculation
 * Implements D&D 5e PHB page 164 multiclass spellcasting rules
 */

import type { CasterType } from './characterCalculations';

export interface MulticlassLevels {
  fullCasterLevels: number;
  halfCasterLevels: number;
  thirdCasterLevels: number;
  pactMagicSlots?: number;
  pactMagicLevel?: number;
}

/**
 * Calculate effective spellcaster level for multiclass characters
 * Formula: fullCasterLevels + halfCasterLevels/2 + thirdCasterLevels/3
 * Round down to determine spell slot level
 */
export function getEffectiveCasterLevel(levels: MulticlassLevels): number {
  const effectiveLevel = 
    levels.fullCasterLevels + 
    Math.floor(levels.halfCasterLevels / 2) + 
    Math.floor(levels.thirdCasterLevels / 3);
  
  return Math.min(effectiveLevel, 20); // Cap at level 20
}

/**
 * Get spell slots for multiclass character
 * Uses PHB multiclass spell slot table
 */
export function getMulticlassSpellSlots(levels: MulticlassLevels): Record<number, number> {
  const effectiveLevel = getEffectiveCasterLevel(levels);
  const slots: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  };

  if (effectiveLevel === 0) {
    return slots;
  }

  // PHB multiclass spell slot table
  const multiclassTable: Record<number, number[]> = {
    1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  };

  const levelSlots = multiclassTable[Math.min(effectiveLevel, 20)] || multiclassTable[20];
  for (let i = 0; i < 9; i++) {
    slots[i + 1] = levelSlots[i];
  }

  // Add pact magic slots (Warlock) - these are separate and don't use the above table
  if (levels.pactMagicSlots && levels.pactMagicLevel) {
    slots[levels.pactMagicLevel] = (slots[levels.pactMagicLevel] || 0) + levels.pactMagicSlots;
  }

  return slots;
}

/**
 * Calculate spell save DC for multiclass character
 * Uses highest spellcasting ability modifier among all classes
 */
export function getMulticlassSpellSaveDC(
  levels: MulticlassLevels,
  abilityModifiers: Record<string, number>,
  proficiencyBonus: number
): number {
  // Find the highest spellcasting ability modifier
  const spellcastingAbilities = ['INT', 'SENSE', 'PRE']; // System Ascendant names
  const highestMod = Math.max(
    ...spellcastingAbilities.map(ability => abilityModifiers[ability] || 0)
  );

  return 8 + proficiencyBonus + highestMod;
}

/**
 * Determine if character can cast spells
 */
export function canCastSpells(levels: MulticlassLevels): boolean {
  return levels.fullCasterLevels > 0 || 
         levels.halfCasterLevels > 0 || 
         levels.thirdCasterLevels > 0 ||
         Boolean(levels.pactMagicSlots && levels.pactMagicSlots > 0);
}
