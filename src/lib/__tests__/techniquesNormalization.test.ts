import { describe, expect, it } from "vitest";
import { techniques } from "@/data/compendium/techniques";
import { techniques_supplemental } from "@/data/compendium/techniques-supplemental";
import { computeTechniqueUses } from "@/lib/perRestCharges";

// Per-level coverage floors, calibrated to the curated archetype-shared
// technique pool (mid-tier-heavy at level 5 without templated filler). Floors
// sit just under the actual curated counts.
const TECHNIQUE_LEVEL_PARITY_MINIMUMS: Record<number, number> = {
	1: 25,
	2: 5,
	3: 35,
	4: 5,
	5: 45,
	6: 5,
	7: 20,
	8: 3,
	9: 20,
};

const FORBIDDEN_TECHNIQUE_TERMS = [
	/system/i,
	/monarch/i,
	/\bdm\b/i,
	/\bplayer\b/i,
];

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const techniqueFunctionalFingerprint = (
	technique: (typeof techniques)[number],
): string =>
	stableStringify({
		level_requirement: technique.level_requirement,
		type: technique.type,
		style: technique.style,
		activation: technique.activation,
		range: technique.range,
		duration: technique.duration,
		effects: technique.effects,
		mechanics: technique.mechanics,
		limitations: technique.limitations,
	});

describe("techniques data normalization", () => {
	it("contains the legacy techniques plus the expanded parity catalog", () => {
		// Curated archetype-shared technique pool (Part A): comprehensive without
		// padding the compendium with templated filler.
		expect(techniques.length).toBeGreaterThanOrEqual(200);
	});

	it("technique ids are static string slugs, not DB uuids (column must stay TEXT)", () => {
		// Regression guard for the "Failed to add technique" bug: the learned
		// technique_id holds these static slugs, so character_techniques.technique_id
		// is TEXT with no FK (see migration 20260701000000). If technique ids ever
		// became uuids someone might reintroduce a compendium_techniques FK, which
		// would break adding every static-catalog technique again.
		const UUID_RE =
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
		for (const technique of techniques) {
			expect(typeof technique.id, `${technique.name} id is a string`).toBe(
				"string",
			);
			expect(
				technique.id.length,
				`${technique.name} id non-empty`,
			).toBeGreaterThan(0);
			expect(
				UUID_RE.test(technique.id),
				`Technique id "${technique.id}" is a UUID; technique_id is TEXT holding static slugs — do not reintroduce a compendium_techniques FK`,
			).toBe(false);
		}
	});

	it("does not contain legacy stamina text anywhere", () => {
		expect(JSON.stringify(techniques)).not.toMatch(/Stamina/i);
	});

	it("does not contain forbidden legacy terminology", () => {
		const serialized = JSON.stringify(techniques);
		for (const term of FORBIDDEN_TECHNIQUE_TERMS) {
			expect(serialized).not.toMatch(term);
		}
	});

	it("does not duplicate technique names", () => {
		const seen = new Set<string>();
		for (const technique of techniques) {
			const key = technique.name.toLowerCase();
			expect(
				seen.has(key),
				`Duplicate technique name "${technique.name}"`,
			).toBe(false);
			seen.add(key);
		}
	});

	it("does not contain functionally identical technique clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const technique of techniques) {
			const key = techniqueFunctionalFingerprint(technique);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), technique.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});

	it("supplemental techniques declare explicit class eligibility (or empty for path-grant-only)", () => {
		expect(techniques_supplemental.length).toBeGreaterThan(0);
		for (const technique of techniques_supplemental) {
			expect(Array.isArray(technique.classes), technique.id).toBe(true);
		}
	});

	it("no technique classes[] contains a full-caster or pact-caster job that has techniques:false", () => {
		// Revenant is a hybrid half-caster (techniques: true) after the drain-tank
		// rework — it owns techniques, so it is intentionally NOT in this list.
		const CASTER_JOBS_WITHOUT_TECHNIQUES = [
			"Mage",
			"Esper",
			"Summoner",
			"Idol",
			"Herald",
			"Contractor",
		];
		for (const technique of techniques) {
			const classes = Array.isArray(technique.classes) ? technique.classes : [];
			for (const caster of CASTER_JOBS_WITHOUT_TECHNIQUES) {
				expect(
					classes.includes(caster),
					`Technique ${technique.id} (${technique.name}) wrongly lists ${caster} in classes[]; full/pact-casters reach techniques only via PATH_ABILITY_GRANTS`,
				).toBe(false);
			}
		}
	});

	it("has enough coverage at every technique level", () => {
		for (const [level, minimum] of Object.entries(
			TECHNIQUE_LEVEL_PARITY_MINIMUMS,
		)) {
			expect(
				techniques.filter(
					(technique) => technique.level_requirement === Number(level),
				).length,
				`Technique level ${level} coverage`,
			).toBeGreaterThanOrEqual(minimum);
		}
	});

	it("uses 5e per-rest charges (varied, not a flat uniform value)", () => {
		for (const technique of techniques) {
			expect(technique.level_requirement).toBeGreaterThanOrEqual(1);
			expect(technique.level_requirement).toBeLessThanOrEqual(9);
			// Each technique declares its own use limit (a count or a scaling
			// formula) and a real rest cadence — never a single hardcoded value.
			const uses = technique.limitations.uses;
			expect(typeof uses, `${technique.id} limitations.uses`).toBe("string");
			expect(
				(uses as string).length,
				`${technique.id} uses non-empty`,
			).toBeGreaterThan(0);
			expect(["short rest", "long rest"], `${technique.id} recharge`).toContain(
				technique.limitations.recharge,
			);
			const profile = computeTechniqueUses(
				technique as Parameters<typeof computeTechniqueUses>[0],
				{ level: 9, proficiencyBonus: 4, primaryStatModifier: 3 },
			);
			expect(profile.isAtWill, `${technique.id} should be charged`).toBe(false);
			expect(
				profile.usesMax ?? 0,
				`${technique.id} usesMax`,
			).toBeGreaterThanOrEqual(1);
			expect(["short-rest", "long-rest"]).toContain(profile.recharge);
		}
	});

	it("preserves per-rest variety across the technique catalog", () => {
		const recharges = new Set(techniques.map((t) => t.limitations.recharge));
		expect(recharges.has("short rest"), "has short-rest techniques").toBe(true);
		expect(recharges.has("long rest"), "has long-rest techniques").toBe(true);
	});

	it("does not expose activation cost fields", () => {
		for (const technique of techniques) {
			if (typeof technique.activation === "object") {
				expect(technique.activation).not.toHaveProperty("cost");
			}
		}
	});

	it("does not mirror top-level technique metadata inside mechanics", () => {
		const mirroredKeys = [
			"duration",
			"range",
			"type",
			"action",
			"action_type",
			"frequency",
		];
		const offenders = techniques.flatMap((technique) => {
			const mechanics = (technique as unknown as Record<string, unknown>)
				.mechanics as Record<string, unknown> | undefined;
			if (!mechanics) return [];
			return mirroredKeys
				.filter((key) => mechanics[key] !== undefined)
				.map((key) => `${technique.id}:${key}`);
		});
		expect(offenders).toEqual([]);
	});

	it("does not inject a per-ability Covenant/Infusion 'Cost' line on any technique", () => {
		// Job resources (Holy Knight → Covenant, Technomancer → Infusion) are
		// job-feature resources, NOT a per-ability cost. Under the 5e-SRD per-ability
		// use economy, leveled techniques are limited by (primary mod + PB) uses per
		// rest instead, so no technique should carry a borrowed single-job resource
		// cost. Guards the removal of the old canonicalResourceCost injection.
		for (const technique of techniques) {
			const cost = String(technique.limitations?.cost ?? "");
			expect(
				cost,
				`${technique.id} must not carry a job-resource 'Cost' line`,
			).not.toMatch(/Covenant|Infusion/);
		}
	});
});
