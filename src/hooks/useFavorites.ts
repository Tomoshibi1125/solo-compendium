import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import { warn as logWarn, error as logError } from '@/lib/logger';

const LOCAL_STORAGE_KEY = 'solo-compendium-favorites';

const readLocalFavorites = (): Set<string> => {
  if (typeof window === 'undefined') {
    return new Set<string>();
  }
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      return new Set(parsed);
    }
  } catch (error) {
    logWarn('Failed to load favorites from localStorage', error);
  }
  return new Set<string>();
};

const writeLocalFavorites = (favorites: Set<string>) => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
};

export const useFavorites = () => {
  const queryClient = useQueryClient();
  const { user, session, loading } = useAuth();
  const sessionUserId = session?.user?.id;
  const authedUserId = user?.id || sessionUserId;
  const debugEnabled = import.meta.env.VITE_QA_DEBUG === 'true';

  const pushDebug = (payload: Record<string, unknown>) => {
    if (!debugEnabled || typeof window === 'undefined') return;
    const debugWindow = window as typeof window & { __favoritesDebug?: Array<Record<string, unknown>> };
    const next = debugWindow.__favoritesDebug ? [...debugWindow.__favoritesDebug] : [];
    next.push({ ts: Date.now(), ...payload });
    debugWindow.__favoritesDebug = next;
  };

  const resolveUserId = async () => {
    if (user?.id) return user.id;
    if (sessionUserId) return sessionUserId;
    if (!isSupabaseConfigured) return null;
    const { data: { session: authSession } } = await supabase.auth.getSession();
    if (authSession?.user?.id) return authSession.user.id;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    return authUser?.id || null;
  };

  const { data: favorites = new Set<string>(), isLoading } = useQuery({
    queryKey: ['favorites', authedUserId || 'guest'],
    queryFn: async () => {
      const resolvedUserId = await resolveUserId();
      if (isSupabaseConfigured && resolvedUserId) {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('entry_type, entry_id')
          .eq('user_id', resolvedUserId);

        if (error) throw error;
        return new Set((data || []).map((row) => `${row.entry_type}:${row.entry_id}`));
      }

      return readLocalFavorites();
    },
    staleTime: 30000,
    enabled: !loading || !!sessionUserId,
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ entryType, entryId, isFavorite }: { entryType: string; entryId: string; isFavorite: boolean }) => {
      const key = `${entryType}:${entryId}`;
      pushDebug({ stage: 'mutation-start', entryType, entryId, isFavorite, isSupabaseConfigured });

      const resolvedUserId = await resolveUserId();
      pushDebug({ stage: 'resolved-user', resolvedUserId });
      if (isSupabaseConfigured && resolvedUserId) {
        if (isFavorite) {
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', resolvedUserId)
            .eq('entry_type', entryType)
            .eq('entry_id', entryId);

          if (error) throw error;
          pushDebug({ stage: 'supabase-delete', entryType, entryId });
        } else {
          const { error } = await supabase
            .from('user_favorites')
            .insert({
              user_id: resolvedUserId,
              entry_type: entryType,
              entry_id: entryId,
            });

          if (error) throw error;
          pushDebug({ stage: 'supabase-insert', entryType, entryId });
        }

        return;
      }

      const currentFavorites = new Set(favorites);
      if (isFavorite) {
        currentFavorites.delete(key);
      } else {
        currentFavorites.add(key);
      }

      writeLocalFavorites(currentFavorites);
      pushDebug({ stage: 'localstorage-write', size: currentFavorites.size });
      return currentFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      logError('Favorites toggle failed:', error);
    },
  });

  const isFavorite = useCallback((entryType: string, entryId: string): boolean => {
    return favorites.has(`${entryType}:${entryId}`);
  }, [favorites]);

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite: (entryType: string, entryId: string) => {
      toggleFavorite.mutate({
        entryType,
        entryId,
        isFavorite: isFavorite(entryType, entryId),
      });
    },
  };
};
