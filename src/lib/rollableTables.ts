/**
 * Enhanced rollable tables system
 * Comprehensive tables for Solo Leveling 5e
 */

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
    name: 'Gate Complications',
    description: 'Unexpected events during Gate exploration',
    entries: [
      'Mana surge causes random power effects',
      'Gate structure shifts, changing layout',
      'Monster reinforcements arrive',
      'Environmental hazard activates (fire, ice, poison)',
      'Time distortion slows/speeds hunter team',
      'Shadow corruption spreads',
      'Gate boss awakens early',
      'Core instability causes tremors',
      'Mana depletion reduces power effectiveness',
      'Illusionary duplicates confuse hunters',
      'Gate rank increases mid-encounter',
      'Monster evolution triggers',
    ],
    dice: '1d12',
  },
  'gate-rewards': {
    id: 'gate-rewards',
    name: 'Gate Rewards',
    description: 'Rewards from completing Gates',
    entries: [
      'Standard core yield',
      'Enhanced core (double value)',
      'Rare material drop',
      'Relic fragment',
      'System favor bonus',
      'Experience multiplier',
      'Unique monster part',
      'Gate completion bonus',
      'Hidden treasure cache',
      'Monarch blessing',
      'Skill point bonus',
      'Legendary core shard',
    ],
    dice: '1d12',
  },
  'gate-hazards': {
    id: 'gate-hazards',
    name: 'Gate Hazards',
    description: 'Environmental dangers in Gates',
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
    description: 'What drives NPCs in Solo Leveling',
    entries: [
      'Seeking power through Gates',
      'Protecting loved ones',
      'Revenge against monsters',
      'Researching Gate phenomena',
      'Building a hunter organization',
      'Seeking the Shadow Monarch',
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
      'Former S-Rank hunter (lost power)',
      'Working for a Monarch',
      'Has a cursed relic',
      'Knows about the reset',
      'Is actually a monster',
      'Has System favor debt',
      'Betrayed their Hunter team',
      'Seeking forbidden knowledge',
      'Has a hidden Gate',
      'Is being hunted',
      'Knows the Supreme Deity personally',
      'Has a duplicate identity',
    ],
    dice: '1d12',
  },
  'gate-themes': {
    id: 'gate-themes',
    name: 'Gate Themes',
    description: 'Thematic elements for Gates',
    entries: [
      'Shadow Realm (undead focus)',
      'Elemental Chaos (elemental focus)',
      'Beast Domain (animal focus)',
      'Construct Forge (construct focus)',
      'Abyssal Depths (fiend focus)',
      'Celestial Spire (celestial focus)',
      'Supreme Deity\'s Domain (shadow focus)',
      'Necromantic Lab (undead + construct)',
      'Mana Nexus (elemental + aberration)',
      'Shadow Monarch\'s Memory',
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
  return table.entries[roll];
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

