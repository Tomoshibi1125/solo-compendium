import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface JournalEntry {
  id: string;
  character_id: string;
  title: string;
  content: string | null;
  session_date: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export const useCharacterJournal = (characterId: string) => {
  return useQuery({
    queryKey: ['character-journal', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('character_journal' as any)
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as JournalEntry[];
    },
    enabled: !!characterId,
  });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('character_journal' as any)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(entry as any)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as JournalEntry;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-journal', variables.character_id] });
    },
  });
};

export const useUpdateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, characterId, ...updates }: { id: string; characterId: string } & Partial<JournalEntry>) => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('character_journal' as any)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as JournalEntry;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-journal', variables.characterId] });
    },
  });
};

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, characterId }: { id: string; characterId: string }) => {
      const { error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('character_journal' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-journal', variables.characterId] });
    },
  });
};
