import * as fs from "fs";
import * as path from "path";
import { comprehensiveFeats } from "../src/data/compendium/feats-comprehensive";
import { powers } from "../src/data/compendium/powers";
import { techniques } from "../src/data/compendium/techniques";
import { runes_s } from "../src/data/compendium/runes/spell-rank-s";
import { runes_power_powers } from "../src/data/compendium/runes/power-powers";
import { technique_runes } from "../src/data/compendium/runes/technique-techniques";
import { spells_a } from "../src/data/compendium/spells/rank-a";
import { sigils } from "../src/data/compendium/sigils";
import { tattoos } from "../src/data/compendium/tattoos";
const filesToProcess = [
    {
        name: "src/data/compendium/feats-comprehensive.ts",
        exportName: "comprehensiveFeats",
        type: "CompendiumFeat",
        importPath: "../../types/compendium",
        data: comprehensiveFeats,
    },
    {
        name: "src/data/compendium/powers.ts",
        exportName: "powers",
        type: "CompendiumPower",
        importPath: "../../types/compendium",
        data: powers,
    },
    {
        name: "src/data/compendium/techniques.ts",
        exportName: "techniques",
        type: "CompendiumTechnique",
        importPath: "../../types/compendium",
        data: techniques,
    },
    {
        name: "src/data/compendium/sigils.ts",
        exportName: "sigils",
        type: "CompendiumSigil",
        importPath: "../../types/compendium",
        data: sigils,
    },
    {
        name: "src/data/compendium/tattoos.ts",
        exportName: "tattoos",
        type: "CompendiumTattoo",
        importPath: "../../types/compendium",
        data: tattoos,
    },
    {
        name: "src/data/compendium/runes/spell-rank-s.ts",
        exportName: "runes_s",
        type: "CompendiumRune",
        importPath: "../../../types/compendium",
        data: runes_s,
    },
    {
        name: "src/data/compendium/runes/power-powers.ts",
        exportName: "runes_power_powers",
        type: "CompendiumRune",
        importPath: "../../../types/compendium",
        data: runes_power_powers,
    },
    {
        name: "src/data/compendium/runes/technique-techniques.ts",
        exportName: "technique_runes",
        type: "CompendiumRune",
        importPath: "../../../types/compendium",
        data: technique_runes,
    },
    {
        name: "src/data/compendium/spells/rank-a.ts",
        exportName: "spells_a",
        type: "CompendiumSpell",
        importPath: "../../../types/compendium",
        data: spells_a,
    },
];
// Fillers
const curses = [
    "Drains minor amounts of stamina when used repeatedly.",
    "Mumbles ominous whispers into the user's mind.",
    "Occasionally burns the skin with raw mana.",
    "Draws the ire of nearby low-level fiends.",
    "Leaves a lingering smell of ozone and ash.",
    "Causes the user's shadow to sometimes move independently.",
    "Erodes non-magical clothing over time.",
    "Induces temporary colorblindness after use.",
];
const personalities = [
    "Dormant and silent.",
    "Aggressive and volatile.",
    "Proud and unyielding.",
    "Sorrowful, weeping mana.",
    "Chaotic and unpredictable.",
    "Hungry for ambient magic.",
    "Coldly analytical.",
    "Deeply territorial.",
];
const origins = [
    "Forged by the Ascendant Bureau in secret.",
    "Uncovered in an S-Rank Red Gate in Siberia.",
    "Passed down by a forgotten Guild Master.",
    "Extracted from a slain Beast-Class anomaly.",
    "Developed by the Academy of High Magic.",
    "A relic of the Shadow Legion.",
];
const currentOwners = [
    "Lost to the depths of a high-tier dungeon.",
    "Heavily guarded in the Bureau's Armory.",
    "Circulating in the underground Hunter markets.",
    "Wielded by Vanguard Hunters.",
    "Held by a rogue guild.",
    "Currently unaccounted for.",
];
const priorOwnersList = [
    ["The First Ascendant"],
    ["Guild Master Kael"],
    ["Warden Thorne", "A-Rank Hunter 'Ghost'"],
    ["An unknown rogue Awakened"],
    ["Archmage Valerius"],
    ["The Obsidian Vanguard"],
];
const discoveryLores = [
    "Unearthed from the ashes of a collapsed Rift.",
    "Recovered after a massive Guild raid.",
    "Traded for thirty vials of wyvern blood.",
    "Found pinned to a monstrous corpse.",
    "Discovered encoded in an ancient grimoire.",
];
// Anti-SciFi Dictionary
const replacements = {
    Matrix: "Weave",
    matrix: "weave",
    Cyber: "Mana",
    cyber: "mana",
    "System Override": "Regent's Will",
    "system override": "regent's will",
    System: "Order",
    system: "order",
    Simulation: "Illusion",
    simulation: "illusion",
    Graviturgy: "Transmutation",
    graviturgy: "transmutation",
    Subspace: "Rift",
    subspace: "rift",
    "Dimensional Fabric": "Magical Veil",
    "dimensional fabric": "magical veil",
    Atomized: "Reduced to dust",
    atomized: "reduced to dust",
    Molecular: "Essence",
    molecular: "essence",
    Kinetic: "Forceful",
    kinetic: "forceful",
    Thermic: "Flame",
    thermic: "flame",
    Neural: "Spiritual",
    neural: "spiritual",
    Hydraulics: "Muscle density",
    Monarch: "Regent",
    monarch: "regent",
};
function getRandomStr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function getRandomStrArr(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function sanitizeText(text) {
    if (!text)
        return text;
    let newText = text;
    for (const [key, value] of Object.entries(replacements)) {
        const reg = new RegExp(`\\b${key}\\b`, "g");
        newText = newText.replace(reg, value);
    }
    return newText;
}
function stringifyWithOrder(obj) {
    return JSON.stringify(obj, null, "\t");
}
for (const file of filesToProcess) {
    console.log(`Processing ${file.name}...`);
    const dataArray = file.data;
    if (!Array.isArray(dataArray)) {
        console.warn(`Data in ${file.name} is not an array. Skipping.`);
        continue;
    }
    for (const item of dataArray) {
        const rec = item;
        // Sanitize 1st level text fields
        for (const key of [
            "name",
            "display_name",
            "description",
            "effect_description",
            "flavor",
            "discovery_lore",
            "source_book",
        ]) {
            if (typeof rec[key] === "string") {
                rec[key] = sanitizeText(rec[key]);
            }
        }
        if (file.name.includes("sigils")) {
            rec.passive_bonuses = { effect: "Enhances the wielder's resilience." };
        }
        if (rec.lore && typeof rec.lore === "string") {
            const oldstr = rec.lore;
            rec.lore = {
                origin: oldstr,
                history: "",
                curse: "",
                personality: "",
                current_owner: "",
                prior_owners: [],
            };
        }
        // Fill discovery lore
        if (rec.discovery_lore === undefined ||
            rec.discovery_lore === "" ||
            rec.discovery_lore === "Unearthed from the archives.") {
            rec.discovery_lore = getRandomStr(discoveryLores);
        }
        // Ensure lore object exists
        if (!rec.lore) {
            rec.lore = {
                origin: "",
                history: "",
                curse: "",
                personality: "",
                current_owner: "",
                prior_owners: [],
            };
        }
        const lore = rec.lore;
        // Sanitize and fill Lore
        if (!lore.origin || lore.origin === "")
            lore.origin = getRandomStr(origins);
        if (!lore.history || lore.history === "")
            lore.history =
                "Its true history remains a heavily guarded Bureau secret.";
        if (!lore.curse || lore.curse === "")
            lore.curse = getRandomStr(curses);
        if (!lore.personality || lore.personality === "")
            lore.personality = getRandomStr(personalities);
        if (!lore.current_owner || lore.current_owner === "")
            lore.current_owner = getRandomStr(currentOwners);
        if (!lore.prior_owners ||
            !Array.isArray(lore.prior_owners) ||
            lore.prior_owners.length === 0) {
            lore.prior_owners = getRandomStrArr(priorOwnersList);
        }
        for (const key of [
            "origin",
            "history",
            "curse",
            "personality",
            "current_owner",
        ]) {
            lore[key] = sanitizeText(lore[key]);
        }
        rec.lore = lore;
        // Sub-objects
        const effects = rec.effects;
        if (effects) {
            if (typeof effects.primary === "string")
                effects.primary = sanitizeText(effects.primary);
            if (typeof effects.secondary === "string")
                effects.secondary = sanitizeText(effects.secondary);
            if (typeof effects.tertiary === "string")
                effects.tertiary = sanitizeText(effects.tertiary);
        }
    }
    // Dump to file
    const fullPath = path.resolve(process.cwd(), file.name);
    let fileContent = `import type { ${file.type} } from "${file.importPath}";\n\n`;
    fileContent += `export const ${file.exportName}: ${file.type}[] = [\n`;
    const objectStrings = dataArray.map((obj) => {
        const str = stringifyWithOrder(obj);
        return str
            .split("\n")
            .map((line) => `\t${line}`)
            .join("\n");
    });
    fileContent += objectStrings.join(",\n");
    fileContent += "\n];\n";
    fs.writeFileSync(fullPath, fileContent, "utf8");
    console.log(`Saved ${file.name}`);
}
