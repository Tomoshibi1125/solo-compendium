const fs = require("fs");
const path = require("path");

const themes = {
    Blood: ["Heart", "Blood", "Carnage", "Necro", "Siphon", "Vampiric"],
    Solar: ["Bright", "Light", "Corona", "Solar", "Sun", "Radiant", "Dawn"],
    Void: ["Umbral", "Void", "Night", "Shadow", "Entropy", "Abyssal"],
    Storm: ["Shock", "Bolt", "Volt", "Storm", "Static", "Lightning", "Surge", "Thunder"],
    Glacial: ["Rime", "Frost", "Arctic", "Ice", "Chill", "Glacial", "Frozen"],
    Aetheric: ["Pulse", "Aether", "Lattice", "Force", "Resonance", "Dimensional"],
    Titanic: ["Basalt", "Titan", "Core", "Stone", "Gravity", "Earthquake", "Shatter"],
};

function getTheme(name) {
    for (const [theme, keywords] of Object.entries(themes)) {
        if (keywords.some(k => name.includes(k))) return theme;
    }
    return "Absolute";
}

function getMechanics(name, rank, isUtility) {
    const theme = getTheme(name);
    let count = 8, die = "d10";
    if (rank === "A") { count = 8; die = "d10"; }
    else if (rank === "B") { count = 5; die = "d8"; }
    else if (rank === "C") { count = 3; die = "d6"; }
    else if (rank === "D") { count = 1; die = "d12"; }

    const dmgTypes = {
        Blood: "necrotic", Solar: "radiant", Void: "necrotic",
        Storm: "lightning", Glacial: "cold", Aetheric: "force", Titanic: "bludgeoning", Absolute: "force"
    };
    const dmgType = dmgTypes[theme];

    if (isUtility) {
        const effects = {
            Blood: "blinded by erupting ichor.", Solar: "burned, taking half damage at start of next turn.",
            Void: "pulled 10ft into the entropy field.", Storm: "paralyzed until end of next turn.",
            Glacial: "restrained by creeping frost.", Aetheric: "pushed 15ft by dimensional pressure.",
            Titanic: "knocked prone by seismic impact.", Absolute: "stunned until the end of its next turn."
        };
        return {
            attack: { mode: "ranged", resolution: "spell_attack", damage: { dice: (count - 2) + die, type: dmgType } },
            saving_throw: { ability: "CON", dc: "spell_save", failure: effects[theme] }
        };
    }
    return {
        attack: { mode: "ranged", resolution: "spell_attack", damage: { dice: count + die, type: dmgType }, critical: true }
    };
}

function enrichFile(filePath, rank) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, "utf8");
    const regex = /\{\s+id:\s+"(spell|power|tech)-.*?",\s+name:\s+"(.*?)"[\s\S]*?mechanics:\s+\{[\s\S]*?\},\s+\}/g;
    
    let isUtility = false;
    content = content.replace(regex, (match, type, name) => {
        const theme = getTheme(name);
        const mech = getMechanics(name, rank, isUtility);
        const desc = "A specialized manifestation of " + theme + " Resonance. This " + (type === "spell" ? "technique" : "form") + " allows the caster to weave the " + name + " into an Absolute Decree.";
        
        let newBlock = match.replace(/description:\s+(?:".*?"|`.*?`|\n\s+".*?")/, "description: " + JSON.stringify(desc));
        newBlock = newBlock.replace(/mechanics:\s+\{[\s\S]*?\}/, "mechanics: " + JSON.stringify(mech, null, \t).replace(/\n/g, "\n\t\t"));
        
        isUtility = !isUtility;
        return newBlock;
    });
    
    fs.writeFileSync(filePath, content);
}

const baseDir = path.join(process.cwd(), "src", "data", "compendium");
["rank-a.ts", "rank-b.ts", "rank-c.ts", "rank-d.ts"].forEach(f => enrichFile(path.join(baseDir, "spells", f), f.split("-")[1].charAt(0).toUpperCase()));
enrichFile(path.join(baseDir, "powers.ts"), "B");
enrichFile(path.join(baseDir, "techniques.ts"), "B");
