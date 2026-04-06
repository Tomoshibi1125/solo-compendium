const fs = require('fs');

const files = [
  'src/data/compendium/items-part1.ts',
  'src/data/compendium/backgrounds-part2.ts',
  'src/data/compendium/tattoos.ts'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const prev = result[result.length - 1] || '';
    const t = l.trimLeft();
    
    // items-part1.ts exact match for broken strings inside mechanics object
    if (prev.includes('mechanics: {') && t.startsWith('\"Deals') && t.endsWith('\",')) {
       continue;
    }

    if (t.startsWith('\"[Alert:')) continue;
    if (t.startsWith('\"[Fatal Error:')) continue;
    if (t.startsWith('\"[Celestial Echo:')) continue;
    
    result.push(l);
  }
  fs.writeFileSync(f, result.join('\n'), 'utf8');
  console.log("Fixed", f);
});
