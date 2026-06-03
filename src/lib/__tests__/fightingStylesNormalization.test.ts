/**
 * Fighting styles catalog normalization locks. Each style should be a unique
 * combat option — two styles with identical modifier hooks would be
 * indistinguishable in play.
 */
import { describe, expect, it } from "vitest";
import { FIGHTING_STYLES } from "@/data/compendium/fightingStyles";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (s: (typeof FIGHTING_STYLES)[number]): string =>
	stableStringify({
		modifiers: s.modifiers,
		prerequisites: s.prerequisites,
	});

describe("fighting styles data normalization", () => {
	it("does not duplicate fighting style ids", () => {
		const ids = new Set<string>();
		for (const s of FIGHTING_STYLES) {
			expect(ids.has(s.id), `Duplicate fighting style id ${s.id}`).toBe(false);
			ids.add(s.id);
		}
	});

	it("does not duplicate fighting style names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const s of FIGHTING_STYLES) {
			const key = s.name.toLowerCase();
			expect(names.has(key), `Duplicate fighting style name ${s.name}`).toBe(
				false,
			);
			names.add(key);
		}
	});

	it("does not contain functionally identical fighting style clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const s of FIGHTING_STYLES) {
			const key = fingerprint(s);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), s.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});
