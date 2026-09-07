import { getStaticPathUnlockLevel } from "@/lib/levelGating";
import { normalizeSkillName } from "@/lib/skills";

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
		skills?: string[] | null;
	} | null;
}

export interface PathEligibilityContext {
	jobId?: string | null;
	jobName?: string | null;
	level: number;
	skillProficiencies?: readonly string[] | null;
}

export interface PathEligibilityResult {
	eligible: boolean;
	jobMatches: boolean;
	levelMet: boolean;
	requiredLevel: number;
	missingSkills: string[];
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
	const proficientSkills = new Set(
		(context.skillProficiencies ?? []).map(normalizeSkillName),
	);
	const requiredSkills = Array.from(
		new Map(
			(path.requirements?.skills ?? []).map((skill) => [
				normalizeSkillName(skill),
				skill,
			]),
		).values(),
	);
	const missingSkills = requiredSkills.filter(
		(skill) => !proficientSkills.has(normalizeSkillName(skill)),
	);

	const reasons: string[] = [];
	if (!jobMatches) reasons.push("This path belongs to a different job.");
	if (!levelMet)
		reasons.push(`Requires level ${requiredLevel} (current ${context.level}).`);
	if (missingSkills.length > 0)
		reasons.push(`Requires proficiency in ${missingSkills.join(" and ")}.`);

	return {
		eligible: jobMatches && levelMet && missingSkills.length === 0,
		jobMatches,
		levelMet,
		requiredLevel,
		missingSkills,
		reason: reasons.join(" ") || "All path requirements are met.",
	};
}

export function isPathEligible(
	path: PathEligibilitySource,
	context: PathEligibilityContext,
): boolean {
	return getPathEligibility(path, context).eligible;
}
