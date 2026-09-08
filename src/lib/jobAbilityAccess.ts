import {
	getCanonicalJobAbilityAccessMode,
	getCanonicalJobRules,
	getCanonicalJobSpellSchools,
} from "@/lib/jobRules";

type JobAccessKind = "full-caster" | "half-caster" | "pact-caster" | "martial";

interface JobAbilityAccess {
	kind: JobAccessKind;
	spells: boolean;
	powers: boolean;
	techniques: boolean;
	powerTags: string[];
	techniqueTags: string[];
}

/** Additive filter tags only; core access comes from jobs.ts canonicalRules. */
interface JobTagAccess {
	powerTags: string[];
	techniqueTags: string[];
}

const JOB_TAGS: Record<string, JobTagAccess> = {
	destroyer: {
		powerTags: [
			"destroyer",
			"aetheric-sight",
			"essence",
			"reinforced-frame",
			"weapon-bond",
		],
		techniqueTags: [
			"destroyer",
			"heavy-weapon",
			"bulwark",
			"breaker",
			"vanguard",
			"weapon-mana",
		],
	},
	berserker: {
		powerTags: [
			"berserker",
			"overload",
			"mana-shockwave",
			"thermal",
			"volatile-resonance",
			"regeneration",
		],
		techniqueTags: [
			"berserker",
			"overload",
			"shockwave",
			"brutal-melee",
			"survival",
			"heavy-weapon",
		],
	},
	assassin: {
		powerTags: [
			"assassin",
			"phase",
			"shadow",
			"umbral",
			"ghost-walk",
			"stealth",
			"true-sight",
		],
		techniqueTags: [
			"assassin",
			"assassination-art",
			"phase-strike",
			"ambush",
			"precision",
			"umbral",
		],
	},
	striker: {
		powerTags: [
			"striker",
			"neural-overdrive",
			"kinetic",
			"force",
			"nerve-gates",
			"impulse-sense",
		],
		techniqueTags: [
			"striker",
			"unarmed",
			"breath-control",
			"counter-stance",
			"kinetic",
			"martial",
		],
	},
	mage: {
		powerTags: [],
		techniqueTags: [],
	},
	esper: {
		powerTags: [],
		techniqueTags: [],
	},
	revenant: {
		// Drain-tank rework: Revenant is now a hybrid half-caster that gains
		// spells AND martial powers/techniques (like Holy Knight / Stalker /
		// Technomancer). Under the archetype model it inherits the whole martial
		// pool via membership; the tags below only feed the additive path/regent
		// layer and dialog "access" badges.
		powerTags: ["revenant", "entropy", "guard"],
		techniqueTags: ["revenant", "entropy", "vanguard"],
	},
	summoner: {
		powerTags: [],
		techniqueTags: [],
	},
	idol: {
		powerTags: [],
		techniqueTags: [],
	},
	herald: {
		powerTags: [],
		techniqueTags: [],
	},
	"holy knight": {
		powerTags: ["holy-knight", "covenant", "radiant", "oath", "guard"],
		techniqueTags: [
			"holy-knight",
			"covenant-strike",
			"guard",
			"radiant-weapon",
			"shield",
			"vanguard",
		],
	},
	technomancer: {
		powerTags: [
			"technomancer",
			"lattice-interface",
			"current-conductor",
			"emp",
			"device",
			"gadget",
		],
		techniqueTags: [
			"technomancer",
			"gadget-protocol",
			"drone",
			"device",
			"emp",
			"engineered-weapon",
		],
	},
	stalker: {
		powerTags: [
			"stalker",
			"prey-lock",
			"rift-resonance",
			"terminal-sight",
			"pursuit",
			"tracking",
		],
		techniqueTags: [
			"stalker",
			"archery",
			"dual-weapon",
			"pursuit",
			"trap",
			"ambush",
			"tracking",
		],
	},
	contractor: {
		powerTags: [],
		techniqueTags: [],
	},
};

export function normalizeJobAccessToken(
	value: string | null | undefined,
): string {
	return (value ?? "")
		.trim()
		.toLowerCase()
		.replace(/_/g, "-")
		.replace(/\s+/g, "-");
}

function normalizeJobLookup(value: string | null | undefined): string {
	return normalizeJobAccessToken(value).replace(/-/g, " ");
}

export function getJobAbilityAccess(
	jobName: string | null | undefined,
): JobAbilityAccess | null {
	const rules = getCanonicalJobRules(jobName);
	if (!rules) return null;
	const tagAccess = JOB_TAGS[normalizeJobLookup(jobName)] ?? {
		powerTags: [],
		techniqueTags: [],
	};
	const kind: JobAccessKind =
		rules.casterType === "full"
			? "full-caster"
			: rules.casterType === "pact"
				? "pact-caster"
				: rules.casterType === "half" || rules.casterType === "artificer"
					? "half-caster"
					: "martial";
	return {
		kind,
		spells: Boolean(rules.spellAccess),
		powers: Boolean(rules.powerAccess),
		techniques: Boolean(rules.techniqueAccess),
		...tagAccess,
	};
}

export function getPowerAccessTokens(
	jobName?: string | null,
	pathName?: string | null,
	regentNames?: string[] | null,
): string[] {
	const access = getJobAbilityAccess(jobName);
	const tokens = new Set<string>();
	if (access?.powers) {
		tokens.add(normalizeJobAccessToken(jobName));
		for (const tag of access.powerTags)
			tokens.add(normalizeJobAccessToken(tag));
	}
	if (pathName) tokens.add(normalizeJobAccessToken(pathName));
	for (const regent of regentNames ?? [])
		tokens.add(normalizeJobAccessToken(regent));
	return Array.from(tokens).filter(Boolean);
}

export function getSpellAccessTokens(
	jobName?: string | null,
	pathName?: string | null,
	regentNames?: string[] | null,
): string[] {
	const access = getJobAbilityAccess(jobName);
	const tokens = new Set<string>();
	if (access?.spells) tokens.add(normalizeJobAccessToken(jobName));
	if (pathName) tokens.add(normalizeJobAccessToken(pathName));
	for (const regent of regentNames ?? [])
		tokens.add(normalizeJobAccessToken(regent));
	return Array.from(tokens).filter(Boolean);
}

export function getTechniqueAccessTokens(
	jobName?: string | null,
	pathName?: string | null,
	regentNames?: string[] | null,
): string[] {
	const access = getJobAbilityAccess(jobName);
	const tokens = new Set<string>();
	if (access?.techniques) {
		tokens.add(normalizeJobAccessToken(jobName));
		for (const tag of access.techniqueTags)
			tokens.add(normalizeJobAccessToken(tag));
	}
	if (pathName) tokens.add(normalizeJobAccessToken(pathName));
	for (const regent of regentNames ?? [])
		tokens.add(normalizeJobAccessToken(regent));
	return Array.from(tokens).filter(Boolean);
}

export function entryHasAccessToken(
	tags: readonly string[] | null | undefined,
	tokens: readonly string[],
): boolean {
	if (tokens.length === 0) return false;
	const normalizedTags = new Set(
		(tags ?? []).map(normalizeJobAccessToken).filter(Boolean),
	);
	return tokens.some((token) =>
		normalizedTags.has(normalizeJobAccessToken(token)),
	);
}

// ─────────────────────────────────────────────────────────────────────────
// F2 — per-job power/technique ACCESS MODE (mirrors the caster prepared/known
// split for spells). "prepared" = choose a daily loadout (prepared limit +
// prep toggle); "known" = a fixed learned repertoire (no daily prep); "at-will"
// = usable freely with no prep and no per-tier slot gate. Only meaningful for
// jobs that actually learn powers/techniques; casters default to "at-will".
//   - Martials (Destroyer/Berserker/Assassin/Striker): powers at-will (innate
//     stances/arts), techniques a known repertoire.
//   - Half-caster hybrids mirror their spell prep: prepared casters (Holy
//     Knight, Technomancer, Revenant) prepare powers; Stalker (known caster)
//     knows them. Techniques are a known repertoire across the board.
// ─────────────────────────────────────────────────────────────────────────
export type AbilityAccessMode = "prepared" | "known" | "at-will";

/** Access mode a job uses for POWERS (defaults to at-will for non-power jobs). */
export function getJobPowerMode(
	jobName: string | null | undefined,
): AbilityAccessMode {
	return getCanonicalJobAbilityAccessMode(jobName, "power") ?? "at-will";
}

/** Access mode a job uses for TECHNIQUES (defaults to at-will). */
export function getJobTechniqueMode(
	jobName: string | null | undefined,
): AbilityAccessMode {
	return getCanonicalJobAbilityAccessMode(jobName, "technique") ?? "at-will";
}

export function jobCanLearnPowers(jobName: string | null | undefined): boolean {
	return getJobAbilityAccess(jobName)?.powers ?? false;
}

export function jobCanLearnTechniques(
	jobName: string | null | undefined,
): boolean {
	return getJobAbilityAccess(jobName)?.techniques ?? false;
}

export function jobCanLearnSpells(jobName: string | null | undefined): boolean {
	return getJobAbilityAccess(jobName)?.spells ?? false;
}

/**
 * The set of spell schools a caster job can learn from. Returns null for
 * non-casters. The "*" sentinel (Mage) means "every school".
 */
export function getCasterSchools(
	jobName: string | null | undefined,
): string[] | null {
	return getCanonicalJobSpellSchools(jobName);
}

/**
 * Archetype spell gating: does the given school fall within the caster job's
 * allowed school set? Mage ("*") matches every school.
 */
export function spellSchoolMatchesJob(
	school: string | null | undefined,
	jobName: string | null | undefined,
): boolean {
	const schools = getCasterSchools(jobName);
	if (!schools) return false;
	if (schools.includes("*")) return true;
	const normalized = (school ?? "").trim().toLowerCase();
	if (!normalized) return false;
	return schools.includes(normalized);
}

// ─────────────────────────────────────────────────────────────────────────
// Owner model — a power/technique is owned by the job(s) named in its
// `classes` list (RA has jobs, not classes). A job may learn an ability
// natively only if it is an owner; every other job acquires it through the
// Rune system. Path/regent grants remain the owner-side additive layer.
// ─────────────────────────────────────────────────────────────────────────

/** Normalized owner-job tokens declared on an entry's `classes` list. */
export function getAbilityOwnerJobs(
	entry: { classes?: string[] | null } | null | undefined,
): string[] {
	const classes = entry?.classes;
	if (!Array.isArray(classes)) return [];
	return classes
		.map((value) => normalizeJobAccessToken(value))
		.filter((value) => value.length > 0);
}

/**
 * True iff `jobName` is an owner of the ability (its `classes` list names it).
 * An empty/absent owner list means no job owns it natively — access is
 * path-grant + Rune only.
 */
export function jobOwnsAbility(
	jobName: string | null | undefined,
	entry: { classes?: string[] | null } | null | undefined,
): boolean {
	const owners = getAbilityOwnerJobs(entry);
	if (owners.length === 0) return false;
	return owners.includes(normalizeJobAccessToken(jobName));
}

// ─────────────────────────────────────────────────────────────────────────
// Job-signature SPELLS. Generic spells are gated by magic SCHOOL, but a few
// spells are the signature magic of a single job (e.g. a Contractor's pact
// magic). Their stored `classes`/`school` are generic/school-derived and do
// not encode that ownership, so this curated map is the authoritative owner:
// only the owner job learns them natively; any other job acquires them via the
// Rune system. Keyed by apostrophe-stripped lowercase spell name.
// ─────────────────────────────────────────────────────────────────────────
const SIGNATURE_SPELL_OWNERS: Record<string, string[]> = {
	// Contractor — pact / patron magic
	"pact spark": ["Contractor"],
	"pact shield": ["Contractor"],
	"pact chains": ["Contractor"],
	"pact hunger": ["Contractor"],
	"pact gate": ["Contractor"],
	"pact dominion": ["Contractor"],
	"pact renegotiation": ["Contractor"],
	"pact brand": ["Contractor"],
	"nightmare pact": ["Contractor"],
	"patrons avatar": ["Contractor"],
	"patrons witness": ["Contractor"],
	"patrons judgment": ["Contractor"],
	// Revenant — entropy/undeath signatures
	"revenants embrace": ["Revenant"],
	"revenants domain": ["Revenant"],
	// Idol — performance signatures
	"idols crescendo": ["Idol"],
	"idols entrance": ["Idol"],
	"idols grand finale": ["Idol"],
};

function normalizeSignatureSpellKey(value: string | null | undefined): string {
	return (value ?? "").trim().toLowerCase().replace(/['’]/g, "");
}

/**
 * Normalized owner-job tokens for a job-signature spell, or [] if the spell is
 * not a signature (in which case it falls back to generic school gating).
 */
export function getSignatureSpellOwners(
	entry:
		| { name?: string | null; display_name?: string | null }
		| null
		| undefined,
): string[] {
	const key = normalizeSignatureSpellKey(entry?.name ?? entry?.display_name);
	const owners = SIGNATURE_SPELL_OWNERS[key];
	return owners ? owners.map((owner) => normalizeJobAccessToken(owner)) : [];
}
