const fs = require('fs');
const path = require('path');

const FILES = [
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part1.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part2.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part3.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part4.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/items-part5.ts",
    "c:/Users/jjcal/Documents/solo-compendium/src/data/compendium/relics-comprehensive.ts"
];

function alignItem(content) {
    // 1. Vernacular alignment
    content = content.replace(/Monarch/g, "Regent");
    content = content.replace(/\bSovereign\b/g, "Elite");
    // "Magic" -> "Protocol"
    content = content.replace(/\bMagic\b/g, "Protocol");
    content = content.replace(/\bmagic\b/g, "protocol");
    content = content.replace(/\bmagical\b/g, "protocol-enhanced");
    return content;
}

function itemReplacer(match, indent, itemBlock) {
    // Extract name, description, type
    const nameMatch = itemBlock.match(/name:\s*"(.*?)"/);
    const descMatch = itemBlock.match(/description:\s*"(.*?)"/);
    const typeMatch = itemBlock.match(/type:\s*"(.*?)"/);
    const attMatch = itemBlock.match(/(requires_attunement|attunement):\s*(true|false)/);

    if (!nameMatch) return match;

    const name = nameMatch[1];
    const desc = descMatch ? descMatch[1] : "";
    const currentType = typeMatch ? typeMatch[1] : "";

    let newType = currentType;

    // Logical Consistency Rules
    const weapons = ["Blade", "Saber", "Sword", "Dagger", "Axe", "Hammer", "Bow", "Spear", "Glaive", "Katana", "Gauntlet"];
    const armors = ["Vest", "Plate", "Armor", "Shield", "Mail", "Suit", "Coat", "Cloak", "Robe"];
    const stims = ["Stim", "Injector", "Potion", "Vial", "Serum", "Drug"];
    const scripts = ["Script", "Scroll", "Data", "Disk", "Cipher"];
    const runes = ["Rune"];
    const sigils = ["Sigil"];
    const augments = ["Augment", "Link", "Implant", "Neural", "Cyber", "Eye", "Arm", "Leg"];
    const hardware = ["Lens", "Scanner", "Tool", "Gadget", "Device", "Box", "Module"];
    const foci = ["Staff", "Wand", "Rod", "Focus", "Emitter"];
    const rings = ["Ring"];

    let foundType = false;
    for (const r of runes) {
        if (name.toLowerCase().includes(r.toLowerCase())) {
            newType = "rune";
            foundType = true;
            break;
        }
    }
    if (!foundType) {
        for (const s of sigils) {
            if (name.toLowerCase().includes(s.toLowerCase())) {
                newType = "sigil";
                foundType = true;
                break;
            }
        }
    }
    if (!foundType) {
        for (const w of weapons) {
            if (name.toLowerCase().includes(w.toLowerCase())) {
                newType = "weapon";
                foundType = true;
                break;
            }
        }
    }
    if (!foundType) {
        for (const a of armors) {
            if (name.toLowerCase().includes(a.toLowerCase())) {
                newType = "armor";
                foundType = true;
                break;
            }
        }
    }
    if (!foundType) {
        for (const s of stims) {
            if (name.toLowerCase().includes(s.toLowerCase())) {
                newType = "stim";
                foundType = true;
                break;
            }
        }
    }
    if (!foundType) {
        for (const s of scripts) {
            if (name.toLowerCase().includes(s.toLowerCase())) {
                newType = "script";
                foundType = true;
                break;
            }
        }
    }
    if (!foundType) {
        for (const a of augments) {
            if (name.toLowerCase().includes(a.toLowerCase())) {
                newType = "augment";
                foundType = true;
                break;
            }
        }
    }
    if (!foundType) {
        for (const h of hardware) {
            if (name.toLowerCase().includes(h.toLowerCase())) {
                newType = "hardware";
                foundType = true;
                break;
            }
        }
    }
    if (!foundType) {
        for (const f of foci) {
            if (name.toLowerCase().includes(f.toLowerCase())) {
                newType = "focus";
                foundType = true;
                break;
            }
        }
    }
    if (!foundType) {
        for (const r of rings) {
            if (name.toLowerCase().includes(r.toLowerCase())) {
                newType = "ring";
                foundType = true;
                break;
            }
        }
    }

    // Replace type if found better
    if (newType !== currentType && ["wondrous", "misc", "accessory", "wondrous item", "artifact"].includes(currentType)) {
        itemBlock = itemBlock.replace(`type: "${currentType}"`, `type: "${newType}"`);
    }

    // RULE: Sigils and Runes never require attunement
    if (newType === "sigil" || newType === "rune" || name.toLowerCase().includes("sigil") || name.toLowerCase().includes("rune")) {
        itemBlock = itemBlock.replace(/requires_attunement:\s*true/g, "requires_attunement: false");
        itemBlock = itemBlock.replace(/attunement:\s*true/g, "attunement: false");
    }

    // Description cleanup for "Umbral"
    if (name.includes("Umbral") && desc.toLowerCase().includes("icy")) {
        itemBlock = itemBlock.replace(/icy power/gi, "shadow power");
        itemBlock = itemBlock.replace(/cold damage/gi, "necrotic damage");
        itemBlock = itemBlock.replace(/frost/gi, "void");
    }

    return indent + itemBlock;
}

function processFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');

    content = alignItem(content);

    // Simplified regex for item objects
    const itemPattern = /(\s+)(\{\s+id:.*?\n\s+\}(?=,|\s+\]|\s+;))/gs;
    content = content.replace(itemPattern, itemReplacer);

    fs.writeFileSync(filePath, content, 'utf8');
}

FILES.forEach(processFile);
console.log("Done!");
