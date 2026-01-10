import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ContentBundleSchema, validateContentBundle, validateParsedContentBundle } from './schema.js';

class ScriptError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScriptError';
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..', '..');
const baseDir = path.resolve(repoRoot, 'data', 'compendium', 'base');
const generatedDir = path.resolve(repoRoot, 'data', 'compendium', 'generated');

async function listJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listJsonFiles(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

async function readJson(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new ScriptError(`Invalid JSON: ${filePath}`);
  }
}

function addLocation(map, key, file) {
  const existing = map.get(key) || [];
  if (!existing.includes(file)) existing.push(file);
  map.set(key, existing);
}

function buildValidationContext(entries) {
  const jobNames = new Set();
  const pathsByJobName = new Map();

  const duplicates = {
    jobs: new Map(),
    job_paths: new Map(),
    powers: new Map(),
    relics: new Map(),
    monsters: new Map(),
    backgrounds: new Map(),
  };

  for (const entry of entries) {
    const data = entry.data;
    for (const j of data.jobs || []) {
      jobNames.add(j.name);
      addLocation(duplicates.jobs, j.name, entry.file);
    }
    for (const p of data.job_paths || []) {
      const set = pathsByJobName.get(p.job_name) || new Set();
      set.add(p.name);
      pathsByJobName.set(p.job_name, set);
      addLocation(duplicates.job_paths, `${p.job_name}:${p.name}`, entry.file);
    }
    for (const p of data.powers || []) {
      addLocation(duplicates.powers, p.name, entry.file);
    }
    for (const r of data.relics || []) {
      addLocation(duplicates.relics, r.name, entry.file);
    }
    for (const m of data.monsters || []) {
      addLocation(duplicates.monsters, m.name, entry.file);
    }
    for (const b of data.backgrounds || []) {
      addLocation(duplicates.backgrounds, b.name, entry.file);
    }
  }

  return { jobNames, pathsByJobName, duplicates };
}

async function loadDir(dirLabel, dirPath) {
  const jsonFiles = await listJsonFiles(dirPath).catch(() => []);
  const entries = [];

  for (const file of jsonFiles) {
    const rel = path.relative(repoRoot, file);
    const raw = await readJson(file);
    const parsed = ContentBundleSchema.safeParse(raw);
    entries.push({ dirLabel, file: rel, raw, parsed });
  }

  return entries;
}

async function main() {
  const allEntries = (await Promise.all([
    loadDir('base', baseDir),
    loadDir('generated', generatedDir),
  ])).flat();

  const context = buildValidationContext(
    allEntries
      .filter((e) => e.parsed.success)
      .map((e) => ({ file: e.file, data: e.parsed.data }))
  );

  const reports = [
    { dirLabel: 'base', dirPath: baseDir, results: [] },
    { dirLabel: 'generated', dirPath: generatedDir, results: [] },
  ];

  for (const entry of allEntries) {
    const result = entry.parsed.success
      ? validateParsedContentBundle(entry.parsed.data, entry.file, context)
      : validateContentBundle(entry.raw, entry.file, context);
    const report = reports.find((r) => r.dirLabel === entry.dirLabel);
    if (report) report.results.push({ file: entry.file, ...result });
  }

  let errorCount = 0;
  let warningCount = 0;

  for (const report of reports) {
    if (report.results.length === 0) continue;
    console.log(`\n[${report.dirLabel}] ${path.relative(repoRoot, report.dirPath)}`);
    for (const r of report.results) {
      if (!r.valid) {
        console.log(`- ❌ ${r.file}`);
        for (const e of r.errors) console.log(`  - ${e.path}: ${e.message}`);
        errorCount += r.errors.length;
      } else {
        console.log(`- ✅ ${r.file}`);
      }
      for (const w of r.warnings) {
        console.log(`  - ⚠️ ${w.path}: ${w.message}`);
        warningCount++;
      }
    }
  }

  if (errorCount > 0) {
    console.error(`\nValidation failed: ${errorCount} error(s), ${warningCount} warning(s)`);
    process.exit(1);
  }

  console.log(`\nValidation OK: ${warningCount} warning(s)`);
}

await main();


