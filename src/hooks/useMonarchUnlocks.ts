import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MONARCH_LABEL, formatMonarchVernacular } from '@/lib/vernacular';

export interface MonarchUnlock {
  id: string;
  character_id: string;
  monarch_id: string;
  unlocked_at: string;
  quest_name: string;
  dm_notes: string | null;
  is_primary: boolean;
  monarch?: {
    id: string;
    name: string;
    title: string;
    theme: string;
  };
}

export function useCharacterMonarchUnlocks(characterId: string | undefined) {
  return useQuery({
    queryKey: ['monarch-unlocks', characterId],
    queryFn: async () => {
      if (!characterId) return [];
      
      const { data, error } = await supabase
        .from('character_monarch_unlocks')
        .select(`
          *,
          monarch:compendium_monarchs(id, name, title, theme)
        `)
        .eq('character_id', characterId)
        .order('unlocked_at', { ascending: true });
      
      if (error) throw error;
      return data as MonarchUnlock[];
    },
    enabled: !!characterId,
  });
}

export function useUnlockMonarch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      characterId: string;
      monarchId: string;
      questName: string;
      dmNotes?: string;
      isPrimary?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('character_monarch_unlocks')
        .insert({
          character_id: params.characterId,
          monarch_id: params.monarchId,
          quest_name: params.questName,
          dm_notes: params.dmNotes || null,
          is_primary: params.isPrimary || false,
        })
        .select(`
          *,
          monarch:compendium_monarchs(id, name, title, theme)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['monarch-unlocks', variables.characterId] });
      toast({
        title: `${MONARCH_LABEL} Unlocked!`,
        description: formatMonarchVernacular(`Quest "${variables.questName}" complete. Monarch power awakened!`),
      });
    },
    onError: (error) => {
      toast({
        title: 'Unlock Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useSetPrimaryMonarch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: { characterId: string; unlockId: string }) => {
      // First, unset all primary flags for this character
      await supabase
        .from('character_monarch_unlocks')
        .update({ is_primary: false })
        .eq('character_id', params.characterId);

      // Then set the new primary
      const { data, error } = await supabase
        .from('character_monarch_unlocks')
        .update({ is_primary: true })
        .eq('id', params.unlockId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['monarch-unlocks', variables.characterId] });
      toast({
        title: `Primary ${MONARCH_LABEL} Set`,
        description: `This ${MONARCH_LABEL} is now your dominant power source.`,
      });
    },
  });
}

export function useCanUnlockSovereign(characterId: string | undefined) {
  const { data: unlocks = [] } = useCharacterMonarchUnlocks(characterId);
  
  // Sovereign requires 2 monarch unlocks
  return unlocks.length >= 2;
}
