/**
 * Encoding hygiene gate.
 *
 * 312 double-encoded punctuation sequences (UTF-8 bytes re-read as cp1252:
 * em dash, curly quote, ellipsis, multiplication/division sign, degree and
 * middle dot each turned into 2-3 chars of garbage led by a lowercase or
 * uppercase a-circumflex) once shipped in user-visible compendium prose and
 * CSS content glyphs across 19 files. Repaired by scripts/fix-mojibake.mjs;
 * this gate fails the suite if any such sequence is reintroduced (bad
 * paste, bad editor encoding, bad codegen).
 *
 * This file is deliberately pure ASCII: the pattern is assembled from char
 * codes so the gate can never match its own source. The repo is
 * English-only (i18n removed Jun 2026), so the hunted sequences have no
 * legitimate use anywhere in src.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = resolve(__dirname, "../..");

// U+00E2 U+20AC: lead pair of the dash/quote/ellipsis mojibake family.
// U+00C3 + (U+2014 | U+00B7): multiplication / division sign mojibake.
// U+00C2 + (degree | middot | guillemets | nbsp): stray-byte mojibake.
const c = String.fromCharCode;
const MOJIBAKE = new RegExp(
	[
		c(0xe2) + c(0x20ac),
		`${c(0xc3)}[${c(0x2014)}${c(0xb7)}]`,
		`${c(0xc2)}[${c(0xb0)}${c(0xb7)}${c(0xbb)}${c(0xab)}${c(0xa0)}]`,
	].join("|"),
);

const EXTENSIONS = /\.(ts|tsx|css|json|md)$/;

function walk(dir: string, files: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, files);
		else if (EXTENSIONS.test(entry)) files.push(full);
	}
	return files;
}

describe("encoding hygiene", () => {
	it("no mojibake sequences anywhere in src", () => {
		const offenders: string[] = [];
		for (const file of walk(SRC)) {
			const content = readFileSync(file, "utf8");
			const match = content.match(MOJIBAKE);
			if (match) {
				const line = content.slice(0, match.index).split("\n").length;
				offenders.push(`${relative(SRC, file)}:${line} (${match[0]})`);
			}
		}
		expect(offenders).toEqual([]);
	});
});
