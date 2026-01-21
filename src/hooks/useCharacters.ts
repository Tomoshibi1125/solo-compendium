import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext, isNotFoundError } from '@/lib/errorHandling';
import { AppError } from '@/lib/appError';
import {
  createLocalCharacter,
  deleteLocalCharacter,
  getLocalCharacterWithAbilities,
  isLocalCharacterId,
  listLocalCharacters,
  updateLocalCharacter,
} from '@/lib/guestStore';
// Note: These functions are defined in system-rules.ts but we'll use the ones from characterCalculations

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
      if (!user) return listLocalCharacters(); // Guest-lite: local character(s)

      const { data: characters, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        logErrorWithContext(error, 'useCharacters');
        throw error;
      }
      return characters || [];
    },
    retry: false, // Don't retry if not authenticated
  });
};

// Fetch single character with abilities
export const useCharacter = (characterId: string, shareToken?: string) => {
  return useQuery({
    queryKey: ['character', characterId, shareToken],
    queryFn: async (): Promise<CharacterWithAbilities | null> => {
      // Guest-lite local character
      if (isLocalCharacterId(characterId)) {
        return getLocalCharacterWithAbilities(characterId) as CharacterWithAbilities | null;
      }

      // If share token provided, use it for read-only access
      if (shareToken) {
        const { data: characters, error: charError } = await supabase
          .rpc('get_character_by_share_token', {
            p_character_id: characterId,
            p_share_token: shareToken,
          });

      if (charError) {
        logErrorWithContext(charError, 'useCharacter (share token)');
        if (isNotFoundError(charError)) return null;
        throw charError;
      }
      if (!characters || characters.length === 0) return null;
        
        const char = characters[0] as Character;

        // Fetch abilities for shared character
        const { data: abilities, error: abilitiesError } = await supabase
          .from('character_abilities')
          .select('ability, score')
          .eq('character_id', characterId);

        if (abilitiesError) throw abilitiesError;

        const abilitiesObj: Record<AbilityScore, number> = {
          STR: 10, AGI: 10, VIT: 10, INT: 10, SENSE: 10, PRE: 10,
        };

        abilities?.forEach(({ ability, score }) => {
          abilitiesObj[ability] = score;
        });

        return {
          ...char,
          abilities: abilitiesObj,
        };
      }

      // Normal authenticated access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null; // Return null if not authenticated

      // Fetch character
      const { data: character, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (charError) {
        logErrorWithContext(charError, 'useCharacter');
        if (isNotFoundError(charError)) return null;
        throw charError;
      }
      if (!character) return null;

      // Fetch abilities
      const { data: abilities, error: abilitiesError } = await supabase
        .from('character_abilities')
        .select('ability, score')
        .eq('character_id', characterId);

      if (abilitiesError) {
        logErrorWithContext(abilitiesError, 'useCharacter (abilities fetch)');
        throw abilitiesError;
      }

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
    retry: false, // Don't retry if not authenticated
  });
};

// Create character
export const useCreateCharacter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<CharacterInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return createLocalCharacter(data);
      }

      const { data: character, error } = await supabase
        .from('characters')
        .insert({ ...data, user_id: user.id })
        .select()
        .single();

      if (error) {
        logErrorWithContext(error, 'useCreateCharacter');
        throw error;
      }

      // Create default ability scores
      const defaultAbilities: AbilityScore[] = ['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'];
      const abilityInserts = defaultAbilities.map(ability => ({
        character_id: character.id,
        ability,
        score: 10,
      }));

      const { error: abilitiesError } = await supabase
        .from('character_abilities')
        .insert(abilityInserts);

      if (abilitiesError) {
        logErrorWithContext(abilitiesError, 'useCreateCharacter (abilities)');
        // Don't throw - character was created, abilities can be fixed later
      }

      return character;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      toast({
        title: 'Ascendant created',
        description: 'Your Ascendant has been awakened.',
      });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useCreateCharacter');
      toast({
        title: 'Failed to create Ascendant',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

// Update character
export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CharacterUpdate }) => {
      if (isLocalCharacterId(id)) {
        const updated = updateLocalCharacter(id, data);
        if (!updated) throw new AppError('Ascendant not found', 'NOT_FOUND');
        return updated;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { data: character, error } = await supabase
        .from('characters')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        logErrorWithContext(error, 'useUpdateCharacter');
        throw error;
      }
      return character;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['character', variables.id] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useUpdateCharacter');
      toast({
        title: 'Failed to update Ascendant',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

// Delete character
export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      if (isLocalCharacterId(id)) {
        deleteLocalCharacter(id);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new AppError('Not authenticated', 'AUTH_REQUIRED');

      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        logErrorWithContext(error, 'useDeleteCharacter');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
    onError: (error) => {
      logErrorWithContext(error, 'useDeleteCharacter');
      toast({
        title: 'Failed to delete Ascendant',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    },
  });
};

// Generate share token for character
export const useGenerateShareToken = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (characterId: string): Promise<string> => {
      if (isLocalCharacterId(characterId)) {
        throw new AppError('Sharing requires a signed-in account', 'AUTH_REQUIRED');
      }

      const { data, error } = await supabase.rpc('generate_character_share_token_for_character', {
        p_character_id: characterId,
      });

      if (error) throw error;
      return data as string;
    },
    onSuccess: (_, characterId) => {
      queryClient.invalidateQueries({ queryKey: ['character', characterId] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      toast({
        title: 'Share link generated',
        description: 'Your character can now be shared via the link.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to generate share link',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Note: calculateDerivedStats was removed - use calculateCharacterStats from lib/characterCalculations instead
