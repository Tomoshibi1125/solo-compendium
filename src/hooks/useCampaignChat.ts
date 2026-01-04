import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface CampaignMessage {
  id: string;
  campaign_id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
}

// Fetch campaign messages
export const useCampaignMessages = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_messages')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: true })
        .limit(100); // Limit to last 100 messages

      if (error) throw error;
      return (data || []) as CampaignMessage[];
    },
    enabled: !!campaignId,
    staleTime: 10000, // Cache for 10 seconds
    refetchInterval: 30000, // Poll every 30 seconds as fallback (real-time handles most updates)
  });
};

// Real-time subscription for campaign messages
export const useCampaignMessagesRealtime = (
  campaignId: string,
  onNewMessage: (message: CampaignMessage) => void
) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!campaignId) return;

    const channel = supabase
      .channel(`campaign:${campaignId}:messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'campaign_messages',
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          onNewMessage(payload.new as CampaignMessage);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to campaign messages');
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [campaignId, onNewMessage]);
};

// Send message mutation
export const useSendCampaignMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ campaignId, message }: { campaignId: string; message: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('campaign_messages')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          message: message.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      return data as CampaignMessage;
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

// Delete message mutation
export const useDeleteCampaignMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ messageId, campaignId }: { messageId: string; campaignId: string }) => {
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

