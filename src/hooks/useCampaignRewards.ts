import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import type { Database, Json } from '@/integrations/supabase/types';

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== 'false';

type LootDrop = Database['public']['Tables']['campaign_loot_drops']['Row'];
type RelicInstance = Database['public']['Tables']['campaign_relic_instances']['Row'];

type LootItem = {
  name: string;
  quantity?: number;
  value_credits?: number;
  value?: number;
};

export const useCampaignLootDrops = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'loot'],
    queryFn: async (): Promise<LootDrop[]> => {
      if (!isSupabaseConfigured) return [];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (guestEnabled) return [];
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { data, error } = await supabase
        .from('campaign_loot_drops')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as LootDrop[];
    },
    enabled: !!campaignId,
  });
};

export const useCampaignRelicInstances = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'relic-instances'],
    queryFn: async (): Promise<RelicInstance[]> => {
      if (!isSupabaseConfigured) return [];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (guestEnabled) return [];
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { data, error } = await supabase
        .from('campaign_relic_instances')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as RelicInstance[];
    },
    enabled: !!campaignId,
  });
};

export const useAssignCampaignLoot = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      campaignId,
      items,
      encounterId,
      sessionId,
      assignedToMemberId,
    }: {
      campaignId: string;
      items: LootItem[];
      encounterId?: string | null;
      sessionId?: string | null;
      assignedToMemberId?: string | null;
    }) => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { data, error } = await supabase.rpc('assign_campaign_loot', {
        p_campaign_id: campaignId,
        p_items: items as unknown as Json,
        p_encounter_id: encounterId ?? undefined,
        p_session_id: sessionId ?? undefined,
        p_assigned_to_member_id: assignedToMemberId ?? undefined,
      });

      if (error) throw error;
      return data as string;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'loot'] });
      toast({
        title: 'Loot assigned',
        description: 'Loot drop recorded in campaign ledger.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to assign loot',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useAssignCampaignRelic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      campaignId,
      relicId,
      name,
      rarity,
      properties,
      valueCredits,
      boundToMemberId,
      tradeable = true,
    }: {
      campaignId: string;
      relicId?: string | null;
      name: string;
      rarity?: string | null;
      properties?: Json;
      valueCredits?: number | null;
      boundToMemberId?: string | null;
      tradeable?: boolean;
    }) => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { data, error } = await supabase.rpc('assign_campaign_relic', {
        p_campaign_id: campaignId,
        p_relic_id: relicId ?? undefined,
        p_name: name,
        p_rarity: rarity ?? undefined,
        p_properties: properties ?? {},
        p_value_credits: valueCredits ?? undefined,
        p_bound_to_member_id: boundToMemberId ?? undefined,
        p_tradeable: tradeable,
      });

      if (error) throw error;
      return data as string;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'relic-instances'] });
      toast({
        title: 'Relic assigned',
        description: 'Relic delivered to the chosen Ascendant.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to assign relic',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
