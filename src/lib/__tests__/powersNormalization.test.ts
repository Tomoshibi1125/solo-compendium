import { describe, expect, it } from "vitest";
import { powers } from "@/data/compendium/powers";
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

describe("Power catalog — coverage", () => {
	it("contains exactly 76 canonical powers", () => {
		expect(powers).toHaveLength(76);
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

	it("every power is an Innate rank-3 power", () => {
		for (const power of powers) {
			expect(power.power_type).toBe("Innate");
			expect(power.power_level).toBe(3);
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

	it("every power is sourced to Ascendant Core Rulebook", () => {
		for (const power of powers) {
			expect(power.source_book).toBe("Ascendant Core Rulebook");
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
