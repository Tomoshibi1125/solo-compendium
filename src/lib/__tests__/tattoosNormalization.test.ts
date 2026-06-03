/**
 * Tattoos catalog normalization locks. Parallel to sigils — tattoos are
 * body-inked permanent enhancements, so the same dedup/uniqueness rules apply.
 */
import { describe, expect, it } from "vitest";
import { tattoos } from "@/data/compendium/tattoos";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (t: (typeof tattoos)[number]): string => {
	const anyT = t as unknown as Record<string, unknown>;
	return stableStringify({
		rarity: anyT.rarity,
		body_part: anyT.body_part,
		ink_type: anyT.ink_type,
		active_veins: anyT.active_veins,
		resonance_effect: anyT.resonance_effect,
		effects: anyT.effects,
		mechanics: anyT.mechanics,
		limitations: anyT.limitations,
	});
};

describe("tattoos data normalization", () => {
	it("does not duplicate tattoo ids", () => {
		const ids = new Set<string>();
		for (const t of tattoos) {
			expect(ids.has(t.id), `Duplicate tattoo id ${t.id}`).toBe(false);
			ids.add(t.id);
		}
	});

	it("does not duplicate tattoo names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const t of tattoos) {
			const key = t.name.toLowerCase();
			expect(names.has(key), `Duplicate tattoo name ${t.name}`).toBe(false);
			names.add(key);
		}
	});

	it("does not contain functionally identical tattoo clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const t of tattoos) {
			const key = fingerprint(t);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), t.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});
