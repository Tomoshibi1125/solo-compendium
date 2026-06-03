/**
 * Relics catalog normalization locks. Relics are legendary attuned items;
 * each one must be unique in id, name, and effect signature.
 */
import { describe, expect, it } from "vitest";
import { comprehensiveRelics } from "@/data/compendium/relics-comprehensive";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (r: (typeof comprehensiveRelics)[number]): string =>
	stableStringify({
		type: r.type,
		rarity: r.rarity,
		mechanics: r.mechanics,
		abilities: r.abilities,
	});

describe("relics data normalization", () => {
	it("does not duplicate relic ids", () => {
		const ids = new Set<string>();
		for (const r of comprehensiveRelics) {
			expect(ids.has(r.id), `Duplicate relic id ${r.id}`).toBe(false);
			ids.add(r.id);
		}
	});

	it("does not duplicate relic names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const r of comprehensiveRelics) {
			const key = r.name.toLowerCase();
			expect(names.has(key), `Duplicate relic name ${r.name}`).toBe(false);
			names.add(key);
		}
	});

	it("does not contain functionally identical relic clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const r of comprehensiveRelics) {
			const key = fingerprint(r);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), r.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});
