const fs = require('fs');
const raw = fs.readFileSync('src/data/compendium/paths.ts', 'utf-8');
const entries = raw.split(/\n\t\{/).filter(b => b.includes('jobId:'));

// Only the 3 jobs user asked about
const targetJobs = ['idol', 'contractor', 'revenant'];

for (const job of targetJobs) {
  const jobPaths = entries.filter(b => {
    const m = b.match(/jobId:\s*["'`]([^"'`]+)["'`]/);
    return m && m[1] === job;
  });
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${job.toUpperCase()} — ${jobPaths.length} paths`);
  console.log(`${'='.repeat(70)}`);
  
  for (const block of jobPaths) {
    const nameM = block.match(/\bname:\s*["'`]([^"'`]+)["'`]/);
    const pathName = nameM ? nameM[1] : '?';
    
    const mentions = [];
    if (/\bpower\b/i.test(block)) mentions.push('POWER');
    if (/\btechnique\b/i.test(block)) mentions.push('TECHNIQUE');
    if (/\bweapon\b/i.test(block)) mentions.push('WEAPON');
    if (/\bmelee\b/i.test(block)) mentions.push('MELEE');
    if (/\bmartial\b/i.test(block)) mentions.push('MARTIAL');
    if (/\battack\b/i.test(block)) mentions.push('ATTACK');
    if (/\barmor\b/i.test(block)) mentions.push('ARMOR');
    if (/\bphysical\b/i.test(block)) mentions.push('PHYSICAL');
    if (/\bcombat\b/i.test(block)) mentions.push('COMBAT');
    
    const featureNames = [];
    for (const m of block.matchAll(/name:\s*["'`]([^"'`]+)["'`]/g)) {
      if (m[1] !== pathName) featureNames.push(m[1]);
    }
    
    const descM = block.match(/description:\s*\n?\s*["'`]([^"'`]+)["'`]/);
    const desc = descM ? descM[1].substring(0, 200) : '';
    
    const isMartial = mentions.some(m => ['WEAPON', 'MELEE', 'MARTIAL', 'ARMOR', 'ATTACK', 'COMBAT'].includes(m));
    
    console.log(`\n  ${isMartial ? '>>> MARTIAL: ' : '    '}${pathName}`);
    console.log(`      Indicators: [${mentions.join(', ')}]`);
    console.log(`      Features: ${featureNames.join(', ')}`);
    console.log(`      Desc: "${desc}..."`);
  }
}
