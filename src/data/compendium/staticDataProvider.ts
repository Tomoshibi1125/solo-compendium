/**
 * Static Data Provider for Compendium
 *
 * Bridges the gap between static TS data and the existing Supabase-based UI.
 * Provides the same interface as Supabase queries but uses local static data.
 *
 * Authoritative source: internal compendium data packs already ingested into the app.
 */

import type { RegentExtended } from "@/integrations/supabase/supabaseExtended";
import { getDefaultSigilSlotsBaseForEquipment } from "@/lib/sigilAutomation";
import { normalizeRegentSearch } from "@/lib/vernacular";
import type {
	CompendiumDeity,
	CompendiumRune,
	CompendiumSigil,
} from "@/types/compendium";

type DataLoader<T> = () => Promise<T[]>;

const dataLoaders = {
	anomalies: () => import("./anomalies").then((module) => module.anomalies),
	items: () => import("./items-index").then((module) => module.allItems),
	jobs: () => import("./jobs").then((module) => module.jobs),
	spells: () => import("./spells").then((module) => module.spells),
	locations: () => import("./locations").then((module) => module.locations),
	runesCompendium: () =>
		import("./runes/index").then((module) => module.allRunes),
	systemAscendantRunes: async () => {
		const { allRunes } = await import("./runes/index");
		const { sigils } = await import("./sigils");
		return [...allRunes, ...sigils];
	},
	backgrounds: () =>
		import("./backgrounds-index").then((module) => module.allBackgrounds),
	regents: () => import("./regents").then((module) => module.regents),
	paths: () => import("./paths").then((module) => module.paths),
	conditions: () => import("./conditions").then((module) => module.conditions),
	comprehensiveFeats: () =>
		import("./feats-comprehensive").then(
			(module) => module.comprehensiveFeats || [],
		),
	comprehensiveSkills: () =>
		import("./skills-comprehensive").then(
			(module) => module.comprehensiveSkills,
		),
	comprehensiveRelics: () =>
		import("./relics-comprehensive").then(
			(module) => module.comprehensiveRelics,
		),
	powers: () => import("./powers").then((module) => module.powers),
	techniques: () => import("./techniques").then((module) => module.techniques),
	artifacts: () => import("./artifacts").then((module) => module.artifacts),
	sigils: () => import("./sigils").then((module) => module.sigils),
	tattoos: () => import("./tattoos").then((module) => module.tattoos),
	pantheon: () => import("./pantheon").then((module) => module.PRIME_PANTHEON),
} satisfies Record<string, DataLoader<unknown>>;

type DataKey = keyof typeof dataLoaders;
const dataCache: Partial<Record<DataKey, Promise<unknown[]>>> = {};

const loadData = async <T>(key: DataKey): Promise<T[]> => {
	if (!dataCache[key]) {
		dataCache[key] = dataLoaders[key]();
	}
	return (await dataCache[key]) as T[];
};

// Type definitions matching the UI expectations
export interface StaticCompendiumEntry {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string | null;
	created_at?: string | null;
	tags?: string[] | null;
	source_book?: string | null;
	image_url?: string | null;
	// Type-specific fields
	power_level?: number | null;
	school?: string | null;
	theme?: string | null;
	prerequisites?: string | Record<string, unknown> | null;
	requirements?: Record<string, unknown> | null;
	fusion_theme?: string | null;
	equipment_type?: string | null;
	ability?: string | null;
	rune_type?: string | null;
	rune_category?: string | null;
	rune_level?: number | null;
	cr?: string | null;
	gate_rank?: string | null;
	is_boss?: boolean;
	rarity?: string | null;
	level?: number | null;
	sigil_slots_base?: number | null;
	item_type?: string | null;
	artifact_type?: string | null;
	technique_type?: string | null;
	spell_type?: string | null;
	location_type?: string | null;
	rank?: string | null;
	damage?: string | number | null;
	healing?: number | null;
	effect?: string | null;
	range?:
		| number
		| string
		| { type?: string; value?: number; unit?: string }
		| null;
	recharge?: number | string | null;
	encounters?: string[] | null;
	treasures?: string[] | null;
	style?: string | null;
	image?: string | null;
	cost_credits?: number | null;
	item_properties?: Record<string, unknown> | null;
	activation?: Record<string, unknown> | null;
	duration?: Record<string, unknown> | null;
	components?: Record<string, unknown> | null;
	effects?: Record<string, unknown> | null;
	mechanics?: Record<string, unknown> | null;
	limitations?: Record<string, unknown> | null;
	flavor?: string | null;
	higher_levels?: string | null;
	atHigherLevels?: string | null;
	properties?: string[] | Record<string, unknown> | null;
	abilities?: Record<string, unknown> | null;
	lore?: string | Record<string, unknown> | null;
	attunement?: boolean | null;
	cursed?: boolean | null;
	charges?: Record<string, unknown> | null;
	stats?: Record<string, unknown> | null;
	source?: string | null;
	role?: string | null;
	value?: number | null;
	weight?: number | null;
	// Anomaly detail support (static fallback)
	size?: string | null;
	creature_type?: string | null;
	alignment?: string | null;
	armor_class?: number | null;
	armor_type?: string | null;
	hit_points_average?: number | null;
	hit_points_formula?: string | null;
	speed_walk?: number | null;
	speed_fly?: number | null;
	speed_swim?: number | null;
	speed_climb?: number | null;
	speed_burrow?: number | null;
	str?: number | null;
	agi?: number | null;
	vit?: number | null;
	int?: number | null;
	sense?: number | null;
	pre?: number | null;
	saving_throws?: Record<string, number> | null;
	skills?: Record<string, number> | Record<string, unknown> | null;
	damage_vulnerabilities?: string[] | null;
	damage_resistances?: string[] | null;
	damage_immunities?: string[] | null;
	condition_immunities?: string[] | null;
	senses?: string[] | Record<string, string> | null;
	languages?: string[] | null;
	xp?: number | null;
	Anomaly_actions?: Record<string, unknown>[] | null;
	Anomaly_traits?: Record<string, unknown>[] | null;
	attack?: Record<string, unknown> | null;
	movement?: Record<string, unknown> | null;
	// Background detail support (static fallback)
	skill_proficiencies?: string[] | null;
	tool_proficiencies?: string[] | null;
	language_count?: number | null;
	starting_equipment?: string | string[][] | null;
	starting_credits?: number | null;
	feature_name?: string | null;
	feature_description?: string | null;
	element?: string | null;
	personality_traits?: string[] | null;
	ideals?: string[] | null;
	bonds?: string[] | null;
	flaws?: string[] | null;
	background_features?: Array<{ name: string; description: string }> | null;
	// Job detail support (static fallback)
	hit_die?: number | null;
	primary_abilities?: string[] | null;
	saving_throw_proficiencies?: string[] | null;
	armor_proficiencies?: string[] | null;
	weapon_proficiencies?: string[] | null;
	skill_choices?: string[] | null;
	skill_choice_count?: number | null;
	hit_points_at_first_level?: string | null;
	hit_points_at_higher_levels?: string | null;
	regent_prerequisites?: string | null;
	spellcasting_ability?: string | null;
	spellcasting_focus?: string | null;
	awakening_features?: Array<{
		name: string;
		description: string;
		level: number;
	}> | null;
	job_traits?: Array<{
		name: string;
		description: string;
		type: string;
		frequency?: string;
	}> | null;
	ability_score_improvements?: Record<string, number> | null;
	class_features?: Array<{
		level: number;
		name: string;
		description: string;
	}> | null;
	spellcasting?: {
		ability: string;
		focus?: string;
		cantripsKnown?: number[];
		spellsKnown?: number[];
		spellSlots?: Record<string, number[]>;
	} | null;
	// Condition detail support (static fallback)
	condition_effects?: string[] | null;
	condition_duration?: string | null;
	condition_removal?: string[] | null;
	condition_save?: { type?: string; dc?: number; description?: string } | null;
	// Regent detail support (static fallback)
	regent_title?: string | null;
	regent_theme?: string | null;
	regent_damage_type?: string | null;
	regent_manifestation?: string | null;
	regent_corruption_risk?: string | null;
	regent_lore?: string | null;
	regent_abilities?: Array<Record<string, unknown>> | null;
	regent_features?: Array<Record<string, unknown>> | null;
	regent_mechanics?: Record<string, unknown> | null;
	regent_requirements?: Record<string, unknown> | null;
	// Feat detail support
	benefits?: string[] | null;
	// Path detail support
	path_level?: number | null;
	job_id?: string | null;
	job_name?: string | null;
	path_tier?: number | null;
	// Sync Parity support
	spell_level?: number | null;
	casting_time?: string | null;
	concentration?: boolean | null;
	ritual?: boolean | null;
	effect_type?: string | null;
	activation_action?: string | null;
	uses_per_rest?: string | null;
	requires_level?: number | null;
	requires_job?: Record<string, unknown> | null;
	caster_penalty?: string | null;
	martial_penalty?: string | null;
	passive_bonuses?: Record<string, unknown> | null;
	effect_description?: string | null;
	power_type?: string | null;
	level_requirement?: number | null;
	activation_type?: string | null;
	primary_effect?: string | null;
	secondary_effect?: string | null;
	body_part?: string | null;
	shadow_type?: string | null;
	corruption_risk?: string | null;
	manifestation_description?: string | null;
	theme_tags?: string[] | null;
	type?: string | null;
	title?: string | null;
	casting_time_desc?: string | null;
	range_desc?: string | null;
	duration_desc?: string | null;
	hit_points?: number | null;
	speed?: number | null;
	sigil_type?: string | null;
	sigil_rank?: string | null;
	can_inscribe_on?: string[] | string | null;
	relic_type?: string | null;
	value_credits?: number | null;
	flavor_text?: string | null;
	unlock_level?: number | null;
	damage_type?: string | null;
	attunement_requirements?: string | Record<string, string | boolean> | null;
	action_type?: string | null;
	legendary_cost?: number | null;
	attack_bonus?: number | null;
	special_abilities?: Array<{ name?: string; description?: string }> | null;
	// Pantheon detail support
	directive?: string | null;
	portfolio?: string[] | null;
	sigil?: string | null;
	manifestation?: string | null;
	specializations?: string[] | null;
	dogma?: string[] | null;
	worshippers?: string | null;
	temples?: string | null;
	home_realm?: string | null;
	relationships?: Array<{
		id: string;
		name: string;
		type?: "ally" | "enemy" | "rival" | "servant" | "superior" | string;
		description?: string;
	}> | null;
	// Sync Parity additions
	at_higher_levels?: string | null;
	classes?: string[] | null;
	spell_attack?: Record<string, unknown> | null;
	area?: Record<string, unknown> | null;
	hit_dice?: string | null;
	progression_table?: Record<string, unknown> | null;
	dangers?: string[] | null;
	suggested_characteristics?: Record<string, unknown> | null;
	actions?: Record<string, unknown>[] | null;
	traits?: Record<string, unknown>[] | null;
	reactions?: Record<string, unknown>[] | null;
	legendary_actions?: Record<string, unknown>[] | null;
	saving_throw?: Record<string, unknown> | null;
	saving_throw_ability?: string | null;
	has_attack_roll?: boolean | null;
	area_of_effect?: Record<string, unknown> | null;
}

interface StaticDataProvider {
	getJobs: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getPaths: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getAnomalies: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getItems: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getSpells: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getLocations: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getRunes: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getBackgrounds: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getRelics: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getConditions: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getRegents: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getFeats: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getSkills: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getPowers: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getTechniques: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getArtifacts: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getSigils: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getTattoos: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getPantheon: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getShadowSoldiers: (search?: string) => Promise<StaticCompendiumEntry[]>;
}

// Helper function to filter by search query
function filterBySearch<T>(
	items: T[],
	search?: string,
	searchFields: (keyof T)[] = ["name" as keyof T, "description" as keyof T],
): T[] {
	if (!search?.trim()) return items;

	const searchLower = normalizeRegentSearch(search.toLowerCase());
	return items.filter((item) =>
		searchFields.some((field) => {
			const value = item[field];
			return (
				value &&
				typeof value === "string" &&
				value.toLowerCase().includes(searchLower)
			);
		}),
	);
}

type StaticAnomaliesource = {
	id?: string;
	name: string;
	description: string;
	type?: string;
	rank?: string;
	image?: string;
	ac?: number;
	hp?: number;
	stats?: Record<string, unknown>;
	skills?: unknown;
	damageResistances?: unknown;
	damageImmunities?: unknown;
	damageVulnerabilities?: unknown;
	conditionImmunities?: unknown;
	senses?: unknown;
	languages?: unknown;
	traits?: unknown;
	actions?: unknown;
	legendary?: unknown;
	alignment?: unknown;
	source?: unknown;
	xp?: unknown;
	size?: unknown;
};

type StaticItemSource = {
	id?: string;
	name: string;
	description: string;
	type?: string;
	rarity?: string;
	image?: string;
	requirements?: Record<string, unknown>;
	properties?: Record<string, unknown>;
	effects?: Record<string, unknown>;
	attunement?: boolean | null;
	cursed?: boolean | null;
	charges?: Record<string, unknown>;
	stats?: Record<string, unknown>;
	effect?: string;
	value?: number;
	weight?: number;
	source?: string;
	sigil_slots_base?: number | null;
};

type StaticJobSource = {
	id?: string;
	name: string;
	description: string;
	primary_abilities?: string[];
	rank?: string;
	image?: string;
	// Rift Ascendant Class Features
	hitDie?: string;
	primaryAbility?: string;
	savingThrows?: string[];
	skillChoices?: string[];
	armorProficiencies?: string[];
	weaponProficiencies?: string[];
	toolProficiencies?: string[];
	startingEquipment?: string[][];
	hitPointsAtFirstLevel?: string;
	hitPointsAtHigherLevels?: string;
	spellcasting?: {
		ability: string;
		focus?: string;
		cantripsKnown?: number[];
		spellsKnown?: number[];
		spellSlots?: Record<string, number[]>;
	};
	// Rift Ascendant features
	awakeningFeatures?: Array<{
		name: string;
		description: string;
		level: number;
	}>;
	jobTraits?: Array<{
		name: string;
		description: string;
		type: string;
		frequency?: string;
	}>;
	abilityScoreImprovements?: Record<string, number>;
	classFeatures?: Array<{ level: number; name: string; description: string }>;
	source?: string;
};

type StaticSpellSource = {
	id?: string;
	name: string;
	description: string;
	type?: string;
	rank?: string;
	image?: string;
	effect?: string;
	range?: number | string | Record<string, unknown>;
	activation?: Record<string, unknown>;
	duration?: string | Record<string, unknown>;
	components?: Record<string, unknown>;
	effects?: Record<string, unknown>;
	mechanics?: Record<string, unknown>;
	limitations?: Record<string, unknown>;
	flavor?: string;
	higher_levels?: string;
	atHigherLevels?: string;
	// Fields present on well-formed spells (first 3)
	level?: number;
	school?: string;
	castingTime?: string;
	concentration?: boolean;
	ritual?: boolean;
	classes?: string[];
	savingThrow?: Record<string, unknown>;
	spellAttack?: Record<string, unknown>;
	area?: Record<string, unknown>;
};

// ---------------------------------------------------------------------------
// Spell normalization helpers â€” derive missing 5e fields from existing data
// ---------------------------------------------------------------------------
const SCHOOL_KEYWORDS: [RegExp, string][] = [
	[/shadow|necrot|death|undead|wither|drain|blight|curse|soul/i, "Necromancy"],
	[
		/void|ward|shield|barrier|protect|banish|counter|dispel|abjur/i,
		"Abjuration",
	],
	[
		/fire|ice|frost|lightning|thunder|bolt|blast|storm|radiant|force|beam|ray|burn|scorch|ignite|freeze/i,
		"Evocation",
	],
	[/heal|restore|cure|mend|revive|resurrect|vitality|regenerat/i, "Evocation"],
	[/holy|divine|celestial|sacred|smite|purif/i, "Evocation"],
	[
		/summon|conjur|demon|abyssal|portal|gate|call|manifest|rift/i,
		"Conjuration",
	],
	[/illus|phantom|mirage|invis|disguise|mirror|decep/i, "Illusion"],
	[
		/transform|enhance|alter|shift|polymorph|enlarge|reduce|haste|slow|mutate/i,
		"Transmutation",
	],
	[
		/charm|command|compel|dominate|enchant|hold|stun|sleep|sugges|fear|frighten/i,
		"Enchantment",
	],
	[
		/detect|scry|reveal|sense|identify|comprehend|augur|divin|see|sight|locate|find/i,
		"Divination",
	],
];

function deriveSchool(spell: StaticSpellSource): string {
	if (spell.school) return spell.school;
	const text = `${spell.name} ${spell.description} ${spell.effect ?? ""}`;
	for (const [pattern, school] of SCHOOL_KEYWORDS) {
		if (pattern.test(text)) return school;
	}
	return "Evocation"; // default for SA combat-heavy setting
}

function deriveCastingTime(spell: StaticSpellSource): string {
	if (spell.castingTime) return spell.castingTime;
	const act = spell.activation as Record<string, unknown> | undefined;
	if (!act) return "1 action";
	const t = String(act.type ?? "action").toLowerCase();
	const cost = Number(act.cost ?? 1);
	if (t === "bonus_action" || t === "bonus") return "1 bonus action";
	if (t === "reaction") return "1 reaction";
	if (t === "minute") return `${cost} minute${cost > 1 ? "s" : ""}`;
	if (t === "hour") return `${cost} hour${cost > 1 ? "s" : ""}`;
	return "1 action";
}

function deriveLevel(spell: StaticSpellSource): number {
	if (spell.level !== undefined && spell.level !== null) return spell.level;
	const rank = (spell.rank ?? "D").toUpperCase();
	// Default level derivation by rank
	switch (rank) {
		case "D":
			return 1;
		case "C":
			return 3;
		case "B":
			return 5;
		case "A":
			return 7;
		case "S":
			return 9;
		default:
			return 1;
	}
}

function deriveConcentration(spell: StaticSpellSource): boolean {
	if (spell.concentration !== undefined) return spell.concentration;
	const dur = spell.duration;
	if (typeof dur === "string") return /concentrat/i.test(dur);
	if (dur && typeof dur === "object") {
		const t = String((dur as Record<string, unknown>).type ?? "");
		return /concentrat/i.test(t);
	}
	return false;
}

function deriveRitual(spell: StaticSpellSource): boolean {
	if (spell.ritual !== undefined) return spell.ritual;
	return /\britual\b/i.test(spell.description ?? "");
}

const CLASS_MAP: Record<string, string[]> = {
	Attack: ["Destroyer", "Mage", "Esper", "Invoker", "Assassin", "Berserker"],
	Defense: ["Mage", "Herald", "Holy Knight", "Technomancer", "Contractor"],
	Healing: ["Herald", "Holy Knight", "Summoner", "Idol"],
	Utility: [
		"Mage",
		"Assassin",
		"Contractor",
		"Technomancer",
		"Stalker",
		"Idol",
	],
};

function deriveClasses(spell: StaticSpellSource): string[] {
	if (spell.classes && spell.classes.length > 0) return spell.classes;
	return CLASS_MAP[spell.type ?? "Utility"] ?? ["Mage"];
}

type StaticLocationSource = {
	id?: string;
	name: string;
	description: string;
	type?: string;
	rank?: string;
	image?: string;
	encounters?: string[];
	treasures?: string[];
};

type StaticRuneSource = {
	id?: string;
	name: string;
	description: string;
	element?: string;
	rarity?: string;
	image?: string;
	power?: number;
	// Rift Ascendant rune fields
	effect_description?: string;
	rune_type?: string;
	rune_category?: string;
	rune_level?: number;
	effect_type?: string;
	activation_action?: string;
	uses_per_rest?: string;
	recharge?: string;
	range?: string;
	duration?: string;
	higher_levels?: string;
	lore?: string;
	discovery_lore?: string;
	tags?: string[];
	requires_level?: number;
};

type StaticBackgroundSource = {
	id?: string;
	name: string;
	description: string;
	skills?: string[];
	image?: string;
	rank?: string;
	// Full 5e template fields
	skillProficiencies?: string[];
	toolProficiencies?: string[];
	languages?: string[];
	equipment?: string[];
	features?: Array<{ name: string; description: string } | string>;
	personalityTraits?: string[];
	ideals?: string[];
	bonds?: string[];
	flaws?: string[];
	dangers?: string[];
	abilities?: string[];
	source?: string;
	suggestedCharacteristics?: {
		personality?: string[];
		ideal?: string[];
		bond?: string[];
		flaw?: string[];
	};
};

type StaticRegentSource = {
	id?: string;
	name: string;
	description: string;
	title?: string;
	theme?: string;
	rank?: string;
	image?: string;
	type?: string;
	tags?: string[];
	source_book?: string;
	requirements?: {
		quest_completion?: string;
		dm_verification?: boolean;
		prerequisite_job?: string;
		power_level?: number;
	};
	abilities?: Array<{
		name: string;
		description: string;
		type: string;
		frequency?: string;
		dc?: number;
		spell_slot?: number;
		power_level?: number;
	}>;
	features?: Array<{
		name: string;
		description: string;
		power_level?: number;
	}>;
	mechanics?: {
		stat_bonuses?: Record<string, number>;
		special_abilities?: string[];
		restrictions?: string[];
		progression?: Record<string, string[]>;
	};
};

// Transform static data to match UI interface
function transformAnomaly(
	Anomaly: StaticAnomaliesource,
): StaticCompendiumEntry {
	const rawRank = typeof Anomaly.rank === "string" ? Anomaly.rank : undefined;
	const rank = rawRank && rawRank.length > 0 ? rawRank : undefined;

	const statsObj =
		Anomaly.stats && typeof Anomaly.stats === "object"
			? (Anomaly.stats as Record<string, unknown>)
			: null;
	const abilityScores =
		(statsObj?.abilityScores || statsObj?.ability_scores) &&
		typeof (statsObj?.abilityScores || statsObj?.ability_scores) === "object"
			? ((statsObj?.abilityScores || statsObj?.ability_scores) as Record<
					string,
					unknown
				>)
			: null;

	const armorClass =
		typeof Anomaly.ac === "number"
			? Anomaly.ac
			: typeof (statsObj?.armorClass || statsObj?.ac) === "number"
				? ((statsObj?.armorClass || statsObj?.ac) as number)
				: null;
	const hitPoints =
		typeof Anomaly.hp === "number"
			? Anomaly.hp
			: typeof (statsObj?.hitPoints || statsObj?.hp) === "number"
				? ((statsObj?.hitPoints || statsObj?.hp) as number)
				: null;
	const speed =
		typeof (statsObj?.speed || statsObj?.movement_speed) === "number"
			? ((statsObj?.speed || statsObj?.movement_speed) as number)
			: null;
	const crNumber =
		typeof statsObj?.challengeRating === "number" ||
		typeof statsObj?.cr === "number"
			? ((statsObj?.challengeRating || statsObj?.cr) as number)
			: null;
	const proficiencyBonus =
		typeof statsObj?.proficiencyBonus === "number"
			? (statsObj.proficiencyBonus as number)
			: 2; // Default for Rank D entities
	const savingThrows =
		(statsObj?.savingThrows || statsObj?.saving_throws) &&
		typeof (statsObj?.savingThrows || statsObj?.saving_throws) === "object"
			? ((statsObj?.savingThrows || statsObj?.saving_throws) as Record<
					string,
					unknown
				>)
			: null;

	const normalizeStringArray = (value: unknown): string[] | null => {
		if (Array.isArray(value)) {
			return value.map((v) => String(v)).filter((s) => s.trim().length > 0);
		}
		if (typeof value === "string" && value.trim().length > 0) {
			return value
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
		}
		return null;
	};

	const traits = Array.isArray(Anomaly.traits)
		? (Anomaly.traits as Record<string, unknown>[])
		: null;
	const actions = Array.isArray(Anomaly.actions)
		? (Anomaly.actions as Record<string, unknown>[])
		: null;

	const skillNames = normalizeStringArray(Anomaly.skills);
	const skillMap = skillNames
		? Object.fromEntries(
				skillNames.map((name) => [name, proficiencyBonus ?? 0]),
			)
		: null;

	return {
		id: Anomaly.id || Anomaly.name.toLowerCase().replace(/\s+/g, "-"),
		name: Anomaly.name,
		display_name: Anomaly.name,
		description: Anomaly.description,
		created_at:
			(Anomaly as { created_at?: string }).created_at ||
			"2024-01-01T00:00:00.000Z",
		tags: [Anomaly.type, rank].filter(Boolean) as string[],
		source_book: "Rift Ascendant Homebrew",
		image_url: Anomaly.image,
		cr: crNumber !== null ? String(crNumber) : (rank ?? null),
		gate_rank: rank ?? null,
		is_boss: rank === "S" || rank === "A",
		rarity:
			rank === "S"
				? "legendary"
				: rank === "A"
					? "epic"
					: rank === "B"
						? "rare"
						: rank === "C"
							? "uncommon"
							: "common",

		size: typeof Anomaly.size === "string" ? Anomaly.size : "Medium",
		creature_type: Anomaly.type ?? null,
		alignment: typeof Anomaly.alignment === "string" ? Anomaly.alignment : null,
		armor_class: armorClass,
		hit_points_average: hitPoints,
		hit_points_formula: null,
		speed_walk: speed,
		str:
			typeof abilityScores?.strength === "number"
				? (abilityScores.strength as number)
				: null,
		agi:
			typeof abilityScores?.agility === "number"
				? (abilityScores.agility as number)
				: null,
		vit:
			typeof abilityScores?.vitality === "number"
				? (abilityScores.vitality as number)
				: null,
		int:
			typeof abilityScores?.intelligence === "number"
				? (abilityScores.intelligence as number)
				: null,
		sense:
			typeof abilityScores?.sense === "number"
				? (abilityScores.sense as number)
				: null,
		pre:
			typeof abilityScores?.presence === "number"
				? (abilityScores.presence as number)
				: null,
		saving_throws: savingThrows
			? (Object.fromEntries(
					Object.entries(savingThrows)
						.filter(([, v]) => typeof v === "number")
						.map(([k, v]) => [k, v as number]),
				) as Record<string, number>)
			: null,
		skills: skillMap,
		damage_resistances: normalizeStringArray(Anomaly.damageResistances) ?? null,
		damage_immunities: normalizeStringArray(Anomaly.damageImmunities) ?? null,
		damage_vulnerabilities:
			normalizeStringArray(Anomaly.damageVulnerabilities) ?? null,
		condition_immunities:
			normalizeStringArray(Anomaly.conditionImmunities) ?? null,
		senses:
			typeof Anomaly.senses === "string" ? { text: Anomaly.senses } : null,
		languages: normalizeStringArray(Anomaly.languages) ?? null,
		xp: typeof Anomaly.xp === "number" ? Anomaly.xp : null,
		Anomaly_traits: traits,
		Anomaly_actions: actions,
	};
}

function deriveItemProperties(
	item: StaticItemSource,
): Record<string, unknown> | null {
	if (item.properties) return item.properties as Record<string, unknown>;
	const stats = item.stats as Record<string, unknown> | undefined;
	const t = (item.type ?? "").toLowerCase();

	if (t === "weapon") {
		return {
			weapon: {
				damage: "1d6",
				damage_type: "slashing",
				versatile: null,
				finesse: false,
			},
			magical: stats ? { bonus: { attack: 0, damage: 0 } } : undefined,
		};
	}
	if (t === "armor") {
		const def = typeof stats?.defense === "number" ? stats.defense : 0;
		const acBonus = def > 100 ? 3 : def > 50 ? 2 : def > 0 ? 1 : 0;
		return {
			armor: {
				baseAC: 10 + acBonus,
				type: acBonus >= 3 ? "heavy" : acBonus >= 2 ? "medium" : "light",
			},
			magical:
				acBonus > 0 ? { bonus: { armor_class_migrated: acBonus } } : undefined,
		};
	}
	if (t === "consumable") {
		return { consumable: { uses: 1, action: "action" } };
	}
	if (t === "accessory" || t === "wondrous") {
		return { wondrous: { slot: "any" } };
	}
	return null;
}

function transformItem(item: StaticItemSource): StaticCompendiumEntry {
	return {
		id: item.id || item.name.toLowerCase().replace(/\s+/g, "-"),
		name: item.name,
		display_name: item.name,
		description: item.description,
		created_at:
			(item as { created_at?: string }).created_at ||
			"2024-01-01T00:00:00.000Z",
		tags: [item.type, item.rarity].filter(Boolean) as string[],
		source_book: "Rift Ascendant Homebrew",
		image_url: item.image,
		image: item.image,
		equipment_type: item.type,
		item_type: item.type,
		requirements: item.requirements ?? null,
		properties: Array.isArray(item.properties) ? item.properties : [],
		item_properties: deriveItemProperties(item),
		effects: item.effects ?? null,
		attunement: item.attunement ?? null,
		cursed: item.cursed ?? null,
		charges: item.charges ?? null,
		stats: item.stats,
		effect: item.effect,
		value: item.value,
		cost_credits: item.value,
		weight: item.weight,
		source: item.source,
		rarity: item.rarity || "common",
		sigil_slots_base:
			item.sigil_slots_base ??
			getDefaultSigilSlotsBaseForEquipment({
				item_type: item.type,
				properties: Array.isArray(item.properties) ? item.properties : [],
				name: item.name,
			}),
		level: undefined,
	};
}

function transformJob(job: StaticJobSource): StaticCompendiumEntry {
	// Parse hit die number from string like "1d10"
	const hitDieNumber = job.hitDie
		? parseInt(job.hitDie.replace(/\D/g, "").slice(-2) || "0", 10)
		: null;
	// Skill choice count: 5e standard is 2 for most jobs, 4 for Assassin
	const skillChoiceCount = job.skillChoices
		? job.name === "Assassin"
			? 4
			: 2
		: null;

	return {
		id: job.id || job.name.toLowerCase().replace(/\s+/g, "-"),
		name: job.name,
		display_name: job.name,
		description: job.description,
		created_at:
			(job as { created_at?: string }).created_at || "2024-01-01T00:00:00.000Z",
		tags: job.primary_abilities || [],
		source_book: job.source || "Rift Ascendant Canon",
		image_url: job.image,
		rank: job.rank || null,
		rarity:
			job.rank === "S"
				? "legendary"
				: job.rank === "A"
					? "epic"
					: job.rank === "B"
						? "rare"
						: job.rank === "C"
							? "uncommon"
							: "common",
		// Job-specific fields for JobDetail.tsx
		hit_die: hitDieNumber,
		primary_abilities:
			job.primary_abilities ||
			(job.primaryAbility ? [job.primaryAbility] : null),
		saving_throw_proficiencies: job.savingThrows || null,
		armor_proficiencies: job.armorProficiencies || null,
		weapon_proficiencies: job.weaponProficiencies || null,
		tool_proficiencies: job.toolProficiencies || null,
		skill_choices: job.skillChoices || null,
		skill_choice_count: skillChoiceCount,
		starting_equipment: job.startingEquipment || null,
		hit_points_at_first_level: job.hitPointsAtFirstLevel || null,
		hit_points_at_higher_levels: job.hitPointsAtHigherLevels || null,
		regent_prerequisites: null,
		spellcasting_ability: job.spellcasting?.ability || null,
		spellcasting_focus: job.spellcasting?.focus || null,
		awakening_features: job.awakeningFeatures || null,
		job_traits: job.jobTraits || null,
		ability_score_improvements: job.abilityScoreImprovements || null,
		class_features: job.classFeatures || null,
		spellcasting: job.spellcasting || null,
		level: undefined,
	};
}

function transformSpell(spell: StaticSpellSource): StaticCompendiumEntry {
	const rangeValue =
		typeof spell.range === "number"
			? spell.range
			: typeof spell.range === "string"
				? { type: spell.range, distance: spell.range }
				: spell.range && typeof spell.range === "object"
					? (spell.range as Record<string, unknown>)
					: null;
	const rankValue = typeof spell.rank === "string" ? spell.rank : null;
	const primaryEffect = typeof spell.effect === "string" ? spell.effect : "";

	// Derive missing 5e fields
	const school = deriveSchool(spell);
	const castingTime = deriveCastingTime(spell);
	const spellLevel = deriveLevel(spell);
	const concentration = deriveConcentration(spell);
	const ritual = deriveRitual(spell);
	const classes = deriveClasses(spell);

	const derivedActivation = {
		type: castingTime.includes("bonus")
			? "bonus_action"
			: castingTime.includes("reaction")
				? "reaction"
				: "action",
		cost: 1,
	};
	const derivedDuration = concentration
		? { type: "concentration", time: "1 minute" }
		: { type: "instantaneous" };
	const derivedComponents = { verbal: true, somatic: true, material: false };
	const derivedEffects = { primary: primaryEffect };

	return {
		id: spell.id || spell.name.toLowerCase().replace(/\s+/g, "-"),
		name: spell.name,
		display_name: spell.name,
		description: spell.description,
		created_at:
			(spell as { created_at?: string }).created_at ||
			"2024-01-01T00:00:00.000Z",
		tags: [spell.type, spell.rank, school, ...classes].filter(
			Boolean,
		) as string[],
		source_book: "Rift Ascendant Homebrew",
		image_url: spell.image,
		spell_type: spell.type,
		rank: rankValue,
		level: spellLevel,
		effect: spell.effect,
		range: rangeValue,
		school: school,
		activation: (spell.activation && typeof spell.activation === "object"
			? spell.activation
			: derivedActivation) as Record<string, unknown>,
		duration: (spell.duration && typeof spell.duration === "object"
			? spell.duration
			: derivedDuration) as Record<string, unknown>,
		components: (spell.components && typeof spell.components === "object"
			? spell.components
			: derivedComponents) as Record<string, unknown>,
		effects: (spell.effects && typeof spell.effects === "object"
			? spell.effects
			: derivedEffects) as Record<string, unknown>,
		mechanics: (spell.mechanics && typeof spell.mechanics === "object"
			? spell.mechanics
			: (spell as Record<string, unknown>).spellAttack
				? { attack: (spell as Record<string, unknown>).spellAttack }
				: {
						saving_throw: { ability: "agility", effect: "half damage" },
					}) as Record<string, unknown>,
		limitations: (spell.limitations && typeof spell.limitations === "object"
			? {
					...spell.limitations,
					concentration,
					ritual,
					casting_time: castingTime,
					spell_classes: classes,
				}
			: {
					concentration,
					ritual,
					casting_time: castingTime,
					spell_classes: classes,
				}) as Record<string, unknown>,
		flavor:
			typeof spell.flavor === "string" ? spell.flavor : spell.description || "",
		higher_levels: spell.higher_levels || spell.atHigherLevels || null,
		atHigherLevels: spell.atHigherLevels || spell.higher_levels || null,
		rarity:
			spell.rank === "S"
				? "legendary"
				: spell.rank === "A"
					? "epic"
					: spell.rank === "B"
						? "rare"
						: spell.rank === "C"
							? "uncommon"
							: "common",
	};
}

function transformLocation(
	location: StaticLocationSource,
): StaticCompendiumEntry {
	return {
		id: location.id || location.name.toLowerCase().replace(/\s+/g, "-"),
		name: location.name,
		display_name: location.name,
		description: location.description,
		created_at:
			(location as { created_at?: string }).created_at ||
			"2024-01-01T00:00:00.000Z",
		tags: [location.type, location.rank].filter(Boolean) as string[],
		source_book: "Rift Ascendant Homebrew",
		image_url: location.image,
		location_type: location.type,
		rank: location.rank,
		encounters: location.encounters,
		treasures: location.treasures,
		rarity:
			location.rank === "S"
				? "legendary"
				: location.rank === "A"
					? "epic"
					: location.rank === "B"
						? "rare"
						: location.rank === "C"
							? "uncommon"
							: "common",
	};
}

function _transformRune(
	rune: StaticRuneSource & Record<string, unknown>,
): StaticCompendiumEntry {
	const { range, duration, activation_action, lore, discovery_lore, ...rest } =
		rune;
	return {
		...rest, // Preserve all native Rift Ascendant properties (inscription_difficulty, effect_type etc)
		id:
			rune.id ||
			rune.name?.toLowerCase().replace(/\s+/g, "-") ||
			"unknown-rune",
		name: rune.name || "Unknown Rune",
		display_name: rune.name || "Unknown Rune",
		description: rune.effect_description || rune.description || "",
		created_at:
			(rune as { created_at?: string }).created_at ||
			"2024-01-01T00:00:00.000Z",
		tags: (rune.tags || [rune.element || rune.rune_type, rune.rarity]).filter(
			Boolean,
		) as string[],
		source_book: (rune.source_book as string) || "Rift Ascendant Canon",
		image_url: rune.image,
		rune_type: rune.rune_type || rune.element || null,
		rune_category: rune.rune_category || rune.element || null,
		rune_level: rune.rune_level ?? rune.power ?? undefined,
		rarity: rune.rarity || "uncommon",
		level: rune.requires_level ?? rune.rune_level ?? rune.power ?? undefined,
		range: typeof range === "string" ? { type: range } : range,
		duration: typeof duration === "string" ? { type: duration } : duration,
		activation: activation_action ? { type: activation_action } : undefined,
		lore: lore ? { origin: lore, discovery: discovery_lore } : null,
		flavor: lore || null,
	};
}

function transformBackground(
	background: StaticBackgroundSource,
): StaticCompendiumEntry {
	// Resolve skill proficiencies from either new or legacy field
	const skillProfs = background.skillProficiencies || background.skills || [];

	// Resolve structured features into feature_name/feature_description (primary feature)
	const structuredFeatures: Array<{ name: string; description: string }> = [];
	if (Array.isArray(background.features)) {
		for (const f of background.features) {
			if (typeof f === "object" && f !== null && "name" in f) {
				structuredFeatures.push(f as { name: string; description: string });
			}
		}
	}
	const primaryFeature = structuredFeatures[0] || null;

	// Build equipment string from array
	const equipmentStr =
		Array.isArray(background.equipment) && background.equipment.length > 0
			? background.equipment.join(", ")
			: null;

	// Resolve personality traits from direct fields or suggestedCharacteristics
	const personalityTraits =
		background.personalityTraits ||
		background.suggestedCharacteristics?.personality ||
		[];
	const ideals =
		background.ideals || background.suggestedCharacteristics?.ideal || [];
	const bonds =
		background.bonds || background.suggestedCharacteristics?.bond || [];
	const flaws =
		background.flaws || background.suggestedCharacteristics?.flaw || [];

	return {
		id: background.id || background.name.toLowerCase().replace(/\s+/g, "-"),
		name: background.name,
		display_name: background.name,
		description: background.description,
		created_at:
			(background as { created_at?: string }).created_at ||
			"2024-01-01T00:00:00.000Z",
		tags: skillProfs,
		source_book: background.source || "Rift Ascendant Canon",
		image_url: background.image,
		rarity: background.rank?.toLowerCase() || "uncommon",
		rank: background.rank || null,
		// Background-specific fields for BackgroundDetail.tsx
		skill_proficiencies: skillProfs.length > 0 ? skillProfs : null,
		tool_proficiencies:
			background.toolProficiencies && background.toolProficiencies.length > 0
				? background.toolProficiencies
				: null,
		language_count: background.languages ? background.languages.length : null,
		languages: background.languages || null,
		starting_equipment: equipmentStr,
		feature_name: primaryFeature?.name || null,
		feature_description: primaryFeature?.description || null,
		personality_traits: personalityTraits.length > 0 ? personalityTraits : null,
		ideals: ideals.length > 0 ? ideals : null,
		bonds: bonds.length > 0 ? bonds : null,
		flaws: flaws.length > 0 ? flaws : null,
		background_features:
			structuredFeatures.length > 0 ? structuredFeatures : null,
	};
}

// Derive class_features for regents that only have features[] + abilities[] with power_level
function deriveRegentClassFeatures(
	regent: StaticRegentSource,
): Array<{ level: number; name: string; description: string }> | null {
	// If the regent already has class_features (like Umbral Regent), use them
	const raw = (regent as RegentExtended).class_features;
	if (Array.isArray(raw) && raw.length > 0)
		return raw as Array<{ level: number; name: string; description: string }>;

	const features = (regent as RegentExtended).features as
		| Array<{ name: string; description: string; power_level?: number }>
		| undefined;
	const abilities = regent.abilities as
		| Array<{
				name: string;
				description: string;
				power_level?: number;
				type?: string;
				frequency?: string;
		  }>
		| undefined;
	if (!features && !abilities) return null;

	// Power level â†’ character level mapping (regent power 1-10 â†’ character level 1-20)
	const powerToLevel: Record<number, number> = {
		1: 1,
		2: 3,
		3: 5,
		4: 7,
		5: 9,
		6: 11,
		7: 13,
		8: 15,
		9: 17,
		10: 20,
	};
	const result: Array<{ level: number; name: string; description: string }> =
		[];

	for (const f of features ?? []) {
		const pl = f.power_level ?? 1;
		result.push({
			level: powerToLevel[pl] ?? pl * 2 - 1,
			name: f.name,
			description: f.description,
		});
	}
	for (const a of abilities ?? []) {
		const pl = a.power_level ?? 1;
		const suffix = a.frequency ? ` (${a.frequency.replace(/-/g, " ")})` : "";
		result.push({
			level: powerToLevel[pl] ?? pl * 2 - 1,
			name: a.name,
			description: a.description + suffix,
		});
	}

	result.sort((a, b) => a.level - b.level);
	return result.length > 0 ? result : null;
}

function transformRegent(regent: StaticRegentSource): StaticCompendiumEntry {
	const classFeatures = deriveRegentClassFeatures(regent);

	return {
		id: regent.id || regent.name.toLowerCase().replace(/\s+/g, "-"),
		name: regent.name,
		display_name: regent.name,
		description: regent.description || "",
		created_at:
			(regent as { created_at?: string }).created_at ||
			"2024-01-01T00:00:00.000Z",
		tags: regent.tags || (["regent", regent.theme].filter(Boolean) as string[]),
		source_book: regent.source_book || "Rift Ascendant Canon",
		image_url: regent.image,
		title: regent.title,
		theme: regent.theme,
		rank: regent.rank || null,
		rarity:
			regent.rank === "S"
				? "legendary"
				: regent.rank === "A"
					? "epic"
					: regent.rank === "B"
						? "rare"
						: regent.rank === "C"
							? "uncommon"
							: "common",
		// Regent-specific fields for RegentDetail.tsx
		regent_title: regent.title || null,
		regent_theme: regent.theme || null,
		regent_abilities:
			(regent.abilities as Array<Record<string, unknown>>) || null,
		regent_features:
			(regent.features as Array<Record<string, unknown>>) || null,
		regent_mechanics: (regent.mechanics as Record<string, unknown>) || null,
		regent_requirements:
			(regent.requirements as Record<string, unknown>) || null,
		// Derived 5e-style class features for all regents
		class_features: classFeatures,
	};
}

// Create the provider
export const staticDataProvider: StaticDataProvider = {
	getJobs: async (search?: string) => {
		const jobs = await loadData<StaticJobSource>("jobs");
		const filtered = filterBySearch(jobs, search, ["name", "description"]);
		return filtered.map(transformJob);
	},

	getPaths: async (search?: string) => {
		const paths = await loadData<{
			id: string;
			name: string;
			description: string;
			jobId: string;
			jobName: string;
			tier: number;
			source: string;
			image?: string;
			requirements: {
				level?: number;
				prerequisites?: string[];
				skills?: string[];
			};
		}>("paths");
		const filtered = filterBySearch(paths, search, ["name", "description"]);
		return filtered.map((path) => ({
			id: path.id,
			name: path.name,
			display_name: path.name,
			description: path.description,
			created_at:
				(path as { created_at?: string }).created_at ||
				"2024-01-01T00:00:00.000Z",
			tags: [
				path.jobId,
				`tier-${path.tier}`,
				...(path.requirements.skills || []),
			].filter(Boolean) as string[],
			source_book: path.source,
			image_url: path.image,
			level: path.requirements.level,
			path_level: path.requirements.level,
			job_id: path.jobId,
			job_name: path.jobName,
			path_tier: path.tier,
			prerequisites: path.requirements.prerequisites?.join(", "),
			rarity:
				path.tier === 3 ? "legendary" : path.tier === 2 ? "very_rare" : "rare",
			jobId: path.jobId,
			jobName: path.jobName,
			tier: path.tier,
		}));
	},

	getAnomalies: async (search?: string) => {
		const anomalies = await loadData<StaticAnomaliesource>("anomalies");
		const filtered = filterBySearch(anomalies, search, [
			"name",
			"description",
			"type",
			"rank",
		]);
		return filtered.map(transformAnomaly);
	},

	getItems: async (search?: string) => {
		const items = await loadData<StaticItemSource>("items");
		const filtered = filterBySearch(items, search, [
			"name",
			"description",
			"type",
			"rarity",
		]);
		return filtered.map(transformItem);
	},

	getSpells: async (search?: string) => {
		const spells = await loadData<StaticSpellSource>("spells");
		const filtered = filterBySearch(spells, search, [
			"name",
			"description",
			"type",
		]);
		return filtered.map(transformSpell);
	},

	getLocations: async (search?: string) => {
		const locations = await loadData<StaticLocationSource>("locations");
		const filtered = filterBySearch(locations, search, [
			"name",
			"description",
			"type",
		]);
		return filtered.map(transformLocation);
	},

	getRunes: async (search?: string) => {
		const slRunes = await loadData<CompendiumRune | CompendiumSigil>(
			"systemAscendantRunes",
		);
		const filtered = filterBySearch(slRunes, search, ["name", "description"]);
		return filtered as never as StaticCompendiumEntry[];
	},

	getBackgrounds: async (search?: string) => {
		const backgrounds = await loadData<StaticBackgroundSource>("backgrounds");
		const filtered = filterBySearch(backgrounds, search, [
			"name",
			"description",
		]);
		return filtered.map(transformBackground);
	},

	getRelics: async (search?: string) => {
		const comprehensiveRelics = await loadData<{
			id: string;
			name: string;
			description: string;
			type?: string;
			rarity?: string;
			attunement?: boolean;
			requirements?: Record<string, unknown> | null;
			properties?: Record<string, unknown> | null;
			abilities?: Record<string, unknown> | null;
			lore?: Record<string, unknown> | null;
			mechanics?: Record<string, unknown> | null;
			source?: string;
			image?: string;
		}>("comprehensiveRelics");
		const filtered = filterBySearch(comprehensiveRelics, search, [
			"name",
			"description",
			"type",
		]);
		return filtered.map((relic) => ({
			id: relic.id,
			name: relic.name,
			display_name: relic.name,
			description: relic.description,
			created_at: new Date().toISOString(),
			tags: [relic.type, relic.rarity, "relic"].filter(Boolean) as string[],
			source_book: relic.source || "Rift Ascendant Canon",
			image_url: relic.image,
			rarity: relic.rarity || "rare",
			item_type: relic.type || "relic",
			equipment_type: relic.type || "relic",
			attunement: relic.attunement ?? null,
			requirements: relic.requirements ?? null,
			properties: relic.properties ?? null,
			abilities: relic.abilities ?? null,
			lore: relic.lore ?? null,
			mechanics: relic.mechanics ?? null,
			flavor: (relic.lore as { description?: string })?.description || null,
		}));
	},

	getConditions: async (search?: string) => {
		const conditions = await loadData<{
			id: string;
			name: string;
			description: string;
			type?: string;
			effects?: string[];
			duration?: string;
			removal?: string[];
			save?: {
				type?: string;
				dc?: number;
				description?: string;
			};
			source?: string;
			image?: string;
		}>("conditions");
		const filtered = filterBySearch(conditions, search, [
			"name",
			"description",
			"type",
		]);
		return filtered.map((condition) => ({
			id: condition.id,
			name: condition.name,
			display_name: condition.name,
			description: condition.description,
			created_at: new Date().toISOString(),
			tags: [condition.type, "condition"].filter(Boolean) as string[],
			source_book: condition.source,
			image_url: condition.image,
			condition_effects: Array.isArray(condition.effects)
				? condition.effects
				: undefined,
			condition_duration:
				typeof condition.duration === "string" ? condition.duration : undefined,
			condition_removal: Array.isArray(condition.removal)
				? condition.removal
				: undefined,
			condition_save:
				condition.save && typeof condition.save === "object"
					? condition.save
					: undefined,
		}));
	},

	getRegents: async (search?: string) => {
		const regents = await loadData<StaticRegentSource>("regents");
		const filtered = filterBySearch(regents, search, [
			"name",
			"description",
			"title",
			"theme",
		]);
		return filtered.map(transformRegent);
	},

	getFeats: async (search?: string) => {
		const comprehensiveFeats =
			(await loadData<{
				id: string;
				name: string;
				description: string;
				benefits?: string;
				prerequisites?: string | Record<string, string | number | boolean>;
				source?: string;
			}>("comprehensiveFeats")) || [];
		const filtered = filterBySearch(comprehensiveFeats, search, [
			"name",
			"description",
			"benefits",
		]);
		return (filtered || []).map((feat) => ({
			id: feat.id,
			name: feat.name,
			display_name: feat.name,
			description: feat.description,
			created_at: new Date().toISOString(),
			tags: [
				"feat",
				"ability",
				...(feat.prerequisites &&
				typeof feat.prerequisites !== "string" &&
				Array.isArray((feat.prerequisites as Record<string, unknown>).feats)
					? ((feat.prerequisites as Record<string, unknown>).feats as string[])
					: []),
			].filter(Boolean) as string[],
			source_book: feat.source,
			prerequisites: feat.prerequisites
				? typeof feat.prerequisites === "string"
					? feat.prerequisites
					: Object.entries(feat.prerequisites)
							.map(([key, value]) => `${key}: ${value}`)
							.join(", ")
				: undefined,
			benefits: feat.benefits ? [feat.benefits] : null,
		}));
	},

	getSkills: async (search?: string) => {
		const comprehensiveSkills = await loadData<{
			id: string;
			name: string;
			description: string;
			type?: string;
			ability?: string;
			source?: string;
		}>("comprehensiveSkills");
		const filtered = filterBySearch(comprehensiveSkills, search, [
			"name",
			"description",
			"type",
		]);
		return filtered.map((skill) => ({
			id: skill.id,
			name: skill.name,
			display_name: skill.name,
			description: skill.description,
			created_at: new Date().toISOString(),
			tags: [skill.type, "skill", skill.ability].filter(Boolean) as string[],
			source_book: skill.source,
			ability: skill.ability,
		}));
	},

	getPowers: async (search?: string) => {
		const powers = await loadData<{
			id: string;
			name: string;
			description: string;
			type?: string;
			rarity?: string;
			image?: string;
			requirements?: {
				level?: number;
				class?: string;
				job?: string;
				ability?: string;
				score?: number;
			} | null;
			source?: string;
			activation?: { type?: string; time?: string } | null;
			duration?: { type?: string; time?: string } | null;
			range?: { type?: string; distance?: number } | null;
			components?: {
				verbal?: boolean;
				somatic?: boolean;
				material?: boolean;
				material_desc?: string;
			} | null;
			effects?: {
				primary?: string;
				secondary?: string;
				tertiary?: string;
			} | null;
			limitations?: {
				uses?: string;
				recharge?: string;
				conditions?: string[];
			} | null;
			flavor?: string;
			element?: string;
			saving_throw?: { ability?: string; dc?: number | string } | null;
			attack_roll?: { modifier?: string; type?: string } | null;
			mechanics?: {
				action?: string;
				damage?: string;
				duration?: string;
				range?: string;
			} | null;
		}>("powers");
		const filtered = filterBySearch(powers, search, [
			"name",
			"description",
			"type",
		]);
		return filtered.map((power) => ({
			id: power.id,
			name: power.name,
			display_name: power.name,
			description: power.description,
			created_at: new Date().toISOString(),
			tags: ["power", power.type, power.rarity].filter(Boolean) as string[],
			source_book: power.source,
			image_url: power.image,
			power_level:
				power.type === "divine" ? 10 : power.type === "monstrous" ? 8 : 5,
			school: power.type,
			title: power.type,
			theme: power.type,
			element: power.element || null,
			prerequisites: power.requirements
				? JSON.stringify(power.requirements)
				: null,
			rarity: power.rarity,
			level: power.requirements?.level,
			// Rich fields for detail views
			activation: (power.activation as Record<string, unknown>) || null,
			duration: power.duration || null,
			range: power.range || null,
			components: (power.components as Record<string, unknown>) || null,
			effects: (power.effects as Record<string, unknown>) || null,
			limitations: (power.limitations as Record<string, unknown>) || null,
			flavor: power.flavor || null,
			saving_throw: (power.saving_throw as Record<string, unknown>) || null,
			attack: (power.attack_roll as Record<string, unknown>) || null,
			mechanics: (power.mechanics as Record<string, unknown>) || null,
		}));
	},

	getTechniques: async (search?: string) => {
		const techniques = await loadData<{
			id: string;
			name: string;
			description: string;
			type?: string;
			style?: string;
			image?: string;
			source?: string;
			prerequisites?: { level?: number } | null;
			activation?: Record<string, unknown> | null;
			duration?: Record<string, unknown> | null;
			range?: Record<string, unknown> | null;
			components?: Record<string, unknown> | null;
			effects?: Record<string, unknown> | null;
			mechanics?: Record<string, unknown> | null;
			limitations?: Record<string, unknown> | null;
			element?: string | null;
			flavor?: string | null;
		}>("techniques");
		const filtered = filterBySearch(techniques, search, [
			"name",
			"description",
			"type",
			"style",
		]);
		return filtered.map((technique) => ({
			id: technique.id,
			name: technique.name,
			display_name: technique.name,
			description: technique.description,
			created_at: new Date().toISOString(),
			tags: ["technique", technique.type, technique.style].filter(
				Boolean,
			) as string[],
			source_book: technique.source,
			image_url: technique.image,
			type: technique.type,
			style: technique.style,
			element: technique.element || null,
			prerequisites: technique.prerequisites || null,
			activation: (technique.activation as Record<string, unknown>) || null,
			duration: (technique.duration as Record<string, unknown>) || null,
			range: (technique.range as Record<string, unknown>) || null,
			components: (technique.components as Record<string, unknown>) || null,
			effects: (technique.effects as Record<string, unknown>) || null,
			mechanics: (technique.mechanics as Record<string, unknown>) || null,
			limitations: (technique.limitations as Record<string, unknown>) || null,
			flavor: technique.flavor,
			source: technique.source,
			power_level:
				technique.type === "finishing"
					? 9
					: technique.type === "offensive"
						? 7
						: 5,
			school: technique.type,
			title: technique.type,
			theme: technique.style,
			rarity:
				technique.type === "finishing"
					? "legendary"
					: technique.type === "offensive"
						? "rare"
						: "uncommon",
			level: technique.prerequisites?.level,
			saving_throw:
				(technique.mechanics?.saving_throw as Record<string, unknown>) || null,
			attack: (technique.mechanics?.attack as Record<string, unknown>) || null,
			movement:
				(technique.mechanics?.movement as Record<string, unknown>) || null,
		}));
	},

	getArtifacts: async (search?: string) => {
		const artifacts = await loadData<{
			id: string;
			name: string;
			description: string;
			type?: string;
			rarity?: string;
			source?: string;
			image?: string;
			attunement?: boolean | null;
			requirements?: Record<string, unknown> | null;
			properties?: Record<string, unknown> | null;
			abilities?: Record<string, unknown> | null;
			lore?: Record<string, unknown> | null;
			mechanics?: Record<string, unknown> | null;
		}>("artifacts");
		const filtered = filterBySearch(artifacts, search, [
			"name",
			"description",
			"type",
			"rarity",
		]);
		return filtered.map((artifact) => ({
			id: artifact.id,
			name: artifact.name,
			display_name: artifact.name,
			description: artifact.description,
			created_at:
				(artifact as { created_at?: string }).created_at ||
				"2024-01-01T00:00:00.000Z",
			tags: ["artifact", artifact.type, artifact.rarity].filter(
				Boolean,
			) as string[],
			source_book: artifact.source || "Rift Ascendant Canon",
			image_url: artifact.image,
			artifact_type: artifact.type || "artifact",
			attunement: artifact.attunement,
			requirements: artifact.requirements || null,
			properties: artifact.properties || null,
			abilities: artifact.abilities || null,
			lore: artifact.lore || null,
			mechanics: artifact.mechanics || null,
			source: artifact.source,
			flavor: (artifact.lore as { description?: string })?.description || null,
			power_level:
				artifact.rarity === "divine"
					? 10
					: artifact.rarity === "mythic"
						? 9
						: 8,
			school: artifact.type,
			title: artifact.type,
			theme: artifact.rarity,
			rarity: artifact.rarity || "legendary",
			level:
				typeof (artifact.requirements as Record<string, unknown>)?.level ===
				"number"
					? ((artifact.requirements as Record<string, unknown>).level as number)
					: undefined,
		}));
	},

	getShadowSoldiers: async (search?: string) => {
		const shadowSoldiers = [
			{
				id: "bulwark-soldier",
				name: "Umbral Bulwark",
				description:
					"Heavy Carapace Armored legionnaire specialized in defense and crowd control.",
				rank: "A",
				role: "Tank",
			},
			{
				id: "assassin-soldier",
				name: "Umbral Assassin",
				description:
					"Stealthy legionnaire specialized in assassination and reconnaissance.",
				rank: "A",
				role: "Assassin",
			},
			{
				id: "mage-soldier",
				name: "Umbral Mage",
				description:
					"Magic-wielding legionnaire capable of casting umbral spells.",
				rank: "B",
				role: "Mage",
			},
			{
				id: "archer-soldier",
				name: "Umbral Archer",
				description:
					"Ranged legionnaire specialized in precise long-range attacks.",
				rank: "B",
				role: "Archer",
			},
			{
				id: "warrior-soldier",
				name: "Umbral Warrior",
				description:
					"Versatile melee legionnaire balanced in offense and defense.",
				rank: "C",
				role: "Destroyer",
			},
			{
				id: "scout-soldier",
				name: "Umbral Scout",
				description:
					"Fast and agile legionnaire specialized in reconnaissance and scouting.",
				rank: "C",
				role: "Scout",
			},
		];

		const filtered = filterBySearch(shadowSoldiers, search, [
			"name",
			"description",
			"role",
		]);
		return filtered.map((item) => ({
			id: item.id,
			name: item.name,
			display_name: item.name,
			description: item.description,
			created_at: "2024-01-01T00:00:00.000Z",
			tags: ["umbral-legion", "umbral", "minion"],
			source_book: "Rift Ascendant Canon",
			role: item.role,
			gate_rank: item.rank,
			rarity:
				item.rank === "A"
					? "very_rare"
					: item.rank === "B"
						? "rare"
						: "uncommon",
			level: undefined,
		}));
	},

	getSigils: async (search?: string) => {
		const { sigils } = await import("./sigils");
		const filtered = filterBySearch(sigils, search, ["name", "description"]);
		return filtered.map((sigil) => ({
			id: sigil.id,
			name: sigil.name,
			display_name: sigil.name,
			description: sigil.description,
			created_at: new Date().toISOString(),
			tags: sigil.tags || [],
			source_book: sigil.source_book || "Rift Ascendant Canon",
			rarity: sigil.rarity || "rare",
			passive_bonuses: sigil.passive_bonuses || null,
			can_inscribe_on: sigil.can_inscribe_on || null,
		}));
	},
	getTattoos: async (search?: string) => {
		const tattoos = await loadData<{
			id: string;
			name: string;
			description: string;
			rarity?: string;
			image?: string;
			source?: string;
			attunement?: boolean | null;
			body_part?: string | null;
		}>("tattoos");
		const filtered = filterBySearch(tattoos, search, ["name", "description"]);
		return filtered.map((tattoo) => ({
			id: tattoo.id,
			name: tattoo.name,
			display_name: tattoo.name,
			description: tattoo.description,
			created_at: new Date().toISOString(),
			tags: ["tattoo", tattoo.rarity].filter(Boolean) as string[],
			source_book: tattoo.source || "Rift Ascendant Canon",
			image_url: tattoo.image,
			rarity: tattoo.rarity || "uncommon",
			attunement: tattoo.attunement,
			body_part: tattoo.body_part,
		}));
	},
	getPantheon: async (search?: string) => {
		const deities = await loadData<CompendiumDeity>("pantheon");
		const filtered = filterBySearch<CompendiumDeity>(deities, search, [
			"name",
			"display_name",
			"description",
		]);
		return filtered.map((deity) => ({
			id: deity.id,
			name: deity.name,
			display_name: deity.display_name,
			description: deity.description || "",
			created_at: new Date().toISOString(),
			tags: ["deity", "pantheon", deity.rank].filter(Boolean) as string[],
			source_book: "Rift Ascendant Canon",
			image_url: deity.image_url || deity.image,
			rank: deity.rank,
			directive: deity.directive,
			portfolio: deity.portfolio || [],
			sigil: deity.sigil,
			manifestation: deity.manifestation,
			specializations: deity.specializations || [],
			lore: (deity.lore as string) || null,
			dogma: deity.dogma || [],
			worshippers: deity.worshippers,
			temples: deity.temples,
			home_realm: deity.home_realm,
			relationships: deity.relationships || [],
		}));
	},
};

declare global {
	interface Window {
		supabaseConfigured?: boolean;
	}
}

// Export a hook to check if we should use static data
export const useStaticDataFallback = () => {
	// Use static data when Supabase is not configured or fails
	return !window.supabaseConfigured;
};
