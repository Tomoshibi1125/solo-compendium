import type { Database } from "@/integrations/supabase/types";
import type { AbilityScore } from "@/types/system-rules";

export const EARTH_LANGUAGES = [
	"English",
	"Spanish",
	"Mandarin",
	"Japanese",
	"Korean",
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
	"Gate Speak",
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

// Character type definitions
export interface Character {
	id: string;
	name: string;
	class: string;
	job?: string;
	path?: string;
	level: number;
	experience: number;
	abilities?: {
		STR: number;
		AGI: number;
		VIT: number;
		INT: number;
		SENSE: number;
		PRE: number;
	};
	abilityScores: {
		strength: number;
		agility: number;
		vitality: number;
		intelligence: number;
		sense: number;
		presence: number;
	};
	hitPoints: number;
	armorClass: number;
	skills: string[];
	equipment: string[];
	createdAt: string;
	updatedAt: string;
}

export interface CharacterStats {
	strength: number;
	agility: number;
	vitality: number;
	intelligence: number;
	sense: number;
	presence: number;
}

export interface CharacterCreateRequest {
	name: string;
	class: string;
	level: number;
	abilityScores: CharacterStats;
}

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
	toolProficiencies?: string[];
	tool_proficiencies?: string[];
	skillChoices?: string[];
	source?: string;
	classFeatures?: Array<{
		level: number;
		name: string;
		description: string;
		type?: string;
	}>;
	spellcasting?: {
		ability: string;
		focus?: string;
		cantripsKnown?: number[];
		spellsKnown?: number[];
		spellSlots?: Record<string, number[]>;
	};
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
	}>;
	damageResistances?: string[];
	damage_resistances?: string[];
	damageImmunities?: string[];
	damage_immunities?: string[];
	conditionImmunities?: string[];
	condition_immunities?: string[];
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
