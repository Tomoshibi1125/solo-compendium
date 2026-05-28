import { describe, expect, it } from "vitest";
import { powers } from "@/data/compendium/powers";
import { powers_supplemental } from "@/data/compendium/powers-supplemental";
import { computePowerUses } from "@/lib/perRestCharges";

const CANONICAL_SCHOOLS = new Set([
	"Abjuration",
	"Conjuration",
	"Divination",
	"Enchantment",
	"Evocation",
	"Illusion",
	"Necromancy",
	"Transmutation",
]);

const CANONICAL_ACTION_TIMES = new Set([
	"1 action",
	"1 bonus action",
	"1 reaction",
]);

const POWER_LEVEL_PARITY_MINIMUMS: Record<number, number> = {
	1: 25,
	2: 25,
	3: 100,
	4: 25,
	5: 25,
	6: 25,
	7: 20,
	8: 20,
	9: 20,
};

const FORBIDDEN_POWER_TERMS = [/system/i, /monarch/i, /\bdm\b/i, /\bplayer\b/i];

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const powerFunctionalFingerprint = (power: (typeof powers)[number]): string =>
	stableStringify({
		power_level: power.power_level,
		power_type: power.power_type,
		school: power.school,
		casting_time: power.casting_time,
		range: power.range,
		duration: power.duration,
		target: power.target,
		has_save: power.has_save,
		save_ability: power.save_ability,
		damage_roll: power.damage_roll,
		damage_type: power.damage_type,
		effects: power.effects,
		mechanics: power.mechanics,
		limitations: power.limitations,
	});

describe("Power catalog — coverage", () => {
	it("contains the legacy powers plus the expanded parity catalog", () => {
		expect(powers.length).toBeGreaterThanOrEqual(240);
	});

	it("every power id is unique and slug-formatted", () => {
		const seen = new Set<string>();
		for (const power of powers) {
			expect(power.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
			expect(seen.has(power.id), `Duplicate power id "${power.id}"`).toBe(
				false,
			);
			seen.add(power.id);
		}
	});

	it("does not duplicate power names", () => {
		const seen = new Set<string>();
		for (const power of powers) {
			const key = power.name.toLowerCase();
			expect(seen.has(key), `Duplicate power name "${power.name}"`).toBe(false);
			seen.add(key);
		}
	});

	it("does not contain functionally identical power clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const power of powers) {
			const key = powerFunctionalFingerprint(power);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), power.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});

	it("does not contain forbidden legacy terminology", () => {
		const serialized = JSON.stringify(powers);
		for (const term of FORBIDDEN_POWER_TERMS) {
			expect(serialized).not.toMatch(term);
		}
	});

	it("supplemental powers declare explicit class eligibility (or empty for path-grant-only)", () => {
		expect(powers_supplemental.length).toBeGreaterThan(0);
		for (const power of powers_supplemental) {
			expect(Array.isArray(power.classes), power.id).toBe(true);
		}
	});

	it("no power classes[] contains a full-caster or pact-caster job that has powers:false", () => {
		const CASTER_JOBS_WITHOUT_POWERS = [
			"Mage",
			"Esper",
			"Revenant",
			"Summoner",
			"Idol",
			"Herald",
			"Contractor",
		];
		for (const power of powers) {
			const classes = Array.isArray(power.classes) ? power.classes : [];
			for (const caster of CASTER_JOBS_WITHOUT_POWERS) {
				expect(
					classes.includes(caster),
					`Power ${power.id} (${power.name}) wrongly lists ${caster} in classes[]; full/pact-casters reach powers only via PATH_ABILITY_GRANTS`,
				).toBe(false);
			}
		}
	});
});

describe("Power catalog — required schema", () => {
	const requiredKeys = [
		"id",
		"name",
		"description",
		"power_type",
		"power_level",
		"casting_time",
		"range",
		"duration",
		"concentration",
		"ritual",
		"school",
		"source_book",
		"limitations",
		"mechanics",
	] as const;

	it.each(requiredKeys)("every power defines %s", (key) => {
		const missing = powers.filter(
			(p) => (p as unknown as Record<string, unknown>)[key] === undefined,
		);
		expect(
			missing.map((p) => p.id),
			`Powers missing ${key}`,
		).toEqual([]);
	});

	it("every power is an Innate power with a supported parity level", () => {
		for (const power of powers) {
			expect(power.power_type).toBe("Innate");
			expect(power.power_level).toBeGreaterThanOrEqual(1);
			expect(power.power_level).toBeLessThanOrEqual(9);
		}
	});

	it("has enough coverage at every power level", () => {
		for (const [level, minimum] of Object.entries(
			POWER_LEVEL_PARITY_MINIMUMS,
		)) {
			expect(
				powers.filter((power) => power.power_level === Number(level)).length,
				`Power level ${level} coverage`,
			).toBeGreaterThanOrEqual(minimum);
		}
	});

	it("every power's school is one of the eight canonical 5e schools", () => {
		for (const power of powers) {
			expect(
				CANONICAL_SCHOOLS.has(power.school),
				`Power ${power.id} has non-canonical school "${power.school}"`,
			).toBe(true);
		}
	});

	it("every power has canonical top-level action-time metadata", () => {
		for (const power of powers) {
			expect(CANONICAL_ACTION_TIMES.has(power.casting_time ?? "")).toBe(true);
		}
	});

	it("every power is sourced to a canonical RA book", () => {
		for (const power of powers) {
			expect(
				["Ascendant Core Rulebook", "Rift Ascendant Canon"].includes(
					power.source_book ?? "",
				),
			).toBe(true);
		}
	});
});

describe("Power catalog — charge normalization", () => {
	it("every power uses the canonical native power charge profile", () => {
		for (const power of powers) {
			const limitations = power.limitations as
				| { uses?: unknown; recharge?: unknown }
				| null
				| undefined;
			expect(limitations?.uses).toBe("3/long rest");
			expect(limitations?.recharge).toBe("long rest");
			expect(
				computePowerUses(power as Parameters<typeof computePowerUses>[0], {
					level: 5,
					proficiencyBonus: 3,
					primaryStatModifier: 4,
				}),
			).toEqual({
				abilityKind: "power",
				usesMax: 3,
				recharge: "long-rest",
				isAtWill: false,
			});
		}
	});

	const staleTopLevelFields = [
		"uses_per_rest",
		"uses_per_rest_formula",
		"recharge",
		"frequency",
	] as const;

	it.each(
		staleTopLevelFields,
	)("no power carries the legacy top-level %s field", (field) => {
		const offenders = powers.filter(
			(p) => (p as unknown as Record<string, unknown>)[field] !== undefined,
		);
		expect(
			offenders.map((p) => p.id),
			`Powers leaking top-level ${field}`,
		).toEqual([]);
	});

	const staleMechanicsFields = ["action_type", "action", "frequency"] as const;

	it.each(
		staleMechanicsFields,
	)("no power mechanics block carries the legacy %s key", (field) => {
		const offenders = powers.filter((p) => {
			const mechanics = (p as unknown as Record<string, unknown>).mechanics as
				| Record<string, unknown>
				| undefined;
			return mechanics !== undefined && mechanics[field] !== undefined;
		});
		expect(
			offenders.map((p) => p.id),
			`Powers leaking mechanics.${field}`,
		).toEqual([]);
	});

	it("does not mirror top-level power metadata inside mechanics", () => {
		const mirroredKeys = [
			"duration",
			"range",
			"ability",
			"action",
			"action_type",
		];
		const offenders = powers.flatMap((power) => {
			const mechanics = (power as unknown as Record<string, unknown>)
				.mechanics as Record<string, unknown> | undefined;
			if (!mechanics) return [];
			return mirroredKeys
				.filter((key) => mechanics[key] !== undefined)
				.map((key) => `${power.id}:${key}`);
		});
		expect(offenders).toEqual([]);
	});
});

describe("Power catalog — combat metadata", () => {
	it("every power with a save declares save ability when has_save is true", () => {
		for (const power of powers.filter((p) => p.has_save)) {
			expect(typeof power.save_ability).toBe("string");
			expect(power.save_ability?.length ?? 0).toBeGreaterThan(0);
		}
	});

	it("every damaging power has damage roll and damage type metadata", () => {
		const damaging = powers.filter(
			(p) => p.damage_roll && !["—", "-", "utility"].includes(p.damage_roll),
		);
		expect(damaging.length).toBeGreaterThan(0);
		for (const power of damaging) {
			expect(power.damage_roll?.length ?? 0).toBeGreaterThan(0);
			expect(power.damage_type?.length ?? 0).toBeGreaterThan(0);
		}
	});
});
