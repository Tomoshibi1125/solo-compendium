import fs from 'node:fs';
import path from 'node:path';

const themes = {
    Blood: ["Heart", "Blood", "Carnage", "Necro", "Siphon", "Vampiric", "Ichor", "Vein", "Flesh"],
    Solar: ["Bright", "Light", "Corona", "Solar", "Sun", "Radiant", "Dawn", "Aureole", "Zenith", "White-Hot", "Aurelian"],
    Void: ["Umbral", "Void", "Night", "Shadow", "Entropy", "Abyssal", "Dark", "Null", "Singularity", "Dredge", "Grave-Walker"],
    Storm: ["Shock", "Bolt", "Volt", "Storm", "Static", "Lightning", "Surge", "Thunder", "Plasma", "Tempest", "Thunder-Clap", "Storm-Caller"],
    Glacial: ["Rime", "Frost", "Arctic", "Ice", "Chill", "Glacial", "Frozen", "Zero", "Tundra"],
    Aetheric: ["Pulse", "Aether", "Lattice", "Force", "Resonance", "Dimensional", "Warp", "Phase", "Aether-Bound", "Chronos-Plate", "Spatial-Shard", "Rift-Walker", "Mana-Flow"],
    Titanic: ["Basalt", "Titan", "Core", "Stone", "Gravity", "Earthquake", "Shatter", "Geoda", "Mantle", "Mountain-Soul", "Stone-Skin", "Core-Forged"],
    Chaos: ["Discord", "Entropy", "Flux", "Wild", "Primal", "Rift", "Annihilation", "Eruption"],
    Chrono: ["Temporal", "Time", "Stasis", "Aeon", "Tick", "Sequence", "Eternity", "Moment"],
};

const themeFlavorMap = {
    Blood: { adj: "sanguine", verbs: ["siphon", "clot"], noun: "blood-glass", stat: "Strength", dmg: "necrotic", lore: "a jagged shard of monarch essence" },
    Solar: { adj: "incandescent", verbs: ["purge", "ignite"], noun: "solar-lattice", stat: "Presence", dmg: "radiant", lore: "a crystallized flare from the First Gate" },
    Void: { adj: "umbral", verbs: ["nullify", "devour"], noun: "void-core", stat: "Intelligence", dmg: "necrotic", lore: "a fragment of the original oblivion" },
    Storm: { adj: "galvanic", verbs: ["crack", "volt-strike"], noun: "plasma-coil", stat: "Intelligence", dmg: "lightning", lore: "a lightning-fused alloy from the Tempest" },
    Glacial: { adj: "cryogenic", verbs: ["freeze", "shatter"], noun: "rime-shard", stat: "Vitality", dmg: "cold", lore: "a frozen breath from the Zero Rift" },
    Aetheric: { adj: "harmonic", verbs: ["distort", "project"], noun: "aether-weave", stat: "Sense", dmg: "force", lore: "a resonant strand from the Lattice" },
    Titanic: { adj: "tectonic", verbs: ["grind", "crush"], noun: "basalt-plate", stat: "Vitality", dmg: "bludgeoning", lore: "a seismic fragment of the Mountain Soul" },
    Chaos: { adj: "volatile", verbs: ["destabilize", "warp"], noun: "entropy-flux", stat: "Presence", dmg: "psychic", lore: "a chaotic rift from the Primal Annihilation" },
    Chrono: { adj: "recursive", verbs: ["suspend", "accelerate"], noun: "stasis-field", stat: "Sense", dmg: "force", lore: "a temporal dilation from the Aeon Fracture" },
    Absolute: { adj: "fundamental", verbs: ["mandate", "decree"], noun: "authority-sigil", stat: "Presence", dmg: "force", lore: "a sovereign mandate from the Architect" }
};

function getTheme(name) {
    if (!name) return "Absolute";
    for (const [theme, keywords] of Object.entries(themes)) {
        if (keywords.some(k => name.toLowerCase().includes(k.toLowerCase()))) return theme;
    }
    return "Absolute";
}

function processEntry(entry, rank, filePath) {
    const idMatch = entry.match(/id:\s+"(.*?)"/);
    if (!idMatch) return entry;
    
    const nameMatch = entry.match(/name:\s+"(.*?)"/);
    const name = nameMatch ? nameMatch[1] : "Unknown Item";
    const theme = getTheme(name);
    const flavor = themeFlavorMap[theme] || themeFlavorMap.Absolute;
    
    // 1. Lore Enrichment (only if description is short or placeholder)
    if (entry.includes('description: "') || entry.includes("description: ''")) {
        const isRune = filePath.includes("runes") || entry.includes("rune_type:");
        const isSigil = filePath.includes("sigils") || entry.includes("can_inscribe_on:");
        const isTattoo = filePath.includes("tattoos") || entry.includes("body_part:");
        
        let desc = "";
        if (isRune) desc = `This sovereign skill-stone teaches the target how to ${flavor.verbs[0]} the local ${flavor.noun}. For those without an innate mana-heart, the stone provides a fixed usage lattice, allowing the technique to be manifested through the stone's residual resonance.`;
        else if (isSigil) desc = `Forged from ${flavor.lore}, this sigil acts as a dimensional socket for high-tier equipment. Upon inscription, it allows the wielder to ${flavor.verbs[1]} incoming essence, converting it into a stable ${flavor.adj} field.`;
        else if (isTattoo) desc = `A permanent manifold inscribed using ${flavor.adj} dimensional ink. The tattoo grafts directly onto the hunter's soul-lattice, allowing them to ${flavor.verbs[0]} their own essence into a concentrated burst of ${flavor.noun}.`;
        else desc = `This ${rank}-Rank artifact vibrates with the power to ${flavor.verbs[0]} reality. It allows the wielder to manifest a ${flavor.adj} field that can ${flavor.verbs[1]} any proximity-based dimensional distortion.`;

        entry = entry.replace(/description:\s+(".*?"|'.*?'|`[\s\S]*?`)/, `description: ${JSON.stringify(desc)}`);
    }

    // 2. Mechanics Injection
    const mech = {
        stat_bonuses: { [flavor.stat]: rank === "Divine" || rank === "Mythic" || rank === "S" ? 2 : 1 },
        resistance: [flavor.dmg],
        special: `Aligned with ${theme} resonance.`
    };
    const mechStr = `\n\t\tmechanics: ${JSON.stringify(mech, null, "\t").replace(/\n/g, "\n\t\t")}`;
    
    if (!entry.includes("mechanics:") && !entry.includes("stats:")) {
        // Insert before the last closing brace of the object
        const lastBrace = entry.lastIndexOf("}");
        if (lastBrace !== -1) {
            entry = entry.slice(0, lastBrace) + mechStr + "\n\t" + entry.slice(lastBrace);
        }
    }

    // 3. Remove Level Gating (Safety first)
    entry = entry.replace(/^\s*(?:requires_level|level_requirement|gate_rank):\s*\d+,?\s*$/gm, "");

    return entry;
}

function processFile(filePath, rank) {
    if (!fs.existsSync(filePath)) return;
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, "utf8");
    
    // Split by top-level object braces to avoid inner brace confusion
    const parts = content.split(/\n\t\{/);
    if (parts.length <= 1) return;
    
    const header = parts[0];
    const entries = parts.slice(1).map(e => processEntry("\n\t{" + e, rank, filePath));
    
    let result = header + entries.join("");
    
    // Cleanup
    result = result.replace(/,,/g, ",");
    result = result.replace(/,\s*}/g, "\n\t}");
    
    fs.writeFileSync(filePath, result);
}

const baseDir = path.join(process.cwd(), "src", "data", "compendium");
const files = [
    { path: path.join(baseDir, "sigils.ts"), rank: "A" },
    { path: path.join(baseDir, "tattoos.ts"), rank: "A" },
    { path: path.join(baseDir, "artifacts.ts"), rank: "Divine" },
];

for (const f of files) processFile(f.path, f.rank);
for (let i = 1; i <= 9; i++) processFile(path.join(baseDir, `items-part${i}.ts`), "B");

const runesDir = path.join(baseDir, "runes");
if (fs.existsSync(runesDir)) {
    const runeFiles = fs.readdirSync(runesDir);
    for (const rf of runeFiles) {
        if (rf.endsWith(".ts") && rf !== "index.ts") {
            processFile(path.join(runesDir, rf), rf.includes("-s") ? "S" : (rf.includes("-a") ? "A" : "B"));
        }
    }
}

console.log("Enrichment engine updated and re-run safely.");
