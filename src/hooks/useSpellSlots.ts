import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getSpellSlotsPerLevel, getCasterType } from '@/lib/characterCalculations';
import {
  getLocalCharacterState,
  isLocalCharacterId,
  listLocalSpellSlots,
  updateLocalSpellSlotRow,
  upsertLocalSpellSlot,
} from '@/lib/guestStore';
import { AppError } from '@/lib/appError';


export interface SpellSlotData {
  level: number;
  max: number;
  current: number;
  recoveredOnShortRest: boolean;
  recoveredOnLongRest: boolean;
}

/**
 * Fetch spell slots for a character
 */
export const useSpellSlots = (characterId: string, job: string | null, characterLevel: number) => {
  return useQuery({
    queryKey: ['spell-slots', characterId],
    queryFn: async (): Promise<SpellSlotData[]> => {
      if (isLocalCharacterId(characterId)) {
        // Local: ensure slots exist based on derived caster progression.
        const casterType = getCasterType(job);
        const expectedSlots = getSpellSlotsPerLevel(casterType, characterLevel);

        const existing = listLocalSpellSlots(characterId);
        const byLevel = new Map(existing.map((s) => [s.spell_level, s]));

        for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
          const maxSlots = expectedSlots[spellLevel];
          if (maxSlots <= 0) continue;
          if (byLevel.has(spellLevel)) continue;

          const row = upsertLocalSpellSlot(characterId, {
            spell_level: spellLevel,
            slots_max: maxSlots,
            slots_current: maxSlots,
            slots_recovered_on_short_rest: 0,
            slots_recovered_on_long_rest: 1,
          });
          byLevel.set(spellLevel, row);
        }

        const slots: SpellSlotData[] = [];
        for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
          const maxSlots = expectedSlots[spellLevel];
          if (maxSlots <= 0) continue;

          const row = byLevel.get(spellLevel);
          if (!row) continue;

          slots.push({
            level: spellLevel,
            max: row.slots_max ?? maxSlots,
            current: row.slots_current ?? maxSlots,
            recoveredOnShortRest: row.slots_recovered_on_short_rest === 1,
            recoveredOnLongRest: row.slots_recovered_on_long_rest === 1,
          });
        }

        return slots;
      }

      const { data, error } = await supabase
        .from('character_spell_slots')
        .select('*')
        .eq('character_id', characterId)
        .order('spell_level', { ascending: true });

      if (error) throw error;

      // Get expected slots based on caster type and level
      const casterType = getCasterType(job);
      const expectedSlots = getSpellSlotsPerLevel(casterType, characterLevel);

      // Create array of spell slot data
      const slots: SpellSlotData[] = [];
      
      for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
        const maxSlots = expectedSlots[spellLevel];
        
        // Find existing slot record
        const existing = data?.find(s => s.spell_level === spellLevel);
        
        if (maxSlots > 0 || existing) {
          slots.push({
            level: spellLevel,
            max: existing?.slots_max ?? maxSlots,
            current: existing?.slots_current ?? maxSlots,
            recoveredOnShortRest: existing?.slots_recovered_on_short_rest === 1,
            recoveredOnLongRest: existing?.slots_recovered_on_long_rest === 1,
          });
        }
      }

      return slots;
    },
    enabled: !!characterId,
  });
};

/**
 * Update spell slot current count
 */
export const useUpdateSpellSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      spellLevel,
      current,
    }: {
      characterId: string;
      spellLevel: number;
      current: number;
    }) => {
      if (isLocalCharacterId(characterId)) {
        const entry = getLocalCharacterState(characterId);
        if (!entry) throw new AppError('Ascendant not found', 'NOT_FOUND');

        const casterType = getCasterType(entry.character.job);
        const expectedSlots = getSpellSlotsPerLevel(casterType, entry.character.level);
        const maxSlots = expectedSlots[spellLevel];
        if (maxSlots <= 0) return;

        const existing = listLocalSpellSlots(characterId).find((s) => s.spell_level === spellLevel);
        if (existing) {
          updateLocalSpellSlotRow(existing.id, { slots_current: Math.max(0, current) });
        } else {
          upsertLocalSpellSlot(characterId, {
            spell_level: spellLevel,
            slots_max: maxSlots,
            slots_current: Math.max(0, current),
            slots_recovered_on_short_rest: 0,
            slots_recovered_on_long_rest: 1,
          });
        }
        return;
      }

      // Check if slot exists
      const { data: existing } = await supabase
        .from('character_spell_slots')
        .select('id')
        .eq('character_id', characterId)
        .eq('spell_level', spellLevel)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('character_spell_slots')
          .update({ slots_current: Math.max(0, current) })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new if we have a max value
        const { data: character } = await supabase
          .from('characters')
          .select('job, level')
          .eq('id', characterId)
          .single();

        if (character) {
          const casterType = getCasterType(character.job);
          const expectedSlots = getSpellSlotsPerLevel(casterType, character.level);
          const maxSlots = expectedSlots[spellLevel];

          if (maxSlots > 0) {
            const { error } = await supabase
              .from('character_spell_slots')
              .insert({
                character_id: characterId,
                spell_level: spellLevel,
                slots_max: maxSlots,
                slots_current: Math.max(0, current),
                slots_recovered_on_short_rest: 0,
                slots_recovered_on_long_rest: 1,
              });

            if (error) throw error;
          }
        }
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['spell-slots', variables.characterId] });
    },
  });
};

/**
 * Initialize spell slots for a character (called on level up or job change)
 */
export const useInitializeSpellSlots = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      job,
      level,
    }: {
      characterId: string;
      job: string | null;
      level: number;
    }) => {
      if (isLocalCharacterId(characterId)) {
        const casterType = getCasterType(job);
        const expectedSlots = getSpellSlotsPerLevel(casterType, level);

        const existing = listLocalSpellSlots(characterId);
        for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
          const maxSlots = expectedSlots[spellLevel];
          if (maxSlots <= 0) continue;

          const existingSlot = existing.find((s) => s.spell_level === spellLevel);
          const newCurrent = existingSlot ? Math.min(existingSlot.slots_current, maxSlots) : maxSlots;

          upsertLocalSpellSlot(characterId, {
            spell_level: spellLevel,
            slots_max: maxSlots,
            slots_current: newCurrent,
            slots_recovered_on_short_rest: existingSlot?.slots_recovered_on_short_rest ?? 0,
            slots_recovered_on_long_rest: existingSlot?.slots_recovered_on_long_rest ?? 1,
          });
        }

        return;
      }

      const casterType = getCasterType(job);
      const expectedSlots = getSpellSlotsPerLevel(casterType, level);

      // Get existing slots
      const { data: existing } = await supabase
        .from('character_spell_slots')
        .select('*')
        .eq('character_id', characterId);

      const operations: Array<PromiseLike<unknown>> = [];

      for (let spellLevel = 1; spellLevel <= 9; spellLevel++) {
        const maxSlots = expectedSlots[spellLevel];
        const existingSlot = existing?.find(s => s.spell_level === spellLevel);

        if (maxSlots > 0) {
          if (existingSlot) {
            // Update max, preserve current if it's valid
            const newCurrent = Math.min(existingSlot.slots_current, maxSlots);
            operations.push(
              supabase
                .from('character_spell_slots')
                .update({
                  slots_max: maxSlots,
                  slots_current: newCurrent,
                })
                .eq('id', existingSlot.id)
            );
          } else {
            // Create new slot
            operations.push(
              supabase
                .from('character_spell_slots')
                .insert({
                  character_id: characterId,
                  spell_level: spellLevel,
                  slots_max: maxSlots,
                  slots_current: maxSlots,
                  slots_recovered_on_short_rest: 0,
                  slots_recovered_on_long_rest: 1,
                })
            );
          }
        } else if (existingSlot) {
          // Remove slot if no longer needed
          operations.push(
            supabase
              .from('character_spell_slots')
              .delete()
              .eq('id', existingSlot.id)
          );
        }
      }

      await Promise.all(operations);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['spell-slots', variables.characterId] });
      queryClient.invalidateQueries({ queryKey: ['character', variables.characterId] });
    },
  });
};

/**
 * Recover spell slots on rest
 */
export const useRecoverSpellSlots = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      restType,
    }: {
      characterId: string;
      restType: 'short' | 'long';
    }) => {
      if (isLocalCharacterId(characterId)) {
        const slots = listLocalSpellSlots(characterId);
        for (const slot of slots) {
          if (restType === 'long') {
            updateLocalSpellSlotRow(slot.id, { slots_current: slot.slots_max });
          } else {
            if (slot.slots_recovered_on_short_rest === 1) {
              updateLocalSpellSlotRow(slot.id, { slots_current: slot.slots_max });
            }
          }
        }
        return;
      }

      const { data: slots } = await supabase
        .from('character_spell_slots')
        .select('*')
        .eq('character_id', characterId);

      if (!slots) return;

      const operations = slots.map(slot => {
        if (restType === 'long') {
          // Long rest: recover all slots
          return supabase
            .from('character_spell_slots')
            .update({ slots_current: slot.slots_max })
            .eq('id', slot.id);
        } else {
          // Short rest: only recover slots that are marked for short rest recovery
          if (slot.slots_recovered_on_short_rest === 1) {
            return supabase
              .from('character_spell_slots')
              .update({ slots_current: slot.slots_max })
              .eq('id', slot.id);
          }
          return Promise.resolve({ data: null, error: null });
        }
      });

      await Promise.all(operations);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['spell-slots', variables.characterId] });
    },
  });
};

