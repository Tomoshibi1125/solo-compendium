const fs = require('fs');
const path = require('path');
const srcDir = path.join(process.cwd(), 'src/data/compendium');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}
let c = 0;
walk(srcDir).forEach(f => {
  const orig = fs.readFileSync(f, 'utf8');
  const lines = orig.split('\n');
  const filtered = lines.filter(l => {
    const trimmed = l.trimStart();
    if (trimmed.startsWith('"[Alert:')) return false;
    if (trimmed.startsWith('"[Fatal Error:')) return false;
    if (trimmed.startsWith('"[Celestial Echo:')) return false;
    return true;
  });
  const content = filtered.join('\n');
  if (orig !== content) {
    fs.writeFileSync(f, content, 'utf8');
    c++;
  }
});
console.log('Cleaned perfectly securely. Modified ' + c + ' files.');
