/**
 * Centralized Compendium Reference Resolver
 * 
 * Provides a single source of truth for resolving compendium entity references.
 * Replaces ad-hoc Supabase queries throughout the codebase.
 */

import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/appError';
import type { StaticCompendiumEntry } from '@/data/compendium/staticDataProvider';

export const entryTypes = [
  'jobs',
  'paths',
  'powers',
  'runes',
  'relics',
  'monsters',
  'backgrounds',
  'conditions',
  'monarchs',
  'feats',
  'skills',
  'equipment',
  'sovereigns',
  'shadow-soldiers',
  'items',
  'spells',
  'techniques',
  'artifacts',
  'locations',
] as const;

export type EntryType = (typeof entryTypes)[number];

export interface CompendiumEntity {
  id: string;
  name: string;
  type: EntryType;
  description?: string | null;
  [key: string]: unknown; // Allow additional properties
}

const supabaseTableMap: Partial<Record<EntryType, keyof Database['public']['Tables']>> = {
  jobs: 'compendium_jobs',
  paths: 'compendium_job_paths',
  powers: 'compendium_powers',
  runes: 'compendium_runes',
  relics: 'compendium_relics',
  monsters: 'compendium_monsters',
  backgrounds: 'compendium_backgrounds',
  conditions: 'compendium_conditions',
  monarchs: 'compendium_monarchs',
  feats: 'compendium_feats',
  skills: 'compendium_skills',
  equipment: 'compendium_equipment',
  sovereigns: 'compendium_sovereigns',
  'shadow-soldiers': 'compendium_shadow_soldiers',
};

type StaticDataProvider = {
  getJobs: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getPaths: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getPowers: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getRunes: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getRelics: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getMonsters: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getBackgrounds: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getConditions: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getMonarchs: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getFeats: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getSkills: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getShadowSoldiers: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getItems: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getSpells: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getTechniques: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getArtifacts: (search?: string) => Promise<StaticCompendiumEntry[]>;
  getLocations: (search?: string) => Promise<StaticCompendiumEntry[]>;
};

let staticProviderPromise: Promise<StaticDataProvider> | null = null;

const loadStaticProvider = () => {
  if (!staticProviderPromise) {
    staticProviderPromise = import('@/data/compendium/staticDataProvider').then(
      (module) => module.staticDataProvider
    );
  }
  return staticProviderPromise;
};

const getStaticEntries = async (
  type: EntryType,
  search?: string
): Promise<StaticCompendiumEntry[] | null> => {
  const provider = await loadStaticProvider();
  switch (type) {
    case 'jobs':
      return provider.getJobs(search);
    case 'paths':
      return provider.getPaths(search);
    case 'powers':
      return provider.getPowers(search);
    case 'runes':
      return provider.getRunes(search);
    case 'relics':
      return provider.getRelics(search);
    case 'monsters':
      return provider.getMonsters(search);
    case 'backgrounds':
      return provider.getBackgrounds(search);
    case 'conditions':
      return provider.getConditions(search);
    case 'monarchs':
      return provider.getMonarchs(search);
    case 'feats':
      return provider.getFeats(search);
    case 'skills':
      return provider.getSkills(search);
    case 'shadow-soldiers':
      return provider.getShadowSoldiers(search);
    case 'items':
      return provider.getItems(search);
    case 'spells':
      return provider.getSpells(search);
    case 'techniques':
      return provider.getTechniques(search);
    case 'artifacts':
      return provider.getArtifacts(search);
    case 'locations':
      return provider.getLocations(search);
    default:
      return null;
  }
};

export async function listStaticEntries(type: EntryType): Promise<StaticCompendiumEntry[] | null> {
  return getStaticEntries(type);
}

/**
 * Resolve a compendium reference to its entity
 * 
 * @param type - The type of compendium entry
 * @param id - The ID of the entry
 * @returns The resolved entity, or null if not found
 */
export async function resolveRef(
  type: EntryType,
  id: string
): Promise<CompendiumEntity | null> {
  const tableName = supabaseTableMap[type];

  if (isSupabaseConfigured && tableName) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logger.warn(`Error resolving ${type}:${id}:`, error);
      } else if (data) {
        if (data === null || typeof data !== 'object') {
          return null;
        }

        const checkedData = data as Record<string, unknown>;
        if (!('id' in checkedData) || !('name' in checkedData)) {
          return null;
        }

        const entityData = checkedData as { id: unknown; name: unknown; description?: unknown; [key: string]: unknown };
        if (typeof entityData.id !== 'string' || typeof entityData.name !== 'string') {
          return null;
        }

        return {
          ...entityData,
          id: entityData.id,
          name: entityData.name,
          type,
          description:
            typeof entityData.description === 'string' ? entityData.description : null,
        } as CompendiumEntity;
      }
    } catch (error) {
      logger.warn(`Exception resolving ${type}:${id}:`, error);
    }
  }

  const staticEntries = await listStaticEntries(type);
  if (!staticEntries) {
    return null;
  }

  const entry = staticEntries.find((item) => item.id === id);
  if (!entry) {
    return null;
  }

  const resolvedName = entry.display_name || entry.name;
  return {
    ...entry,
    id: entry.id,
    name: resolvedName,
    type,
    description: typeof entry.description === 'string' ? entry.description : null,
  } as CompendiumEntity;
}

/**
 * Resolve multiple compendium references in batch
 * 
 * @param refs - Array of {type, id} pairs
 * @returns Map of resolved entities keyed by "type:id"
 */
export async function resolveRefs(
  refs: Array<{ type: EntryType; id: string }>
): Promise<Map<string, CompendiumEntity>> {
  const results = new Map<string, CompendiumEntity>();

  // Resolve in parallel
  const promises = refs.map(async ({ type, id }) => {
    const entity = await resolveRef(type, id);
    if (entity) {
      results.set(`${type}:${id}`, entity);
    }
  });

  await Promise.all(promises);
  return results;
}

/**
 * Get the Supabase table name for an entry type
 */
export function getTableName(type: EntryType): keyof Database['public']['Tables'] {
  const tableName = supabaseTableMap[type];
  if (!tableName) {
    throw new AppError(`No Supabase table for entry type: ${type}`, 'INVALID_INPUT');
  }
  return tableName;
}

/**
 * Validate that a reference exists
 */
export async function validateRef(type: EntryType, id: string): Promise<boolean> {
  const entity = await resolveRef(type, id);
  return entity !== null;
}

/**
 * Check if a string is a valid EntryType
 */
export function isValidEntryType(value: string): value is EntryType {
  return entryTypes.includes(value as EntryType);
}
