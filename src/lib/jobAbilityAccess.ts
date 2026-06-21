type JobAccessKind = "full-caster" | "half-caster" | "pact-caster" | "martial";

interface JobAbilityAccess {
	kind: JobAccessKind;
	spells: boolean;
	powers: boolean;
	techniques: boolean;
	powerTags: string[];
	techniqueTags: string[];
}

const JOB_ACCESS: Record<string, JobAbilityAccess> = {
	destroyer: {
		kind: "martial",
		spells: false,
		powers: true,
		techniques: true,
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
		kind: "martial",
		spells: false,
		powers: true,
		techniques: true,
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
		kind: "martial",
		spells: false,
		powers: true,
		techniques: true,
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
		kind: "martial",
		spells: false,
		powers: true,
		techniques: true,
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
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
		powerTags: [],
		techniqueTags: [],
	},
	esper: {
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
		powerTags: [],
		techniqueTags: [],
	},
	revenant: {
		// Drain-tank rework: Revenant is now a hybrid half-caster that gains
		// spells AND martial powers/techniques (like Holy Knight / Stalker /
		// Technomancer). Under the archetype model it inherits the whole martial
		// pool via membership; the tags below only feed the additive path/regent
		// layer and dialog "access" badges.
		kind: "half-caster",
		spells: true,
		powers: true,
		techniques: true,
		powerTags: ["revenant", "entropy", "guard"],
		techniqueTags: ["revenant", "entropy", "vanguard"],
	},
	summoner: {
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
		powerTags: [],
		techniqueTags: [],
	},
	idol: {
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
		powerTags: [],
		techniqueTags: [],
	},
	herald: {
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
		powerTags: [],
		techniqueTags: [],
	},
	"holy knight": {
		kind: "half-caster",
		spells: true,
		powers: true,
		techniques: true,
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
		kind: "half-caster",
		spells: true,
		powers: true,
		techniques: true,
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
		kind: "half-caster",
		spells: true,
		powers: true,
		techniques: true,
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
		kind: "pact-caster",
		spells: true,
		powers: false,
		techniques: false,
		powerTags: [],
		techniqueTags: [],
	},
};

// ─────────────────────────────────────────────────────────────────────────
// Archetype model — caster spell access is gated by SCHOOL, not by job-name
// token. Every spellcasting job sees a generous, thematic set of schools;
// Mage (the arcane generalist) sees every school via the "*" sentinel.
// Keyed by the same normalized job-lookup form as JOB_ACCESS.
// ─────────────────────────────────────────────────────────────────────────
const CASTER_SCHOOLS: Record<string, string[]> = {
	mage: ["*"],
	esper: ["evocation", "transmutation", "divination", "enchantment"],
	revenant: ["necromancy", "abjuration", "transmutation"],
	summoner: ["conjuration", "transmutation", "divination"],
	idol: ["enchantment", "illusion", "evocation"],
	herald: ["abjuration", "evocation", "divination"],
	contractor: ["conjuration", "necromancy", "enchantment", "illusion"],
	"holy knight": ["abjuration", "evocation"],
	technomancer: ["transmutation", "evocation", "abjuration", "divination"],
	stalker: ["conjuration", "transmutation", "divination"],
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
	return JOB_ACCESS[normalizeJobLookup(jobName)] ?? null;
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
	const access = getJobAbilityAccess(jobName);
	if (!access?.spells) return null;
	return CASTER_SCHOOLS[normalizeJobLookup(jobName)] ?? [];
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
function getAbilityOwnerJobs(
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
