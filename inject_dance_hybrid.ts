import * as fs from "fs";
import * as path from "path";

const accessFile = "src/lib/pathAbilityAccess.ts";
const powerDir = "src/data/compendium";

// Load Spells
const spellDir = "src/data/compendium/spells";
const allSpells = [];
for (let i = 1; i <= 9; i++) {
	const file = path.join(spellDir, `level${i}.ts`);
	if (fs.existsSync(file)) {
		const content = fs.readFileSync(file, "utf-8");
		const matches = content.match(
			/^\s*name:\s*"([^"]+)",\n\s*description:\s*"([^"]+)"/gm,
		);
		if (matches) {
			for (const m of matches) {
				const parts = m.split("description:");
				const nMatch = parts[0].match(/"([^"]+)"/);
				const dMatch = parts[1].match(/"([^"]+)"/);
				if (nMatch && dMatch) {
					allSpells.push({
						name: nMatch[1],
						desc: (nMatch[1] + " " + dMatch[1]).toLowerCase(),
					});
				}
			}
		}
	}
}

function findBestSpells(regex: RegExp, limit: number = 10): string[] {
	const matches = [];
	const pool = [...allSpells].sort((a, b) => a.name.localeCompare(b.name));
	for (const s of pool) {
		if (matches.length >= limit) break;
		if (regex.test(s.desc)) matches.push(s.name);
	}
	if (matches.length < limit) {
		for (const s of pool) {
			if (matches.length >= limit) break;
			if (!matches.includes(s.name)) matches.push(s.name);
		}
	}
	return matches;
}

// Load Powers/Techniques
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
				kind,
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

function findBestAbilities(
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
		if (regex.test(ability.desc) || regex.test(ability.name.toLowerCase()))
			matches.push(ability);
	}
	if (matches.length < limit) {
		for (const ability of pool) {
			if (matches.length >= limit) break;
			if (!matches.includes(ability)) matches.push(ability);
		}
	}
	return matches;
}

const danceThemeSpells = /dance|move|speed|grace|charm|illusion/;
const danceThemeMartial = /dance|move|speed|grace|rhythm|strike|dodge/;

let newGrants = "";

// Build spell grants
const names = findBestSpells(danceThemeSpells, 10);
newGrants += `	{
		jobName: "Idol",
		pathName: "Path of the Dance Resonance",
		level: 1,
		kind: "spell",
		sourceTokens: [],
		entryNames: [
${names.map((n) => `			"${n}"`).join(",\n")}
		],
		progression: "base",
	},\n`;

// Build martial grants
for (const tier of tierLevels) {
	const matches = findBestAbilities(danceThemeMartial, tier.rarity, 2);
	if (matches.length === 0) continue;
	const grantsByKind: Record<string, string[]> = {};
	for (const m of matches) {
		if (!grantsByKind[m.kind]) grantsByKind[m.kind] = [];
		grantsByKind[m.kind].push(m.name);
	}
	for (const [kind, names] of Object.entries(grantsByKind)) {
		newGrants += `	{
		jobName: "Idol",
		pathName: "Path of the Dance Resonance",
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

// Replace in file
let content = fs.readFileSync(accessFile, "utf-8");

// Remove the broken empty block
content = content.replace(
	/\{\s*jobName:\s*"Idol",\s*pathName:\s*"Path of the Dance Resonance",\s*level:\s*1,\s*kind:\s*"spell",\s*sourceTokens:\s*\[\],\s*entryNames:\s*\[\s*\],\s*progression:\s*"base",\s*\},\s*/g,
	"",
);

const insertIndex = content.lastIndexOf("];");
if (insertIndex !== -1) {
	content =
		content.slice(0, insertIndex) + newGrants + content.slice(insertIndex);
	fs.writeFileSync(accessFile, content);
	console.log("Successfully injected Hybrid Domains for Dance Resonance!");
}
