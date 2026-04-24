/**
 * SANDBOX LOOT TABLES — "The Shadow of the Regent"
 *
 * One loot table per Gate rank (E through S). Entries are weighted; the
 * Warden rolls on the encounter's `lootTableId` to produce a specific
 * drop. Seeded as wiki articles with `category: "loot"` so Wardens can
 * surface a dedicated Loot filter.
 */

export type SandboxLootRank = "E" | "D" | "C" | "B" | "A" | "S";

export interface SandboxLootEntry {
	name: string;
	rarity: "common" | "uncommon" | "rare" | "very-rare" | "legendary";
	weight: number;
	description: string;
}

export interface SandboxLootTable {
	id: string;
	rank: SandboxLootRank;
	title: string;
	description: string;
	entries: SandboxLootEntry[];
}

export const sandboxLootTables: SandboxLootTable[] = [
	{
		id: "loot-e",
		rank: "E",
		title: "E-Rank Loot Table — Hollow Gates",
		description:
			"Low-tier drops from Hollow Subway and equivalent E-Rank gates. Civilian-grade mana gear.",
		entries: [
			{
				name: "Bureau Field Kit",
				rarity: "common",
				weight: 30,
				description: "3 charges Cure Light, DC 12 stabilization.",
			},
			{
				name: "Spark Sigil",
				rarity: "common",
				weight: 25,
				description: "Single-use: cast `shocking grasp` at caster level 1.",
			},
			{
				name: "Anomaly Essence (Minor)",
				rarity: "common",
				weight: 20,
				description: "Trade for 50 gp at any Bazaar booth.",
			},
			{
				name: "Frayed Ward Tattoo",
				rarity: "uncommon",
				weight: 15,
				description: "Advantage on first INT save per long rest.",
			},
			{
				name: "Subway Relic Fragment",
				rarity: "uncommon",
				weight: 10,
				description: "Part 1/3 of a B-Rank Relic build chain.",
			},
		],
	},
	{
		id: "loot-d",
		rank: "D",
		title: "D-Rank Loot Table — Drowned Growth",
		description: "Mid-low tier drops from Drowned Ward / Fungal Depths.",
		entries: [
			{
				name: "Surgical Sigil",
				rarity: "uncommon",
				weight: 25,
				description: "Single-use: heal 3d8 + CON mod to ally.",
			},
			{
				name: "Mycelium Tattoo",
				rarity: "uncommon",
				weight: 20,
				description: "Resistance to poison for 1 hour, once per long rest.",
			},
			{
				name: "Bureau Redacted File (Fragment)",
				rarity: "rare",
				weight: 10,
				description: "Lore clue + possible Secret 2 chain unlock.",
			},
			{
				name: "Brine Salve",
				rarity: "common",
				weight: 30,
				description: "Ends one disease on consumption.",
			},
			{
				name: "Cult Pamphlet (Awoko)",
				rarity: "common",
				weight: 15,
				description: "Reveals Secret 3 foreshadow.",
			},
		],
	},
	{
		id: "loot-c",
		rank: "C",
		title: "C-Rank Loot Table — Overgrown Ashes",
		description: "Mid tier. First real rare drops start here.",
		entries: [
			{
				name: "Thornsteel Relic Fragment",
				rarity: "rare",
				weight: 15,
				description: "Part of Thornsteel Chain (complete at A-Rank).",
			},
			{
				name: "Fireweave Runes",
				rarity: "uncommon",
				weight: 25,
				description: "+1d6 fire on next attack this short rest.",
			},
			{
				name: "Sanctuary Medical Key",
				rarity: "rare",
				weight: 10,
				description: "Unlocks Memory-Care Wing record caches.",
			},
			{
				name: "Verdant Sigil",
				rarity: "uncommon",
				weight: 20,
				description: "Plant growth at will, once per day.",
			},
			{
				name: "Soul-Jar (Empty)",
				rarity: "very-rare",
				weight: 5,
				description: "Used to extract the Min-ho mind (Secret 4).",
			},
			{
				name: "Anomaly Essence (Rare)",
				rarity: "rare",
				weight: 15,
				description: "Trade for 500 gp.",
			},
			{
				name: "Cultist Diary (Awoko, redacted)",
				rarity: "rare",
				weight: 10,
				description: "Lore + foreshadow.",
			},
		],
	},
	{
		id: "loot-b",
		rank: "B",
		title: "B-Rank Loot Table — Pressure Frost",
		description:
			"High-mid tier. Fragments begin combining into complete Relics.",
		entries: [
			{
				name: "Pressure Sigil",
				rarity: "rare",
				weight: 20,
				description: "Water breathing + swim speed for 1 hour.",
			},
			{
				name: "Frostweave Relic Fragment",
				rarity: "rare",
				weight: 15,
				description: "Part of Frostweave Chain.",
			},
			{
				name: "Awoko Herald's Letter",
				rarity: "rare",
				weight: 10,
				description: "Reveal Herald path; flag Secret 3.",
			},
			{
				name: "Thornsteel Weapon (Completed)",
				rarity: "very-rare",
				weight: 5,
				description: "+2 Melee, deals 1d6 necrotic on crit.",
			},
			{
				name: "Bureau Signet Ring",
				rarity: "rare",
				weight: 15,
				description: "+2 Rep Bureau on wear.",
			},
			{
				name: "Aether-Charged Crystal",
				rarity: "rare",
				weight: 25,
				description: "Recharges one sigil or one rune once per long rest.",
			},
			{
				name: "Map to a Sanctuary Cache",
				rarity: "uncommon",
				weight: 10,
				description: "Leads to a stash of C-rank loot.",
			},
		],
	},
	{
		id: "loot-a",
		rank: "A",
		title: "A-Rank Loot Table — Obsidian Mirrors",
		description: "High tier. Legendary drops possible.",
		entries: [
			{
				name: "Obsidian Prism",
				rarity: "legendary",
				weight: 5,
				description:
					"Requires full Obsidian Spire clear. Grants reflection-based reaction.",
			},
			{
				name: "Mirror-Self Shard",
				rarity: "very-rare",
				weight: 15,
				description:
					"Once per long rest: take a level 1 version of your own form as a reaction.",
			},
			{
				name: "Frostweave Relic (Completed)",
				rarity: "very-rare",
				weight: 10,
				description: "+2 AC / +cold resistance.",
			},
			{
				name: "Sanctuary Diagnosed Log",
				rarity: "rare",
				weight: 15,
				description: "Reveal Secret 1 foreshadow (direct mention).",
			},
			{
				name: "Awoko Sigil-Tattoo (High)",
				rarity: "rare",
				weight: 15,
				description:
					"Requires Awoko Trusted tier. Nullifies one Identity-Erosion gain.",
			},
			{
				name: "Relic Forge Pattern",
				rarity: "rare",
				weight: 25,
				description: "Combine 3 fragments into a complete Relic.",
			},
			{
				name: "Bureau Prosthesis Blueprint",
				rarity: "rare",
				weight: 15,
				description: "Crafting recipe for mana-reinforced prosthetic.",
			},
		],
	},
	{
		id: "loot-s",
		rank: "S",
		title: "S-Rank Loot Table — Regent's Reward",
		description:
			"Campaign-end drops. Small table — the Regent Relic alone is the headline reward.",
		entries: [
			{
				name: "Regent Relic (Shadow Soldier Pact)",
				rarity: "legendary",
				weight: 40,
				description: "Unlocks Shadow Soldier summoning. Campaign-defining.",
			},
			{
				name: "Memory-Care Wing Master Key",
				rarity: "legendary",
				weight: 15,
				description: "Shutters the Wing permanently. Narrative resolution.",
			},
			{
				name: "Archive Mirror Shard (Named)",
				rarity: "legendary",
				weight: 15,
				description:
					"Each PC gains a personal shard that restores their name (cures Identity-Erosion permanently).",
			},
			{
				name: "The Regent's Circlet",
				rarity: "very-rare",
				weight: 10,
				description:
					"+2 to all saves; requires the Name of the Regent to attune.",
			},
			{
				name: "Shadow Fragment (raw)",
				rarity: "very-rare",
				weight: 20,
				description: "10 fragments craft into 1 Regent Relic.",
			},
		],
	},
];
