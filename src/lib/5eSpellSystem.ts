/**
 * 5e Standard Spell System with System Ascendant Flavor
 * Uses only spell slots - no mana system
 */

import type { AbilityScore, Character } from './5eRulesEngine';
import { getSpellSlotsPerLevel, getCasterType, getSpellcastingAbility } from './5eCharacterCalculations';

// Standard 5e spell interface with System Ascendant flavor
export interface Spell {
  id: string;
  name: string;
  level: number; // 0-9
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  components: string; // V, S, M format
  concentration: boolean;
  ritual: boolean;
  description: string;
  higherLevels?: string;
  classes: string[];
  subclasses?: string[];
  // System Ascendant specific
  rank?: 'D' | 'C' | 'B' | 'A' | 'S';
  systemType?: 'Attack' | 'Defense' | 'Utility' | 'Healing';
}

// Spell slot management for characters
export interface CharacterSpellSlots {
  cantrips: number;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
  level7: number;
  level8: number;
  level9: number;
}

// Spell preparation and casting
export interface PreparedSpell {
  spellId: string;
  prepared: boolean;
  castToday?: boolean;
}

/**
 * Get spell slots for a character (standard 5e)
 */
export function getCharacterSpellSlots(character: Character): CharacterSpellSlots {
  const casterType = getCasterType(character.job);
  const slots = getSpellSlotsPerLevel(casterType, character.level);
  
  return {
    cantrips: slots[0] || 0,
    level1: slots[1] || 0,
    level2: slots[2] || 0,
    level3: slots[3] || 0,
    level4: slots[4] || 0,
    level5: slots[5] || 0,
    level6: slots[6] || 0,
    level7: slots[7] || 0,
    level8: slots[8] || 0,
    level9: slots[9] || 0,
  };
}

/**
 * Check if character can cast a spell
 */
export function canCastSpell(
  character: Character,
  spell: Spell,
  currentSlots: CharacterSpellSlots,
  preparedSpells: PreparedSpell[]
): boolean {
  // Check if spell is prepared (for prepared casters)
  const isPreparedCaster = ['Mage', 'Oracle', 'Technomancer', 'Revenant', 'Resonant', 'Healer', 'Warden', 'Crusader', 'Stalker', 'Herald', 'Holy Knight', 'Ranger', 'Techsmith'].includes(character.job);
  if (isPreparedCaster) {
    const prepared = preparedSpells.find(p => p.spellId === spell.id);
    if (!prepared?.prepared) return false;
  }
  
  // Check if spell slot is available
  if (spell.level === 0) return true; // Cantrips don't use slots
  
  const slotKey = `level${spell.level}` as keyof CharacterSpellSlots;
  return (currentSlots[slotKey] ?? 0) > 0;
}

/**
 * Cast a spell and consume a spell slot
 */
export function castSpell(
  character: Character,
  spell: Spell,
  currentSlots: CharacterSpellSlots,
  preparedSpells: PreparedSpell[]
): {
  success: boolean;
  newSlots: CharacterSpellSlots;
  updatedPrepared?: PreparedSpell[];
} {
  if (!canCastSpell(character, spell, currentSlots, preparedSpells)) {
    return { success: false, newSlots: currentSlots };
  }
  
  const newSlots = { ...currentSlots };
  const updatedPrepared = [...preparedSpells];
  
  // Consume spell slot
  if (spell.level > 0) {
    const slotKey = `level${spell.level}` as keyof CharacterSpellSlots;
    newSlots[slotKey] = Math.max(0, (newSlots[slotKey] ?? 0) - 1);
  }
  
  // Mark as cast today (for prepared casters)
  const isPreparedCaster = ['Mage', 'Oracle', 'Technomancer', 'Revenant', 'Resonant', 'Healer', 'Warden', 'Crusader', 'Stalker', 'Herald', 'Holy Knight', 'Ranger', 'Techsmith'].includes(character.job);
  if (isPreparedCaster) {
    const preparedIndex = updatedPrepared.findIndex(p => p.spellId === spell.id);
    if (preparedIndex >= 0) {
      updatedPrepared[preparedIndex] = {
        ...updatedPrepared[preparedIndex],
        castToday: true
      };
    }
  }
  
  return {
    success: true,
    newSlots,
    updatedPrepared: isPreparedCaster ? updatedPrepared : undefined
  };
}

// Shared prepared caster list for consistent checks
const PREPARED_CASTERS = ['Mage', 'Oracle', 'Technomancer', 'Revenant', 'Resonant', 'Healer', 'Warden', 'Crusader', 'Stalker', 'Herald', 'Holy Knight', 'Ranger', 'Techsmith'];

/**
 * Calculate spell save DC for a character
 */
export function calculateSpellSaveDC(character: Character): number {
  const spellcastingAbility = getSpellcastingAbility(character.job);
  if (!spellcastingAbility) return 8 + character.proficiencyBonus;
  
  const abilityMod = Math.floor((character.abilities[spellcastingAbility] - 10) / 2);
  return 8 + character.proficiencyBonus + abilityMod;
}

/**
 * Get spells a character can prepare
 */
export function getPreparableSpells(
  character: Character,
  allSpells: Spell[],
  currentPrepared: PreparedSpell[]
): Spell[] {
  const spellcastingAbility = getSpellcastingAbility(character.job);
  if (!spellcastingAbility) return [];
  
  const abilityMod = Math.floor((character.abilities[spellcastingAbility] - 10) / 2);
  const maxPrepared = Math.max(1, abilityMod + character.level);
  
  // Get spells character knows (for known casters like Esper/Sorcerer)
  const knownSpells = allSpells.filter(spell => 
    spell.classes.includes(character.job) && spell.level <= character.level
  );
  
  // For prepared casters, return all spells they could prepare
  const isPreparedCaster = PREPARED_CASTERS.includes(character.job);
  if (isPreparedCaster) {
    return knownSpells;
  }
  
  // For known casters, return spells they know
  return knownSpells.slice(0, maxPrepared);
}

/**
 * Prepare spells for a character (prepared casters only)
 */
export function prepareSpells(
  character: Character,
  spellIds: string[],
  allSpells: Spell[],
  currentPrepared: PreparedSpell[]
): {
  success: boolean;
  preparedSpells: PreparedSpell[];
  message?: string;
} {
  const isPreparedCaster = PREPARED_CASTERS.includes(character.job);
  if (!isPreparedCaster) {
    return { 
      success: false, 
      preparedSpells: currentPrepared,
      message: 'This class does not prepare spells'
    };
  }
  
  const spellcastingAbility = getSpellcastingAbility(character.job);
  if (!spellcastingAbility) {
    return { 
      success: false, 
      preparedSpells: currentPrepared,
      message: 'This class does not prepare spells'
    };
  }
  
  const abilityMod = Math.floor((character.abilities[spellcastingAbility] - 10) / 2);
  const maxPrepared = Math.max(1, abilityMod + character.level);
  
  if (spellIds.length > maxPrepared) {
    return { 
      success: false, 
      preparedSpells: currentPrepared,
      message: `Can prepare only ${maxPrepared} spells`
    };
  }
  
  // Validate spells
  const validSpells = spellIds.map(id => 
    allSpells.find(spell => spell.id === id)
  ).filter(Boolean) as Spell[];
  
  if (validSpells.length !== spellIds.length) {
    return { 
      success: false, 
      preparedSpells: currentPrepared,
      message: 'Some spells not found for this class'
    };
  }
  
  // Create prepared spells array
  const preparedSpells: PreparedSpell[] = validSpells.map(spell => ({
    spellId: spell.id,
    prepared: true
  }));
  
  return { success: true, preparedSpells };
}

/**
 * Rest spell slots after long rest
 */
export function restSpellSlots(character: Character): CharacterSpellSlots {
  return getCharacterSpellSlots(character);
}

/**
 * Convert System Ascendant rank to 5e spell level
 */
export function convertRankToLevel(rank: 'D' | 'C' | 'B' | 'A' | 'S'): number {
  const rankToLevel: Record<typeof rank, number> = {
    'D': 1,
    'C': 2,
    'B': 3,
    'A': 4,
    'S': 5
  };
  return rankToLevel[rank];
}

/**
 * Convert 5e spell level to System Ascendant rank
 */
export function convertLevelToRank(level: number): 'D' | 'C' | 'B' | 'A' | 'S' {
  if (level <= 1) return 'D';
  if (level <= 2) return 'C';
  if (level <= 3) return 'B';
  if (level <= 4) return 'A';
  return 'S';
}

/**
 * Format spell information for display
 */
export function formatSpellInfo(spell: Spell): string {
  const level = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;
  const rank = spell.rank ? ` (${spell.rank}-rank)` : '';
  const components = spell.components || 'V, S, M';
  const concentration = spell.concentration ? ' (Concentration)' : '';
  const ritual = spell.ritual ? ' (Ritual)' : '';
  
  return `${spell.name} - ${level}${rank}\n${spell.school}\n${components}${concentration}${ritual}\n${spell.description}`;
}

/**
 * Get spell casting time in readable format
 */
export function formatCastingTime(castingTime: string): string {
  const timeMap: Record<string, string> = {
    '1 action': '1 Action',
    '1 bonus action': '1 Bonus Action',
    '1 reaction': '1 Reaction',
    '1 minute': '1 Minute',
    '10 minutes': '10 Minutes',
    '1 hour': '1 Hour',
    '8 hours': '8 Hours',
    '24 hours': '24 Hours'
  };
  
  return timeMap[castingTime] || castingTime;
}

/**
 * Get spell range in readable format
 */
export function formatRange(range: string): string {
  const rangeMap: Record<string, string> = {
    'self': 'Self',
    'touch': 'Touch',
    '5 feet': '5 ft.',
    '10 feet': '10 ft.',
    '30 feet': '30 ft.',
    '60 feet': '60 ft.',
    '90 feet': '90 ft.',
    '120 feet': '120 ft.',
    '150 feet': '150 ft.',
    '300 feet': '300 ft.'
  };
  
  return rangeMap[range] || range;
}

/**
 * Check if spell requires concentration
 */
export function requiresConcentration(spell: Spell): boolean {
  return spell.concentration || false;
}

/**
 * Get spell components as array
 */
export function getSpellComponents(components: string): string[] {
  return components.split(', ').map(c => c.trim());
}

// Export all spell system functions
export const SpellSystem = {
  getCharacterSpellSlots,
  canCastSpell,
  castSpell,
  calculateSpellSaveDC,
  getPreparableSpells,
  prepareSpells,
  restSpellSlots,
  convertRankToLevel,
  convertLevelToRank,
  formatSpellInfo,
  formatCastingTime,
  formatRange,
  requiresConcentration,
  getSpellComponents
};
