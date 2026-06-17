/**
 * Character-sheet UI source of truth.
 *
 * Holds BOTH the purely ephemeral controller state (detail drawer, theme
 * preview, scroll header, mobile tab) AND the persisted UI preferences
 * (active tab, modal open/close, per-section notes). The persisted slice is
 * the live source of truth here; `useCharacterSheetState` hydrates it once from
 * Supabase and writes changes back through its existing merge-aware
 * `saveSheetState({ ui })` path (so it never clobbers the mechanical resources
 * that share the same JSON column, which stay owned by React Query).
 *
 * Scoped to one character at a time via `ensureScope(characterId)`, which
 * resets state on character switch so nothing bleeds across sheets.
 */
import type { LucideIcon } from "lucide-react";
import { create } from "zustand";
import type { SheetThemePreview } from "@/components/character/SheetThemeDialog";
import {
	type CharacterSheetState,
	createDefaultCharacterSheetState,
	type SheetNoteSection,
} from "@/lib/characterSheetState";
import type { DetailData } from "@/types/character";

export type SheetModalId = keyof CharacterSheetState["ui"]["modals"];
export type SelectedDetail =
	| (DetailData & { icon?: LucideIcon; type: string })
	| null;

type PersistedSlice = {
	modals: CharacterSheetState["ui"]["modals"];
	activeTab: string;
	sectionNotes: Partial<Record<SheetNoteSection, string>>;
};

const persistedDefaults = (): PersistedSlice => {
	const ui = createDefaultCharacterSheetState().ui;
	return {
		modals: { ...ui.modals },
		activeTab: ui.activeTab ?? "actions",
		sectionNotes: { ...(ui.sectionNotes ?? {}) },
	};
};

const ephemeralDefaults = () => ({
	selectedDetail: null as SelectedDetail,
	themeDialogOpen: false,
	themePreview: null as SheetThemePreview | null,
	showScrollHeader: false,
	internalMobileTab: "actions",
});

export interface CharacterSheetUiState extends PersistedSlice {
	/** characterId these values belong to; used to reset on switch. */
	scopeId: string | null;
	/** Set true once the persisted slice is seeded from the server. */
	hydrated: boolean;
	/** Increments only on user-driven persisted-pref edits (never on hydrate),
	 * so the persistence layer can distinguish writes from server hydration. */
	dirtyRevision: number;

	// ephemeral controller state
	selectedDetail: SelectedDetail;
	themeDialogOpen: boolean;
	themePreview: SheetThemePreview | null;
	showScrollHeader: boolean;
	internalMobileTab: string;

	// lifecycle
	ensureScope: (characterId: string | null) => void;
	hydrate: (characterId: string, ui: CharacterSheetState["ui"]) => void;
	getPersistedUi: () => CharacterSheetState["ui"];

	// persisted-pref setters (write-through wired by useCharacterSheetState)
	setActiveTab: (tab: string) => void;
	setModal: (modalId: SheetModalId, open: boolean) => void;
	setSectionNote: (section: SheetNoteSection, value: string) => void;

	// ephemeral setters
	setSelectedDetail: (detail: SelectedDetail) => void;
	openDetail: (detail: DetailData, type: string, icon?: LucideIcon) => void;
	closeDetail: () => void;
	setThemeDialogOpen: (open: boolean) => void;
	setThemePreview: (preview: SheetThemePreview | null) => void;
	setShowScrollHeader: (show: boolean) => void;
	setInternalMobileTab: (tab: string) => void;

	reset: () => void;
}

const initialState = (): Omit<
	CharacterSheetUiState,
	| "ensureScope"
	| "hydrate"
	| "getPersistedUi"
	| "setActiveTab"
	| "setModal"
	| "setSectionNote"
	| "setSelectedDetail"
	| "openDetail"
	| "closeDetail"
	| "setThemeDialogOpen"
	| "setThemePreview"
	| "setShowScrollHeader"
	| "setInternalMobileTab"
	| "reset"
> => ({
	scopeId: null,
	hydrated: false,
	dirtyRevision: 0,
	...persistedDefaults(),
	...ephemeralDefaults(),
});

export const useCharacterSheetUiStore = create<CharacterSheetUiState>(
	(set, get) => ({
		...initialState(),

		ensureScope: (characterId) => {
			if (get().scopeId === characterId) return;
			set({
				scopeId: characterId,
				hydrated: false,
				dirtyRevision: 0,
				...persistedDefaults(),
				...ephemeralDefaults(),
			});
		},

		hydrate: (characterId, ui) => {
			set({
				scopeId: characterId,
				hydrated: true,
				modals: { ...persistedDefaults().modals, ...ui.modals },
				activeTab: ui.activeTab ?? "actions",
				sectionNotes: { ...(ui.sectionNotes ?? {}) },
			});
		},

		getPersistedUi: () => {
			const { modals, activeTab, sectionNotes } = get();
			return { modals, activeTab, sectionNotes };
		},

		setActiveTab: (activeTab) =>
			set((s) => ({ activeTab, dirtyRevision: s.dirtyRevision + 1 })),

		setModal: (modalId, open) =>
			set((s) => ({
				modals: { ...s.modals, [modalId]: open },
				dirtyRevision: s.dirtyRevision + 1,
			})),

		setSectionNote: (section, value) =>
			set((s) => ({
				sectionNotes: { ...s.sectionNotes, [section]: value },
				dirtyRevision: s.dirtyRevision + 1,
			})),

		setSelectedDetail: (selectedDetail) => set({ selectedDetail }),
		openDetail: (detail, type, icon) =>
			set({ selectedDetail: { ...detail, type, icon } }),
		closeDetail: () => set({ selectedDetail: null }),
		setThemeDialogOpen: (themeDialogOpen) => set({ themeDialogOpen }),
		setThemePreview: (themePreview) => set({ themePreview }),
		setShowScrollHeader: (showScrollHeader) => set({ showScrollHeader }),
		setInternalMobileTab: (internalMobileTab) => set({ internalMobileTab }),

		reset: () => set({ ...initialState() }),
	}),
);
