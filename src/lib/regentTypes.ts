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
	/** Canonical Task 7 ledger metadata; absent on evidence-only legacy rows. */
	id?: string;
	level?: number;
	frequency?: RegentFeatureFrequency;
	actionType?: string;
	uses?: RegentFeatureUseDefinition;
	resource?: string;
	tracking?: RegentFeatureTracking;
	canonStatus?: RegentFeatureCanonStatus;
	provenance?: RegentFeatureProvenance;
	reviewBlockerId?: string;
}

export interface StructuredSpell {
	name: string;
	description: string;
	level: number;
	school: string;
}

export type Spell = string | StructuredSpell;

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

export type RegentFeatureType =
	| "passive"
	| "active"
	| "action"
	| "bonus-action"
	| "reaction";

export type RegentFeatureFrequency =
	| "at-will"
	| "short-rest"
	| "long-rest"
	| "once-per-day"
	| "once-per-long-rest";

export type RegentFeatureTracking = "uses" | "resource" | "manual";
export type RegentFeatureCanonStatus = "source-backed" | "review-blocked";
export type RegentFeatureSourceKind =
	| "class_features"
	| "abilities"
	| "features"
	| "progression_table";

export interface RegentFeatureUseDefinition {
	formula: string;
	recharge: "short-rest" | "long-rest";
}

/** Repository-local evidence for the feature's level and mechanic text. */
export interface RegentFeatureProvenance {
	levelSource: "progression_table" | "class_features";
	mechanicsSource: RegentFeatureSourceKind;
	sourcePath: "src/data/compendium/regents.ts";
	fieldPath: string;
	sourceName?: string;
	sourceLevel?: number;
	/** Records a source disagreement without choosing an unauthored resolution. */
	conflict?: string;
}

/**
 * The shared Regent overlay row consumed by compendium, sheet, progression, and
 * persistence code. Raw source rows may omit normalization fields; regents.ts
 * materializes them synchronously before exporting the canonical roster.
 */
export interface RegentClassFeature {
	id?: string;
	level: number;
	name: string;
	description: string;
	type: RegentFeatureType;
	frequency?: RegentFeatureFrequency;
	actionType?: string;
	uses?: RegentFeatureUseDefinition;
	resource?: string;
	tracking?: RegentFeatureTracking;
	canonStatus?: RegentFeatureCanonStatus;
	provenance?: RegentFeatureProvenance;
	reviewBlockerId?: string;
}

export interface Regent {
	id: string;
	name: string;
	aliases?: string[];
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

	class_features?: RegentClassFeature[];

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

	// Regents are post-creation overlays. These ledgers describe declared pick
	// counts only; option identities remain unavailable until explicitly authored.
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
		type: RegentFeatureType;
		frequency?: RegentFeatureFrequency;
		dc?: number;
		power_level?: number;
		actionType?: string;
		uses?: RegentFeatureUseDefinition;
		resource?: string;
		tracking?: RegentFeatureTracking;
	}[];

	features?: {
		name: string;
		description: string;
		power_level?: number;
		type?: RegentFeatureType;
		frequency?: RegentFeatureFrequency;
		actionType?: string;
		uses?: RegentFeatureUseDefinition;
		resource?: string;
		tracking?: RegentFeatureTracking;
	}[];

	mechanics?: {
		stat_bonuses?: Record<string, number>;
		special_abilities?: string[];
		restrictions?: string[];
		progression?: Record<string, string[]>;
	};
}
