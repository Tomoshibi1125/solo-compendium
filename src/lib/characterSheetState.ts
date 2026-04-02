import {
	type CharacterResources,
	initializeCharacterResources,
} from "@/lib/characterResources";
import type { CustomModifier } from "@/lib/customModifiers";

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
		};
		activeTab?: string;
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
			},
			activeTab: "actions",
		},
	};
}
