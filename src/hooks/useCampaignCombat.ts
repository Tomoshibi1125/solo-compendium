import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import { enqueueOfflineSync } from '@/lib/offlineSync';
import type { Database, Json } from '@/integrations/supabase/types';

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== 'false';

type CombatSession = Database['public']['Tables']['campaign_combat_sessions']['Row'];
type Combatant = Database['public']['Tables']['campaign_combatants']['Row'];

type UpdateCombatSessionInput = {
  campaignId: string;
  sessionId: string;
  updates: Partial<Pick<CombatSession, 'status' | 'round' | 'current_turn'>>;
};

type UpsertCombatantsInput = {
  campaignId: string;
  sessionId: string;
  combatants: Array<{
    id: string;
    name: string;
    initiative: number;
    stats: Json;
    conditions: Json;
    flags: Json;
    member_id?: string | null;
  }>;
};

type CombatMutationResult = {
  queued: boolean;
  campaignId: string;
  sessionId: string;
};

export type { CombatSession, Combatant };

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

export const useCampaignCombatSession = (campaignId: string, sessionId?: string | null) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'combat-session', sessionId ?? 'active'],
    queryFn: async (): Promise<{ session: CombatSession | null; combatants: Combatant[] }> => {
      if (!campaignId || !isSupabaseConfigured) {
        return { session: null, combatants: [] };
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (guestEnabled) return { session: null, combatants: [] };
        throw new AppError('Not authenticated', 'AUTH_REQUIRED');
      }

      let sessionQuery = supabase
        .from('campaign_combat_sessions')
        .select('*')
        .eq('campaign_id', campaignId);

      if (sessionId) {
        sessionQuery = sessionQuery.eq('id', sessionId);
      } else {
        sessionQuery = sessionQuery.eq('status', 'active').order('created_at', { ascending: false }).limit(1);
      }

      const { data: sessionData, error: sessionError } = await sessionQuery.maybeSingle();
      if (sessionError) throw sessionError;
      const session = (sessionData || null) as CombatSession | null;
      if (!session) return { session: null, combatants: [] };

      const { data: combatantData, error: combatantError } = await supabase
        .from('campaign_combatants')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (combatantError) throw combatantError;
      return { session, combatants: (combatantData || []) as Combatant[] };
    },
    enabled: !!campaignId,
  });
};

export const useUpdateCombatSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      campaignId,
      sessionId,
      updates,
    }: UpdateCombatSessionInput): Promise<CombatMutationResult> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }
      await ensureAuthenticatedUser();

      try {
        const { data, error } = await supabase
          .from('campaign_combat_sessions')
          .update(updates)
          .eq('id', sessionId)
          .eq('campaign_id', campaignId)
          .select('id, campaign_id')
          .single();

        if (error) throw error;
        return {
          queued: false,
          campaignId: data.campaign_id,
          sessionId: data.id,
        };
      } catch (error) {
        if (!isOfflineError(error)) {
          throw error;
        }

        enqueueOfflineSync('campaign_combat', 'update', {
          mode: 'session',
          campaign_id: campaignId,
          session_id: sessionId,
          updates,
        });
        return {
          queued: true,
          campaignId,
          sessionId,
        };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', result.campaignId, 'combat-session'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns', result.campaignId, 'combat-session', result.sessionId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update combat session',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpsertCombatants = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      campaignId,
      sessionId,
      combatants,
    }: UpsertCombatantsInput): Promise<CombatMutationResult> => {
      if (!isSupabaseConfigured) {
        throw new AppError('Supabase not configured', 'CONFIG');
      }
      await ensureAuthenticatedUser();

      try {
        const payload = combatants.map((combatant) => ({
          id: combatant.id,
          campaign_id: campaignId,
          session_id: sessionId,
          name: combatant.name,
          initiative: combatant.initiative,
          stats: combatant.stats,
          conditions: combatant.conditions,
          flags: combatant.flags,
          member_id: combatant.member_id ?? null,
        }));

        const { data: existingRows, error: existingError } = await supabase
          .from('campaign_combatants')
          .select('id')
          .eq('session_id', sessionId);

        if (existingError) throw existingError;

        const nextIds = new Set(payload.map((combatant) => combatant.id));
        const staleIds = (existingRows ?? [])
          .map((row) => row.id)
          .filter((id) => !nextIds.has(id));

        if (staleIds.length > 0) {
          const { error: deleteError } = await supabase
            .from('campaign_combatants')
            .delete()
            .eq('session_id', sessionId)
            .in('id', staleIds);

          if (deleteError) throw deleteError;
        }

        if (payload.length > 0) {
          const { error } = await supabase
            .from('campaign_combatants')
            .upsert(payload, { onConflict: 'id' });

          if (error) throw error;
        }

        return {
          queued: false,
          campaignId,
          sessionId,
        };
      } catch (error) {
        if (!isOfflineError(error)) {
          throw error;
        }

        enqueueOfflineSync('campaign_combat', 'update', {
          mode: 'combatants',
          campaign_id: campaignId,
          session_id: sessionId,
          combatants,
        });
        return {
          queued: true,
          campaignId,
          sessionId,
        };
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['campaigns', variables.campaignId, 'combat-session'],
      });
      queryClient.invalidateQueries({
        queryKey: ['campaigns', variables.campaignId, 'combat-session', variables.sessionId],
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to sync combatants',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useEndCombatSession = () => {
  const updateSession = useUpdateCombatSession();

  return useMutation({
    mutationFn: async ({ campaignId, sessionId }: { campaignId: string; sessionId: string }) => {
      return updateSession.mutateAsync({ campaignId, sessionId, updates: { status: 'ended' } });
    },
  });
};
