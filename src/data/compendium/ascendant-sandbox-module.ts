import {
	type SandboxNPC,
	sandboxRecruitableNPCs,
} from "@/data/compendium/sandbox-npcs";
import type { VTTScene } from "@/types/vtt";

// Sub-module imports - 40+ chapters, 24 handouts, 14 VTT scenes
import { riftAscendantWorldLoreChapter } from "./sandbox/rift-ascendant-world-lore";
import { chaptersPart1 } from "./sandbox/sandbox-chapters-part1";
import { chaptersPart2 } from "./sandbox/sandbox-chapters-part2";
import { chaptersPart3 } from "./sandbox/sandbox-chapters-part3";
import { chaptersPart4 } from "./sandbox/sandbox-chapters-part4";
import { chaptersPart5 } from "./sandbox/sandbox-chapters-part5";
import { chaptersPart6 } from "./sandbox/sandbox-chapters-part6";
import { chaptersPart7 } from "./sandbox/sandbox-chapters-part7";
import { chaptersPart8 } from "./sandbox/sandbox-chapters-part8";
import {
	type SandboxEncounter,
	sandboxEncounters,
} from "./sandbox/sandbox-encounters";
import {
	type SandboxFaction,
	sandboxFactions,
} from "./sandbox/sandbox-factions";
import { sandboxHandoutsExpanded } from "./sandbox/sandbox-handouts";
import {
	type SandboxLootTable,
	sandboxLootTables,
} from "./sandbox/sandbox-loot";
import { type SandboxQuest, sandboxQuests } from "./sandbox/sandbox-quests";
import {
	type SandboxVTTScene,
	sandboxVTTScenesExpanded,
} from "./sandbox/sandbox-scenes";
import {
	type SandboxSession,
	sandboxSessions,
} from "./sandbox/sandbox-sessions";
import {
	type SandboxTimelineEvent,
	sandboxTimeline,
} from "./sandbox/sandbox-timeline";
import {
	type SandboxWardenNote,
	sandboxWardenNotes,
} from "./sandbox/sandbox-warden-notes";

// ============================================================================
// RIFT ASCENDANT: SANDBOX CAMPAIGN MODULE
// "The Shadow of the Regent"
//
// A non-linear S-Rank Gate Domain horror sandbox (Level 1-10).
// Automatically populates the Campaign Wiki, VTT Maps, and Handouts.
//
// 40+ Chapters - 24 Handouts - 14 VTT Scenes - 30 NPCs - 5 Factions
// ============================================================================

interface SandboxModule {
	id: string;
	title: string;
	description: string;
	/**
	 * Bump on content changes so the injector can detect re-runs and skip
	 * sections whose `(campaign_id, stable_key)` row already exists. See
	 * `useCampaignSandboxInjector` — `module_version` is written to
	 * `campaign_tool_states.sandbox_manifest` on first run.
	 */
	version: number;
	chapters: SandboxChapter[];
	scenes: (VTTScene & { audioTracks?: { url: string; name: string }[] })[];
	handouts: SandboxHandout[];
	npcs: SandboxNPC[];
	// ── New collections auto-populated into their respective tabs ───────────
	/** Seeded into `campaign_sessions` + `campaign_session_logs`. */
	sessions: SandboxSession[];
	/** Seeded into `campaign_notes` (Warden-only `is_shared=false`). */
	wardenNotes: SandboxWardenNote[];
	/** Seeded into `campaign_encounters` + `campaign_encounter_entries`. */
	encounters: SandboxEncounter[];
	/** Seeded as wiki articles with `category: "quest"`. */
	quests: SandboxQuest[];
	/** Seeded as wiki articles with `category: "faction"`. */
	factions: SandboxFaction[];
	/** Seeded as wiki articles with `category: "loot"`. */
	loot: SandboxLootTable[];
	/** Seeded as `campaign_session_logs` of `log_type: "event"`. */
	timeline: SandboxTimelineEvent[];
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
// Sourcebook lore opens the book, then Part4 leads the adventure with Chapter 0.
const [chapterZero, ...chaptersPart4Remainder] = chaptersPart4;
export const sandboxWikiChapters: SandboxChapter[] = [
	riftAscendantWorldLoreChapter,
	...(chapterZero ? [chapterZero] : []), // Chapter 0: table briefing and safety
	...chaptersPart1, // Chapters 1-5: campaign frame, Gate Domain rules, entry, travel
	...chaptersPart2, // Chapters 6-10: Threshold, Thornwake, road, weather, Vermillion
	...chaptersPart3, // Chapters 11-15: Bastion, Mill, Hollow, Works, Black Vault
	...chaptersPart4Remainder, // Chapters 16-20: Choir, Den, Reliquary, invitations, pressure
	...chaptersPart5, // Chapters 21-25: Anchor Relics and Citadel
	...chaptersPart6, // Chapters 26-30: factions, events, allies, endings
	...chaptersPart7, // Chapters 31-35: quest web, loot, Anomalies, records, campaign rhythm
	...chaptersPart8, // Chapters 36-40: scenes, tables, timeline, terms, quick start
];

// ── Handouts ─────────────────────────────────────────────────────────────────
export const sandboxHandouts: SandboxHandout[] = sandboxHandoutsExpanded;

// ── VTT Scenes ───────────────────────────────────────────────────────────────
export const sandboxVTTScenes: SandboxVTTScene[] = sandboxVTTScenesExpanded;

// ── Final export: the complete module ────────────────────────────────────────
export const massiveSandboxModule: SandboxModule = {
	id: "sandbox-shadow-regent",
	// v4: full Gloamreach Gate Domain rewrite.
	// v3: added the prior world lore sourcebook chapter.
	// v2: expanded injector seeds sessions, warden notes, characters (NPCs as
	// warden-claimed rows), encounters, quests, factions, loot, timeline, plus
	// VTT audio tracks and pinned assets. Older campaigns imported on v1 will
	// run the new sections on next auto-populate click.
	version: 4,
	title: "The Shadow of the Regent",
	description:
		"A full Rift Ascendant horror sandbox (Level 1-10) set inside the Gloamreach, a country-sized S-Rank Gate Domain beyond a sealed Rift. Features 40+ lore chapters, 30 NPCs across 5 factions, 14 VTT scenes, 24 handouts, 7 scaffolded sessions, 12 encounter decks, 12 quests, 6 Rank loot tables, a 14-day Blue Phase clock, Anchor Scan randomization, Anchor Relics, Subject Zero bargains, and a tyrannical Regent whose Citadel is visible from the first road.",
	chapters: sandboxWikiChapters,
	scenes: sandboxVTTScenes,
	handouts: sandboxHandouts,
	npcs: sandboxRecruitableNPCs,
	sessions: sandboxSessions,
	wardenNotes: sandboxWardenNotes,
	encounters: sandboxEncounters,
	quests: sandboxQuests,
	factions: sandboxFactions,
	loot: sandboxLootTables,
	timeline: sandboxTimeline,
};
