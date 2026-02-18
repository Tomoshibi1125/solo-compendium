import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import { enqueueOfflineSync } from '@/lib/offlineSync';

export type SessionStatus = 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
export type CombatStatus = 'waiting' | 'active' | 'paused' | 'completed';

export interface ActiveSessionRecord {
  id: string;
  campaign_id: string;
  title: string;
  description: string | null;
  status: SessionStatus;
  combat_status: CombatStatus;
  current_initiative: number | null;
  current_turn_player_id: string | null;
  map_data: Record<string, unknown> | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface SessionParticipantRecord {
  id: string;
  session_id: string;
  user_id: string;
  character_id: string | null;
  is_dm: boolean;
  joined_at: string;
}

type CreateActiveSessionInput = {
  campaignId: string;
  title: string;
  description?: string;
};

type JoinSessionInput = {
  sessionId: string;
  characterId?: string;
};

const KEY = ['campaigns', 'sessions', 'active'] as const;

const supabaseAny = supabase as unknown as {
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
  from: (table: string) => any;
  rpc: (fn: string, args?: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }>;
  channel: (name: string) => any;
};

export const useActiveSessions = (campaignId: string) => {
  return useQuery({
    queryKey: [...KEY, campaignId],
    queryFn: async (): Promise<ActiveSessionRecord[]> => {
      if (!isSupabaseConfigured || !campaignId) return [];

      const { data } = await supabaseAny.auth.getUser();
      if (!data.user) return [];

      const { data: rows, error } = await supabaseAny
        .from('active_sessions')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (rows || []) as ActiveSessionRecord[];
    },
    enabled: !!campaignId,
  });
};

export const useStartActiveSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateActiveSessionInput): Promise<{ sessionId: string }> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data } = await supabaseAny.auth.getUser();
      if (!data.user) {
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { data: sessionData, error } = await supabaseAny.rpc('start_active_session', {
        p_campaign_id: input.campaignId,
        p_title: input.title,
        p_description: input.description || null,
      });

      if (error) throw error;

      return { sessionId: sessionData as string };
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: [...KEY, variables.campaignId] });
      toast({
        title: 'Session started',
        description: 'Active gaming session has begun. Players can now join.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to start session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useJoinActiveSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: JoinSessionInput): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { data } = await supabaseAny.auth.getUser();
      if (!data.user) {
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      const { error } = await supabaseAny
        .from('session_participants')
        .insert({
          session_id: input.sessionId,
          user_id: data.user.id,
          character_id: input.characterId || null,
          is_dm: false,
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...KEY] });
      toast({
        title: 'Joined session',
        description: 'You have successfully joined the active gaming session.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to join session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useEndActiveSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sessionId: string): Promise<void> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }

      const { error } = await supabaseAny.rpc('end_active_session', {
        p_session_id: sessionId,
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...KEY] });
      toast({
        title: 'Session ended',
        description: 'The active gaming session has been concluded.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to end session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
