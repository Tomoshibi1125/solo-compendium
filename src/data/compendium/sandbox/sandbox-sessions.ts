/**
 * SANDBOX SESSIONS — "The Shadow of the Regent"
 *
 * Scaffolded campaign sessions (Day Zero + Sessions 1-5) seeded into the
 * Sessions tab on sandbox import. Each session carries a prewritten Warden
 * recap template (authored as a session log) referencing canonical scenes,
 * NPCs, handouts. Wardens can edit freely after import — the data is a
 * starting point, not a prescription.
 *
 * Schema mirrors the `campaign_sessions` + `campaign_session_logs` tables
 * but is authored in domain-friendly fields (`sceneRefs`, `npcRefs`) that
 * the injector flattens into `metadata` JSON.
 */

export type SandboxSessionStatus =
	| "planned"
	| "in_progress"
	| "completed"
	| "cancelled";

export type SandboxSessionLogType =
	| "session"
	| "recap"
	| "loot"
	| "event"
	| "note";

export interface SandboxSessionLog {
	logType: SandboxSessionLogType;
	title: string;
	content: string;
	/** Visible to players at table. Session 0 recap = yes; warden prep = no. */
	isPlayerVisible: boolean;
}

export interface SandboxSession {
	title: string;
	description: string;
	status: SandboxSessionStatus;
	/** Ordering index used to derive stable `scheduled_for` offsets. */
	order: number;
	/** Recommended party level heading into the session. */
	recommendedLevel: number;
	/** Names of canonical sandbox scenes this session centers on. */
	sceneRefs: string[];
	/** Names of canonical sandbox NPCs expected to appear. */
	npcRefs: string[];
	/** Prewritten Warden notes / recap templates — one per log type. */
	logs: SandboxSessionLog[];
}

export const sandboxSessions: SandboxSession[] = [
	{
		title: "Session 0 — Day Zero: The Memory-Care Wing",
		description:
			"Introductory adventure. The party awakens in the Memory-Care Wing of Sanctuary Medical with no memory of the Gate Cascade. They meet the Diagnosed in the R5 mirror-cell, and begin the long climb out of the Restricted Zone. Level 1. One session (~4 hours). Concludes when the party steps through the blast doors into the Bureau District.",
		status: "planned",
		order: 0,
		recommendedLevel: 1,
		sceneRefs: [
			"Day Zero: Memory-Care Wing Exterior",
			"Day Zero: The Diagnosed's Mirror (R5)",
		],
		npcRefs: [],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — Session 0 Beats",
				content: [
					"## Opening Beat — Reveille",
					"Begin in fluorescent-washed silence. Each PC wakes strapped to a gurney in Memory-Care Wing — monitors flatlined, staff gone, emergency lighting cycling amber.",
					"",
					"## Beat 1 — The Diagnosed",
					"Introduce the R5 Mirror: a one-way glass cell housing a chained figure whose reflection is several seconds delayed. The Diagnosed speaks only in echoes of the party's own thoughts. Mechanical hook: reading the chart reveals each PC's _true_ name (Warden chooses) — the start of the Identity-Erosion mystery.",
					"",
					"## Beat 2 — Escape Corridor",
					"Mana-warped janitor-Anomaly blocks the exit. Use as tutorial combat — one round of advantage to let the party taste their kit before HP pressure ramps up.",
					"",
					"## Beat 3 — Blast Doors",
					"Bureau Sentinels breach from the other side. Commander Park is OFF-SCREEN here — introduced in Session 1. End on a Bureau medic offering blankets + a vague promise of 'answers in the District.'",
					"",
					"## Hooks Forward",
					"Each PC receives a blank journal handout (matches the `Day Zero — Blank Slate Journal` handout) and 1d4 fragmented memory prompts. Seed the Identity-Erosion clock: 0 of 3.",
				].join("\n"),
				isPlayerVisible: false,
			},
			{
				logType: "recap",
				title: "Session 0 Recap (Player-Facing Template)",
				content: [
					"You woke in a place that was trying very hard to look like a hospital.",
					"",
					"The charts knew things about you that you didn't. The mirror in R5 spoke back. And whatever had been the janitor on the night shift had become something that did not, strictly speaking, die when you hit it enough times.",
					"",
					"You walked out through blast doors into a District the sky had abandoned. The Bureau said you were safe now. You are not sure you believe them.",
					"",
					"_Fill in details at the table; this is a scaffold._",
				].join("\n"),
				isPlayerVisible: true,
			},
		],
	},
	{
		title: "Session 1 — The Hollow Subway (E-Rank)",
		description:
			"First sanctioned Bureau contract. Party is dispatched to the Hollow Subway Gate to retrieve Squad Seven's signal beacon. Introduces Commander Park, Sergeant Yoon, and the lowest rung of the Gate-Rank ladder. Level 1-2. Concludes at a Gate Core with a minor Relic drop.",
		status: "planned",
		order: 1,
		recommendedLevel: 1,
		sceneRefs: ["Gate: The Hollow Subway (E-Rank)"],
		npcRefs: ["Commander Park Jae-won", "Sergeant Yoon Hye-jin"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — Session 1 Beats",
				content: [
					"## Briefing",
					"Commander Park, Bureau HQ briefing hall. Dry, clipped, no small talk. Objective: retrieve Squad Seven beacon from Maintenance Tunnel 7-C.",
					"",
					"## The Gate",
					"Subway Anomalies ×12-15 (random from Gate Anomaly pool). Tunnel geometry favors ambush — reward players who scout.",
					"",
					"## The Discovery",
					"Squad Seven's beacon is embedded in the _chest_ of one of the Anomalies. Seed body-horror tone: the Anomaly has Sgt. Min-ho's name tag fused into its skin. This is the first whisper of Identity-Erosion.",
					"",
					"## Exit + Reward",
					"Minor Relic roll from `E-Rank Loot Table`. Rep +1 with Bureau Sentinels.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 2 — The Drowned Ward / Fungal Depths (D-Rank)",
		description:
			"Party chooses between two D-Rank gates. Introduces factional tension: the Vermillion Guild bids against the Bureau for exclusive salvage rights. Level 2-3.",
		status: "planned",
		order: 2,
		recommendedLevel: 2,
		sceneRefs: [
			"Gate: The Drowned Ward (D-Rank)",
			"Gate: The Fungal Depths (D-Rank)",
		],
		npcRefs: ["Quartermaster Lin Mei-hua"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — Factional Pressure",
				content: [
					"Introduce the Vermillion Guild via a rival party at the gate entrance. Non-hostile but probing. This is the first decision point that locks in reputation trajectory.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 3 — The Verdant Overgrowth / Ashen Vault (C-Rank)",
		description:
			"Mid-tier gate. Introduce the Awoko Cult through cryptic graffiti and a kidnapped Bureau researcher. Level 3-5.",
		status: "planned",
		order: 3,
		recommendedLevel: 3,
		sceneRefs: [
			"Gate: The Verdant Overgrowth (C-Rank)",
			"Gate: The Ashen Vault (C-Rank)",
		],
		npcRefs: ["Dr. Serin Hayashi"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — Awoko Seed",
				content: [
					'Graffiti throughout gate: _"We are the only name that stays."_ Foreshadows the Identity-Erosion / Regent reveal. Dr. Hayashi recognizes the symbol — feed this detail via a Perception or History check.',
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 4 — Sunken Tunnels / Frozen Citadel (B-Rank)",
		description:
			"High-stakes gate. Introduce the roaming S-Rank Anomaly as a distant scream heard during the ascent — not engaged, but present. Level 5-7.",
		status: "planned",
		order: 4,
		recommendedLevel: 5,
		sceneRefs: [
			"Gate: The Sunken Tunnels (B-Rank)",
			"Gate: The Frozen Citadel (B-Rank)",
		],
		npcRefs: [],
		logs: [
			{
				logType: "event",
				title: "Roaming S-Rank Anomaly — Distant Encounter",
				content:
					"Players hear it for the first time. Do not engage. The Anomaly is patrolling the district on a 14-day timeline — see `Warden Timeline: Day 9`.",
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 5 — The Obsidian Spire + Regent's Domain (A/S-Rank)",
		description:
			"Climactic two-part finale. First session clears the Obsidian Spire (A-Rank). Second breaches the Regent's Domain (S-Rank, 15-room megadungeon). Reveals the Regent's identity and resolves the Identity-Erosion mystery. Level 8-10.",
		status: "planned",
		order: 5,
		recommendedLevel: 8,
		sceneRefs: [
			"Gate: The Obsidian Spire (A-Rank)",
			"Gate: The Regent's Domain (S-Rank)",
			"Megadungeon Floor \u22121: Outer Mausoleum (Ch. 28 Rooms 1-5)",
			"Megadungeon Floor \u22122: Archive of His Self (Ch. 28 Rooms 6-10)",
		],
		npcRefs: [],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — The Reveal",
				content: [
					"The Regent is one of the PCs' own erased selves — the party version that _never woke up_ in Day Zero. Reveal via the Archive of His Self mirror-room. This is the emotional payoff of the whole campaign.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
];
