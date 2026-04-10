import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Core System Ascendant Lexicon
const EVENTS = [
	"the First Void Fracture",
	"the Azure Gate Collapse",
	"the Manifestation Event",
	"the Regent Wars",
	"the Crimson Incursion",
	"the Abyssal Influx",
	"the Resonance Cascade",
	"the Silence of the Oracle",
	"the Eclipse Protocol",
	"the Day of Falling Stars",
	"the Mana Awakening",
];
const ENTITIES = [
	"high-tier Rift beasts",
	"a Sovereign of the Void",
	"an apex-class Awakened",
	"Rogue Protocol entities",
	"Dimensional Scavengers",
	"an ancient Guild Master",
	"a forgotten Regent",
	"the Architect's rogue subroutines",
	"Phantom Class anomalies",
];
const RESULTS = [
	"leaves temporal scars on reality",
	"disrupts a Hunter's innate mana perception",
	"forces agonizing metabolic sacrifice to maintain",
	"taxes the user's Mana circuits heavily",
	"causes the user's eyes to glow with unnatural light",
	"leaves a trail of shadowy distortion in physical space",
	"creates a vacuum in ambient mana fields",
	"resonates with the hum of raw magical energy",
	"overrides basic physics within a 30-foot radius",
];

const ADJECTIVES = [
	"A brutal",
	"A chaotic",
	"An overwhelming",
	"A silent",
	"A devastating",
	"A relentless",
	"An absolute",
	"A subtle",
	"An intricate",
	"A forbidden",
	"A desperate",
	"A triumphant",
	"A sorrowful",
	"An ancient",
];
const NOUNS = [
	"symphony of violence",
	"testament to absolute power",
	"whisper in the shadows",
	"beautiful catastrophe",
	"breaking point of the world",
	"ultimate equalizer",
	"death of hesitation",
	"roar of raw mana",
	"surge of lethal intent",
	"dance performed on the edge of a blade",
];
const ACTIONS = [
	"Shatters",
	"Overrides",
	"Bends",
	"Commands",
	"Absorbs",
	"Reflects",
	"Ignores",
	"Cleanses",
	"Destroys",
	"Denies",
	"Reclaims",
	"Weaves",
	"Crushes",
	"Ignites",
];
const TARGETS = [
	"the dimensional divide",
	"all who stand in opposition",
	"the fragile limits of flesh",
	"the architect's design",
	"the concept of defeat",
	"the flow of time itself",
	"the arrogant and the mighty",
	"the darkness within",
	"the quiet space between breaths",
	"the remnants of humanity",
];

// Stable hash function to ensure uniqueness but consistency
function hashString(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

function generateLore(name, indexOffset = 0) {
	const hash = hashString(name) + indexOffset;
	const event = EVENTS[Math.floor(hash % EVENTS.length)];
	const entity = ENTITIES[Math.floor((hash / 2) % ENTITIES.length)];
	const result = RESULTS[Math.floor((hash / 3) % RESULTS.length)];

	// Create variants based on the hash to keep it very diverse
	const form = hash % 4;
	switch (form) {
		case 0:
			return `First recorded during ${event}, this phenomenon is often linked to the presence of ${entity}. Activating it ${result}.`;
		case 1:
			return `Originating from the aftermath of ${event}, this technique was pioneered by ${entity}. Utilizing it ${result}.`;
		case 2:
			return `A manifestation of raw System authority discovered after ${event}, this ability bypasses standard biological limits and ${result}.`;
		case 3:
			return `Translated from the combat data of ${entity} who perished in ${event}, this power ${result}.`;
	}
}

function generateFlavor(name, indexOffset = 0) {
	const hash = hashString(name) + indexOffset + 100;
	const adj = ADJECTIVES[Math.floor(hash % ADJECTIVES.length)];
	const noun = NOUNS[Math.floor((hash / 2) % NOUNS.length)];
	const act = ACTIONS[Math.floor((hash / 3) % ACTIONS.length)];
	const tgt = TARGETS[Math.floor((hash / 4) % TARGETS.length)];

	return `${act} ${tgt}. ${adj} ${noun}.`;
}

function generateSystemInteraction(name, _type, indexOffset = 0) {
	const hash = hashString(name) + indexOffset + 200;

	// Choose severity based on hash
	const severityMap = [
		"Notice",
		"Alert",
		"Warning",
		"Critical Warning",
		"Fatal Error",
		"Protocol Warden",
	];
	const severity = severityMap[hash % severityMap.length];

	// Choose variable class
	const variableMap = [
		"Unregistered variable",
		"A-Rank anomaly",
		"S-Rank protocol",
		"Regent-Class signature",
		"Hazardous subroutine",
		"Dimensional distortion",
	];
	const variable = variableMap[(hash * 2) % variableMap.length];

	// Action verb
	const actionMap = [
		"detected",
		"engaged",
		"suppressed",
		"isolated",
		"overridden",
		"acknowledged",
	];
	const action = actionMap[(hash * 3) % actionMap.length];

	// Consequence
	const consequenceMap = [
		"Immediate caution advised.",
		"Core stability fluctuating.",
		"Mana integration successful.",
		"Structural damage imminent.",
		"Combat parameters updated.",
		"Evasion impossible.",
	];
	const consequence = consequenceMap[(hash * 4) % consequenceMap.length];

	return `[${severity}: ${variable} ${action}. ${consequence}]`;
}

function processFile(filePath) {
	console.log(`Processing an overhaul of ${filePath}...`);
	const content = fs.readFileSync(filePath, "utf8");

	const nameCount = new Map();
	let currentName = "Unknown Entity";
	let result = "";
	let pos = 0;

	// Updated robust regex that matches Name, Lore, Flavor, or SystemInteraction, capturing everything inside double quotes reliably.
	// It assumes the keys are double quoted or not, but the values are double quoted.
	// Group 1: name field (e.g. name: ")
	// Group 2: name value
	// Group 3: closing quote
	const r =
		/(name:\s*")([^"\\]*(?:\\.[^"\\]*)*)(")|(lore:\s*")([^"\\]*(?:\\.[^"\\]*)*)(")|(flavor:\s*")([^"\\]*(?:\\.[^"\\]*)*)(")|(system_interaction:\s*")([^"\\]*(?:\\.[^"\\]*)*)(")/g;

	for (const match of content.matchAll(r)) {
		if (match[2]) {
			currentName = match[2];
			result +=
				content.substring(pos, match.index) + match[1] + match[2] + match[3];
		} else if (match[4]) {
			const count = (nameCount.get(currentName) || 0) + 1;
			nameCount.set(currentName, count);

			const newLore = generateLore(currentName, count);
			result +=
				content.substring(pos, match.index) + match[4] + newLore + match[6];
		} else if (match[7]) {
			const count = (nameCount.get(currentName) || 0) + 1;
			nameCount.set(currentName, count);

			const newFlavor = generateFlavor(currentName, count);
			result +=
				content.substring(pos, match.index) + match[7] + newFlavor + match[9];
		} else if (match[10]) {
			const count = (nameCount.get(currentName) || 0) + 1;
			nameCount.set(currentName, count);

			const newInteraction = generateSystemInteraction(
				currentName,
				"general",
				count,
			);
			result +=
				content.substring(pos, match.index) +
				match[10] +
				newInteraction +
				match[12];
		}
		pos = match.index + match[0].length;
	}

	result += content.substring(pos);
	fs.writeFileSync(filePath, result, "utf8");
	console.log(
		`Success! Rewrote ${filePath} to align with System Ascendant aesthetic, ensuring zero duplicates.`,
	);
}

const targetFiles = [
	"src/data/compendium/conditions.ts",
	"src/data/compendium/backgrounds.ts",
	"src/data/compendium/backgrounds-part2.ts",
	"src/data/compendium/jobs.ts",
	"src/data/compendium/locations.ts",
	"src/data/compendium/regents.ts",
	"src/data/compendium/runes.ts",
	"src/data/compendium/sigils.ts",
	"src/data/compendium/skills-comprehensive.ts",
	"src/data/compendium/feats-comprehensive.ts",
	"src/data/compendium/techniques.ts",
	"src/data/compendium/powers.ts",
];

targetFiles.forEach((subPath) => {
	const fullPath = path.join(__dirname, "..", subPath);
	if (fs.existsSync(fullPath)) {
		processFile(fullPath);
	} else {
		console.error("File not found:", fullPath);
	}
});
