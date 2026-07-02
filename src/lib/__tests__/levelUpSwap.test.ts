/**
 * Level-up retraining eligibility (DDB parity: known-repertoire swaps).
 *
 * Known casters (Esper/Contractor/Idol/Stalker) may swap a known spell;
 * "known"-mode power/technique jobs may swap those. Prepared casters get no
 * spell swap (they re-prepare daily), and at-will kinds are never swapped.
 */
import { describe, expect, it } from "vitest";
import { getSwappableKinds } from "@/lib/levelUpSwap";

const kinds = (job: string, level: number) =>
	getSwappableKinds(job, level).map((option) => option.kind);

describe("getSwappableKinds", () => {
	it("known full casters swap spells only", () => {
		expect(kinds("Esper", 5)).toEqual(["spell"]);
		expect(kinds("Idol", 5)).toEqual(["spell"]);
		expect(kinds("Contractor", 5)).toEqual(["spell"]);
	});

	it("prepared casters get no spell swap", () => {
		expect(kinds("Mage", 5)).not.toContain("spell");
		expect(kinds("Herald", 5)).not.toContain("spell");
	});

	it("martials with known technique repertoires swap techniques", () => {
		expect(kinds("Destroyer", 5)).toContain("technique");
		expect(kinds("Berserker", 5)).toContain("technique");
		// Powers are at-will stances for martials — never swapped.
		expect(kinds("Destroyer", 5)).not.toContain("power");
	});

	it("Stalker (known half-caster) swaps spells only once spells unlock", () => {
		// Level 1: Stalker knows 0 spells (ranger analog) — no spell swap yet.
		expect(kinds("Stalker", 1)).not.toContain("spell");
		expect(kinds("Stalker", 2)).toContain("spell");
		// Stalker knows (not prepares) its powers.
		expect(kinds("Stalker", 2)).toContain("power");
	});

	it("handles blank jobs", () => {
		expect(kinds("", 5)).toEqual([]);
		expect(getSwappableKinds(null, 5)).toEqual([]);
	});
});
