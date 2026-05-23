import * as fs from "fs";
import * as path from "path";

const powerDir = "src/data/compendium";
const pathAccessFile = "src/lib/pathAbilityAccess.ts";
const filesToParse = [
	"powers-core.ts",
	"powers-supplemental.ts",
	"techniques-core.ts",
	"techniques-supplemental.ts",
];

interface Ability {
	name: string;
	desc: string;
	kind: string;
	rarity: string;
}

const allAbilities: Ability[] = [];

for (const file of filesToParse) {
	const filepath = path.join(powerDir, file);
	if (!fs.existsSync(filepath)) continue;

	const content = fs.readFileSync(filepath, "utf-8");
	const kind = file.includes("power") ? "power" : "technique";
	const objects = content.split("display_name:");

	for (let i = 1; i < objects.length; i++) {
		const obj = objects[i];
		const nameMatch = obj.match(/^\s*"([^"]+)"/);
		const rarityMatch = obj.match(/rarity:\s*"([^"]+)"/);

		if (nameMatch && rarityMatch) {
			allAbilities.push({
				name: nameMatch[1],
				desc: obj.toLowerCase(),
				kind: kind,
				rarity: rarityMatch[1].toLowerCase(),
			});
		}
	}
}

const tierLevels = [
	{ level: 3, rarity: "common" },
	{ level: 5, rarity: "uncommon" },
	{ level: 9, rarity: "rare" },
	{ level: 13, rarity: "epic" },
	{ level: 17, rarity: "legendary" },
];

function findBestMatches(
	regex: RegExp,
	targetRarity: string,
	limit: number = 2,
): Ability[] {
	const matches: Ability[] = [];
	const pool = allAbilities
		.filter((a) => a.rarity === targetRarity)
		.sort((a, b) => a.name.localeCompare(b.name));

	for (const ability of pool) {
		if (matches.length >= limit) break;
		if (regex.test(ability.desc) || regex.test(ability.name.toLowerCase())) {
			matches.push(ability);
		}
	}

	if (matches.length < limit) {
		for (const ability of pool) {
			if (matches.length >= limit) break;
			if (!matches.includes(ability)) {
				matches.push(ability);
			}
		}
	}
	return matches;
}

function generateGrants(
	jobName: string,
	pathName: string,
	regex: RegExp,
): string {
	let grantText = "";

	for (const tier of tierLevels) {
		const matches = findBestMatches(regex, tier.rarity, 2);
		if (matches.length === 0) continue;

		const grantsByKind: Record<string, string[]> = {};
		for (const m of matches) {
			if (!grantsByKind[m.kind]) grantsByKind[m.kind] = [];
			grantsByKind[m.kind].push(m.name);
		}

		for (const [kind, names] of Object.entries(grantsByKind)) {
			grantText += `	{
		jobName: "${jobName}",
		pathName: "${pathName}",
		level: ${tier.level},
		kind: "${kind}",
		sourceTokens: [],
		entryNames: [
${names.map((n) => `			"${n}"`).join(",\n")}
		],
		progression: "base",
	},\n`;
		}
	}
	return grantText;
}

let newGrants = "";

// Destroyer
newGrants += generateGrants(
	"Destroyer",
	"Path of the Apex Predator",
	/hunt|track|snare|trap|pursue|beast|wild/,
);
newGrants += generateGrants(
	"Destroyer",
	"Path of the Tactician",
	/tactic|command|maneuver|lead|rally|strat/,
);
newGrants += generateGrants(
	"Destroyer",
	"Path of the Bulwark",
	/shield|guard|protect|defend|block|wall|bulwark|tank/,
);
newGrants += generateGrants(
	"Destroyer",
	"Path of the Last Stand",
	/resolve|stand|endure|survive|honor|spirit|will/,
);
newGrants += generateGrants(
	"Destroyer",
	"Path of the Aftershock",
	/earth|quake|tremor|shock|smash|ground/,
);

// Berserker
newGrants += generateGrants(
	"Berserker",
	"Path of the Escalating Resonance",
	/beast|rage|animal|totem|fury/,
);
newGrants += generateGrants(
	"Berserker",
	"Path of the Gate Beast",
	/claw|bite|transform|roar|savage/,
);
newGrants += generateGrants(
	"Berserker",
	"Path of the Rift Storm",
	/storm|thunder|lightning|wind/,
);
newGrants += generateGrants(
	"Berserker",
	"Path of the Absolute Zealot",
	/zeal|radiant|undying|holy|smite/,
);
newGrants += generateGrants(
	"Berserker",
	"Path of the Mana Scars",
	/wild|erratic|chaos|surge|random/,
);

// Assassin
newGrants += generateGrants(
	"Assassin",
	"Path of the Terminus",
	/execute|poison|kill|assassin|death/,
);
newGrants += generateGrants(
	"Assassin",
	"Path of the Shadow Herald",
	/shadow|ghost|phantom|dark|spirit/,
);
newGrants += generateGrants(
	"Assassin",
	"Path of the Vanguard Outrider",
	/mount|ride|charge|speed|vehicle/,
);

// Striker
newGrants += generateGrants(
	"Striker",
	"Path of the Kinetic Core",
	/ki |punch|palm|strike|kick|martial/,
);
newGrants += generateGrants(
	"Striker",
	"Path of the Entropic Flow",
	/drain|death|entropy|necrotic/,
);
newGrants += generateGrants(
	"Striker",
	"Path of the Blade Conductor",
	/blade|sword|weapon|slash|cut/,
);
newGrants += generateGrants(
	"Striker",
	"Path of the Harmonic Surgeon",
	/heal|surge|mend|anatomy|vital/,
);

fs.writeFileSync("martial_grants.ts", newGrants);

let content = fs.readFileSync(pathAccessFile, "utf-8");
const insertIndex = content.lastIndexOf("];");
if (insertIndex !== -1) {
	content =
		content.slice(0, insertIndex) + newGrants + content.slice(insertIndex);
	fs.writeFileSync(pathAccessFile, content);
	console.log(
		"Successfully injected all tiered Martial Domain Lists into pathAbilityAccess.ts!",
	);
} else {
	console.log("Could not find insertion point.");
}
