import { supabase } from '@/integrations/supabase/client';
import { validateContentBundle, type ContentBundle, type ValidationResult } from './contentValidator';
import type { Database } from '@/integrations/supabase/types';
import { AppError } from '@/lib/appError';

type Job = Database['public']['Tables']['compendium_jobs']['Row'];
type JobPath = Database['public']['Tables']['compendium_job_paths']['Row'];
type JobFeature = Database['public']['Tables']['compendium_job_features']['Row'];
type JobInsert = Database['public']['Tables']['compendium_jobs']['Insert'];
type JobPathInsert = Database['public']['Tables']['compendium_job_paths']['Insert'];
type JobFeatureInsert = Database['public']['Tables']['compendium_job_features']['Insert'];
type PowerInsert = Database['public']['Tables']['compendium_powers']['Insert'];
type RelicInsert = Database['public']['Tables']['compendium_relics']['Insert'];
type MonsterInsert = Database['public']['Tables']['compendium_monsters']['Insert'];
type BackgroundInsert = Database['public']['Tables']['compendium_backgrounds']['Insert'];

export interface ImportResult {
  success: boolean;
  imported: {
    jobs: number;
    job_paths: number;
    job_features: number;
    powers: number;
    relics: number;
    monsters: number;
    backgrounds: number;
  };
  errors: string[];
  warnings: string[];
}

// Import content bundle into database
export async function importContentBundle(
  bundle: ContentBundle,
  options: { dryRun?: boolean; overwrite?: boolean } = {}
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    imported: {
      jobs: 0,
      job_paths: 0,
      job_features: 0,
      powers: 0,
      relics: 0,
      monsters: 0,
      backgrounds: 0,
    },
    errors: [],
    warnings: [],
  };

  try {
    // Validate first
    const validation = validateContentBundle(bundle);
    if (!validation.valid) {
      result.success = false;
      result.errors = validation.errors.map(e => `${e.path}: ${e.message}`);
      return result;
    }
    result.warnings = validation.warnings.map(w => `${w.path}: ${w.message}`);

    if (options.dryRun) {
      // Just return what would be imported
      result.imported.jobs = bundle.jobs?.length || 0;
      result.imported.job_paths = bundle.job_paths?.length || 0;
      result.imported.job_features = bundle.job_features?.length || 0;
      result.imported.powers = bundle.powers?.length || 0;
      result.imported.relics = bundle.relics?.length || 0;
      result.imported.monsters = bundle.monsters?.length || 0;
      result.imported.backgrounds = bundle.backgrounds?.length || 0;
      return result;
    }

    // Import jobs first (they're referenced by other entities)
    if (bundle.jobs) {
      for (const jobData of bundle.jobs) {
        try {
          const { data: existing } = await supabase
            .from('compendium_jobs')
            .select('id')
            .eq('name', jobData.name)
            .maybeSingle();

          if (existing && !options.overwrite) {
            result.warnings.push(`Job "${jobData.name}" already exists, skipping`);
            continue;
          }

          const jobInsert: JobInsert = {
            name: jobData.name,
            display_name: jobData.display_name,
            aliases: jobData.aliases || [],
            description: jobData.description,
            flavor_text: jobData.flavor_text,
            primary_abilities: jobData.primary_abilities,
            secondary_abilities: jobData.secondary_abilities,
            hit_die: jobData.hit_die,
            armor_proficiencies: jobData.armor_proficiencies || [],
            weapon_proficiencies: jobData.weapon_proficiencies || [],
            tool_proficiencies: jobData.tool_proficiencies || [],
            saving_throw_proficiencies: jobData.saving_throw_proficiencies,
            skill_choices: jobData.skill_choices || [],
            skill_choice_count: jobData.skill_choice_count,
            source_book: jobData.source_book,
            tags: jobData.tags || [],
            source_kind: jobData.source_kind,
            source_name: jobData.source_name,
            license_note: jobData.license_note,
            generated_reason: jobData.generated_reason,
            theme_tags: jobData.theme_tags,
          };

          if (existing && options.overwrite) {
            await supabase
              .from('compendium_jobs')
              .update(jobInsert)
              .eq('id', existing.id);
          } else {
            await supabase
              .from('compendium_jobs')
              .insert(jobInsert);
          }
          result.imported.jobs++;
        } catch (error) {
          result.errors.push(`Failed to import job "${jobData.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.success = false;
        }
      }
    }

    // Import job paths
    if (bundle.job_paths) {
      for (const pathData of bundle.job_paths) {
        try {
          // Get job ID
          const { data: job } = await supabase
            .from('compendium_jobs')
            .select('id')
            .eq('name', pathData.job_name)
            .maybeSingle();

          if (!job) {
            result.errors.push(`Job "${pathData.job_name}" not found for path "${pathData.name}"`);
            result.success = false;
            continue;
          }

          const { data: existing } = await supabase
            .from('compendium_job_paths')
            .select('id')
            .eq('job_id', job.id)
            .eq('name', pathData.name)
            .maybeSingle();

          if (existing && !options.overwrite) {
            result.warnings.push(`Path "${pathData.name}" already exists, skipping`);
            continue;
          }

          const pathInsert: JobPathInsert = {
            job_id: job.id,
            name: pathData.name,
            display_name: pathData.display_name,
            aliases: pathData.aliases || [],
            description: pathData.description,
            flavor_text: pathData.flavor_text,
            path_level: pathData.path_level,
            source_book: pathData.source_book,
            tags: pathData.tags || [],
            source_kind: pathData.source_kind,
            source_name: pathData.source_name,
            license_note: pathData.license_note,
            generated_reason: pathData.generated_reason,
            theme_tags: pathData.theme_tags,
          };

          if (existing && options.overwrite) {
            await supabase
              .from('compendium_job_paths')
              .update(pathInsert)
              .eq('id', existing.id);
          } else {
            const { data: newPath } = await supabase
              .from('compendium_job_paths')
              .insert(pathInsert)
              .select()
              .single();

            // Import job features for this path
            if (bundle.job_features && newPath) {
              const pathFeatures = bundle.job_features.filter(
                f => f.job_name === pathData.job_name && f.path_name === pathData.name
              );

              for (const featureData of pathFeatures) {
                const featureInsert: JobFeatureInsert = {
                    job_id: job.id,
                    path_id: newPath.id,
                    name: featureData.name,
                    display_name: featureData.display_name,
                    aliases: featureData.aliases || [],
                    level: featureData.level,
                    description: featureData.description,
                    action_type: featureData.action_type ?? null,
                    uses_formula: featureData.uses_formula ?? null,
                    recharge: featureData.recharge ?? null,
                    prerequisites: featureData.prerequisites ?? null,
                    is_path_feature: true,
                  };

                await supabase
                  .from('compendium_job_features')
                  .insert(featureInsert);
                result.imported.job_features++;
              }
            }
          }
          result.imported.job_paths++;
        } catch (error) {
          result.errors.push(`Failed to import path "${pathData.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.success = false;
        }
      }
    }

    // Import job features (non-path features)
    if (bundle.job_features) {
      for (const featureData of bundle.job_features) {
        try {
          if (featureData.is_path_feature) continue; // Already handled above

          const { data: job } = await supabase
            .from('compendium_jobs')
            .select('id')
            .eq('name', featureData.job_name)
            .maybeSingle();

          if (!job) {
            result.errors.push(`Job "${featureData.job_name}" not found for feature "${featureData.name}"`);
            result.success = false;
            continue;
          }

          const featureInsert: JobFeatureInsert = {
              job_id: job.id,
              name: featureData.name,
              display_name: featureData.display_name,
              aliases: featureData.aliases || [],
              level: featureData.level,
              description: featureData.description,
              action_type: featureData.action_type ?? null,
              uses_formula: featureData.uses_formula ?? null,
              recharge: featureData.recharge ?? null,
              prerequisites: featureData.prerequisites ?? null,
              is_path_feature: false,
            };

          await supabase
            .from('compendium_job_features')
            .insert(featureInsert);
          result.imported.job_features++;
        } catch (error) {
          result.errors.push(`Failed to import feature "${featureData.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.success = false;
        }
      }
    }

    // Import powers
    if (bundle.powers) {
      for (const powerData of bundle.powers) {
        try {
          const { data: existing } = await supabase
            .from('compendium_powers')
            .select('id')
            .eq('name', powerData.name)
            .maybeSingle();

          if (existing && !options.overwrite) {
            result.warnings.push(`Power "${powerData.name}" already exists, skipping`);
            continue;
          }

          const powerInsert: PowerInsert = {
            name: powerData.name,
            display_name: powerData.display_name,
            aliases: powerData.aliases || [],
            power_level: powerData.power_level,
            school: powerData.school,
            casting_time: powerData.casting_time,
            range: powerData.range,
            duration: powerData.duration,
            components: powerData.components,
            concentration: powerData.concentration,
            ritual: powerData.ritual,
            description: powerData.description,
            higher_levels: powerData.higher_levels,
            job_names: powerData.job_names || [],
            source_book: powerData.source_book,
            tags: powerData.tags || [],
            source_kind: powerData.source_kind,
            source_name: powerData.source_name,
            license_note: powerData.license_note,
            generated_reason: powerData.generated_reason,
            theme_tags: powerData.theme_tags,
          };

          if (existing && options.overwrite) {
            await supabase
              .from('compendium_powers')
              .update(powerInsert)
              .eq('id', existing.id);
          } else {
            await supabase
              .from('compendium_powers')
              .insert(powerInsert);
          }
          result.imported.powers++;
        } catch (error) {
          result.errors.push(`Failed to import power "${powerData.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.success = false;
        }
      }
    }

    // Import relics
    if (bundle.relics) {
      for (const relicData of bundle.relics) {
        try {
          const { data: existing } = await supabase
            .from('compendium_relics')
            .select('id')
            .eq('name', relicData.name)
            .maybeSingle();

          if (existing && !options.overwrite) {
            result.warnings.push(`Relic "${relicData.name}" already exists, skipping`);
            continue;
          }

          const relicInsert: RelicInsert = {
            name: relicData.name,
            display_name: relicData.display_name,
            aliases: relicData.aliases || [],
            rarity: relicData.rarity,
            relic_tier: relicData.relic_tier,
            item_type: relicData.item_type,
            requires_attunement: relicData.requires_attunement,
            attunement_requirements: relicData.attunement_requirements,
            description: relicData.description,
            properties: relicData.properties || [],
            quirks: relicData.quirks || [],
            corruption_risk: relicData.corruption_risk,
            value_credits: relicData.value_credits,
            source_book: relicData.source_book,
            tags: relicData.tags || [],
            source_kind: relicData.source_kind,
            source_name: relicData.source_name,
            license_note: relicData.license_note,
            generated_reason: relicData.generated_reason,
            theme_tags: relicData.theme_tags,
          };

          if (existing && options.overwrite) {
            await supabase
              .from('compendium_relics')
              .update(relicInsert)
              .eq('id', existing.id);
          } else {
            await supabase
              .from('compendium_relics')
              .insert(relicInsert);
          }
          result.imported.relics++;
        } catch (error) {
          result.errors.push(`Failed to import relic "${relicData.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.success = false;
        }
      }
    }

    // Import monsters
    if (bundle.monsters) {
      for (const monsterData of bundle.monsters) {
        try {
          const { data: existing } = await supabase
            .from('compendium_monsters')
            .select('id')
            .eq('name', monsterData.name)
            .maybeSingle();

          if (existing && !options.overwrite) {
            result.warnings.push(`Monster "${monsterData.name}" already exists, skipping`);
            continue;
          }

          const monsterInsert: MonsterInsert = {
            name: monsterData.name,
            display_name: monsterData.display_name,
            aliases: monsterData.aliases || [],
            size: monsterData.size,
            creature_type: monsterData.creature_type,
            alignment: monsterData.alignment,
            cr: monsterData.cr,
            armor_class: monsterData.armor_class,
            armor_type: monsterData.armor_type,
            hit_points_average: monsterData.hit_points_average,
            hit_points_formula: monsterData.hit_points_formula,
            speed_walk: monsterData.speed_walk,
            speed_fly: monsterData.speed_fly,
            speed_swim: monsterData.speed_swim,
            speed_climb: monsterData.speed_climb,
            speed_burrow: monsterData.speed_burrow,
            str: monsterData.str,
            agi: monsterData.agi,
            vit: monsterData.vit,
            int: monsterData.int,
            sense: monsterData.sense,
            pre: monsterData.pre,
            saving_throws: monsterData.saving_throws,
            skills: monsterData.skills,
            damage_resistances: monsterData.damage_resistances || [],
            damage_immunities: monsterData.damage_immunities || [],
            damage_vulnerabilities: monsterData.damage_vulnerabilities || [],
            condition_immunities: monsterData.condition_immunities || [],
            senses: monsterData.senses,
            languages: monsterData.languages || [],
            description: monsterData.description,
            lore: monsterData.lore,
            gate_rank: monsterData.gate_rank,
            is_boss: monsterData.is_boss,
            xp: monsterData.xp,
            source_book: monsterData.source_book,
            tags: monsterData.tags || [],
            source_kind: monsterData.source_kind,
            source_name: monsterData.source_name,
            license_note: monsterData.license_note,
            generated_reason: monsterData.generated_reason,
            theme_tags: monsterData.theme_tags,
          };

          if (existing && options.overwrite) {
            await supabase
              .from('compendium_monsters')
              .update(monsterInsert)
              .eq('id', existing.id);
          } else {
            await supabase
              .from('compendium_monsters')
              .insert(monsterInsert);
          }
          result.imported.monsters++;
        } catch (error) {
          result.errors.push(`Failed to import monster "${monsterData.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.success = false;
        }
      }
    }

    // Import backgrounds
    if (bundle.backgrounds) {
      for (const backgroundData of bundle.backgrounds) {
        try {
          const { data: existing } = await supabase
            .from('compendium_backgrounds')
            .select('id')
            .eq('name', backgroundData.name)
            .maybeSingle();

          if (existing && !options.overwrite) {
            result.warnings.push(`Background "${backgroundData.name}" already exists, skipping`);
            continue;
          }

          const backgroundInsert: BackgroundInsert = {
            name: backgroundData.name,
            display_name: backgroundData.display_name,
            aliases: backgroundData.aliases || [],
            description: backgroundData.description,
            feature_name: backgroundData.feature_name,
            feature_description: backgroundData.feature_description,
            skill_proficiencies: backgroundData.skill_proficiencies || [],
            tool_proficiencies: backgroundData.tool_proficiencies || [],
            language_count: backgroundData.language_count,
            starting_equipment: backgroundData.starting_equipment,
            starting_credits: backgroundData.starting_credits,
            personality_traits: backgroundData.personality_traits || [],
            ideals: backgroundData.ideals || [],
            bonds: backgroundData.bonds || [],
            flaws: backgroundData.flaws || [],
            source_book: backgroundData.source_book,
            tags: backgroundData.tags || [],
            source_kind: backgroundData.source_kind,
            source_name: backgroundData.source_name,
            license_note: backgroundData.license_note,
            generated_reason: backgroundData.generated_reason,
            theme_tags: backgroundData.theme_tags,
          };

          if (existing && options.overwrite) {
            await supabase
              .from('compendium_backgrounds')
              .update(backgroundInsert)
              .eq('id', existing.id);
          } else {
            await supabase
              .from('compendium_backgrounds')
              .insert(backgroundInsert);
          }
          result.imported.backgrounds++;
        } catch (error) {
          result.errors.push(`Failed to import background "${backgroundData.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
          result.success = false;
        }
      }
    }

    return result;
  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown import error');
    return result;
  }
}

// Parse JSON content
export function parseJSONContent(jsonString: string): ContentBundle {
  return JSON.parse(jsonString);
}

// Parse YAML content
export async function parseYAMLContent(yamlString: string): Promise<ContentBundle> {
  try {
    const { parse } = await import('yaml');
    const parsed = parse(yamlString);
    return parsed as ContentBundle;
  } catch (error) {
    throw new AppError(
      `Failed to parse YAML content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'INVALID_INPUT',
      error
    );
  }
}

