import { getStaticPathUnlockLevel } from "@/lib/levelGating";

export interface PathEligibilitySource {
	id?: string | null;
	name?: string | null;
	job_id?: string | null;
	jobId?: string | null;
	jobName?: string | null;
	level?: number | null;
	path_level?: number | null;
	requirements?: {
		level?: number | null;
	} | null;
}

export interface PathEligibilityContext {
	jobId?: string | null;
	jobName?: string | null;
	level: number;
}

export interface PathEligibilityResult {
	eligible: boolean;
	jobMatches: boolean;
	levelMet: boolean;
	requiredLevel: number;
	reason: string;
}

const normalizeOwner = (value: string | null | undefined): string =>
	(value ?? "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "");

export function getPathEligibility(
	path: PathEligibilitySource,
	context: PathEligibilityContext,
): PathEligibilityResult {
	const pathOwners = [path.job_id, path.jobId, path.jobName]
		.map(normalizeOwner)
		.filter(Boolean);
	const characterOwners = [context.jobId, context.jobName]
		.map(normalizeOwner)
		.filter(Boolean);
	const jobMatches =
		pathOwners.length === 0 ||
		pathOwners.some((owner) => characterOwners.includes(owner));
	const requiredLevel =
		path.path_level ??
		getStaticPathUnlockLevel({
			level: path.level,
			requirements: path.requirements,
		});
	const levelMet = context.level >= requiredLevel;
	const reasons: string[] = [];
	if (!jobMatches) reasons.push("This path belongs to a different job.");
	if (!levelMet)
		reasons.push(`Requires level ${requiredLevel} (current ${context.level}).`);

	return {
		eligible: jobMatches && levelMet,
		jobMatches,
		levelMet,
		requiredLevel,
		reason: reasons.join(" ") || "Path is available.",
	};
}

export function isPathEligible(
	path: PathEligibilitySource,
	context: PathEligibilityContext,
): boolean {
	return getPathEligibility(path, context).eligible;
}
