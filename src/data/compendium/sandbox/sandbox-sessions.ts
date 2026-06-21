/**
 * SANDBOX SESSIONS — "Run Silent"
 *
 * Scaffolded campaign sessions seeded into the Sessions tab on sandbox import.
 * Each entry is a Warden-editable starting point, not a fixed railroad.
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
			"Material-side horror prelude. The party responds to a welfare check at a shuttered hospital wing inside the Bureau cordon. A pocket breach from the Gloamreach has reached through a bathroom mirror, feeding on memory and introducing the Quiet's first mark. Level 1.",
		status: "planned",
		order: 0,
		recommendedLevel: 1,
		sceneRefs: [
			"Day Zero: Memory-Care Wing Exterior",
			"Day Zero: The Diagnosed's Mirror (R5)",
		],
		npcRefs: ["Dr. Serin Hayashi"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — Day Zero Beats",
				content: [
					"## Opening Beat — Welfare Check",
					"Begin outside the cordoned hospital wing. The Bureau has larger teams staging for the S-Rank threshold, so the party gets the ugly small job: twenty-three elderly residents, six staff, no response.",
					"",
					"## Beat 1 — The Visitors' Log",
					"The log is already beginning to write a party member's name. Let the players learn that names and records are dangerous before they enter the Gloamreach.",
					"",
					"## Beat 2 — Ms. Park Jeong-hye",
					"She repeats: 'He was supposed to come home for lunch.' She remembers a husband, a uniform, and pride. She cannot remember his name.",
					"",
					"## Beat 3 — The Diagnosed",
					"The mirror opens. The Diagnosed is not a random monster. It is the Gloamreach reaching through the threshold.",
					"",
					"## Closing Choice",
					"Destroy the mirror and give Ms. Park clarity at the cost of lives, or seal it and leave the haunting dormant. Either choice should echo all the way to the Threshold.",
				].join("\n"),
				isPlayerVisible: false,
			},
			{
				logType: "recap",
				title: "Session 0 Recap (Player-Facing Template)",
				content: [
					"You entered a hospital wing that was trying very hard to stay ordinary.",
					"",
					"The visitors' log knew too much. The hallway stretched when you chased the wrong answer. Ms. Park remembered love but not the name attached to it. Then the mirror opened, and something made of forgotten faces tried to climb through.",
					"",
					"The Bureau called it a pocket breach. Hayashi looked at the cracked glass and called it a warning.",
					"",
					"_Fill in table-specific details after play._",
				].join("\n"),
				isPlayerVisible: true,
			},
		],
	},
	{
		title: "Session 1 — The Rift Threshold and Hollow Way",
		description:
			"The party receives formal Bureau clearance, crosses the S-Rank threshold, and learns the Rift is only the door. The Hollow Way teaches that the Gloamreach learns your name on arrival and carries you inward whether you will it or not — and that leaving is harder than entering. Level 1-3.",
		status: "planned",
		order: 1,
		recommendedLevel: 1,
		sceneRefs: ["Rift Threshold", "The Hollow Way"],
		npcRefs: ["Commander Park Jae-won", "Sergeant Yoon Hye-jin", "Rex"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — First Crossing",
				content: [
					"## Briefing",
					"Commander Park gives the mission cleanly: recover Strike Team Seven's beacon, confirm survivors, and return. Hayashi quietly warns that the topology does not behave like a normal Rift.",
					"",
					"## Threshold Beat",
					"The Rift vanishes behind the party after they cross. Do not trap them by fiat; show that the exit has become unreliable and farther away than it should be.",
					"",
					"## Hollow Way",
					"The Hollow Way counts passage in names, not coin: money works poorly, names work too well. Give the party a way through that does not pay with identity — a false name, a shared one, or breaking the Name-Gate's counting-script.",
					"",
					"## Discovery",
					"Squad Seven's beacon is broadcasting from a place that should not be reachable yet. Rex can appear here, trying to lead the party to a sealed door.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 2 — The Old Roads and the First Loss",
		description:
			"The party leaves the threshold and meets the old roads. A warded community reveals the core campaign horror: safety inside the Gloamreach is borrowed, never free. Level 3-5.",
		status: "planned",
		order: 2,
		recommendedLevel: 3,
		sceneRefs: ["The Old Roads", "Warded Hamlet", "Drowned Ledgerfen"],
		npcRefs: ["Quartermaster Lin Mei-hua", "Mika the Kid", "The Catalog"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — First Tribute",
				content: [
					"Introduce a community that survives by never saying 'no' aloud after dark. Let the party see ordinary people treating horror as routine.",
					"",
					"The Drowned Ledgerfen can serve as the first major Gloamreach site if the party follows survivor records, dead-team logs, or a Means clue.",
					"",
					"End with either a saved civilian, a corrected record, or the first hint that a record can become true if not contradicted.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 3 — Vermillion, the Orchard, and the Awoko Seed",
		description:
			"The party reaches the Vermillion Outpost and then a settlement or Domain site where grief is being recruited. The Awoko become more than villains: they offer real comfort with predatory intent. Level 5-7.",
		status: "planned",
		order: 3,
		recommendedLevel: 5,
		sceneRefs: [
			"Vermillion Outpost",
			"Remembering Orchard",
			"Awoko Sanctum approach",
		],
		npcRefs: [
			"Guildmaster Orin",
			"Rat-King Ji",
			"The Hollow Mother",
			"Sister Veil",
		],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — Comfort as Threat",
				content: [
					"Vermillion should be useful immediately: hot food, salvage, rumors, and a bill.",
					"",
					"In the Remembering Orchard, make the orchard's price emotionally ugly rather than mechanically abstract. People are not only losing memories. They are losing reasons to resist.",
					"",
					"Seed the Hollow Mother's language carefully. Her followers say serve. She says become.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 4 — The First Taking and Bastion Golemfall",
		description:
			"The Quiet takes someone in the open, through the worn dead, and the party can only watch or run. They then confront Bastion Golemfall or the Sunken Tunnels, learning that oaths and debts can survive death. Level 7-9.",
		status: "planned",
		order: 4,
		recommendedLevel: 7,
		sceneRefs: ["The Old Roads", "Bastion Golemfall", "Sunken Tunnels"],
		npcRefs: ["The Worn", "Commander Without a Body", "Old Man Crane"],
		logs: [
			{
				logType: "event",
				title: "The First Taking — The Worn Dead",
				content:
					"The worn dead speak names before they take. Make the one they have come for specific, and the loss land. The party can flee, hide, give the dark what it came for, or fight uselessly. This scene teaches that some things here cannot be fought, only escaped.",
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 5 — The Obsidian Spire and the Deep Places",
		description:
			"The campaign enters late midgame. The party climbs the Obsidian Spire, faces reflected temptations to stop being prey, and gathers the first pieces of the Means. Level 8-9.",
		status: "planned",
		order: 5,
		recommendedLevel: 10,
		sceneRefs: ["Obsidian Spire", "The Deep Places", "Mana Vein Network"],
		npcRefs: ["The Watcher", "Professor Lun", "The Hollow Mother"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — Temptation Without Cheap Traps",
				content: [
					"The Spire should offer genuinely useful power. The danger is not that every bargain is fake. The danger is that the price is exact.",
					"",
					"If the party enters the Deep Places, run the Old Power Below as a trial, a bargain, or a buried truth, not as a creature.",
					"",
					"By the end of this session, the party should know which route to the Threshold is possible and what it will cost.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 6 — The Long Dark and the Threshold",
		description:
			"The final crossing. The party make the deep-dark journey to the sealed Threshold, face the gathered worn dead and the Quiet's lure, and either escape or make the one gated-kill stand. Level 9-10.",
		status: "planned",
		order: 6,
		recommendedLevel: 13,
		sceneRefs: ["The Threshold", "The Gathered Dead", "The Deep Undercroft"],
		npcRefs: [
			"The Quiet",
			"Dr. Serin Hayashi",
			"Commander Park Jae-won",
			"Old Man Crane",
		],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — The Final Question",
				content: [
					"Start with dread, not initiative. The Quiet meets the party wearing the dead — every face they lost, offering rest, the way out, each other made whole.",
					"",
					"Bring back choices: who they saved, who they abandoned, which wards they kept, which names they gave away, which of their dead the Quiet now wears.",
					"",
					"The final question is not only whether the party can kill the Quiet. It is what they kept alive — others, and themselves — and what it cost.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
];
