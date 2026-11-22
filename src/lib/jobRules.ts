/**
 * Canonical Job rule resolution.
 *
 * Jobs are the authored source for companion automation.  This module only
 * indexes that catalog and normalizes its display-name fields; it must never
 * grow a second job-name-to-rule table.
 */
import { type Job, jobs } from "@/data/compendium/jobs";
import {
	PATH_CASTERS,
	type PathCasterRecord,
} from "@/data/compendium/pathSpellcasting";
import type { PathSpellcasting } from "@/data/compendium/paths";
import { normalizeAbilityScoreCode } from "@/lib/abilityScoreCodes";
import type {
	CanonicalJobRules,
	JobAbilityAccessMode,
	JobCasterType,
} from "@/types/character";
import type { AbilityScore } from "@/types/core-rules";

export type CanonicalJobReference =
	| string
	| { id?: string | null; name?: string | null }
	| null
	| undefined;

export type JobSpellProgression = "none" | "full" | "half" | "pact";

export function normalizeCanonicalJobToken(
	value: string | null | undefined,
): string {
	return (value ?? "")
		.trim()
		.toLowerCase()
		.replace(/[_\s]+/g, "-");
}

const jobsByToken = (() => {
	const index = new Map<string, Job>();
	for (const job of jobs) {
		index.set(normalizeCanonicalJobToken(job.id), job);
		index.set(normalizeCanonicalJobToken(job.name), job);
	}
	return index;
})();

function candidateTokens(job: CanonicalJobReference): string[] {
	if (typeof job === "string") return [job];
	if (!job) return [];
	return [job.id ?? "", job.name ?? ""];
}

/** Resolve a supplied Job id/name to its authored catalog record. */
export function getCanonicalJob(job: CanonicalJobReference): Job | null {
	for (const token of candidateTokens(job)) {
		const found = jobsByToken.get(normalizeCanonicalJobToken(token));
		if (found) return found;
	}
	return null;
}

export function getCanonicalJobRules(
	job: CanonicalJobReference,
): CanonicalJobRules | null {
	return getCanonicalJob(job)?.canonicalRules ?? null;
}

export function getCanonicalJobCasterType(
	job: CanonicalJobReference,
): JobCasterType | null {
	return getCanonicalJobRules(job)?.casterType ?? null;
}

export function getCanonicalJobSpellProgression(
	job: CanonicalJobReference,
): JobSpellProgression | null {
	const casterType = getCanonicalJobCasterType(job);
	if (!casterType) return null;
	return casterType === "artificer" ? "half" : casterType;
}

export function getCanonicalJobPrimaryAbility(
	job: CanonicalJobReference,
): AbilityScore | null {
	const record = getCanonicalJob(job);
	if (!record) return null;
	return (
		normalizeAbilityScoreCode(record.primaryAbility) ??
		normalizeAbilityScoreCode(record.primary_abilities?.[0])
	);
}

export function getCanonicalJobSpellcastingAbility(
	job: CanonicalJobReference,
): AbilityScore | null {
	const record = getCanonicalJob(job);
	if (!record?.spellcasting) return null;
	return normalizeAbilityScoreCode(record.spellcasting.ability);
}

/**
 * A Job reference that also carries the character's Path, so casting rules
 * can include Path spellcasting (third-caster Paths of non-casting Jobs).
 */
export interface CastingJobReference {
	id?: string | null;
	name: string;
	path?: string | null;
	pathId?: string | null;
}

/** Build a casting reference from a character row's Job and Path fields. */
export function toCastingReference(
	character:
		| {
				job?: string | null;
				job_id?: string | null;
				path?: string | null;
				path_id?: string | null;
		  }
		| null
		| undefined,
): CastingJobReference | null {
	if (!character?.job) return null;
	return {
		id: character.job_id ?? null,
		name: character.job,
		path: character.path ?? null,
		pathId: character.path_id ?? null,
	};
}

const normalizePathCasterToken = (value: string | null | undefined): string =>
	(value ?? "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const pathCastersByToken = (() => {
	const index = new Map<string, PathCasterRecord>();
	for (const caster of PATH_CASTERS) {
		for (const token of [caster.pathId, ...caster.names]) {
			index.set(normalizePathCasterToken(token), caster);
		}
	}
	return index;
})();

/**
 * Spellcasting granted by the referenced character's Path, when the Path
 * belongs to that Job and casts. A plain Job reference has no Path, so it
 * resolves to null.
 */
export function getCanonicalPathSpellcasting(
	job: CanonicalJobReference | CastingJobReference,
): PathSpellcasting | null {
	if (!job || typeof job !== "object") return null;
	const { path, pathId } = job as Partial<CastingJobReference>;
	const caster = [pathId, path]
		.map((token) => pathCastersByToken.get(normalizePathCasterToken(token)))
		.find((candidate): candidate is PathCasterRecord => Boolean(candidate));
	if (!caster) return null;
	return getCanonicalJob(job)?.id === caster.jobId ? caster.spellcasting : null;
}

export function getCanonicalJobAbilityAccessMode(
	job: CanonicalJobReference,
	kind: "spell" | "power" | "technique",
): JobAbilityAccessMode | null {
	const rules = getCanonicalJobRules(job);
	if (!rules) return null;
	if (kind === "spell") return rules.spellAccess ?? null;
	if (kind === "power") return rules.powerAccess ?? null;
	return rules.techniqueAccess ?? null;
}

export function getCanonicalJobSpellSchools(
	job: CanonicalJobReference,
): string[] | null {
	const rules = getCanonicalJobRules(job);
	if (!rules?.spellAccess) return null;
	return rules.spellSchools ? [...rules.spellSchools] : [];
}
