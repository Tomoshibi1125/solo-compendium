import type { CompendiumCategory, MergeResolution } from "./registry";

/**
 * Reviewed canon conflict resolutions.
 *
 * Entries must cite a specific registry conflict id, the selected source/value,
 * a source-backed rationale, and the reviewer. Do not add source-order or
 * "last one wins" fallbacks here. An empty manifest means every detected
 * contradiction remains visible and release-blocking.
 */
export const canonicalConflictResolutions: readonly MergeResolution[] = [];

export interface CanonicalContentDisposition {
	category: CompendiumCategory;
	entryId: string;
	disposition: "quarantined";
	rationale: string;
	reviewedBy: string;
}

/**
 * Reviewed entries retained in their authored source shard for provenance but
 * intentionally excluded from runtime canon until a distinct identity or a
 * source-backed merge is authored.
 */
export const canonicalContentDispositions = [
	{
		category: "powers",
		entryId: "power-sup-7-93-fortress-mode",
		disposition: "quarantined",
		rationale:
			"The authoritative Bulwark path already owns Fortress Mode with incompatible mechanics. The supplemental power has no distinct canonical identity, so it remains source evidence but cannot enter runtime canon.",
		reviewedBy: "canon-review-task-4",
	},
	{
		category: "powers",
		entryId: "power-sup-5-87-absolute-smite",
		disposition: "quarantined",
		rationale:
			"The authoritative Absolute Devotion path already owns Absolute Smite with incompatible damage and rider mechanics. The supplemental power has no distinct canonical identity, so it remains source evidence pending the Task 9 identity review.",
		reviewedBy: "canon-review-task-5",
	},
	{
		category: "powers",
		entryId: "power-sup-4-111-parallel-processing",
		disposition: "quarantined",
		rationale:
			"The authoritative Mage progression already owns Parallel Processing as a class feature with different mechanics. The supplemental power has no distinct canonical identity, so it remains source evidence pending the Task 9 identity review.",
		reviewedBy: "canon-review-task-5",
	},
	{
		category: "powers",
		entryId: "power-sup-1-7-shadow-strike",
		disposition: "quarantined",
		rationale:
			"The authoritative Umbral Ascendant path already owns Shadow Strike with incompatible invisibility, damage, fear, cadence, and ownership mechanics. The supplemental Assassin power remains source evidence pending the Task 9 identity review.",
		reviewedBy: "canon-review-task-6",
	},
	{
		category: "powers",
		entryId: "power-sup-2-29-entropic-counter",
		disposition: "quarantined",
		rationale:
			"The authoritative Entropic Flow path already owns Entropic Counter with incompatible trigger, attack, cadence, and ownership mechanics. The supplemental Revenant power remains source evidence pending the Task 9 identity review.",
		reviewedBy: "canon-review-task-6",
	},
] as const satisfies readonly CanonicalContentDisposition[];

export function isCanonicalEntryQuarantined(
	category: CompendiumCategory,
	entryId: string,
): boolean {
	return canonicalContentDispositions.some(
		(disposition) =>
			disposition.category === category &&
			disposition.entryId === entryId &&
			disposition.disposition === "quarantined",
	);
}
