/**
 * Fixes `Word'S` → `Word's` in name/display_name fields of castable data
 * files. The prior normalizer treated the post-apostrophe `s` as a new word
 * and Title-Cased it. This script lowercases that single letter inside
 * possessive-S contexts only, and leaves every other `'S` (e.g. acronyms or
 * legitimate capitals followed by apostrophe) untouched.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const files = [
	"src/data/compendium/powers.ts",
	"src/data/compendium/techniques.ts",
	"src/data/compendium/spells/rank-a.ts",
	"src/data/compendium/spells/rank-b.ts",
	"src/data/compendium/spells/rank-c.ts",
	"src/data/compendium/spells/rank-d.ts",
	"src/data/compendium/spells/rank-s.ts",
	"src/data/compendium/runes/spell-rank-a.ts",
	"src/data/compendium/runes/spell-rank-b.ts",
	"src/data/compendium/runes/spell-rank-c.ts",
	"src/data/compendium/runes/spell-rank-d.ts",
	"src/data/compendium/runes/spell-rank-s.ts",
	"src/data/compendium/runes/power-powers.ts",
	"src/data/compendium/runes/technique-techniques.ts",
];

// Match only inside `name: "..."` or `display_name: "..."` string literals to
// avoid touching unrelated prose. Possessive-S is a lower-case `s` preceded
// by an apostrophe and a Title-Cased word.
const NAME_LINE = /^(\s*(?:name|display_name):\s*")([^"\n]+)("\s*,?\s*)$/gm;

function fixApostropheS(value: string): string {
	// Replace `<Word>'S <WordOrEnd>` with `<Word>'s <rest>`. Preserve `'S`
	// only if the next character is a non-letter and the following word is
	// also ALL-CAPS (acronyms), which we don't expect here.
	return value.replace(/([A-Za-z]+)'S\b/g, (_m, pre: string) => `${pre}'s`);
}

function processFile(absolutePath: string): number {
	const original = readFileSync(absolutePath, "utf8");
	let updated = 0;
	const next = original.replace(
		NAME_LINE,
		(full, prefix: string, value: string, suffix: string) => {
			const fixed = fixApostropheS(value);
			if (fixed !== value) updated += 1;
			return `${prefix}${fixed}${suffix}`;
		},
	);
	if (next !== original) writeFileSync(absolutePath, next, "utf8");
	return updated;
}

function main(): void {
	const cwd = process.cwd();
	let total = 0;
	for (const rel of files) {
		const abs = resolve(cwd, rel);
		const updated = processFile(abs);
		if (updated > 0) console.log(`${rel}: ${updated} apostrophe-S fixes`);
		total += updated;
	}
	console.log(`\nTOTAL: ${total}`);
}

main();
