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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from('campaigns' as any)
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from('campaign_members' as any)
        .select(`
          *,
          campaigns (*)
        `)
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return ((data || []) as Array<{ campaigns: Campaign; role: string }>).map((member) => ({
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from('campaigns' as any)
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      return (data || null) as Campaign;
    },
    enabled: !!campaignId,
  });
};

// Fetch campaign by share code
export const useCampaignByShareCode = (shareCode: string) => {
  return useQuery({
    queryKey: ['campaigns', 'share-code', shareCode],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from('campaigns' as any)
        .select('*')
        .eq('share_code', shareCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return (data || null) as Campaign;
    },
    enabled: !!shareCode && shareCode.length === 6,
  });
};

// Fetch campaign members
export const useCampaignMembers = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'members'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase
        .from('campaign_members' as any)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await supabase.rpc('create_campaign_with_code' as any, {
        p_name: name,
        p_description: description || null,
        p_dm_id: user.id,
      });

      if (error) {
        // Error is handled by React Query's error state
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
        .from('campaign_members' as any)
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          character_id: characterId || null,
          role: 'player',
        } as any);

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('campaign_members' as any)
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

// Check if current user is the DM of a campaign
export const useIsCampaignDM = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'is-dm'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: campaign, error } = await supabase
        .from('campaigns' as any)
        .select('dm_id')
        .eq('id', campaignId)
        .single();

      if (error || !campaign) return false;
      return (campaign as { dm_id: string }).dm_id === user.id;
    },
    enabled: !!campaignId,
  });
};

// Check if current user has DM access (is DM or co-DM)
export const useHasDMAccess = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'has-dm-access'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if user is the DM
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns' as any)
        .select('dm_id')
        .eq('id', campaignId)
        .single();

      if (!campaignError && campaign && (campaign as { dm_id: string }).dm_id === user.id) {
        return true;
      }

      // Check if user is a co-DM
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: member, error: memberError } = await supabase
        .from('campaign_members' as any)
        .select('role')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id)
        .single();

      if (!memberError && member && (member as { role: string }).role === 'co-dm') {
        return true;
      }

      return false;
    },
    enabled: !!campaignId,
  });
};

// Get current user's role in a campaign
export const useCampaignRole = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'role'],
    queryFn: async (): Promise<'dm' | 'co-dm' | 'player' | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Check if user is the DM
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns' as any)
        .select('dm_id')
        .eq('id', campaignId)
        .single();

      if (!campaignError && campaign && (campaign as { dm_id: string }).dm_id === user.id) {
        return 'dm';
      }

      // Check member role
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: member, error: memberError } = await supabase
        .from('campaign_members' as any)
        .select('role')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id)
        .single();

      if (!memberError && member) {
        return (member as { role: string }).role === 'co-dm' ? 'co-dm' : 'player';
      }

      return null;
    },
    enabled: !!campaignId,
  });
};

