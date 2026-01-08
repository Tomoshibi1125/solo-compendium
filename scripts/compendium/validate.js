import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateContentBundle } from './schema.js';

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

async function validateDir(dirLabel, dirPath) {
  const jsonFiles = await listJsonFiles(dirPath).catch(() => []);
  const results = [];

  for (const file of jsonFiles) {
    const rel = path.relative(repoRoot, file);
    const bundle = await readJson(file);
    const result = validateContentBundle(bundle, rel);
    results.push({ file: rel, ...result });
  }

  return { dirLabel, dirPath, results };
}

async function main() {
  const reports = await Promise.all([
    validateDir('base', baseDir),
    validateDir('generated', generatedDir),
  ]);

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


