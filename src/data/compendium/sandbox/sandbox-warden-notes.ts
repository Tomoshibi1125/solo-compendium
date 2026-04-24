/**
 * SANDBOX WARDEN NOTES — "The Shadow of the Regent"
 *
 * Seeded into the Notes tab on sandbox import with `is_shared=false` so
 * they are private to the Warden. Split between the 5 canonical Warden
 * secrets (foreshadowing beats referenced elsewhere in the module) and 5
 * new DM-only plot levers (true identity, cult infiltration, optional
 * escape hatches).
 *
 * Schema maps 1:1 to the `campaign_notes` table.
 */

export interface SandboxWardenNote {
	title: string;
	content: string;
	category: "warden-secret" | "plot-beat" | "pressure-clock";
}

export const sandboxWardenNotes: SandboxWardenNote[] = [
	// ── The 5 canonical Warden Secrets ──────────────────────────────────────
	{
		title: "Secret 1 — The Regent Wears the Party's Faces",
		category: "warden-secret",
		content: [
			"**DM ONLY.** The Regent is a fused composite of the PCs' _un-awakened_ selves — the timelines in which they never escaped the Memory-Care Wing. Each PC, when they reach the Archive of His Self (Floor −2), will see their own reflection in a different mirror, aged and hollowed out.",
			"",
			"**Mechanics:** When the Regent attacks a PC for the first time, that PC must make a WIS save (DC 16) or gain 1 level of Identity-Erosion (see Pressure Clock). The save is _automatic_ the second time.",
			"",
			"**Revelation beat:** Reveal this in the Archive of His Self room, not before. Players should feel dawning horror, not confusion.",
		].join("\n"),
	},
	{
		title: "Secret 2 — Commander Park Knows About the Wing",
		category: "warden-secret",
		content: [
			"**DM ONLY.** Park was _there_ when the Memory-Care Wing was commissioned. He signed off on the Diagnosed project. He does not remember this consciously — the Bureau used aetheric redaction on its own senior officers — but it is in his encrypted personal files.",
			"",
			"**Trigger:** If the party reaches Rep Trusted with Bureau and passes a DC 18 Investigation on his office at Bureau HQ, they find the redacted files. Park breaks.",
			"",
			"**Payoff:** Park can either sacrifice himself to shut down the Wing permanently (Session 5 climax), or go rogue and side with the Awoko Cult. Player choice via Park's next Rep threshold.",
		].join("\n"),
	},
	{
		title: "Secret 3 — The Awoko Cult Is Right (Partially)",
		category: "warden-secret",
		content: [
			"**DM ONLY.** The cult's core thesis — that names are power and the Bureau is stripping them — is _factually correct_. Their solution (mass sacrifice to rebuild a collective identity) is catastrophically wrong.",
			"",
			"If the party pushes back against the cult without engaging their diagnosis, Rep with the independent / anomaly-adjacent factions _drops_ because those factions see the cult as truthful.",
			"",
			"**DM hook:** A PC who reaches Identity-Erosion level 2 will start seeing cult graffiti that _was not there before_. Use this as a soft foreshadow.",
		].join("\n"),
	},
	{
		title: "Secret 4 — Squad Seven Is Still Alive (Sort Of)",
		category: "warden-secret",
		content: [
			"**DM ONLY.** The Anomaly wearing Sgt. Min-ho's name tag in the Hollow Subway is Min-ho, fused at the cellular level with a tunnel-fungus colony. He is aware. He is in pain. He is still technically a Bureau operative.",
			"",
			"**DM choice:** If the party passes a DC 20 Medicine check + spends 8 hours, they can extract a coherent Min-ho mind into a jar-vessel (see Relic: Soul-Jar). This unlocks Yoon's full loyalty and a hidden Bureau endgame path.",
		].join("\n"),
	},
	{
		title: "Secret 5 — The 14-Day Timeline Is Real",
		category: "warden-secret",
		content: [
			"**DM ONLY.** The roaming S-Rank Anomaly (see sandbox-timeline) _will_ breach the District on Day 14 regardless of party action. The timeline is not a Warden bluff — it fires.",
			"",
			"If the party has not reached the Regent's Domain by then, the Domain comes to them: S-Rank crashes through the Bureau HQ roof. Adjust encounter accordingly — do not fudge the deadline.",
		].join("\n"),
	},

	// ── New DM-only plot beats ──────────────────────────────────────────────
	{
		title: "Plot Beat — The Diagnosed Wants to Be Forgotten",
		category: "plot-beat",
		content: [
			"The figure in R5 is the party's _shared_ un-awakened self — the first attempt at the fusion that would become the Regent. It is not hostile.",
			"",
			"If the party returns to R5 after Session 3 and passes a DC 14 Persuasion (no pressure), the Diagnosed will grant them the **Un-Naming Protocol** — a consumable that negates one level of Identity-Erosion per PC.",
		].join("\n"),
	},
	{
		title: "Plot Beat — The Bureau Is Being Infiltrated",
		category: "plot-beat",
		content: [
			"Two Bureau Sentinels are covert Awoko agents: a medic (name at Warden discretion) and Quartermaster Lin's assistant (ditto). They are not lethal enemies — they are sources.",
			"",
			"If the party unmasks one, Rep with Vermillion Guild jumps +2 (the Guild has been trying to prove this for years).",
		].join("\n"),
	},
	{
		title: "Plot Beat — The Awoko Sanctum Has a Hostage",
		category: "plot-beat",
		content: [
			"The cult is holding Dr. Serin Hayashi's younger sister in the Sanctum Nave (Ch. 33 S-3). She is not a pre-generated rescue — she is _trying to join the cult voluntarily_ because she believes it will give her back her twin's name.",
			"",
			"Rescue is possible but requires either combat or a Persuasion chain. Combat alienates Dr. Hayashi. Persuasion alienates Commander Park.",
		].join("\n"),
	},
	{
		title: "Pressure Clock — Identity-Erosion",
		category: "pressure-clock",
		content: [
			"Each PC tracks an Identity-Erosion counter 0-3.",
			"- **0:** Normal.",
			"- **1:** Dreams of a life they didn't live. Disadvantage on INT saves against Charm effects by Awoko NPCs.",
			"- **2:** Occasionally answer to the wrong name. Advantage on Insight vs. Bureau officers (you see the redaction).",
			"- **3:** The Regent can see through your eyes on a DC 16 WIS save each short rest. If they fail twice, they are _his_ at Session 5.",
			"",
			"Triggers: direct attack by the Regent (secret 1), failing the DC 18 save in the Archive of His Self, voluntarily drinking from the Fusion Font (Megadungeon Room 7).",
		].join("\n"),
	},
	{
		title: "Pressure Clock — District Timeline (14 Days)",
		category: "pressure-clock",
		content: [
			"See `sandbox-timeline.ts` for structured events. Key beats:",
			"- Day 3: First Bureau supply run is ambushed. Rep flips if party wasn't escorting.",
			"- Day 7: Vermillion Guild offers exclusive contract — refusing costs Rep.",
			"- Day 9: Roaming S-Rank sighted at District edge.",
			"- Day 12: Awoko Cult mass-recruitment event.",
			"- Day 14: S-Rank breach. Climax fires regardless.",
		].join("\n"),
	},
];
