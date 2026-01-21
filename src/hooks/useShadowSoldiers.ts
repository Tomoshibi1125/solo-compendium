import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppError } from '@/lib/appError';

export interface ShadowSoldierAbility {
  name: string;
  description: string;
  action_type: string;
}

export interface ShadowSoldier {
  id: string;
  name: string;
  title: string;
  rank: string;
  description: string;
  lore: string | null;
  str: number;
  agi: number;
  vit: number;
  int: number;
  sense: number;
  pre: number;
  armor_class: number;
  hit_points: number;
  speed: number;
  damage_immunities: string[];
  condition_immunities: string[];
  abilities: ShadowSoldierAbility[];
  summon_requirements: string | null;
  shadow_type: string;
}

export interface CharacterShadowSoldier {
  id: string;
  character_id: string;
  soldier_id: string;
  nickname: string | null;
  current_hp: number;
  is_summoned: boolean;
  bond_level: number;
  soldier?: ShadowSoldier;
}

export function useCompendiumShadowSoldiers() {
  return useQuery({
    queryKey: ['compendium-shadow-soldiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compendium_shadow_soldiers')
        .select('*')
        .order('rank', { ascending: false });
      
      if (error) throw error;
      return data.map(soldier => ({
        ...soldier,
        abilities: (soldier.abilities as unknown as ShadowSoldierAbility[]) || [],
      })) as ShadowSoldier[];
    },
  });
}

export function useCharacterShadowSoldiers(characterId: string | undefined) {
  return useQuery({
    queryKey: ['character-shadow-soldiers', characterId],
    queryFn: async () => {
      if (!characterId) return [];
      
      const { data, error } = await supabase
        .from('character_shadow_soldiers')
        .select(`
          *,
          soldier:compendium_shadow_soldiers(*)
        `)
        .eq('character_id', characterId);
      
      if (error) throw error;
      return data.map(css => ({
        ...css,
        soldier: css.soldier ? {
          ...css.soldier,
          abilities: (css.soldier.abilities as unknown as ShadowSoldierAbility[]) || [],
        } : undefined,
      })) as CharacterShadowSoldier[];
    },
    enabled: !!characterId,
  });
}

export function useExtractShadowSoldier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      characterId: string;
      soldierId: string;
      nickname?: string;
    }) => {
      // Get soldier max HP
      const { data: soldier } = await supabase
        .from('compendium_shadow_soldiers')
        .select('hit_points, name')
        .eq('id', params.soldierId)
        .single();

      if (!soldier) throw new AppError('Soldier not found', 'NOT_FOUND');

      const { data, error } = await supabase
        .from('character_shadow_soldiers')
        .insert({
          character_id: params.characterId,
          soldier_id: params.soldierId,
          nickname: params.nickname || null,
          current_hp: soldier.hit_points,
          is_summoned: false,
          bond_level: 1,
        })
        .select(`
          *,
          soldier:compendium_shadow_soldiers(*)
        `)
        .single();

      if (error) throw error;
      return { ...data, soldierName: soldier.name };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-shadow-soldiers', variables.characterId] });
      toast({
        title: 'Umbral Extraction Complete!',
        description: `${data.soldierName} has joined your Umbral Legion.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Extraction Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useToggleSummon() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      characterId: string;
      shadowSoldierId: string;
      summon: boolean;
    }) => {
      const { data, error } = await supabase
        .from('character_shadow_soldiers')
        .update({ is_summoned: params.summon })
        .eq('id', params.shadowSoldierId)
        .select(`*, soldier:compendium_shadow_soldiers(name)`)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-shadow-soldiers', variables.characterId] });
      const soldierName = (data.soldier as { name: string })?.name || 'Soldier';
      toast({
        title: variables.summon ? 'Ascend!' : 'Return to the Veil',
        description: variables.summon
          ? `${soldierName} emerges from the veil!`
          : `${soldierName} returns to the veil.`,
      });
    },
  });
}

export function useUpdateSoldierHP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      characterId: string;
      shadowSoldierId: string;
      currentHp: number;
    }) => {
      const { data, error } = await supabase
        .from('character_shadow_soldiers')
        .update({ current_hp: params.currentHp })
        .eq('id', params.shadowSoldierId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-shadow-soldiers', variables.characterId] });
    },
  });
}

export function useIncreaseBondLevel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: {
      characterId: string;
      shadowSoldierId: string;
    }) => {
      // Get current bond level
      const { data: current } = await supabase
        .from('character_shadow_soldiers')
        .select('bond_level, soldier:compendium_shadow_soldiers(name)')
        .eq('id', params.shadowSoldierId)
        .single();

      if (!current) throw new AppError('Not found', 'NOT_FOUND');

      const { data, error } = await supabase
        .from('character_shadow_soldiers')
        .update({ bond_level: current.bond_level + 1 })
        .eq('id', params.shadowSoldierId)
        .select()
        .single();

      if (error) throw error;
      return { ...data, soldierName: (current.soldier as { name: string })?.name };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-shadow-soldiers', variables.characterId] });
      toast({
        title: 'Bond Strengthened!',
        description: `${data.soldierName}'s loyalty deepens. Bond Level ${data.bond_level}!`,
      });
    },
  });
}
