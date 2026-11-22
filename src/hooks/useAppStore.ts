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
			version: 1,
			storage: createJSONStorage(() => localStorage),
			// Persist durable preferences only. Open overlays and drawers are
			// temporary UI state and must always start closed after reload.
			partialize: (state) => ({
				theme: state.theme,
				sidebarCollapsed: state.sidebarCollapsed,
				soundEnabled: state.soundEnabled,
			}),
			// Version 0 persisted sidebarOpen. Remove that stale drawer state so
			// upgrading while the mobile menu is open cannot reopen it.
			migrate: (persistedState) => {
				const { sidebarOpen: _sidebarOpen, ...preferences } =
					persistedState as Partial<AppState>;
				return preferences as AppState;
			},
			// Also ignore sidebarOpen if a persisted snapshot still contains it.
			merge: (persistedState, currentState) => ({
				...currentState,
				...(persistedState as Partial<AppState>),
				sidebarOpen: false,
			}),
		},
	),
);
