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

		if (nameMatch) {
			allAbilities.push({
				name: nameMatch[1],
				desc: obj.toLowerCase(),
				kind: kind,
			});
		}
	}
}

function findBestMatches(regex: RegExp, limit: number = 10): Ability[] {
	const matches: Ability[] = [];
	const sortedAbilities = allAbilities.sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	for (const ability of sortedAbilities) {
		if (matches.length >= limit) break;
		if (regex.test(ability.desc) || regex.test(ability.name.toLowerCase())) {
			matches.push(ability);
		}
	}
	return matches;
}

function generateGrants(
	jobName: string,
	pathName: string,
	regex: RegExp,
): string {
	const matches = findBestMatches(regex, 10);
	if (matches.length === 0) return "";

	const levels = [3, 5, 9, 13, 17];
	let grantText = "";

	for (let i = 0; i < 5; i++) {
		const a1 = matches[i * 2];
		const a2 = matches[i * 2 + 1];

		if (!a1 && !a2) continue;

		// Group by kind to ensure we don't mix powers and techniques in the same grant illegally if they need separate kinds.
		// Actually, kind: "power" or "technique" is required.
		// We will just do separate grants per ability to be safe, or group by kind.

		const grantsByKind: Record<string, string[]> = {};
		if (a1) {
			if (!grantsByKind[a1.kind]) grantsByKind[a1.kind] = [];
			grantsByKind[a1.kind].push(a1.name);
		}
		if (a2) {
			if (!grantsByKind[a2.kind]) grantsByKind[a2.kind] = [];
			grantsByKind[a2.kind].push(a2.name);
		}

		for (const [kind, names] of Object.entries(grantsByKind)) {
			grantText += `	{
		jobName: "${jobName}",
		pathName: "${pathName}",
		level: ${levels[i]},
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
		"Successfully injected all leveled Martial Domain Lists into pathAbilityAccess.ts!",
	);
} else {
	console.log("Could not find insertion point.");
}
