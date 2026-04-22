const fs = require('fs');
const content = fs.readFileSync('src/data/compendium/jobs.ts', 'utf8');
const regex = /id:\s*['"]([^'"]+)['"]/g;
let match;
const jobs = [];
while ((match = regex.exec(content)) !== null) {
  jobs.push(match[1]);
}
console.log(jobs.join(', '));
