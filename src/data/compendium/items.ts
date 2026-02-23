// Comprehensive Items Compendium - Digital Character Sheet Scale
// Generated with full admin privileges
// System Ascendant themed items with images

export interface Item {
  id: string;
  name: string;
  description: string;
  
  // 5e Item Structure (System Ascendant Themed)
  item_type?: 'weapon' | 'armor' | 'shield' | 'consumable' | 'tool' | 'misc';
  weapon_type?: string;             // "martial melee", "simple ranged", etc.
  damage?: string;                  // "1d8 slashing", "2d6 piercing", etc.
  damage_type?: string;             // "slashing", "piercing", "bludgeoning", etc.
  simple_properties?: string[];       // ["finesse", "light", "thrown", etc.]
  range?: string;                   // "Melee", "Ranged (20/60)", etc.
  armor_class?: string;            // "15 + Dex modifier", "18", etc.
  armor_type?: string;             // "Light", "Medium", "Heavy", "Shield"
  stealth_disadvantage?: boolean;   // For heavy armor
  strength_requirement?: number;    // For certain armor/weapons
  magical_bonus?: number;           // +1, +2, +3 for magical items
  
  // System Ascendant compatibility (legacy)
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  type: 'weapon' | 'armor' | 'consumable' | 'accessory' | 'scroll' | 'wondrous' | 'ring' | 'amulet' | 'staff' | 'wand';
  image: string;
  
  // 5e mechanics (System Ascendant themed)
  requires_attunement?: boolean;
  weight: number;                   // In pounds
  value: number;                    // In gold pieces
  
  // System Ascendant specific fields
  essence_cost?: number;            // Essence cost to use/attune
  hunter_level_required?: number;   // Minimum Hunter level
  system_awakening_required?: boolean; // Requires System Awakening
  shadow_soldier_compatible?: boolean; // Can be used by Shadow Soldiers (Umbral Regent only)
  legendary_crafted?: boolean;      // Legendary crafted item
  
  // Enhanced properties
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
  
  // Enhanced effects
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
  
  // Additional optional fields
  requirements?: Record<string, unknown>;
  
  // Legacy stats for backward compatibility
  stats?: {
    attack?: number;
    defense?: number;
    health?: number;
    mana?: number;
  };
  effect?: string;
  source?: string;
  [key: string]: unknown;
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

