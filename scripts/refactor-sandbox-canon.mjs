// scripts/refactor-sandbox-canon.mjs
// One-shot Phase 1 refactor: ability saves + Jobs + deity-conflict NPC renames.
// Idempotent — running twice is safe (second pass will find nothing to change).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..");

const files = [
	"src/data/compendium/sandbox/sandbox-chapters-part1.ts",
	"src/data/compendium/sandbox/sandbox-chapters-part2.ts",
	"src/data/compendium/sandbox/sandbox-chapters-part3.ts",
	"src/data/compendium/sandbox/sandbox-chapters-part4.ts",
	"src/data/compendium/sandbox/sandbox-handouts.ts",
	"src/data/compendium/sandbox/sandbox-scenes.ts",
	"src/data/compendium/sandbox-npcs.ts",
].map((p) => resolve(REPO, p));

// -------------------------------------------------------------------------
// ORDERED REPLACEMENTS — longest / most specific first.
// -------------------------------------------------------------------------
const replacements = [
	// --- Deity-conflict NPC RENAMES (compound/prefixed forms first) ---
	[/Dr\. Elara Voss/g, "Dr. Serin Hayashi"],
	[/Elara Voss/g, "Serin Hayashi"],
	[/Dr\. Voss/g, "Dr. Hayashi"],
	[/High Priestess Nyx/g, "The Hollow Mother"],
	[/Priestess Nyx/g, "The Hollow Mother"], // just in case
	[/Lyra \(The Dream Walker\)/g, "Echo-Nine (The Dream Walker)"],
	[/Lyra, the Dream Walker/gi, "Echo-Nine, the Dream Walker"],
	[/"The Architect"/g, '"The Millwright"'],
	[/The Architect/g, "The Millwright"],
	[/"The Archivist"/g, '"The Catalog"'],
	[/The Archivist/g, "The Catalog"],

	// --- Bare references (after compound forms have been consumed) ---
	[/\bArchivist\b/g, "Catalog"],
	[/\bLyra\b/g, "Echo-Nine"],
	[/\bNyx\b/g, "The Hollow Mother"],
	[/\bElara\b/g, "Serin"],
	[/\bVoss\b/g, "Hayashi"],

	// --- ABILITY SAVES (longer forms first) ---
	[/\bDexterity save/g, "Agility save"],
	[/\bConstitution save/g, "Vitality save"],
	[/\bWisdom save/g, "Sense save"],
	[/\bCharisma save/g, "Presence save"],
	[/\bDexterity saving throw/g, "Agility saving throw"],
	[/\bConstitution saving throw/g, "Vitality saving throw"],
	[/\bWisdom saving throw/g, "Sense saving throw"],
	[/\bCharisma saving throw/g, "Presence saving throw"],
	[/\bDex\/Con save\b/g, "Agility/Vitality save"],
	[/\bDex save\b/g, "Agility save"],
	[/\bCon save\b/g, "Vitality save"],
	[/\bWis save\b/g, "Sense save"],
	[/\bCha save\b/g, "Presence save"],
	[/\bDex check\b/g, "Agility check"],
	[/\bCon check\b/g, "Vitality check"],
	[/\bWis check\b/g, "Sense check"],
	[/\bCha check\b/g, "Presence check"],
	[/\bDex mod\b/g, "Agility mod"],
	[/\bCon mod\b/g, "Vitality mod"],
	[/\bWis mod\b/g, "Sense mod"],
	[/\bCha mod\b/g, "Presence mod"],
	[/\bDexterity\b/g, "Agility"],
	[/\bConstitution\b/g, "Vitality"],
	[/\bWisdom\b/g, "Sense"],
	[/\bCharisma\b/g, "Presence"],

	// --- Stat-block column headers ---
	[/\| DEX \|/g, "| AGI |"],
	[/\| CON \|/g, "| VIT |"],
	[/\| WIS \|/g, "| SENSE |"],
	[/\| CHA \|/g, "| PRE |"],

	// Upper-case-only save shorthand
	[/\bWIS save\b/g, "SENSE save"],
	[/\bCON save\b/g, "VIT save"],
	[/\bDEX save\b/g, "AGI save"],
	[/\bCHA save\b/g, "PRE save"],

	// --- JOB REMAPPING (canon 14-Job names only) ---
	// Quoted job field (data)
	[/job: "Vanguard"/g, 'job: "Destroyer"'],
	[/job: "Artificer"/g, 'job: "Technomancer"'],
	[/job: "Alchemist"/g, 'job: "Technomancer"'],
	// Markdown table cells
	[/\| Vanguard \|/g, "| Destroyer |"],
	[/\| Artificer \|/g, "| Technomancer |"],
	[/\| Alchemist \|/g, "| Technomancer |"],
	// Prose "Level N Vanguard" patterns
	[/Level (\d+) Vanguard\b/g, "Level $1 Destroyer"],
	[/Level (\d+) Artificer\b/g, "Level $1 Technomancer"],
	[/Level (\d+) Alchemist\b/g, "Level $1 Technomancer"],
	// Bare Job-label prose (last resort, only if "Job" context)
	[/\bVanguard Job\b/g, "Destroyer Job"],

	// --- "Sage" context-specific job remaps (per NPC) ---
	// Dr. Serin Hayashi (was Voss) - Sage → Herald
	[
		/(name: "Dr\. Serin Hayashi",[\s\S]*?job: )"Sage"/g,
		'$1"Herald"',
	],
	// Old Man Crane - Sage → Esper
	[
		/(name: "Old Man Crane",[\s\S]*?job: )"Sage"/g,
		'$1"Esper"',
	],
	// The Catalog (was Archivist) - Sage → Esper
	[
		/(name: "The Catalog",[\s\S]*?job: )"Sage"/g,
		'$1"Esper"',
	],
	// Professor Lun - Sage → Mage
	[
		/(name: "Professor Lun",[\s\S]*?job: )"Sage"/g,
		'$1"Mage"',
	],

	// Markdown role-table Sage rows (Chapter 19 NPC compendium)
	// Crane/Constance = Esper (oracles); others via context. Use per-row anchors:
	[/\| Old Man Crane \| 10 \| Sage \|/g, "| Old Man Crane | 10 | Esper |"],
	[/\| Dr\. Serin Hayashi \| 6 \| Sage \|/g, "| Dr. Serin Hayashi | 6 | Herald |"],
	[/\| Professor Lun \| 6 \| Sage \|/g, "| Professor Lun | 6 | Mage |"],
	[/\| The Catalog \| 4 \| Sage \|/g, "| The Catalog | 4 | Esper |"],
];

// -------------------------------------------------------------------------
let totalFiles = 0;
let totalReplacements = 0;

for (const filepath of files) {
	if (!existsSync(filepath)) {
		console.warn(`SKIP (missing): ${filepath}`);
		continue;
	}
	const before = readFileSync(filepath, "utf8");
	let after = before;
	let fileChanges = 0;
	for (const [pattern, replacement] of replacements) {
		const matches = after.match(pattern);
		if (matches) {
			after = after.replace(pattern, replacement);
			fileChanges += matches.length;
		}
	}
	if (after !== before) {
		writeFileSync(filepath, after);
		console.log(`✓ ${filepath}  (${fileChanges} replacements)`);
		totalFiles++;
		totalReplacements += fileChanges;
	} else {
		console.log(`· ${filepath}  (no changes)`);
	}
}

console.log(
	`\nDone. ${totalFiles} files modified, ${totalReplacements} total replacements.`,
);
