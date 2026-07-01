/**
 * Regent job-parity guarantees.
 *
 * Regents are Warden-unlocked class overlays that should be as mechanically
 * comprehensive as jobs — a complete level-1..20 feature progression — while
 * remaining OUT of character creation (they are a post-creation unlock).
 *
 * `getRegentLeveledFeatures` normalizes each regent to a leveled feature list,
 * deriving from `progression_table` + `abilities`/`features` for regents whose
 * content isn't already curated into `class_features`. These tests fail loudly
 * if a regent regresses to partial coverage or if a regent leaks into the
 * job-selectable pool used at creation.
 */

import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { regents } from "@/data/compendium/regents";
import {
	calculateTotalChoices,
	getLevelUpChoiceDeltas,
} from "@/lib/choiceCalculations";
import {
	getRegentFeaturesAtLevel,
	getRegentLeveledFeatures,
	regentToChoiceSource,
} from "@/lib/regentProgression";

describe("regent roster", () => {
	it("has the 12 canonical rank-S regents", () => {
		expect(regents).toHaveLength(12);
		expect(regents.every((r) => r.rank === "S")).toBe(true);
	});
});

describe("regent leveled-feature parity (comprehensive as jobs, 1-20)", () => {
	for (const regent of regents) {
		it(`${regent.name}: leveled features span 1..20 with no empty descriptions`, () => {
			const features = getRegentLeveledFeatures(regent);
			expect(
				features.length,
				`${regent.name}: must have leveled features`,
			).toBeGreaterThan(0);

			const levels = new Set(features.map((f) => f.level));
			expect(
				levels.has(1),
				`${regent.name}: must grant a level-1 feature`,
			).toBe(true);
			expect(
				Math.max(...features.map((f) => f.level)),
				`${regent.name}: progression must reach level 20`,
			).toBe(20);

			for (const f of features) {
				expect(
					f.level,
					`${regent.name}: level in 1..20`,
				).toBeGreaterThanOrEqual(1);
				expect(f.level).toBeLessThanOrEqual(20);
				expect(
					f.description.trim().length,
					`${regent.name}: "${f.name}" needs a description`,
				).toBeGreaterThan(0);
				expect(
					["passive", "active", "action", "bonus-action", "reaction"],
					`${regent.name}: "${f.name}" valid type`,
				).toContain(f.type);
			}
		});
	}

	it("resolves derived feature names to their real ability/feature descriptions (join works)", () => {
		// Radiant keeps its content in `features`/`abilities` + progression_table.
		const radiant = regents.find((r) => r.id === "radiant_regent");
		expect(radiant).toBeDefined();
		if (!radiant) return;
		const l1 = getRegentFeaturesAtLevel(radiant, 1);
		const whiteFlame = l1.find((f) => f.name === "White Flame Mastery");
		expect(whiteFlame).toBeDefined();
		// The description must come from the real `features` entry, not the
		// generic "manifestation of the ... Regent" fallback.
		expect(whiteFlame?.description).toContain("Immunity to fire");
	});

	it("keeps curated regents (Umbral) authoritative rather than re-deriving", () => {
		const umbral = regents.find((r) => r.id === "umbral_regent");
		expect(umbral).toBeDefined();
		if (!umbral) return;
		const derived = getRegentLeveledFeatures(umbral);
		// Umbral's curated class_features are the source; a curated L1 name survives.
		expect(
			derived.some((f) => f.name === "Umbral Command" && f.level === 1),
		).toBe(true);
	});
});

describe("regent full independent progression feeds the choice engine", () => {
	it("a caster regent contributes cantrip + spell counts at level-up", () => {
		const umbral = regents.find((r) => r.id === "umbral_regent");
		expect(umbral).toBeDefined();
		if (!umbral) return;
		const source = regentToChoiceSource(umbral);
		const l1 = calculateTotalChoices(null, null, [source], 1);
		expect(l1.cantrips).toBe(4);
		expect(l1.spells).toBe(6);
		const l20 = calculateTotalChoices(null, null, [source], 20);
		expect(l20.cantrips).toBe(5);
		expect(l20.spells).toBe(27);
	});

	it("a martial regent contributes power + technique counts", () => {
		const steel = regents.find((r) => r.id === "steel_regent");
		expect(steel).toBeDefined();
		if (!steel) return;
		const source = regentToChoiceSource(steel);
		const l1 = calculateTotalChoices(null, null, [source], 1);
		expect(l1.powers).toBe(2);
		expect(l1.techniques).toBe(2);
		expect(l1.spells).toBe(0);
	});

	it("stacks regent progression on top of the base job (independent overlay)", () => {
		const mage = jobs.find((j) => j.id === "mage");
		const umbral = regents.find((r) => r.id === "umbral_regent");
		if (!mage || !umbral) return;
		const jobSource = {
			name: mage.name,
			cantrips_known: mage.spellcasting?.cantripsKnown,
			spellbook: mage.spellbook,
		};
		const withoutRegent = calculateTotalChoices(jobSource, null, [], 3);
		const withRegent = calculateTotalChoices(
			jobSource,
			null,
			[regentToChoiceSource(umbral)],
			3,
		);
		// The regent adds its own cantrips + spells on top of the Mage's.
		expect(withRegent.cantrips).toBeGreaterThan(withoutRegent.cantrips);
		expect(withRegent.spells).toBeGreaterThan(withoutRegent.spells);
	});

	it("grants regent picks incrementally as the character levels", () => {
		const umbral = regents.find((r) => r.id === "umbral_regent");
		if (!umbral) return;
		const deltas = getLevelUpChoiceDeltas(
			null,
			null,
			[regentToChoiceSource(umbral)],
			1,
			2,
		);
		// Umbral spells_known 6 -> 7 across levels 1->2.
		expect(deltas.spells).toBe(1);
	});
});

describe("regents stay out of character creation", () => {
	it("no regent id collides with a selectable job id", () => {
		const jobIds = new Set(jobs.map((j) => j.id));
		for (const regent of regents) {
			expect(
				jobIds.has(regent.id),
				`${regent.name}: must not be selectable as a job`,
			).toBe(false);
		}
	});

	it("every regent is an ascendant-class-overlay (post-creation unlock, not a job)", () => {
		for (const regent of regents) {
			expect(regent.type, `${regent.name}: type marks it an overlay`).toBe(
				"ascendant-class-overlay",
			);
		}
	});
});
