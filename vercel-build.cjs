const fs = require('fs');
const path = require('path');

// Write runtime environment variables for Vercel
const envVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_ROUTER_BASE',
  'VITE_BASE_PATH'
];

let envContent = 'window.__RUNTIME_ENV__ = {\n';

envVars.forEach(key => {
  const value = process.env[key];
  if (value !== undefined) {
    // Escape JSON strings properly
    const escapedValue = value.replace(/"/g, '\\"');
    envContent += `  ${key}: "${escapedValue}",\n`;
  }
});

envContent += '};\n';

const outputPath = path.join(__dirname, 'public', 'runtime-env.js');
fs.writeFileSync(outputPath, envContent);

console.log('Runtime environment written to:', outputPath);
