import { describe, expect, it } from "vitest";
import {
	entryHasAccessToken,
	getJobAbilityAccess,
	getPowerAccessTokens,
	getSpellAccessTokens,
	getTechniqueAccessTokens,
	jobCanLearnPowers,
	jobCanLearnSpells,
	jobCanLearnTechniques,
} from "@/lib/jobAbilityAccess";

describe("jobAbilityAccess", () => {
	it("blocks caster-only jobs from powers and techniques", () => {
		for (const job of [
			"Mage",
			"Esper",
			"Revenant",
			"Summoner",
			"Idol",
			"Herald",
			"Contractor",
		]) {
			const access = getJobAbilityAccess(job);
			expect(access?.spells).toBe(true);
			expect(access?.powers).toBe(false);
			expect(access?.techniques).toBe(false);
			expect(jobCanLearnSpells(job)).toBe(true);
			expect(jobCanLearnPowers(job)).toBe(false);
			expect(jobCanLearnTechniques(job)).toBe(false);
			expect(getPowerAccessTokens(job)).toEqual([]);
			expect(getTechniqueAccessTokens(job)).toEqual([]);
		}
	});

	it("keeps martial access separate from spell access", () => {
		for (const job of ["Destroyer", "Berserker", "Assassin", "Striker"]) {
			const access = getJobAbilityAccess(job);
			expect(access?.spells).toBe(false);
			expect(access?.powers).toBe(true);
			expect(access?.techniques).toBe(true);
			expect(jobCanLearnSpells(job)).toBe(false);
			expect(jobCanLearnPowers(job)).toBe(true);
			expect(jobCanLearnTechniques(job)).toBe(true);
			expect(getSpellAccessTokens(job)).toEqual([]);
			expect(getPowerAccessTokens(job).length).toBeGreaterThan(0);
			expect(getTechniqueAccessTokens(job).length).toBeGreaterThan(0);
		}
	});

	it("allows half-casters to use all three access channels without sharing tokens", () => {
		for (const job of ["Holy Knight", "Technomancer", "Stalker"]) {
			expect(jobCanLearnSpells(job)).toBe(true);
			expect(jobCanLearnPowers(job)).toBe(true);
			expect(jobCanLearnTechniques(job)).toBe(true);
			expect(getSpellAccessTokens(job)).toEqual([
				job.toLowerCase().replace(/\s+/g, "-"),
			]);
			expect(getPowerAccessTokens(job).length).toBeGreaterThan(
				getSpellAccessTokens(job).length,
			);
			expect(getTechniqueAccessTokens(job).length).toBeGreaterThan(
				getSpellAccessTokens(job).length,
			);
		}
	});

	it("matches entries only through the requested access channel tokens", () => {
		const destroyerPowerTokens = getPowerAccessTokens("Destroyer");
		const magePowerTokens = getPowerAccessTokens("Mage");
		expect(
			entryHasAccessToken(["destroyer", "bulwark"], destroyerPowerTokens),
		).toBe(true);
		expect(entryHasAccessToken(["destroyer", "bulwark"], magePowerTokens)).toBe(
			false,
		);
	});
});
