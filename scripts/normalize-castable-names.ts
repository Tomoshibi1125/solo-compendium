/**
 * Normalizes multi-word castable names to Title Case.
 *
 * Touches only `name` and `display_name` string literals inside castable
 * data files. IDs are left intact so cross-references remain stable.
 *
 * Runs deterministically; safe to re-run — already-normalized entries are
 * no-ops.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const STOPWORDS = new Set([
	"of",
	"the",
	"and",
	"or",
	"a",
	"an",
	"in",
	"to",
	"for",
	"with",
	"on",
]);

// Preserve canonical fantasy/proper noun capitalization where different from
// plain Title Case.
const CANONICAL_OVERRIDES: Record<string, string> = {
	"star-fire": "Star-Fire",
	"gale-force": "Gale-Force",
	"bladeshim": "Bladeshim",
};

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

function titleCaseWord(word: string, index: number): string {
	const lower = word.toLowerCase();
	if (CANONICAL_OVERRIDES[lower]) return CANONICAL_OVERRIDES[lower];
	if (index > 0 && STOPWORDS.has(lower)) return lower;
	// Handle hyphenated / apostrophed words. Capitalize each alphabetic
	// segment EXCEPT short possessive suffixes like `'s` or `'t` that follow
	// an apostrophe — those stay lowercase.
	const pieces = word.split(/(\b)/);
	let sawApostropheSuffix = false;
	return pieces
		.map((piece) => {
			if (!piece) return piece;
			if (piece === "'" || piece === "\u2019") {
				sawApostropheSuffix = true;
				return piece;
			}
			if (!/[a-zA-Z]/.test(piece)) {
				return piece;
			}
			if (sawApostropheSuffix && piece.length <= 2) {
				sawApostropheSuffix = false;
				return piece.toLowerCase();
			}
			sawApostropheSuffix = false;
			return piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase();
		})
		.join("");
}

function titleCase(value: string): string {
	if (!value.trim()) return value;
	const parts = value.split(/(\s+)/);
	return parts
		.map((part, idx) => {
			if (/^\s+$/.test(part) || part.length === 0) return part;
			const wordIndex = parts.slice(0, idx).filter((p) => !/^\s+$/.test(p)).length;
			return titleCaseWord(part, wordIndex);
		})
		.join("");
}

const NAME_LINE = /^(\s*(?:name|display_name):\s*")([^"\n]+)("\s*,?\s*)$/gm;

function normalizeFile(absolutePath: string): { updated: number } {
	const original = readFileSync(absolutePath, "utf8");
	let updated = 0;

	const next = original.replace(
		NAME_LINE,
		(full, prefix: string, nameValue: string, suffix: string) => {
			// Preserve prefix "Rune of " but normalize after it.
			let cleaned = nameValue;
			let runePrefix = "";
			if (cleaned.startsWith("Rune of ")) {
				runePrefix = "Rune of ";
				cleaned = cleaned.slice("Rune of ".length);
			}
			const normalized = titleCase(cleaned);
			const final = runePrefix + normalized;
			if (final !== nameValue) updated += 1;
			return `${prefix}${final}${suffix}`;
		},
	);

	if (next !== original) {
		writeFileSync(absolutePath, next, "utf8");
	}
	return { updated };
}

function main(): void {
	const cwd = process.cwd();
	let total = 0;
	for (const rel of files) {
		const abs = resolve(cwd, rel);
		const { updated } = normalizeFile(abs);
		if (updated > 0) console.log(`${rel}: ${updated} name/display_name entries normalized`);
		total += updated;
	}
	console.log(`\nTOTAL normalized: ${total}`);
}

main();
