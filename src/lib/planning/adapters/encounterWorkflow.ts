import {
	type ControlledEntityRef,
	createPlanIssue,
	createStablePlanningId,
	PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	type SerializableRecord,
	type SerializableValue,
	type SourceEvidenceV1,
} from "../contracts";
import {
	buildEncounterHandoffPlanV1,
	buildEncounterRestorationPlanV1,
	type EncounterHandoffPlanInputV1,
	type EncounterHandoffPlanV1,
	type EncounterLocationInputV1,
	type EncounterRestorationPayloadV1,
	restoreEncounterSnapshotV1,
} from "../encounterHandoffPlan";
import { resolveMechanicalReferenceV1 } from "../references";

export const ENCOUNTER_WORKFLOW_VERSION = 1 as const;
const BUILDER_ENCOUNTER_ID = "encounter-builder-current";
const INITIATIVE_ENCOUNTER_ID = "initiative-tracker-current";

export type EncounterWorkflowSourceType = "canonical" | "homebrew";

export interface EncounterWorkflowSourceIdentityV1 {
	version: typeof ENCOUNTER_WORKFLOW_VERSION;
	sourceType: EncounterWorkflowSourceType;
	sourceId: string;
	sourceVersion: string | number | null;
}

export interface EncounterWorkflowRosterItemInputV1 {
	entryId?: string;
	displayName: string;
	quantity: number;
	runtimeState: unknown;
	source?: EncounterWorkflowSourceIdentityV1 | null;
}

export interface EncounterWorkflowInputV1 {
	campaignId?: string | null;
	name: string;
	hunterLevel: number;
	hunterCount: number;
	objectives: string;
	totalXP: number;
	difficulty: string;
	roster: readonly EncounterWorkflowRosterItemInputV1[];
}

export interface EncounterWorkflowAttachmentV1 {
	version: typeof ENCOUNTER_WORKFLOW_VERSION;
	handoff: EncounterHandoffPlanV1;
	restoration: EncounterRestorationPayloadV1;
	controlledEntity: ControlledEntityRef;
	state: SerializableRecord;
	metadata: SerializableRecord;
}

export interface EncounterWorkflowInitiativeCombatantV1 {
	id: string;
	name: string;
	initiative: number;
	hp?: number;
	maxHp?: number;
	ac?: number;
	conditions: string[];
	advancedConditions: [];
	isHunter: false;
	encounterWorkflow: EncounterWorkflowAttachmentV1;
}

/**
 * The tracker contract remains version 1 with its existing top-level keys.
 * Workflow data rides on combatants, whose persistence path preserves additive
 * JSON fields while normalizing the tracker-owned condition fields.
 */
export interface EncounterWorkflowInitiativeStateV1 {
	version: 1;
	savedAt: string;
	combatants: EncounterWorkflowInitiativeCombatantV1[];
	currentTurn: 0;
	round: 1;
}

export interface RestoredEncounterWorkflowStateV1 {
	name: string;
	hunterLevel: number;
	hunterCount: number;
	objectives: string;
	totalXP: number;
	difficulty: string;
	roster: Array<{
		entryId: string;
		displayName: string;
		quantity: number;
		runtimeState: SerializableRecord;
		source: EncounterWorkflowSourceIdentityV1;
	}>;
}

export type PreparedEncounterInitiativeHandoffV1 =
	| {
			status: "ready";
			plan: EncounterHandoffPlanV1;
			state: EncounterWorkflowInitiativeStateV1;
	  }
	| {
			status: "blocked";
			plan: EncounterHandoffPlanV1;
			blockers: PlanIssue[];
	  };

export type SavedEncounterWorkflowRestoreV1 =
	| {
			mode: "legacy";
			hunterLevel: number;
			hunterCount: number;
			objectives: string;
	  }
	| {
			mode: "workflow";
			state: RestoredEncounterWorkflowStateV1;
			removeExpandedInstanceIds: string[];
	  }
	| { mode: "blocked"; blockers: PlanIssue[] };

export interface SavedEncounterWorkflowRecordV1 {
	hunterLevel: number;
	hunterCount: number;
	objectives?: string;
	workflowPlan?: unknown;
}

export function createEncounterWorkflowSourceIdentityV1(
	sourceType: EncounterWorkflowSourceType,
	sourceId: string,
	sourceVersion: string | number | null = null,
): EncounterWorkflowSourceIdentityV1 {
	return {
		version: ENCOUNTER_WORKFLOW_VERSION,
		sourceType,
		sourceId: sourceId.trim(),
		sourceVersion,
	};
}

export function encounterWorkflowSourceKey(
	source: Pick<EncounterWorkflowSourceIdentityV1, "sourceType" | "sourceId">,
): string {
	return `${source.sourceType}:${source.sourceId}`;
}

export function createEncounterWorkflowEntryId(
	source: Pick<EncounterWorkflowSourceIdentityV1, "sourceType" | "sourceId">,
): string {
	return createStablePlanningId("encounter-roster-entry", {
		sourceType: source.sourceType,
		sourceId: source.sourceId,
	});
}

function toSerializable(value: unknown): SerializableValue | undefined {
	if (
		value === null ||
		typeof value === "string" ||
		typeof value === "boolean"
	) {
		return value;
	}
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : undefined;
	}
	if (Array.isArray(value)) {
		return value.map((entry) => toSerializable(entry) ?? null);
	}
	if (typeof value !== "object") return undefined;

	const prototype = Object.getPrototypeOf(value);
	if (prototype !== Object.prototype && prototype !== null) return undefined;
	const entries = Object.entries(value).flatMap(([key, entry]) => {
		const serialized = toSerializable(entry);
		return serialized === undefined ? [] : [[key, serialized] as const];
	});
	return Object.fromEntries(entries);
}

function toSerializableRecord(value: unknown): SerializableRecord {
	const serialized = toSerializable(value);
	if (
		serialized &&
		typeof serialized === "object" &&
		!Array.isArray(serialized)
	) {
		return serialized;
	}
	return {};
}

function sourceEvidence(
	source: EncounterWorkflowSourceIdentityV1,
	displayName: string,
): SourceEvidenceV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		kind: source.sourceType,
		sourceType: `${source.sourceType}-anomaly`,
		sourceId: source.sourceId || null,
		sourceVersion: source.sourceVersion,
		path: "encounterAnomalies.source",
		label: displayName || null,
		observed: {
			sourceType: source.sourceType,
			sourceId: source.sourceId || null,
		},
	};
}

function campaignLocation(
	campaignId: string,
	encounterId: string,
): EncounterLocationInputV1 {
	const evidence: SourceEvidenceV1 = {
		version: PLANNING_SCHEMA_VERSION,
		kind: "campaign",
		sourceType: "campaign",
		sourceId: campaignId,
		sourceVersion: null,
		path: "campaignId",
		label: null,
		observed: campaignId,
	};
	return {
		scope: "campaign",
		encounterId,
		campaignReference: resolveMechanicalReferenceV1({
			kind: "campaign",
			explicitCandidate: {
				version: PLANNING_SCHEMA_VERSION,
				kind: "campaign",
				id: campaignId,
				label: null,
				evidence: [evidence],
			},
		}),
	};
}

function workflowLocation(
	campaignId: string | null | undefined,
	encounterId: string,
): EncounterLocationInputV1 {
	return campaignId
		? campaignLocation(campaignId, encounterId)
		: { scope: "local", encounterId };
}

function rosterEntry(
	item: EncounterWorkflowRosterItemInputV1,
): EncounterHandoffPlanInputV1["source"]["entries"][number] {
	const source = item.source ?? null;
	const evidence = source ? [sourceEvidence(source, item.displayName)] : [];
	const hasExplicitSourceId = Boolean(source?.sourceId.trim());
	return {
		entryId:
			item.entryId?.trim() ||
			(source && hasExplicitSourceId
				? createEncounterWorkflowEntryId(source)
				: ""),
		displayName: item.displayName,
		quantity: item.quantity,
		entityKind:
			source?.sourceType === "homebrew" ? "homebrew" : "canonical-anomaly",
		controller: { status: "none" },
		source:
			source && hasExplicitSourceId
				? {
						status: "resolved",
						sourceType: source.sourceType,
						sourceId: source.sourceId,
						label: item.displayName || null,
						evidence,
					}
				: {
						status: "unresolved",
						sourceType: source?.sourceType ?? null,
						sourceId: null,
						requestedName: item.displayName || null,
						reason:
							"Encounter entries require an explicit canonical or homebrew source ID",
						evidence,
					},
		state: { runtimeState: toSerializableRecord(item.runtimeState) },
		metadata: {
			workflowVersion: ENCOUNTER_WORKFLOW_VERSION,
			sourceVersion: source?.sourceVersion ?? null,
		},
		sourceEvidence: evidence,
	};
}

/** Build the pure version-1 handoff plan used by saves and initiative sync. */
export function buildEncounterWorkflowPlanV1(
	input: EncounterWorkflowInputV1,
): EncounterHandoffPlanV1 {
	return buildEncounterHandoffPlanV1({
		source: {
			location: workflowLocation(input.campaignId, BUILDER_ENCOUNTER_ID),
			name: input.name,
			entries: input.roster.map(rosterEntry),
			metadata: {
				workflowVersion: ENCOUNTER_WORKFLOW_VERSION,
				hunterLevel: input.hunterLevel,
				hunterCount: input.hunterCount,
				objectives: input.objectives,
				totalXP: input.totalXP,
				difficulty: input.difficulty,
			},
		},
		destination: workflowLocation(input.campaignId, INITIATIVE_ENCOUNTER_ID),
	});
}

function finiteNumber(
	value: SerializableValue | undefined,
): number | undefined {
	return typeof value === "number" && Number.isFinite(value)
		? value
		: undefined;
}

function runtimeNumber(
	runtimeState: SerializableRecord,
	key: string,
): number | undefined {
	return finiteNumber(runtimeState[key]);
}

function initiativeStateFromPlan(
	plan: EncounterHandoffPlanV1,
	savedAt: string,
): EncounterWorkflowInitiativeStateV1 {
	const quantities = new Map(
		plan.source.entries.map((entry) => [entry.entryId, entry.quantity]),
	);
	return {
		version: 1,
		savedAt,
		combatants: plan.expandedEntities.map((expanded) => {
			const runtimeState = toSerializableRecord(expanded.state.runtimeState);
			const quantity = quantities.get(expanded.originEntryId) ?? 1;
			const hp = runtimeNumber(runtimeState, "hit_points_average");
			const ac = runtimeNumber(runtimeState, "armor_class");
			return {
				id: expanded.entity.instanceId,
				name:
					quantity > 1
						? `${expanded.entity.displayName} #${expanded.quantityIndex + 1}`
						: expanded.entity.displayName,
				initiative: 0,
				...(hp === undefined ? {} : { hp, maxHp: hp }),
				...(ac === undefined ? {} : { ac }),
				conditions: [],
				advancedConditions: [],
				isHunter: false,
				encounterWorkflow: {
					version: ENCOUNTER_WORKFLOW_VERSION,
					handoff: plan,
					restoration: plan.restoration,
					controlledEntity: expanded.entity,
					state: expanded.state,
					metadata: expanded.metadata,
				},
			};
		}),
		currentTurn: 0,
		round: 1,
	};
}

/** Build and fail closed before producing any initiative tool-state JSON. */
export function prepareEncounterInitiativeHandoffV1(
	input: EncounterWorkflowInputV1,
	savedAt: string,
): PreparedEncounterInitiativeHandoffV1 {
	const plan = buildEncounterWorkflowPlanV1(input);
	if (!plan.canApply) {
		return { status: "blocked", plan, blockers: plan.blockers };
	}
	return {
		status: "ready",
		plan,
		state: initiativeStateFromPlan(plan, savedAt),
	};
}

function invalidSavedWorkflowIssue(message: string, path: string): PlanIssue {
	return createPlanIssue({
		severity: "strict",
		code: "encounter-saved-workflow-invalid",
		message,
		path,
	});
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function looksLikeHandoffPlan(value: unknown): value is EncounterHandoffPlanV1 {
	if (!isRecord(value)) return false;
	return (
		value.version === 1 &&
		value.kind === "encounter-handoff-plan" &&
		typeof value.planId === "string" &&
		isRecord(value.source) &&
		Array.isArray(value.source.entries) &&
		isRecord(value.destination) &&
		Array.isArray(value.expandedEntities) &&
		isRecord(value.restoration)
	);
}

function restoredSource(
	entry: EncounterHandoffPlanV1["source"]["entries"][number],
): EncounterWorkflowSourceIdentityV1 | null {
	if (
		entry.source.status !== "resolved" ||
		(entry.source.sourceType !== "canonical" &&
			entry.source.sourceType !== "homebrew") ||
		!entry.source.sourceId.trim()
	) {
		return null;
	}
	const sourceVersion = entry.metadata.sourceVersion;
	return createEncounterWorkflowSourceIdentityV1(
		entry.source.sourceType,
		entry.source.sourceId,
		typeof sourceVersion === "string" || typeof sourceVersion === "number"
			? sourceVersion
			: null,
	);
}

function restoreWorkflowPlan(plan: EncounterHandoffPlanV1):
	| {
			status: "restored";
			state: RestoredEncounterWorkflowStateV1;
			removeIds: string[];
	  }
	| { status: "blocked"; blockers: PlanIssue[] } {
	try {
		const restoration = buildEncounterRestorationPlanV1(plan);
		if (!restoration.canApply) {
			return { status: "blocked", blockers: restoration.blockers };
		}
		const snapshot = restoreEncounterSnapshotV1(restoration);
		const blockers: PlanIssue[] = [];
		const hunterLevel = finiteNumber(snapshot.metadata.hunterLevel);
		const hunterCount = finiteNumber(snapshot.metadata.hunterCount);
		const totalXP = finiteNumber(snapshot.metadata.totalXP);
		const objectives = snapshot.metadata.objectives;
		const difficulty = snapshot.metadata.difficulty;
		if (hunterLevel === undefined || hunterCount === undefined) {
			blockers.push(
				invalidSavedWorkflowIssue(
					"Saved encounter party metadata is missing or invalid",
					"source.metadata",
				),
			);
		}
		if (
			totalXP === undefined ||
			typeof objectives !== "string" ||
			typeof difficulty !== "string"
		) {
			blockers.push(
				invalidSavedWorkflowIssue(
					"Saved encounter workflow metadata is missing or invalid",
					"source.metadata",
				),
			);
		}

		const roster = snapshot.entries.flatMap((entry) => {
			const source = restoredSource(entry);
			const runtimeState = entry.state.runtimeState;
			if (!source || !isRecord(runtimeState)) {
				blockers.push(
					invalidSavedWorkflowIssue(
						`Saved encounter entry ${entry.entryId} lacks explicit source or runtime state`,
						`source.entries.${entry.entryId}`,
					),
				);
				return [];
			}
			return [
				{
					entryId: entry.entryId,
					displayName: entry.displayName,
					quantity: entry.quantity,
					runtimeState: toSerializableRecord(runtimeState),
					source,
				},
			];
		});
		if (blockers.length > 0) return { status: "blocked", blockers };

		return {
			status: "restored",
			state: {
				name: snapshot.name,
				hunterLevel: hunterLevel as number,
				hunterCount: hunterCount as number,
				objectives: objectives as string,
				totalXP: totalXP as number,
				difficulty: difficulty as string,
				roster,
			},
			removeIds: restoration.removeExpandedInstanceIds,
		};
	} catch {
		return {
			status: "blocked",
			blockers: [
				invalidSavedWorkflowIssue(
					"Saved encounter workflow payload could not be restored",
					"workflowPlan",
				),
			],
		};
	}
}

/**
 * Restore new saves losslessly. Only records with no workflow payload use the
 * historical party/objectives fallback; malformed new payloads fail closed.
 */
export function restoreSavedEncounterWorkflowV1(
	record: SavedEncounterWorkflowRecordV1,
): SavedEncounterWorkflowRestoreV1 {
	if (record.workflowPlan === undefined) {
		return {
			mode: "legacy",
			hunterLevel: record.hunterLevel,
			hunterCount: record.hunterCount,
			objectives: record.objectives ?? "",
		};
	}
	if (!looksLikeHandoffPlan(record.workflowPlan)) {
		return {
			mode: "blocked",
			blockers: [
				invalidSavedWorkflowIssue(
					"Saved encounter workflow payload is malformed",
					"workflowPlan",
				),
			],
		};
	}
	const restored = restoreWorkflowPlan(record.workflowPlan);
	if (restored.status === "blocked") {
		return { mode: "blocked", blockers: restored.blockers };
	}
	return {
		mode: "workflow",
		state: restored.state,
		removeExpandedInstanceIds: restored.removeIds,
	};
}

export function describeEncounterWorkflowBlockers(
	blockers: readonly PlanIssue[],
): string {
	if (blockers.length === 0) return "Encounter workflow could not be applied.";
	const messages = blockers.slice(0, 2).map((issue) => issue.message);
	const remaining = blockers.length - messages.length;
	return remaining > 0
		? `${messages.join(" ")} (+${remaining} more)`
		: messages.join(" ");
}
