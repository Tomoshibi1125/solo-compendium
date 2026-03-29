import { items } from '../src/data/compendium/items';
import { spells } from '../src/data/compendium/spells';
import { comprehensiveFeats } from '../src/data/compendium/feats-comprehensive';
import { powers } from '../src/data/compendium/powers';
import { techniques } from '../src/data/compendium/techniques';
import { backgrounds } from '../src/data/compendium/backgrounds';
import { monsters } from '../src/data/compendium/monsters';
import { regents } from '../src/data/compendium/regents';
import { locations } from '../src/data/compendium/locations';
import { jobs } from '../src/data/compendium/jobs';
import { conditions } from '../src/data/compendium/conditions';

const dndTerms = ["Faerun", "Mystra", "Sword Coast", "Waterdeep", "Baldur's Gate", "Neverwinter", "dungeon master", "saving throw", "spell slot"]; // Note: 'saving throw' is technically 5e but we might use it. We'll just flag.
const datasets = { items, spells, feats: comprehensiveFeats, powers, techniques, backgrounds, monsters, regents, locations, jobs, conditions };

console.log("=== COMPENDIUM AUDIT START ===");

for (const [name, data] of Object.entries(datasets)) {
    console.log(`\nAnalyzing ${name} (${data.length} entries)...`);
    
    // Check IDs
    const ids = data.map((x: any) => x.id);
    const idDupes = ids.filter((id: string, index: number) => ids.indexOf(id) !== index);
    if (idDupes.length > 0) {
        console.error(`  [!] ID Duplicates found in ${name}:`, [...new Set(idDupes)]);
    } else {
        console.log(`  [OK] All IDs are unique.`);
    }

    // Check Names
    const names = data.map((x: any) => x.name);
    const nameDupes = names.filter((nm: string, index: number) => names.indexOf(nm) !== index);
    if (nameDupes.length > 0) {
        console.error(`  [!] Name Duplicates found in ${name}:`, [...new Set(nameDupes)]);
    } else {
        console.log(`  [OK] All Names are unique.`);
    }

    // Term checks removed as D&D 5e / Spell Slots are canonical to the System Ascendant ruleset.
}

console.log("\n=== COMPENDIUM AUDIT COMPLETE ===");
