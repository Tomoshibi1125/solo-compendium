/**
 * SANDBOX QUESTS — "The Shadow of the Regent"
 *
 * Structured quest scaffolds grouped by gate rank. Seeded as wiki articles
 * with `category: "quest"` so they surface in a dedicated Wiki filter
 * alongside lore / npc / faction articles.
 */

export type SandboxQuestRank = "E" | "D" | "C" | "B" | "A" | "S";

export interface SandboxQuest {
	id: string;
	title: string;
	rank: SandboxQuestRank;
	summary: string;
	objectives: string[];
	completionTriggers: string[];
	rewardNotes: string;
	linkedFactionId?: string;
	linkedNpcName?: string;
}

export const sandboxQuests: SandboxQuest[] = [
	// ── E-Rank ──────────────────────────────────────────────────────────────
	{
		id: "q-e-01",
		title: "E-Rank: Beacon of the Lost",
		rank: "E",
		summary:
			"Squad Seven went dark in the Hollow Subway four days ago. Commander Park needs a team to retrieve their signal beacon — and answers, if any remain.",
		objectives: [
			"Infiltrate the Hollow Subway Gate",
			"Locate Maintenance Tunnel 7-C",
			"Recover the Squad Seven beacon",
		],
		completionTriggers: [
			"Beacon delivered to Commander Park (Bureau HQ).",
			"Beacon destroyed in the field (partial credit).",
		],
		rewardNotes: "500 gp stipend; Rep +1 Bureau Sentinels; minor Relic roll.",
		linkedFactionId: "bureau-sentinels",
		linkedNpcName: "Commander Park Jae-won",
	},
	{
		id: "q-e-02",
		title: "E-Rank: Supply Run Escort",
		rank: "E",
		summary:
			"Quartermaster Lin needs three crates of stabilizer serum moved from the Bureau HQ depot to the Outer Slums clinic. It is a short walk. Things in the Restricted Zone are rarely that simple.",
		objectives: [
			"Collect three serum crates",
			"Escort them to the Slums clinic",
			"Prevent Anomaly interference en route",
		],
		completionTriggers: [
			"All three crates delivered intact (full reward).",
			"Two delivered (partial reward).",
			"Clinic sacked (reputation penalty).",
		],
		rewardNotes: "Rep +1 Bureau, +1 Independent; 250 gp flat.",
		linkedNpcName: "Quartermaster Lin Mei-hua",
	},

	// ── D-Rank ──────────────────────────────────────────────────────────────
	{
		id: "q-d-01",
		title: "D-Rank: Tides Over the Ward",
		rank: "D",
		summary:
			"The Drowned Ward gate is destabilizing. A Bureau medical research team is trapped inside. Vermillion Guild bid to extract them first — the party has 48 in-game hours.",
		objectives: [
			"Enter the Drowned Ward",
			"Locate the research team (Room 4-West)",
			"Exit before the Vermillion team",
		],
		completionTriggers: [
			"Team extracted ahead of Vermillion (Rep +2 Bureau).",
			"Team extracted after Vermillion (Rep +1 both).",
			"Team lost (Rep -2 Bureau).",
		],
		rewardNotes: "Surgical Sigil + 1200 gp.",
		linkedFactionId: "bureau-sentinels",
	},
	{
		id: "q-d-02",
		title: "D-Rank: Roots of the Diagnosed",
		rank: "D",
		summary:
			"A sub-level of the Fungal Depths may contain Memory-Care Wing records. The Diagnosed's whispers point here. Retrieve whatever files survive.",
		objectives: [
			"Navigate the Fungal Depths",
			"Disable the mycelium archive wards",
			"Recover at least 3 recognizable patient files",
		],
		completionTriggers: [
			"Files delivered to the party (reveals Secret 2 path).",
		],
		rewardNotes:
			"Mycelium Tattoo + Identity-Erosion clue chain (unlocks a Session 3 beat).",
	},

	// ── C-Rank ──────────────────────────────────────────────────────────────
	{
		id: "q-c-01",
		title: "C-Rank: Faces in the Overgrowth",
		rank: "C",
		summary:
			"Awoko Cult graffiti has been spotted in the Verdant Overgrowth gate. Dr. Hayashi wants a sample — and answers.",
		objectives: [
			"Document 5 distinct Awoko sigils",
			"Extract at least 1 cult operative alive",
			"Report to Dr. Hayashi at Bureau HQ",
		],
		completionTriggers: ["At least 3 sigils + 1 operative delivered."],
		rewardNotes:
			"Awoko lore unlock (reveals Secret 3); Thornsteel Relic fragment.",
		linkedNpcName: "Dr. Serin Hayashi",
	},
	{
		id: "q-c-02",
		title: "C-Rank: Ashes of a Colleague",
		rank: "C",
		summary:
			"A Bureau researcher — Dr. Hayashi's former partner — is chained inside the Ashen Vault, used as a living relay by the vault's furnace-Anomaly. Extract before the detonation timer fires.",
		objectives: [
			"Reach the furnace chamber within 6 rounds",
			"Disable the furnace primary ignition",
			"Extract the researcher alive",
		],
		completionTriggers: [
			"Researcher alive + furnace disabled (full reward).",
			"Furnace detonates (partial + Rep penalty).",
		],
		rewardNotes:
			"Fireweave Runes; Bureau research side-quest chain unlocks; Rep +3 Bureau if clean.",
	},

	// ── B-Rank ──────────────────────────────────────────────────────────────
	{
		id: "q-b-01",
		title: "B-Rank: Pressure at the Sunken Line",
		rank: "B",
		summary:
			"A civilian commuter train was caught when the Sunken Tunnels flooded. Some fused into the Anomaly population. Most did not. This is a recovery-of-the-dead operation with legal implications.",
		objectives: [
			"Reach the main platform through rising water",
			"Identify at least 10 commuter name tags",
			"Decide the fate of the fused (mercy kill, extract, ignore)",
		],
		completionTriggers: ["10+ tags delivered; fate logged."],
		rewardNotes:
			"Pressure Sigil; reveals Secret 4 pathway; Rep shifts based on fate decision.",
	},
	{
		id: "q-b-02",
		title: "B-Rank: The Envoy at the Citadel",
		rank: "B",
		summary:
			"An Awoko Herald is broadcasting from the peak of the Frozen Citadel. The Bureau wants them silenced. The Herald wants a conversation. Both options are valid — both have consequences.",
		objectives: [
			"Reach the Citadel peak",
			"Engage the Herald (combat or Persuasion)",
			"Report resolution",
		],
		completionTriggers: [
			"Herald dead (Rep +3 Bureau, -4 Awoko).",
			"Herald turned (Rep -2 Bureau, +4 Awoko, unlocks Infiltration route).",
		],
		rewardNotes: "Frostweave Relic fragment; factional pivot point.",
	},

	// ── A-Rank ──────────────────────────────────────────────────────────────
	{
		id: "q-a-01",
		title: "A-Rank: The Mirror Climb",
		rank: "A",
		summary:
			"The Obsidian Spire's ascent requires each PC to confront a reflection-version of themselves. It is not optional — the gate geometry enforces it.",
		objectives: [
			"Ascend each of the 6 mirror rooms",
			"Resolve each PC's reflection (defeat or reconcile)",
			"Reach the summit",
		],
		completionTriggers: ["All reflections resolved."],
		rewardNotes:
			"Obsidian Prism (legendary); Identity-Erosion pressure beat (see Warden Secret 1).",
	},

	// ── S-Rank ──────────────────────────────────────────────────────────────
	{
		id: "q-s-01",
		title: "S-Rank: The Name at the Throne",
		rank: "S",
		summary:
			"The Regent's Domain has opened to the District. The 14-day timeline is ended. Confront the Regent — or be confronted.",
		objectives: [
			"Breach the Throne Room (Phase 1)",
			"Survive the Archive of His Self (Phase 2)",
			"Resolve the Name (Phase 3 — combat or parley)",
		],
		completionTriggers: [
			"The Regent falls (standard campaign end).",
			"The Regent is named and freed (secret ending — requires Identity-Erosion total \u2264 4).",
		],
		rewardNotes:
			"Regent Relic (grants Shadow Soldier pact); Memory-Care Wing shuttered; full campaign resolution.",
	},
	{
		id: "q-s-02",
		title: "S-Rank (Optional): Park's Final Watch",
		rank: "S",
		summary:
			"If the party uncovered Secret 2 (Park's signature on the Wing), Park can either sacrifice himself to collapse the Domain or defect to the Cult. This quest fires on the Day 14 climax regardless.",
		objectives: [
			"Convince Park to stand at the breach (Persuasion chain)",
			"OR confront him as an Awoko operative",
		],
		completionTriggers: ["Park's choice resolved during the Session 5 finale."],
		rewardNotes: "Emotional payoff; no mechanical reward beyond narrative.",
	},
];
