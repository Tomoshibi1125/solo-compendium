import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import { warn as logWarn } from '@/lib/logger';

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
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useAuth();
  const isAuthed = isSupabaseConfigured && !!user?.id;

  useEffect(() => {
    if (loading) return;
    let active = true;

    const loadLocal = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        const parsed = JSON.parse(stored) as Array<Omit<SavedSearch, 'id' | 'createdAt'> & { id: string; createdAt: string }>;
        return parsed.map((s) => ({
          ...s,
          createdAt: new Date(s.createdAt),
        }));
      } catch (error) {
        logWarn('Failed to load saved searches from localStorage');
        return [];
      }
    };

    const loadRemote = async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('saved_searches')
        .select('id, name, search_params, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        logWarn('Failed to load saved searches from Supabase');
        return [];
      }
      return (data || []).map((row) => {
        const params = (row as { search_params?: any }).search_params || {};
        return {
          id: row.id,
          name: row.name,
          query: typeof params.query === 'string' ? params.query : '',
          filters: typeof params.filters === 'object' && params.filters ? params.filters : {},
          createdAt: new Date(row.created_at),
        } as SavedSearch;
      });
    };

    const hydrate = async () => {
      setIsLoading(true);
      const local = loadLocal();
      if (!isAuthed) {
        if (active) setSavedSearches(local);
        setIsLoading(false);
        return;
      }

      const remote = await loadRemote();
      if (!active) return;
      setSavedSearches(remote.length > 0 ? remote : local);
      setIsLoading(false);
    };

    void hydrate();
    return () => {
      active = false;
    };
  }, [isAuthed, loading, user?.id]);

  const saveSearch = async (search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newSearch: SavedSearch = {
      ...search,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    if (!isAuthed || !user?.id) {
      const updated = [...savedSearches, newSearch];
      setSavedSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return newSearch;
    }

    const { data, error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: user.id,
        name: search.name,
        search_params: {
          query: search.query,
          filters: search.filters,
        },
      })
      .select('id, name, search_params, created_at')
      .single();

    if (error || !data) {
      logWarn('Failed to save search to Supabase');
      return newSearch;
    }

    const params = (data as { search_params?: any }).search_params || {};
    const saved: SavedSearch = {
      id: data.id,
      name: data.name,
      query: typeof params.query === 'string' ? params.query : search.query,
      filters: typeof params.filters === 'object' && params.filters ? params.filters : search.filters,
      createdAt: new Date(data.created_at),
    };
    setSavedSearches((prev) => [saved, ...prev]);
    return saved;
  };

  const deleteSearch = async (id: string) => {
    if (!isAuthed || !user?.id) {
      const updated = savedSearches.filter(s => s.id !== id);
      setSavedSearches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return;
    }

    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      logWarn('Failed to delete search from Supabase');
      return;
    }
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    savedSearches,
    saveSearch,
    deleteSearch,
    isLoading,
  };
}

