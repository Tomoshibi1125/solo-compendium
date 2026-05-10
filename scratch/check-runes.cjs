const fs = require('fs');
const files = fs.readdirSync('src/data/compendium/runes').filter(f => f.endsWith('.ts') && f !== 'index.ts');
let count = 0;
for (const file of files) {
  const content = fs.readFileSync('src/data/compendium/runes/' + file, 'utf8');
  const teaches = [...content.matchAll(/teaches:\s*\{\s*kind:\s*['"]([^'"]+)['"],\s*ref:\s*['"]([^'"]+)['"]/g)];
  count += teaches.length;
}
console.log('Total authored runes:', count);
