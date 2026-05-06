import { describe, expect, it } from "vitest";
import { powers } from "@/data/compendium/powers";
import { allRunes, catalogAuthoredAbilityRunes } from "@/data/compendium/runes";
import { spells } from "@/data/compendium/spells";
import { techniques } from "@/data/compendium/techniques";
import { RUNE_CROSS_CLASS_DESCRIPTION } from "@/lib/runeAutomation";

function coverageKey(kind: string, ref: string): string {
	return `${kind}:${ref}`;
}

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const runeFunctionalFingerprint = (rune: (typeof allRunes)[number]): string =>
	stableStringify({
		teaches: rune.teaches,
		rune_type: rune.rune_type,
		rune_category: rune.rune_category,
		effect_type: rune.effect_type,
		activation_action: rune.activation_action,
		duration: rune.duration,
		range: rune.range,
		rune_level: rune.rune_level,
		rank: rune.rank,
		effects: rune.effects,
		mechanics: rune.mechanics,
		limitations: rune.limitations,
	});

describe("runes data normalization", () => {
	it("does not expose top-level uses_per_rest or recharge fields", () => {
		for (const rune of allRunes) {
			expect(rune).not.toHaveProperty("uses_per_rest");
			expect(rune).not.toHaveProperty("recharge");
		}
	});

	it("does not expose mechanics.action_type — that field belongs to the taught ability", () => {
		for (const rune of allRunes) {
			const mechanics = (
				rune as unknown as { mechanics?: Record<string, unknown> }
			).mechanics;
			if (mechanics) {
				expect(mechanics).not.toHaveProperty("action_type");
			}
		}
	});

	it("teaches metadata is present, well-formed, and references a slug ref", () => {
		for (const rune of allRunes) {
			const teaches = (
				rune as unknown as {
					teaches?: { kind: string; ref: string };
				}
			).teaches;
			expect(teaches, `rune ${rune.id} is missing teaches`).toBeDefined();
			if (!teaches) continue;
			expect(["spell", "power", "technique"]).toContain(teaches.kind);
			expect(teaches.ref).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
		}
	});

	it("every Cross-Class Adaptation reference uses the canonical locked-formula sentence", () => {
		for (const rune of allRunes) {
			const description = rune.description ?? "";
			if (description.includes("Cross-Class Adaptation")) {
				expect(description).toContain(RUNE_CROSS_CLASS_DESCRIPTION);
			}
		}
	});

	it("covers every canonical spell, power, and technique with a teaching rune", () => {
		const runeRefs = new Set(
			allRunes
				.map((rune) => rune.teaches)
				.filter((teaches): teaches is NonNullable<typeof teaches> =>
					Boolean(teaches),
				)
				.map((teaches) => coverageKey(teaches.kind, teaches.ref)),
		);
		for (const spell of spells) {
			expect(runeRefs.has(coverageKey("spell", spell.id)), spell.id).toBe(true);
		}
		for (const power of powers) {
			expect(runeRefs.has(coverageKey("power", power.id)), power.id).toBe(true);
		}
		for (const technique of techniques) {
			expect(
				runeRefs.has(coverageKey("technique", technique.id)),
				technique.id,
			).toBe(true);
		}
	});

	it("includes catalog-authored ability runes in the exported rune catalog", () => {
		const allRuneIds = new Set(allRunes.map((rune) => rune.id));
		expect(catalogAuthoredAbilityRunes.length).toBeGreaterThan(0);
		for (const rune of catalogAuthoredAbilityRunes) {
			expect(allRuneIds.has(rune.id), rune.id).toBe(true);
		}
	});

	it("does not contain functionally identical rune clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const rune of allRunes) {
			const key = runeFunctionalFingerprint(rune);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), rune.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});

	it("does not expose fallback or generated placeholder rune entries", () => {
		for (const rune of allRunes) {
			expect(rune.id, rune.id).not.toContain("fallback");
			expect(rune.name.toLowerCase(), rune.id).not.toContain("fallback");
			expect(rune.description?.toLowerCase() ?? "", rune.id).not.toContain(
				"fallback",
			);
			expect(rune.tags ?? [], rune.id).not.toContain("generated");
			expect(rune.tags ?? [], rune.id).not.toContain("fallback");
		}
	});

	it("all catalog-covered runes are fully fleshed out", () => {
		for (const rune of allRunes) {
			expect(rune.description?.length ?? 0, rune.id).toBeGreaterThan(100);
			expect(rune.effect_description?.length ?? 0, rune.id).toBeGreaterThan(50);
			expect(rune.flavor?.length ?? 0, rune.id).toBeGreaterThan(20);
			expect(rune.discovery_lore?.length ?? 0, rune.id).toBeGreaterThan(40);
			expect(rune.effects, rune.id).toBeDefined();
			expect(rune.mechanics, rune.id).toBeDefined();
			expect(rune.limitations, rune.id).toBeDefined();
		}
	});
});
