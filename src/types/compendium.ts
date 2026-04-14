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
}

export interface CompendiumSpell extends BaseCompendiumItem {
	level?: number | null;
	school?: string | null;
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
	level_requirement?: number;
	activation?: { type?: string; cost?: string | number } | string;
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
	skill_choices: string[];
	type: string;
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
}

export interface CompendiumPath extends BaseCompendiumItem {
	level: number;
	job_id: string;
	features: Array<{
		level: number;
		name: string;
		description: string;
	}>;
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

export type CompendiumEntity =
	| CompendiumJob
	| CompendiumPath
	| CompendiumRune
	| CompendiumRelic
	| CompendiumAnomaly
	| CompendiumBackground
	| CompendiumCondition
	| CompendiumRegent
	| CompendiumFeat
	| CompendiumSkill
	| CompendiumItem
	| CompendiumSovereign
	| CompendiumSpell
	| CompendiumTechnique
	| CompendiumLocation
	| CompendiumTattoo
	| CompendiumDeity
	| CompendiumSigil
	| CompendiumShadowSoldier;
