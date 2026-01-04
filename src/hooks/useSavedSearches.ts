import { useState, useEffect } from 'react';

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    category?: string;
    rarity?: string;
    levelMin?: number;
    levelMax?: number;
    favoritesOnly?: boolean;
  };
  createdAt: Date;
}

const STORAGE_KEY = 'solo-compendium-saved-searches';

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Array<Omit<SavedSearch, 'id' | 'createdAt'> & { id: string; createdAt: string }>;
        setSavedSearches(parsed.map((s) => ({
          ...s,
          createdAt: new Date(s.createdAt),
        })));
      }
    } catch (error) {
      // Error is handled by React Query's error state
    }
  }, []);

  const saveSearch = (search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newSearch: SavedSearch = {
      ...search,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newSearch;
  };

  const deleteSearch = (id: string) => {
    const updated = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return {
    savedSearches,
    saveSearch,
    deleteSearch,
  };
}

