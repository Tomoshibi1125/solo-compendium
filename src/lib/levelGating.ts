/**
 * Level Gating Module
 *
 * Provides deterministic, single-source-of-truth gating logic for:
 * - Job features (by level)
 * - Path unlock eligibility (by job + level)
 * - Path features (by path + level)
 * - Spell/power access (by job + level → max power level)
 * - ASI/Feat windows (by job + level)
 * - Cantrip and spell known/prepared limits (by job + level)
 *
 * All functions are pure; they accept data and return verdicts.
 * No Supabase calls — callers fetch data and pass it in.
 */

import {
	getCantripsKnownLimit,
	getCasterType,
	getSpellSlotsPerLevel,
	getSpellsKnownLimit,
	getSpellsPreparedLimit,
} from "@/lib/characterCalculations";
import {
	getMaxPowerLevelForJobAtLevel,
	type JobReference,
} from "@/lib/characterCreation";
import { getStaticPaths } from "@/lib/ProtocolDataManager";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LevelGateVerdict {
	allowed: boolean;
	reason: string;
}

export interface PathUnlockMeta {
	pathId: string;
	pathName: string;
	pathLevel: number; // level at which the job unlocks this path
	jobId: string;
	jobName: string;
}

export interface FeatureGateMeta {
	featureId: string;
	featureName: string;
	requiredLevel: number;
	isPathFeature: boolean;
	pathId?: string | null;
}

export interface PowerGateMeta {
	powerId: string;
	powerName: string;
	powerLevel: number; // spell level (0 = cantrip)
	jobNames: string[];
}

// Standard 5e ASI/Feat levels (applies to most classes)
const STANDARD_ASI_LEVELS = [4, 8, 12, 16, 19];

// Job-specific ASI level overrides
const JOB_ASI_OVERRIDES: Record<string, number[]> = {
	Vanguard: [4, 6, 8, 12, 14, 16, 19],
	Striker: [4, 8, 12, 16, 19],
	Assassin: [4, 8, 10, 12, 16, 19],
};

// ---------------------------------------------------------------------------
// Static path helpers
// ---------------------------------------------------------------------------

/**
 * Extract the unlock level from any static-shaped path object.
 * CompendiumPath (from ProtocolDataManager / dataLoaders) exposes `level`
 * directly because loadPaths maps requirements.level → level.
 * Raw paths.ts objects expose it under `requirements.level`.
 * This helper handles both shapes so callers never need to know.
 */
export function getStaticPathUnlockLevel(path: {
	level?: number | null;
	requirements?: { level?: number | null } | null;
}): number {
	// CompendiumPath (most common in runtime code)
	if (typeof path.level === "number") return path.level;
	// Raw paths.ts shape (used in tests / direct imports)
	if (typeof path.requirements?.level === "number")
		return path.requirements.level;
	// Default to standard 5e path level
	return 3;
}

/**
 * Get the minimum path-unlock level for a given job name from static data.
 * Returns null when no paths exist for the job.
 * Handles both slug-style job_ids ("holy-knight") and display names ("Holy Knight").
 */
export function getMinPathUnlockLevelForJob(jobName: string): number | null {
	// Normalize: lowercase + strip all hyphens and spaces so
	// "Holy Knight" === "holy-knight" === "holyknight".
	const slugify = (s: string) =>
		s
			.trim()
			.toLowerCase()
			.replace(/[-\s]+/g, "");
	const norm = slugify(jobName);

	const all = getStaticPaths();
	const jobPaths = all.filter((p) => {
		// CompendiumPath (runtime) exposes job_id (e.g. "holy-knight")
		if (slugify(p.job_id) === norm) return true;
		// Raw paths.ts shape exposes jobName (e.g. "Holy Knight") and jobId
		const raw = p as unknown as { jobName?: string; jobId?: string };
		if (raw.jobName && slugify(raw.jobName) === norm) return true;
		if (raw.jobId && slugify(raw.jobId) === norm) return true;
		return false;
	});

	if (jobPaths.length === 0) return null;
	const levels = jobPaths.map((p) => getStaticPathUnlockLevel(p));
	return Math.min(...levels);
}

// ---------------------------------------------------------------------------
// Path unlock gating
// ---------------------------------------------------------------------------

/**
 * Can a character of the given level choose a path for this job?
 */
export function canUnlockPath(
	characterLevel: number,
	pathMeta: PathUnlockMeta,
): LevelGateVerdict {
	if (characterLevel >= pathMeta.pathLevel) {
		return {
			allowed: true,
			reason: `Path "${pathMeta.pathName}" unlocks at level ${pathMeta.pathLevel}.`,
		};
	}
	return {
		allowed: false,
		reason: `Path "${pathMeta.pathName}" requires level ${pathMeta.pathLevel}. Current level: ${characterLevel}.`,
	};
}

/**
 * Filter an array of paths down to those accessible at the given character level.
 */
export function filterAccessiblePaths(
	characterLevel: number,
	paths: PathUnlockMeta[],
): PathUnlockMeta[] {
	return paths.filter((p) => canUnlockPath(characterLevel, p).allowed);
}

/**
 * Is this level the path-unlock level for any path on the given job?
 * Useful for prompting path selection during level-up.
 */
export function isPathUnlockLevel(
	characterLevel: number,
	paths: PathUnlockMeta[],
): boolean {
	return paths.some((p) => p.pathLevel === characterLevel);
}

// ---------------------------------------------------------------------------
// Feature gating
// ---------------------------------------------------------------------------

/**
 * Can a character at this level acquire the given feature?
 */
export function canAcquireFeature(
	characterLevel: number,
	feature: FeatureGateMeta,
): LevelGateVerdict {
	if (characterLevel >= feature.requiredLevel) {
		return {
			allowed: true,
			reason: `Feature "${feature.featureName}" unlocks at level ${feature.requiredLevel}.`,
		};
	}
	return {
		allowed: false,
		reason: `Feature "${feature.featureName}" requires level ${feature.requiredLevel}. Current level: ${characterLevel}.`,
	};
}

/**
 * Filter features to only those accessible at the given level.
 */
export function filterAccessibleFeatures(
	characterLevel: number,
	features: FeatureGateMeta[],
): FeatureGateMeta[] {
	return features.filter((f) => canAcquireFeature(characterLevel, f).allowed);
}

/**
 * Get features that unlock *exactly at* the given level (for level-up grants).
 */
export function getFeaturesUnlockedAtLevel(
	level: number,
	features: FeatureGateMeta[],
): FeatureGateMeta[] {
	return features.filter((f) => f.requiredLevel === level);
}

// ---------------------------------------------------------------------------
// Power / spell gating
// ---------------------------------------------------------------------------

/**
 * Can a character learn/prepare the given power at their current level?
 */
export function canAccessPower(
	characterLevel: number,
	job: JobReference,
	power: PowerGateMeta,
): LevelGateVerdict {
	const jobName = typeof job === "string" ? job : job?.name;
	// Cantrips (level 0) are always accessible if the job is a caster
	if (power.powerLevel === 0) {
		const casterType = getCasterType(job);
		if (casterType === "none") {
			return {
				allowed: false,
				reason: `Job "${jobName}" has no spellcasting progression.`,
			};
		}
		return {
			allowed: true,
			reason: "Cantrips are always accessible for casters.",
		};
	}

	const maxLevel = getMaxPowerLevelForJobAtLevel(job, characterLevel);
	if (maxLevel <= 0) {
		return {
			allowed: false,
			reason: `Job "${jobName}" has no spellcasting at level ${characterLevel}.`,
		};
	}

	if (power.powerLevel > maxLevel) {
		return {
			allowed: false,
			reason: `Power "${power.powerName}" (level ${power.powerLevel}) exceeds max power level ${maxLevel} at character level ${characterLevel}.`,
		};
	}

	// Check job compatibility
	if (jobName && power.jobNames.length > 0) {
		const normalizedJob = jobName.trim().toLowerCase();
		const isJobMatch = power.jobNames.some(
			(j) => j.trim().toLowerCase() === normalizedJob,
		);
		if (!isJobMatch) {
			return {
				allowed: false,
				reason: `Power "${power.powerName}" is not available to job "${jobName}".`,
			};
		}
	}

	return {
		allowed: true,
		reason: `Power "${power.powerName}" is accessible at level ${characterLevel}.`,
	};
}

/**
 * Filter powers to only those accessible at the given level for the given job.
 */
export function filterAccessiblePowers(
	characterLevel: number,
	job: JobReference,
	powers: PowerGateMeta[],
): PowerGateMeta[] {
	return powers.filter((p) => canAccessPower(characterLevel, job, p).allowed);
}

// ---------------------------------------------------------------------------
// ASI / Feat gating
// ---------------------------------------------------------------------------

/**
 * Get ASI/Feat levels for a given job.
 */
export function getASILevels(job: JobReference): number[] {
	const jobName = typeof job === "string" ? job : job?.name;
	if (!jobName) return STANDARD_ASI_LEVELS;
	const normalized = jobName.trim();
	return JOB_ASI_OVERRIDES[normalized] ?? STANDARD_ASI_LEVELS;
}

/**
 * Is this level an ASI/Feat opportunity for the given job?
 */
export function isASILevel(characterLevel: number, job: JobReference): boolean {
	return getASILevels(job).includes(characterLevel);
}

/**
 * How many ASI/Feat selections has the character earned up to (and including) this level?
 */
export function getASICountAtLevel(
	characterLevel: number,
	job: JobReference,
): number {
	return getASILevels(job).filter((l) => l <= characterLevel).length;
}

// ---------------------------------------------------------------------------
// Spell slot gating (re-exports with gating context)
// ---------------------------------------------------------------------------

/**
 * Get the maximum spell/power level a character can access.
 */
export function getMaxAccessiblePowerLevel(
	job: JobReference,
	characterLevel: number,
): number {
	return getMaxPowerLevelForJobAtLevel(job, characterLevel);
}

/**
 * Get spell slots available at the given level.
 */
export function getAvailableSpellSlots(
	job: JobReference,
	characterLevel: number,
): Record<number, number> {
	const casterType = getCasterType(job);
	return getSpellSlotsPerLevel(casterType, characterLevel);
}

/**
 * Get cantrip limit at the given level.
 */
export function getCantripLimit(
	job: JobReference,
	characterLevel: number,
): number | null {
	return getCantripsKnownLimit(job, characterLevel);
}

/**
 * Get spells-known limit at the given level (for known-casters only).
 */
export function getSpellsKnown(
	job: JobReference,
	characterLevel: number,
): number | null {
	return getSpellsKnownLimit(job, characterLevel);
}

/**
 * Get spells-prepared limit at the given level.
 */
export function getSpellsPrepared(
	job: JobReference,
	characterLevel: number,
	abilityModifier: number,
): number | null {
	return getSpellsPreparedLimit(job, characterLevel, abilityModifier);
}

// ---------------------------------------------------------------------------
// Composite gating summary (for UI display)
// ---------------------------------------------------------------------------

interface LevelUpGatingSummary {
	level: number;
	jobName: string;
	pathName: string | null;
	isPathUnlockLevel: boolean;
	isASILevel: boolean;
	asiCount: number;
	maxPowerLevel: number;
	cantripLimit: number | null;
	spellsKnownLimit: number | null;
	newFeatureCount: number;
	availableSlots: Record<number, number>;
}

/**
 * Build a full gating summary for a level-up to the given target level.
 */
export function buildLevelUpGatingSummary(
	targetLevel: number,
	jobName: string,
	pathName: string | null,
	allPaths: PathUnlockMeta[],
	allFeatures: FeatureGateMeta[],
): LevelUpGatingSummary {
	const newFeatures = getFeaturesUnlockedAtLevel(targetLevel, allFeatures);

	return {
		level: targetLevel,
		jobName,
		pathName,
		isPathUnlockLevel: isPathUnlockLevel(targetLevel, allPaths),
		isASILevel: isASILevel(targetLevel, jobName),
		asiCount: getASICountAtLevel(targetLevel, jobName),
		maxPowerLevel: getMaxAccessiblePowerLevel(jobName, targetLevel),
		cantripLimit: getCantripLimit(jobName, targetLevel),
		spellsKnownLimit: getSpellsKnown(jobName, targetLevel),
		newFeatureCount: newFeatures.length,
		availableSlots: getAvailableSpellSlots(jobName, targetLevel),
	};
}
