/**
 * Jobs racial parity audit.
 *
 * Rift Ascendant jobs function as both race and class. This test asserts:
 *  - All 14 canonical jobs are present (no Summoner-style conflation).
 *  - Every job has the full 5e-race-equivalent output surface populated
 *    (racialTraits, abilityScoreImprovements, saving_throws, size, speed,
 *    languages, skillChoices, hitDie).
 *  - The 2-saves-per-job invariant holds.
 *  - No object in jobs.ts declares duplicate object-literal keys (the exact
 *    bug that hid the Stalker block inside Summoner).
 *  - `getRacialTraitModifiers` returns non-empty modifier lists for every
 *    named racial trait where the plan specifies mechanical output.
 *  - No racialTraits/innateChanneling spell name collides with a known 5e
 *    racial trait (Fey Ancestry, Dwarven Resilience, Infernal Legacy, etc.).
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { jobs } from "@/data/compendium/jobs";
import { getRacialTraitModifiers } from "@/lib/characterCreation";

const EXPECTED_JOB_IDS = [
	"destroyer",
	"berserker",
	"assassin",
	"striker",
	"mage",
	"esper",
	"revenant",
	"summoner",
	"holy-knight",
	"technomancer",
	"idol",
	"herald",
	"contractor",
	"stalker",
] as const;

const BANNED_5E_NAMES = new Set(
	[
		"Fey Ancestry",
		"Dwarven Resilience",
		"Infernal Legacy",
		"Mask of the Wild",
		"Stonecunning",
		"Breath Weapon",
		"Keen Senses",
		"Menacing",
		"Savage Attacks",
		"Relentless Endurance",
		"Trance",
		"Stone's Endurance",
		"Hellish Resistance",
		"Draconic Ancestry",
	].map((s) => s.toLowerCase()),
);

describe("jobs racial parity", () => {
	it("defines exactly the 14 canonical jobs by id", () => {
		const ids = jobs.map((j) => j.id).sort();
		expect(ids).toEqual([...EXPECTED_JOB_IDS].sort());
	});

	it("every job declares at least 3 racialTraits", () => {
		for (const job of jobs) {
			expect(
				(job.racialTraits ?? []).length,
				`${job.name} racialTraits count`,
			).toBeGreaterThanOrEqual(3);
		}
	});

	it("every job has 2 saving throw proficiencies (matching 5e class convention)", () => {
		for (const job of jobs) {
			expect(
				job.saving_throws,
				`${job.name} saving_throws defined`,
			).toBeDefined();
			expect(
				(job.saving_throws ?? []).length,
				`${job.name} saving_throws length`,
			).toBe(2);
		}
	});

	it("every job has a racial +2/+1 ASI summing to 3", () => {
		for (const job of jobs) {
			const asi = job.abilityScoreImprovements;
			expect(asi, `${job.name} ASI defined`).toBeTruthy();
			expect(
				Array.isArray(asi),
				`${job.name} ASI is object not level array`,
			).toBe(false);
			const total = Object.values(asi as Record<string, number>).reduce<number>(
				(a, b) => a + (typeof b === "number" ? b : 0),
				0,
			);
			expect(total, `${job.name} ASI sum`).toBe(3);
		}
	});

	it("every job populates size, speed, languages, skillChoices, hitDie", () => {
		for (const job of jobs) {
			expect(job.size, `${job.name} size`).toBeTruthy();
			expect(
				typeof job.speed === "number" && job.speed > 0,
				`${job.name} speed`,
			).toBe(true);
			expect(
				(job.languages ?? []).length,
				`${job.name} languages count`,
			).toBeGreaterThanOrEqual(1);
			expect(
				(job.skillChoices ?? []).length,
				`${job.name} skillChoices count`,
			).toBeGreaterThanOrEqual(1);
			expect(job.hitDie, `${job.name} hitDie`).toMatch(/^1d(6|8|10|12)$/);
		}
	});

	it("no job object declares duplicate top-level keys (Summoner-conflation guard)", () => {
		// Read the raw file; scan each object literal for duplicate keys at the
		// top level. Catches the exact issue that hid the Stalker block inside
		// Summoner in the pre-fix codebase.
		const here = dirname(fileURLToPath(import.meta.url));
		const jobsPath = resolve(here, "..", "..", "data", "compendium", "jobs.ts");
		const text = readFileSync(jobsPath, "utf-8");
		// Find each job object by its `id: "..."` anchor and extract to the next
		// top-level `},` marker for that job (very coarse but effective here).
		const objectStarts: Array<{ idValue: string; start: number }> = [];
		const idRegex = /\{\s*\n?\s*id:\s*"([^"]+)"/g;
		let match: RegExpExecArray | null = idRegex.exec(text);
		while (match !== null) {
			objectStarts.push({ idValue: match[1], start: match.index });
			match = idRegex.exec(text);
		}
		for (let i = 0; i < objectStarts.length; i++) {
			const start = objectStarts[i].start;
			const end =
				i + 1 < objectStarts.length ? objectStarts[i + 1].start : text.length;
			const slice = text.slice(start, end);
			// Collect top-level keys at depth 1 (relative to the job object brace).
			const keyCounts: Record<string, number> = {};
			let depth = 0;
			let inString: false | '"' | "'" | "`" = false;
			let inLineComment = false;
			let inBlockComment = false;
			for (let p = 0; p < slice.length; p++) {
				const ch = slice[p];
				const nx = slice[p + 1];
				if (inLineComment) {
					if (ch === "\n") inLineComment = false;
					continue;
				}
				if (inBlockComment) {
					if (ch === "*" && nx === "/") {
						inBlockComment = false;
						p++;
					}
					continue;
				}
				if (inString) {
					if (ch === "\\") {
						p++;
						continue;
					}
					if (ch === inString) inString = false;
					continue;
				}
				if (ch === "/" && nx === "/") {
					inLineComment = true;
					p++;
					continue;
				}
				if (ch === "/" && nx === "*") {
					inBlockComment = true;
					p++;
					continue;
				}
				if (ch === '"' || ch === "'" || ch === "`") {
					inString = ch as '"' | "'" | "`";
					continue;
				}
				if (ch === "{" || ch === "[" || ch === "(") depth++;
				else if (ch === "}" || ch === "]" || ch === ")") depth--;
				if (depth === 1) {
					// At depth 1 (inside the job object), identifier `key:` is a top-level key.
					const keyRegex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/;
					const sub = slice.slice(p);
					const km = keyRegex.exec(sub);
					if (km && (p === 0 || /[\n,{]/.test(slice[p - 1]))) {
						keyCounts[km[1]] = (keyCounts[km[1]] ?? 0) + 1;
						p += km[0].length - 1;
					}
				}
			}
			const duplicates = Object.entries(keyCounts)
				.filter(([, c]) => c > 1)
				.map(([k]) => k);
			expect(
				duplicates,
				`Job "${objectStarts[i].idValue}" has duplicate top-level keys: ${duplicates.join(", ")}`,
			).toEqual([]);
		}
	});

	it("no racialTraits/innateChanneling name collides with a 5e racial feature", () => {
		const collisions: string[] = [];
		for (const job of jobs) {
			for (const rt of job.racialTraits ?? []) {
				if (BANNED_5E_NAMES.has(rt.name.toLowerCase())) {
					collisions.push(`${job.name} / ${rt.name} (racialTrait)`);
				}
			}
			for (const sp of job.innateChanneling?.spells ?? []) {
				if (BANNED_5E_NAMES.has(sp.name.toLowerCase())) {
					collisions.push(`${job.name} / ${sp.name} (innateChanneling)`);
				}
			}
		}
		expect(collisions, `5e-name collisions: ${collisions.join(", ")}`).toEqual(
			[],
		);
	});

	it("getRacialTraitModifiers returns modifiers for mechanical traits", () => {
		// Sample key traits across all 14 jobs — every one expected to have a
		// non-empty modifier list per the plan's skill/save partition.
		const expectations: Array<{ job: string; trait: string }> = [
			{ job: "Destroyer", trait: "Crystalline Bone Density" },
			{ job: "Berserker", trait: "Mana-Saturated Metabolism" },
			{ job: "Berserker", trait: "Volatile Resonance Aura" },
			{ job: "Assassin", trait: "Partial Dimensional Existence" },
			{ job: "Assassin", trait: "Apex Sensory Array" },
			{ job: "Striker", trait: "Hyper-Twitch Fibers" },
			{ job: "Mage", trait: "Aetheric Resonance Shield" },
			{ job: "Mage", trait: "Arcane Optic Mutation" },
			{ job: "Esper", trait: "Neural Overclocking" },
			{ job: "Revenant", trait: "Death-Scarred Physiology" },
			{ job: "Summoner", trait: "Aetheric Anchor" },
			{ job: "Summoner", trait: "Summoner's Ward" },
			{ job: "Herald", trait: "Mandate-Receptive Cortex" },
			{ job: "Contractor", trait: "Pact Brand Physiology" },
			{ job: "Stalker", trait: "Predator-Optimized Physiology" },
			{ job: "Stalker", trait: "Rift Resonance Sense" },
			{ job: "Holy Knight", trait: "Radiant Scales" },
			{ job: "Holy Knight", trait: "Aura of Command" },
			{ job: "Technomancer", trait: "Cyber-Mana Integration" },
			{ job: "Idol", trait: "Harmonic Frequency Physiology" },
			{ job: "Idol", trait: "Dissonance Immunity" },
		];
		for (const { job, trait } of expectations) {
			const mods = getRacialTraitModifiers(job, trait);
			expect(
				mods.length,
				`${job} / ${trait} should produce modifiers`,
			).toBeGreaterThan(0);
		}
	});

	it("Herald is a cleric analog (Sense+Presence saves, Presence primary)", () => {
		const herald = jobs.find((j) => j.id === "herald");
		expect(herald).toBeDefined();
		expect(herald?.saving_throws).toEqual(["Sense", "Presence"]);
		expect(herald?.primaryAbility).toBe("Presence");
	});

	it("Contractor is a warlock analog (Sense+Presence saves, pact caster)", () => {
		const contractor = jobs.find((j) => j.id === "contractor");
		expect(contractor).toBeDefined();
		expect(contractor?.saving_throws).toEqual(["Sense", "Presence"]);
		expect(contractor?.primaryAbility).toBe("Presence");
	});

	it("Stalker is a ranger analog (Strength+Agility saves, half caster)", () => {
		const stalker = jobs.find((j) => j.id === "stalker");
		expect(stalker).toBeDefined();
		expect(stalker?.saving_throws).toEqual(["Strength", "Agility"]);
		expect(stalker?.primaryAbility).toBe("Agility");
	});

	it("Idol is a bard analog (Agility+Presence saves, Hype die)", () => {
		const idol = jobs.find((j) => j.id === "idol");
		expect(idol).toBeDefined();
		expect(idol?.saving_throws).toEqual(["Agility", "Presence"]);
		expect(idol?.abilities).toContain("Hype");
	});
});
