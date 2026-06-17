/**
 * Bridges the character-sheet UI store (source of truth for active tab, modal
 * open/close, and section notes) to the persistence layer.
 *
 * - Hydrates the store once per character from the server-loaded `ui`.
 * - Debounced write-through of persisted-pref edits via the existing
 *   merge-aware `saveSheetState({ ui })`, so rapid tab clicks coalesce into a
 *   single upsert instead of one per click. Flushes on page-hide and unmount.
 *
 * The store stays the live read source; React Query keeps owning the mechanical
 * resources that share the same JSON column (saveSheetState merges, never
 * clobbers).
 */
import { useEffect, useRef } from "react";
import type { CharacterSheetState } from "@/lib/characterSheetState";
import { useCharacterSheetUiStore } from "@/stores/characterSheetUiStore";

export const SHEET_UI_PERSIST_DEBOUNCE_MS = 500;

type SaveSheetState = (
	updates: Partial<CharacterSheetState>,
) => Promise<unknown>;

export function useSheetUiPersistence(
	characterId: string,
	serverUi: CharacterSheetState["ui"] | undefined,
	saveSheetState: SaveSheetState,
	enabled: boolean,
) {
	const saveRef = useRef(saveSheetState);
	saveRef.current = saveSheetState;

	// Hydrate once per character; do not re-hydrate on later cache writes (which
	// would clobber unsaved local edits living in the store). Only the managing
	// instance (the editable sheet) owns the store, so other consumers of
	// useCharacterSheetState never fight over scope.
	useEffect(() => {
		if (!enabled) return;
		const store = useCharacterSheetUiStore.getState();
		store.ensureScope(characterId);
		if (serverUi && !useCharacterSheetUiStore.getState().hydrated) {
			store.hydrate(characterId, serverUi);
		}
	}, [characterId, serverUi, enabled]);

	// Debounced write-through. Subscribes directly to the store so timers track
	// the store lifecycle rather than React render deps.
	useEffect(() => {
		if (!enabled) return;
		let timer: ReturnType<typeof setTimeout> | null = null;
		let pending = false;
		let lastRevision = useCharacterSheetUiStore.getState().dirtyRevision;

		const flush = () => {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			if (!pending) return;
			pending = false;
			void saveRef.current({
				ui: useCharacterSheetUiStore.getState().getPersistedUi(),
			});
		};

		const unsubscribe = useCharacterSheetUiStore.subscribe((state) => {
			if (state.dirtyRevision === lastRevision) return;
			lastRevision = state.dirtyRevision;
			// Scope reset (character switch / store reset) — drop pending writes so
			// we never persist one character's prefs against another.
			if (state.dirtyRevision === 0) {
				pending = false;
				if (timer) {
					clearTimeout(timer);
					timer = null;
				}
				return;
			}
			pending = true;
			if (timer) clearTimeout(timer);
			timer = setTimeout(flush, SHEET_UI_PERSIST_DEBOUNCE_MS);
		});

		const handleVisibility = () => {
			if (document.visibilityState === "hidden") flush();
		};
		if (typeof document !== "undefined") {
			document.addEventListener("visibilitychange", handleVisibility);
		}

		return () => {
			if (typeof document !== "undefined") {
				document.removeEventListener("visibilitychange", handleVisibility);
			}
			unsubscribe();
			flush();
		};
	}, [enabled]);
}
