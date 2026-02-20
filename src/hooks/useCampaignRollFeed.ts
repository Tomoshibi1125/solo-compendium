import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface CampaignRollEvent {
  id: string;
  campaign_id: string;
  user_id: string;
  character_id: string | null;
  character_name: string | null;
  dice_formula: string;
  result: number;
  rolls: number[];
  roll_type: string | null;
  context: string | null;
  modifiers: Record<string, unknown> | null;
  created_at: string;
}

const LOCAL_ROLL_EVENTS_KEY = 'solo-compendium.campaign-roll-events.v1';

const loadLocalRollEvents = (campaignId: string): CampaignRollEvent[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(LOCAL_ROLL_EVENTS_KEY);
  if (!raw) return [];
  try {
    const all = JSON.parse(raw) as CampaignRollEvent[];
    return Array.isArray(all)
      ? all.filter((e) => e.campaign_id === campaignId).slice(0, 50)
      : [];
  } catch {
    return [];
  }
};

export const saveLocalRollEvent = (event: CampaignRollEvent) => {
  if (typeof window === 'undefined') return;
  const raw = window.localStorage.getItem(LOCAL_ROLL_EVENTS_KEY);
  const all: CampaignRollEvent[] = raw ? JSON.parse(raw) : [];
  all.unshift(event);
  // Keep only latest 200 events
  window.localStorage.setItem(LOCAL_ROLL_EVENTS_KEY, JSON.stringify(all.slice(0, 200)));
};

/**
 * Subscribe to real-time campaign roll events.
 * Uses Supabase Realtime postgres_changes on campaign_roll_events table.
 * Falls back to localStorage polling for guest/local mode.
 */
export function useCampaignRollFeed(campaignId: string) {
  const [events, setEvents] = useState<CampaignRollEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  const untypedSupabase = supabase as unknown as {
    from: (table: string) => any;
    channel: (name: string) => any;
    removeChannel: (channel: unknown) => any;
  };

  // Load initial events
  useEffect(() => {
    if (!campaignId) return;

    const loadInitial = async () => {
      if (!isSupabaseConfigured || !user) {
        setEvents(loadLocalRollEvents(campaignId));
        return;
      }

      const { data, error } = await untypedSupabase
        .from('campaign_roll_events')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setEvents(data as unknown as CampaignRollEvent[]);
      } else {
        setEvents(loadLocalRollEvents(campaignId));
      }
    };

    loadInitial();
  }, [campaignId, user]);

  // Subscribe to real-time inserts
  useEffect(() => {
    if (!campaignId || !isSupabaseConfigured || !user) return;

    let channel: RealtimeChannel | null = null;

    const subscribe = () => {
      channel = untypedSupabase
        .channel(`campaign-rolls:${campaignId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'campaign_roll_events',
            filter: `campaign_id=eq.${campaignId}`,
          },
          (payload: { new: unknown }) => {
            const newEvent = payload.new as unknown as CampaignRollEvent;
            setEvents((prev) => [newEvent, ...prev].slice(0, 50));
          },
        )
        .subscribe((status: string) => {
          setIsConnected(status === 'SUBSCRIBED');
        });
    };

    subscribe();

    return () => {
      if (channel) {
        untypedSupabase.removeChannel(channel);
      }
    };
  }, [campaignId, user]);

  // Local mode: poll localStorage
  useEffect(() => {
    if (!campaignId || (isSupabaseConfigured && user)) return;

    const interval = setInterval(() => {
      setEvents(loadLocalRollEvents(campaignId));
    }, 2000);

    return () => clearInterval(interval);
  }, [campaignId, user]);

  const addEvent = useCallback(
    async (event: Omit<CampaignRollEvent, 'id' | 'created_at'>) => {
      const fullEvent: CampaignRollEvent = {
        ...event,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };

      if (!isSupabaseConfigured || !user) {
        saveLocalRollEvent(fullEvent);
        setEvents((prev) => [fullEvent, ...prev].slice(0, 50));
        return;
      }

      const { error } = await untypedSupabase
        .from('campaign_roll_events')
        .insert({
          campaign_id: event.campaign_id,
          user_id: event.user_id,
          character_id: event.character_id,
          character_name: event.character_name,
          dice_formula: event.dice_formula,
          result: event.result,
          rolls: event.rolls,
          roll_type: event.roll_type,
          context: event.context,
          modifiers: event.modifiers,
        });

      if (error) {
        // Fallback to local
        saveLocalRollEvent(fullEvent);
        setEvents((prev) => [fullEvent, ...prev].slice(0, 50));
      }
    },
    [user],
  );

  return { events, isConnected, addEvent };
}
