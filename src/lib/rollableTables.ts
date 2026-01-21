/**
 * Enhanced rollable tables system
 * Comprehensive tables for System Ascendant 5e SRD
 */

import { formatMonarchVernacular } from '@/lib/vernacular';

export interface RollableTable {
  id: string;
  name: string;
  description: string;
  entries: string[];
  dice?: string; // e.g., "1d12", "2d6"
}

export const ROLLABLE_TABLES: Record<string, RollableTable> = {
  'gate-complications': {
    id: 'gate-complications',
    name: 'Rift Complications',
    description: 'Unexpected events during Rift exploration',
    entries: [
      'Mana surge causes random power effects',
      'Rift structure shifts, changing layout',
      'Monster reinforcements arrive',
      'Environmental hazard activates (fire, ice, poison)',
      'Time distortion slows/speeds ascendant team',
      'Shadow corruption spreads',
      'Rift boss awakens early',
      'Core instability causes tremors',
      'Mana depletion reduces power effectiveness',
      'Illusionary duplicates confuse ascendants',
      'Rift rank increases mid-encounter',
      'Monster evolution triggers',
    ],
    dice: '1d12',
  },
  'gate-rewards': {
    id: 'gate-rewards',
    name: 'Rift Rewards',
    description: 'Rewards from completing Rifts',
    entries: [
      'Standard core yield',
      'Enhanced core (double value)',
      'Rare material drop',
      'Relic fragment',
      'System favor bonus',
      'Experience multiplier',
      'Unique monster part',
      'Rift completion bonus',
      'Hidden treasure cache',
      'Monarch blessing',
      'Skill point bonus',
      'Legendary core shard',
    ],
    dice: '1d12',
  },
  'gate-hazards': {
    id: 'gate-hazards',
    name: 'Rift Hazards',
    description: 'Environmental dangers in Rifts',
    entries: [
      'Mana vortex (random teleportation)',
      'Shadow trap (damage + condition)',
      'Collapsing structure',
      'Poisonous miasma',
      'Extreme temperature zone',
      'Gravity distortion',
      'Time dilation field',
      'Mana drain zone',
      'Monster spawning point',
      'Core radiation',
      'Dimensional rift',
      'System interference',
    ],
    dice: '1d12',
  },
  'npc-motivations': {
    id: 'npc-motivations',
    name: 'NPC Motivations',
    description: 'What drives NPCs in System Ascendant',
    entries: [
      'Seeking power through Rifts',
      'Protecting loved ones',
      'Revenge against monsters',
      'Researching Rift phenomena',
      'Building an ascendant organization',
      'Seeking the Umbral Monarch',
      'Escaping past trauma',
      'Proving their worth',
      'Accumulating wealth',
      'Uncovering secrets',
      'Protecting humanity',
      'Achieving immortality',
    ],
    dice: '1d12',
  },
  'npc-secrets': {
    id: 'npc-secrets',
    name: 'NPC Secrets',
    description: 'Hidden truths about NPCs',
    entries: [
      'Former S-Rank ascendant (lost power)',
      'Working for a Monarch',
      'Has a cursed relic',
      'Knows about the reset',
      'Is actually a monster',
      'Has System favor debt',
      'Betrayed their Ascendant team',
      'Seeking forbidden knowledge',
      'Has a hidden Rift',
      'Is being hunted',
      'Knows the Prime Architect personally',
      'Has a duplicate identity',
    ],
    dice: '1d12',
  },
  'gate-themes': {
    id: 'gate-themes',
    name: 'Rift Themes',
    description: 'Thematic elements for Rifts',
    entries: [
      'Shadow Realm (undead focus)',
      'Elemental Chaos (elemental focus)',
      'Beast Domain (animal focus)',
      'Construct Forge (construct focus)',
      'Abyssal Depths (fiend focus)',
      'Celestial Spire (celestial focus)',
      'Prime Architect\'s Domain (shadow focus)',
      'Necromantic Lab (undead + construct)',
      'Mana Nexus (elemental + aberration)',
      'Umbral Monarch\'s Memory',
      'System Testing Ground',
      'Post-Reset Fragment',
    ],
    dice: '1d12',
  },
  'loot-tiers': {
    id: 'loot-tiers',
    name: 'Loot Tiers',
    description: 'Quality of loot drops',
    entries: [
      'Common equipment',
      'Uncommon equipment',
      'Rare equipment',
      'Very rare equipment',
      'Legendary equipment',
      'Relic (dormant)',
      'Relic (awakened)',
      'Relic (resonant)',
      'Core shards',
      'Rare materials',
      'System favor bonus',
      'Unique item',
    ],
    dice: '1d12',
  },
  'encounter-types': {
    id: 'encounter-types',
    name: 'Encounter Types',
    description: 'Types of combat encounters',
    entries: [
      'Ambush',
      'Patrol',
      'Guard post',
      'Boss chamber',
      'Elite group',
      'Swarm',
      'Single powerful enemy',
      'Mixed forces',
      'Environmental combat',
      'Puzzle encounter',
      'Social encounter',
      'Chase sequence',
    ],
    dice: '1d12',
  },
};

/**
 * Roll on a table
 */
export function rollTable(tableId: string): string | null {
  const table = ROLLABLE_TABLES[tableId];
  if (!table) return null;

  const roll = Math.floor(Math.random() * table.entries.length);
  return formatMonarchVernacular(table.entries[roll]);
}

/**
 * Parse dice notation and roll
 */
export function rollDice(notation: string): number {
  // Parse "1d12", "2d6+3", etc.
  const match = notation.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!match) return 0;

  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;

  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }

  return total + modifier;
}


