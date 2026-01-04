import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  dm_id: string;
  share_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  settings: Record<string, unknown>;
}

export interface CampaignMember {
  id: string;
  campaign_id: string;
  user_id: string;
  character_id: string | null;
  role: 'player' | 'co-dm';
  joined_at: string;
}

// Fetch campaigns where user is DM
export const useMyCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns', 'my'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('dm_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Campaign[];
    },
  });
};

// Fetch campaigns where user is a member
export const useJoinedCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns', 'joined'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('campaign_members')
        .select(`
          *,
          campaigns (*)
        `)
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((member: { campaigns: Campaign; role: string }) => ({
        ...member.campaigns,
        member_role: member.role,
      })) as (Campaign & { member_role: string })[];
    },
  });
};

// Fetch single campaign by ID
export const useCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      return data as Campaign;
    },
    enabled: !!campaignId,
  });
};

// Fetch campaign by share code
export const useCampaignByShareCode = (shareCode: string) => {
  return useQuery({
    queryKey: ['campaigns', 'share-code', shareCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('share_code', shareCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as Campaign;
    },
    enabled: !!shareCode && shareCode.length === 6,
  });
};

// Fetch campaign members
export const useCampaignMembers = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_members')
        .select(`
          *,
          characters (id, name, level, job)
        `)
        .eq('campaign_id', campaignId)
        .order('joined_at', { ascending: true });

      if (error) throw error;
      return (data || []) as (CampaignMember & { characters: { id: string; name: string; level: number; job: string } | null })[];
    },
    enabled: !!campaignId,
  });
};

// Create campaign mutation
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Call the database function to create campaign with share code
      const { data, error } = await supabase.rpc('create_campaign_with_code', {
        p_name: name,
        p_description: description || null,
        p_dm_id: user.id,
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }
      return data as string; // Returns campaign ID
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: 'Campaign Created',
        description: 'Your campaign has been created with a share code.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create campaign',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Join campaign mutation
export const useJoinCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ campaignId, characterId }: { campaignId: string; characterId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('campaign_members')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          character_id: characterId || null,
          role: 'player',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: 'Joined Campaign',
        description: 'You have successfully joined the campaign.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to join campaign',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Leave campaign mutation
export const useLeaveCampaign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('campaign_members')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: 'Left Campaign',
        description: 'You have left the campaign.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to leave campaign',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

