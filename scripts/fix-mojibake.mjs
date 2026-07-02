/**
 * One-shot mojibake repair: fixes UTF-8 text that was double-encoded through
 * cp1252 (— became â€”, ° became Â°, etc.), corrupting user-visible compendium
 * prose and CSS content glyphs.
 *
 * The map below is the complete enumeration of sequences actually present in
 * src (rg -o 'â€.|Ã.|Â.' | sort | uniq -c). Span-wise replacement only — a
 * whole-file latin1↔UTF-8 inverse transform would corrupt the clean, correctly
 * encoded punctuation that coexists in the same files.
 *
 * Guarded against regression by src/lib/__tests__/encodingHygiene.test.ts.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../src", import.meta.url).pathname.replace(
	/^\/(\w:)/,
	"$1",
);

// Longer sequences first so â€” wins over any 2-char prefix.
const MAP = [
	["â€”", "—"],
	["â€™", "'"],
	["â€¦", "…"],
	["Ã—", "×"],
	["Ã·", "÷"],
	["Â°", "°"],
	["Â·", "·"],
];

const EXTENSIONS = /\.(ts|tsx|css|json|md)$/;

function walk(dir, files = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, files);
		else if (EXTENSIONS.test(entry)) files.push(full);
	}
	return files;
}

let totalReplacements = 0;
let filesChanged = 0;

for (const file of walk(ROOT)) {
	const original = readFileSync(file, "utf8");
	let content = original;
	let count = 0;
	for (const [bad, good] of MAP) {
		const before = content.length;
		content = content.split(bad).join(good);
		count += (before - content.length) / (bad.length - good.length);
	}
	if (content !== original) {
		writeFileSync(file, content, "utf8");
		filesChanged++;
		totalReplacements += count;
		console.log(`${count}\t${file}`);
	}
}

console.log(
	`\nFixed ${totalReplacements} sequences across ${filesChanged} files.`,
);
