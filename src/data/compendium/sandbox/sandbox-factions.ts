/**
 * SANDBOX FACTIONS — "Run Silent"
 *
 * 5 faction records with reputation thresholds, joining benefits, and enmities.
 * Seeded as wiki articles with `category: "faction"` so the Wiki tab
 * surfaces a dedicated Factions filter.
 */

export type FactionId =
	| "bureau-sentinels"
	| "vermillion-guild"
	| "awoko-cult"
	| "independent"
	| "anomaly-adjacent";

export interface SandboxFactionReputationThreshold {
	threshold: number;
	tier: "hostile" | "unfriendly" | "neutral" | "friendly" | "trusted" | "kin";
	unlocks: string;
}

export interface SandboxFaction {
	id: FactionId;
	name: string;
	tagline: string;
	emblem: string;
	description: string;
	startingReputation: number;
	reputationThresholds: SandboxFactionReputationThreshold[];
	joiningBenefits: string[];
	enmities: FactionId[];
}

export const sandboxFactions: SandboxFaction[] = [
	{
		id: "bureau-sentinels",
		name: "Bureau Sentinels",
		tagline: "Order, at cost.",
		emblem: "Silver crescent crossed by a black rifle over a sealed Rift.",
		description: [
			"The official government response to the Gloamreach threshold: military-grade Ascendants, field researchers, logistics teams, and cordon officers trying to contain an S-Rank Rift Interior that behaves like a sovereign state.",
			"",
			"**Leadership:** Commander Park Jae-won, Bureau Domain Response Annex.",
			"",
			"**Alignment:** Lawful. Protect civilians. Report everything. Follow the chain until the chain starts writing off people who could still be saved.",
			"",
			"The Bureau is useful, brave, underinformed, and politically constrained. It is not useless. It is insufficient.",
		].join("\n"),
		startingReputation: 1,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks: "Detainment order. Annex closed to party.",
			},
			{
				threshold: -2,
				tier: "unfriendly",
				unlocks: "No contracts. Quartermaster access restricted.",
			},
			{
				threshold: 0,
				tier: "neutral",
				unlocks: "Standard emergency contract access.",
			},
			{
				threshold: 3,
				tier: "friendly",
				unlocks: "Preferred contracts. Park and Hayashi speak plainly.",
			},
			{
				threshold: 6,
				tier: "trusted",
				unlocks:
					"Classified Interior files, Relic analysis, and Park recruitment path.",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks:
					"Final-operation support, rare requisition, and Bureau cordon leverage.",
			},
		],
		joiningBenefits: [
			"Safe rest and medical care at the Annex while it remains functional.",
			"Discounted supplies from Quartermaster Lin.",
			"Hayashi and Lun can identify pieces of the Means, Runes, and deep-Gloamreach anomalies.",
		],
		enmities: ["vermillion-guild", "awoko-cult"],
	},
	{
		id: "vermillion-guild",
		name: "Vermillion Guild",
		tagline: "Survive first. Obey later.",
		emblem: "A red six-pointed star scratched into salvaged Relic-plate.",
		description: [
			"Not a Bureau guild, and not from the material world — **the Vermillion are native to the Gloamreach.** The Rift's door is new, but the world beyond it is not, and the Vermillion are its people: a salvage cartel of natives who survive in the dark's shadow by stripping cores, Sigils, and Relics from the places that kill everyone else, and by trading in the gaps the Gloamreach leaves. Their specialty is salvage, contraband Runes, rescue-for-profit, and knowing exactly which of the Gloamreach's snares can be slipped and which one will collect you. To them the party are the outsiders — strangers who walked in through a door that should not exist.",
			"",
			"**Leadership:** Guildmaster Orin, with Rat-King Ji controlling most Outpost trade.",
			"",
			"**Alignment:** Pragmatic. Fast. Morally flexible. Often right for the wrong reasons.",
			"",
			"The Vermillion save people the Gloamreach would write off, then charge them for the favor — both parts are true. They distrust the newly-arrived Bureau as much as they distrust the Awoko; outsiders never have to live here afterward.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks: "Blacklist. Outpost doors close and bounty hunters get paid.",
			},
			{
				threshold: -2,
				tier: "unfriendly",
				unlocks: "Prices double. Information becomes deliberately incomplete.",
			},
			{
				threshold: 0,
				tier: "neutral",
				unlocks: "Standard Outpost market access.",
			},
			{
				threshold: 3,
				tier: "friendly",
				unlocks: "Exclusive bounties, better salvage prices, limited shelter.",
			},
			{
				threshold: 6,
				tier: "trusted",
				unlocks: "Black-market services, rare tattoos, restricted Sigils.",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks:
					"Orin's direct support, private vault access, Outpost defenders in the finale.",
			},
		],
		joiningBenefits: [
			"Exclusive loot, Sigil, tattoo, and salvage access.",
			"Outpost safe rooms and contraband services.",
			"Shortcut intelligence on the open roads, though every shortcut has a bill.",
		],
		enmities: ["bureau-sentinels", "awoko-cult"],
	},
	{
		id: "awoko-cult",
		name: "Awoko Cult",
		tagline: "To awaken is to remember what you always were.",
		emblem:
			"Seven-rayed eye with a tear-shaped pupil and script woven through the iris.",
		description: [
			"A grief cult that preaches the Quiet as proof you do not have to stay prey — that a thing in this country climbed out of being hunted and became the hunter. Their comfort is real. Their rituals are predatory. Their leader, the Hollow Mother, does not want to hide from the Quiet or kill it. She wants to be remade by it into something that hunts.",
			"",
			"**Leadership:** The Hollow Mother, supported by Sister Veil, the Choir, and hidden comfort-workers in settlements.",
			"",
			"**Alignment:** Catastrophic tenderness. Some members are zealots. Many are grieving civilians who were offered the first gentle voice after disaster.",
		].join("\n"),
		startingReputation: -1,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks: "Cult assassins and ritual hunters actively pursue the party.",
			},
			{
				threshold: -2,
				tier: "unfriendly",
				unlocks: "Ambushes near shrines, clinics, and grief-dense settlements.",
			},
			{
				threshold: 0,
				tier: "neutral",
				unlocks: "Mid-rank cultists will speak before violence.",
			},
			{
				threshold: 3,
				tier: "friendly",
				unlocks:
					"Sanctum approach, cult theology, and defectors become available.",
			},
			{
				threshold: 6,
				tier: "trusted",
				unlocks: "Hollow Mother audience; Bureau reputation penalty likely.",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks: "Dark path: participation in the Ritual of Becoming.",
			},
		],
		joiningBenefits: [
			"Access to Awoko comfort networks and hidden sanctum routes.",
			"Grief-based ritual knowledge that can disrupt or empower the finale.",
			"Potential access to dangerous becoming-rites. This should never be consequence-free.",
		],
		enmities: ["bureau-sentinels", "vermillion-guild"],
	},
	{
		id: "independent",
		name: "Independent Survivors",
		tagline: "No masters, no contracts.",
		emblem: "A chalk star on a doorframe, erased every morning.",
		description: [
			"Native civilians, free folk, shelter leaders, settlement doctors, road couriers, and mutual-aid networks trying to survive the Gloamreach without becoming property of the Bureau, the Vermillion, or the Awoko — or one more name the dark takes.",
			"",
			"**Leadership:** None. Influence shifts between Mama Chen, Doc Tanaka, Old Man Crane, Mika's protectors, and whoever kept people alive most recently.",
			"",
			"**Alignment:** Pragmatic good, fearful neutrality, and survival-first compromise.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks:
					"Shelters hide from the party. Civilians warn each other to bar their doors against them.",
			},
			{
				threshold: -2,
				tier: "unfriendly",
				unlocks: "Cold doors, no rumors, no food.",
			},
			{ threshold: 0, tier: "neutral", unlocks: "Basic settlement access." },
			{
				threshold: 3,
				tier: "friendly",
				unlocks: "Free clinic care and honest rumors.",
			},
			{
				threshold: 6,
				tier: "trusted",
				unlocks: "Safehouse network and settlement guides.",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks:
					"Civilian support and open wardlines during the final crossing.",
			},
		],
		joiningBenefits: [
			"Clinic healing and safer long rests in protected settlements.",
			"Local rumors about native rules, safe routes, and pieces of the Means.",
			"Final-act civilian support if the party protected people without exploiting them.",
		],
		enmities: [],
	},
	{
		id: "anomaly-adjacent",
		name: "Gloamreach-Touched",
		tagline: "We are still here.",
		emblem: "A cracked handprint over a half-open eye.",
		description: [
			"Native survivors, changed natives, memory constructs, intelligent Anomaly fragments, and entities altered by the Gloamreach — the free, who keep their own counsel, and (grouped here but never recruitable) the worn dead the Quiet sends, who do not.",
			"",
			"**Leadership:** None. The Catalog, Echo-7, Echo-Nine, Specimen X, and other changed beings speak only for themselves.",
			"",
			"**Alignment:** Fearful, alien, wounded, curious, and often more honest than human factions.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks: "They hide, flee, or lead the party into danger.",
			},
			{
				threshold: -2,
				tier: "unfriendly",
				unlocks: "Warnings become vague. Doors close early.",
			},
			{
				threshold: 0,
				tier: "neutral",
				unlocks: "Will answer direct questions.",
			},
			{
				threshold: 3,
				tier: "friendly",
				unlocks:
					"Memory fragments, Gloamreach instincts, and safe approach cues.",
			},
			{
				threshold: 6,
				tier: "trusted",
				unlocks:
					"Access to altered perception, dream paths, and nonhuman insights into the Means.",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks:
					"A Gloamreach-touched ally can turn the Quiet's own worn dead against it for one crucial moment in the final crossing.",
			},
		],
		joiningBenefits: [
			"Gloamreach instincts that warn of false shelter and the worn dead.",
			"Memory-fragment lore unavailable through Bureau files.",
			"Finale parley or contradiction option if the party treated changed beings as people.",
		],
		enmities: [],
	},
];
