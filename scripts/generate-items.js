const fs = require('fs');
const path = require('path');

const targetCount = 650;

const prefixes = ["Shadow", "Luminous", "Void", "System", "Abyssal", "Monarch's", "Astral", "Blood", "Iron", "Crystal", "Ethereal", "Nether", "Sovereign", "Echo", "Dread", "Celestial", "Null", "Nexus", "Chaos", "Order", "Rift", "Gate", "Aether", "Quantum", "Plasma", "Obsidian"];
const weapons = ["Blade", "Sword", "Dagger", "Spear", "Bow", "Crossbow", "Staff", "Wand", "Hammer", "Axe", "Mace", "Scythe", "Gauntlets", "Whip", "Halberd", "Glaive"];
const armor = ["Plate", "Mail", "Leather", "Robes", "Shield", "Buckler", "Helm", "Greaves", "Gauntlets", "Mantle"];
const ringsAmus = ["Ring", "Amulet", "Pendant", "Signet", "Band", "Necklace", "Choker"];
const wondrous = ["Orb", "Cube", "Tome", "Grimoire", "Lens", "Prism", "Crown", "Cloak", "Boots", "Belt"];
const suffixes = ["of the Void", "of the Monarch", "of Blood", "of Shadows", "of the System", "of Annihilation", "of the Stars", "of Eternity", "of Time", "of Space", "of Silence", "of the Abyss", "of the Dragon", "of the Phoenix", "of the Demon", "of the Angel"];

const rarities = ["common", "uncommon", "rare", "epic", "legendary"];

// Generators
function randomArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateNameAndType() {
    const typeRoll = Math.random();
    let type, name, base;
    if (typeRoll < 0.4) {
        type = "weapon";
        base = randomArray(weapons);
    } else if (typeRoll < 0.7) {
        type = "armor";
        base = randomArray(armor);
    } else if (typeRoll < 0.85) {
        type = Math.random() < 0.5 ? "ring" : "amulet";
        base = randomArray(ringsAmus);
    } else {
        type = "wondrous";
        base = randomArray(wondrous);
    }
    
    name = `${randomArray(prefixes)} ${base} ${randomArray(suffixes)}`;
    return { name, type };
}

function generateDescription(name, type) {
    return `A powerful ${type} forged within the System, emitting a faint aura. ${name} resonates with magical energy slowly adapting to its wielder.`;
}

function generateEffect(rarity) {
    const passiveCount = rarity === "common" ? 1 : rarity === "uncommon" ? 1 : rarity === "rare" ? 2 : rarity === "epic" ? 3 : 4;
    const passives = [];
    for(let i=0; i<passiveCount; i++) {
        passives.push(`Grants a minor enhancement to your abilities scale with ${rarity} power.`);
    }
    
    let effect = { passive: passives };
    if (Math.random() > 0.5 && rarity !== "common") {
        effect.active = [{
            name: "Activate",
            description: `Channel the item's latent power for a burst of System energy.`,
            action: "action",
            frequency: "once-per-day"
        }];
    }
    return effect;
}

const items = [];
const namesSet = new Set();
let idCounter = 1;

while(items.length < targetCount) {
    const { name, type } = generateNameAndType();
    
    // Ensure uniqueness
    if (!namesSet.has(name)) {
        namesSet.add(name);
        
        const rarity = randomArray(rarities);
        const item = {
            id: `sys-item-${String(idCounter).padStart(4, '0')}`,
            name,
            description: generateDescription(name, type),
            rarity,
            type,
            image: `/generated/compendium/items/sys-item-${String(idCounter).padStart(4, '0')}.webp`,
            effects: generateEffect(rarity),
            attunement: rarity === "epic" || rarity === "legendary" || Math.random() > 0.5,
            weight: Math.floor(Math.random() * 10) + 1,
            value: (rarity === "common" ? 50 : rarity === "uncommon" ? 200 : rarity === "rare" ? 1000 : rarity === "epic" ? 5000 : 20000) + Math.floor(Math.random() * 100),
            source: "System Ascendant Expansion"
        };
        items.push(item);
        idCounter++;
    }
}

// Split into parts (e.g. part 6, 7, 8)
const chunkSize = 200;
let partNum = 6;
const generatedFiles = [];

for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const content = `// Items Compendium - Part ${partNum}: Mass Expansion\n// Auto-generated standard System Ascendant items\n\nexport const items = ${JSON.stringify(chunk, null, '\t')};\n`;
    const filename = `items-part${partNum}.ts`;
    fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'compendium', filename), content);
    console.log(`Generated ${filename} with ${chunk.length} items.`);
    generatedFiles.push(filename);
    partNum++;
}

console.log("Successfully generated", items.length, "items.");
