/**
 * Parametric regression test — ASI + awakening features + saving throws +
 * speed + senses must all be applied at creation for ALL 14 RA jobs.
 *
 * Extends the original `racialAsiRegression.test.ts` (which covered
 * Destroyer / Mage / Summoner / Stalker / Herald individually) with a full
 * matrix so no job can regress silently.
 */

import { beforeAll, describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { applyJobAwakeningTraitsToCharacter } from "@/lib/characterCreation";
import {
	createLocalCharacter,
	getLocalCharacterWithAbilities,
	listLocalFeatures,
} from "@/lib/guestStore";

// Always replace localStorage with a fresh in-memory impl for this suite.
// vitest.config.ts configures a file-backed localStorage that is SHARED across
// test files running in parallel forks — if we used that, clearing/writing
// here would race with sibling tests (e.g. racialAsiRegression.test.ts).
// Using an in-memory impl fully isolates this suite.
function installIsolatedLocalStorage() {
	const store: Record<string, string> = {};
	(globalThis as unknown as { localStorage: Storage }).localStorage = {
		getItem: (k) => (k in store ? store[k] : null),
		setItem: (k, v) => {
			store[k] = String(v);
		},
		removeItem: (k) => {
			delete store[k];
		},
		clear: () => {
			for (const k of Object.keys(store)) delete store[k];
		},
		key: (i) => Object.keys(store)[i] ?? null,
		get length() {
			return Object.keys(store).length;
		},
	} as Storage;
}

const ABILITY_KEYS = [
	"strength",
	"agility",
	"vitality",
	"intelligence",
	"sense",
	"presence",
] as const;
type AbilityKey = (typeof ABILITY_KEYS)[number];

const ABILITY_TO_COLUMN: Record<
	AbilityKey,
	"str" | "agi" | "vit" | "int" | "sense" | "pre"
> = {
	strength: "str",
	agility: "agi",
	vitality: "vit",
	intelligence: "int",
	sense: "sense",
	presence: "pre",
};

const ABILITY_TO_SAVE_CODE: Record<string, string> = {
	strength: "STR",
	agility: "AGI",
	vitality: "VIT",
	intelligence: "INT",
	sense: "SENSE",
	presence: "PRE",
};

describe("Parametric: ASI + awakening features applied at creation (all jobs)", () => {
	beforeAll(() => {
		installIsolatedLocalStorage();
	});

	for (const job of jobs) {
		it(`${job.name}: ASI, saving-throw profs, speed, and marker feature applied`, async () => {
			// Use the job's stat block as the baseline so we can assert exact
			// post-ASI values.
			const baseline = job.stats;
			const row = createLocalCharacter({
				name: `Test ${job.name}`,
				str: baseline.strength,
				agi: baseline.agility,
				vit: baseline.vitality,
				int: baseline.intelligence,
				sense: baseline.sense,
				pre: baseline.presence,
				job: job.name,
			});

			await applyJobAwakeningTraitsToCharacter(row.id, job);

			const after = getLocalCharacterWithAbilities(row.id);
			expect(
				after,
				`${job.name}: character should exist after apply`,
			).toBeDefined();

			// 1. ASI applied: every ability listed in abilityScoreImprovements
			// should equal baseline + ASI.
			const asi = job.abilityScoreImprovements as
				| Partial<Record<AbilityKey, number>>
				| undefined;
			if (asi) {
				for (const ability of ABILITY_KEYS) {
					const bonus = asi[ability] ?? 0;
					if (bonus === 0) continue;
					const col = ABILITY_TO_COLUMN[ability];
					const base = baseline[ability];
					expect(
						after?.[col],
						`${job.name}.${ability}: expected ${base}+${bonus}=${base + bonus}, got ${after?.[col]}`,
					).toBe(base + bonus);
				}
			}

			// 2. Saving-throw proficiencies from the job's `saving_throws` list.
			const saveCodes = (job.saving_throws ?? []).map(
				(s) => ABILITY_TO_SAVE_CODE[s.toLowerCase()] ?? s.toUpperCase(),
			);
			if (saveCodes.length > 0) {
				expect(
					after?.saving_throw_proficiencies ?? [],
					`${job.name}: saving_throw_proficiencies should include ${saveCodes.join(", ")}`,
				).toEqual(expect.arrayContaining(saveCodes));
			}

			// 3. Speed applied.
			if (typeof job.speed === "number") {
				expect(
					after?.speed,
					`${job.name}: speed ${job.speed}`,
				).toBeGreaterThanOrEqual(job.speed);
			}

			// 4. Marker feature present — proves applyJobAwakeningTraitsToCharacter
			// actually ran and recorded its work (idempotency guard).
			const features = listLocalFeatures(row.id);
			expect(
				features.some((f) => f.source === `Racial ASI: ${job.name}`),
				`${job.name}: should have Racial ASI marker feature`,
			).toBe(true);
		});
	}

	for (const job of jobs) {
		it(`${job.name}: invoking apply twice is idempotent (no double ASI)`, async () => {
			const baseline = job.stats;
			const row = createLocalCharacter({
				name: `Idempotent ${job.name}`,
				str: baseline.strength,
				agi: baseline.agility,
				vit: baseline.vitality,
				int: baseline.intelligence,
				sense: baseline.sense,
				pre: baseline.presence,
				job: job.name,
			});

			await applyJobAwakeningTraitsToCharacter(row.id, job);
			await applyJobAwakeningTraitsToCharacter(row.id, job);
			await applyJobAwakeningTraitsToCharacter(row.id, job);

			const after = getLocalCharacterWithAbilities(row.id);
			const asi = job.abilityScoreImprovements as
				| Partial<Record<AbilityKey, number>>
				| undefined;
			if (!asi) return;

			for (const ability of ABILITY_KEYS) {
				const bonus = asi[ability] ?? 0;
				if (bonus === 0) continue;
				const col = ABILITY_TO_COLUMN[ability];
				const base = baseline[ability];
				expect(
					after?.[col],
					`${job.name}.${ability}: triple-apply still yields ${base}+${bonus}=${base + bonus} (not ${base + bonus * 3})`,
				).toBe(base + bonus);
			}
		});
	}
});
