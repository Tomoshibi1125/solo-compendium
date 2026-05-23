import * as fs from "fs";
import * as path from "path";

const powerDir = "src/data/compendium";
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

	// Fallback if not enough thematic matches in exact rarity
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

function generateGrantsMarkdown(
	jobName: string,
	pathName: string,
	regex: RegExp,
): string {
	let md = `### ${jobName}: ${pathName}\n`;

	for (const tier of tierLevels) {
		const matches = findBestMatches(regex, tier.rarity, 2);
		const names = matches.map((m) => m.name).join(", ") || "None";
		md += `- **Level ${tier.level} (${tier.rarity}):** ${names}\n`;
	}
	return md + "\n";
}

let mdOutput = "## Tier-Based Martial Domain Lists\n\n";

mdOutput += generateGrantsMarkdown(
	"Destroyer",
	"Apex Predator",
	/hunt|track|snare|trap|pursue|beast|wild/,
);
mdOutput += generateGrantsMarkdown(
	"Destroyer",
	"Bulwark",
	/shield|guard|protect|defend|block|wall|bulwark|tank/,
);
mdOutput += generateGrantsMarkdown(
	"Berserker",
	"Gate Beast",
	/claw|bite|transform|roar|savage/,
);
mdOutput += generateGrantsMarkdown(
	"Berserker",
	"Rift Storm",
	/storm|thunder|lightning|wind/,
);
mdOutput += generateGrantsMarkdown(
	"Assassin",
	"Terminus",
	/execute|poison|kill|assassin|death/,
);
mdOutput += generateGrantsMarkdown(
	"Striker",
	"Entropic Flow",
	/drain|death|entropy|necrotic/,
);

fs.writeFileSync("tiered_martial_domains.md", mdOutput);
console.log("Tiered markdown generated.");
