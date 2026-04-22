const fs = require('fs');
const content = fs.readFileSync('src/data/compendium/jobs.ts', 'utf8');

// A quick and dirty way to extract job data without full parsing
// Since it's a TS file with `export const jobs: Job[] = [...]`
// We can use the typescript compiler API or regex. Regex is risky but let's try a custom parser or just regex for properties.
// Actually, it's just an array of objects. Let's just grab the whole block and eval it.
// To eval it, we need to strip out TS types.

// Alternatively, let's just use grep via node for `name`, `id` and the lists.
// It's easier to just build a regex extractor for each job block.
const jobBlocks = content.split(/\s*\{\s*id:\s*["']/);
jobBlocks.shift(); // remove everything before first job

for (const block of jobBlocks) {
  const idMatch = block.match(/^([^'"]+)["']/);
  const id = idMatch ? idMatch[1] : 'unknown';
  
  const speedMatch = block.match(/speed:\s*(\d+)/);
  const darkMatch = block.match(/darkvision:\s*(\d+)/);
  
  console.log(`\n--- Job: ${id} ---`);
  console.log(`Speed: ${speedMatch ? speedMatch[1] : 'N/A'}`);
  console.log(`Darkvision: ${darkMatch ? darkMatch[1] : 'N/A'}`);
  
  const resMatch = block.match(/damage(?:_r|R)esistances:\s*\[([^\]]+)\]/);
  if (resMatch) console.log(`Resistances: ${resMatch[1].trim()}`);
  
  const imMatch = block.match(/condition(?:_i|I)mmunities:\s*\[([^\]]+)\]/);
  if (imMatch) console.log(`Immunities: ${imMatch[1].trim()}`);
}
