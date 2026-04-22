/**
 * Clears the top-level `damage_roll` field on castable entries that the
 * reshape-utility-castables pass retargeted as non-damage abilities. The
 * reshape pass cleared attack.damage and mechanics.damage_profile but left
 * the sibling `damage_roll` shortcut intact; the audit's hasDamageRoll check
 * inspects both, so we clear the shortcut here.
 *
 * The script operates per-id to stay scope-limited.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ENTRIES: Array<{ file: string; id: string }> = [
	{ file: "src/data/compendium/powers.ts", id: "shadow-step" },
	{ file: "src/data/compendium/powers.ts", id: "regeneration" },
	{ file: "src/data/compendium/powers.ts", id: "true-sight" },
	{ file: "src/data/compendium/powers.ts", id: "arcane-charm" },
	{ file: "src/data/compendium/powers.ts", id: "bulwark-resilience" },
	{ file: "src/data/compendium/powers.ts", id: "arcane-recovery" },
	{ file: "src/data/compendium/powers.ts", id: "lycanthropy" },
	{ file: "src/data/compendium/powers.ts", id: "gaze-of-petrification" },
	{ file: "src/data/compendium/powers.ts", id: "telepathy" },
	{ file: "src/data/compendium/powers.ts", id: "invisibility" },
];

function findEntryRange(lines: string[], id: string): { start: number; end: number } | null {
	for (let i = 0; i < lines.length; i += 1) {
		const idMatch = lines[i].match(/^\s*id:\s*"([^"]+)"/);
		if (!idMatch || idMatch[1] !== id) continue;
		// Walk backward to `{` (entry open).
		let entryStart = i;
		while (entryStart > 0 && lines[entryStart].trim() !== "{") entryStart -= 1;
		// Walk forward tracking braces to find closing `},`.
		let depth = 0;
		let entryEnd = entryStart;
		for (let j = entryStart; j < lines.length; j += 1) {
			const line = lines[j];
			depth += (line.match(/{/g) ?? []).length;
			depth -= (line.match(/}/g) ?? []).length;
			if (depth === 0) {
				entryEnd = j;
				break;
			}
		}
		return { start: entryStart, end: entryEnd + 1 };
	}
	return null;
}

function clearDamageRoll(file: string): number {
	const abs = resolve(process.cwd(), file);
	const source = readFileSync(abs, "utf8");
	let lines = source.split("\n");
	let updated = 0;
	const targets = ENTRIES.filter((e) => e.file === file).map((e) => e.id);
	for (const id of targets) {
		const range = findEntryRange(lines, id);
		if (!range) continue;
		for (let i = range.start; i < range.end; i += 1) {
			if (/^\s*damage_roll:\s*"\d+d\d+/.test(lines[i])) {
				lines[i] = lines[i].replace(/damage_roll:\s*"[^"]*"/, 'damage_roll: "—"');
				updated += 1;
			}
		}
	}
	if (updated > 0) writeFileSync(abs, lines.join("\n"), "utf8");
	return updated;
}

function main(): void {
	const files = Array.from(new Set(ENTRIES.map((e) => e.file)));
	let total = 0;
	for (const file of files) {
		const n = clearDamageRoll(file);
		if (n > 0) console.log(`${file}: ${n} damage_roll cleared`);
		total += n;
	}
	console.log(`\nTOTAL cleared: ${total}`);
}

main();
