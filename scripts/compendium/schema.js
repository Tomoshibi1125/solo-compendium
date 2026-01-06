import { z } from 'zod';

const AbilityScore = z.enum(['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE']);
const SourceKind = z.enum(['homebrew', 'srd', 'generated']);

const Provenance = z.object({
  source_kind: SourceKind.optional(),
  source_name: z.string().optional(),
  license_note: z.string().optional(),
  generated_reason: z.string().optional(),
  theme_tags: z.array(z.string()).optional(),
});

export const JobSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  flavor_text: z.string().optional(),
  primary_abilities: z.array(AbilityScore).min(1),
  secondary_abilities: z.array(AbilityScore).optional(),
  hit_die: z.number().int().min(6).max(12),
  armor_proficiencies: z.array(z.string()).optional(),
  weapon_proficiencies: z.array(z.string()).optional(),
  tool_proficiencies: z.array(z.string()).optional(),
  saving_throw_proficiencies: z.array(AbilityScore).length(2),
  skill_choices: z.array(z.string()).optional(),
  skill_choice_count: z.number().int().min(1).optional(),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).merge(Provenance).passthrough();

export const JobPathSchema = z.object({
  job_name: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  flavor_text: z.string().optional(),
  path_level: z.number().int().min(1).max(20).optional(),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).merge(Provenance).passthrough();

export const JobFeatureSchema = z.object({
  job_name: z.string().min(1),
  path_name: z.string().optional(),
  name: z.string().min(1),
  level: z.number().int().min(1).max(20),
  description: z.string().min(1),
  action_type: z.enum(['action', 'bonus-action', 'reaction', 'passive']).optional(),
  uses_formula: z.string().optional(),
  recharge: z.enum(['short-rest', 'long-rest', 'encounter']).optional(),
  prerequisites: z.string().optional(),
  is_path_feature: z.boolean().optional(),
}).passthrough();

export const PowerSchema = z.object({
  name: z.string().min(1),
  power_level: z.number().int().min(0).max(9),
  school: z.string().optional(),
  casting_time: z.string().min(1),
  range: z.string().min(1),
  duration: z.string().min(1),
  components: z.string().optional(),
  concentration: z.boolean().optional(),
  ritual: z.boolean().optional(),
  description: z.string().min(1),
  higher_levels: z.string().optional(),
  job_names: z.array(z.string()).optional(),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).merge(Provenance).passthrough();

export const RelicSchema = z.object({
  name: z.string().min(1),
  rarity: z.enum(['common', 'uncommon', 'rare', 'very_rare', 'legendary']),
  relic_tier: z.enum(['dormant', 'awakened', 'resonant']).optional(),
  item_type: z.string().min(1),
  requires_attunement: z.boolean().optional(),
  attunement_requirements: z.string().optional(),
  description: z.string().min(1),
  properties: z.array(z.string()).optional(),
  quirks: z.array(z.string()).optional(),
  corruption_risk: z.string().optional(),
  value_credits: z.number().int().optional(),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).merge(Provenance).passthrough();

export const MonsterSchema = z.object({
  name: z.string().min(1),
  size: z.enum(['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan']),
  creature_type: z.string().min(1),
  alignment: z.string().optional(),
  cr: z.string().min(1),
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
  is_boss: z.boolean().optional(),
  xp: z.number().int().optional(),
  source_book: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).merge(Provenance).passthrough();

export const BackgroundSchema = z.object({
  name: z.string().min(1),
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
}).merge(Provenance).passthrough();

export const ContentBundleSchema = z.object({
  version: z.string().optional(),
  jobs: z.array(JobSchema).optional(),
  job_paths: z.array(JobPathSchema).optional(),
  job_features: z.array(JobFeatureSchema).optional(),
  powers: z.array(PowerSchema).optional(),
  relics: z.array(RelicSchema).optional(),
  monsters: z.array(MonsterSchema).optional(),
  backgrounds: z.array(BackgroundSchema).optional(),
}).passthrough();

export function validateContentBundle(bundle, filenameForMessages = 'bundle') {
  const parsed = ContentBundleSchema.safeParse(bundle);
  const result = {
    valid: parsed.success,
    errors: [],
    warnings: [],
  };

  if (!parsed.success) {
    result.errors = parsed.error.errors.map((e) => ({
      path: `${filenameForMessages}:${e.path.join('.')}`,
      message: e.message,
    }));
    return result;
  }

  const data = parsed.data;

  // Cross-reference checks (best-effort; only within the same bundle).
  const jobNames = new Set((data.jobs || []).map((j) => j.name));
  const pathNames = new Set((data.job_paths || []).map((p) => p.name));

  for (const p of data.job_paths || []) {
    if (jobNames.size > 0 && !jobNames.has(p.job_name)) {
      result.errors.push({
        path: `${filenameForMessages}:job_paths`,
        message: `Path "${p.name}" references missing job "${p.job_name}"`,
      });
      result.valid = false;
    }
  }

  for (const [idx, f] of (data.job_features || []).entries()) {
    if (jobNames.size > 0 && !jobNames.has(f.job_name)) {
      result.errors.push({
        path: `${filenameForMessages}:job_features[${idx}].job_name`,
        message: `Feature "${f.name}" references missing job "${f.job_name}"`,
      });
      result.valid = false;
    }
    if (f.path_name && pathNames.size > 0 && !pathNames.has(f.path_name)) {
      result.errors.push({
        path: `${filenameForMessages}:job_features[${idx}].path_name`,
        message: `Feature "${f.name}" references missing path "${f.path_name}"`,
      });
      result.valid = false;
    }
  }

  // Generated content must carry a reason.
  const provenanceCheck = (arr, label) => {
    for (const [idx, item] of arr.entries()) {
      if (item?.source_kind === 'generated' && !item.generated_reason) {
        result.errors.push({
          path: `${filenameForMessages}:${label}[${idx}].generated_reason`,
          message: `generated content requires generated_reason`,
        });
        result.valid = false;
      }
    }
  };

  provenanceCheck(data.jobs || [], 'jobs');
  provenanceCheck(data.job_paths || [], 'job_paths');
  provenanceCheck(data.powers || [], 'powers');
  provenanceCheck(data.relics || [], 'relics');
  provenanceCheck(data.monsters || [], 'monsters');
  provenanceCheck(data.backgrounds || [], 'backgrounds');

  return result;
}


