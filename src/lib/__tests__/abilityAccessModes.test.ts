import { describe, expect, it } from "vitest";
import { getJobPrimaryAbility } from "@/lib/5eCharacterCalculations";
import {
	getJobPowerMode,
	getJobTechniqueMode,
	jobCanLearnPowers,
	jobCanLearnTechniques,
} from "@/lib/jobAbilityAccess";
import { resolvePowerActionFormula } from "@/lib/powerActionFormulas";

const ABILITIES = {
	STR: 16,
	AGI: 14,
	VIT: 12,
	INT: 18,
	SENSE: 15,
	PRE: 17,
} as const;

describe("F2 — per-job power/technique access modes", () => {
	it("classifies martial powers as at-will and their techniques as known", () => {
		for (const job of ["Destroyer", "Berserker", "Assassin", "Striker"]) {
			expect(getJobPowerMode(job)).toBe("at-will");
			expect(getJobTechniqueMode(job)).toBe("known");
		}
	});

	it("mirrors the spell prep split for half-caster hybrids", () => {
		// Prepared casters prepare their powers…
		expect(getJobPowerMode("Holy Knight")).toBe("prepared");
		expect(getJobPowerMode("Technomancer")).toBe("prepared");
		expect(getJobPowerMode("Revenant")).toBe("prepared");
		// …the known caster knows them.
		expect(getJobPowerMode("Stalker")).toBe("known");
	});

	it("defaults non-power jobs (pure casters) to at-will", () => {
		for (const job of ["Mage", "Esper", "Summoner", "Idol", "Herald"]) {
			expect(getJobPowerMode(job)).toBe("at-will");
		}
	});

	it("is case/format insensitive on the job name", () => {
		expect(getJobPowerMode("holy knight")).toBe("prepared");
		expect(getJobTechniqueMode("STRIKER")).toBe("known");
	});
});

describe("F1 — technique-capable jobs (technique-point pool recipients)", () => {
	it("covers all martials and half-caster hybrids", () => {
		for (const job of [
			"Destroyer",
			"Berserker",
			"Assassin",
			"Striker",
			"Holy Knight",
			"Technomancer",
			"Stalker",
			"Revenant",
		]) {
			expect(jobCanLearnTechniques(job)).toBe(true);
		}
	});

	it("excludes pure casters", () => {
		for (const job of ["Mage", "Esper", "Summoner", "Idol", "Contractor"]) {
			expect(jobCanLearnTechniques(job)).toBe(false);
		}
	});
});

describe("F1 — leveled powers are per-ability tracked for at-will martials", () => {
	// Under the 5e-SRD use economy, a leveled power is limited (per-ability uses)
	// iff the job learns powers AND casts them at-will (martials). Caster/hybrid
	// power jobs cast from spell slots instead, so their leveled powers stay
	// untracked here (deriveAbilityUseGrant returns null).
	const powersAreTracked = (job: string) =>
		jobCanLearnPowers(job) && getJobPowerMode(job) === "at-will";

	it("tracks leveled power uses for the four martials", () => {
		for (const job of ["Destroyer", "Berserker", "Assassin", "Striker"]) {
			expect(powersAreTracked(job)).toBe(true);
		}
	});

	it("leaves slot-casting hybrids and pure casters on spell slots", () => {
		for (const job of [
			"Holy Knight", // prepared → spell slots
			"Technomancer", // prepared → spell slots
			"Revenant", // prepared → spell slots
			"Stalker", // known → spell slots
		]) {
			expect(powersAreTracked(job)).toBe(false);
		}
	});
});

describe("F3 — techniques/powers use the job's primary governing ability", () => {
	it("routes each job's power/technique formula through its primary ability", () => {
		for (const job of ["Destroyer", "Striker", "Holy Knight", "Technomancer"]) {
			const primary = getJobPrimaryAbility(job);
			const formula = resolvePowerActionFormula({
				job,
				abilities: ABILITIES,
				proficiencyBonus: 2,
			});
			expect(formula.ability).toBe(primary);
		}
	});
});
