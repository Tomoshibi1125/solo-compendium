import {
	type CharacterResources,
	initializeCharacterResources,
} from "@/lib/characterResources";
import type { CustomModifier } from "@/lib/customModifiers";

/**
 * Canonical sheet sections that support inline freeform notes. F3 of the
 * May 2026 remediation plan — DDB parity. Each section can carry one
 * stored note string. Persists inside `character_sheet_state.resources.ui`
 * to reuse the existing JSON column (no new schema needed).
 */
export type SheetNoteSection =
	| "description"
	| "equipment"
	| "features"
	| "spells"
	| "powers"
	| "techniques"
	| "runes"
	| "conditions"
	| "ideals"
	| "bonds"
	| "flaws"
	| "notes";

export interface CharacterSheetState {
	resources: CharacterResources;
	customModifiers: CustomModifier[];
	ui: {
		modals: {
			edit: boolean;
			share: boolean;
			export: boolean;
			levelUp: boolean;
			defenses: boolean;
			health: boolean;
		};
		activeTab?: string;
		/** Per-section freeform notes (DDB parity, F3). Keys are bounded by
		 * `SheetNoteSection`. Values are markdown / plain text. */
		sectionNotes?: Partial<Record<SheetNoteSection, string>>;
	};
}

export function createDefaultCharacterSheetState(): CharacterSheetState {
	return {
		resources: initializeCharacterResources(),
		customModifiers: [],
		ui: {
			modals: {
				edit: false,
				share: false,
				export: false,
				levelUp: false,
				defenses: false,
				health: false,
			},
			activeTab: "actions",
			sectionNotes: {},
		},
	};
}
