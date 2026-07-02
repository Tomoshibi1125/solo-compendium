/**
 * GUILD BASE MATERIALS — the components a guild's forge consumes (built in full).
 *
 * These are the salvage a mining squad pulls from Rifts and a guild's workshop
 * works into upgrades and gear. They surface in the compendium under the
 * Crafting category and are referenced by guild crafting at the Forge facility
 * (which reuses the standard crafting system, `useCrafting` / `crafting.ts`).
 *
 * Each material carries a market `value` priced in the denomination that fits
 * its worth (mana/crystal for cheap salvage → core for the rarest inputs), so
 * prices vary in both amount and credit type across the catalog.
 *
 * source_book: "Rift Ascendant Canon".
 */

import type { RaCurrencyId } from "@/lib/currency";

export type GuildMaterialRarity =
	| "common"
	| "uncommon"
	| "rare"
	| "very_rare"
	| "legendary";

export interface GuildBaseMaterial {
	id: string;
	name: string;
	rarity: GuildMaterialRarity;
	/** Market value of one unit, in the denomination that fits its worth. */
	value: { currency: RaCurrencyId; amount: number };
	/** Where the material is recovered (Rift rank / biome). */
	source: string;
	/** What the workshop uses it for. */
	uses: string;
	description: string;
	source_book: "Rift Ascendant Canon";
}

export const GUILD_BASE_MATERIALS: GuildBaseMaterial[] = [
	{
		id: "gm-husk-resin",
		name: "Husk Resin",
		rarity: "common",
		value: { currency: "mana", amount: 8 },
		source: "E–D rank Rifts; shallow husk swarms",
		uses: "Binding agent for field repairs and tier-1 facility fittings.",
		description:
			"The tacky residue left when a husk is dispersed. Cheap, plentiful, and just sturdy enough to hold a bench together.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gm-seed-crystal",
		name: "Seed Crystal",
		rarity: "common",
		value: { currency: "crystal", amount: 3 },
		source: "Thin mana veins; any rank",
		uses: "Base reagent for essence taps and low-tier crafting.",
		description:
			"An immature mana crystal pulled before it matures. The mining squad's bread and butter.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gm-gate-iron",
		name: "Rift Iron",
		rarity: "uncommon",
		value: { currency: "gate", amount: 6 },
		source: "C–B rank Rift structures",
		uses: "Structural plating for Forge, Vault, and War Room upgrades.",
		description:
			"Metal that has set inside a Rift's threshold, denser and stranger than anything smelted outside one.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gm-stabilizer-salt",
		name: "Stabilizer Salt",
		rarity: "uncommon",
		value: { currency: "crystal", amount: 45 },
		source: "Sealed Rifts; recovery wards",
		uses: "Essence-purge baths and Infirmary stabilizers.",
		description:
			"A crystalline salt that quiets unstable essence. The difference between a recovery and a mana-burn casualty.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gm-resonant-core",
		name: "Resonant Core",
		rarity: "rare",
		value: { currency: "gate", amount: 45 },
		source: "B–A rank Rift bosses",
		uses: "Power source for Master Workshop and Command Center tiers.",
		description:
			"The intact core of a powerful anomaly, still humming. Workshops a tier below it tend to crack under the load.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gm-warded-glass",
		name: "Warded Glass",
		rarity: "rare",
		value: { currency: "gate", amount: 30 },
		source: "Archive-grade salvage; A rank surveys",
		uses: "Containment lattices, vault seals, survey instruments.",
		description:
			"Glass annealed with glyphwork that holds an essence charge without bleeding. Painstaking to recover whole.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gm-essence-bloom",
		name: "Essence Bloom",
		rarity: "very_rare",
		value: { currency: "core", amount: 1 },
		source: "S rank veins; deep domains",
		uses: "High-yield crafting; bonded healer reagents.",
		description:
			"A flowering of raw essence that grows only where a Rift has festered for a long time. Volatile, valuable, watched.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gm-anchor-shard",
		name: "Anchor Shard",
		rarity: "very_rare",
		value: { currency: "core", amount: 2 },
		source: "Domain anchors; A–S rank purges",
		uses: "Master-tier guild crafting; rank-eval instruments.",
		description:
			"A fragment of a domain's anchor, severed during a purge. It remembers the shape of the failure it caused.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "gm-sovereign-ash",
		name: "Sovereign Ash",
		rarity: "legendary",
		value: { currency: "core", amount: 12 },
		source: "SS rank clears; sovereign collapses",
		uses: "The single rarest input a guild forge can take.",
		description:
			"What remains when a sovereign-class anomaly is finally put down. Most guilds will see a pinch of it once, if ever.",
		source_book: "Rift Ascendant Canon",
	},
];
