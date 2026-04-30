export const LEVELS_1_TO_20 = Array.from(
	{ length: 20 },
	(_, index) => index + 1,
);

const PROFICIENCY_BONUS_1_TO_20 = [
	2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6,
];

const STANDARD_ASI_LEVELS = [4, 8, 12, 16, 19];
const ASSASSIN_ASI_LEVELS = [4, 8, 10, 12, 16, 19];
const NO_CANTRIPS = Array.from({ length: 20 }, () => null);
const NO_MAX_POWER = Array.from({ length: 20 }, () => 0);
const ZERO_SLOTS = {
	1: 0,
	2: 0,
	3: 0,
	4: 0,
	5: 0,
	6: 0,
	7: 0,
	8: 0,
	9: 0,
};

// HP progressions assume vitModifier = 2; calculateHPMax(level, hitDie, vit)
// formula: L1 = hitDie + vit; per-level = floor(hitDie/2) + 1 + vit.
const HP_D6_VIT2 = [
	8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86, 92, 98, 104, 110, 116,
	122,
];
const HP_D8_VIT2 = [
	10, 17, 24, 31, 38, 45, 52, 59, 66, 73, 80, 87, 94, 101, 108, 115, 122, 129,
	136, 143,
];
const HP_D10_VIT2 = [
	12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 140, 148,
	156, 164,
];
const HP_D12_VIT2 = [
	14, 23, 32, 41, 50, 59, 68, 77, 86, 95, 104, 113, 122, 131, 140, 149, 158,
	167, 176, 185,
];

// Max power level brackets for each progression.
const FULL_MAX_POWER = [
	1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 9,
] as const;
const HALF_MAX_POWER = [
	0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
] as const;
const PACT_MAX_POWER = [
	1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
] as const;

// Cantrips-known progressions per Job (drawn from getCantripsKnownLimit).
// Revenant, Holy Knight, Stalker, and martial Jobs do not learn cantrips.
const CANTRIPS_MAGE = [
	3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
] as const;
const CANTRIPS_HERALD = CANTRIPS_MAGE;
const CANTRIPS_ESPER = [
	4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
] as const;
const CANTRIPS_IDOL = [
	2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
] as const;
const CANTRIPS_SUMMONER = CANTRIPS_IDOL;
const CANTRIPS_CONTRACTOR = CANTRIPS_IDOL;
const CANTRIPS_TECHNOMANCER = CANTRIPS_IDOL;

const FULL_CASTER_SLOTS_AT_LEVELS = {
	1: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	2: { 1: 3, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	3: { 1: 4, 2: 2, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	4: { 1: 4, 2: 3, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	5: { 1: 4, 2: 3, 3: 2, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 0, 7: 0, 8: 0, 9: 0 },
	17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
	20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
};

const HALF_CASTER_SLOTS_AT_LEVELS = {
	1: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	2: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	3: { 1: 3, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	4: { 1: 3, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	5: { 1: 4, 2: 2, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	10: { 1: 4, 2: 3, 3: 2, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1, 6: 0, 7: 0, 8: 0, 9: 0 },
	20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 0, 7: 0, 8: 0, 9: 0 },
};

// Pact slots: a single slot tier per character level, all slots refresh on a short rest.
// Sampled at every tier transition: L1, L2, L3 (tier 2), L5 (tier 3), L9 (tier 5),
// L11 (3 slots), L17 (4 slots), L20 (cap).
const PACT_CASTER_SLOTS_AT_LEVELS = {
	1: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	2: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	3: { 1: 0, 2: 2, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	5: { 1: 0, 2: 0, 3: 2, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
	9: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 2, 6: 0, 7: 0, 8: 0, 9: 0 },
	11: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 3, 6: 0, 7: 0, 8: 0, 9: 0 },
	17: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 4, 6: 0, 7: 0, 8: 0, 9: 0 },
	20: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 4, 6: 0, 7: 0, 8: 0, 9: 0 },
};

const MARTIAL_SLOTS_AT_LEVELS = {
	1: ZERO_SLOTS,
	2: ZERO_SLOTS,
	3: ZERO_SLOTS,
	4: ZERO_SLOTS,
	5: ZERO_SLOTS,
	10: ZERO_SLOTS,
	17: ZERO_SLOTS,
	20: ZERO_SLOTS,
};

export const JOB_PROGRESSION_FIXTURES = {
	destroyer: {
		category: "martial",
		jobId: "destroyer",
		jobName: "Destroyer",
		hitDieSize: 10,
		vitModifier: 2,
		hpByLevel: HP_D10_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: NO_MAX_POWER,
		cantripsKnownByLevel: NO_CANTRIPS,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 3,
		pathCount: 6,
		pathNames: [
			"Path of the Apex Predator",
			"Path of the Tactician",
			"Path of the Spell Breaker",
			"Path of the Bulwark",
			"Path of the Last Stand",
			"Path of the Aftershock",
		],
		spellSlotsAtLevels: MARTIAL_SLOTS_AT_LEVELS,
	},
	berserker: {
		category: "martial",
		jobId: "berserker",
		jobName: "Berserker",
		hitDieSize: 12,
		vitModifier: 2,
		hpByLevel: HP_D12_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: NO_MAX_POWER,
		cantripsKnownByLevel: NO_CANTRIPS,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 3,
		pathCount: 6,
		pathNames: [
			"Path of the Escalating Resonance",
			"Path of the Gate Beast",
			"Path of the Mana Scars",
			"Path of the Rift Storm",
			"Path of the Absolute Zealot",
			"Path of the Aetheric Anomaly",
		],
		spellSlotsAtLevels: MARTIAL_SLOTS_AT_LEVELS,
	},
	assassin: {
		category: "martial",
		jobId: "assassin",
		jobName: "Assassin",
		hitDieSize: 8,
		vitModifier: 2,
		hpByLevel: HP_D8_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: NO_MAX_POWER,
		cantripsKnownByLevel: NO_CANTRIPS,
		asiLevels: ASSASSIN_ASI_LEVELS,
		pathUnlockLevel: 3,
		pathCount: 6,
		pathNames: [
			"Path of the Gate Runner",
			"Path of the Terminus",
			"Path of the Weave Infiltrator",
			"Path of the Shadow Herald",
			"Path of the Blade Dancer",
			"Path of the Vanguard Outrider",
		],
		spellSlotsAtLevels: MARTIAL_SLOTS_AT_LEVELS,
	},
	striker: {
		category: "martial",
		jobId: "striker",
		jobName: "Striker",
		hitDieSize: 8,
		vitModifier: 2,
		hpByLevel: HP_D8_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: NO_MAX_POWER,
		cantripsKnownByLevel: NO_CANTRIPS,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 3,
		pathCount: 6,
		pathNames: [
			"Path of the Kinetic Core",
			"Path of the Phantom Step",
			"Path of the Aetheric Channeler",
			"Path of the Entropic Flow",
			"Path of the Blade Conductor",
			"Path of the Harmonic Surgeon",
		],
		spellSlotsAtLevels: MARTIAL_SLOTS_AT_LEVELS,
	},
	mage: {
		category: "full-caster",
		jobId: "mage",
		jobName: "Mage",
		hitDieSize: 6,
		vitModifier: 2,
		hpByLevel: HP_D6_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: FULL_MAX_POWER,
		cantripsKnownByLevel: CANTRIPS_MAGE,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 2,
		pathCount: 6,
		pathNames: [
			"Path of the Detonation Specialist",
			"Path of the Shield Architect",
			"Path of the Probability Mandate",
			"Path of the Phantasmist",
			"Path of the Rift Caller",
			"Path of the Matter Weaver",
		],
		spellSlotsAtLevels: FULL_CASTER_SLOTS_AT_LEVELS,
	},
	esper: {
		category: "full-caster",
		jobId: "esper",
		jobName: "Esper",
		hitDieSize: 6,
		vitModifier: 2,
		hpByLevel: HP_D6_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: FULL_MAX_POWER,
		cantripsKnownByLevel: CANTRIPS_ESPER,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 1,
		pathCount: 6,
		pathNames: [
			"Path of the Aetheric Dragon",
			"Path of the Aetheric Cascade",
			"Path of the Void Resonance",
			"Path of the Tempest Core",
			"Path of the Absolute Spark",
			"Path of the Psionic Breach",
		],
		spellSlotsAtLevels: FULL_CASTER_SLOTS_AT_LEVELS,
	},
	revenant: {
		category: "full-caster",
		jobId: "revenant",
		jobName: "Revenant",
		hitDieSize: 6,
		vitModifier: 2,
		hpByLevel: HP_D6_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: FULL_MAX_POWER,
		cantripsKnownByLevel: NO_CANTRIPS,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 2,
		pathCount: 6,
		pathNames: [
			"Path of the Void Lord",
			"Path of the Entropy Drinker",
			"Path of the Wither Guard",
			"Path of the Entropy Blade",
			"Path of the Plague Weaver",
			"Path of the Threshold Walker",
		],
		spellSlotsAtLevels: FULL_CASTER_SLOTS_AT_LEVELS,
	},
	summoner: {
		category: "full-caster",
		jobId: "summoner",
		jobName: "Summoner",
		hitDieSize: 8,
		vitModifier: 2,
		hpByLevel: HP_D8_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: FULL_MAX_POWER,
		cantripsKnownByLevel: CANTRIPS_SUMMONER,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 2,
		pathCount: 6,
		pathNames: [
			"Path of the Biome Architect",
			"Path of the Apex Shifter",
			"Path of the Dream Weaver",
			"Path of the Pack Commander",
			"Path of the Symbiotic Host",
			"Path of the Cosmic Conduit",
		],
		spellSlotsAtLevels: FULL_CASTER_SLOTS_AT_LEVELS,
	},
	herald: {
		category: "full-caster",
		jobId: "herald",
		jobName: "Herald",
		hitDieSize: 8,
		vitModifier: 2,
		hpByLevel: HP_D8_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: FULL_MAX_POWER,
		cantripsKnownByLevel: CANTRIPS_HERALD,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 1,
		pathCount: 6,
		pathNames: [
			"Path of the Restoration Mandate",
			"Path of the Radiance Mandate",
			"Path of the Combat Mandate",
			"Path of the Knowledge Mandate",
			"Path of the Storm Mandate",
			"Path of the Triage Mandate",
		],
		spellSlotsAtLevels: FULL_CASTER_SLOTS_AT_LEVELS,
	},
	idol: {
		category: "full-caster",
		jobId: "idol",
		jobName: "Idol",
		hitDieSize: 8,
		vitModifier: 2,
		hpByLevel: HP_D8_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: FULL_MAX_POWER,
		cantripsKnownByLevel: CANTRIPS_IDOL,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 3,
		pathCount: 6,
		pathNames: [
			"Path of the Lore Resonance",
			"Path of the War Anthem",
			"Path of the Hypnotic Resonance",
			"Path of the Blade Resonance",
			"Path of the Shadow Resonance",
			"Path of the Genesis Resonance",
		],
		spellSlotsAtLevels: FULL_CASTER_SLOTS_AT_LEVELS,
	},
	"holy-knight": {
		category: "half-caster",
		jobId: "holy-knight",
		jobName: "Holy Knight",
		hitDieSize: 10,
		vitModifier: 2,
		hpByLevel: HP_D10_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: HALF_MAX_POWER,
		cantripsKnownByLevel: NO_CANTRIPS,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 3,
		pathCount: 6,
		pathNames: [
			"Path of the Absolute Devotion",
			"Path of the Retribution Mandate",
			"Path of the Verdant Mandate",
			"Path of the Dominance Mandate",
			"Path of the Atonement Mandate",
			"Path of the Exaltation Mandate",
		],
		spellSlotsAtLevels: HALF_CASTER_SLOTS_AT_LEVELS,
	},
	stalker: {
		category: "half-caster",
		jobId: "stalker",
		jobName: "Stalker",
		hitDieSize: 10,
		vitModifier: 2,
		hpByLevel: HP_D10_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: HALF_MAX_POWER,
		cantripsKnownByLevel: NO_CANTRIPS,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 3,
		pathCount: 6,
		pathNames: [
			"Path of the Apex Hunter",
			"Path of the Pack Leader",
			"Path of the Umbral Hunter",
			"Path of the Rift Strider",
			"Path of the Apex Slayer",
			"Path of the Hive Synchronist",
		],
		spellSlotsAtLevels: HALF_CASTER_SLOTS_AT_LEVELS,
	},
	technomancer: {
		category: "half-caster",
		jobId: "technomancer",
		jobName: "Technomancer",
		hitDieSize: 8,
		vitModifier: 2,
		hpByLevel: HP_D8_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: HALF_MAX_POWER,
		cantripsKnownByLevel: CANTRIPS_TECHNOMANCER,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 3,
		pathCount: 6,
		pathNames: [
			"Design: The Aether Chemist",
			"Design: The Aether Vessel",
			"Design: Resonance Siege",
			"Design: Synchronist Binary",
			"Design: Swarm Conduit",
			"Design: Aether Breacher",
		],
		spellSlotsAtLevels: HALF_CASTER_SLOTS_AT_LEVELS,
	},
	contractor: {
		category: "pact-caster",
		jobId: "contractor",
		jobName: "Contractor",
		hitDieSize: 8,
		vitModifier: 2,
		hpByLevel: HP_D8_VIT2,
		proficiencyBonusByLevel: PROFICIENCY_BONUS_1_TO_20,
		maxPowerLevelByLevel: PACT_MAX_POWER,
		cantripsKnownByLevel: CANTRIPS_CONTRACTOR,
		asiLevels: STANDARD_ASI_LEVELS,
		pathUnlockLevel: 1,
		pathCount: 6,
		pathNames: [
			"Path of the Glamour Weaver",
			"Path of the Infernal Conduit",
			"Path of the Void Whisperer",
			"Path of the Radiant Vessel",
			"Path of the Cursed Blade",
			"Path of the Deep Dweller",
		],
		spellSlotsAtLevels: PACT_CASTER_SLOTS_AT_LEVELS,
	},
} as const;

export type JobProgressionFixture =
	(typeof JOB_PROGRESSION_FIXTURES)[keyof typeof JOB_PROGRESSION_FIXTURES];
