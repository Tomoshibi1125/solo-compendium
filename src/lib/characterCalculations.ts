import type { AbilityScore } from '@/types/solo-leveling';
import { getAbilityModifier, getProficiencyBonus, getSystemFavorDie } from '@/types/solo-leveling';

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

  // Calculate skills (would need skill definitions for full implementation)
  const skills: Record<string, number> = {};
  // TODO: Implement skill calculations based on skill definitions

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

// Re-export utility functions for convenience
export { getAbilityModifier, getProficiencyBonus, getSystemFavorDie } from '@/types/solo-leveling';

