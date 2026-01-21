import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const rootDir = process.cwd();

const loadLocalEnv = async () => {
  const envPath = path.resolve(rootDir, '.env.local');
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex <= 0) return;
      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    });
  } catch {
    // ignore missing env file
  }
};

const assetExtensions = new Set([
  'png',
  'jpg',
  'jpeg',
  'webp',
  'avif',
  'svg',
  'gif',
  'ico',
  'webmanifest',
  'mp3',
  'wav',
  'ogg',
  'm4a',
  'mp4',
  'webm',
  'wasm',
  'glb',
  'gltf',
  'json',
  'css',
]);

const ignoredAssetPaths = new Set([
  '/manifest.webmanifest',
]);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const walkFiles = async (dir, filterFn, list = []) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      await walkFiles(entryPath, filterFn, list);
    } else if (!filterFn || filterFn(entryPath)) {
      list.push(entryPath);
    }
  }
  return list;
};

const normalizeAssetPath = (value) => value.split('?')[0].split('#')[0];

const collectPublicAssets = async () => {
  const publicDir = path.resolve(rootDir, 'public');
  const files = await walkFiles(publicDir);
  const assetSet = new Set();
  for (const file of files) {
    const rel = `/${path.relative(publicDir, file).replace(/\\/g, '/')}`;
    assetSet.add(rel);
  }
  return assetSet;
};

const extractAssetPaths = async (files) => {
  const assets = new Set();
  const stringAssetRegex = /(["'`])(?<path>\/[^"'`\s]+?\.[a-z0-9]+)(?:\?[^"'`]*)?\1/gi;
  const cssUrlRegex = /url\((?<path>[^)]+)\)/gi;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    let match;
    while ((match = stringAssetRegex.exec(content))) {
      const assetPath = match.groups?.path;
      if (!assetPath || assetPath.startsWith('//')) continue;
      if (assetPath.startsWith('http')) continue;
      const ext = assetPath.split('.').pop()?.toLowerCase();
      if (!ext || !assetExtensions.has(ext)) continue;
      assets.add(normalizeAssetPath(assetPath));
    }

    while ((match = cssUrlRegex.exec(content))) {
      const rawPath = match.groups?.path?.trim();
      if (!rawPath || rawPath.startsWith('data:')) continue;
      const cleaned = rawPath.replace(/^["']|["']$/g, '');
      if (!cleaned.startsWith('/')) continue;
      const ext = cleaned.split('.').pop()?.toLowerCase();
      if (!ext || !assetExtensions.has(ext)) continue;
      assets.add(normalizeAssetPath(cleaned));
    }
  }

  return assets;
};

const extractRoutePatterns = async () => {
  const appPath = path.resolve(rootDir, 'src', 'App.tsx');
  const content = await fs.readFile(appPath, 'utf8');
  const routePattern = /path\s*=\s*{?\s*["']([^"']+)["']\s*}?/g;
  const patterns = new Set();
  let match;
  while ((match = routePattern.exec(content))) {
    const pattern = match[1]?.trim();
    if (!pattern) continue;
    patterns.add(pattern);
  }
  return patterns;
};

const buildRouteRegexes = (patterns) =>
  patterns
    .filter((pattern) => pattern)
    .map((pattern) => {
      const tokenized = pattern
        .replace(/:[^/]+/g, '__PARAM__')
        .replace(/\*/g, '__WILDCARD__');
      const escaped = escapeRegExp(tokenized)
        .replace(/__PARAM__/g, '[^/]+')
        .replace(/__WILDCARD__/g, '.*');
      return { pattern, regex: new RegExp(`^${escaped}$`) };
    });

const extractRouteLinks = async (files) => {
  const links = new Set();
  const linkPattern = /\b(?:to|href)\s*=\s*{?\s*["'`]([^"'`]+)["'`]\s*}?/g;
  const navigatePattern = /\bnavigate\(\s*["'`]([^"'`]+)["'`]/g;
  const replacePattern = /\b(?:window\.)?location\.assign\(\s*["'`]([^"'`]+)["'`]/g;
  const redirectPattern = /<Navigate[^>]*\s+to=\s*{?\s*["'`]([^"'`]+)["'`]/g;

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const patterns = [linkPattern, navigatePattern, replacePattern, redirectPattern];
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content))) {
        const raw = match[1]?.trim();
        if (!raw || !raw.startsWith('/')) continue;
        if (raw.startsWith('//') || raw.includes('http')) continue;
        if (raw.includes('${')) continue;
        if (raw.includes('#')) continue;
        const ext = raw.split('.').pop()?.toLowerCase();
        if (ext && assetExtensions.has(ext)) continue;
        if (raw.includes('?')) {
          links.add(raw.split('?')[0]);
          continue;
        }
        links.add(raw);
      }
    }
  }
  return links;
};

const checkDbIntegrity = async () => {
  await loadLocalEnv();
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return { skipped: true, reason: 'Missing Supabase env' };
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const [{ data: characters, error: characterError }, { data: runes, error: runeError }] = await Promise.all([
    admin.from('characters').select('id, name, job, path, background'),
    admin.from('compendium_runes').select('id'),
  ]);

  if (characterError) throw new Error(`Failed to fetch characters: ${characterError.message}`);
  if (runeError) throw new Error(`Failed to fetch runes: ${runeError.message}`);

  const runeIds = new Set((runes || []).map((rune) => rune.id));

  const [jobs, paths, backgrounds] = await Promise.all([
    admin.from('compendium_jobs').select('name'),
    admin.from('compendium_job_paths').select('name'),
    admin.from('compendium_backgrounds').select('name'),
  ]);

  if (jobs.error) throw new Error(`Failed to fetch jobs: ${jobs.error.message}`);
  if (paths.error) throw new Error(`Failed to fetch paths: ${paths.error.message}`);
  if (backgrounds.error) throw new Error(`Failed to fetch backgrounds: ${backgrounds.error.message}`);

  const jobNames = new Set((jobs.data || []).map((job) => job.name));
  const pathNames = new Set((paths.data || []).map((entry) => entry.name));
  const backgroundNames = new Set((backgrounds.data || []).map((entry) => entry.name));

  const broken = [];

  for (const character of characters || []) {
    if (character.job && !jobNames.has(character.job)) {
      broken.push({ character: character.name, type: 'job', value: character.job });
    }
    if (character.path && !pathNames.has(character.path)) {
      broken.push({ character: character.name, type: 'path', value: character.path });
    }
    if (character.background && !backgroundNames.has(character.background)) {
      broken.push({ character: character.name, type: 'background', value: character.background });
    }
  }

  const [{ data: inscriptions }, { data: knowledge }] = await Promise.all([
    admin.from('character_rune_inscriptions').select('character_id, rune_id'),
    admin.from('character_rune_knowledge').select('character_id, rune_id'),
  ]);

  const runeRefs = [...(inscriptions || []), ...(knowledge || [])];
  for (const ref of runeRefs) {
    if (ref?.rune_id && !runeIds.has(ref.rune_id)) {
      broken.push({ character: ref.character_id, type: 'rune', value: ref.rune_id });
    }
  }

  return { skipped: false, broken };
};

const main = async () => {
  const srcDir = path.resolve(rootDir, 'src');
  const codeFiles = await walkFiles(srcDir, (file) => /\.(ts|tsx|js|jsx|css)$/.test(file));
  const rootFiles = [];
  for (const file of ['index.html', 'vite.config.ts']) {
    const resolved = path.resolve(rootDir, file);
    try {
      await fs.access(resolved);
      rootFiles.push(resolved);
    } catch {
      // ignore missing root file
    }
  }
  const scanFiles = [...codeFiles, ...rootFiles];

  const publicAssets = await collectPublicAssets();
  const referencedAssets = await extractAssetPaths(scanFiles);
  const missingAssets = [...referencedAssets].filter(
    (asset) => !publicAssets.has(asset) && !ignoredAssetPaths.has(asset)
  );

  const routePatterns = await extractRoutePatterns();
  const routeRegexes = buildRouteRegexes([...routePatterns]);
  const routeLinks = await extractRouteLinks(scanFiles);
  const missingRoutes = [...routeLinks].filter(
    (link) => !routeRegexes.some(({ regex }) => regex.test(link))
  );

  const dbCheck = await checkDbIntegrity();

  const issues = [];
  if (missingAssets.length > 0) {
    issues.push({ type: 'missing-assets', count: missingAssets.length, items: missingAssets });
  }
  if (missingRoutes.length > 0) {
    issues.push({ type: 'missing-routes', count: missingRoutes.length, items: missingRoutes });
  }
  if (!dbCheck.skipped && dbCheck.broken.length > 0) {
    issues.push({ type: 'broken-db-links', count: dbCheck.broken.length, items: dbCheck.broken });
  }

  if (issues.length === 0) {
    console.log('Link audit passed: no missing assets, routes, or compendium references detected.');
    if (dbCheck.skipped) {
      console.log(`Database check skipped (${dbCheck.reason}).`);
    }
    return;
  }

  console.log('Link audit findings:');
  for (const issue of issues) {
    console.log(`- ${issue.type}: ${issue.count}`);
    issue.items.slice(0, 25).forEach((item) => console.log(`  - ${typeof item === 'string' ? item : JSON.stringify(item)}`));
    if (issue.items.length > 25) {
      console.log(`  ...and ${issue.items.length - 25} more`);
    }
  }

  if (dbCheck.skipped) {
    console.log(`Database check skipped (${dbCheck.reason}).`);
  }

  process.exitCode = 1;
};

await main();
