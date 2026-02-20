import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';
import { isLocalCharacterId, setLocalAbilities } from '@/lib/guestStore';
import type { AbilityScore, Character } from '@/lib/5eRulesEngine';
import { createCharacterSheet, CharacterSheetSystem } from '@/lib/5eCharacterSheet';
import { SpellSystem } from '@/lib/5eSpellSystem';

export interface CharacterWithAbilities extends Character {
  abilities: Record<AbilityScore, number>;
}

const untypedSupabase = supabase as unknown as {
  from: (table: string) => any;
};

export const use5eCharacter = (characterId: string) => {
  return useQuery({
    queryKey: ['5e-character', characterId],
    queryFn: async (): Promise<CharacterWithAbilities> => {
      // Get base character data
      const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single();

      if (error) {
        logErrorWithContext(error, 'use5eCharacter');
        throw error;
      }

      // Get abilities
      const { data: abilities } = await supabase
        .from('character_abilities')
        .select('ability, score')
        .eq('character_id', characterId);

      const abilityMap: Record<AbilityScore, number> = {
        STR: 10,
        AGI: 10,
        VIT: 10,
        INT: 10,
        SENSE: 10,
        PRE: 10
      };

      abilities?.forEach(({ ability, score }) => {
        if (ability in abilityMap) {
          abilityMap[ability as AbilityScore] = score;
        }
      });

      return {
        ...character,
        abilities: abilityMap,
      } as unknown as CharacterWithAbilities;
    },
  });
};

export const use5eCharacterSheet = (characterId: string) => {
  const characterQuery = use5eCharacter(characterId);
  
  return useQuery({
    queryKey: ['5e-character-sheet', characterId],
    queryFn: async () => {
      if (!characterQuery.data) return null;
      return createCharacterSheet(characterQuery.data);
    },
    enabled: !!characterQuery.data,
  });
};

export const use5eSpellSlots = (characterId: string) => {
  return useQuery({
    queryKey: ['5e-spell-slots', characterId],
    queryFn: async () => {
      const characterQuery = await use5eCharacter(characterId);
      if (!characterQuery.data) return null;
      
      return SpellSystem.getCharacterSpellSlots(characterQuery.data);
    },
  });
};

export const use5eCombatActions = (characterId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const applyDamage = useMutation({
    mutationFn: async (damage: number) => {
      const characterQuery = await use5eCharacter(characterId);
      if (!characterQuery.data) throw new Error('Character not found');
      
      const sheet = createCharacterSheet(characterQuery.data);
      const updatedSheet = CharacterSheetSystem.applyDamage(sheet, damage);
      
      // Update character HP
      const { error } = await supabase
        .from('characters')
        .update({
          hp_current: updatedSheet.character.hitPoints.current,
          hp_temp: updatedSheet.character.hitPoints.temp
        })
        .eq('id', characterId);

      if (error) {
        logErrorWithContext(error, 'applyDamage');
        throw error;
      }

      return updatedSheet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['5e-character', characterId] });
      queryClient.invalidateQueries({ queryKey: ['5e-character-sheet', characterId] });
      toast({
        title: 'Damage Applied',
        description: 'Character damage updated successfully.',
      });
    },
  });

  const applyHealing = useMutation({
    mutationFn: async (healing: number) => {
      const characterQuery = await use5eCharacter(characterId);
      if (!characterQuery.data) throw new Error('Character not found');
      
      const sheet = createCharacterSheet(characterQuery.data);
      const updatedSheet = CharacterSheetSystem.applyHealing(sheet, healing);
      
      // Update character HP
      const { error } = await supabase
        .from('characters')
        .update({
          hp_current: updatedSheet.character.hitPoints.current,
          hp_temp: updatedSheet.character.hitPoints.temp
        })
        .eq('id', characterId);

      if (error) {
        logErrorWithContext(error, 'applyHealing');
        throw error;
      }

      return updatedSheet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['5e-character', characterId] });
      queryClient.invalidateQueries({ queryKey: ['5e-character-sheet', characterId] });
      toast({
        title: 'Healing Applied',
        description: 'Character healing updated successfully.',
      });
    },
  });

  const longRest = useMutation({
    mutationFn: async () => {
      const characterQuery = await use5eCharacter(characterId);
      if (!characterQuery.data) throw new Error('Character not found');
      
      const sheet = createCharacterSheet(characterQuery.data);
      const updatedSheet = CharacterSheetSystem.longRest(sheet);
      
      // Update character for long rest
      const { error } = await supabase
        .from('characters')
        .update({
          hp_current: updatedSheet.character.hitPoints.current,
          hp_temp: 0,
          hit_dice_current: updatedSheet.character.hitDice.current,
          system_favor_current: updatedSheet.character.systemFavor.current,
          conditions: [],
          exhaustion_level: Math.max(0, updatedSheet.character.exhaustionLevel - 1)
        })
        .eq('id', characterId);

      if (error) {
        logErrorWithContext(error, 'longRest');
        throw error;
      }

      // Reset spell slots
      const spellSlots = SpellSystem.getCharacterSpellSlots(updatedSheet.character);
      for (const [level, slots] of Object.entries(spellSlots)) {
        if (level !== 'cantrips') {
          await untypedSupabase
            .from('spell_slots')
            .update({ slots_current: slots })
            .eq('character_id', characterId)
            .eq('spell_level', parseInt(level.replace('level', '')));
        }
      }

      return updatedSheet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['5e-character', characterId] });
      queryClient.invalidateQueries({ queryKey: ['5e-character-sheet', characterId] });
      queryClient.invalidateQueries({ queryKey: ['5e-spell-slots', characterId] });
      toast({
        title: 'Long Rest Complete',
        description: 'All resources restored. Features recharged.',
      });
    },
  });

  return {
    applyDamage,
    applyHealing,
    longRest
  };
};

export const use5eSpellCasting = (characterId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const castSpell = useMutation({
    mutationFn: async (spellId: string) => {
      const characterQuery = await use5eCharacter(characterId);
      if (!characterQuery.data) throw new Error('Character not found');
      
      // Check if spell can be cast
      const canCast = (SpellSystem as any).canCastSpell(characterQuery.data, spellId) as boolean;
      if (!canCast) {
        throw new Error('Cannot cast spell: insufficient spell slots or spell not prepared');
      }

      // Cast spell (consume slot)
      const updatedCharacter = (SpellSystem as any).castSpell(characterQuery.data, spellId) as any;
      
      // Update spell slots in database
      const spellSlots = SpellSystem.getCharacterSpellSlots(updatedCharacter as Character);
      for (const [level, slots] of Object.entries(spellSlots)) {
        if (level !== 'cantrips') {
          await untypedSupabase
            .from('spell_slots')
            .update({ slots_current: slots })
            .eq('character_id', characterId)
            .eq('spell_level', parseInt(level.replace('level', '')));
        }
      }

      return updatedCharacter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['5e-spell-slots', characterId] });
      toast({
        title: 'Spell Cast',
        description: 'Spell cast successfully.',
      });
    },
  });

  const prepareSpells = useMutation({
    mutationFn: async (spellIds: string[]) => {
      const characterQuery = await use5eCharacter(characterId);
      if (!characterQuery.data) throw new Error('Character not found');
      
      // Prepare spells
      const updatedCharacter = (SpellSystem as any).prepareSpells(characterQuery.data, spellIds) as any;
      
      // Update prepared spells in database
      const { error } = await untypedSupabase
        .from('character_prepared_spells')
        .delete()
        .eq('character_id', characterId);

      if (error) {
        logErrorWithContext(error, 'prepareSpells - delete');
        throw error;
      }

      const preparedRows = spellIds.map(spellId => ({
        character_id: characterId,
        spell_id: spellId,
        prepared: true
      }));

      const { error: insertError } = await untypedSupabase
        .from('character_prepared_spells')
        .insert(preparedRows);

      if (insertError) {
        logErrorWithContext(insertError, 'prepareSpells - insert');
        throw insertError;
      }

      return updatedCharacter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['5e-character-sheet', characterId] });
      toast({
        title: 'Spells Prepared',
        description: 'Spell preparation updated successfully.',
      });
    },
  });

  return {
    castSpell,
    prepareSpells
  };
};
