import { anomalies } from "../src/data/compendium/anomalies";
import { backgrounds } from "../src/data/compendium/backgrounds";
import { conditions } from "../src/data/compendium/conditions";
import { comprehensiveFeats } from "../src/data/compendium/feats-comprehensive";
import { items } from "../src/data/compendium/items";
import { jobs } from "../src/data/compendium/jobs";
import { locations } from "../src/data/compendium/locations";
import { powers } from "../src/data/compendium/powers";
import { regents } from "../src/data/compendium/regents";
import { spells } from "../src/data/compendium/spells";
import { techniques } from "../src/data/compendium/techniques";
const datasets = {
    items: items,
    spells: spells,
    feats: comprehensiveFeats,
    powers: powers,
    techniques: techniques,
    backgrounds: backgrounds,
    anomalies: anomalies,
    regents: regents,
    locations: locations,
    jobs: jobs,
    conditions: conditions,
};
console.log("=== COMPENDIUM AUDIT START ===");
for (const [name, data] of Object.entries(datasets)) {
    console.log(`\nAnalyzing ${name} (${data.length} entries)...`);
    // Check IDs
    const ids = data.map((x) => x.id);
    const idDupes = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (idDupes.length > 0) {
        console.error(`  [!] ID Duplicates found in ${name}:`, [
            ...new Set(idDupes),
        ]);
    }
    else {
        console.log(`  [OK] All IDs are unique.`);
    }
    // Check Names
    const names = data.map((x) => x.name);
    const nameDupes = names.filter((nm, index) => names.indexOf(nm) !== index);
    if (nameDupes.length > 0) {
        console.error(`  [!] Name Duplicates found in ${name}:`, [
            ...new Set(nameDupes),
        ]);
    }
    else {
        console.log(`  [OK] All Names are unique.`);
    }
    // Term checks removed as D&D 5e / Spell Slots are canonical to the System Ascendant ruleset.
}
console.log("\n=== COMPENDIUM AUDIT COMPLETE ===");
