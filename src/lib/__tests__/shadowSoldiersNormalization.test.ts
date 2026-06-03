/**
 * Shadow soldiers (Umbral Legion) catalog normalization locks. The Umbral
 * Regent's raised army — each entry should be a unique combat unit, not a
 * reskin of another.
 */
import { describe, expect, it } from "vitest";
import { shadowSoldiers } from "@/data/compendium/shadow-soldiers";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (s: (typeof shadowSoldiers)[number]): string =>
	stableStringify({
		rank: s.rank,
		role: s.role,
		hp: s.hp,
		ac: s.ac,
		stats: s.stats,
		traits: s.traits,
		actions: s.actions,
	});

describe("shadow soldiers data normalization", () => {
	it("does not duplicate shadow soldier ids", () => {
		const ids = new Set<string>();
		for (const s of shadowSoldiers) {
			expect(ids.has(s.id), `Duplicate shadow soldier id ${s.id}`).toBe(false);
			ids.add(s.id);
		}
	});

	it("does not duplicate shadow soldier names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const s of shadowSoldiers) {
			const key = s.name.toLowerCase();
			expect(names.has(key), `Duplicate shadow soldier name ${s.name}`).toBe(
				false,
			);
			names.add(key);
		}
	});

	it("does not contain functionally identical shadow soldier clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const s of shadowSoldiers) {
			const key = fingerprint(s);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), s.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});
