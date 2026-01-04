import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
// Note: These functions are defined in solo-leveling.ts but we'll use the ones from characterCalculations

type Character = Database['public']['Tables']['characters']['Row'];
type CharacterInsert = Database['public']['Tables']['characters']['Insert'];
type CharacterUpdate = Database['public']['Tables']['characters']['Update'];
type AbilityScore = Database['public']['Enums']['ability_score'];

export interface CharacterWithAbilities extends Character {
  abilities: Record<AbilityScore, number>;
}

// Fetch all characters for current user
export const useCharacters = () => {
  return useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: characters, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return characters || [];
    },
  });
};

// Fetch single character with abilities
export const useCharacter = (characterId: string) => {
  return useQuery({
    queryKey: ['character', characterId],
    queryFn: async (): Promise<CharacterWithAbilities | null> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch character
      const { data: character, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (charError) throw charError;
      if (!character) return null;

      // Fetch abilities
      const { data: abilities, error: abilitiesError } = await supabase
        .from('character_abilities')
        .select('ability, score')
        .eq('character_id', characterId);

      if (abilitiesError) throw abilitiesError;

      // Build abilities object
      const abilitiesObj: Record<AbilityScore, number> = {
        STR: 10,
        AGI: 10,
        VIT: 10,
        INT: 10,
        SENSE: 10,
        PRE: 10,
      };

      abilities?.forEach(({ ability, score }) => {
        abilitiesObj[ability] = score;
      });

      return {
        ...character,
        abilities: abilitiesObj,
      };
    },
    enabled: !!characterId,
  });
};

// Create character
export const useCreateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CharacterInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: character, error } = await supabase
        .from('characters')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      // Create default ability scores
      const defaultAbilities: AbilityScore[] = ['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'];
      const abilityInserts = defaultAbilities.map(ability => ({
        character_id: character.id,
        ability,
        score: 10,
      }));

      await supabase
        .from('character_abilities')
        .insert(abilityInserts);

      return character;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};

// Update character
export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CharacterUpdate }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: character, error } = await supabase
        .from('characters')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return character;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['character', variables.id] });
    },
  });
};

// Delete character
export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};

// Calculate derived stats (using characterCalculations instead)
// This function is kept for backwards compatibility but should use calculateCharacterStats from lib/characterCalculations
export const calculateDerivedStats = (character: CharacterWithAbilities) => {
  const level = character.level;
  // Import from characterCalculations or use inline
  const proficiencyBonus = Math.ceil(level / 4) + 1;
  const systemFavorDie = level <= 4 ? 4 : level <= 10 ? 6 : level <= 16 ? 8 : 10;

  // Calculate ability modifiers
  const getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);
  const abilityModifiers: Record<AbilityScore, number> = {
    STR: getAbilityModifier(character.abilities.STR),
    AGI: getAbilityModifier(character.abilities.AGI),
    VIT: getAbilityModifier(character.abilities.VIT),
    INT: getAbilityModifier(character.abilities.INT),
    SENSE: getAbilityModifier(character.abilities.SENSE),
    PRE: getAbilityModifier(character.abilities.PRE),
  };

  // Calculate saving throws
  const savingThrows: Record<AbilityScore, number> = {
    STR: abilityModifiers.STR + (character.saving_throw_proficiencies?.includes('STR') ? proficiencyBonus : 0),
    AGI: abilityModifiers.AGI + (character.saving_throw_proficiencies?.includes('AGI') ? proficiencyBonus : 0),
    VIT: abilityModifiers.VIT + (character.saving_throw_proficiencies?.includes('VIT') ? proficiencyBonus : 0),
    INT: abilityModifiers.INT + (character.saving_throw_proficiencies?.includes('INT') ? proficiencyBonus : 0),
    SENSE: abilityModifiers.SENSE + (character.saving_throw_proficiencies?.includes('SENSE') ? proficiencyBonus : 0),
    PRE: abilityModifiers.PRE + (character.saving_throw_proficiencies?.includes('PRE') ? proficiencyBonus : 0),
  };

  // Calculate skills (simplified - would need skill definitions)
  const skills: Record<string, number> = {};
  // This would be expanded based on skill definitions

  // Calculate initiative (AGI modifier)
  const initiative = abilityModifiers.AGI;

  // AC calculation (base 10 + AGI mod, can be modified by armor)
  const baseAC = 10 + abilityModifiers.AGI;
  // Armor would modify this, but for now use stored AC

  return {
    proficiencyBonus,
    systemFavorDie,
    abilityModifiers,
    savingThrows,
    skills,
    initiative,
    baseAC,
  };
};

