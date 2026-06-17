import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
	theme: "light" | "dark" | "rift";
	setTheme: (theme: "light" | "dark" | "rift") => void;
	sidebarOpen: boolean; // For mobile drawer
	setSidebarOpen: (open: boolean) => void;
	sidebarCollapsed: boolean; // For desktop rail
	setSidebarCollapsed: (collapsed: boolean) => void;
	toggleSidebar: () => void;
	toggleSidebarCollapsed: () => void;
	soundEnabled: boolean;
	setSoundEnabled: (enabled: boolean) => void;
	// Ephemeral shell UI (not persisted)
	commandPaletteOpen: boolean;
	setCommandPaletteOpen: (open: boolean) => void;
	openCommandPalette: () => void;
	closeCommandPalette: () => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			theme: "rift",
			setTheme: (theme) => set({ theme }),
			sidebarOpen: false,
			setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
			sidebarCollapsed: false,
			setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
			toggleSidebar: () =>
				set((state) => ({ sidebarOpen: !state.sidebarOpen })),
			toggleSidebarCollapsed: () =>
				set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
			soundEnabled: true,
			setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
			commandPaletteOpen: false,
			setCommandPaletteOpen: (commandPaletteOpen) =>
				set({ commandPaletteOpen }),
			openCommandPalette: () => set({ commandPaletteOpen: true }),
			closeCommandPalette: () => set({ commandPaletteOpen: false }),
		}),
		{
			name: "app-storage",
			storage: createJSONStorage(() => localStorage),
			// Only persist durable preferences; ephemeral shell state (command
			// palette open/close) must not leak into localStorage.
			partialize: (state) => ({
				theme: state.theme,
				sidebarOpen: state.sidebarOpen,
				sidebarCollapsed: state.sidebarCollapsed,
				soundEnabled: state.soundEnabled,
			}),
		},
	),
);
