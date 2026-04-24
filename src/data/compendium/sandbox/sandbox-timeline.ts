/**
 * SANDBOX TIMELINE — "The Shadow of the Regent"
 *
 * 14-day District timeline extracted from chapter-8 prose into structured
 * events. Seeded as `campaign_session_logs` of `log_type: "event"` anchored
 * to the Day Zero session so they surface in the Sessions tab timeline
 * view. Days are zero-indexed from campaign creation.
 *
 * The timeline FIRES regardless of party action — see Warden Secret 5.
 */

export interface SandboxTimelineEvent {
	day: number;
	title: string;
	description: string;
	factionImpact?: string;
	linkedNpcName?: string;
	linkedSceneName?: string;
}

export const sandboxTimeline: SandboxTimelineEvent[] = [
	{
		day: 0,
		title: "Day 0 — The Wing Opens",
		description:
			"Party wakes in the Memory-Care Wing. Campaign begins. Identity-Erosion clock starts at 0 for each PC.",
		linkedSceneName: "Day Zero: Memory-Care Wing Exterior",
	},
	{
		day: 2,
		title: "Day 2 — Bureau Assessment",
		description:
			"Commander Park formally assigns party a Bureau contract ID. Rep logged.",
		factionImpact: "Bureau: +1 starting Rep.",
		linkedNpcName: "Commander Park Jae-won",
	},
	{
		day: 3,
		title: "Day 3 — Supply Convoy Ambush",
		description:
			"A Bureau supply run through Outer Slums is ambushed. If party was escorting, Rep flips +2 Bureau. If not, Rep -1 Bureau (they were supposed to be available).",
		factionImpact: "Bureau Rep ±2 depending on party presence.",
		linkedSceneName: "Outer Slums: Covered Market (Ch. 31 Location 2)",
	},
	{
		day: 5,
		title: "Day 5 — The First Awoko Graffiti",
		description:
			"Party starts seeing cult graffiti in alleys. If any PC is at Identity-Erosion 1+, they see graffiti others don't. (See Warden Secret 3.)",
	},
	{
		day: 7,
		title: "Day 7 — Vermillion Exclusive Offer",
		description:
			"Guild Chair approaches with an exclusive contract: a C-Rank gate in exchange for Rep commitment. Refusing costs -2 Vermillion.",
		factionImpact: "Vermillion Rep ±2.",
	},
	{
		day: 9,
		title: "Day 9 — Distant Scream",
		description:
			"The roaming S-Rank Anomaly is sighted at the District's western edge. Not engaged. Foreshadow only.",
		linkedSceneName: "Gate: The Sunken Tunnels (B-Rank)",
	},
	{
		day: 10,
		title: "Day 10 — Diagnosed Reaches Out",
		description:
			"If the party has NOT returned to R5, the Diagnosed sends a mana-dream: all PCs share a nightmare of the Wing. One Identity-Erosion point for any PC who ignores it.",
		factionImpact: "Anomaly-Adjacent Rep +1 if party responds.",
	},
	{
		day: 11,
		title: "Day 11 — Bureau Redaction Incident",
		description:
			"A Bureau medic is publicly redacted — her name forcibly removed from all records. Independent faction up in arms. Opportunity for party to intervene.",
		factionImpact:
			"Independent Rep +2 if party stands with the medic, -3 if silent.",
	},
	{
		day: 12,
		title: "Day 12 — Awoko Mass Recruitment",
		description:
			"Cult holds a public recruitment rally in the outer slums. 30+ civilians join. If party doesn't attend or intervene, their next Awoko Rep roll auto-advances.",
		factionImpact: "Awoko Rep +2 (ambient).",
		linkedSceneName: "Awoko Sanctum: The Nave (Ch. 33 S-3)",
	},
	{
		day: 13,
		title: "Day 13 — Park's Redaction Crisis",
		description:
			"Commander Park breaks down in HQ. His classified files are briefly readable by anyone with Investigation DC 18. (See Warden Secret 2 — this is the window.)",
		linkedNpcName: "Commander Park Jae-won",
	},
	{
		day: 14,
		title: "Day 14 — S-Rank Breach (CAMPAIGN CLIMAX)",
		description:
			"The roaming S-Rank Anomaly breaches the District core. Regardless of party progress, the final encounter fires. If party has not reached the Regent's Domain voluntarily, the Domain comes to them — S-Rank crashes through Bureau HQ.",
		factionImpact: "All faction reps frozen at start of this event.",
		linkedSceneName: "Gate: The Regent's Domain (S-Rank)",
	},
];
