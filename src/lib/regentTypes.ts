export enum RegentType {
	STRENGTH_REGENT = "Strength Regent",
	AGILITY_REGENT = "Agility Regent",
	VITALITY_REGENT = "Vitality Regent",
	INTELLIGENCE_REGENT = "Intelligence Regent",
	SENSE_REGENT = "Sense Regent",
	PRESENCE_REGENT = "Presence Regent",
}

export interface Feature {
	name: string;
	description: string;
	type: string;
}

export interface StructuredSpell {
	name: string;
	description: string;
	level: number;
	school: string;
}

export type Spell = string | StructuredSpell;

export interface Trait {
	name: string;
	description: string;
	type: string;
	benefits: string[];
}

export interface RegentPath {
	id: string;
	name: string;
	type: RegentType;
	description: string;
	abilities: string[];
	features: Feature[];
	spells: Spell[];
	/** Regent compendium entry ID in regents.ts */
	compendiumId?: string;
	requirements: {
		/** @deprecated Regents are quest/Warden-gated — level is advisory only */
		level?: number;
		questCompleted?: string;
		statThreshold: number;
	};
}

export interface Regent {
	id: string;
	name: string;
	title?: string;
	theme?: string;
	description?: string;
	rank?: "D" | "C" | "B" | "A" | "S";
	image?: string;
	type?: string;
	tags?: string[];
	created_at?: string;
	source_book?: string;
	flavor?: string;
	lore?: string;

	hit_dice?: string;
	primary_ability?: string[];
	saving_throws?: string[];
	skill_proficiencies?: string[];
	armor_proficiencies?: string[];
	weapon_proficiencies?: string[];
	tool_proficiencies?: string[];

	class_features?: {
		level: number;
		name: string;
		description: string;
		type: "passive" | "active" | "action" | "bonus-action" | "reaction";
		frequency?:
			| "at-will"
			| "short-rest"
			| "long-rest"
			| "once-per-day"
			| "once-per-long-rest";
	}[];

	spellcasting?: {
		ability: string;
		spell_slots: Record<string, number[]>;
		cantrips_known?: number[];
		spells_known?: number[];
		spell_preparation?: boolean;
		additional_spells?: string[];
	};

	progression_table?: {
		[level: number]: {
			features_gained: string[];
			abilities_improved?: string[];
			spell_slots?: Record<string, number>;
			special_abilities?: string[];
		};
	};

	// --- Job-parity choice/progression systems (all optional). ---
	// Regents are Warden-unlocked overlays, NOT chosen at creation. These mirror
	// the job ledger (see choiceCalculations.ts) so a regent can grant structured
	// power/technique/cantrip/spell picks as an overlay, scaled to its theme and
	// rank-S power tier. `level` on a ledger entry is the regent-internal tier;
	// because regents aren't level-gated, unlocking grants every tier up to the
	// character's level at once (see regent level-up wiring).
	levelChoices?: {
		level: number;
		type: string;
		count: number;
		source: string;
		options?: string[];
		filter?: {
			maxPowerLevel?: number;
			maxLevel?: number;
			restrictTo?: "job-list" | "any-list";
		};
	}[];
	// Cumulative known-counts per regent tier (index = tier - 1), for regents that
	// grant martial powers / techniques as an overlay.
	powersKnown?: number[];
	techniquesKnown?: number[];

	regent_requirements?: {
		level: number;
		abilities: Record<string, number>;
		quest_completion: string;
		warden_approval: boolean;
	};

	requirements?: {
		quest_completion: string;
		warden_verification: boolean;
		prerequisite_job?: string;
		power_level: number;
	};

	abilities?: {
		name: string;
		description: string;
		type: "passive" | "active" | "action" | "bonus-action" | "reaction";
		frequency?: "at-will" | "short-rest" | "long-rest" | "once-per-day";
		dc?: number;
		power_level?: number;
	}[];

	features?: {
		name: string;
		description: string;
		power_level?: number;
	}[];

	mechanics?: {
		stat_bonuses?: Record<string, number>;
		special_abilities?: string[];
		restrictions?: string[];
		progression?: Record<string, string[]>;
	};
}
