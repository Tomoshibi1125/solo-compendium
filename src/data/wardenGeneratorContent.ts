/**
 * Authored Warden table pools consumed by the canonical rollable tables
 * (`src/data/compendium/rollableTables.ts`). Deterministic content only; the
 * retired AI generators that shared this module were removed under RA-18.
 */

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
