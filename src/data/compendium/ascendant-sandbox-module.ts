import {
	type SandboxNPC,
	sandboxRecruitableNPCs,
} from "@/data/compendium/sandbox-npcs";
import type { VTTScene } from "@/types/vtt";

// Sub-module imports — 37 chapters, 24 handouts, 20 VTT scenes
import { chaptersPart1 } from "./sandbox/sandbox-chapters-part1";
import { chaptersPart2 } from "./sandbox/sandbox-chapters-part2";
import { chaptersPart3 } from "./sandbox/sandbox-chapters-part3";
import { chaptersPart4 } from "./sandbox/sandbox-chapters-part4";
import { chaptersPart5 } from "./sandbox/sandbox-chapters-part5";
import { chaptersPart6 } from "./sandbox/sandbox-chapters-part6";
import { chaptersPart7 } from "./sandbox/sandbox-chapters-part7";
import { chaptersPart8 } from "./sandbox/sandbox-chapters-part8";
import { sandboxHandoutsExpanded } from "./sandbox/sandbox-handouts";
import {
	type SandboxVTTScene,
	sandboxVTTScenesExpanded,
} from "./sandbox/sandbox-scenes";

// ============================================================================
// RIFT ASCENDANT: SANDBOX CAMPAIGN MODULE
// "The Shadow of the Regent"
//
// A non-linear open-world sandbox (Level 1-10).
// Automatically populates the Campaign Wiki, VTT Maps, and Handouts.
//
// 37 Chapters • 24 Handouts • 20 VTT Scenes • 43 NPCs (all 14 canonical Jobs) • 5 Factions
// ============================================================================

interface SandboxModule {
	id: string;
	title: string;
	description: string;
	chapters: SandboxChapter[];
	scenes: (VTTScene & { audioTracks?: { url: string; name: string }[] })[];
	handouts: SandboxHandout[];
	npcs: SandboxNPC[];
}

export interface SandboxHandout {
	title: string;
	content: string;
	visibleToPlayers: boolean;
	category: string;
}

export interface SandboxChapter {
	title: string;
	content: string; // The markdown for the wiki article
}

// ── Combined chapter array (ordered for reading flow) ───────────────────────
// Part4 leads with Chapter 0 (Day Zero — The Memory-Care Wing), so it goes FIRST.
const [chapterZero, ...chaptersPart4Remainder] = chaptersPart4;
export const sandboxWikiChapters: SandboxChapter[] = [
	...(chapterZero ? [chapterZero] : []), // Chapter 0: Day Zero — The Memory-Care Wing (Intro Adventure)
	...chaptersPart1, // Chapters 1-8: Briefing, Divination, City, Factions, Hubs, Downtime, E-Rank Gate
	...chaptersPart2, // Chapters 9-16: D through S-Rank Gates + Final Boss
	...chaptersPart3, // Chapters 17-23: Executioner, Side Quests, NPC Roster, Relics, Encounters, Treasure, Warden Guide
	...chaptersPart4Remainder, // Chapters 24-26: Mana Reading, Ascendant Hooks, Stat Blocks Appendix
	...chaptersPart5, // Chapters 27-28: Artifacts Cross-Reference, Regent's Domain 15-Room Megadungeon
	...chaptersPart6, // Chapters 29-30: Bureau HQ Keyed Rooms, Vermillion Guild Hall Keyed Rooms
	...chaptersPart7, // Chapters 31-33: Outer Slums, Mana Vein Network, Awoko Sanctum
	...chaptersPart8, // Chapters 34-36: Runes Cross-Reference, Random Encounter Tables, 14-Day District Timeline
];

// ── Handouts ─────────────────────────────────────────────────────────────────
export const sandboxHandouts: SandboxHandout[] = sandboxHandoutsExpanded;

// ── VTT Scenes ───────────────────────────────────────────────────────────────
export const sandboxVTTScenes: SandboxVTTScene[] = sandboxVTTScenesExpanded;

// ── Final export: the complete module ────────────────────────────────────────
export const massiveSandboxModule: SandboxModule = {
	id: "sandbox-shadow-regent",
	title: "The Shadow of the Regent",
	description:
		"A massive open-world sandbox campaign (Level 1-10) set in a modern city district overwhelmed by a Gate Surge. Features 37 lore-rich chapters, 43 unique NPCs spanning all 14 canonical Rift Ascendant Jobs across 5 factions, 20 VTT maps, 24 handouts including 5 Warden secrets, the 15-room Regent's Domain megadungeon, the Awoko Sanctum cult HQ, random encounter tables, Bureau + Vermillion keyed hubs, a 14-day district timeline, a roaming S-Rank Anomaly, Regent Relic mechanics, and a non-linear story driven by player choice. Built to Curse of Strahd scale with gothic-horror body-horror tone. Inspired by Solo Leveling; 100% aligned to Rift Ascendant canon (pantheon of 12 Eternals, canonical Relics/Artifacts/Sigils/Tattoos/Shadow Soldiers/Anomalies all name-linked to source compendia).",
	chapters: sandboxWikiChapters,
	scenes: sandboxVTTScenes,
	handouts: sandboxHandouts,
	npcs: sandboxRecruitableNPCs,
};
