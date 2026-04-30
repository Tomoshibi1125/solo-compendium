import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { paths } from "@/data/compendium/paths";
import { calculateHPMax } from "@/lib/characterCalculations";
import {
	buildLevelUpGatingSummary,
	getASILevels,
	getAvailableSpellSlots,
	getCantripLimit,
	getMaxAccessiblePowerLevel,
	type PathUnlockMeta,
} from "@/lib/levelGating";
import { calculateProficiencyBonusForLevel } from "@/lib/levelUpCalculations";
import {
	JOB_PROGRESSION_FIXTURES,
	LEVELS_1_TO_20,
} from "./fixtures/jobProgressionFixtures";

function parseHitDieSize(hitDie: string): number {
	const match = hitDie.match(/^1d(\d+)$/);
	if (!match) throw new Error(`Unsupported hit die format: ${hitDie}`);
	return Number(match[1]);
}

function fixturePaths(fixture: {
	jobId: string;
	jobName: string;
}): PathUnlockMeta[] {
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

describe("representative Job progression fixtures", () => {
	it.each(
		Object.values(JOB_PROGRESSION_FIXTURES),
	)("locks $category Job $jobName from creation through level 20", (fixture) => {
		const job = jobs.find((entry) => entry.id === fixture.jobId);
		expect(job?.name).toBe(fixture.jobName);
		expect(parseHitDieSize(job?.hitDie ?? "")).toBe(fixture.hitDieSize);

		const actualHp = LEVELS_1_TO_20.map((level) =>
			calculateHPMax(level, fixture.hitDieSize, fixture.vitModifier),
		);
		expect(actualHp).toEqual(fixture.hpByLevel);

		const actualProficiency = LEVELS_1_TO_20.map((level) =>
			calculateProficiencyBonusForLevel(level),
		);
		expect(actualProficiency).toEqual(fixture.proficiencyBonusByLevel);

		const actualMaxPower = LEVELS_1_TO_20.map((level) =>
			getMaxAccessiblePowerLevel(fixture.jobName, level),
		);
		expect(actualMaxPower).toEqual(fixture.maxPowerLevelByLevel);

		const actualCantrips = LEVELS_1_TO_20.map((level) =>
			getCantripLimit(fixture.jobName, level),
		);
		expect(actualCantrips).toEqual(fixture.cantripsKnownByLevel);
		expect(getASILevels(fixture.jobName)).toEqual(fixture.asiLevels);

		const pathOptions = fixturePaths(fixture);
		expect(pathOptions).toHaveLength(fixture.pathCount);
		expect(pathOptions.map((path) => path.pathName)).toEqual(fixture.pathNames);
		expect(new Set(pathOptions.map((path) => path.pathLevel))).toEqual(
			new Set([fixture.pathUnlockLevel]),
		);

		for (const [level, expectedSlots] of Object.entries(
			fixture.spellSlotsAtLevels,
		)) {
			expect(getAvailableSpellSlots(fixture.jobName, Number(level))).toEqual(
				expectedSlots,
			);
		}
	});

	it.each(
		Object.values(JOB_PROGRESSION_FIXTURES),
	)("summarizes prompts for $jobName at every level", (fixture) => {
		const pathOptions = fixturePaths(fixture);
		const summaries = LEVELS_1_TO_20.map((level) =>
			buildLevelUpGatingSummary(level, fixture.jobName, null, pathOptions, []),
		);

		expect(
			summaries
				.filter((summary) => summary.isPathUnlockLevel)
				.map((summary) => summary.level),
		).toEqual([fixture.pathUnlockLevel]);
		expect(
			summaries
				.filter((summary) => summary.isASILevel)
				.map((summary) => summary.level),
		).toEqual(fixture.asiLevels);
		expect(summaries.at(-1)?.asiCount).toBe(fixture.asiLevels.length);
		expect(summaries.at(-1)?.maxPowerLevel).toBe(
			fixture.maxPowerLevelByLevel.at(-1),
		);
		expect(summaries.at(-1)?.cantripLimit).toBe(
			fixture.cantripsKnownByLevel.at(-1),
		);
	});
});
