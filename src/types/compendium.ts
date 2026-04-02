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
	tags?: string[] | null;
	system_interaction?: string;
	mechanics?: Record<string, unknown> | null;
}

export interface CompendiumMonster extends BaseCompendiumItem {
	type?: string;
	rank?: string;
	stats: {
		ability_scores: {
			strength: number;
			dexterity: number;
			constitution: number;
			intelligence: number;
			wisdom: number;
			charisma: number;
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
	ability_scores?: {
		strength: number;
		dexterity: number;
		constitution: number;
		intelligence: number;
		wisdom: number;
		charisma: number;
	};
}

export interface CompendiumSpell extends BaseCompendiumItem {
	level?: number;
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
	source_book?: string;
}

export interface CompendiumTechnique extends BaseCompendiumItem {
	type?: string;
	style?: string;
	level_requirement?: number;
	activation?: {
		type?: string;
		cost?: string;
	};
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
	rarity: "common" | "uncommon" | "rare" | "very_rare" | "legendary" | string;
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
	source_book?: string | null;
}

export interface CompendiumRelic extends BaseCompendiumItem {
	type?: string;
	rarity?: string;
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
	prerequisites?: Record<string, unknown> | null;
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
	rarity?: "common" | "uncommon" | "rare" | "very_rare" | "legendary" | string;
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
	rarity?: string;
	attunement?: boolean | null;
	properties?: Record<string, unknown> | null;
	effects?: Record<string, unknown> | null;
	limitations?: Record<string, unknown> | null;
	stats?: Record<string, unknown> | null;
	source_book?: string;
}

export interface CompendiumBackground extends BaseCompendiumItem {
	skills?: string[];
	rank?: string;
	skill_proficiencies: string[];
	tool_proficiencies: string[];
	languages: string[];
	equipment: string[];
	features: Array<{
		name: string;
		description: string;
	}>;
	limitations?: Record<string, unknown> | null;
	type: string;
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
	skillChoices?: string[];
	flavor?: string | Record<string, unknown> | null;
	lore?: string | Record<string, unknown> | null;
	system_interaction?: string;
	type: string;
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
		dc?: number;
	}>;
	classFeatures?: Array<{ level: number; name: string; description: string }>;
	abilities?: string[];
	stats?: {
		strength: number;
		dexterity: number;
		constitution: number;
		intelligence: number;
		wisdom: number;
		charisma: number;
	};
}

export interface CompendiumPath extends BaseCompendiumItem {
	job_id?: string;
}

export interface CompendiumRegent extends BaseCompendiumItem {
	title?: string;
	regent_requirements?: {
		level?: number;
		quest_completion?: string;
	};
	class_features?: Array<{
		name: string;
		description: string;
	}>;
	features?: Array<{
		name: string;
		description: string;
	}>;
	description?: string;
}

export interface CompendiumLocation extends BaseCompendiumItem {
	type?: string;
	encounters: string[];
	treasures: string[];
	rank: string;
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
