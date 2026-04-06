const fs = require('fs');
const path = require('path');
const results = {
  'any_type': [],
  'record_unknown': [],
  'index_unknown': [],
  'as_any': [],
  'as_unknown': [],
  'todo_fixme': [],
  'mana_cost': [],
  'cooldown_field': [],
};

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue;
      walk(full);
    } else if (e.name.endsWith('.ts') || e.name.endsWith('.tsx')) {
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        const loc = full.replace(/\\/g, '/').replace(/.*solo-compendium\//, '') + ':' + (i+1);

        // Skip pure comments
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

        // : any (type annotation)
        if (/:\s*any\b/.test(line)) {
          results.any_type.push(loc + ' | ' + trimmed.substring(0, 120));
        }
        // as any
        if (/as\s+any\b/.test(line)) {
          results.as_any.push(loc + ' | ' + trimmed.substring(0, 120));
        }
        // Record<string, unknown>
        if (line.includes('Record<string, unknown>')) {
          results.record_unknown.push(loc + ' | ' + trimmed.substring(0, 120));
        }
        // [key: string]: unknown
        if (line.includes('[key: string]: unknown')) {
          results.index_unknown.push(loc + ' | ' + trimmed.substring(0, 120));
        }
        // as unknown
        if (/as\s+unknown\b/.test(line)) {
          results.as_unknown.push(loc + ' | ' + trimmed.substring(0, 120));
        }
        // TODO/FIXME in code (not in strings)
        if (/\bTODO\b/.test(line) || /\bFIXME\b/.test(line)) {
          results.todo_fixme.push(loc + ' | ' + trimmed.substring(0, 120));
        }
        // mana_cost
        if (/mana_cost/.test(line)) {
          results.mana_cost.push(loc + ' | ' + trimmed.substring(0, 120));
        }
        // cooldown as a typed field (not in strings)
        if (/cooldown\s*[?:]/.test(line) && !trimmed.includes('"') && !trimmed.includes("'")) {
          results.cooldown_field.push(loc + ' | ' + trimmed.substring(0, 120));
        }
      }
    }
  }
}

walk('src');
walk('scripts');

let output = '';
for (const [cat, items] of Object.entries(results)) {
  output += '\n=== ' + cat.toUpperCase() + ' (' + items.length + ' hits) ===\n';
  items.forEach(item => output += '  ' + item + '\n');
}
fs.writeFileSync('audit_results.txt', output, 'utf8');
console.log('Audit complete. Written to audit_results.txt');
