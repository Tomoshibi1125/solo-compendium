import { describe, expect, it } from "vitest";
import { jobs } from "../../data/compendium/jobs";
import { paths } from "../../data/compendium/paths";
import { powers } from "../../data/compendium/powers";
import { regents } from "../../data/compendium/regents";
import { techniques } from "../../data/compendium/techniques";
import {
	listCanonicalSpells,
	listLearnablePowers,
	listLearnableSpells,
	listLearnableTechniques,
} from "../canonicalCompendium";
import {
	getSignatureSpellOwners,
	normalizeJobAccessToken,
} from "../jobAbilityAccess";
import { PATH_ABILITY_GRANTS } from "../pathAbilityAccess";
import { resolveRuneGrant } from "../runeAutomation";

// Entries that exist in the catalog but are intentionally not learnable by any
// job naturally and are not granted by any path. They remain in the catalog so
// they stay rune-target-able (see runeAutomation / useAbsorbRune).
const RUNE_ONLY_POWER_IDS = new Set<string>([
	"power-sup-6-89-idol-s-magnum-opus",
	// Idol (spell-caster) signature powers with no path grant — Idol cannot
	// natively learn powers, so these are reachable only via the Rune system.
	"power-sup-2-23-tempo-shift",
	"power-sup-2-70-harmonic-ward",
	"power-sup-2-107-resonance-counter",
]);
const RUNE_ONLY_TECHNIQUE_IDS = new Set<string>([
	"tech-sup-3-31-dance-of-blades",
	"tech-sup-6-68-resonance-blade-dance",
]);

// ── Archetype membership ──────────────────────────────────────────────────
const MARTIAL_JOBS = ["Destroyer", "Berserker", "Assassin", "Striker"];
const HYBRID_JOBS = ["Holy Knight", "Technomancer", "Stalker", "Revenant"];
const PURE_CASTERS = ["Mage", "Esper", "Summoner", "Idol", "Herald"];
const PACT_CASTERS = ["Contractor"];
// Every job that can learn martial powers/techniques (archetype: shared pool).
const MARTIAL_CAPABLE = [...MARTIAL_JOBS, ...HYBRID_JOBS];
// Every job that can learn spells (archetype: school-scoped list).
const CASTER_JOBS = [...HYBRID_JOBS, ...PURE_CASTERS, ...PACT_CASTERS];
const ALL_JOBS = [
	...MARTIAL_JOBS,
	...HYBRID_JOBS,
	...PURE_CASTERS,
	...PACT_CASTERS,
];

// Pool floors (Part A target): comprehensive shared catalogs.
const POOL_POWER_FLOOR = 200;
const POOL_TECHNIQUE_FLOOR = 200;
// Owner model: each martial-capable job sees the shared archetype pool plus the
// signatures it OWNS (its `classes`/tags), not the whole catalog. The per-job
// total is therefore the generic pool + its own kit, well below the raw catalog.
const MARTIAL_POWER_FLOOR = 80;
const MARTIAL_TECHNIQUE_FLOOR = 95;

// School-union spell floors per caster (Mage = all schools).
const SPELL_FLOORS: Record<string, number> = {
	Mage: 140,
	Esper: 110,
	Summoner: 100,
	Idol: 85,
	Herald: 110,
	Contractor: 80,
	// Hybrid half-casters (incl. Revenant) keep a smaller school-scoped list.
	"Holy Knight": 45,
	Technomancer: 45,
	Stalker: 45,
	Revenant: 45,
};

const norm = (value: string | null | undefined): string =>
	(value ?? "").trim().toLowerCase();

// Build the signature-name set from the authoritative identity sources: no
// learnable catalog entry may share a job/path/regent signature name.
function buildSignatureNameSet(): Set<string> {
	const sigs = new Set<string>();
	const add = (value: string | null | undefined) => {
		const n = norm(value);
		if (n) sigs.add(n);
	};
	for (const job of jobs) {
		add(job.name);
		for (const a of job.abilities ?? []) add(a);
		for (const f of job.awakeningFeatures ?? []) add(f.name);
		for (const t of job.jobTraits ?? []) add(t.name);
		for (const f of job.classFeatures ?? []) add(f.name);
		for (const r of job.racialTraits ?? []) add(r.name);
	}
	for (const path of paths) {
		add(path.name);
		for (const f of path.features ?? []) add(f.name);
		for (const a of path.abilities ?? []) add(a.name);
	}
	for (const regent of regents) {
		add(regent.name);
		const ext = regent as typeof regent & {
			abilities?: Array<{ name: string }>;
			features?: Array<{ name: string }>;
		};
		for (const a of ext.abilities ?? []) add(a.name);
		for (const f of regent.class_features ?? []) add(f.name);
		for (const f of ext.features ?? []) add(f.name);
	}
	return sigs;
}

describe("Job ability coverage — archetype contract", () => {
	it("prints the per-job coverage matrix and reaches every catalog entry", async () => {
		console.log(
			`Compendium totals — powers: ${powers.length}, techniques: ${techniques.length}`,
		);
		const allSpells = await listCanonicalSpells();
		const seen = {
			powers: new Set<string>(),
			techniques: new Set<string>(),
			spells: new Set<string>(),
		};

		for (const job of ALL_JOBS) {
			const p = await listLearnablePowers({ jobName: job });
			const t = await listLearnableTechniques({ jobName: job });
			const s = await listLearnableSpells({ jobName: job });
			for (const entry of p) seen.powers.add(entry.id);
			for (const entry of t) seen.techniques.add(entry.id ?? entry.name);
			for (const entry of s) seen.spells.add(entry.id);
			console.log(
				`${job.padEnd(16)} powers: ${String(p.length).padStart(3)}  techniques: ${String(t.length).padStart(3)}  spells: ${String(s.length).padStart(3)}`,
			);
		}

		// Path grants are an additive layer — count anything reachable only via a
		// PATH_ABILITY_GRANTS pairing as "seen" too.
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

		expect(unseenPowers.map((p) => p.id)).toEqual([]);
		expect(unseenTechniques.map((t) => t.id)).toEqual([]);
		expect(unseenSpells.map((s) => s.id)).toEqual([]);
	});

	it("provides comprehensive shared martial + spell pools", () => {
		expect(powers.length).toBeGreaterThanOrEqual(POOL_POWER_FLOOR);
		expect(techniques.length).toBeGreaterThanOrEqual(POOL_TECHNIQUE_FLOOR);
	});

	it("gives every martial-capable job the deep shared martial pool", async () => {
		for (const job of MARTIAL_CAPABLE) {
			const p = await listLearnablePowers({ jobName: job });
			const t = await listLearnableTechniques({ jobName: job });
			expect(p.length, `${job} power pool`).toBeGreaterThanOrEqual(
				MARTIAL_POWER_FLOOR,
			);
			expect(t.length, `${job} technique pool`).toBeGreaterThanOrEqual(
				MARTIAL_TECHNIQUE_FLOOR,
			);
			// Level spread across the canonical tiers 1/3/5/9.
			for (const level of [1, 3, 5, 9]) {
				expect(
					p.filter((e) => e.power_level === level).length,
					`${job} powers at level ${level}`,
				).toBeGreaterThanOrEqual(1);
			}
			for (const level of [1, 3, 5, 9]) {
				expect(
					t.filter((e) => (e.level_requirement ?? e.level ?? 0) === level)
						.length,
					`${job} techniques at level ${level}`,
				).toBeGreaterThanOrEqual(1);
			}
		}
	});

	it("scopes every caster's spell list by school to its floor with rank spread", async () => {
		const counts: number[] = [];
		for (const job of CASTER_JOBS) {
			const s = await listLearnableSpells({ jobName: job });
			counts.push(s.length);
			expect(s.length, `${job} spell-list total`).toBeGreaterThanOrEqual(
				SPELL_FLOORS[job] ?? 45,
			);
			const ranks = new Set(s.map((e) => e.rank).filter(Boolean));
			expect(ranks.size, `${job} distinct spell ranks`).toBeGreaterThanOrEqual(
				4,
			);
			const highRank = s.filter((e) => e.rank === "A" || e.rank === "S").length;
			expect(highRank, `${job} high-rank (A/S) spells`).toBeGreaterThanOrEqual(
				1,
			);
		}
		// Casters do not all see the same number of spells (school scoping).
		expect(new Set(counts).size).toBeGreaterThan(1);
	});

	it("keeps Mage as the broadest caster (every school, minus other jobs' signature spells)", async () => {
		const mage = await listLearnableSpells({ jobName: "Mage" });
		const allSpells = await listCanonicalSpells();
		// Mage is the arcane generalist: it reaches every spell EXCEPT job-
		// signature spells owned by another job (pact / Idol's / Revenant's …),
		// which are owner + Rune only.
		const reachableByMage = allSpells.filter((spell) => {
			const owners = getSignatureSpellOwners(spell);
			return (
				owners.length === 0 || owners.includes(normalizeJobAccessToken("Mage"))
			);
		});
		expect(mage.length).toBeGreaterThanOrEqual(reachableByMage.length - 5);
		// And it is still strictly the broadest caster.
		for (const job of ["Esper", "Summoner", "Idol", "Herald", "Contractor"]) {
			const other = await listLearnableSpells({ jobName: job });
			expect(mage.length, `Mage vs ${job}`).toBeGreaterThan(other.length);
		}
	});

	it("enforces archetype separation (casters get no martial pool, martials get no spells)", async () => {
		for (const job of [...PURE_CASTERS, ...PACT_CASTERS]) {
			expect(
				await listLearnablePowers({ jobName: job }),
				`${job} power access`,
			).toHaveLength(0);
			expect(
				await listLearnableTechniques({ jobName: job }),
				`${job} technique access`,
			).toHaveLength(0);
		}
		for (const job of MARTIAL_JOBS) {
			expect(
				await listLearnableSpells({ jobName: job }),
				`${job} spell access`,
			).toHaveLength(0);
		}
	});

	it("gives hybrids all three channels", async () => {
		for (const job of HYBRID_JOBS) {
			expect(
				(await listLearnablePowers({ jobName: job })).length,
				`${job} powers`,
			).toBeGreaterThan(0);
			expect(
				(await listLearnableTechniques({ jobName: job })).length,
				`${job} techniques`,
			).toBeGreaterThan(0);
			expect(
				(await listLearnableSpells({ jobName: job })).length,
				`${job} spells`,
			).toBeGreaterThan(0);
		}
	});

	it("never exposes a free generic catalog entry that duplicates a job/path/regent signature", () => {
		const signatures = buildSignatureNameSet();
		// Path-grant targets are an intentional, thematically-named additive
		// layer (PATH_ABILITY_GRANTS): selecting the path is how you earn them,
		// so their signature-flavored names are by design and exempt here. The
		// guardrail still catches a FREE generic-pool entry that duplicates an
		// identity signature (e.g. the old "Apex Predator" power).
		const grantTargets = new Set<string>();
		for (const grant of PATH_ABILITY_GRANTS) {
			for (const name of grant.entryNames ?? []) grantTargets.add(norm(name));
		}
		const collisions: string[] = [];
		for (const entry of powers) {
			const n = norm(entry.name);
			if (signatures.has(n) && !grantTargets.has(n))
				collisions.push(`power:${entry.name}`);
		}
		for (const entry of techniques) {
			const n = norm(entry.name);
			if (signatures.has(n) && !grantTargets.has(n))
				collisions.push(`technique:${entry.name}`);
		}
		expect(
			collisions,
			`Generic catalog entries collide with job/path/regent signatures:\n${collisions.join("\n")}`,
		).toEqual([]);
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

describe("Job ability owner-gate — signatures are owner + Rune only", () => {
	const MARTIAL_CAPABLE_JOBS = [
		"Destroyer",
		"Berserker",
		"Assassin",
		"Striker",
		"Holy Knight",
		"Stalker",
		"Technomancer",
		"Revenant",
	];

	it("hides the Contractor signature 'Pact Blade' from every other job's base list", async () => {
		for (const job of MARTIAL_CAPABLE_JOBS) {
			const techs = await listLearnableTechniques({
				jobName: job,
				characterLevel: 20,
			});
			expect(
				techs.some((t) => t.name === "Pact Blade"),
				`${job} must not see Pact Blade in its base list`,
			).toBe(false);
		}
	});

	it("keeps the martial signature 'Berserker's Fury' off every non-owner's base list", async () => {
		// Owned by Berserker; also granted via Berserker's Path of the Escalating
		// Resonance, so it is path-gated even for Berserker's base list. No other
		// martial job may natively learn it — they use the Rune system.
		for (const job of MARTIAL_CAPABLE_JOBS) {
			const powersList = await listLearnablePowers({
				jobName: job,
				characterLevel: 20,
			});
			expect(
				powersList.some((p) => p.name === "Berserker's Fury"),
				`${job} must not natively learn Berserker's Fury without its path`,
			).toBe(false);
		}
		// Berserker earns it by selecting the granting path.
		const viaPath = await listLearnablePowers({
			jobName: "Berserker",
			pathName: "Path of the Escalating Resonance",
			characterLevel: 20,
		});
		expect(viaPath.some((p) => p.name === "Berserker's Fury")).toBe(true);
	});

	it("restricts the signature spell 'Pact Shield' to Contractor among casters", async () => {
		for (const job of [
			"Mage",
			"Herald",
			"Holy Knight",
			"Technomancer",
			"Revenant",
		]) {
			const spells = await listLearnableSpells({
				jobName: job,
				characterLevel: 20,
			});
			expect(
				spells.some((s) => s.name === "Pact Shield"),
				`${job} must not see the Contractor spell Pact Shield`,
			).toBe(false);
		}
		const contractor = await listLearnableSpells({
			jobName: "Contractor",
			characterLevel: 20,
		});
		expect(contractor.some((s) => s.name === "Pact Shield")).toBe(true);
	});

	it("still lets any job acquire a signature via the Rune system (cross-class)", async () => {
		const grant = await resolveRuneGrant(
			{ kind: "technique", ref: "Pact Blade" },
			{ jobName: "Destroyer", characterLevel: 20 },
		);
		expect(grant?.abilityEntry?.name).toBe("Pact Blade");
		// Destroyer is not an owner, so the rune-taught ability is cross-class.
		expect(grant?.isNative).toBe(false);
	});
});
