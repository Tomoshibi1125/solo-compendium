import type { CompendiumProviderMethod } from "@/data/compendium/registry";
import type { StaticCompendiumEntry } from "./index";

/**
 * Provider compatibility types are derived from the implementation's wide
 * entry bag and the universal registry's exhaustive method inventory. Keeping
 * this module type-only avoids loading static data in consumers.
 */
export type { StaticCompendiumEntry } from "./index";

export type StaticDataProvider = Record<
	CompendiumProviderMethod,
	(search?: string) => Promise<StaticCompendiumEntry[]>
>;
