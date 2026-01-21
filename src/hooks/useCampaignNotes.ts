import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';
import { getLocalUserId } from '@/lib/guestStore';

const guestEnabled = import.meta.env.VITE_GUEST_ENABLED !== 'false';

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

const getNotesKey = (campaignId: string) => `solo-compendium.campaign.${campaignId}.notes`;

const loadLocalNotes = (campaignId: string): CampaignNote[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(getNotesKey(campaignId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CampaignNote[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((note) => ({
      ...note,
      category: note.category || 'general',
    }));
  } catch {
    return [];
  }
};

const saveLocalNotes = (campaignId: string, notes: CampaignNote[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getNotesKey(campaignId), JSON.stringify(notes));
};

// Fetch campaign notes
export const useCampaignNotes = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'notes'],
    queryFn: async (): Promise<CampaignNote[]> => {
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        return loadLocalNotes(campaignId).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user && guestEnabled) {
        return loadLocalNotes(campaignId).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
      }

      const { data, error } = await supabase
        .from('campaign_notes')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      const notes = (data || []) as Database['public']['Tables']['campaign_notes']['Row'][];
      return notes.map((note) => ({
        ...note,
        category: note.category ?? 'general',
      }));
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
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        const now = new Date().toISOString();
        const next: CampaignNote = {
          id: crypto.randomUUID(),
          campaign_id: campaignId,
          user_id: getLocalUserId(),
          title,
          content: content || null,
          is_shared: isShared,
          category,
          created_at: now,
          updated_at: now,
        };
        const updated = [next, ...loadLocalNotes(campaignId)];
        saveLocalNotes(campaignId, updated);
        return next;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const now = new Date().toISOString();
        const next: CampaignNote = {
          id: crypto.randomUUID(),
          campaign_id: campaignId,
          user_id: getLocalUserId(),
          title,
          content: content || null,
          is_shared: isShared,
          category,
          created_at: now,
          updated_at: now,
        };
        const updated = [next, ...loadLocalNotes(campaignId)];
        saveLocalNotes(campaignId, updated);
        return next;
      }

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

      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        const existing = loadLocalNotes(campaignId);
        const next = existing.map((note) =>
          note.id === noteId
            ? {
                ...note,
                ...updates,
                category: (updates.category ?? note.category) || 'general',
                updated_at: new Date().toISOString(),
              }
            : note
        );
        saveLocalNotes(campaignId, next);
        const updatedNote = next.find((note) => note.id === noteId);
        if (!updatedNote) throw new AppError('Note not found', 'NOT_FOUND');
        return updatedNote;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user && guestEnabled) {
        const existing = loadLocalNotes(campaignId);
        const next = existing.map((note) =>
          note.id === noteId
            ? {
                ...note,
                ...updates,
                category: (updates.category ?? note.category) || 'general',
                updated_at: new Date().toISOString(),
              }
            : note
        );
        saveLocalNotes(campaignId, next);
        const updatedNote = next.find((note) => note.id === noteId);
        if (!updatedNote) throw new AppError('Note not found', 'NOT_FOUND');
        return updatedNote;
      }

      const { data, error } = await supabase
        .from('campaign_notes')
        .update(updates)
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;
      const note = data as Database['public']['Tables']['campaign_notes']['Row'];
      return {
        ...note,
        category: note.category ?? 'general',
      };
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
      if (!isSupabaseConfigured || import.meta.env.VITE_E2E === 'true') {
        const existing = loadLocalNotes(campaignId);
        const next = existing.filter((note) => note.id !== noteId);
        saveLocalNotes(campaignId, next);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user && guestEnabled) {
        const existing = loadLocalNotes(campaignId);
        const next = existing.filter((note) => note.id !== noteId);
        saveLocalNotes(campaignId, next);
        return;
      }

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
