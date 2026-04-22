/**
 * Realigns `mechanics.damage_profile`, `mechanics.attack.type`, and
 * `mechanics.attack.damage_type` for castable entries whose name theme
 * implies a different damage type than what the data currently carries.
 *
 * The transform operates per-entry by scoping replacements to the source
 * block that begins at a given entry's `name:` line and ends at the next
 * sibling entry (a line consisting of `\t},` followed by `\t{` opening a
 * new object). If an entry's name doesn't match any theme, it is skipped.
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

// Theme-to-canonical-damage-type mapping. First element is the canonical
// choice for normalization when the theme token is detected in a name.
const THEME_TO_CANONICAL: Array<{ pattern: RegExp; canonical: string; alternates: string[] }> = [
	{ pattern: /\b(Chill|Ice|Frost|Arctic|Glacial|Blizzard|Cold)\b/i, canonical: "cold", alternates: ["cold"] },
	{ pattern: /\b(Fire|Flame|Blaze|Inferno|Scorch|Pyre|Molten|Burning)\b/i, canonical: "fire", alternates: ["fire"] },
	{ pattern: /\b(Lightning|Thunder|Storm|Tempest|Surge|Shock|Electric|Pulse)\b/i, canonical: "lightning", alternates: ["lightning", "thunder"] },
	{ pattern: /\b(Shadow|Void|Night|Dark|Umbral|Eclipse|Abyssal)\b/i, canonical: "necrotic", alternates: ["necrotic", "psychic", "cold"] },
	{ pattern: /\b(Radiant|Sun|Solar|Corona|Holy|Divine|Dawn|Judgment|Light)\b/i, canonical: "radiant", alternates: ["radiant", "fire"] },
	{ pattern: /\b(Blood|Crimson|Sanguine|Carnage|Gore)\b/i, canonical: "necrotic", alternates: ["necrotic", "slashing", "force"] },
	{ pattern: /\b(Poison|Toxin|Venom|Plague|Blight)\b/i, canonical: "poison", alternates: ["poison"] },
	{ pattern: /\b(Psychic|Mind|Psion|Mental|Nightmare)\b/i, canonical: "psychic", alternates: ["psychic"] },
	{ pattern: /\b(Acid|Corrosive)\b/i, canonical: "acid", alternates: ["acid"] },
	{ pattern: /\b(Entropy|Decay|Rot|Wither|Siphon|Drain|Necrotic|Annihilation|Erasure|Termination)\b/i, canonical: "necrotic", alternates: ["necrotic"] },
	// Deliberately lower priority: "Force/Arcane/Mana" theme falls through to
	// force only when no other theme wins.
	{ pattern: /\b(Arcane|Mana|Aether)\b/i, canonical: "force", alternates: ["force"] },
];

const DAMAGE_TYPE_TOKEN_REGEX =
	/\b(fire|cold|lightning|thunder|necrotic|radiant|psychic|force|acid|poison|slashing|piercing|bludgeoning)\b/g;

function pickCanonical(name: string): string | null {
	for (const { pattern, canonical } of THEME_TO_CANONICAL) {
		if (pattern.test(name)) return canonical;
	}
	return null;
}

function altsFor(name: string): string[] {
	for (const { pattern, alternates } of THEME_TO_CANONICAL) {
		if (pattern.test(name)) return alternates;
	}
	return [];
}

// Split a file's top-level array into per-entry chunks. Each chunk begins
// with a line whose content (after indentation) is exactly `{` and ends
// before the next such line. The closing `];` marks the tail.
interface EntryChunk {
	start: number; // line index (inclusive)
	end: number; // line index (exclusive)
	name: string | null;
	lines: string[];
}

function parseEntries(source: string): {
	prelude: string[];
	entries: EntryChunk[];
	tail: string[];
} {
	const lines = source.split("\n");
	let arrayStart = -1;
	for (let i = 0; i < lines.length; i += 1) {
		const l = lines[i];
		if (/^export const \w+.*=\s*\[\s*$/.test(l.trim())) {
			arrayStart = i + 1;
			break;
		}
	}
	if (arrayStart < 0) return { prelude: lines, entries: [], tail: [] };

	let arrayEnd = lines.length;
	for (let i = lines.length - 1; i >= 0; i -= 1) {
		const trimmed = lines[i].trim();
		if (trimmed === "];" || trimmed === "]") {
			arrayEnd = i;
			break;
		}
	}

	const prelude = lines.slice(0, arrayStart);
	const tail = lines.slice(arrayEnd);
	const body = lines.slice(arrayStart, arrayEnd);

	// Entries start at a line whose trimmed content is exactly `{`.
	const entries: EntryChunk[] = [];
	let currentStart = -1;
	for (let i = 0; i < body.length; i += 1) {
		if (body[i].trim() === "{") {
			if (currentStart >= 0) {
				entries.push({ start: currentStart, end: i, name: null, lines: body.slice(currentStart, i) });
			}
			currentStart = i;
		}
	}
	if (currentStart >= 0) {
		entries.push({ start: currentStart, end: body.length, name: null, lines: body.slice(currentStart, body.length) });
	}

	for (const entry of entries) {
		for (const line of entry.lines) {
			const m = line.match(/^\s*name:\s*"([^"]+)"/);
			if (m) {
				entry.name = m[1];
				break;
			}
		}
	}
	return { prelude, entries, tail };
}

function rewriteEntryLines(
	entryLines: string[],
	name: string,
	canonical: string,
	alts: string[],
): { updated: string[]; changed: boolean } {
	let changed = false;
	const updated = entryLines.map((line) => {
		// Only rewrite lines that are part of mechanics-shaped fields:
		// damage_profile, damage_type, or a mechanics.attack.type.
		if (
			!/(damage_profile|damage_type|"type"|type:)/.test(line)
		) {
			return line;
		}

		// Special-case mechanics.damage_profile strings that start with a dice
		// formula followed by a damage type word.
		if (/damage_profile:\s*"[^"]*"/.test(line)) {
			return line.replace(/damage_profile:\s*"([^"]*)"/, (_m, profile: string) => {
				const withReplacedType = profile.replace(DAMAGE_TYPE_TOKEN_REGEX, (token) => {
					if (alts.includes(token.toLowerCase())) return token;
					changed = true;
					return canonical;
				});
				return `damage_profile: "${withReplacedType}"`;
			});
		}

		// mechanics.attack.damage_type: "<type>" or nested attack.type: "<type>"
		// where the value is a damage type token.
		return line.replace(/"(fire|cold|lightning|thunder|necrotic|radiant|psychic|force|acid|poison)"/g, (match, current: string) => {
			if (alts.includes(current.toLowerCase())) return match;
			changed = true;
			return `"${canonical}"`;
		});
	});
	return { updated, changed };
}

function processFile(absolutePath: string): { changedEntries: number } {
	const source = readFileSync(absolutePath, "utf8");
	const { prelude, entries, tail } = parseEntries(source);
	if (entries.length === 0) return { changedEntries: 0 };

	let changedEntries = 0;
	for (const entry of entries) {
		if (!entry.name) continue;
		const canonical = pickCanonical(entry.name);
		if (!canonical) continue;
		const alts = altsFor(entry.name);
		const { updated, changed } = rewriteEntryLines(entry.lines, entry.name, canonical, alts);
		if (changed) {
			entry.lines = updated;
			changedEntries += 1;
		}
	}

	if (changedEntries > 0) {
		const body = entries.flatMap((entry) => entry.lines).join("\n");
		const next = prelude.join("\n") + body + "\n" + tail.join("\n");
		writeFileSync(absolutePath, next, "utf8");
	}
	return { changedEntries };
}

function main(): void {
	const cwd = process.cwd();
	let total = 0;
	for (const rel of files) {
		const abs = resolve(cwd, rel);
		const { changedEntries } = processFile(abs);
		if (changedEntries > 0) {
			console.log(`${rel}: ${changedEntries} entries realigned`);
		}
		total += changedEntries;
	}
	console.log(`\nTOTAL realigned: ${total}`);
}

main();
