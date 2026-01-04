import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Feature = Database['public']['Tables']['character_features']['Row'];
type FeatureInsert = Database['public']['Tables']['character_features']['Insert'];
type FeatureUpdate = Database['public']['Tables']['character_features']['Update'];

export const useFeatures = (characterId: string) => {
  const queryClient = useQueryClient();

  const { data: features = [], isLoading } = useQuery({
    queryKey: ['features', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_features')
        .select('*')
        .eq('character_id', characterId)
        .order('level_acquired', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Feature[];
    },
  });

  const updateFeature = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: FeatureUpdate }) => {
      const { data, error } = await supabase
        .from('character_features')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['features', characterId]);
    },
  });

  const activeFeatures = features.filter(f => f.is_active);
  const featuresWithUses = features.filter(f => f.uses_max !== null);

  return {
    features,
    isLoading,
    updateFeature: updateFeature.mutateAsync,
    activeFeatures,
    featuresWithUses,
  };
};

