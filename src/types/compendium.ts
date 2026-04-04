export interface BaseCompendiumItem {
	id: string;
	name: string;
	display_name?: string | null;
	description?: string;
	image?: string;
	image_url?: string | null;
	flavor?: string | Record<string, unknown> | null;
	lore?: string | Record<string, unknown> | null;
	source?: string | null;
	source_book?: string | null;
	tags?: string[] | null;
	system_interaction?: string;
	mechanics?: Record<string, unknown> | null;
	rarity?: string | null;
	level?: number | null;
	cr?: string | null;
	gate_rank?: string | null;
}

export interface CompendiumDeity extends BaseCompendiumItem {
	rank: string; // e.g., "Grand Deity", "Lesser Deity", "Quasi-Deity"
	directive: string; // Alignment equivalent
	portfolio: string[];
	sigil: string;
	manifestation: string; // Favored weapon
	specializations: string[]; // Domains
	dogma: string[]; // Core tenets
	worshippers: string; // Who follows them
	temples: string; // Places of worship
	home_realm: string; // Home plane equivalent
	avatar_id?: string; // Reference to a Anomaly stat block
	relationships?: Array<{
		id: string;
		name: string;
		type: "ally" | "enemy" | "rival" | "servant" | "superior";
		description: string;
	}>;
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
	| CompendiumDeity;

export interface CompendiumAnomaly extends BaseCompendiumItem {
	type?: string;
	rank?: string;
	stats: {
		ability_scores: {
			strength: number;
			agility: number;
			vitality: number;
			intelligence: number;
			sense: number;
			presence: number;
		};
		challenge_rating?: number;
		proficiency_bonus?: number;
		saving_throws?: Record<string, number>;
	};
	ability_scores?: {
		strength: number;
		agility: number;
		vitality: number;
		intelligence: number;
		sense: number;
		presence: number;
	};
	damage_resistances?: string[];
	damage_immunities?: string[];
	damage_vulnerabilities?: string[];
	condition_immunities?: string[];
	senses?: string;
	languages?: string;
	traits?: Array<{
		name: string;
		description: string;
		action?: string;
		frequency?: string;
	}>;
	actions?: Array<{
		name: string;
		description: string;
		type?: string;
		attack_bonus?: number;
		damage?: string;
		damage_type?: string;
		range?: number | string;
		hit?: string;
		recharge?: string;
		save?: string;
		dc?: number;
		usage?: string;
	}>;
	legendary_actions?: Array<{
		name: string;
		description: string;
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
	alignment?: string;
	hp?: number;
	ac?: number;
	armor_class?: number;
	hit_points?: number;
	speed?: string;
	size?: string;
	challenge_rating?: string;
}

export interface CompendiumSpell extends BaseCompendiumItem {
	school?: string;
	castingTime?: string;
	range?:
		| {
				type: string;
				value?: number;
				unit?: string;
		  }
		| string;
	components?:
		| {
				verbal?: boolean;
				somatic?: boolean;
				material?: string | boolean;
				focus?: string;
		  }
		| Record<string, unknown>;
	duration?:
		| {
				type: string;
				value?: number;
				unit?: string;
		  }
		| string;
	concentration?: boolean;
	ritual?: boolean;
	rank?: string;
	effect?: string;
	atHigherLevels?: string;
	classes?: string[];
	spellAttack?:
		| {
				type?: string;
				ability?: string;
				damage?: string;
		  }
		| Record<string, unknown>;
	activation?:
		| {
				type?: string;
				cost?: number;
		  }
		| Record<string, unknown>;
	effects?:
		| {
				primary?: string;
				[key: string]: unknown;
		  }
		| Record<string, unknown>;
	limitations?:
		| {
				mana_cost?: number;
				[key: string]: unknown;
		  }
		| Record<string, unknown>;
	higher_levels?: string;
	savingThrow?:
		| {
				ability?: string;
				dc?: string;
				success?: string;
				failure?: string;
		  }
		| Record<string, unknown>;
	area?:
		| {
				type?: string;
				size?: string;
				shape?: string;
		  }
		| Record<string, unknown>;
	type?: string;
}

export interface CompendiumPower extends BaseCompendiumItem {
	power_type?: string;
	power_level?: number;
	casting_time?: string;
	activation_time?: string;
	range?: string;
	duration?: string;
	concentration?: boolean;
	ritual?: boolean;
	school?: string;
	target?: string;
	has_attack_roll?: boolean;
	has_save?: boolean;
	save_ability?: string;
	damage_roll?: string;
	damage_type?: string;
	effects?: Record<string, unknown>;
	limitations?: Record<string, unknown>;
	higher_levels?: string;
}

export interface CompendiumTechnique extends BaseCompendiumItem {
	type?: string;
	style?: string;
	level_requirement?: number;
	activation?:
		| {
				type?: string;
				cost?: string;
		  }
		| string;
	range?:
		| {
				type?: string;
				distance?: string | number;
		  }
		| string;
	duration?:
		| {
				type?: string;
				time?: string;
				value?: number;
				unit?: string;
		  }
		| string;
	primary_effect?: string;
	secondary_effect?: string;
	effects?: Record<string, unknown>;
	limitations?: Record<string, unknown>;
	activation_type?: string;
	range_desc?: string;
}

export interface CompendiumRune extends BaseCompendiumItem {
	effect_description: string;
	rune_type:
		| "martial"
		| "caster"
		| "hybrid"
		| "utility"
		| "offensive"
		| "defensive"
		| string;
	rune_category: string;
	rune_level: number;
	effect_type: "active" | "passive" | "both" | string;
	activation_action?: string | null;
	activation_cost?: string | null;
	activation_cost_amount?: number | null;
	duration?: string | null;
	range?: string | null;
	concentration?: boolean | null;
	uses_per_rest?: string | null;
	recharge?: string | null;
	higher_levels?: string | null;
	requires_level?: number | null;
	requires_job?: string[] | null;
	caster_penalty?: string | null;
	martial_penalty?: string | null;
	passive_bonuses?: Record<string, unknown> | null;
	can_inscribe_on?: string[] | null;
	inscription_difficulty?: number | null;
	discovery_lore?: string | null;
}

export interface CompendiumRelic extends BaseCompendiumItem {
	type?: string;
	attunement?: boolean;
	properties?: string[] | Record<string, boolean | undefined>;
	effects?: Record<string, unknown>;
	limitations?: Record<string, unknown>;
	stats?: Record<string, number>;
	generated_reason?: string;
	theme_tags?: string[];
	abilities?: Array<{
		name: string;
		description: string;
	}>;
	legendary_actions?: Array<{
		name: string;
		description: string;
		frequency?: string;
		dc?: number;
	}>;
}

export interface CompendiumFeat extends BaseCompendiumItem {
	prerequisites?:
		| Record<string, string | number | string[] | undefined>
		| string
		| null;
	benefits:
		| string[]
		| {
				basic?: string[];
				expert?: string[];
				master?: string[];
				[key: string]: string[] | undefined;
		  };
}

export interface CompendiumTattoo extends BaseCompendiumItem {
	attunement?: boolean;
	body_part?: string;
	effects?: {
		primary?: string;
		secondary?: string;
		[key: string]: unknown;
	};
	limitations?: Record<string, unknown>;
}

export interface CompendiumItem extends BaseCompendiumItem {
	type?: string;
	item_type?: string;
	attunement?: boolean | null;
	properties?: string[] | Record<string, unknown> | null;
	simple_properties?: string[];
	effects?: Record<string, unknown> | null;
	limitations?: Record<string, unknown> | null;
	stats?: Record<string, unknown> | null;
	armor_class?: string | number;
	armor_type?: string;
	damage?: string;
	damage_type?: string;
	weapon_type?: string;
	range?: string;
	stealth_disadvantage?: boolean;
	strength_requirement?: number;
	weight?: string | number;
}

export interface CompendiumBackground extends BaseCompendiumItem {
	skills?: string[];
	skill_proficiencies?: string[];
	tool_proficiencies?: string[];
	languages?: string[];
	equipment?: string[];
	features?: Array<{
		name: string;
		description: string;
	}>;
	limitations?: Record<string, unknown> | null;
	type?: string;
}

export interface CompendiumJob extends BaseCompendiumItem {
	primary_abilities?: string[];
	primaryAbility?: string | string[];
	rank?: string | number;
	hit_dice?: string;
	hitDie?: string;
	damage_resistances?: string[];
	damageResistances?: string[];
	condition_immunities?: string[];
	conditionImmunities?: string[];
	damage_immunities?: string[];
	damageImmunities?: string[];
	saving_throws?: string[];
	savingThrows?: string[];
	tool_proficiencies?: string[];
	toolProficiencies?: string[];
	armorProficiencies?: string[];
	weaponProficiencies?: string[];
	armor_proficiencies?: string[];
	weapon_proficiencies?: string[];
	skillChoices?: string[];
	system_interaction?: string;
	type?: string;
	awakeningFeatures?: Array<{
		name: string;
		description: string;
		level: number;
	}>;
	jobTraits?: Array<{
		name: string;
		description: string;
		type?: string;
		frequency?: string;
		dc?: number;
	}>;
	classFeatures?: Array<{ level: number; name: string; description: string }>;
	abilities?: Array<{
		name: string;
		description: string;
		level?: number;
		type?: string;
		frequency?: string;
	}>;
	stats?: {
		strength: number;
		agility: number;
		vitality: number;
		intelligence: number;
		sense: number;
		presence: number;
	};
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
}

export interface CompendiumPath extends BaseCompendiumItem {
	job_id?: string;
	features?: Array<{
		level: number;
		name: string;
		description: string;
		[key: string]: unknown;
	}>;
	type?: string;
}

export interface CompendiumRegent extends BaseCompendiumItem {
	title?: string;
	rank?: string;
	type?: string;
	hit_dice?: string;
	primary_ability?: string[];
	saving_throws?: string[];
	skill_proficiencies?: string[];
	armor_proficiencies?: string[];
	weapon_proficiencies?: string[];
	tool_proficiencies?: string[];
	regent_requirements?: {
		level?: number;
		abilities?: Record<string, number>;
		quest_completion?: string;
		warden_approval?: boolean;
	};
	requirements?: {
		quest_completion: string;
		warden_verification: boolean;
		level?: number;
	};
	class_features?: Array<{
		level: number;
		name: string;
		description: string;
		type?: string;
		frequency?: string;
	}>;
	features?: Array<{
		name: string;
		description: string;
		power_level?: number;
	}>;
	spellcasting?: {
		ability: string;
		spell_slots: Record<string, number[]>;
		cantrips_known?: number[];
		spells_known?: number[];
		spell_preparation?: boolean;
		additional_spells?: string[];
	};
	progression_table?: Record<
		string,
		{
			features_gained: string[];
			abilities_improved: string[];
		}
	>;
	mechanics?: {
		stat_bonuses?: Record<string, number>;
		special_abilities?: string[];
		restrictions?: string[];
		[key: string]: unknown;
	};
}

export interface CompendiumLocation extends BaseCompendiumItem {
	type?: string;
	encounters?: string[];
	treasures?: string[];
	rank?: string;
}

export interface CompendiumCondition extends BaseCompendiumItem {
	type?: string;
	effects?: string[];
}

export interface CompendiumSkill extends BaseCompendiumItem {
	ability?: string;
	type?: string;
	benefits?: {
		basic?: string[];
		expert?: string[];
		master?: string[];
	};
}

export interface CompendiumSovereign extends BaseCompendiumItem {
	job_id?: string;
	path_id?: string;
	regent_a_id?: string;
	regent_b_id?: string;
	fusion_theme?: string;
	fusion_description?: string;
	prerequisites?: string;
	is_template?: boolean;
	is_ai_generated?: boolean;
}
