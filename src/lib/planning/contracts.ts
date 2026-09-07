/**
 * Shared, persistence-agnostic contracts for pure planning APIs.
 *
 * Nothing in this module reads a clock, generates a random UUID, performs I/O,
 * or assumes that a display name is a persisted identity.
 */

export const PLANNING_SCHEMA_VERSION = 1 as const;

export type SerializablePrimitive = string | number | boolean | null;
export type SerializableValue =
	| SerializablePrimitive
	| SerializableValue[]
	| { [key: string]: SerializableValue };
export type SerializableRecord = { [key: string]: SerializableValue };

/** Return true only for values that JSON can round-trip without coercion. */
export function isSerializableValue(
	value: unknown,
): value is SerializableValue {
	if (
		value === null ||
		typeof value === "string" ||
		typeof value === "boolean"
	) {
		return true;
	}
	if (typeof value === "number") return Number.isFinite(value);
	if (Array.isArray(value)) return value.every(isSerializableValue);
	if (typeof value !== "object") return false;

	const prototype = Object.getPrototypeOf(value);
	if (prototype !== Object.prototype && prototype !== null) return false;
	return Object.values(value).every(isSerializableValue);
}

/** Deep-clone a serializable value so plans never retain mutable caller state. */
export function cloneSerializable<T>(value: T): T {
	if (!isSerializableValue(value)) {
		throw new TypeError(
			"Planning values must be finite, JSON-serializable data",
		);
	}
	if (Array.isArray(value)) {
		return value.map((entry) => cloneSerializable(entry)) as T;
	}
	if (value !== null && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [
				key,
				cloneSerializable(entry),
			]),
		) as T;
	}
	return value;
}

function canonicalize(value: SerializableValue): SerializableValue {
	if (Array.isArray(value)) return value.map(canonicalize);
	if (value !== null && typeof value === "object") {
		return Object.fromEntries(
			Object.keys(value)
				.sort((left, right) => left.localeCompare(right))
				.map((key) => [key, canonicalize(value[key])]),
		);
	}
	return value;
}

/** Stable serialization used for equality and deterministic planning IDs. */
export function stableSerialize(value: unknown): string {
	if (!isSerializableValue(value)) {
		throw new TypeError(
			"Planning values must be finite, JSON-serializable data",
		);
	}
	return JSON.stringify(canonicalize(value));
}

export function serializableEquals(left: unknown, right: unknown): boolean {
	return stableSerialize(left) === stableSerialize(right);
}

function stableHash(value: string): string {
	let hash = 14695981039346656037n;
	const prime = 1099511628211n;
	const mask = 0xffffffffffffffffn;
	for (let index = 0; index < value.length; index += 1) {
		hash ^= BigInt(value.charCodeAt(index));
		hash = (hash * prime) & mask;
	}
	return hash.toString(36).padStart(13, "0");
}

/**
 * Build a deterministic identifier. It is a stable planning key, not a claim
 * that a persistence-layer entity exists.
 */
export function createStablePlanningId(
	namespace: string,
	seed: unknown,
): string {
	const normalizedNamespace =
		namespace
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "") || "plan";
	return `${normalizedNamespace}:v1:${stableHash(stableSerialize(seed))}`;
}

export function createStableOperationId(seed: unknown): string {
	return createStablePlanningId("operation", seed);
}

export type SourceEvidenceKind =
	| "stored"
	| "canonical"
	| "campaign"
	| "homebrew"
	| "manual"
	| "freeform"
	| "derived";

export interface SourceEvidenceV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	kind: SourceEvidenceKind;
	sourceType: string;
	sourceId: string | null;
	sourceVersion: string | number | null;
	path: string | null;
	label: string | null;
	observed: SerializableValue | null;
}

interface PlanIssueBaseV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	issueId: string;
	code: string;
	message: string;
	path: string | null;
	evidence: SourceEvidenceV1[];
}

/**
 * `strict`, `manual`, and `review-blocked` issues block automatic application.
 * Warnings are deliberately non-blocking.
 */
export type PlanIssue =
	| (PlanIssueBaseV1 & {
			severity: "strict";
			blocksApply: true;
	  })
	| (PlanIssueBaseV1 & {
			severity: "warning";
			blocksApply: false;
	  })
	| (PlanIssueBaseV1 & {
			severity: "manual";
			blocksApply: true;
			instructions: string | null;
	  })
	| (PlanIssueBaseV1 & {
			severity: "review-blocked";
			blocksApply: true;
			reviewBlockerId: string;
			instructions: string | null;
	  });

interface PlanIssueInputBase {
	issueId?: string;
	code: string;
	message: string;
	path?: string | null;
	evidence?: readonly SourceEvidenceV1[];
}

export type PlanIssueInput =
	| (PlanIssueInputBase & { severity: "strict" | "warning" })
	| (PlanIssueInputBase & {
			severity: "manual";
			instructions?: string | null;
	  })
	| (PlanIssueInputBase & {
			severity: "review-blocked";
			reviewBlockerId: string;
			instructions?: string | null;
	  });

export function createPlanIssue(input: PlanIssueInput): PlanIssue {
	const base: PlanIssueBaseV1 = {
		version: PLANNING_SCHEMA_VERSION,
		issueId:
			input.issueId ??
			createStablePlanningId("issue", {
				code: input.code,
				message: input.message,
				path: input.path ?? null,
			}),
		code: input.code,
		message: input.message,
		path: input.path ?? null,
		evidence: (input.evidence ?? []).map((entry) => cloneSerializable(entry)),
	};

	switch (input.severity) {
		case "strict":
			return { ...base, severity: "strict", blocksApply: true };
		case "warning":
			return { ...base, severity: "warning", blocksApply: false };
		case "manual":
			return {
				...base,
				severity: "manual",
				blocksApply: true,
				instructions: input.instructions ?? null,
			};
		case "review-blocked":
			return {
				...base,
				severity: "review-blocked",
				blocksApply: true,
				reviewBlockerId: input.reviewBlockerId,
				instructions: input.instructions ?? null,
			};
	}
}

export function isBlockingPlanIssue(issue: PlanIssue): boolean {
	return issue.blocksApply;
}

export function blockingPlanIssues(issues: readonly PlanIssue[]): PlanIssue[] {
	return issues
		.filter(isBlockingPlanIssue)
		.map((issue) => cloneSerializable(issue));
}

/** Distinguishes a missing field from a present field whose value is null. */
export type ExpectedBeforeV1<T = SerializableValue> =
	| { state: "absent" }
	| { state: "present"; value: T };

/** Records duplicate observations without collapsing them into "absent". */
export type ObservedBeforeV1<T = SerializableValue> =
	| ExpectedBeforeV1<T>
	| { state: "conflict"; values: T[] };

export function absentExpectedBefore<
	T = SerializableValue,
>(): ExpectedBeforeV1<T> {
	return { state: "absent" };
}

export function presentExpectedBefore<T>(value: T): ExpectedBeforeV1<T> {
	return { state: "present", value: cloneSerializable(value) };
}

export function matchesExpectedBefore<T>(
	expected: ExpectedBeforeV1<T>,
	observed: T | undefined,
): boolean {
	if (expected.state === "absent") return observed === undefined;
	return observed !== undefined && serializableEquals(expected.value, observed);
}

export interface StablePlanOperationV1<
	TBefore = SerializableValue,
	TAfter = TBefore,
> {
	version: typeof PLANNING_SCHEMA_VERSION;
	operationId: string;
	expectedBefore: ExpectedBeforeV1<TBefore>;
	after: ExpectedBeforeV1<TAfter>;
	sourceEvidence: SourceEvidenceV1[];
}

export type PlanReceiptOutcome =
	| "applied"
	| "already-applied"
	| "skipped"
	| "conflict"
	| "manual"
	| "review-blocked";

export interface PlanReceiptV1<T = SerializableValue> {
	version: typeof PLANNING_SCHEMA_VERSION;
	receiptId: string;
	operationId: string;
	outcome: PlanReceiptOutcome;
	expectedBefore: ExpectedBeforeV1<T>;
	observedBefore: ObservedBeforeV1<T>;
	after: ExpectedBeforeV1<T>;
	sourceEvidence: SourceEvidenceV1[];
	issueIds: string[];
}

export function createPlanReceiptV1<T>(input: {
	operationId: string;
	outcome: PlanReceiptOutcome;
	expectedBefore: ExpectedBeforeV1<T>;
	observedBefore: ObservedBeforeV1<T>;
	after: ExpectedBeforeV1<T>;
	sourceEvidence?: readonly SourceEvidenceV1[];
	issueIds?: readonly string[];
}): PlanReceiptV1<T> {
	const receiptBody = {
		operationId: input.operationId,
		outcome: input.outcome,
		expectedBefore: input.expectedBefore,
		observedBefore: input.observedBefore,
		after: input.after,
		issueIds: [...(input.issueIds ?? [])].sort(),
	};
	return {
		version: PLANNING_SCHEMA_VERSION,
		receiptId: createStablePlanningId("receipt", receiptBody),
		operationId: input.operationId,
		outcome: input.outcome,
		expectedBefore: cloneSerializable(input.expectedBefore),
		observedBefore: cloneSerializable(input.observedBefore),
		after: cloneSerializable(input.after),
		sourceEvidence: (input.sourceEvidence ?? []).map((entry) =>
			cloneSerializable(entry),
		),
		issueIds: receiptBody.issueIds,
	};
}

interface MechanicalReferenceBaseV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	id: string;
	label: string | null;
	evidence: SourceEvidenceV1[];
}

/** A resolved, explicitly identified mechanical reference. */
export type MechanicalReference =
	| (MechanicalReferenceBaseV1 & { kind: "campaign" })
	| (MechanicalReferenceBaseV1 & {
			kind: "quest";
			campaignId: string | null;
	  })
	| (MechanicalReferenceBaseV1 & {
			kind: "world";
			campaignId: string | null;
			namespace: string | null;
	  })
	| (MechanicalReferenceBaseV1 & {
			kind: "crafting";
			referenceType: "material" | "recipe" | "project";
	  })
	| (MechanicalReferenceBaseV1 & {
			kind: "guild";
			campaignId: string | null;
	  })
	| (MechanicalReferenceBaseV1 & {
			kind: "canonical";
			canonicalType: string;
			collection: string | null;
			sourceBook: string | null;
	  });

export type MechanicalReferenceKind = MechanicalReference["kind"];

export type ControlledEntityKind =
	| "character"
	| "companion"
	| "summon"
	| "vehicle"
	| "canonical-anomaly"
	| "homebrew"
	| "freeform";

export type ControlledEntityControllerV1 =
	| {
			status: "resolved";
			controllerKind: "character" | "companion" | "summon" | "vehicle";
			controllerId: string;
			label: string | null;
	  }
	| {
			status: "unresolved";
			controllerKind: string | null;
			controllerId: null;
			requestedName: string | null;
			reason: string;
	  }
	| { status: "none" };

export type ControlledEntitySourceV1 =
	| {
			status: "resolved";
			sourceType:
				| "canonical"
				| "homebrew"
				| "character"
				| "companion"
				| "summon"
				| "vehicle";
			sourceId: string;
			label: string | null;
			evidence: SourceEvidenceV1[];
	  }
	| {
			status: "unresolved";
			sourceType: string | null;
			sourceId: null;
			requestedName: string | null;
			reason: string;
			evidence: SourceEvidenceV1[];
	  }
	| {
			status: "embedded";
			sourceType: "freeform";
			sourceId: null;
			label: string | null;
			evidence: SourceEvidenceV1[];
	  };

export interface ControlledEntityProvenanceV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	stableKey: string;
	originScope:
		| "local"
		| "campaign"
		| "character"
		| "canonical"
		| "homebrew"
		| "freeform";
	originId: string | null;
	campaignId: string | null;
	encounterEntryId: string | null;
	quantityIndex: number | null;
	evidence: SourceEvidenceV1[];
}

/**
 * An encounter-safe controlled entity identity. `instanceId` and `stableKey`
 * are planning identities; canonical/homebrew identities remain in `source`.
 */
export interface ControlledEntityRef {
	version: typeof PLANNING_SCHEMA_VERSION;
	instanceId: string;
	kind: ControlledEntityKind;
	displayName: string;
	controller: ControlledEntityControllerV1;
	source: ControlledEntitySourceV1;
	provenance: ControlledEntityProvenanceV1;
}
