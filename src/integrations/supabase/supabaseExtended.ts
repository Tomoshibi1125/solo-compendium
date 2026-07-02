/**
 * Extended Supabase Types
 *
 * Augments auto-generated Supabase types with computed/virtual properties
 * that exist in the application layer but not in the database schema.
 * Import these instead of raw Row types when accessing extended fields.
 */

import type { CustomModifier } from "@/lib/customModifiers";

import type { Database, Json } from "./types";

export type { CustomModifier, Json };

// ─── Base Row Aliases ───────────────────────────────────────────────────────────

export type CharacterRow = Database["public"]["Tables"]["characters"]["Row"];
export type EquipmentRow =
	Database["public"]["Tables"]["character_equipment"]["Row"];
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
