/**
 * Static Data Provider for Compendium
 * 
 * Bridges the gap between static TS data and the existing Supabase-based UI.
 * Provides the same interface as Supabase queries but uses local static data.
 */

import { monsters } from './monsters';
import { items } from './items';
import { jobs } from './jobs';
import { spells } from './spells';
import { locations } from './locations';
import { runesCompendium } from './runes';
import { backgrounds } from './backgrounds';

// Type definitions matching the UI expectations
export interface StaticCompendiumEntry {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  created_at?: string;
  tags?: string[] | null;
  source_book?: string | null;
  image_url?: string | null;
  // Type-specific fields
  power_level?: number | null;
  school?: string | null;
  title?: string | null;
  theme?: string | null;
  prerequisites?: string | null;
  fusion_theme?: string | null;
  equipment_type?: string | null;
  ability?: string | null;
  rune_type?: string | null;
  rune_category?: string | null;
  cr?: string;
  gate_rank?: string;
  is_boss?: boolean;
  rarity?: string;
  level?: number;
}

export interface StaticDataProvider {
  getJobs: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getPaths: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getMonsters: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getItems: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getSpells: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getLocations: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getRunes: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getBackgrounds: (search?: string) => Promise<StaticCompendiumEntry[]>;
}

// Helper function to filter by search query
function filterBySearch<T extends Record<string, any>>(
  items: T[], 
  search?: string,
  searchFields: (keyof T)[] = ['name', 'description']
): T[] {
  if (!search?.trim()) return items;
  
  const searchLower = search.toLowerCase();
  return items.filter(item => 
    searchFields.some(field => {
      const value = item[field];
      return value && typeof value === 'string' && 
             value.toLowerCase().includes(searchLower);
    })
  );
}

// Transform static data to match UI interface
function transformMonster(monster: any): StaticCompendiumEntry {
  return {
    id: monster.id,
    name: monster.name,
    display_name: monster.name,
    description: monster.description,
    created_at: new Date().toISOString(),
    tags: [monster.type, monster.rank],
    source_book: 'Solo Compendium Homebrew',
    image_url: monster.image,
    cr: monster.rank,
    gate_rank: monster.rank,
    is_boss: monster.rank === 'S' || monster.rank === 'A',
    rarity: monster.rank === 'S' ? 'legendary' : 
            monster.rank === 'A' ? 'epic' :
            monster.rank === 'B' ? 'rare' :
            monster.rank === 'C' ? 'uncommon' : 'common'
  };
}

function transformItem(item: any): StaticCompendiumEntry {
  return {
    id: item.id,
    name: item.name,
    display_name: item.name,
    description: item.description,
    created_at: new Date().toISOString(),
    tags: [item.type, item.rarity],
    source_book: 'Solo Compendium Homebrew',
    image_url: item.image,
    equipment_type: item.type,
    rarity: item.rarity,
    level: undefined
  };
}

function transformJob(job: any): StaticCompendiumEntry {
  return {
    id: job.id || job.name.toLowerCase().replace(/\s+/g, '-'),
    name: job.name,
    display_name: job.name,
    description: job.description,
    created_at: new Date().toISOString(),
    tags: job.primary_abilities || [],
    source_book: 'Solo Compendium Homebrew',
    image_url: job.image,
    rarity: 'legendary',
    level: undefined
  };
}

function transformSpell(spell: any): StaticCompendiumEntry {
  return {
    id: spell.id || spell.name.toLowerCase().replace(/\s+/g, '-'),
    name: spell.name,
    display_name: spell.name,
    description: spell.description,
    created_at: new Date().toISOString(),
    tags: [spell.type, spell.rank],
    source_book: 'Solo Compendium Homebrew',
    image_url: spell.image,
    school: spell.type,
    power_level: undefined,
    rarity: spell.rank === 'S' ? 'legendary' :
            spell.rank === 'A' ? 'epic' :
            spell.rank === 'B' ? 'rare' :
            spell.rank === 'C' ? 'uncommon' : 'common'
  };
}

function transformLocation(location: any): StaticCompendiumEntry {
  return {
    id: location.id || location.name.toLowerCase().replace(/\s+/g, '-'),
    name: location.name,
    display_name: location.name,
    description: location.description,
    created_at: new Date().toISOString(),
    tags: [location.type, location.danger_level],
    source_book: 'Solo Compendium Homebrew',
    image_url: location.image,
    rarity: location.danger_level === 'S' ? 'legendary' :
            location.danger_level === 'A' ? 'epic' :
            location.danger_level === 'B' ? 'rare' :
            location.danger_level === 'C' ? 'uncommon' : 'common'
  };
}

function transformRune(rune: any): StaticCompendiumEntry {
  return {
    id: rune.id || rune.name.toLowerCase().replace(/\s+/g, '-'),
    name: rune.name,
    display_name: rune.name,
    description: rune.description,
    created_at: new Date().toISOString(),
    tags: [rune.element, rune.rarity],
    source_book: 'Solo Compendium Homebrew',
    image_url: rune.image,
    rune_type: rune.element,
    rune_category: rune.rarity,
    rarity: rune.rarity
  };
}

function transformBackground(background: any): StaticCompendiumEntry {
  return {
    id: background.id || background.name.toLowerCase().replace(/\s+/g, '-'),
    name: background.name,
    display_name: background.name,
    description: background.description,
    created_at: new Date().toISOString(),
    tags: background.skills || [],
    source_book: 'Solo Compendium Homebrew',
    image_url: background.image,
    rarity: 'uncommon'
  };
}

// Create the provider
export const staticDataProvider: StaticDataProvider = {
  getJobs: async (search?: string) => {
    const filtered = filterBySearch(jobs, search, ['name', 'description']);
    return filtered.map(transformJob);
  },

  getPaths: async (search?: string) => {
    // For now, return empty - paths would need to be extracted from jobs data
    return [];
  },

  getMonsters: async (search?: string) => {
    const filtered = filterBySearch(monsters, search, ['name', 'description', 'type', 'rank']);
    return filtered.map(transformMonster);
  },

  getItems: async (search?: string) => {
    const filtered = filterBySearch(items, search, ['name', 'description', 'type', 'rarity']);
    return filtered.map(transformItem);
  },

  getSpells: async (search?: string) => {
    const filtered = filterBySearch(spells, search, ['name', 'description', 'type']);
    return filtered.map(transformSpell);
  },

  getLocations: async (search?: string) => {
    const filtered = filterBySearch(locations, search, ['name', 'description', 'type']);
    return filtered.map(transformLocation);
  },

  getRunes: async (search?: string) => {
    const filtered = filterBySearch(runesCompendium, search, ['name', 'description', 'element']);
    return filtered.map(transformRune);
  },

  getBackgrounds: async (search?: string) => {
    const filtered = filterBySearch(backgrounds, search, ['name', 'description']);
    return filtered.map(transformBackground);
  }
};

// Export a hook to check if we should use static data
export const useStaticDataFallback = () => {
  // Use static data when Supabase is not configured or fails
  // @ts-ignore - Global variable from Supabase integration
  return !window.supabaseConfigured || false;
};
