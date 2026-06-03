/**
 * Backgrounds catalog normalization locks. Two backgrounds with the same
 * skill proficiencies, equipment, and feature would be reskins; this test
 * catches that.
 */
import { describe, expect, it } from "vitest";
import { allBackgrounds } from "@/data/compendium/backgrounds-index";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (b: (typeof allBackgrounds)[number]): string => {
	const anyB = b as unknown as Record<string, unknown>;
	return stableStringify({
		skill_proficiencies: anyB.skill_proficiencies,
		tool_proficiencies: anyB.tool_proficiencies,
		starting_equipment: anyB.starting_equipment,
		feature_name: anyB.feature_name,
		background_features: anyB.background_features,
	});
};

describe("backgrounds data normalization", () => {
	it("does not duplicate background ids", () => {
		const ids = new Set<string>();
		for (const b of allBackgrounds) {
			expect(ids.has(b.id), `Duplicate background id ${b.id}`).toBe(false);
			ids.add(b.id);
		}
	});

	it("does not duplicate background names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const b of allBackgrounds) {
			const key = b.name.toLowerCase();
			expect(names.has(key), `Duplicate background name ${b.name}`).toBe(false);
			names.add(key);
		}
	});

	it("does not contain functionally identical background clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const b of allBackgrounds) {
			const key = fingerprint(b);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), b.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});
