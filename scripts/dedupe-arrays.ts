import * as fs from 'fs';
import * as path from 'path';

// Using inline string matching instead of requiring to bypass TypeScript export mechanics complexities and loss of comments where possible, BUT because we want exact duplicate filtering, we will let TSX compile and grab the object, filter it, and JSON.stringify it perfectly. 

import { techniques } from '../src/data/compendium/techniques';

// Actually, rewriting the whole file losing comments is bad. Let's do it right. 
const techPath = path.join(process.cwd(), 'src/data/compendium/techniques.ts');
let techContent = fs.readFileSync(techPath, 'utf8');

// We know exactly what we are targetting now. 
// "blade-dance", "disarming-strike", "whirlwind-slash". 
// But earlier grep showed them missing because they might be on multiple lines. In fact:
// They are multi-line objects!
// It's much safer to use AST or TS parser to modify them, but that's overkill. We can just use TSX to evaluate them, filter, and rewrite the array.

function arrayToTypeScriptExport(arrayName: string, data: any[], headerDocs: string) {
    let jsonStr = JSON.stringify(data, null, '\t').replace(/"([^"]+)":/g, '$1:');
    return `${headerDocs}\n\nexport const ${arrayName} = ${jsonStr};`;
}

// 1. Dedupe Techniques
const uniqueTechs: any[] = [];
const techIds = new Set();
const techNames = new Set();

for(const t of techniques) {
    if(!techIds.has(t.id) && !techNames.has(t.name)) {
        uniqueTechs.push(t);
        techIds.add(t.id);
        techNames.add(t.name);
    }
}

const techHeader = `// Techniques Compendium - Authoritative System Ascendant Content\n// Combat maneuvers and martial techniques\n// Based on System Ascendant mechanics\n// Deduplicated and Lore-Enriched`;

fs.writeFileSync(techPath, arrayToTypeScriptExport('techniques', uniqueTechs, techHeader));
console.log(`[Dedupe] Techniques processed. Unique: ${uniqueTechs.length}`);

// 2. Dedupe Monsters
const monsterPath = path.join(process.cwd(), 'src/data/compendium/monsters/rank-d.ts');
import { monsters_d } from '../src/data/compendium/monsters/rank-d';

const uniqueD: any[] = [];
const dIds = new Set();
const dNames = new Set();

for(const m of monsters_d) {
    if(!dIds.has(m.id) && !dNames.has(m.name)) {
        uniqueD.push(m);
        dIds.add(m.id);
        dNames.add(m.name);
    }
}

const monsterHeader = `import type { CompendiumMonster } from "@/types/compendium";\n\n// D-Rank Monsters\n// Generally equivalent to CR 1/8 to 1`;
fs.writeFileSync(monsterPath, arrayToTypeScriptExport('monsters_d', uniqueD, monsterHeader));
console.log(`[Dedupe] D-Rank Monsters processed. Unique: ${uniqueD.length}`);
