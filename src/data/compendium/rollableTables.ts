import {
	GATE_BIOMES,
	GATE_COMPLICATIONS,
	GATE_HAZARDS,
	GATE_REWARDS,
	GATE_THEMES,
	NPC_MOTIVATIONS,
	NPC_SECRETS,
	TREASURE_TIERS,
} from "@/data/wardenGeneratorContent";

export interface StaticRollableTableSource {
	id: string;
	name: string;
	description: string;
	category: "gates" | "rewards" | "npcs" | "treasure";
	group: string;
	entries: string[];
	rank?: string;
	source_book: string;
	tags?: string[];
}

const createTreasureTableId = (rank: string) =>
	`treasure-${rank.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export const rollableTables: StaticRollableTableSource[] = [
	{
		id: "rift-complications",
		name: "Rift Complications",
		description: "Complications that can destabilize an active rift encounter.",
		category: "gates",
		group: "complication",
		entries: [...GATE_COMPLICATIONS],
		source_book: "Warden's Guide",
		tags: ["rifts", "hazard", "encounter"],
	},
	{
		id: "rift-hazards",
		name: "Rift Hazards",
		description:
			"Environmental hazards and battlefield effects inside unstable rifts.",
		category: "gates",
		group: "hazard",
		entries: [...GATE_HAZARDS],
		source_book: "Warden's Guide",
		tags: ["rifts", "hazard", "environment"],
	},
	{
		id: "rift-themes",
		name: "Rift Themes",
		description: "Theme overlays that define the flavor and enemies of a rift.",
		category: "gates",
		group: "theme",
		entries: [...GATE_THEMES],
		source_book: "Warden's Guide",
		tags: ["rifts", "theme", "setting"],
	},
	{
		id: "rift-biomes",
		name: "Rift Biomes",
		description: "Biome prompts for building the physical space of a rift.",
		category: "gates",
		group: "biome",
		entries: [...GATE_BIOMES],
		source_book: "Warden's Guide",
		tags: ["rifts", "biome", "terrain"],
	},
	{
		id: "rift-rewards",
		name: "Rift Rewards",
		description: "Reward outcomes for successful rift clears and hidden finds.",
		category: "rewards",
		group: "reward",
		entries: [...GATE_REWARDS],
		source_book: "Warden's Guide",
		tags: ["rewards", "loot", "rifts"],
	},
	{
		id: "npc-motivations",
		name: "NPC Motivations",
		description: "Motivations that can quickly anchor a new NPC in play.",
		category: "npcs",
		group: "motivation",
		entries: [...NPC_MOTIVATIONS],
		source_book: "Warden's Guide",
		tags: ["npc", "motivation", "roleplay"],
	},
	{
		id: "npc-secrets",
		name: "NPC Secrets",
		description: "Hidden truths and twists that complicate NPC allegiances.",
		category: "npcs",
		group: "secret",
		entries: [...NPC_SECRETS],
		source_book: "Warden's Guide",
		tags: ["npc", "secret", "plot"],
	},
	...Object.entries(TREASURE_TIERS).map(([rank, entries]) => ({
		id: createTreasureTableId(rank),
		name: `${rank} Treasure`,
		description: `Treasure outcomes calibrated for ${rank} rifts.`,
		category: "treasure" as const,
		group: "treasure",
		entries: [...entries],
		rank,
		source_book: "Warden's Guide",
		tags: ["treasure", "loot", rank.toLowerCase()],
	})),
];
