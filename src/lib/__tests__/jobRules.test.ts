import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { staticDataProvider } from "@/data/compendium/providers";
import {
	getCantripsKnownLimit,
	getCasterType,
	getSpellsKnownLimit,
} from "@/lib/5eCharacterCalculations";
import { getJobPowerMode, getJobTechniqueMode } from "@/lib/jobAbilityAccess";
import {
	getCanonicalJob,
	getCanonicalJobPrimaryAbility,
	getCanonicalJobSpellcastingAbility,
} from "@/lib/jobRules";
import { getASILevels } from "@/lib/levelGating";

describe("Job rules — authored catalog authority", () => {
	it("gives every Rift Ascendant Job a complete automation contract", () => {
		expect(jobs).toHaveLength(14);
		for (const job of jobs) {
			expect(
				job.canonicalRules,
				`${job.name} lacks canonicalRules`,
			).toBeDefined();
			expect(getCanonicalJob(job.id)).toBe(job);
			expect(getCanonicalJob(job.name)).toBe(job);
			expect(getCasterType(job.name)).toBe(job.canonicalRules.casterType);
			expect(getASILevels(job.name)).toEqual(job.canonicalRules.asiLevels);
			expect(getCanonicalJobPrimaryAbility(job.name)).not.toBeNull();
			expect(getCanonicalJobSpellcastingAbility(job.name)).toBe(
				job.spellcasting ? getCanonicalJobSpellcastingAbility(job.id) : null,
			);
		}
	});

	it("reads known-spell, cantrip, and ability modes from the selected Job", () => {
		for (const job of jobs) {
			const level = 11;
			const idx = level - 1;
			expect(getCantripsKnownLimit(job.name, level)).toBe(
				job.spellcasting?.cantripsKnown?.[idx] ?? null,
			);
			expect(getSpellsKnownLimit(job.name, level)).toBe(
				job.canonicalRules.spellAccess === "known"
					? (job.spellcasting?.spellsKnown?.[idx] ?? null)
					: null,
			);
			expect(getJobPowerMode(job.name)).toBe(
				job.canonicalRules.powerAccess ?? "at-will",
			);
			expect(getJobTechniqueMode(job.name)).toBe(
				job.canonicalRules.techniqueAccess ?? "at-will",
			);
		}
	});

	it("preserves canonical automation data through the static compendium provider", async () => {
		const providerJobs = await staticDataProvider.getJobs();
		expect(providerJobs).toHaveLength(jobs.length);
		for (const job of jobs) {
			const normalized = providerJobs.find((entry) => entry.id === job.id);
			expect(normalized?.canonical_rules).toEqual(job.canonicalRules);
		}
	});
});
