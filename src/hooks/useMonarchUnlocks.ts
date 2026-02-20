import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MONARCH_LABEL, formatMonarchVernacular } from '@/lib/vernacular';
import {
  filterRowsBySourcebookAccess,
  getCharacterCampaignId,
  isSourcebookAccessible,
} from '@/lib/sourcebookAccess';

export interface RegentUnlock {
  id: string;
  character_id: string;
  regent_id: string;
  unlocked_at: string;
  quest_name: string;
  dm_notes: string | null;
  is_primary: boolean;
  regent?: {
    id: string;
    name: string;
    title: string;
    theme: string;
    source_book?: string | null;
  };
}

export function useCharacterRegentUnlocks(characterId: string | undefined) {
  return useQuery({
    queryKey: ['regent-unlocks', characterId],
    queryFn: async () => {
      if (!characterId) return [];
      
      const { data, error } = await (supabase as any)
        .from('character_regent_unlocks')
        .select(`
          *,
          regent:compendium_regents(id, name, title, theme, source_book)
        `)
        .eq('character_id', characterId)
        .order('unlocked_at', { ascending: true });
      
      if (error) throw error;

      const campaignId = await getCharacterCampaignId(characterId);
      return filterRowsBySourcebookAccess(
        ((data || []) as unknown as RegentUnlock[]),
        (unlock) => unlock.regent?.source_book,
        { campaignId }
      );
    },
    enabled: !!characterId,
  });
}

export function useUnlockRegent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      characterId: string;
      regentId: string;
      questName: string;
      dmNotes?: string;
      isPrimary?: boolean;
    }) => {
      const campaignId = await getCharacterCampaignId(params.characterId);
      const { data: regent, error: regentError } = await (supabase as any)
        .from('compendium_regents')
        .select('source_book')
        .eq('id', params.regentId)
        .maybeSingle();

      if (regentError) throw regentError;
      if (
        regent &&
        !(await isSourcebookAccessible((regent as any).source_book, { campaignId }))
      ) {
        throw new Error('This regent requires sourcebook access.');
      }

      const { data, error } = await (supabase as any)
        .from('character_regent_unlocks')
        .insert({
          character_id: params.characterId,
          regent_id: params.regentId,
          quest_name: params.questName,
          dm_notes: params.dmNotes || null,
          is_primary: params.isPrimary || false,
        })
        .select(`
          *,
          regent:compendium_regents(id, name, title, theme)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['regent-unlocks', variables.characterId] });
      toast({
        title: `${MONARCH_LABEL} Unlocked!`,
        description: formatMonarchVernacular(`Quest "${variables.questName}" complete. Regent power awakened!`),
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

export function useSetPrimaryRegent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: { characterId: string; unlockId: string }) => {
      // First, unset all primary flags for this character
      await (supabase as any)
        .from('character_regent_unlocks')
        .update({ is_primary: false })
        .eq('character_id', params.characterId);

      // Then set the new primary
      const { data, error } = await (supabase as any)
        .from('character_regent_unlocks')
        .update({ is_primary: true })
        .eq('id', params.unlockId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['regent-unlocks', variables.characterId] });
      toast({
        title: `Primary ${MONARCH_LABEL} Set`,
        description: `This ${MONARCH_LABEL} is now your dominant power source.`,
      });
    },
  });
}

export function useCanUnlockSovereign(characterId: string | undefined) {
  const { data: unlocks = [] } = useCharacterRegentUnlocks(characterId);
  return unlocks.length >= 2;
}

export type MonarchUnlock = RegentUnlock;

export function useCharacterMonarchUnlocks(characterId: string | undefined) {
  return useCharacterRegentUnlocks(characterId);
}

export function useUnlockMonarch() {
  return useUnlockRegent();
}

export function useSetPrimaryMonarch() {
  return useSetPrimaryRegent();
}
