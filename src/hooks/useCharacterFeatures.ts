import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/authContext';
import { useToast } from '@/hooks/use-toast';
import { isLocalCharacterId } from '@/lib/guestStore';
import { useUserLocalState } from '@/hooks/useToolState';
import type { CustomModifier, CustomModifierType } from '@/lib/customModifiers';

export interface CharacterFeature {
  id: string;
  character_id: string;
  name: string;
  source: string;
  level_acquired: number;
  description: string | null;
  uses_current: number | null;
  uses_max: number | null;
  recharge: string | null;
  action_type: string | null;
  is_active: boolean;
  modifiers: FeatureModifier[] | null;
  homebrew_id: string | null;
  created_at: string;
}

export interface FeatureModifier {
  type: CustomModifierType;
  value: number;
  die?: string;
  target?: string;
  source: string;
}

const LOCAL_FEATURES_KEY = 'character-features';

const useLocalFeatures = () => {
  return useUserLocalState<Record<string, CharacterFeature[]>>(
    LOCAL_FEATURES_KEY,
    { initialState: {} }
  );
};

export const useCharacterFeatures = (characterId: string) => {
  const { user } = useAuth();
  const { state: localFeatures } = useLocalFeatures();

  return useQuery({
    queryKey: ['character-features', characterId],
    queryFn: async (): Promise<CharacterFeature[]> => {
      if (!characterId) return [];

      if (!isSupabaseConfigured || isLocalCharacterId(characterId)) {
        return localFeatures[characterId] || [];
      }

      if (!user) {
        return localFeatures[characterId] || [];
      }

      const { data, error } = await supabase
        .from('character_features')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as CharacterFeature[];
    },
    enabled: !!characterId,
  });
};

export const useApplyHomebrewFeature = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { state: localFeatures, setState: setLocalFeatures } = useLocalFeatures();

  return useMutation({
    mutationFn: async (params: {
      characterId: string;
      homebrewId: string;
      name: string;
      description: string;
      modifiers: FeatureModifier[];
    }) => {
      const feature: CharacterFeature = {
        id: crypto.randomUUID(),
        character_id: params.characterId,
        name: params.name,
        source: `Homebrew: ${params.name}`,
        level_acquired: 1,
        description: params.description,
        uses_current: null,
        uses_max: null,
        recharge: null,
        action_type: 'passive',
        is_active: true,
        modifiers: params.modifiers,
        homebrew_id: params.homebrewId,
        created_at: new Date().toISOString(),
      };

      if (!isSupabaseConfigured || isLocalCharacterId(params.characterId)) {
        setLocalFeatures({
          ...localFeatures,
          [params.characterId]: [...(localFeatures[params.characterId] || []), feature],
        });
        return feature;
      }

      if (!user) {
        setLocalFeatures({
          ...localFeatures,
          [params.characterId]: [...(localFeatures[params.characterId] || []), feature],
        });
        return feature;
      }

      const { data, error } = await supabase
        .from('character_features')
        .insert({
          character_id: params.characterId,
          name: params.name,
          source: `Homebrew: ${params.name}`,
          level_acquired: 1,
          description: params.description,
          action_type: 'passive',
          is_active: true,
          modifiers: params.modifiers,
          homebrew_id: params.homebrewId,
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as CharacterFeature;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-features', variables.characterId] });
      toast({
        title: 'Feature Applied',
        description: `${variables.name} has been applied to your character.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to apply feature',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useRemoveCharacterFeature = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const { state: localFeatures, setState: setLocalFeatures } = useLocalFeatures();

  return useMutation({
    mutationFn: async (params: { featureId: string; characterId: string }) => {
      if (!isSupabaseConfigured || isLocalCharacterId(params.characterId)) {
        setLocalFeatures({
          ...localFeatures,
          [params.characterId]: (localFeatures[params.characterId] || []).filter(f => f.id !== params.featureId),
        });
        return;
      }

      const { error } = await supabase
        .from('character_features')
        .delete()
        .eq('id', params.featureId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-features', variables.characterId] });
      toast({ title: 'Feature Removed' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to remove feature',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

/** Convert FeatureModifiers from all active character features into CustomModifier[] */
export function featureModifiersToCustomModifiers(
  features: CharacterFeature[],
): CustomModifier[] {
  const result: CustomModifier[] = [];
  for (const feature of features) {
    if (!feature.is_active || !feature.modifiers) continue;
    for (const mod of feature.modifiers) {
      result.push({
        id: `${feature.id}-${mod.type}-${mod.target || 'all'}`,
        type: mod.type,
        target: mod.target || null,
        value: mod.value,
        source: mod.source || feature.name,
        condition: null,
        enabled: true,
      });
    }
  }
  return result;
}
