/**
 * Regent unlock-flow guarantees (Warden-gated grant → player 1-of-3 → catch-up).
 *
 * These cover the pure, DB-independent pieces of the rework:
 *   - regent-tagged quests span every rank (unlock can happen at any level);
 *   - the retroactive catch-up owes the FULL accumulated regent picks at the
 *     character's level (not a per-level delta);
 *   - the sheet's gestalt feature normalizer and the wizard's leveled-feature
 *     normalizer agree (single source of truth), so nothing is lost on the sheet.
 */

import { describe, expect, it } from "vitest";
import { getRegentUnlockQuests } from "@/data/compendium/quest-contracts";
import { regents } from "@/data/compendium/regents";
import { calculateTotalChoices } from "@/lib/choiceCalculations";
import { getGestaltClassFeatures } from "@/lib/regentGestalt";
import {
	getRegentLeveledFeatures,
	regentToChoiceSource,
} from "@/lib/regentProgression";
import type { Regent } from "@/lib/regentTypes";

describe("regent-tagged unlock quests", () => {
	it("exist and span multiple ranks (unlock can happen at any level)", () => {
		const quests = getRegentUnlockQuests();
		expect(quests.length).toBeGreaterThan(0);
		expect(quests.every((q) => q.grantsRegentUnlock === true)).toBe(true);
		const ranks = new Set(quests.map((q) => q.rank));
		// Not endgame-only: at least a low rank and a high rank are tagged.
		expect(ranks.size).toBeGreaterThanOrEqual(4);
		expect(ranks.has("E")).toBe(true);
		expect(ranks.has("S")).toBe(true);
	});
});

describe("retroactive catch-up owes the full accumulated picks at the level", () => {
	const owedAt = (regent: Regent, level: number) => {
		const totals = calculateTotalChoices(
			null,
			null,
			[regentToChoiceSource(regent)],
			level,
		);
		return {
			powers: totals.powers ?? 0,
			techniques: totals.techniques ?? 0,
			cantrips: totals.cantrips ?? 0,
			spells: totals.spells ?? 0,
		};
	};

	it("a caster regent unlocked at level 20 owes its full L20 cantrip+spell counts", () => {
		const umbral = regents.find((r) => r.id === "umbral_regent");
		expect(umbral).toBeDefined();
		if (!umbral) return;
		// Full accumulated totals at the character's level — NOT a 19→20 delta.
		expect(owedAt(umbral, 1)).toMatchObject({ cantrips: 4, spells: 6 });
		expect(owedAt(umbral, 20)).toMatchObject({ cantrips: 5, spells: 27 });
	});

	it("a martial regent owes its full power+technique counts", () => {
		const steel = regents.find((r) => r.id === "steel_regent");
		expect(steel).toBeDefined();
		if (!steel) return;
		const owed = owedAt(steel, 1);
		expect(owed.powers).toBe(2);
		expect(owed.techniques).toBe(2);
		expect(owed.spells).toBe(0);
	});
});

describe("sheet gestalt normalizer agrees with the wizard's leveled normalizer", () => {
	const featureNames = (rs: Regent[], level: number) =>
		new Set(
			getGestaltClassFeatures(rs, level).map((f) => f.name.toLowerCase()),
		);

	for (const id of ["umbral_regent", "steel_regent"]) {
		it(`${id}: gestalt surfaces every leveled feature (no content loss)`, () => {
			const regent = regents.find((r) => r.id === id);
			expect(regent).toBeDefined();
			if (!regent) return;
			const gestaltNames = featureNames([regent], 20);
			const leveled = getRegentLeveledFeatures(regent);
			expect(leveled.length).toBeGreaterThan(0);
			for (const f of leveled) {
				expect(
					gestaltNames.has(f.name.toLowerCase()),
					`${id}: "${f.name}" (level ${f.level}) must appear on the sheet`,
				).toBe(true);
			}
		});
	}

	it("gestalt gates by character level (a level-1 sheet omits high-tier features)", () => {
		const umbral = regents.find((r) => r.id === "umbral_regent");
		if (!umbral) return;
		const atOne = getGestaltClassFeatures([umbral], 1);
		expect(atOne.every((f) => f.level <= 1)).toBe(true);
		const atTwenty = getGestaltClassFeatures([umbral], 20);
		expect(atTwenty.length).toBeGreaterThan(atOne.length);
	});
});
