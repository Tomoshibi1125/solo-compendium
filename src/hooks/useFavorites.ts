import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favorites = new Set<string>(), isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return new Set<string>();

      const { data } = await supabase
        .from('user_favorites')
        .select('entry_type, entry_id');

      if (!data) return new Set<string>();
      
      return new Set(data.map(f => `${f.entry_type}:${f.entry_id}`));
    },
    staleTime: 30000,
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ entryType, entryId, isFavorite }: { entryType: string; entryId: string; isFavorite: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (isFavorite) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('entry_type', entryType)
          .eq('entry_id', entryId);
      } else {
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            entry_type: entryType,
            entry_id: entryId,
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const isFavorite = (entryType: string, entryId: string): boolean => {
    return favorites.has(`${entryType}:${entryId}`);
  };

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

