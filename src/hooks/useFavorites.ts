import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { warn as logWarn } from '@/lib/logger';

// Favorites feature - uses local storage until user_favorites table is created
export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favorites = new Set<string>(), isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      // Use localStorage for favorites until database table exists
      try {
        const stored = localStorage.getItem('solo-compendium-favorites');
        if (stored) {
          const parsed = JSON.parse(stored) as string[];
          return new Set(parsed);
        }
      } catch (e) {
        logWarn('Failed to load favorites from localStorage');
      }
      return new Set<string>();
    },
    staleTime: 30000,
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ entryType, entryId, isFavorite }: { entryType: string; entryId: string; isFavorite: boolean }) => {
      const key = `${entryType}:${entryId}`;
      const currentFavorites = new Set(favorites);
      
      if (isFavorite) {
        currentFavorites.delete(key);
      } else {
        currentFavorites.add(key);
      }
      
      // Save to localStorage
      localStorage.setItem('solo-compendium-favorites', JSON.stringify(Array.from(currentFavorites)));
      
      return currentFavorites;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
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
