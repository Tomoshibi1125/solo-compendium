import {
	type SandboxNPC,
	sandboxRecruitableNPCs,
} from "@/data/compendium/sandbox-npcs";
import type { VTTScene } from "@/types/vtt";

// Sub-module imports — 23 chapters, 11 handouts, 11 VTT scenes
import { chaptersPart1 } from "./sandbox/sandbox-chapters-part1";
import { chaptersPart2 } from "./sandbox/sandbox-chapters-part2";
import { chaptersPart3 } from "./sandbox/sandbox-chapters-part3";
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
// 23 Chapters • 11 Handouts • 11 VTT Scenes • 40+ NPCs • 3 Factions
// ============================================================================

export interface SandboxModule {
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

// ── Combined chapter array (all 23 chapters in order) ────────────────────────
export const sandboxWikiChapters: SandboxChapter[] = [
	...chaptersPart1, // Chapters 1-8: Briefing, Divination, City, Factions, Hubs, Downtime, E-Rank Gate
	...chaptersPart2, // Chapters 9-16: D through S-Rank Gates + Final Boss
	...chaptersPart3, // Chapters 17-23: Executioner, Side Quests, NPC Roster, Relics, Encounters, Treasure, Warden Guide
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
		"A massive open-world sandbox campaign (Level 1-10) set in a modern city district overwhelmed by a Gate Surge. Features 23 lore-rich chapters, 40+ unique NPCs across 3 factions, 11 VTT maps, random encounter tables, a roaming S-Rank Anomaly, Regent Relic mechanics, and a non-linear story driven by player choice. Inspired by Solo Leveling.",
	chapters: sandboxWikiChapters,
	scenes: sandboxVTTScenes,
	handouts: sandboxHandouts,
	npcs: sandboxRecruitableNPCs,
};
