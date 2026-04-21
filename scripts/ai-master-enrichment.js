import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env") });
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("GEMINI_API_KEY is missing from .env");
    process.exit(1);
}
const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY;
function getPromptForType(type, batchSize, batchMinified) {
    let specificInstructions = "";
    if (type === "sigils") {
        specificInstructions = `
You are generating data for **SIGILS**. 
Sigils are passive/active modifiers socketed onto equipment (weapons, armor, accessories).
**CRITICAL RULE**: Do not mimic spells, powers, or techniques. Sigils are item modifiers, not spellcasting items.
For each sigil, return:
- "description": A vivid 1-sentence description of how the sigil visually alters the item.
- "flavor": A cool 3-10 word one-liner.
- "lore": A rich 2-3 sentence paragraph about its forging or discovery.
- "effect_description": A clear rules-text sentence describing its effect (e.g. "Reduces falling damage by 10 feet" or "Grants advantage on stealth checks in shadows").
- "mechanics_passive": A short string summarizing its passive benefit.
- "mechanics_active": A short string summarizing its active benefit (if any).
`;
    }
    else if (type === "tattoos") {
        specificInstructions = `
You are generating data for **TATTOOS**. 
Tattoos are cyber-magic mana-circuits inscribed natively on human skin.
**CRITICAL RULE**: Do not mimic spells, powers, or techniques. Tattoos modify the body (e.g., reactive acid blood, bone density amplifiers, neural speed enhancements).
For each tattoo, return:
- "description": A raw, cyberpunk-urban description of the ink reacting with the skin (1-2 sentences).
- "flavor": A cynical or awe-inspiring short one-liner.
- "lore": A rich 2-3 sentence history of the ink used or its origin.
- "primary": The primary mechanical effect (e.g., "Your unarmed strikes deal an additional 1d4 acid damage").
- "secondary": The secondary mechanical effect.
- "tertiary": A unique resonance effect.
`;
    }
    else if (type === "feats") {
        specificInstructions = `
You are generating data for **FEATS**.
Feats represent permanent, reality-altering perks for Awakened individuals.
For each feat, return:
- "description": A 1-sentence thematic summary.
- "flavor": A short one-liner.
- "lore": A rich 2-3 sentence paragraph of who pioneered this feat.
- "expert": An array of 1-3 strings containing logically scaled rules for an "Expert" tier of this feat. (MUST be unique to the feat's core identity, no generic copy-pastes).
- "master": An array of 1-3 strings containing logically scaled rules for a "Master" tier of this feat.
`;
    }
    else if (type === "runes") {
        specificInstructions = `
You are generating data for **RUNES**.
Runes are one-time-use consumable items that permanently teach the user a specific skill or spell.
For each rune, return:
- "description": A concise narrative description of the physical stone and the knowledge contained within.
- "discovery_lore": How the user might find this exact rune (2 sentences).
- "effect_description": A very clear 1-2 sentence rules text summarizing the spell/skill it teaches.
- "higher_levels": How the taught spell scales if the user invests more power into it (1-2 sentences).
`;
    }
    else {
        // Generic for Spells, Powers, Techniques
        specificInstructions = `
You are generating data for **` + type.toUpperCase() + `**.
These are active combat abilities used by Awakened Hunters.
For each item, return:
- "description": A punchy 2-3 sentence description of the visual and narrative effect of using this ability. DO NOT use generic templates like "You harness X energy to Y". Be poetic and visceral.
- "flavor": A cool short one-liner.
- "lore": A rich 2-3 sentence paragraph history of the ability.
- "primary": The primary narrative/mechanical effect in rules text.
- "secondary": The secondary narrative/mechanical effect.
`;
    }
    return `
You are a master worldbuilder and game designer for "System Ascendant", a modern-earth setting inspired by Solo Leveling where dimensional rifts open up and Hunters fight monsters using a high-tech magical System.

I have a batch of exactly ` + batchSize + ` items of type: ` + type + `.
I need you to generate 100% unique, bespoke, non-repetitive content. NEVER reuse the same phrase twice.

` + specificInstructions + `

Return ONLY a valid, raw JSON object where keys are the item "id", and the value is a JSON object with the exact keys specified above.
NO markdown wrapping (\`\`\`json). Just the raw JSON object {"id1": {...}, "id2": {...}}.

INPUT DATA:
` + batchMinified + `
`;
}
async function generateWithAI(batch, type) {
    const minifiedInput = batch.map((b) => ({
        id: b.id,
        name: b.name,
        original_description: b.description,
        original_damage: b.mechanics?.damage_profile || b.mechanics?.attack?.damage || "",
        rank: b.rank || "",
        level: b.level || "",
    }));
    const prompt = getPromptForType(type, batch.length, JSON.stringify(minifiedInput));
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
                ],
                generationConfig: {
                    temperature: 0.8,
                    responseMimeType: "application/json",
                },
            }),
        });
        const json = await response.json();
        if (!json.candidates || json.candidates.length === 0) {
            console.error("AI Error:", JSON.stringify(json, null, 2));
            return null;
        }
        const rawText = json.candidates[0].content.parts[0].text;
        return JSON.parse(rawText);
    }
    catch (err) {
        console.error("Fetch Exception:", err);
        return null;
    }
}
function arrayToTypeScriptExport(arrayName, data, headerDocs) {
    const jsonStr = JSON.stringify(data, null, "\t").replace(/"([a-zA-Z0-9_]+)":/g, "$1:");
    return headerDocs + "\n\nexport const " + arrayName + " = " + jsonStr + ";\n";
}
async function processFile(filePath, exportName, type, header) {
    const absolutePath = path.resolve(process.cwd(), filePath);
    console.log("\\nReading " + absolutePath + "...");
    let dataModule;
    try {
        dataModule = await import("file:///" + absolutePath.replace(/\\/g, "/"));
    }
    catch (e) {
        console.error("Failed to load map:", e);
        return;
    }
    const dataArray = dataModule[exportName];
    if (!dataArray || !Array.isArray(dataArray)) {
        console.error("Export " + exportName + " missing.");
        return;
    }
    // JUST do 1 batch for sigils to test if it's working so we don't have to wait 10 mins if it fails.
    if (process.env.TEST_ONLY && dataArray.length > 5) {
        dataArray.splice(5);
    }
    const BATCH_SIZE = 10;
    for (let i = 0; i < dataArray.length; i += BATCH_SIZE) {
        process.stdout.write("[" + exportName + "] Batch " + (Math.floor(i / BATCH_SIZE) + 1) + " of " + Math.ceil(dataArray.length / BATCH_SIZE) + "... ");
        const chunk = dataArray.slice(i, i + BATCH_SIZE);
        let attempts = 0;
        let aiData = null;
        while (attempts < 3 && !aiData) {
            aiData = await generateWithAI(chunk, type);
            if (!aiData) {
                attempts++;
                console.log("Retry " + attempts + "...");
                await new Promise((r) => setTimeout(r, 4000));
            }
        }
        if (aiData) {
            for (const item of chunk) {
                const generated = aiData[item.id];
                if (generated) {
                    item.description = generated.description || item.description;
                    item.flavor = generated.flavor || item.flavor;
                    if (item.lore) {
                        if (typeof item.lore === "object") {
                            item.lore.origin = generated.lore || item.lore.origin;
                        }
                        else {
                            item.lore = generated.lore;
                        }
                    }
                    else {
                        item.lore = { origin: generated.lore };
                    }
                    if (type === "sigils") {
                        item.effect_description = generated.effect_description || item.effect_description;
                        if (item.mechanics) {
                            item.mechanics.special_abilities = [
                                generated.mechanics_passive ? "Passive: " + generated.mechanics_passive : "",
                                generated.mechanics_active ? "Active: " + generated.mechanics_active : ""
                            ].filter(Boolean);
                        }
                    }
                    else if (type === "tattoos") {
                        if (!item.effects)
                            item.effects = {};
                        item.effects.primary = generated.primary || item.effects.primary;
                        item.effects.secondary = generated.secondary || item.effects.secondary;
                        item.effects.tertiary = generated.tertiary || item.effects.tertiary;
                    }
                    else if (type === "feats") {
                        if (!item.benefits)
                            item.benefits = {};
                        if (Array.isArray(generated.expert))
                            item.benefits.expert = generated.expert;
                        if (Array.isArray(generated.master))
                            item.benefits.master = generated.master;
                    }
                    else if (type === "runes") {
                        item.discovery_lore = generated.discovery_lore || item.discovery_lore;
                        item.effect_description = generated.effect_description || item.effect_description;
                        item.higher_levels = generated.higher_levels || item.higher_levels;
                    }
                    else {
                        if (!item.effects)
                            item.effects = {};
                        // For powers/spells/techniques that have effects as object
                        if (typeof item.effects === "object" && !Array.isArray(item.effects)) {
                            item.effects.primary = generated.primary || item.effects.primary;
                            item.effects.secondary = generated.secondary || item.effects.secondary;
                        }
                        else if (Array.isArray(item.effects)) {
                            item.effects = [generated.primary, generated.secondary].filter(Boolean);
                        }
                    }
                }
            }
        }
        console.log(aiData ? "Success." : "Failed after retries, keeping original.");
        await new Promise((r) => setTimeout(r, 3000));
    }
    const fileContent = arrayToTypeScriptExport(exportName, dataArray, header);
    fs.writeFileSync(absolutePath, fileContent, "utf8");
    console.log("Saved " + filePath);
}
async function run() {
    console.log("=== STARTING AI MASTER ENRICHMENT ===");
    const targets = [
        { file: "src/data/compendium/sigils.ts", name: "sigils", type: "sigils", header: 'export interface SigilEntry {\\n\\tid: string;\\n\\tname: string;\\n\\tdescription: string;\\n\\teffect_description: string;\\n\\trune_type: string;\\n\\trune_category: string;\\n\\trune_level: number;\\n\\trarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary";\\n\\teffect_type: "active" | "passive" | "both";\\n\\trequires_level?: number;\\n\\tpassive_bonuses?: Record<string, unknown>;\\n\\tactive_feature?: Record<string, unknown>;\\n\\tcan_inscribe_on?: string[];\\n\\tinscription_difficulty?: number;\\n\\teffects?: Record<string, unknown>;\\n\\tmechanics?: Record<string, unknown>;\\n\\tlimitations?: Record<string, unknown>;\\n\\tflavor?: string;\\n\\tlore?: string;\\n\\ttags?: string[];\\n\\timage?: string;\\n\\tsource_book?: string;\\n}' },
        { file: "src/data/compendium/tattoos.ts", name: "tattoos", type: "tattoos", header: "import type { CompendiumTattoo } from '@/types/compendium';" },
        { file: "src/data/compendium/feats-comprehensive.ts", name: "comprehensiveFeats", type: "feats", header: "import type { CompendiumFeat } from '../../types/compendium';" },
        { file: "src/data/compendium/powers.ts", name: "powers", type: "powers", header: "// Awakened Powers" },
        { file: "src/data/compendium/techniques.ts", name: "techniques", type: "techniques", header: "import type { CompendiumTechnique } from '../../types/compendium';" },
        { file: "src/data/compendium/runes/spell-rank-s.ts", name: "runes_s", type: "runes", header: "import type { CompendiumRune } from '../../../types/compendium';" },
        { file: "src/data/compendium/runes/power-powers.ts", name: "runes_powers", type: "runes", header: "import type { CompendiumRune } from '../../../types/compendium';" },
        { file: "src/data/compendium/runes/technique-techniques.ts", name: "runes_techniques", type: "runes", header: "import type { CompendiumRune } from '../../../types/compendium';" },
        { file: "src/data/compendium/spells/rank-s.ts", name: "spells_s", type: "spells", header: "import type { CompendiumSpell } from '../../../types/compendium';" },
        { file: "src/data/compendium/spells/rank-a.ts", name: "spells_a", type: "spells", header: "import type { CompendiumSpell } from '../../../types/compendium';" }
    ];
    for (const t of targets) {
        if (fs.existsSync(path.resolve(process.cwd(), t.file))) {
            await processFile(t.file, t.name, t.type, t.header);
        }
    }
}
run();
