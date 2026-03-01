/**
 * React Hook for Computed Character Stats
 *
 * Integrates the centralized characterEngine with React Query.
 * All UI components should use this hook instead of computing stats directly.
 *
 * Usage:
 * ```tsx
 * const { computedStats, isLoading } = useComputedCharacterStats(characterId);
 * return <div>AC: {computedStats?.armorClass}</div>;
 * ```
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { bridgeEquipmentEffects } from '@/lib/unifiedEffectSystem';
import { parseModifiers } from '@/lib/equipmentModifiers';
import {
  computeCharacterStats,
  type CharacterBaseData,
  type ComputedCharacterStats,
  type CharacterJob,
  type EquipmentInstance,
  type ActiveCondition,
  type FeatureInstance,
  type ActiveSpellEffect,
} from '@/lib/characterEngine';
import type { AbilityScore } from '@/lib/5eRulesEngine';
import type { Effect } from '@/lib/characterEngine';
import { getErrorMessage, logErrorWithContext } from '@/lib/errorHandling';

// Imported bridgeEquipmentEffects from unifiedEffectSystem.ts

/**
 * Fetch all base character data needed for computation
 */
async function fetchCharacterBaseData(characterId: string): Promise<CharacterBaseData> {
  // 1. Fetch character
  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('*')
    .eq('id', characterId)
    .single();

  if (charError) throw charError;
  if (!character) throw new Error('Character not found');

  // 2. Fetch abilities
  const { data: abilities, error: abilitiesError } = await supabase
    .from('character_abilities')
    .select('ability, score')
    .eq('character_id', characterId);

  if (abilitiesError) throw abilitiesError;

  const abilitiesObj: Record<AbilityScore, number> = {
    STR: 10, AGI: 10, VIT: 10, INT: 10, SENSE: 10, PRE: 10,
  };
  abilities?.forEach(({ ability, score }) => {
    abilitiesObj[ability as AbilityScore] = score;
  });

  // 3. Fetch equipped items
  const { data: equipment, error: equipmentError } = await supabase
    .from('character_equipment')
    .select('*')
    .eq('character_id', characterId)
    .eq('is_equipped', true);

  if (equipmentError) throw equipmentError;

  const equippedItems: EquipmentInstance[] = (equipment || []).map(item => ({
    id: item.id,
    name: item.name || 'Unknown Item',
    type: (item as any).type || 'other',
    isEquipped: item.is_equipped || false,
    isAttuned: item.is_attuned || false,
    requiresAttunement: item.requires_attunement || false,
    weight: typeof item.weight === 'number' ? item.weight : 0,
    properties: Array.isArray(item.properties) ? item.properties : [],
    acFormula: typeof (item as any).ac_formula === 'string' ? (item as any).ac_formula : undefined,
    effects: bridgeEquipmentEffects(Array.isArray(item.properties) ? item.properties : []),
    isActive: (item as any).is_active ?? true,
    ignoreContentsWeight: (item as any).ignore_contents_weight ?? false,
    isContainer: (item as any).is_container ?? false,
    containerId: (item as any).container_id ?? null,
  }));

  // 4. Fetch conditions (stored in character.conditions array)
  const activeConditions: ActiveCondition[] = (character.conditions || []).map((name: string) => ({
    name,
    appliedAt: new Date(),
  }));

  // 5. Fetch features from character_features table
  const { data: featureRows, error: featureError } = await supabase
    .from('character_features')
    .select('*')
    .eq('character_id', characterId)
    .eq('is_active', true);

  if (featureError) throw featureError;

  const features: FeatureInstance[] = (featureRows || []).map(f => ({
    id: f.id,
    name: f.name,
    sourceType: mapFeatureSource(f.source),
    sourceId: f.id,
    description: f.description || undefined,
    usesMax: f.uses_max || undefined,
    usesCurrent: f.uses_current || undefined,
    rechargeOn: mapRecharge(f.recharge),
    effects: parseFeatureDescriptionEffects(f.description || '', f.name),
  }));

  // 6. Fetch active spells from DB (graceful fallback if table doesn't exist yet)
  let activeSpells: ActiveSpellEffect[] = [];
  try {
    // Use untyped fetch — table may not exist in generated Supabase types yet
    const { data: spellRows } = await (supabase as any)
      .from('character_active_spells')
      .select('*')
      .eq('character_id', characterId);
    if (Array.isArray(spellRows)) {
      activeSpells = spellRows.map((s: any) => ({
        spellId: s.spell_id || s.id || `spell-${Date.now()}`,
        spellName: s.spell_name || s.name || 'Unknown',
        level: s.level ?? 0,
        castAt: s.cast_at ? new Date(s.cast_at) : new Date(),
        concentration: s.concentration ?? false,
        duration: s.duration_value ? {
          type: s.duration_type || 'rounds',
          value: s.duration_value,
        } : undefined,
        effects: Array.isArray(s.effects) ? s.effects : [],
      }));
    }
  } catch {
    // Table may not exist yet — gracefully fall back to empty
  }

  // 7. Build jobs array (single job + regent overlays)
  const jobs: CharacterJob[] = [];
  if (character.job) {
    jobs.push({
      job: character.job,
      path: character.path || undefined,
      regent: (character as any).regent || undefined,
      gemini: (character as any).gemini_state || undefined,
      level: character.level,
      hitDie: getHitDieForJob(character.job),
    });
  }

  // 8. Parse proficiencies
  const savingThrowProficiencies: AbilityScore[] = Array.isArray(character.saving_throw_proficiencies)
    ? character.saving_throw_proficiencies
    : [];
  const skillProficiencies: string[] = Array.isArray(character.skill_proficiencies)
    ? character.skill_proficiencies
    : [];
  const skillExpertise: string[] = Array.isArray(character.skill_expertise)
    ? character.skill_expertise
    : [];

  // 9. Assemble base data
  return {
    id: character.id,
    name: character.name,
    level: character.level,
    jobs,
    abilities: abilitiesObj,
    savingThrowProficiencies,
    skillProficiencies,
    skillExpertise,
    armorProficiencies: [],
    weaponProficiencies: [],
    toolProficiencies: [],
    languages: [],
    hpCurrent: character.hp_current || 0,
    hpMax: character.hp_max || 0,
    hpTemp: character.hp_temp || 0,
    hitDiceCurrent: character.hit_dice_current || 0,
    hitDiceMax: character.hit_dice_max || 0,
    systemFavorCurrent: character.system_favor_current || 0,
    baseSpeed: character.speed || 30,
    equippedItems,
    activeConditions,
    activeSpells,
    features,
    exhaustionLevel: character.exhaustion_level || 0,
    preparedSpells: Array.isArray((character as any).prepared_spells) ? (character as any).prepared_spells : undefined,
    knownSpells: Array.isArray((character as any).known_spells) ? (character as any).known_spells : undefined,
  };
}

/**
 * Get hit die for System Ascendant job
 */
function getHitDieForJob(job: string): number {
  const hitDieMap: Record<string, number> = {
    // d12 jobs
    'Berserker': 12,
    // d10 jobs
    'Destroyer': 10,
    'Holy Knight': 10,
    'Stalker': 10,
    // d8 jobs
    'Assassin': 8,
    'Striker': 8,
    'Mage': 8,
    'Herald': 8,
    'Contractor': 8,
    'Summoner': 8,
    'Technomancer': 8,
    'Idol': 8,
    'Revenant': 8,
    // d6 jobs
    'Esper': 6,
  };

  return hitDieMap[job] || 8; // Default to d8
}

/**
 * Map DB feature source string to FeatureInstance sourceType
 */
function mapFeatureSource(source: string): FeatureInstance['sourceType'] {
  const map: Record<string, FeatureInstance['sourceType']> = {
    'job': 'job', 'class': 'job', 'path': 'path', 'subclass': 'path',
    'feat': 'feat', 'race': 'race', 'item': 'item',
    'awakening': 'awakening', 'trait': 'trait',
  };
  return map[source.toLowerCase()] || 'feat';
}

/**
 * Map DB recharge string to FeatureInstance rechargeOn
 */
function mapRecharge(recharge: string | null): FeatureInstance['rechargeOn'] {
  if (!recharge) return 'none';
  const r = recharge.toLowerCase();
  if (r.includes('short')) return 'short-rest';
  if (r.includes('long')) return 'long-rest';
  if (r.includes('dawn') || r.includes('day')) return 'dawn';
  return 'none';
}

/**
 * Parse feature description for mechanical effects (AC, speed, attack bonuses).
 * Mirrors parseAwakeningEffects/parseRegentFeatureEffects in characterEngine.ts.
 */
function parseFeatureDescriptionEffects(description: string, _name: string): Effect[] {
  const effects: Effect[] = [];
  const desc = description.toLowerCase();

  // AC bonuses (e.g., "+1 to AC", "+2 AC")
  const acBonus = desc.match(/\+(\d+)\s*(?:to\s*)?ac/i);
  if (acBonus) {
    effects.push({ type: 'modifier', target: 'ac', value: parseInt(acBonus[1], 10), priority: 200 });
  }

  // Speed bonuses (e.g., "+10 ft speed", "+5 speed")
  const speedBonus = desc.match(/\+(\d+)\s*(?:ft\s*)?speed/i);
  if (speedBonus) {
    effects.push({ type: 'modifier', target: 'speed', value: parseInt(speedBonus[1], 10), priority: 200 });
  }

  // Attack bonuses (e.g., "+1 to attack rolls")
  const attackBonus = desc.match(/\+(\d+)\s*to\s*attack/i);
  if (attackBonus) {
    effects.push({ type: 'modifier', target: 'attack_bonus', value: parseInt(attackBonus[1], 10), priority: 200 });
  }

  // Saving throw bonuses (e.g., "+1 to saving throws")
  const saveBonus = desc.match(/\+(\d+)\s*to\s*saving\s*throws?/i);
  if (saveBonus) {
    effects.push({ type: 'modifier', target: 'saving_throw', value: parseInt(saveBonus[1], 10), priority: 200 });
  }

  return effects;
}

/**
 * Hook: Fetch character base data
 */
export function useCharacterBaseData(characterId: string | undefined) {
  return useQuery({
    queryKey: ['character-base-data', characterId],
    queryFn: async () => {
      if (!characterId) throw new Error('Character ID is required');
      return fetchCharacterBaseData(characterId);
    },
    enabled: !!characterId,
    staleTime: 1000 * 60, // 1 minute
    retry: 1,
  });
}

/**
 * Hook: Compute character stats (memoized)
 *
 * This is the PRIMARY hook for accessing character stats in UI components.
 * Returns fully computed stats that should NEVER be stored in the database.
 */
export function useComputedCharacterStats(characterId: string | undefined) {
  const { data: baseData, isLoading, error } = useCharacterBaseData(characterId);

  // Compute stats only when base data changes
  const computedStats = useMemo<ComputedCharacterStats | null>(() => {
    if (!baseData) return null;

    try {
      return computeCharacterStats(baseData);
    } catch (err) {
      logErrorWithContext(err, 'useComputedCharacterStats', { characterId });
      return null;
    }
  }, [baseData, characterId]);

  return {
    baseData,
    computedStats,
    isLoading,
    error: error ? getErrorMessage(error) : null,
  };
}

/**
 * Hook: Get specific stat from computed stats
 *
 * Convenience hook for accessing a single stat value.
 * Returns undefined if loading or error.
 */
export function useCharacterStat<K extends keyof ComputedCharacterStats>(
  characterId: string | undefined,
  statKey: K
): ComputedCharacterStats[K] | undefined {
  const { computedStats } = useComputedCharacterStats(characterId);
  return computedStats?.[statKey];
}

/**
 * Hook: Check if character can perform action
 *
 * Returns true/false based on conditions (e.g., can't take actions if incapacitated)
 */
export function useCanPerformAction(
  characterId: string | undefined,
  actionType: 'action' | 'bonus-action' | 'reaction' | 'move'
): boolean {
  const { data: baseData } = useCharacterBaseData(characterId);

  if (!baseData) return false;

  // Check if incapacitated
  const incapacitatingConditions = ['incapacitated', 'paralyzed', 'petrified', 'stunned', 'unconscious'];
  const hasIncapacitatingCondition = baseData.activeConditions.some((c: ActiveCondition) =>
    incapacitatingConditions.includes(c.name.toLowerCase())
  );

  if (hasIncapacitatingCondition) {
    return actionType === 'move' ? false : false; // Can't take actions or move
  }

  // Check for movement restrictions
  if (actionType === 'move') {
    const movementRestrictingConditions = ['grappled', 'restrained', 'paralyzed', 'petrified', 'stunned', 'unconscious'];
    return !baseData.activeConditions.some((c: ActiveCondition) =>
      movementRestrictingConditions.includes(c.name.toLowerCase())
    );
  }

  return true;
}
