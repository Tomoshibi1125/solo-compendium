import fs from 'fs';
import path from 'path';

const dir = 'c:/Users/jjcal/Documents/solo-compendium/src/data/compendium';
function getFiles(baseDir) {
  let results = [];
  const list = fs.readdirSync(baseDir);
  list.forEach(file => {
    const filePath = baseDir + '/' + file;
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getFiles(dir);

let output = '';

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  // Match both `name: "Foo"` and `name: 'Foo'`
  const regex = /name:\s*["']([^"']+)["']/g;
  let match;
  const names = [];
  while ((match = regex.exec(content)) !== null) {
      names.push(match[1]);
  }
  
  const duplicates = names.filter((item, index) => names.indexOf(item) !== index);
  if (duplicates.length > 0) {
      const relPath = path.relative(dir, f);
      output += `${relPath} has duplicates: ${[...new Set(duplicates)].join(', ')}\n`;
  }
});

fs.writeFileSync('c:/Users/jjcal/Documents/solo-compendium/tmp/duplicates.txt', output || 'No duplicates found!');
