/**
 * 5e Rules Engine with System Ascendant Flavor
 * Converts all mechanics to standard 5e while preserving homebrew terminology
 */

// Standard 5e abilities with System Ascendant names for flavor
export type AbilityScore = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

// System Ascendant display names (for UI/flavor)
export const ABILITY_DISPLAY_NAMES: Record<AbilityScore, string> = {
  STR: 'Strength (STR)',
  DEX: 'Agility (AGI)', 
  CON: 'Vitality (VIT)',
  INT: 'Intelligence (INT)',
  WIS: 'Sense (SENSE)',
  CHA: 'Presence (PRE)'
};

// Internal mapping for calculations
export const ABILITY_MAPPING: Record<string, AbilityScore> = {
  'STR': 'STR',
  'AGI': 'DEX', 
  'VIT': 'CON',
  'INT': 'INT',
  'SENSE': 'WIS',
  'PRE': 'CHA'
};

export interface Skill {
  id: string;
  name: string;
  ability: AbilityScore;
  description: string;
  // System Ascendant flavor
  systemName?: string;
}

export const SKILLS: Skill[] = [
  { id: 'athletics', name: 'Athletics', ability: 'STR', description: 'Physical feats of strength' },
  { id: 'acrobatics', name: 'Acrobatics', ability: 'DEX', description: 'Balance and agility maneuvers', systemName: 'Acrobatics (AGI)' },
  { id: 'sleight-of-hand', name: 'Sleight of Hand', ability: 'DEX', description: 'Fine motor skills and stealth', systemName: 'Sleight of Hand (AGI)' },
  { id: 'stealth', name: 'Stealth', ability: 'DEX', description: 'Moving unnoticed', systemName: 'Stealth (AGI)' },
  { id: 'arcana', name: 'Arcana', ability: 'INT', description: 'Magical knowledge and System anomalies' },
  { id: 'history', name: 'History', ability: 'INT', description: 'Recalling past events and Ascendant lore' },
  { id: 'investigation', name: 'Investigation', ability: 'INT', description: 'Deductive reasoning and analysis' },
  { id: 'nature', name: 'Nature', ability: 'INT', description: 'Natural world and creatures' },
  { id: 'religion', name: 'Religion', ability: 'INT', description: 'Cults, rituals, and spiritual traditions' },
  { id: 'animal-handling', name: 'Animal Handling', ability: 'WIS', description: 'Animal training and behavior', systemName: 'Animal Handling (SENSE)' },
  { id: 'insight', name: 'Insight', ability: 'WIS', description: 'Reading motives and emotions', systemName: 'Insight (SENSE)' },
  { id: 'medicine', name: 'Medicine', ability: 'WIS', description: 'Field treatment and diagnosis', systemName: 'Medicine (SENSE)' },
  { id: 'perception', name: 'Perception', ability: 'WIS', description: 'Noticing details and threats', systemName: 'Perception (SENSE)' },
  { id: 'survival', name: 'Survival', ability: 'WIS', description: 'Wilderness navigation and tracking', systemName: 'Survival (SENSE)' },
  { id: 'deception', name: 'Deception', ability: 'CHA', description: 'Lying and misdirection', systemName: 'Deception (PRE)' },
  { id: 'intimidation', name: 'Intimidation', ability: 'CHA', description: 'Coercion and threats', systemName: 'Intimidation (PRE)' },
  { id: 'performance', name: 'Performance', ability: 'CHA', description: 'Entertaining and public speaking', systemName: 'Performance (PRE)' },
  { id: 'persuasion', name: 'Persuasion', ability: 'CHA', description: 'Negotiation and diplomacy', systemName: 'Persuasion (PRE)' },
];

// Standard 5e DC ladder with System Ascendant examples
export const DC_LADDER = [
  { dc: 5, difficulty: 'Very Easy', examples: 'Hop a small barrier, recall recent public news' },
  { dc: 10, difficulty: 'Easy', examples: 'Climb a chain-link fence, impress a minor guild officer' },
  { dc: 15, difficulty: 'Medium', examples: 'Track a careful target, bypass a magical barrier' },
  { dc: 20, difficulty: 'Hard', examples: 'Leap between moving vehicles, notice a hidden sniper' },
  { dc: 25, difficulty: 'Very Hard', examples: 'Convince a hostile guild officer to back down' },
  { dc: 30, difficulty: 'Nearly Impossible', examples: 'Legendary feats, holding a collapsing portal' },
];

// Standard 5e rarity levels
export type Rarity = 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';

export const RARITY_LABELS: Record<Rarity, string> = {
  'common': 'Common',
  'uncommon': 'Uncommon',
  'rare': 'Rare',
  'very-rare': 'Very Rare',
  'legendary': 'Legendary',
};

// 5e-standard Job (Class) definition with System Ascendant flavor
export interface Job {
  id: string;
  name: string;
  displayName: string; // System Ascendant name
  description: string;
  primaryAbility: AbilityScore[];
  secondaryAbility?: AbilityScore[];
  hitDie: number;
  proficiencies: {
    armor: string[];
    weapons: string[];
    tools: string[];
    savingThrows: AbilityScore[];
    skills: { choose: number; from: string[] };
  };
  features: JobFeature[];
  paths?: JobPath[];
  // System Ascendant specific
  systemRank?: 'D' | 'C' | 'B' | 'A' | 'S';
  awakeningFeatures?: {
    name: string;
    description: string;
    level: number;
  }[];
}

export interface JobFeature {
  id: string;
  name: string;
  level: number;
  description: string;
  actionType?: 'action' | 'bonus-action' | 'reaction' | 'passive';
  uses?: {
    amount: number | string;
    recharge: 'short-rest' | 'long-rest' | 'encounter';
  };
  prerequisites?: string;
}

export interface JobPath {
  id: string;
  name: string;
  jobId: string;
  description: string;
  features: JobFeature[];
  // System Ascendant specific
  tier?: 1 | 2 | 3;
  systemType?: string;
}

// 5e-standard Power (Spell) with System Ascendant flavor
export interface Power {
  id: string;
  name: string;
  level: number; // 0 for cantrips
  school?: string;
  castingTime: string;
  range: string;
  duration: string;
  components?: string;
  concentration?: boolean;
  description: string;
  higherLevels?: string;
  classes: string[];
  // System Ascendant specific
  rank?: 'D' | 'C' | 'B' | 'A' | 'S';
  systemType?: 'Attack' | 'Defense' | 'Utility' | 'Healing';
}

// 5e-standard Relic (Magic Item) with System Ascendant flavor
export interface Relic {
  id: string;
  name: string;
  rarity: Rarity;
  type: string; // Weapon, Armor, Wondrous, etc.
  attunement: boolean;
  attunementRequirements?: string;
  description: string;
  properties: string[];
  // System Ascendant specific
  systemTier?: 'dormant' | 'awakened' | 'resonant';
  quirks?: string[];
  corruptionRisk?: string;
  systemTags?: string[];
}

// 5e-standard Character with System Ascendant flavor
export interface Character {
  id: string;
  name: string;
  level: number;
  job: string;
  path?: string;
  background?: string;
  
  // Standard 5e abilities (displayed with System Ascendant names)
  abilities: Record<AbilityScore, number>;
  
  // Standard 5e derived stats
  proficiencyBonus: number;
  initiative: number;
  speed: number;
  armorClass: number;
  hitPoints: {
    current: number;
    max: number;
    temp: number;
  };
  hitDice: {
    current: number;
    max: number;
    size: number;
  };
  
  // Standard 5e proficiencies
  savingThrowProficiencies: AbilityScore[];
  skillProficiencies: string[];
  skillExpertise: string[];
  
  // System Ascendant resources (mapped to 5e equivalents)
  systemFavor: {
    current: number;
    max: number;
    dieSize: number;
  }; // Maps to Inspiration/Bardic Inspiration etc.
  
  // Standard 5e equipment
  equipment: string[];
  relics: string[];
  attunedRelics: string[];
  
  // Standard 5e features and powers
  features: string[];
  powers: string[];
  spellSlots?: Record<number, number>;
  
  // Standard 5e conditions and status
  conditions: string[];
  exhaustionLevel: number;
  
  // Notes
  notes: string;
}

// Standard 5e utility functions with System Ascendant flavor
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// Standard 5e proficiency bonus
export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

// System Favor (mapped to various 5e inspiration mechanics)
// Aligned with unified engine: 3/4/5/6 by tier (System Ascendant canonical formula)
export function getSystemFavorMax(level: number): number {
  if (level <= 4) return 3;
  if (level <= 10) return 4;
  if (level <= 16) return 5;
  return 6;
}

export function getSystemFavorDie(level: number): number {
  // Similar to Bardic Inspiration die size
  if (level <= 4) return 6;
  if (level <= 10) return 8;
  if (level <= 16) return 10;
  return 12;
}

// Convert System Ascendant ability name to 5e standard
export function normalizeAbility(ability: string): AbilityScore {
  return ABILITY_MAPPING[ability.toUpperCase()] || ability as AbilityScore;
}

// Convert 5e ability to System Ascendant display name
export function getSystemAbilityName(ability: AbilityScore): string {
  return ABILITY_DISPLAY_NAMES[ability];
}
