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
			"system-interface",
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

function addTags(target: Set<string>, tags: readonly string[]): void {
	for (const tag of tags) target.add(normalizeJobAccessToken(tag));
}

function entryText(entry: {
	id?: string | null;
	name?: string | null;
	display_name?: string | null;
	tags?: string[] | null;
	theme_tags?: string[] | null;
	style?: string | null;
	technique_type?: string | null;
	type?: string | null;
	mechanics?: Record<string, unknown> | null;
	limitations?: Record<string, unknown> | null;
}): string {
	const mechanics = entry.mechanics ?? {};
	const limitations = entry.limitations ?? {};
	return [
		entry.id,
		entry.name,
		entry.display_name,
		entry.style,
		entry.technique_type,
		entry.type,
		...(entry.tags ?? []),
		...(entry.theme_tags ?? []),
		typeof mechanics.type === "string" ? mechanics.type : null,
		typeof mechanics.lattice_interaction === "string"
			? mechanics.lattice_interaction
			: null,
		typeof limitations.conditions === "string"
			? limitations.conditions
			: Array.isArray(limitations.conditions)
				? limitations.conditions.join(" ")
				: null,
	]
		.filter((value): value is string => typeof value === "string")
		.join(" ")
		.toLowerCase();
}

const POWER_TAGS_BY_ID: Record<string, string[]> = {
	"shadow-step": ["assassin", "stalker", "phase", "shadow", "pursuit"],
	"demonic-aura": ["berserker", "destroyer", "overload", "brutal-melee"],
	regeneration: ["berserker", "stalker", "regeneration", "survival"],
	"true-sight": ["assassin", "stalker", "terminal-sight", "prey-lock"],
	"shadow-essence": ["assassin", "stalker", "shadow", "umbral"],
	"dragon-breath": ["destroyer", "berserker", "thermal", "overload"],
	"bulwark-resilience": ["destroyer", "holy-knight", "bulwark", "guard"],
	"assassin-luck": ["assassin", "precision", "ambush"],
	"warrior-rage": ["berserker", "overload", "brutal-melee"],
	"ki-point": ["striker", "unarmed", "kinetic"],
	"divine-smite": ["holy-knight", "covenant", "radiant"],
	"wild-shape": ["stalker", "rift-resonance", "tracking"],
	"sneak-attack": ["assassin", "stalker", "precision", "ambush"],
	lycanthropy: ["berserker", "stalker", "survival"],
	invisibility: ["assassin", "stalker", "stealth"],
	"divine-intervention": ["holy-knight", "covenant", "radiant"],
	"angelic-wings": ["holy-knight", "radiant"],
	"holy-aura": ["holy-knight", "radiant", "guard"],
	"avatar-of-battle": ["destroyer", "berserker", "holy-knight", "vanguard"],
	"chronos-shift": ["assassin", "stalker", "technomancer", "system-interface"],
	"mana-burn": ["striker", "technomancer", "force", "current-conductor"],
	"obsidian-carapace": [
		"destroyer",
		"berserker",
		"holy-knight",
		"reinforced-frame",
	],
	"soul-rend": ["assassin", "stalker", "precision"],
	"aegis-of-light": ["holy-knight", "radiant", "guard"],
	"phantom-barrage": ["assassin", "stalker", "ambush"],
	"venom-blood": ["assassin", "stalker", "survival"],
	"kinetic-absorption": ["striker", "destroyer", "kinetic", "force"],
	"infernal-forge": ["technomancer", "destroyer", "engineered-weapon"],
	"celestial-judgment": ["holy-knight", "radiant", "covenant"],
	"warp-strike": ["assassin", "striker", "stalker", "phase"],
	"gravity-crush": ["destroyer", "striker", "force"],
	"echo-clone": ["assassin", "stalker", "stealth"],
	"reality-glitch": ["technomancer", "system-interface", "gadget"],
	"solar-flare": ["holy-knight", "radiant"],
	"aeon-shield": ["technomancer", "holy-knight", "guard"],
	"nebula-drift": ["technomancer", "stalker", "pursuit"],
	"gravity-well": ["destroyer", "striker", "force"],
	"quantum-entanglement": ["technomancer", "system-interface"],
	"supernova-blast": ["destroyer", "berserker", "overload"],
	"nanite-swarm": ["technomancer", "gadget", "device"],
	"titan-strength": ["destroyer", "berserker", "reinforced-frame"],
	"echoes-of-the-past": ["stalker", "tracking", "terminal-sight"],
	"bio-luminescence": ["stalker", "tracking"],
	"neuro-spike": ["striker", "technomancer", "neural-overdrive"],
	"plasma-whip": ["technomancer", "striker", "current-conductor"],
	"spectral-blade": ["assassin", "stalker", "umbral"],
	"dimensional-rift": ["assassin", "stalker", "technomancer", "phase"],
	"celestial-communion": ["holy-knight", "covenant", "radiant"],
	"shadow-puppetry": ["assassin", "shadow", "umbral"],
	"thermal-vent": ["berserker", "thermal", "overload"],
	"gravity-leap": ["striker", "destroyer", "stalker", "pursuit"],
	"obsidian-wall": ["destroyer", "holy-knight", "bulwark", "guard"],
	"star-fire-lance": ["holy-knight", "technomancer", "radiant"],
	"vortex-shield": ["destroyer", "holy-knight", "technomancer", "guard"],
	"seraph-call": ["holy-knight", "radiant", "covenant"],
	"necrotic-tether": ["assassin", "stalker", "ambush"],
	"glacial-fortress": ["destroyer", "holy-knight", "bulwark"],
	"reality-shear": ["assassin", "technomancer", "phase"],
	"omega-pulse": ["technomancer", "striker", "system-interface"],
};

export function getDerivedPowerTags(entry: {
	id?: string | null;
	name?: string | null;
	tags?: string[] | null;
	theme_tags?: string[] | null;
	mechanics?: Record<string, unknown> | null;
}): string[] {
	const tags = new Set<string>();
	const id = normalizeJobAccessToken(entry.id);
	if (POWER_TAGS_BY_ID[id]) addTags(tags, POWER_TAGS_BY_ID[id]);

	const text = entryText(entry);
	if (/shadow|umbral|phantom|stealth|invisibility|sneak|assassin/.test(text)) {
		addTags(tags, ["assassin", "stalker", "ambush"]);
	}
	if (/kinetic|force|neuro|nerve|ki|gravity|punch|fist/.test(text)) {
		addTags(tags, ["striker", "kinetic"]);
	}
	if (/bulwark|carapace|titan|obsidian|wall|shield|aegis/.test(text)) {
		addTags(tags, ["destroyer", "holy-knight", "guard"]);
	}
	if (/rage|overload|thermal|dragon|supernova|demonic|lycan/.test(text)) {
		addTags(tags, ["berserker", "overload"]);
	}
	if (/radiant|holy|divine|celestial|seraph|sanctified|aegis/.test(text)) {
		addTags(tags, ["holy-knight", "radiant"]);
	}
	if (/nanite|quantum|glitch|plasma|current|device|system|forge/.test(text)) {
		addTags(tags, ["technomancer", "system-interface"]);
	}
	if (/prey|tracking|sight|echo|beast|wild|pursuit/.test(text)) {
		addTags(tags, ["stalker", "tracking"]);
	}

	return Array.from(tags);
}

export function getDerivedTechniqueTags(entry: {
	id?: string | null;
	name?: string | null;
	display_name?: string | null;
	tags?: string[] | null;
	theme_tags?: string[] | null;
	style?: string | null;
	technique_type?: string | null;
	type?: string | null;
	mechanics?: Record<string, unknown> | null;
	limitations?: Record<string, unknown> | null;
}): string[] {
	const tags = new Set<string>();
	const text = entryText(entry);

	if (
		/umbral|phantom|phase|dimensional|void|viper|execute|termination|thousand|assassination|precision/.test(
			text,
		)
	) {
		addTags(tags, ["assassin", "ambush", "precision"]);
	}
	if (/arrow|shot|archery|eagle|piercer|trap|pursuit/.test(text)) {
		addTags(tags, ["stalker", "archery", "pursuit"]);
	}
	if (
		/fist|kick|nerve|dragon|counter|riposte|breath|unarmed|ki|gale/.test(text)
	) {
		addTags(tags, ["striker", "unarmed", "counter-stance"]);
	}
	if (
		/wall|guardian|guard|shield|defense|immovable|parry|rebuke|stance/.test(
			text,
		)
	) {
		addTags(tags, ["destroyer", "holy-knight", "guard", "bulwark"]);
	}
	if (
		/slam|stomp|breaker|meteor|whirlwind|rage|blood|quaking|titan|mountain|brutal/.test(
			text,
		)
	) {
		addTags(tags, ["destroyer", "berserker", "heavy-weapon"]);
	}
	if (/divine|heaven|mirror|radiant/.test(text)) {
		addTags(tags, ["holy-knight", "covenant-strike", "radiant-weapon"]);
	}
	if (/gravity|vortex|temporal|ancient|infinity|sonic|blast/.test(text)) {
		addTags(tags, ["technomancer", "gadget-protocol"]);
	}
	if (/blade|slash|strike|flourish|dance/.test(text)) {
		addTags(tags, ["destroyer", "berserker", "assassin"]);
	}

	return Array.from(tags);
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
