import { describe, expect, it } from "vitest";
import { powers } from "@/data/compendium/powers";
import { spells } from "@/data/compendium/spells";
import { techniques } from "@/data/compendium/techniques";
import {
	getPathAbilityGrantTokens,
	normalizePathAbilityValue,
	PATH_ABILITY_GRANTS,
	pathGrantsAbilityKind,
	rejectedReconciledPathAbilityGrantCandidates,
	rejectedTask3PathAbilityGrantCandidates,
} from "@/lib/pathAbilityAccess";

describe("pathAbilityAccess exported grant catalog", () => {
	it("exposes only source-backed reconciled path grants without broadening eligibility", () => {
		const reconciledJobNames = new Set([
			"Destroyer",
			"Mage",
			"Contractor",
			"Holy Knight",
			"Berserker",
			"Assassin",
			"Striker",
			"Esper",
			"Summoner",
			"Herald",
			"Idol",
			"Revenant",
			"Stalker",
			"Technomancer",
		]);
		expect(
			PATH_ABILITY_GRANTS.filter((grant) =>
				reconciledJobNames.has(grant.jobName),
			),
		).toEqual([
			{
				jobName: "Destroyer",
				pathName: "Path of the Spell Breaker",
				level: 3,
				kind: "spell",
				sourceTokens: ["Mage"],
				schools: ["Abjuration", "Evocation"],
				progression: "third",
				leveledSchoolsOnly: true,
			},
			{
				jobName: "Assassin",
				pathName: "Path of the Weave Infiltrator",
				level: 3,
				kind: "spell",
				sourceTokens: ["Mage"],
				schools: ["Enchantment", "Illusion"],
				progression: "third",
				leveledSchoolsOnly: true,
			},
			{
				jobName: "Assassin",
				pathName: "Path of the Blade Dancer",
				level: 17,
				kind: "technique",
				sourceTokens: [],
				entryNames: ["Harmonic Counter"],
				maxLevel: 5,
			},
		]);

		expect(
			pathGrantsAbilityKind({
				jobName: "Destroyer",
				pathName: "Path of the Spell Breaker",
				characterLevel: 3,
				kind: "spell",
			}),
		).toBe(true);
		expect(
			pathGrantsAbilityKind({
				jobName: "Assassin",
				pathName: "Path of the Weave Infiltrator",
				characterLevel: 2,
				kind: "spell",
			}),
		).toBe(false);
		expect(
			pathGrantsAbilityKind({
				jobName: "Assassin",
				pathName: "Path of the Weave Infiltrator",
				characterLevel: 3,
				kind: "spell",
			}),
		).toBe(true);
		expect(
			pathGrantsAbilityKind({
				jobName: "Assassin",
				pathName: "Path of the Blade Dancer",
				characterLevel: 16,
				kind: "technique",
			}),
		).toBe(false);
		expect(
			pathGrantsAbilityKind({
				jobName: "Assassin",
				pathName: "Path of the Blade Dancer",
				characterLevel: 17,
				kind: "technique",
			}),
		).toBe(true);

		const rejectedQueries = [
			{
				jobName: "Contractor",
				pathName: "Path of the Cursed Blade",
				kind: "power",
			},
			{
				jobName: "Berserker",
				pathName: "Path of the Escalating Resonance",
				kind: "power",
			},
			{
				jobName: "Assassin",
				pathName: "Path of the Terminus",
				kind: "power",
			},
			{
				jobName: "Striker",
				pathName: "Path of the Phantom Step",
				kind: "spell",
			},
			{
				jobName: "Striker",
				pathName: "Path of the Kinetic Core",
				kind: "power",
			},
		] as const;
		for (const query of rejectedQueries) {
			expect(
				pathGrantsAbilityKind({ ...query, characterLevel: 20 }),
				`${query.jobName} / ${query.pathName} must not grant ${query.kind} access`,
			).toBe(false);
		}

		const tokens = getPathAbilityGrantTokens(PATH_ABILITY_GRANTS);
		expect(tokens).toEqual(
			expect.arrayContaining([
				"mage",
				"path-of-the-spell-breaker",
				"path-of-the-weave-infiltrator",
				"path-of-the-blade-dancer",
			]),
		);
		for (const rejectedToken of [
			"path-of-the-cursed-blade",
			"path-of-the-escalating-resonance",
			"path-of-the-terminus",
			"path-of-the-phantom-step",
			"path-of-the-kinetic-core",
		]) {
			expect(tokens).not.toContain(rejectedToken);
		}

		expect(rejectedTask3PathAbilityGrantCandidates).toBe(
			rejectedReconciledPathAbilityGrantCandidates,
		);
		expect(rejectedReconciledPathAbilityGrantCandidates).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					jobName: "Contractor",
					pathName: "Path of the Cursed Blade",
					kind: "power",
				}),
				expect.objectContaining({
					jobName: "Berserker",
					pathName: "Path of the Escalating Resonance",
					kind: "power",
					entryNames: expect.arrayContaining(["Berserker's Fury"]),
				}),
				expect.objectContaining({
					jobName: "Assassin",
					pathName: "Path of the Terminus",
					kind: "power",
				}),
				expect.objectContaining({
					jobName: "Striker",
					pathName: "Path of the Phantom Step",
					kind: "spell",
				}),
				expect.objectContaining({
					jobName: "Striker",
					pathName: "Path of the Kinetic Core",
					kind: "power",
				}),
			]),
		);
		const reconciledRejectedCounts = {
			Esper: 4,
			Summoner: 4,
			Herald: 4,
			Idol: 23,
			Revenant: 9,
			Stalker: 4,
			Technomancer: 3,
		} as const;
		for (const [jobName, count] of Object.entries(reconciledRejectedCounts)) {
			expect(
				PATH_ABILITY_GRANTS.filter((grant) => grant.jobName === jobName),
				`${jobName} must not retain inferred path grants`,
			).toEqual([]);
			expect(
				rejectedReconciledPathAbilityGrantCandidates.filter(
					(grant) => grant.jobName === jobName,
				),
				`${jobName} rejected candidate count`,
			).toHaveLength(count);
		}

		expect(
			rejectedReconciledPathAbilityGrantCandidates.some(
				(grant) =>
					grant.jobName === "Assassin" &&
					(grant.pathName === "Path of the Weave Infiltrator" ||
						grant.pathName === "Path of the Blade Dancer"),
			),
		).toBe(false);
	});

	it("every PATH_ABILITY_GRANTS.entryNames reference resolves to a real canonical entry", () => {
		const powerNames = new Set(
			powers.map((p) => normalizePathAbilityValue(p.name)),
		);
		const techniqueNames = new Set(
			techniques.map((t) => normalizePathAbilityValue(t.name)),
		);
		const spellNames = new Set(
			spells.map((s) => normalizePathAbilityValue(s.name)),
		);

		const unresolved: string[] = [];
		for (const grant of PATH_ABILITY_GRANTS) {
			if (!grant.entryNames?.length) continue;
			const catalog =
				grant.kind === "power"
					? powerNames
					: grant.kind === "technique"
						? techniqueNames
						: spellNames;
			for (const name of grant.entryNames) {
				if (!catalog.has(normalizePathAbilityValue(name))) {
					unresolved.push(
						`${grant.jobName} / ${grant.pathName} / ${grant.kind} -> "${name}"`,
					);
				}
			}
		}
		expect(unresolved).toEqual([]);
	});
});
