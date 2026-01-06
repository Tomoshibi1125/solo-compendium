import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

const STORAGE_KEY = 'solo-compendium-search-history';
const MAX_HISTORY_ITEMS = 20;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  filters?: Record<string, unknown>;
  resultCount?: number;
}

/**
 * Hook for managing search history
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as SearchHistoryItem[];
    } catch (error) {
      logger.error('Failed to load search history:', error);
      return [];
    }
  });

  // Save history whenever it changes
  useEffect(() => {
    try {
      const toSave = history
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      logger.error('Failed to save search history:', error);
    }
  }, [history]);

  const addToHistory = useCallback((query: string, filters?: Record<string, unknown>, resultCount?: number) => {
    if (!query.trim()) return;

    setHistory(prev => {
      // Remove duplicate (if exists)
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      
      // Add new item at the beginning
      return [
        {
          query: query.trim(),
          timestamp: Date.now(),
          filters,
          resultCount,
        },
        ...filtered,
      ].slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setHistory(prev => prev.filter(item => item.query !== query));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getRecentSearches = useCallback((limit: number = 10) => {
    return history
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }, [history]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getRecentSearches,
  };
}

