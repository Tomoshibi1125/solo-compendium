/**
 * Spell catalog normalization locks (Phase G).
 *
 * Spells in Rift Ascendant are slot-based castables organized by rank
 * (D / C / B / A / S → spell ranks 1 / 3 / 5 / 7 / 9, with cantrips at level 0
 * appearing in rank D). These tests guarantee the catalog never silently
 * regresses to power/technique-style charge fields and that every entry
 * exposes the schema fields the engine and UI rely on.
 */
import { describe, expect, it } from "vitest";
import { spells } from "@/data/compendium/spells";
import { spells_a } from "@/data/compendium/spells/rank-a";
import { spells_b } from "@/data/compendium/spells/rank-b";
import { spells_c } from "@/data/compendium/spells/rank-c";
import { spells_d } from "@/data/compendium/spells/rank-d";
import { spells_s } from "@/data/compendium/spells/rank-s";

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

const CANONICAL_SOURCE_BOOKS = new Set([
	"Ascendant Core Rulebook",
	"Rift Ascendant Canon",
]);

const RANK_LEVEL_BAND: Record<string, [number, number]> = {
	D: [0, 2],
	C: [2, 4],
	B: [4, 6],
	A: [6, 8],
	S: [8, 9],
};

describe("Spell catalog — coverage", () => {
	it("contains exactly 75 spells (15 per rank across D/C/B/A/S)", () => {
		expect(spells_d).toHaveLength(15);
		expect(spells_c).toHaveLength(15);
		expect(spells_b).toHaveLength(15);
		expect(spells_a).toHaveLength(15);
		expect(spells_s).toHaveLength(15);
		expect(spells).toHaveLength(75);
	});

	it("every spell id is unique and follows the canonical spell-{rank}-{n} pattern", () => {
		const seen = new Set<string>();
		const idPattern = /^spell-[a-z]-\d+$/;
		for (const spell of spells) {
			expect(spell.id, `Spell ${spell.name} missing id`).toBeDefined();
			const id = spell.id ?? "";
			expect(id).toMatch(idPattern);
			expect(seen.has(id), `Duplicate spell id "${id}"`).toBe(false);
			seen.add(id);
		}
	});

	it("every spell id rank-letter matches the entry's rank field", () => {
		for (const spell of spells) {
			const id = spell.id ?? "";
			const idRank = id.split("-")[1]?.toUpperCase();
			expect(spell.rank, `Spell ${id} missing rank`).toBeDefined();
			expect(spell.rank).toBe(idRank);
		}
	});
});

describe("Spell catalog — required fields", () => {
	const requiredKeys = [
		"id",
		"name",
		"description",
		"level",
		"school",
		"casting_time",
		"range",
		"duration",
		"components",
		"concentration",
		"ritual",
		"rank",
		"source_book",
	] as const;

	it.each(requiredKeys)("every spell defines %s", (key) => {
		const missing = spells.filter(
			(s) => (s as unknown as Record<string, unknown>)[key] === undefined,
		);
		expect(
			missing.map((s) => s.id),
			`Spells missing ${key}`,
		).toEqual([]);
	});

	it("every spell's level is an integer in 0..9", () => {
		for (const spell of spells) {
			const level = spell.level;
			expect(typeof level).toBe("number");
			expect(Number.isInteger(level)).toBe(true);
			expect(level).toBeGreaterThanOrEqual(0);
			expect(level).toBeLessThanOrEqual(9);
		}
	});

	it("every spell's level falls inside its rank's canonical band", () => {
		for (const spell of spells) {
			const rank = (spell.rank ?? "").toUpperCase();
			const band = RANK_LEVEL_BAND[rank];
			expect(band, `Spell ${spell.id} has unknown rank ${rank}`).toBeDefined();
			const [min, max] = band;
			expect(
				spell.level,
				`Spell ${spell.id} level ${spell.level} outside rank-${rank} band [${min},${max}]`,
			).toBeGreaterThanOrEqual(min);
			expect(spell.level).toBeLessThanOrEqual(max);
		}
	});

	it("every spell's school is one of the eight canonical 5e schools", () => {
		for (const spell of spells) {
			expect(
				CANONICAL_SCHOOLS.has(spell.school ?? ""),
				`Spell ${spell.id} has non-canonical school "${spell.school}"`,
			).toBe(true);
		}
	});

	it("every spell's casting_time is a non-empty string", () => {
		for (const spell of spells) {
			expect(typeof spell.casting_time).toBe("string");
			expect(spell.casting_time?.length ?? 0).toBeGreaterThan(0);
		}
	});

	it("every spell is sourced to a canonical source book", () => {
		for (const spell of spells) {
			expect(CANONICAL_SOURCE_BOOKS.has(spell.source_book ?? "")).toBe(true);
		}
	});

	it("every spell's components object declares verbal/somatic/material booleans", () => {
		for (const spell of spells) {
			const components = spell.components as
				| {
						verbal?: unknown;
						somatic?: unknown;
						material?: unknown;
				  }
				| null
				| undefined;
			expect(components, `Spell ${spell.id} missing components`).toBeDefined();
			expect(typeof components?.verbal).toBe("boolean");
			expect(typeof components?.somatic).toBe("boolean");
			// Material may be boolean or a string description in some shapes; tests should
			// allow either as long as the field is present.
			expect(components?.material).toBeDefined();
		}
	});
});

describe("Spell catalog — slot-based purity (no stale charge fields)", () => {
	const STALE_TOP_LEVEL = [
		"uses_per_rest",
		"uses_per_rest_formula",
		"recharge",
		"frequency",
	] as const;

	it.each(
		STALE_TOP_LEVEL,
	)("no spell carries the legacy top-level %s field", (field) => {
		const offenders = spells.filter(
			(s) => (s as unknown as Record<string, unknown>)[field] !== undefined,
		);
		expect(
			offenders.map((s) => s.id),
			`Spells leaking top-level ${field}`,
		).toEqual([]);
	});

	const STALE_MECHANICS = ["action_type", "frequency"] as const;

	it.each(
		STALE_MECHANICS,
	)("no spell's mechanics block carries the legacy %s key", (field) => {
		const offenders = spells.filter((s) => {
			const mechanics = (s as unknown as Record<string, unknown>).mechanics as
				| Record<string, unknown>
				| undefined;
			return mechanics !== undefined && mechanics[field] !== undefined;
		});
		expect(
			offenders.map((s) => s.id),
			`Spells leaking mechanics.${field}`,
		).toEqual([]);
	});
});

describe("Spell catalog — saving-throw consistency", () => {
	it("every spell with a saving_throw exposes ability + dc", () => {
		const withSave = spells.filter((s) => s.saving_throw != null);
		expect(withSave.length).toBeGreaterThan(0);
		for (const spell of withSave) {
			const save = spell.saving_throw as
				| { ability?: unknown; dc?: unknown }
				| null
				| undefined;
			expect(typeof save?.ability).toBe("string");
			expect(typeof save?.dc).toBe("number");
			expect(save?.dc as number).toBeGreaterThanOrEqual(0);
			expect(save?.dc as number).toBeLessThanOrEqual(30);
		}
	});

	it("supports dc: 0 as the dynamic spell-save formula sentinel", () => {
		const sentinelSaves = spells.filter((s) => s.saving_throw?.dc === 0);
		expect(sentinelSaves.length).toBeGreaterThan(0);
		for (const spell of sentinelSaves) {
			const mechanics = (spell as unknown as Record<string, unknown>)
				.mechanics as Record<string, unknown> | undefined;
			expect(mechanics?.dc ?? 0).toBe(0);
		}
	});

	it("every spell with an attack block exposes type + ability + damage", () => {
		const withAttack = spells.filter((s) => s.attack != null);
		expect(withAttack.length).toBeGreaterThan(0);
		for (const spell of withAttack) {
			const attack = spell.attack as
				| { type?: unknown; ability?: unknown; damage?: unknown }
				| null
				| undefined;
			expect(typeof attack?.type).toBe("string");
			expect(typeof attack?.ability).toBe("string");
			expect(typeof attack?.damage).toBe("string");
		}
	});
});
