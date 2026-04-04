import * as fs from "node:fs";
import * as path from "node:path";

const targetCount = 13;

const titles = [
	"Void Engineer",
	"System Architect",
	"Rift Diver",
	"Mana Miner",
	"Shadow Broker",
	"Dimensional Smuggler",
	"Astral Medic",
	"Guild Enforcer",
	"Gate Cleaner",
	"Essence Harvester",
	"Dungeon Mapper",
	"Relic Appraiser",
	"Umbral Scout",
	"System Glitch",
	"Awakened Civilian",
	"Corporate Ascendant",
];
const ranks = ["D", "C", "B", "A", "S"];
const skills = [
	"Athletics",
	"Acrobatics",
	"Sleight of Hand",
	"Stealth",
	"Arcana",
	"History",
	"Investigation",
	"Nature",
	"Religion",
	"Animal Handling",
	"Insight",
	"Medicine",
	"Perception",
	"Survival",
	"Deception",
	"Intimidation",
	"Performance",
	"Persuasion",
];
const tools = [
	"Thieves' Tools",
	"Smith's Tools",
	"Alchemist's Supplies",
	"Tinker's Tools",
	"Herbalism Kit",
	"Navigator's Tools",
	"Poisoner's Kit",
];

function randomArray(arr: string[]): string {
	return arr[Math.floor(Math.random() * arr.length)];
}

function generateFeatures(title: string) {
	return [
		{
			name: `${title.split(" ")[0]} Connections`,
			description: `You know where to find individuals related to your former profession and can secure minor assistance or information from them in exchange for coin or favors.`,
		},
		{
			name: `System Instinct`,
			description: `Your time as a ${title} has altered your perception. You can instinctively tell the general stability of a rift or gate within 30 feet of you.`,
		},
	];
}

const backgrounds = [];
const _idCounter = 1;
const usedTitles = new Set<string>();

while (backgrounds.length < targetCount) {
	const title = randomArray(titles);
	if (usedTitles.has(title)) continue;
	usedTitles.add(title);

	const slug = title.toLowerCase().replace(/ /g, "-");

	const bg = {
		id: slug,
		name: title,
		type: "Background",
		rank: randomArray(ranks),
		skillProficiencies: [randomArray(skills), randomArray(skills)],
		toolProficiencies: [randomArray(tools)],
		languages: ["Common"],
		equipment: [
			"A set of professional clothes",
			"A relevant tool tied to your past",
			"A pouch containing 15 gp",
		],
		features: generateFeatures(title),
		personalityTraits: [
			`I approach problems like a ${title}.`,
			`I'm always looking for angles to exploit.`,
		],
		ideals: [
			"Survival. The System changes everything. I must adapt. (Neutral)",
		],
		bonds: ["Someone in my past life saved me during my awakening."],
		flaws: ["I default to my old civilian habits when panicked."],
		image: `/generated/compendium/backgrounds/${slug}.webp`,
		description: `Before the System chose you, you were a ${title}. Your skills translated surprisingly well to the brutal reality of dimensional rifts.`,
		dangers: ["Past debts", "Rival organizations"],
		source: "System Ascendant Canon",
	};

	backgrounds.push(bg);
}

const jsonStr = JSON.stringify(backgrounds, null, "\t").replace(
	/"([^"]+)":/g,
	"$1:",
);
const content = `// Generated Backgrounds Expansion\nexport const expandedBackgrounds = ${jsonStr};\n`;
fs.writeFileSync(
	path.join(process.cwd(), "src", "data", "compendium", "backgrounds-part2.ts"),
	content,
);
console.log(`Generated ${backgrounds.length} backgrounds.`);
