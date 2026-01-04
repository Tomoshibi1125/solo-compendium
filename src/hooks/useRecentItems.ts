import { useState, useEffect } from 'react';

export interface RecentItem {
  id: string;
  type: string;
  name: string;
  href: string;
  timestamp: number;
}

const STORAGE_KEY = 'solo-compendium-recent-items';
const MAX_RECENT_ITEMS = 20;

/**
 * Hook for managing recently viewed items
 */
export function useRecentItems() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent items:', error);
    }
  }, []);

  const addRecentItem = (item: Omit<RecentItem, 'timestamp'>) => {
    setRecentItems(prev => {
      // Remove existing item if present
      const filtered = prev.filter(i => !(i.id === item.id && i.type === item.type));
      
      // Add new item at the beginning
      const updated = [
        { ...item, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT_ITEMS);

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save recent items:', error);
      }

      return updated;
    });
  };

  const clearRecentItems = () => {
    setRecentItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear recent items:', error);
    }
  };

  const removeRecentItem = (id: string, type: string) => {
    setRecentItems(prev => {
      const updated = prev.filter(i => !(i.id === id && i.type === type));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to update recent items:', error);
      }
      return updated;
    });
  };

  return {
    recentItems,
    addRecentItem,
    clearRecentItems,
    removeRecentItem,
  };
}

