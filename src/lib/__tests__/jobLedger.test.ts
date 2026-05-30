/**
 * Parametric tests for the new `levelChoices` ledger + RA Fighting Style
 * catalog + Mage/Revenant spellbook fields + martial/hybrid powersKnown /
 * techniquesKnown progression + Contractor spellsKnown.
 *
 * These guarantee §2 of the DDB parity plan stays intact — if a future edit
 * drops `levelChoices` from a job or corrupts a progression array, these tests
 * will fail loudly.
 */

import { describe, expect, expectTypeOf, it } from "vitest";
import {
	FIGHTING_STYLES,
	type FightingStyle,
	type FightingStyleSource,
	getAllFightingStyleIds,
	getFightingStyleById,
	getFightingStylesForJob,
	migrateLegacyFightingStyleId,
} from "@/data/compendium/fightingStyles";
import { jobs } from "@/data/compendium/jobs";
import {
	calculateTotalChoices,
	getLevelUpChoiceDeltas,
	getLevelUpLedgerEntries,
} from "@/lib/choiceCalculations";

const MARTIAL_HYBRID_JOB_IDS = new Set([
	"destroyer",
	"berserker",
	"assassin",
	"striker",
	"holy-knight",
	"technomancer",
	"stalker",
	// Revenant is now a hybrid half-caster (drain-tank rework): it gains
	// powers + techniques alongside spells, so it carries both progression arrays.
	"revenant",
]);

const FS_EXPECTED_IDS = [
	"defense",
	"dueling",
	"great-weapon-fighting",
	"protection",
	"two-weapon-fighting",
	"gunslinger",
	"suppressive-fire",
	"burst-discipline",
	"anomaly-hunter",
	"lattice-infused-striking",
	"striker-stance",
];

describe("RA Fighting Style catalog", () => {
	it("exports exactly the 11 curated styles", () => {
		expect(FIGHTING_STYLES).toHaveLength(11);
		const ids = FIGHTING_STYLES.map((s) => s.id).sort();
		expect(ids).toEqual([...FS_EXPECTED_IDS].sort());
		expect(getAllFightingStyleIds().sort()).toEqual(
			[...FS_EXPECTED_IDS].sort(),
		);
	});

	it("marks the 5 D&D classics correctly and the 6 RA-native correctly", () => {
		const classics = FIGHTING_STYLES.filter((s) => s.source === "dnd-baseline");
		const native = FIGHTING_STYLES.filter((s) => s.source === "ra-native");
		expect(classics.map((s) => s.id).sort()).toEqual([
			"defense",
			"dueling",
			"great-weapon-fighting",
			"protection",
			"two-weapon-fighting",
		]);
		expect(native.map((s) => s.id).sort()).toEqual([
			"anomaly-hunter",
			"burst-discipline",
			"gunslinger",
			"lattice-infused-striking",
			"striker-stance",
			"suppressive-fire",
		]);
		const nativeSource: FightingStyleSource = "ra-native";
		expect(native.every((style) => style.source === nativeSource)).toBe(true);
	});

	it("looks up styles by id with the exported catalog type", () => {
		const defense = getFightingStyleById("defense");
		expectTypeOf(defense).toEqualTypeOf<FightingStyle | undefined>();
		expect(defense?.name).toBe("Defense");
		expect(getFightingStyleById("missing-style")).toBeUndefined();
	});

	it("gates Protection on shield proficiency", () => {
		const withShield = getFightingStylesForJob(["Light armor", "Shields"]);
		const withoutShield = getFightingStylesForJob(["Light armor"]);
		expect(withShield.some((s) => s.id === "protection")).toBe(true);
		expect(withoutShield.some((s) => s.id === "protection")).toBe(false);
	});

	it("migrates legacy Archery and Natural Explorer selections", () => {
		expect(migrateLegacyFightingStyleId("Archery")).toBe("gunslinger");
		expect(migrateLegacyFightingStyleId("archery")).toBe("gunslinger");
		expect(migrateLegacyFightingStyleId("Natural Explorer")).toBe(
			"anomaly-hunter",
		);
		expect(migrateLegacyFightingStyleId("defense")).toBe("defense");
	});
});

describe("levelChoices ledger parity per job", () => {
	for (const job of jobs) {
		it(`${job.name}: has a populated levelChoices ledger`, () => {
			expect(
				Array.isArray(job.levelChoices),
				`${job.name}: levelChoices must be an array`,
			).toBe(true);
			expect(
				(job.levelChoices ?? []).length,
				`${job.name}: levelChoices must not be empty`,
			).toBeGreaterThan(0);
		});

		it(`${job.name}: every ledger entry has level >= 1, count >= 1, and a source`, () => {
			for (const entry of job.levelChoices ?? []) {
				expect(entry.level, `${job.name}: level >= 1`).toBeGreaterThanOrEqual(
					1,
				);
				expect(entry.level, `${job.name}: level <= 20`).toBeLessThanOrEqual(20);
				expect(entry.count, `${job.name}: count >= 1`).toBeGreaterThanOrEqual(
					1,
				);
				expect(entry.source, `${job.name}: source non-empty`).toBeTruthy();
			}
		});
	}

	it("Mage and Revenant both have spellbook configured (6 at L1, +2/level)", () => {
		const mage = jobs.find((j) => j.id === "mage");
		const revenant = jobs.find((j) => j.id === "revenant");
		expect(mage?.spellbook).toEqual({
			atCreation: 6,
			perLevel: 2,
			label: "Arcane Codex",
		});
		expect(revenant?.spellbook).toEqual({
			atCreation: 6,
			perLevel: 2,
			label: "Reaper's Ledger",
		});
	});

	it("martial + hybrid jobs all have powersKnown and techniquesKnown of length 20", () => {
		for (const job of jobs) {
			if (!MARTIAL_HYBRID_JOB_IDS.has(job.id)) continue;
			expect(
				job.powersKnown?.length,
				`${job.name}: powersKnown length 20`,
			).toBe(20);
			expect(
				job.techniquesKnown?.length,
				`${job.name}: techniquesKnown length 20`,
			).toBe(20);
		}
	});

	it("Contractor has spellsKnown progression (pact progression, length 20)", () => {
		const contractor = jobs.find((j) => j.id === "contractor");
		expect(contractor?.spellcasting?.spellsKnown?.length).toBe(20);
		expect(contractor?.spellcasting?.spellsKnown?.[0]).toBe(2);
	});

	it("Herald Mandate classFeature is at level 1 (not 3)", () => {
		const herald = jobs.find((j) => j.id === "herald");
		const mandate = herald?.classFeatures?.find((f) => f.name === "Mandate");
		expect(mandate).toBeDefined();
		expect(mandate?.level).toBe(1);
	});

	it("Idol's Specialist Training was renamed to Frequency Mastery", () => {
		const idol = jobs.find((j) => j.id === "idol");
		expect(
			idol?.classFeatures?.some((f) => f.name === "Frequency Mastery"),
		).toBe(true);
		expect(
			idol?.classFeatures?.some((f) => f.name === "Specialist Training"),
			"Idol should not have a Specialist Training classFeature",
		).toBe(false);
		expect(idol?.jobTraits?.some((t) => t.name === "Frequency Mastery")).toBe(
			true,
		);
	});

	it("Assassin retains its Specialist Training classFeature (RA-canonical)", () => {
		const assassin = jobs.find((j) => j.id === "assassin");
		expect(
			assassin?.classFeatures?.some((f) => f.name === "Specialist Training"),
		).toBe(true);
	});

	it("Destroyer L1 and Holy Knight L2 both gained a Fighting Style class feature", () => {
		const destroyer = jobs.find((j) => j.id === "destroyer");
		const holyKnight = jobs.find((j) => j.id === "holy-knight");
		const destroyerFS = destroyer?.classFeatures?.find(
			(f) => f.name === "Fighting Style",
		);
		const holyKnightFS = holyKnight?.classFeatures?.find(
			(f) => f.name === "Fighting Style",
		);
		expect(destroyerFS?.level).toBe(1);
		expect(holyKnightFS?.level).toBe(2);
	});
});

describe("calculateTotalChoices with ledger-first inputs", () => {
	it("Destroyer L1: 2 powers + 2 techniques + 1 fighting style from ledger", () => {
		const destroyer = jobs.find((j) => j.id === "destroyer");
		const totals = calculateTotalChoices(
			{
				name: destroyer?.name,
				level_choices: destroyer?.levelChoices,
				powers_known: destroyer?.powersKnown,
				techniques_known: destroyer?.techniquesKnown,
			},
			null,
			[],
			1,
		);
		expect(totals.powers).toBe(2);
		expect(totals.techniques).toBe(2);
		expect(totals.fightingStyles).toBe(1);
	});

	it("Mage L1: 3 cantrips + 6 spellbook inscriptions", () => {
		const mage = jobs.find((j) => j.id === "mage");
		const totals = calculateTotalChoices(
			{
				name: mage?.name,
				level_choices: mage?.levelChoices,
				cantrips_known: mage?.spellcasting?.cantripsKnown,
				spellbook: mage?.spellbook,
			},
			null,
			[],
			1,
		);
		expect(totals.cantrips).toBe(3);
		expect(totals.spellbookInscriptions).toBe(6);
	});

	it("Mage L5: 4 cantrips + 14 spellbook inscriptions (6 + 4*2)", () => {
		const mage = jobs.find((j) => j.id === "mage");
		const totals = calculateTotalChoices(
			{
				name: mage?.name,
				level_choices: mage?.levelChoices,
				cantrips_known: mage?.spellcasting?.cantripsKnown,
				spellbook: mage?.spellbook,
			},
			null,
			[],
			5,
		);
		expect(totals.cantrips).toBe(4);
		expect(totals.spellbookInscriptions).toBe(14);
	});

	it("Esper L3: 4 cantrips + 2 spells + 2 reality sculpting", () => {
		const esper = jobs.find((j) => j.id === "esper");
		const totals = calculateTotalChoices(
			{
				name: esper?.name,
				level_choices: esper?.levelChoices,
				cantrips_known: esper?.spellcasting?.cantripsKnown,
				spells_known: esper?.spellcasting?.spellsKnown,
			},
			null,
			[],
			3,
		);
		expect(totals.cantrips).toBe(4);
		expect(totals.realitySculptings).toBe(2);
	});

	it("Idol L10: frequencyMasteries = 4, crossFrequencyAccesses = 2", () => {
		const idol = jobs.find((j) => j.id === "idol");
		const totals = calculateTotalChoices(
			{
				name: idol?.name,
				level_choices: idol?.levelChoices,
			},
			null,
			[],
			10,
		);
		expect(totals.frequencyMasteries).toBe(4); // 2 at L3 + 2 at L10
		expect(totals.crossFrequencyAccesses).toBe(2); // 2 at L10
	});

	it("Contractor L20: 8 contract invocations (2+1+1+1+1+1+1), 1 pact boon", () => {
		const contractor = jobs.find((j) => j.id === "contractor");
		const totals = calculateTotalChoices(
			{
				name: contractor?.name,
				level_choices: contractor?.levelChoices,
				cantrips_known: contractor?.spellcasting?.cantripsKnown,
				spells_known: contractor?.spellcasting?.spellsKnown,
			},
			null,
			[],
			20,
		);
		// L2: 2, L5/7/9/12/15/18: 1 each = 2 + 6 = 8 total.
		expect(totals.contractInvocations).toBe(8);
		expect(totals.pactBoons).toBe(1);
	});
});

describe("getLevelUpChoiceDeltas", () => {
	it("returns empty for no level advance", () => {
		const destroyer = jobs.find((j) => j.id === "destroyer");
		const deltas = getLevelUpChoiceDeltas(
			{
				level_choices: destroyer?.levelChoices,
				powers_known: destroyer?.powersKnown,
				techniques_known: destroyer?.techniquesKnown,
			},
			null,
			[],
			5,
			5,
		);
		expect(Object.keys(deltas)).toHaveLength(0);
	});

	it("Destroyer L4 → L5: +1 power and +1 technique from progression array", () => {
		const destroyer = jobs.find((j) => j.id === "destroyer");
		const deltas = getLevelUpChoiceDeltas(
			{
				level_choices: destroyer?.levelChoices,
				powers_known: destroyer?.powersKnown,
				techniques_known: destroyer?.techniquesKnown,
			},
			null,
			[],
			4,
			5,
		);
		expect(deltas.powers).toBe(1);
		expect(deltas.techniques).toBe(1);
	});

	it("Stalker L1 → L2: fighting style +1 fires on level-up", () => {
		const stalker = jobs.find((j) => j.id === "stalker");
		const deltas = getLevelUpChoiceDeltas(
			{ level_choices: stalker?.levelChoices },
			null,
			[],
			1,
			2,
		);
		expect(deltas.fightingStyles).toBe(1);
	});

	it("includes path feature picks when a character chooses an already-unlocked path", () => {
		const pathSource = {
			features: [
				{
					level: 3,
					name: "Weave-Combat Attunement",
					description:
						"Learn 2 Mage cantrips and 3 Mage spells (abjuration/evocation).",
				},
			],
		};

		const newlyChosenPathDeltas = getLevelUpChoiceDeltas(
			{},
			pathSource,
			[],
			3,
			4,
			null,
		);
		const existingPathDeltas = getLevelUpChoiceDeltas(
			{},
			pathSource,
			[],
			3,
			4,
			pathSource,
		);

		expect(newlyChosenPathDeltas.cantrips).toBe(2);
		expect(newlyChosenPathDeltas.spells).toBe(3);
		expect(existingPathDeltas.cantrips).toBeUndefined();
		expect(existingPathDeltas.spells).toBeUndefined();
	});

	it("counts maneuver prose as technique choices for path features", () => {
		const totals = calculateTotalChoices(
			{},
			{
				features: [
					{
						level: 3,
						name: "Tactical Charge",
						description: "Learn 3 maneuvers, gain 4 tactical dice (d8).",
					},
				],
			},
			[],
			3,
		);

		expect(totals.techniques).toBe(3);
	});
});

describe("getLevelUpLedgerEntries", () => {
	it("returns only entries in (prevLevel, newLevel]", () => {
		const stalker = jobs.find((j) => j.id === "stalker");
		const entries = getLevelUpLedgerEntries(
			{ level_choices: stalker?.levelChoices },
			1,
			6,
		);
		// Should include L2 fighting-style and L6 favored-terrain, but not L1 or L10.
		expect(entries.some((e) => e.type === "fighting-style")).toBe(true);
		expect(
			entries.some((e) => e.type === "favored-terrain" && e.level === 6),
		).toBe(true);
		expect(entries.every((e) => e.level > 1 && e.level <= 6)).toBe(true);
	});
});
