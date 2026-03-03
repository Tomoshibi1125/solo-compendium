import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';

export const useCampaignCombatRealtime = (campaignId: string | null, sessionId: string | null) => {
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (loading) return;
    if (!campaignId) return;
    if (!user?.id) return;

    const channel = supabase
      .channel(`combat:${campaignId}:${sessionId ?? 'active'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_combat_sessions',
          filter: `campaign_id=eq.${campaignId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ['campaigns', campaignId, 'combat-session', sessionId ?? 'active'],
          });
          queryClient.invalidateQueries({
            queryKey: ['campaigns', campaignId, 'combat-session'],
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaign_combatants',
          filter: sessionId ? `session_id=eq.${sessionId}` : undefined,
        } as never,
        () => {
          queryClient.invalidateQueries({
            queryKey: ['campaigns', campaignId, 'combat-session', sessionId ?? 'active'],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId, loading, queryClient, sessionId, user?.id]);
};
