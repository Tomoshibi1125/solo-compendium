/**
 * D&D Beyond Parity Features - Inspiration & Death Saves
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
