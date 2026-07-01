import { normalizeJobAccessToken } from "@/lib/jobAbilityAccess";
import type {
	PathAbilityGrant,
	PathAbilityKind,
} from "@/lib/pathAbilityAccess";

/**
 * Regent ability-access grants — the regent analogue of PATH_ABILITY_GRANTS.
 *
 * The user chose "full independent progression": each regent is its own full
 * caster or martial overlay (à la the Umbral regent), stacked on top of the
 * base job. But `isCanonicalSpell/Power/TechniqueLearnable` only ever gated by
 * the JOB (school/signature) and by PATH grants — a bare `regentNames` token
 * granted nothing, so a regent's known-spell/power progression could never
 * resolve to real compendium entries (it would recreate the Revenant-class
 * "required > 0, available = 0" block).
 *
 * These grants make a regent's progression resolvable by mapping each regent to
 * a themed slice of the existing compendium (spell schools for caster regents,
 * job power/technique source tokens for martial regents). They are ADDITIVE and
 * keyed by regent name, so they never reduce a job's or path's existing access.
 */

export type RegentAbilityKind = PathAbilityKind;
export type RegentAbilityProgression = "third" | "base" | "full";

export interface RegentAbilityGrant {
	regentName: string;
	kind: RegentAbilityKind;
	/** Regent-internal tier the grant unlocks at (regents aren't level-gated in
	 * play, but this keeps parity with the path-grant shape and lets callers cap
	 * by the character's level). */
	level: number;
	/** Job/source tokens whose lists the regent draws from (e.g. ["Mage"]). */
	sourceTokens: string[];
	/** Spell schools the caster regent can inscribe (leveled spells). */
	schools?: string[];
	/** Specific signature entries, when the grant is a fixed list. */
	entryNames?: string[];
	progression?: RegentAbilityProgression;
	maxLevel?: number;
	/** When true, the `schools` filter applies only to leveled spells; cantrips of
	 * any school in the source list remain available (mirrors path grants). */
	leveledSchoolsOnly?: boolean;
}

// Caster regents: full-progression access to a themed pair of spell schools,
// drawn from the Mage list (the broadest arcane pool). Martial regents: access
// to a themed martial job's powers + techniques.
export const REGENT_ABILITY_GRANTS: readonly RegentAbilityGrant[] = [
	// ---- Caster regents (spellcasting) ----
	{
		regentName: "Umbral Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage"],
		schools: ["Necromancy", "Conjuration"],
		progression: "full",
		leveledSchoolsOnly: true,
	},
	{
		regentName: "Radiant Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Herald"],
		schools: ["Evocation", "Abjuration"],
		progression: "full",
		leveledSchoolsOnly: true,
	},
	{
		regentName: "Destruction Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage"],
		schools: ["Evocation", "Transmutation"],
		progression: "full",
		leveledSchoolsOnly: true,
	},
	{
		regentName: "Frost Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage"],
		schools: ["Evocation", "Conjuration"],
		progression: "full",
		leveledSchoolsOnly: true,
	},
	{
		regentName: "Plague Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Herald"],
		schools: ["Necromancy", "Conjuration"],
		progression: "full",
		leveledSchoolsOnly: true,
	},
	{
		regentName: "Spatial Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage"],
		schools: ["Conjuration", "Transmutation"],
		progression: "full",
		leveledSchoolsOnly: true,
	},
	{
		regentName: "Blood Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage", "Herald"],
		schools: ["Necromancy", "Transmutation"],
		progression: "full",
		leveledSchoolsOnly: true,
	},
	{
		regentName: "Gravity Regent",
		kind: "spell",
		level: 1,
		sourceTokens: ["Mage"],
		schools: ["Transmutation", "Evocation"],
		progression: "full",
		leveledSchoolsOnly: true,
	},
	// ---- Martial regents (powers + techniques) ----
	{
		regentName: "Steel Regent",
		kind: "power",
		level: 1,
		sourceTokens: ["Vanguard", "Destroyer"],
		progression: "full",
	},
	{
		regentName: "Steel Regent",
		kind: "technique",
		level: 1,
		sourceTokens: ["Vanguard", "Destroyer"],
	},
	{
		regentName: "War Regent",
		kind: "power",
		level: 1,
		sourceTokens: ["Vanguard", "Striker"],
		progression: "full",
	},
	{
		regentName: "War Regent",
		kind: "technique",
		level: 1,
		sourceTokens: ["Vanguard", "Striker"],
	},
	{
		regentName: "Beast Regent",
		kind: "power",
		level: 1,
		sourceTokens: ["Berserker", "Destroyer"],
		progression: "full",
	},
	{
		regentName: "Beast Regent",
		kind: "technique",
		level: 1,
		sourceTokens: ["Berserker", "Destroyer"],
	},
	{
		regentName: "Mimic Regent",
		kind: "power",
		level: 1,
		sourceTokens: ["Assassin", "Striker"],
		progression: "full",
	},
	{
		regentName: "Mimic Regent",
		kind: "technique",
		level: 1,
		sourceTokens: ["Assassin", "Striker"],
	},
];

function matchesRegentName(
	grantName: string,
	candidate?: string | null,
): boolean {
	if (!candidate) return false;
	return (
		normalizeJobAccessToken(grantName) === normalizeJobAccessToken(candidate)
	);
}

/**
 * Active regent grants for a character carrying the given regent overlays,
 * optionally filtered by ability kind and capped by the character's level.
 *
 * Returned as {@link PathAbilityGrant}s (regent name mapped into both jobName and
 * pathName, which the per-entry matchers ignore) so the existing
 * `pathGrantMatches*Entry` machinery in canonicalCompendium can consume path and
 * regent grants through one uniform, additive code path.
 */
export function getActiveRegentAbilityGrants(options: {
	regentNames?: string[] | null;
	characterLevel?: number | null;
	kind?: RegentAbilityKind;
}): PathAbilityGrant[] {
	const names = options.regentNames ?? [];
	if (names.length === 0) return [];
	const level = options.characterLevel ?? 0;
	return REGENT_ABILITY_GRANTS.filter((grant) => {
		if (options.kind && grant.kind !== options.kind) return false;
		if (!names.some((name) => matchesRegentName(grant.regentName, name)))
			return false;
		return level >= grant.level;
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
