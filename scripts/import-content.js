import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { validateContentBundle } from './compendium/schema.js';

class ScriptError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScriptError';
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = argv.slice(2);
  const out = {
    dirs: [],
    files: [],
    dryRun: true,
    overwrite: false,
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--dir') {
      const val = args[i + 1];
      if (!val) throw new ScriptError('--dir requires a value');
      out.dirs.push(val);
      i++;
      continue;
    }
    if (a === '--file') {
      const val = args[i + 1];
      if (!val) throw new ScriptError('--file requires a value');
      out.files.push(val);
      i++;
      continue;
    }
    if (a === '--apply') {
      out.dryRun = false;
      continue;
    }
    if (a === '--dry-run') {
      out.dryRun = true;
      continue;
    }
    if (a === '--overwrite') {
      out.overwrite = true;
      continue;
    }
    if (a === '--help' || a === '-h') {
      printHelpAndExit(0);
    }
    throw new ScriptError(`Unknown arg: ${a}`);
  }

  if (out.dirs.length === 0 && out.files.length === 0) {
    out.dirs = [
      'data/compendium/base',
      'data/compendium/generated',
    ];
  }

  return out;
}

function printHelpAndExit(code) {
  console.log(`
Usage:
  npm run import:content -- [--apply] [--overwrite] [--dir <dir>]... [--file <file>]...

Defaults:
  - Dry-run is ON by default (no DB writes)
  - If no --dir/--file is provided, reads:
      data/compendium/base
      data/compendium/generated

Examples:
  # Validate + show counts only (no DB writes)
  npm run import:content

  # Apply (requires VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
  npm run import:content -- --apply

  # Apply a single bundle file
  npm run import:content -- --apply --file data/compendium/base/example.bundle.json
`.trim());
  process.exit(code);
}

async function loadDotenvLocal() {
  const envPath = path.resolve(repoRoot, '.env.local');
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!key) continue;
      if (process.env[key] !== undefined) continue;
      process.env[key] = value;
    }
  } catch {
    // no .env.local; ignore
  }
}

async function listJsonFiles(dir) {
  const abs = path.resolve(repoRoot, dir);
  const entries = await fs.readdir(abs, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(abs, e.name);
    if (e.isDirectory()) {
      files.push(...await listJsonFiles(path.relative(repoRoot, full)));
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

async function readJson(absPath) {
  const raw = await fs.readFile(absPath, 'utf8');
  return JSON.parse(raw);
}

function mergeBundles(bundles) {
  const merged = {
    version: 'merged',
    jobs: [],
    job_paths: [],
    job_features: [],
    powers: [],
    relics: [],
    monsters: [],
    backgrounds: [],
  };

  for (const b of bundles) {
    if (b.jobs) merged.jobs.push(...b.jobs);
    if (b.job_paths) merged.job_paths.push(...b.job_paths);
    if (b.job_features) merged.job_features.push(...b.job_features);
    if (b.powers) merged.powers.push(...b.powers);
    if (b.relics) merged.relics.push(...b.relics);
    if (b.monsters) merged.monsters.push(...b.monsters);
    if (b.backgrounds) merged.backgrounds.push(...b.backgrounds);
  }

  // Drop empty arrays to keep shape close to the app’s ContentBundle.
  for (const key of Object.keys(merged)) {
    if (Array.isArray(merged[key]) && merged[key].length === 0) delete merged[key];
  }

  return merged;
}

async function importBundleToSupabase(bundle, { overwrite }) {
  await loadDotenvLocal();

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new ScriptError('Missing env: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for --apply');
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const result = {
    jobs: 0,
    job_paths: 0,
    job_features: 0,
    powers: 0,
    relics: 0,
    monsters: 0,
    backgrounds: 0,
  };

  // Jobs
  for (const job of bundle.jobs || []) {
    const { data: existing } = await supabase
      .from('compendium_jobs')
      .select('id')
      .eq('name', job.name)
      .maybeSingle();

    if (existing && !overwrite) continue;

    const payload = {
      name: job.name,
      display_name: job.display_name ?? null,
      aliases: job.aliases ?? [],
      description: job.description,
      flavor_text: job.flavor_text ?? null,
      primary_abilities: job.primary_abilities,
      secondary_abilities: job.secondary_abilities ?? [],
      hit_die: job.hit_die,
      armor_proficiencies: job.armor_proficiencies ?? [],
      weapon_proficiencies: job.weapon_proficiencies ?? [],
      tool_proficiencies: job.tool_proficiencies ?? [],
      saving_throw_proficiencies: job.saving_throw_proficiencies,
      skill_choices: job.skill_choices ?? [],
      skill_choice_count: job.skill_choice_count ?? null,
      source_book: job.source_book ?? null,
      tags: job.tags ?? [],
      source_kind: job.source_kind ?? null,
      source_name: job.source_name ?? null,
      license_note: job.license_note ?? null,
      generated_reason: job.generated_reason ?? null,
      theme_tags: job.theme_tags ?? null,
    };

    if (existing) {
      const { error } = await supabase.from('compendium_jobs').update(payload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('compendium_jobs').insert(payload);
      if (error) throw error;
    }
    result.jobs++;
  }

  // Fetch job name -> id map after inserts
  const { data: jobs } = await supabase.from('compendium_jobs').select('id, name');
  const jobIdByName = new Map((jobs || []).map((j) => [j.name, j.id]));

  // Job Paths
  for (const p of bundle.job_paths || []) {
    const jobId = jobIdByName.get(p.job_name);
    if (!jobId) throw new ScriptError(`Job not found for path: ${p.job_name}`);

    const { data: existing } = await supabase
      .from('compendium_job_paths')
      .select('id')
      .eq('job_id', jobId)
      .eq('name', p.name)
      .maybeSingle();

    if (existing && !overwrite) continue;

    const payload = {
      job_id: jobId,
      name: p.name,
      display_name: p.display_name ?? null,
      aliases: p.aliases ?? [],
      description: p.description,
      flavor_text: p.flavor_text ?? null,
      path_level: p.path_level ?? null,
      source_book: p.source_book ?? null,
      tags: p.tags ?? [],
      source_kind: p.source_kind ?? null,
      source_name: p.source_name ?? null,
      license_note: p.license_note ?? null,
      generated_reason: p.generated_reason ?? null,
      theme_tags: p.theme_tags ?? null,
    };

    if (existing) {
      const { error } = await supabase.from('compendium_job_paths').update(payload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('compendium_job_paths').insert(payload);
      if (error) throw error;
    }
    result.job_paths++;
  }

  // Build (job_name,path_name)->id map for features
  const { data: paths } = await supabase.from('compendium_job_paths').select('id, name, job_id');
  const pathIdByJobAndName = new Map(
    (paths || []).map((p) => [`${p.job_id}:${p.name}`, p.id]),
  );

  // Job Features
  for (const f of bundle.job_features || []) {
    const jobId = jobIdByName.get(f.job_name);
    if (!jobId) throw new ScriptError(`Job not found for feature: ${f.job_name}`);

    const pathId = f.path_name ? pathIdByJobAndName.get(`${jobId}:${f.path_name}`) : null;

    // Best-effort dedupe check
    const q = supabase
      .from('compendium_job_features')
      .select('id')
      .eq('job_id', jobId)
      .eq('name', f.name)
      .eq('level', f.level);

    const { data: existing } = pathId
      ? await q.eq('path_id', pathId).maybeSingle()
      : await q.is('path_id', null).maybeSingle();

    if (existing && !overwrite) continue;

    const payload = {
      job_id: jobId,
      path_id: pathId,
      name: f.name,
      display_name: f.display_name ?? null,
      aliases: f.aliases ?? [],
      level: f.level,
      description: f.description,
      action_type: f.action_type ?? null,
      uses_formula: f.uses_formula ?? null,
      recharge: f.recharge ?? null,
      prerequisites: f.prerequisites ?? null,
      is_path_feature: Boolean(f.path_name || f.is_path_feature),
    };

    if (existing) {
      const { error } = await supabase.from('compendium_job_features').update(payload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('compendium_job_features').insert(payload);
      if (error) throw error;
    }
    result.job_features++;
  }

  // Powers
  for (const p of bundle.powers || []) {
    const { data: existing } = await supabase
      .from('compendium_powers')
      .select('id')
      .eq('name', p.name)
      .maybeSingle();

    if (existing && !overwrite) continue;

    const payload = {
      name: p.name,
      display_name: p.display_name ?? null,
      aliases: p.aliases ?? [],
      power_level: p.power_level,
      school: p.school ?? null,
      casting_time: p.casting_time,
      range: p.range,
      duration: p.duration,
      components: p.components ?? null,
      concentration: p.concentration ?? false,
      ritual: p.ritual ?? false,
      description: p.description,
      higher_levels: p.higher_levels ?? null,
      job_names: p.job_names ?? [],
      source_book: p.source_book ?? null,
      tags: p.tags ?? [],
      source_kind: p.source_kind ?? null,
      source_name: p.source_name ?? null,
      license_note: p.license_note ?? null,
      generated_reason: p.generated_reason ?? null,
      theme_tags: p.theme_tags ?? null,
    };

    if (existing) {
      const { error } = await supabase.from('compendium_powers').update(payload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('compendium_powers').insert(payload);
      if (error) throw error;
    }
    result.powers++;
  }

  // Relics
  for (const r of bundle.relics || []) {
    const { data: existing } = await supabase
      .from('compendium_relics')
      .select('id')
      .eq('name', r.name)
      .maybeSingle();

    if (existing && !overwrite) continue;

    const payload = {
      name: r.name,
      display_name: r.display_name ?? null,
      aliases: r.aliases ?? [],
      rarity: r.rarity,
      relic_tier: r.relic_tier ?? null,
      item_type: r.item_type,
      requires_attunement: r.requires_attunement ?? false,
      attunement_requirements: r.attunement_requirements ?? null,
      description: r.description,
      properties: r.properties ?? [],
      quirks: r.quirks ?? [],
      corruption_risk: r.corruption_risk ?? null,
      value_credits: r.value_credits ?? null,
      source_book: r.source_book ?? null,
      tags: r.tags ?? [],
      source_kind: r.source_kind ?? null,
      source_name: r.source_name ?? null,
      license_note: r.license_note ?? null,
      generated_reason: r.generated_reason ?? null,
      theme_tags: r.theme_tags ?? null,
    };

    if (existing) {
      const { error } = await supabase.from('compendium_relics').update(payload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('compendium_relics').insert(payload);
      if (error) throw error;
    }
    result.relics++;
  }

  // Monsters
  for (const m of bundle.monsters || []) {
    const { data: existing } = await supabase
      .from('compendium_monsters')
      .select('id')
      .eq('name', m.name)
      .maybeSingle();

    if (existing && !overwrite) continue;

    const payload = {
      name: m.name,
      display_name: m.display_name ?? null,
      aliases: m.aliases ?? [],
      size: m.size,
      creature_type: m.creature_type,
      alignment: m.alignment ?? null,
      cr: m.cr,
      xp: m.xp ?? null,
      armor_class: m.armor_class,
      armor_type: m.armor_type ?? null,
      hit_points_average: m.hit_points_average,
      hit_points_formula: m.hit_points_formula,
      speed_walk: m.speed_walk ?? null,
      speed_fly: m.speed_fly ?? null,
      speed_swim: m.speed_swim ?? null,
      speed_climb: m.speed_climb ?? null,
      speed_burrow: m.speed_burrow ?? null,
      str: m.str,
      agi: m.agi,
      vit: m.vit,
      int: m.int,
      sense: m.sense,
      pre: m.pre,
      saving_throws: m.saving_throws ?? null,
      skills: m.skills ?? null,
      damage_resistances: m.damage_resistances ?? [],
      damage_immunities: m.damage_immunities ?? [],
      damage_vulnerabilities: m.damage_vulnerabilities ?? [],
      condition_immunities: m.condition_immunities ?? [],
      senses: m.senses ?? null,
      languages: m.languages ?? [],
      description: m.description ?? null,
      lore: m.lore ?? null,
      gate_rank: m.gate_rank ?? null,
      is_boss: m.is_boss ?? false,
      source_book: m.source_book ?? null,
      tags: m.tags ?? [],
      source_kind: m.source_kind ?? null,
      source_name: m.source_name ?? null,
      license_note: m.license_note ?? null,
      generated_reason: m.generated_reason ?? null,
      theme_tags: m.theme_tags ?? null,
    };

    if (existing) {
      const { error } = await supabase.from('compendium_monsters').update(payload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('compendium_monsters').insert(payload);
      if (error) throw error;
    }
    result.monsters++;
  }

  // Backgrounds
  for (const b of bundle.backgrounds || []) {
    const { data: existing } = await supabase
      .from('compendium_backgrounds')
      .select('id')
      .eq('name', b.name)
      .maybeSingle();

    if (existing && !overwrite) continue;

    const payload = {
      name: b.name,
      display_name: b.display_name ?? null,
      aliases: b.aliases ?? [],
      description: b.description,
      feature_name: b.feature_name ?? null,
      feature_description: b.feature_description ?? null,
      skill_proficiencies: b.skill_proficiencies ?? [],
      tool_proficiencies: b.tool_proficiencies ?? [],
      language_count: b.language_count ?? null,
      starting_equipment: b.starting_equipment ?? null,
      starting_credits: b.starting_credits ?? null,
      personality_traits: b.personality_traits ?? [],
      ideals: b.ideals ?? [],
      bonds: b.bonds ?? [],
      flaws: b.flaws ?? [],
      source_book: b.source_book ?? null,
      tags: b.tags ?? [],
      source_kind: b.source_kind ?? null,
      source_name: b.source_name ?? null,
      license_note: b.license_note ?? null,
      generated_reason: b.generated_reason ?? null,
      theme_tags: b.theme_tags ?? null,
    };

    if (existing) {
      const { error } = await supabase.from('compendium_backgrounds').update(payload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('compendium_backgrounds').insert(payload);
      if (error) throw error;
    }
    result.backgrounds++;
  }

  return result;
}

async function main() {
  const opts = parseArgs(process.argv);

  const bundleFiles = [];
  for (const f of opts.files) bundleFiles.push(path.resolve(repoRoot, f));
  for (const d of opts.dirs) bundleFiles.push(...await listJsonFiles(d));

  // De-dupe + stable order
  const uniqueFiles = Array.from(new Set(bundleFiles)).sort();
  if (uniqueFiles.length === 0) throw new ScriptError('No bundle files found');

  const bundles = [];
  const allErrors = [];
  const allWarnings = [];

  for (const abs of uniqueFiles) {
    const rel = path.relative(repoRoot, abs);
    const bundle = await readJson(abs);
    const validation = validateContentBundle(bundle, rel);
    allWarnings.push(...validation.warnings);
    if (!validation.valid) allErrors.push(...validation.errors);
    bundles.push(bundle);
  }

  if (allWarnings.length > 0) {
    console.warn(`⚠️ ${allWarnings.length} warning(s)`);
    for (const w of allWarnings) {
      console.warn(`- ${w.path}: ${w.message}`);
    }
  }

  if (allErrors.length > 0) {
    console.error(`❌ ${allErrors.length} error(s)`);
    for (const e of allErrors) {
      console.error(`- ${e.path}: ${e.message}`);
    }
    process.exit(1);
  }

  const merged = mergeBundles(bundles);

  const counts = {
    jobs: merged.jobs?.length ?? 0,
    job_paths: merged.job_paths?.length ?? 0,
    job_features: merged.job_features?.length ?? 0,
    powers: merged.powers?.length ?? 0,
    relics: merged.relics?.length ?? 0,
    monsters: merged.monsters?.length ?? 0,
    backgrounds: merged.backgrounds?.length ?? 0,
  };

  console.log(`\nBundle OK. Counts: ${JSON.stringify(counts)}`);

  if (opts.dryRun) {
    console.log('Dry run: no database writes (use --apply to import).');
    return;
  }

  const imported = await importBundleToSupabase(merged, { overwrite: opts.overwrite });
  console.log(`Imported: ${JSON.stringify(imported)}`);
}

await main();


