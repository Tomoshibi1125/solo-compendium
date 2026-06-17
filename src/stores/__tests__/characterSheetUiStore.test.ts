import { beforeEach, describe, expect, it } from "vitest";
import {
	type CharacterSheetUiState,
	useCharacterSheetUiStore,
} from "@/stores/characterSheetUiStore";
import type { DetailData } from "@/types/character";

const get = () => useCharacterSheetUiStore.getState();

const sampleUi = {
	modals: {
		edit: true,
		share: false,
		export: false,
		levelUp: false,
		defenses: false,
		health: false,
	},
	activeTab: "features",
	sectionNotes: { notes: "remember the gate" },
} satisfies Parameters<CharacterSheetUiState["hydrate"]>[1];

describe("characterSheetUiStore", () => {
	beforeEach(() => {
		get().reset();
	});

	it("starts with sensible defaults", () => {
		const s = get();
		expect(s.scopeId).toBeNull();
		expect(s.hydrated).toBe(false);
		expect(s.dirtyRevision).toBe(0);
		expect(s.activeTab).toBe("actions");
		expect(s.selectedDetail).toBeNull();
		expect(s.themeDialogOpen).toBe(false);
		expect(s.modals.edit).toBe(false);
	});

	it("opens and closes the detail drawer", () => {
		const detail = {
			title: "Greataxe",
			description: "A heavy axe",
		} as unknown as DetailData;

		get().openDetail(detail, "Action");
		expect(get().selectedDetail).toMatchObject({
			title: "Greataxe",
			type: "Action",
		});

		get().closeDetail();
		expect(get().selectedDetail).toBeNull();
	});

	it("sets and clears the theme preview without persisting", () => {
		const preview = {
			sheet_theme: "ember",
			sheet_backdrop: null,
			sheet_accent: null,
		};
		get().setThemePreview(preview);
		expect(get().themePreview).toEqual(preview);
		expect(get().dirtyRevision).toBe(0);

		get().setThemePreview(null);
		expect(get().themePreview).toBeNull();
	});

	it("ensureScope resets state when the character changes", () => {
		get().setActiveTab("inventory");
		get().setThemeDialogOpen(true);
		get().ensureScope("char-1");

		const s = get();
		expect(s.scopeId).toBe("char-1");
		expect(s.activeTab).toBe("actions");
		expect(s.themeDialogOpen).toBe(false);
		expect(s.dirtyRevision).toBe(0);
	});

	it("ensureScope is a no-op for the same character", () => {
		get().ensureScope("char-1");
		get().setActiveTab("powers");
		get().ensureScope("char-1");

		expect(get().activeTab).toBe("powers");
	});

	it("hydrate seeds the persisted prefs and marks hydrated without dirtying", () => {
		get().ensureScope("char-1");
		get().hydrate("char-1", sampleUi);

		const s = get();
		expect(s.hydrated).toBe(true);
		expect(s.activeTab).toBe("features");
		expect(s.modals.edit).toBe(true);
		expect(s.sectionNotes.notes).toBe("remember the gate");
		expect(s.dirtyRevision).toBe(0);
	});

	it("persisted-pref setters update state and bump dirtyRevision", () => {
		const before = get().dirtyRevision;

		get().setActiveTab("stats");
		get().setModal("health", true);
		get().setSectionNote("equipment", "two daggers");

		const s = get();
		expect(s.activeTab).toBe("stats");
		expect(s.modals.health).toBe(true);
		expect(s.sectionNotes.equipment).toBe("two daggers");
		expect(s.dirtyRevision).toBe(before + 3);
	});

	it("getPersistedUi returns only the persisted slice", () => {
		get().hydrate("char-1", sampleUi);
		get().setSelectedDetail({
			title: "x",
			description: "y",
			type: "Item",
		} as never);

		expect(get().getPersistedUi()).toEqual({
			modals: sampleUi.modals,
			activeTab: "features",
			sectionNotes: { notes: "remember the gate" },
		});
	});
});
