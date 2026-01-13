// Comprehensive Items Compendium - D&D Beyond Scale
// Generated with full admin privileges
// Solo Leveling themed items with images

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  type: 'weapon' | 'armor' | 'consumable' | 'accessory' | 'scroll';
  image: string;
  stats?: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
  };
  effect?: string;
  value: number;
}

// Re-export items from split files
import { items as itemsPart1 } from './items-part1';
import { items as itemsPart2 } from './items-part2';
import { items as itemsPart3 } from './items-part3';
import { items as itemsPart4 } from './items-part4';
import { items as itemsPart5 } from './items-part5';

// Combined items array for backward compatibility
export const items = [
  ...itemsPart1,
  ...itemsPart2,
  ...itemsPart3,
  ...itemsPart4,
  ...itemsPart5,
];
