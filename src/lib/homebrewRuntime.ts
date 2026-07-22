export interface HomebrewRuntimeRecord {
	id: string;
	content_type: string;
	name: string;
	description?: string | null;
	data: Record<string, unknown>;
	source_book?: string | null;
	tags?: string[] | null;
	created_at?: string | null;
	updated_at?: string | null;
}

export interface HomebrewRuntimeFeature {
	id: string;
	name: string;
	description: string;
	level: number;
	is_path_feature: boolean;
	action_type: string | null;
	uses_formula: string | null;
	prerequisites: string | null;
	recharge: string | null;
	source_name: string | null;
	homebrew_id: string;
	modifiers?: unknown | null;
}

export interface HomebrewRuntimeJob extends Record<string, unknown> {
	id: string;
	name: string;
	display_name: string;
	description: string;
	type: string;
	rank: string;
	hitDie: string;
	hit_die: number;
	hit_dice: string;
	primaryAbility: string;
	primary_abilities: string[];
	savingThrows: string[];
	saving_throw_proficiencies: string[];
	armorProficiencies: string[];
	armor_proficiencies: string[];
	weaponProficiencies: string[];
	weapon_proficiencies: string[];
	toolProficiencies: string[];
	tool_proficiencies: string[];
	skillChoices: string[];
	skill_choices: string[];
	skill_choice_count: number;
	source: string;
	source_book: string;
	classFeatures: HomebrewRuntimeFeature[];
	class_features: HomebrewRuntimeFeature[];
	awakeningFeatures: HomebrewRuntimeFeature[];
	jobTraits: HomebrewRuntimeFeature[];
	startingEquipment: string[][];
	starting_equipment: string[][];
	hit_points_at_first_level: string | null;
	hit_points_at_higher_levels: string | null;
	image_url: string | null;
	tags: string[];
	source_kind: "homebrew";
	source_name: string;
	created_at: string;
	updated_at: string;
	_homebrew: true;
	homebrewId: string;
	homebrew_id: string;
}

export interface HomebrewRuntimePath extends Record<string, unknown> {
	id: string;
	name: string;
	display_name: string;
	description: string;
	jobId?: string;
	job_id?: string;
	jobName?: string;
	job_name?: string;
	path_level: number;
	requirements: { level?: number | null } | null;
	features: HomebrewRuntimeFeature[];
	abilities: unknown[];
	source: string;
	source_book: string;
	tags: string[];
	created_at: string;
	updated_at: string;
	_homebrew: true;
	homebrewId: string;
	homebrew_id: string;
}

export interface HomebrewRuntimeSpell extends Record<string, unknown> {
	id: string;
	name: string;
	description: string | null;
	power_level: number;
	casting_time: string | null;
	range: string | null;
	duration: string | null;
	concentration: boolean;
	ritual: boolean;
	higher_levels: string | null;
	source_book: string;
	jobs: string[];
	paths: string[];
	tags: string[];
	_homebrew: true;
	homebrewId: string;
	homebrew_id: string;
}

export interface HomebrewRuntimePower extends Record<string, unknown> {
	id: string;
	name: string;
	description: string | null;
	canonical_type: "powers";
	power_level: number;
	power_type: string | null;
	activation_time: string | null;
	casting_time: string | null;
	range: string | null;
	duration: string | null;
	concentration: boolean;
	ritual: boolean;
	higher_levels: string | null;
	has_attack_roll: boolean;
	has_save: boolean;
	save_ability: string | null;
	damage_roll: string | null;
	damage_type: string | null;
	target: string | null;
	source_book: string;
	jobs: string[];
	paths: string[];
	tags: string[];
	_homebrew: true;
	homebrewId: string;
	homebrew_id: string;
}

export interface HomebrewRuntimeItem extends Record<string, unknown> {
	id: string;
	item_id: null;
	name: string;
	description: string | null;
	equipment_type: string;
	item_type: string;
	properties: string[];
	weight: number | null;
	source_book: string;
	rarity: string | null;
	damage: string | null;
	damage_type: string | null;
	armor_class: string | number | null;
	requires_attunement: boolean;
	charges: number | null;
	custom_modifiers: Record<string, unknown>;
	tags: string[];
	_homebrew: true;
	homebrewId: string;
	homebrew_id: string;
}

export interface HomebrewRuntimeFeat extends Record<string, unknown> {
	id: string;
	feat_id: null;
	name: string;
	description: string | null;
	source_book: string;
	prerequisites: unknown | null;
	benefits: unknown | null;
	modifiers: unknown | null;
	tags: string[];
	_homebrew: true;
	homebrewId: string;
	homebrew_id: string;
}

/**
 * A homebrew creature ("anomaly" — RA's monster equivalent), shaped to match
 * the flat `Anomaly` row the Encounter Builder / Combat Tracker consume so a
 * Warden can drop a custom creature straight into an encounter.
 */
export interface HomebrewRuntimeAnomaly extends Record<string, unknown> {
	id: string;
	name: string;
	display_name: string;
	description: string;
	cr: string;
	xp: number;
	gate_rank: string;
	is_boss: boolean;
	creature_type: string;
	armor_class: number;
	hit_points_average: number;
	hit_points_formula: string;
	size: string;
	str: number;
	agi: number;
	vit: number;
	int: number;
	sense: number;
	pre: number;
	saving_throws: string | null;
	senses: string | null;
	languages: string[] | null;
	damage_resistances: string[] | null;
	damage_immunities: string[] | null;
	damage_vulnerabilities: string[] | null;
	condition_immunities: string[] | null;
	speed_walk: number | null;
	source_book: string;
	tags: string[];
	_homebrew: true;
	homebrewId: string;
	homebrew_id: string;
}

const ABILITY_ALIASES: Record<string, string> = {
	strength: "STR",
	agility: "AGI",
	vitality: "VIT",
	intelligence: "INT",
	sense: "SENSE",
	presence: "PRE",
};

const nowIso = () => new Date().toISOString();

const asRecord = (value: unknown): Record<string, unknown> =>
	value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};

const pick = (data: Record<string, unknown>, keys: string[]): unknown => {
	for (const key of keys) {
		if (data[key] !== undefined && data[key] !== null) return data[key];
	}
	return undefined;
};

const asString = (value: unknown, fallback = ""): string => {
	if (typeof value === "string") return value.trim() || fallback;
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	return fallback;
};

const asNumber = (value: unknown, fallback: number): number => {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const parsed = Number.parseInt(value, 10);
		if (Number.isFinite(parsed)) return parsed;
	}
	return fallback;
};

const asOptionalNumber = (value: unknown): number | null => {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string") {
		const parsed = Number.parseFloat(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return null;
};

const asBoolean = (value: unknown, fallback = false): boolean => {
	if (typeof value === "boolean") return value;
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		if (["true", "yes", "y", "1"].includes(normalized)) return true;
		if (["false", "no", "n", "0"].includes(normalized)) return false;
	}
	return fallback;
};

const asStringArray = (value: unknown, fallback: string[] = []): string[] => {
	if (Array.isArray(value)) {
		return value
			.flatMap((entry) => (Array.isArray(entry) ? entry : [entry]))
			.map((entry) => asString(entry))
			.filter(Boolean);
	}
	if (typeof value === "string") {
		return value
			.split(",")
			.map((entry) => entry.trim())
			.filter(Boolean);
	}
	return fallback;
};

const asStringMatrix = (value: unknown): string[][] => {
	if (!Array.isArray(value)) return [];
	if (value.every((entry) => Array.isArray(entry))) {
		return value
			.map((entry) => asStringArray(entry))
			.filter((entry) => entry.length > 0);
	}
	const row = asStringArray(value);
	return row.length > 0 ? [row] : [];
};

const normalizeAbility = (value: unknown): string => {
	const text = asString(value, "STR");
	return ABILITY_ALIASES[text.toLowerCase()] ?? text.toUpperCase();
};

const normalizeAbilityArray = (
	value: unknown,
	fallback: string[],
): string[] => {
	const values = asStringArray(value);
	return (values.length > 0 ? values : fallback).map(normalizeAbility);
};

const parseHitDieSize = (value: unknown): number => {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	const text = asString(value, "1d8");
	const dieMatch = text.match(/d\s*(\d+)/i);
	if (dieMatch) return Number.parseInt(dieMatch[1], 10);
	const numberMatch = text.match(/\d+/);
	return numberMatch ? Number.parseInt(numberMatch[0], 10) : 8;
};

const parseFeature = (
	record: HomebrewRuntimeRecord,
	value: unknown,
	index: number,
	isPathFeature: boolean,
): HomebrewRuntimeFeature => {
	const data = typeof value === "string" ? { name: value } : asRecord(value);
	const level = asNumber(
		pick(data, ["level", "unlockLevel", "unlock_level", "path_level"]),
		1,
	);
	return {
		id: asString(data.id, `${record.id}-feature-${index + 1}`),
		name: asString(data.name, `Homebrew Feature ${index + 1}`),
		description: asString(
			pick(data, ["description", "effect", "summary"]),
			record.description ?? "",
		),
		level,
		is_path_feature: isPathFeature,
		action_type: asString(pick(data, ["action_type", "actionType"])) || null,
		uses_formula: asString(pick(data, ["uses_formula", "usesFormula"])) || null,
		prerequisites: asString(data.prerequisites) || null,
		recharge: asString(data.recharge) || null,
		source_name: `Homebrew: ${record.name}`,
		homebrew_id: record.id,
		modifiers: data.modifiers ?? data.effects ?? null,
	};
};

export const mapHomebrewFeaturesForRuntime = (
	record: HomebrewRuntimeRecord,
	kind: "job" | "path",
): HomebrewRuntimeFeature[] => {
	const data = asRecord(record.data);
	const rawFeatures = pick(data, [
		kind === "job" ? "classFeatures" : "features",
		kind === "job" ? "class_features" : "path_features",
		"features",
	]);
	if (!Array.isArray(rawFeatures)) return [];
	return rawFeatures.map((feature, index) =>
		parseFeature(record, feature, index, kind === "path"),
	);
};

export const mapHomebrewJobForRuntime = (
	record: HomebrewRuntimeRecord,
): HomebrewRuntimeJob => {
	const data = asRecord(record.data);
	const hitDieSize = parseHitDieSize(
		pick(data, ["hitDie", "hit_die", "hit_dice"]),
	);
	const source = record.source_book || "Homebrew";
	const primaryAbilities = normalizeAbilityArray(
		pick(data, ["primary_abilities", "primaryAbilities", "primaryAbility"]),
		["STR"],
	);
	const savingThrows = normalizeAbilityArray(
		pick(data, ["saving_throw_proficiencies", "savingThrows", "saving_throws"]),
		[],
	);
	const skillChoices = asStringArray(
		pick(data, ["skillChoices", "skill_choices", "skills"]),
	);
	const features = mapHomebrewFeaturesForRuntime(record, "job");
	const awakeningFeatures = Array.isArray(
		pick(data, ["awakeningFeatures", "awakening_features"]),
	)
		? (
				pick(data, ["awakeningFeatures", "awakening_features"]) as unknown[]
			).map((feature, index) => parseFeature(record, feature, index, false))
		: [];
	const jobTraits = Array.isArray(pick(data, ["jobTraits", "job_traits"]))
		? (pick(data, ["jobTraits", "job_traits"]) as unknown[]).map(
				(feature, index) => parseFeature(record, feature, index, false),
			)
		: [];
	const createdAt = record.created_at ?? nowIso();
	const updatedAt = record.updated_at ?? createdAt;

	return {
		...data,
		id: record.id,
		name: record.name,
		display_name: record.name,
		description: record.description ?? "",
		type: asString(data.type, "homebrew"),
		rank: asString(data.rank, "custom"),
		hitDie: `1d${hitDieSize}`,
		hit_die: hitDieSize,
		hit_dice: `1d${hitDieSize}`,
		primaryAbility: primaryAbilities[0] ?? "STR",
		primary_abilities: primaryAbilities,
		savingThrows,
		saving_throw_proficiencies: savingThrows,
		armorProficiencies: asStringArray(
			pick(data, ["armorProficiencies", "armor_proficiencies"]),
		),
		armor_proficiencies: asStringArray(
			pick(data, ["armor_proficiencies", "armorProficiencies"]),
		),
		weaponProficiencies: asStringArray(
			pick(data, ["weaponProficiencies", "weapon_proficiencies"]),
		),
		weapon_proficiencies: asStringArray(
			pick(data, ["weapon_proficiencies", "weaponProficiencies"]),
		),
		toolProficiencies: asStringArray(
			pick(data, ["toolProficiencies", "tool_proficiencies"]),
		),
		tool_proficiencies: asStringArray(
			pick(data, ["tool_proficiencies", "toolProficiencies"]),
		),
		skillChoices,
		skill_choices: skillChoices,
		skill_choice_count: asNumber(
			pick(data, ["skill_choice_count", "skillChoiceCount"]),
			2,
		),
		source,
		source_book: source,
		classFeatures: features,
		class_features: features,
		awakeningFeatures,
		jobTraits,
		startingEquipment: asStringMatrix(
			pick(data, ["startingEquipment", "starting_equipment"]),
		),
		starting_equipment: asStringMatrix(
			pick(data, ["starting_equipment", "startingEquipment"]),
		),
		hit_points_at_first_level:
			asString(
				pick(data, ["hit_points_at_first_level", "hitPointsAtFirstLevel"]),
			) || null,
		hit_points_at_higher_levels:
			asString(
				pick(data, ["hit_points_at_higher_levels", "hitPointsAtHigherLevels"]),
			) || null,
		image_url: asString(pick(data, ["image_url", "image"])) || null,
		tags: record.tags ?? [],
		source_kind: "homebrew",
		source_name: source,
		created_at: createdAt,
		updated_at: updatedAt,
		_homebrew: true,
		homebrewId: record.id,
		homebrew_id: record.id,
	};
};

export const mapHomebrewPathForRuntime = (
	record: HomebrewRuntimeRecord,
): HomebrewRuntimePath => {
	const data = asRecord(record.data);
	const requirements = asRecord(data.requirements);
	const pathLevel = asNumber(
		pick(data, ["path_level", "pathLevel", "level", "unlockLevel"]),
		asNumber(requirements.level, 3),
	);
	const source = record.source_book || "Homebrew";
	const createdAt = record.created_at ?? nowIso();
	const updatedAt = record.updated_at ?? createdAt;
	const jobId = asString(pick(data, ["job_id", "jobId"]));
	const jobName = asString(pick(data, ["job_name", "jobName", "job"]));

	return {
		...data,
		id: record.id,
		name: record.name,
		display_name: record.name,
		description: record.description ?? "",
		...(jobId ? { jobId, job_id: jobId } : {}),
		...(jobName ? { jobName, job_name: jobName } : {}),
		path_level: pathLevel,
		requirements:
			Object.keys(requirements).length > 0
				? requirements
				: { level: pathLevel },
		features: mapHomebrewFeaturesForRuntime(record, "path"),
		abilities: Array.isArray(data.abilities) ? data.abilities : [],
		source,
		source_book: source,
		tags: record.tags ?? [],
		created_at: createdAt,
		updated_at: updatedAt,
		_homebrew: true,
		homebrewId: record.id,
		homebrew_id: record.id,
	};
};

export const mapHomebrewSpellForRuntime = (
	record: HomebrewRuntimeRecord,
): HomebrewRuntimeSpell => {
	const data = asRecord(record.data);
	const source = record.source_book || "Homebrew";
	const powerLevel = asNumber(
		pick(data, ["power_level", "spell_level", "level", "rank"]),
		asBoolean(data.cantrip) ? 0 : 1,
	);
	const jobs = asStringArray(
		pick(data, ["jobs", "job", "classes", "class", "jobNames", "job_names"]),
	);
	const paths = asStringArray(
		pick(data, ["paths", "path", "pathNames", "path_names"]),
	);

	return {
		...data,
		id: record.id,
		name: record.name,
		description: (record.description ?? asString(data.description)) || null,
		power_level: powerLevel,
		casting_time: asString(
			pick(data, ["casting_time", "castingTime"]),
			"1 action",
		),
		range: asString(data.range, "Self"),
		duration: asString(data.duration, "Instantaneous"),
		concentration: asBoolean(data.concentration),
		ritual: asBoolean(data.ritual),
		higher_levels:
			asString(
				pick(data, ["higher_levels", "higherLevels", "atHigherLevels"]),
			) || null,
		source_book: source,
		jobs,
		paths,
		tags: record.tags ?? [],
		_homebrew: true,
		homebrewId: record.id,
		homebrew_id: record.id,
	};
};

export const mapHomebrewPowerForRuntime = (
	record: HomebrewRuntimeRecord,
): HomebrewRuntimePower => {
	const data = asRecord(record.data);
	const source = record.source_book || "Homebrew";
	const powerLevel = asNumber(
		pick(data, ["power_level", "powerLevel", "level", "rank"]),
		1,
	);
	const jobs = asStringArray(
		pick(data, ["jobs", "job", "classes", "class", "jobNames", "job_names"]),
	);
	const paths = asStringArray(
		pick(data, ["paths", "path", "pathNames", "path_names"]),
	);

	return {
		...data,
		id: record.id,
		name: record.name,
		description: (record.description ?? asString(data.description)) || null,
		canonical_type: "powers",
		power_level: powerLevel,
		power_type:
			asString(pick(data, ["power_type", "powerType", "type"])) || null,
		activation_time:
			asString(pick(data, ["activation_time", "activationTime"])) || null,
		casting_time: asString(
			pick(data, ["casting_time", "castingTime"]),
			"1 action",
		),
		range: asString(data.range, "Self"),
		duration: asString(data.duration, "Instantaneous"),
		concentration: asBoolean(data.concentration),
		ritual: asBoolean(data.ritual),
		higher_levels:
			asString(
				pick(data, ["higher_levels", "higherLevels", "atHigherLevels"]),
			) || null,
		has_attack_roll: asBoolean(
			pick(data, ["has_attack_roll", "hasAttackRoll"]),
		),
		has_save: asBoolean(pick(data, ["has_save", "hasSave"])),
		save_ability: asString(pick(data, ["save_ability", "saveAbility"])) || null,
		damage_roll:
			asString(pick(data, ["damage_roll", "damageRoll", "damage"])) || null,
		damage_type: asString(pick(data, ["damage_type", "damageType"])) || null,
		target: asString(data.target) || null,
		source_book: source,
		jobs,
		paths,
		tags: record.tags ?? [],
		_homebrew: true,
		homebrewId: record.id,
		homebrew_id: record.id,
	};
};

export const mapHomebrewItemForRuntime = (
	record: HomebrewRuntimeRecord,
): HomebrewRuntimeItem => {
	const data = asRecord(record.data);
	const source = record.source_book || "Homebrew";
	const itemType = asString(
		pick(data, ["equipment_type", "item_type", "type"]),
		"gear",
	);
	const charges = asOptionalNumber(
		pick(data, ["charges", "charges_max", "chargesMax"]),
	);
	const modifiers = asRecord(data.modifiers);

	return {
		...data,
		id: record.id,
		item_id: null,
		name: record.name,
		description: (record.description ?? asString(data.description)) || null,
		equipment_type: itemType,
		item_type: itemType,
		properties: asStringArray(data.properties),
		weight: asOptionalNumber(data.weight),
		source_book: source,
		rarity: asString(data.rarity) || null,
		damage: asString(data.damage) || null,
		damage_type: asString(pick(data, ["damage_type", "damageType"])) || null,
		armor_class: asString(pick(data, ["armor_class", "armorClass"])) || null,
		requires_attunement: asBoolean(
			pick(data, ["requires_attunement", "requiresAttunement", "attunement"]),
		),
		charges,
		custom_modifiers: {
			...modifiers,
			homebrew_id: record.id,
			source: "homebrew",
		},
		tags: record.tags ?? [],
		_homebrew: true,
		homebrewId: record.id,
		homebrew_id: record.id,
	};
};

export const mapHomebrewFeatForRuntime = (
	record: HomebrewRuntimeRecord,
): HomebrewRuntimeFeat => {
	const data = asRecord(record.data);
	const source = record.source_book || "Homebrew";

	return {
		...data,
		id: record.id,
		feat_id: null,
		name: record.name,
		description: (record.description ?? asString(data.description)) || null,
		source_book: source,
		prerequisites: data.prerequisites ?? null,
		benefits: data.benefits ?? null,
		modifiers: data.modifiers ?? null,
		tags: record.tags ?? [],
		_homebrew: true,
		homebrewId: record.id,
		homebrew_id: record.id,
	};
};

/** Default CR + XP per RA gate rank when a homebrew anomaly omits them. */
const RANK_DEFAULTS: Record<string, { cr: string; xp: number }> = {
	F: { cr: "1/8", xp: 25 },
	E: { cr: "1/4", xp: 50 },
	D: { cr: "1", xp: 200 },
	C: { cr: "3", xp: 700 },
	B: { cr: "6", xp: 2300 },
	A: { cr: "10", xp: 5900 },
	S: { cr: "15", xp: 13000 },
};

export const mapHomebrewAnomalyForRuntime = (
	record: HomebrewRuntimeRecord,
): HomebrewRuntimeAnomaly => {
	const data = asRecord(record.data);
	const source = record.source_book || "Rift Ascendant Homebrew";
	const rank = asString(
		pick(data, ["gate_rank", "rank", "gateRank"]),
		"D",
	).toUpperCase();
	const defaults = RANK_DEFAULTS[rank] ?? RANK_DEFAULTS.D;
	const cr = asString(pick(data, ["cr", "challenge_rating"]), defaults.cr);
	const xp = asNumber(pick(data, ["xp", "experience"]), defaults.xp);
	const abilityScore = (keys: string[]) => asNumber(pick(data, keys), 10);

	return {
		...data,
		id: record.id,
		name: record.name,
		display_name: record.name,
		description: (record.description ?? asString(data.description)) || "",
		cr,
		xp,
		gate_rank: rank,
		is_boss: rank === "S" || rank === "A",
		creature_type: asString(
			pick(data, ["creature_type", "creatureType", "type"]),
			"Anomaly",
		),
		armor_class: asNumber(pick(data, ["armor_class", "armorClass", "ac"]), 12),
		hit_points_average: asNumber(
			pick(data, ["hit_points_average", "hit_points", "hp", "hitPoints"]),
			20,
		),
		hit_points_formula: asString(
			pick(data, ["hit_points_formula", "hitPointsFormula"]),
			"1d8",
		),
		size: asString(pick(data, ["size"]), "Medium"),
		str: abilityScore(["str", "strength"]),
		agi: abilityScore(["agi", "agility", "dex", "dexterity"]),
		vit: abilityScore(["vit", "vitality", "con", "constitution"]),
		int: abilityScore(["int", "intellect", "intelligence"]),
		sense: abilityScore(["sense", "wis", "wisdom"]),
		pre: abilityScore(["pre", "presence", "cha", "charisma"]),
		saving_throws:
			asString(pick(data, ["saving_throws", "savingThrows"])) || null,
		senses: asString(pick(data, ["senses"])) || null,
		languages: asStringArray(pick(data, ["languages"])),
		damage_resistances: asStringArray(
			pick(data, ["damage_resistances", "resistances"]),
		),
		damage_immunities: asStringArray(
			pick(data, ["damage_immunities", "immunities"]),
		),
		damage_vulnerabilities: asStringArray(
			pick(data, ["damage_vulnerabilities", "vulnerabilities"]),
		),
		condition_immunities: asStringArray(pick(data, ["condition_immunities"])),
		speed_walk: asOptionalNumber(pick(data, ["speed_walk", "speed"])),
		source_book: source,
		tags: record.tags ?? [],
		_homebrew: true,
		homebrewId: record.id,
		homebrew_id: record.id,
	};
};

const normalizeKey = (value: unknown): string =>
	asString(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "")
		.trim();

export const runtimePathMatchesJob = (
	path: Partial<HomebrewRuntimePath> & Record<string, unknown>,
	jobId?: string | null,
	jobName?: string | null,
): boolean => {
	const jobKeys = [
		path.job_id,
		path.jobId,
		path.job_name,
		path.jobName,
		path.job,
	]
		.map(normalizeKey)
		.filter(Boolean);
	if (jobKeys.length === 0) return false;
	const selectedKeys = [jobId, jobName].map(normalizeKey).filter(Boolean);
	return selectedKeys.some((key) => jobKeys.includes(key));
};

export const runtimeSpellMatchesCharacter = (
	spell: Partial<HomebrewRuntimeSpell> & Record<string, unknown>,
	jobName?: string | null,
	pathName?: string | null,
): boolean => {
	const jobKeys = asStringArray(spell.jobs).map(normalizeKey).filter(Boolean);
	const pathKeys = asStringArray(spell.paths).map(normalizeKey).filter(Boolean);
	const selectedJob = normalizeKey(jobName);
	const selectedPath = normalizeKey(pathName);

	if (jobKeys.length > 0 && !jobKeys.includes(selectedJob)) return false;
	if (pathKeys.length > 0 && !pathKeys.includes(selectedPath)) return false;
	return true;
};

export const runtimePowerMatchesCharacter = (
	power: Partial<HomebrewRuntimePower> & Record<string, unknown>,
	jobName?: string | null,
	pathName?: string | null,
): boolean => {
	const jobKeys = asStringArray(power.jobs).map(normalizeKey).filter(Boolean);
	const pathKeys = asStringArray(power.paths).map(normalizeKey).filter(Boolean);
	const selectedJob = normalizeKey(jobName);
	const selectedPath = normalizeKey(pathName);

	if (jobKeys.length > 0 && !jobKeys.includes(selectedJob)) return false;
	if (pathKeys.length > 0 && !pathKeys.includes(selectedPath)) return false;
	return true;
};

export const filterPublishedHomebrewRecords = <T extends HomebrewRuntimeRecord>(
	records: T[],
	contentType: string,
): T[] => records.filter((record) => record.content_type === contentType);
