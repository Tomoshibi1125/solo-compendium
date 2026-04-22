const fs = require('fs');
const content = fs.readFileSync('src/data/compendium/jobs.ts', 'utf8');

const jobBlocks = content.split(/\s*\{\s*id:\s*["']/);
jobBlocks.shift();

for (const block of jobBlocks) {
  const idMatch = block.match(/^([^'"]+)["']/);
  const id = idMatch ? idMatch[1] : 'unknown';
  
  const savesMatch = block.match(/saving_throws:\s*\[([^\]]+)\]/);
  const savesMatch2 = block.match(/savingThrows:\s*\[([^\]]+)\]/);
  const saves = savesMatch ? savesMatch[1].trim() : (savesMatch2 ? savesMatch2[1].trim() : 'NONE');
  console.log(`${id}: ${saves}`);
}
