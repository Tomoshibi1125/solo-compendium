import * as fs from "node:fs";
import * as path from "node:path";

// Helper to deterministic random based on a string seed (like the ID)
function cyrb128(str: string) {
	let h1 = 1779033703,
		h2 = 3144134277,
		h3 = 1013904242,
		h4 = 2773480762;
	for (let i = 0, k; i < str.length; i++) {
		k = str.charCodeAt(i);
		h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
		h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
		h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
		h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
	}
	h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
	h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
	h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
	h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
	return [
		(h1 ^ h2 ^ h3 ^ h4) >>> 0,
		(h2 ^ h1) >>> 0,
		(h3 ^ h1) >>> 0,
		(h4 ^ h1) >>> 0,
	];
}

function sfc32(a: number, b: number, c: number, d: number) {
	return () => {
		a >>>= 0;
		b >>>= 0;
		c >>>= 0;
		d >>>= 0;
		let t = (a + b) | 0;
		a = b ^ (b >>> 9);
		b = (c + (c << 3)) | 0;
		c = (c << 21) | (c >>> 11);
		d = (d + 1) | 0;
		t = (t + d) | 0;
		c = (t + c) | 0;
		return (t >>> 0) / 4294967296;
	};
}

// Massive combinations for absolute variety
const prefixes = [
	"Forged in the heart of a collapsing dimensional rift, ",
	"Translated from an ancient Monarch's combat protocol, ",
	"A manifestation of pure System authority, ",
	"Recovered from the corpse of an S-Rank Sovereign, ",
	"Born in the absolute zero vacuum of the Void Gate, ",
	"Reverse-engineered from stolen Architect data, ",
	"A legendary anomaly in the System's mana distribution network, ",
	"Woven from the dying scream of a celestial beast, ",
	"A forbidden technique erased from the original Awakened archives, ",
	"Resonating with the hum of raw temporal magic, ",
	"Crystallized from the very essence of human despair, ",
	"A remnant of the First Ascension War, ",
	"Designed by the fragments of a shattered ruler, ",
	"A brutal mutation of basic mana circuits, ",
	"Unearthed from a dungeon that defied the System's logic, ",
	"A shadow-cast imprint of a forgotten hero, ",
	"Synthesized in the clandestine labs of America's elite Hunters, ",
	"An organic evolution of pure combat instinct, ",
	"A whisper stolen from the Ruler of Death, ",
	"Manifested via a glitch in the world's protective barrier, ",
];

const subjects = [
	"this power exists as a direct command to the universe. ",
	"this construct twists the laws of physics heavily. ",
	"this phenomenon bypasses standard protective measures. ",
	"this force requires agonizing metabolic sacrifice to maintain. ",
	"this energy shatters ambient magical fields. ",
	"this weapon-grade output is monitored by global authorities. ",
	"this technique was banned by the International Guild Association. ",
	"this protocol constantly attempts to consume its user. ",
	"this essence causes surrounding gravity to invert slightly. ",
	"this application of force redefines what is possible for a mortal. ",
	"this manifestation mirrors the fury of a dying star. ",
	"this aspect operates outside the Architect's intended parameters. ",
	"this mechanism forcibly rewrites the immediate space-time. ",
	"this ability burns through unawakened materials instantly. ",
	"this phenomenon leaves temporal scars on reality. ",
	"this expression of intent cannot be conventionally blocked. ",
	"this brutal art demands absolute emotional detachment. ",
	"this signature leaves an indelible mark on the user's soul. ",
	"this tool is viewed simultaneously as a miracle and a curse. ",
	"this equation solves the problem of mortality with violence. ",
];

const results = [
	"Using it feels like a brief, violent disconnection from reality.",
	"Only an Awakened with exceptional stats can endure its side effects.",
	"It leaves a trail of shadowy distortion in physical space.",
	"The System recognizes it as an extremely hazardous variable.",
	"It hums with a faint, lethal frequency that nauseates ordinary humans.",
	"Hunters who rely on it often find themselves craving dimensional energy.",
	"Activating this protocol taxes the user's Mana circuits heavily.",
	"Its execution overrides basic physics within a 30-foot radius.",
	"Guild Masters actively monitor the usage of this specific ability.",
	"It represents the absolute peak of human adaptability.",
	"The air around the user turns bitter cold and smells of ozone.",
	"It inflicts phantom pains on anyone attempting to replicate it.",
	"Those who witness it often suffer brief, terrifying hallucinations.",
	"The raw output forces the System to dynamically patch reality.",
	"It requires the user to sever their sense of empathy temporarily.",
	"The energy discharge turns nearby glass into fine dust.",
	"It feels less like a spell and more like a declaration of war.",
	"The feedback loop causes the user's eyes to glow with unnatural light.",
	"The sheer density of the mana causes shadows to warp around the user.",
	"It is a beautiful, terrifying reminder of why gates exist.",
];

const flavorVerbs = [
	"Destroys",
	"Unravels",
	"Shatters",
	"Bends",
	"Silences",
	"Ignites",
	"Crushes",
	"Tears",
	"Eclipses",
	"Devours",
	"Weaves",
	"Commands",
	"Reclaims",
	"Denies",
	"Absorbs",
	"Reflects",
	"Condemns",
	"Cleanses",
	"Binds",
	"Overrides",
];
const flavorObjects = [
	"the fabric of reality",
	"all who stand in opposition",
	"the fragile limits of flesh",
	"the architect's design",
	"the darkness within",
	"the dimensional divide",
	"the arrogant and the mighty",
	"the quiet space between breaths",
	"the concept of defeat",
	"the flow of time itself",
	"the illusion of safety",
	"the very core of the soul",
	"the remnants of humanity",
	"the chaotic essence of the void",
	"the inevitable end of all things",
];
const flavorNouns = [
	"A testament to absolute power.",
	"A symphony of violence.",
	"The final word in any conflict.",
	"A beautiful catastrophe.",
	"The breaking point of the world.",
	"A whisper of pure destruction.",
	"The ultimate equalizer.",
	"A dance performed on the edge of a blade.",
	"The shadow of a forgotten god.",
	"The death of hesitation.",
];

function generateProceduralContent(id: string, _name: string) {
	const seed = cyrb128(`${id}system`);
	const rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

	// Pick indices using rand()
	const p = Math.floor(rand() * prefixes.length);
	const s = Math.floor(rand() * subjects.length);
	const r = Math.floor(rand() * results.length);

	const lore = `${prefixes[p]}${subjects[s]}${results[r]}`;

	const fv = Math.floor(rand() * flavorVerbs.length);
	const fo = Math.floor(rand() * flavorObjects.length);
	const fn = Math.floor(rand() * flavorNouns.length);

	const flavor = `${flavorVerbs[fv]} ${flavorObjects[fo]}. ${flavorNouns[fn]}`;

	const sysCode = Math.floor(rand() * 9999);
	const sysRanks = [
		"B-Rank",
		"A-Rank",
		"S-Rank",
		"National",
		"Unregistered",
		"Monarch-Class",
	];
	const sysType = sysRanks[Math.floor(rand() * sysRanks.length)];
	const system_interaction = `System Directive [Err${sysCode}]: ${sysType} variable detected. Immediate caution advised.`;

	return { lore, flavor, system_interaction };
}

// The Rewrite Engine

function arrayToTypeScriptExport(
	arrayName: string,
	data: any[],
	headerDocs: string,
) {
	const jsonStr = JSON.stringify(data, null, "\t").replace(
		/"([a-zA-Z0-9_]+)":/g,
		"$1:",
	);
	return `${headerDocs}\n\nexport const ${arrayName} = ${jsonStr};\n`;
}

async function processFile(
	filePath: string,
	exportName: string,
	header: string,
) {
	const absolutePath = path.resolve(process.cwd(), filePath);
	process.stdout.write(`Processing ${exportName}... `);

	let dataModule;
	try {
		dataModule = await import(`file:///${absolutePath.replace(/\\/g, "/")}`);
	} catch (e) {
		console.error("Failed to import module statically", e);
		return;
	}

	const dataArray = dataModule[exportName];
	if (!dataArray || !Array.isArray(dataArray)) {
		console.error(`Export ${exportName} not found or not an array.`);
		return;
	}

	// Apply procedural uniqueness
	for (const item of dataArray) {
		const { lore, flavor, system_interaction } = generateProceduralContent(
			item.id,
			item.name,
		);

		item.lore = lore;
		item.flavor = flavor;
		if (!item.mechanics) item.mechanics = {};
		item.mechanics.system_interaction = system_interaction;
	}

	const fileContent = arrayToTypeScriptExport(exportName, dataArray, header);
	fs.writeFileSync(absolutePath, fileContent, "utf8");

	console.log(`Rewrote ${dataArray.length} items perfectly.`);
}

async function runAll() {
	console.log("=== EXECUTING OMNISCIENT ALGORITHMIC GENERATOR ===");

	const targets = [
		{
			file: "src/data/compendium/spells/rank-s.ts",
			name: "spells_s",
			header:
				"// S-Rank Spells\n// Massive system protocols requiring immense mana resources.",
		},
		{
			file: "src/data/compendium/spells/rank-a.ts",
			name: "spells_a",
			header: "// A-Rank Spells",
		},
		{
			file: "src/data/compendium/spells/rank-b.ts",
			name: "spells_b",
			header: "// B-Rank Spells",
		},
		{
			file: "src/data/compendium/spells/rank-c.ts",
			name: "spells_c",
			header: "// C-Rank Spells",
		},
		{
			file: "src/data/compendium/spells/rank-d.ts",
			name: "spells_d",
			header: "// D-Rank Spells",
		},
		{
			file: "src/data/compendium/powers.ts",
			name: "powers",
			header:
				"// Awakened Powers\n// Core abilities utilized by advanced Hunters.",
		},
		{
			file: "src/data/compendium/techniques.ts",
			name: "techniques",
			header: "// Techniques Compendium",
		},
		{
			file: "src/data/compendium/feats-comprehensive.ts",
			name: "comprehensiveFeats",
			header: "// Feats Compendium",
		},
		{
			file: "src/data/compendium/items.ts",
			name: "items",
			header: "// Base Items List",
		},
		{
			file: "src/data/compendium/items-part1.ts",
			name: "items",
			header: "// Items Part 1",
		},
		{
			file: "src/data/compendium/items-part2.ts",
			name: "items",
			header: "// Items Part 2",
		},
		{
			file: "src/data/compendium/items-part3.ts",
			name: "items",
			header: "// Items Part 3",
		},
		{
			file: "src/data/compendium/items-part4.ts",
			name: "items",
			header: "// Items Part 4",
		},
		{
			file: "src/data/compendium/items-part5.ts",
			name: "items",
			header: "// Items Part 5",
		},
		{
			file: "src/data/compendium/items-part6.ts",
			name: "items",
			header: "// Items Part 6",
		},
		{
			file: "src/data/compendium/items-part7.ts",
			name: "items",
			header: "// Items Part 7",
		},
		{
			file: "src/data/compendium/items-part8.ts",
			name: "items",
			header: "// Items Part 8",
		},
		{
			file: "src/data/compendium/items-part9.ts",
			name: "items",
			header: "// Items Part 9",
		},
		{
			file: "src/data/compendium/items-base-equipment.ts",
			name: "baseEquipment",
			header: "// Base Equipment",
		},
		{
			file: "src/data/compendium/artifacts.ts",
			name: "artifacts",
			header: "// Artifacts",
		},
		{
			file: "src/data/compendium/runes/index.ts",
			name: "allRunes",
			header: "// Comprehensive Runes Index",
		},
		{
			file: "src/data/compendium/sigils.ts",
			name: "sigils",
			header:
				'export interface SigilEntry {\n\tid: string;\n\tname: string;\n\tdescription: string;\n\teffect_description: string;\n\trune_type: string;\n\trune_category: string;\n\trune_level: number;\n\trarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary";\n\teffect_type: "active" | "passive" | "both";\n\trequires_level?: number;\n\tpassive_bonuses?: Record<string, unknown>;\n\tactive_feature?: Record<string, unknown>;\n\tcan_inscribe_on?: string[];\n\tinscription_difficulty?: number;\n\teffects?: Record<string, unknown>;\n\tmechanics?: Record<string, unknown>;\n\tlimitations?: Record<string, unknown>;\n\tflavor?: string;\n\tlore?: string;\n\ttags?: string[];\n\timage?: string;\n\tsource_book?: string;\n}',
		},
		{
			file: "src/data/compendium/tattoos.ts",
			name: "tattoos",
			header:
				"// Magical Tattoos — System Ascendant\n// Dimensional ink, sovereign stigmas, and mana circuit grafts.\n\nimport type { CompendiumTattoo } from '../../types/compendium';",
		},
		{
			file: "src/data/compendium/monsters/rank-s.ts",
			name: "monsters_s",
			header: "// Rank S Monsters",
		},
		{
			file: "src/data/compendium/monsters/rank-a.ts",
			name: "monsters_a",
			header: "// Rank A Monsters",
		},
		{
			file: "src/data/compendium/monsters/rank-b.ts",
			name: "monsters_b",
			header: "// Rank B Monsters",
		},
		{
			file: "src/data/compendium/monsters/rank-c.ts",
			name: "monsters_c",
			header: "// Rank C Monsters",
		},
		{
			file: "src/data/compendium/monsters/rank-d.ts",
			name: "monsters_d",
			header: "// Rank D Monsters",
		},
		{
			file: "src/data/compendium/locations.ts",
			name: "locations",
			header: "// Locations Compendium",
		},
		{
			file: "src/data/compendium/regents.ts",
			name: "regents",
			header: "// Regents Compendium",
		},
		{
			file: "src/data/compendium/jobs.ts",
			name: "jobs",
			header: "// Jobs Compendium",
		},
		{
			file: "src/data/compendium/paths.ts",
			name: "paths",
			header: "// Paths Compendium",
		},
		{
			file: "src/data/compendium/backgrounds.ts",
			name: "backgrounds",
			header: "// Backgrounds Compendium",
		},
		{
			file: "src/data/compendium/backgrounds-part2.ts",
			name: "expandedBackgrounds",
			header: "// Expanded Backgrounds",
		},
		{
			file: "src/data/compendium/relics-comprehensive.ts",
			name: "comprehensiveRelics",
			header: "// Relics",
		},
		{
			file: "src/data/compendium/conditions.ts",
			name: "conditions",
			header: "// Conditions",
		},
		{
			file: "src/data/compendium/skills-comprehensive.ts",
			name: "comprehensiveSkills",
			header: "// Skills",
		},
	];

	for (const t of targets) {
		if (fs.existsSync(path.resolve(process.cwd(), t.file))) {
			await processFile(t.file, t.name, t.header);
		}
	}

	console.log("=== COMPLETE ===");
}

runAll();
