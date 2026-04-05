import { writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { anomalies } from "../src/data/compendium/anomalies/index";
import { items_part1 } from "../src/data/compendium/items-part1";
import { items_part2 } from "../src/data/compendium/items-part2";
import { items_part3 } from "../src/data/compendium/items-part3";
// Import Compendium Data
import { locations } from "../src/data/compendium/locations";
import { comprehensiveRelics } from "../src/data/compendium/relics-comprehensive";

const allItemsAndRelics = [
	...comprehensiveRelics,
	...items_part1,
	...items_part2,
	...items_part3,
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(
	__dirname,
	"..",
	"docs",
	"adventure-protocol-zero-sandbox.md",
);

// Utility: Grab N random items
function getRandom<T>(arr: T[], n: number): T[] {
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

// 1. Select Sandbox Elements
const selectedLocations = getRandom(locations, 15);
const selectedAnomalies = getRandom(anomalies, 60);
const selectedRelics = getRandom(comprehensiveRelics, 60);

// Helper to format Relics
function formatRelic(relic: any) {
	let md = `#### ${relic.name}\n`;
	md += `*${relic.type.charAt(0).toUpperCase() + relic.type.slice(1)}, ${relic.rarity}${relic.attunement ? " — Requires Attunement" : ""}*\n`;
	md += `${relic.description}\n\n`;

	if (relic.abilities && relic.abilities.length > 0) {
		md += `**Abilities:**\n`;
		relic.abilities.forEach((ab: any) => {
			md += `- ***${ab.name}.*** ${ab.description}\n`;
		});
		md += `\n`;
	}
	return md;
}

// Helper to format Anomalies
function formatAnomaly(anomaly: any) {
	let md = `### ${anomaly.name} (${anomaly.rank}-Rank ${anomaly.type || "Anomaly"})\n`;
	md += `*Medium Aberration, Unaligned*\n\n`;
	md += `**AC:** ${anomaly.ac || 15} | **HP:** ${anomaly.hp || 50} | **Speed:** 30 ft.\n`;
	md += `| STR | AGI | VIT | INT | SENSE | PRE |\n|---|---|---|---|---|---|\n`;

	const s = anomaly.stats?.ability_scores || {
		strength: 10,
		agility: 10,
		vitality: 10,
		intelligence: 10,
		sense: 10,
		presence: 10,
	};
	const mod = (val: number) => Math.floor((val - 10) / 2);
	const formatStat = (val: number) =>
		`${val} (${mod(val) >= 0 ? "+" : ""}${mod(val)})`;

	md += `| ${formatStat(s.strength)} | ${formatStat(s.agility)} | ${formatStat(s.vitality)} | ${formatStat(s.intelligence)} | ${formatStat(s.sense)} | ${formatStat(s.presence)} |\n\n`;
	md += `**CR:** ${anomaly.stats?.challenge_rating || "Unknown"}\n`;
	md += `> ${anomaly.description || "A dangerous anomaly."}\n\n`;

	if (anomaly.traits && anomaly.traits.length > 0) {
		md += `**Traits:**\n`;
		anomaly.traits.forEach((t: any) => {
			md += `- ***${t.name}.*** ${t.description}\n`;
		});
		md += `\n`;
	}

	if (anomaly.actions && anomaly.actions.length > 0) {
		md += `**Actions:**\n`;
		anomaly.actions.forEach((a: any) => {
			md += `- ***${a.name}.*** ${a.description}\n`;
		});
		md += `\n`;
	}

	md += `---\n\n`;
	return md;
}

// Write the document
let content = `# Protocol Zero: The Neo-Seoul Sandbox

**A Megadungeon & Sandbox Campaign for Levels 1–10**
**Setting:** Neo-Seoul, Modern Urban Fantasy
**System:** System Ascendant (d20 / 5e-Compatible)

> *"The System isn't a game. It's an ecosystem, and we are the food."*

## Introduction
The Protocol Zero campaign has been expanded into a fully realized Sandbox. Drawing structural inspiration from *Curse of Strahd*, this campaign focuses on exploration, dynamic faction politics, and massive procedurally generated threats. The characters are free to explore Neo-Seoul's districts, conquer random Gates, and align with factions before the inevitable S-Rank Gate Break.

---

## The Sandbox: Neo-Seoul Districts
The mid-game of this campaign (Levels 3–8) takes place across various districts and safehouses. The DM can use these locations to run a point-crawl or open-world exploration.

`;

selectedLocations.forEach((loc) => {
	content += `### ${loc.name}\n`;
	content += `**Type:** ${loc.type} | **Threat Level:** ${loc.rank}-Rank\n\n`;
	content += `${loc.description}\n\n`;
	if (loc.encounters && loc.encounters.length > 0) {
		content += `**Typical Encounters:** ${loc.encounters.join(", ")}\n`;
	}
	if (loc.treasures && loc.treasures.length > 0) {
		content += `**Potential Loot:** ${loc.treasures.join(", ")}\n`;
	}
	content += `\n---\n\n`;
});

content += `## Procedural Appendix A: Comprehensive Relics List\n\n`;
content += `This massive arsenal represents the loot available throughout the sandbox. Items can be seeded into Gate boss chests or Black Market shops.\n\n`;

selectedRelics.forEach((relic) => {
	content += formatRelic(relic);
});

content += `## Procedural Appendix B: The Grand Bestiary\n\n`;
content += `A complete catalog of the Anomalies that populate Neo-Seoul's Gates. DM's should roll on random encounter tables referencing these horrors.\n\n`;

selectedAnomalies.forEach((anomaly) => {
	content += formatAnomaly(anomaly);
});

content += `## Appendix G: Pacing & Advancement\n\n`;
content += `**Decree Wardens have two options for pacing this sandbox campaign:**\n\n`;
content += `1. **Milestone Leveling (Narrative Focus):** Characters level up by achieving major story beats (e.g., closing a Red Gate, stopping a Null Guild ritual, reaching a faction capstone).\n`;
content += `2. **Essence Harvesting (XP Focus):** Characters absorb Essence from the Anomalies they slay in the Sandbox. Every D-Rank gate yields 1,000 XP equivalent. To level, characters must return to a Safehouse and "process" their essence.\n\n`;
content += `*Protocol Zero Sandbox Version 2.0*`;

writeFileSync(OUTPUT, content, "utf8");

console.log(`Generated Sandbox Campaign: ${OUTPUT}`);
console.log(
	`Included ${selectedLocations.length} locations, ${selectedRelics.length} relics, and ${selectedAnomalies.length} anomalies.`,
);
