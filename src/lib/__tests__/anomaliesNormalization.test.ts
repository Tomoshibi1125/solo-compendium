/**
 * Anomalies catalog normalization locks.
 *
 * Anomalies are RA's monster catalog (ranks D-S, ~243 entries across the rank
 * files). This test guards against id/name duplicates AND functional clones —
 * two anomalies with the same rank, statblock, traits, and actions would be
 * mechanically identical reskins.
 */
import { describe, expect, it } from "vitest";
import { anomalies } from "@/data/compendium/anomalies";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (a: (typeof anomalies)[number]): string =>
	stableStringify({
		rank: a.rank,
		ac: a.ac,
		hp: a.hp,
		stats: a.stats,
		traits: a.traits,
		actions: a.actions,
		abilities: a.abilities,
	});

describe("anomalies data normalization", () => {
	it("does not duplicate anomaly ids", () => {
		const ids = new Set<string>();
		for (const a of anomalies) {
			expect(ids.has(a.id), `Duplicate anomaly id ${a.id}`).toBe(false);
			ids.add(a.id);
		}
	});

	it("does not duplicate anomaly names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const a of anomalies) {
			const key = a.name.toLowerCase();
			expect(names.has(key), `Duplicate anomaly name ${a.name}`).toBe(false);
			names.add(key);
		}
	});

	it("does not contain functionally identical anomaly clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const a of anomalies) {
			const key = fingerprint(a);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), a.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});
