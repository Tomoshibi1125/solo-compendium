import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import {
	getCasterType,
	getSpellcastingAbility,
} from "@/lib/5eCharacterCalculations";
import {
	getMaxPowerLevelForJobAtLevel,
	getSpellProgressionForJob,
} from "@/lib/characterCreation";
import { getASILevels } from "@/lib/levelGating";
import { JOB_PROGRESSION_FIXTURES } from "./fixtures/jobProgressionFixtures";

describe("Job canon — coverage", () => {
	it("the fixture set covers all 14 canonical Rift Ascendant Jobs", () => {
		const fixtureJobIds = Object.values(JOB_PROGRESSION_FIXTURES)
			.map((f) => f.jobId)
			.sort();
		const canonicalJobIds = jobs.map((j) => j.id).sort();
		expect(fixtureJobIds).toEqual(canonicalJobIds);
	});

	it("every fixture's jobId resolves to a real static Job entry", () => {
		for (const fixture of Object.values(JOB_PROGRESSION_FIXTURES)) {
			const job = jobs.find((j) => j.id === fixture.jobId);
			expect(job, `Job ${fixture.jobId} missing from jobs.ts`).toBeDefined();
			expect(job?.name).toBe(fixture.jobName);
		}
	});
});

describe("Job canon — caster classification", () => {
	const casterTypeByJob: Record<string, ReturnType<typeof getCasterType>> = {
		Destroyer: "none",
		Berserker: "none",
		Assassin: "none",
		Striker: "none",
		Mage: "full",
		Esper: "full",
		Revenant: "full",
		Summoner: "full",
		Herald: "full",
		Idol: "full",
		"Holy Knight": "half",
		Stalker: "half",
		Technomancer: "artificer",
		Contractor: "pact",
	};

	it.each(
		Object.entries(casterTypeByJob),
	)("%s is classified as a %s caster", (jobName, expectedType) => {
		expect(getCasterType(jobName)).toBe(expectedType);
	});

	const progressionByJob: Record<
		string,
		ReturnType<typeof getSpellProgressionForJob>
	> = {
		Destroyer: "none",
		Berserker: "none",
		Assassin: "none",
		Striker: "none",
		Mage: "full",
		Esper: "full",
		Revenant: "full",
		Summoner: "full",
		Herald: "full",
		Idol: "full",
		"Holy Knight": "half",
		Stalker: "half",
		Technomancer: "half",
		Contractor: "pact",
	};

	it.each(
		Object.entries(progressionByJob),
	)("%s uses the %s spell-progression bracket", (jobName, expectedProgression) => {
		expect(getSpellProgressionForJob(jobName)).toBe(expectedProgression);
	});
});

describe("Job canon — spellcasting ability", () => {
	const spellcastingAbilityByJob: Record<
		string,
		ReturnType<typeof getSpellcastingAbility>
	> = {
		Mage: "INT",
		Revenant: "INT",
		Technomancer: "INT",
		Herald: "SENSE",
		Summoner: "SENSE",
		Stalker: "SENSE",
		Esper: "PRE",
		Contractor: "PRE",
		"Holy Knight": "PRE",
		Idol: "PRE",
		Destroyer: null,
		Berserker: null,
		Assassin: null,
		Striker: null,
	};

	it.each(
		Object.entries(spellcastingAbilityByJob),
	)("%s casts using %s", (jobName, expected) => {
		expect(getSpellcastingAbility(jobName)).toBe(expected);
	});
});

describe("Job canon — ASI cadence", () => {
	const standardAsi = [4, 8, 12, 16, 19];

	it("Assassin retains the canonical six-ASI cadence at L10", () => {
		expect(getASILevels("Assassin")).toEqual([4, 8, 10, 12, 16, 19]);
	});

	it.each([
		"Destroyer",
		"Berserker",
		"Striker",
		"Mage",
		"Esper",
		"Revenant",
		"Summoner",
		"Herald",
		"Idol",
		"Holy Knight",
		"Stalker",
		"Technomancer",
		"Contractor",
	])("%s follows the standard 5e ASI cadence", (jobName) => {
		expect(getASILevels(jobName)).toEqual(standardAsi);
	});
});

describe("Job canon — pact-caster spell access (Contractor)", () => {
	it.each([
		[1, 1],
		[2, 1],
		[3, 2],
		[4, 2],
		[5, 3],
		[6, 3],
		[7, 4],
		[8, 4],
		[9, 5],
		[15, 5],
		[20, 5],
	])("Contractor at level %i can access spell rank %i (pact bracket)", (level, expected) => {
		expect(getMaxPowerLevelForJobAtLevel("Contractor", level)).toBe(expected);
	});
});
