import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RollRecord {
  id: string;
  user_id: string;
  character_id: string | null;
  campaign_id: string | null;
  roll_type: string;
  dice_formula: string;
  result: number;
  rolls: number[];
  modifiers: Record<string, unknown>;
  context: string | null;
  created_at: string;
}

export const useRollHistory = (characterId?: string, limit = 50) => {
  return useQuery({
    queryKey: ['roll-history', characterId, limit],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('roll_history' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (characterId) {
        query = query.eq('character_id', characterId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as RollRecord[];
    },
  });
};

export const useRecordRoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roll: Omit<RollRecord, 'id' | 'user_id' | 'created_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('roll_history' as any)
        .insert({
          ...roll,
          user_id: user.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as RollRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roll-history'] });
    },
  });
};
