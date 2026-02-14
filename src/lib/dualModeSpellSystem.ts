/**
 * Dual Mode Spell System
 * Supports both System Ascendant mana-based spells and SRD 5e spell slots
 */

import type { CasterType } from './characterCalculations';

// System Ascendant spell interface
export interface ManaSpell {
  id: string;
  name: string;
  description: string;
  type: 'Attack' | 'Defense' | 'Utility' | 'Healing';
  rank: 'D' | 'C' | 'B' | 'A' | 'S';
  manaCost: number;
  damage?: number;
  healing?: number;
  range: number;
  cooldown: number;
  image?: string;
  effect: string;
}

// SRD 5e spell interface
export interface SpellSlotSpell {
  id: string;
  name: string;
  description: string;
  level: number; // 0-9
  school: string;
  castingTime: string;
  range: string;
  duration: string;
  components: string[]; // V, S, M
  concentration: boolean;
  ritual: boolean;
  classes: string[];
  subclasses?: string[];
}

// Unified spell interface
export interface UnifiedSpell {
  id: string;
  name: string;
  description: string;
  // System Ascendant properties
  manaCost?: number;
  rank?: 'D' | 'C' | 'B' | 'A' | 'S';
  cooldown?: number;
  // 5e properties
  level?: number;
  school?: string;
  castingTime?: string;
  range?: string;
  duration?: string;
  components?: string[];
  concentration?: boolean;
  ritual?: boolean;
  // Common properties
  damage?: number;
  healing?: number;
  rangeNumber?: number; // For System Ascendant numeric range
  rangeString?: string; // For 5e string range
  effect: string;
  image?: string;
  classes: string[];
  mode: 'mana' | 'spell-slots' | 'dual';
}

/**
 * Convert System Ascendant rank to 5e spell level
 */
export function convertRankToLevel(rank: 'D' | 'C' | 'B' | 'A' | 'S'): number {
  const rankToLevel: Record<typeof rank, number> = {
    'D': 1,  // D-rank = 1st level
    'C': 2,  // C-rank = 2nd level
    'B': 3,  // B-rank = 3rd level
    'A': 4,  // A-rank = 4th level
    'S': 5   // S-rank = 5th level (or higher for epic spells)
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
 * Convert mana cost to equivalent spell level
 * Based on typical mana costs in the System Ascendant data
 */
export function convertManaToLevel(manaCost: number): number {
  if (manaCost <= 50) return 0;  // Cantrip equivalent
  if (manaCost <= 70) return 1;
  if (manaCost <= 90) return 2;
  if (manaCost <= 110) return 3;
  if (manaCost <= 130) return 4;
  return 5; // 5th level or higher
}

/**
 * Convert spell level to approximate mana cost
 */
export function convertLevelToMana(level: number): number {
  const levelToMana: Record<number, number> = {
    0: 30,  // Cantrip
    1: 60,
    2: 80,
    3: 100,
    4: 120,
    5: 140,
    6: 160,
    7: 180,
    8: 200,
    9: 220
  };
  return levelToMana[level] || 140;
}

/**
 * Convert System Ascendant mana spell to unified format
 */
export function convertManaSpellToUnified(manaSpell: ManaSpell): UnifiedSpell {
  return {
    id: manaSpell.id,
    name: manaSpell.name,
    description: manaSpell.description,
    manaCost: manaSpell.manaCost,
    rank: manaSpell.rank,
    level: convertRankToLevel(manaSpell.rank),
    cooldown: manaSpell.cooldown,
    damage: manaSpell.damage,
    healing: manaSpell.healing,
    rangeNumber: manaSpell.range,
    effect: manaSpell.effect,
    image: manaSpell.image,
    classes: [], // Will be filled based on spell type
    mode: 'mana'
  };
}

/**
 * Convert 5e spell slot spell to unified format
 */
export function convertSpellSlotToUnified(spellSlotSpell: SpellSlotSpell): UnifiedSpell {
  return {
    id: spellSlotSpell.id,
    name: spellSlotSpell.name,
    description: spellSlotSpell.description,
    level: spellSlotSpell.level,
    rank: convertLevelToRank(spellSlotSpell.level),
    manaCost: convertLevelToMana(spellSlotSpell.level),
    school: spellSlotSpell.school,
    castingTime: spellSlotSpell.castingTime,
    range: spellSlotSpell.range,
    duration: spellSlotSpell.duration,
    components: spellSlotSpell.components,
    concentration: spellSlotSpell.concentration,
    ritual: spellSlotSpell.ritual,
    effect: spellSlotSpell.description,
    classes: spellSlotSpell.classes,
    mode: 'spell-slots'
  };
}

/**
 * Create dual-mode spell (works in both systems)
 */
export function createDualModeSpell(
  manaSpell: ManaSpell,
  spellSlotSpell: SpellSlotSpell
): UnifiedSpell {
  return {
    id: manaSpell.id,
    name: manaSpell.name,
    description: manaSpell.description,
    manaCost: manaSpell.manaCost,
    rank: manaSpell.rank,
    level: spellSlotSpell.level,
    cooldown: manaSpell.cooldown,
    school: spellSlotSpell.school,
    castingTime: spellSlotSpell.castingTime,
    range: spellSlotSpell.range,
    duration: spellSlotSpell.duration,
    components: spellSlotSpell.components,
    concentration: spellSlotSpell.concentration,
    ritual: spellSlotSpell.ritual,
    damage: manaSpell.damage || spellSlotSpell.level * 8, // Estimate damage
    healing: manaSpell.healing,
    effect: manaSpell.effect,
    image: manaSpell.image,
    classes: [...new Set([...manaSpell.type === 'Healing' ? ['Healer'] : [], ...spellSlotSpell.classes])],
    mode: 'dual'
  };
}

/**
 * Check if character can cast spell in current mode
 */
export function canCastSpell(
  character: {
    level: number;
    job: string;
    mana?: number;
    spellSlots?: Record<number, number>;
  },
  spell: UnifiedSpell,
  mode: 'mana' | 'spell-slots' | 'dual'
): boolean {
  if (mode === 'mana' && spell.manaCost) {
    return (character.mana || 0) >= spell.manaCost;
  }
  
  if (mode === 'spell-slots' && spell.level) {
    const slots = character.spellSlots || {};
    return (slots[spell.level] || 0) > 0;
  }
  
  if (mode === 'dual') {
    // Check both systems
    const canUseMana = spell.manaCost ? (character.mana || 0) >= spell.manaCost : false;
    const canUseSlots = spell.level ? ((character.spellSlots || {})[spell.level] || 0) > 0 : false;
    return canUseMana || canUseSlots;
  }
  
  return false;
}

/**
 * Cast spell and consume resources
 */
export function castSpell(
  character: {
    level: number;
    job: string;
    mana?: number;
    spellSlots?: Record<number, number>;
  },
  spell: UnifiedSpell,
  mode: 'mana' | 'spell-slots' | 'dual',
  preferMana: boolean = false
): {
  success: boolean;
  manaUsed?: number;
  slotLevelUsed?: number;
  remainingMana?: number;
  remainingSlots?: Record<number, number>;
} {
  if (!canCastSpell(character, spell, mode)) {
    return { success: false };
  }
  
  const result = {
    success: true,
    remainingMana: character.mana,
    remainingSlots: { ...character.spellSlots }
  };
  
  if (mode === 'mana' || (mode === 'dual' && preferMana && spell.manaCost)) {
    result.manaUsed = spell.manaCost;
    result.remainingMana = (character.mana || 0) - (spell.manaCost || 0);
  } else if (mode === 'spell-slots' || (mode === 'dual' && spell.level)) {
    result.slotLevelUsed = spell.level;
    if (result.remainingSlots && spell.level) {
      result.remainingSlots[spell.level] = (result.remainingSlots[spell.level] || 0) - 1;
    }
  }
  
  return result;
}

/**
 * Get spell casting time in unified format
 */
export function getUnifiedCastingTime(spell: UnifiedSpell): string {
  if (spell.castingTime) return spell.castingTime;
  
  // Default casting times based on spell level/rank
  if (spell.level === 0) return '1 action';
  if (spell.level && spell.level <= 4) return '1 action';
  if (spell.level && spell.level >= 5) return '1 action';
  
  // For mana spells, use cooldown as indicator
  if (spell.cooldown && spell.cooldown <= 1) return '1 action';
  if (spell.cooldown && spell.cooldown <= 3) return '1 bonus action';
  if (spell.cooldown && spell.cooldown > 3) return '1 minute';
  
  return '1 action'; // Default
}

/**
 * Get spell range in unified format
 */
export function getUnifiedRange(spell: UnifiedSpell): string {
  if (spell.rangeString) return spell.rangeString;
  if (spell.rangeNumber) {
    return `${spell.rangeNumber} feet`;
  }
  
  // Default ranges based on spell type
  if (spell.damage) return '60 feet';
  if (spell.healing) return 'Touch';
  return 'Self';
}
