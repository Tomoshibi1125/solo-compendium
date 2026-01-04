import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserFavorite {
  id: string;
  user_id: string;
  entry_type: string;
  entry_id: string;
  created_at: string;
}

export const useUserFavorites = (entryType?: string) => {
  return useQuery({
    queryKey: ['user-favorites', entryType],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return []; // Return empty array if not authenticated

      let query = supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('user_favorites' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (entryType) {
        query = query.eq('entry_type', entryType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as UserFavorite[];
    },
    retry: false, // Don't retry if not authenticated
  });
};

export const useIsFavorite = (entryType: string, entryId: string) => {
  return useQuery({
    queryKey: ['user-favorites', 'check', entryType, entryId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('user_favorites' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('entry_type', entryType)
        .eq('entry_id', entryId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!entryType && !!entryId,
    retry: false, // Don't retry if not authenticated
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ entryType, entryId }: { entryType: string; entryId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if already favorited
      const { data: existing } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('user_favorites' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('entry_type', entryType)
        .eq('entry_id', entryId)
        .maybeSingle();

      if (existing) {
        // Remove favorite
        const existingRecord = existing as unknown as { id: string };
        await supabase
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .from('user_favorites' as any)
          .delete()
          .eq('id', existingRecord.id);
        return { favorited: false };
      } else {
        // Add favorite
        await supabase
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .from('user_favorites' as any)
          .insert({
            user_id: user.id,
            entry_type: entryType,
            entry_id: entryId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
        return { favorited: true };
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      queryClient.invalidateQueries({ queryKey: ['user-favorites', 'check', variables.entryType, variables.entryId] });
    },
  });
};
