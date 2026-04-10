import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
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
const ORIGINAL_FILE = resolve(
	__dirname,
	"..",
	"docs",
	"adventure-protocol-zero.md",
);
const OUTPUT = resolve(__dirname, "..", "docs", "adventure-protocol-zero.md");

// Utility: Grab N random items
function getRandom<T>(arr: T[], n: number): T[] {
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, n);
}

// 1. Select Sandbox Elements
const selectedLocations = getRandom(locations, 15);
const selectedAnomalies = getRandom(anomalies, 60);
const selectedRelics = getRandom(allItemsAndRelics, 75);

// Formatters
function formatRelic(relic: {
	name: string;
	type?: string;
	rarity?: string;
	attunement?: boolean;
	description?: string;
	abilities?: Array<{ name: string; description: string }>;
}) {
	let md = `#### ${relic.name}\n`;
	md += `*${relic.type ? relic.type.charAt(0).toUpperCase() + relic.type.slice(1) : "Item"}, ${relic.rarity || "Uncommon"}${relic.attunement ? " â€” Requires Attunement" : ""}*\n`;
	md += `${relic.description || "A mysterious item of unknown provenance."}\n\n`;

	if (relic.abilities && relic.abilities.length > 0) {
		md += `**Abilities:**\n`;
		relic.abilities.forEach((ab) => {
			md += `- ***${ab.name}.*** ${ab.description}\n`;
		});
		md += `\n`;
	}
	return md;
}

function formatAnomaly(anomaly: {
	name: string;
	rank?: string;
	type?: string;
	ac?: number;
	hp?: number;
	description?: string;
	stats?: {
		ability_scores?: {
			strength: number;
			agility: number;
			vitality: number;
			intelligence: number;
			sense: number;
			presence: number;
		};
		challenge_rating?: number;
	};
	traits?: Array<{ name: string; description: string }>;
	actions?: Array<{ name: string; description: string }>;
}) {
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
	md += `**CR:** ${anomaly.stats?.challenge_rating || "Classified"}\n`;
	md += `> ${anomaly.description || "A dangerous anomaly."}\n\n`;

	if (anomaly.traits && anomaly.traits.length > 0) {
		md += `**Traits:**\n`;
		anomaly.traits.forEach((t) => {
			md += `- ***${t.name}.*** ${t.description}\n`;
		});
		md += `\n`;
	}

	if (anomaly.actions && anomaly.actions.length > 0) {
		md += `**Actions:**\n`;
		anomaly.actions.forEach((a) => {
			md += `- ***${a.name}.*** ${a.description}\n`;
		});
		md += `\n`;
	}
	md += `---\n\n`;
	return md;
}

// Generate the new massive Sandbox block (to append to Chapter 3)
let sandboxMd = `\n\n## The Neo-Seoul Sandbox (Levels 3-8 Expansion)\n\n`;
sandboxMd += `While navigating Chapters 2, 3, and 4, the Ascendants are free to explore Neo-Seoul. The Decree Warden can use the following locations as dynamic hubs for side-quests, random Gate appearances, and faction operations. They are fully statted point-crawl locations.\n\n`;

selectedLocations.forEach((loc) => {
	sandboxMd += `### ${loc.name}\n`;
	sandboxMd += `**Type:** ${loc.type} | **Threat Level:** ${loc.rank}-Rank\n\n`;
	sandboxMd += `${loc.description}\n\n`;
	if (loc.encounters && loc.encounters.length > 0) {
		sandboxMd += `**Typical Encounters:** ${loc.encounters.join(", ")}\n`;
	}
	if (loc.treasures && loc.treasures.length > 0) {
		sandboxMd += `**Potential Loot:** ${loc.treasures.join(", ")}\n`;
	}
	sandboxMd += `\n---\n\n`;
});

// Generate massive new Appendices A and B
let appAMd = `## Appendix A: Relics & Magic Items\n\nThis comprehensive list of ${selectedRelics.length} items can be found as Gate boss rewards or purchased through Black Market dealers across the Sandbox.\n\n`;
selectedRelics.forEach((relic) => {
	appAMd += formatRelic(relic as unknown as Parameters<typeof formatRelic>[0]);
});

let appBMd = `## Appendix B: The Grand Bestiary\n\nA massive compendium of ${selectedAnomalies.length} Anomalies found throughout the Gates and the Sandbox point-crawl.\n\n`;
selectedAnomalies.forEach((anomaly) => {
	appBMd += formatAnomaly(
		anomaly as unknown as Parameters<typeof formatAnomaly>[0],
	);
});

// MERGE
const originalMd = readFileSync(ORIGINAL_FILE, "utf8");

// We will split the original markdown to inject our new contents.
// 1. Inject sandboxMd before "## Chapter 4: The Regent's Call"
const ch4Index = originalMd.indexOf("## Chapter 4: The Regent's Call");
const part1 = originalMd.substring(0, ch4Index);
const part2 = originalMd.substring(ch4Index);

let merged = part1 + sandboxMd + part2;

// 2. Replace Appendix A
const appAStart = merged.indexOf("## Appendix A: Relics & Equipment");
const _appBStart = merged.indexOf("## Appendix B: Anomaly Bestiary");
const appCStart = merged.indexOf("## Appendix C: NPC Profiles & Stat Blocks");

const beforeAppA = merged.substring(0, appAStart);
const afterAppC = merged.substring(appCStart); // Keep Appendix C, D, E, F, G exactly as they were!

merged = beforeAppA + appAMd + appBMd + afterAppC;

writeFileSync(OUTPUT, merged, "utf8");

console.log(`Massive Sandbox Campaign generated successfully at ${OUTPUT}!`);
console.log(`Total Length: ${merged.split("\\n").length} lines.`);
