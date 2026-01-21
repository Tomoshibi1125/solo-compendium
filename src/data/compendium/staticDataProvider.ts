/**
 * Static Data Provider for Compendium
 * 
 * Bridges the gap between static TS data and the existing Supabase-based UI.
 * Provides the same interface as Supabase queries but uses local static data.
 * 
 * Authoritative source: internal compendium data packs already ingested into the app.
 */

import { monsters } from './monsters';
import { items } from './items';
import { jobs } from './jobs';
import { spells } from './spells';
import { locations } from './locations';
import { runesCompendium } from './runes';
import { backgrounds } from './backgrounds';
import { monarchs } from './monarchs';
import { paths } from './paths';
import { conditions } from './conditions';
import { comprehensiveFeats } from './feats-comprehensive';
import { comprehensiveSkills } from './skills-comprehensive';
import { comprehensiveRelics } from './relics-comprehensive';
import { powers } from './powers';
import { techniques } from './techniques';
import { artifacts } from './artifacts';
import { normalizeMonarchSearch } from '@/lib/vernacular';

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
  prerequisites?: string | Record<string, unknown> | null;
  requirements?: Record<string, unknown> | null;
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
  item_type?: string | null;
  artifact_type?: string | null;
  technique_type?: string | null;
  spell_type?: string | null;
  location_type?: string | null;
  rank?: string | null;
  mana_cost?: number | null;
  damage?: number | null;
  healing?: number | null;
  effect?: string | null;
  range?: number | Record<string, unknown> | null;
  cooldown?: number | null;
  encounters?: string[] | null;
  treasures?: string[] | null;
  style?: string | null;
  activation?: Record<string, unknown> | null;
  duration?: Record<string, unknown> | null;
  components?: Record<string, unknown> | null;
  effects?: Record<string, unknown> | null;
  mechanics?: Record<string, unknown> | null;
  limitations?: Record<string, unknown> | null;
  flavor?: string | null;
  properties?: Record<string, unknown> | null;
  abilities?: Record<string, unknown> | null;
  lore?: Record<string, unknown> | null;
  attunement?: boolean | null;
  cursed?: boolean | null;
  charges?: Record<string, unknown> | null;
  stats?: Record<string, unknown> | null;
  source?: string | null;
  role?: string | null;
  value?: number | null;
  weight?: number | null;
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
  getRelics: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getConditions: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getMonarchs: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getFeats: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getSkills: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getPowers: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getTechniques: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getArtifacts: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getShadowSoldiers: (search?: string) => Promise<StaticCompendiumEntry[]>;
}

// Helper function to filter by search query
function filterBySearch<T extends Record<string, any>>(
  items: T[], 
  search?: string,
  searchFields: (keyof T)[] = ['name', 'description']
): T[] {
  if (!search?.trim()) return items;
  
  const searchLower = normalizeMonarchSearch(search.toLowerCase());
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
    source_book: 'System Ascendant Homebrew',
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
    source_book: 'System Ascendant Homebrew',
    image_url: item.image,
    equipment_type: item.type,
    item_type: item.type,
    requirements: item.requirements,
    properties: item.properties,
    effects: item.effects,
    attunement: item.attunement ?? null,
    cursed: item.cursed ?? null,
    charges: item.charges,
    stats: item.stats,
    effect: item.effect,
    value: item.value,
    weight: item.weight,
    source: item.source,
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
    source_book: 'System Ascendant Canon',
    image_url: job.image,
    rarity: job.rank === 'S' ? 'legendary' :
            job.rank === 'A' ? 'epic' :
            job.rank === 'B' ? 'rare' :
            job.rank === 'C' ? 'uncommon' : 'common',
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
    source_book: 'System Ascendant Homebrew',
    image_url: spell.image,
    spell_type: spell.type,
    rank: spell.rank,
    mana_cost: spell.manaCost,
    damage: spell.damage,
    healing: spell.healing,
    effect: spell.effect,
    range: spell.range,
    cooldown: spell.cooldown,
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
    tags: [location.type, location.rank],
    source_book: 'System Ascendant Homebrew',
    image_url: location.image,
    location_type: location.type,
    rank: location.rank,
    encounters: location.encounters,
    treasures: location.treasures,
    rarity: location.rank === 'S' ? 'legendary' :
            location.rank === 'A' ? 'epic' :
            location.rank === 'B' ? 'rare' :
            location.rank === 'C' ? 'uncommon' : 'common'
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
    source_book: 'System Ascendant Homebrew',
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
    source_book: 'System Ascendant Canon',
    image_url: background.image,
    rarity: 'uncommon'
  };
}

function transformMonarch(monarch: any): StaticCompendiumEntry {
  return {
    id: monarch.id || monarch.name.toLowerCase().replace(/\s+/g, '-'),
    name: monarch.name,
    display_name: monarch.name,
    description: monarch.description,
    created_at: new Date().toISOString(),
    tags: ['monarch', monarch.theme],
    source_book: 'System Ascendant Canon',
    title: monarch.title,
    theme: monarch.theme,
    rarity: monarch.rank === 'S' ? 'legendary' :
            monarch.rank === 'A' ? 'epic' :
            monarch.rank === 'B' ? 'rare' :
            monarch.rank === 'C' ? 'uncommon' : 'common'
  };
}

// Create the provider
export const staticDataProvider: StaticDataProvider = {
  getJobs: async (search?: string) => {
    const filtered = filterBySearch(jobs, search, ['name', 'description']);
    return filtered.map(transformJob);
  },

  getPaths: async (search?: string) => {
    const filtered = filterBySearch(paths, search, ['name', 'description']);
    return filtered.map(path => ({
      id: path.id,
      name: path.name,
      display_name: path.name,
      description: path.description,
      created_at: new Date().toISOString(),
      tags: [path.jobId, `tier-${path.tier}`, ...path.requirements.skills || []],
      source_book: path.source,
      image_url: path.image,
      level: path.requirements.level,
      prerequisites: path.requirements.prerequisites?.join(', '),
      rarity: path.tier === 3 ? 'legendary' : path.tier === 2 ? 'very_rare' : 'rare',
      jobId: path.jobId,
      jobName: path.jobName,
      tier: path.tier
    }));
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
  },

  getRelics: async (search?: string) => {
    const filtered = filterBySearch(comprehensiveRelics, search, ['name', 'description', 'type']);
    return filtered.map(relic => ({
      id: relic.id,
      name: relic.name,
      display_name: relic.name,
      description: relic.description,
      created_at: new Date().toISOString(),
      tags: [relic.type, relic.rarity, ...relic.properties.magical ? ['magical'] : []],
      source_book: relic.source,
      image_url: relic.image,
      rarity: relic.rarity,
      equipment_type: relic.type
    }));
  },

  getConditions: async (search?: string) => {
    const filtered = filterBySearch(conditions, search, ['name', 'description', 'type']);
    return filtered.map(condition => ({
      id: condition.id,
      name: condition.name,
      display_name: condition.name,
      description: condition.description,
      created_at: new Date().toISOString(),
      tags: [condition.type, 'condition'],
      source_book: condition.source,
      image_url: condition.image
    }));
  },

  getMonarchs: async (search?: string) => {
    const filtered = filterBySearch(monarchs, search, ['name', 'description', 'title', 'theme']);
    return filtered.map(transformMonarch);
  },

  getFeats: async (search?: string) => {
    const filtered = filterBySearch(comprehensiveFeats, search, ['name', 'description', 'benefits']);
    return filtered.map(feat => ({
      id: feat.id,
      name: feat.name,
      display_name: feat.name,
      description: feat.description,
      created_at: new Date().toISOString(),
      tags: ['feat', 'ability', ...(feat.prerequisites?.feats || [])],
      source_book: feat.source,
      prerequisites: feat.prerequisites ? 
        (typeof feat.prerequisites === 'string' ? feat.prerequisites :
        Object.entries(feat.prerequisites).map(([key, value]) => `${key}: ${value}`).join(', ')) : undefined
    }));
  },

  getSkills: async (search?: string) => {
    const filtered = filterBySearch(comprehensiveSkills, search, ['name', 'description', 'type']);
    return filtered.map(skill => ({
      id: skill.id,
      name: skill.name,
      display_name: skill.name,
      description: skill.description,
      created_at: new Date().toISOString(),
      tags: [skill.type, 'skill', skill.ability],
      source_book: skill.source,
      ability: skill.ability
    }));
  },

  getPowers: async (search?: string) => {
    const filtered = filterBySearch(powers, search, ['name', 'description', 'type']);
    return filtered.map(power => ({
      id: power.id,
      name: power.name,
      display_name: power.name,
      description: power.description,
      created_at: new Date().toISOString(),
      tags: ['power', power.type, power.rarity],
      source_book: power.source,
      image_url: power.image,
      power_level: power.type === 'divine' ? 10 : power.type === 'monstrous' ? 8 : 5,
      school: power.type,
      title: power.type,
      theme: power.type,
      prerequisites: power.requirements ? JSON.stringify(power.requirements) : null,
      rarity: power.rarity,
      level: power.requirements?.level
    }));
  },

  getTechniques: async (search?: string) => {
    const filtered = filterBySearch(techniques, search, ['name', 'description', 'type', 'style']);
    return filtered.map(technique => ({
      id: technique.id,
      name: technique.name,
      display_name: technique.name,
      description: technique.description,
      created_at: new Date().toISOString(),
      tags: ['technique', technique.type, technique.style],
      source_book: technique.source,
      image_url: technique.image,
      technique_type: technique.type,
      style: technique.style,
      prerequisites: technique.prerequisites || null,
      activation: technique.activation || null,
      duration: technique.duration || null,
      range: technique.range || null,
      components: technique.components || null,
      effects: technique.effects || null,
      mechanics: technique.mechanics || null,
      limitations: technique.limitations || null,
      flavor: technique.flavor,
      source: technique.source,
      power_level: technique.type === 'finishing' ? 9 : technique.type === 'offensive' ? 7 : 5,
      school: technique.type,
      title: technique.type,
      theme: technique.style,
      rarity: technique.type === 'finishing' ? 'legendary' : technique.type === 'offensive' ? 'rare' : 'uncommon',
      level: technique.prerequisites?.level
    }));
  },

  getArtifacts: async (search?: string) => {
    const filtered = filterBySearch(artifacts, search, ['name', 'description', 'type', 'rarity']);
    return filtered.map(artifact => ({
      id: artifact.id,
      name: artifact.name,
      display_name: artifact.name,
      description: artifact.description,
      created_at: new Date().toISOString(),
      tags: ['artifact', artifact.type, artifact.rarity],
      source_book: artifact.source,
      image_url: artifact.image,
      artifact_type: artifact.type,
      attunement: artifact.attunement,
      requirements: artifact.requirements || null,
      properties: artifact.properties || null,
      abilities: artifact.abilities || null,
      lore: artifact.lore || null,
      mechanics: artifact.mechanics || null,
      source: artifact.source,
      power_level: artifact.rarity === 'divine' ? 10 : artifact.rarity === 'mythic' ? 9 : 8,
      school: artifact.type,
      title: artifact.type,
      theme: artifact.rarity,
      rarity: artifact.rarity,
      level: artifact.requirements?.level
    }));
  },

  getShadowSoldiers: async (search?: string) => {
    const shadowSoldiers = [
      {
        id: 'tank-soldier',
        name: 'Umbral Tank',
        description: 'Heavy armored legionnaire specialized in defense and crowd control.',
        rank: 'A',
        role: 'Tank'
      },
      {
        id: 'assassin-soldier',
        name: 'Umbral Assassin',
        description: 'Stealthy legionnaire specialized in assassination and reconnaissance.',
        rank: 'A',
        role: 'Assassin'
      },
      {
        id: 'mage-soldier',
        name: 'Umbral Mage',
        description: 'Magic-wielding legionnaire capable of casting umbral spells.',
        rank: 'B',
        role: 'Mage'
      },
      {
        id: 'archer-soldier',
        name: 'Umbral Archer',
        description: 'Ranged legionnaire specialized in precise long-range attacks.',
        rank: 'B',
        role: 'Archer'
      },
      {
        id: 'warrior-soldier',
        name: 'Umbral Warrior',
        description: 'Versatile melee legionnaire balanced in offense and defense.',
        rank: 'C',
        role: 'Warrior'
      },
      {
        id: 'scout-soldier',
        name: 'Umbral Scout',
        description: 'Fast and agile legionnaire specialized in reconnaissance and scouting.',
        rank: 'C',
        role: 'Scout'
      }
    ];
    
    const filtered = filterBySearch(shadowSoldiers, search, ['name', 'description', 'role']);
    return filtered.map(item => ({
      id: item.id,
      name: item.name,
      display_name: item.name,
      description: item.description,
      created_at: new Date().toISOString(),
      tags: ['umbral-legion', 'umbral', 'minion'],
      source_book: 'System Ascendant Canon',
      role: item.role,
      gate_rank: item.rank,
      rarity: item.rank === 'A' ? 'very_rare' : 
              item.rank === 'B' ? 'rare' : 'uncommon',
      level: undefined
    }));
  },
};

// Export a hook to check if we should use static data
export const useStaticDataFallback = () => {
  // Use static data when Supabase is not configured or fails
  // @ts-expect-error - Global variable from Supabase integration
  return !window.supabaseConfigured || false;
};



