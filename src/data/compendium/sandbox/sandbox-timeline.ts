/**
 * SANDBOX TIMELINE — "The Shadow of the Regent"
 *
 * 14-day Gloamreach Domain pressure timeline extracted from campaign prose into
 * structured events. Seeded as `campaign_session_logs` of `log_type: "event"`.
 * Days are zero-indexed from campaign creation.
 *
 * The timeline is pressure, not a railroad. It advances the Domain's threat
 * posture and should bend around decisive party action.
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
			"The party responds to the Memory-Care Wing inside the Bureau cordon. The pocket breach reveals that the Gloamreach can reach through the threshold before the party enters it.",
		linkedSceneName: "Day Zero: Memory-Care Wing Exterior",
	},
	{
		day: 1,
		title: "Day 1 — Threshold Day",
		description:
			"The party crosses the S-Rank Gate and discovers the Gate is only the door. The exit becomes unreliable, the Road of Writs appears, and the Regent's Citadel is visible on the horizon before any map can explain it.",
		factionImpact: "Bureau +1 if the party reports the truth instead of sanitizing it.",
		linkedNpcName: "Commander Park Jae-won",
		linkedSceneName: "Gate Threshold",
	},
	{
		day: 2,
		title: "Day 2 — First Tribute",
		description:
			"A nearby settlement pays tribute. The party may witness it, interrupt it, or hear the bells after the fact. The Drowned Ledgerfen activates and begins making records legally dangerous.",
		factionImpact: "Independent Survivors +2 if the party protects civilians without exploiting them.",
		linkedSceneName: "Writ-Bound Hamlet",
	},
	{
		day: 3,
		title: "Day 3 — The Road Learns",
		description:
			"The Road of Writs begins responding to party choices. Anyone who signed a ledger, accepted guest-right, gave a true name, or carried a Claim clue feels watched.",
		linkedSceneName: "Road of Writs",
	},
	{
		day: 4,
		title: "Day 4 — Hayashi's Warning",
		description:
			"A delayed Bureau transmission reaches the party. Dr. Hayashi confirms the Gloamreach is a Regent Domain, not a normal clear site. Killing creatures will not resolve the Anchor if the law survives.",
		factionImpact: "Bureau Trusted path opens if the party shares field evidence.",
		linkedNpcName: "Dr. Serin Hayashi",
	},
	{
		day: 5,
		title: "Day 5 — The Bailiff's First Public Judgment",
		description:
			"The Regent's Bailiff collects someone from a settlement, road camp, or faction shelter. It announces charges before violence. The party can fight, flee, satisfy, redirect, or contradict the writ.",
		factionImpact:
			"Civilian trust shifts sharply based on whether the party protects the accused or lets collection happen.",
		linkedNpcName: "The Regent's Bailiff",
		linkedSceneName: "Road of Writs",
	},
	{
		day: 6,
		title: "Day 6 — The Cult Moves",
		description:
			"Awoko comfort-workers begin open recruitment in grief-dense places. The Hollow Mother sends a sermon, dream, or private message. Her followers say serve. She says inherit.",
		factionImpact: "Awoko reputation and suspicion rise. Sister Veil defection path can open.",
		linkedNpcName: "The Hollow Mother",
		linkedSceneName: "Awoko Sanctum",
	},
	{
		day: 7,
		title: "Day 7 — The Domain Tightens",
		description:
			"Travel grows harder. Safe rests require tribute, guest-right, faction shelter, or a successful contradiction of local law. Bastion Golemfall and the Sunken Tunnels become active routes.",
		linkedSceneName: "Bastion Golemfall",
	},
	{
		day: 8,
		title: "Day 8 — Crane's Memory",
		description:
			"Old Man Crane offers sealing lore or warns the party that some Regents can be contained only by sacrifice. If ignored, he goes alone toward the Citadel road.",
		factionImpact: "Independent Survivors +1 if the party honors Crane's warning instead of treating him as a weapon.",
		linkedNpcName: "Old Man Crane",
	},
	{
		day: 9,
		title: "Day 9 — The Hollow Mother Declares",
		description:
			"Awoko pamphlets, songs, and sermons spread through settlements. Civilian unrest rises. The cult claims the Regent offers ascension beyond Rank and Bureau ownership.",
		factionImpact: "Awoko +2 if unopposed; Bureau and Independent trust may drop if the party ignores recruitment.",
		linkedSceneName: "Awoko Sanctum",
	},
	{
		day: 10,
		title: "Day 10 — The Claim Race",
		description:
			"If the party has recovered a Claim, enemies attempt theft, corruption, or legal invalidation. If they have recovered none, the Regent sends an invitation that includes one precise clue and one precise insult.",
		linkedSceneName: "Obsidian Spire",
	},
	{
		day: 11,
		title: "Day 11 — Bureau Crisis",
		description:
			"Central Command orders the Annex to prioritize Relic extraction over survivor recovery. Commander Park obeys, delays, or defies this order depending on party reputation and evidence recovered.",
		factionImpact:
			"Bureau final-operation support depends on how the party handles Park's choice.",
		linkedNpcName: "Commander Park Jae-won",
		linkedSceneName: "Bureau Domain Response Annex",
	},
	{
		day: 12,
		title: "Day 12 — Ritual of Inheritance",
		description:
			"The Awoko Sanctum reaches full ritual strength. If not disrupted, the Hollow Mother gains leverage over the final act and may try to inherit the Gloamreach if the Regent weakens.",
		factionImpact: "Awoko power rises. Sister Veil, Mara, or Whisper can still disrupt the rite if saved.",
		linkedNpcName: "Sister Veil",
		linkedSceneName: "Awoko Sanctum",
	},
	{
		day: 13,
		title: "Day 13 — Final Preparations",
		description:
			"All major factions understand that Citadel Day is imminent. Allies must be chosen, debts come due, settlement trust is counted, and the Road of Writs offers the shortest route under the worst terms.",
		factionImpact: "All faction support is locked at the end of this day unless the Warden allows a final dramatic reversal.",
		linkedSceneName: "Road of Final Writs",
	},
	{
		day: 14,
		title: "Day 14 — Citadel Day",
		description:
			"The party enters the Regent's Citadel or the Domain begins forcing Red Phase pressure onto the material world. Bureau floodlights dim outside the Gate. Inside the Gloamreach, every bell rings once.",
		factionImpact: "All faction reputations convert into final-operation support, betrayal, neutrality, or obstruction.",
		linkedSceneName: "The Regent's Citadel",
	},
];
