import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type RollRecord = Database['public']['Tables']['roll_history']['Row'];
type RollRecordInsert = Database['public']['Tables']['roll_history']['Insert'];
type RollRecordInsertClient = Omit<RollRecordInsert, 'id' | 'user_id' | 'created_at'>;

export const useRollHistory = (characterId?: string, limit = 50) => {
  return useQuery({
    queryKey: ['roll-history', characterId, limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return []; // Return empty array if not authenticated

      let query = supabase
        .from('roll_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (characterId) {
        query = query.eq('character_id', characterId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    retry: false, // Don't retry if not authenticated
  });
};

export const useRecordRoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roll: RollRecordInsertClient) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('roll_history')
        .insert({
          ...roll,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roll-history'] });
    },
  });
};
