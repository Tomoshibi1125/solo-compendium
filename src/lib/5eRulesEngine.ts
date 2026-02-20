/**
 * 5e Rules Engine with System Ascendant Flavor
 * Converts all mechanics to standard 5e while preserving homebrew terminology
 */

// System Ascendant canonical ability scores
export type AbilityScore = 'STR' | 'AGI' | 'VIT' | 'INT' | 'SENSE' | 'PRE';

export const ABILITY_DISPLAY_NAMES: Record<AbilityScore, string> = {
  STR: 'Strength',
  AGI: 'Agility',
  VIT: 'Vitality',
  INT: 'Intelligence',
  SENSE: 'Sense',
  PRE: 'Presence'
};

// Legacy 5e → System Ascendant mapping (for importing external data only)
export const LEGACY_5E_TO_SA: Record<string, AbilityScore> = {
  'STR': 'STR',
  'DEX': 'AGI',
  'CON': 'VIT',
  'INT': 'INT',
  'WIS': 'SENSE',
  'CHA': 'PRE',
  // Pass-through for already-converted data
  'AGI': 'AGI',
  'VIT': 'VIT',
  'SENSE': 'SENSE',
  'PRE': 'PRE',
};

export interface Skill {
  id: string;
  name: string;
  ability: AbilityScore;
  description: string;
}

export const SKILLS: Skill[] = [
  { id: 'athletics', name: 'Athletics', ability: 'STR', description: 'Physical feats of strength' },
  { id: 'acrobatics', name: 'Acrobatics', ability: 'AGI', description: 'Balance and agility maneuvers' },
  { id: 'sleight-of-hand', name: 'Sleight of Hand', ability: 'AGI', description: 'Fine motor skills and stealth' },
  { id: 'stealth', name: 'Stealth', ability: 'AGI', description: 'Moving unnoticed' },
  { id: 'arcana', name: 'Arcana', ability: 'INT', description: 'Magical knowledge and System anomalies' },
  { id: 'history', name: 'History', ability: 'INT', description: 'Recalling past events and Ascendant lore' },
  { id: 'investigation', name: 'Investigation', ability: 'INT', description: 'Deductive reasoning and analysis' },
  { id: 'nature', name: 'Nature', ability: 'INT', description: 'Natural world and creatures' },
  { id: 'religion', name: 'Religion', ability: 'INT', description: 'Cults, rituals, and spiritual traditions' },
  { id: 'animal-handling', name: 'Animal Handling', ability: 'SENSE', description: 'Animal training and behavior' },
  { id: 'insight', name: 'Insight', ability: 'SENSE', description: 'Reading motives and emotions' },
  { id: 'medicine', name: 'Medicine', ability: 'SENSE', description: 'Field treatment and diagnosis' },
  { id: 'perception', name: 'Perception', ability: 'SENSE', description: 'Noticing details and threats' },
  { id: 'survival', name: 'Survival', ability: 'SENSE', description: 'Wilderness navigation and tracking' },
  { id: 'deception', name: 'Deception', ability: 'PRE', description: 'Lying and misdirection' },
  { id: 'intimidation', name: 'Intimidation', ability: 'PRE', description: 'Coercion and threats' },
  { id: 'performance', name: 'Performance', ability: 'PRE', description: 'Entertaining and public speaking' },
  { id: 'persuasion', name: 'Persuasion', ability: 'PRE', description: 'Negotiation and diplomacy' },
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
  race?: string;
  alignment?: string;
  experience?: number;
  
  // Standard 5e abilities (displayed with System Ascendant names)
  abilities: Record<AbilityScore, number>;
  
  // Standard 5e derived stats
  proficiencyBonus: number;
  initiative: number;
  speed: number;
  speeds?: { walk: number; fly?: number; swim?: number; climb?: number; burrow?: number };
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
  
  // Armor, weapon, tool proficiencies and languages
  armorProficiencies?: string[];
  weaponProficiencies?: string[];
  toolProficiencies?: string[];
  languages?: string[];
  
  // Senses
  senses?: string[];
  
  // Damage resistances, immunities, vulnerabilities
  resistances?: string[];
  immunities?: string[];
  vulnerabilities?: string[];
  conditionImmunities?: string[];
  
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
  
  // Currency (copper, silver, electrum, gold, platinum)
  currency?: { cp: number; sp: number; ep: number; gp: number; pp: number };
  
  // Standard 5e features and powers
  features: string[];
  powers: string[];
  spellSlots?: Record<number, number>;
  
  // Actions (pre-calculated attack blocks)
  actions?: CharacterAction[];
  
  // Standard 5e conditions and status
  conditions: string[];
  exhaustionLevel: number;
  
  // Backstory & personality
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  appearance?: string;
  backstory?: string;
  
  // Notes
  notes: string;
}

export interface CharacterAction {
  id: string;
  name: string;
  type: 'melee' | 'ranged' | 'spell' | 'other';
  attackBonus?: number;
  damage?: string;
  damageType?: string;
  range?: string;
  description?: string;
  properties?: string[];
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

// ── System Favor ────────────────────────────────────────────────────────
// Core mechanic: identical to D&D Inspiration (roll die, add to d20 roll).
// Additional usage options provide thematic versatility fitting the
// System Ascendant tone. Each costs 1 System Favor unless noted.

export interface SystemFavorOption {
  id: string;
  name: string;
  cost: number;
  description: string;
  rulesText: string;
  minLevel: number;
}

export const SYSTEM_FAVOR_OPTIONS: SystemFavorOption[] = [
  // ── Core (D&D Inspiration equivalent) ──
  {
    id: 'favor-inspiration',
    name: 'System Boost',
    cost: 1,
    description: 'The System augments your action. Add your System Favor die to one ability check, attack roll, or saving throw.',
    rulesText: 'Before or after rolling a d20 for an ability check, attack roll, or saving throw, roll your System Favor die and add the result to the total. You must decide to use this before the DM declares the outcome.',
    minLevel: 1,
  },
  // ── Thematic extras ──
  {
    id: 'favor-reroll',
    name: 'System Override',
    cost: 1,
    description: 'The System intervenes — reroll a failed d20 and take either result.',
    rulesText: 'When you fail an ability check, attack roll, or saving throw, you may spend 1 System Favor to reroll the d20. You must use the new result, even if it is lower.',
    minLevel: 1,
  },
  {
    id: 'favor-status-recovery',
    name: 'System Recovery',
    cost: 1,
    description: 'The System purges a harmful effect from your body.',
    rulesText: 'As a bonus action, spend 1 System Favor to end one condition currently affecting you (except unconscious or dead). Alternatively, reduce your exhaustion level by 1.',
    minLevel: 3,
  },
  {
    id: 'favor-death-defiance',
    name: 'Death Defiance',
    cost: 2,
    description: 'The System refuses to let you fall. When reduced to 0 HP, you cling to consciousness.',
    rulesText: 'When you are reduced to 0 hit points but not killed outright, spend 2 System Favor to drop to 1 HP instead. You can use this after the damage is applied. Usable once per long rest.',
    minLevel: 5,
  },
  {
    id: 'favor-system-insight',
    name: 'System Insight',
    cost: 1,
    description: 'The System reveals hidden information about a creature or object.',
    rulesText: 'As an action, spend 1 System Favor to learn the AC, current HP percentage (full/bloodied/critical), one damage vulnerability, one damage resistance, or one condition immunity of a creature you can see within 60 feet.',
    minLevel: 1,
  },
  {
    id: 'favor-flash-step',
    name: 'Flash Step',
    cost: 1,
    description: 'The System briefly accelerates your body beyond normal limits.',
    rulesText: 'As part of your movement on your turn, spend 1 System Favor to teleport up to 10 feet to an unoccupied space you can see. This movement does not provoke opportunity attacks.',
    minLevel: 5,
  },
  {
    id: 'favor-critical-surge',
    name: 'Critical Surge',
    cost: 2,
    description: 'Channel the System\'s power into a devastating strike.',
    rulesText: 'When you hit with an attack, spend 2 System Favor to turn the hit into a critical hit. Usable once per long rest.',
    minLevel: 9,
  },
  {
    id: 'favor-party-link',
    name: 'Party Link',
    cost: 1,
    description: 'The System synchronizes your awareness with nearby allies.',
    rulesText: 'As a bonus action, spend 1 System Favor. Until the end of your next turn, you and all allies within 30 feet cannot be surprised, have advantage on initiative rolls, and can communicate telepathically.',
    minLevel: 7,
  },
];

export function getAvailableFavorOptions(level: number): SystemFavorOption[] {
  return SYSTEM_FAVOR_OPTIONS.filter(opt => level >= opt.minLevel);
}

// Aligned with unified engine: 3/4/5/6 by tier (System Ascendant canonical formula)
export function getSystemFavorMax(level: number): number {
  if (level <= 4) return 3;
  if (level <= 10) return 4;
  if (level <= 16) return 5;
  return 6;
}

export function getSystemFavorDie(level: number): number {
  if (level <= 4) return 4;
  if (level <= 10) return 6;
  if (level <= 16) return 8;
  return 10;
}

// Normalize any ability string (including legacy 5e) to System Ascendant
export function normalizeAbility(ability: string): AbilityScore {
  return LEGACY_5E_TO_SA[ability.toUpperCase()] || ability as AbilityScore;
}

// Get display name for an ability
export function getAbilityDisplayName(ability: AbilityScore): string {
  return ABILITY_DISPLAY_NAMES[ability];
}
