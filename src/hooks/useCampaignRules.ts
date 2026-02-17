import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import type { Database, Json } from '@/integrations/supabase/types';

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== 'false';

type CampaignRulesRow = Database['public']['Tables']['campaign_rules']['Row'];
type CampaignRuleEvent = Database['public']['Tables']['campaign_rule_events']['Row'];

type CampaignRuleSettings = {
  economy_enabled: boolean;
  economy_max_loot_value: number | null;
  economy_max_relic_value: number | null;
  protocol_enforcement_enabled: boolean;
  failure_injection_enabled: boolean;
  failure_injection_rate: number;
  failure_injection_note?: string | null;
};

const DEFAULT_RULES: CampaignRuleSettings = {
  economy_enabled: true,
  economy_max_loot_value: null,
  economy_max_relic_value: null,
  protocol_enforcement_enabled: true,
  failure_injection_enabled: false,
  failure_injection_rate: 0,
  failure_injection_note: null,
};

const toNumberOrNull = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeRules = (rules: Json | null | undefined): CampaignRuleSettings => {
  if (!rules || typeof rules !== 'object' || Array.isArray(rules)) {
    return { ...DEFAULT_RULES };
  }
  const raw = rules as Record<string, unknown>;
  return {
    economy_enabled: raw.economy_enabled !== false,
    economy_max_loot_value: toNumberOrNull(raw.economy_max_loot_value),
    economy_max_relic_value: toNumberOrNull(raw.economy_max_relic_value),
    protocol_enforcement_enabled: raw.protocol_enforcement_enabled !== false,
    failure_injection_enabled: raw.failure_injection_enabled === true,
    failure_injection_rate: Math.min(Math.max(Number(raw.failure_injection_rate ?? 0), 0), 100),
    failure_injection_note: (raw.failure_injection_note as string | null | undefined) ?? null,
  };
};

export type { CampaignRuleSettings, CampaignRuleEvent };
export { DEFAULT_RULES, normalizeRules };

export const useCampaignRules = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'rules'],
    queryFn: async (): Promise<CampaignRulesRow & { rules: CampaignRuleSettings }> => {
      if (!isSupabaseConfigured) {
        return {
          campaign_id: campaignId,
          created_at: new Date().toISOString(),
          created_by: null,
          updated_at: new Date().toISOString(),
          updated_by: null,
          rules: { ...DEFAULT_RULES },
        };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (guestEnabled) {
          return {
            campaign_id: campaignId,
            created_at: new Date().toISOString(),
            created_by: null,
            updated_at: new Date().toISOString(),
            updated_by: null,
            rules: { ...DEFAULT_RULES },
          };
        }
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { data, error } = await supabase
        .from('campaign_rules')
        .select('*')
        .eq('campaign_id', campaignId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return {
          campaign_id: campaignId,
          created_at: new Date().toISOString(),
          created_by: null,
          updated_at: new Date().toISOString(),
          updated_by: null,
          rules: { ...DEFAULT_RULES },
        };
      }

      return {
        ...data,
        rules: normalizeRules(data.rules),
      } as CampaignRulesRow & { rules: CampaignRuleSettings };
    },
    enabled: !!campaignId,
  });
};

export const useCampaignRuleEvents = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'rule-events'],
    queryFn: async (): Promise<CampaignRuleEvent[]> => {
      if (!isSupabaseConfigured) return [];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (guestEnabled) return [];
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { data, error } = await supabase
        .from('campaign_rule_events')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []) as CampaignRuleEvent[];
    },
    enabled: !!campaignId,
  });
};

export const useCreateCampaignRuleEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      campaignId,
      kind,
      payload,
    }: {
      campaignId: string;
      kind: string;
      payload?: Json;
    }) => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { data, error } = await supabase
        .from('campaign_rule_events')
        .insert({
          campaign_id: campaignId,
          created_by: user.id,
          kind,
          payload: payload ?? {},
        })
        .select()
        .single();

      if (error) throw error;
      return data as CampaignRuleEvent;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'rule-events'] });
      toast({ title: 'Rule event logged' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to log rule event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateCampaignRules = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      campaignId,
      rules,
    }: {
      campaignId: string;
      rules: CampaignRuleSettings;
    }) => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const payload = {
        ...rules,
        economy_max_loot_value: toNumberOrNull(rules.economy_max_loot_value),
        economy_max_relic_value: toNumberOrNull(rules.economy_max_relic_value),
        failure_injection_rate: Math.min(Math.max(Number(rules.failure_injection_rate || 0), 0), 100),
      } satisfies CampaignRuleSettings;

      const { data, error } = await supabase
        .from('campaign_rules')
        .upsert({
          campaign_id: campaignId,
          rules: payload,
          updated_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.from('campaign_rule_events').insert({
        campaign_id: campaignId,
        created_by: user.id,
        kind: 'rules_updated',
        payload,
      });

      return data as CampaignRulesRow;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'rules'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'rule-events'] });
      toast({
        title: 'Rules updated',
        description: 'Campaign protocol settings saved.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update rules',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
