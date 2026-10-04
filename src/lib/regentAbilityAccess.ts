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

/**
 * Regent option access grants. Task 7: All regent grants are quarantined.
 * Regents do not broaden Job spell/power/technique access by theme.
 * Access is explicit-only through levelChoices in regent definitions.
 */
export const REGENT_ABILITY_GRANTS: readonly RegentAbilityGrant[] = [];

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
