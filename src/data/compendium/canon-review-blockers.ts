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
export const canonicalReviewBlockers: readonly CanonReviewBlocker[] = [
	// Task 7: every progression name is retained at its authored table level.
	// These records identify rows whose mechanic text, cadence, identity, or
	// lifecycle cannot be normalized without choosing between conflicting source
	// fields or inventing missing canon.
	{
		id: "task7:blood_regent:progression-mechanics",
		dataset: "regents",
		entryId: "blood_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Sanguine Rebirth states a cadence only in prose and omits its death-state lifecycle, while Blood Apocalypse conflicts between long-rest metadata and once-per-week prose.",
		dependsOnTask: 20,
	},
	{
		id: "task7:gravity_regent:progression-mechanics",
		dataset: "regents",
		entryId: "gravity_regent",
		fieldPath: "class_features|progression_table",
		message:
			"The source declares spellcasting but not power or technique ledgers; persistent gravity fields, micro-singularities, black holes, targets, saves, destruction, and cleanup lack a common effect lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:regents:ability-option-identities",
		dataset: "regents",
		entryId: "*",
		fieldPath: "spellcasting.additional_spells|powersKnown|techniquesKnown",
		message:
			"All forty named additional spells currently resolve to no canonical spell entry, and martial Regents name no selectable power or technique IDs; prior school and Job-list grants were thematic inference and remain quarantined pending Task 9.",
		dependsOnTask: 9,
	},
];
