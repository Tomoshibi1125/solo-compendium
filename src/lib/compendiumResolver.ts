/**
 * Centralized Compendium Reference Resolver
 * 
 * Provides a single source of truth for resolving compendium entity references.
 * Replaces ad-hoc Supabase queries throughout the codebase.
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { logger } from '@/lib/logger';
import { AppError } from '@/lib/appError';

export type EntryType = 
  | 'jobs' 
  | 'paths' 
  | 'powers' 
  | 'runes' 
  | 'relics' 
  | 'monsters' 
  | 'backgrounds' 
  | 'conditions' 
  | 'monarchs' 
  | 'feats' 
  | 'skills' 
  | 'equipment' 
  | 'sovereigns'
  | 'shadow-soldiers';

export interface CompendiumEntity {
  id: string;
  name: string;
  type: EntryType;
  description?: string | null;
  [key: string]: unknown; // Allow additional properties
}

const tableMap: Record<EntryType, keyof Database['public']['Tables']> = {
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
  const tableName = tableMap[type];
  if (!tableName) {
    throw new AppError(`Unknown entry type: ${type}`, 'INVALID_INPUT');
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      logger.warn(`Error resolving ${type}:${id}:`, error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Type guard: data must be an object (not null, which is typeof 'object' in JS)
    if (data === null || typeof data !== 'object') {
      return null;
    }

    // Type guard to ensure data has required fields
    // At this point TypeScript knows data is not null, but we need to check properties
    const checkedData = data as Record<string, unknown>;
    if (!('id' in checkedData) || !('name' in checkedData)) {
      return null;
    }

    // At this point, TypeScript should know data is an object with id and name
    // Use checkedData which we know has id and name properties
    const entityData = checkedData as { id: unknown; name: unknown; description?: unknown; [key: string]: unknown };
    
    // Validate id and name are strings
    if (typeof entityData.id !== 'string' || typeof entityData.name !== 'string') {
      return null;
    }
    
    return {
      // Include all other properties first, then override canonical fields
      ...entityData,
      id: entityData.id,
      name: entityData.name,
      type,
      description:
        typeof entityData.description === 'string' ? entityData.description : null,
    } as CompendiumEntity;
  } catch (error) {
    logger.warn(`Exception resolving ${type}:${id}:`, error);
    return null;
  }
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
  const tableName = tableMap[type];
  if (!tableName) {
    throw new AppError(`Unknown entry type: ${type}`, 'INVALID_INPUT');
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
  return value in tableMap;
}
