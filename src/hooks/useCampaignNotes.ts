import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CampaignNote {
  id: string;
  campaign_id: string;
  user_id: string;
  title: string;
  content: string;
  note_type: 'session' | 'note' | 'recap';
  session_date: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch campaign notes
// Note: Campaign notes feature requires campaign_notes table
export const useCampaignNotes = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'notes'],
    queryFn: async (): Promise<CampaignNote[]> => {
      // Campaign notes feature not yet implemented in database
      return [];
    },
    enabled: !!campaignId,
  });
};

// Create note mutation
export const useCreateCampaignNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      campaignId,
      title,
      content,
      noteType,
      sessionDate,
    }: {
      campaignId: string;
      title: string;
      content: string;
      noteType: 'session' | 'note' | 'recap';
      sessionDate?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Campaign notes feature not yet implemented
      throw new Error('Campaign notes feature is not yet available');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'notes'] });
      toast({
        title: 'Note created',
        description: 'Your note has been saved.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create note',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Update note mutation
export const useUpdateCampaignNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      noteId,
      campaignId,
      title,
      content,
      noteType,
      sessionDate,
    }: {
      noteId: string;
      campaignId: string;
      title: string;
      content: string;
      noteType: 'session' | 'note' | 'recap';
      sessionDate?: string;
    }) => {
      // Campaign notes feature not yet implemented
      throw new Error('Campaign notes feature is not yet available');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'notes'] });
      toast({
        title: 'Note updated',
        description: 'Your note has been saved.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update note',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Delete note mutation
export const useDeleteCampaignNote = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ noteId, campaignId }: { noteId: string; campaignId: string }) => {
      // Campaign notes feature not yet implemented
      throw new Error('Campaign notes feature is not yet available');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns', variables.campaignId, 'notes'] });
      toast({
        title: 'Note deleted',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete note',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
