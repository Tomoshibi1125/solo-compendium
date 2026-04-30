/**
 * Regression tests for the long-rest concentration cleanup (DDB parity #15).
 *
 * The page model's `handleLongRest` flow drops concentration via two paths:
 *   1. In-memory drop through `useConcentration.drop()`.
 *   2. DB cleanup of `character_active_spells` rows where `concentration=true`
 *      via `useRemoveConcentrationSpells` mutation.
 *
 * The pure helpers below back up both paths and are unit-testable without
 * the React layer: `dropConcentration` filters the in-memory active-spell
 * list by caster, returning the cleaned list and the dropped IDs.
 */
import { describe, expect, it } from "vitest";
import {
	type ActiveSpellEffectEntry,
	createActiveSpellEffect,
	dropConcentration,
} from "@/lib/spellEffectPipeline";

const FROZEN_TS = "2026-01-01T00:00:00.000Z";

function makeEffect(
	overrides: Partial<ActiveSpellEffectEntry> & {
		spellName: string;
		casterId: string;
	},
): ActiveSpellEffectEntry {
	const base = createActiveSpellEffect(
		overrides.spellName,
		overrides.casterId,
		overrides.targetId ?? overrides.casterId,
		overrides.concentration ?? true,
		overrides.durationRounds ?? 100,
	);
	// Lock the timestamp so id-comparison is deterministic.
	return { ...base, ...overrides, appliedAt: FROZEN_TS };
}

describe("dropConcentration on long rest (DDB parity #15)", () => {
	it("returns the same list and empty drops for an empty input", () => {
		const result = dropConcentration([], "caster-1");
		expect(result.updated).toEqual([]);
		expect(result.dropped).toEqual([]);
	});

	it("drops only concentration spells from the matching caster", () => {
		const spells = [
			makeEffect({
				spellName: "bless",
				casterId: "caster-1",
				concentration: true,
				id: "bless-1",
			}),
			makeEffect({
				spellName: "shield of faith",
				casterId: "caster-1",
				concentration: true,
				id: "sof-1",
			}),
			makeEffect({
				spellName: "mage armor",
				casterId: "caster-1",
				concentration: false,
				id: "ma-1",
			}),
		];
		const result = dropConcentration(spells, "caster-1");

		// Both concentration buffs dropped.
		expect(result.dropped.sort()).toEqual(["bless-1", "sof-1"].sort());
		// Mage Armor (non-concentration) survives.
		expect(result.updated).toHaveLength(1);
		expect(result.updated[0].spellName).toBe("mage armor");
	});

	it("does NOT drop another caster's concentration spells", () => {
		const spells = [
			makeEffect({
				spellName: "bless",
				casterId: "caster-1",
				concentration: true,
				id: "self-bless",
			}),
			makeEffect({
				spellName: "haste",
				casterId: "caster-2",
				concentration: true,
				id: "ally-haste",
			}),
		];
		const result = dropConcentration(spells, "caster-1");

		expect(result.dropped).toEqual(["self-bless"]);
		// Ally's haste persists — long rest of caster-1 doesn't end caster-2's spells.
		expect(result.updated).toHaveLength(1);
		expect(result.updated[0].id).toBe("ally-haste");
	});

	it("does not mutate the input array", () => {
		const spells = [
			makeEffect({
				spellName: "bless",
				casterId: "c",
				concentration: true,
				id: "x",
			}),
		];
		const snapshot = JSON.stringify(spells);
		dropConcentration(spells, "c");
		expect(JSON.stringify(spells)).toBe(snapshot);
	});

	it("preserves order of surviving spells", () => {
		const spells = [
			makeEffect({
				spellName: "mage armor",
				casterId: "c",
				concentration: false,
				id: "ma",
			}),
			makeEffect({
				spellName: "bless",
				casterId: "c",
				concentration: true,
				id: "bless",
			}),
			makeEffect({
				spellName: "longstrider",
				casterId: "c",
				concentration: false,
				id: "ls",
			}),
		];
		const result = dropConcentration(spells, "c");
		expect(result.updated.map((s) => s.id)).toEqual(["ma", "ls"]);
	});

	it("handles a caster with NO concentration spells gracefully", () => {
		const spells = [
			makeEffect({
				spellName: "mage armor",
				casterId: "c",
				concentration: false,
				id: "ma",
			}),
		];
		const result = dropConcentration(spells, "c");
		expect(result.dropped).toEqual([]);
		expect(result.updated).toHaveLength(1);
	});
});
