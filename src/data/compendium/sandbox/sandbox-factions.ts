/**
 * SANDBOX FACTIONS — "The Shadow of the Regent"
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
			"**Alignment:** Lawful. Protect civilians. Report everything. Follow the chain until the chain starts feeding people to the Regent's court.",
			"",
			"The Bureau is useful, brave, underinformed, and politically constrained. It is not useless. It is insufficient.",
		].join("\n"),
		startingReputation: 1,
		reputationThresholds: [
			{ threshold: -5, tier: "hostile", unlocks: "Detainment order. Annex closed to party." },
			{ threshold: -2, tier: "unfriendly", unlocks: "No contracts. Quartermaster access restricted." },
			{ threshold: 0, tier: "neutral", unlocks: "Standard emergency contract access." },
			{ threshold: 3, tier: "friendly", unlocks: "Preferred contracts. Park and Hayashi speak plainly." },
			{ threshold: 6, tier: "trusted", unlocks: "Classified Domain files, Relic analysis, and Park recruitment path." },
			{ threshold: 10, tier: "kin", unlocks: "Final-operation support, rare requisition, and Bureau cordon leverage." },
		],
		joiningBenefits: [
			"Safe rest and medical care at the Annex while it remains functional.",
			"Discounted supplies from Quartermaster Lin.",
			"Hayashi and Lun can identify Claims, Runes, and Anchor-law anomalies.",
		],
		enmities: ["vermillion-guild", "awoko-cult"],
	},
	{
		id: "vermillion-guild",
		name: "Vermillion Guild",
		tagline: "Survive first. Obey later.",
		emblem: "A red six-pointed star scratched into salvaged Relic-plate.",
		description: [
			"Not a Bureau guild, and not from the material world — **the Vermillion are native to the Gloamreach.** The Rift's door is new, but the world beyond it is not, and the Vermillion are its people: a salvage cartel of natives who survive under the Regent's law by stripping cores, Sigils, and Relics from the places that kill everyone else, and by trading in the gaps the Domain leaves. Their specialty is salvage, contraband Runes, rescue-for-profit, and knowing exactly which of the Gloamreach's snares can be slipped and which one will collect you. To them the party are the outsiders — strangers who walked in through a door that should not exist.",
			"",
			"**Leadership:** Guildmaster Orin, with Rat-King Ji controlling most Outpost trade.",
			"",
			"**Alignment:** Pragmatic. Fast. Morally flexible. Often right for the wrong reasons.",
			"",
			"The Vermillion save people the Regent's law abandons, then charge them for the favor — both parts are true. They distrust the newly-arrived Bureau as much as they distrust the court; outsiders never have to live here afterward.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: [
			{ threshold: -5, tier: "hostile", unlocks: "Blacklist. Outpost doors close and bounty hunters get paid." },
			{ threshold: -2, tier: "unfriendly", unlocks: "Prices double. Information becomes deliberately incomplete." },
			{ threshold: 0, tier: "neutral", unlocks: "Standard Outpost market access." },
			{ threshold: 3, tier: "friendly", unlocks: "Exclusive bounties, better salvage prices, limited shelter." },
			{ threshold: 6, tier: "trusted", unlocks: "Black-market services, rare tattoos, restricted Sigils." },
			{ threshold: 10, tier: "kin", unlocks: "Orin's direct support, private vault access, Outpost defenders in the finale." },
		],
		joiningBenefits: [
			"Exclusive loot, Sigil, tattoo, and salvage access.",
			"Outpost safe rooms and contraband services.",
			"Shortcut intelligence through the Road of Writs, though every shortcut has a bill.",
		],
		enmities: ["bureau-sentinels", "awoko-cult"],
	},
	{
		id: "awoko-cult",
		name: "Awoko Cult",
		tagline: "To awaken is to remember what you always were.",
		emblem: "Seven-rayed eye with a tear-shaped pupil and script woven through the iris.",
		description: [
			"A grief cult that preaches the Regent as proof humanity can transcend Rank, death, and Bureau ownership. Their comfort is real. Their rituals are predatory. Their leader, the Hollow Mother, does not want to serve the Regent. She wants to inherit the Gloamreach.",
			"",
			"**Leadership:** The Hollow Mother, supported by Sister Veil, the Choir, and hidden comfort-workers in settlements.",
			"",
			"**Alignment:** Catastrophic tenderness. Some members are zealots. Many are grieving civilians who were offered the first gentle voice after disaster.",
		].join("\n"),
		startingReputation: -1,
		reputationThresholds: [
			{ threshold: -5, tier: "hostile", unlocks: "Cult assassins and ritual hunters actively pursue the party." },
			{ threshold: -2, tier: "unfriendly", unlocks: "Ambushes near shrines, clinics, and grief-dense settlements." },
			{ threshold: 0, tier: "neutral", unlocks: "Mid-rank cultists will speak before violence." },
			{ threshold: 3, tier: "friendly", unlocks: "Sanctum approach, cult theology, and defectors become available." },
			{ threshold: 6, tier: "trusted", unlocks: "Hollow Mother audience; Bureau reputation penalty likely." },
			{ threshold: 10, tier: "kin", unlocks: "Dark path: participation in the Ritual of Inheritance." },
		],
		joiningBenefits: [
			"Access to Awoko comfort networks and hidden sanctum routes.",
			"Grief-based ritual knowledge that can disrupt or empower the finale.",
			"Potential access to dangerous inheritance rites. This should never be consequence-free.",
		],
		enmities: ["bureau-sentinels", "vermillion-guild"],
	},
	{
		id: "independent",
		name: "Independent Survivors",
		tagline: "No masters, no contracts.",
		emblem: "A chalk star on a doorframe, erased every morning.",
		description: [
			"Native civilians, free folk, shelter leaders, settlement doctors, road couriers, and mutual-aid networks trying to survive the Gloamreach without becoming property of the Regent, the Bureau, the Vermillion, or the Awoko.",
			"",
			"**Leadership:** None. Influence shifts between Mama Chen, Doc Tanaka, Old Man Crane, Mika's protectors, and whoever kept people alive most recently.",
			"",
			"**Alignment:** Pragmatic good, fearful neutrality, and survival-first compromise.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: [
			{ threshold: -5, tier: "hostile", unlocks: "Shelters hide from the party. Civilian witnesses help the Regent's court." },
			{ threshold: -2, tier: "unfriendly", unlocks: "Cold doors, no rumors, no food." },
			{ threshold: 0, tier: "neutral", unlocks: "Basic settlement access." },
			{ threshold: 3, tier: "friendly", unlocks: "Free clinic care and honest rumors." },
			{ threshold: 6, tier: "trusted", unlocks: "Safehouse network and settlement guides." },
			{ threshold: 10, tier: "kin", unlocks: "Civilian resistance and shelter support during Citadel Day." },
		],
		joiningBenefits: [
			"Clinic healing and safer long rests in protected settlements.",
			"Local rumors about tribute laws, hidden roads, and Claim clues.",
			"Final-act civilian support if the party protected people without exploiting them.",
		],
		enmities: [],
	},
	{
		id: "anomaly-adjacent",
		name: "Domain-Touched",
		tagline: "We are still here.",
		emblem: "A cracked handprint over a half-open eye.",
		description: [
			"Native survivors, changed natives, memory constructs, intelligent Anomaly fragments, and Domain-born entities altered by the Gloamreach — the free, who keep their own counsel, and (grouped here but never recruitable) the Regent's bound Court, who do not.",
			"",
			"**Leadership:** None. The Catalog, Echo-7, Echo-Nine, Specimen X, and other changed beings speak only for themselves.",
			"",
			"**Alignment:** Fearful, alien, wounded, curious, and often more honest than human factions.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: [
			{ threshold: -5, tier: "hostile", unlocks: "They hide, flee, or lead the party into danger." },
			{ threshold: -2, tier: "unfriendly", unlocks: "Warnings become vague. Doors close early." },
			{ threshold: 0, tier: "neutral", unlocks: "Will answer direct questions." },
			{ threshold: 3, tier: "friendly", unlocks: "Memory fragments, Domain instincts, and safe approach cues." },
			{ threshold: 6, tier: "trusted", unlocks: "Access to altered perception, dream paths, and nonhuman Claim insights." },
			{ threshold: 10, tier: "kin", unlocks: "A Domain-touched ally can create one final contradiction in the Throne Court." },
		],
		joiningBenefits: [
			"Domain instincts that warn of false shelter and legal traps.",
			"Memory-fragment lore unavailable through Bureau files.",
			"Finale parley or contradiction option if the party treated changed beings as people.",
		],
		enmities: [],
	},
];
