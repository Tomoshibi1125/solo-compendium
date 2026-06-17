import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/hooks/useAppStore";

const get = () => useAppStore.getState();

describe("useAppStore — command palette shell state", () => {
	beforeEach(() => {
		get().closeCommandPalette();
	});

	it("opens, closes, and sets the command palette", () => {
		expect(get().commandPaletteOpen).toBe(false);

		get().openCommandPalette();
		expect(get().commandPaletteOpen).toBe(true);

		get().closeCommandPalette();
		expect(get().commandPaletteOpen).toBe(false);

		get().setCommandPaletteOpen(true);
		expect(get().commandPaletteOpen).toBe(true);
	});

	it("excludes commandPaletteOpen from the persisted snapshot (partialize)", () => {
		get().openCommandPalette();
		// Trigger a durable-pref change to force a persist write.
		get().setSoundEnabled(true);

		const raw = localStorage.getItem("app-storage");
		expect(raw).toBeTruthy();

		const parsed = JSON.parse(raw as string);
		const persisted = (parsed.state ?? parsed) as Record<string, unknown>;

		expect(persisted).not.toHaveProperty("commandPaletteOpen");
		expect(persisted).toHaveProperty("theme");
		expect(persisted).toHaveProperty("soundEnabled");
		expect(persisted).toHaveProperty("sidebarCollapsed");
	});
});
