import {
	type SandboxNPC,
	sandboxRecruitableNPCs,
} from "@/data/compendium/sandbox-npcs";
import type { VTTScene } from "@/types/vtt";

// Sub-module imports - 39 chapters, 24 handouts, 20 VTT scenes
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
// A Curse of Strahd scale S-Rank Gate Domain horror sandbox for Levels 1-10.
// Automatically populates the Campaign Wiki, VTT Maps, and Handouts.
//
// 39 Chapters - 24 Handouts - 20 VTT Scenes - 42 NPCs - 5 Factions
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
	sessions: SandboxSession[];
	wardenNotes: SandboxWardenNote[];
	encounters: SandboxEncounter[];
	quests: SandboxQuest[];
	factions: SandboxFaction[];
	loot: SandboxLootTable[];
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
	content: string;
}

const [chapterZero, ...chaptersPart4Remainder] = chaptersPart4;
export const sandboxWikiChapters: SandboxChapter[] = [
	riftAscendantWorldLoreChapter,
	...(chapterZero ? [chapterZero] : []),
	...chaptersPart1,
	...chaptersPart2,
	...chaptersPart3,
	...chaptersPart4Remainder,
	...chaptersPart5,
	...chaptersPart6,
	...chaptersPart7,
	...chaptersPart8,
];

export const sandboxHandouts: SandboxHandout[] = sandboxHandoutsExpanded;

export const sandboxVTTScenes: SandboxVTTScene[] = sandboxVTTScenesExpanded;

export const massiveSandboxModule: SandboxModule = {
	id: "sandbox-shadow-regent",
	// v8: restores player handouts to the Gloamreach naming scheme so imports
	// no longer surface Thornwake, Hollow Choir, Gallows Road, or old camp labels.
	// v7: restores the 20-scene Gloamreach VTT map list and updates NPC token routing.
	// v6: restored the full Gloamreach scale rewrite across chapters, quests,
	// factions, NPCs, encounters, timeline, Warden notes, and loot after revert.
	// v5: reasserted Gloamreach-only canon and removed Subject Zero from module text.
	// v4: full Gloamreach Gate Domain rewrite.
	// v3: added the prior world lore sourcebook chapter.
	// v2: expanded injector seeds sessions, warden notes, NPCs, encounters,
	// quests, factions, loot, timeline, VTT audio tracks, and pinned assets.
	version: 8,
	title: "The Shadow of the Regent",
	description:
		"A Curse of Strahd scale mature Gate Domain horror campaign for Levels 1-10, set inside the Gloamreach: a country-sized S-Rank Gate Domain beyond a sealed Rift. The campaign is built around a visible citadel, dangerous roads, starving settlements, tribute law, Bureau failure, Vermillion pragmatism, Awoko grief-cult corruption, Anchor Relics, forbidden Unseated Law bargains, and a tyrannical Regent who appears early, studies the party, sends invitations, punishes defiance, and rules the Domain as its living Anchor.",
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
