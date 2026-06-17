import { beforeEach, describe, expect, it } from "vitest";
import type { CharacterWithAbilities } from "@/hooks/useCharacters";
import { useCharacterUndoRedoStore } from "@/stores/characterUndoRedoStore";

const get = () => useCharacterUndoRedoStore.getState();

const character = (id: string, name: string) =>
	({ id, name }) as unknown as CharacterWithAbilities;

describe("characterUndoRedoStore", () => {
	beforeEach(() => {
		get().reset();
	});

	it("seeds a manager on ensureScope with no undo available", () => {
		get().ensureScope("char-a", character("char-a", "Seed"));
		expect(get().canUndo()).toBe(false);
		expect(get().canRedo()).toBe(false);
		expect(get().getHistoryInfo().total).toBe(1);
	});

	it("round-trips push -> undo -> redo", () => {
		get().ensureScope("char-a", character("char-a", "v0"));
		get().pushState(character("char-a", "v1"), "edit 1");
		expect(get().canUndo()).toBe(true);

		const undone = get().undo();
		expect(undone?.name).toBe("v0");
		expect(get().canUndo()).toBe(false);
		expect(get().canRedo()).toBe(true);

		const redone = get().redo();
		expect(redone?.name).toBe("v1");
	});

	it("caps history at 20 entries", () => {
		get().ensureScope("char-a", character("char-a", "seed"));
		for (let i = 0; i < 30; i++) {
			get().pushState(character("char-a", `v${i}`));
		}
		expect(get().getHistoryInfo().total).toBe(20);
	});

	it("resets history when scoped to a different character (no bleed)", () => {
		get().ensureScope("char-a", character("char-a", "a0"));
		get().pushState(character("char-a", "a1"));
		expect(get().canUndo()).toBe(true);

		get().ensureScope("char-b", character("char-b", "b0"));
		expect(get().scopeId).toBe("char-b");
		expect(get().canUndo()).toBe(false);
		expect(get().undo()).toBeNull();
	});

	it("bumps version on scope change, push, undo, and redo", () => {
		const v0 = get().version;
		get().ensureScope("char-a", character("char-a", "v0"));
		const v1 = get().version;
		expect(v1).toBe(v0 + 1);

		get().pushState(character("char-a", "v1"));
		expect(get().version).toBe(v1 + 1);

		get().undo();
		expect(get().version).toBe(v1 + 2);

		get().redo();
		expect(get().version).toBe(v1 + 3);
	});

	it("ensureScope is a no-op for the same character", () => {
		get().ensureScope("char-a", character("char-a", "v0"));
		get().pushState(character("char-a", "v1"));
		const versionBefore = get().version;

		get().ensureScope("char-a", character("char-a", "ignored"));
		expect(get().version).toBe(versionBefore);
		expect(get().canUndo()).toBe(true);
	});
});
