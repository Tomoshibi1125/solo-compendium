import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "src/data/compendium");
const OUTPUT_DIR = path.join(DATA_DIR, "runes");

const RUNE_DEFAULTS = {
	source_kind: "Consumable",
	source_name: "Rift Rune",
	rarity: "uncommon",
	rune_level: 1,
	rune_type: "utility",
	rune_category: "General",
	tags: ["rune", "consumable"],
	passive_bonuses: null,
	can_inscribe_on: null,
	inscription_difficulty: null,
	requires_level: 1,
	requires_job: null,
};

function generateRune(
	item: Record<string, unknown>,
	type: string,
	subCategory = "",
): Record<string, unknown> {
	const id = `rune-${item.id}`;
	const name = `Rune of ${item.name}`;
	const rankText = item.rank ? ` (Rank ${item.rank})` : "";

	// Check for level in top level or specific fields
	const level = item.level ?? item.rune_level ?? 1;
	const levelText = ` Level ${level}`;

	let effectDesc = item.effect || item.description || "";
	if (item.effects && typeof item.effects === "object") {
		const effObj = item.effects as Record<string, unknown>;
		effectDesc =
			(effObj.primary as string) ||
			(Array.isArray(item.effects) ? (item.effects[0] as string) : (effectDesc as string));
	}

	return {
		...RUNE_DEFAULTS,
		id,
		name,
		description: `A resonant lattice-stone containing the compressed knowledge of the ${item.name}${rankText}${levelText} ${type.toLowerCase()}. When absorbed, it permanently teaches the character this ability.`,
		effect_description: effectDesc,
		rune_level: level,
		rune_type: item.type || "utility",
		rune_category: subCategory || type,
		rarity: item.rarity || "uncommon",
		source: item.source || "Rift Ascendant Core",
		source_book: item.source_book || "Manual of Ascension",
		created_at: item.created_at || new Date().toISOString(),
		updated_at: new Date().toISOString(),
		tags: ["rune", "consumable", type.toLowerCase(), ...(Array.isArray(item.tags) ? item.tags : [])],
		image: `/generated/compendium/runes/${item.id}.webp`,
	};
}

// Map files to their categories and variable names
// RESTRICTED TO: Spells, Powers, Techniques
const MAPPINGS = [
	{
		src: "spells/rank-d.ts",
		out: "spell-rank-d.ts",
		var: "spells_d",
		runeVar: "spell_rank_d_runes",
		type: "Spell",
		sub: "Spell",
	},
	{
		src: "spells/rank-c.ts",
		out: "spell-rank-c.ts",
		var: "spells_c",
		runeVar: "runes_c",
		type: "Spell",
		sub: "Spell",
	},
	{
		src: "spells/rank-b.ts",
		out: "spell-rank-b.ts",
		var: "spells_b",
		runeVar: "runes_b",
		type: "Spell",
		sub: "Spell",
	},
	{
		src: "spells/rank-a.ts",
		out: "spell-rank-a.ts",
		var: "spells_a",
		runeVar: "runes_a",
		type: "Spell",
		sub: "Spell",
	},
	{
		src: "spells/rank-s.ts",
		out: "spell-rank-s.ts",
		var: "spells_s",
		runeVar: "runes_s",
		type: "Spell",
		sub: "Spell",
	},
	{
		src: "techniques.ts",
		out: "technique-techniques.ts",
		var: "techniques",
		runeVar: "technique_runes",
		type: "Technique",
		sub: "Technique",
	},
	{
		src: "powers.ts",
		out: "power-powers.ts",
		var: "powers",
		runeVar: "runes_power_powers",
		type: "Power",
		sub: "Power",
	},
];

async function run() {
	console.log("--- Mass Rune Generation Pipeline (Abilities Only) ---");

	for (const map of MAPPINGS) {
		try {
			const srcPath = path.join(DATA_DIR, map.src);
			const outPath = path.join(OUTPUT_DIR, map.out);

			console.log(`Processing ${map.src}...`);

			const absoluteSrc = `file://${srcPath}`;
			const module = await import(absoluteSrc);
			const sourceItems = module[map.var];

			if (!sourceItems || !Array.isArray(sourceItems)) {
				console.error(`  Error: No array found for ${map.var} in ${map.src}`);
				continue;
			}

			const runes = sourceItems.map((item) =>
				generateRune(item, map.type, map.sub),
			);

			const content = `import type { CompendiumRune } from "../../../types/compendium";\n\nexport const ${map.runeVar}: CompendiumRune[] = ${JSON.stringify(runes, null, "\t")};\n`;

			fs.writeFileSync(outPath, content, "utf8");
			console.log(
				`  Successfully generated ${runes.length} runes -> ${map.out}`,
			);
		} catch (error) {
			console.error(`  Failed to process ${map.src}:`, error);
		}
	}

	console.log("--- Pipeline Complete ---");
}

run();
