// Solo Leveling 5e Data Types
// Based on parsed PHB/DMG content

// Ability Scores (Solo Leveling uses different names)
export type AbilityScore = 'STR' | 'AGI' | 'VIT' | 'INT' | 'SENSE' | 'PRE';

export const ABILITY_NAMES: Record<AbilityScore, string> = {
  STR: 'Strength',
  AGI: 'Agility',
  VIT: 'Vitality',
  INT: 'Intelligence',
  SENSE: 'Sense',
  PRE: 'Presence',
};

// Skill definitions
export interface Skill {
  id: string;
  name: string;
  defaultAbility: AbilityScore;
  description: string;
}

export const SKILLS: Skill[] = [
  { id: 'athletics', name: 'Athletics', defaultAbility: 'STR', description: 'Climbing, swimming, breaking restraints' },
  { id: 'acrobatics', name: 'Acrobatics', defaultAbility: 'AGI', description: 'Grappling, balancing, tumbling, avoiding falls' },
  { id: 'sleight-of-hand', name: 'Sleight of Hand', defaultAbility: 'AGI', description: 'Palming items, quick draws, subtle relic use' },
  { id: 'stealth', name: 'Stealth', defaultAbility: 'AGI', description: 'Moving quietly, hiding from sensors or monsters' },
  { id: 'arcana', name: 'Arcana', defaultAbility: 'INT', description: 'Understanding Gates, System anomalies, and power theory in the post-reset world' },
  { id: 'history', name: 'History', defaultAbility: 'INT', description: 'Recalling past events, notable Hunters, major incidents' },
  { id: 'investigation', name: 'Investigation', defaultAbility: 'INT', description: 'Reconstructing events, searching for clues, analyzing scenes' },
  { id: 'nature', name: 'Nature', defaultAbility: 'INT', description: 'Knowing wild ecosystems, beasts, natural hazards' },
  { id: 'religion', name: 'Religion', defaultAbility: 'INT', description: 'Understanding cults, rituals, spiritual traditions' },
  { id: 'insight', name: 'Insight', defaultAbility: 'SENSE', description: 'Reading motives, noticing lies, sensing emotional states' },
  { id: 'medicine', name: 'Medicine', defaultAbility: 'SENSE', description: 'Stabilizing the dying, diagnosing conditions, field treatment' },
  { id: 'perception', name: 'Perception', defaultAbility: 'SENSE', description: 'Spotting ambushes, hearing distant noises, noticing details' },
  { id: 'survival', name: 'Survival', defaultAbility: 'SENSE', description: 'Tracking, navigating wilderness, predicting weather or Break patterns' },
  { id: 'deception', name: 'Deception', defaultAbility: 'PRE', description: 'Lying, forging personas, misdirecting in conversation' },
  { id: 'intimidation', name: 'Intimidation', defaultAbility: 'PRE', description: 'Coercing, making threats, projecting menace' },
  { id: 'performance', name: 'Performance', defaultAbility: 'PRE', description: 'Entertaining, public speaking, social displays' },
  { id: 'persuasion', name: 'Persuasion', defaultAbility: 'PRE', description: 'Negotiating, convincing, diplomacy, calming crowds' },
];

// DC Reference
export const DC_LADDER = [
  { dc: 5, difficulty: 'Very Easy', examples: 'Hop a small barrier, recall recent public news' },
  { dc: 10, difficulty: 'Easy', examples: 'Climb a chain-link fence, impress a minor official' },
  { dc: 15, difficulty: 'Moderate', examples: 'Track a careful target, hack a low-security system' },
  { dc: 20, difficulty: 'Hard', examples: 'Leap between moving vehicles, notice a hidden sniper' },
  { dc: 25, difficulty: 'Very Hard', examples: 'Convince a hostile guild officer to back down' },
  { dc: 30, difficulty: 'Nearly Impossible', examples: 'Legendary feats, holding a collapsing portal' },
];

// Rarity levels
export type Rarity = 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';

export const RARITY_LABELS: Record<Rarity, string> = {
  'common': 'Common',
  'uncommon': 'Uncommon',
  'rare': 'Rare',
  'very-rare': 'Very Rare',
  'legendary': 'Legendary',
};

// Job (class) definition
export interface Job {
  id: string;
  name: string;
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
}

export interface JobFeature {
  id: string;
  name: string;
  level: number;
  description: string;
  actionType?: 'action' | 'bonus-action' | 'reaction' | 'passive';
  uses?: {
    amount: number | string; // Can be "proficiency bonus" or a number
    recharge: 'short-rest' | 'long-rest' | 'encounter';
  };
  prerequisites?: string;
}

export interface JobPath {
  id: string;
  name: string;
  description: string;
  features: JobFeature[];
}

// Power (spell/technique)
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
  jobs: string[]; // Job IDs that can use this
  tags: string[];
}

// Relic (System-granted item)
export interface Relic {
  id: string;
  name: string;
  rarity: Rarity;
  tier?: 'dormant' | 'awakened' | 'resonant';
  type: string; // Weapon, Armor, Wondrous, etc.
  attunement: boolean;
  attunementRequirements?: string;
  description: string;
  properties: string[];
  quirks?: string[];
  corruptionRisk?: string;
  tags: string[];
}

// Monster/Creature
export interface Monster {
  id: string;
  name: string;
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
  type: string;
  alignment?: string;
  cr: string; // Challenge Rating
  ac: number;
  hp: {
    average: number;
    formula: string;
  };
  speed: Record<string, number>; // walk, fly, swim, etc.
  abilities: Record<AbilityScore, number>;
  savingThrows?: Partial<Record<AbilityScore, number>>;
  skills?: Record<string, number>;
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  senses: Record<string, number | string>;
  languages?: string[];
  traits: MonsterTrait[];
  actions: MonsterAction[];
  legendaryActions?: MonsterAction[];
  lairActions?: MonsterAction[];
  tags: string[]; // Gate tags, faction tags, etc.
}

export interface MonsterTrait {
  name: string;
  description: string;
}

export interface MonsterAction {
  name: string;
  description: string;
  attackBonus?: number;
  damage?: string;
  recharge?: string;
}

// Character Sheet
export interface Character {
  id: string;
  name: string;
  player?: string;
  level: number;
  job: string;
  path?: string;
  background?: string;
  
  // Ability scores
  abilities: Record<AbilityScore, number>;
  
  // Derived stats
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
  
  // Proficiencies
  savingThrowProficiencies: AbilityScore[];
  skillProficiencies: string[];
  skillExpertise: string[];
  
  // Resources
  systemFavor: {
    current: number;
    max: number;
    dieSize: number;
  };
  
  // Equipment
  equipment: string[];
  relics: string[];
  attunedRelics: string[];
  
  // Features and powers
  features: string[];
  powers: string[];
  
  // Conditions and status
  conditions: string[];
  exhaustionLevel: number;
  
  // Notes
  notes: string;
}

// Utility functions
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function getSystemFavorDie(level: number): number {
  if (level <= 4) return 4;
  if (level <= 10) return 6;
  if (level <= 16) return 8;
  return 10;
}
