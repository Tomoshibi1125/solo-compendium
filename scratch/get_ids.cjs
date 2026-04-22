const fs = require('fs');
const content = fs.readFileSync('src/data/compendium/jobs.ts', 'utf8');
const jobBlocks = content.split(/\s*\{\s*id:\s*["']/);
jobBlocks.shift();
for (const block of jobBlocks) {
  const idMatch = block.match(/^([^'"]+)["']/);
  if (idMatch) console.log(idMatch[1]);
}
