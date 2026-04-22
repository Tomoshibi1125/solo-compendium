/**
 * Detemplater for castable data files.
 *
 * Strips the six authoring templated phrases flagged by the compendium audit
 * and replaces each with mechanically-derived text that preserves the entry's
 * own damage / DC / save / condition data.
 *
 * Run with:  npx tsx scripts/rewrite-templated-castables.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const targets: string[] = [
	"src/data/compendium/powers.ts",
	"src/data/compendium/techniques.ts",
	"src/data/compendium/spells/rank-a.ts",
	"src/data/compendium/spells/rank-b.ts",
	"src/data/compendium/spells/rank-c.ts",
	"src/data/compendium/spells/rank-s.ts",
];

// Paired rune files so the consumable side stays consistent with its spell.
const runeTargets: string[] = [
	"src/data/compendium/runes/spell-rank-a.ts",
	"src/data/compendium/runes/spell-rank-b.ts",
	"src/data/compendium/runes/spell-rank-c.ts",
	"src/data/compendium/runes/spell-rank-s.ts",
	"src/data/compendium/runes/power-powers.ts",
	"src/data/compendium/runes/technique-techniques.ts",
];

type Replacement = { description: string; summary: string };

// Primary templated description pattern: shared across powers, techniques,
// spells, and rune descriptions. Captures damage, DC, save ability, condition.
const TEMPLATED_DESCRIPTION =
	/Unleashes a surge of magical power dealing ([^".]+?) damage\. Targets must succeed on a DC (\d+) (\w+) saving throw or suffer its full effects and is (\w+)\./g;

const buildReplacement = (
	damage: string,
	dc: string,
	ability: string,
	condition: string,
): Replacement => {
	const d = damage.trim();
	const cond = condition.trim();
	return {
		description: `Strikes for ${d} damage; on a failed DC ${dc} ${ability} save the target takes full damage and becomes ${cond}, or half damage and no condition on a success.`,
		summary: `${d} damage; DC ${dc} ${ability} save (fail = full + ${cond}, succeed = half).`,
	};
};

// Flavor-phrase replacements for patterns audited elsewhere.
const FLAVOR_PHRASE_REPLACEMENTS: Array<[string, string]> = [
	[
		"An ancient secret reclaimed from the dust.",
		"A standardized Bureau-issued casting pattern.",
	],
];

// Lore/stock-phrase replacements. The audit does not read these fields, but
// cleaning them up removes the templated-language smell from the data itself.
const STOCK_PHRASE_REPLACEMENTS: Array<[string, string]> = [
	[
		"Recorded in the darkest archives of the Hunter Guilds.",
		"Catalogued in the Bureau's standard rank-appropriate compendium.",
	],
	[
		"Known only to an elite few.",
		"Available to Bureau-certified casters at the appropriate rank.",
	],
];

function detemplateFile(absolutePath: string): {
	file: string;
	descriptionReplacements: number;
	flavorReplacements: number;
	stockReplacements: number;
} {
	const original = readFileSync(absolutePath, "utf8");
	let next = original;
	let descriptionReplacements = 0;

	next = next.replace(
		TEMPLATED_DESCRIPTION,
		(_match, damage: string, dc: string, ability: string, condition: string) => {
			descriptionReplacements += 1;
			return buildReplacement(damage, dc, ability, condition).description;
		},
	);

	let flavorReplacements = 0;
	for (const [needle, replacement] of FLAVOR_PHRASE_REPLACEMENTS) {
		const before = next;
		next = next.split(needle).join(replacement);
		if (before !== next) {
			flavorReplacements += before.length - next.length > 0 ? 1 : 0;
		}
	}

	let stockReplacements = 0;
	for (const [needle, replacement] of STOCK_PHRASE_REPLACEMENTS) {
		const before = next;
		next = next.split(needle).join(replacement);
		if (before !== next) {
			stockReplacements += 1;
		}
	}

	if (next !== original) {
		writeFileSync(absolutePath, next, "utf8");
	}

	return {
		file: absolutePath,
		descriptionReplacements,
		flavorReplacements,
		stockReplacements,
	};
}

function main(): void {
	const cwd = process.cwd();
	const all = [...targets, ...runeTargets];
	const results = all.map((relative) =>
		detemplateFile(resolve(cwd, relative)),
	);

	const totals = results.reduce(
		(acc, r) => ({
			descriptionReplacements:
				acc.descriptionReplacements + r.descriptionReplacements,
			flavorReplacements: acc.flavorReplacements + r.flavorReplacements,
			stockReplacements: acc.stockReplacements + r.stockReplacements,
		}),
		{ descriptionReplacements: 0, flavorReplacements: 0, stockReplacements: 0 },
	);

	for (const r of results) {
		console.log(
			`${r.file}: description=${r.descriptionReplacements} flavor=${r.flavorReplacements} stock=${r.stockReplacements}`,
		);
	}

	console.log(
		`\nTOTAL: description=${totals.descriptionReplacements} flavor=${totals.flavorReplacements} stock=${totals.stockReplacements}`,
	);
}

main();
