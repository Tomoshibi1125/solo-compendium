export interface CanonReviewBlocker {
	id: string;
	dataset: "jobs" | "paths" | "regents";
	entryId: string;
	fieldPath: string;
	message: string;
	dependsOnTask: number;
}

/**
 * Authored claims that cannot be made deterministic without inventing canon.
 * Release audits include these only when running against the full registry;
 * synthetic provider-quality audits remain isolated from project canon debt.
 */
export const canonicalReviewBlockers: readonly CanonReviewBlocker[] = [];
