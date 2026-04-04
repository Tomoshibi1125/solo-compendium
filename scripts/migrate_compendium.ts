import { lstatSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "src/data/compendium");

const RENAMES: Record<string, string> = {
	technique_type: "type",
	activation_type: "activation_type_migrated", // handle specially
	activation_cost: "activation_cost_migrated", // handle specially
	range_desc: "range_migrated", // handle specially
	abilityScores: "ability_scores",
	armorClass: "armor_class_migrated", // monster specific
	hitPoints: "hit_points_migrated", // monster specific
	challengeRating: "challenge_rating",
	proficiencyBonus: "proficiency_bonus",
	attackBonus: "attack_bonus",
	damageType: "damage_type",
	skillProficiencies: "skill_proficiencies",
	toolProficiencies: "tool_proficiencies",
	legendary: "legendary_actions",
	savingThrows: "saving_throws",
	damageResistances: "damage_resistances",
	damageImmunities: "damage_immunities",
	damageVulnerabilities: "damage_vulnerabilities",
	conditionImmunities: "condition_immunities",
};

const migrateFile = (filePath: string) => {
	let content = readFileSync(filePath, "utf-8");
	let changed = false;

	// 1. Simple renames
	for (const [oldName, newName] of Object.entries(RENAMES)) {
		const regex = new RegExp(`\\b${oldName}\\b:`, "g");
		if (regex.test(content)) {
			content = content.replace(regex, `${newName}:`);
			changed = true;
		}
	}

	// 2. Special handler for activation_type -> activation object
	if (content.includes("activation_type_migrated:")) {
		content = content.replace(
			/activation_type_migrated:\s*"(.*?)"/g,
			'activation: { type: "$1" }',
		);
		changed = true;
	}

	// 3. Special handler for range_migrated -> range object
	if (content.includes("range_migrated:")) {
		content = content.replace(
			/range_migrated:\s*"(.*?)"/g,
			'range: { type: "$1" }',
		);
		changed = true;
	}

	// 4. Monster AC/HP cleanup (remove redundant nested armor_class_migrated if top-level ac exists)
	// Our monsters have top-level ac/hp already. Let's just remove the nested ones inside stats.
	if (
		content.includes("armor_class_migrated:") ||
		content.includes("hit_points_migrated:")
	) {
		content = content.replace(/\s*armor_class_migrated:\s*\d+,?/g, "");
		content = content.replace(/\s*hit_points_migrated:\s*\d+,?/g, "");
		changed = true;
	}

	// 5. Skills benefits: string[] -> object
	content = content.replace(/benefits:\s*\[([\s\S]*?)\]/g, (match, items) => {
		if (!match.includes("basic:")) {
			changed = true;
			return `benefits: {\n\t\t\tbasic: [${items}],\n\t\t\texpert: [],\n\t\t\tmaster: []\n\t\t}`;
		}
		return match;
	});

	// 6. Generic string activation -> object
	content = content.replace(
		/activation:\s*"(.*?)"/g,
		'activation: { type: "$1" }',
	);

	if (changed) {
		console.log(`Migrated: ${filePath}`);
		writeFileSync(filePath, content);
	}
};

const walk = (dir: string) => {
	const list = readdirSync(dir);
	list.forEach((file) => {
		const fullPath = join(dir, file);
		if (lstatSync(fullPath).isDirectory()) {
			walk(fullPath);
		} else if (file.endsWith(".ts")) {
			migrateFile(fullPath);
		}
	});
};

walk(DATA_DIR);
console.log("Migration complete.");
