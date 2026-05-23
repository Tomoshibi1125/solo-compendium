import { getMaxAbilityLevelForJobAtLevel } from "@/lib/abilityProgression";
import { normalizeJobAccessToken } from "@/lib/jobAbilityAccess";

export type PathAbilityKind = "spell" | "power" | "technique";
export type PathAbilityProgression = "third" | "base" | "full";

export interface PathAbilityGrant {
	jobName: string;
	pathName: string;
	level: number;
	kind: PathAbilityKind;
	sourceTokens: string[];
	schools?: string[];
	entryNames?: string[];
	progression?: PathAbilityProgression;
	maxLevel?: number;
	leveledSchoolsOnly?: boolean;
}

export const PATH_ABILITY_GRANTS: readonly PathAbilityGrant[] = [
	{
		jobName: "Destroyer",
		pathName: "Path of the Spell Breaker",
		level: 3,
		kind: "spell",
		sourceTokens: ["Mage"],
		schools: ["Abjuration", "Evocation"],
		progression: "third",
		leveledSchoolsOnly: true,
	},
	{
		jobName: "Assassin",
		pathName: "Path of the Weave Infiltrator",
		level: 3,
		kind: "spell",
		sourceTokens: ["Mage"],
		schools: ["Enchantment", "Illusion"],
		progression: "third",
		leveledSchoolsOnly: true,
	},
	{
		jobName: "Striker",
		pathName: "Path of the Phantom Step",
		level: 3,
		kind: "spell",
		sourceTokens: [],
		entryNames: [
			"Darkness",
			"Darkvision",
			"Pass without Trace",
			"Silence",
			"Minor Illusion",
		],
		maxLevel: 2,
	},
	{
		jobName: "Mage",
		pathName: "Path of the Phantasmist",
		level: 2,
		kind: "spell",
		sourceTokens: [],
		entryNames: ["Minor Illusion"],
		maxLevel: 0,
	},
	{
		jobName: "Esper",
		pathName: "Path of the Psionic Breach",
		level: 1,
		kind: "spell",
		sourceTokens: [],
		entryNames: [
			"Arms of Hadar",
			"Calm Emotions",
			"Hunger of Hadar",
			"Evard's Black Tentacles",
			"Telekinesis",
		],
		maxLevel: 5,
	},
	{
		jobName: "Mage",
		pathName: "Path of the Detonation Specialist",
		level: 2,
		kind: "power",
		sourceTokens: ["Mage"],
		entryNames: ["Runic Detonation"],
		progression: "full",
	},
	{
		jobName: "Esper",
		pathName: "Path of the Aetheric Cascade",
		level: 1,
		kind: "power",
		sourceTokens: ["Esper"],
		entryNames: ["Runic Detonation"],
		progression: "full",
	},
	{
		jobName: "Esper",
		pathName: "Path of the Psionic Breach",
		level: 1,
		kind: "power",
		sourceTokens: ["Esper"],
		entryNames: ["Parallel Processing", "Esper Ascension"],
		progression: "full",
	},
	{
		jobName: "Esper",
		pathName: "Path of the Psionic Breach",
		level: 1,
		kind: "technique",
		sourceTokens: ["Esper"],
		entryNames: ["Esper Singularity"],
	},
	{
		jobName: "Revenant",
		pathName: "Path of the Void Lord",
		level: 2,
		kind: "power",
		sourceTokens: ["Revenant"],
		entryNames: ["Final Entropy", "Entropic Avatar"],
		progression: "full",
	},
	{
		jobName: "Revenant",
		pathName: "Path of the Void Lord",
		level: 2,
		kind: "technique",
		sourceTokens: ["Revenant"],
		entryNames: ["Revenant's Final Entropy"],
	},
	{
		jobName: "Revenant",
		pathName: "Path of the Entropy Drinker",
		level: 2,
		kind: "power",
		sourceTokens: ["Revenant"],
		entryNames: ["Death's Momentum", "Entropy Harvest"],
		progression: "full",
	},
	{
		jobName: "Revenant",
		pathName: "Path of the Entropy Drinker",
		level: 2,
		kind: "technique",
		sourceTokens: ["Revenant"],
		entryNames: ["Entropy Surge", "Shadow Harvest"],
	},
	{
		jobName: "Revenant",
		pathName: "Path of the Wither Guard",
		level: 2,
		kind: "power",
		sourceTokens: ["Revenant"],
		entryNames: ["Withering Touch", "Entropic Feedback"],
		progression: "full",
	},
	{
		jobName: "Revenant",
		pathName: "Path of the Wither Guard",
		level: 2,
		kind: "technique",
		sourceTokens: ["Revenant"],
		entryNames: ["Withering Blade", "Entropic Rend"],
	},
	{
		jobName: "Revenant",
		pathName: "Path of the Entropy Blade",
		level: 2,
		kind: "power",
		sourceTokens: ["Revenant"],
		entryNames: ["Entropic Counter"],
		progression: "full",
	},
	{
		jobName: "Revenant",
		pathName: "Path of the Entropy Blade",
		level: 2,
		kind: "technique",
		sourceTokens: ["Revenant"],
		entryNames: ["Death's Reach", "Entropy Blade"],
	},
	{
		jobName: "Summoner",
		pathName: "Path of the Biome Architect",
		level: 2,
		kind: "power",
		sourceTokens: ["Summoner"],
		entryNames: ["Gate Reader"],
		progression: "full",
	},
	{
		jobName: "Summoner",
		pathName: "Path of the Apex Shifter",
		level: 2,
		kind: "power",
		sourceTokens: ["Summoner"],
		entryNames: ["Summoner's Leviathan"],
		progression: "full",
	},
	{
		jobName: "Summoner",
		pathName: "Path of the Pack Commander",
		level: 2,
		kind: "power",
		sourceTokens: ["Summoner"],
		entryNames: ["Summoner's Pack"],
		progression: "full",
	},
	{
		jobName: "Summoner",
		pathName: "Path of the Pack Commander",
		level: 2,
		kind: "technique",
		sourceTokens: ["Summoner"],
		entryNames: ["Summoner's Bond Strike", "Summoner's Convergence"],
	},
	{
		jobName: "Herald",
		pathName: "Path of the Combat Mandate",
		level: 1,
		kind: "power",
		sourceTokens: ["Herald"],
		entryNames: ["Guided Strike", "Commander's Presence", "Divine Mandate"],
		progression: "full",
	},
	{
		jobName: "Herald",
		pathName: "Path of the Combat Mandate",
		level: 1,
		kind: "technique",
		sourceTokens: ["Herald"],
		entryNames: ["Sacred Weapon", "Spiritual Hammer", "War God's Blessing"],
	},
	{
		jobName: "Herald",
		pathName: "Path of the Storm Mandate",
		level: 1,
		kind: "power",
		sourceTokens: ["Herald"],
		entryNames: ["Retributive Ward"],
		progression: "full",
	},
	{
		jobName: "Herald",
		pathName: "Path of the Triage Mandate",
		level: 1,
		kind: "power",
		sourceTokens: ["Herald"],
		entryNames: ["Herald's Intervention", "Circuit Defibrillator"],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Cursed Blade",
		level: 1,
		kind: "power",
		sourceTokens: ["Contractor"],
		entryNames: [
			"Cursed Blade Edge",
			"Pact Retaliation",
			"Tether of Binding",
			"Sacrifice Engine",
			"Blood Pact Escalation",
			"Patron's Embrace",
			"Patron Sacrifice",
			"Absolute Pact",
		],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Cursed Blade",
		level: 1,
		kind: "technique",
		sourceTokens: ["Contractor"],
		entryNames: [
			"Pact Blade",
			"Eldritch Riposte",
			"Pact Weapon Manifest",
			"Patron's Fury",
		],
	},
	{
		jobName: "Idol",
		pathName: "Path of the Dance Resonance",
		level: 3,
		kind: "power",
		sourceTokens: ["Idol"],
		entryNames: ["Dissonant Strike", "Tempo Shift"],
		progression: "full",
	},
	{
		jobName: "Idol",
		pathName: "Path of the Dance Resonance",
		level: 3,
		kind: "technique",
		sourceTokens: ["Idol"],
		entryNames: [
			"Rhythmic Strike",
			"Sonic Throw",
			"Dance of Blades",
			"Crescendo Finale",
			"Harmonic Counter",
			"Resonance Blade Dance",
			"Resonance Apocalypse",
		],
	},
	{
		jobName: "Idol",
		pathName: "Path of the Hypnotic Resonance",
		level: 3,
		kind: "power",
		sourceTokens: ["Idol"],
		entryNames: [
			"Harmonic Ward",
			"Resonance Counter",
			"Encore Performance",
			"Idol's Magnum Opus",
			"Final Chorus",
		],
		progression: "full",
	},
	{
		jobName: "Idol",
		pathName: "Path of the Blade Resonance",
		level: 3,
		kind: "technique",
		sourceTokens: ["Idol"],
		entryNames: [
			"Resonance Slash",
			"Mana-Blade Ricochet",
			"Idol's Duel",
			"Resonance Blade Dance",
		],
	},
	{
		jobName: "Idol",
		pathName: "Path of the Shadow Resonance",
		level: 3,
		kind: "power",
		sourceTokens: ["Idol"],
		entryNames: ["Phantom Decoy"],
		progression: "full",
	},
	{
		jobName: "Stalker",
		pathName: "Path of the Umbral Hunter",
		level: 3,
		kind: "power",
		sourceTokens: [],
		entryNames: ["Shadow Strike"],
		maxLevel: 1,
	},
	{
		jobName: "Assassin",
		pathName: "Path of the Blade Dancer",
		level: 17,
		kind: "technique",
		sourceTokens: [],
		entryNames: ["Harmonic Counter"],
		maxLevel: 5,
	},
];

function matchesName(
	a: string | null | undefined,
	b: string | null | undefined,
) {
	return normalizeJobAccessToken(a) === normalizeJobAccessToken(b);
}

function getThirdCasterMaxLevel(characterLevel: number): number {
	const level = Math.min(Math.max(characterLevel, 1), 20);
	if (level >= 19) return 4;
	if (level >= 13) return 3;
	if (level >= 7) return 2;
	if (level >= 3) return 1;
	return 0;
}

export function getPathGrantMaxAbilityLevel(
	grant: PathAbilityGrant,
	characterLevel: number,
): number {
	if (typeof grant.maxLevel === "number") return grant.maxLevel;
	if (grant.progression === "third")
		return getThirdCasterMaxLevel(characterLevel);
	if (grant.progression === "full") {
		return getMaxAbilityLevelForJobAtLevel("Mage", characterLevel, "spell");
	}
	return getMaxAbilityLevelForJobAtLevel(
		grant.jobName,
		characterLevel,
		grant.kind === "technique" ? "power" : grant.kind,
	);
}

export function getActivePathAbilityGrants(options: {
	jobName?: string | null;
	pathName?: string | null;
	characterLevel?: number | null;
	kind?: PathAbilityKind;
}): PathAbilityGrant[] {
	if (!options.jobName || !options.pathName) return [
	{
		jobName: "Herald",
		pathName: "Path of the Radiance Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Ember Trail",
			"Searing Oath",
			"Hallowed Ground",
			"Oath Smite",
			"Absolute Beacon",
			"Binding Oath",
			"Anomaly Cage",
			"Anomaly Leash",
			"Absolute Judgment",
			"Radiant Condemnation"
		],
		progression: "full",
	},
	{
		jobName: "Herald",
		pathName: "Path of the Storm Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Healing Resonance",
			"Mana Bolt",
			"Blood Tear",
			"Circuit Overload",
			"Harmonic Barrage",
			"Idol's Crescendo",
			"Resonance Cascade",
			"Thorn Fortress",
			"Bureau Authority Override",
			"Mana Storm"
		],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Radiant Vessel",
		level: 1,
		kind: "spell",
		sourceTokens: ["Herald"],
		entryNames: [
			"Fade to Shadow",
			"Frost Lattice",
			"Corrosive Aura",
			"Entropic Wave",
			"Circuit Overclock",
			"Harmonic Barrage",
			"Death's Harvest",
			"Entropic Reaping",
			"Absolute Judgment",
			"Radiant Condemnation"
		],
		progression: "full",
	},
	{
		jobName: "Esper",
		pathName: "Path of the Absolute Spark",
		level: 1,
		kind: "spell",
		sourceTokens: ["Herald"],
		entryNames: [
			"Fade to Shadow",
			"Frost Lattice",
			"Corrosive Aura",
			"Entropic Wave",
			"Circuit Overclock",
			"Harmonic Barrage",
			"Death's Harvest",
			"Entropic Reaping",
			"Absolute Judgment",
			"Radiant Condemnation"
		],
		progression: "full",
	},
	{
		jobName: "Summoner",
		pathName: "Path of the Biome Architect",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Bright Tomb",
			"Ember Trail",
			"Crimson Cleave",
			"Mana Thorn Barrier",
			"Gate Flora Eruption",
			"Mana Detonation Charge",
			"Anomaly Mimicry",
			"Ghost Protocol",
			"Absolute Wrath"
		],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Glamour Weaver",
		level: 1,
		kind: "spell",
		sourceTokens: ["Idol"],
		entryNames: [
			"Fade to Shadow",
			"Phantom Step",
			"Hymn of Courage",
			"Psychic Barrier",
			"Idol's Crescendo",
			"Harmonic Resonance",
			"Anomaly Mimicry",
			"Enthralling Performance",
			"Psionic Bastion",
			"Mind Fracture"
		],
		progression: "full",
	},
	{
		jobName: "Holy Knight",
		pathName: "Path of the Absolute Devotion",
		level: 1,
		kind: "spell",
		sourceTokens: ["Herald"],
		entryNames: [
			"Aegis of the Absolute",
			"Bright Tomb",
			"Crimson Cleave",
			"Entropy Siphon",
			"Absolute Beacon",
			"Mana Overcharge",
			"Gate Ward",
			"Oath Aura",
			"Bureau Authority Override",
			"Pact Renegotiation"
		],
		progression: "base",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Void Whisperer",
		level: 1,
		kind: "spell",
		sourceTokens: ["Esper"],
		entryNames: [
			"Synaptic Static",
			"Entropic Wave",
			"Binding Oath",
			"Whisper Network",
			"Mind Fracture",
			"Pact Dominion",
			"Psionic Bastion"
		],
		progression: "full",
	},
	{
		jobName: "Contractor",
		pathName: "Path of the Infernal Conduit",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Ember Trail",
			"Searing Oath",
			"Hallowed Ground",
			"Triple Ignition",
			"Absolute Beacon",
			"Mana Barrage",
			"Absolute Judgment",
			"Radiant Condemnation"
		],
		progression: "full",
	},
	{
		jobName: "Herald",
		pathName: "Path of the Knowledge Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Thunder Shackle",
			"Entropic Wave",
			"Surge Storm",
			"Ghost Protocol",
			"Pact Dominion",
			"Psionic Bastion"
		],
		progression: "full",
	},
	{
		jobName: "Holy Knight",
		pathName: "Path of the Retribution Mandate",
		level: 1,
		kind: "spell",
		sourceTokens: ["Mage"],
		entryNames: [
			"Bright Tomb",
			"Gate Resonance Spike",
			"Arctic Lance",
			"Blood Tear",
			"Pact Brand",
			"Phase Strike"
		],
		progression: "base",
	},
];
	const level = options.characterLevel ?? 0;
	return PATH_ABILITY_GRANTS.filter((grant) => {
		if (options.kind && grant.kind !== options.kind) return false;
		if (!matchesName(grant.jobName, options.jobName)) return false;
		if (!matchesName(grant.pathName, options.pathName)) return false;
		return level >= grant.level;
	});
}

export function pathGrantsAbilityKind(options: {
	jobName?: string | null;
	pathName?: string | null;
	characterLevel?: number | null;
	kind: PathAbilityKind;
}): boolean {
	return getActivePathAbilityGrants(options).length > 0;
}

export function getEffectiveMaxAbilityLevel(options: {
	jobName?: string | null;
	pathName?: string | null;
	characterLevel: number;
	kind: "spell" | "power";
}): number {
	const baseMax = getMaxAbilityLevelForJobAtLevel(
		options.jobName,
		options.characterLevel,
		options.kind,
	);
	const grantMax = getActivePathAbilityGrants({
		jobName: options.jobName,
		pathName: options.pathName,
		characterLevel: options.characterLevel,
		kind: options.kind,
	})
		.filter((grant) => !grant.entryNames?.length)
		.reduce(
			(max, grant) =>
				Math.max(
					max,
					getPathGrantMaxAbilityLevel(grant, options.characterLevel),
				),
			0,
		);
	return Math.max(baseMax, grantMax);
}

export function getPathAbilityGrantTokens(
	grants: readonly PathAbilityGrant[],
): string[] {
	const tokens = new Set<string>();
	for (const grant of grants) {
		for (const token of grant.sourceTokens)
			tokens.add(normalizeJobAccessToken(token));
		tokens.add(normalizeJobAccessToken(grant.pathName));
	}
	return Array.from(tokens).filter(Boolean);
}

export function normalizePathAbilityValue(
	value: string | null | undefined,
): string {
	return normalizeJobAccessToken(value);
}
