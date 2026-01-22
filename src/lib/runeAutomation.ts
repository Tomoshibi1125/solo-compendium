import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { logger } from './logger';

type Rune = Database['public']['Tables']['compendium_runes']['Row'];

/**
 * Automatically learn runes based on character progression
 * Some runes may be learned through features or as rewards
 */
export async function autoLearnRunes(
  characterId: string,
  runeIds: string[],
  isMastered: boolean = false
): Promise<void> {
  try {
    for (const runeId of runeIds) {
      await supabase
        .from('character_rune_knowledge')
        .upsert({
          character_id: characterId,
          rune_id: runeId,
          mastery_level: isMastered ? 5 : 1,
          can_teach: isMastered,
        }, {
          onConflict: 'character_id,rune_id',
        });
    }
  } catch (error) {
    logger.error('Failed to auto-learn runes:', error);
    throw error;
  }
}

/**
 * Check if character can inscribe a rune on equipment
 * Validates requirements, equipment type, and existing inscriptions
 */
export async function canInscribeRune(
  characterId: string,
  equipmentId: string,
  runeId: string
): Promise<{ canInscribe: boolean; reason?: string }> {
  try {
    // Get character data
    const { data: character, error: charError } = await supabase
      .from('characters')
      .select(`
        *,
        abilities:character_abilities(*)
      `)
      .eq('id', characterId)
      .single();

    if (charError || !character) {
      return { canInscribe: false, reason: 'Character not found' };
    }

    // Get rune data
    const { data: rune, error: runeError } = await supabase
      .from('compendium_runes')
      .select('*')
      .eq('id', runeId)
      .single();

    if (runeError || !rune) {
      return { canInscribe: false, reason: 'Rune not found' };
    }

    // Get equipment data
    const { data: equipment, error: equipError } = await supabase
      .from('character_equipment')
      .select('*')
      .eq('id', equipmentId)
      .eq('character_id', characterId)
      .single();

    if (equipError || !equipment) {
      return { canInscribe: false, reason: 'Equipment not found' };
    }

    // Check if equipment type is compatible
    const equipmentTypeMap: Record<string, string> = {
      weapon: 'weapon',
      armor: 'armor',
      relic: 'accessory',
      gear: 'accessory',
      consumable: 'accessory',
    };

    const equipType = equipmentTypeMap[equipment.item_type || 'gear'] || 'universal';
    
    if (!rune.can_inscribe_on?.includes(equipType) && !rune.can_inscribe_on?.includes('universal')) {
      return { canInscribe: false, reason: `This rune cannot be inscribed on ${equipment.item_type} equipment` };
    }

    // Check if rune already inscribed on this equipment
    const { data: existing } = await supabase
      .from('character_rune_inscriptions')
      .select('id')
      .eq('equipment_id', equipmentId)
      .eq('rune_id', runeId)
      .single();

    if (existing) {
      return { canInscribe: false, reason: 'This rune is already inscribed on this equipment' };
    }

    // Check requirements
    const abilities = (character.abilities as Array<{ ability: string; score: number }> || []).reduce(
      (acc, ab) => ({ ...acc, [ab.ability]: ab.score }),
      {} as Record<string, number>
    );

    const requirements = [
      { ability: 'STR', score: rune.requirement_str || 0 },
      { ability: 'AGI', score: rune.requirement_agi || 0 },
      { ability: 'VIT', score: rune.requirement_vit || 0 },
      { ability: 'INT', score: rune.requirement_int || 0 },
      { ability: 'SENSE', score: rune.requirement_sense || 0 },
      { ability: 'PRE', score: rune.requirement_pre || 0 },
    ];

    for (const req of requirements) {
      if (req.score > 0) {
        const abilityScore = abilities[req.ability] || 0;
        if (abilityScore < req.score) {
          return {
            canInscribe: false,
            reason: `Requires ${req.ability} ${req.score} (have ${abilityScore})`,
          };
        }
      }
    }

    // Check level requirement
    if (rune.requires_level && character.level < rune.requires_level) {
      return {
        canInscribe: false,
        reason: `Requires level ${rune.requires_level} (have ${character.level})`,
      };
    }

    return { canInscribe: true };
  } catch (error) {
    logger.error('Failed to check rune inscription:', error);
    return { canInscribe: false, reason: 'Error checking requirements' };
  }
}

/**
 * Get all runes that can be inscribed on a piece of equipment
 */
export async function getAvailableRunesForEquipment(
  equipmentType: string
): Promise<Rune[]> {
  try {
    const equipmentTypeMap: Record<string, string> = {
      weapon: 'weapon',
      armor: 'armor',
      relic: 'accessory',
      gear: 'accessory',
      consumable: 'accessory',
    };

    const equipType = equipmentTypeMap[equipmentType] || 'universal';

    const { data: runes, error } = await supabase
      .from('compendium_runes')
      .select('*')
      .or(`can_inscribe_on.cs.{${equipType}},can_inscribe_on.cs.{universal}`)
      .order('rune_level', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;
    return runes as Rune[];
  } catch (error) {
    logger.error('Failed to get available runes:', error);
    return [];
  }
}

/**
 * Apply rune passive bonuses to character stats
 * This is called when calculating final character stats
 */
export function applyRuneBonuses(
  baseStats: {
    ac: number;
    speed: number;
    abilities: Record<string, number>;
    attackBonus: number;
    damageBonus: string;
  },
  activeRunes: Array<{
    rune: Rune;
    is_active: boolean;
  }>
): {
  ac: number;
  speed: number;
  abilities: Record<string, number>;
  attackBonus: number;
  damageBonus: string;
} {
  const modifiedStats = { ...baseStats };

  for (const { rune, is_active } of activeRunes) {
    if (!is_active || !rune.passive_bonuses) continue;

    const bonuses = rune.passive_bonuses as Record<string, unknown>;

    // AC bonus
    if (bonuses.ac_bonus && typeof bonuses.ac_bonus === 'number') {
      modifiedStats.ac += bonuses.ac_bonus;
    }

    // Speed bonus
    if (bonuses.speed_bonus && typeof bonuses.speed_bonus === 'number') {
      modifiedStats.speed += bonuses.speed_bonus;
    }

    // Ability score bonuses
    const abilityMap: Record<string, string> = {
      str: 'STR',
      agi: 'AGI',
      vit: 'VIT',
      int: 'INT',
      sense: 'SENSE',
      pre: 'PRE',
    };

    for (const [key, ability] of Object.entries(abilityMap)) {
      if (bonuses[`${key}_bonus`] && typeof bonuses[`${key}_bonus`] === 'number') {
        modifiedStats.abilities[ability] = (modifiedStats.abilities[ability] || 0) + (bonuses[`${key}_bonus`] as number);
      }
    }

    // Attack and damage bonuses
    if (bonuses.attack_bonus && typeof bonuses.attack_bonus === 'number') {
      modifiedStats.attackBonus += bonuses.attack_bonus;
    }

    if (bonuses.damage_bonus && typeof bonuses.damage_bonus === 'string') {
      // Combine damage bonuses (would need dice parsing for full implementation)
      modifiedStats.damageBonus = `${modifiedStats.damageBonus ? modifiedStats.damageBonus + ' + ' : ''}${bonuses.damage_bonus}`;
    }
  }

  return modifiedStats;
}

/**
 * Calculate max uses from uses_per_rest string
 * Examples: 'at-will', '1', '2', 'proficiency bonus', 'level', 'proficiency bonus + level'
 */
export function calculateRuneMaxUses(
  usesPerRest: string | null | undefined,
  characterLevel: number,
  proficiencyBonus: number
): number {
  if (!usesPerRest || usesPerRest === 'at-will') {
    return -1; // -1 indicates unlimited uses
  }

  // Handle numeric strings
  const numericMatch = usesPerRest.match(/^(\d+)$/);
  if (numericMatch) {
    return parseInt(numericMatch[1], 10);
  }

  // Handle proficiency bonus
  if (usesPerRest.toLowerCase().includes('proficiency') || usesPerRest.toLowerCase().includes('prof')) {
    if (usesPerRest.toLowerCase().includes('+')) {
      // Extract additional number if present (e.g., "proficiency bonus + 2")
      const additionalMatch = usesPerRest.match(/\+?\s*(\d+)/);
      const additional = additionalMatch ? parseInt(additionalMatch[1], 10) : 0;
      return proficiencyBonus + additional;
    }
    return proficiencyBonus;
  }

  // Handle level
  if (usesPerRest.toLowerCase().includes('level')) {
    if (usesPerRest.toLowerCase().includes('+')) {
      // Extract additional number if present (e.g., "level + 1")
      const additionalMatch = usesPerRest.match(/\+?\s*(\d+)/);
      const additional = additionalMatch ? parseInt(additionalMatch[1], 10) : 0;
      return characterLevel + additional;
    }
    return characterLevel;
  }

  // Default to 1 if we can't parse
  return 1;
}

