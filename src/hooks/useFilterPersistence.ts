import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

const STORAGE_KEY_PREFIX = 'solo-compendium-filters-';

/**
 * Hook for persisting filter state to localStorage
 */
export function useFilterPersistence<T extends Record<string, unknown>>(
  key: string,
  defaultFilters: T
): [T, (filters: T | ((prev: T) => T)) => void] {
  const storageKey = `${STORAGE_KEY_PREFIX}${key}`;

  const [filters, setFilters] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return defaultFilters;
      const parsed = JSON.parse(stored) as T;
      // Merge with defaults to handle new filter options
      return { ...defaultFilters, ...parsed };
    } catch (error) {
      logger.error(`Failed to load filters for ${key}:`, error);
      return defaultFilters;
    }
  });

  // Save filters whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(filters));
    } catch (error) {
      logger.error(`Failed to save filters for ${key}:`, error);
    }
  }, [filters, storageKey, key]);

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
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  } catch (error) {
    logger.error(`Failed to clear filters for ${key}:`, error);
  }
}

