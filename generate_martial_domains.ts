import * as fs from "fs";
import * as path from "path";

const powerDir = "src/data/compendium";
const powerFile = path.join(powerDir, "powers-core.ts");
const techFile = path.join(powerDir, "techniques-core.ts");

interface Ability {
	name: string;
	level: number;
	desc: string;
	kind: string;
}

const allAbilities: Ability[] = [];

function parseFile(filepath: string, kind: string) {
	if (!fs.existsSync(filepath)) return;
	const content = fs.readFileSync(filepath, "utf-8");
	const objects = content.split("display_name:");
	for (let i = 1; i < objects.length; i++) {
		const obj = objects[i];
		const nameMatch = obj.match(/^\s*"([^"]+)"/);
		const levelMatch = obj.match(/level:\s*(\d+)/);

		if (nameMatch && levelMatch) {
			allAbilities.push({
				name: nameMatch[1],
				level: parseInt(levelMatch[1]),
				desc: obj.toLowerCase(),
				kind: kind,
			});
		}
	}
}

parseFile(powerFile, "power");
parseFile(techFile, "technique");

function findBestMatches(regex: RegExp, limitPerLevel: number = 2) {
	const matches: Record<number, string[]> = {
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
	};
	const sortedAbilities = allAbilities.sort((a, b) =>
		a.name.localeCompare(b.name),
	);

	for (const ability of sortedAbilities) {
		if (
			ability.level >= 1 &&
			ability.level <= 5 &&
			matches[ability.level].length < limitPerLevel
		) {
			if (regex.test(ability.desc) || regex.test(ability.name.toLowerCase())) {
				matches[ability.level].push(`${ability.name} (${ability.kind})`);
			}
		}
	}
	return matches;
}

function formatList(name: string, matches: Record<number, string[]>) {
	console.log(`\n### ${name}`);
	for (let i = 1; i <= 5; i++) {
		console.log(`- **Level ${i}:** ${matches[i].join(", ") || "None"}`);
	}
}

formatList(
	"Destroyer: Apex Predator (Hunter/Tracker)",
	findBestMatches(/hunt|track|snare|trap|pursue|beast|wild/),
);
formatList(
	"Destroyer: Tactician (Battle Master)",
	findBestMatches(/tactic|command|maneuver|lead|rally|strat/),
);
formatList(
	"Destroyer: Bulwark (Cavalier/Tank)",
	findBestMatches(/shield|guard|protect|defend|block|wall|bulwark|tank/),
);
formatList(
	"Destroyer: Last Stand (Samurai)",
	findBestMatches(/resolve|stand|endure|survive|honor|spirit|will/),
);
formatList(
	"Destroyer: Aftershock (Rune/Earth)",
	findBestMatches(/earth|quake|tremor|shock|smash|ground/),
);

formatList(
	"Berserker: Escalating Resonance (Totem)",
	findBestMatches(/beast|rage|animal|totem|fury/),
);
formatList(
	"Berserker: Gate Beast (Beast)",
	findBestMatches(/claw|bite|transform|roar|savage/),
);
formatList(
	"Berserker: Rift Storm (Storm Herald)",
	findBestMatches(/storm|thunder|lightning|wind/),
);
formatList(
	"Berserker: Absolute Zealot (Zealot)",
	findBestMatches(/zeal|radiant|undying|holy|smite/),
);

formatList(
	"Assassin: Terminus (Executioner)",
	findBestMatches(/execute|poison|kill|assassin|death/),
);
formatList(
	"Assassin: Shadow Herald (Phantom)",
	findBestMatches(/shadow|ghost|phantom|dark|spirit/),
);
formatList(
	"Assassin: Vanguard Outrider",
	findBestMatches(/mount|ride|charge|speed|vehicle/),
);

formatList(
	"Striker: Kinetic Core (Open Hand)",
	findBestMatches(/ki |punch|palm|strike|kick|martial/),
);
formatList(
	"Striker: Entropic Flow (Long Death)",
	findDeathMatches(/drain|death|entropy|necrotic/),
);
formatList(
	"Striker: Blade Conductor (Kensei)",
	findBestMatches(/blade|sword|weapon|slash|cut/),
);
formatList(
	"Striker: Harmonic Surgeon (Mercy)",
	findBestMatches(/heal|surge|mend|anatomy|vital/),
);

// Helper for Entropic flow
function findDeathMatches(regex: RegExp, limitPerLevel: number = 2) {
	return findBestMatches(regex, limitPerLevel);
}
