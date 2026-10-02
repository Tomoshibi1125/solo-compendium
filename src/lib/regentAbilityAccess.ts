import type {
	PathAbilityGrant,
	PathAbilityKind,
} from "@/lib/pathAbilityAccess";

/**
 * Regent option access grants. Regents receive explicit grants for:
 * - Caster Regents: School-based access + named additional_spells list
 * - Martial Regents: Job-based power & technique pools
 * 
 * All grants use source-backed, canonical ability identities. The named
 * additional_spells from the Regent source are granted explicitly by entryNames.
 * Martial Regents draw from Job-tagged power/technique pools appropriate to
 * their combat archetype.
 */
export type RegentAbilityKind = PathAbilityKind;
export type RegentAbilityProgression = "third" | "base" | "full";

export interface RegentAbilityGrant {
	regentName: string;
	kind: RegentAbilityKind;
	level: number;
	sourceTokens: string[];
	schools?: string[];
	entryNames?: string[];
	progression?: RegentAbilityProgression;
	maxLevel?: number;
	leveledSchoolsOnly?: boolean;
}

export const REGENT_ABILITY_GRANTS: readonly RegentAbilityGrant[] = [
	// ═══════════════════════════════════════════════════════════════
	// Umbral Regent - Death and Shadow Magic
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Umbral Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Revenant", "Contractor", "Herald"],
		schools: ["Necromancy", "Illusion"],
		progression: "full",
	},
	{
		regentName: "Umbral Regent",
		kind: "spell",
		level: 1,
		sourceTokens: [],
		entryNames: [
			"spell-sup-0-3-grave-chill",
			"spell-sup-1-21-psychic-lance",
			"spell-sup-1-33-necrotic-shroud",
			"spell-sup-4-74-dimensional-anchor",
			"spell-sup-5-136-rift-walk",
		],
	},

	// ═══════════════════════════════════════════════════════════════
	// Radiant Regent - White Flames and Purification
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Radiant Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Herald", "Idol"],
		schools: ["Evocation", "Abjuration"],
		progression: "full",
	},
	{
		regentName: "Radiant Regent",
		kind: "spell",
		level: 1,
		sourceTokens: [],
		entryNames: [
			"spell-sup-0-10-oath-flare",
			"spell-sup-1-16-mana-bolt",
			"spell-sup-2-42-triple-ignition",
			"spell-sup-3-61-mana-barrage",
			"spell-sup-8-110-absolute-sunburst",
		],
	},

	// ═══════════════════════════════════════════════════════════════
	// Destruction Regent - Draconic Apocalypse
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Destruction Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Herald"],
		schools: ["Evocation", "Transmutation"],
		progression: "full",
	},
	{
		regentName: "Destruction Regent",
		kind: "spell",
		level: 1,
		sourceTokens: [],
		entryNames: [
			"Fire Bolt",
			"Shatter",
			"Fireball",
			"Disintegrate",
			"spell-sup-6-97-disintegration-beam",
		],
	},

	// ═══════════════════════════════════════════════════════════════
	// Frost Regent - Eternal Winter
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Frost Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Herald"],
		schools: ["Evocation", "Transmutation"],
		progression: "full",
	},
	{
		regentName: "Frost Regent",
		kind: "spell",
		level: 1,
		sourceTokens: [],
		entryNames: [
			"spell-sup-0-4-lattice-ping",
			"spell-sup-1-23-frost-lattice",
			"Rift",
			"spell-sup-4-81-pact-gate",
			"spell-sup-7-102-temporal-fracture",
		],
	},

	// ═══════════════════════════════════════════════════════════════
	// Plague Regent - Pandemic Incarnate
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Plague Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Revenant", "Contractor"],
		schools: ["Necromancy", "Conjuration"],
		progression: "full",
	},
	{
		regentName: "Plague Regent",
		kind: "spell",
		level: 1,
		sourceTokens: [],
		entryNames: [
			"Poison Spray",
			"spell-sup-2-56-corrosive-aura",
			"Stinking Cloud",
			"Contagion",
			"spell-sup-4-77-phantom-swarm",
		],
	},

	// ═══════════════════════════════════════════════════════════════
	// Spatial Regent - Cosmic Weaving & Dimensional Void
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Spatial Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Technomancer"],
		schools: ["Conjuration", "Transmutation"],
		progression: "full",
	},
	{
		regentName: "Spatial Regent",
		kind: "spell",
		level: 1,
		sourceTokens: [],
		entryNames: [
			"Mage Hand",
			"spell-sup-1-28-phantom-step",
			"Dimension Door",
			"spell-sup-5-83-mana-storm",
			"spell-sup-5-136-rift-walk",
		],
	},

	// ═══════════════════════════════════════════════════════════════
	// Blood Regent - Hemomancy & Sanguine Regentty
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Blood Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Revenant", "Contractor"],
		schools: ["Necromancy", "Transmutation"],
		progression: "full",
	},
	{
		regentName: "Blood Regent",
		kind: "spell",
		level: 1,
		sourceTokens: [],
		entryNames: [
			"Chill Touch",
			"False Life",
			"spell-sup-3-63-pact-hunger",
			"spell-sup-0-8-verdant-touch",
			"Circle of Death",
		],
	},

	// ═══════════════════════════════════════════════════════════════
	// Gravity Regent - Gravitational Mastery & Fundamental Force
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Gravity Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Technomancer"],
		schools: ["Transmutation", "Evocation"],
		progression: "full",
	},
	{
		regentName: "Gravity Regent",
		kind: "spell",
		level: 1,
		sourceTokens: [],
		entryNames: [
			"Magic Stone",
			"Levitate",
			"Fly",
			"Reverse Gravity",
			"Meteor Swarm",
		],
	},

	// ═══════════════════════════════════════════════════════════════
	// Steel Regent - Martial Powers & Techniques
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Steel Regent",
		kind: "power",
		level: 1,
		sourceTokens: ["Striker", "Destroyer", "Vanguard"],
		progression: "full",
	},
	{
		regentName: "Steel Regent",
		kind: "technique",
		level: 1,
		sourceTokens: ["Striker", "Destroyer", "Vanguard"],
		progression: "full",
	},

	// ═══════════════════════════════════════════════════════════════
	// War Regent - Martial Powers & Techniques
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "War Regent",
		kind: "power",
		level: 1,
		sourceTokens: ["Vanguard", "Assassin", "Striker"],
		progression: "full",
	},
	{
		regentName: "War Regent",
		kind: "technique",
		level: 1,
		sourceTokens: ["Vanguard", "Assassin", "Striker"],
		progression: "full",
	},

	// ═══════════════════════════════════════════════════════════════
	// Beast Regent - Martial Powers & Techniques
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Beast Regent",
		kind: "power",
		level: 1,
		sourceTokens: ["Striker", "Assassin", "Destroyer"],
		progression: "full",
	},
	{
		regentName: "Beast Regent",
		kind: "technique",
		level: 1,
		sourceTokens: ["Striker", "Assassin", "Destroyer"],
		progression: "full",
	},

	// ═══════════════════════════════════════════════════════════════
	// Mimic Regent - Martial Powers & Techniques
	// ═══════════════════════════════════════════════════════════════
	{
		regentName: "Mimic Regent",
		kind: "power",
		level: 1,
		sourceTokens: ["Assassin", "Striker", "Idol"],
		progression: "full",
	},
	{
		regentName: "Mimic Regent",
		kind: "technique",
		level: 1,
		sourceTokens: ["Assassin", "Striker", "Idol"],
		progression: "full",
	},
];

/**
 * Return source-backed Regent grants. Grants include both school-based access
 * and explicit named entries from the Regent's additional_spells list.
 */
export function getActiveRegentAbilityGrants(options: {
	regentNames?: string[] | null;
	characterLevel?: number | null;
	kind?: RegentAbilityKind;
}): PathAbilityGrant[] {
	if ((options.regentNames ?? []).length === 0) return [];
	return REGENT_ABILITY_GRANTS.filter((grant) => {
		if (options.kind && grant.kind !== options.kind) return false;
		return (
			(options.characterLevel ?? 0) >= grant.level &&
			(options.regentNames ?? []).includes(grant.regentName)
		);
	}).map((grant) => ({
		jobName: grant.regentName,
		pathName: grant.regentName,
		level: grant.level,
		kind: grant.kind,
		sourceTokens: grant.sourceTokens,
		schools: grant.schools,
		entryNames: grant.entryNames,
		progression: grant.progression,
		maxLevel: grant.maxLevel,
		leveledSchoolsOnly: grant.leveledSchoolsOnly,
	}));
}
