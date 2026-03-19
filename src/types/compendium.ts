export interface CompendiumMonster {
	id: string;
	name: string;
	type?: string;
	rank?: string;
	stats?: {
		abilityScores?: {
			strength?: number;
			dexterity?: number;
			constitution?: number;
			intelligence?: number;
			wisdom?: number;
			charisma?: number;
		};
		armorClass?: number;
		hitPoints?: number;
		speed?: number;
		challengeRating?: number;
		proficiencyBonus?: number;
		savingThrows?: Record<string, number>;
	};
	skills?: string[];
	damageResistances?: string[];
	damageImmunities?: string[];
	damageVulnerabilities?: string[];
	conditionImmunities?: string[];
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
		attackBonus?: number;
		damage?: string;
		damageType?: string;
		range?: number | string;
		hit?: string;
		recharge?: string;
		save?: string;
		dc?: number;
		usage?: string;
	}>;
	legendary?: Array<{
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
	image?: string;
	description?: string;
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
	source?: string;
	// Backward compatibility/flexible fields
	hp?: number;
	ac?: number;
}

export interface CompendiumSpell {
	id: string;
	name: string;
	description: string;
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
	type?: string;
	rank?: string;
	image?: string;
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
		  }
		| Record<string, unknown>;
	mechanics?:
		| {
				attack?: {
					mode?: string;
					resolution?: string;
					damage?: {
						dice?: string;
						type?: string;
					};
				};
				saving_throw?: {
					ability?: string;
					dc?: number;
					on_save?: string;
				};
				healing?: {
					dice?: string;
					notes?: string;
				};
		  }
		| Record<string, unknown>;
	limitations?:
		| {
				mana_cost?: number;
		  }
		| Record<string, unknown>;
	flavor?: string;
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
}

export interface CompendiumPower {
	id: string;
	name: string;
	description: string;
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
	mechanics?: Record<string, unknown>;
	higher_levels?: string;
	source_book?: string;
	tags?: string[];
}

export interface CompendiumTechnique {
	id: string;
	name: string;
	description: string;
	technique_type?: string;
	style?: string;
	level_requirement?: number;
	activation_type?: string;
	activation_cost?: string;
	range_desc?: string;
	duration?: string;
	primary_effect?: string;
	secondary_effect?: string;
	mechanics?: Record<string, unknown>;
	source?: string;
	image?: string;
}

export interface CompendiumRune {
	id: string;
	name: string;
	description: string;
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
	lore?: string | null;
	discovery_lore?: string | null;
	tags?: string[] | null;
	source_book?: string | null;
	image?: string | null;
}

export interface CompendiumRelic {
	id: string;
	name: string;
	description: string;
	type?: string;
	rarity?: string;
	attunement?: boolean;
	properties?: string[];
	stats?: Record<string, number>;
	image?: string;
	source_book?: string;
	generated_reason?: string;
	theme_tags?: string[];
}
