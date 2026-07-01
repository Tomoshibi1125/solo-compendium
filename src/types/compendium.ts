import type { Json } from "@/integrations/supabase/types";

interface CompendiumValue {
	type?: string;
	value?: number | string;
	unit?: string;
	distance?: string | number;
	cost?: number | string;
}

export type CompendiumRange = CompendiumValue | string;
export type CompendiumDuration = CompendiumValue | string;
export type CompendiumActivation = CompendiumValue | string;

export interface CompendiumComponents {
	verbal?: boolean;
	somatic?: boolean;
	material?: string | boolean;
	focus?: string | boolean;
}

export interface CompendiumMechanics {
	action_type?: string;
	duration?: string | CompendiumDuration;
	save_dc?: number;
	damage_profile?: string;
	range?: string | CompendiumRange;
	lattice_interaction?: string;
	type?: string;
	frequency?: string;
	action?: string;
	ability?: string;
	save?: string;
	dc?: number | string;
	attack?: {
		type?: string;
		mode?: string;
		resolution?: string;
		modifier?: string;
		damage?: string | { dice?: string; type?: string } | Record<string, string>;
		damage_type?: string;
	};
	saving_throw?: {
		ability?: string;
		dc?: string | number;
		success?: string;
		failure?: string;
	};
	movement?: { type?: string; distance?: string | number } | string;
	condition?: string[] | string;
	stat_bonuses?: Record<string, number>;
	special_abilities?: string[] | string;
	restrictions?: string[] | string;
	progression?: Record<string, string[]>;
	ac_formula?: string;
	replaces_armor?: boolean;
	detection_target?: string;
	usage?: string;
	check?: string;
	scaling?: string;
	critical?: boolean;
	fumble?: boolean;
	bonus?: {
		type?:
			| "damage"
			| "attack"
			| "AC"
			| "saving-throws"
			| "ability-checks"
			| "skill-checks"
			| "none"
			| "";
		value?: number;
		ability?: string;
		skills?: string[];
	};
	immunity?: string[] | string;
	resistance?: string[] | string;
	vulnerability?: string[] | string;
	special?: string | string[];
	healing?: {
		dice?: string;
		type?: string;
		bonus?: number;
	};
}

export interface CompendiumLimitations {
	uses?: string;
	recharge?: string;
	requires_attunement?: boolean;
	conditions?: string[];
	charges?: number;
	uses_per_rest?: number | string;
	consumable?: boolean;
	prerequisites?: string[];
	cost?: string | number;
	exhaustion?: string;
}

export interface CompendiumEffects {
	primary?: string;
	secondary?: string;
	tertiary?: string;
	passive?: string[];
	active?: Array<{
		name?: string;
		description?: string;
		action?: string;
		frequency?: string;
	}>;
	primaryEffect?: string;
	secondaryEffect?: string;
	passiveBonuses?: Array<{ stat?: string; value?: number }>;
}

export interface CompendiumLore {
	origin: string;
	history: string;
	curse: string;
	personality: string;
	current_owner: string;
	prior_owners: string[];
}

export interface CompendiumProperties {
	[key: string]: string | number | boolean | string[] | undefined;
}

export interface ArtifactAbility {
	name: string;
	description?: string;
	type: string;
	frequency?: string;
	action?: string;
}

export interface BaseCompendiumItem {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	source_kind?: string | null;
	source_name?: string | null;
	theme_tags?: string[] | null;
	generated_reason?: string | null;
	discovery_lore?: string | null;
	concentration?: boolean | null;
	image?: string | null;
	image_url?: string | null;
	license_note?: string | null;
	flavor?: string | null;
	lore?: string | CompendiumLore | null;
	source?: string | null;
	source_book?: string | null;
	tags?: string[] | null;
	system_interaction?: string | null;
	mechanics?: CompendiumMechanics | Json | null;
	limitations?: CompendiumLimitations | Json | null;
	effects?: CompendiumEffects | string[] | Json | null;
	rarity?: null | string;
	cr?: null | string;
}

export interface JobFeature extends BaseCompendiumItem {
	level: number;
	job_id?: string | null;
	path_id?: string | null;
	is_path_feature: boolean;
	action_type?: string | null;
	uses_formula?: string | null;
	recharge?: string | null;
	prerequisites?: string | null;
	type?: string | null;
	frequency?: string | null;
}

export interface CompendiumDeity extends BaseCompendiumItem {
	rank?: string | null;
	directive?: string | null;
	portfolio?: string[] | null;
	sigil?: string | null;
	manifestation?: string | null;
	specializations?: string[] | null;
	dogma?: string[] | null;
	worshippers?: string | null;
	temples?: string | null;
	home_realm?: string | null;
	avatar_id?: string | null;
	relationships?: Array<{
		id: string;
		name: string;
		type?: "ally" | "enemy" | "rival" | "servant" | "superior";
		description?: string;
	}> | null;
}

export interface AnomalyTrait {
	id?: string;
	name: string;
	description: string;
}

export interface AnomalyAction {
	id?: string;
	name: string;
	description: string;
	action_type:
		| "action"
		| "bonus"
		| "reaction"
		| "legendary"
		| "mythic"
		| "lair";
	attack_bonus?: number;
	damage?: string;
	damage_type?: string;
	recharge?: string;
	legendary_cost?: number;
	save?: string;
	dc?: number;
	usage?: string;
}

export interface CompendiumAnomaly extends BaseCompendiumItem {
	type: string;
	rank: string;
	ac?: number;
	hp?: number;
	size?: string;
	alignment?: string;
	speed?: string | number;
	stats?: {
		ability_scores?: {
			strength?: number;
			agility?: number;
			vitality?: number;
			intelligence?: number;
			sense?: number;
			presence?: number;
		};
		challenge_rating?: number;
		proficiency_bonus?: number;
		saving_throws?: Record<string, number>;
	};
	damage_resistances?: string[];
	damage_immunities?: string[];
	damage_vulnerabilities?: string[];
	condition_immunities?: string[];
	senses?: string;
	languages?: string;
	traits?: AnomalyTrait[];
	actions?: AnomalyAction[];
	legendary_actions?: Array<{
		name?: string;
		description?: string;
		frequency?: string;
		dc?: number;
	}>;
	lair?: {
		type?: string;
		range?: number;
		passive?: boolean;
	};
	abilities?: string[];
	weaknesses?: string[];
	xp?: number;
	treasure?: {
		coin?: number;
		items?: string[];
	};
	environment?: string[];
	organization?: string;
	// Legacy fields frequently found in data
	armor_class?: number;
	hit_points?: number;
	challenge_rating?: string | number;
	/**
	 * Q4 of Round 3 — universal taming substrate. When set, this anomaly
	 * may be attempted as a tame target by any character. Path bonuses
	 * (Pack Leader, Summoner, Contractor, Esper, Synchronist, Hive) layer
	 * onto whoever ends up controlling it.
	 */
	tameable?: {
		dc: number;
		ability: "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE";
		min_party_rank?: "D" | "C" | "B" | "A" | "S";
		bond_initial?: number;
		taming_steps?: string[];
	};
}

// ──────────────────────────────────────────────────────────────────────
// Vehicles & Mounts (Q4 of Round 3 — unified compendium type).
// Mounts live in this same shape with `vehicle_type === "mount"` so the
// UI splits them visually while persistence + browsing stay identical.
// Bonded-anomaly mounts reference an existing CompendiumAnomaly via
// `anomaly_id`; stats hydrate at runtime — no stat duplication.
// ──────────────────────────────────────────────────────────────────────

export interface CompendiumVehicleSpeed {
	land?: number;
	air?: number;
	water?: number;
	rift?: number;
}

export interface CompendiumVehicleCrewSeat {
	id: string;
	name: string; // "Rider", "Pilot", "Gunner", "Helmsman", "Lookout", "Operator"
	required_proficiency?: string;
	grants_actions?: string[];
}

export interface CompendiumVehicleAbility {
	name: string;
	description: string;
	action_type: string;
}

export type VehicleConditionState =
	| "operational"
	| "strained"
	| "damaged"
	| "crippled"
	| "dead"
	| "calm"
	| "uneasy"
	| "panicked"
	| "injured"
	| "broken";

export type VehicleModCategory =
	| "mobility"
	| "stealth"
	| "afa"
	| "sensors"
	| "survival"
	| "utility"
	| "repair"
	| "tack"
	| "training";

export interface CompendiumVehicle extends BaseCompendiumItem {
	vehicle_type: "mount" | "land" | "air" | "water" | "rift";
	size: "tiny" | "small" | "medium" | "large" | "huge" | "gargantuan";
	speed: CompendiumVehicleSpeed;
	armor_class: number;
	hit_points: { max: number; damage_threshold?: number };
	vrp_cost?: number;
	mod_capacity?: number;
	allowed_mod_categories?: VehicleModCategory[];
	condition_track?: "vehicle" | "mount";
	requisition_notes?: string;
	/** For mounts — rider + cargo limit. */
	carry_capacity_lbs?: number;
	/** For vessels — cargo-hold capacity. */
	cargo_capacity_lbs?: number;
	crew_positions?: CompendiumVehicleCrewSeat[];
	abilities?: CompendiumVehicleAbility[];
	/** True for mounts that require a bonding ritual or tame check. */
	bonded?: boolean;
	/**
	 * When set, this mount is a thin overlay on an existing anomaly. The
	 * runtime hydration pulls speed / abilities / stats from the linked
	 * CompendiumAnomaly. Only meaningful when `vehicle_type === "mount"`.
	 */
	anomaly_id?: string;
	/** Resolved display name of the linked anomaly (provider-enriched). */
	bonded_from_name?: string | null;
	rank?: string;
	source_book?: string;
}

export interface CompendiumVehicleMod extends BaseCompendiumItem {
	mod_type: "vehicle" | "mount";
	category: VehicleModCategory;
	vrp_cost: number;
	capacity_cost: number;
	effect: string;
	requirements?: string[];
	source_book: string;
}

export interface CompendiumCraftingMaterial extends BaseCompendiumItem {
	material_type:
		| "rift_salvage"
		| "anomaly_material"
		| "relic_fragment"
		| "essence_component"
		| "field_part";
	rarity: string;
	unit: string;
	source_book: string;
}

export interface CompendiumRecipe extends BaseCompendiumItem {
	recipe_type:
		| "repair"
		| "refit"
		| "field_engineering"
		| "survival"
		| "consumable";
	rank: string;
	time_required: string;
	project_clock: number;
	materials: Array<{ material_id: string; quantity: number }>;
	required_tools?: string[];
	outcome: string;
	failure_risk?: string;
	source_book: string;
}

export interface CompendiumCraftingProject extends BaseCompendiumItem {
	recipe_id: string;
	progress_required: number;
	material_requirements: Array<{ material_id: string; quantity: number }>;
	source_book: string;
}

export interface CompendiumSpell extends BaseCompendiumItem {
	level?: number | null;
	school?: string | null;
	classes?: string[] | null;
	casting_time?: string | null;
	range?: CompendiumRange | null;
	components?: CompendiumComponents | null;
	duration?: CompendiumDuration | null;
	concentration?: boolean | null;
	ritual?: boolean | null;
	rank?: string | null;
	effect?: string | null;
	attack?: {
		type: string;
		ability: string;
		damage: string;
		damage_type?: string;
	} | null;
	activation?: CompendiumActivation | null;
	higher_levels?: string | null;
	saving_throw?: {
		ability: string;
		dc: number;
		success: string;
		failure: string;
	} | null;
	area?: { type: string; size: string; shape: string } | null;
	type?: string | null;
	atHigherLevels?: string | null;
}

export interface CompendiumPower extends BaseCompendiumItem {
	power_type: string;
	power_level: number;
	classes?: string[] | null;
	casting_time?: string;
	activation_time?: string;
	activation?: CompendiumActivation;
	range?: CompendiumRange;
	duration?: CompendiumDuration;
	concentration: boolean;
	ritual: boolean;
	school: string;
	target?: string;
	has_attack_roll?: boolean;
	has_save?: boolean;
	save_ability?: string;
	damage_roll?: string;
	damage_type?: string;
	higher_levels?: string;
	components?: CompendiumComponents;
}

export interface CompendiumTechnique extends BaseCompendiumItem {
	type: string;
	style: string;
	classes?: string[] | null;
	level_requirement?: number;
	uses_per_rest_formula?: string;
	activation?: { type?: string } | string;
	range?:
		| {
				type?: string;
				distance?: string | number;
				value?: number | string;
				unit?: string;
		  }
		| string;
	duration?:
		| { type?: string; time?: string; value?: number | string; unit?: string }
		| string;
	components?: {
		verbal?: boolean;
		somatic?: boolean;
		material?: string | boolean;
		focus?: string;
	};
	effects: CompendiumEffects | string[];
	mechanics: CompendiumMechanics;
	limitations: CompendiumLimitations;
	prerequisites?: {
		level?: number;
		class?: string;
		ability?: string;
		score?: number;
		proficiency?: string[];
		technique?: string[];
	};
	technique_type?: string;
}

export interface CompendiumRune extends BaseCompendiumItem {
	effect_description: string;
	aliases?: string[];
	teaches?: {
		kind: "spell" | "power" | "technique";
		ref: string;
	};
	rune_type: string;
	rune_category?: string;
	effect_type?: "active" | "passive" | "both";
	activation_action?: string;
	activation_cost?: string;
	activation_cost_amount?: number;
	duration?: string;
	range?: string;
	concentration?: boolean;
	uses_per_rest?: string;
	recharge?: string;
	higher_levels?: string;
	discovery_lore?: string;
	rune_level?: number;
	rank?: string;
	tags?: string[];
}

export interface CompendiumSigil extends BaseCompendiumItem {
	passive_bonuses: Record<string, number | string | string[] | boolean>;
	can_inscribe_on: string[];
	rarity: string;
	tags: string[];
	effect_description?: string;
	active_feature?: string;
	effect_type?: string;
	requires_level?: number;
	inscription_difficulty?: string | number;
	rune_type?: string;
	rune_level?: number;
	rune_category?: string;
}

export interface CompendiumRelic extends BaseCompendiumItem {
	type: string;
	tier: string;
	cost: number;
	attunement:
		| boolean
		| {
				required: boolean;
				requirements: string;
		  };
	mechanics: CompendiumMechanics;
	quirks: string[];
	corruption_risk: string;
	properties: string[];
	abilities: Array<{
		name: string;
		description: string;
		type?: string;
		frequency?: string;
		action?: string;
		dc?: number;
		charges?: number;
	}>;
	requirements?: {
		level?: number;
		class?: string;
		ability?: string;
		score?: number;
		job?: string;
		background?: string;
		alignment?: string;
	};
}

export interface CompendiumFeat extends BaseCompendiumItem {
	prerequisites?:
		| Record<string, string | number | string[] | boolean>
		| string
		| string[]
		| null;
	benefits?:
		| string[]
		| {
				basic: string[];
				expert?: string[];
				master?: string[];
		  }
		| null;
	repeatable?: boolean;
}

export interface CompendiumTattoo extends BaseCompendiumItem {
	attunement: boolean;
	body_part: string;
	ink_type: string;
	active_veins: string[];
	resonance_effect: string;
}

export interface CompendiumItem extends BaseCompendiumItem {
	type?: string | null;
	item_type?: string | null;
	attunement?: boolean | null;
	properties?: string[] | CompendiumProperties | null;
	simple_properties?: string[] | null;
	armor_class?: string | number | null;
	armor_type?: string | null;
	damage?: string | null;
	damage_type?: string | null;
	weapon_type?: string | null;
	range?: string | null;
	stealth_disadvantage?: boolean | null;
	strength_requirement?: number | null;
	weight?: string | number | null;
	cost?: number | null;
}

export interface CompendiumBackground extends BaseCompendiumItem {
	rank?: string;
	type?: string;
	skills?: string[];
	skill_proficiencies?: string[];
	tool_proficiencies?: string[];
	languages?: string[];
	equipment?: string[];
	features?: Array<{
		name: string;
		description: string;
	}>;
	language_count?: number;
	starting_credits?: number;
	starting_equipment?: string;
	personality_traits?: string[];
	personalityTraits?: string[];
	ideals?: string[];
	bonds?: string[];
	flaws?: string[];
	dangers?: string[];
	abilities?: string[];
	source?: string;
	suggested_characteristics?: Record<string, string[]>;
}

export interface CompendiumJob extends BaseCompendiumItem {
	primary_abilities: string[];
	rank: string | number;
	hit_dice: string;
	damage_resistances: string[];
	condition_immunities: string[];
	damage_immunities: string[];
	saving_throws: string[];
	tool_proficiencies: string[];
	armor_proficiencies: string[];
	weapon_proficiencies: string[];
	// DDB-style "choose one" weapon groups (canon-derived; rendered on JobDetail).
	weapon_choices?: string[][];
	skill_choices: string[];
	type: string;
	natural_weapons?: Array<{
		name: string;
		damage: string;
		damage_type: string;
		description?: string;
	}>;
	natural_armor?: {
		baseAC: number;
		addDex: boolean;
		abilityMod?: string;
		description?: string;
	};
	resonance_breath?: {
		name: string;
		shape: string;
		size: number;
		damage_die: string;
		damage_type: string;
		save: string;
		rechargeRest: string;
	};
	innate_channeling?: {
		ability: string;
		spells: Array<{
			name: string;
			level: number;
			unlockLevel: number;
			uses?: { value: number; per: "short-rest" | "long-rest" } | "at-will";
			description?: string;
		}>;
	};
	bonus_hp_per_level?: number;
	climb_speed?: number;
	swim_speed?: number;
	fly_speed?: number;
	racial_traits?: Array<{
		name: string;
		description: string;
		type: string;
		equivalent_to?: string;
		represents?: string;
	}>;
	awakening_features: Array<{
		name: string;
		description: string;
		level: number;
	}>;
	job_traits: Array<{
		name: string;
		description: string;
		type: string;
		frequency: string;
		dc: number;
	}>;
	class_features: Array<{ level: number; name: string; description: string }>;
	abilities: Array<{
		name: string;
		description: string;
		level: number;
		type: string;
		frequency: string;
	}>;
	stats: {
		strength: number;
		agility: number;
		vitality: number;
		intelligence: number;
		sense: number;
		presence: number;
	};
	ability_score_improvements:
		| number[]
		| {
				strength: number;
				agility: number;
				vitality: number;
				intelligence: number;
				sense: number;
				presence: number;
		  };
	hp_at_level_1: string;
	hp_at_higher_levels: string;
	spellcasting?: {
		ability: string;
		focus?: string;
		cantripsKnown?: number[];
		spellsKnown?: number[];
		spellSlots?: Record<string, number[]>;
	};
	starting_equipment?: string[][];
	regent_requirements?: {
		quest_completion: string;
		warden_approval: boolean;
	};
	darkvision?: number;
	specialSenses?: string[];
}

export interface CompendiumPath extends BaseCompendiumItem {
	level: number;
	job_id: string;
	job_name?: string;
	path_tier?: number;
	pathType?: string;
	features: Array<{
		level: number;
		name: string;
		description: string;
	}>;
	abilities?: Array<{
		name: string;
		description: string;
		recharge?: number;
		cost?: string;
	}>;
	stats?: {
		primaryAttribute: string;
		secondaryAttribute?: string;
		bonusStats: Record<string, number>;
	};
	prerequisites?: string;
}

export interface CompendiumRegent extends BaseCompendiumItem {
	title: string;
	rank: string;
	type: string;
	hit_dice: string;
	primary_ability: string[];
	saving_throws: string[];
	skill_proficiencies: string[];
	armor_proficiencies: string[];
	weapon_proficiencies: string[];
	tool_proficiencies: string[];
	regent_requirements: {
		level: number;
		abilities: Record<string, number>;
		quest_completion: string;
		warden_approval: boolean;
	};
	class_features: Array<{
		level: number;
		name: string;
		description: string;
		type: string;
		frequency: string;
	}>;
	features: Array<{
		name: string;
		description: string;
		power_level: number;
		type?: string;
		frequency?: string;
	}>;
	spellcasting: {
		ability: string;
		spell_slots: Record<string, number[]>;
		cantrips_known: number[];
		spells_known: number[];
		spell_preparation: boolean;
		additional_spells: string[];
	};
	progression_table: Record<
		string,
		{
			features_gained: string[];
			abilities_improved: string[];
		}
	>;
}

export interface CompendiumLocation extends BaseCompendiumItem {
	type: string;
	encounters: string[];
	treasures: string[];
	rank: string;
	geography?: string;
	hazards?: string[];
	notable_npcs?: string[];
}

export interface CompendiumCondition extends BaseCompendiumItem {
	type: string;
	effects: string[];
	condition_effects?: string[];
	condition_duration?: string;
	condition_removal?: string[];
	condition_save?: {
		type?: string;
		dc?: number;
		description?: string;
	};
	stages?: Array<{
		level: number;
		effect: string;
	}>;
	cure_lore?: string;
}

export interface CompendiumSkill extends BaseCompendiumItem {
	ability: string;
	type: string;
	benefits: {
		basic: string[];
		expert: string[];
		master: string[];
	};
}

export interface CompendiumSovereign extends BaseCompendiumItem {
	job_id: string;
	path_id: string;
	regent_a_id: string;
	regent_b_id: string;
	fusion_theme: string;
	fusion_description: string;
	prerequisites: string;
	is_template: boolean;
	is_ai_generated: boolean;
}

export interface CompendiumShadowSoldier extends BaseCompendiumItem {
	rank: string;
	role: string;
}

/** Per-level progression track for a recruitable NPC companion. */
export interface CompendiumNpcLeveling {
	xp: number;
	xpToNextLevel: number;
	autoLevel: boolean;
	maxLevel: number;
	hpPerLevel: number;
	/** Map of level → ability unlocked at that level. */
	levelAbilities: Record<number, string>;
}

/**
 * A named adventure NPC (sandbox roster). Recruitable companions and story
 * characters with a light stat block, recruitment rules, and a leveling track.
 */
export interface CompendiumNPC extends BaseCompendiumItem {
	title?: string | null;
	faction?: string | null;
	job?: string | null;
	level?: number | null;
	hp?: number | null;
	ac?: number | null;
	// Stat-block aliases surfaced by the static provider for detail views.
	hit_points?: number | null;
	hit_points_average?: number | null;
	armor_class?: number | string | null;
	key_abilities?: string[] | null;
	motivation?: string | null;
	personality?: string | null;
	backstory?: string | null;
	recruit_condition?: string | null;
	is_recruitable?: boolean | null;
	guild_affiliation?: string | null;
	npc_location?: string | null;
	quest_hook?: string | null;
	leveling?: CompendiumNpcLeveling | Json | null;
}
