import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
	theme: "light" | "dark" | "system";
	setTheme: (theme: "light" | "dark" | "system") => void;
	sidebarOpen: boolean; // For mobile drawer
	setSidebarOpen: (open: boolean) => void;
	sidebarCollapsed: boolean; // For desktop rail
	setSidebarCollapsed: (collapsed: boolean) => void;
	toggleSidebar: () => void;
	toggleSidebarCollapsed: () => void;
	soundEnabled: boolean;
	setSoundEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			theme: "system",
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
		}),
		{
			name: "app-storage",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
