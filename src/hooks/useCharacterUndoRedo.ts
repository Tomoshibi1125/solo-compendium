import { useEffect, useMemo } from "react";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import { useCharacterUndoRedoStore } from "@/stores/characterUndoRedoStore";

/**
 * Hook for character undo/redo functionality.
 *
 * Thin wrapper over the keyed undo/redo store. The store owns the
 * `UndoRedoManager` and resets it per character (via `ensureScope`), which
 * keeps one character's history from bleeding into another's. Subscribing to
 * `version` re-evaluates `canUndo`/`canRedo` after each push/undo/redo.
 *
 * The returned controller is memoized (store actions are stable), so callers can
 * safely depend on it in effects without re-running every render.
 */
export function useCharacterUndoRedo(character: CharacterWithAbilities | null) {
	// Re-render on history changes so canUndo/canRedo stay current.
	useCharacterUndoRedoStore((s) => s.version);

	useEffect(() => {
		if (character) {
			useCharacterUndoRedoStore.getState().ensureScope(character.id, character);
		}
	}, [character]);

	return useMemo(() => {
		const store = useCharacterUndoRedoStore.getState();
		return {
			pushState: store.pushState,
			undo: store.undo,
			redo: store.redo,
			canUndo: store.canUndo,
			canRedo: store.canRedo,
			getHistoryInfo: store.getHistoryInfo,
		};
	}, []);
}
