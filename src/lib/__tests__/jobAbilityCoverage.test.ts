import { describe, expect, it } from "vitest";
import { powers } from "../../data/compendium/powers";
import { techniques } from "../../data/compendium/techniques";
import {
	listCanonicalSpells,
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "../canonicalCompendium";
import { PATH_ABILITY_GRANTS } from "../pathAbilityAccess";

// Entries that exist in the catalog but are intentionally not learnable by
// any job naturally and are not granted by any path. They remain in the
// catalog so they remain rune-target-able (see runeAutomation / useAbsorbRune).
const RUNE_ONLY_POWER_IDS = new Set<string>([
	"power-sup-6-89-idol-s-magnum-opus",
]);
const RUNE_ONLY_TECHNIQUE_IDS = new Set<string>([
	"tech-sup-3-31-dance-of-blades",
	"tech-sup-6-68-resonance-blade-dance",
]);

const MARTIAL_JOBS = ["Destroyer", "Berserker", "Assassin", "Striker"];
const HALF_CASTERS = ["Holy Knight", "Technomancer", "Stalker"];
const FULL_CASTERS = [
	"Mage",
	"Esper",
	"Revenant",
	"Summoner",
	"Idol",
	"Herald",
];
const PACT_CASTERS = ["Contractor"];
const CASTER_JOBS = [...HALF_CASTERS, ...FULL_CASTERS, ...PACT_CASTERS];
const ALL_JOBS = [
	...MARTIAL_JOBS,
	...HALF_CASTERS,
	...FULL_CASTERS,
	...PACT_CASTERS,
];

const SPELL_PARITY_MINIMUMS: Record<
	string,
	{ total: number; unique: number; ranks: Record<string, number> }
> = {
	Mage: {
		total: 140,
		unique: 35,
		ranks: { D: 45, C: 35, B: 25, A: 15, S: 10 },
	},
	Esper: {
		total: 110,
		unique: 35,
		ranks: { D: 35, C: 20, B: 18, A: 15, S: 10 },
	},
	Revenant: {
		total: 90,
		unique: 45,
		ranks: { D: 25, C: 15, B: 15, A: 15, S: 10 },
	},
	Summoner: {
		total: 100,
		unique: 20,
		ranks: { D: 30, C: 25, B: 15, A: 8, S: 5 },
	},
	Idol: {
		total: 85,
		unique: 4,
		ranks: { D: 30, C: 20, B: 15, A: 8, S: 5 },
	},
	Herald: {
		total: 110,
		unique: 20,
		ranks: { D: 40, C: 30, B: 20, A: 10, S: 8 },
	},
	Contractor: {
		total: 80,
		unique: 4,
		ranks: { D: 25, C: 18, B: 12, A: 12, S: 8 },
	},
	"Holy Knight": {
		total: 45,
		unique: 12,
		ranks: { D: 25, C: 25, B: 15 },
	},
	Stalker: { total: 45, unique: 6, ranks: { D: 18, C: 15, B: 8 } },
	Technomancer: {
		total: 90,
		unique: 0,
		ranks: { D: 35, C: 25, B: 15 },
	},
};

const POWER_PARITY_MINIMUMS: Record<
	string,
	{ total: number; unique: number; levels: Record<number, number> }
> = {
	Destroyer: { total: 120, unique: 25, levels: { 1: 5, 3: 25, 5: 5, 9: 3 } },
	Berserker: { total: 120, unique: 25, levels: { 1: 5, 3: 15, 5: 5, 9: 3 } },
	Assassin: { total: 120, unique: 25, levels: { 1: 5, 3: 25, 5: 5, 9: 3 } },
	Striker: { total: 120, unique: 25, levels: { 1: 5, 3: 15, 5: 5, 9: 3 } },
	"Holy Knight": { total: 75, unique: 30, levels: { 1: 5, 3: 30, 5: 5, 9: 3 } },
	Technomancer: { total: 75, unique: 25, levels: { 1: 5, 3: 30, 5: 5, 9: 3 } },
	Stalker: { total: 75, unique: 25, levels: { 1: 5, 3: 30, 5: 5, 9: 3 } },
};

const TECHNIQUE_PARITY_MINIMUMS: Record<
	string,
	{ total: number; unique: number; levels: Record<number, number> }
> = {
	Destroyer: { total: 120, unique: 25, levels: { 1: 5, 3: 5, 5: 70, 9: 3 } },
	Berserker: { total: 120, unique: 25, levels: { 1: 5, 3: 5, 5: 35, 9: 3 } },
	Assassin: { total: 120, unique: 25, levels: { 1: 5, 3: 5, 5: 55, 9: 3 } },
	Striker: { total: 120, unique: 25, levels: { 1: 5, 3: 5, 5: 35, 9: 3 } },
	"Holy Knight": {
		total: 100,
		unique: 25,
		levels: { 1: 5, 3: 5, 5: 70, 9: 3 },
	},
	Technomancer: { total: 65, unique: 25, levels: { 1: 5, 3: 5, 5: 25, 9: 3 } },
	Stalker: { total: 80, unique: 25, levels: { 1: 5, 3: 5, 5: 35, 9: 3 } },
};

describe("Job ability coverage audit", () => {
	it("prints coverage matrix for all jobs", async () => {
		console.log(
			`Compendium totals — powers: ${powers.length}, techniques: ${techniques.length}`,
		);
		const allSpells = await listCanonicalSpells();
		const seen = {
			powers: new Set<string>(),
			techniques: new Set<string>(),
			spells: new Set<string>(),
		};
		const spellLists = new Map<
			string,
			Awaited<ReturnType<typeof listLearnableSpells>>
		>();
		const powerLists = new Map<
			string,
			Awaited<ReturnType<typeof listLearnablePowers>>
		>();
		const techniqueLists = new Map<
			string,
			Awaited<ReturnType<typeof listLearnableTechniques>>
		>();

		for (const job of ALL_JOBS) {
			const p = await listLearnablePowers({ jobName: job });
			const t = await listLearnableTechniques({ jobName: job });
			const s = await listLearnableSpells({ jobName: job });
			for (const entry of p) seen.powers.add(entry.id);
			for (const entry of t) seen.techniques.add(entry.id ?? entry.name);
			for (const entry of s) seen.spells.add(entry.id);
			if ([...MARTIAL_JOBS, ...HALF_CASTERS].includes(job)) {
				powerLists.set(job, p);
				techniqueLists.set(job, t);
			}
			if (CASTER_JOBS.includes(job)) spellLists.set(job, s);
			console.log(
				`${job.padEnd(16)} powers: ${String(p.length).padStart(3)}  techniques: ${String(t.length).padStart(3)}  spells: ${String(s.length).padStart(3)}`,
			);
		}

		// Also scan hybrid path grants so abilities reachable only via PATH_ABILITY_GRANTS
		// are counted as "seen" (this is how full-casters and pact-casters gain hybrid
		// power/technique access on specific paths).
		const jobPathPairs = new Set<string>();
		for (const grant of PATH_ABILITY_GRANTS) {
			jobPathPairs.add(`${grant.jobName}::${grant.pathName}`);
		}
		for (const pair of jobPathPairs) {
			const [job, path] = pair.split("::");
			const p = await listLearnablePowers({
				jobName: job,
				pathName: path,
				characterLevel: 20,
			});
			const t = await listLearnableTechniques({
				jobName: job,
				pathName: path,
				characterLevel: 20,
			});
			const s = await listLearnableSpells({
				jobName: job,
				pathName: path,
				characterLevel: 20,
			});
			for (const entry of p) seen.powers.add(entry.id);
			for (const entry of t) seen.techniques.add(entry.id ?? entry.name);
			for (const entry of s) seen.spells.add(entry.id);
		}

		const unseenPowers = powers.filter(
			(p) => !seen.powers.has(p.id) && !RUNE_ONLY_POWER_IDS.has(p.id),
		);
		const unseenTechniques = techniques.filter(
			(t) =>
				!seen.techniques.has(t.id ?? t.name) &&
				!RUNE_ONLY_TECHNIQUE_IDS.has(t.id ?? ""),
		);
		const unseenSpells = allSpells.filter(
			(spell) => !seen.spells.has(spell.id),
		);
		console.log(
			`\nUnseen powers (${unseenPowers.length}):`,
			unseenPowers.map((p) => p.id),
		);
		console.log(
			`Unseen techniques (${unseenTechniques.length}):`,
			unseenTechniques.map((t) => t.id),
		);
		console.log(
			`Unseen spells (${unseenSpells.length}):`,
			unseenSpells.map((spell) => spell.id),
		);

		const distinctSpellCounts = new Set(
			Array.from(spellLists.values()).map((list) => list.length),
		);
		const maxSpellCount = Math.max(
			...Array.from(spellLists.values()).map((list) => list.length),
		);
		const uniqueSpellCounts = new Map<string, number>();
		for (const [job, list] of spellLists) {
			uniqueSpellCounts.set(
				job,
				list.filter(
					(spell) =>
						Array.from(spellLists.entries()).filter(([, otherList]) =>
							otherList.some((otherSpell) => otherSpell.id === spell.id),
						).length === 1,
				).length,
			);
		}
		const uniquePowerCounts = new Map<string, number>();
		for (const [job, list] of powerLists) {
			uniquePowerCounts.set(
				job,
				list.filter(
					(power) =>
						Array.from(powerLists.entries()).filter(([, otherList]) =>
							otherList.some((otherPower) => otherPower.id === power.id),
						).length === 1,
				).length,
			);
		}
		const uniqueTechniqueCounts = new Map<string, number>();
		for (const [job, list] of techniqueLists) {
			uniqueTechniqueCounts.set(
				job,
				list.filter(
					(technique) =>
						Array.from(techniqueLists.entries()).filter(([, otherList]) =>
							otherList.some(
								(otherTechnique) => otherTechnique.id === technique.id,
							),
						).length === 1,
				).length,
			);
		}

		expect(unseenPowers.length).toBe(0);
		expect(unseenTechniques.length).toBe(0);
		expect(unseenSpells.length).toBe(0);
		expect(powers.length).toBeGreaterThanOrEqual(240);
		expect(techniques.length).toBeGreaterThanOrEqual(240);
		expect(distinctSpellCounts.size).toBeGreaterThan(1);
		expect(maxSpellCount).toBeLessThan(allSpells.length);
		for (const job of [...FULL_CASTERS, ...PACT_CASTERS]) {
			expect(
				await listLearnablePowers({ jobName: job }),
				`${job} power access`,
			).toHaveLength(0);
			expect(
				await listLearnableTechniques({ jobName: job }),
				`${job} technique access`,
			).toHaveLength(0);
		}
		for (const [job, minimums] of Object.entries(POWER_PARITY_MINIMUMS)) {
			const list = powerLists.get(job) ?? [];
			expect(list.length, `${job} power-list total`).toBeGreaterThanOrEqual(
				minimums.total,
			);
			expect(
				uniquePowerCounts.get(job) ?? 0,
				`${job} unique power count`,
			).toBeGreaterThanOrEqual(minimums.unique);
			for (const [level, minimum] of Object.entries(minimums.levels)) {
				expect(
					list.filter((power) => power.power_level === Number(level)).length,
					`${job} level-${level} power count`,
				).toBeGreaterThanOrEqual(minimum);
			}
		}
		for (const [job, minimums] of Object.entries(TECHNIQUE_PARITY_MINIMUMS)) {
			const list = techniqueLists.get(job) ?? [];
			expect(list.length, `${job} technique-list total`).toBeGreaterThanOrEqual(
				minimums.total,
			);
			expect(
				uniqueTechniqueCounts.get(job) ?? 0,
				`${job} unique technique count`,
			).toBeGreaterThanOrEqual(minimums.unique);
			for (const [level, minimum] of Object.entries(minimums.levels)) {
				expect(
					list.filter(
						(technique) => technique.level_requirement === Number(level),
					).length,
					`${job} level-${level} technique count`,
				).toBeGreaterThanOrEqual(minimum);
			}
		}
		for (const [job, minimums] of Object.entries(SPELL_PARITY_MINIMUMS)) {
			const list = spellLists.get(job) ?? [];
			expect(list.length, `${job} spell-list total`).toBeGreaterThanOrEqual(
				minimums.total,
			);
			expect(
				uniqueSpellCounts.get(job) ?? 0,
				`${job} unique spell count`,
			).toBeGreaterThanOrEqual(minimums.unique);
			for (const [rank, minimum] of Object.entries(minimums.ranks)) {
				expect(
					list.filter((spell) => spell.rank === rank).length,
					`${job} rank-${rank} spell count`,
				).toBeGreaterThanOrEqual(minimum);
			}
		}
	});
});

describe("Job ability access — base-path exclusion rules", () => {
	const CASTER_FLAVORED_NAME =
		/\b(?:oath|pact|eldritch|divine|smite|sacred)\b/i;

	it("Destroyer has no learnable spells and no caster-flavored powers/techniques", async () => {
		const spellsList = await listLearnableSpells({ jobName: "Destroyer" });
		expect(spellsList).toHaveLength(0);
		const powersList = await listLearnablePowers({ jobName: "Destroyer" });
		const techniquesList = await listLearnableTechniques({
			jobName: "Destroyer",
		});
		const leakedPowers = powersList.filter((p) =>
			CASTER_FLAVORED_NAME.test(p.name),
		);
		const leakedTechs = techniquesList.filter((t) =>
			CASTER_FLAVORED_NAME.test(t.name),
		);
		expect(
			leakedPowers.map((p) => p.name),
			"Destroyer power leak",
		).toEqual([]);
		expect(
			leakedTechs.map((t) => t.name),
			"Destroyer technique leak",
		).toEqual([]);
	});

	it("Berserker has no learnable spells and no caster-flavored powers/techniques", async () => {
		const spellsList = await listLearnableSpells({ jobName: "Berserker" });
		expect(spellsList).toHaveLength(0);
		const powersList = await listLearnablePowers({ jobName: "Berserker" });
		const techniquesList = await listLearnableTechniques({
			jobName: "Berserker",
		});
		const leakedPowers = powersList.filter((p) =>
			CASTER_FLAVORED_NAME.test(p.name),
		);
		const leakedTechs = techniquesList.filter((t) =>
			CASTER_FLAVORED_NAME.test(t.name),
		);
		expect(
			leakedPowers.map((p) => p.name),
			"Berserker power leak",
		).toEqual([]);
		expect(
			leakedTechs.map((t) => t.name),
			"Berserker technique leak",
		).toEqual([]);
	});

	for (const job of ["Assassin", "Striker"]) {
		it(`${job} has no caster-flavored powers/techniques`, async () => {
			const powersList = await listLearnablePowers({ jobName: job });
			const techniquesList = await listLearnableTechniques({ jobName: job });
			const leakedPowers = powersList.filter((p) =>
				CASTER_FLAVORED_NAME.test(p.name),
			);
			const leakedTechs = techniquesList.filter((t) =>
				CASTER_FLAVORED_NAME.test(t.name),
			);
			expect(
				leakedPowers.map((p) => p.name),
				`${job} power leak`,
			).toEqual([]);
			expect(
				leakedTechs.map((t) => t.name),
				`${job} technique leak`,
			).toEqual([]);
		});
	}

	it("Idol without a hybrid path has no learnable powers or techniques", async () => {
		const powersList = await listLearnablePowers({ jobName: "Idol" });
		const techniquesList = await listLearnableTechniques({ jobName: "Idol" });
		expect(powersList).toHaveLength(0);
		expect(techniquesList).toHaveLength(0);
	});

	it("Contractor without a hybrid path has no learnable powers or techniques", async () => {
		const powersList = await listLearnablePowers({ jobName: "Contractor" });
		const techniquesList = await listLearnableTechniques({
			jobName: "Contractor",
		});
		expect(powersList).toHaveLength(0);
		expect(techniquesList).toHaveLength(0);
	});
});

describe("Job ability access — hybrid path grant coverage", () => {
	it("Idol on Path of the Dance Resonance at level 17 unlocks the full granted entry list", async () => {
		const powersList = await listLearnablePowers({
			jobName: "Idol",
			pathName: "Path of the Dance Resonance",
			characterLevel: 17,
		});
		const techniquesList = await listLearnableTechniques({
			jobName: "Idol",
			pathName: "Path of the Dance Resonance",
			characterLevel: 17,
		});
		const powerNames = new Set(powersList.map((p) => p.name));
		const techniqueNames = new Set(techniquesList.map((t) => t.name));
		const expectedPowers = [
			"Adrenaline Surge",
			"Berserker's Fury",
			"Absolute Smite",
			"Absolute Ascension",
			"Absolute Pact",
		];
		const expectedTechniques = [
			"Anchor Strike",
			"Arterial Cut",
			"Anchor Slam",
			"Absolute Cleave",
			"Absolute Execution",
		];
		for (const name of expectedPowers) {
			expect(
				powerNames.has(name),
				`Dance Resonance L17 missing power "${name}"`,
			).toBe(true);
		}
		for (const name of expectedTechniques) {
			expect(
				techniqueNames.has(name),
				`Dance Resonance L17 missing technique "${name}"`,
			).toBe(true);
		}
	});

	it("Contractor on Path of the Cursed Blade unlocks pact-themed powers and techniques", async () => {
		const powersList = await listLearnablePowers({
			jobName: "Contractor",
			pathName: "Path of the Cursed Blade",
			characterLevel: 17,
		});
		const techniquesList = await listLearnableTechniques({
			jobName: "Contractor",
			pathName: "Path of the Cursed Blade",
			characterLevel: 17,
		});
		const powerNames = new Set(powersList.map((p) => p.name));
		const techniqueNames = new Set(techniquesList.map((t) => t.name));
		const expectedPowers = [
			"Cursed Blade Edge",
			"Pact Retaliation",
			"Absolute Pact",
		];
		const expectedTechniques = ["Pact Blade", "Eldritch Riposte"];
		for (const name of expectedPowers) {
			expect(powerNames.has(name), `Cursed Blade missing power "${name}"`).toBe(
				true,
			);
		}
		for (const name of expectedTechniques) {
			expect(
				techniqueNames.has(name),
				`Cursed Blade missing technique "${name}"`,
			).toBe(true);
		}
	});
});
