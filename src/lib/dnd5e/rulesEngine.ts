/**
 * D&D 5e Rules Engine
 * Provides standard D&D 5e mechanics alongside Solo Leveling system
 */

// Standard D&D 5e Ability Scores
export interface Dnd5eAbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

// Standard D&D 5e Skills
export type Dnd5eSkill = 
  | 'athletics' | 'acrobatics' | 'sleight-of-hand' | 'stealth'
  | 'arcana' | 'history' | 'investigation' | 'nature' | 'religion'
  | 'animal-handling' | 'insight' | 'medicine' | 'perception' | 'survival'
  | 'deception' | 'intimidation' | 'performance' | 'persuasion';

export interface Dnd5eSkillProficiency {
  skill: Dnd5eSkill;
  proficient: boolean;
  expertise: boolean;
  bonus?: number;
}

// Standard D&D 5e Saving Throws
export type Dnd5eSavingThrow = 
  | 'strength' | 'dexterity' | 'constitution' 
  | 'intelligence' | 'wisdom' | 'charisma';

export interface Dnd5eSavingThrowProficiency {
  ability: Dnd5eSavingThrow;
  proficient: boolean;
  bonus?: number;
}

// Standard D&D 5e Character
export interface Dnd5eCharacter {
  level: number;
  abilityScores: Dnd5eAbilityScores;
  skillProficiencies: Dnd5eSkillProficiency[];
  savingThrowProficiencies: Dnd5eSavingThrowProficiency[];
  proficiencyBonus: number;
  class: string;
  subclass?: string;
  race?: string;
  background?: string;
}

// Calculate ability modifier
export function getDnd5eAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Calculate skill modifier
export function getDnd5eSkillModifier(
  character: Dnd5eCharacter,
  skill: Dnd5eSkill
): number {
  const skillProf = character.skillProficiencies.find(p => p.skill === skill);
  const ability = getSkillAbility(skill);
  const abilityMod = getDnd5eAbilityModifier(character.abilityScores[ability]);
  const profBonus = skillProf?.proficient ? character.proficiencyBonus : 0;
  const expertiseBonus = skillProf?.expertise ? character.proficiencyBonus : 0;
  const customBonus = skillProf?.bonus || 0;
  
  return abilityMod + profBonus + expertiseBonus + customBonus;
}

// Get ability for a skill
function getSkillAbility(skill: Dnd5eSkill): keyof Dnd5eAbilityScores {
  const skillAbilities: Record<Dnd5eSkill, keyof Dnd5eAbilityScores> = {
    'athletics': 'strength',
    'acrobatics': 'dexterity',
    'sleight-of-hand': 'dexterity',
    'stealth': 'dexterity',
    'arcana': 'intelligence',
    'history': 'intelligence',
    'investigation': 'intelligence',
    'nature': 'intelligence',
    'religion': 'intelligence',
    'animal-handling': 'wisdom',
    'insight': 'wisdom',
    'medicine': 'wisdom',
    'perception': 'wisdom',
    'survival': 'wisdom',
    'deception': 'charisma',
    'intimidation': 'charisma',
    'performance': 'charisma',
    'persuasion': 'charisma'
  };
  
  return skillAbilities[skill];
}

// Calculate saving throw modifier
export function getDnd5eSavingThrowModifier(
  character: Dnd5eCharacter,
  ability: Dnd5eSavingThrow
): number {
  const saveProf = character.savingThrowProficiencies.find(p => p.ability === ability);
  const abilityMod = getDnd5eAbilityModifier(character.abilityScores[ability]);
  const profBonus = saveProf?.proficient ? character.proficiencyBonus : 0;
  const customBonus = saveProf?.bonus || 0;
  
  return abilityMod + profBonus + customBonus;
}

// Calculate Armor Class
export function getDnd5eArmorClass(
  character: Dnd5eCharacter,
  armorType?: string,
  shield?: boolean,
  dexBonus?: number,
  naturalArmor?: number
): number {
  const baseAC = 10;
  const dexMod = dexBonus ?? getDnd5eAbilityModifier(character.abilityScores.dexterity);
  const shieldBonus = shield ? 2 : 0;
  const naturalBonus = naturalArmor ?? 0;
  
  // Different armor types have different AC calculations
  switch (armorType) {
    case 'light':
      return baseAC + dexMod + shieldBonus + naturalBonus;
    case 'medium':
      return baseAC + Math.min(dexMod, 2) + shieldBonus + naturalBonus;
    case 'heavy':
      return baseAC + shieldBonus + naturalBonus;
    case 'none':
    default:
      return baseAC + dexMod + shieldBonus + naturalBonus;
  }
}

// Calculate hit points
export function getDnd5eHitPoints(
  character: Dnd5eCharacter,
  hitDie: string,
  conMod?: number,
  previousHP?: number,
  rolledHP?: number
): number {
  const conBonus = conMod ?? getDnd5eAbilityModifier(character.abilityScores.constitution);
  const hitDieNum = parseInt(hitDie.replace('d', ''));
  
  if (character.level === 1) {
    return hitDieNum + conBonus;
  }
  
  const avgHPPerLevel = Math.floor(hitDieNum / 2) + 1 + conBonus;
  const totalHP = hitDieNum + conBonus + (character.level - 1) * avgHPPerLevel;
  
  return totalHP;
}

// Calculate proficiency bonus
export function getDnd5eProficiencyBonus(level: number): number {
  return Math.floor((level - 1) / 4) + 2;
}

// Calculate passive perception
export function getDnd5ePassivePerception(character: Dnd5eCharacter): number {
  const perceptionMod = getDnd5eSkillModifier(character, 'perception');
  return 10 + perceptionMod;
}

// Calculate passive investigation
export function getDnd5ePassiveInvestigation(character: Dnd5eCharacter): number {
  const investigationMod = getDnd5eSkillModifier(character, 'investigation');
  return 10 + investigationMod;
}

// Calculate passive insight
export function getDnd5ePassiveInsight(character: Dnd5eCharacter): number {
  const insightMod = getDnd5eSkillModifier(character, 'insight');
  return 10 + insightMod;
}

// Calculate carrying capacity
export function getDnd5eCarryingCapacity(character: Dnd5eCharacter): number {
  const strScore = character.abilityScores.strength;
  return strScore * 15;
}

// Calculate encumbrance thresholds
export function getDnd5eEncumbranceThresholds(character: Dnd5eCharacter): {
  light: number;
  medium: number;
  heavy: number;
} {
  const capacity = getDnd5eCarryingCapacity(character);
  return {
    light: Math.floor(capacity * 0.33),
    medium: Math.floor(capacity * 0.66),
    heavy: capacity
  };
}
