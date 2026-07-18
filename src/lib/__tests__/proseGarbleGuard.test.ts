/**
 * Prose garble guard (Jul 18 prod smoke).
 *
 * Two garble classes from the RA-rebrand bulk replaces kept resurfacing in
 * shipped copy:
 *   1. "anomalies and anomaly" — the classic 5e "fiends and undead" pair
 *      where BOTH creature types were mapped to "anomaly" (F12 fixed 15 of
 *      these on Jul 4; three more surfaced in the Jul 18 live sweep).
 *   2. "the The Absolute" — a definite article stacked onto the deity name
 *      "The Absolute" (five occurrences found live).
 *
 * This test walks src/ and fails on any recurrence, so bulk term swaps
 * can't silently reintroduce them.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC_ROOT = path.resolve(__dirname, "..", "..");

// Built from parts so this file never matches its own patterns.
const GARBLES: Array<{ name: string; re: RegExp }> = [
	{
		name: "redundant anomaly pairing",
		re: /anomal(?:y|ies)(?:-type)?\s+and\s+anomal/i,
	},
	{
		name: "doubled article on the deity name",
		re: /\b(?:the|The) The\b/,
	},
];

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (entry === "__tests__" || entry === "node_modules") continue;
		const full = path.join(dir, entry);
		const stats = statSync(full);
		if (stats.isDirectory()) {
			walk(full, out);
		} else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts")) {
			out.push(full);
		}
	}
	return out;
}

describe("prose garble guard", () => {
	it("the guard patterns catch the historical garbles (self-probe)", () => {
		// Reconstructed from parts so the literals never live in this file.
		const bad1 = ["anomalies", "and", "anomaly"].join(" ");
		const bad2 = ["against", "anomaly", "and", "anomaly"].join(" ");
		const bad3 = ["may", "the", "The", "Absolute's", "favor"].join(" ");
		expect(GARBLES[0].re.test(bad1)).toBe(true);
		expect(GARBLES[0].re.test(bad2)).toBe(true);
		expect(GARBLES[1].re.test(bad3)).toBe(true);
		// Legitimate prose stays clean.
		expect(GARBLES[0].re.test("anomalies and beasts")).toBe(false);
		expect(GARBLES[1].re.test("The Absolute's domain")).toBe(false);
	});

	it("no source file contains a known garble pattern", () => {
		const files = walk(SRC_ROOT);
		expect(files.length).toBeGreaterThan(100);
		const violations: string[] = [];
		for (const file of files) {
			const text = readFileSync(file, "utf8");
			for (const { name, re } of GARBLES) {
				const match = re.exec(text);
				if (match) {
					violations.push(
						`${path.relative(SRC_ROOT, file)}: ${name} — "…${match[0]}…"`,
					);
				}
			}
		}
		expect(violations).toEqual([]);
	});
});
