/**
 * System Ascendant to SRD 5e Ability Adapter
 * Maps System Ascendant abilities to standard D&D 5e abilities
 */

// System Ascendant abilities
export type SystemAscendantAbility = 'STR' | 'AGI' | 'VIT' | 'INT' | 'SENSE' | 'PRE';

// Standard 5e abilities
export type Standard5eAbility = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

// Mapping from System Ascendant to 5e
export const ABILITY_MAPPING: Record<SystemAscendantAbility, Standard5eAbility> = {
  'STR': 'STR',      // Strength (same)
  'AGI': 'DEX',      // Agility -> Dexterity
  'VIT': 'CON',      // Vitality -> Constitution
  'INT': 'INT',      // Intelligence (same)
  'SENSE': 'WIS',    // Sense -> Wisdom
  'PRE': 'CHA'       // Presence -> Charisma
};

// Reverse mapping from 5e to System Ascendant
export const REVERSE_ABILITY_MAPPING: Record<Standard5eAbility, SystemAscendantAbility> = {
  'STR': 'STR',
  'DEX': 'AGI',
  'CON': 'VIT',
  'INT': 'INT',
  'WIS': 'SENSE',
  'CHA': 'PRE'
};

/**
 * Convert System Ascendant ability to standard 5e ability
 */
export function convertTo5eAbility(systemAbility: SystemAscendantAbility): Standard5eAbility {
  return ABILITY_MAPPING[systemAbility];
}

/**
 * Convert standard 5e ability to System Ascendant ability
 */
export function convertToSystemAbility(standardAbility: Standard5eAbility): SystemAscendantAbility {
  return REVERSE_ABILITY_MAPPING[standardAbility];
}

/**
 * Convert ability scores object from System Ascendant to 5e
 */
export function convertAbilityScoresTo5e(
  systemScores: Record<SystemAscendantAbility, number>
): Record<Standard5eAbility, number> {
  const standardScores: Record<Standard5eAbility, number> = {} as Record<Standard5eAbility, number>;
  
  Object.entries(systemScores).forEach(([systemAbility, score]) => {
    const standardAbility = convertTo5eAbility(systemAbility as SystemAscendantAbility);
    standardScores[standardAbility] = score;
  });
  
  return standardScores;
}

/**
 * Convert ability scores object from 5e to System Ascendant
 */
export function convertAbilityScoresToSystem(
  standardScores: Record<Standard5eAbility, number>
): Record<SystemAscendantAbility, number> {
  const systemScores: Record<SystemAscendantAbility, number> = {} as Record<SystemAscendantAbility, number>;
  
  Object.entries(standardScores).forEach(([standardAbility, score]) => {
    const systemAbility = convertToSystemAbility(standardAbility as Standard5eAbility);
    systemScores[systemAbility] = score;
  });
  
  return systemScores;
}

/**
 * Convert skill proficiencies from System Ascendant to 5e
 */
export function convertSkillProficienciesTo5e(
  systemSkills: string[]
): string[] {
  // Most skills are the same, but some might need mapping
  const skillMapping: Record<string, string> = {
    // Add any skill name mappings if needed
  };
  
  return systemSkills.map(skill => skillMapping[skill] || skill);
}

/**
 * Convert saving throw proficiencies from System Ascendant to 5e
 */
export function convertSavingThrowsTo5e(
  systemSaves: SystemAscendantAbility[]
): Standard5eAbility[] {
  return systemSaves.map(convertTo5eAbility);
}

/**
 * Convert saving throw proficiencies from 5e to System Ascendant
 */
export function convertSavingThrowsToSystem(
  standardSaves: Standard5eAbility[]
): SystemAscendantAbility[] {
  return standardSaves.map(convertToSystemAbility);
}

/**
 * Get ability modifier (same formula for both systems)
 */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Convert a character's ability scores and proficiencies from System Ascendant to 5e
 */
export function convertCharacterTo5e(character: {
  abilities: Record<SystemAscendantAbility, number>;
  saving_throw_proficiencies: SystemAscendantAbility[];
  skill_proficiencies: string[];
  skill_expertise: string[];
}): {
  abilities: Record<Standard5eAbility, number>;
  saving_throw_proficiencies: Standard5eAbility[];
  skill_proficiencies: string[];
  skill_expertise: string[];
} {
  return {
    abilities: convertAbilityScoresTo5e(character.abilities),
    saving_throw_proficiencies: convertSavingThrowsTo5e(character.saving_throw_proficiencies),
    skill_proficiencies: convertSkillProficienciesTo5e(character.skill_proficiencies),
    skill_expertise: convertSkillProficienciesTo5e(character.skill_expertise)
  };
}

/**
 * Convert a character's ability scores and proficiencies from 5e to System Ascendant
 */
export function convertCharacterToSystem(character: {
  abilities: Record<Standard5eAbility, number>;
  saving_throw_proficiencies: Standard5eAbility[];
  skill_proficiencies: string[];
  skill_expertise: string[];
}): {
  abilities: Record<SystemAscendantAbility, number>;
  saving_throw_proficiencies: SystemAscendantAbility[];
  skill_proficiencies: string[];
  skill_expertise: string[];
} {
  return {
    abilities: convertAbilityScoresToSystem(character.abilities),
    saving_throw_proficiencies: convertSavingThrowsToSystem(character.saving_throw_proficiencies),
    skill_proficiencies: character.skill_proficiencies, // Skills are mostly the same
    skill_expertise: character.skill_expertise
  };
}
