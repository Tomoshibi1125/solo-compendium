import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import { getLocalUserId } from '@/lib/guestStore';

export interface CampaignCharacterShare {
  id: string;
  campaign_id: string;
  character_id: string;
  shared_by: string;
  permissions: 'view' | 'edit';
  shared_at: string;
  characters?: {
    id: string;
    name: string;
    level: number;
    job: string;
  };
}

const getSharesKey = (campaignId: string) => `solo-compendium.campaign.${campaignId}.shares`;

const loadLocalShares = (campaignId: string): CampaignCharacterShare[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(getSharesKey(campaignId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CampaignCharacterShare[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalShares = (campaignId: string, shares: CampaignCharacterShare[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getSharesKey(campaignId), JSON.stringify(shares));
};

// Fetch shared characters in campaign
export const useCampaignSharedCharacters = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'shared-characters'],
    queryFn: async (): Promise<CampaignCharacterShare[]> => {
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        return loadLocalShares(campaignId);
      }

      const { data, error } = await supabase
        .from('campaign_character_shares')
        .select(`
          *,
          characters:character_id (id, name, level, job)
        `)
        .eq('campaign_id', campaignId);

      if (error) throw error;
      return (data || []) as unknown as CampaignCharacterShare[];
    },
    enabled: !!campaignId,
  });
};

// Share character mutation
export const useShareCharacter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      campaignId, 
      characterId,
      permissions = 'view'
    }: { 
      campaignId: string; 
      characterId: string;
      permissions?: 'view' | 'edit';
    }) => {
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        const now = new Date().toISOString();
        const next: CampaignCharacterShare = {
          id: crypto.randomUUID(),
          campaign_id: campaignId,
          character_id: characterId,
          shared_by: getLocalUserId(),
          permissions,
          shared_at: now,
        };
        const updated = [...loadLocalShares(campaignId), next];
        saveLocalShares(campaignId, updated);
        return next;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { data, error } = await supabase
        .from('campaign_character_shares')
        .insert({
          campaign_id: campaignId,
          character_id: characterId,
          shared_by: user.id,
          permissions,
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as CampaignCharacterShare;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'shared-characters'] });
      toast({
        title: 'Hunter shared',
        description: 'Your hunter is now visible to campaign members.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to share hunter',
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
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        const existing = loadLocalShares(campaignId);
        const next = existing.filter((share) => share.character_id !== characterId);
        saveLocalShares(campaignId, next);
        return;
      }

      const { error } = await supabase
        .from('campaign_character_shares')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('character_id', characterId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'shared-characters'] });
      toast({
        title: 'Hunter unshared',
        description: 'Your hunter is no longer visible to campaign members.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to unshare hunter',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Update share permissions
export const useUpdateSharePermissions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      shareId, 
      campaignId,
      permissions 
    }: { 
      shareId: string; 
      campaignId: string;
      permissions: 'view' | 'edit';
    }) => {
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        const existing = loadLocalShares(campaignId);
        const next = existing.map((share) =>
          share.id === shareId ? { ...share, permissions } : share
        );
        saveLocalShares(campaignId, next);
        const updatedShare = next.find((share) => share.id === shareId);
        if (!updatedShare) throw new AppError('Share not found', 'NOT_FOUND');
        return updatedShare;
      }

      const { data, error } = await supabase
        .from('campaign_character_shares')
        .update({ permissions })
        .eq('id', shareId)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as CampaignCharacterShare;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'shared-characters'] });
      toast({
        title: 'Permissions updated',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update permissions',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
