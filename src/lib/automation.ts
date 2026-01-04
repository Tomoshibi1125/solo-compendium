/**
 * Advanced automation system
 * Auto-calculations, auto-applications, and smart defaults
 */

import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { getProficiencyBonus, getSystemFavorDie } from '@/types/solo-leveling';
import { error as logError } from '@/lib/logger';

function getSystemFavorMax(level: number): number {
  if (level <= 4) return 3;
  if (level <= 10) return 4;
  if (level <= 16) return 5;
  return 6;
}

type Character = Database['public']['Tables']['characters']['Row'];
type Feature = Database['public']['Tables']['character_features']['Row'];

/**
 * Auto-calculate and update all character derived stats
 */
export async function autoCalculateCharacterStats(characterId: string): Promise<void> {
  const { data: character } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single();

  if (!character) throw new Error('Character not found');

  const updates: Partial<Character> = {};

  // Auto-calculate proficiency bonus
  updates.proficiency_bonus = getProficiencyBonus(character.level);

  // Auto-calculate System Favor
  updates.system_favor_die = getSystemFavorDie(character.level);
  updates.system_favor_max = getSystemFavorMax(character.level);

  // Auto-calculate shadow energy max (if applicable)
  const shadowEnergyMax = (character as Character & { shadow_energy_max?: number | null }).shadow_energy_max;
  if (shadowEnergyMax !== null && shadowEnergyMax !== undefined) {
    const calculatedMax = calculateShadowEnergyMax(character.level);
    if (shadowEnergyMax !== calculatedMax) {
      (updates as Partial<Character & { shadow_energy_max?: number; shadow_energy_current?: number }>).shadow_energy_max = calculatedMax;
      // If current is higher than new max, cap it
      const shadowEnergyCurrent = (character as Character & { shadow_energy_current?: number | null }).shadow_energy_current;
      if ((shadowEnergyCurrent ?? 0) > calculatedMax) {
        (updates as Partial<Character & { shadow_energy_current?: number }>).shadow_energy_current = calculatedMax;
      }
    }
  }

  // Update character
  await supabase
    .from('characters')
    .update(updates)
    .eq('id', characterId);
}

/**
 * Calculate shadow energy max based on level
 */
function calculateShadowEnergyMax(level: number): number {
  if (level <= 4) return 10;
  if (level <= 8) return 25;
  if (level <= 12) return 50;
  if (level <= 16) return 100;
  return 200;
}

/**
 * Auto-apply conditions with duration tracking
 */
export async function autoApplyCondition(
  characterId: string,
  condition: string,
  duration?: number // in rounds/turns
): Promise<void> {
  const { data: character } = await supabase
    .from('characters')
    .select('conditions')
    .eq('id', characterId)
    .single();

  if (!character) throw new Error('Character not found');

  const conditions = character.conditions || [];
  if (!conditions.includes(condition)) {
    await supabase
      .from('characters')
      .update({
        conditions: [...conditions, condition],
      })
      .eq('id', characterId);
  }

  // If duration specified, could set up a timer to auto-remove
  // This would require a background job or client-side timer
}

/**
 * Auto-calculate feature uses from formula
 */
export function calculateFeatureUses(
  formula: string | null,
  level: number,
  proficiencyBonus: number
): number | null {
  if (!formula) return null;

  // Parse formulas like "proficiency bonus", "level", "2", "level / 2"
  const lowerFormula = formula.toLowerCase().trim();

  if (lowerFormula === 'proficiency bonus' || lowerFormula === 'pb') {
    return proficiencyBonus;
  }

  if (lowerFormula === 'level' || lowerFormula === 'lvl') {
    return level;
  }

  // Try to evaluate simple math expressions safely (without eval)
  try {
    const expression = lowerFormula
      .replace(/proficiency bonus/gi, proficiencyBonus.toString())
      .replace(/pb/gi, proficiencyBonus.toString())
      .replace(/level/gi, level.toString())
      .replace(/lvl/gi, level.toString());
    
    // Only allow safe math operations - use Function constructor instead of eval for better isolation
    // This is still risky but slightly safer than direct eval, and we validate the input
    if (/^[\d+\-*/().\s]+$/.test(expression)) {
      // Use Function constructor with strict mode and no global access
      // Note: This is safer than eval as it creates an isolated scope, but still requires validation
      // Input is validated to only contain math operations before execution
      const result = new Function('"use strict"; return (' + expression + ')')();
      return Math.floor(Number(result));
    }
  } catch {
    // Invalid expression
  }

  // Try parsing as a number
  const num = parseInt(lowerFormula);
  if (!isNaN(num)) return num;

  return null;
}

/**
 * Auto-update feature uses when level changes
 */
export async function autoUpdateFeatureUses(characterId: string): Promise<void> {
  const { data: character } = await supabase
    .from('characters')
    .select('level')
    .eq('id', characterId)
    .single();

  if (!character) return;

  const proficiencyBonus = getProficiencyBonus(character.level);

  const { data: features } = await supabase
    .from('character_features')
    .select('*')
    .eq('character_id', characterId);

  if (!features) return;

  for (const feature of features) {
    const usesFormula = (feature as Feature & { uses_formula?: string | null }).uses_formula;
    if (usesFormula) {
      const newMax = calculateFeatureUses(
        usesFormula,
        character.level,
        proficiencyBonus
      );

      if (newMax !== null && feature.uses_max !== newMax) {
        await supabase
          .from('character_features')
          .update({
            uses_max: newMax,
            uses_current: Math.min(feature.uses_current ?? newMax, newMax),
          })
          .eq('id', feature.id);
      }
    }
  }
}

/**
 * Auto-apply equipment modifiers to character stats
 */
export async function autoApplyEquipmentModifiers(characterId: string): Promise<void> {
  // This would recalculate AC, speed, ability modifiers from equipment
  // Implementation would use equipmentModifiers.ts functions
  // Called when equipment is equipped/unequipped
}

/**
 * Auto-save character data with debouncing
 * Uses a Map to track timeouts per character to avoid conflicts
 */
const saveTimeouts = new Map<string, NodeJS.Timeout>();

export function autoSaveCharacter(
  characterId: string,
  updates: Partial<Character>,
  delay: number = 1000
): void {
  // Clear existing timeout for this character
  const existingTimeout = saveTimeouts.get(characterId);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  // Set new timeout for this character
  const timeout = setTimeout(async () => {
    try {
      await supabase
        .from('characters')
        .update(updates)
        .eq('id', characterId);
    } catch (error) {
      logError('Auto-save failed:', error);
    } finally {
      // Clean up timeout from map
      saveTimeouts.delete(characterId);
    }
  }, delay);

  saveTimeouts.set(characterId, timeout);
}

/**
 * Cancel auto-save for a specific character
 */
export function cancelAutoSave(characterId: string): void {
  const timeout = saveTimeouts.get(characterId);
  if (timeout) {
    clearTimeout(timeout);
    saveTimeouts.delete(characterId);
  }
}

/**
 * Auto-calculate encounter difficulty
 */
export function autoCalculateEncounterDifficulty(
  totalXP: number,
  hunterLevel: number,
  hunterCount: number
): {
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  adjustedXP: number;
  threshold: number;
} {
  const multiplier = hunterCount === 1 ? 1 
    : hunterCount <= 2 ? 1.5 
    : hunterCount <= 6 ? 2 
    : 2.5;
  
  const adjustedXP = totalXP * multiplier;

  const thresholds = {
    easy: { 1: 25, 2: 50, 3: 75, 4: 100, 5: 125, 6: 150, 7: 175, 8: 200, 9: 225, 10: 250 },
    medium: { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250, 6: 300, 7: 350, 8: 400, 9: 450, 10: 500 },
    hard: { 1: 75, 2: 150, 3: 225, 4: 300, 5: 375, 6: 450, 7: 525, 8: 600, 9: 675, 10: 750 },
    deadly: { 1: 100, 2: 200, 3: 300, 4: 450, 5: 550, 6: 600, 7: 750, 8: 900, 9: 1100, 10: 1200 },
  };

  const levelKey = Math.min(hunterLevel, 10) as keyof typeof thresholds.easy;

  let difficulty: 'easy' | 'medium' | 'hard' | 'deadly' = 'easy';
  let threshold = thresholds.easy[levelKey];

  if (adjustedXP >= thresholds.deadly[levelKey]) {
    difficulty = 'deadly';
    threshold = thresholds.deadly[levelKey];
  } else if (adjustedXP >= thresholds.hard[levelKey]) {
    difficulty = 'hard';
    threshold = thresholds.hard[levelKey];
  } else if (adjustedXP >= thresholds.medium[levelKey]) {
    difficulty = 'medium';
    threshold = thresholds.medium[levelKey];
  }

  return { difficulty, adjustedXP, threshold };
}

/**
 * Auto-suggest equipment based on character
 */
export async function autoSuggestEquipment(
  characterId: string
): Promise<Array<{ id: string; name: string; reason: string }>> {
  const { data: character } = await supabase
    .from('characters')
    .select('job, level, equipment:character_equipment(*)')
    .eq('id', characterId)
    .single();

  if (!character) return [];

  const suggestions: Array<{ id: string; name: string; reason: string }> = [];

  // Suggest equipment based on job and level
  // This would query compendium_equipment for appropriate items
  // Implementation would be more complex in reality

  return suggestions;
}

