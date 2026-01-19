
// Rarity system for treasure
export const RARITY_CHANCES = {
  common: 0.6,
  uncommon: 0.25,
  rare: 0.1,
  very_rare: 0.04,
  legendary: 0.01
};

export function generateRarity(): string {
  const roll = Math.random();
  let cumulative = 0;
  
  for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
    cumulative += chance;
    if (roll <= cumulative) {
      return rarity;
    }
  }
  
  return 'common';
}

export const GATE_RANKS = ['E', 'D', 'C', 'B', 'A', 'S'] as const;

export interface TreasureResult {
  rank: string;
  gold: number;
  items: string[];
  materials: string[];
  relics: string[];
  description: string;
}

export const TREASURE_TABLES: Record<string, {
  goldRange: [number, number];
  itemChance: number;
  materialChance: number;
  relicChance: number;
  items: string[];
  materials: string[];
  relics: string[];
}> = {
  E: {
    goldRange: [10, 50],
    itemChance: 0.3,
    materialChance: 0.2,
    relicChance: 0,
    items: ['Basic Potion', 'Low-Grade Mana Crystal', 'Rusty Dagger', 'Simple Bandage', 'Torch', 'Rope'],
    materials: ['Common Monster Core', 'Basic Ore', 'Weak Mana Fragment'],
    relics: [],
  },
  D: {
    goldRange: [50, 200],
    itemChance: 0.5,
    materialChance: 0.4,
    relicChance: 0.1,
    items: ['Healing Potion', 'Mana Potion', 'Iron Sword', 'Leather Armor', 'Basic Relic Fragment', 'Mana-infused Rope'],
    materials: ['Monster Core', 'Iron Ore', 'Mana Crystal Fragment', 'Shadow Essence'],
    relics: ['Broken Relic Fragment'],
  },
  C: {
    goldRange: [200, 500],
    itemChance: 0.6,
    materialChance: 0.5,
    relicChance: 0.15,
    items: ['Greater Healing Potion', 'Greater Mana Potion', 'Steel Weapon', 'Chain Armor', 'Relic Fragment', 'Enchanted Item'],
    materials: ['Greater Monster Core', 'Steel Ingot', 'Refined Mana Crystal', 'Shadow Essence (Purified)', 'Gate Fragment'],
    relics: ['Fragmented Relic', 'Relic Shard'],
  },
  B: {
    goldRange: [500, 1500],
    itemChance: 0.7,
    materialChance: 0.6,
    relicChance: 0.25,
    items: ['Superior Healing Potion', 'Superior Mana Potion', 'Masterwork Weapon', 'Plate Armor', 'Relic Component', 'Rare Enchanted Item'],
    materials: ['Elite Monster Core', 'Mithril Ingot', 'Pure Mana Crystal', 'Shadow Essence (Crystallized)', 'Gate Fragment (Large)'],
    relics: ['Partial Relic', 'Relic Core'],
  },
  A: {
    goldRange: [1500, 5000],
    itemChance: 0.8,
    materialChance: 0.7,
    relicChance: 0.4,
    items: ['Ultimate Healing Potion', 'Ultimate Mana Potion', 'Legendary Weapon Blueprint', 'Legendary Armor Blueprint', 'Relic Fragment (Large)', 'Epic Enchanted Item'],
    materials: ['Boss Monster Core', 'Adamantite Ingot', 'Perfect Mana Crystal', 'Shadow Essence (Perfect)', 'Gate Fragment (Massive)', "Supreme Deity's Blessing Fragment"],
    relics: ['Near-Complete Relic', 'Relic Heart'],
  },
  S: {
    goldRange: [5000, 20000],
    itemChance: 1.0,
    materialChance: 0.9,
    relicChance: 0.6,
    items: ['Divine Healing Elixir', 'Divine Mana Elixir', 'Artifact Weapon Blueprint', 'Artifact Armor Blueprint', 'Complete Relic Fragment', 'Legendary Enchanted Item'],
    materials: ['S-Rank Monster Core', 'Divine Metal', 'Divine Mana Crystal', 'Shadow Essence (Divine)', 'Gate Core Fragment', "Supreme Deity's Blessing"],
    relics: ['Complete Relic', 'Relic Soul', 'Shadow Monarch Fragment'],
  },
};

export function generateTreasure(rank: string): TreasureResult {
  const table = TREASURE_TABLES[rank];
  if (!table) {
    return {
      rank,
      gold: 0,
      items: [],
      materials: [],
      relics: [],
      description: `Invalid rank: ${rank}`,
    };
  }

  const gold = Math.floor(
    Math.random() * (table.goldRange[1] - table.goldRange[0] + 1) + table.goldRange[0]
  );

  const items: string[] = [];
  const numItems = Math.random() < table.itemChance
    ? (rank === 'S' ? 2 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 2))
    : 0;
  for (let i = 0; i < numItems; i += 1) {
    const item = table.items[Math.floor(Math.random() * table.items.length)];
    if (!items.includes(item)) {
      items.push(item);
    }
  }

  const materials: string[] = [];
  const numMaterials = Math.random() < table.materialChance ? 1 + Math.floor(Math.random() * 2) : 0;
  for (let i = 0; i < numMaterials; i += 1) {
    const material = table.materials[Math.floor(Math.random() * table.materials.length)];
    if (!materials.includes(material)) {
      materials.push(material);
    }
  }

  const relics: string[] = [];
  const numRelics = Math.random() < table.relicChance ? 1 : 0;
  for (let i = 0; i < numRelics; i += 1) {
    const relic = table.relics[Math.floor(Math.random() * table.relics.length)];
    if (!relics.includes(relic)) {
      relics.push(relic);
    }
  }

  const descriptions: string[] = [];
  descriptions.push(`Gate Rank ${rank} treasure hoard containing ${gold} gold pieces.`);

  if (items.length > 0) {
    descriptions.push(`Items found: ${items.join(', ')}.`);
  }

  if (materials.length > 0) {
    descriptions.push(`Materials recovered: ${materials.join(', ')}.`);
  }

  if (relics.length > 0) {
    descriptions.push(`Relics discovered: ${relics.join(', ')} - these are particularly valuable and rare!`);
  }

  if (items.length === 0 && materials.length === 0 && relics.length === 0) {
    descriptions.push('Only gold was found in this hoard.');
  }

  return {
    rank,
    gold,
    items,
    materials,
    relics,
    description: descriptions.join(' '),
  };
}
