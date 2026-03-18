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
