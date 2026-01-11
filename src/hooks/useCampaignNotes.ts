import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';

export interface CampaignNote {
  id: string;
  campaign_id: string;
  user_id: string;
  title: string;
  content: string | null;
  is_shared: boolean;
  category: string;
  created_at: string;
  updated_at: string;
}

// Fetch campaign notes
export const useCampaignNotes = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'notes'],
    queryFn: async (): Promise<CampaignNote[]> => {
      const { data, error } = await supabase
        .from('campaign_notes')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as CampaignNote[];
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
      isShared = false,
      category = 'general',
    }: {
      campaignId: string;
      title: string;
      content?: string;
      isShared?: boolean;
      category?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { data, error } = await supabase
        .from('campaign_notes')
        .insert({
          campaign_id: campaignId,
          user_id: user.id,
          title,
          content: content || null,
          is_shared: isShared,
          category,
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as CampaignNote;
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
      isShared,
      category,
    }: {
      noteId: string;
      campaignId: string;
      title?: string;
      content?: string;
      isShared?: boolean;
      category?: string;
    }) => {
      const updates: Database['public']['Tables']['campaign_notes']['Update'] = {
        updated_at: new Date().toISOString(),
      };
      if (title !== undefined) updates.title = title;
      if (content !== undefined) updates.content = content;
      if (isShared !== undefined) updates.is_shared = isShared;
      if (category !== undefined) updates.category = category;

      const { data, error } = await supabase
        .from('campaign_notes')
        .update(updates)
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as CampaignNote;
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
