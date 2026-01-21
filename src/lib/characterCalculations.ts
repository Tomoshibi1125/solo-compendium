import type { AbilityScore } from '@/types/system-rules';
import { getAbilityModifier, getProficiencyBonus, getSystemFavorDie } from '@/types/system-rules';

export interface CharacterStats {
  level: number;
  abilities: Record<AbilityScore, number>;
  savingThrowProficiencies: AbilityScore[];
  skillProficiencies: string[];
  skillExpertise: string[];
  armorClass?: number;
  speed?: number;
}

export interface CalculatedStats {
  proficiencyBonus: number;
  systemFavorDie: number;
  abilityModifiers: Record<AbilityScore, number>;
  savingThrows: Record<AbilityScore, number>;
  skills: Record<string, number>;
  initiative: number;
  armorClass: number;
  speed: number;
}

// Calculate all derived stats from base character data
export function calculateCharacterStats(stats: CharacterStats): CalculatedStats {
  const { level, abilities, savingThrowProficiencies, skillProficiencies, skillExpertise } = stats;
  
  const proficiencyBonus = getProficiencyBonus(level);
  const systemFavorDie = getSystemFavorDie(level);

  // Calculate ability modifiers
  const abilityModifiers: Record<AbilityScore, number> = {
    STR: getAbilityModifier(abilities.STR),
    AGI: getAbilityModifier(abilities.AGI),
    VIT: getAbilityModifier(abilities.VIT),
    INT: getAbilityModifier(abilities.INT),
    SENSE: getAbilityModifier(abilities.SENSE),
    PRE: getAbilityModifier(abilities.PRE),
  };

  // Calculate saving throws
  const savingThrows: Record<AbilityScore, number> = {
    STR: abilityModifiers.STR + (savingThrowProficiencies.includes('STR') ? proficiencyBonus : 0),
    AGI: abilityModifiers.AGI + (savingThrowProficiencies.includes('AGI') ? proficiencyBonus : 0),
    VIT: abilityModifiers.VIT + (savingThrowProficiencies.includes('VIT') ? proficiencyBonus : 0),
    INT: abilityModifiers.INT + (savingThrowProficiencies.includes('INT') ? proficiencyBonus : 0),
    SENSE: abilityModifiers.SENSE + (savingThrowProficiencies.includes('SENSE') ? proficiencyBonus : 0),
    PRE: abilityModifiers.PRE + (savingThrowProficiencies.includes('PRE') ? proficiencyBonus : 0),
  };

  // Calculate skills (using skill definitions from lib/skills)
  const skills: Record<string, number> = {};
  // Skills are calculated in CharacterSheet component using getAllSkills() and calculateSkillModifier()

  // Calculate initiative (AGI modifier)
  const initiative = abilityModifiers.AGI;

  // AC calculation (base 10 + AGI mod, can be modified by armor/equipment)
  const baseAC = 10 + abilityModifiers.AGI;
  const armorClass = stats.armorClass ?? baseAC;

  // Speed (default 30, can be modified by race/features)
  const speed = stats.speed ?? 30;

  return {
    proficiencyBonus,
    systemFavorDie,
    abilityModifiers,
    savingThrows,
    skills,
    initiative,
    armorClass,
    speed,
  };
}

// Calculate HP max from level, hit die, and VIT modifier
export function calculateHPMax(
  level: number,
  hitDieSize: number,
  vitModifier: number
): number {
  // First level: full hit die + VIT mod
  // Subsequent levels: average (hitDieSize/2 + 1) + VIT mod, or rolled
  const firstLevelHP = hitDieSize + vitModifier;
  const subsequentLevels = level - 1;
  const averagePerLevel = Math.floor(hitDieSize / 2) + 1;
  const subsequentHP = subsequentLevels * (averagePerLevel + vitModifier);
  
  return firstLevelHP + subsequentHP;
}

// Format modifier for display
export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// Spell slot tables for different caster types
// Based on SRD 5e spell slot progression

export type CasterType = 'full' | 'half' | 'third' | 'none';

/**
 * Determine caster type based on job name
 */
export function getCasterType(job: string | null | undefined): CasterType {
  if (!job) return 'none';
  
  const fullCasters = ['Mage', 'Healer', 'Warden', 'Esper'];
  const halfCasters = ['Herald', 'Ranger', 'Techsmith', 'Holy Knight'];
  const thirdCasters = ['Ranger']; // Some ranger subclasses are third casters
  
  if (fullCasters.includes(job)) return 'full';
  if (halfCasters.includes(job)) return 'half';
  return 'none';
}

/**
 * Get spell slots per level for a given caster type and character level
 * Returns an object with spell level (1-9) as keys and slot count as values
 */
export function getSpellSlotsPerLevel(casterType: CasterType, level: number): Record<number, number> {
  const slots: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  };

  if (casterType === 'none' || level === 0) {
    return slots;
  }

  // Full caster progression (Wizard, Cleric, Druid, Sorcerer)
  if (casterType === 'full') {
    const fullCasterTable: Record<number, number[]> = {
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
    
    const levelSlots = fullCasterTable[Math.min(level, 20)] || fullCasterTable[20];
    for (let i = 0; i < 9; i++) {
      slots[i + 1] = levelSlots[i];
    }
  }

  // Half caster progression (Paladin, Ranger, Artificer)
  if (casterType === 'half') {
    const halfCasterTable: Record<number, number[]> = {
      1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
      10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
      11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
      12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
      13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
      14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
      15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
      16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
      17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
      18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
      19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
      20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    };
    
    const levelSlots = halfCasterTable[Math.min(level, 20)] || halfCasterTable[20];
    for (let i = 0; i < 9; i++) {
      slots[i + 1] = levelSlots[i];
    }
  }

  return slots;
}

/**
 * Get spellcasting ability modifier for a job
 */
export function getSpellcastingAbility(job: string | null | undefined): AbilityScore | null {
  if (!job) return null;
  
  // INT casters
  if (['Mage', 'Esper', 'Techsmith'].includes(job)) return 'INT';
  
  // SENSE casters
  if (['Healer', 'Warden', 'Ranger'].includes(job)) return 'SENSE';
  
  // PRE casters
  if (['Herald', 'Holy Knight'].includes(job)) return 'PRE';
  
  return null;
}

/**
 * Calculate spells known limit for a job and level
 */
export function getSpellsKnownLimit(job: string | null | undefined, level: number): number | null {
  if (!job) return null;
  
  // Prepared casters don't have a "known" limit, they prepare from their list
  // Known casters (Sorcerer, Warlock, etc.) have limits
  if (job === 'Esper') {
    // Sorcerer: level + 1
    return level + 1;
  }
  
  // Other classes are prepared casters
  return null;
}

/**
 * Calculate spells prepared limit for a job and level
 */
export function getSpellsPreparedLimit(
  job: string | null | undefined,
  level: number,
  abilityModifier: number
): number | null {
  if (!job) return null;
  
  const spellcastingAbility = getSpellcastingAbility(job);
  if (!spellcastingAbility) return null;
  
  // Prepared casters: ability modifier + level (minimum 1)
  if (['Mage', 'Healer', 'Warden', 'Herald', 'Holy Knight', 'Ranger', 'Techsmith'].includes(job)) {
    return Math.max(1, abilityModifier + level);
  }
  
  return null;
}

// Re-export utility functions for convenience

// Calculate character hit points
export function calculateHitPoints(level: number, constitution: number): number {
  const baseHP = 8 + constitution; // SRD 5e style base
  const levelHP = (level - 1) * 5 + constitution; // 5 HP per level + CON mod
  return Math.max(1, baseHP + levelHP);
}

export { getAbilityModifier, getProficiencyBonus, getSystemFavorDie } from '@/types/system-rules';



