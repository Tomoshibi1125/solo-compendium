import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { useUserLocalState } from '@/hooks/useToolState';

const STORAGE_KEY_PREFIX = 'filters-';

/**
 * Hook for persisting filter state to localStorage
 */
export function useFilterPersistence<T extends Record<string, unknown>>(
  key: string,
  defaultFilters: T
): [T, (filters: T | ((prev: T) => T)) => void] {
  const storageKey = `${STORAGE_KEY_PREFIX}${key}`;
  const { state: allFilters, setState: setAllFilters } = useUserLocalState<Record<string, T>>(
    storageKey,
    { initialState: {} }
  );

  const [filters, setFilters] = useState<T>(() => {
    const stored = allFilters[key];
    if (!stored) return defaultFilters;
    try {
      // Merge with defaults to handle new filter options
      return { ...defaultFilters, ...stored };
    } catch (error) {
      logger.error(`Failed to load filters for ${key}:`, error);
      return defaultFilters;
    }
  });

  // Save filters whenever they change
  useEffect(() => {
    setAllFilters(prev => ({
      ...prev,
      [key]: filters,
    }));
  }, [filters, key, setAllFilters]);

  const updateFilters = useCallback((newFilters: T | ((prev: T) => T)) => {
    setFilters(prev => {
      const updated = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      return updated;
    });
  }, []);

  return [filters, updateFilters];
}

/**
 * Clear persisted filters for a specific key
 */
export function clearPersistedFilters(key: string): void {
  // Note: This function is now a no-op since filters are managed internally
  // by the useFilterPersistence hook using useUserLocalState
  // Individual filter clearing would need to be done through the hook's interface
  logger.warn(`clearPersistedFilters is deprecated. Use the hook's interface to clear filters.`);
}

