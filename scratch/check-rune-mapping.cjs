const fs = require('fs');

const runeFiles = fs.readdirSync('src/data/compendium/runes').filter(f => f.endsWith('.ts') && f !== 'index.ts');
let count = 0;
let names = [];
for (const file of runeFiles) {
  const content = fs.readFileSync('src/data/compendium/runes/' + file, 'utf8');
  const matches = [...content.matchAll(/teaches:\s*\{\s*kind:\s*['"]([^'"]+)['"],\s*ref:\s*['"]([^'"]+)['"]/g)];
  for (const match of matches) {
    names.push(match[2]);
  }
}

// Now let's see how many of these names exist in our new generated lists
const spellContent = fs.readFileSync('src/data/compendium/spells/supplemental.ts', 'utf8') + fs.readFileSync('src/data/compendium/spells/rank-d.ts', 'utf8');
const powerContent = fs.readFileSync('src/data/compendium/powers-supplemental.ts', 'utf8') + fs.readFileSync('src/data/compendium/powers-core.ts', 'utf8');
const techContent = fs.readFileSync('src/data/compendium/techniques-supplemental.ts', 'utf8') + fs.readFileSync('src/data/compendium/techniques-core.ts', 'utf8');

const allContent = spellContent + powerContent + techContent;
const availableNames = new Set([...allContent.matchAll(/"?name"?:\s*['"]([^'"]+)['"]/g)].map(m => m[1]));

let found = 0;
let missing = [];
for (const name of names) {
  if (availableNames.has(name)) {
    found++;
  } else {
    // try slugifying name vs slugified available names
    const slug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const availSlugs = new Set([...availableNames].map(slug));
    if (availSlugs.has(slug(name))) {
        found++;
    } else {
        missing.push(name);
    }
  }
}

console.log(`Out of ${names.length} authored runes, ${found} mapped successfully.`);
console.log(`Missing: ${missing.length}`);
if (missing.length > 0) {
  console.log(missing.slice(0, 10));
}
