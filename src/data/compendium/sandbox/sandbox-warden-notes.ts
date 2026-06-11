/**
 * SANDBOX WARDEN NOTES — "The Shadow of the Regent"
 *
 * Seeded into the Notes tab on sandbox import with `is_shared=false` so they
 * are private to the Warden. These notes define the Gloamreach's core secrets,
 * pressure clocks, and optional horror levers.
 */

export interface SandboxWardenNote {
	title: string;
	content: string;
	category: "warden-secret" | "plot-beat" | "pressure-clock";
}

export const sandboxWardenNotes: SandboxWardenNote[] = [
	{
		title: "Secret 1 — The Regent Was Never Human",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Regent is not, and was never, a person. He is the Gloamreach's Anchor — domain authority with will, an Anomaly-class entity all his own: umbral command, the stolen echoes of everyone he has worn, and a sovereignty that simply refuses to collapse. He has no kin among the distant powers of the pantheon and answers to none of them. He did not lose his humanity. He never had any to lose.",
			"",
			"Everything the party finds will say otherwise. The Domain curates a human past for him — a Bureau Room, the Faded Family Photo, an Unopened Commendation, Ms. Park's Wedding Ring — assembled from the relics and stolen echoes of the people it has already claimed. This is the Gloamreach's deepest lie and its cruelest bait: an impossible museum of a life he never lived, dressed in comfort and grief, built to make the party believe there is a soul to save — so that their mercy becomes a lever he can pull.",
			"",
			"The grief is real — those keepsakes belonged to real claimed victims of the Domain — but they were never *his*. Play the reveal so it lands: the party may spend the campaign trying to redeem a lost human, and learn at the throne that the human remnant was a costume worn by ownership itself.",
			"",
			"**Reveal tools:** The Faded Family Photo, Ms. Park's Wedding Ring, the Unopened Commendation, the fabricated Bureau Room in the Citadel, Old Man Crane's testimony, or a Claim contradiction in the Throne Court — each reads two ways until the finale forces the truth.",
		].join("\n"),
	},
	{
		title: "Secret 2 — The Three Claims Are Truths the Domain Cannot Deny",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Three Claims are not ordinary boss keys. Each is a truth so real the Gloamreach cannot fold it back into the Regent's will — a thing the Domain cannot swallow, deny, or unmake.",
			"",
			"The Void Claim breaks his hold over secrecy, the dark, hidden roads, and every false seeming.",
			"The Abyss Claim breaks his hold over summons, compulsion, and obedience — everything that moves in the Gloamreach when he wills it.",
			"The Blood Claim breaks his hold over flesh, the grave, and the claimed dead — everything this country has swallowed.",
			"",
			"In the finale, the party does not only weaken the Regent. Holding all three at the throne forces the Gloamreach, for a few impossible breaths, to stop being his — the one window in which the Anchor can be ended, sealed, or changed.",
		].join("\n"),
	},
	{
		title: "Secret 3 — The Hollow Mother Intends to Inherit",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Awoko Cult does not simply worship the Regent. The Hollow Mother intends to inherit the Gloamreach when the Regent weakens.",
			"",
			"Her followers often say they serve, free, or remember. She almost never uses those words. Her true verb is inherit.",
			"",
			"If the party weakens the Regent but fails to disrupt the Ritual of Inheritance, the Hollow Mother can become an endgame complication, not by replacing the Regent as main villain, but by trying to claim the Anchor at the worst possible moment.",
		].join("\n"),
	},
	{
		title: "Secret 4 — The Bailiff Can Be Outrun, Not Outfought",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Regent's Bailiff is terrifying because it cannot be reasoned with and cannot be made to stop. It is limited only in this: it comes for what the Domain has marked and nothing else, and its master's hold does not reach everywhere.",
			"",
			"The party can turn it aside without destroying it by hiding the marked one's name and scent, giving it or redirecting it toward what it came to collect, crossing into ground the Regent has not yet swallowed, turning a Claim against it, or waking the older power of the Unseated that the Gloamreach feared first.",
			"",
			"This is the campaign's clearest lesson that surviving the Gloamreach means understanding what it is, not only hitting harder.",
		].join("\n"),
	},
	{
		title: "Secret 5 — The Timeline Is Pressure, Not Railroad",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Gloamreach Rift Break track is a ~12-week, three-act pressure clock — real pressure, but it should not override decisive party action. If the party acts early, bend the clock. If they delay, escalate consequences.",
			"",
			"The final Break Stage (around Day 84) is Citadel Day by default. If the party has not reached the Citadel, do not simply force a final boss through the roof. Instead escalate Rift Break pressure, settlement annexation, the Bailiff's hunt, Awoko inheritance leverage, or Claim countermeasures.",
			"",
			"The clock should make the Domain feel alive. It should not steal agency.",
		].join("\n"),
	},
	{
		title: "Plot Beat — The Faded Family Photo",
		category: "plot-beat",
		content: [
			"The Faded Family Photo is the strongest emotional prop in the campaign. It should be recoverable in Day Zero, the Drowned Ledgerfen, or the Citadel's Bureau Room.",
			"",
			"If the party brings it to the Throne Court or Anchor-Undercroft, the Regent studies it the way a collector studies a specimen — and for one breath the curated mask flickers, as if something is *supposed* to be remembered here. Play it ambiguously: a genuine fracture in the Domain's costume, or a predator performing exactly the hesitation the party most wants to see. Either reading can buy a beat of doubt, colder rage, or a fragile opening.",
		].join("\n"),
	},
	{
		title: "Plot Beat — Blackwood's Classified Mission",
		category: "plot-beat",
		content: [
			"Agent Kira Blackwood was sent to read pre-threshold Claim resonance before the Bureau had confirmed the Gloamreach was a Regent Domain. Her findings are classified above the party's clearance.",
			"",
			"She is not working for the Regent. Her danger is institutional loyalty under pressure: she may withhold classified data, default to protocol when instinct says otherwise, or level with the party — depending on how they handle Bureau trust.",
			"",
			"Use Blackwood to show that the Bureau can be brave in the field and bound by caution at command level at the same time — overwhelmed and rule-bound, never dishonest.",
		].join("\n"),
	},
	{
		title: "Plot Beat — Sister Veil Can Break the Chant",
		category: "plot-beat",
		content: [
			"Sister Veil knows the Ritual of Inheritance math is wrong. She does not begin as a hero. She begins as someone honest enough to admit the numbers prove her faith will consume its own followers.",
			"",
			"If the party gives her evidence and protects her during the Sanctum raid, she can corrupt the final chant and prevent the Hollow Mother from claiming the Anchor during the finale.",
		].join("\n"),
	},
	{
		title: "Pressure Clock — Regent-Marked",
		category: "pressure-clock",
		content: [
			"Track whether each character becomes Regent-Marked. This is legal visibility inside the Gloamreach.",
			"",
			"A marked character is easier for Regent-aligned entities to recognize, single out, and hunt. They may also receive dreams, messages through reflective surfaces, and summons nailed to their door.",
			"",
			"Common triggers: giving a true name to a Domain officer, accepting dangerous hospitality, being struck by the Diagnosed's gaze, carrying a Claim openly, refusing the same invitation twice, or making a promise on the road.",
			"",
			"Removal: the Regent releases the mark, a major Claim contradiction breaks it, or the Anchor is resolved.",
		].join("\n"),
	},
	{
		title: "Pressure Clock — Gloamreach Timeline",
		category: "pressure-clock",
		content: [
			"See `sandbox-timeline.ts` for the full Rift Break track — a ~12-week, three-act pressure clock (not a 14-day countdown). Key beats:",
			"- Act I (L1-5) · Day 1: Threshold Day. The Rift becomes unreliable behind the party.",
			"- Act I · Day 4: First Tribute. The party sees how settlements lease safety.",
			"- Act II (L6-10) · Day 20: The Bailiff's first public judgment.",
			"- Act III (L11-15) · Day 58: The Claim Race begins in earnest.",
			"- Act III · Day 74: Ritual of Inheritance reaches full strength if not disrupted.",
			"- Act III · Day 84: Citadel Day and the Rift Break threshold.",
		].join("\n"),
	},
];
