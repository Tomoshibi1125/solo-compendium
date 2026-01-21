/**
 * SRD 5e Rules Engine
 * Provides standard SRD 5e mechanics alongside System Ascendant system
 */

// Standard SRD 5e Ability Scores
export interface Srd5eAbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

// Standard SRD 5e Skills
export type Srd5eSkill = 
  | 'athletics' | 'acrobatics' | 'sleight-of-hand' | 'stealth'
  | 'arcana' | 'history' | 'investigation' | 'nature' | 'religion'
  | 'animal-handling' | 'insight' | 'medicine' | 'perception' | 'survival'
  | 'deception' | 'intimidation' | 'performance' | 'persuasion';

export interface Srd5eSkillProficiency {
  skill: Srd5eSkill;
  proficient: boolean;
  expertise: boolean;
  bonus?: number;
}

// Standard SRD 5e Saving Throws
export type Srd5eSavingThrow = 
  | 'strength' | 'dexterity' | 'constitution' 
  | 'intelligence' | 'wisdom' | 'charisma';

export interface Srd5eSavingThrowProficiency {
  ability: Srd5eSavingThrow;
  proficient: boolean;
  bonus?: number;
}

// Standard SRD 5e Character
export interface Srd5eCharacter {
  level: number;
  abilityScores: Srd5eAbilityScores;
  skillProficiencies: Srd5eSkillProficiency[];
  savingThrowProficiencies: Srd5eSavingThrowProficiency[];
  proficiencyBonus: number;
  class: string;
  subclass?: string;
  race?: string;
  background?: string;
}

// Calculate ability modifier
export function getSrd5eAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Calculate skill modifier
export function getSrd5eSkillModifier(
  character: Srd5eCharacter,
  skill: Srd5eSkill
): number {
  const skillProf = character.skillProficiencies.find(p => p.skill === skill);
  const ability = getSkillAbility(skill);
  const abilityMod = getSrd5eAbilityModifier(character.abilityScores[ability]);
  const profBonus = skillProf?.proficient ? character.proficiencyBonus : 0;
  const expertiseBonus = skillProf?.expertise ? character.proficiencyBonus : 0;
  const customBonus = skillProf?.bonus || 0;
  
  return abilityMod + profBonus + expertiseBonus + customBonus;
}

// Get ability for a skill
function getSkillAbility(skill: Srd5eSkill): keyof Srd5eAbilityScores {
  const skillAbilities: Record<Srd5eSkill, keyof Srd5eAbilityScores> = {
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
export function getSrd5eSavingThrowModifier(
  character: Srd5eCharacter,
  ability: Srd5eSavingThrow
): number {
  const saveProf = character.savingThrowProficiencies.find(p => p.ability === ability);
  const abilityMod = getSrd5eAbilityModifier(character.abilityScores[ability]);
  const profBonus = saveProf?.proficient ? character.proficiencyBonus : 0;
  const customBonus = saveProf?.bonus || 0;
  
  return abilityMod + profBonus + customBonus;
}

// Calculate Armor Class
export function getSrd5eArmorClass(
  character: Srd5eCharacter,
  armorType?: string,
  shield?: boolean,
  dexBonus?: number,
  naturalArmor?: number
): number {
  const baseAC = 10;
  const dexMod = dexBonus ?? getSrd5eAbilityModifier(character.abilityScores.dexterity);
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
export function getSrd5eHitPoints(
  character: Srd5eCharacter,
  hitDie: string,
  conMod?: number,
  previousHP?: number,
  rolledHP?: number
): number {
  const conBonus = conMod ?? getSrd5eAbilityModifier(character.abilityScores.constitution);
  const hitDieNum = parseInt(hitDie.replace('d', ''));
  
  if (character.level === 1) {
    return hitDieNum + conBonus;
  }
  
  const avgHPPerLevel = Math.floor(hitDieNum / 2) + 1 + conBonus;
  const totalHP = hitDieNum + conBonus + (character.level - 1) * avgHPPerLevel;
  
  return totalHP;
}

// Calculate proficiency bonus
export function getSrd5eProficiencyBonus(level: number): number {
  return Math.floor((level - 1) / 4) + 2;
}

// Calculate passive perception
export function getSrd5ePassivePerception(character: Srd5eCharacter): number {
  const perceptionMod = getSrd5eSkillModifier(character, 'perception');
  return 10 + perceptionMod;
}

// Calculate passive investigation
export function getSrd5ePassiveInvestigation(character: Srd5eCharacter): number {
  const investigationMod = getSrd5eSkillModifier(character, 'investigation');
  return 10 + investigationMod;
}

// Calculate passive insight
export function getSrd5ePassiveInsight(character: Srd5eCharacter): number {
  const insightMod = getSrd5eSkillModifier(character, 'insight');
  return 10 + insightMod;
}

// Calculate carrying capacity
export function getSrd5eCarryingCapacity(character: Srd5eCharacter): number {
  const strScore = character.abilityScores.strength;
  return strScore * 15;
}

// Calculate encumbrance thresholds
export function getSrd5eEncumbranceThresholds(character: Srd5eCharacter): {
  light: number;
  medium: number;
  heavy: number;
} {
  const capacity = getSrd5eCarryingCapacity(character);
  return {
    light: Math.floor(capacity * 0.33),
    medium: Math.floor(capacity * 0.66),
    heavy: capacity
  };
}


