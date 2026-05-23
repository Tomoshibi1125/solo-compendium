import * as fs from 'fs';
import * as path from 'path';

const spellDir = 'src/data/compendium/spells';
const files = fs.readdirSync(spellDir).filter(f => f.endsWith('.ts'));

const getSpellNames = (regex: RegExp) => {
    const names = new Set<string>();
    for (const file of files) {
        const content = fs.readFileSync(path.join(spellDir, file), 'utf-8');
        const objects = content.split('display_name:');
        for (let i = 1; i < objects.length; i++) {
            const obj = objects[i];
            const nameMatch = obj.match(/^\s*"([^"]+)"/);
            if (nameMatch) {
                const name = nameMatch[1];
                if (regex.test(obj.toLowerCase()) || regex.test(name.toLowerCase())) {
                    names.add(name);
                }
            }
        }
    }
    return Array.from(names);
};

console.log("Fire/Radiant Spells:", getSpellNames(/fire|flame|burn|scorch|ignite|radiant|sun|light/));
console.log("Lightning/Thunder Spells:", getSpellNames(/lightning|thunder|storm|tempest|shock|bolt/));
console.log("Healing Spells:", getSpellNames(/heal|cure|mend|revive|restore|vitality/));
