/**
 * SANDBOX WARDEN NOTES — "Run Silent"
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
		title: "Secret 1 — What the Quiet Is",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Quiet is not, and was never, a person. It is the apex of the Gloamreach — old, vast, patient, hungry, and answerable to nothing. Whether it was always here or climbed out of being prey long ago (see the Obsidian Spire) is the campaign's deepest open question, and a piece of the Means. It did not lose its humanity. It never had any to lose.",
			"",
			"Everything the party finds that suggests otherwise is bait. The Gloamreach keeps the relics of everyone it has taken — a Bureau Room that cannot exist, the Faded Family Photo, an Unopened Commendation, Ms. Park's Wedding Ring — and the Quiet wears the dead so perfectly that the party will be tempted to believe there is someone in there to save. There is not. The grief is real; those keepsakes belonged to real people the dark took. But none of them are *it*.",
			"",
			"Play it so it lands: the party may spend the campaign hoping the thing wearing their dead can be reasoned with or redeemed, and learn — too late, or just in time — that the comfort was assembled, out of people they loved, to be reached for.",
			"",
			"**Reveal tools:** the Faded Family Photo, Ms. Park's Wedding Ring, the Unopened Commendation, the deep places, the Obsidian Spire's Watcher, Old Man Crane's testimony, or the Old Power Below — each a piece of the truth the party can earn.",
		].join("\n"),
	},
	{
		title: "Secret 2 — The Means Is the Only Way to End It",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Quiet cannot be killed by force; ordinary harm barely marks it, and it withdraws into the dark to come again. The only way to end it is the Means, assembled in play and never handed over (see *The Means to End It*):",
			"",
			"- **A truth** about what it is — and whether it was always here.",
			"- **A way to hold it still** — forced silence and dark, a true name, a ward turned inward; a real Relic or working that can pin a thing never fully there.",
			"- **A way to make it stay dead** — the Threshold, a ward-circle the natives build only once, or the dead-silent heart of a Mana Vein.",
			"",
			"With all of it, and at 9th level or higher, the party can drag the Quiet down — for one brutal scene at the Threshold — into something they can actually kill. Without it, the attempt is a way to die. Escape is always the surer victory.",
		].join("\n"),
	},
	{
		title: "Secret 3 — The Hollow Mother Wants to Become",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Awoko Cult does not simply hide from the Quiet. The Hollow Mother intends to *become* something like it — to feed it enough grief, and enough of her own flock, that it remakes her into a hunter the dark will never touch.",
			"",
			"Her followers say they serve, comfort, or remember. She rarely uses those words. Her true verb is become.",
			"",
			"If the party weaken the Quiet's grip on a region but fail to disrupt the Ritual of Becoming, the Hollow Mother can become an endgame complication — racing them into the deep dark, trying to make herself a second apex at the worst possible moment (see Ch33 and the final crossing).",
		].join("\n"),
	},
	{
		title: "Secret 4 — The Worn Dead Can Be Outrun, Not Outfought",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The worn dead — the lures and hunters the Quiet sends ahead (the Worn, the Caller, the Wrong Shape, the Hollowed) — are terrifying because there is always another. Put one down and it means nothing; the dark simply wears another face. They are limited only in this: they come for what the Quiet has marked, and they hunt by the same things it does — noise, light, Essence.",
			"",
			"The party can turn the hunt aside without winning a fight by going silent and dark, hiding a marked one's name and scent, reaching a wardline, speaking a true name to break a lure, crossing running water or a hard threshold, or, at terrible cost, giving the dark what it came for.",
			"",
			"This is the campaign's clearest lesson: surviving the Gloamreach means understanding what it is, not only hitting harder.",
		].join("\n"),
	},
	{
		title: "Secret 5 — The Hunt Is Pressure, Not Railroad",
		category: "warden-secret",
		content: [
			"**Warden ONLY.** The Gloamreach has no countdown to a Rift Break and no clock ticking toward a final boss. The campaign escalates as *persecution* (see The Hunt Escalates): the Quiet grows bolder, the safe-holds fewer, the worn dead thicker, and the party's Dread and exhaustion mount — paced by the Hunt Clock and by what the party do, never by a calendar.",
			"",
			"If the party act decisively, reward it. If they delay, rest carelessly, or live loud, escalate: a safe-hold falls, a known native is taken and worn, the worn dead hunt in daylight, the dark spreads to more of the map.",
			"",
			"The pressure should keep them hunted — never safe for long, always one rule behind. It should not steal agency.",
		].join("\n"),
	},
	{
		title: "Plot Beat — The Faded Family Photo",
		category: "plot-beat",
		content: [
			"The Faded Family Photo is the strongest emotional prop in the campaign — a lost face worn down to blank paper. It can be recovered in Day Zero, the Drowned Ledgerfen, or deep in the Gloamreach.",
			"",
			"If the party carry it, the Quiet learns that face, and may one day wear it back at them — calling in that voice, from the dark, at the worst possible moment. Play it ambiguously: a genuine echo of someone the dark took, or a predator performing exactly the reunion the party most want to see. Either reading can buy a beat of doubt, colder resolve, or a fragile opening — and either way, it is bait.",
		].join("\n"),
	},
	{
		title: "Plot Beat — Blackwood's Classified Mission",
		category: "plot-beat",
		content: [
			"Agent Kira Blackwood was sent to read pre-threshold resonance — the first hint of the Means surfacing on the material side — before the Bureau had confirmed the Gloamreach was an uncleared, inhabited Interior. Her findings are classified above the party's clearance.",
			"",
			"She is not working against them. Her danger is institutional loyalty under pressure: she may withhold classified data, default to protocol when instinct says otherwise, or level with the party — depending on how they handle Bureau trust.",
			"",
			"Use Blackwood to show that the Bureau can be brave in the field and bound by caution at command level at the same time — overwhelmed and rule-bound, never dishonest.",
		].join("\n"),
	},
	{
		title: "Plot Beat — Sister Veil Can Break the Chant",
		category: "plot-beat",
		content: [
			"Sister Veil knows the Ritual of Becoming math is wrong. She does not begin as a hero. She begins as someone honest enough to admit the numbers prove her faith will consume its own followers, and offer them to the dark for nothing.",
			"",
			"If the party give her evidence and protect her during the Sanctum raid, she can corrupt the final chant and stop the Hollow Mother from being remade during the finale.",
		].join("\n"),
	},
	{
		title: "Pressure Clock — Quiet-Marked",
		category: "pressure-clock",
		content: [
			"Track whether each character becomes Quiet-Marked. This is the dark having their name (see Day Zero and the Hollow Way).",
			"",
			"A marked character is easier for the Quiet and its worn dead to recognize, single out, and hunt; the worn dead come for them first. They may also receive dreams and messages through reflective surfaces.",
			"",
			"Common triggers: speaking or giving a true name to the dark, accepting dangerous false-safety, being struck by the Diagnosed's gaze, reading one's own name on the road or the walls, or carrying a piece of the Means openly.",
			"",
			"Removal: the Quiet is ended, the character makes it back across the Threshold, or a major Relic-tier intervention takes a name back from the dark.",
		].join("\n"),
	},
	{
		title: "Pressure Clock — The Hunt",
		category: "pressure-clock",
		content: [
			"See `sandbox-timeline.ts` for the full persecution track — pressure paced by the Hunt Clock and the party's choices, not a calendar. Key beats by act:",
			"- Act I (L1-3) · First Contact: the threshold seals, the AFA lies, the first taking (ideally an NPC).",
			"- Act II (L4-6) · The Hunt: the worn dead hunt in earnest; the first time the Quiet wears a face the party know.",
			"- Act III (L7-9) · The Long Dark: safe-holds fail; the party learn the first true things about the Quiet and assemble the Means.",
			"- Act IV (L9-10) · Threshold: escape, or the one gated-kill stand.",
		].join("\n"),
	},
];
