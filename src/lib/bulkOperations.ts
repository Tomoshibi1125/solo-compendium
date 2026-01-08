/**
 * Bulk operations system
 * Perform operations on multiple items at once
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { error as logError } from '@/lib/logger';
import { AppError } from '@/lib/appError';

type Character = Database['public']['Tables']['characters']['Row'];
type CompendiumEquipment = Database['public']['Tables']['compendium_equipment']['Row'];

/**
 * Bulk update characters
 */
export async function bulkUpdateCharacters(
  characterIds: string[],
  updates: Partial<Character>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const id of characterIds) {
    try {
      const { error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      success++;
    } catch (error) {
      logError(`Failed to update character ${id}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Bulk delete characters
 */
export async function bulkDeleteCharacters(
  characterIds: string[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const id of characterIds) {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      success++;
    } catch (error) {
      logError(`Failed to delete character ${id}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Bulk add equipment to characters
 */
export async function bulkAddEquipment(
  characterIds: string[],
  equipmentId: string,
  quantity: number = 1
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  const resolveEquipment = async (): Promise<CompendiumEquipment | null> => {
    const { data: byId, error: byIdError } = await supabase
      .from('compendium_equipment')
      .select('*')
      .eq('id', equipmentId)
      .maybeSingle();

    if (byIdError) {
      logError('Failed to resolve equipment by ID:', byIdError);
    }

    if (byId) return byId as CompendiumEquipment;

    const { data: byName, error: byNameError } = await supabase
      .from('compendium_equipment')
      .select('*')
      .ilike('name', equipmentId)
      .limit(1)
      .maybeSingle();

    if (byNameError) {
      logError('Failed to resolve equipment by name:', byNameError);
    }

    return (byName ?? null) as CompendiumEquipment | null;
  };

  const equipment = await resolveEquipment();
  const equipmentName = equipment?.name || equipmentId;
  const itemType = equipment?.equipment_type || 'gear';

  for (const characterId of characterIds) {
    try {
      const { data: existing } = await supabase
        .from('character_equipment')
        .select('id, quantity, name')
        .eq('character_id', characterId)
        .eq('name', equipmentName)
        .maybeSingle();

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from('character_equipment')
          .update({ quantity: (existing.quantity || 1) + quantity })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('character_equipment')
          .insert({
            character_id: characterId,
            name: equipmentName,
            item_type: itemType,
            description: equipment?.description || null,
            properties: equipment?.properties || [],
            weight: equipment?.weight || null,
            value_credits: equipment?.cost_credits || null,
            quantity,
            is_equipped: false,
            is_attuned: false,
            requires_attunement: false,
            charges_current: null,
            charges_max: null,
            rarity: null,
            relic_tier: null,
          });

        if (error) throw error;
      }

      success++;
    } catch (error) {
      logError(`Failed to add equipment to character ${characterId}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Bulk level up characters
 */
export async function bulkLevelUp(
  characterIds: string[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const id of characterIds) {
    try {
      const { data: character } = await supabase
        .from('characters')
        .select('level, hp_max, hit_dice_max')
        .eq('id', id)
        .single();

      if (!character) throw new AppError('Character not found', 'NOT_FOUND');

      const newLevel = character.level + 1;
      const hpIncrease = Math.floor((character.hp_max / character.level) || 5);

      const { error } = await supabase
        .from('characters')
        .update({
          level: newLevel,
          hp_max: character.hp_max + hpIncrease,
          hp_current: character.hp_max + hpIncrease, // Full heal on level up
          hit_dice_max: newLevel,
          hit_dice_current: newLevel,
        })
        .eq('id', id);

      if (error) throw error;
      success++;
    } catch (error) {
      logError(`Failed to level up character ${id}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Bulk rest (short or long)
 */
export async function bulkRest(
  characterIds: string[],
  restType: 'short' | 'long'
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const id of characterIds) {
    try {
      const { data: character } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();

      if (!character) throw new AppError('Character not found', 'NOT_FOUND');

      if (restType === 'short') {
        const hitDiceToRestore = Math.ceil(character.hit_dice_max / 2);
        const newHitDiceCurrent = Math.min(
          character.hit_dice_current + hitDiceToRestore,
          character.hit_dice_max
        );

        await supabase
          .from('characters')
          .update({ hit_dice_current: newHitDiceCurrent })
          .eq('id', id);
      } else {
        await supabase
          .from('characters')
          .update({
            hp_current: character.hp_max,
            hit_dice_current: character.hit_dice_max,
            system_favor_current: character.system_favor_max,
            exhaustion_level: Math.max(0, character.exhaustion_level - 1),
            conditions: [],
          })
          .eq('id', id);
      }

      success++;
    } catch (error) {
      logError(`Failed to rest character ${id}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

