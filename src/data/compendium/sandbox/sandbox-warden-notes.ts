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
		title: "Secret 1 — The Regent Was Once Human",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Regent was once a human Ascendant who stayed behind during an early high-rank Gate event to prevent collapse. The Domain wrote itself around his grief, duty, hunger, and refusal to die. Over time, the Anchor became a ruler.",
			"",
			"This does not excuse him. It makes the final confrontation hurt. He has had countless chances to stop treating people as property and chose the throne every time.",
			"",
			"**Reveal tools:** The Faded Family Photo, Ms. Park's Wedding Ring, the Unopened Commendation, the Bureau Room in the Citadel, Old Man Crane's testimony, or a Claim contradiction in the Throne Court.",
		].join("\n"),
	},
	{
		title: "Secret 2 — The Three Claims Are Legal Contradictions",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Three Claims are not ordinary boss keys. Each one proves that the Regent's ownership of the Gloamreach is incomplete.",
			"",
			"The Void Claim contradicts secrecy, erasure, hidden roads, and false darkness.",
			"The Abyss Claim contradicts command, invitation, compelled movement, and throne authority.",
			"The Blood Claim contradicts ownership of bodies, tribute, inheritance, and sacrifice.",
			"",
			"In the finale, the party does not only weaken the Regent. They force the Anchor-throne to answer a legal/metaphysical question: who actually owns this Domain?",
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
		title: "Secret 4 — The Bailiff Is Limited by Law",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Regent's Bailiff is terrifying because it is often correct. It is also limited because it must operate through charges, writs, debts, custody, invitation, and tribute.",
			"",
			"The party can stop or delay the Bailiff without killing it by proving the writ false, paying or redirecting the debt, invoking valid guest-right, using a Claim, presenting older precedent from the Unseated Law, or forcing a jurisdiction conflict.",
			"",
			"This is the campaign's clearest lesson that understanding Domain law can matter more than raw damage.",
		].join("\n"),
	},
	{
		title: "Secret 5 — The Timeline Is Pressure, Not Railroad",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The 14-day Gloamreach timeline is real pressure, but it should not override decisive party action. If the party acts early, bend the clock. If they delay, escalate consequences.",
			"",
			"Day 14 is Citadel Day by default. If the party has not reached the Citadel, do not simply force a final boss through the roof. Instead escalate Red Phase pressure, settlement annexation, Bailiff authority, Awoko inheritance leverage, or Claim countermeasures.",
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
			"If the party brings it to the Throne Court or Anchor-Undercroft, the Regent recognizes what is missing before he recognizes himself. This can trigger the Human Remnant phase, create hesitation, or make his rage colder and more personal.",
		].join("\n"),
	},
	{
		title: "Plot Beat — Blackwood's Classified Mission",
		category: "plot-beat",
		content: [
			"Agent Kira Blackwood was sent to investigate pre-threshold Claim resonance before the Bureau publicly admitted the Gloamreach was a Regent Domain.",
			"",
			"She is not secretly working for the Regent. Her danger is institutional loyalty under pressure. She may hide evidence, misdirect the party, or confess depending on how they handle Bureau trust.",
			"",
			"Use Blackwood to show that the Bureau can be brave in the field and dishonest at command level at the same time.",
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
			"A marked character is easier for Regent-aligned entities to recognize, target with invitations, and name in writs. They may also receive dreams, messages through reflective surfaces, or written summons.",
			"",
			"Common triggers: signing a ledger, accepting dangerous hospitality, being struck by the Diagnosed's gaze, carrying a Claim openly, refusing the same invitation twice, or giving a true name to a Domain officer.",
			"",
			"Removal: the Regent releases the mark, a major Claim contradiction breaks it, or the Anchor is resolved.",
		].join("\n"),
	},
	{
		title: "Pressure Clock — Gloamreach Timeline",
		category: "pressure-clock",
		content: [
			"See `sandbox-timeline.ts` for structured events. Key beats:",
			"- Day 1: Threshold Day. The Gate becomes unreliable behind the party.",
			"- Day 2: First Tribute. The party sees how settlements lease safety.",
			"- Day 5: The Bailiff's first public judgment.",
			"- Day 10: The Claim Race begins in earnest.",
			"- Day 12: Ritual of Inheritance reaches full strength if not disrupted.",
			"- Day 14: Citadel Day or Red Phase pressure escalation.",
		].join("\n"),
	},
];
