import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';

// Zod schemas for content validation
export const JobSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  description: z.string().min(1),
  flavor_text: z.string().optional(),
  primary_abilities: z.array(z.enum(['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'])).min(1),
  secondary_abilities: z.array(z.enum(['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'])).optional(),
  hit_die: z.number().int().min(6).max(12),
  armor_proficiencies: z.array(z.string()).optional(),
  weapon_proficiencies: z.array(z.string()).optional(),
  tool_proficiencies: z.array(z.string()).optional(),
  saving_throw_proficiencies: z.array(z.enum(['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'])).length(2),
  skill_choices: z.array(z.string()).optional(),
  skill_choice_count: z.number().int().min(1).default(2),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
  // Provenance
  source_kind: z.enum(['homebrew', 'srd', 'generated']).default('homebrew'),
  source_name: z.string().default('Solo Compendium Homebrew'),
  license_note: z.string().optional(),
  generated_reason: z.string().optional(),
  theme_tags: z.array(z.string()).optional(),
});

export const JobPathSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  description: z.string().min(1),
  flavor_text: z.string().optional(),
  path_level: z.number().int().min(1).max(20).default(3),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source_kind: z.enum(['homebrew', 'srd', 'generated']).default('homebrew'),
  source_name: z.string().default('Solo Compendium Homebrew'),
  license_note: z.string().optional(),
  generated_reason: z.string().optional(),
  theme_tags: z.array(z.string()).optional(),
});

export const JobFeatureSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  level: z.number().int().min(1).max(20),
  description: z.string().min(1),
  action_type: z.enum(['action', 'bonus-action', 'reaction', 'passive']).optional(),
  uses_formula: z.string().optional(),
  recharge: z.enum(['short-rest', 'long-rest', 'encounter']).optional(),
  prerequisites: z.string().optional(),
  is_path_feature: z.boolean().default(false),
});

export const PowerSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  power_level: z.number().int().min(0).max(9),
  school: z.string().optional(),
  casting_time: z.string().min(1),
  range: z.string().min(1),
  duration: z.string().min(1),
  components: z.string().optional(),
  concentration: z.boolean().default(false),
  ritual: z.boolean().default(false),
  description: z.string().min(1),
  higher_levels: z.string().optional(),
  job_names: z.array(z.string()).optional(),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source_kind: z.enum(['homebrew', 'srd', 'generated']).default('homebrew'),
  source_name: z.string().default('Solo Compendium Homebrew'),
  license_note: z.string().optional(),
  generated_reason: z.string().optional(),
  theme_tags: z.array(z.string()).optional(),
});

export const RelicSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  rarity: z.enum(['common', 'uncommon', 'rare', 'very_rare', 'legendary']),
  relic_tier: z.enum(['E', 'D', 'C', 'B', 'A', 'S', 'SS']).optional(),
  item_type: z.string().min(1),
  requires_attunement: z.boolean().default(false),
  attunement_requirements: z.string().optional(),
  description: z.string().min(1),
  properties: z.array(z.string()).optional(),
  quirks: z.array(z.string()).optional(),
  corruption_risk: z.string().optional(),
  value_credits: z.number().int().optional(),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source_kind: z.enum(['homebrew', 'srd', 'generated']).default('homebrew'),
  source_name: z.string().default('Solo Compendium Homebrew'),
  license_note: z.string().optional(),
  generated_reason: z.string().optional(),
  theme_tags: z.array(z.string()).optional(),
});

export const MonsterSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  size: z.enum(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']),
  creature_type: z.string().min(1),
  alignment: z.string().optional(),
  cr: z.string(),
  armor_class: z.number().int().min(1),
  armor_type: z.string().optional(),
  hit_points_average: z.number().int().min(1),
  hit_points_formula: z.string().min(1),
  speed_walk: z.number().int().min(0).optional(),
  speed_fly: z.number().int().min(0).optional(),
  speed_swim: z.number().int().min(0).optional(),
  speed_climb: z.number().int().min(0).optional(),
  speed_burrow: z.number().int().min(0).optional(),
  str: z.number().int().min(1).max(30),
  agi: z.number().int().min(1).max(30),
  vit: z.number().int().min(1).max(30),
  int: z.number().int().min(1).max(30),
  sense: z.number().int().min(1).max(30),
  pre: z.number().int().min(1).max(30),
  saving_throws: z.record(z.number()).optional(),
  skills: z.record(z.number()).optional(),
  damage_resistances: z.array(z.string()).optional(),
  damage_immunities: z.array(z.string()).optional(),
  damage_vulnerabilities: z.array(z.string()).optional(),
  condition_immunities: z.array(z.string()).optional(),
  senses: z.record(z.union([z.number(), z.string()])).optional(),
  languages: z.array(z.string()).optional(),
  description: z.string().optional(),
  lore: z.string().optional(),
  gate_rank: z.string().optional(),
  is_boss: z.boolean().default(false),
  xp: z.number().int().optional(),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source_kind: z.enum(['homebrew', 'srd', 'generated']).default('homebrew'),
  source_name: z.string().default('Solo Compendium Homebrew'),
  license_note: z.string().optional(),
  generated_reason: z.string().optional(),
  theme_tags: z.array(z.string()).optional(),
});

export const BackgroundSchema = z.object({
  name: z.string().min(1),
  display_name: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  description: z.string().min(1),
  feature_name: z.string().optional(),
  feature_description: z.string().optional(),
  skill_proficiencies: z.array(z.string()).optional(),
  tool_proficiencies: z.array(z.string()).optional(),
  language_count: z.number().int().min(0).optional(),
  starting_equipment: z.string().optional(),
  starting_credits: z.number().int().optional(),
  personality_traits: z.array(z.string()).optional(),
  ideals: z.array(z.string()).optional(),
  bonds: z.array(z.string()).optional(),
  flaws: z.array(z.string()).optional(),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source_kind: z.enum(['homebrew', 'srd', 'generated']).default('homebrew'),
  source_name: z.string().default('Solo Compendium Homebrew'),
  license_note: z.string().optional(),
  generated_reason: z.string().optional(),
  theme_tags: z.array(z.string()).optional(),
});

// Content bundle schema (for importing multiple items)
export const ContentBundleSchema = z.object({
  version: z.string().optional(),
  jobs: z.array(JobSchema).optional(),
  job_paths: z.array(JobPathSchema.extend({ job_name: z.string() })).optional(),
  job_features: z.array(JobFeatureSchema.extend({ job_name: z.string(), path_name: z.string().optional() })).optional(),
  powers: z.array(PowerSchema).optional(),
  relics: z.array(RelicSchema).optional(),
  monsters: z.array(MonsterSchema).optional(),
  backgrounds: z.array(BackgroundSchema).optional(),
});

export type ContentBundle = z.infer<typeof ContentBundleSchema>;

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
  warnings: Array<{ path: string; message: string }>;
}

// Validate content bundle
export function validateContentBundle(data: unknown): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    const parsed = ContentBundleSchema.safeParse(data);

    if (!parsed.success) {
      result.valid = false;
      result.errors = parsed.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return result;
    }

    // Additional validation checks
    const bundle = parsed.data;

    // Check for duplicate names
    if (bundle.jobs) {
      const jobNames = bundle.jobs.map(j => j.name);
      const duplicates = jobNames.filter((name, index) => jobNames.indexOf(name) !== index);
      if (duplicates.length > 0) {
        result.warnings.push({
          path: 'jobs',
          message: `Duplicate job names: ${duplicates.join(', ')}`,
        });
      }
    }

    // Validate job_paths reference valid jobs
    if (bundle.job_paths && bundle.jobs) {
      const jobNames = new Set(bundle.jobs.map(j => j.name));
      const invalidRefs = bundle.job_paths
        .filter(p => !jobNames.has(p.job_name))
        .map(p => p.job_name);
      if (invalidRefs.length > 0) {
        result.errors.push({
          path: 'job_paths',
          message: `Job paths reference non-existent jobs: ${invalidRefs.join(', ')}`,
        });
        result.valid = false;
      }
    }

    // Validate job_features reference valid jobs/paths
    if (bundle.job_features && bundle.jobs) {
      const jobNames = new Set(bundle.jobs.map(j => j.name));
      const pathNames = new Set(bundle.job_paths?.map(p => p.name) || []);

      bundle.job_features.forEach((feature, index) => {
        if (!jobNames.has(feature.job_name)) {
          result.errors.push({
            path: `job_features[${index}].job_name`,
            message: `Feature references non-existent job: ${feature.job_name}`,
          });
          result.valid = false;
        }
        if (feature.path_name && !pathNames.has(feature.path_name)) {
          result.errors.push({
            path: `job_features[${index}].path_name`,
            message: `Feature references non-existent path: ${feature.path_name}`,
          });
          result.valid = false;
        }
      });
    }

    return result;
  } catch (error) {
    result.valid = false;
    result.errors.push({
      path: 'root',
      message: error instanceof Error ? error.message : 'Unknown validation error',
    });
    return result;
  }
}

