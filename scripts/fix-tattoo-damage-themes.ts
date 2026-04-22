/**
 * Realigns `mechanics.attack.type` on the six remaining tattoo entries whose
 * name theme disagrees with the stale attack-type token. Since these tattoos
 * are utility (damage: "0", damage_type: ""), the `attack.type` field is
 * better expressed as the attack mode (e.g. "self") — that matches the
 * existing `mode` value and clears the theme-mismatch audit warning.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const TARGETS: Array<{ id: string; staleType: string }> = [
	{ id: "tattoo_7", staleType: "force" },
	{ id: "tattoo_9", staleType: "cold" },
	{ id: "tattoo_20", staleType: "necrotic" },
	{ id: "tattoo_27", staleType: "force" },
	{ id: "tattoo_33", staleType: "lightning" },
	{ id: "tattoo_35", staleType: "poison" },
];

const FILE = "src/data/compendium/tattoos.ts";

function processFile(): { updated: number } {
	const abs = resolve(process.cwd(), FILE);
	const source = readFileSync(abs, "utf8");
	const lines = source.split("\n");
	let updated = 0;

	for (const { id, staleType } of TARGETS) {
		// Find the entry's id line, then scan forward until the NEXT id:
		// line (which marks the start of a sibling entry).
		for (let i = 0; i < lines.length; i += 1) {
			const match = lines[i].match(/^\s*id:\s*"([^"]+)"/);
			if (!match || match[1] !== id) continue;
			for (let j = i + 1; j < lines.length; j += 1) {
				const line = lines[j];
				if (/^\s*id:\s*"[^"]+"/.test(line)) break;
				const typeMatch = line.match(
					new RegExp(`^(\\s*type:\\s*)"${staleType}"(,?\\s*)$`),
				);
				if (typeMatch) {
					lines[j] = `${typeMatch[1]}"self"${typeMatch[2]}`;
					updated += 1;
					break;
				}
			}
			break;
		}
	}

	if (updated > 0) writeFileSync(abs, lines.join("\n"), "utf8");
	return { updated };
}

const { updated } = processFile();
console.log(`${FILE}: ${updated} attack.type realignments`);
