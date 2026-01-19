/**
 * Unified Rules Engine - Solo Leveling adapted to D&D 5e framework
 * Merges Solo Leveling mechanics with standard D&D 5e rules
 */

// Unified Ability Scores (Solo Leveling names, D&D 5e mechanics)
export interface UnifiedAbilityScores {
  STR: number;  // Strength - Physical power, melee attacks
  AGI: number;  // Agility - Dexterity equivalent, reflexes, stealth
  VIT: number;  // Vitality - Constitution equivalent, health, endurance
  INT: number;  // Intelligence - Mental power, magic, knowledge
  SENSE: number; // Perception - Wisdom equivalent, awareness, intuition
  PRE: number;  // Presence - Charisma equivalent, leadership, influence
}

// Solo Leveling Jobs adapted as D&D 5e Classes
export type UnifiedClass = 
  | 'warrior' | 'mage' | 'assassin' | 'healer' | 'ranger' | 'berserker'
  | 'tank' | 'summoner' | 'paladin' | 'technomancer' | 'warlock' | 'necromancer'
  | 'monk' | 'bard';

// Solo Leveling Paths adapted as D&D 5e Subclasses
export interface UnifiedPath {
  id: string;
  name: string;
  classId: UnifiedClass;
  className: string;
  pathType: string;
  tier: 1 | 2 | 3; // Solo Leveling tiers (adapted as subclass levels)
  requirements: {
    level: number;
    abilities?: string[];
    skills?: string[];
    prerequisites?: string[];
  };
  description: string;
  features: {
    name: string;
    description: string;
    level: number;
  }[];
  abilities: {
    name: string;
    description: string;
    cooldown?: number;
    cost?: string;
  }[];
  stats: {
    primaryAttribute: keyof UnifiedAbilityScores;
    secondaryAttribute?: keyof UnifiedAbilityScores;
    bonusStats: Partial<UnifiedAbilityScores>;
  };
  source: string;
}

// Unified Character combining both systems
export interface UnifiedCharacter {
  // Basic Info
  level: number;
  class: UnifiedClass;
  path?: UnifiedPath;
  race: string;
  background: string;
  
  // Unified Ability Scores (Solo Leveling names)
  abilities: UnifiedAbilityScores;
  
  // D&D 5e mechanics with Solo Leveling flavor
  proficiencyBonus: number;
  skillProficiencies: UnifiedSkillProficiency[];
  savingThrowProficiencies: UnifiedSavingThrowProficiency[];
  
  // Solo Leveling unique mechanics adapted to D&D 5e
  systemFavorDie: number; // Solo Leveling System Favor (adapted as inspiration/bonus)
  systemFavorMax: number;
  systemFavorCurrent: number;
  
  // Monarch-specific mechanics (using existing monarch system)
  monarchUnlocks?: string[]; // References to existing monarch IDs
  activeMonarch?: string; // Currently active monarch ID
  
  // Standard D&D 5e mechanics
  hitPoints: {
    max: number;
    current: number;
    temp: number;
  };
  armorClass: number;
  speed: number;
  
  // Spell/Powers system (unified)
  spellSlots: UnifiedSpellSlots;
  knownPowers: UnifiedPower[];
  
  // Equipment (Solo Leveling equipment with D&D 5e stats)
  equipment: UnifiedEquipment[];
  
  // Solo Leveling unique features
  shadowSoldiers?: UnifiedShadowSoldier[]; // Only for Shadow Monarch
  runeInscriptions?: UnifiedRune[];
}

// Unified Skills (D&D 5e skills with Solo Leveling flavor)
export type UnifiedSkill = 
  | 'athletics' | 'acrobatics' | 'sleight-of-hand' | 'stealth'
  | 'arcana' | 'history' | 'investigation' | 'nature' | 'religion'
  | 'animal-handling' | 'insight' | 'medicine' | 'perception' | 'survival'
  | 'deception' | 'intimidation' | 'performance' | 'persuasion' | 'technology';

export interface UnifiedSkillProficiency {
  skill: UnifiedSkill;
  proficient: boolean;
  expertise: boolean;
  bonus?: number;
}

// Unified Saving Throws
export type UnifiedSavingThrow = 
  | 'STR' | 'AGI' | 'VIT' | 'INT' | 'SENSE' | 'PRE';

export interface UnifiedSavingThrowProficiency {
  ability: UnifiedSavingThrow;
  proficient: boolean;
  bonus?: number;
}

// Unified Spell Slots (D&D 5e mechanics for Solo Leveling powers)
export interface UnifiedSpellSlots {
  cantrips: number; // 0-level powers
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

// Unified Power (Solo Leveling powers with D&D 5e spell structure)
export interface UnifiedPower {
  id: string;
  name: string;
  description: string;
  level: number; // Power level (1-9)
  castingTime: string;
  range: string;
  duration: string;
  concentration: boolean;
  components: string[];
  school: string; // Solo Leveling schools adapted to D&D 5e schools
  class: UnifiedClass;
  path?: string;
  damage?: string;
  save?: {
    ability: UnifiedSavingThrow;
    dc: number;
  };
}

// Unified Equipment (Solo Leveling equipment with D&D 5e stats)
export interface UnifiedEquipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'shield' | 'accessory' | 'relic' | 'rune';
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary' | 'mythic';
  description: string;
  
  // D&D 5e mechanics
  armorClass?: number;
  damage?: string;
  damageType?: string;
  weaponType?: string;
  properties?: string[];
  
  // Solo Leveling unique properties
  shadowAffinity?: number;
  systemFavorBonus?: number;
  runeSlots?: number;
  setBonus?: string;
  
  // Requirements
  requirements?: {
    level?: number;
    class?: UnifiedClass;
    ability?: keyof UnifiedAbilityScores;
    score?: number;
  };
}

// Unified Shadow Soldier (adapted as D&D 5e creature)
export interface UnifiedShadowSoldier {
  id: string;
  name: string;
  rank: string;
  type: 'shadow' | 'demon' | 'undead' | 'construct';
  hitPoints: number;
  armorClass: number;
  speed: number;
  abilities: UnifiedAbilityScores;
  skills: UnifiedSkill[];
  attacks: UnifiedAttack[];
  specialAbilities: string[];
  summoningRequirements: {
    level: number;
    class: UnifiedClass;
    systemFavorCost: number;
  };
}

// Unified Attack (D&D 5e attack mechanics)
export interface UnifiedAttack {
  name: string;
  attackBonus: number;
  damage: string;
  damageType: string;
  range?: string;
  properties?: string[];
}

// Unified Rune (adapted as D&D 5e magic item)
export interface UnifiedRune {
  id: string;
  name: string;
  type: 'shadow' | 'fire' | 'ice' | 'lightning' | 'healing' | 'protection';
  rarity: 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';
  description: string;
  effect: string;
  slot: 'weapon' | 'armor' | 'accessory';
  requirements?: {
    level: number;
    class?: UnifiedClass;
  };
}

// Calculate unified ability modifier (Solo Leveling abilities, D&D 5e formula)
export function getUnifiedAbilityModifier(ability: keyof UnifiedAbilityScores, score: number): number {
  return Math.floor((score - 10) / 2);
}

// Calculate unified skill modifier
export function getUnifiedSkillModifier(
  character: UnifiedCharacter,
  skill: UnifiedSkill
): number {
  const skillProf = character.skillProficiencies.find(p => p.skill === skill);
  const ability = getSkillAbility(skill);
  const abilityMod = getUnifiedAbilityModifier(ability, character.abilities[ability]);
  const profBonus = skillProf?.proficient ? character.proficiencyBonus : 0;
  const expertiseBonus = skillProf?.expertise ? character.proficiencyBonus : 0;
  const customBonus = skillProf?.bonus || 0;
  
  return abilityMod + profBonus + expertiseBonus + customBonus;
}

// Get ability for unified skill
function getSkillAbility(skill: UnifiedSkill): keyof UnifiedAbilityScores {
  const skillAbilities: Record<UnifiedSkill, keyof UnifiedAbilityScores> = {
    'athletics': 'STR',
    'acrobatics': 'AGI',
    'sleight-of-hand': 'AGI',
    'stealth': 'AGI',
    'arcana': 'INT',
    'history': 'INT',
    'investigation': 'INT',
    'nature': 'INT',
    'religion': 'INT',
    'animal-handling': 'SENSE',
    'insight': 'SENSE',
    'medicine': 'SENSE',
    'perception': 'SENSE',
    'survival': 'SENSE',
    'deception': 'PRE',
    'intimidation': 'PRE',
    'performance': 'PRE',
    'persuasion': 'PRE',
    'technology': 'INT'
  };
  
  return skillAbilities[skill];
}

// Calculate unified saving throw modifier
export function getUnifiedSavingThrowModifier(
  character: UnifiedCharacter,
  ability: UnifiedSavingThrow
): number {
  const saveProf = character.savingThrowProficiencies.find(p => p.ability === ability);
  const abilityMod = getUnifiedAbilityModifier(ability, character.abilities[ability]);
  const profBonus = saveProf?.proficient ? character.proficiencyBonus : 0;
  const customBonus = saveProf?.bonus || 0;
  
  return abilityMod + profBonus + customBonus;
}

// Calculate unified armor class
export function getUnifiedArmorClass(
  character: UnifiedCharacter,
  armorType?: string,
  shield?: boolean,
  dexBonus?: number
): number {
  const baseAC = 10;
  const agiMod = dexBonus ?? getUnifiedAbilityModifier('AGI', character.abilities.AGI);
  const shieldBonus = shield ? 2 : 0;
  
  // Different armor types use AGI (Dexterity) with Solo Leveling flavor
  switch (armorType) {
    case 'light':
      return baseAC + agiMod + shieldBonus;
    case 'medium':
      return baseAC + Math.min(agiMod, 2) + shieldBonus;
    case 'heavy':
      return baseAC + shieldBonus;
    case 'none':
    default:
      return baseAC + agiMod + shieldBonus;
  }
}

// Calculate unified hit points (Solo Leveling VIT + D&D 5e formula)
export function getUnifiedHitPoints(
  character: UnifiedCharacter,
  hitDie: string,
  conMod?: number,
  previousHP?: number,
  rolledHP?: number
): number {
  const vitBonus = conMod ?? getUnifiedAbilityModifier('VIT', character.abilities.VIT);
  const hitDieNum = parseInt(hitDie.replace('d', ''));
  
  if (character.level === 1) {
    return hitDieNum + vitBonus;
  }
  
  const avgHPPerLevel = Math.floor(hitDieNum / 2) + 1 + vitBonus;
  const totalHP = hitDieNum + vitBonus + (character.level - 1) * avgHPPerLevel;
  
  return totalHP;
}

// Calculate unified proficiency bonus (D&D 5e formula)
export function getUnifiedProficiencyBonus(level: number): number {
  return Math.floor((level - 1) / 4) + 2;
}

// Calculate System Favor (Solo Leveling mechanic adapted as inspiration)
export function getSystemFavorMax(level: number): number {
  if (level <= 4) return 3;
  if (level <= 10) return 4;
  if (level <= 16) return 5;
  return 6;
}

// Calculate Shadow Energy (Solo Leveling mechanic - monarch-specific domains)
export function getShadowEnergyMax(level: number, monarchDomain?: string): number {
  // Only monarchs have access to shadow energy, and it's domain-specific
  if (!monarchDomain) {
    return 0;
  }
  
  // Each monarch has unique shadow energy mechanics based on their domain
  // This is a base formula - individual monarchs may have different calculations
  return Math.min(level * 2, 20); // Max 20 shadow energy, but monarchs may have unique bonuses
}

// Calculate unified passive perception
export function getUnifiedPassivePerception(character: UnifiedCharacter): number {
  const perceptionMod = getUnifiedSkillModifier(character, 'perception');
  return 10 + perceptionMod;
}

// Calculate unified carrying capacity (using STR)
export function getUnifiedCarryingCapacity(character: UnifiedCharacter): number {
  const strScore = character.abilities.STR;
  return strScore * 15;
}

// Get unified character status
export function getUnifiedCharacterStatus(character: UnifiedCharacter): {
  level: number;
  class: string;
  path?: string;
  abilities: UnifiedAbilityScores;
  hp: { current: number; max: number; temp: number };
  ac: number;
  proficiencyBonus: number;
  systemFavor: { current: number; max: number };
  monarchStatus?: {
    hasMonarchUnlocks: boolean;
    activeMonarch?: string;
    totalUnlocks: number;
  };
  spellSlots: UnifiedSpellSlots;
  knownPowers: number;
  equipment: number;
  monarchUnlocks: number;
  shadowSoldiers: number;
  runeInscriptions: number;
} {
  return {
    level: character.level,
    class: character.class,
    path: character.path?.name,
    abilities: character.abilities,
    hp: character.hitPoints,
    ac: character.armorClass,
    proficiencyBonus: character.proficiencyBonus,
    systemFavor: {
      current: character.systemFavorCurrent,
      max: character.systemFavorMax
    },
    monarchStatus: character.monarchUnlocks ? {
      hasMonarchUnlocks: character.monarchUnlocks.length > 0,
      activeMonarch: character.activeMonarch,
      totalUnlocks: character.monarchUnlocks.length
    } : undefined,
    spellSlots: character.spellSlots,
    knownPowers: character.knownPowers.length,
    equipment: character.equipment.length,
    monarchUnlocks: character.monarchUnlocks?.length || 0,
    shadowSoldiers: character.shadowSoldiers?.length || 0,
    runeInscriptions: character.runeInscriptions?.length || 0
  };
}
