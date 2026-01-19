import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { AppError } from '@/lib/appError';
import { addLocalRollHistory, isLocalCharacterId, listLocalRollHistory } from '@/lib/guestStore';

export type RollRecord = Database['public']['Tables']['roll_history']['Row'];
type RollRecordInsert = Database['public']['Tables']['roll_history']['Insert'];
type RollRecordInsertClient = Omit<RollRecordInsert, 'id' | 'user_id' | 'created_at'>;

export const useRollHistory = (characterId?: string, limit = 50) => {
  return useQuery({
    queryKey: ['roll-history', characterId, limit],
    queryFn: async () => {
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true' || (characterId && isLocalCharacterId(characterId))) {
        return listLocalRollHistory(characterId).slice(0, limit);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return listLocalRollHistory(characterId).slice(0, limit);
      }

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
      const normalizedRoll = {
        ...roll,
        campaign_id: roll.campaign_id ?? null,
        character_id: roll.character_id ?? null,
        context: roll.context ?? null,
        modifiers: roll.modifiers ?? null,
      };
      const isLocal = roll.character_id ? isLocalCharacterId(roll.character_id) : false;
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true' || isLocal) {
        return addLocalRollHistory({
          ...normalizedRoll,
          user_id: 'guest',
          created_at: new Date().toISOString(),
        });
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return addLocalRollHistory({
          ...normalizedRoll,
          user_id: 'guest',
          created_at: new Date().toISOString(),
        });
      }

      const { data, error } = await supabase
        .from('roll_history')
        .insert({
          ...normalizedRoll,
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
