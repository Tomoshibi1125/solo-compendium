import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CampaignCharacterShare {
  id: string;
  campaign_id: string;
  character_id: string;
  shared_by: string;
  is_visible: boolean;
  created_at: string;
  characters?: {
    id: string;
    name: string;
    level: number;
    job: string;
  };
}

// Fetch shared characters in campaign
export const useCampaignSharedCharacters = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'shared-characters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_character_shares')
        .select(`
          *,
          characters (id, name, level, job)
        `)
        .eq('campaign_id', campaignId)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as CampaignCharacterShare[];
    },
    enabled: !!campaignId,
  });
};

// Share character mutation
export const useShareCharacter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ campaignId, characterId }: { campaignId: string; characterId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('campaign_character_shares')
        .insert({
          campaign_id: campaignId,
          character_id: characterId,
          shared_by: user.id,
          is_visible: true,
        })
        .select()
        .single();

      if (error) {
        // If already shared, update visibility
        if (error.code === '23505') {
          const { data: updated, error: updateError } = await supabase
            .from('campaign_character_shares')
            .update({ is_visible: true })
            .eq('campaign_id', campaignId)
            .eq('character_id', characterId)
            .select()
            .single();
          
          if (updateError) throw updateError;
          return updated as CampaignCharacterShare;
        }
        throw error;
      }
      return data as CampaignCharacterShare;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'shared-characters'] });
      toast({
        title: 'Character shared',
        description: 'Your character is now visible to campaign members.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to share character',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Unshare character mutation
export const useUnshareCharacter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ campaignId, characterId }: { campaignId: string; characterId: string }) => {
      const { error } = await supabase
        .from('campaign_character_shares')
        .update({ is_visible: false })
        .eq('campaign_id', campaignId)
        .eq('character_id', characterId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'shared-characters'] });
      toast({
        title: 'Character unshared',
        description: 'Your character is no longer visible to campaign members.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to unshare character',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

