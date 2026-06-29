import {
	type SandboxNPC,
	sandboxRecruitableNPCs,
} from "@/data/compendium/sandbox-npcs";

// Sub-module imports - 39 chapters, 24 handouts, 20 campaign scenes
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
// "Run Silent"
//
// A full-length S-Rank Rift Interior survival / psychological horror campaign for
// Levels 1-15: a first-entry Ascendant team, trapped behind a sealed threshold,
// hunted by an unseen apex predator (the Quiet) it cannot fight — only survive,
// learn the natives' rules and wards, and escape (or, gated and late, kill).
// Automatically populates the Campaign Wiki and Handouts.
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

export const massiveSandboxModule: SandboxModule = {
	id: "sandbox-shadow-regent",
	// v9: RA-accuracy pass — Regent is non-human (Kael Voss Anchor, the "once
	// human" past reframed as the Domain's curated bait), Bureau is honest-but-
	// overwhelmed (not a liar), first-entry provisional-rank onset, Levels 1-15,
	// and the flat 14-day clock rescaled to a multi-stage Rift Break track.
	// v8: restores player handouts to the Gloamreach naming scheme so imports
	// no longer surface Thornwake, Hollow Choir, Gallows Road, or old camp labels.
	// v7: restores the 20-scene Gloamreach map list and updates NPC token routing.
	// v6: restored the full Gloamreach scale rewrite across chapters, quests,
	// factions, NPCs, encounters, timeline, Warden notes, and loot after revert.
	// v5: reasserted Gloamreach-only canon and removed Subject Zero from module text.
	// v4: full Gloamreach Rift Interior rewrite.
	// v3: added the prior world lore sourcebook chapter.
	// v2: expanded injector seeds sessions, warden notes, NPCs, encounters,
	// quests, factions, loot, timeline, audio tracks, and pinned assets.
	// v11: full Regent→Quiet content sweep complete — all 42 chapters + every data
	// file reframed (NPCs incl. the worn-dead cast that replaced the Regent's Court,
	// encounters, quests, loot, timeline, handouts, scenes, sessions, factions,
	// warden secrets); rescaled to Levels 1-10; finale is the Threshold
	// (escape / kill the Quiet / become). Bumped to force injector re-import.
	// v10: spine rework — "Run Silent." The gothic domain-lord campaign is recast
	// as survival/psychological horror. The party are the first-entry team; the
	// threshold seals; an unseen apex predator (the Quiet) hunts them by noise,
	// light, and Essence. No throne/court/citadel-rule, no Oracle reading, no
	// collect-the-Claims; survive, learn the natives' wards, escape (gated kill).
	version: 11,
	title: "Run Silent",
	description:
		"A full-length S-Rank Rift Interior survival and psychological horror campaign for Levels 1-10, set inside the Gloamreach: a country-sized Rift Interior, old and inhabited, behind a threshold that seals the moment the first-ever Ascendant team crosses it. There is no lord to dethrone — there is the Quiet, an unseen apex predator that hunts by noise, light, and the use of Essence, wears the dead to lure prey, and cannot be cleared, only survived or fled. The party must learn how the natives live behind their wards and rules, keep each other alive and sane against a rising Hunt and Dread, and find the way out — or, late and well-earned, take the one chance to put the Quiet down for good.",
	chapters: sandboxWikiChapters,
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
