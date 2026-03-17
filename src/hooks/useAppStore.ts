import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
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
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            soundEnabled: true,
            setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
        }),
        {
            name: "app-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
