import {
	blockingPlanIssues,
	type ControlledEntityControllerV1,
	type ControlledEntityKind,
	type ControlledEntityRef,
	type ControlledEntitySourceV1,
	cloneSerializable,
	createPlanIssue,
	createStablePlanningId,
	PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	type SerializableRecord,
	type SourceEvidenceV1,
} from "./contracts";
import type { MechanicalReferenceResolutionV1 } from "./references";

export const ENCOUNTER_HANDOFF_PLAN_VERSION = 1 as const;
export const ENCOUNTER_RESTORATION_PLAN_VERSION = 1 as const;

export type EncounterLocationV1 =
	| {
			version: typeof PLANNING_SCHEMA_VERSION;
			scope: "local";
			encounterId: string;
			campaignReference: null;
	  }
	| {
			version: typeof PLANNING_SCHEMA_VERSION;
			scope: "campaign";
			encounterId: string;
			campaignReference: MechanicalReferenceResolutionV1;
	  };

export type EncounterLocationInputV1 =
	| {
			scope: "local";
			encounterId: string;
	  }
	| {
			scope: "campaign";
			encounterId: string;
			campaignReference: MechanicalReferenceResolutionV1;
	  };

export interface EncounterRosterEntryV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	entryId: string;
	displayName: string;
	quantity: number;
	entityKind: ControlledEntityKind;
	controller: ControlledEntityControllerV1;
	source: ControlledEntitySourceV1;
	state: SerializableRecord;
	metadata: SerializableRecord;
	sourceEvidence: SourceEvidenceV1[];
}

export interface EncounterRosterEntryInputV1 {
	entryId: string;
	displayName: string;
	quantity: number;
	entityKind: ControlledEntityKind;
	controller: ControlledEntityControllerV1;
	source: ControlledEntitySourceV1;
	state?: SerializableRecord;
	metadata?: SerializableRecord;
	sourceEvidence?: readonly SourceEvidenceV1[];
}

export interface EncounterSnapshotV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	kind: "encounter-snapshot";
	location: EncounterLocationV1;
	name: string;
	entries: EncounterRosterEntryV1[];
	metadata: SerializableRecord;
}

export interface EncounterSnapshotInputV1 {
	location: EncounterLocationInputV1;
	name: string;
	entries: readonly EncounterRosterEntryInputV1[];
	metadata?: SerializableRecord;
}

export interface ExpandedEncounterEntityV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	entity: ControlledEntityRef;
	originEntryId: string;
	quantityIndex: number;
	state: SerializableRecord;
	metadata: SerializableRecord;
}

export interface EncounterRestorationPayloadV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	payloadId: string;
	snapshot: EncounterSnapshotV1;
	destination: EncounterLocationV1;
	expandedInstanceIds: string[];
}

export interface EncounterHandoffPlanV1 {
	version: typeof ENCOUNTER_HANDOFF_PLAN_VERSION;
	kind: "encounter-handoff-plan";
	planId: string;
	source: EncounterSnapshotV1;
	destination: EncounterLocationV1;
	expandedEntities: ExpandedEncounterEntityV1[];
	restoration: EncounterRestorationPayloadV1;
	issues: PlanIssue[];
	blockers: PlanIssue[];
	canApply: boolean;
}

export interface EncounterHandoffPlanInputV1 {
	source: EncounterSnapshotInputV1;
	destination: EncounterLocationInputV1;
}

export interface EncounterRestorationPlanV1 {
	version: typeof ENCOUNTER_RESTORATION_PLAN_VERSION;
	kind: "encounter-restoration-plan";
	planId: string;
	handoffPlanId: string;
	restoreTo: EncounterLocationV1;
	removeFrom: EncounterLocationV1;
	snapshot: EncounterSnapshotV1;
	removeExpandedInstanceIds: string[];
	issues: PlanIssue[];
	blockers: PlanIssue[];
	canApply: boolean;
}

function normalizeLocation(
	input: EncounterLocationInputV1,
): EncounterLocationV1 {
	if (input.scope === "local") {
		return {
			version: PLANNING_SCHEMA_VERSION,
			scope: "local",
			encounterId: input.encounterId,
			campaignReference: null,
		};
	}
	return {
		version: PLANNING_SCHEMA_VERSION,
		scope: "campaign",
		encounterId: input.encounterId,
		campaignReference: cloneSerializable(input.campaignReference),
	};
}

function normalizeEntry(
	input: EncounterRosterEntryInputV1,
): EncounterRosterEntryV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		entryId: input.entryId,
		displayName: input.displayName,
		quantity: input.quantity,
		entityKind: input.entityKind,
		controller: cloneSerializable(input.controller),
		source: cloneSerializable(input.source),
		state: cloneSerializable(input.state ?? {}),
		metadata: cloneSerializable(input.metadata ?? {}),
		sourceEvidence: (input.sourceEvidence ?? []).map((entry) =>
			cloneSerializable(entry),
		),
	};
}

export function createEncounterSnapshotV1(
	input: EncounterSnapshotInputV1,
): EncounterSnapshotV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		kind: "encounter-snapshot",
		location: normalizeLocation(input.location),
		name: input.name,
		entries: input.entries.map(normalizeEntry),
		metadata: cloneSerializable(input.metadata ?? {}),
	};
}

function locationIssues(
	location: EncounterLocationV1,
	path: string,
): PlanIssue[] {
	const issues: PlanIssue[] = [];
	if (!location.encounterId.trim()) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "encounter-id-required",
				message: "Encounter handoff locations require an explicit encounter ID",
				path: `${path}.encounterId`,
			}),
		);
	}
	if (location.scope === "campaign") {
		issues.push(
			...location.campaignReference.issues.map((issue) =>
				cloneSerializable(issue),
			),
		);
		if (
			location.campaignReference.status === "resolved" &&
			location.campaignReference.reference.kind !== "campaign"
		) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "encounter-campaign-reference-kind-invalid",
					message: "Campaign encounter locations require a campaign reference",
					path: `${path}.campaignReference`,
				}),
			);
		}
	}
	return issues;
}

function duplicateEntryIds(
	entries: readonly EncounterRosterEntryV1[],
): string[] {
	const seen = new Set<string>();
	const duplicates = new Set<string>();
	for (const entry of entries) {
		if (seen.has(entry.entryId)) duplicates.add(entry.entryId);
		seen.add(entry.entryId);
	}
	return [...duplicates].sort((left, right) => left.localeCompare(right));
}

function entryIssues(entry: EncounterRosterEntryV1): PlanIssue[] {
	const issues: PlanIssue[] = [];
	if (!entry.entryId.trim()) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "encounter-entry-id-required",
				message: "Encounter entries require a stable entry ID",
				path: "source.entries",
			}),
		);
	}
	if (!Number.isInteger(entry.quantity) || entry.quantity < 1) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "encounter-entry-quantity-invalid",
				message: `Encounter entry ${entry.entryId} quantity must be a positive integer`,
				path: `source.entries.${entry.entryId}.quantity`,
			}),
		);
	}
	if (entry.controller.status === "unresolved") {
		issues.push(
			createPlanIssue({
				severity: "manual",
				code: "encounter-controller-unresolved",
				message: `Controller for encounter entry ${entry.entryId} is unresolved`,
				path: `source.entries.${entry.entryId}.controller`,
				instructions: entry.controller.reason,
				evidence: entry.sourceEvidence,
			}),
		);
	}
	if (entry.source.status === "unresolved") {
		issues.push(
			createPlanIssue({
				severity: "manual",
				code: "encounter-source-unresolved",
				message: `Source for encounter entry ${entry.entryId} is unresolved`,
				path: `source.entries.${entry.entryId}.source`,
				instructions: entry.source.reason,
				evidence: [...entry.source.evidence, ...entry.sourceEvidence],
			}),
		);
	}
	return issues;
}

function campaignScope(location: EncounterLocationV1): {
	campaignId: string | null;
	stableScopeKey: string | null;
} {
	if (location.scope === "local") {
		return { campaignId: null, stableScopeKey: null };
	}
	if (
		location.campaignReference.status === "resolved" &&
		location.campaignReference.reference.kind === "campaign"
	) {
		return {
			campaignId: location.campaignReference.reference.id,
			stableScopeKey: `campaign:${location.campaignReference.reference.id}`,
		};
	}
	return {
		campaignId: null,
		stableScopeKey: `campaign-request:${location.campaignReference.request.requestId}`,
	};
}

function expandedEntity(
	snapshot: EncounterSnapshotV1,
	destination: EncounterLocationV1,
	entry: EncounterRosterEntryV1,
	quantityIndex: number,
): ExpandedEncounterEntityV1 {
	const originCampaign = campaignScope(snapshot.location);
	const destinationCampaign = campaignScope(destination);
	const provenanceSeed = {
		originScope: snapshot.location.scope,
		originScopeKey: originCampaign.stableScopeKey,
		originEncounterId: snapshot.location.encounterId,
		entryId: entry.entryId,
		quantityIndex,
	};
	const instanceSeed = {
		...provenanceSeed,
		destinationScope: destination.scope,
		destinationScopeKey: destinationCampaign.stableScopeKey,
		destinationEncounterId: destination.encounterId,
	};
	const stableKey = createStablePlanningId(
		"controlled-entity-provenance",
		provenanceSeed,
	);
	return {
		version: PLANNING_SCHEMA_VERSION,
		entity: {
			version: PLANNING_SCHEMA_VERSION,
			instanceId: createStablePlanningId("controlled-entity", instanceSeed),
			kind: entry.entityKind,
			displayName: entry.displayName,
			controller: cloneSerializable(entry.controller),
			source: cloneSerializable(entry.source),
			provenance: {
				version: PLANNING_SCHEMA_VERSION,
				stableKey,
				originScope: snapshot.location.scope,
				originId: snapshot.location.encounterId,
				campaignId: originCampaign.campaignId,
				encounterEntryId: entry.entryId,
				quantityIndex,
				evidence: entry.sourceEvidence.map((evidence) =>
					cloneSerializable(evidence),
				),
			},
		},
		originEntryId: entry.entryId,
		quantityIndex,
		state: cloneSerializable(entry.state),
		metadata: cloneSerializable(entry.metadata),
	};
}

/**
 * Expand encounter quantities into stable planning instances while retaining a
 * complete source snapshot for exact restoration.
 */
export function buildEncounterHandoffPlanV1(
	input: EncounterHandoffPlanInputV1,
): EncounterHandoffPlanV1 {
	const source = createEncounterSnapshotV1(input.source);
	const destination = normalizeLocation(input.destination);
	const issues: PlanIssue[] = [
		...locationIssues(source.location, "source.location"),
		...locationIssues(destination, "destination"),
	];
	for (const duplicate of duplicateEntryIds(source.entries)) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "encounter-duplicate-entry-id",
				message: `Encounter entry ID ${duplicate} appears more than once`,
				path: `source.entries.${duplicate}`,
			}),
		);
	}
	for (const entry of source.entries) issues.push(...entryIssues(entry));
	if (
		source.location.scope === destination.scope &&
		source.location.encounterId === destination.encounterId
	) {
		issues.push(
			createPlanIssue({
				severity: "warning",
				code: "encounter-handoff-same-location",
				message: "Encounter source and destination are the same location",
				path: "destination",
			}),
		);
	}

	const expandedEntities = source.entries.flatMap((entry) => {
		if (!Number.isInteger(entry.quantity) || entry.quantity < 1) return [];
		return Array.from({ length: entry.quantity }, (_, quantityIndex) =>
			expandedEntity(source, destination, entry, quantityIndex),
		);
	});
	issues.sort((left, right) => left.issueId.localeCompare(right.issueId));
	const blockers = blockingPlanIssues(issues);
	const planId = createStablePlanningId("encounter-handoff-plan", {
		source,
		destination,
		expandedInstanceIds: expandedEntities.map(
			(entry) => entry.entity.instanceId,
		),
	});
	const restoration: EncounterRestorationPayloadV1 = {
		version: PLANNING_SCHEMA_VERSION,
		payloadId: createStablePlanningId("encounter-restoration-payload", {
			planId,
			source,
			destination,
		}),
		snapshot: cloneSerializable(source),
		destination: cloneSerializable(destination),
		expandedInstanceIds: expandedEntities.map(
			(entry) => entry.entity.instanceId,
		),
	};

	return {
		version: ENCOUNTER_HANDOFF_PLAN_VERSION,
		kind: "encounter-handoff-plan",
		planId,
		source,
		destination,
		expandedEntities,
		restoration,
		issues,
		blockers,
		canApply: blockers.length === 0,
	};
}

/** Build the reverse operation entirely from the lossless handoff payload. */
export function buildEncounterRestorationPlanV1(
	handoff: EncounterHandoffPlanV1,
): EncounterRestorationPlanV1 {
	const snapshot = cloneSerializable(handoff.restoration.snapshot);
	const removeFrom = cloneSerializable(handoff.restoration.destination);
	const issues = [
		...locationIssues(snapshot.location, "restoreTo"),
		...locationIssues(removeFrom, "removeFrom"),
	].sort((left, right) => left.issueId.localeCompare(right.issueId));
	const blockers = blockingPlanIssues(issues);
	return {
		version: ENCOUNTER_RESTORATION_PLAN_VERSION,
		kind: "encounter-restoration-plan",
		planId: createStablePlanningId("encounter-restoration-plan", {
			handoffPlanId: handoff.planId,
			payloadId: handoff.restoration.payloadId,
			removeFrom,
		}),
		handoffPlanId: handoff.planId,
		restoreTo: cloneSerializable(snapshot.location),
		removeFrom,
		snapshot,
		removeExpandedInstanceIds: [...handoff.restoration.expandedInstanceIds],
		issues,
		blockers,
		canApply: blockers.length === 0,
	};
}

/** Return a detached snapshot suitable for a caller-owned restoration adapter. */
export function restoreEncounterSnapshotV1(
	plan: EncounterRestorationPlanV1,
): EncounterSnapshotV1 {
	return cloneSerializable(plan.snapshot);
}

export const buildEncounterHandoffPlan = buildEncounterHandoffPlanV1;
export const buildEncounterRestorationPlan = buildEncounterRestorationPlanV1;
