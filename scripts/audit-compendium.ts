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

    // Check for D&D 5e bleed-through
    let dndMatches = 0;
    for (const item of data) {
        const jsonStr = JSON.stringify(item).toLowerCase();
        for (const term of dndTerms) {
            if (term !== 'saving throw' && jsonStr.includes(term.toLowerCase())) {
                console.warn(`  [WARN] D&D Term '${term}' found in ${name} -> ${item.name}`);
                dndMatches++;
            }
        }
    }
    if (dndMatches === 0) {
        console.log(`  [OK] No major D&D lore terms detected.`);
    }

    // System Ascendant Flavor Check (Looking for System, Mana, Protocol, Void, Rift, Gate, Rank, Regent)
    const saTerms = ["system", "mana", "protocol", "void", "rift", "gate", "rank", "regent", "essence", "ascendant"];
    let flavoredCount = 0;
    for (const item of data) {
        const jsonStr = JSON.stringify(item).toLowerCase();
        const hasFlavor = saTerms.some(term => jsonStr.includes(term));
        if (hasFlavor) flavoredCount++;
    }
    
    const flavorPct = Math.round((flavoredCount / data.length) * 100);
    console.log(`  [INFO] Thematic Density: ${flavorPct}% of entries contain core System Ascendant terminology.`);
}

console.log("\n=== COMPENDIUM AUDIT COMPLETE ===");
