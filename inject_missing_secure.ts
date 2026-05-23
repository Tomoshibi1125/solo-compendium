import * as fs from "fs";
import * as path from "path";

const accessFile = "src/lib/pathAbilityAccess.ts";

// We need to inject SPELl domains (10 spells at level 1)
const spellDomains = [
	{
		job: "Mage",
		path: "Path of the Shield Architect",
		theme: /shield|guard|protect|defend|wall|ward|barrier/,
	},
	{
		job: "Mage",
		path: "Path of the Probability Mandate",
		theme: /fate|luck|chaos|wild|random|time/,
	},
	{
		job: "Mage",
		path: "Path of the Rift Caller",
		theme: /rift|gate|teleport|dimension|summon|void/,
	},
	{
		job: "Mage",
		path: "Path of the Matter Weaver",
		theme: /transmute|matter|earth|stone|shape|create/,
	},
	{
		job: "Revenant",
		path: "Path of the Threshold Walker",
		theme: /ghost|spirit|death|shadow|necrotic/,
	},
	{
		job: "Stalker",
		path: "Path of the Apex Hunter",
		theme: /hunt|track|snare|beast|wild/,
	},
	{
		job: "Stalker",
		path: "Path of the Pack Leader",
		theme: /pack|wolf|beast|command|summon/,
	},
	{
		job: "Stalker",
		path: "Path of the Rift Strider",
		theme: /rift|step|teleport|dimension|speed/,
	},
	{
		job: "Holy Knight",
		path: "Path of the Verdant Mandate",
		theme: /nature|plant|heal|radiant|sun|light/,
	},
	{
		job: "Technomancer",
		path: "Design: The Aether Chemist",
		theme: /acid|poison|potion|heal|fire|blast/,
	},
	{
		job: "Technomancer",
		path: "Design: Swarm Conduit",
		theme: /swarm|drone|insect|tech|summon/,
	},
	{
		job: "Technomancer",
		path: "Design: Aether Breacher",
		theme: /breach|blast|force|siege|destroy/,
	},
	{
		job: "Idol",
		path: "Path of the Lore Resonance",
		theme: /lore|knowledge|mind|psychic|history/,
	},
	{
		job: "Idol",
		path: "Path of the Hypnotic Resonance",
		theme: /charm|hypnotic|sleep|mind|control/,
	},
	{
		job: "Idol",
		path: "Path of the Shadow Resonance",
		theme: /shadow|dark|illusion|stealth|fear/,
	},
	{
		job: "Idol",
		path: "Path of the Genesis Resonance",
		theme: /create|matter|weave|light|life/,
	},
];

// We need to inject TIERED MARTIAL domains (10 powers/techniques across levels 3,5,9,13,17)
const martialDomains = [
	{
		job: "Destroyer",
		path: "Path of the Apex Predator",
		theme: /hunt|track|snare|trap|pursue|beast|wild/,
	},
	{
		job: "Destroyer",
		path: "Path of the Tactician",
		theme: /tactic|command|maneuver|lead|rally|strat/,
	},
	{
		job: "Destroyer",
		path: "Path of the Bulwark",
		theme: /shield|guard|protect|defend|block|wall|bulwark|tank/,
	},
	{
		job: "Destroyer",
		path: "Path of the Last Stand",
		theme: /resolve|stand|endure|survive|honor|spirit|will/,
	},
	{
		job: "Destroyer",
		path: "Path of the Aftershock",
		theme: /earth|quake|tremor|shock|smash|ground/,
	},
	{
		job: "Berserker",
		path: "Path of the Escalating Resonance",
		theme: /beast|rage|animal|totem|fury/,
	},
	{
		job: "Berserker",
		path: "Path of the Gate Beast",
		theme: /claw|bite|transform|roar|savage/,
	},
	{
		job: "Berserker",
		path: "Path of the Rift Storm",
		theme: /storm|thunder|lightning|wind/,
	},
	{
		job: "Berserker",
		path: "Path of the Absolute Zealot",
		theme: /zeal|radiant|undying|holy|smite/,
	},
	{
		job: "Berserker",
		path: "Path of the Mana Scars",
		theme: /wild|erratic|chaos|surge|random/,
	},
	{
		job: "Berserker",
		path: "Path of the Aetheric Anomaly",
		theme: /anomaly|wild|chaos|magic|aether/,
	},
	{
		job: "Assassin",
		path: "Path of the Terminus",
		theme: /execute|poison|kill|assassin|death/,
	},
	{
		job: "Assassin",
		path: "Path of the Shadow Herald",
		theme: /shadow|ghost|phantom|dark|spirit/,
	},
	{
		job: "Assassin",
		path: "Path of the Vanguard Outrider",
		theme: /mount|ride|charge|speed|vehicle/,
	},
	{
		job: "Assassin",
		path: "Path of the Gate Runner",
		theme: /gate|run|speed|dash|teleport/,
	},
	{
		job: "Striker",
		path: "Path of the Kinetic Core",
		theme: /ki |punch|palm|strike|kick|martial/,
	},
	{
		job: "Striker",
		path: "Path of the Entropic Flow",
		theme: /drain|death|entropy|necrotic/,
	},
	{
		job: "Striker",
		path: "Path of the Blade Conductor",
		theme: /blade|sword|weapon|slash|cut/,
	},
	{
		job: "Striker",
		path: "Path of the Harmonic Surgeon",
		theme: /heal|surge|mend|anatomy|vital/,
	},
	{
		job: "Striker",
		path: "Path of the Aetheric Channeler",
		theme: /aether|magic|energy|channel/,
	},
	{
		job: "Idol",
		path: "Path of the Blade Resonance",
		theme: /blade|sword|slash|cut|strike/,
	},
];

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

let newGrants = "";

// Build spell grants
for (const domain of spellDomains) {
	const names = findBestSpells(domain.theme, 10);
	newGrants += `	{
		jobName: "${domain.job}",
		pathName: "${domain.path}",
		level: 1,
		kind: "spell",
		sourceTokens: [],
		entryNames: [
${names.map((n) => `			"${n}"`).join(",\n")}
		],
		progression: "base",
	},\n`;
}

// Dance Idol Hybrid (Spells)
const danceThemeSpells = /dance|move|speed|grace|charm|illusion/;
const danceSpellNames = findBestSpells(danceThemeSpells, 10);
newGrants += `	{
		jobName: "Idol",
		pathName: "Path of the Dance Resonance",
		level: 1,
		kind: "spell",
		sourceTokens: [],
		entryNames: [
${danceSpellNames.map((n) => `			"${n}"`).join(",\n")}
		],
		progression: "base",
	},\n`;

// Dance Idol Hybrid (Martial)
const danceThemeMartial = /dance|move|speed|grace|rhythm|strike|dodge/;
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

// Build martial grants
for (const domain of martialDomains) {
	for (const tier of tierLevels) {
		const matches = findBestAbilities(domain.theme, tier.rarity, 2);
		if (matches.length === 0) continue;
		const grantsByKind: Record<string, string[]> = {};
		for (const m of matches) {
			if (!grantsByKind[m.kind]) grantsByKind[m.kind] = [];
			grantsByKind[m.kind].push(m.name);
		}
		for (const [kind, names] of Object.entries(grantsByKind)) {
			newGrants += `	{
		jobName: "${domain.job}",
		pathName: "${domain.path}",
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
}

let content = fs.readFileSync(accessFile, "utf-8");

// The original file has old Idol grants with random powers. We should remove them.
content = content.replace(
	/\{\s*jobName:\s*"Idol"[\s\S]*?progression:\s*"full",\s*\},\s*/g,
	"",
);

const arrayStartIndex = content.indexOf(
	"export const PATH_ABILITY_GRANTS: readonly PathAbilityGrant[] = [",
);
const insertIndex = content.indexOf("];", arrayStartIndex);

if (insertIndex !== -1) {
	content =
		content.slice(0, insertIndex) + newGrants + content.slice(insertIndex);

	// As requested, also clear out the completely broken hardcoded fallback array in getActivePathAbilityGrants
	content = content.replace(
		/if \(!options.jobName \|\| !options.pathName\) return \[\s*\{\s*jobName: "Herald"[\s\S]*?\},\];/g,
		"if (!options.jobName || !options.pathName) return [];",
	);

	fs.writeFileSync(accessFile, content);
	console.log("Successfully securely injected ALL Domains!");
}
