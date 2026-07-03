export const WARDEN_RANKS = ["E", "D", "C", "B", "A", "S"] as const;

export const NPC_ROLES = [
	"Bureau Official",
	"Rift Researcher",
	"Relic Merchant",
	"Information Broker",
	"Former S-Rank Ascendant",
	"Regent Cultist",
	"System Analyst",
	"Rift Survivor",
	"Beast Slayer",
	"Core Collector",
	"Umbral Network Agent",
	"Independent Contractor",
] as const;

export const NPC_PERSONALITIES = [
	"Cautious and methodical",
	"Bold and reckless",
	"Mysterious and secretive",
	"Friendly and helpful",
	"Paranoid and suspicious",
	"Confident and arrogant",
	"Humble and wise",
	"Greedy and opportunistic",
	"Loyal and protective",
	"Neutral and detached",
	"Passionate and driven",
	"Cynical and jaded",
] as const;

export const NPC_MOTIVATIONS = [
	"Seeking power through Rifts",
	"Protecting loved ones",
	"Revenge against Anomalies",
	"Researching Rift phenomena",
	"Building an ascendant organization",
	"Seeking the Umbral Regent",
	"Escaping past trauma",
	"Proving their worth",
	"Accumulating wealth",
	"Uncovering secrets",
	"Protecting humanity",
	"Achieving immortality",
] as const;

export const NPC_SECRETS = [
	"Former S-Rank ascendant (lost power)",
	"Working for a Regent",
	"Has a cursed relic",
	"Survived an unrecorded Domain collapse",
	"Is actually an Anomaly",
	"Has System favor debt",
	"Betrayed their ascendant team",
	"Seeking forbidden knowledge",
	"Has a hidden Rift",
	"Is being hunted",
	"Knows The Absolute personally",
	"Has a duplicate identity",
] as const;

export const NPC_QUIRKS = [
	"Always checks for traps",
	"Collects Anomaly cores obsessively",
	"Speaks in riddles",
	"Has a telltale scar",
	"Never removes their mask",
	"Quotes the Rift",
	"Tracks Rift statistics",
	"Has a pet umbral",
	"Wears outdated equipment",
	"Superstitious about Rift Thresholds",
	"Avoids eye contact",
	"Always has a backup plan",
] as const;

/**
 * Cosmopolitan modern pool for the Accord (Meridian City, Harrow Bay,
 * Vantage Isle) — a global metropolis, not any single real-world country —
 * plus setting-native invented names.
 */
export const NPC_NAMES = [
	// East Asian
	"Kim Min-Su",
	"Yoon Seo-Yeon",
	"Han So-Ra",
	"Baek Ji-Woo",
	"Sato Ren",
	"Tanaka Aiko",
	"Wei Lan",
	"Chen Jia-Hao",
	// Western / European
	"Marcus Hale",
	"Elena Vasquez",
	"Theo Merrick",
	"Dana Whitlock",
	"Ivy Callahan",
	"Rowan Pierce",
	"Nadia Petrov",
	"Viktor Lindqvist",
	"Freya Aldersen",
	"Cole Bannister",
	// South Asian / Middle Eastern
	"Priya Raman",
	"Arjun Mehta",
	"Layla Haddad",
	"Omar Farouk",
	"Zara Qureshi",
	// African
	"Amara Okafor",
	"Kofi Mensah",
	"Naledi Dube",
	// Latin American
	"Mateo Reyes",
	"Lucia Ferreira",
	"Camila Duarte",
	// Accord-native (invented)
	"Cass Veyra",
	"Silas Thorne",
	"Mara Vantis",
	"Eris Kalder",
	"Dorian Vale",
	"Sable Rook",
	"Juno Harrow",
	"Aris Kade",
	"Noor Vessani",
	"Talia Merid",
	"Wren Calloway",
] as const;

export const RIFT_THEMES = [
	"Abyssal Realm",
	"Elemental Chaos",
	"Beast Domain",
	"Construct Forge",
	"Abyssal Depths",
	"Celestial Spire",
	"The Absolute's Domain",
	"Necromantic Lab",
	"Mana Nexus",
	"Umbral Regent's Memory",
	"System Testing Ground",
	"Collapsed Domain Remnant",
] as const;

/** Theme table with creature-type annotations, for the rollable-tables view. */
export const RIFT_THEMES_ANNOTATED = [
	"Abyssal Realm (undead focus)",
	"Elemental Chaos (elemental focus)",
	"Beast Domain (animal focus)",
	"Construct Forge (construct focus)",
	"Abyssal Depths (fiend focus)",
	"Celestial Spire (celestial focus)",
	"The Absolute's Domain (shadow focus)",
	"Necromantic Lab (undead + construct)",
	"Mana Nexus (elemental + aberration)",
	"Umbral Regent's Memory",
	"System Testing Ground",
	"Collapsed Domain Remnant",
] as const;

export const RIFT_BIOMES = [
	"Urban ruins",
	"Dark forest",
	"Underground caverns",
	"Floating platforms",
	"Crystal caves",
	"Shadow wasteland",
	"Mana-infused jungle",
	"Frozen tundra",
	"Volcanic depths",
	"Sky fortress",
	"Underwater ruins",
	"Dimensional pocket",
] as const;

export const RIFT_BOSS_TYPES = [
	"Umbral Regent Fragment",
	"System Guardian",
	"Corrupted Ascendant",
	"Ancient Rift Beast",
	"Regent's Shadow",
	"Rift Core Manifestation",
	"Time-Lost Entity",
	"Dimensional Breach",
] as const;

export const RIFT_COMPLICATIONS = [
	"Mana surge causes random power effects",
	"Rift structure shifts, changing layout",
	"Anomaly reinforcements arrive",
	"Environmental hazard activates (fire, ice, poison)",
	"Time distortion slows/speeds ascendant team",
	"Shadow corruption spreads",
	"Rift boss awakens early",
	"Core instability causes tremors",
	"Mana depletion reduces power effectiveness",
	"Illusionary duplicates confuse ascendants",
	"Rift rank increases mid-encounter",
	"Anomaly evolution triggers",
] as const;

export const RIFT_REWARDS = [
	"Standard core yield",
	"Enhanced core (double value)",
	"Rare material drop",
	"Relic fragment",
	"System favor bonus",
	"Experience multiplier",
	"Unique Anomaly part",
	"Rift completion bonus",
	"Hidden treasure cache",
	"Regent blessing",
	"Skill point bonus",
	"Legendary core shard",
] as const;

export const RIFT_HAZARDS = [
	"Mana vortex (random teleportation)",
	"Shadow trap (damage + condition)",
	"Collapsing structure",
	"Poisonous miasma",
	"Extreme temperature zone",
	"Gravity distortion",
	"Time dilation field",
	"Mana drain zone",
	"Anomaly spawning point",
	"Core radiation",
	"Dimensional rift",
	"System interference",
] as const;

export const TREASURE_TIERS = {
	"E-Rank": [
		"Common relic (dormant)",
		"Basic materials",
		"Mana Credit payout",
		"Minor consumables",
		"Low-tier equipment",
	],
	"D-Rank": [
		"Uncommon relic (dormant)",
		"Quality materials",
		"Crystal Credit payout",
		"Useful consumables",
		"Mid-tier equipment",
	],
	"C-Rank": [
		"Rare relic (dormant/awakened)",
		"Rare materials",
		"Rift Credit payout",
		"Powerful consumables",
		"High-tier equipment",
	],
	"B-Rank": [
		"Very rare relic (awakened)",
		"Exotic materials",
		"Large Rift Credit payout",
		"Legendary consumables",
		"Masterwork equipment",
	],
	"A-Rank": [
		"Legendary relic (awakened/resonant)",
		"Legendary materials",
		"Massive Rift Credit sum",
		"Unique consumables",
		"Artifact equipment",
	],
	"S-Rank": [
		"Regent relic (resonant)",
		"Regent materials",
		"Core Credit payout",
		"Rift-granted consumables",
		"Regent equipment",
	],
} as const;

export interface WardenEventTableEntry {
	description: string;
	impact: string;
}

export const WORLD_EVENTS: WardenEventTableEntry[] = [
	{
		description:
			"Rift Surge: Multiple Type-II Rifts have manifested across the sector, causing localized reality thinning.",
		impact:
			"All Rift-related skill checks are made with DISADVANTAGE; Mana-recovery rates are increased by 50% for 24 hours.",
	},
	{
		description:
			"Bureau Lockdown: The Bureau has issued an 'Orange Protocol' alert, restricting all non-sanctioned travel.",
		impact:
			"Presence checks against official NPCs are DC 20; forged permits are required for sector transit.",
	},
	{
		description:
			"Umbral Regent Fragment: A high-density energy signature corresponding to an Umbral Regent has been detected in a nearby subway terminal.",
		impact:
			"A Level-appropriate Elite encounter is triggered; party gains 2,500 bonus XP if the fragment is contained within 3 rounds.",
	},
	{
		description:
			"Mana Storm: High-frequency atmospheric mana discharge is interfering with bio-electric signals.",
		impact:
			"All Long-Range communication is JAMMED; spellcasters must succeed on a DC 14 Sense save or lose 1 random spell slot.",
	},
	{
		description:
			"System Calibration: The System is undergoing a scheduled 'Integrity Sweep,' temporarily disabling auto-looting and map overlays.",
		impact:
			"Navigation checks are DC 18; Survival checks for tracking are required to avoid getting lost.",
	},
	{
		description:
			"Guild Proxy War: The Iron Legion and the Azure Wing are engaged in an open territory dispute in the commercial district.",
		impact:
			"Combat encounters may involve a third party; prices for all consumables are increased by 200% due to rationing.",
	},
	{
		description:
			"Shadow Corruption Leak: A ruptured Shadow Containment Unit is leaking concentrated miasma into the groundwater.",
		impact:
			"Vitality saves (DC 15) required every 4 hours or gain 1 level of Exhaustion; water-based healing is ineffective.",
	},
	{
		description:
			"The Absolute's Decree: A localized 'Safe Zone' has been established by the Rift's core logic.",
		impact:
			"Hostile entities cannot enter the 1-mile radius; all healing during Short Rests is doubled within the zone.",
	},
];

export const NPC_ENCOUNTERS: WardenEventTableEntry[] = [
	{
		description:
			"The Information Broker 'Zero': A masked individual offering decrypted Bureau logs for a steep price.",
		impact:
			"NPC can reveal 1 hidden plot point for 50,000 Rift Credits or a Rare Relic; failing a Persuasion check reveals the party's location to enemies.",
	},
	{
		description:
			"A Wounded Sentinel: An elite Bureau enforcer found pinned under Rift debris, clutching a sealed data drive.",
		impact:
			"Rescue (DC 18 Medicine/Strength) awards a 'Bureau Favor' (Advantage on next Bureau interaction); leaving them results in a 'Bounty' mark.",
	},
	{
		description:
			"The Wandering Merchant 'Kyros': A neutral-aligned inter-dimensional entity trading Void-Data for soul-bound items.",
		impact:
			"Allows the party to trade 1 permanent stat point for a random Legendary Sigil; trade is irreversible.",
	},
	{
		description:
			"Rogue AI Fragment: A fragmented holographic entity appearing as a distorted version of the party's Warden.",
		impact:
			"INT check (DC 16) to stabilize; success grants +2 to all Hack/System checks for the duration of the mission.",
	},
	{
		description:
			"S-Rank Deserter: A legendary Ascendant who has 'disconnected' from the Rift, hiding in the slums.",
		impact:
			"Provides a 'Manual of the Hidden Path' (+1 to Sense) if convinced of the party's discretion; failing to hide the encounter alerts the Bureau.",
	},
];

export const EVENT_COMPLICATIONS: WardenEventTableEntry[] = [
	{
		description:
			"Chronal Distortion: Time is flowing irregularly. Seconds stretch into minutes, then snap back violently.",
		impact:
			"All participants roll 1d20 for initiative at the start of EVERY round; -10ft to movement for all entities.",
	},
	{
		description:
			"Gravity Well: A localized rift anomaly has increased the gravitational constant by 4x.",
		impact:
			"Movement speed is HALVED; Jump distance is 0; falling damage is tripled; Heavy Carapace Armor users must save (DC 15 STR) or be restrained.",
	},
	{
		description:
			"System Static: Visual and auditory sensors are being flooded with meaningless binary data.",
		impact:
			"All creatures have 'Partial Concealment' (20% miss chance); Perception checks are made with DISADVANTAGE.",
	},
	{
		description:
			"Mana Osmosis: The environment is actively draining mana directly from biological hosts.",
		impact:
			"Casters lose 1 spell slot every 2 rounds of combat; non-casters lose 1d6 HP every turn as their life force is sapped.",
	},
	{
		description:
			"Reality Bleed: The barrier between Earth and the Void has vanished here. Conceptual horrors are visible.",
		impact:
			"Sanity check (DC 14 Sense Save) per round or become 'Frightened' for 1 minute; Psychic damage is doubled in this region.",
	},
];
