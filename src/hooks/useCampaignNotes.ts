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
export const useCampaignNotes = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_notes')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as CampaignNote[];
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

      const { data, error } = await supabase
        .from('campaign_notes')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          note_type: noteType,
          session_date: sessionDate || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as CampaignNote;
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
      const { error } = await supabase
        .from('campaign_notes')
        .update({
          title: title.trim(),
          content: content.trim(),
          note_type: noteType,
          session_date: sessionDate || null,
        })
        .eq('id', noteId);

      if (error) throw error;
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
      const { error } = await supabase
        .from('campaign_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
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

