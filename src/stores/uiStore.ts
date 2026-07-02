/**
 * App-wide ephemeral UI state (not character-scoped, not persisted).
 *
 * Currently holds the active route "zone", which drives the ambient
 * RiftSiteBackground vignette. `RouteEffects` (inside the router) writes it on
 * navigation; `ZonedRiftSiteBackground` (rendered outside the router) reads it.
 */
import { create } from "zustand";

export type AppZone =
	| "default"
	| "compendium"
	| "warden"
	| "campaign"
	| "character";

interface UiState {
	zone: AppZone;
	setZone: (zone: AppZone) => void;
}

export const useUiStore = create<UiState>((set) => ({
	zone: "default",
	setZone: (zone) => set((state) => (state.zone === zone ? state : { zone })),
}));
