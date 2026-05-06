import { describe, expect, it } from "vitest";
import { sigils } from "@/data/compendium/sigils";

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const sigilFunctionalFingerprint = (sigil: (typeof sigils)[number]): string =>
	stableStringify({
		rarity: sigil.rarity,
		can_inscribe_on: sigil.can_inscribe_on,
		passive_bonuses: sigil.passive_bonuses,
		effect_description: sigil.effect_description,
		active_feature: sigil.active_feature,
		effects: sigil.effects,
		mechanics: sigil.mechanics,
		limitations: sigil.limitations,
	});

describe("sigils data normalization", () => {
	it("does not duplicate sigil ids or names", () => {
		const ids = new Set<string>();
		const names = new Set<string>();
		for (const sigil of sigils) {
			expect(ids.has(sigil.id), `Duplicate sigil id ${sigil.id}`).toBe(false);
			expect(
				names.has(sigil.name.toLowerCase()),
				`Duplicate sigil name ${sigil.name}`,
			).toBe(false);
			ids.add(sigil.id);
			names.add(sigil.name.toLowerCase());
		}
	});

	it("does not contain functionally identical sigil clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const sigil of sigils) {
			const key = sigilFunctionalFingerprint(sigil);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), sigil.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});
});
