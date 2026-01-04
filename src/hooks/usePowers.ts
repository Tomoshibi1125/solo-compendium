import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Power = Database['public']['Tables']['character_powers']['Row'];
type PowerInsert = Database['public']['Tables']['character_powers']['Insert'];
type PowerUpdate = Database['public']['Tables']['character_powers']['Update'];

export const usePowers = (characterId: string) => {
  const queryClient = useQueryClient();

  const { data: powers = [], isLoading } = useQuery({
    queryKey: ['powers', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_powers')
        .select('*')
        .eq('character_id', characterId)
        .order('power_level', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Power[];
    },
  });

  const addPower = useMutation({
    mutationFn: async (power: PowerInsert) => {
      const { data, error } = await supabase
        .from('character_powers')
        .insert({ ...power, character_id: characterId });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['powers', characterId]);
    },
  });

  const updatePower = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PowerUpdate }) => {
      const { data, error } = await supabase
        .from('character_powers')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['powers', characterId]);
    },
  });

  const removePower = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('character_powers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['powers', characterId]);
    },
  });

  const preparedCount = powers.filter(p => p.is_prepared).length;
  const concentrationPower = powers.find(p => p.concentration && p.is_prepared);

  return {
    powers,
    isLoading,
    addPower: addPower.mutateAsync,
    updatePower: updatePower.mutateAsync,
    removePower: removePower.mutateAsync,
    preparedCount,
    concentrationPower,
  };
};


