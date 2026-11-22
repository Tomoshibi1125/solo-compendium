import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/hooks/useAppStore";

const get = () => useAppStore.getState();

describe("useAppStore — command palette shell state", () => {
	beforeEach(() => {
		get().closeCommandPalette();
		get().setSidebarOpen(false);
		useAppStore.persist.clearStorage();
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

	it("persists durable preferences but excludes temporary overlay state", () => {
		get().openCommandPalette();
		get().setSidebarOpen(true);
		get().setSidebarCollapsed(true);
		// Trigger a durable-pref change to force a persist write.
		get().setSoundEnabled(true);

		const raw = localStorage.getItem("app-storage");
		expect(raw).toBeTruthy();

		const parsed = JSON.parse(raw as string);
		const persisted = (parsed.state ?? parsed) as Record<string, unknown>;

		expect(persisted).not.toHaveProperty("commandPaletteOpen");
		expect(persisted).not.toHaveProperty("sidebarOpen");
		expect(persisted).toHaveProperty("theme");
		expect(persisted).toHaveProperty("soundEnabled");
		expect(persisted.sidebarCollapsed).toBe(true);
	});

	it("clears a previously persisted open drawer during migration", async () => {
		localStorage.setItem(
			"app-storage",
			JSON.stringify({
				state: {
					theme: "dark",
					sidebarOpen: true,
					sidebarCollapsed: true,
					soundEnabled: false,
				},
				version: 0,
			}),
		);

		await useAppStore.persist.rehydrate();

		expect(get().sidebarOpen).toBe(false);
		expect(get().sidebarCollapsed).toBe(true);
		expect(get().theme).toBe("dark");
		expect(get().soundEnabled).toBe(false);
	});
});
