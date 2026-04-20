const fs = require('fs');

const bg1 = fs.readFileSync('src/data/compendium/backgrounds.ts', 'utf8');
const bg1b = fs.readFileSync('src/data/compendium/backgrounds1b.ts', 'utf8');

// bg1 ends with ];
// bg1b starts with export const backgroundsPart1B = [
// We want to combine the arrays.

let newBg1 = bg1.replace('];\n', ',\n');
let newBg1b = bg1b.replace('export const backgroundsPart1B = [\n', '');

fs.writeFileSync('src/data/compendium/backgrounds.ts', newBg1 + newBg1b);
fs.unlinkSync('src/data/compendium/backgrounds1b.ts');
console.log('Merged successfully.');
