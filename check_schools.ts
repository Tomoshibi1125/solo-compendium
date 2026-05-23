import * as fs from 'fs';
import * as path from 'path';

const spellDir = 'src/data/compendium/spells';
const files = fs.readdirSync(spellDir).filter(f => f.endsWith('.ts'));
const schools = new Set<string>();

for (const file of files) {
    const content = fs.readFileSync(path.join(spellDir, file), 'utf-8');
    const matches = content.match(/school:\s*"([^"]+)"/g);
    if (matches) {
        for (const m of matches) {
            schools.add(m.replace(/school:\s*"/, '').replace('"', ''));
        }
    }
}

console.log("Schools found:", Array.from(schools).join(', '));
