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
  const { level, abilities, savingThrowProficiencies, skillProficiencies: _skillProficiencies, skillExpertise: _skillExpertise } = stats;
  
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

export type CasterType = 'full' | 'half' | 'pact' | 'third' | 'none';

/**
 * Determine caster type based on job name
 */
export function getCasterType(job: string | null | undefined): CasterType {
  if (!job) return 'none';
  
  const fullCasters = ['Mage', 'Revenant', 'Herald', 'Esper', 'Summoner', 'Idol'];
  const halfCasters = ['Holy Knight', 'Stalker', 'Technomancer'];
  const pactCasters = ['Contractor'];
  
  if (fullCasters.includes(job)) return 'full';
  if (halfCasters.includes(job)) return 'half';
  if (pactCasters.includes(job)) return 'pact';
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

  // Full caster progression (Mage, Herald, Esper, Summoner, Resonant, Revenant, Technomancer)
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

  // Pact caster progression (Contractor: few slots, all same level, recharge on short rest)
  if (casterType === 'pact') {
    const pactSlotTable: Record<number, [number, number]> = {
      // [slot count, slot level]
      1: [1, 1], 2: [2, 1], 3: [2, 2], 4: [2, 2], 5: [2, 3],
      6: [2, 3], 7: [2, 4], 8: [2, 4], 9: [2, 5], 10: [2, 5],
      11: [3, 5], 12: [3, 5], 13: [3, 5], 14: [3, 5], 15: [3, 5],
      16: [3, 5], 17: [4, 5], 18: [4, 5], 19: [4, 5], 20: [4, 5],
    };
    const [count, slotLevel] = pactSlotTable[Math.min(level, 20)] || pactSlotTable[20];
    slots[slotLevel] = count;
    return slots;
  }

  // Half caster progression (Holy Knight, Stalker)
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
  if (['Mage', 'Technomancer', 'Revenant'].includes(job)) return 'INT';
  
  // SENSE casters
  if (['Herald', 'Summoner', 'Stalker'].includes(job)) return 'SENSE';
  
  // PRE casters
  if (['Esper', 'Contractor', 'Holy Knight', 'Idol'].includes(job)) return 'PRE';
  
  return null;
}

/**
 * Calculate spells known limit for a job and level
 */
export function getSpellsKnownLimit(job: string | null | undefined, level: number): number | null {
  if (!job) return null;
  
  // Prepared casters don't have a "known" limit, they prepare from their list
  // Known casters have limits
  if (['Esper', 'Contractor', 'Idol'].includes(job)) {
    // Known casters: level + 1
    return level + 1;
  }
  
  // Other classes are prepared casters
  return null;
}

/**
 * Calculate cantrips known limit for a job and level
 */
export function getCantripsKnownLimit(job: string | null | undefined, level: number): number | null {
  if (!job) return null;

  // Non-casters do not learn cantrips.
  if (['Assassin', 'Berserker', 'Destroyer', 'Striker'].includes(job)) {
    return null;
  }

  // Half-casters without cantrips (Stalker, Holy Knight)
  if (['Stalker', 'Holy Knight'].includes(job)) {
    return null;
  }

  // Full prepared casters (Mage, Revenant, Herald, Summoner) and Technomancer
  if (['Mage', 'Revenant', 'Herald'].includes(job)) {
    if (level >= 10) return 5;
    if (level >= 4) return 4;
    return 3;
  }

  // Summoner (Druid cantrips: fewer)
  if (job === 'Summoner') {
    if (level >= 10) return 4;
    if (level >= 4) return 3;
    return 2;
  }

  // Technomancer (Artificer cantrips)
  if (job === 'Technomancer') {
    if (level >= 14) return 4;
    if (level >= 10) return 3;
    return 2;
  }

  // Known casters (Esper, Contractor, Idol)
  if (['Esper', 'Contractor', 'Idol'].includes(job)) {
    if (level >= 10) return 6;
    if (level >= 4) return 5;
    return 4;
  }

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
  if (['Mage', 'Technomancer', 'Revenant', 'Stalker', 'Herald', 'Holy Knight', 'Summoner'].includes(job)) {
    return Math.max(1, abilityModifier + level);
  }

  // Idol is a known caster, not prepared
  // Esper and Contractor are known casters, not prepared
  
  return null;
}

// Re-export utility functions for convenience
export { getAbilityModifier, getProficiencyBonus, getSystemFavorDie } from '@/types/system-rules';



