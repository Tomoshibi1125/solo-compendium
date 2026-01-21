/**
 * Digital Character Sheet Parity Features - Inspiration & Death Saves
 */

export interface CharacterInspiration {
  inspiration_points: number;
  inspiration_used: boolean;
}

export interface DeathSaves {
  death_save_successes: number;
  death_save_failures: number;
  is_stable: boolean;
}

export type ResourceRecharge = 'short-rest' | 'long-rest' | 'encounter' | 'daily' | 'none';

export interface CustomResource {
  id: string;
  name: string;
  current: number;
  max: number;
  dieSize?: number;
  recharge?: ResourceRecharge;
  notes?: string;
}

export interface CharacterResources {
  // Inspiration
  inspiration: CharacterInspiration;
  
  // Death Saves
  death_saves: DeathSaves;
  
  // Temporary HP tracking
  temp_hp_sources: Array<{
    amount: number;
    source: string;
    duration?: number;
    expires_at?: string;
  }>;

  // Custom resource trackers
  custom_resources: CustomResource[];
}

// Initialize character resources
export function initializeCharacterResources(): CharacterResources {
  return {
    inspiration: {
      inspiration_points: 0,
      inspiration_used: false,
    },
    death_saves: {
      death_save_successes: 0,
      death_save_failures: 0,
      is_stable: false,
    },
    temp_hp_sources: [],
    custom_resources: [],
  };
}

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function normalizeCharacterResources(
  resources: CharacterResources | null | undefined
): CharacterResources {
  const defaults = initializeCharacterResources();
  if (!resources) return defaults;

  const inspiration = resources.inspiration || defaults.inspiration;
  const deathSaves = resources.death_saves || defaults.death_saves;
  const tempSources = Array.isArray(resources.temp_hp_sources) ? resources.temp_hp_sources : [];
  const customResources = Array.isArray(resources.custom_resources)
    ? resources.custom_resources
        .filter((resource) => resource && typeof resource.name === 'string')
        .map((resource) => {
          const max = Number.isFinite(resource.max) ? Math.max(0, resource.max) : 0;
          const current = Number.isFinite(resource.current)
            ? clampNumber(resource.current, 0, max)
            : max;
          const dieSize =
            Number.isFinite(resource.dieSize) && resource.dieSize && resource.dieSize > 0
              ? resource.dieSize
              : undefined;
          const recharge = resource.recharge || 'none';
          return {
            ...resource,
            max,
            current,
            dieSize,
            recharge,
          };
        })
    : defaults.custom_resources;

  return {
    inspiration: {
      inspiration_points: Number.isFinite(inspiration.inspiration_points)
        ? inspiration.inspiration_points
        : defaults.inspiration.inspiration_points,
      inspiration_used: Boolean(inspiration.inspiration_used),
    },
    death_saves: {
      death_save_successes: Number.isFinite(deathSaves.death_save_successes)
        ? deathSaves.death_save_successes
        : defaults.death_saves.death_save_successes,
      death_save_failures: Number.isFinite(deathSaves.death_save_failures)
        ? deathSaves.death_save_failures
        : defaults.death_saves.death_save_failures,
      is_stable: Boolean(deathSaves.is_stable),
    },
    temp_hp_sources: tempSources,
    custom_resources: customResources,
  };
}

export function applyResourceRest(
  resources: CharacterResources,
  restType: 'short' | 'long'
): CharacterResources {
  const resetOnShort = new Set<ResourceRecharge>(['short-rest', 'encounter']);
  const resetOnLong = new Set<ResourceRecharge>(['long-rest', 'short-rest', 'encounter', 'daily']);

  const resetMap = restType === 'short' ? resetOnShort : resetOnLong;

  const updatedResources = resources.custom_resources.map((resource) => {
    const recharge = resource.recharge || 'none';
    if (!resetMap.has(recharge)) return resource;
    return { ...resource, current: resource.max };
  });

  return {
    ...resources,
    custom_resources: updatedResources,
    death_saves:
      restType === 'long'
        ? {
            death_save_successes: 0,
            death_save_failures: 0,
            is_stable: false,
          }
        : resources.death_saves,
  };
}

// Calculate total temporary HP
export function calculateTotalTempHP(resources: CharacterResources): number {
  const now = new Date();
  return resources.temp_hp_sources
    .filter(source => !source.expires_at || new Date(source.expires_at) > now)
    .reduce((total, source) => total + source.amount, 0);
}

// Add temporary HP
export function addTemporaryHP(
  resources: CharacterResources,
  amount: number,
  source: string,
  duration?: number
): CharacterResources {
  const newSource = {
    amount,
    source,
    duration,
    expires_at: duration ? new Date(Date.now() + duration * 60 * 1000).toISOString() : undefined,
  };
  
  return {
    ...resources,
    temp_hp_sources: [...resources.temp_hp_sources, newSource],
  };
}

// Clear expired temporary HP
export function clearExpiredTempHP(resources: CharacterResources): CharacterResources {
  const now = new Date();
  return {
    ...resources,
    temp_hp_sources: resources.temp_hp_sources.filter(
      source => !source.expires_at || new Date(source.expires_at) > now
    ),
  };
}

// Handle death save
export function handleDeathSave(
  resources: CharacterResources,
  success: boolean
): { updated: CharacterResources; outcome: 'stable' | 'dead' | 'critical' | 'ongoing' } {
  const updated = { ...resources };
  updated.death_saves = { ...updated.death_saves };
  
  if (success) {
    updated.death_saves.death_save_successes++;
    if (updated.death_saves.death_save_successes >= 3) {
      updated.death_saves.is_stable = true;
      return { updated, outcome: 'stable' };
    }
  } else {
    updated.death_saves.death_save_failures++;
    if (updated.death_saves.death_save_failures >= 3) {
      return { updated, outcome: 'dead' };
    }
  }
  
  return { updated, outcome: 'ongoing' };
}

// Reset death saves (when stabilized or healed)
export function resetDeathSaves(resources: CharacterResources): CharacterResources {
  return {
    ...resources,
    death_saves: {
      death_save_successes: 0,
      death_save_failures: 0,
      is_stable: false,
    },
  };
}

// Apply inspiration
export function applyInspiration(resources: CharacterResources): CharacterResources {
  return {
    ...resources,
    inspiration: {
      inspiration_points: Math.max(0, resources.inspiration.inspiration_points - 1),
      inspiration_used: true,
    },
  };
}

// Gain inspiration
export function gainInspiration(resources: CharacterResources): CharacterResources {
  return {
    ...resources,
    inspiration: {
      inspiration_points: resources.inspiration.inspiration_points + 1,
      inspiration_used: false,
    },
  };
}

