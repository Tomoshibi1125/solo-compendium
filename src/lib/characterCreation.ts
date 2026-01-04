/**
 * Character creation automation
 * Handles automatic feature/equipment/power addition from compendium
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Job = Database['public']['Tables']['compendium_jobs']['Row'];
type Background = Database['public']['Tables']['compendium_backgrounds']['Row'];
type JobFeature = Database['public']['Tables']['compendium_job_features']['Row'];

/**
 * Add level 1 features from job to character
 */
export async function addLevel1Features(
  characterId: string,
  jobId: string,
  pathId?: string
): Promise<void> {
  // Get level 1 job features
  const { data: jobFeatures } = await supabase
    .from('compendium_job_features')
    .select('*')
    .eq('job_id', jobId)
    .eq('level', 1)
    .eq('is_path_feature', false);

  if (jobFeatures) {
    for (const feature of jobFeatures) {
      let usesMax: number | null = null;
      if (feature.uses_formula) {
        // Parse formula (e.g., "proficiency bonus", "level")
        if (feature.uses_formula.includes('proficiency')) {
          usesMax = 2; // Level 1 proficiency bonus
        } else if (feature.uses_formula.includes('level')) {
          usesMax = 1;
        }
      }

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

  // Get level 1 path features if path selected
  if (pathId) {
    const { data: pathFeatures } = await supabase
      .from('compendium_job_features')
      .select('*')
      .eq('path_id', pathId)
      .eq('level', 1)
      .eq('is_path_feature', true);

    if (pathFeatures) {
      for (const feature of pathFeatures) {
        let usesMax: number | null = null;
        if (feature.uses_formula) {
          if (feature.uses_formula.includes('proficiency')) {
            usesMax = 2;
          } else if (feature.uses_formula.includes('level')) {
            usesMax = 1;
          }
        }

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

/**
 * Add background proficiencies and features
 */
export async function addBackgroundFeatures(
  characterId: string,
  background: Background
): Promise<void> {
  // Add skill proficiencies from background
  if (background.skill_proficiencies && background.skill_proficiencies.length > 0) {
    // This would need to update character.skill_proficiencies array
    // For now, we'll add them as features
    for (const skill of background.skill_proficiencies) {
      // Skills are handled separately, but we can note them
    }
  }

  // Add background feature if any
  if (background.feature_name) {
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

/**
 * Add starting equipment from job and background
 */
export async function addStartingEquipment(
  characterId: string,
  job: Job,
  background?: Background
): Promise<void> {
  // Add job starting equipment
  if (job.starting_equipment) {
    // Parse starting equipment string (e.g., "Longsword, Shield, Leather Armor")
    const equipmentItems = job.starting_equipment.split(',').map(e => e.trim());
    
    for (const itemName of equipmentItems) {
      // Try to find in compendium_equipment
      const { data: equipment } = await supabase
        .from('compendium_equipment')
        .select('*')
        .ilike('name', `%${itemName}%`)
        .limit(1)
        .maybeSingle();

      if (equipment) {
        await supabase.from('character_equipment').insert({
          character_id: characterId,
          name: equipment.name,
          item_type: equipment.equipment_type || 'gear',
          rarity: equipment.rarity || null,
          description: equipment.description || null,
          properties: equipment.properties || [],
          weight: equipment.weight || null,
          value_credits: equipment.value_credits || null,
          quantity: 1,
          is_equipped: false,
        });
      } else {
        // Add as generic equipment if not found in compendium
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

      if (equipment) {
        await supabase.from('character_equipment').insert({
          character_id: characterId,
          name: equipment.name,
          item_type: equipment.equipment_type || 'gear',
          rarity: equipment.rarity || null,
          description: equipment.description || null,
          properties: equipment.properties || [],
          weight: equipment.weight || null,
          value_credits: equipment.value_credits || null,
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

/**
 * Add starting powers from job
 */
export async function addStartingPowers(
  characterId: string,
  job: Job
): Promise<void> {
  // Get powers available to this job at level 1
  const { data: powers } = await supabase
    .from('compendium_powers')
    .select('*')
    .contains('job_names', [job.name])
    .lte('power_level', 1); // Level 1 or cantrips

  if (powers) {
    for (const power of powers) {
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

