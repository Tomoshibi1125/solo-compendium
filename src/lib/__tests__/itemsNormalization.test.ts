/**
 * Items catalog normalization locks. Covers the curated item parts AND the
 * auto-generated gap-fill items. Duplicate ids/names across the union would
 * collide at runtime; functional clones (same type + rarity + mechanics)
 * dilute the catalog.
 */
import { describe, expect, it } from "vitest";
import { allItems } from "@/data/compendium/items-index";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const fingerprint = (it: (typeof allItems)[number]): string => {
	const anyIt = it as unknown as Record<string, unknown>;
	return stableStringify({
		item_type: anyIt.item_type,
		type: anyIt.type,
		rarity: anyIt.rarity,
		mechanics: anyIt.mechanics,
		properties: anyIt.properties,
		damage: anyIt.damage,
		armor_class: anyIt.armor_class,
	});
};

describe("items data normalization", () => {
	it("does not duplicate item ids", () => {
		const ids = new Set<string>();
		for (const it of allItems) {
			expect(ids.has(it.id), `Duplicate item id ${it.id}`).toBe(false);
			ids.add(it.id);
		}
	});

	it("does not duplicate item names (case-insensitive)", () => {
		const names = new Set<string>();
		for (const it of allItems) {
			const key = it.name.toLowerCase();
			expect(names.has(key), `Duplicate item name ${it.name}`).toBe(false);
			names.add(key);
		}
	});

	it("does not contain functionally identical item clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const it of allItems) {
			const key = fingerprint(it);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), it.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(
			duplicates,
			`Found ${duplicates.length} functional item clone group(s)`,
		).toEqual([]);
	});
});
