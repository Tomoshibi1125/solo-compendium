/**
 * Character undo/redo controller, scoped per character.
 *
 * Previously the `UndoRedoManager` lived in a per-component `useRef`, so it only
 * reset because the route remounts the sheet. As a module store it must reset
 * explicitly on character switch via `ensureScope`, otherwise one character's
 * history would bleed into another's. A `version` counter is bumped on every
 * push/undo/redo so subscribers re-evaluate `canUndo`/`canRedo`.
 */
import { create } from "zustand";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import { UndoRedoManager } from "@/lib/undoRedo";

const HISTORY_LIMIT = 20;

type HistoryInfo = {
	current: number;
	total: number;
	canUndo: boolean;
	canRedo: boolean;
};

const EMPTY_HISTORY: HistoryInfo = {
	current: 0,
	total: 0,
	canUndo: false,
	canRedo: false,
};

interface CharacterUndoRedoState {
	scopeId: string | null;
	manager: UndoRedoManager<CharacterWithAbilities> | null;
	/** Bumped on every push/undo/redo/scope change to drive re-renders. */
	version: number;

	ensureScope: (characterId: string, seed: CharacterWithAbilities) => void;
	pushState: (state: CharacterWithAbilities, description?: string) => void;
	undo: () => CharacterWithAbilities | null;
	redo: () => CharacterWithAbilities | null;
	canUndo: () => boolean;
	canRedo: () => boolean;
	getHistoryInfo: () => HistoryInfo;
	reset: () => void;
}

export const useCharacterUndoRedoStore = create<CharacterUndoRedoState>(
	(set, get) => ({
		scopeId: null,
		manager: null,
		version: 0,

		ensureScope: (characterId, seed) => {
			if (get().scopeId === characterId && get().manager) return;
			set((s) => ({
				scopeId: characterId,
				manager: new UndoRedoManager(seed, HISTORY_LIMIT),
				version: s.version + 1,
			}));
		},

		pushState: (state, description) => {
			const manager = get().manager;
			if (!manager) return;
			manager.push(state, description);
			set((s) => ({ version: s.version + 1 }));
		},

		undo: () => {
			const manager = get().manager;
			if (!manager) return null;
			const restored = manager.undo();
			set((s) => ({ version: s.version + 1 }));
			return restored;
		},

		redo: () => {
			const manager = get().manager;
			if (!manager) return null;
			const restored = manager.redo();
			set((s) => ({ version: s.version + 1 }));
			return restored;
		},

		canUndo: () => get().manager?.canUndo() ?? false,
		canRedo: () => get().manager?.canRedo() ?? false,
		getHistoryInfo: () => get().manager?.getHistoryInfo() ?? EMPTY_HISTORY,

		reset: () => set({ scopeId: null, manager: null, version: 0 }),
	}),
);
