/**
 * SANDBOX FACTIONS — "The Shadow of the Regent"
 *
 * 5 faction records with reputation thresholds, joining benefits, enmities.
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
		emblem: "Silver crescent crossed by a black rifle.",
		description: [
			"The official government response to the Gate Cascade — military-grade Ascendants with prosthetic mana-reinforcement and strict rules of engagement. The Bureau is dying on the vine in the Restricted Zone: supplies run thin, extraction keeps not coming, and senior officers carry redactions even they can't read.",
			"",
			"**Leadership:** Commander Park Jae-won (Bureau HQ).",
			"",
			"**Alignment:** Lawful. Protect civilians. Report everything. Follow the chain, even when the chain lies.",
		].join("\n"),
		startingReputation: 1,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks: "Kill-on-sight orders. HQ closed to party.",
			},
			{
				threshold: -2,
				tier: "unfriendly",
				unlocks: "No contracts. Shops refuse service.",
			},
			{ threshold: 0, tier: "neutral", unlocks: "Standard contract access." },
			{
				threshold: 3,
				tier: "friendly",
				unlocks: "Preferred contracts. Park speaks plainly.",
			},
			{
				threshold: 6,
				tier: "trusted",
				unlocks:
					"Unlocks Park's recruitment + classified file access (Secret 2).",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks: "Commander Park gifts Bureau Relic armor.",
			},
		],
		joiningBenefits: [
			"Bureau housing at HQ (free long rest facility).",
			"Discounted supply at Quartermaster Lin.",
			"Mana-prosthesis healing (1 attunement slot back on long rest).",
		],
		enmities: ["vermillion-guild", "awoko-cult"],
	},
	{
		id: "vermillion-guild",
		name: "Vermillion Guild",
		tagline: "Profit, at price.",
		emblem: "Red six-pointed star in a crimson circle.",
		description: [
			"A merchant-Ascendant consortium specializing in Anomaly salvage, Sigil tattooing, and black-market arms. They operate out of the Bazaar hub in the middle ring. They are not villains — they are businessmen — but their contracts are signed in more than ink.",
			"",
			"**Leadership:** Rotating Guild Chair (assign NPC at Warden discretion).",
			"",
			"**Alignment:** Lawful-Neutral / opportunistic. They are the reason the District still has a functioning trade economy.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks: "Blacklist. Guild hits out on party.",
			},
			{ threshold: -2, tier: "unfriendly", unlocks: "Shop prices ×2." },
			{ threshold: 0, tier: "neutral", unlocks: "Standard market access." },
			{ threshold: 3, tier: "friendly", unlocks: "Exclusive contract access." },
			{
				threshold: 6,
				tier: "trusted",
				unlocks: "Vermillion Sigil bonus (discount + rare tattoos).",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks: "Guild membership: voting shares, private vault access.",
			},
		],
		joiningBenefits: [
			"Exclusive loot table access (sigils, tattoos, salvage).",
			"Private Bazaar rooms for hubs.",
			"Rare-item brokerage.",
		],
		enmities: ["bureau-sentinels", "awoko-cult"],
	},
	{
		id: "awoko-cult",
		name: "Awoko Cult",
		tagline: "We are the only name that stays.",
		emblem: "Seven-rayed eye, iris a swirl of scripts.",
		description: [
			"A splinter sect that worships the un-named Regent as a liberation-god. They are the District's open secret — hunted by the Bureau, tolerated by Vermillion, feared by the independents. Their core thesis — that the Bureau's aetheric redaction is stripping names from civilians — is factually correct. Their solution (mass sacrifice to rebuild a collective identity) is catastrophic.",
			"",
			"**Leadership:** Hidden Abbess (name withheld; see sandbox-warden-notes).",
			"",
			"**Alignment:** Chaotic. Self-styled revolutionaries. Some are zealots; many are grieving civilians who lost family to Bureau redaction.",
		].join("\n"),
		startingReputation: -1,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks: "Assassins dispatched. Sanctum gate closed.",
			},
			{ threshold: -2, tier: "unfriendly", unlocks: "Ambushes in alleys." },
			{
				threshold: 0,
				tier: "neutral",
				unlocks: "Tolerated. May speak to mid-ranks.",
			},
			{
				threshold: 3,
				tier: "friendly",
				unlocks: "Sanctum access + lore dumps.",
			},
			{
				threshold: 6,
				tier: "trusted",
				unlocks: "Unlocks Awoko Herald path; Rep -4 Bureau automatic.",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks:
					"Initiation ritual (grants Naming Seal — fixes one level of Identity-Erosion).",
			},
		],
		joiningBenefits: [
			"Un-Naming protocol access (reverses Identity-Erosion).",
			"Sanctum as free long-rest point.",
			"Exclusive cult-tier Relic access.",
		],
		enmities: ["bureau-sentinels", "vermillion-guild"],
	},
	{
		id: "independent",
		name: "Independent Ascendants",
		tagline: "No masters, no contracts.",
		emblem: "None; chalk-drawn star on a boot sole.",
		description: [
			"Freelance Ascendants who work outside the Bureau or Guild. They run the Outer Slums clinics, underground schools, and mutual-aid networks. Most are ex-Bureau or ex-Guild defectors. They don't play well with factional leaders but they will show up when it matters.",
			"",
			"**Leadership:** None. Mutual-aid coordinator changes monthly.",
			"",
			"**Alignment:** Chaotic-Good / pragmatic.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks: "Shops closed. Ambushes in Slums.",
			},
			{ threshold: -2, tier: "unfriendly", unlocks: "Cold shoulder. No aid." },
			{ threshold: 0, tier: "neutral", unlocks: "Normal Slums access." },
			{
				threshold: 3,
				tier: "friendly",
				unlocks: "Mutual-aid clinic free healing.",
			},
			{
				threshold: 6,
				tier: "trusted",
				unlocks: "Safehouse network (hidden long rests anywhere in District).",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks:
					"Party may recruit any independent NPC outside of leveling cost.",
			},
		],
		joiningBenefits: [
			"Free clinic healing in Slums.",
			"Safehouse network.",
			"Mutual-aid lore dumps (flavor only).",
		],
		enmities: [],
	},
	{
		id: "anomaly-adjacent",
		name: "Anomaly-Adjacent",
		tagline: "We are still here.",
		emblem: "Sigil scratched into whatever wall is closest.",
		description: [
			"Civilians, Ascendants, and semi-Anomaly hybrids who have been touched by the Cascade without being destroyed. Includes partial Anomalies who retain memory (Sgt. Min-ho, if rescued), Diagnosed who have escaped the Wing, and ordinary citizens with mana-malformations.",
			"",
			"**Leadership:** None. The Diagnosed in R5 is the closest to a spokesperson.",
			"",
			"**Alignment:** Neutral. Scared. Want only to be left alone.",
		].join("\n"),
		startingReputation: 0,
		reputationThresholds: [
			{
				threshold: -5,
				tier: "hostile",
				unlocks: "Refuse to speak. Hide on sight.",
			},
			{
				threshold: -2,
				tier: "unfriendly",
				unlocks: "Whisper warnings to avoid.",
			},
			{
				threshold: 0,
				tier: "neutral",
				unlocks: "Will answer direct questions.",
			},
			{
				threshold: 3,
				tier: "friendly",
				unlocks: "Diagnosed shares memory-fragments freely.",
			},
			{
				threshold: 6,
				tier: "trusted",
				unlocks: "Access to Un-Naming Protocol (see Warden Notes).",
			},
			{
				threshold: 10,
				tier: "kin",
				unlocks: "Can parley the Regent in Session 5 Phase 3.",
			},
		],
		joiningBenefits: [
			"Un-Naming Protocol (negates one level of Identity-Erosion per PC).",
			"Diagnosed lore chain.",
			"Session 5 parley option.",
		],
		enmities: [],
	},
];
