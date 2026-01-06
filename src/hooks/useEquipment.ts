import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';

type Equipment = Database['public']['Tables']['character_equipment']['Row'];
type EquipmentInsert = Database['public']['Tables']['character_equipment']['Insert'];
type EquipmentUpdate = Database['public']['Tables']['character_equipment']['Update'];

export const useEquipment = (characterId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_equipment')
        .select('*')
        .eq('character_id', characterId)
        .order('display_order', { ascending: true })
        .order('item_type', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        logErrorWithContext(error, 'useEquipment');
        throw error;
      }
      return data as Equipment[];
    },
    enabled: !!characterId,
  });

  const addEquipment = useMutation({
    mutationFn: async (item: EquipmentInsert) => {
      const { data, error } = await supabase
        .from('character_equipment')
        .insert({ ...item, character_id: characterId });
      if (error) {
        logErrorWithContext(error, 'useEquipment.addEquipment');
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useEquipment.addEquipment');
      toast({
        title: 'Failed to add equipment',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const updateEquipment = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EquipmentUpdate }) => {
      const { data, error } = await supabase
        .from('character_equipment')
        .update(updates)
        .eq('id', id);
      if (error) {
        logErrorWithContext(error, 'useEquipment.updateEquipment');
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', characterId] });
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useEquipment.updateEquipment');
      toast({
        title: 'Failed to update equipment',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const removeEquipment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('character_equipment')
        .delete()
        .eq('id', id);
      if (error) {
        logErrorWithContext(error, 'useEquipment.removeEquipment');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', characterId] });
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useEquipment.removeEquipment');
      toast({
        title: 'Failed to remove equipment',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const reorderEquipment = useMutation({
    mutationFn: async (newOrder: { id: string; display_order: number }[]) => {
      // Batch update all items with their new order
      const updates = newOrder.map(({ id, display_order }) =>
        supabase
          .from('character_equipment')
          .update({ display_order })
          .eq('id', id)
      );
      
      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        const error = errors[0];
        logErrorWithContext(error, 'useEquipment.reorderEquipment');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useEquipment.reorderEquipment');
      toast({
        title: 'Failed to reorder equipment',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  // Check attunement limit (max 3)
  const attunedCount = equipment.filter(e => e.is_attuned).length;
  const canAttune = attunedCount < 3;

  return {
    equipment,
    isLoading,
    addEquipment: addEquipment.mutateAsync,
    updateEquipment: updateEquipment.mutateAsync,
    removeEquipment: removeEquipment.mutateAsync,
    reorderEquipment: reorderEquipment.mutateAsync,
    attunedCount,
    canAttune,
  };
};
