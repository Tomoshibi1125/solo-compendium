/**
 * Pantheon (deities) catalog normalization locks. Each deity must have a
 * unique id, name, and portfolio+specializations+dogma signature — no two
 * deities should share the same divine domain configuration.
 */
import { describe, expect, it } from "vitest";
import { PRIME_PANTHEON } from "@/data/compendium/pantheon";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (d: (typeof PRIME_PANTHEON)[number]): string =>
	stableStringify({
		rank: d.rank,
		portfolio: d.portfolio,
		specializations: d.specializations,
		dogma: d.dogma,
		home_realm: d.home_realm,
	});

describe("pantheon data normalization", () => {
	it("does not duplicate deity ids", () => {
		const ids = new Set<string>();
		for (const d of PRIME_PANTHEON) {
			expect(ids.has(d.id), `Duplicate deity id ${d.id}`).toBe(false);
			ids.add(d.id);
		}
	});

	it("does not duplicate deity names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const d of PRIME_PANTHEON) {
			const key = d.name.toLowerCase();
			expect(names.has(key), `Duplicate deity name ${d.name}`).toBe(false);
			names.add(key);
		}
	});

	it("does not contain functionally identical deity clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const d of PRIME_PANTHEON) {
			const key = fingerprint(d);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), d.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});
