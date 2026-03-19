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
export type SigilRow = {
	id: string;
	name: string;
	description: string;
	effect_description: string;
	sigil_type: string;
	sigil_category: string;
	sigil_level: number;
	rarity: string;
	effect_type: string;
	requires_level: number | null;
	passive_bonuses: Json;
	can_inscribe_on: string[] | null;
	inscription_difficulty: number | null;
	tags: string[] | null;
	image_url: string | null;
	source_book: string | null;
	created_at: string | null;
	updated_at: string | null;
};

export type CharacterSigilInscriptionRow = {
	id: string;
	character_id: string;
	equipment_id: string;
	sigil_id: string;
	slot_index: number;
	is_active: boolean;
	sigil?: SigilRow;
	equipment?: EquipmentRow;
};

/**
 * Extended Database type that includes tables missing from auto-generated types.
 * This allows for type-safe access via supabase.from() without using 'as any'.
 */
export type ExtendedDatabase = Database & {
	public: {
		Tables: Database["public"]["Tables"] & {
			compendium_sigils: {
				Row: SigilRow;
				Insert: Omit<SigilRow, "id" | "created_at" | "updated_at"> & {
					id?: string;
				};
				Update: Partial<SigilRow>;
				Relationships: [];
			};
			character_sigil_inscriptions: {
				Row: CharacterSigilInscriptionRow;
				Insert: Omit<CharacterSigilInscriptionRow, "id"> & { id?: string };
				Update: Partial<CharacterSigilInscriptionRow>;
				Relationships: [
					{
						foreignKeyName: "character_sigil_inscriptions_character_id_fkey";
						columns: ["character_id"];
						referencedRelation: "characters";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_sigil_inscriptions_equipment_id_fkey";
						columns: ["equipment_id"];
						referencedRelation: "character_equipment";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "character_sigil_inscriptions_sigil_id_fkey";
						columns: ["sigil_id"];
						referencedRelation: "compendium_sigils";
						referencedColumns: ["id"];
					},
				];
			};
		};
	};
};

// ─── Character Extended ─────────────────────────────────────────────────────────

/** Character with virtual/computed properties used by the app layer */
export interface CharacterExtended extends CharacterRow {
	/** Regent relationship ID (from character_regents table) */
	regent?: string;
	/** Array of prepared spell IDs */
	prepared_spells?: string[];
	/** Array of known spell IDs */
	known_spells?: string[];
	/** Death save successes counter (managed by useDeathSaves hook) */
	death_save_successes?: number;
	/** Death save failures counter (managed by useDeathSaves hook) */
	death_save_failures?: number;
	/** Computed attunement slots remaining */
	attunement_slots?: number;
	// regent_overlays and regent_overlays already in CharacterRow
}

// ─── Equipment Extended ─────────────────────────────────────────────────────────

/** Equipment properties as structured data (stored as Json in DB) */
export interface EquipmentProperties {
	passive?: Record<string, unknown>;
	weapon?: {
		damage?: string;
		damageType?: string;
		[key: string]: unknown;
	};
	armor?: {
		baseAC?: number;
		[key: string]: unknown;
	};
	magical?: boolean | Record<string, unknown>;
	[key: string]: unknown;
}

/** Equipment with extended fields used by AddEquipmentDialog and stat computation */
export interface EquipmentExtended extends EquipmentRow {
	/** AC formula string (e.g. "13 + DEX" for chain shirt) */
	ac_formula?: string;
	/** Generic type indicator (weapon, armor, etc.) */
	type?: string;
	// rarity already in EquipmentRow
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
	// homebrew_id and modifiers already in FeatureRow
	/** Formula for computing uses (e.g. "PB + CHA") */
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
	passive?: Record<string, unknown>;
	[key: string]: unknown;
}

/** Compendium regent/regent with extended fields */
export interface RegentExtended {
	id: string;
	name: string;
	source_book?: string;
	theme?: string;
	class_features?: unknown[];
	features?: Array<{ name: string; description: string; power_level?: number }>;
	[key: string]: unknown;
}

/** Compendium feat prerequisites (stored as Json) */
export interface FeatPrerequisites {
	feats?: string[];
	[key: string]: unknown;
}

/** Compendium artifact requirements (stored as Json) */
export interface ArtifactRequirements {
	level?: number;
	[key: string]: unknown;
}

// ─── Combat / Encounter Extended ────────────────────────────────────────────────

/** Combatant stats (stored as Json in encounter combatants) */
export interface CombatantStats {
	xp_worth?: number;
	loot_worth?: number;
	[key: string]: unknown;
}

/** Campaign settings (stored as Json in campaigns) */
export interface CampaignSettings {
	[key: string]: unknown;
}

// ─── Sheet State Extended ───────────────────────────────────────────────────────

/** Character sheet state with regent unlock data */
export interface SheetStateExtended {
	primaryRegentUnlock?: {
		regent_id: string;
		[key: string]: unknown;
	};
	resources?: Record<string, unknown>;
	customModifiers?: CustomModifier[];
	[key: string]: unknown;
}

// ─── Computed Stats Extended ────────────────────────────────────────────────────

/** Extended calculated stats with encumbrance */
export interface CalculatedStatsExtended {
	encumbrance?: {
		status: "normal" | "heavy" | "overloaded";
		[key: string]: unknown;
	};
	[key: string]: unknown;
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
	featureById?: Map<string, unknown>;
	[key: string]: unknown;
}

// ─── Regent/Sovereign Types ─────────────────────────────────────────────────────

/** Regent unlock with nested regent data */
export interface RegentUnlockExtended {
	regent?: RegentExtended;
	[key: string]: unknown;
}

/** Generated sovereign with regent theme data */
export interface GeneratedSovereignExtended {
	regentA?: { theme: string; [key: string]: unknown };
	regentB?: { theme: string; [key: string]: unknown };
	[key: string]: unknown;
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
export function asRecord(
	json: Json | null | undefined,
): Record<string, unknown> {
	if (json && typeof json === "object" && !Array.isArray(json)) {
		return json as Record<string, unknown>;
	}
	return {};
}

/** Type-safe helper for JSON array column access */
export function _asJsonArray(json: Json | null | undefined): unknown[] {
	if (Array.isArray(json)) return json;
	return [];
}
