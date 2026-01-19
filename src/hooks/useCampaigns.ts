import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import type { Database } from '@/integrations/supabase/types';
import { getLocalUserId, listLocalCharacters } from '@/lib/guestStore';

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
  role: 'hunter' | 'co-system';
  joined_at: string;
}

const CAMPAIGNS_KEY = 'solo-compendium.campaigns.v1';
const MEMBERS_KEY = 'solo-compendium.campaigns.members.v1';

const loadLocalCampaigns = (): Campaign[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(CAMPAIGNS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Campaign[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalCampaigns = (campaigns: Campaign[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
};

const loadLocalMembers = (): CampaignMember[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(MEMBERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CampaignMember[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalMembers = (members: CampaignMember[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
};

const createShareCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
};

const isLocalMode = () => !isSupabaseConfigured || import.meta.env.VITE_E2E === 'true';

// Fetch campaigns where user is System (Gate Master)
export const useMyCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns', 'my'],
    queryFn: async () => {
      if (isLocalMode()) {
        const userId = getLocalUserId();
        return loadLocalCampaigns()
          .filter((campaign) => campaign.dm_id === userId)
          .sort((a, b) => b.created_at.localeCompare(a.created_at));
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return []; // Return empty array if not authenticated (consistent with other hooks)

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('dm_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Campaign[];
    },
    retry: false, // Don't retry if not authenticated
  });
};

// Fetch campaigns where user is a member
export const useJoinedCampaigns = () => {
  return useQuery({
    queryKey: ['campaigns', 'joined'],
    queryFn: async () => {
      if (isLocalMode()) {
        const userId = getLocalUserId();
        const campaigns = loadLocalCampaigns();
        const members = loadLocalMembers();
        return members
          .filter((member) => member.user_id === userId)
          .map((member) => {
            const campaign = campaigns.find((c) => c.id === member.campaign_id);
            if (!campaign) return null;
            return { ...campaign, member_role: member.role };
          })
          .filter(Boolean) as (Campaign & { member_role: string })[];
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return []; // Return empty array if not authenticated

      const { data, error } = await supabase
        .from('campaign_members')
        .select(`
          *,
          campaigns (*)
        `)
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return ((data || []) as Array<{ campaigns: Database['public']['Tables']['campaigns']['Row']; role: string }>).map((member) => ({
        ...member.campaigns,
        member_role: member.role,
      })) as (Campaign & { member_role: string })[];
    },
    retry: false, // Don't retry if not authenticated
  });
};

// Fetch single campaign by ID
export const useCampaign = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId],
    queryFn: async () => {
      if (isLocalMode()) {
        return loadLocalCampaigns().find((campaign) => campaign.id === campaignId) || null;
      }
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      return (data || null) as Campaign;
    },
    enabled: !!campaignId,
  });
};

// Fetch campaign by character membership
export const useCampaignByCharacterId = (characterId: string) => {
  return useQuery({
    queryKey: ['campaigns', 'by-character', characterId],
    queryFn: async () => {
      if (!characterId) return null;
      if (isLocalMode()) {
        const member = loadLocalMembers()
          .filter((entry) => entry.character_id === characterId)
          .sort((a, b) => b.joined_at.localeCompare(a.joined_at))[0];
        if (!member) return null;
        return loadLocalCampaigns().find((campaign) => campaign.id === member.campaign_id) || null;
      }
      const { data, error } = await supabase
        .from('campaign_members')
        .select('campaigns (*)')
        .eq('character_id', characterId)
        .order('joined_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      const campaign = data?.[0]?.campaigns;
      return (campaign || null) as Campaign | null;
    },
    enabled: !!characterId,
  });
};

// Fetch campaign by share code
export const useCampaignByShareCode = (shareCode: string) => {
  return useQuery({
    queryKey: ['campaigns', 'share-code', shareCode],
    queryFn: async () => {
      if (isLocalMode()) {
        return loadLocalCampaigns().find((campaign) => campaign.share_code === shareCode.toUpperCase()) || null;
      }
      const { data, error } = await supabase.rpc('get_campaign_by_share_code', {
        p_share_code: shareCode.toUpperCase(),
      });

      if (error) throw error;
      const campaign = Array.isArray(data) ? data[0] : data;
      return (campaign || null) as Campaign;
    },
    enabled: !!shareCode && shareCode.length === 6,
  });
};

// Fetch campaign members
export const useCampaignMembers = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'members'],
    queryFn: async () => {
      if (isLocalMode()) {
        const localCharacters = listLocalCharacters();
        return loadLocalMembers()
          .filter((member) => member.campaign_id === campaignId)
          .map((member) => ({
            ...member,
            characters: member.character_id
              ? (() => {
                  const character = localCharacters.find((entry) => entry.id === member.character_id);
                  return character
                    ? {
                        id: character.id,
                        name: character.name,
                        level: character.level ?? 1,
                        job: character.job ?? 'Unknown',
                      }
                    : null;
                })()
              : null,
          }));
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
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
      if (isLocalMode()) {
        const now = new Date().toISOString();
        const userId = getLocalUserId();
        const campaign: Campaign = {
          id: crypto.randomUUID(),
          name,
          description: description || null,
          dm_id: userId,
          share_code: createShareCode(),
          is_active: true,
          created_at: now,
          updated_at: now,
          settings: { leveling_mode: 'milestone' },
        };
        const campaigns = [campaign, ...loadLocalCampaigns()];
        saveLocalCampaigns(campaigns);
        const members = loadLocalMembers();
        members.push({
          id: crypto.randomUUID(),
          campaign_id: campaign.id,
          user_id: userId,
          character_id: null,
          role: 'co-system',
          joined_at: now,
        });
        saveLocalMembers(members);
        return campaign.id;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      // Call the database function to create campaign with share code
      const { data, error } = await supabase.rpc('create_campaign_with_code', {
        p_name: name,
        p_description: description || '',
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
      if (isLocalMode()) {
        const userId = getLocalUserId();
        const members = loadLocalMembers();
        const alreadyMember = members.some(
          (member) => member.campaign_id === campaignId && member.user_id === userId
        );
        if (!alreadyMember) {
          members.push({
            id: crypto.randomUUID(),
            campaign_id: campaignId,
            user_id: userId,
            character_id: characterId || null,
            role: 'hunter',
            joined_at: new Date().toISOString(),
          });
          saveLocalMembers(members);
        }
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { error } = await supabase
        .from('campaign_members')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          character_id: characterId || null,
          role: 'hunter',
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
      if (isLocalMode()) {
        const userId = getLocalUserId();
        const members = loadLocalMembers().filter(
          (member) => !(member.campaign_id === campaignId && member.user_id === userId)
        );
        saveLocalMembers(members);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

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

// Check if current user is the System (Gate Master) of a campaign
export const useIsCampaignDM = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'is-system'],
    queryFn: async () => {
      if (isLocalMode()) {
        const userId = getLocalUserId();
        return loadLocalCampaigns().some((campaign) => campaign.id === campaignId && campaign.dm_id === userId);
      }
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) return false;
      const user = session.user;

      const { data: campaign, error } = await supabase
        .from('campaigns')
        .select('dm_id')
        .eq('id', campaignId)
        .single();

      if (error || !campaign) return false;
      return (campaign as Database['public']['Tables']['campaigns']['Row']).dm_id === user.id;
    },
    enabled: !!campaignId,
  });
};

// Check if current user has System access (is System/Gate Master or co-System)
export const useHasDMAccess = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'has-system-access'],
    queryFn: async () => {
      if (isLocalMode()) {
        const userId = getLocalUserId();
        const campaign = loadLocalCampaigns().find((entry) => entry.id === campaignId);
        if (campaign && campaign.dm_id === userId) return true;
        const member = loadLocalMembers().find(
          (entry) => entry.campaign_id === campaignId && entry.user_id === userId
        );
        return member?.role === 'co-system';
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Check if user is the System (Gate Master)
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('dm_id')
        .eq('id', campaignId)
        .single();

      if (!campaignError && campaign && (campaign as Database['public']['Tables']['campaigns']['Row']).dm_id === user.id) {
        return true;
      }

      // Check if user is a co-System
      const { data: member, error: memberError } = await supabase
        .from('campaign_members')
        .select('role')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id)
        .single();

      if (!memberError && member && (member as Database['public']['Tables']['campaign_members']['Row']).role === 'co-system') {
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
    queryFn: async (): Promise<'system' | 'co-system' | 'hunter' | null> => {
      if (isLocalMode()) {
        const userId = getLocalUserId();
        const campaign = loadLocalCampaigns().find((entry) => entry.id === campaignId);
        if (campaign && campaign.dm_id === userId) return 'system';
        const member = loadLocalMembers().find(
          (entry) => entry.campaign_id === campaignId && entry.user_id === userId
        );
        if (member?.role === 'co-system') return 'co-system';
        if (member) return 'hunter';
        return null;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Check if user is the System (Gate Master)
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('dm_id')
        .eq('id', campaignId)
        .single();

      if (!campaignError && campaign && (campaign as Database['public']['Tables']['campaigns']['Row']).dm_id === user.id) {
        return 'system';
      }

      // Check member role
      const { data: member, error: memberError } = await supabase
        .from('campaign_members')
        .select('role')
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id)
        .single();

      if (!memberError && member) {
        return ((member as Database['public']['Tables']['campaign_members']['Row']).role === 'co-system' ? 'co-system' : 'hunter');
      }

      return null;
    },
    enabled: !!campaignId,
  });
};

// Check if user is a DM (System/Gate Master) - now uses profiles table
export const useIsDM = () => {
  return useQuery({
    queryKey: ['user', 'is-dm'],
    queryFn: async (): Promise<boolean> => {
      if (isLocalMode()) {
        const userId = getLocalUserId();
        return loadLocalCampaigns().some((campaign) => campaign.dm_id === userId);
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || !data) return false;
      const role = (data as Database['public']['Tables']['profiles']['Row']).role;
      const normalizedRole = role === 'admin' ? 'dm' : role;
      return normalizedRole === 'dm';
    },
    retry: false,
  });
};
