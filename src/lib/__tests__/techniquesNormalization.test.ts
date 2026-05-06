import { describe, expect, it } from "vitest";
import { techniques } from "@/data/compendium/techniques";
import { techniques_supplemental } from "@/data/compendium/techniques-supplemental";

const TECHNIQUE_LEVEL_PARITY_MINIMUMS: Record<number, number> = {
	1: 25,
	2: 25,
	3: 35,
	4: 25,
	5: 100,
	6: 25,
	7: 25,
	8: 25,
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
		expect(techniques.length).toBeGreaterThanOrEqual(240);
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

	it("supplemental techniques declare explicit class eligibility", () => {
		expect(techniques_supplemental.length).toBeGreaterThan(0);
		for (const technique of techniques_supplemental) {
			expect(technique.classes?.length ?? 0, technique.id).toBeGreaterThan(0);
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

	it("uses power-style long-rest charges for every technique", () => {
		for (const technique of techniques) {
			expect(technique.level_requirement).toBeGreaterThanOrEqual(1);
			expect(technique.level_requirement).toBeLessThanOrEqual(9);
			expect(technique.uses_per_rest_formula).toBe("3/long rest");
			expect(technique.limitations.uses).toBe("3/long rest");
			expect(technique.limitations.recharge).toBe("long rest");
		}
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
});
