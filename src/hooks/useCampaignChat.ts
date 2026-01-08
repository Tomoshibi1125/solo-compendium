import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface CampaignMessage {
  id: string;
  campaign_id: string;
  user_id: string;
  character_name: string | null;
  message_type: 'chat' | 'roll' | 'system' | 'whisper';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Fetch campaign messages
export const useCampaignMessages = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'messages'],
    queryFn: async (): Promise<CampaignMessage[]> => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('campaign_messages' as any)
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
      metadata?: Record<string, unknown>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('campaign_messages' as any)
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          content,
          character_name: characterName || null,
          message_type: messageType,
          metadata,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
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
      const { error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('campaign_messages' as any)
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
