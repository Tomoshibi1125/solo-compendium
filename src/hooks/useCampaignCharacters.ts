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
// Note: This hook requires the campaign_character_shares table to exist in Supabase
// For now, we return an empty array until the table is created
export const useCampaignSharedCharacters = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'shared-characters'],
    queryFn: async (): Promise<CampaignCharacterShare[]> => {
      // Campaign character sharing feature not yet implemented in database
      // Return empty array until migration is applied
      return [];
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

      // Campaign character sharing feature not yet implemented
      throw new Error('Campaign character sharing is not yet available');
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
      // Campaign character sharing feature not yet implemented
      throw new Error('Campaign character sharing is not yet available');
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
