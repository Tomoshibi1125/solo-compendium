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

const buildJournalStorageKey = (characterId: string) => `solo-compendium.character-journal.${characterId}.v1`;

const readLocalJournalEntries = (characterId: string): JournalEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(buildJournalStorageKey(characterId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as JournalEntry[]) : [];
  } catch {
    return [];
  }
};

const writeLocalJournalEntries = (characterId: string, entries: JournalEntry[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(buildJournalStorageKey(characterId), JSON.stringify(entries));
  } catch {
    // ignore
  }
};

export const useCharacterJournal = (characterId: string) => {
  return useQuery({
    queryKey: ['character-journal', characterId],
    queryFn: async () => {
      const fallback = readLocalJournalEntries(characterId);

      const { data, error } = await supabase
        .from('character_journal')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: false });

      if (error) {
        return fallback;
      }

      const next = (data || []) as unknown as JournalEntry[];
      writeLocalJournalEntries(characterId, next);
      return next;
    },
    enabled: !!characterId,
  });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) => {
      const local = readLocalJournalEntries(entry.character_id);
      const now = new Date().toISOString();
      const localEntry: JournalEntry = {
        id: `local-${Date.now()}`,
        character_id: entry.character_id,
        title: entry.title,
        content: entry.content ?? null,
        session_date: entry.session_date ?? null,
        tags: entry.tags ?? [],
        created_at: now,
        updated_at: now,
      };
      const localNext = [localEntry, ...local];
      writeLocalJournalEntries(entry.character_id, localNext);

      const { data, error } = await supabase
        .from('character_journal')
        .insert(entry)
        .select()
        .single();

      if (error) {
        return localEntry;
      }

      const saved = data as unknown as JournalEntry;
      const reconcile = localNext.map((row) => (row.id === localEntry.id ? saved : row));
      writeLocalJournalEntries(entry.character_id, reconcile);
      return saved;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-journal', variables.character_id] });
    },
  });
};

export const useUpdateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, characterId: _characterId, ...updates }: { id: string; characterId: string } & Partial<JournalEntry>) => {
      const local = readLocalJournalEntries(_characterId);
      const now = new Date().toISOString();
      const localNext = local.map((row) => {
        if (row.id !== id) return row;
        return {
          ...row,
          ...updates,
          updated_at: now,
        } as JournalEntry;
      });
      writeLocalJournalEntries(_characterId, localNext);

      const localUpdated = localNext.find((row) => row.id === id);

      const { data, error } = await supabase
        .from('character_journal')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return (
          localUpdated ??
          ({
            id,
            character_id: _characterId,
            title: String(updates.title ?? ''),
            content: (updates.content ?? null) as string | null,
            session_date: (updates.session_date ?? null) as string | null,
            tags: (updates.tags ?? []) as string[],
            created_at: now,
            updated_at: now,
          } satisfies JournalEntry)
        );
      }

      const saved = data as unknown as JournalEntry;
      const reconcile = localNext.map((row) => (row.id === id ? saved : row));
      writeLocalJournalEntries(_characterId, reconcile);
      return saved;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-journal', variables.characterId] });
    },
  });
};

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, characterId: _characterId }: { id: string; characterId: string }) => {
      const local = readLocalJournalEntries(_characterId);
      const localNext = local.filter((row) => row.id !== id);
      writeLocalJournalEntries(_characterId, localNext);

      const { error } = await supabase
        .from('character_journal')
        .delete()
        .eq('id', id);

      if (error) {
        return;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-journal', variables.characterId] });
    },
  });
};
