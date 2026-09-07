import {
	absentExpectedBefore,
	blockingPlanIssues,
	cloneSerializable,
	createPlanIssue,
	createPlanReceiptV1,
	createStableOperationId,
	createStablePlanningId,
	type MechanicalReference,
	type MechanicalReferenceKind,
	type ObservedBeforeV1,
	PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	type PlanReceiptV1,
	presentExpectedBefore,
	type SerializableRecord,
	type SourceEvidenceV1,
	type StablePlanOperationV1,
	stableSerialize,
} from "../contracts";
import {
	applyReconciliationPlanV1,
	buildReconciliationPlanV1,
	createReconciliationRecordV1,
	type ReconciliationApplicationResultV1,
	type ReconciliationPlanV1,
	type ReconciliationRecordV1,
} from "../reconciliationPlan";
import { resolveMechanicalReferenceV1 } from "../references";

export const CAMPAIGN_WORKFLOW_VERSION = 1 as const;

export type CampaignWorkflowRpcKind =
	| "deploy-campaign-encounter"
	| "create-quest"
	| "complete-quest"
	| "claim-quest-rewards";

export type CampaignWorkflowRpcName =
	| "deploy_campaign_encounter"
	| "create_session_quest"
	| "complete_session_quest"
	| "claim_quest_rewards";

const RPC_NAME_BY_OPERATION: Record<
	CampaignWorkflowRpcKind,
	CampaignWorkflowRpcName
> = {
	"deploy-campaign-encounter": "deploy_campaign_encounter",
	"create-quest": "create_session_quest",
	"complete-quest": "complete_session_quest",
	"claim-quest-rewards": "claim_quest_rewards",
};

export interface OfficialReferenceSelectionV1 {
	requestKey: string;
	kind: MechanicalReferenceKind;
	requestedName?: string | null;
	candidates?: readonly MechanicalReference[];
}

interface CampaignWorkflowRpcPreflightCommonV1 {
	campaignId: string;
	campaignLabel?: string | null;
	officialReferences?: readonly OfficialReferenceSelectionV1[];
}

export type CampaignWorkflowRpcPreflightInputV1 =
	| (CampaignWorkflowRpcPreflightCommonV1 & {
			operation: "deploy-campaign-encounter";
			encounterId: string;
			encounterLabel?: string | null;
	  })
	| (CampaignWorkflowRpcPreflightCommonV1 & {
			operation: "create-quest";
	  })
	| (CampaignWorkflowRpcPreflightCommonV1 & {
			operation: "complete-quest";
			questId: string;
			questLabel?: string | null;
	  })
	| (CampaignWorkflowRpcPreflightCommonV1 & {
			operation: "claim-quest-rewards";
			questId: string;
			questLabel?: string | null;
			characterId: string;
			characterLabel?: string | null;
	  });

export interface ExplicitWorkflowIdentifierV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	kind: "encounter" | "character";
	id: string;
	label: string | null;
}

export interface CampaignWorkflowResolvedReferencesV1 {
	campaign: MechanicalReference | null;
	quest: MechanicalReference | null;
	encounter: ExplicitWorkflowIdentifierV1 | null;
	character: ExplicitWorkflowIdentifierV1 | null;
	official: MechanicalReference[];
}

export interface CampaignWorkflowRpcOperationV1
	extends StablePlanOperationV1<SerializableRecord, SerializableRecord> {
	rpcName: CampaignWorkflowRpcName;
	workflowOperation: CampaignWorkflowRpcKind;
	campaignId: string | null;
	questId: string | null;
	encounterId: string | null;
	characterId: string | null;
	issueIds: string[];
}

export interface CampaignWorkflowRpcPreflightV1 {
	version: typeof CAMPAIGN_WORKFLOW_VERSION;
	kind: "campaign-workflow-rpc-preflight";
	planId: string;
	operation: CampaignWorkflowRpcOperationV1;
	references: CampaignWorkflowResolvedReferencesV1;
	issues: PlanIssue[];
	blockers: PlanIssue[];
	canInvoke: boolean;
}

function campaignCandidate(
	id: string,
	label: string | null,
): MechanicalReference {
	return {
		version: PLANNING_SCHEMA_VERSION,
		kind: "campaign",
		id,
		label,
		evidence: [],
	};
}

function questCandidate(
	id: string,
	campaignId: string,
	label: string | null,
): MechanicalReference {
	return {
		version: PLANNING_SCHEMA_VERSION,
		kind: "quest",
		id,
		campaignId,
		label,
		evidence: [],
	};
}

function craftingCandidate(
	id: string,
	referenceType: CraftingReferenceTypeV1,
	label: string | null,
): MechanicalReference {
	return {
		version: PLANNING_SCHEMA_VERSION,
		kind: "crafting",
		id,
		referenceType,
		label,
		evidence: [],
	};
}

function explicitIdentifier(
	kind: ExplicitWorkflowIdentifierV1["kind"],
	id: string,
	label: string | null,
	path: string,
): {
	reference: ExplicitWorkflowIdentifierV1 | null;
	issues: PlanIssue[];
} {
	if (id.trim().length === 0) {
		return {
			reference: null,
			issues: [
				createPlanIssue({
					severity: "strict",
					code: `campaign-workflow-${kind}-id-required`,
					message: `An explicit ${kind} ID is required`,
					path,
				}),
			],
		};
	}
	return {
		reference: {
			version: PLANNING_SCHEMA_VERSION,
			kind,
			id,
			label,
		},
		issues: [],
	};
}

function uniqueIssues(issues: readonly PlanIssue[]): PlanIssue[] {
	return [...new Map(issues.map((issue) => [issue.issueId, issue])).values()]
		.map((issue) => cloneSerializable(issue))
		.sort((left, right) => left.issueId.localeCompare(right.issueId));
}

function resolveOfficialReferences(
	selections: readonly OfficialReferenceSelectionV1[],
): { references: MechanicalReference[]; issues: PlanIssue[] } {
	const references: MechanicalReference[] = [];
	const issues: PlanIssue[] = [];
	const ordered = [...selections].sort((left, right) =>
		left.requestKey.localeCompare(right.requestKey),
	);

	for (const selection of ordered) {
		const candidates = [
			...new Map(
				(selection.candidates ?? [])
					.map((candidate) => cloneSerializable(candidate))
					.sort((left, right) =>
						stableSerialize(left).localeCompare(stableSerialize(right)),
					)
					.map((candidate) => [stableSerialize(candidate), candidate]),
			).values(),
		];

		if (candidates.length > 1) {
			issues.push(
				createPlanIssue({
					severity: "manual",
					code: "reference-ambiguous",
					message: `${selection.requestedName ?? selection.requestKey} has multiple explicit identity candidates`,
					path: `references.official.${selection.requestKey}`,
					instructions:
						"Select exactly one explicit candidate ID before invoking the workflow.",
				}),
			);
			continue;
		}

		const resolution = resolveMechanicalReferenceV1({
			requestKey: selection.requestKey,
			kind: selection.kind,
			requestedName: selection.requestedName,
			explicitCandidate: candidates[0] ?? null,
			context: { workflow: "campaign" },
		});
		issues.push(...resolution.issues);
		if (resolution.reference) references.push(resolution.reference);
	}

	references.sort(
		(left, right) =>
			left.kind.localeCompare(right.kind) || left.id.localeCompare(right.id),
	);
	return { references, issues };
}

export function buildCampaignWorkflowRpcPreflightV1(
	input: CampaignWorkflowRpcPreflightInputV1,
): CampaignWorkflowRpcPreflightV1 {
	const campaignResolution = resolveMechanicalReferenceV1({
		requestKey: "campaign",
		kind: "campaign",
		requestedName: input.campaignLabel,
		explicitCandidate: campaignCandidate(
			input.campaignId,
			input.campaignLabel ?? null,
		),
		context: { operation: input.operation },
	});
	const issues: PlanIssue[] = [...campaignResolution.issues];

	let quest: MechanicalReference | null = null;
	if (
		input.operation === "complete-quest" ||
		input.operation === "claim-quest-rewards"
	) {
		const resolution = resolveMechanicalReferenceV1({
			requestKey: "quest",
			kind: "quest",
			requestedName: input.questLabel,
			explicitCandidate: questCandidate(
				input.questId,
				input.campaignId,
				input.questLabel ?? null,
			),
			context: {
				operation: input.operation,
				campaignId: input.campaignId,
			},
		});
		issues.push(...resolution.issues);
		quest = resolution.reference;
	}

	let encounter: ExplicitWorkflowIdentifierV1 | null = null;
	if (input.operation === "deploy-campaign-encounter") {
		const resolution = explicitIdentifier(
			"encounter",
			input.encounterId,
			input.encounterLabel ?? null,
			"references.encounter",
		);
		issues.push(...resolution.issues);
		encounter = resolution.reference;
	}

	let character: ExplicitWorkflowIdentifierV1 | null = null;
	if (input.operation === "claim-quest-rewards") {
		const resolution = explicitIdentifier(
			"character",
			input.characterId,
			input.characterLabel ?? null,
			"references.character",
		);
		issues.push(...resolution.issues);
		character = resolution.reference;
	}

	const official = resolveOfficialReferences(input.officialReferences ?? []);
	issues.push(...official.issues);
	const normalizedIssues = uniqueIssues(issues);
	const campaign = campaignResolution.reference;
	const rpcName = RPC_NAME_BY_OPERATION[input.operation];
	const identity: SerializableRecord = {
		workflowOperation: input.operation,
		rpcName,
		campaignId: campaign?.id ?? null,
		questId: quest?.id ?? null,
		encounterId: encounter?.id ?? null,
		characterId: character?.id ?? null,
		officialReferenceIds: official.references.map(
			(reference) => `${reference.kind}:${reference.id}`,
		),
	};
	const sourceEvidence = [
		...(campaign?.evidence ?? []),
		...(quest?.evidence ?? []),
		...official.references.flatMap((reference) => reference.evidence),
	].map((entry) => cloneSerializable(entry));
	const operation: CampaignWorkflowRpcOperationV1 = {
		version: PLANNING_SCHEMA_VERSION,
		operationId: createStableOperationId({
			boundary: "campaign-workflow-rpc",
			...identity,
		}),
		rpcName,
		workflowOperation: input.operation,
		campaignId: campaign?.id ?? null,
		questId: quest?.id ?? null,
		encounterId: encounter?.id ?? null,
		characterId: character?.id ?? null,
		expectedBefore: absentExpectedBefore<SerializableRecord>(),
		after: presentExpectedBefore(identity),
		sourceEvidence,
		issueIds: normalizedIssues.map((issue) => issue.issueId),
	};
	const blockers = blockingPlanIssues(normalizedIssues);

	return {
		version: CAMPAIGN_WORKFLOW_VERSION,
		kind: "campaign-workflow-rpc-preflight",
		planId: createStablePlanningId("campaign-workflow-rpc-plan", identity),
		operation,
		references: {
			campaign,
			quest,
			encounter,
			character,
			official: official.references,
		},
		issues: normalizedIssues,
		blockers,
		canInvoke: blockers.length === 0,
	};
}

export interface CampaignWorkflowRpcReceiptV1
	extends PlanReceiptV1<SerializableRecord> {
	boundary: "single-rpc";
	planId: string;
	rpcName: CampaignWorkflowRpcName;
}

export interface CampaignWorkflowRpcExecutionV1<TResult> {
	result: TResult;
	receipt: CampaignWorkflowRpcReceiptV1;
}

export class CampaignWorkflowBlockedError extends Error {
	readonly plan: CampaignWorkflowRpcPreflightV1;
	readonly issues: PlanIssue[];

	constructor(plan: CampaignWorkflowRpcPreflightV1) {
		super(plan.blockers[0]?.message ?? "Campaign workflow preflight blocked");
		this.name = "CampaignWorkflowBlockedError";
		this.plan = cloneSerializable(plan);
		this.issues = plan.blockers.map((issue) => cloneSerializable(issue));
	}
}

/**
 * Invoke the supplied RPC boundary exactly once after a successful pure
 * preflight. The receipt is constructed only after that invocation resolves.
 */
export async function executeCampaignWorkflowRpcV1<TResult>(
	preflight: CampaignWorkflowRpcPreflightV1,
	invokeRpc: () => Promise<TResult>,
): Promise<CampaignWorkflowRpcExecutionV1<TResult>> {
	if (!preflight.canInvoke || preflight.blockers.length > 0) {
		throw new CampaignWorkflowBlockedError(preflight);
	}

	const result = await invokeRpc();
	const baseReceipt = createPlanReceiptV1({
		operationId: preflight.operation.operationId,
		outcome: "applied",
		expectedBefore: preflight.operation.expectedBefore,
		observedBefore: absentExpectedBefore<SerializableRecord>(),
		after: preflight.operation.after,
		sourceEvidence: preflight.operation.sourceEvidence,
		issueIds: preflight.operation.issueIds,
	});

	return {
		result,
		receipt: {
			...baseReceipt,
			boundary: "single-rpc",
			planId: preflight.planId,
			rpcName: preflight.operation.rpcName,
		},
	};
}

export type CraftingReferenceTypeV1 = "material" | "recipe" | "project";

export type CraftingSourceOwnershipProofV1 =
	| { kind: "stored-scope" }
	| { kind: "new-record" }
	| { kind: "unproven"; reason: string };

export type CraftingCompensationProofV1 =
	| { kind: "not-required"; reason: string }
	| { kind: "proven"; instructions: string }
	| { kind: "unproven"; reason: string };

export interface CraftingRelatedReferenceV1 {
	referenceType: CraftingReferenceTypeV1;
	id: string;
	label?: string | null;
}

export interface CraftingMutationPlanInputV1 {
	characterId: string;
	recordKey: string;
	referenceType: CraftingReferenceTypeV1;
	referenceId: string;
	referenceLabel?: string | null;
	relatedReferences?: readonly CraftingRelatedReferenceV1[];
	current: SerializableRecord | null;
	desired: SerializableRecord | null;
	sourceOwnership: CraftingSourceOwnershipProofV1;
	compensation: CraftingCompensationProofV1;
	sourceEvidence?: readonly SourceEvidenceV1[];
}

export interface CraftingMutationPlanV1 {
	version: typeof CAMPAIGN_WORKFLOW_VERSION;
	kind: "crafting-mutation-plan";
	planId: string;
	characterId: string;
	recordKey: string;
	sourceKey: string;
	reference: MechanicalReference | null;
	relatedReferences: MechanicalReference[];
	sourceOwnership: CraftingSourceOwnershipProofV1;
	compensation: CraftingCompensationProofV1;
	reconciliationPlan: ReconciliationPlanV1;
	issues: PlanIssue[];
	blockers: PlanIssue[];
	canApply: boolean;
	writeBoundary: "client-checked-direct-write";
	databaseAtomicity: "not-claimed";
}

function scopeMatches(
	record: SerializableRecord,
	characterId: string,
): boolean {
	return record.character_id === characterId;
}

function reconciliationRecordFor(
	plan: Pick<
		CraftingMutationPlanV1,
		"recordKey" | "sourceKey" | "characterId" | "sourceOwnership"
	>,
	value: SerializableRecord,
	evidence: readonly SourceEvidenceV1[],
): ReconciliationRecordV1 {
	const sourceOwned =
		plan.sourceOwnership.kind === "stored-scope" &&
		scopeMatches(value, plan.characterId);
	return createReconciliationRecordV1({
		recordKey: plan.recordKey,
		value,
		ownership: sourceOwned
			? {
					kind: "source",
					sourceKey: plan.sourceKey,
					evidence: evidence.map((entry) => cloneSerializable(entry)),
				}
			: {
					kind: "manual",
					reason: "Stored source ownership is not proven for this observation",
				},
	});
}

function craftingEvidence(
	input: CraftingMutationPlanInputV1,
): SourceEvidenceV1[] {
	const observed: SourceEvidenceV1 = {
		version: PLANNING_SCHEMA_VERSION,
		kind: input.current ? "stored" : "derived",
		sourceType: "character-crafting",
		sourceId: input.referenceId || null,
		sourceVersion: null,
		path: input.recordKey,
		label: input.referenceLabel ?? null,
		observed: input.current ? cloneSerializable(input.current) : null,
	};
	return [
		observed,
		...(input.sourceEvidence ?? []).map((entry) => cloneSerializable(entry)),
	].sort((left, right) =>
		stableSerialize(left).localeCompare(stableSerialize(right)),
	);
}

function resolveCraftingReference(input: CraftingRelatedReferenceV1) {
	return resolveMechanicalReferenceV1({
		requestKey: `${input.referenceType}:${input.id}`,
		kind: "crafting",
		requestedName: input.label,
		explicitCandidate: craftingCandidate(
			input.id,
			input.referenceType,
			input.label ?? null,
		),
		context: { referenceType: input.referenceType },
	});
}

export function buildCraftingMutationPlanV1(
	input: CraftingMutationPlanInputV1,
): CraftingMutationPlanV1 {
	const issues: PlanIssue[] = [];
	const character = explicitIdentifier(
		"character",
		input.characterId,
		null,
		"references.character",
	);
	issues.push(...character.issues);

	const primaryResolution = resolveCraftingReference({
		referenceType: input.referenceType,
		id: input.referenceId,
		label: input.referenceLabel,
	});
	issues.push(...primaryResolution.issues);

	const relatedReferences: MechanicalReference[] = [];
	const related = [...(input.relatedReferences ?? [])].sort(
		(left, right) =>
			left.referenceType.localeCompare(right.referenceType) ||
			left.id.localeCompare(right.id),
	);
	for (const relatedReference of related) {
		const resolution = resolveCraftingReference(relatedReference);
		issues.push(...resolution.issues);
		if (resolution.reference) relatedReferences.push(resolution.reference);
	}

	if (input.current && !scopeMatches(input.current, input.characterId)) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "crafting-current-scope-mismatch",
				message:
					"The current crafting row is not scoped to the explicit character ID",
				path: `crafting.${input.recordKey}.current.character_id`,
			}),
		);
	}
	if (input.desired && !scopeMatches(input.desired, input.characterId)) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "crafting-desired-scope-mismatch",
				message:
					"The desired crafting row is not scoped to the explicit character ID",
				path: `crafting.${input.recordKey}.desired.character_id`,
			}),
		);
	}
	if (
		input.sourceOwnership.kind === "unproven" ||
		(input.current !== null && input.sourceOwnership.kind !== "stored-scope")
	) {
		issues.push(
			createPlanIssue({
				severity: "manual",
				code: "crafting-source-ownership-unproven",
				message: "Crafting source ownership cannot be proven automatically",
				path: `crafting.${input.recordKey}.ownership`,
				instructions:
					input.sourceOwnership.kind === "unproven"
						? input.sourceOwnership.reason
						: "Confirm the existing row belongs to the stored character scope before retrying.",
			}),
		);
	}
	if (input.compensation.kind === "unproven") {
		issues.push(
			createPlanIssue({
				severity: "manual",
				code: "crafting-compensation-unproven",
				message:
					"Required crafting compensation cannot be proven automatically",
				path: `crafting.${input.recordKey}.compensation`,
				instructions: input.compensation.reason,
			}),
		);
	}

	const evidence = craftingEvidence(input);
	const sourceKey = createStablePlanningId("crafting-source", {
		characterId: input.characterId,
		recordKey: input.recordKey,
	});
	const planIdentity = {
		recordKey: input.recordKey,
		sourceKey,
		characterId: input.characterId,
		sourceOwnership: cloneSerializable(input.sourceOwnership),
	};
	const current = input.current
		? [
				reconciliationRecordFor(
					planIdentity,
					cloneSerializable(input.current),
					evidence,
				),
			]
		: [];
	const reconciliationPlan = buildReconciliationPlanV1({
		scopeKey: "character-crafting",
		targetId: input.characterId,
		sourceKey,
		current,
		desired: input.desired
			? [
					{
						recordKey: input.recordKey,
						value: cloneSerializable(input.desired),
						sourceEvidence: evidence,
					},
				]
			: [],
	});
	issues.push(...reconciliationPlan.issues);
	const normalizedIssues = uniqueIssues(issues);
	const blockers = blockingPlanIssues(normalizedIssues);
	const reference = primaryResolution.reference;

	return {
		version: CAMPAIGN_WORKFLOW_VERSION,
		kind: "crafting-mutation-plan",
		planId: createStablePlanningId("crafting-mutation-plan", {
			reconciliationPlanId: reconciliationPlan.planId,
			referenceId: reference?.id ?? null,
			referenceType:
				reference?.kind === "crafting" ? reference.referenceType : null,
			issueIds: normalizedIssues.map((issue) => issue.issueId),
		}),
		characterId: input.characterId,
		recordKey: input.recordKey,
		sourceKey,
		reference,
		relatedReferences,
		sourceOwnership: cloneSerializable(input.sourceOwnership),
		compensation: cloneSerializable(input.compensation),
		reconciliationPlan,
		issues: normalizedIssues,
		blockers,
		canApply: blockers.length === 0 && reconciliationPlan.canApply,
		writeBoundary: "client-checked-direct-write",
		databaseAtomicity: "not-claimed",
	};
}

export interface CraftingMutationReceiptV1
	extends PlanReceiptV1<ReconciliationRecordV1> {
	boundary: "client-checked-direct-write";
	planId: string;
	databaseAtomic: false;
}

export interface CraftingMutationExecutionV1<TResult> {
	result: TResult;
	receipt: CraftingMutationReceiptV1;
}

export class CraftingWorkflowBlockedError extends Error {
	readonly plan: CraftingMutationPlanV1;
	readonly preflight: ReconciliationApplicationResultV1 | null;

	constructor(
		plan: CraftingMutationPlanV1,
		preflight: ReconciliationApplicationResultV1 | null = null,
	) {
		const conflictReceipt = preflight?.receipts.find(
			(receipt) => receipt.outcome === "conflict",
		);
		super(
			plan.blockers[0]?.message ??
				(conflictReceipt
					? "Crafting state changed after planning; reload and retry"
					: "Crafting workflow preflight blocked"),
		);
		this.name = "CraftingWorkflowBlockedError";
		this.plan = cloneSerializable(plan);
		this.preflight = preflight ? cloneSerializable(preflight) : null;
	}
}

/**
 * Check the latest observed row against expected-before state, then invoke one
 * direct write. This is deliberately not represented as a database transaction.
 */
export async function executeCraftingMutationV1<TResult>(
	plan: CraftingMutationPlanV1,
	observedCurrent: SerializableRecord | null,
	invokeDirectWrite: () => Promise<TResult>,
): Promise<CraftingMutationExecutionV1<TResult>> {
	if (!plan.canApply || plan.blockers.length > 0) {
		throw new CraftingWorkflowBlockedError(plan);
	}

	const evidence = plan.reconciliationPlan.operations[0]?.sourceEvidence ?? [];
	const observedRecords = observedCurrent
		? [
				reconciliationRecordFor(
					plan,
					cloneSerializable(observedCurrent),
					evidence,
				),
			]
		: [];
	const preflight = applyReconciliationPlanV1(
		observedRecords,
		plan.reconciliationPlan,
	);
	if (preflight.blocked || preflight.hasConflicts) {
		throw new CraftingWorkflowBlockedError(plan, preflight);
	}

	const operation = plan.reconciliationPlan.operations.find(
		(candidate) => candidate.recordKey === plan.recordKey,
	);
	if (!operation) throw new CraftingWorkflowBlockedError(plan, preflight);

	const result = await invokeDirectWrite();
	const observedBefore: ObservedBeforeV1<ReconciliationRecordV1> =
		observedRecords[0]
			? presentExpectedBefore(observedRecords[0])
			: absentExpectedBefore<ReconciliationRecordV1>();
	const baseReceipt = createPlanReceiptV1({
		operationId: operation.operationId,
		outcome: "applied",
		expectedBefore: operation.expectedBefore,
		observedBefore,
		after: operation.after,
		sourceEvidence: operation.sourceEvidence,
		issueIds: operation.issueIds,
	});

	return {
		result,
		receipt: {
			...baseReceipt,
			boundary: "client-checked-direct-write",
			planId: plan.planId,
			databaseAtomic: false,
		},
	};
}
