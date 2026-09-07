import {
	cloneSerializable,
	createPlanIssue,
	createStablePlanningId,
	type MechanicalReference,
	type PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	type SerializableRecord,
	type SerializableValue,
	type SourceEvidenceV1,
	stableSerialize,
} from "./contracts";
import {
	type MechanicalReferenceResolutionV1,
	toUnresolvedMechanicalReferenceV1,
	type UnresolvedMechanicalReferenceV1,
} from "./references";

export const CHARACTER_MECHANICAL_SNAPSHOT_VERSION = 1 as const;

export type AbilityScoreKey =
	| "strength"
	| "agility"
	| "vitality"
	| "intelligence"
	| "sense"
	| "presence";

export interface StoredCharacterMechanicalBasesV1 {
	level: number;
	experience: number | null;
	abilityScores: Record<AbilityScoreKey, number | null>;
	hitPointsMaximum: number;
	baseArmorClass: number | null;
	baseSpeed: Record<string, number>;
	proficiencyBonus: number | null;
	hitDice: {
		maximum: number;
		size: number;
	};
	additional: SerializableRecord;
}

/** A value derived from authored canonical rules, not a persisted base value. */
export interface CanonicalDerivedMechanicalValueV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	key: string;
	value: SerializableValue;
	formula: string | null;
	sourceEvidence: SourceEvidenceV1[];
	unresolvedReferenceIds: string[];
}

export interface TransientModifierSnapshotV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	modifierId: string;
	target: string;
	mode: "add" | "multiply" | "set" | "override" | "manual";
	value: SerializableValue;
	active: boolean;
	custom: boolean;
	sourceEvidence: SourceEvidenceV1[];
}

export interface TransientResourceSnapshotV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	resourceId: string;
	key: string;
	current: number;
	maximum: number | null;
	temporary: number;
	custom: boolean;
	manual: boolean;
	sourceEvidence: SourceEvidenceV1[];
}

/** Effects are observed state only; this module does not resolve actions/rests. */
export interface TransientEffectSnapshotV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	effectId: string;
	key: string;
	active: boolean;
	state: SerializableRecord;
	manual: boolean;
	sourceEvidence: SourceEvidenceV1[];
}

/** Conditions are observed state only; this module does not apply or expire them. */
export interface TransientConditionSnapshotV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	conditionId: string;
	key: string;
	active: boolean;
	state: SerializableRecord;
	manual: boolean;
	sourceEvidence: SourceEvidenceV1[];
}

export interface CharacterMechanicalSnapshotV1 {
	version: typeof CHARACTER_MECHANICAL_SNAPSHOT_VERSION;
	kind: "character-mechanical-snapshot";
	snapshotId: string;
	character: {
		id: string;
		displayName: string | null;
	};
	storedBases: StoredCharacterMechanicalBasesV1;
	canonicalDerivedValues: CanonicalDerivedMechanicalValueV1[];
	transient: {
		modifiers: TransientModifierSnapshotV1[];
		resources: TransientResourceSnapshotV1[];
		effects: TransientEffectSnapshotV1[];
		conditions: TransientConditionSnapshotV1[];
	};
	references: {
		resolved: MechanicalReference[];
		unresolved: UnresolvedMechanicalReferenceV1[];
	};
	issues: PlanIssue[];
	sourceEvidence: SourceEvidenceV1[];
}

export interface CharacterMechanicalSnapshotInputV1 {
	characterId: string;
	displayName?: string | null;
	storedBases: StoredCharacterMechanicalBasesV1;
	canonicalDerivedValues?: readonly CanonicalDerivedMechanicalValueV1[];
	transient?: {
		modifiers?: readonly TransientModifierSnapshotV1[];
		resources?: readonly TransientResourceSnapshotV1[];
		effects?: readonly TransientEffectSnapshotV1[];
		conditions?: readonly TransientConditionSnapshotV1[];
	};
	referenceResolutions?: readonly MechanicalReferenceResolutionV1[];
	sourceEvidence?: readonly SourceEvidenceV1[];
}

function sortBy<T>(entries: readonly T[], key: (entry: T) => string): T[] {
	return [...entries]
		.sort(
			(left, right) =>
				key(left).localeCompare(key(right)) ||
				stableSerialize(left).localeCompare(stableSerialize(right)),
		)
		.map((entry) => cloneSerializable(entry));
}

function sortedNumericRecord(
	input: Record<string, number>,
): Record<string, number> {
	return Object.fromEntries(
		Object.entries(input)
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([key, value]) => [key, value]),
	);
}

function sortedSerializableRecord(
	input: SerializableRecord,
): SerializableRecord {
	return Object.fromEntries(
		Object.entries(input)
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([key, value]) => [key, cloneSerializable(value)]),
	);
}

function duplicateIdIssues(
	collection: string,
	ids: readonly string[],
	pathRoot = `transient.${collection}`,
): PlanIssue[] {
	const seen = new Set<string>();
	const duplicates = new Set<string>();
	for (const id of ids) {
		if (seen.has(id)) duplicates.add(id);
		seen.add(id);
	}
	return [...duplicates]
		.sort((left, right) => left.localeCompare(right))
		.map((id) =>
			createPlanIssue({
				severity: "strict",
				code: "snapshot-duplicate-id",
				message: `Duplicate ${collection} identity: ${id}`,
				path: `${pathRoot}.${id}`,
			}),
		);
}

/**
 * Capture already-known mechanics without deriving, resolving, or mutating any
 * of them. Reference resolution results remain explicit in the snapshot.
 */
export function createCharacterMechanicalSnapshotV1(
	input: CharacterMechanicalSnapshotInputV1,
): CharacterMechanicalSnapshotV1 {
	const canonicalDerivedValues = sortBy(
		input.canonicalDerivedValues ?? [],
		(entry) => entry.key,
	);
	const modifiers = sortBy(
		input.transient?.modifiers ?? [],
		(entry) => entry.modifierId,
	);
	const resources = sortBy(
		input.transient?.resources ?? [],
		(entry) => entry.resourceId,
	);
	const effects = sortBy(
		input.transient?.effects ?? [],
		(entry) => entry.effectId,
	);
	const conditions = sortBy(
		input.transient?.conditions ?? [],
		(entry) => entry.conditionId,
	);
	const resolutions = input.referenceResolutions ?? [];
	const resolved = resolutions
		.filter(
			(
				entry,
			): entry is Extract<
				MechanicalReferenceResolutionV1,
				{ status: "resolved" }
			> => entry.status === "resolved",
		)
		.map((entry) => cloneSerializable(entry.reference))
		.sort(
			(left, right) =>
				`${left.kind}:${left.id}`.localeCompare(`${right.kind}:${right.id}`) ||
				stableSerialize(left).localeCompare(stableSerialize(right)),
		);
	const unresolved = resolutions
		.map(toUnresolvedMechanicalReferenceV1)
		.filter((entry): entry is UnresolvedMechanicalReferenceV1 => entry !== null)
		.sort((left, right) => left.requestId.localeCompare(right.requestId));

	const issues: PlanIssue[] = resolutions.flatMap((entry) =>
		entry.issues.map((issue) => cloneSerializable(issue)),
	);
	if (!input.characterId.trim()) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "snapshot-character-id-required",
				message: "A mechanical snapshot requires an explicit character ID",
				path: "character.id",
			}),
		);
	}
	if (
		!Number.isInteger(input.storedBases.level) ||
		input.storedBases.level < 1 ||
		input.storedBases.level > 20
	) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "snapshot-level-out-of-range",
				message: "Stored character level must be an integer from 1 through 20",
				path: "storedBases.level",
			}),
		);
	}
	issues.push(
		...duplicateIdIssues(
			"canonical derived values",
			canonicalDerivedValues.map((entry) => entry.key),
			"canonicalDerivedValues",
		),
		...duplicateIdIssues(
			"modifiers",
			modifiers.map((entry) => entry.modifierId),
		),
		...duplicateIdIssues(
			"resources",
			resources.map((entry) => entry.resourceId),
		),
		...duplicateIdIssues(
			"effects",
			effects.map((entry) => entry.effectId),
		),
		...duplicateIdIssues(
			"conditions",
			conditions.map((entry) => entry.conditionId),
		),
	);
	issues.sort((left, right) => left.issueId.localeCompare(right.issueId));

	const storedBases: StoredCharacterMechanicalBasesV1 = {
		level: input.storedBases.level,
		experience: input.storedBases.experience,
		abilityScores: cloneSerializable(input.storedBases.abilityScores),
		hitPointsMaximum: input.storedBases.hitPointsMaximum,
		baseArmorClass: input.storedBases.baseArmorClass,
		baseSpeed: sortedNumericRecord(input.storedBases.baseSpeed),
		proficiencyBonus: input.storedBases.proficiencyBonus,
		hitDice: cloneSerializable(input.storedBases.hitDice),
		additional: sortedSerializableRecord(input.storedBases.additional),
	};
	const snapshotSeed = {
		characterId: input.characterId,
		storedBases,
		canonicalDerivedValues,
		transient: { modifiers, resources, effects, conditions },
		resolvedReferenceIds: resolved.map((entry) => `${entry.kind}:${entry.id}`),
		unresolvedReferenceIds: unresolved.map((entry) => entry.requestId),
	};

	return {
		version: CHARACTER_MECHANICAL_SNAPSHOT_VERSION,
		kind: "character-mechanical-snapshot",
		snapshotId: createStablePlanningId("character-snapshot", snapshotSeed),
		character: {
			id: input.characterId,
			displayName: input.displayName ?? null,
		},
		storedBases,
		canonicalDerivedValues,
		transient: { modifiers, resources, effects, conditions },
		references: { resolved, unresolved },
		issues,
		sourceEvidence: sortBy(input.sourceEvidence ?? [], (entry) =>
			[
				entry.kind,
				entry.sourceType,
				entry.sourceId ?? "",
				entry.path ?? "",
			].join(":"),
		),
	};
}

export const buildCharacterMechanicalSnapshotV1 =
	createCharacterMechanicalSnapshotV1;
