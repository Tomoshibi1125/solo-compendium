/**
 * Extended Supabase Types
 *
 * Augments auto-generated Supabase types with computed/virtual properties
 * that exist in the application layer but not in the database schema.
 * Import these instead of raw Row types when accessing extended fields.
 */

import type { CustomModifier } from "@/lib/customModifiers";

import type { Database, Json } from "./types";
export type { Json, CustomModifier };

// ─── Base Row Aliases ───────────────────────────────────────────────────────────

export type CharacterRow = Database["public"]["Tables"]["characters"]["Row"];
export type EquipmentRow =
	Database["public"]["Tables"]["character_equipment"]["Row"];
export type FeatureRow =
	Database["public"]["Tables"]["character_features"]["Row"];
export type PowerRow = Database["public"]["Tables"]["character_powers"]["Row"];
export type ActiveSpellRow =
	Database["public"]["Tables"]["character_active_spells"]["Row"];
export type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];
export type SigilRow = Database["public"]["Tables"]["compendium_sigils"]["Row"];

export type CharacterSigilInscriptionRow =
	Database["public"]["Tables"]["character_sigil_inscriptions"]["Row"] & {
		sigil?: SigilRow;
		equipment?: EquipmentRow;
	};

export type ExtendedDatabase = Database;

// ─── Character Extended ─────────────────────────────────────────────────────────

/** Character with virtual/computed properties used by the app layer */
export interface CharacterExtended extends CharacterRow {
	/** Regent relationship ID (from character_regents table) */
	regent?: string;
	/** Array of prepared spell IDs */
	prepared_spells?: string[];
	/** Array of known spell IDs */
	known_spells?: string[];
	/** Computed attunement slots remaining */
	attunement_slots?: number;
}

// ─── Equipment Extended ─────────────────────────────────────────────────────────

/** Equipment properties as structured data (stored as Json in DB) */
export interface EquipmentProperties {
	passive?: Record<string, Json>;
	weapon?: {
		damage?: string;
		damageType?: string;
		properties?: string[];
	};
	armor?: {
		baseAC?: number;
		stealthDisadvantage?: boolean;
		category?: "none" | "light" | "medium" | "heavy" | "shield";
	};
	magical?: boolean | { bonus?: number; requiresAttunement?: boolean };
}

/** Equipment with extended fields used by AddEquipmentDialog and stat computation */
export interface EquipmentExtended extends EquipmentRow {
	/** AC formula string (e.g. "13 + AGI" for chain shirt) */
	ac_formula?: string;
	/** Generic type indicator (weapon, armor, etc.) */
	type?: string;
	/** Whether item requires attunement */
	attunement?: boolean;
	/** Damage string (e.g. "1d8+3") */
	damage?: string;
	/** Damage type (e.g. "slashing") */
	damage_type?: string;
	/** Armor class value */
	armor_class?: number;
}

// ─── Feature Extended ───────────────────────────────────────────────────────────

/** Character feature with homebrew support and formula fields */
export interface FeatureExtended extends FeatureRow {
	/** Formula for computing uses (e.g. "PB + PRE") */
	uses_formula?: string;
}

/** A single feature modifier entry */
export interface FeatureModifier {
	type: string;
	value: number;
	target: string | null;
	source: string;
	[key: string]: string | number | null;
}

// ─── Compendium Extended ────────────────────────────────────────────────────────

/** Compendium item effects (stored as Json) */
export interface CompendiumItemEffects {
	passive?: string[];
	active?: string[];
}

/** Compendium regent/regent with extended fields */
export interface RegentExtended {
	id: string;
	name: string;
	source_book?: string;
	theme?: string;
	class_features?: Array<{
		name: string;
		description: string;
		power_level?: number;
	}>;
	features?: Array<{ name: string; description: string; power_level?: number }>;
}

/** Compendium feat prerequisites (stored as Json) */
export interface FeatPrerequisites {
	feats?: string[];
	level?: number;
	ability?: Record<string, number>;
}

/** Compendium artifact requirements (stored as Json) */
export interface ArtifactRequirements {
	level?: number;
	class?: string[];
}

// ─── Combat / Encounter Extended ────────────────────────────────────────────────

/** Combatant stats (stored as Json in encounter combatants) */
export interface CombatantStats {
	xp_worth?: number;
	loot_worth?: number;
	hp_current?: number;
	hp_max?: number;
	ac?: number;
}

/** Campaign settings (stored as Json in campaigns) */
export interface CampaignSettings {
	allow_homebrew?: boolean;
	sandbox_generation_enabled?: boolean;
	discord_webhook?: string;
}

// ─── Sheet State Extended ───────────────────────────────────────────────────────

/** Character sheet state with regent unlock data */
export interface SheetStateExtended {
	primaryRegentUnlock?: {
		regent_id: string;
		unlocked_at?: string;
	};
	resources?: Record<string, number | string | boolean>;
	customModifiers?: CustomModifier[];
}

// ─── Computed Stats Extended ────────────────────────────────────────────────────

/** Extended calculated stats with encumbrance */
export interface CalculatedStatsExtended {
	encumbrance?: {
		status: "normal" | "heavy" | "overloaded";
		currentWeight?: number;
		capacity?: number;
	};
}

// ─── Spell Duration Types ───────────────────────────────────────────────────────

export type SpellDurationType =
	| "rounds"
	| "minutes"
	| "hours"
	| "concentration";

// ─── Character Feature Choice Data ──────────────────────────────────────────────

/** Extended choice data with eligible power names set */
export interface ChoiceDataExtended {
	eligiblePowerNames?: Set<string>;
	featureById?: Map<string, FeatureExtended>;
}

// ─── Regent/Sovereign Types ─────────────────────────────────────────────────────

/** Regent unlock with nested regent data */
export interface RegentUnlockExtended {
	regent?: RegentExtended;
	unlocked_at?: string;
}

/** Generated sovereign with regent theme data */
export interface GeneratedSovereignExtended {
	regentA?: { theme: string; name?: string; id?: string };
	regentB?: { theme: string; name?: string; id?: string };
	fusionName?: string;
}

// ─── VTT Types ──────────────────────────────────────────────────────────────────

/** Weather type for VTT scenes */
export type VTTWeatherType =
	| "clear"
	| "rain"
	| "snow"
	| "fog"
	| "storm"
	| string;

// ─── Utility Types ──────────────────────────────────────────────────────────────

/** Type-safe helper for JSON column access */
export function asRecord(json: Json | null | undefined): Record<string, Json> {
	if (json && typeof json === "object" && !Array.isArray(json)) {
		return json as Record<string, Json>;
	}
	return {};
}

/** Type-safe helper for JSON array column access */
export function _asJsonArray(json: Json | null | undefined): Json[] {
	if (Array.isArray(json)) return json;
	return [];
}
