// Comprehensive Items Compendium - D&D Beyond Scale
// Generated with full admin privileges
// Solo Leveling themed items with images

export interface Item {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  type: 'weapon' | 'armor' | 'consumable' | 'accessory' | 'scroll' | 'wondrous' | 'ring' | 'amulet' | 'staff' | 'wand';
  image: string;
  // D&D 5e mechanics
  requirements?: {
    level?: number;
    class?: string[];
    race?: string[];
    alignment?: string[];
  };
  properties?: {
    weapon?: {
      damage: string;
      damageType: string;
      range?: number;
      versatile?: string;
      finesse?: boolean;
    };
    magical?: {
      bonus?: {
        attack?: number;
        damage?: number;
        armorClass?: number;
        savingThrows?: string[];
        abilityScores?: {
          strength?: number;
          dexterity?: number;
          constitution?: number;
          intelligence?: number;
          wisdom?: number;
          charisma?: number;
        };
      };
      resistance?: string[];
      immunity?: string[];
      vulnerability?: string[];
    };
  };
  effects?: {
    passive?: string[];
    active?: {
      name: string;
      description: string;
      action?: 'action' | 'bonus-action' | 'reaction';
      frequency?: 'at-will' | 'short-rest' | 'long-rest' | 'once-per-day';
      dc?: number;
    }[];
    value?: number;
  };
  attunement?: boolean;
  cursed?: boolean;
  charges?: {
    max: number;
    current: number;
    recharge?: 'dawn' | 'dusk' | 'short-rest' | 'long-rest';
  };
  // Legacy stats for backward compatibility
  stats?: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
  };
  effect?: string;
  value: number;
  weight?: number;
  source?: string;
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
