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
		kind: "full-caster",
		spells: true,
		powers: false,
		techniques: false,
		powerTags: [],
		techniqueTags: [],
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
