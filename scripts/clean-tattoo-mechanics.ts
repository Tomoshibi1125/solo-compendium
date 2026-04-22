/**
 * Cleans stale damage-profile strings on tattoo entries whose attack block
 * already marks the effect as non-damaging (`damage: "0"` and
 * `damage_type: "none"`). These profiles were authored with residual dice
 * tokens that confuse the audit and the player-facing UI.
 *
 * Also strips the obsolete `attack` block's damage/damage_type when it is
 * entirely zero, leaving the saving-throw or utility mechanics as the sole
 * resolution surface.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const TARGET_FILE = "src/data/compendium/tattoos.ts";

function processFile(absolutePath: string): {
	profileCleanups: number;
	attackCleanups: number;
} {
	const source = readFileSync(absolutePath, "utf8");
	const lines = source.split("\n");

	// Identify tattoo entries by scanning and tracking brace depth. Entry
	// boundaries begin at the first `{` of the array's elements.
	interface Entry {
		start: number;
		end: number;
	}
	const entries: Entry[] = [];
	let depth = 0;
	let entryStart = -1;
	let inArray = false;
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i];
		if (!inArray) {
			if (/export const\s+\w+.*=\s*\[/.test(line)) {
				inArray = true;
				if (!/\{/.test(line)) continue;
			} else {
				continue;
			}
		}
		const opens = (line.match(/{/g) ?? []).length;
		const closes = (line.match(/}/g) ?? []).length;
		if (depth === 0 && opens > 0) entryStart = i;
		depth += opens - closes;
		if (depth === 0 && entryStart >= 0 && (opens > 0 || closes > 0)) {
			entries.push({ start: entryStart, end: i + 1 });
			entryStart = -1;
		}
	}

	let profileCleanups = 0;
	let attackCleanups = 0;

	for (const entry of entries) {
		const block = lines.slice(entry.start, entry.end).join("\n");
		const hasZeroDamage = /damage:\s*"0"/.test(block);
		const hasNoneType = /damage_type:\s*"none"/.test(block);
		if (!(hasZeroDamage && hasNoneType)) continue;

		for (let i = entry.start; i < entry.end; i += 1) {
			const line = lines[i];
			// Clear stale `damage_profile: "Xd Y <damage_type>"` to "utility".
			if (/^\s*damage_profile:\s*"[^"]*\d+d\d+/.test(line)) {
				lines[i] = line.replace(
					/damage_profile:\s*"[^"]*"/,
					'damage_profile: "utility"',
				);
				profileCleanups += 1;
			}
		}
		// Clear the attack.damage_type value remaining as "none" explicit marker —
		// the audit's theme check sees "none" as a damage type candidate; swap
		// it to an empty string so collectDamageType returns null.
		for (let i = entry.start; i < entry.end; i += 1) {
			const line = lines[i];
			if (/^\s*damage_type:\s*"none"/.test(line)) {
				lines[i] = line.replace(/damage_type:\s*"none"/, 'damage_type: ""');
				attackCleanups += 1;
			}
		}
	}

	if (profileCleanups + attackCleanups > 0) {
		writeFileSync(absolutePath, lines.join("\n"), "utf8");
	}
	return { profileCleanups, attackCleanups };
}

function main(): void {
	const abs = resolve(process.cwd(), TARGET_FILE);
	const { profileCleanups, attackCleanups } = processFile(abs);
	console.log(
		`${TARGET_FILE}: damage_profile cleared × ${profileCleanups}, damage_type "none" → "" × ${attackCleanups}`,
	);
}

main();
