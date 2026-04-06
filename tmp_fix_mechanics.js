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
  let content = orig;
  
  content = content.replace(/mechanics:\s*\{\s*"\[.*?\].*?"\,?\s*\}/g, 'mechanics: {}');
  
  if (orig !== content) {
    fs.writeFileSync(f, content, 'utf8');
    c++;
    console.log('Fixed', path.basename(f));
  }
});
console.log('Cleaned securely. Modified ' + c + ' files.');
