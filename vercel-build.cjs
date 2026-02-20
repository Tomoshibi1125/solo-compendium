const fs = require('fs');
const path = require('path');

// Write runtime environment variables for Vercel
// Must write to window.__SOLO_COMPENDIUM_ENV__ to match src/lib/runtimeEnv.ts reader
const envVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_ROUTER_BASE',
  'VITE_BASE_PATH',
  'VITE_OAUTH_ENABLED',
  'VITE_GUEST_ENABLED',
];

const runtimeEnv = {};
envVars.forEach(key => {
  const value = process.env[key];
  if (value !== undefined && value.trim() !== '') {
    runtimeEnv[key] = value.trim();
  }
});

// Prefer PUBLISHABLE_KEY over ANON_KEY (same key, different name)
if (!runtimeEnv.VITE_SUPABASE_PUBLISHABLE_KEY && runtimeEnv.VITE_SUPABASE_ANON_KEY) {
  runtimeEnv.VITE_SUPABASE_PUBLISHABLE_KEY = runtimeEnv.VITE_SUPABASE_ANON_KEY;
}

const envContent = [
  '(function () {',
  "  if (typeof window === 'undefined') return;",
  `  window.__SOLO_COMPENDIUM_ENV__ = Object.assign({}, window.__SOLO_COMPENDIUM_ENV__ || {}, ${JSON.stringify(runtimeEnv)});`,
  '})();',
  '',
].join('\n');

const outputPath = path.join(__dirname, 'public', 'runtime-env.js');
fs.writeFileSync(outputPath, envContent);

const keys = Object.keys(runtimeEnv);
console.log(`Runtime environment written to: ${outputPath} (${keys.length} vars: ${keys.join(', ') || 'none'})`);
