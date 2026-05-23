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

console.log(`Total abilities loaded: ${allAbilities.length}`);

function findBestMatches(regex: RegExp, limit: number = 10) {
	const matches: string[] = [];
	// Sort to ensure determinism
	const sortedAbilities = allAbilities.sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	for (const ability of sortedAbilities) {
		if (matches.length >= limit) break;

		if (regex.test(ability.desc) || regex.test(ability.name.toLowerCase())) {
			matches.push(ability.name);
		}
	}
	return matches;
}

function formatList(name: string, regex: RegExp) {
	const matches = findBestMatches(regex, 10);
	console.log(`\n### ${name}`);

	// Distribute across levels 3, 5, 9, 13, 17
	const levels = [3, 5, 9, 13, 17];
	for (let i = 0; i < 5; i++) {
		const a1 = matches[i * 2] || "None";
		const a2 = matches[i * 2 + 1] || "None";
		console.log(`- **Level ${levels[i]}:** ${a1}, ${a2}`);
	}
}

formatList(
	"Destroyer: Apex Predator (Hunter/Tracker)",
	/hunt|track|snare|trap|pursue|beast|wild/,
);
formatList(
	"Destroyer: Tactician (Battle Master)",
	/tactic|command|maneuver|lead|rally|strat/,
);
formatList(
	"Destroyer: Bulwark (Cavalier/Tank)",
	/shield|guard|protect|defend|block|wall|bulwark|tank/,
);
formatList(
	"Destroyer: Last Stand (Samurai)",
	/resolve|stand|endure|survive|honor|spirit|will/,
);
formatList(
	"Destroyer: Aftershock (Rune/Earth)",
	/earth|quake|tremor|shock|smash|ground/,
);

formatList(
	"Berserker: Escalating Resonance (Totem)",
	/beast|rage|animal|totem|fury/,
);
formatList("Berserker: Gate Beast (Beast)", /claw|bite|transform|roar|savage/);
formatList(
	"Berserker: Rift Storm (Storm Herald)",
	/storm|thunder|lightning|wind/,
);
formatList(
	"Berserker: Absolute Zealot (Zealot)",
	/zeal|radiant|undying|holy|smite/,
);
formatList(
	"Berserker: Mana Scars (Wild Magic)",
	/wild|erratic|chaos|surge|random/,
);

formatList(
	"Assassin: Terminus (Executioner)",
	/execute|poison|kill|assassin|death/,
);
formatList(
	"Assassin: Shadow Herald (Phantom)",
	/shadow|ghost|phantom|dark|spirit/,
);
formatList("Assassin: Vanguard Outrider", /mount|ride|charge|speed|vehicle/);

formatList(
	"Striker: Kinetic Core (Open Hand)",
	/ki |punch|palm|strike|kick|martial/,
);
formatList(
	"Striker: Entropic Flow (Long Death)",
	/drain|death|entropy|necrotic/,
);
formatList("Striker: Blade Conductor (Kensei)", /blade|sword|weapon|slash|cut/);
formatList(
	"Striker: Harmonic Surgeon (Mercy)",
	/heal|surge|mend|anatomy|vital/,
);
