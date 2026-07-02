#!/usr/bin/env node
/**
 * RA canon terminology sweep for compendium DATA prose (one-off).
 *
 * Modeled on vernacular-compliance.mjs (word-boundary lookarounds,
 * identifier/ID/tag protection, dry-run default).
 *
 *   Korea geography → RA gazetteer:
 *     Seoul → Meridian City, Busan → Harrow Bay, Jeju → Vantage Isle,
 *     Korea(n) → (the) Accord; language "Korean" → "Accordan"
 *   dungeon → Rift ("dungeon break" → "Rift Break"; feat "Dungeon Crawler"
 *     display name → "Rift Crawler"; id `dungeon-crawler` preserved)
 *   Gate/gate → Rift in prose ("Gate breach" → "Rift breach", "gate foci" →
 *     "Rift foci", "Gate Credits" → "Rift Credits", …)
 *   Association → Bureau (the org; "Association Bureaucrat" → "Bureau Registrar")
 *   SS/National rank prose → S-Rank
 *
 * PROTECTED (never altered):
 *   - kebab/snake identifiers & ids (word-boundary lookarounds):
 *     dungeon-crawler, gate_break_alerts, currency: "gate", …
 *   - path/ability/trial proper nouns that are name-keyed across
 *     pathAbilityAccess/nineRegents wiring (renaming would orphan
 *     persisted references): "Path of the Gate Beast", "Gate Runner",
 *     "Gate Reader", "Eight Gates Release", "Nerve Gate Cascade",
 *     "Trial of the <X> Gate" quest names, "Gate Rank" stat labels
 *     handled separately in UI.
 *
 * Run:  node scripts/ra-canon-sweep.mjs           (dry run + flagged renames)
 *       node scripts/ra-canon-sweep.mjs --apply   (write)
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const APPLY = process.argv.includes("--apply");
const ROOTS = ["src/data/compendium"];
const EXTS = new Set([".ts"]);

// Lines that carry identifiers / persisted values rather than prose.
const ID_LINE_SKIP =
	/\bid\s*:|\bsource_id\s*:|\btags\s*:|theme_tags|entry_kind|\bcurrency\s*:|\bslug\b|storageKey|uniqueness_seed|^\s*import\b/;

// Name-keyed proper nouns (paths/abilities/trials) — renaming breaks
// cross-file wiring and persisted character references.
const PROTECTED_PHRASES = [
	"Gate Beast",
	"Gate Runner",
	"Gate Reader",
	"Eight Gates",
	"Nerve Gate",
	"Shadow Gate",
	"Dragon Gate",
	"Frost Gate",
	"Beast Gate",
	"Titan Gate",
	"Plague Gate",
	"Architect Gate",
	"Radiant Gate",
	"Mimic Gate",
];
const PROTECTED_RE = new RegExp(`\\b(?:${PROTECTED_PHRASES.join("|")})\\b`);

// Ordered phrase replacements — most specific first, applied before tokens.
const PHRASES = [
	// Gazetteer events / districts
	[/Seoul Gate Breach/g, "Meridian City Rift Break"],
	[/Seoul Forge District/g, "Meridian Forge District"],
	[/Seoul Mega-Gate/g, "Meridian Mega-Rift"],
	[/Neo-Seoul/g, "Meridian City"],
	[/downtown Seoul/g, "downtown Meridian City"],
	[/Busan Incident/g, "Harrow Bay Incident"],
	[/Jeju Island Raid/g, "Vantage Isle Raid"],
	[/Jeju Outbreak/g, "Vantage Isle Outbreak"],
	[/Korean soil/g, "Accord soil"],
	// Dungeon phrases
	[/[Dd]ungeon[ -][Bb]reak/g, "Rift Break"],
	[/[Gg]ate[ -][Bb]reak\b/g, "Rift Break"],
	[/Dungeon Crawler/g, "Rift Crawler"],
	[/dungeon chambers/g, "Interior chambers"],
	// Gate phrases
	[/Gate Credits?/g, (m) => m.replace("Gate", "Rift")],
	[/[Gg]ate breach/g, "Rift breach"],
	[/[Gg]ate foci/g, "Rift foci"],
	[/[Gg]ate focus/g, "Rift focus"],
	[/Mega-Gate/g, "Mega-Rift"],
	// Hyphenated Gate compounds — capital "Gate-" is prose/display, never an
	// identifier (ids are all-lowercase kebab, which the token lookarounds
	// protect). "Gate-Line Stance" → "Rift-Line Stance", "Gate-born" → "Rift-born".
	[/(?<![\w-])Gate-(?=[A-Za-z])/g, "Rift-"],
	// Org
	[/Association Bureaucrat/g, "Bureau Registrar"],
	// Rank prose
	[/\bSS-[Rr]ank(ed)?/g, "S-Rank$1"],
	[/\bNational-[Rr]ank(ed)?/g, "S-Rank$1"],
];

// Token replacements with identifier-safe lookarounds.
const TOKENS = [
	[/(?<![\w-])Seoul(?![\w-])/g, "Meridian City"],
	[/(?<![\w-])Busan(?![\w-])/g, "Harrow Bay"],
	[/(?<![\w-])Jeju(?![\w-])/g, "Vantage Isle"],
	[/(?<![\w-])Korean(?![\w-])/g, "Accord"],
	[/(?<![\w-])Korea(?![\w-])/g, "the Accord"],
	[/(?<![\w-])Association(?![\w-])/g, "Bureau"],
	[/(?<![\w-])Dungeons(?![\w-])/g, "Rifts"],
	[/(?<![\w-])Dungeon(?![\w-])/g, "Rift"],
	[/(?<![\w-])dungeons(?![\w-])/g, "Rifts"],
	[/(?<![\w-])dungeon(?![\w-])/g, "Rift"],
	[/(?<![\w-])Gates(?![\w-])/g, "Rifts"],
	[/(?<![\w-])Gate(?![\w-])/g, "Rift"],
	[/(?<![\w-])gates(?![\w-])/g, "Rifts"],
	[/(?<![\w-])gate(?![\w-])/g, "Rift"],
];

function walk(dir, out) {
	let entries;
	try {
		entries = readdirSync(dir);
	} catch {
		return out;
	}
	for (const entry of entries) {
		const p = join(dir, entry);
		const st = statSync(p);
		if (st.isDirectory()) walk(p, out);
		else if (EXTS.has(extname(p))) out.push(p.split("\\").join("/"));
	}
	return out;
}

const files = ROOTS.flatMap((r) => walk(r, []));
const stats = new Map();
const flagged = [];
const changedFiles = [];

const bump = (key) => stats.set(key, (stats.get(key) ?? 0) + 1);

function transformLine(line, file, lineNo) {
	if (ID_LINE_SKIP.test(line)) return line;

	let s = line;

	// Language lists: "Korean" the language → "Accordan" (not the nation).
	if (/languages\s*:/.test(s)) {
		s = s.replace(/Korean/g, () => {
			bump("language Korean → Accordan");
			return "Accordan";
		});
		return s;
	}

	for (const [re, replacement] of PHRASES) {
		const matches = s.match(re);
		if (matches) {
			for (let i = 0; i < matches.length; i++) bump(re.source);
			s = s.replace(re, replacement);
		}
	}

	// Token pass — segment-wise so protected proper nouns survive intact.
	if (PROTECTED_RE.test(s)) {
		// Split on protected phrases, transform only the unprotected segments.
		const parts = s.split(new RegExp(`(${PROTECTED_PHRASES.join("|")})`, "g"));
		s = parts
			.map((part, i) => (i % 2 === 1 ? part : applyTokens(part)))
			.join("");
	} else {
		s = applyTokens(s);
	}

	if (s !== line && /\b(display_)?name\s*:|\btitle\s*:/.test(line)) {
		flagged.push(`${file}:${lineNo}\n    - ${line.trim()}\n    + ${s.trim()}`);
	}
	return s;
}

function applyTokens(segment) {
	let s = segment;
	for (const [re, replacement] of TOKENS) {
		s = s.replace(re, () => {
			bump(re.source);
			return replacement;
		});
	}
	return s;
}

for (const file of files) {
	const original = readFileSync(file, "utf8");
	const next = original
		.split("\n")
		.map((l, i) => transformLine(l, file, i + 1))
		.join("\n");
	if (next !== original) {
		changedFiles.push(file);
		if (APPLY) writeFileSync(file, next, "utf8");
	}
}

console.log(`\n=== RA canon sweep ${APPLY ? "APPLIED" : "DRY RUN"} ===`);
console.log(`Files scanned: ${files.length} | changed: ${changedFiles.length}`);
for (const [key, count] of [...stats.entries()].sort((a, b) => b[1] - a[1])) {
	console.log(`  ${String(count).padStart(5)}  ${key}`);
}
console.log(`\nChanged files (${changedFiles.length}):`);
for (const f of changedFiles) console.log(`  ${f}`);
console.log(
	`\nFlagged name/title renames — eyeball before --apply (${flagged.length}):`,
);
for (const f of flagged) console.log(`  ${f}`);
