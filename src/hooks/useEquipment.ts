import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Equipment = Database['public']['Tables']['character_equipment']['Row'];
type EquipmentInsert = Database['public']['Tables']['character_equipment']['Insert'];
type EquipmentUpdate = Database['public']['Tables']['character_equipment']['Update'];

export const useEquipment = (characterId: string) => {
  const queryClient = useQueryClient();

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_equipment')
        .select('*')
        .eq('character_id', characterId)
        .order('item_type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Equipment[];
    },
  });

  const addEquipment = useMutation({
    mutationFn: async (item: EquipmentInsert) => {
      const { data, error } = await supabase
        .from('character_equipment')
        .insert({ ...item, character_id: characterId });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['equipment', characterId]);
    },
  });

  const updateEquipment = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EquipmentUpdate }) => {
      const { data, error } = await supabase
        .from('character_equipment')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['equipment', characterId]);
      queryClient.invalidateQueries(['character', characterId]);
    },
  });

  const removeEquipment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('character_equipment')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['equipment', characterId]);
      queryClient.invalidateQueries(['character', characterId]);
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
    attunedCount,
    canAttune,
  };
};


