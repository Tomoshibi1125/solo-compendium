import { describe, expect, it } from "vitest";
import { powers } from "../../data/compendium/powers";
import { techniques } from "../../data/compendium/techniques";
import {
	listCanonicalSpells,
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "../canonicalCompendium";

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
	Destroyer: { total: 70, unique: 25, levels: { 1: 5, 3: 25, 5: 5, 9: 3 } },
	Berserker: { total: 60, unique: 25, levels: { 1: 5, 3: 15, 5: 5, 9: 3 } },
	Assassin: { total: 70, unique: 25, levels: { 1: 5, 3: 25, 5: 5, 9: 3 } },
	Striker: { total: 60, unique: 25, levels: { 1: 5, 3: 15, 5: 5, 9: 3 } },
	"Holy Knight": { total: 75, unique: 30, levels: { 1: 5, 3: 30, 5: 5, 9: 3 } },
	Technomancer: { total: 75, unique: 25, levels: { 1: 5, 3: 30, 5: 5, 9: 3 } },
	Stalker: { total: 75, unique: 25, levels: { 1: 5, 3: 30, 5: 5, 9: 3 } },
};

const TECHNIQUE_PARITY_MINIMUMS: Record<
	string,
	{ total: number; unique: number; levels: Record<number, number> }
> = {
	Destroyer: { total: 100, unique: 25, levels: { 1: 5, 3: 5, 5: 70, 9: 3 } },
	Berserker: { total: 80, unique: 25, levels: { 1: 5, 3: 5, 5: 35, 9: 3 } },
	Assassin: { total: 95, unique: 25, levels: { 1: 5, 3: 5, 5: 55, 9: 3 } },
	Striker: { total: 75, unique: 25, levels: { 1: 5, 3: 5, 5: 35, 9: 3 } },
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

		const unseenPowers = powers.filter((p) => !seen.powers.has(p.id));
		const unseenTechniques = techniques.filter(
			(t) => !seen.techniques.has(t.id ?? t.name),
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
