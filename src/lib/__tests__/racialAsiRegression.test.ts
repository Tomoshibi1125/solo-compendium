/**
 * Regression test for the ASI-at-level-1 bug.
 *
 * Before this fix, `job.abilityScoreImprovements` was serialized into a JSON
 * column on the character row but **never merged into the actual ability-score
 * columns** (str/agi/vit/int/sense/pre). Every character was silently 3 points
 * of attribute short.
 *
 * This test creates a guest character, applies a job's awakening traits, and
 * asserts the ability scores reflect the racial ASI. It also asserts that
 * repeated invocations are idempotent (no double-counting).
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { applyJobAwakeningTraitsToCharacter } from "@/lib/characterCreation";
import {
	createLocalCharacter,
	getLocalCharacterWithAbilities,
	listLocalFeatures,
} from "@/lib/guestStore";

// Minimal localStorage polyfill for vitest environments that strip it.
function ensureLocalStorage() {
	if (typeof globalThis.localStorage === "undefined") {
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
}

describe("racial ASI at level 1", () => {
	beforeEach(() => {
		ensureLocalStorage();
		globalThis.localStorage.clear();
	});
	afterEach(() => {
		globalThis.localStorage.clear();
	});

	it("merges Destroyer ASI (STR +2, VIT +1) into character stats", async () => {
		const destroyer = jobs.find((j) => j.id === "destroyer");
		if (!destroyer) throw new Error("Destroyer job not found");

		// Baseline: 15/13/14/10/12/8 (per the Destroyer's `stats` block).
		const row = createLocalCharacter({
			name: "Test Destroyer",
			str: 15,
			agi: 13,
			vit: 14,
			int: 10,
			sense: 12,
			pre: 8,
			job: "Destroyer",
		});

		await applyJobAwakeningTraitsToCharacter(row.id, destroyer);

		const after = getLocalCharacterWithAbilities(row.id);
		expect(after).toBeDefined();
		expect(after?.str).toBe(17); // 15 + 2
		expect(after?.vit).toBe(15); // 14 + 1
		expect(after?.agi).toBe(13); // unchanged
		expect(after?.int).toBe(10);
		expect(after?.sense).toBe(12);
		expect(after?.pre).toBe(8);

		// Marker feature is present.
		const features = listLocalFeatures(row.id);
		expect(features.some((f) => f.source === "Racial ASI: Destroyer")).toBe(
			true,
		);
	});

	it("is idempotent — invoking twice does not double-apply ASI", async () => {
		const mage = jobs.find((j) => j.id === "mage");
		if (!mage) throw new Error("Mage job not found");

		const row = createLocalCharacter({
			name: "Test Mage",
			str: 8,
			agi: 14,
			vit: 13,
			int: 15,
			sense: 12,
			pre: 10,
			job: "Mage",
		});

		await applyJobAwakeningTraitsToCharacter(row.id, mage);
		await applyJobAwakeningTraitsToCharacter(row.id, mage);
		await applyJobAwakeningTraitsToCharacter(row.id, mage);

		const after = getLocalCharacterWithAbilities(row.id);
		expect(after?.int).toBe(17); // 15 + 2, NOT 15 + 6
		expect(after?.pre).toBe(11); // 10 + 1, NOT 10 + 3
	});

	it("sets Summoner saving throw profs, speed, senses, resistances at creation", async () => {
		const summoner = jobs.find((j) => j.id === "summoner");
		if (!summoner) throw new Error("Summoner job not found");

		const row = createLocalCharacter({
			name: "Test Summoner",
			str: 10,
			agi: 13,
			vit: 14,
			int: 13,
			sense: 15,
			pre: 12,
			job: "Summoner",
		});

		await applyJobAwakeningTraitsToCharacter(row.id, summoner);

		const after = getLocalCharacterWithAbilities(row.id);
		expect(after?.speed).toBeGreaterThanOrEqual(30);
		expect(after?.saving_throw_proficiencies).toEqual(
			expect.arrayContaining(["INT", "SENSE"]),
		);
		expect(after?.senses ?? []).toEqual(
			expect.arrayContaining([expect.stringMatching(/Darkvision/)]),
		);
		expect(after?.resistances ?? []).toContain("poison");
	});

	it("applies Stalker speed 35 and Survival is a legal skill choice", async () => {
		const stalker = jobs.find((j) => j.id === "stalker");
		if (!stalker) throw new Error("Stalker job not found");

		const row = createLocalCharacter({
			name: "Test Stalker",
			str: 12,
			agi: 15,
			vit: 13,
			int: 10,
			sense: 14,
			pre: 8,
			job: "Stalker",
		});

		await applyJobAwakeningTraitsToCharacter(row.id, stalker);

		const after = getLocalCharacterWithAbilities(row.id);
		expect(after?.speed).toBe(35);
		expect(after?.saving_throw_proficiencies).toEqual(
			expect.arrayContaining(["STR", "AGI"]),
		);
		expect(stalker?.skillChoices).toContain("Survival");
	});

	it("Herald ASI (PRE +2, SENSE +1) applies and saves are [SENSE, PRE]", async () => {
		const herald = jobs.find((j) => j.id === "herald");
		if (!herald) throw new Error("Herald job not found");

		const row = createLocalCharacter({
			name: "Test Herald",
			str: 10,
			agi: 10,
			vit: 13,
			int: 12,
			sense: 14,
			pre: 15,
			job: "Herald",
		});

		await applyJobAwakeningTraitsToCharacter(row.id, herald);

		const after = getLocalCharacterWithAbilities(row.id);
		expect(after?.pre).toBe(17); // 15 + 2
		expect(after?.sense).toBe(15); // 14 + 1
		expect(after?.saving_throw_proficiencies).toEqual(
			expect.arrayContaining(["SENSE", "PRE"]),
		);
	});
});
