import { describe, expect, it } from "vitest";
import { paths } from "@/data/compendium/paths";
import { calculateHPMax } from "@/lib/characterCalculations";
import {
	buildLevelUpGatingSummary,
	getAvailableSpellSlots,
	type PathUnlockMeta,
} from "@/lib/levelGating";
import { calculateLevelUpScalarBumps } from "@/lib/levelUpCalculations";
import {
	JOB_PROGRESSION_FIXTURES,
	type JobProgressionFixture,
	LEVELS_1_TO_20,
} from "./fixtures/jobProgressionFixtures";

function pathOptionsFor(fixture: JobProgressionFixture): PathUnlockMeta[] {
	return paths
		.filter((path) => path.jobId === fixture.jobId)
		.map((path) => ({
			pathId: path.id,
			pathName: path.name,
			pathLevel: path.requirements.level,
			jobId: fixture.jobId,
			jobName: fixture.jobName,
		}));
}

function buildCreationToLevel20Snapshot(fixture: JobProgressionFixture) {
	const pathOptions = pathOptionsFor(fixture);
	return LEVELS_1_TO_20.map((level) => ({
		level,
		hpMax: calculateHPMax(level, fixture.hitDieSize, fixture.vitModifier),
		proficiencyBonus: calculateLevelUpScalarBumps(level).proficiency_bonus,
		spellSlots: getAvailableSpellSlots(fixture.jobName, level),
		gating: buildLevelUpGatingSummary(
			level,
			fixture.jobName,
			null,
			pathOptions,
			[],
		),
	}));
}

describe("creation-to-level20 progression locks", () => {
	it("exercises martial creation through level 20", () => {
		const fixture = JOB_PROGRESSION_FIXTURES.destroyer;
		const progression = buildCreationToLevel20Snapshot(fixture);

		expect(progression.map((level) => level.hpMax)).toEqual(fixture.hpByLevel);
		expect(progression.map((level) => level.proficiencyBonus)).toEqual(
			fixture.proficiencyBonusByLevel,
		);
		expect(progression.map((level) => level.gating.maxPowerLevel)).toEqual(
			fixture.maxPowerLevelByLevel,
		);
		expect(progression.map((level) => level.gating.cantripLimit)).toEqual(
			fixture.cantripsKnownByLevel,
		);
		expect(progression[0].spellSlots).toEqual(fixture.spellSlotsAtLevels[1]);
		expect(progression[19].spellSlots).toEqual(fixture.spellSlotsAtLevels[20]);
		expect(
			progression
				.filter((level) => level.gating.isPathUnlockLevel)
				.map((level) => level.level),
		).toEqual([fixture.pathUnlockLevel]);
		expect(
			progression
				.filter((level) => level.gating.isASILevel)
				.map((level) => level.level),
		).toEqual(fixture.asiLevels);
	});

	it("exercises caster creation through level 20", () => {
		const fixture = JOB_PROGRESSION_FIXTURES.mage;
		const progression = buildCreationToLevel20Snapshot(fixture);

		expect(progression.map((level) => level.hpMax)).toEqual(fixture.hpByLevel);
		expect(progression.map((level) => level.proficiencyBonus)).toEqual(
			fixture.proficiencyBonusByLevel,
		);
		expect(progression.map((level) => level.gating.maxPowerLevel)).toEqual(
			fixture.maxPowerLevelByLevel,
		);
		expect(progression.map((level) => level.gating.cantripLimit)).toEqual(
			fixture.cantripsKnownByLevel,
		);
		for (const [level, expectedSlots] of Object.entries(
			fixture.spellSlotsAtLevels,
		)) {
			expect(progression[Number(level) - 1].spellSlots).toEqual(expectedSlots);
		}
		expect(
			progression
				.filter((level) => level.gating.isPathUnlockLevel)
				.map((level) => level.level),
		).toEqual([fixture.pathUnlockLevel]);
		expect(
			progression
				.filter((level) => level.gating.isASILevel)
				.map((level) => level.level),
		).toEqual(fixture.asiLevels);
	});
});
