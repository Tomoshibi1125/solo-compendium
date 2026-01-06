import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';

type Power = Database['public']['Tables']['character_powers']['Row'];
type PowerInsert = Database['public']['Tables']['character_powers']['Insert'];
type PowerUpdate = Database['public']['Tables']['character_powers']['Update'];

export const usePowers = (characterId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: powers = [], isLoading } = useQuery({
    queryKey: ['powers', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_powers')
        .select('*')
        .eq('character_id', characterId)
        .order('display_order', { ascending: true })
        .order('power_level', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        logErrorWithContext(error, 'usePowers');
        throw error;
      }
      return data as Power[];
    },
    enabled: !!characterId,
  });

  const addPower = useMutation({
    mutationFn: async (power: PowerInsert) => {
      const { data, error } = await supabase
        .from('character_powers')
        .insert({ ...power, character_id: characterId });
      if (error) {
        logErrorWithContext(error, 'usePowers.addPower');
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['powers', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'usePowers.addPower');
      toast({
        title: 'Failed to add power',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const updatePower = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PowerUpdate }) => {
      const { data, error } = await supabase
        .from('character_powers')
        .update(updates)
        .eq('id', id);
      if (error) {
        logErrorWithContext(error, 'usePowers.updatePower');
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['powers', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'usePowers.updatePower');
      toast({
        title: 'Failed to update power',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const removePower = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('character_powers')
        .delete()
        .eq('id', id);
      if (error) {
        logErrorWithContext(error, 'usePowers.removePower');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['powers', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'usePowers.removePower');
      toast({
        title: 'Failed to remove power',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const reorderPowers = useMutation({
    mutationFn: async (newOrder: { id: string; display_order: number }[]) => {
      const updates = newOrder.map(({ id, display_order }) =>
        supabase
          .from('character_powers')
          .update({ display_order })
          .eq('id', id)
      );
      
      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        const error = errors[0];
        logErrorWithContext(error, 'usePowers.reorderPowers');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['powers', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'usePowers.reorderPowers');
      toast({
        title: 'Failed to reorder powers',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
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
    reorderPowers: reorderPowers.mutateAsync,
    preparedCount,
    concentrationPower,
  };
};


