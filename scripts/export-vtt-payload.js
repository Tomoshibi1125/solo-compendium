import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
// Import Compendium Data
import { anomalies } from "../src/data/compendium/anomalies/index";
import { items_part1 } from "../src/data/compendium/items-part1";
import { items_part2 } from "../src/data/compendium/items-part2";
import { items_part3 } from "../src/data/compendium/items-part3";
import { locations } from "../src/data/compendium/locations";
import { comprehensiveRelics } from "../src/data/compendium/relics-comprehensive";
const allItemsAndRelics = [
    ...comprehensiveRelics,
    ...items_part1,
    ...items_part2,
    ...items_part3,
];
const currentDir = dirname(fileURLToPath(import.meta.url));
const MARKDOWN_FILE = resolve(currentDir, "..", "docs", "adventure-protocol-zero.md");
const OUTPUT_FILE = resolve(currentDir, "..", "docs", "Protocol-Zero-VTT-Module.json");
// 1. Build Scenes from Locations
const scenes = locations.map((loc) => ({
    id: `scene-${loc.id}`,
    name: loc.name,
    width: 2000,
    height: 2000,
    backgroundImage: loc.image || "/generated/maps/premade/gate-antechamber.webp",
    backgroundScale: 1,
    backgroundOffsetX: 0,
    backgroundOffsetY: 0,
    gridSize: 70, // Standard VTT Grid
    gridType: "square",
    tokens: [],
    drawings: [],
    annotations: [],
    walls: [],
    lights: [],
    fogOfWar: true,
    weather: "clear",
    terrain: [],
    ambientSounds: [],
}));
// 2. Fetch Assets
const assets = locations.map((loc) => ({
    id: `asset-${loc.id}`,
    name: `${loc.name} Map`,
    type: "map",
    imageUrl: loc.image || "/generated/maps/premade/gate-antechamber.webp",
    campaignId: "protocol-zero",
    isCustom: false,
}));
// Map anomalies to token assets precisely
anomalies.forEach((anomaly) => {
    assets.push({
        id: `asset-token-${anomaly.id}`,
        name: `${anomaly.name} Token`,
        type: "token",
        imageUrl: anomaly.image || "/generated/tokens/Anomaly-token.webp",
        campaignId: "protocol-zero",
        isCustom: false,
    });
});
// 3. Build Journals from Markdown Document
let mdContent = "";
try {
    mdContent = readFileSync(MARKDOWN_FILE, "utf8");
}
catch {
    console.error("Could not read original markdown file. Generating template stub journals instead.");
}
const journals = [];
if (mdContent) {
    const sections = mdContent.split(/(?=## Chapter|## Appendix|## The Neo-Seoul Sandbox)/g);
    sections.forEach((section, index) => {
        const lines = section.trim().split("\\n");
        const title = lines[0].replace(/#/g, "").trim() || `Section ${index}`;
        journals.push({
            id: `journal-${index}`,
            title: title,
            content: section,
        });
    });
}
else {
    // Fleshed out fallback in case markdown read fails completely
    journals.push({
        id: "journal-0",
        title: "Protocol Zero Framework",
        content: "# Error reading source Markdown.\\nEnsure docs/adventure-protocol-zero.md exists.",
    });
}
// 4. Construct Final Payload
const vttPayload = {
    manifestVersion: "1.0.0",
    campaign: {
        id: "protocol-zero",
        name: "Protocol Zero - Sandbox Campaign",
        system: "System Ascendant",
        description: "A massively scaled, Curse of Strahd style modern urban fantasy sandbox campaign.",
    },
    scenes: scenes,
    assets: assets,
    tokens: [],
    journals: journals,
    compendium: {
        anomalies: anomalies,
        items: allItemsAndRelics,
    },
};
writeFileSync(OUTPUT_FILE, JSON.stringify(vttPayload, null, 2), "utf8");
console.log(`VTT JSON Payload Exported successfully to ${OUTPUT_FILE}`);
console.log(`Included ${vttPayload.scenes.length} Scenes, ${vttPayload.assets.length} VTT Assets, ${vttPayload.compendium.anomalies.length} Anomalies, and ${vttPayload.compendium.items.length} Items.`);
