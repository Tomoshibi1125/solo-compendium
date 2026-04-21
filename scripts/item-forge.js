import * as fs from 'fs';
import * as path from 'path';
// Item imports
import { items_part1 } from '../src/data/compendium/items-part1';
import { items_part2 } from '../src/data/compendium/items-part2';
import { items_part3 } from '../src/data/compendium/items-part3';
import { items_part4 } from '../src/data/compendium/items-part4';
import { items_part5 } from '../src/data/compendium/items-part5';
import { items_part6 } from '../src/data/compendium/items-part6';
import { items_part7 } from '../src/data/compendium/items-part7';
import { items_part8 } from '../src/data/compendium/items-part8';
import { items_part9 } from '../src/data/compendium/items-part9';
import { baseEquipment } from '../src/data/compendium/items-base-equipment';
import { artifacts } from '../src/data/compendium/artifacts';
import { comprehensiveRelics } from '../src/data/compendium/relics-comprehensive';
import { sigils } from '../src/data/compendium/sigils';
import { tattoos } from '../src/data/compendium/tattoos';
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
const origins = [
    "Recovered from a collapsed Guild Vault.",
    "Found sealed in a hidden cache inside an S-Rank Rift.",
    "Forged by the Bureau's most elite artificers.",
    "Smuggled out of the Shadow Legion's armory.",
    "An ancient artifact of the First Awakenings."
];
const flavors = [
    "Power lies not in the object, but the will of its master.",
    "Some items tell stories. This one ends them.",
    "A masterpiece of destructive intent.",
    "Tread carefully; magic like this has a cost.",
    "Reforged from the ashes of a fallen Regent."
];
const dmgValues = ["1d6", "1d8", "2d4", "2d6", "1d10 + 2", "3d6", "1d12", "2d8", "4d10", "3d12 + 6"];
const ccs = ["Blindness", "Stunning", "Lethargy", "Fear", "Paralysis"];
// Anti-SciFi Dictionary
const replacements = {
    "Jeju Island Raid": "First Calamity",
    "Yoo Myung-Han": "Guild Master Ryker",
    "Sung Jin-Woo": "Vanguard Ash",
    "Matrix": "Weave",
    "Cyber": "Mana",
    "System Override": "Regent's Will",
    "System": "Order",
    "Simulation": "Illusion",
    "Graviturgy": "Transmutation",
    "Subspace": "Rift",
    "Neural": "Spiritual"
};
function cleanText(text) {
    if (!text)
        return text;
    let newText = text;
    for (const [key, value] of Object.entries(replacements)) {
        const reg = new RegExp(`\\b${key}\\b`, 'gi');
        newText = newText.replace(reg, value);
    }
    return newText;
}
function processItems(arr, isCombat) {
    return arr.map(obj => {
        ['name', 'description', 'flavor', 'discovery_lore'].forEach(k => {
            if (typeof obj[k] === 'string')
                obj[k] = cleanText(obj[k]);
        });
        if (!obj.lore)
            obj.lore = {};
        if (!obj.lore.origin || obj.lore.origin === "")
            obj.lore.origin = rand(origins);
        if (!obj.lore.history || obj.lore.history === "")
            obj.lore.history = "Its true history remains a protected Guild secret.";
        if (!obj.lore.curse || obj.lore.curse === "")
            obj.lore.curse = isCombat ? "Slowly drains ambient stamina from the wielder." : "Emanates a faint aura of dread.";
        if (!obj.lore.personality || obj.lore.personality === "")
            obj.lore.personality = "Silent, waiting.";
        if (!obj.lore.current_owner || obj.lore.current_owner === "")
            obj.lore.current_owner = "Held by the Vanguard Guild.";
        if (!obj.lore.prior_owners || obj.lore.prior_owners.length === 0)
            obj.lore.prior_owners = ["A rogue Awakened"];
        ['origin', 'history', 'curse', 'personality', 'current_owner'].forEach(k => {
            obj.lore[k] = cleanText(obj.lore[k]);
        });
        if (!obj.flavor || obj.flavor === "")
            obj.flavor = rand(flavors);
        // VARIANT MECHANICS
        if (isCombat) {
            const dmg = rand(dmgValues);
            const cc = rand(ccs);
            if (!obj.effects)
                obj.effects = {};
            const newDmgStr = `Deals ${dmg} physical or magical damage on hit.`;
            const newSecStr = `Target must make a standard DC saving throw or suffer ${cc} for 1 round.`;
            if (Array.isArray(obj.effects)) {
                // some objects like tattoos might have effects as array in the original compendium data ?
                // actually looking at tattoos/sigils, effects is usually an object. Let's do a safe set:
            }
            else {
                obj.effects.primary = newDmgStr;
                obj.effects.secondary = newSecStr;
            }
            if (obj.mechanics && !Array.isArray(obj.mechanics)) {
                obj.mechanics.damage_profile = dmg;
                obj.mechanics.condition = cc;
            }
            if (obj.passive_bonuses) {
                if (Array.isArray(obj.passive_bonuses)) {
                    // force object if it was array
                    obj.passive_bonuses = { effect: newDmgStr };
                }
                else {
                    obj.passive_bonuses.combat_advantage = newDmgStr;
                }
            }
        }
        return obj;
    });
}
function dump(filepath, exportName, typeName, importPathStr, arr, additionalHeader = '') {
    const full = path.resolve(process.cwd(), filepath);
    let c = '';
    if (importPathStr) {
        c += `import type { ${typeName} } from "${importPathStr}";\n\n`;
    }
    c += additionalHeader;
    c += `export const ${exportName}: ${typeName}[] = [\n`;
    const s = arr.map(a => '\t' + JSON.stringify(a, null, '\t').split('\n').join('\n\t')).join(',\n');
    c += s + '\n];\n';
    fs.writeFileSync(full, c, 'utf8');
    console.log(`Saved ${filepath} [${arr.length} items]`);
}
// Processing
const allP1 = processItems(items_part1, false);
const allP2 = processItems(items_part2, false);
const allP3 = processItems(items_part3, false);
const allP4 = processItems(items_part4, false);
const allP5 = processItems(items_part5, false);
const allP6 = processItems(items_part6, false);
const allP7 = processItems(items_part7, false);
const allP8 = processItems(items_part8, false);
const allP9 = processItems(items_part9, false);
const allBaseReq = processItems(baseEquipment, true);
const allArts = processItems(artifacts, true);
const allRelics = processItems(comprehensiveRelics, true);
const allSigils = processItems(sigils, true);
const allTattoos = processItems(tattoos, true);
// Dumping Items (use Item from ./items for part 1-9 & base)
const baseItemImport = './items';
dump('src/data/compendium/items-part1.ts', 'items_part1', 'Item', baseItemImport, allP1);
dump('src/data/compendium/items-part2.ts', 'items_part2', 'Item', baseItemImport, allP2);
dump('src/data/compendium/items-part3.ts', 'items_part3', 'Item', baseItemImport, allP3);
dump('src/data/compendium/items-part4.ts', 'items_part4', 'Item', baseItemImport, allP4);
dump('src/data/compendium/items-part5.ts', 'items_part5', 'Item', baseItemImport, allP5);
dump('src/data/compendium/items-part6.ts', 'items_part6', 'Item', baseItemImport, allP6);
dump('src/data/compendium/items-part7.ts', 'items_part7', 'Item', baseItemImport, allP7);
dump('src/data/compendium/items-part8.ts', 'items_part8', 'Item', baseItemImport, allP8);
dump('src/data/compendium/items-part9.ts', 'items_part9', 'Item', baseItemImport, allP9);
dump('src/data/compendium/items-base-equipment.ts', 'baseEquipment', 'Item', baseItemImport, allBaseReq);
dump('src/data/compendium/artifacts.ts', 'artifacts', 'Item', baseItemImport, allArts);
// Sigils and Tattoos
dump('src/data/compendium/sigils.ts', 'sigils', 'CompendiumSigil', '../../types/compendium', allSigils);
dump('src/data/compendium/tattoos.ts', 'tattoos', 'CompendiumTattoo', '../../types/compendium', allTattoos);
// Relics
const relicHeader = `export interface Relic {
	id: string;
	name: string;
	description: string;
	type: "weapon" | "armor" | "accessory" | "wondrous";
	tier: string;
	rarity: string;
	cost: number;
	attunement: boolean | { required: boolean; requirements: string };
	mechanics: any;
	quirks: string[];
	corruption_risk: string;
	properties: string[];
	abilities: Array<{ name: string; description: string; usage: string }>;
	lore: any;
	flavor: string;
}\n\n`;
dump('src/data/compendium/relics-comprehensive.ts', 'comprehensiveRelics', 'Relic', null, allRelics, relicHeader);
