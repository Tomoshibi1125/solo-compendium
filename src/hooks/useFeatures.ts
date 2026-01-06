import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';

type Feature = Database['public']['Tables']['character_features']['Row'];
type FeatureInsert = Database['public']['Tables']['character_features']['Insert'];
type FeatureUpdate = Database['public']['Tables']['character_features']['Update'];

export const useFeatures = (characterId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: features = [], isLoading } = useQuery({
    queryKey: ['features', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_features')
        .select('*')
        .eq('character_id', characterId)
        .order('display_order', { ascending: true })
        .order('level_acquired', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        logErrorWithContext(error, 'useFeatures');
        throw error;
      }
      return data as Feature[];
    },
  });

  const updateFeature = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: FeatureUpdate }) => {
      const { data, error } = await supabase
        .from('character_features')
        .update(updates)
        .eq('id', id);
      if (error) {
        logErrorWithContext(error, 'useFeatures.updateFeature');
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useFeatures.updateFeature');
      toast({
        title: 'Failed to update feature',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const reorderFeatures = useMutation({
    mutationFn: async (newOrder: { id: string; display_order: number }[]) => {
      const updates = newOrder.map(({ id, display_order }) =>
        supabase
          .from('character_features')
          .update({ display_order })
          .eq('id', id)
      );
      
      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        const error = errors[0];
        logErrorWithContext(error, 'useFeatures.reorderFeatures');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features', characterId] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useFeatures.reorderFeatures');
      toast({
        title: 'Failed to reorder features',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const activeFeatures = features.filter(f => f.is_active);
  const featuresWithUses = features.filter(f => f.uses_max !== null);

  return {
    features,
    isLoading,
    updateFeature: updateFeature.mutateAsync,
    reorderFeatures: reorderFeatures.mutateAsync,
    activeFeatures,
    featuresWithUses,
  };
};

