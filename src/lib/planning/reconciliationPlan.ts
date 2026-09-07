import {
	absentExpectedBefore,
	blockingPlanIssues,
	cloneSerializable,
	createPlanIssue,
	createPlanReceiptV1,
	createStableOperationId,
	createStablePlanningId,
	type ExpectedBeforeV1,
	matchesExpectedBefore,
	type ObservedBeforeV1,
	PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	type PlanReceiptV1,
	presentExpectedBefore,
	type SerializableRecord,
	type SerializableValue,
	type SourceEvidenceV1,
	type StablePlanOperationV1,
	serializableEquals,
	stableSerialize,
} from "./contracts";

export const RECONCILIATION_PLAN_VERSION = 1 as const;

export type ReconciliationOwnershipV1 =
	| {
			kind: "source";
			sourceKey: string;
			evidence: SourceEvidenceV1[];
	  }
	| { kind: "custom"; label: string | null }
	| { kind: "manual"; reason: string };

export interface ReconciliationRecordV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	recordKey: string;
	value: SerializableValue;
	ownership: ReconciliationOwnershipV1;
	customState: SerializableRecord | null;
	manualState: SerializableRecord | null;
}

export interface ReconciliationRecordInputV1 {
	recordKey: string;
	value: SerializableValue;
	ownership: ReconciliationOwnershipV1;
	customState?: SerializableRecord | null;
	manualState?: SerializableRecord | null;
}

export function createReconciliationRecordV1(
	input: ReconciliationRecordInputV1,
): ReconciliationRecordV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		recordKey: input.recordKey,
		value: cloneSerializable(input.value),
		ownership: cloneSerializable(input.ownership),
		customState: input.customState
			? cloneSerializable(input.customState)
			: null,
		manualState: input.manualState
			? cloneSerializable(input.manualState)
			: null,
	};
}

export type DesiredReconciliationDisposition =
	| "automatic"
	| "manual"
	| "review-blocked";

export interface DesiredReconciliationRecordV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	recordKey: string;
	value: SerializableValue;
	disposition: DesiredReconciliationDisposition;
	sourceEvidence: SourceEvidenceV1[];
	instructions: string | null;
	reviewBlockerId: string | null;
}

export interface DesiredReconciliationRecordInputV1 {
	recordKey: string;
	value: SerializableValue;
	disposition?: DesiredReconciliationDisposition;
	sourceEvidence?: readonly SourceEvidenceV1[];
	instructions?: string | null;
	reviewBlockerId?: string | null;
}

export type ReconciliationDryRunStatus =
	| "add"
	| "update"
	| "remove"
	| "unchanged"
	| "conflict"
	| "manual"
	| "review-blocked";

export type ReconciliationPreservationReason =
	| "custom-owned"
	| "manual-owned"
	| "other-source-owned"
	| "custom-state"
	| "manual-state";

export interface ReconciliationOperationV1
	extends StablePlanOperationV1<
		ReconciliationRecordV1,
		ReconciliationRecordV1
	> {
	status: ReconciliationDryRunStatus;
	recordKey: string;
	desiredAfter: ExpectedBeforeV1<ReconciliationRecordV1>;
	preserves: ReconciliationPreservationReason[];
	issueIds: string[];
}

export interface ReconciliationPlanV1 {
	version: typeof RECONCILIATION_PLAN_VERSION;
	kind: "reconciliation-plan";
	planId: string;
	scopeKey: string;
	targetId: string;
	sourceKey: string;
	operations: ReconciliationOperationV1[];
	issues: PlanIssue[];
	blockers: PlanIssue[];
	canApply: boolean;
}

export interface ReconciliationPlanInputV1 {
	scopeKey: string;
	targetId: string;
	sourceKey: string;
	current: readonly ReconciliationRecordV1[];
	desired: readonly DesiredReconciliationRecordInputV1[];
}

function desiredRecord(
	input: DesiredReconciliationRecordInputV1,
): DesiredReconciliationRecordV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		recordKey: input.recordKey,
		value: cloneSerializable(input.value),
		disposition: input.disposition ?? "automatic",
		sourceEvidence: (input.sourceEvidence ?? []).map((entry) =>
			cloneSerializable(entry),
		),
		instructions: input.instructions ?? null,
		reviewBlockerId: input.reviewBlockerId ?? null,
	};
}

function groupByKey<T extends { recordKey: string }>(
	entries: readonly T[],
): Map<string, T[]> {
	const grouped = new Map<string, T[]>();
	for (const entry of entries) {
		const existing = grouped.get(entry.recordKey) ?? [];
		existing.push(entry);
		grouped.set(entry.recordKey, existing);
	}
	return grouped;
}

function sourceOwnedRecord(
	desired: DesiredReconciliationRecordV1,
	sourceKey: string,
	current: ReconciliationRecordV1 | undefined,
): ReconciliationRecordV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		recordKey: desired.recordKey,
		value: cloneSerializable(desired.value),
		ownership: {
			kind: "source",
			sourceKey,
			evidence: desired.sourceEvidence.map((entry) => cloneSerializable(entry)),
		},
		customState: current?.customState
			? cloneSerializable(current.customState)
			: null,
		manualState: current?.manualState
			? cloneSerializable(current.manualState)
			: null,
	};
}

function expectedRecord(
	record: ReconciliationRecordV1 | undefined,
): ExpectedBeforeV1<ReconciliationRecordV1> {
	return record
		? presentExpectedBefore(record)
		: absentExpectedBefore<ReconciliationRecordV1>();
}

function preservationReasons(
	record: ReconciliationRecordV1 | undefined,
): ReconciliationPreservationReason[] {
	if (!record) return [];
	const reasons: ReconciliationPreservationReason[] = [];
	if (record.ownership.kind === "custom") reasons.push("custom-owned");
	if (record.ownership.kind === "manual") reasons.push("manual-owned");
	if (record.customState !== null) reasons.push("custom-state");
	if (record.manualState !== null) reasons.push("manual-state");
	return reasons;
}

function operation(input: {
	scopeKey: string;
	targetId: string;
	sourceKey: string;
	recordKey: string;
	status: ReconciliationDryRunStatus;
	before: ReconciliationRecordV1 | undefined;
	after: ReconciliationRecordV1 | undefined;
	desiredAfter: ReconciliationRecordV1 | undefined;
	sourceEvidence: readonly SourceEvidenceV1[];
	preserves?: readonly ReconciliationPreservationReason[];
	issues?: readonly PlanIssue[];
}): ReconciliationOperationV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		operationId: createStableOperationId({
			scopeKey: input.scopeKey,
			targetId: input.targetId,
			sourceKey: input.sourceKey,
			recordKey: input.recordKey,
		}),
		status: input.status,
		recordKey: input.recordKey,
		expectedBefore: expectedRecord(input.before),
		after: expectedRecord(input.after),
		desiredAfter: expectedRecord(input.desiredAfter),
		sourceEvidence: input.sourceEvidence.map((entry) =>
			cloneSerializable(entry),
		),
		preserves: [...(input.preserves ?? [])],
		issueIds: (input.issues ?? []).map((issue) => issue.issueId).sort(),
	};
}

/**
 * Compute a dry run. Only rows owned by `sourceKey` are eligible for automatic
 * update/removal; custom, manual, and other-source rows remain untouched.
 */
export function buildReconciliationPlanV1(
	input: ReconciliationPlanInputV1,
): ReconciliationPlanV1 {
	const current = input.current
		.map((entry) => cloneSerializable(entry))
		.sort(
			(left, right) =>
				left.recordKey.localeCompare(right.recordKey) ||
				stableSerialize(left).localeCompare(stableSerialize(right)),
		);
	const desired = input.desired
		.map(desiredRecord)
		.sort(
			(left, right) =>
				left.recordKey.localeCompare(right.recordKey) ||
				stableSerialize(left).localeCompare(stableSerialize(right)),
		);
	const currentByKey = groupByKey(current);
	const desiredByKey = groupByKey(desired);
	const keys = [
		...new Set([...currentByKey.keys(), ...desiredByKey.keys()]),
	].sort((left, right) => left.localeCompare(right));
	const operations: ReconciliationOperationV1[] = [];
	const issues: PlanIssue[] = [];

	for (const recordKey of keys) {
		const currentMatches = currentByKey.get(recordKey) ?? [];
		const desiredMatches = desiredByKey.get(recordKey) ?? [];
		const before = currentMatches[0];
		const target = desiredMatches[0];

		if (currentMatches.length > 1 || desiredMatches.length > 1) {
			const issue = createPlanIssue({
				severity: "strict",
				code: "reconciliation-duplicate-key",
				message: `Reconciliation key ${recordKey} is not unique`,
				path: `records.${recordKey}`,
			});
			issues.push(issue);
			operations.push(
				operation({
					scopeKey: input.scopeKey,
					targetId: input.targetId,
					sourceKey: input.sourceKey,
					recordKey,
					status: "conflict",
					before,
					after: before,
					desiredAfter: target
						? sourceOwnedRecord(target, input.sourceKey, before)
						: undefined,
					sourceEvidence: target?.sourceEvidence ?? [],
					preserves: preservationReasons(before),
					issues: [issue],
				}),
			);
			continue;
		}

		if (target) {
			const desiredAfter = sourceOwnedRecord(target, input.sourceKey, before);
			if (target.disposition === "manual") {
				const issue = createPlanIssue({
					severity: "manual",
					code: "reconciliation-manual",
					message: `Reconciliation for ${recordKey} requires manual handling`,
					path: `records.${recordKey}`,
					instructions: target.instructions,
					evidence: target.sourceEvidence,
				});
				issues.push(issue);
				operations.push(
					operation({
						scopeKey: input.scopeKey,
						targetId: input.targetId,
						sourceKey: input.sourceKey,
						recordKey,
						status: "manual",
						before,
						after: before,
						desiredAfter,
						sourceEvidence: target.sourceEvidence,
						preserves: preservationReasons(before),
						issues: [issue],
					}),
				);
				continue;
			}
			if (target.disposition === "review-blocked") {
				const blockerId =
					target.reviewBlockerId ??
					createStablePlanningId("review-blocker", {
						sourceKey: input.sourceKey,
						recordKey,
					});
				const issue = createPlanIssue({
					severity: "review-blocked",
					code: "reconciliation-review-blocked",
					message: `Reconciliation for ${recordKey} is blocked for review`,
					path: `records.${recordKey}`,
					reviewBlockerId: blockerId,
					instructions: target.instructions,
					evidence: target.sourceEvidence,
				});
				issues.push(issue);
				operations.push(
					operation({
						scopeKey: input.scopeKey,
						targetId: input.targetId,
						sourceKey: input.sourceKey,
						recordKey,
						status: "review-blocked",
						before,
						after: before,
						desiredAfter,
						sourceEvidence: target.sourceEvidence,
						preserves: preservationReasons(before),
						issues: [issue],
					}),
				);
				continue;
			}

			if (!before) {
				operations.push(
					operation({
						scopeKey: input.scopeKey,
						targetId: input.targetId,
						sourceKey: input.sourceKey,
						recordKey,
						status: "add",
						before: undefined,
						after: desiredAfter,
						desiredAfter,
						sourceEvidence: target.sourceEvidence,
					}),
				);
				continue;
			}

			if (
				before.ownership.kind !== "source" ||
				before.ownership.sourceKey !== input.sourceKey
			) {
				const preserves = preservationReasons(before);
				if (before.ownership.kind === "source") {
					preserves.push("other-source-owned");
				}
				const issue = createPlanIssue({
					severity: "strict",
					code: "reconciliation-ownership-conflict",
					message: `Reconciliation cannot replace ${recordKey} because it is not owned by ${input.sourceKey}`,
					path: `records.${recordKey}`,
					evidence: target.sourceEvidence,
				});
				issues.push(issue);
				operations.push(
					operation({
						scopeKey: input.scopeKey,
						targetId: input.targetId,
						sourceKey: input.sourceKey,
						recordKey,
						status: "conflict",
						before,
						after: before,
						desiredAfter,
						sourceEvidence: target.sourceEvidence,
						preserves,
						issues: [issue],
					}),
				);
				continue;
			}

			const status = serializableEquals(before.value, target.value)
				? "unchanged"
				: "update";
			operations.push(
				operation({
					scopeKey: input.scopeKey,
					targetId: input.targetId,
					sourceKey: input.sourceKey,
					recordKey,
					status,
					before,
					after: status === "unchanged" ? before : desiredAfter,
					desiredAfter,
					sourceEvidence: target.sourceEvidence,
					preserves: preservationReasons(before).filter(
						(reason) => reason === "custom-state" || reason === "manual-state",
					),
				}),
			);
			continue;
		}

		if (!before) continue;
		if (
			before.ownership.kind === "source" &&
			before.ownership.sourceKey === input.sourceKey
		) {
			const preserves = preservationReasons(before).filter(
				(reason) => reason === "custom-state" || reason === "manual-state",
			);
			if (preserves.length > 0) {
				const issue = createPlanIssue({
					severity: "manual",
					code: "reconciliation-removal-preserves-overlay",
					message: `Removal of ${recordKey} requires manual review because custom or manual state is attached`,
					path: `records.${recordKey}`,
					instructions:
						"Detach or migrate the preserved state before removing the source-owned record.",
				});
				issues.push(issue);
				operations.push(
					operation({
						scopeKey: input.scopeKey,
						targetId: input.targetId,
						sourceKey: input.sourceKey,
						recordKey,
						status: "manual",
						before,
						after: before,
						desiredAfter: undefined,
						sourceEvidence: before.ownership.evidence,
						preserves,
						issues: [issue],
					}),
				);
				continue;
			}
			operations.push(
				operation({
					scopeKey: input.scopeKey,
					targetId: input.targetId,
					sourceKey: input.sourceKey,
					recordKey,
					status: "remove",
					before,
					after: undefined,
					desiredAfter: undefined,
					sourceEvidence: before.ownership.evidence,
				}),
			);
			continue;
		}

		const preserves = preservationReasons(before);
		if (before.ownership.kind === "source") {
			preserves.push("other-source-owned");
		}
		operations.push(
			operation({
				scopeKey: input.scopeKey,
				targetId: input.targetId,
				sourceKey: input.sourceKey,
				recordKey,
				status: "unchanged",
				before,
				after: before,
				desiredAfter: undefined,
				sourceEvidence:
					before.ownership.kind === "source" ? before.ownership.evidence : [],
				preserves,
			}),
		);
	}

	issues.sort((left, right) => left.issueId.localeCompare(right.issueId));
	const blockers = blockingPlanIssues(issues);
	return {
		version: RECONCILIATION_PLAN_VERSION,
		kind: "reconciliation-plan",
		planId: createStablePlanningId("reconciliation-plan", {
			scopeKey: input.scopeKey,
			targetId: input.targetId,
			sourceKey: input.sourceKey,
			desired: desired.map((entry) => ({
				recordKey: entry.recordKey,
				value: entry.value,
				disposition: entry.disposition,
			})),
		}),
		scopeKey: input.scopeKey,
		targetId: input.targetId,
		sourceKey: input.sourceKey,
		operations,
		issues,
		blockers,
		canApply: blockers.length === 0,
	};
}

export interface ReconciliationApplicationResultV1 {
	version: typeof RECONCILIATION_PLAN_VERSION;
	records: ReconciliationRecordV1[];
	receipts: PlanReceiptV1<ReconciliationRecordV1>[];
	blocked: boolean;
	hasConflicts: boolean;
}

type ReconciliationObservationV1 =
	| { cardinality: "absent" }
	| { cardinality: "one"; value: ReconciliationRecordV1 }
	| { cardinality: "duplicate"; values: ReconciliationRecordV1[] };

function observeRecord(
	records: readonly ReconciliationRecordV1[],
	recordKey: string,
): ReconciliationObservationV1 {
	const matches = records.filter((entry) => entry.recordKey === recordKey);
	if (matches.length === 0) return { cardinality: "absent" };
	if (matches.length === 1) return { cardinality: "one", value: matches[0] };
	return { cardinality: "duplicate", values: matches };
}

function observedBefore(
	observation: ReconciliationObservationV1,
): ObservedBeforeV1<ReconciliationRecordV1> {
	if (observation.cardinality === "absent") return { state: "absent" };
	if (observation.cardinality === "one") {
		return presentExpectedBefore(observation.value);
	}
	return {
		state: "conflict",
		values: observation.values.map((entry) => cloneSerializable(entry)),
	};
}

function observedValue(
	observation: ReconciliationObservationV1,
): ReconciliationRecordV1 | undefined {
	return observation.cardinality === "one" ? observation.value : undefined;
}

function afterMatchesObservation(
	planned: ReconciliationOperationV1,
	observation: ReconciliationObservationV1,
): boolean {
	if (observation.cardinality === "duplicate") return false;
	if (planned.after.state === "absent") {
		return observation.cardinality === "absent";
	}
	return (
		observation.cardinality === "one" &&
		serializableEquals(planned.after.value, observation.value)
	);
}

function receiptOutcomeForSkipped(
	status: ReconciliationDryRunStatus,
): "skipped" | "conflict" | "manual" | "review-blocked" {
	if (status === "conflict") return "conflict";
	if (status === "manual") return "manual";
	if (status === "review-blocked") return "review-blocked";
	return "skipped";
}

function blockedPlanOutcome(
	plan: ReconciliationPlanV1,
): "conflict" | "manual" | "review-blocked" {
	if (plan.blockers.some((issue) => issue.severity === "review-blocked")) {
		return "review-blocked";
	}
	if (plan.blockers.some((issue) => issue.severity === "manual")) {
		return "manual";
	}
	return "conflict";
}

function receiptForOperation(input: {
	planned: ReconciliationOperationV1;
	observation: ReconciliationObservationV1;
	outcome:
		| "applied"
		| "already-applied"
		| "skipped"
		| "conflict"
		| "manual"
		| "review-blocked";
	additionalIssueIds?: readonly string[];
}): PlanReceiptV1<ReconciliationRecordV1> {
	return createPlanReceiptV1({
		operationId: input.planned.operationId,
		outcome: input.outcome,
		expectedBefore: input.planned.expectedBefore,
		observedBefore: observedBefore(input.observation),
		after: input.planned.after,
		sourceEvidence: input.planned.sourceEvidence,
		issueIds: [
			...new Set([
				...input.planned.issueIds,
				...(input.additionalIssueIds ?? []),
			]),
		].sort(),
	});
}

/**
 * Apply actionable operations to an in-memory record set. Application is
 * fail-closed and atomic: plan blockers, duplicate observations, or stale
 * expected-before values produce receipts without mutating any record.
 */
export function applyReconciliationPlanV1(
	current: readonly ReconciliationRecordV1[],
	plan: ReconciliationPlanV1,
): ReconciliationApplicationResultV1 {
	const records = current.map((entry) => cloneSerializable(entry));
	const observations = new Map(
		plan.operations.map((planned) => [
			planned.operationId,
			observeRecord(records, planned.recordKey),
		]),
	);

	if (!plan.canApply || plan.blockers.length > 0) {
		const outcome = blockedPlanOutcome(plan);
		const blockerIds = plan.blockers.map((issue) => issue.issueId);
		return {
			version: RECONCILIATION_PLAN_VERSION,
			records,
			receipts: plan.operations.map((planned) =>
				receiptForOperation({
					planned,
					observation: observations.get(planned.operationId) ?? {
						cardinality: "absent",
					},
					outcome,
					additionalIssueIds: blockerIds,
				}),
			),
			blocked: true,
			hasConflicts: plan.blockers.some((issue) => issue.severity === "strict"),
		};
	}

	const preflightConflicts = new Set<string>();
	for (const planned of plan.operations) {
		const observation = observations.get(planned.operationId) ?? {
			cardinality: "absent" as const,
		};
		if (observation.cardinality === "duplicate") {
			preflightConflicts.add(planned.operationId);
			continue;
		}
		const observed = observedValue(observation);
		if (planned.status === "unchanged") {
			if (!matchesExpectedBefore(planned.expectedBefore, observed)) {
				preflightConflicts.add(planned.operationId);
			}
			continue;
		}
		const actionable =
			planned.status === "add" ||
			planned.status === "update" ||
			planned.status === "remove";
		if (
			actionable &&
			!afterMatchesObservation(planned, observation) &&
			!matchesExpectedBefore(planned.expectedBefore, observed)
		) {
			preflightConflicts.add(planned.operationId);
		}
	}

	if (preflightConflicts.size > 0) {
		return {
			version: RECONCILIATION_PLAN_VERSION,
			records,
			receipts: plan.operations.map((planned) =>
				receiptForOperation({
					planned,
					observation: observations.get(planned.operationId) ?? {
						cardinality: "absent",
					},
					outcome: preflightConflicts.has(planned.operationId)
						? "conflict"
						: receiptOutcomeForSkipped(planned.status),
				}),
			),
			blocked: true,
			hasConflicts: true,
		};
	}

	const receipts: PlanReceiptV1<ReconciliationRecordV1>[] = [];
	for (const planned of plan.operations) {
		const observation = observations.get(planned.operationId) ?? {
			cardinality: "absent" as const,
		};
		const actionable =
			planned.status === "add" ||
			planned.status === "update" ||
			planned.status === "remove";
		if (!actionable) {
			receipts.push(
				receiptForOperation({
					planned,
					observation,
					outcome: receiptOutcomeForSkipped(planned.status),
				}),
			);
			continue;
		}
		if (afterMatchesObservation(planned, observation)) {
			receipts.push(
				receiptForOperation({
					planned,
					observation,
					outcome: "already-applied",
				}),
			);
			continue;
		}

		const index = records.findIndex(
			(entry) => entry.recordKey === planned.recordKey,
		);
		if (planned.after.state === "absent") {
			if (index >= 0) records.splice(index, 1);
		} else if (index >= 0) {
			records[index] = cloneSerializable(planned.after.value);
		} else {
			records.push(cloneSerializable(planned.after.value));
		}
		receipts.push(
			receiptForOperation({
				planned,
				observation,
				outcome: "applied",
			}),
		);
	}

	records.sort((left, right) => left.recordKey.localeCompare(right.recordKey));
	return {
		version: RECONCILIATION_PLAN_VERSION,
		records,
		receipts,
		blocked: false,
		hasConflicts: false,
	};
}

export const buildReconciliationPlan = buildReconciliationPlanV1;
export const applyReconciliationPlan = applyReconciliationPlanV1;
