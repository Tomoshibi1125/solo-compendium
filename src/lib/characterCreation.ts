/**
 * Character creation automation
 * Handles automatic feature/equipment/power addition from compendium
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import {
  addLocalEquipment,
  addLocalFeature,
  addLocalPower,
  isLocalCharacterId,
} from '@/lib/guestStore';
import {
  filterRowsBySourcebookAccess,
  getCharacterCampaignId,
  isSourcebookAccessible,
} from '@/lib/sourcebookAccess';
import { calculateFeatureUses } from '@/lib/automation';
import { jobs as staticJobs } from '@/data/compendium/jobs';

type Job = Database['public']['Tables']['compendium_jobs']['Row'];
type Background = Database['public']['Tables']['compendium_backgrounds']['Row'];

type StaticJob = (typeof staticJobs)[number];

function findStaticJobByName(jobName: string | null | undefined): StaticJob | null {
  if (!jobName) return null;
  const normalized = jobName.trim().toLowerCase();
  return staticJobs.find((j) => j.name.trim().toLowerCase() === normalized) ?? null;
}

function isChoiceFeatureText(value: string | null | undefined): boolean {
  if (!value) return false;
  return /\b(choose|select|pick)\b/i.test(value);
}

function isChoiceFeatureRow(feature: {
  name?: string | null;
  description?: string | null;
  prerequisites?: string | null;
}): boolean {
  return (
    isChoiceFeatureText(feature.name ?? null) ||
    isChoiceFeatureText(feature.description ?? null) ||
    isChoiceFeatureText(feature.prerequisites ?? null)
  );
}

type SpellProgression = 'none' | 'full' | 'half' | 'pact';

function normalizeJobName(jobName: string | null | undefined): string {
  return (jobName || '').trim().toLowerCase();
}

function getSpellProgressionForJob(jobName: string | null | undefined): SpellProgression {
  const normalized = normalizeJobName(jobName);

  // Full casters
  const fullCasters = ['mage', 'necromancer', 'technomancer', 'oracle', 'resonant', 'invoker', 'healer', 'warden', 'esper', 'revenant'];
  if (fullCasters.includes(normalized)) return 'full';

  // Half casters
  const halfCasters = ['crusader', 'stalker', 'herald', 'ranger', 'techsmith', 'holy knight'];
  if (halfCasters.includes(normalized)) return 'half';

  // Pact caster
  if (normalized === 'contractor') return 'pact';

  return 'none';
}

/**
 * 5e-accurate max spell level unlocked for a class at a given level.
 * We use this to gate compendium powers (treating `power_level` like spell level).
 */
export function getMaxPowerLevelForJobAtLevel(
  jobName: string | null | undefined,
  level: number
): number {
  const clamped = Math.min(Math.max(level, 1), 20);
  const progression = getSpellProgressionForJob(jobName);

  if (progression === 'none') return 0;

  if (progression === 'pact') {
    if (clamped >= 9) return 5;
    if (clamped >= 7) return 4;
    if (clamped >= 5) return 3;
    if (clamped >= 3) return 2;
    return 1;
  }

  if (progression === 'half') {
    if (clamped >= 17) return 5;
    if (clamped >= 13) return 4;
    if (clamped >= 9) return 3;
    if (clamped >= 5) return 2;
    if (clamped >= 2) return 1;
    return 0;
  }

  // full caster
  if (clamped >= 17) return 9;
  if (clamped >= 15) return 8;
  if (clamped >= 13) return 7;
  if (clamped >= 11) return 6;
  if (clamped >= 9) return 5;
  if (clamped >= 7) return 4;
  if (clamped >= 5) return 3;
  if (clamped >= 3) return 2;
  return 1;
}

async function getExistingFeatureNames(characterId: string): Promise<Set<string>> {
  if (isLocalCharacterId(characterId)) {
    const { listLocalFeatures } = await import('@/lib/guestStore');
    return new Set(listLocalFeatures(characterId).map((f) => f.name));
  }

  const { data } = await supabase
    .from('character_features')
    .select('name')
    .eq('character_id', characterId);

  return new Set((data || []).map((row) => row.name));
}

async function insertCharacterFeature(
  characterId: string,
  payload: Omit<Database['public']['Tables']['character_features']['Insert'], 'character_id'>
): Promise<void> {
  if (isLocalCharacterId(characterId)) {
    addLocalFeature(characterId, {
      name: payload.name,
      source: payload.source ?? undefined,
      level_acquired: payload.level_acquired ?? undefined,
      description: payload.description ?? undefined,
      action_type: payload.action_type ?? null,
      uses_max: payload.uses_max ?? null,
      uses_current: payload.uses_current ?? null,
      recharge: payload.recharge ?? null,
      is_active: payload.is_active ?? true,
    });
    return;
  }

  await supabase.from('character_features').insert({
    character_id: characterId,
    ...payload,
  });
}

/**
 * Map from 5e ability names (used in static job data) to System Ascendant ability names.
 */
const JOB_ASI_TO_SYSTEM: Record<string, string> = {
  strength: 'STR',
  dexterity: 'AGI',
  constitution: 'VIT',
  intelligence: 'INT',
  wisdom: 'SENSE',
  charisma: 'PRE',
};

/**
 * Get the ability score improvements for a job, mapped to System Ascendant ability names.
 * Returns a Record like { STR: 2, VIT: 1 }.
 */
export function getJobASI(
  jobName: string | null | undefined
): Record<string, number> {
  const job = findStaticJobByName(jobName);
  if (!job || !job.abilityScoreImprovements) return {};

  const result: Record<string, number> = {};
  for (const [ability, bonus] of Object.entries(job.abilityScoreImprovements)) {
    const systemAbility = JOB_ASI_TO_SYSTEM[ability.toLowerCase()];
    if (systemAbility && typeof bonus === 'number' && bonus !== 0) {
      result[systemAbility] = bonus;
    }
  }
  return result;
}

/**
 * Grant job awakening benefits (awakening features + job traits) at a specific level.
 */
export async function addJobAwakeningBenefitsForLevel(
  characterId: string,
  jobName: string | null | undefined,
  level: number
): Promise<void> {
  const job = findStaticJobByName(jobName);
  if (!job) return;

  const existingNames = await getExistingFeatureNames(characterId);

  const awakeningAtLevel = (job.awakeningFeatures || []).filter((f) => f.level === level);
  for (const feature of awakeningAtLevel) {
    if (existingNames.has(feature.name)) continue;
    await insertCharacterFeature(characterId, {
      name: feature.name,
      source: `Job Awakening: ${job.name}`,
      level_acquired: level,
      description: feature.description,
      is_active: true,
    });
  }

  if (level === 1) {
    for (const trait of job.jobTraits || []) {
      if (existingNames.has(trait.name)) continue;
      await insertCharacterFeature(characterId, {
        name: trait.name,
        source: `Job Trait: ${job.name}`,
        level_acquired: 1,
        description: trait.description,
        is_active: true,
      });
    }
  }
}

/**
 * Add level 1 features from job to character
 */
export async function addLevel1Features(
  characterId: string,
  jobId: string,
  pathId?: string
): Promise<void> {
  const campaignId = await getCharacterCampaignId(characterId);

  // Get level 1 job features
  const { data: jobFeatures } = await supabase
    .from('compendium_job_features')
    .select('*')
    .eq('job_id', jobId)
    .eq('level', 1)
    .eq('is_path_feature', false);

  const accessibleJobFeatures = await filterRowsBySourcebookAccess(
    jobFeatures || [],
    (feature) => feature.source_name,
    { campaignId }
  );

  if (accessibleJobFeatures.length > 0) {
    for (const feature of accessibleJobFeatures) {
      const usesMax = calculateFeatureUses(feature.uses_formula, 1, 2);

      if (isLocalCharacterId(characterId)) {
        addLocalFeature(characterId, {
          name: feature.name,
          source: 'Job: Level 1',
          level_acquired: 1,
          description: feature.description,
          action_type: feature.action_type || null,
          uses_max: usesMax,
          uses_current: usesMax,
          recharge: feature.recharge || null,
          is_active: true,
        });
      } else {
        await supabase.from('character_features').insert({
          character_id: characterId,
          name: feature.name,
          source: 'Job: Level 1',
          level_acquired: 1,
          description: feature.description,
          action_type: feature.action_type || null,
          uses_max: usesMax,
          uses_current: usesMax,
          recharge: feature.recharge || null,
          is_active: true,
        });
      }
    }
  }

  // Get level 1 path features if path selected
  if (pathId) {
    const { data: pathRow } = await supabase
      .from('compendium_job_paths')
      .select('path_level')
      .eq('id', pathId)
      .maybeSingle();

    if (!pathRow || pathRow.path_level !== 1) {
      return;
    }

    const { data: pathFeatures } = await supabase
      .from('compendium_job_features')
      .select('*')
      .eq('path_id', pathId)
      .eq('level', 1)
      .eq('is_path_feature', true);

    const accessiblePathFeatures = await filterRowsBySourcebookAccess(
      pathFeatures || [],
      (feature) => feature.source_name,
      { campaignId }
    );

    if (accessiblePathFeatures.length > 0) {
      for (const feature of accessiblePathFeatures) {
        const usesMax = calculateFeatureUses(feature.uses_formula, 1, 2);

        if (isLocalCharacterId(characterId)) {
          addLocalFeature(characterId, {
            name: feature.name,
            source: 'Path: Level 1',
            level_acquired: 1,
            description: feature.description,
            action_type: feature.action_type || null,
            uses_max: usesMax,
            uses_current: usesMax,
            recharge: feature.recharge || null,
            is_active: true,
          });
        } else {
          await supabase.from('character_features').insert({
            character_id: characterId,
            name: feature.name,
            source: 'Path: Level 1',
            level_acquired: 1,
            description: feature.description,
            action_type: feature.action_type || null,
            uses_max: usesMax,
            uses_current: usesMax,
            recharge: feature.recharge || null,
            is_active: true,
          });
        }
      }
    }
  }
}

/**
 * Add background proficiencies and features
 */
export async function addBackgroundFeatures(
  characterId: string,
  background: Background
): Promise<void> {
  // Add background feature if any
  if (background.feature_name) {
    if (isLocalCharacterId(characterId)) {
      addLocalFeature(characterId, {
        name: background.feature_name,
        source: `Background: ${background.name}`,
        level_acquired: 1,
        description: background.feature_description || `Background feature: ${background.feature_name}`,
        is_active: true,
      });
    } else {
      await supabase.from('character_features').insert({
        character_id: characterId,
        name: background.feature_name,
        source: `Background: ${background.name}`,
        level_acquired: 1,
        description: background.feature_description || `Background feature: ${background.feature_name}`,
        is_active: true,
      });
    }
  }
}

/**
 * Add starting equipment from job and background
 */
export async function addStartingEquipment(
  characterId: string,
  job: Job,
  background?: Background
): Promise<void> {
  const campaignId = await getCharacterCampaignId(characterId);

  // Add job starting equipment from static data
  const staticJob = findStaticJobByName(job.name);
  if (staticJob?.startingEquipment) {
    for (const equipmentGroup of staticJob.startingEquipment) {
      // Each group is a choice array; grant the first option by default
      const itemName = equipmentGroup[0];
      if (!itemName) continue;

      if (isLocalCharacterId(characterId)) {
        addLocalEquipment(characterId, {
          name: itemName,
          item_type: 'gear',
          quantity: 1,
          is_equipped: false,
        });
      } else {
        await supabase.from('character_equipment').insert({
          character_id: characterId,
          name: itemName,
          item_type: 'gear',
          quantity: 1,
          is_equipped: false,
        });
      }
    }
  }

  // Add background starting equipment
  if (background?.starting_equipment) {
    const equipmentItems = background.starting_equipment.split(',').map(e => e.trim());
    
    for (const itemName of equipmentItems) {
      const { data: equipment } = await supabase
        .from('compendium_equipment')
        .select('*')
        .ilike('name', `%${itemName}%`)
        .limit(1)
        .maybeSingle();

      if (
        equipment &&
        (await isSourcebookAccessible(equipment.source_book, { campaignId }))
      ) {
        if (isLocalCharacterId(characterId)) {
          addLocalEquipment(characterId, {
            name: equipment.name,
            item_type: equipment.equipment_type || 'gear',
            description: equipment.description || null,
            properties: equipment.properties || [],
            weight: equipment.weight || null,
            quantity: 1,
            is_equipped: false,
          });
        } else {
          await supabase.from('character_equipment').insert({
            character_id: characterId,
            name: equipment.name,
            item_type: equipment.equipment_type || 'gear',
            description: equipment.description || null,
            properties: equipment.properties || [],
            weight: equipment.weight || null,
            quantity: 1,
            is_equipped: false,
          });
        }
      } else {
        if (isLocalCharacterId(characterId)) {
          addLocalEquipment(characterId, {
            name: itemName,
            item_type: 'gear',
            quantity: 1,
            is_equipped: false,
          });
        } else {
          await supabase.from('character_equipment').insert({
            character_id: characterId,
            name: itemName,
            item_type: 'gear',
            quantity: 1,
            is_equipped: false,
          });
        }
      }
    }
  }
}

/**
 * Add starting powers from job
 */
export async function addStartingPowers(
  characterId: string,
  job: Job
): Promise<void> {
  const campaignId = await getCharacterCampaignId(characterId);

  const maxPowerLevel = getMaxPowerLevelForJobAtLevel(job.name, 1);

  // Get powers available to this job at level 1
  const { data: powers } = await supabase
    .from('compendium_powers')
    .select('*')
    .contains('job_names', [job.name])
    .lte('power_level', maxPowerLevel); // 5e-accurate max spell level (includes cantrips at 0)

  const accessiblePowers = await filterRowsBySourcebookAccess(
    powers || [],
    (power) => power.source_book,
    { campaignId }
  );

  if (accessiblePowers.length > 0) {
    for (const power of accessiblePowers) {
      if (isLocalCharacterId(characterId)) {
        addLocalPower(characterId, {
          name: power.name,
          power_level: power.power_level,
          source: `Job: ${job.name}`,
          casting_time: power.casting_time || null,
          range: power.range || null,
          duration: power.duration || null,
          concentration: power.concentration || false,
          description: power.description || null,
          higher_levels: power.higher_levels || null,
          is_prepared: power.power_level === 0, // Auto-prepare cantrips
          is_known: true,
        });
      } else {
        await supabase.from('character_powers').insert({
          character_id: characterId,
          name: power.name,
          power_level: power.power_level,
          source: `Job: ${job.name}`,
          casting_time: power.casting_time || null,
          range: power.range || null,
          duration: power.duration || null,
          concentration: power.concentration || false,
          description: power.description || null,
          higher_levels: power.higher_levels || null,
          is_prepared: power.power_level === 0, // Auto-prepare cantrips
          is_known: true,
        });
      }
    }
  }
}
