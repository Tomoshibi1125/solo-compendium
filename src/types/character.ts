import type { Database } from "@/integrations/supabase/types";
import type { AbilityScore } from "@/types/core-rules";

export const EARTH_LANGUAGES = [
	"English",
	"Spanish",
	"Mandarin",
	"Japanese",
	"Accordan",
	"French",
	"German",
	"Russian",
	"Arabic",
	"Portuguese",
	"Hindi",
	"Bengali",
	"Punjabi",
	"Wu Chinese",
	"Javanese",
	"Telugu",
	"Turkish",
	"Marathi",
	"Vietnamese",
	"Tamil",
	"Italian",
	"Urdu",
	"Malay",
	"Persian",
	"Pashto",
	"Kannada",
	"Gujarati",
	"Hausa",
	"Oromo",
	"Burmese",
	"Thai",
	"Amharic",
	"Fuzhou",
	"Yoruba",
	"Maithili",
	"Uzbek",
	"Sindhi",
	"Latin Archival",
	"Ancient Greek",
	"Ancient Hebrew Strings",
	"Sumerian Protocols",
	"Binary Void-Data",
	"Quantum Resonance",
	"Shadow Cant",
	"Rift Speak",
	"Proto-Indo-European",
	"Old Norse",
	"Finnish",
	"Gaelic",
	"Dutch",
	"Swedish",
	"Norwegian",
	"Danish",
	"Icelandic",
];

export type Background =
	Database["public"]["Tables"]["compendium_backgrounds"]["Row"];

export type Job = Database["public"]["Tables"]["compendium_jobs"]["Row"] & {
	display_name?: string | null;
	saving_throw_proficiencies?: string[];
};

export type Path =
	Database["public"]["Tables"]["compendium_job_paths"]["Row"] & {
		display_name?: string | null;
	};

export type AbilityName =
	| "Strength"
	| "Agility"
	| "Vitality"
	| "Intelligence"
	| "Sense"
	| "Presence";

export type FeatureRestRecharge = "short-rest" | "long-rest";
export type FeatureTracking = "uses" | "resource" | "manual";

/**
 * Runtime progression metadata authored beside a Job's published mechanics.
 *
 * This is deliberately data, rather than a second collection of job-name
 * switches in calculators.  Creation, level-up, sheet displays, and action
 * resolution can all resolve the same Job record through this contract.
 */
export type JobCasterType = "none" | "full" | "half" | "pact" | "artificer";
export type JobAbilityAccessMode = "prepared" | "known" | "at-will";

export interface JobUnarmoredDefense {
	id: string;
	name: string;
	baseAC: number;
	abilities: AbilityScore[];
	requiresNoArmor: boolean;
	excludesShield?: boolean;
}

export interface CanonicalJobRules {
	casterType: JobCasterType;
	/** Levels where this Job earns an ASI or feat choice. */
	asiLevels: number[];
	spellAccess?: Extract<JobAbilityAccessMode, "prepared" | "known">;
	powerAccess?: JobAbilityAccessMode;
	techniqueAccess?: JobAbilityAccessMode;
	/** "*" permits every spell school; other values are normalized school ids. */
	spellSchools?: string[];
	unarmoredDefense?: JobUnarmoredDefense;
}

export interface FeatureUseDefinition {
	formula: string;
	recharge: FeatureRestRecharge;
	/** Canonical cadence changes that take effect at the listed job level. */
	rechargeChanges?: Array<{
		level: number;
		recharge: FeatureRestRecharge;
	}>;
	/** Level at which the feature becomes at-will and no longer tracks charges. */
	unlimitedAtLevel?: number;
}

export interface StaticJob {
	id: string;
	name: string;
	type: string;
	rank: string;
	description: string;
	hitDie: string;
	hit_dice?: string;
	primaryAbility?: AbilityScore | AbilityName | string;
	primary_abilities?: (AbilityScore | AbilityName | string)[];
	savingThrows?: (AbilityScore | AbilityName | string)[];
	saving_throw_proficiencies?: (AbilityScore | AbilityName | string)[];
	saving_throws?: string[];
	armorProficiencies?: string[];
	armor_proficiencies?: string[];
	weaponProficiencies?: string[];
	weapon_proficiencies?: string[];
	weaponChoices?: string[][];
	toolProficiencies?: string[];
	tool_proficiencies?: string[];
	skillChoices?: string[];
	source?: string;
	classFeatures?: Array<{
		level: number;
		name: string;
		description: string;
		type?: string;
		actionType?: string;
		/**
		 * Structured limited-use resource. When present, creation/level-up seeds
		 * uses_max/uses_current/recharge + a uses_formula modifier so the feature
		 * shows in the Resources tab and rescales on level-up.
		 */
		uses?: FeatureUseDefinition;
		resource?: string;
		tracking?: FeatureTracking;
	}>;
	spellcasting?: {
		ability: string;
		focus?: string;
		cantripsKnown?: number[];
		spellsKnown?: number[];
		spellSlots?: Record<string, number[]>;
	};
	canonicalRules?: CanonicalJobRules;
	spellbook?: {
		atCreation: number;
		perLevel: number;
		label: string;
		/** Level the spellbook feature is gained (default 1; e.g. Revenant = 2). */
		startLevel?: number;
	};
	powersKnown?: number[];
	techniquesKnown?: number[];
	levelChoices?: Array<{
		level: number;
		type: string;
		count: number;
		source: string;
		options?: string[];
		filter?: { maxPowerLevel?: number; maxLevel?: number; restrictTo?: string };
	}>;
	startingEquipment?: string[][];
	hitPointsAtFirstLevel?: string;
	hitPointsAtHigherLevels?: string;
	image?: string;
	languages?: string[];
	speed?: number;
	darkvision?: number;
	specialSenses?: string[];
	abilityScoreImprovements?:
		| number[]
		| {
				strength?: number;
				agility?: number;
				vitality?: number;
				intelligence?: number;
				sense?: number;
				presence?: number;
		  };
	size?: "tiny" | "small" | "medium" | "large" | "huge" | "gargantuan";
	stats?: {
		strength: number;
		agility: number;
		vitality: number;
		intelligence: number;
		sense: number;
		presence: number;
	};
	abilities?: string[];
	subclassLevel?: number;
	awakeningFeatures?: Array<{
		level: number;
		name: string;
		description: string;
		actionType?: string;
		uses?: FeatureUseDefinition;
		resource?: string;
		tracking?: FeatureTracking;
	}>;
	racialTraits?: Array<{
		name: string;
		description: string;
		type?:
			| "lineage"
			| "physiology"
			| "sense"
			| "social"
			| "innate-magic"
			| string;
		uses?: FeatureUseDefinition;
	}>;
	jobTraits?: Array<{
		name: string;
		description: string;
		type?: "passive" | "active" | "resistance" | "immunity" | "bonus" | string;
		frequency?:
			| "at-will"
			| "short-rest"
			| "long-rest"
			| "once-per-day"
			| string;
		dc?: number;
		uses?: FeatureUseDefinition;
	}>;
	damageResistances?: string[];
	damage_resistances?: string[];
	damageImmunities?: string[];
	damage_immunities?: string[];
	conditionImmunities?: string[];
	condition_immunities?: string[];
	// --- Racial parity extensions (RA-original) ---
	innateChanneling?: {
		ability:
			| "Strength"
			| "Agility"
			| "Vitality"
			| "Intelligence"
			| "Sense"
			| "Presence";
		spells: Array<{
			name: string;
			level: number;
			unlockLevel: number;
			uses?: { value: number; per: "short-rest" | "long-rest" } | "at-will";
			description?: string;
		}>;
	};
	naturalWeapons?: Array<{
		name: string;
		damage: string;
		damage_type: string;
		description?: string;
	}>;
	naturalArmor?: {
		baseAC: number;
		addDex: boolean;
		abilityMod?: "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE";
		description?: string;
	};
	resonanceBreath?: {
		name: string;
		shape: "cone" | "line" | "sphere" | "cube";
		size: number;
		damage_die: string;
		damage_type: string;
		save: "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE";
		scaling?: Array<{ level: number; dice: string }>;
		rechargeRest: "short-rest" | "long-rest";
	};
	bonusHpPerLevel?: number;
	climb_speed?: number;
	swim_speed?: number;
	fly_speed?: number;
	age?: { adult: string; maxLifespan: string };
}

export interface StaticBackground {
	id: string;
	name: string;
	type: string;
	rank: string;
	description: string;
	display_name?: string | null;
	skill_proficiencies: string[];
	toolProficiencies?: string[];
	tool_proficiencies?: string[];
	weaponProficiencies?: string[];
	weapon_proficiencies?: string[];
	armorProficiencies?: string[];
	armor_proficiencies?: string[];
	languages?: string[];
	equipment: string[];
	features: Array<{
		name: string;
		description: string;
	}>;
	feature_name?: string;
	feature_description?: string;
	starting_equipment?: string[];
	source?: string;
	personality_traits?: string[];
	ideals?: string[];
	bonds?: string[];
	flaws?: string[];
	starting_credits?: number;
	language_count?: number;
}

export interface DetailData {
	title: string;
	description: string;
	payload?: unknown;
}
