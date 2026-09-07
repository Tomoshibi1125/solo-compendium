import type {
	PathAbilityGrant,
	PathAbilityKind,
} from "@/lib/pathAbilityAccess";

/**
 * Regent option access is deliberately explicit-only. The current Regent
 * source declares spell/power/technique pick counts, but its additional spell
 * names resolve to no canonical catalog entries and it names no martial option
 * IDs. The previous school and Job-list mappings were thematic inventions.
 * Task 9 owns identity reconciliation; until then an empty grant set is safer
 * than silently granting broad lists.
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

export const REGENT_ABILITY_GRANTS: readonly RegentAbilityGrant[] = [];

/**
 * Return source-backed Regent grants only. No aliases or theme matching are
 * performed because no current Regent option identity has passed canon review.
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
