/**
 * SANDBOX SESSIONS — "The Shadow of the Regent"
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
			"Material-side horror prelude. The party responds to a welfare check at a shuttered hospital wing inside the Bureau cordon. A pocket breach from the Gloamreach has reached through a bathroom mirror, feeding on memory and introducing the Regent's first mark. Level 1.",
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
					"The mirror opens. The Diagnosed is not a random monster. It is a symptom of the Domain reaching through the threshold.",
					"",
					"## Closing Choice",
					"Destroy the mirror and give Ms. Park clarity at the cost of lives, or seal it and leave the haunting dormant. Either choice should echo in the Citadel.",
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
		title: "Session 1 — The Gate Threshold and Hollow Subway",
		description:
			"The party receives formal Bureau clearance, crosses the S-Rank threshold, and learns the Gate is only the door. The Hollow Subway teaches that modern spaces inside the Gloamreach are masks worn by Domain law. Level 1-2.",
		status: "planned",
		order: 1,
		recommendedLevel: 1,
		sceneRefs: ["Gate Threshold", "The Hollow Subway"],
		npcRefs: ["Commander Park Jae-won", "Sergeant Yoon Hye-jin", "Rex"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — First Crossing",
				content: [
					"## Briefing",
					"Commander Park gives the mission cleanly: recover Strike Team Seven's beacon, confirm survivors, and return. Hayashi quietly warns that the topology does not behave like a normal Gate.",
					"",
					"## Threshold Beat",
					"The Gate vanishes behind the party after they cross. Do not trap them by fiat; show that the exit has become unreliable and farther away than it should be.",
					"",
					"## Hollow Subway",
					"The subway requires fare. Money works poorly. Names work too well. Give the party a way to escape by refusing identity as payment.",
					"",
					"## Discovery",
					"Squad Seven's beacon is broadcasting from a place that should not be reachable yet. Rex can appear here, trying to lead the party to a sealed door.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 2 — Road of Writs and the First Tribute",
		description:
			"The party leaves the threshold and meets the Road of Writs. A settlement's tribute reveals the core campaign horror: safety inside the Gloamreach is leased, never free. Level 2-3.",
		status: "planned",
		order: 2,
		recommendedLevel: 2,
		sceneRefs: ["Road of Writs", "Writ-Bound Hamlet", "Drowned Ledgerfen"],
		npcRefs: ["Quartermaster Lin Mei-hua", "Mika the Kid", "The Catalog"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — First Tribute",
				content: [
					"Introduce a settlement that survives by never refusing written invitations. Let the party see ordinary people treating horror as routine.",
					"",
					"The Drowned Ledgerfen can serve as the first major Domain site if the party follows survivor records, dead-team logs, or a Claim clue.",
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
			"The party reaches the Vermillion Outpost and then a settlement or Domain site where grief is being recruited. The Awoko become more than villains: they offer real comfort with predatory intent. Level 3-5.",
		status: "planned",
		order: 3,
		recommendedLevel: 3,
		sceneRefs: ["Vermillion Outpost", "Remembering Orchard", "Awoko Sanctum approach"],
		npcRefs: ["Guildmaster Orin", "Rat-King Ji", "The Hollow Mother", "Sister Veil"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — Comfort as Threat",
				content: [
					"Vermillion should be useful immediately: hot food, salvage, rumors, and a bill.",
					"",
					"In the Remembering Orchard, make tribute emotionally ugly rather than mechanically abstract. People are not only losing memories. They are losing reasons to resist.",
					"",
					"Seed the Hollow Mother's language carefully. Her followers say serve. She says inherit.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 4 — Bailiff Judgment and Bastion Golemfall",
		description:
			"The Regent's Bailiff appears publicly to enforce a charge. The party then confronts Bastion Golemfall or the Sunken Tunnels, learning that oaths and debts can survive death. Level 5-7.",
		status: "planned",
		order: 4,
		recommendedLevel: 5,
		sceneRefs: ["Road of Writs", "Bastion Golemfall", "Sunken Tunnels"],
		npcRefs: ["The Regent's Bailiff", "Commander Without a Body", "Old Man Crane"],
		logs: [
			{
				logType: "event",
				title: "Public Judgment — The Regent's Bailiff",
				content:
					"The Bailiff announces charges before violence. Make the charge specific and partly justified. The party can fight, flee, pay, redirect, or contradict the writ. This scene teaches that law is a monster here.",
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 5 — The Obsidian Spire and the Claim Race",
		description:
			"The campaign enters late midgame. The party climbs the Obsidian Spire, faces reflected temptations of authority, and races factions for one or more Claims. Level 7-9.",
		status: "planned",
		order: 5,
		recommendedLevel: 7,
		sceneRefs: ["Obsidian Spire", "Forbidden Vault", "Mana Vein Network"],
		npcRefs: ["The Watcher", "Professor Lun", "The Hollow Mother"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — Temptation Without Cheap Traps",
				content: [
					"The Spire should offer genuinely useful power. The danger is not that every bargain is fake. The danger is that the price is exact.",
					"",
					"If the party enters the Forbidden Vault, run the Unseated Law as precedent, trial, or contradiction, not as a creature.",
					"",
					"By the end of this session, the party should know which route to the Citadel is possible and what it will cost.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
	{
		title: "Session 6 — Citadel Day",
		description:
			"Final castle-scale confrontation. The party enters the Regent's Citadel, faces the Throne Court, and resolves the Anchor through breaking, sealing, transforming, or inheriting. Level 10.",
		status: "planned",
		order: 6,
		recommendedLevel: 10,
		sceneRefs: ["The Regent's Citadel", "Throne Court", "Anchor-Undercroft"],
		npcRefs: ["The Regent", "Dr. Serin Hayashi", "Commander Park Jae-won", "Old Man Crane"],
		logs: [
			{
				logType: "session",
				title: "Warden Prep — The Final Question",
				content: [
					"Start with words. The Regent receives the party as guests, criminals, claimants, or witnesses depending on the campaign.",
					"",
					"Bring back choices: meals accepted, names written, people saved, people abandoned, debts paid, guest-right honored or broken.",
					"",
					"The final question is not only whether the party can kill the Regent. It is what victory costs when the land itself believes it belongs to him.",
				].join("\n"),
				isPlayerVisible: false,
			},
		],
	},
];
