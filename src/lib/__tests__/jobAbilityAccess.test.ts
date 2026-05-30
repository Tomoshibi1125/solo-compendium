import { describe, expect, it } from "vitest";
import {
	entryHasAccessToken,
	getCasterSchools,
	getJobAbilityAccess,
	getPowerAccessTokens,
	getSpellAccessTokens,
	getTechniqueAccessTokens,
	jobCanLearnPowers,
	jobCanLearnSpells,
	jobCanLearnTechniques,
	spellSchoolMatchesJob,
} from "@/lib/jobAbilityAccess";

describe("jobAbilityAccess — archetype model", () => {
	it("blocks pure-caster jobs from powers and techniques", () => {
		for (const job of [
			"Mage",
			"Esper",
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

	it("keeps pure-martial access separate from spell access", () => {
		for (const job of ["Destroyer", "Berserker", "Assassin", "Striker"]) {
			const access = getJobAbilityAccess(job);
			expect(access?.spells).toBe(false);
			expect(access?.powers).toBe(true);
			expect(access?.techniques).toBe(true);
			expect(jobCanLearnSpells(job)).toBe(false);
			expect(jobCanLearnPowers(job)).toBe(true);
			expect(jobCanLearnTechniques(job)).toBe(true);
			expect(getSpellAccessTokens(job)).toEqual([]);
			expect(getCasterSchools(job)).toBeNull();
		}
	});

	it("allows hybrids (incl. Revenant) to use all three access channels", () => {
		for (const job of ["Holy Knight", "Technomancer", "Stalker", "Revenant"]) {
			expect(jobCanLearnSpells(job)).toBe(true);
			expect(jobCanLearnPowers(job)).toBe(true);
			expect(jobCanLearnTechniques(job)).toBe(true);
			expect(getSpellAccessTokens(job)).toEqual([
				job.toLowerCase().replace(/\s+/g, "-"),
			]);
			// Hybrids keep non-empty power/technique tokens for the additive
			// path/regent layer and dialog "access" badges.
			expect(getPowerAccessTokens(job).length).toBeGreaterThan(0);
			expect(getTechniqueAccessTokens(job).length).toBeGreaterThan(0);
		}
	});

	it("gates caster spell access by school (Mage = all, others scoped)", () => {
		// Mage is the arcane generalist and matches every school.
		for (const school of [
			"Necromancy",
			"Evocation",
			"Illusion",
			"Conjuration",
			"Abjuration",
			"Transmutation",
			"Enchantment",
			"Divination",
		]) {
			expect(spellSchoolMatchesJob(school, "Mage")).toBe(true);
		}
		// Revenant: necromancy / abjuration / transmutation (entropy/anti-life).
		expect(spellSchoolMatchesJob("Necromancy", "Revenant")).toBe(true);
		expect(spellSchoolMatchesJob("Abjuration", "Revenant")).toBe(true);
		expect(spellSchoolMatchesJob("Transmutation", "Revenant")).toBe(true);
		expect(spellSchoolMatchesJob("Evocation", "Revenant")).toBe(false);
		// Idol: enchantment / illusion / evocation.
		expect(spellSchoolMatchesJob("Illusion", "Idol")).toBe(true);
		expect(spellSchoolMatchesJob("Necromancy", "Idol")).toBe(false);
		// Non-casters have no school set and match nothing.
		expect(getCasterSchools("Destroyer")).toBeNull();
		expect(spellSchoolMatchesJob("Evocation", "Destroyer")).toBe(false);
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
