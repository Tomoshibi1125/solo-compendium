/**
 * Unified Effects Engine
 * 
 * Provides a centralized system for applying and removing effects from characters.
 * Replaces ad-hoc automation logic with structured effect/modifier plumbing.
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { logger } from './logger';

type Character = Database['public']['Tables']['characters']['Row'];

/**
 * Effect types that can be applied to characters
 */
export type EffectType = 
  | 'modifier'      // Modifies a stat (AC, speed, ability, etc.)
  | 'resource'      // Modifies a resource (HP max, slots, uses, etc.)
  | 'validation'    // Validates prerequisites/requirements
  | 'roll_tag';     // Adds roll tags (advantage, disadvantage, rerolls)

/**
 * Effect target - what the effect modifies
 */
export type EffectTarget = 
  // Modifiers
  | 'ac' | 'speed' | 'initiative'
  | 'str' | 'agi' | 'vit' | 'int' | 'sense' | 'pre'
  | 'attack_bonus' | 'damage_bonus'
  | 'saving_throw' | 'skill'
  // Resources
  | 'hp_max' | 'hp_current' | 'hp_temp'
  | 'hit_dice_max' | 'hit_dice_current'
  | 'system_favor_max' | 'system_favor_current'
  | 'spell_slots' | 'feature_uses'
  // Roll tags
  | 'advantage' | 'disadvantage' | 'reroll' | 'minimum_roll';

/**
 * Effect source - where the effect comes from
 */
export interface EffectSource {
  sourceType: 'equipment' | 'feature' | 'condition' | 'rune' | 'level' | 'job' | 'path';
  sourceId: string;
  sourceName?: string;
}

/**
 * Effect definition
 */
export interface Effect {
  type: EffectType;
  target: EffectTarget;
  value: number | string | boolean | Record<string, unknown>;
  condition?: string; // Optional condition for when effect applies
  priority?: number; // Lower = applied first (default: 100)
}

/**
 * Active effect on a character
 */
export interface ActiveEffect extends Effect {
  source: EffectSource;
  appliedAt: string;
}

/**
 * Effect application result
 */
export interface EffectApplicationResult {
  characterId: string;
  effectsApplied: number;
  effectsRemoved: number;
  errors: string[];
}

/**
 * Apply effects to a character
 * 
 * Effects are calculated and applied to character stats, but not persisted.
 * The character sheet calculates final stats by applying all active effects.
 * 
 * @param characterId - Character to apply effects to
 * @param effects - Effects to apply
 * @param source - Source of the effects
 */
export async function applyEffects(
  characterId: string,
  effects: Effect[],
  source: EffectSource
): Promise<EffectApplicationResult> {
  const result: EffectApplicationResult = {
    characterId,
    effectsApplied: 0,
    effectsRemoved: 0,
    errors: [],
  };

  try {
    // Fetch character to validate it exists
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('id')
      .eq('id', characterId)
      .single();

    if (charError || !character) {
      result.errors.push(`Character not found: ${characterId}`);
      return result;
    }

    // Effects are applied at calculation time, not persisted
    // The character sheet will calculate final stats by:
    // 1. Getting base stats
    // 2. Getting all active effects (from equipment, features, conditions, runes)
    // 3. Applying effects in priority order
    // 4. Displaying final calculated stats

    // Apply effects in priority order and validate they are well-formed
    for (const effect of effects) {
      if (!effect.type || !effect.target) {
        result.errors.push(`Invalid effect: missing type or target`);
        continue;
      }

      // Validate effect value based on type
      switch (effect.type) {
        case 'modifier':
          if (typeof effect.value !== 'number') {
            result.errors.push(`Modifier effect must have numeric value`);
            continue;
          }
          break;
        case 'resource':
          if (typeof effect.value !== 'number' && typeof effect.value !== 'string') {
            result.errors.push(`Resource effect must have numeric or string value`);
            continue;
          }
          break;
        case 'validation':
          if (typeof effect.value !== 'boolean') {
            result.errors.push(`Validation effect must have boolean value`);
            continue;
          }
          break;
        case 'roll_tag':
          if (typeof effect.value !== 'boolean' && typeof effect.value !== 'string') {
            result.errors.push(`Roll tag effect must have boolean or string value`);
            continue;
          }
          break;
        default:
          result.errors.push(`Unknown effect type: ${effect.type}`);
      }

      result.effectsApplied++;
    }

    // Log effect application
    logger.log(`Applied ${result.effectsApplied} effects from ${source.sourceType}:${source.sourceId} to character ${characterId}`);

    return result;
  } catch (error) {
    logger.error('Error applying effects:', error);
    result.errors.push(`Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
}

/**
 * Remove effects from a character
 * 
 * @param characterId - Character to remove effects from
 * @param sourceId - Source ID to remove effects for
 */
export async function removeEffects(
  characterId: string,
  sourceId: string
): Promise<EffectApplicationResult> {
  const result: EffectApplicationResult = {
    characterId,
    effectsApplied: 0,
    effectsRemoved: 1, // We're removing effects
    errors: [],
  };

  try {
    // Fetch character to validate it exists
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('id')
      .eq('id', characterId)
      .single();

    if (charError || !character) {
      result.errors.push(`Character not found: ${characterId}`);
      return result;
    }

    // Effects are removed at calculation time
    // The character sheet will recalculate stats without effects from this source

    logger.log(`Removed effects from source ${sourceId} for character ${characterId}`);

    return result;
  } catch (error) {
    logger.error('Error removing effects:', error);
    result.errors.push(`Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
}

/**
 * Get all active effects for a character
 * 
 * This aggregates effects from:
 * - Equipped equipment (with attunement check)
 * - Active features
 * - Active conditions
 * - Active rune inscriptions
 * - Level-based effects
 * 
 * @param characterId - Character to get effects for
 * @returns Array of active effects
 */
export async function getActiveEffects(characterId: string): Promise<ActiveEffect[]> {
  const activeEffects: ActiveEffect[] = [];

  try {
    // Fetch character
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single();

    if (charError || !character) {
      return activeEffects;
    }

    // Get equipped equipment
    const { data: equipment } = await supabase
      .from('character_equipment')
      .select('*')
      .eq('character_id', characterId)
      .eq('is_equipped', true);

    if (equipment) {
      for (const item of equipment) {
        // Check attunement requirement
        if (item.requires_attunement && !item.is_attuned) {
          continue;
        }

        // Parse equipment properties into effects
        if (item.properties && item.properties.length > 0) {
          const { parseModifiers } = await import('./equipmentModifiers');
          const modifiers = parseModifiers(item.properties);

          // Convert modifiers to effects
          if (modifiers.ac !== undefined) {
            activeEffects.push({
              type: 'modifier',
              target: 'ac',
              value: modifiers.ac,
              source: {
                sourceType: 'equipment',
                sourceId: item.id,
                sourceName: item.name,
              },
              appliedAt: new Date().toISOString(),
            });
          }

          if (modifiers.speed !== undefined) {
            activeEffects.push({
              type: 'modifier',
              target: 'speed',
              value: modifiers.speed,
              source: {
                sourceType: 'equipment',
                sourceId: item.id,
                sourceName: item.name,
              },
              appliedAt: new Date().toISOString(),
            });
          }

          // Add ability modifiers
          ['str', 'agi', 'vit', 'int', 'sense', 'pre'].forEach(ability => {
            const modifier = modifiers[ability as keyof typeof modifiers];
            if (typeof modifier === 'number' && modifier !== 0) {
              activeEffects.push({
                type: 'modifier',
                target: ability as EffectTarget,
                value: modifier,
                source: {
                  sourceType: 'equipment',
                  sourceId: item.id,
                  sourceName: item.name,
                },
                appliedAt: new Date().toISOString(),
              });
            }
          });

          if (modifiers.attack !== undefined) {
            activeEffects.push({
              type: 'modifier',
              target: 'attack_bonus',
              value: modifiers.attack,
              source: {
                sourceType: 'equipment',
                sourceId: item.id,
                sourceName: item.name,
              },
              appliedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    // Get active conditions
    if (character.conditions && character.conditions.length > 0) {
      const { CONDITIONS } = await import('./conditions');
      
      for (const conditionName of character.conditions) {
        const condition = CONDITIONS[conditionName];
        if (!condition) continue;

        // Add condition effects
        if (condition.mechanical.speedModifier !== undefined) {
          activeEffects.push({
            type: 'modifier',
            target: 'speed',
            value: condition.mechanical.speedModifier === 'zero' ? -999 : condition.mechanical.speedModifier,
            source: {
              sourceType: 'condition',
              sourceId: conditionName,
              sourceName: condition.name,
            },
            appliedAt: new Date().toISOString(),
          });
        }

        // Add disadvantage effects
        if (condition.mechanical.disadvantageOn) {
          for (const target of condition.mechanical.disadvantageOn) {
            activeEffects.push({
              type: 'roll_tag',
              target: 'disadvantage',
              value: true,
              condition: target,
              source: {
                sourceType: 'condition',
                sourceId: conditionName,
                sourceName: condition.name,
              },
              appliedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    // Get active rune inscriptions with equipment and rune data
    // Note: We'll fetch equipment separately to check if it's equipped/attuned
    const { data: runeInscriptions } = await supabase
      .from('character_rune_inscriptions')
      .select('*')
      .eq('character_id', characterId)
      .eq('is_active', true);

    if (runeInscriptions) {
      for (const inscription of runeInscriptions) {
        // Check if equipment is equipped and attuned (if required)
        const { data: equipment } = await supabase
          .from('character_equipment')
          .select('is_equipped, is_attuned, requires_attunement')
          .eq('id', inscription.equipment_id)
          .single();

        if (!equipment || !equipment.is_equipped || (equipment.requires_attunement && !equipment.is_attuned)) {
          continue;
        }

        // Get rune data
        const { data: runeData, error: runeError } = await supabase
          .from('compendium_runes')
          .select('passive_bonuses')
          .eq('id', inscription.rune_id)
          .single();

        if (runeError || !runeData) continue;

        // Type guard for runeData
        const runeRecord = runeData as unknown as { passive_bonuses?: unknown };
        if (!runeRecord.passive_bonuses) continue;

        const bonuses = runeRecord.passive_bonuses as Record<string, unknown>;

        // Add rune effects
        if (typeof bonuses.ac_bonus === 'number') {
          activeEffects.push({
            type: 'modifier',
            target: 'ac',
            value: bonuses.ac_bonus,
            source: {
              sourceType: 'rune',
              sourceId: inscription.rune_id,
              sourceName: `Rune ${inscription.rune_id}`,
            },
            appliedAt: new Date().toISOString(),
          });
        }

        if (typeof bonuses.speed_bonus === 'number') {
          activeEffects.push({
            type: 'modifier',
            target: 'speed',
            value: bonuses.speed_bonus,
            source: {
              sourceType: 'rune',
              sourceId: inscription.rune_id,
              sourceName: `Rune ${inscription.rune_id}`,
            },
            appliedAt: new Date().toISOString(),
          });
        }

        // Add ability bonuses
        ['str', 'agi', 'vit', 'int', 'sense', 'pre'].forEach(ability => {
          const bonus = bonuses[`${ability}_bonus`];
          if (typeof bonus === 'number' && bonus !== 0) {
            activeEffects.push({
              type: 'modifier',
              target: ability as EffectTarget,
              value: bonus,
              source: {
                sourceType: 'rune',
                sourceId: inscription.rune_id,
                sourceName: `Rune ${inscription.rune_id}`,
              },
              appliedAt: new Date().toISOString(),
            });
          }
        });
      }
    }

    return activeEffects;
  } catch (error) {
    logger.error('Error getting active effects:', error);
    return activeEffects;
  }
}

/**
 * Calculate final stats by applying all active effects
 * 
 * @param baseStats - Base character stats
 * @param effects - Active effects to apply
 * @returns Final calculated stats
 */
export function calculateFinalStats(
  baseStats: {
    ac: number;
    speed: number;
    abilities: Record<string, number>;
    attackBonus: number;
    [key: string]: unknown;
  },
  effects: ActiveEffect[]
): {
  ac: number;
  speed: number;
  abilities: Record<string, number>;
  attackBonus: number;
  [key: string]: unknown;
} {
  const finalStats = { ...baseStats };

  // Sort effects by priority (lower = applied first)
  const sortedEffects = [...effects].sort((a, b) => (a.priority || 100) - (b.priority || 100));

  for (const effect of sortedEffects) {
    if (effect.type !== 'modifier') continue;
    if (typeof effect.value !== 'number') continue;

    switch (effect.target) {
      case 'ac':
        finalStats.ac = (finalStats.ac || 10) + effect.value;
        break;
      case 'speed':
        finalStats.speed = (finalStats.speed || 30) + effect.value;
        break;
      case 'str':
      case 'agi':
      case 'vit':
      case 'int':
      case 'sense':
      case 'pre':
        finalStats.abilities[effect.target] = (finalStats.abilities[effect.target] || 0) + effect.value;
        break;
      case 'attack_bonus':
        finalStats.attackBonus = (finalStats.attackBonus || 0) + effect.value;
        break;
    }
  }

  return finalStats;
}
