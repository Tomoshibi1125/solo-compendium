import type { Json } from "@/integrations/supabase/types";

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
	prerequisites?: string | Record<string, Json> | null;
	requirements?: Record<string, Json> | null;
	fusion_theme?: string | null;
	equipment_type?: string | null;
	ability?: string | null;
	properties?: string[] | Record<string, Json> | null;
	simple_properties?: string[] | null;
	weight?: number | null;
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
	class_requirement?: string | null;
	spell_type?: string | null;
	location_type?: string | null;
	rank?: string | null;
	damage?: string | number | null;
	healing?: number | null;
	effect?: string | null;
	duration?: string | null;
	range?: string | null;
	str?: number | null;
	agi?: number | null;
	vit?: number | null;
	int?: number | null;
	sense?: number | null;
	pre?: number | null;
	saving_throws?: Record<string, number> | null;
	skills?: Record<string, number> | Record<string, Json> | null;
	damage_vulnerabilities?: string[] | null;
	damage_resistances?: string[] | null;
	damage_immunities?: string[] | null;
	condition_immunities?: string[] | null;
	senses?: string[] | Record<string, string> | null;
	languages?: string[] | null;
	xp?: number | null;
	Anomaly_actions?: Record<string, Json>[] | null;
	Anomaly_traits?: Record<string, Json>[] | null;
	attack?: Record<string, Json> | null;
	movement?: Record<string, Json> | null;
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
	// Racial-parity fields (Jobs-as-race+class — surface Awakening lineage on Job detail view).
	racial_traits?: Array<{
		name: string;
		description: string;
		type?: string;
	}> | null;
	natural_weapons?: Array<{
		name: string;
		damage: string;
		damage_type: string;
		description?: string;
	}> | null;
	natural_armor?: {
		baseAC: number;
		addDex: boolean;
		abilityMod?: string;
		description?: string;
	} | null;
	resonance_breath?: {
		name: string;
		shape: string;
		size: number;
		damage_die: string;
		damage_type: string;
		save: string;
		rechargeRest: string;
		scaling?: Array<{ level: number; dice: string }>;
	} | null;
	innate_channeling?: {
		ability: string;
		spells: Array<{
			name: string;
			level: number;
			unlockLevel: number;
			uses?: { value: number; per: "short-rest" | "long-rest" } | "at-will";
			description?: string;
		}>;
	} | null;
	bonus_hp_per_level?: number | null;
	climb_speed?: number | null;
	swim_speed?: number | null;
	fly_speed?: number | null;
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
	regent_abilities?: Array<Record<string, Json>> | null;
	regent_features?: Array<Record<string, Json>> | null;
	regent_mechanics?: Record<string, Json> | null;
	regent_requirements?: Record<string, Json> | null;
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
	requires_job?: Record<string, Json> | null;
	caster_penalty?: string | null;
	martial_penalty?: string | null;
	at_higher_levels?: string | null;
	classes?: string[] | null;
	spell_attack?: Record<string, Json> | null;
	area?: Record<string, Json> | null;
	hit_dice?: string | null;
	progression_table?: Record<string, Json> | null;
	dangers?: string[] | null;
	suggested_characteristics?: Record<string, Json> | null;
	actions?: Record<string, Json>[] | null;
	traits?: Record<string, Json>[] | null;
	reactions?: Record<string, Json>[] | null;
	legendary_actions?: Record<string, Json>[] | null;
	saving_throw?: Record<string, Json> | null;
	saving_throw_ability?: string | null;
	has_attack_roll?: boolean | null;
	area_of_effect?: Record<string, Json> | null;
	role?: string | null;
	mechanics?: Record<string, Json> | null;
	limitations?: Record<string, Json> | null;
	lore?: string | Record<string, Json> | null;
	body_part?: string | null;
	attunement?: boolean | null;
	effects?: Record<string, Json> | null;
	// Narrative fields preserved by enriched provider transforms (sigils, tattoos,
	// relics, castables). They flow through to detail views and the audit.
	flavor?: string | null;
	discovery_lore?: string | null;
	theme_tags?: string[] | null;
	// Regent/generic title alias
	title?: string | null;
	// Shadow soldier runtime fields
	shadow_type?: string | null;
	summon_requirements?: string | null;
	hit_points?: number | null;
	// Sigil/rune runtime fields
	effect_description?: string | null;
	active_feature?: Record<string, Json> | null;
	passive_bonuses?: Record<string, Json> | null;
	can_inscribe_on?: string[] | null;
	inscription_difficulty?: number | null;
	// Supabase-shape aliases for techniques
	level_requirement?: number | null;
	table_category?: string | null;
	table_group?: string | null;
	rollable_entries?: string[] | null;
	// Equipment structured fields preserved through canonical hydration so
	// downstream AC / combat-action computation can consume them directly
	// instead of regex-parsing description text.
	armor_class?: string | number | null;
	armor_type?: string | null;
	damage_type?: string | null;
	weapon_type?: string | null;
	stealth_disadvantage?: boolean | null;
	strength_requirement?: number | null;
	charges?: number | Record<string, Json> | null;
	cursed?: boolean | null;
	stats?: Record<string, Json> | null;
	value?: number | null;
	cost_credits?: number | null;
	source?: string | null;
	image?: string | null;
	item_properties?: Record<string, Json> | null;
}

export interface StaticDataProvider {
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
	getRollableTables: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getPantheon: (search?: string) => Promise<StaticCompendiumEntry[]>;
	getShadowSoldiers: (search?: string) => Promise<StaticCompendiumEntry[]>;
}
