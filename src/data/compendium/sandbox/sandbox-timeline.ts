/**
 * SANDBOX TIMELINE — "The Shadow of the Regent"
 *
 * The Gloamreach Gate Break track: a campaign-length Red Phase pressure clock
 * spanning roughly twelve in-world weeks (Levels 1-15), grouped into three acts
 * (I: L1-5, II: L6-10, III: L11-15). Seeded as `campaign_session_logs` of
 * `log_type: "event"`.
 *
 * The `day` value is the in-world day each beat TENDS to land on, but these are
 * milestone beats, not a hard countdown: the Warden advances them as the party
 * progresses and bends them around decisive action. Catastrophic Gate Break
 * (Red Phase overwriting the material side) becomes likely only AFTER the final
 * beat, near the level-15 finale — never before. Earlier drafts compressed this
 * into a flat 14-day window; it is now a multi-stage track sized for 1-15 play.
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
		title: "Day 0 · Act I — The Wing Opens",
		description:
			"The party responds to the Memory-Care Wing inside the Bureau cordon. The pocket breach reveals that the Gloamreach can reach through the threshold before the party enters it.",
		linkedSceneName: "Day Zero: Memory-Care Wing Exterior",
	},
	{
		day: 1,
		title: "Day 1 · Act I — Threshold Day",
		description:
			"The party crosses the Gate as the first team in, and discovers the Gate is only the door. The exit becomes unreliable, the Road of Writs appears, and the Regent's Citadel is visible on the horizon before any map can explain it.",
		factionImpact: "Bureau +1 if the party reports the truth instead of sanitizing it.",
		linkedNpcName: "Commander Park Jae-won",
		linkedSceneName: "Gate Threshold",
	},
	{
		day: 4,
		title: "Day 4 · Act I — First Tribute",
		description:
			"A nearby settlement pays tribute. The party may witness it, interrupt it, or hear the bells after the fact. The Drowned Ledgerfen activates and begins making records legally dangerous.",
		factionImpact: "Independent Survivors +2 if the party protects civilians without exploiting them.",
		linkedSceneName: "Writ-Bound Hamlet",
	},
	{
		day: 8,
		title: "Day 8 · Act I — The Road Learns",
		description:
			"The Road of Writs begins responding to party choices. Anyone who signed a ledger, accepted guest-right, gave a true name, or carried a Claim clue feels watched.",
		linkedSceneName: "Road of Writs",
	},
	{
		day: 13,
		title: "Day 13 · Act I — Hayashi's Warning",
		description:
			"A delayed Bureau transmission reaches the party. Dr. Hayashi confirms the Gloamreach is a Regent Domain, not a normal clear site. Killing creatures will not resolve the Anchor if the law survives.",
		factionImpact: "Bureau Trusted path opens if the party shares field evidence.",
		linkedNpcName: "Dr. Serin Hayashi",
	},
	{
		day: 20,
		title: "Day 20 · Act II — The Bailiff's First Public Judgment",
		description:
			"The Regent's Bailiff collects someone from a settlement, road camp, or faction shelter. It announces charges before violence. The party can fight, flee, satisfy, redirect, or contradict the writ.",
		factionImpact:
			"Civilian trust shifts sharply based on whether the party protects the accused or lets collection happen.",
		linkedNpcName: "The Regent's Bailiff",
		linkedSceneName: "Road of Writs",
	},
	{
		day: 27,
		title: "Day 27 · Act II — The Cult Moves",
		description:
			"Awoko comfort-workers begin open recruitment in grief-dense places. The Hollow Mother sends a sermon, dream, or private message. Her followers say serve. She says inherit.",
		factionImpact: "Awoko reputation and suspicion rise. Sister Veil defection path can open.",
		linkedNpcName: "The Hollow Mother",
		linkedSceneName: "Awoko Sanctum",
	},
	{
		day: 34,
		title: "Day 34 · Act II — The Domain Tightens",
		description:
			"Travel grows harder. Safe rests require tribute, guest-right, faction shelter, or a successful contradiction of local law. Bastion Golemfall and the Sunken Tunnels become active routes.",
		linkedSceneName: "Bastion Golemfall",
	},
	{
		day: 41,
		title: "Day 41 · Act II — Crane's Memory",
		description:
			"Old Man Crane offers sealing lore or warns the party that some Regents can be contained only by sacrifice. If ignored, he goes alone toward the Citadel road.",
		factionImpact: "Independent Survivors +1 if the party honors Crane's warning instead of treating him as a weapon.",
		linkedNpcName: "Old Man Crane",
	},
	{
		day: 49,
		title: "Day 49 · Act II — The Hollow Mother Declares",
		description:
			"Awoko pamphlets, songs, and sermons spread through settlements. Civilian unrest rises. The cult claims the Regent offers ascension beyond Rank and Bureau ownership.",
		factionImpact: "Awoko +2 if unopposed; Bureau and Independent trust may drop if the party ignores recruitment.",
		linkedSceneName: "Awoko Sanctum",
	},
	{
		day: 58,
		title: "Day 58 · Act III — The Claim Race",
		description:
			"If the party has recovered a Claim, enemies attempt theft, corruption, or legal invalidation. If they have recovered none, the Regent sends an invitation that includes one precise clue and one precise insult.",
		linkedSceneName: "Obsidian Spire",
	},
	{
		day: 66,
		title: "Day 66 · Act III — Bureau Crisis",
		description:
			"Central Command orders the Annex to prioritize Relic extraction over survivor recovery. Commander Park obeys, delays, or defies this order depending on party reputation and evidence recovered.",
		factionImpact:
			"Bureau final-operation support depends on how the party handles Park's choice.",
		linkedNpcName: "Commander Park Jae-won",
		linkedSceneName: "Bureau Domain Response Annex",
	},
	{
		day: 74,
		title: "Day 74 · Act III — Ritual of Inheritance",
		description:
			"The Awoko Sanctum reaches full ritual strength. If not disrupted, the Hollow Mother gains leverage over the final act and may try to inherit the Gloamreach if the Regent weakens.",
		factionImpact: "Awoko power rises. Sister Veil, Mara, or Whisper can still disrupt the rite if saved.",
		linkedNpcName: "Sister Veil",
		linkedSceneName: "Awoko Sanctum",
	},
	{
		day: 80,
		title: "Day 80 · Act III — Final Preparations",
		description:
			"All major factions understand that Citadel Day is near. Allies must be chosen, debts come due, settlement trust is counted, and the Road of Writs offers the shortest route under the worst terms.",
		factionImpact: "All faction support is locked at the end of this stage unless the Warden allows a final dramatic reversal.",
		linkedSceneName: "Road of Final Writs",
	},
	{
		day: 84,
		title: "Day 84 · Act III — Citadel Day & the Break Threshold",
		description:
			"The final Break Stage. The party enters the Regent's Citadel, or the Domain begins forcing Red Phase pressure onto the material world. Bureau floodlights dim outside the Gate; inside the Gloamreach, every bell rings once. This is the Gate Break threshold — if the party has not reached the Anchor, escalate Red Phase pressure rather than forcing a final boss by fiat.",
		factionImpact: "All faction reputations convert into final-operation support, betrayal, neutrality, or obstruction.",
		linkedSceneName: "The Regent's Citadel",
	},
];
