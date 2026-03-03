import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import { enqueueOfflineSync } from '@/lib/offlineSync';

export type CampaignSessionStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';
export type CampaignSessionLogType = 'session' | 'recap' | 'loot' | 'event' | 'note';

export interface CampaignSessionRecord {
  id: string;
  campaign_id: string;
  title: string;
  description: string | null;
  scheduled_for: string | null;
  status: CampaignSessionStatus;
  location: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignSessionLogRecord {
  id: string;
  campaign_id: string;
  session_id: string | null;
  author_id: string;
  log_type: CampaignSessionLogType;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  is_player_visible: boolean;
  created_at: string;
  updated_at: string;
}

type UpsertSessionInput = {
  campaignId: string;
  sessionId?: string | null;
  title?: string | null;
  description?: string | null;
  scheduledFor?: string | null;
  status?: CampaignSessionStatus | null;
  location?: string | null;
};

type CreateSessionLogInput = {
  campaignId: string;
  sessionId?: string | null;
  logType?: CampaignSessionLogType;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  isPlayerVisible?: boolean;
};

type SupabaseAny = {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null } }>;
  };
  from: (table: string) => any;
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }>;
};

const supabaseAny = supabase as unknown as SupabaseAny;
const KEY = ['campaigns', 'sessions'] as const;
const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== 'false';

const isOfflineError = (error: unknown): boolean => {
  const message = typeof error === 'object' && error && 'message' in error
    ? String((error as { message?: unknown }).message ?? '')
    : '';
  const normalized = message.toLowerCase();
  return (
    (typeof navigator !== 'undefined' && !navigator.onLine) ||
    normalized.includes('failed to fetch') ||
    normalized.includes('network') ||
    normalized.includes('timeout')
  );
};

const ensureAuthenticatedUser = async (): Promise<{ id: string }> => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    throw new AppError('Not authenticated', 'AUTH_REQUIRED');
  }
  return data.user;
};

export const useCampaignSessions = (campaignId: string) => {
  return useQuery({
    queryKey: [...KEY, campaignId],
    queryFn: async (): Promise<CampaignSessionRecord[]> => {
      if (!isSupabaseConfigured || !campaignId) return [];

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        if (guestEnabled) return [];
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { data: rows, error } = await supabaseAny
        .from('campaign_sessions')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('scheduled_for', { ascending: false });

      if (error) throw error;
      return (rows || []) as CampaignSessionRecord[];
    },
    enabled: !!campaignId,
  });
};

export const useCampaignSessionLogs = (
  campaignId: string,
  sessionId?: string | null
) => {
  return useQuery({
    queryKey: [...KEY, campaignId, 'logs', sessionId ?? 'all'],
    queryFn: async (): Promise<CampaignSessionLogRecord[]> => {
      if (!isSupabaseConfigured || !campaignId) return [];

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        if (guestEnabled) return [];
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      let query = supabaseAny
        .from('campaign_session_logs')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }

      const { data: rows, error } = await query;
      if (error) throw error;
      return (rows || []) as CampaignSessionLogRecord[];
    },
    enabled: !!campaignId,
  });
};

export const useUpsertCampaignSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: UpsertSessionInput): Promise<{ queued: boolean; sessionId: string | null }> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }
      await ensureAuthenticatedUser();

      try {
        const { data, error } = await supabaseAny.rpc('upsert_campaign_session', {
          p_campaign_id: input.campaignId,
          p_session_id: input.sessionId ?? null,
          p_title: input.title ?? null,
          p_description: input.description ?? null,
          p_scheduled_for: input.scheduledFor ?? null,
          p_status: input.status ?? null,
          p_location: input.location ?? null,
        });

        if (error) throw error;
        return {
          queued: false,
          sessionId: (data as string) ?? null,
        };
      } catch (error) {
        if (!isOfflineError(error)) {
          throw error;
        }

        enqueueOfflineSync('campaign_session', input.sessionId ? 'update' : 'create', {
          mode: 'session',
          campaign_id: input.campaignId,
          session_id: input.sessionId ?? null,
          title: input.title ?? null,
          description: input.description ?? null,
          scheduled_for: input.scheduledFor ?? null,
          status: input.status ?? null,
          location: input.location ?? null,
        });

        return {
          queued: true,
          sessionId: input.sessionId ?? null,
        };
      }
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: [...KEY, variables.campaignId] });
      toast({
        title: result.queued ? 'Session queued offline' : 'Session saved',
        description: result.queued
          ? 'Session update will sync when connection returns.'
          : 'Campaign session schedule updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to save session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteCampaignSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ campaignId, sessionId }: { campaignId: string; sessionId: string }): Promise<{ queued: boolean }> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }
      await ensureAuthenticatedUser();

      try {
        const { error } = await supabase.from('campaign_sessions').delete().eq('id', sessionId);
        if (error) throw error;
        return { queued: false };
      } catch (error) {
        if (!isOfflineError(error)) {
          throw error;
        }

        enqueueOfflineSync('campaign_session', 'delete', {
          mode: 'session',
          campaign_id: campaignId,
          session_id: sessionId,
        });
        return { queued: true };
      }
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: [...KEY, variables.campaignId] });
      toast({
        title: result.queued ? 'Delete queued offline' : 'Session deleted',
        description: result.queued
          ? 'Session deletion will sync when connection returns.'
          : 'Campaign session removed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useAddCampaignSessionLog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateSessionLogInput): Promise<{ queued: boolean; logId: string | null }> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }
      await ensureAuthenticatedUser();

      try {
        const { data, error } = await supabaseAny.rpc('add_campaign_session_log', {
          p_campaign_id: input.campaignId,
          p_session_id: input.sessionId ?? null,
          p_log_type: input.logType ?? 'session',
          p_title: input.title,
          p_content: input.content,
          p_metadata: input.metadata ?? {},
          p_is_player_visible: input.isPlayerVisible ?? true,
        });

        if (error) throw error;
        return {
          queued: false,
          logId: (data as string) ?? null,
        };
      } catch (error) {
        if (!isOfflineError(error)) {
          throw error;
        }

        enqueueOfflineSync('campaign_session', 'create', {
          mode: 'log',
          campaign_id: input.campaignId,
          session_id: input.sessionId ?? null,
          log_type: input.logType ?? 'session',
          title: input.title,
          content: input.content,
          metadata: input.metadata ?? {},
          is_player_visible: input.isPlayerVisible ?? true,
        });

        return {
          queued: true,
          logId: null,
        };
      }
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: [...KEY, variables.campaignId, 'logs'] });
      toast({
        title: result.queued ? 'Log queued offline' : 'Session log added',
        description: result.queued
          ? 'Session log will sync when connection returns.'
          : 'Campaign log entry recorded.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add session log',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
