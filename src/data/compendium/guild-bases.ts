/**
 * GUILD BASE PROPERTIES — the HQ a guild acquires as its home, built in full.
 *
 * A guild owns ONE base. Buying one is an UNGATED fund purchase (or Warden-grant):
 * it installs the base's bundled facility tiers into the guild's `base_facilities`
 * (never downgrading a wing already raised higher) and records it as the owned
 * base. The guild then upgrades / mods those wings through the normal facility +
 * skill system (see `guild-base-mods.ts` / `guild-skills.ts`).
 *
 * The five designed bases each bundle a DISTINCT theme; the blank `isLot` parcel
 * bundles nothing and is the cheapest — a guild that wants a bespoke mix of the
 * twelve facilities buys the lot and raises exactly the wings it needs.
 *
 * Prices are in Core Credits (property is a real-estate–scale purchase, unlike the
 * per-wing facility upgrades priced in Gate Credits). Perks are the HONEST grounded
 * model (see `GuildBenefitSource` in `lib/guildBase.ts`): a real capability, a real
 * 5e effect applied to members' sheets, or narrative prose. No invented stat keys.
 *
 * source_book: "Rift Ascendant Canon".
 */

import type { GuildBaseProperty } from "@/lib/guildBase";

export const GUILD_BASES: GuildBaseProperty[] = [
	{
		id: "base-ironhold-bastion",
		name: "Ironhold Bastion",
		summary:
			"A walled drill-fort on the city's gate-facing edge — the home of a guild that fields hard, disciplined strike squads.",
		description:
			"A converted border redoubt of rammed stone and warded gates. It comes garrisoned and drilled, built around putting a trained, well-armed squad through a threshold and bringing it back. The Bureau logs it as a hard point.",
		cost: { currency: "core", amount: 28 },
		includedFacilities: {
			barracks: 2,
			training_hall: 1,
			armory: 1,
			war_room: 1,
		},
		capability: { memberCap: 1 },
		benefit:
			"A fortified, Bureau-logged strong point — a standing address that lets the guild carry one more sworn member than its contribution alone would.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "base-cinderworks-foundry",
		name: "Cinderworks Foundry",
		summary:
			"A reclaimed essence-foundry with cold-stores and reagent beds — the home of a guild that lives at the crafting bench.",
		description:
			"An old Bureau essence-foundry, its containment lattices relit and its yard turned over to reagent beds. It comes with a working forge, a growing garden, and a warded vault for the stock — a guild here turns salvage into gear faster than it can spend it.",
		cost: { currency: "core", amount: 24 },
		includedFacilities: {
			forge: 2,
			essence_garden: 1,
			vault: 1,
		},
		capability: { craftingOptions: ["recipe-foundry-overcharge"] },
		benefit:
			"A relit foundry line the guild can push past safe tolerances — an overcharge refit no rented bench would risk.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "base-astral-athenaeum",
		name: "Astral Athenaeum",
		summary:
			"A survey-tower library above the gate district — the home of a guild that reads a threshold before it steps through.",
		description:
			"A tall archive-and-observatory the Bureau once used for gate cartography. It comes with a cross-referenced survey archive and a working watch spire — a guild here walks into a gate already knowing its shape, its veins, and its choke-points.",
		cost: { currency: "core", amount: 22 },
		includedFacilities: {
			archive: 2,
			observatory: 1,
			war_room: 1,
		},
		effects: [{ kind: "passive_bonus", passive: "investigation", value: 1 }],
		benefit:
			"A standing research library — members steeped in its dossiers piece a gate's puzzles together faster than crews going in blind.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "base-quiet-hearth",
		name: "Quiet Hearth",
		summary:
			"A warded sanctuary house set back from the gates — the home of a guild that brings its people home whole.",
		description:
			"A quiet, heavily-warded hall built around recovery. It comes with a staffed recovery ward, a warding sanctum that bleeds the rift out of returning squads, and a hearth to gather at — a guild here loses fewer members to the slow damage a gate does.",
		cost: { currency: "core", amount: 20 },
		includedFacilities: {
			infirmary: 2,
			sanctum: 1,
			great_hall: 1,
		},
		benefit:
			"A warded home the rift cannot follow anyone into — a place of genuine respite between contracts, and a roster that stays intact because of it.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "base-vermillion-spire",
		name: "Vermillion Spire",
		summary:
			"A landmark guild tower in the Bureau district — the flagship home of a guild that has arrived and wants it known.",
		description:
			"A tall, well-appointed spire the Bureau treats as a peer institution: barracks, a war room, a warded vault, a hall of banners, and its own records office under one roof. It is the most expensive base and the most rounded — a seat of standing rather than a specialist's tool.",
		cost: { currency: "core", amount: 40 },
		includedFacilities: {
			great_hall: 2,
			barracks: 1,
			war_room: 1,
			vault: 1,
			archive: 1,
		},
		capability: { memberCap: 2 },
		benefit:
			"A landmark address the Bureau treats as a peer — the guild's name opens doors and its roster has room to grow with its reputation.",
		source_book: "Rift Ascendant Canon",
	},
	{
		id: "base-cleared-lot",
		name: "Cleared Lot",
		summary:
			"A surveyed, Bureau-zoned parcel with foundation stakes and a mana tap — nothing built yet. Raise exactly the wings you want.",
		description:
			"An empty but buildable lot: cleared, surveyed, zoned for a guild hall, with the foundation stakes set and a regulated mana tap already run. It comes with no facilities at all — it is the cheapest way to claim a home, and the only base that lets a guild raise a wholly custom hall from the full slate of twelve facilities.",
		cost: { currency: "core", amount: 5 },
		includedFacilities: {},
		isLot: true,
		benefit:
			"A blank, build-ready parcel — no wings raised, no compromises inherited. The guild builds its hall exactly as it chooses.",
		source_book: "Rift Ascendant Canon",
	},
];
