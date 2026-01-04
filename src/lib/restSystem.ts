/**
 * Rest system automation
 * Handles short rest and long rest resource restoration
 */

import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type Character = Database['public']['Tables']['characters']['Row'];
type Feature = Database['public']['Tables']['character_features']['Row'];

/**
 * Execute short rest
 * - Restore hit dice (up to half of max, rounded up)
 * - Reset short-rest recharge features
 */
export async function executeShortRest(characterId: string): Promise<void> {
  const { data: character } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single();

  if (!character) throw new Error('Hunter not found');

  // Restore hit dice (up to half of max, rounded up)
  const hitDiceToRestore = Math.ceil(character.hit_dice_max / 2);
  const newHitDiceCurrent = Math.min(
    character.hit_dice_current + hitDiceToRestore,
    character.hit_dice_max
  );

  // Update character
  await supabase
    .from('characters')
    .update({ hit_dice_current: newHitDiceCurrent })
    .eq('id', characterId);

  // Reset short-rest recharge features
  const { data: features } = await supabase
    .from('character_features')
    .select('*')
    .eq('character_id', characterId)
    .eq('recharge', 'short-rest');

  if (features && features.length > 0) {
    for (const feature of features) {
      if (feature.uses_max !== null) {
        await supabase
          .from('character_features')
          .update({ uses_current: feature.uses_max })
          .eq('id', feature.id);
      }
    }
  }
}

/**
 * Execute long rest
 * - Restore all HP
 * - Restore all hit dice
 * - Restore System Favor
 * - Reset long-rest recharge features
 * - Reduce exhaustion by 1
 * - Clear conditions
 */
export async function executeLongRest(characterId: string): Promise<void> {
  const { data: character } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single();

  if (!character) throw new Error('Hunter not found');

  // Update character
  await supabase
    .from('characters')
    .update({
      hp_current: character.hp_max,
      hit_dice_current: character.hit_dice_max,
      system_favor_current: character.system_favor_max,
      exhaustion_level: Math.max(0, character.exhaustion_level - 1),
      conditions: [],
    })
    .eq('id', characterId);

  // Reset long-rest recharge features
  const { data: features } = await supabase
    .from('character_features')
    .select('*')
    .eq('character_id', characterId)
    .eq('recharge', 'long-rest');

  if (features && features.length > 0) {
    for (const feature of features) {
      if (feature.uses_max !== null) {
        await supabase
          .from('character_features')
          .update({ uses_current: feature.uses_max })
          .eq('id', feature.id);
      }
    }
  }

  // Reset encounter recharge features (they recharge on long rest too)
  const { data: encounterFeatures } = await supabase
    .from('character_features')
    .select('*')
    .eq('character_id', characterId)
    .eq('recharge', 'encounter');

  if (encounterFeatures && encounterFeatures.length > 0) {
    for (const feature of encounterFeatures) {
      if (feature.uses_max !== null) {
        await supabase
          .from('character_features')
          .update({ uses_current: feature.uses_max })
          .eq('id', feature.id);
      }
    }
  }
}

