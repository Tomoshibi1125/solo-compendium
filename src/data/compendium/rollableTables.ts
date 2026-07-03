import {
	NPC_MOTIVATIONS,
	NPC_SECRETS,
	RIFT_BIOMES,
	RIFT_COMPLICATIONS,
	RIFT_HAZARDS,
	RIFT_REWARDS,
	RIFT_THEMES_ANNOTATED,
	TREASURE_TIERS,
} from "@/data/wardenGeneratorContent";
import { createUniformDiceFormula } from "@/lib/rollableTables";

export interface StaticRollableTableSource {
	id: string;
	name: string;
	description: string;
	category: "Rifts" | "rewards" | "npcs" | "treasure";
	group: string;
	diceFormula: string;
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
		category: "Rifts",
		group: "complication",
		diceFormula: createUniformDiceFormula(RIFT_COMPLICATIONS.length) ?? "1d0",
		entries: [...RIFT_COMPLICATIONS],
		source_book: "Rift Ascendant Canon",
		tags: ["rifts", "hazard", "encounter"],
	},
	{
		id: "rift-hazards",
		name: "Rift Hazards",
		description:
			"Environmental hazards and battlefield effects inside unstable rifts.",
		category: "Rifts",
		group: "hazard",
		diceFormula: createUniformDiceFormula(RIFT_HAZARDS.length) ?? "1d0",
		entries: [...RIFT_HAZARDS],
		source_book: "Rift Ascendant Canon",
		tags: ["rifts", "hazard", "environment"],
	},
	{
		id: "rift-themes",
		name: "Rift Themes",
		description: "Theme overlays that define the flavor and enemies of a rift.",
		category: "Rifts",
		group: "theme",
		diceFormula:
			createUniformDiceFormula(RIFT_THEMES_ANNOTATED.length) ?? "1d0",
		entries: [...RIFT_THEMES_ANNOTATED],
		source_book: "Rift Ascendant Canon",
		tags: ["rifts", "theme", "setting"],
	},
	{
		id: "rift-biomes",
		name: "Rift Biomes",
		description: "Biome prompts for building the physical space of a rift.",
		category: "Rifts",
		group: "biome",
		diceFormula: createUniformDiceFormula(RIFT_BIOMES.length) ?? "1d0",
		entries: [...RIFT_BIOMES],
		source_book: "Rift Ascendant Canon",
		tags: ["rifts", "biome", "terrain"],
	},
	{
		id: "rift-rewards",
		name: "Rift Rewards",
		description: "Reward outcomes for successful rift clears and hidden finds.",
		category: "rewards",
		group: "reward",
		diceFormula: createUniformDiceFormula(RIFT_REWARDS.length) ?? "1d0",
		entries: [...RIFT_REWARDS],
		source_book: "Rift Ascendant Canon",
		tags: ["rewards", "loot", "rifts"],
	},
	{
		id: "npc-motivations",
		name: "NPC Motivations",
		description: "Motivations that can quickly anchor a new NPC in play.",
		category: "npcs",
		group: "motivation",
		diceFormula: createUniformDiceFormula(NPC_MOTIVATIONS.length) ?? "1d0",
		entries: [...NPC_MOTIVATIONS],
		source_book: "Rift Ascendant Canon",
		tags: ["npc", "motivation", "roleplay"],
	},
	{
		id: "npc-secrets",
		name: "NPC Secrets",
		description: "Hidden truths and twists that complicate NPC allegiances.",
		category: "npcs",
		group: "secret",
		diceFormula: createUniformDiceFormula(NPC_SECRETS.length) ?? "1d0",
		entries: [...NPC_SECRETS],
		source_book: "Rift Ascendant Canon",
		tags: ["npc", "secret", "plot"],
	},
	...Object.entries(TREASURE_TIERS).map(([rank, entries]) => ({
		id: createTreasureTableId(rank),
		name: `${rank} Treasure`,
		description: `Treasure outcomes calibrated for ${rank} rifts.`,
		category: "treasure" as const,
		group: "treasure",
		diceFormula: createUniformDiceFormula(entries.length) ?? "1d0",
		entries: [...entries],
		rank,
		source_book: "Rift Ascendant Canon",
		tags: ["treasure", "loot", rank.toLowerCase()],
	})),
];
