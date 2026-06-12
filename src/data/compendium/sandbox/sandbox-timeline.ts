/**
 * SANDBOX TIMELINE — "Run Silent"
 *
 * The Gloamreach persecution track: a campaign-length pressure clock paced by the
 * Hunt Clock and the party's choices (Levels 1-10), grouped into three acts
 * (I: L1-4, II: L5-7, III: L8-10). Seeded as `campaign_session_logs` of
 * `log_type: "event"`.
 *
 * The `day` value is the in-world day each beat TENDS to land on, but these are
 * milestone beats, not a hard countdown: the Warden advances them as the party
 * progresses and bends them around decisive action. The Gloamreach escalates as a
 * hunt, never a calendar; the final stand near the level-10 finale comes only AFTER
 * the last beat, never before. Earlier drafts compressed this into a flat 14-day
 * window; it is now a multi-stage track sized for 1-10 play.
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
			"The party crosses the Rift as the first team in, and discovers the Rift is only the door. The exit becomes unreliable, the old roads turn dangerous, and something vast and patient in the dark takes notice of the first living things to come through in a very long time.",
		factionImpact: "Bureau +1 if the party reports the truth instead of sanitizing it.",
		linkedNpcName: "Commander Park Jae-won",
		linkedSceneName: "Rift Threshold",
	},
	{
		day: 4,
		title: "Day 4 · Act I — First Loss",
		description:
			"A nearby community loses someone to the dark — or the party watch it pay the hard price that keeps its wards lit. The Drowned Ledgerfen wakes and begins making the dead, and the not-yet-dead, dangerously real.",
		factionImpact: "Independent Survivors +2 if the party protects civilians without exploiting them.",
		linkedSceneName: "Writ-Bound Hamlet",
	},
	{
		day: 8,
		title: "Day 8 · Act I — The Road Learns",
		description:
			"The old roads begin responding to party choices. Anyone who gave a true name, made noise, burned Essence, or carried a piece of the Means feels watched.",
		linkedSceneName: "The Old Roads",
	},
	{
		day: 13,
		title: "Day 13 · Act I — Hayashi's Warning",
		description:
			"A delayed Bureau transmission reaches the party. Dr. Hayashi confirms the Gloamreach is an uncleared, inhabited Interior with an apex predator that cannot be cleared by force — only survived, or fled.",
		factionImpact: "Bureau Trusted path opens if the party shares field evidence.",
		linkedNpcName: "Dr. Serin Hayashi",
	},
	{
		day: 20,
		title: "Day 20 · Act II — The First Taking",
		description:
			"The Quiet takes someone — a native, a straggler on the road, a face the party half-knew. The worn dead do it, and they speak names before they take. The party can flee, hide, give the dark what it came for, or, uselessly, fight.",
		factionImpact:
			"Civilian trust shifts sharply based on whether the party protects the marked or lets the dark have them.",
		linkedNpcName: "The Worn",
		linkedSceneName: "The Old Roads",
	},
	{
		day: 27,
		title: "Day 27 · Act II — The Cult Moves",
		description:
			"Awoko comfort-workers begin open recruitment in grief-dense places. The Hollow Mother sends a sermon, dream, or private message. Her followers say serve. She says become.",
		factionImpact: "Awoko reputation and suspicion rise. Sister Veil defection path can open.",
		linkedNpcName: "The Hollow Mother",
		linkedSceneName: "Awoko Sanctum",
	},
	{
		day: 34,
		title: "Day 34 · Act II — The Dark Tightens",
		description:
			"Travel grows harder. Safe rests require a community's wards, a faction's shelter, or a place the party have learned to ward. Bastion Golemfall and the Sunken Tunnels become active routes.",
		linkedSceneName: "Bastion Golemfall",
	},
	{
		day: 41,
		title: "Day 41 · Act II — Crane's Memory",
		description:
			"Old Man Crane offers hard lore, or warns the party that some hunts end only by sacrifice. If ignored, he goes alone into the deep dark.",
		factionImpact: "Independent Survivors +1 if the party honors Crane's warning instead of treating him as a weapon.",
		linkedNpcName: "Old Man Crane",
	},
	{
		day: 49,
		title: "Day 49 · Act II — The Hollow Mother Declares",
		description:
			"Awoko pamphlets, songs, and sermons spread through settlements. Civilian unrest rises. The cult claims the Quiet offers a way to stop being prey — to be remade into a hunter.",
		factionImpact: "Awoko +2 if unopposed; Bureau and Independent trust may drop if the party ignores recruitment.",
		linkedSceneName: "Awoko Sanctum",
	},
	{
		day: 58,
		title: "Day 58 · Act III — The Means Surfaces",
		description:
			"If the party have recovered a piece of the Means, the dark and the Awoko both move to take it back. If they have none, a deep place offers a first true glimpse of what the Quiet is.",
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
		title: "Day 74 · Act III — Ritual of Becoming",
		description:
			"The Awoko Sanctum reaches full ritual strength. If not disrupted, the Hollow Mother gains leverage over the final act and may try to make herself a new hunter as the party near the Threshold.",
		factionImpact: "Awoko power rises. Sister Veil, Mara, or Whisper can still disrupt the rite if saved.",
		linkedNpcName: "Sister Veil",
		linkedSceneName: "Awoko Sanctum",
	},
	{
		day: 80,
		title: "Day 80 · Act III — Final Preparations",
		description:
			"All major factions understand the final crossing is near. Allies must be chosen, debts come due, settlement trust is counted, and the old roads offer the shortest route under the worst terms.",
		factionImpact: "All faction support is locked at the end of this stage unless the Warden allows a final dramatic reversal.",
		linkedSceneName: "The Old Roads",
	},
	{
		day: 84,
		title: "Day 84 · Act III — The Threshold",
		description:
			"The climax. The party make their last crossing through the deep dark to the sealed Threshold — to escape, or, with the Means assembled and at Level 9+, to make the one stand that ends the Quiet. Outside the Rift the Bureau floodlights gutter; inside, the Gloamreach goes utterly silent for the first time. If the party are not ready, escalate the hunt rather than forcing an ending by fiat.",
		factionImpact: "All faction reputations convert into final-operation support, betrayal, neutrality, or obstruction.",
		linkedSceneName: "The Threshold",
	},
];
