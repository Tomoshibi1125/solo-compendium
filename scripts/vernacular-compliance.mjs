#!/usr/bin/env node
/**
 * RA vernacular compliance pass (one-off).
 *
 * Replaces legacy genre/role terms with RA canon in DISPLAY TEXT, COMMENTS,
 * CONTENT PROSE, and LABELS — while preserving load-bearing identifiers,
 * enum/string values, kebab-case IDs, persisted JSONB keys, role values,
 * and the compliance-guard tests.
 *
 *   Hunter  -> Ascendant      (the awakened individual; RA canon)
 *   DM / GM / Dungeon Master -> Warden   (the campaign owner)
 *
 * PROTECTED (never altered) — confirmed intentional, NOT the Ascendant role:
 *   - kebab/quoted IDs & tags: anomaly-hunter, street-hunter,
 *     stalker--apex-hunter, apex-hunter, umbral-hunter, demon-hunter,
 *     hunter-academy-graduate, hunters-guild-tavern, hunter-augmentation,
 *     hunter-mod, hunter-bureau, *-hunter-s-brand / *-hunter-s-judgment, etc.
 *   - the "hunter" campaign role value (has its own DB migration)
 *   - camelCase / snake_case identifiers: isHunter, hunterLevel,
 *     hunterCount, hunter_rank (preserved by word-boundary lookarounds)
 *   - lowercase "dm"/"gm" value keys (e.g. value="gm")
 *
 * Safety: word-boundary + (?<![\w-]) / (?![\w-]) lookarounds skip every
 * identifier/kebab/ snake form; lowercase "hunter" additionally skips any
 * line that looks like an id/tag/role/mapping; the two compliance-guard
 * tests and generated DB types are excluded outright; *.bak ignored by ext.
 *
 * Run:  node scripts/vernacular-compliance.mjs           (dry run)
 *       node scripts/vernacular-compliance.mjs --apply   (write)
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const APPLY = process.argv.includes("--apply");
const ROOTS = ["src", "docs"];
const EXTS = new Set([".ts", ".tsx", ".md", ".bak", ".css"]);
const EXCLUDE_FILES = new Set([
	"src/lib/__tests__/raCanonTerminology.test.ts", // forbidden-term guard
	"src/lib/__tests__/encounterScaling.test.ts", // DM/GM/player guard
	"src/lib/__tests__/campaignInviteHardening.test.ts", // asserts 'hunter' role migration
	"src/integrations/supabase/types.ts", // dm_* are back-compat view aliases
	"scripts/vernacular-compliance.mjs",
]);

// Lowercase "hunter" replacement skips lines that carry an identifier / tag /
// ID / role value / mapping rather than prose.
const LOWER_HUNTER_SKIP =
	/\bid:|theme_tags|tags:|pathType|return\s+"|["'][\w-]*hunter[\w-]*["']/;

// "monster" replacement (narrative prose → Anomaly) skips lines that carry a
// schema value / column / property / object-key / test id rather than prose.
// PRESERVED: entry_kind:"monster", token_type enum, monster_id column,
// enc.monsters property access, `monsters:` object keys, quoted enum tokens.
const MONSTER_SKIP =
	/entry_kind|monster_id|token_type|\.monsters?\b|\bmonsters?\s*:|data-testid|["'][\w-]*monsters?[\w-]*["']/;

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
		if (st.isDirectory()) {
			if (["node_modules", "dist", ".git"].includes(entry)) continue;
			walk(p, out);
		} else if (EXTS.has(extname(p))) {
			out.push(p.split("\\").join("/"));
		}
	}
	return out;
}

function transformLine(line, stats) {
	let s = line;

	s = s.replace(/Dungeon Masters/g, () => {
		stats.dungeonMaster++;
		return "Wardens";
	});
	s = s.replace(/Dungeon Master/g, () => {
		stats.dungeonMaster++;
		return "Warden";
	});

	// Capital DM/GM/Hunter use \w-only boundaries so hyphenated PROSE
	// compounds (e.g. "Hunter-only", "DM-only") are converted. Capital
	// forms are verified never to be identifiers/IDs/values, so allowing
	// a hyphen boundary is safe. (Lowercase forms below keep [\w-] to
	// protect kebab-case IDs like "anomaly-hunter".)
	s = s.replace(/(?<!\w)DMs(?!\w)/g, () => {
		stats.dmgm++;
		return "Wardens";
	});
	s = s.replace(/(?<!\w)DM(?!\w)/g, () => {
		stats.dmgm++;
		return "Warden";
	});
	s = s.replace(/(?<!\w)GMs(?!\w)/g, () => {
		stats.dmgm++;
		return "Wardens";
	});
	s = s.replace(/(?<!\w)GM(?!\w)/g, () => {
		stats.dmgm++;
		return "Warden";
	});

	s = s.replace(/(?<!\w)Hunters(?!\w)/g, () => {
		stats.hunterCap++;
		return "Ascendants";
	});
	s = s.replace(/(?<!\w)Hunter(?!\w)/g, () => {
		stats.hunterCap++;
		return "Ascendant";
	});

	if (!LOWER_HUNTER_SKIP.test(line)) {
		s = s.replace(/(?<![\w-])hunters(?![\w-])/g, () => {
			stats.hunterLow++;
			return "ascendants";
		});
		s = s.replace(/(?<![\w-])hunter(?![\w-])/g, () => {
			stats.hunterLow++;
			return "ascendant";
		});
	}

	// monster → Anomaly (narrative prose only; schema/identifiers preserved)
	if (!MONSTER_SKIP.test(line)) {
		s = s.replace(/(?<![\w-])Monsters(?![\w-])/g, () => {
			stats.monster++;
			return "Anomalies";
		});
		s = s.replace(/(?<![\w-])Monster(?![\w-])/g, () => {
			stats.monster++;
			return "Anomaly";
		});
		s = s.replace(/(?<![\w-])monsters(?![\w-])/g, () => {
			stats.monster++;
			return "anomalies";
		});
		s = s.replace(/(?<![\w-])monster(?![\w-])/g, () => {
			stats.monster++;
			return "anomaly";
		});
	}

	// Collapse redundancy introduced when a pre-existing "Warden (DM)" /
	// "Warden (GM)" clarifier became "Warden (Warden)".
	s = s.replace(/Warden \(Warden\)/g, () => {
		stats.redundancy++;
		return "Warden";
	});
	return s;
}

const files = ROOTS.flatMap((r) => walk(r, []));
const stats = {
	dungeonMaster: 0,
	dmgm: 0,
	hunterCap: 0,
	hunterLow: 0,
	monster: 0,
	redundancy: 0,
};
const changedFiles = [];

for (const file of files) {
	if (EXCLUDE_FILES.has(file)) continue;
	const original = readFileSync(file, "utf8");
	const next = original
		.split("\n")
		.map((l) => transformLine(l, stats))
		.join("\n");
	if (next !== original) {
		changedFiles.push(file);
		if (APPLY) writeFileSync(file, next, "utf8");
	}
}

console.log(`\n=== Vernacular compliance ${APPLY ? "APPLIED" : "DRY RUN"} ===`);
console.log(`Files scanned: ${files.length} | changed: ${changedFiles.length}`);
console.log(`Dungeon Master → Warden:  ${stats.dungeonMaster}`);
console.log(`DM/GM → Warden:           ${stats.dmgm}`);
console.log(`Hunter → Ascendant (cap): ${stats.hunterCap}`);
console.log(`hunter → ascendant (low): ${stats.hunterLow}`);
console.log(`monster → Anomaly:        ${stats.monster}`);
console.log(`\nChanged files:`);
for (const f of changedFiles) console.log(`  ${f}`);
