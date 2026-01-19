import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getLocalUserId } from '@/lib/guestStore';

export interface CampaignMessage {
  id: string;
  campaign_id: string;
  user_id: string;
  character_name: string | null;
  message_type: 'chat' | 'roll' | 'system' | 'whisper';
  content: string;
  metadata: Json | null;
  created_at: string;
}

const getMessagesKey = (campaignId: string) => `solo-compendium.campaign.${campaignId}.messages`;

const getBrowserWindow = (): Window | null => {
  if (typeof window === 'undefined') return null;
  return window;
};

const loadLocalMessages = (campaignId: string): CampaignMessage[] => {
  const activeWindow = getBrowserWindow();
  if (!activeWindow) return [];
  const raw = activeWindow.localStorage.getItem(getMessagesKey(campaignId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CampaignMessage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalMessages = (campaignId: string, messages: CampaignMessage[]) => {
  const activeWindow = getBrowserWindow();
  if (!activeWindow) return;
  activeWindow.localStorage.setItem(getMessagesKey(campaignId), JSON.stringify(messages));
};

const broadcastLocalMessage = (campaignId: string, message: CampaignMessage) => {
  const activeWindow = getBrowserWindow();
  if (!activeWindow) return;
  if ('BroadcastChannel' in activeWindow) {
    const channel = new BroadcastChannel(`campaign-messages-${campaignId}`);
    channel.postMessage(message);
    channel.close();
  } else {
    activeWindow.dispatchEvent(new CustomEvent(`campaign-message-${campaignId}`, { detail: message }));
  }
};

// Fetch campaign messages
export const useCampaignMessages = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'messages'],
    queryFn: async (): Promise<CampaignMessage[]> => {
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        return loadLocalMessages(campaignId).sort((a, b) => a.created_at.localeCompare(b.created_at));
      }

      const { data, error } = await supabase
        .from('campaign_messages')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) throw error;
      return (data || []) as unknown as CampaignMessage[];
    },
    enabled: !!campaignId,
    staleTime: 10000,
    refetchInterval: 30000,
  });
};

// Real-time subscription for campaign messages
export const useCampaignMessagesRealtime = (
  campaignId: string,
  onNewMessage: (message: CampaignMessage) => void
) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const onNewMessageRef = useRef(onNewMessage);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  }, [onNewMessage]);

  useEffect(() => {
    if (!campaignId) return;

    if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
      const activeWindow = getBrowserWindow();
      if (!activeWindow) return;
      if ('BroadcastChannel' in activeWindow) {
        const channel = new BroadcastChannel(`campaign-messages-${campaignId}`);
        channel.onmessage = (event) => {
          onNewMessageRef.current(event.data as CampaignMessage);
        };
        channelRef.current = channel as unknown as RealtimeChannel;
        return () => {
          channel.close();
          channelRef.current = null;
        };
      }

      const handler = (event: Event) => {
        const detail = (event as CustomEvent).detail as CampaignMessage;
        onNewMessageRef.current(detail);
      };
      activeWindow.addEventListener(`campaign-message-${campaignId}`, handler);
      return () => activeWindow.removeEventListener(`campaign-message-${campaignId}`, handler);
    }

    const channel = supabase
      .channel(`campaign-messages-${campaignId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'campaign_messages',
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          onNewMessageRef.current(payload.new as CampaignMessage);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [campaignId]);
};

// Send message mutation
export const useSendCampaignMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      campaignId, 
      content,
      characterName,
      messageType = 'chat',
      metadata = {}
    }: { 
      campaignId: string; 
      content: string;
      characterName?: string;
      messageType?: 'chat' | 'roll' | 'system' | 'whisper';
      metadata?: Json;
    }) => {
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        const now = new Date().toISOString();
        const next: CampaignMessage = {
          id: crypto.randomUUID(),
          campaign_id: campaignId,
          user_id: getLocalUserId(),
          character_name: characterName || null,
          message_type: messageType,
          content,
          metadata,
          created_at: now,
        };
        const updated = [...loadLocalMessages(campaignId), next];
        saveLocalMessages(campaignId, updated);
        broadcastLocalMessage(campaignId, next);
        return next;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const now = new Date().toISOString();
        const next: CampaignMessage = {
          id: crypto.randomUUID(),
          campaign_id: campaignId,
          user_id: getLocalUserId(),
          character_name: characterName || null,
          message_type: messageType,
          content,
          metadata,
          created_at: now,
        };
        const updated = [...loadLocalMessages(campaignId), next];
        saveLocalMessages(campaignId, updated);
        broadcastLocalMessage(campaignId, next);
        return next;
      }

      const { data, error } = await supabase
        .from('campaign_messages')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          content,
          character_name: characterName || null,
          message_type: messageType,
          metadata,
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as CampaignMessage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'messages'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Delete message mutation (for DMs)
export const useDeleteCampaignMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ messageId, campaignId }: { messageId: string; campaignId: string }) => {
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        const existing = loadLocalMessages(campaignId);
        const next = existing.filter((msg) => msg.id !== messageId);
        saveLocalMessages(campaignId, next);
        return;
      }

      const { error } = await supabase
        .from('campaign_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'messages'] });
      toast({
        title: 'Message deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
