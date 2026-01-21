import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';
import { createDefaultCharacterSheetState, type CharacterSheetState } from '@/lib/characterSheetState';
import { normalizeCustomModifiers } from '@/lib/customModifiers';
import { normalizeCharacterResources } from '@/lib/characterResources';
import { getLocalCharacterSheetState, isLocalCharacterId, setLocalCharacterSheetState } from '@/lib/guestStore';

type SheetStateRow = Database['public']['Tables']['character_sheet_state']['Row'];

const defaultState = createDefaultCharacterSheetState();

function normalizeSheetState(row: SheetStateRow | null): CharacterSheetState {
  if (!row) return defaultState;
  return {
    resources: normalizeCharacterResources(row.resources as CharacterSheetState['resources']),
    customModifiers: normalizeCustomModifiers(row.custom_modifiers as CharacterSheetState['customModifiers']),
  };
}

export function useCharacterSheetState(characterId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['character-sheet-state', characterId],
    queryFn: async () => {
      if (!characterId) return defaultState;
      if (isLocalCharacterId(characterId)) {
        const local = getLocalCharacterSheetState(characterId);
        if (!local) return defaultState;
        return {
          resources: normalizeCharacterResources(local.resources),
          customModifiers: normalizeCustomModifiers(local.customModifiers),
        };
      }

      const { data, error } = await supabase
        .from('character_sheet_state')
        .select('*')
        .eq('character_id', characterId)
        .maybeSingle();

      if (error) {
        logErrorWithContext(error, 'useCharacterSheetState');
        throw error;
      }

      return normalizeSheetState(data as SheetStateRow | null);
    },
    enabled: !!characterId,
  });

  const updateSheetState = useMutation({
    mutationFn: async (state: CharacterSheetState) => {
      if (!characterId) return defaultState;
      if (isLocalCharacterId(characterId)) {
        setLocalCharacterSheetState(characterId, state);
        return state;
      }

      const { data, error } = await supabase
        .from('character_sheet_state')
        .upsert(
          {
            character_id: characterId,
            resources: state.resources,
            custom_modifiers: state.customModifiers,
          },
          { onConflict: 'character_id' },
        )
        .select('*')
        .single();

      if (error) {
        logErrorWithContext(error, 'useCharacterSheetState.update');
        throw error;
      }

      return normalizeSheetState(data as SheetStateRow);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['character-sheet-state', characterId], data);
    },
    onError: (error) => {
      toast({
        title: 'Failed to update sheet',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });

  const saveSheetState = async (updates: Partial<CharacterSheetState>) => {
    const current = queryClient.getQueryData<CharacterSheetState>([
      'character-sheet-state',
      characterId,
    ]) || defaultState;
    const next: CharacterSheetState = {
      resources: updates.resources ?? current.resources,
      customModifiers: updates.customModifiers ?? current.customModifiers,
    };
    return updateSheetState.mutateAsync(next);
  };

  return {
    state: query.data || defaultState,
    isLoading: query.isLoading,
    isSaving: updateSheetState.isPending,
    saveSheetState,
  };
}
