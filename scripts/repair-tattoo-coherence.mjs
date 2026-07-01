// Phase 0 coherence repair for tattoos.
//
// generate-tattoos.ts assembled each tattoo from independent random pools, so a
// tattoo's placement/material *references* never matched its own `body_part` /
// `ink_type` (e.g. "Regent's Heartbeat": body_part "Neck" but "Occupies
// shoulders tattoo slot"; ink "Crimson Boss Ichor" but "Inscription requires:
// Starfall Residue"). This aligns those cross-references to the entry's own
// anchor fields and fixes name casing. It is a TEXT codemod (per-entry block
// edits) — like scripts/clean-tattoo-mechanics.ts — so the differently-shaped
// tattoo records are not reserialized/reordered.
//
// Theme-entangled surfaces (damage_profile/attack/effects and the boilerplate
// flavor pool) are intentionally left for the Phase 2 tattoo authoring pass.
//
// Usage: node scripts/repair-tattoo-coherence.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(
	__dirname,
	"..",
	"src",
	"data",
	"compendium",
	"tattoos.ts",
);

function scanEntryBounds(lines) {
	const entries = [];
	let depth = 0;
	let start = -1;
	let inArray = false;
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i];
		if (!inArray) {
			if (/export const\s+\w+.*=\s*\[/.test(line)) inArray = true;
			continue;
		}
		const opens = (line.match(/\{/g) ?? []).length;
		const closes = (line.match(/\}/g) ?? []).length;
		if (depth === 0 && opens > 0) start = i;
		depth += opens - closes;
		if (depth === 0 && start >= 0 && (opens > 0 || closes > 0)) {
			entries.push({ start, end: i + 1 });
			start = -1;
		}
	}
	return entries;
}

const src = readFileSync(FILE, "utf8");
const lines = src.split("\n");
const entries = scanEntryBounds(lines);

let slotFixes = 0;
let inkFixes = 0;
let caseFixes = 0;

for (const { start, end } of entries) {
	const blockLines = lines.slice(start, end);
	const block = blockLines.join("\n");
	// Only top-level tattoo entries carry body_part/ink_type.
	const bodyMatch = block.match(/\bbody_part:\s*"([^"]+)"/);
	const inkMatch = block.match(/\bink_type:\s*"([^"]+)"/);
	if (!bodyMatch && !inkMatch) continue;
	const bodyLower = bodyMatch ? bodyMatch[1].toLowerCase() : null;
	const ink = inkMatch ? inkMatch[1] : null;

	for (let i = start; i < end; i += 1) {
		let line = lines[i];
		const original = line;

		if (bodyLower) {
			// "Occupies <random> tattoo slot" → body_part
			line = line.replace(
				/Occupies\s+.+?\s+tattoo slot/g,
				`Occupies ${bodyLower} tattoo slot`,
			);
			// "Requires tattoo attunement slot (<random>)" → body_part
			line = line.replace(
				/Requires tattoo attunement slot \([^)]*\)/g,
				`Requires tattoo attunement slot (${bodyLower})`,
			);
		}
		if (ink) {
			// "<random material> resonates with the bearer's mana lattice ..." → ink_type
			line = line.replace(
				/"[^"]+?( resonates with the bearer's mana lattice[^"]*)"/g,
				`"${ink}$1"`,
			);
			// "Inscription requires: <random material>, ..." → ink_type
			line = line.replace(
				/Inscription requires:\s*[^,"]+,/g,
				`Inscription requires: ${ink},`,
			);
		}

		if (line !== original) {
			if (/tattoo slot|attunement slot/.test(original)) slotFixes += 1;
			if (/resonates with the bearer|Inscription requires:/.test(original))
				inkFixes += 1;
			lines[i] = line;
		}
	}
}

// Casing: capitalize a lowercase-leading entry name / display_name
// (e.g. "anomaly's Breath" → "Anomaly's Breath", a scrubText artifact).
for (let i = 0; i < lines.length; i += 1) {
	const replaced = lines[i].replace(
		/^(\s*)(name|display_name):\s*"([a-z])([^"]*)"(,?)/,
		(_full, ind, key, first, rest, comma) =>
			`${ind}${key}: "${first.toUpperCase()}${rest}"${comma}`,
	);
	if (replaced !== lines[i]) {
		lines[i] = replaced;
		caseFixes += 1;
	}
}

writeFileSync(FILE, lines.join("\n"), "utf8");
console.log(
	`tattoos.ts: slot alignments=${slotFixes}, ink alignments=${inkFixes}, casing fixes=${caseFixes}`,
);
