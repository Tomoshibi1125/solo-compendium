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
import { spells_d } from "@/data/compendium/spells/rank-d";
import { spells_supplemental } from "@/data/compendium/spells/supplemental";

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

const RANK_PARITY_MINIMUMS: Record<string, number> = {
	D: 140,
	C: 100,
	B: 80,
	A: 55,
	S: 40,
};

const LEVEL_PARITY_MINIMUMS: Record<number, number> = {
	0: 20,
	1: 50,
	2: 50,
	3: 50,
	4: 35,
	5: 50,
	6: 25,
	7: 30,
	8: 20,
	9: 30,
};

const FORBIDDEN_SPELL_TERMS = [/system/i, /monarch/i, /\bdm\b/i, /\bplayer\b/i];

const stableStringify = (value: unknown): string => {
	if (value == null) return "";
	if (typeof value !== "object") return String(value).toLowerCase().trim();
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	const entries = Object.entries(value as Record<string, unknown>).sort(
		([a], [b]) => a.localeCompare(b),
	);
	return `{${entries.map(([key, entry]) => `${key}:${stableStringify(entry)}`).join(",")}}`;
};

const spellFunctionalFingerprint = (spell: (typeof spells)[number]): string =>
	stableStringify({
		level: spell.level,
		school: spell.school,
		casting_time: spell.casting_time,
		range: spell.range,
		duration: spell.duration,
		attack: spell.attack,
		saving_throw: spell.saving_throw,
		area: spell.area,
		effects: spell.effects,
		higher_levels: spell.higher_levels,
	});

describe("Spell catalog — coverage", () => {
	it("contains the legacy rank files plus the expanded parity catalog", () => {
		expect(spells_d).toHaveLength(15);

		expect(spells.length).toBeGreaterThanOrEqual(450);
		for (const [rank, minimum] of Object.entries(RANK_PARITY_MINIMUMS)) {
			expect(
				spells.filter((spell) => spell.rank === rank).length,
				`Rank ${rank} spell coverage`,
			).toBeGreaterThanOrEqual(minimum);
		}
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

	it("has enough coverage at every spell level", () => {
		for (const [level, minimum] of Object.entries(LEVEL_PARITY_MINIMUMS)) {
			expect(
				spells.filter((spell) => spell.level === Number(level)).length,
				`Level ${level} spell coverage`,
			).toBeGreaterThanOrEqual(minimum);
		}
	});

	it("does not duplicate spell names", () => {
		const seen = new Set<string>();
		const duplicates: string[] = [];
		for (const spell of spells) {
			const key = spell.name.toLowerCase();
			if (seen.has(key)) duplicates.push(spell.name);
			seen.add(key);
		}
		expect(duplicates).toEqual([]);
	});

	it("does not contain functionally identical spell clones", () => {
		const fingerprints = new Map<string, string[]>();
		for (const spell of spells) {
			const key = spellFunctionalFingerprint(spell);
			fingerprints.set(key, [...(fingerprints.get(key) ?? []), spell.name]);
		}
		const duplicates = [...fingerprints.values()]
			.filter((names) => names.length > 1)
			.map((names) => names.join(" | "));
		expect(duplicates).toEqual([]);
	});

	it("keeps screenshot-reported generated spell families mechanically distinct", () => {
		const names = [
			"Aetheric Beacon",
			"Aetheric Relay",
			"Aura Lens",
			"Crowd Chorus",
			"Mending Pulse",
			"Mending Thread",
		];
		const selected = names.map((name) => {
			const spell = spells.find((entry) => entry.name === name);
			if (!spell) {
				throw new Error(`${name} should exist in generated spell catalog`);
			}
			return spell;
		});
		const unique = new Set(selected.map(spellFunctionalFingerprint));
		expect(unique.size).toBe(names.length);
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

	it("does not use forbidden source or role terminology", () => {
		const offenders = spells.filter((spell) =>
			FORBIDDEN_SPELL_TERMS.some((pattern) =>
				pattern.test(JSON.stringify(spell)),
			),
		);
		expect(offenders.map((spell) => spell.id)).toEqual([]);
	});

	it("every supplemental spell declares explicit class eligibility", () => {
		const missingClasses = spells_supplemental.filter(
			(spell) => !Array.isArray(spell.classes) || spell.classes.length === 0,
		);
		expect(missingClasses.map((spell) => spell.id)).toEqual([]);
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

	it("normalizes higher-rank text to higher_levels without duplicate aliases", () => {
		const offenders = spells.filter(
			(spell) =>
				(spell as unknown as Record<string, unknown>).atHigherLevels !==
				undefined,
		);
		expect(offenders.map((spell) => spell.id)).toEqual([]);
	});

	it("does not mirror top-level spell metadata inside mechanics", () => {
		const mirroredKeys = [
			"attack",
			"saving_throw",
			"duration",
			"range",
			"type",
			"action",
			"ability",
			"save",
			"dc",
			"save_dc",
		];
		const offenders = spells.flatMap((spell) => {
			const mechanics = (spell as unknown as Record<string, unknown>)
				.mechanics as Record<string, unknown> | undefined;
			if (!mechanics) return [];
			return mirroredKeys
				.filter((key) => mechanics[key] !== undefined)
				.map((key) => `${spell.id}:${key}`);
		});
		expect(offenders).toEqual([]);
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
