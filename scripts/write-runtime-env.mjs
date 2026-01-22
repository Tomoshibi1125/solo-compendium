import fs from 'fs/promises';
import path from 'path';

const envFilePath = path.resolve(process.cwd(), '.env.local');
const outputPath = path.resolve(process.cwd(), 'public', 'runtime-env.js');

const parseEnvFile = async () => {
  try {
    const raw = await fs.readFile(envFilePath, 'utf8');
    return raw.split(/\r?\n/).reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return acc;
      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex <= 0) return acc;
      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const pickEnv = (sources, key) => {
  for (const source of sources) {
    const value = source?.[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return undefined;
};

const run = async () => {
  const fileEnv = await parseEnvFile();
  const runtimeEnv = {};
  const sources = [process.env, fileEnv];

  const supabaseUrl = pickEnv(sources, 'VITE_SUPABASE_URL');
  const supabaseKey =
    pickEnv(sources, 'VITE_SUPABASE_PUBLISHABLE_KEY') || pickEnv(sources, 'VITE_SUPABASE_ANON_KEY');
  const routerBase = pickEnv(sources, 'VITE_ROUTER_BASE') || pickEnv(sources, 'VITE_BASE_PATH');

  if (supabaseUrl) runtimeEnv.VITE_SUPABASE_URL = supabaseUrl;
  if (supabaseKey) {
    if (pickEnv(sources, 'VITE_SUPABASE_PUBLISHABLE_KEY')) {
      runtimeEnv.VITE_SUPABASE_PUBLISHABLE_KEY = supabaseKey;
    } else {
      runtimeEnv.VITE_SUPABASE_ANON_KEY = supabaseKey;
    }
  }
  if (routerBase) runtimeEnv.VITE_ROUTER_BASE = routerBase;

  const output = [
    '(function () {',
    "  if (typeof window === 'undefined') return;",
    `  window.__SOLO_COMPENDIUM_ENV__ = Object.assign({}, window.__SOLO_COMPENDIUM_ENV__ || {}, ${JSON.stringify(
      runtimeEnv
    )});`,
    '})();',
    '',
  ].join('\n');

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, output, 'utf8');
};

await run();
