import { describe, expect, it } from "vitest";
import {
	type ActiveSpellRow,
	activeSpellsToCustomModifiers,
} from "@/hooks/useCharacterActiveSpells";
import { buildActiveSpellEffectEntry } from "@/hooks/useSpellCasting";
import type { Json } from "@/integrations/supabase/types";
import type { SpellModifier } from "@/lib/spellEffectPipeline";

const makeRow = (
	spellName: string,
	effects: SpellModifier[],
	overrides: Partial<ActiveSpellRow> = {},
): ActiveSpellRow =>
	({
		id: overrides.id ?? `row-${spellName}`,
		character_id: overrides.character_id ?? "char-1",
		spell_id: overrides.spell_id ?? spellName.toLowerCase(),
		spell_name: spellName,
		level: overrides.level ?? 1,
		concentration: overrides.concentration ?? false,
		duration_value: overrides.duration_value ?? 10,
		duration_type: overrides.duration_type ?? "rounds",
		effects: effects as unknown as Json[],
		cast_at: overrides.cast_at ?? new Date().toISOString(),
		created_at: overrides.created_at ?? new Date().toISOString(),
	}) as ActiveSpellRow;

describe("buildActiveSpellEffectEntry (DDB / Foundry parity)", () => {
	it("returns null for unknown spell names", () => {
		const result = buildActiveSpellEffectEntry(
			"Unknown Magic Missile Variant",
			"caster-1",
			"target-1",
			false,
			null,
		);
		expect(result).toBeNull();
	});

	it("produces an entry for Bless with attack/save bonuses", () => {
		const result = buildActiveSpellEffectEntry(
			"bless",
			"caster-1",
			"target-1",
			true,
			10,
		);
		expect(result).not.toBeNull();
		expect(result?.spellName).toBe("bless");
		expect(result?.concentration).toBe(true);
		expect(result?.durationRounds).toBe(10);
		expect(result?.effects.length).toBeGreaterThan(0);
		// Bless has attack_rolls and saving_throws targets
		const targets = result?.effects.map((e) => e.target) ?? [];
		expect(targets).toContain("attack_rolls");
		expect(targets).toContain("saving_throws");
	});

	it("preserves caster/target ids", () => {
		const result = buildActiveSpellEffectEntry(
			"shield of faith",
			"caster-7",
			"target-13",
			true,
			100,
		);
		expect(result?.casterId).toBe("caster-7");
		expect(result?.targetId).toBe("target-13");
	});

	it("is case-insensitive on spell name lookup", () => {
		const lower = buildActiveSpellEffectEntry("shield", "c", "t", false, 10);
		const upper = buildActiveSpellEffectEntry("SHIELD", "c", "t", false, 10);
		expect(lower).not.toBeNull();
		expect(upper).not.toBeNull();
		expect(lower?.effects).toEqual(upper?.effects);
	});
});

describe("activeSpellsToCustomModifiers projection", () => {
	it("returns an empty array for no rows", () => {
		expect(activeSpellsToCustomModifiers([])).toEqual([]);
	});

	it("projects an AC bonus (Shield of Faith)", () => {
		const rows = [
			makeRow("Shield of Faith", [{ target: "ac", value: 2, type: "bonus" }]),
		];
		const mods = activeSpellsToCustomModifiers(rows);
		expect(mods).toHaveLength(1);
		expect(mods[0]).toMatchObject({
			type: "ac_bonus",
			value: 2,
			source: "Spell: Shield of Faith",
			enabled: true,
		});
	});

	it("projects penalty effects with negative values", () => {
		const rows = [
			makeRow("Bane", [{ target: "saving_throws", value: 3, type: "penalty" }]),
		];
		const mods = activeSpellsToCustomModifiers(rows);
		expect(mods).toHaveLength(1);
		expect(mods[0]).toMatchObject({
			type: "save_bonus",
			value: -3,
			source: "Spell: Bane",
		});
	});

	it("projects advantage onto attack/save/skill targets", () => {
		const rows = [
			makeRow("Heroism", [
				{ target: "saving_throws", value: 0, type: "advantage" },
			]),
		];
		const mods = activeSpellsToCustomModifiers(rows);
		expect(mods).toHaveLength(1);
		expect(mods[0]).toMatchObject({
			type: "advantage",
			target: "save",
		});
	});

	it("projects disadvantage on attack rolls (Faerie Fire-style)", () => {
		const rows = [
			makeRow("Faerie Fire", [
				{ target: "attack_rolls", value: 0, type: "disadvantage" },
			]),
		];
		const mods = activeSpellsToCustomModifiers(rows);
		expect(mods[0]).toMatchObject({
			type: "disadvantage",
			target: "attack",
		});
	});

	it("skips 'set' effects (cannot be expressed as flat modifiers)", () => {
		const rows = [
			makeRow("Mage Armor", [{ target: "ac", value: 13, type: "set" }]),
		];
		expect(activeSpellsToCustomModifiers(rows)).toEqual([]);
	});

	it("aggregates effects across multiple rows", () => {
		const rows = [
			makeRow("Bless", [
				{ target: "attack_rolls", value: 3, type: "bonus" },
				{ target: "saving_throws", value: 3, type: "bonus" },
			]),
			makeRow("Haste", [
				{ target: "ac", value: 2, type: "bonus" },
				{ target: "speed", value: 30, type: "bonus" },
			]),
		];
		const mods = activeSpellsToCustomModifiers(rows);
		expect(mods).toHaveLength(4);
		expect(mods.map((m) => m.type).sort()).toEqual(
			["ac_bonus", "attack_bonus", "save_bonus", "speed"].sort(),
		);
	});

	it("projects ability score bonuses (Enhance Ability-style)", () => {
		const rows = [
			makeRow("Enhance Ability", [{ target: "str", value: 2, type: "bonus" }]),
		];
		const mods = activeSpellsToCustomModifiers(rows);
		expect(mods[0]).toMatchObject({
			type: "ability_bonus",
			target: "STR",
			value: 2,
		});
	});

	it("projects a per-ability save bonus with uppercase ability target", () => {
		const rows = [
			makeRow("Resistance", [{ target: "vit_save", value: 1, type: "bonus" }]),
		];
		const mods = activeSpellsToCustomModifiers(rows);
		expect(mods[0]).toMatchObject({
			type: "save",
			target: "VIT",
			value: 1,
		});
	});

	it("generates unique IDs per (spell, target, index) tuple", () => {
		const rows = [
			makeRow("Bless", [
				{ target: "attack_rolls", value: 3, type: "bonus" },
				{ target: "saving_throws", value: 3, type: "bonus" },
			]),
		];
		const mods = activeSpellsToCustomModifiers(rows);
		const ids = mods.map((m) => m.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(ids[0]).toContain("spell:bless:");
	});

	it("falls back to empty when row.effects is null", () => {
		const rows = [makeRow("Custom", [])];
		// Simulate older rows where effects column is null (pre-pipeline data).
		(rows[0] as unknown as { effects: Json[] | null }).effects = null;
		expect(activeSpellsToCustomModifiers(rows)).toEqual([]);
	});
});
