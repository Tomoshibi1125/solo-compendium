const fs = require('fs');
const c = fs.readFileSync('src/data/compendium/powers.ts', 'utf8');
const lines = c.split('\n');
let count = 0;
lines.forEach(l => {
  const m = l.match(/^\t\tname: "(.+)"/);
  if (m) { count++; console.log(count + '. ' + m[1]); }
});
console.log('\nTotal: ' + count);
