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
		id: "task7:radiant_regent:progression-mechanics",
		dataset: "regents",
		entryId: "radiant_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Purifying Presence and Flame Emperor have no exact mechanic rows; Flame Dominion, Purification Flame, and Phoenix Rebirth disagree with flat power levels or omit a complete death/rebirth lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:steel_regent:progression-mechanics",
		dataset: "regents",
		entryId: "steel_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Organic/Flesh versus Steel/Invulnerability vocabulary is unresolved, several progression names have no mechanic rows, Conceptual Invulnerability has no safe toggle/end-state model, and permanent construct control has no controlled-entity lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:destruction_regent:progression-mechanics",
		dataset: "regents",
		entryId: "destruction_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Decimation Field has no mechanic row; Breath of Annihilation and Destruction Dominion conflict with their flat power levels; Dragon terminology is not approved as an alias or identity merge.",
		dependsOnTask: 20,
	},
	{
		id: "task7:war_regent:progression-mechanics",
		dataset: "regents",
		entryId: "war_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Leadership Presence has no mechanic row; Vanguard Step versus Tactical Step and Absolute War versus Absolute Command are unresolved identities; armies, surrender, commands, and extra attacks lack a complete action-economy and controlled-entity lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:frost_regent:progression-mechanics",
		dataset: "regents",
		entryId: "frost_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Absolute Zero Touch is level 2 in class_features but level 3 in progression_table, and Glacial Eternity's 'prof/long rest' abbreviation does not author an unambiguous structured use formula.",
		dependsOnTask: 20,
	},
	{
		id: "task7:beast_regent:progression-mechanics",
		dataset: "regents",
		entryId: "beast_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Apex Form's 'prof/long rest' abbreviation lacks an unambiguous use formula, Beast King's Call conflicts between once-per-day metadata and once-per-week prose, and commanded beasts have no complete entity lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:plague_regent:progression-mechanics",
		dataset: "regents",
		entryId: "plague_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Pandemic Decree conflicts between once-per-day metadata and once-per-month prose; generic and high-tier names lack complete mechanics; diseases and split swarms have no shared duration, cure, command, or persistence lifecycle.",
		dependsOnTask: 20,
	},
	{
		id: "task7:spatial_regent:progression-mechanics",
		dataset: "regents",
		entryId: "spatial_regent",
		fieldPath: "class_features|progression_table",
		message:
			"Reality Rewrite conflicts between long-rest metadata and weekly prose; Spatial Anchors, demiplanes, unwilling teleportation, permanent topology, and the unapproved Architect identity lack complete lifecycle and save rules.",
		dependsOnTask: 20,
	},
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
