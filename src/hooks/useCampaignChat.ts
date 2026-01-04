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
// Note: Campaign messaging feature requires campaign_messages table
export const useCampaignMessages = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'messages'],
    queryFn: async (): Promise<CampaignMessage[]> => {
      // Campaign messaging feature not yet implemented in database
      return [];
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
    // Campaign messaging feature not yet implemented
    // Real-time subscription disabled until table exists
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
    mutationFn: async ({ campaignId, message }: { campaignId: string; message: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Campaign messaging feature not yet implemented
      throw new Error('Campaign messaging is not yet available');
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
      // Campaign messaging feature not yet implemented
      throw new Error('Campaign messaging is not yet available');
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
