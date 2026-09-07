import type { Database } from "@/integrations/supabase/types";
import {
	canAttuneItem,
	canUnattuneItem,
	MAX_ATTUNEMENT_SLOTS,
} from "@/lib/attunementRules";
import {
	cloneSerializable,
	createPlanIssue,
	createStableOperationId,
	createStablePlanningId,
	PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	type SourceEvidenceKind,
	type SourceEvidenceV1,
} from "@/lib/planning/contracts";

/** Pure, persistence-agnostic item lifecycle planning schema. */
export const ITEM_LIFECYCLE_PLAN_VERSION = PLANNING_SCHEMA_VERSION;

export type ItemLifecyclePlanStatus = "automated" | "manual" | "review-blocked";

export type ItemLifecycleEquipmentRow = Pick<
	Database["public"]["Tables"]["character_equipment"]["Row"],
	| "id"
	| "item_id"
	| "item_type"
	| "name"
	| "is_equipped"
	| "is_attuned"
	| "requires_attunement"
	| "charges_current"
	| "charges_max"
	| "sigil_slots_base"
>;

export interface ItemLifecycleSourceInput {
	kind?: SourceEvidenceKind;
	sourceType: string;
	/** A persisted or canonical ID. Display names must never be used as IDs. */
	sourceId: string | null;
	sourceVersion?: string | number | null;
	path?: string | null;
	label?: string | null;
}

export interface ItemLifecycleTargetV1 {
	kind: "equipment" | "socket" | "inscription" | "tattoo" | "rune";
	targetId: string;
	label: string | null;
}

export type ItemLifecycleResolutionGateV1 =
	| {
			status: "manual";
			reason: string;
			instructions?: string | null;
	  }
	| {
			status: "review-blocked";
			reason: string;
			reviewBlockerId: string;
			instructions?: string | null;
	  };

/**
 * A compatibility decision is executable only when both the decision and its
 * rule source have explicit identities. Unresolved decisions stay inert.
 */
export type ItemLifecycleCompatibilityDecisionV1 =
	| {
			status: "automated";
			compatible: boolean;
			reason: string;
			source: ItemLifecycleSourceInput;
	  }
	| {
			status: "manual";
			compatible: null;
			reason: string;
			instructions?: string | null;
			source?: ItemLifecycleSourceInput | null;
	  }
	| {
			status: "review-blocked";
			compatible: null;
			reason: string;
			reviewBlockerId: string;
			instructions?: string | null;
			source?: ItemLifecycleSourceInput | null;
	  };

export type ItemLifecycleCompatibilityKind =
	| "socket"
	| "inscription"
	| "tattoo"
	| "rune";

export interface ItemLifecycleCompatibilityResultV1 {
	version: typeof ITEM_LIFECYCLE_PLAN_VERSION;
	kind: ItemLifecycleCompatibilityKind;
	status: ItemLifecyclePlanStatus;
	compatible: boolean | null;
	candidateSourceId: string | null;
	decisionSourceId: string | null;
	reason: string;
	reviewBlockerId: string | null;
}

export type ItemLifecycleActionV1 =
	| { kind: "equip" }
	| { kind: "unequip" }
	| { kind: "attune"; currentAttunedCount: number }
	| { kind: "unattune" }
	| { kind: "set-charges"; chargesCurrent: number }
	| {
			kind: "set-sockets";
			sigilSlotsBase: number;
			compatibility: ItemLifecycleCompatibilityDecisionV1;
	  }
	| {
			kind: "check-compatibility";
			compatibilityKind: ItemLifecycleCompatibilityKind;
			candidate: ItemLifecycleSourceInput;
			decision: ItemLifecycleCompatibilityDecisionV1;
	  };

interface ItemLifecyclePlanInputBase {
	source: ItemLifecycleSourceInput;
	/** Optional authored/manual gate, checked before any transition is derived. */
	resolution?: ItemLifecycleResolutionGateV1 | null;
}

export type ItemLifecyclePlanInput =
	| (ItemLifecyclePlanInputBase & {
			equipment: ItemLifecycleEquipmentRow;
			action: Exclude<ItemLifecycleActionV1, { kind: "check-compatibility" }>;
	  })
	| (ItemLifecyclePlanInputBase & {
			target: ItemLifecycleTargetV1;
			action: Extract<ItemLifecycleActionV1, { kind: "check-compatibility" }>;
	  });

export type ItemLifecycleMutableField =
	| "is_equipped"
	| "is_attuned"
	| "charges_current"
	| "sigil_slots_base";

/** Context that authorized an operation and must still hold when applied. */
export type ItemLifecycleOperationGuardV1 =
	| {
			kind: "equipment-field-equals";
			field: "requires_attunement" | "charges_max";
			value: boolean | number | null;
	  }
	| {
			kind: "attuned-count-equals";
			value: number;
			maximum: number;
	  };

export interface ItemLifecycleOperationV1 {
	version: typeof ITEM_LIFECYCLE_PLAN_VERSION;
	operationId: string;
	kind: "equipment-update";
	action: Exclude<ItemLifecycleActionV1["kind"], "check-compatibility">;
	target: ItemLifecycleTargetV1 & { kind: "equipment" };
	expectedBefore: {
		field: ItemLifecycleMutableField;
		value: boolean | number | null;
	};
	after: {
		field: ItemLifecycleMutableField;
		value: boolean | number;
	};
	guards: ItemLifecycleOperationGuardV1[];
	sourceIds: string[];
	sourceEvidence: SourceEvidenceV1[];
}

interface ItemLifecyclePlanBaseV1 {
	version: typeof ITEM_LIFECYCLE_PLAN_VERSION;
	planId: string;
	action: ItemLifecycleActionV1["kind"];
	target: ItemLifecycleTargetV1;
	sourceIds: string[];
	sourceEvidence: SourceEvidenceV1[];
	operations: ItemLifecycleOperationV1[];
	issues: PlanIssue[];
	compatibility: ItemLifecycleCompatibilityResultV1 | null;
}

export type ItemLifecyclePlanV1 =
	| (ItemLifecyclePlanBaseV1 & {
			status: "automated";
			outcome: "ready" | "noop" | "incompatible";
			canApply: boolean;
			manual: null;
			reviewBlockerId: null;
	  })
	| (ItemLifecyclePlanBaseV1 & {
			status: "manual";
			outcome: "blocked";
			canApply: false;
			operations: [];
			manual: { reason: string; instructions: string | null };
			reviewBlockerId: null;
	  })
	| (ItemLifecyclePlanBaseV1 & {
			status: "review-blocked";
			outcome: "blocked";
			canApply: false;
			operations: [];
			manual: { reason: string; instructions: string | null };
			reviewBlockerId: string;
	  });

function normalizeId(value: string | null | undefined): string | null {
	const normalized = value?.trim() ?? "";
	return normalized.length > 0 ? normalized : null;
}

function sourceEvidence(input: ItemLifecycleSourceInput): SourceEvidenceV1 {
	const sourceVersion = input.sourceVersion ?? null;
	return {
		version: ITEM_LIFECYCLE_PLAN_VERSION,
		kind: input.kind ?? "canonical",
		sourceType: input.sourceType.trim(),
		sourceId: normalizeId(input.sourceId),
		sourceVersion:
			typeof sourceVersion === "number" && !Number.isFinite(sourceVersion)
				? String(sourceVersion)
				: sourceVersion,
		path: input.path?.trim() || null,
		label: input.label?.trim() || null,
		observed: null,
	};
}

function compareText(left: string, right: string): number {
	if (left < right) return -1;
	if (left > right) return 1;
	return 0;
}

function uniqueSourceIds(evidence: readonly SourceEvidenceV1[]): string[] {
	return [
		...new Set(
			evidence
				.map((entry) => normalizeId(entry.sourceId))
				.filter((id): id is string => id !== null),
		),
	].sort(compareText);
}

function targetFor(input: ItemLifecyclePlanInput): ItemLifecycleTargetV1 {
	if ("equipment" in input) {
		return {
			kind: "equipment",
			targetId: input.equipment.id.trim(),
			label: input.equipment.name.trim() || null,
		};
	}
	return {
		...input.target,
		targetId: input.target.targetId.trim(),
		label: input.target.label?.trim() || null,
	};
}

function finiteSeedNumber(value: number): number | string {
	return Number.isFinite(value) ? value : String(value);
}

function actionSeed(action: ItemLifecycleActionV1): Record<string, unknown> {
	switch (action.kind) {
		case "attune":
			return {
				kind: action.kind,
				currentAttunedCount: finiteSeedNumber(action.currentAttunedCount),
			};
		case "set-charges":
			return {
				kind: action.kind,
				chargesCurrent: finiteSeedNumber(action.chargesCurrent),
			};
		case "set-sockets":
			return {
				kind: action.kind,
				sigilSlotsBase: finiteSeedNumber(action.sigilSlotsBase),
				compatibilityStatus: action.compatibility.status,
			};
		case "check-compatibility":
			return {
				kind: action.kind,
				compatibilityKind: action.compatibilityKind,
				candidateSourceId: normalizeId(action.candidate.sourceId),
				decisionStatus: action.decision.status,
			};
		default:
			return { kind: action.kind };
	}
}

function planIdFor(
	input: ItemLifecyclePlanInput,
	body: {
		status: ItemLifecyclePlanStatus;
		outcome: string;
		target: ItemLifecycleTargetV1;
		sourceIds: readonly string[];
		operationIds: readonly string[];
		issueIds: readonly string[];
		compatibility: ItemLifecycleCompatibilityResultV1 | null;
	},
): string {
	return createStablePlanningId("item-lifecycle-plan", {
		action: actionSeed(input.action),
		status: body.status,
		outcome: body.outcome,
		target: {
			kind: body.target.kind,
			targetId: body.target.targetId,
		},
		sourceIds: [...body.sourceIds],
		operationIds: [...body.operationIds],
		issueIds: [...body.issueIds],
		compatibility: body.compatibility,
	});
}

function issuePath(target: ItemLifecycleTargetV1): string {
	return `itemLifecycle.${target.kind}.${target.targetId || "unresolved"}`;
}

function blockedPlan(
	input: ItemLifecyclePlanInput,
	options:
		| {
				status: "manual";
				code: string;
				reason: string;
				instructions?: string | null;
				compatibility?: ItemLifecycleCompatibilityResultV1 | null;
		  }
		| {
				status: "review-blocked";
				code: string;
				reason: string;
				reviewBlockerId: string;
				instructions?: string | null;
				compatibility?: ItemLifecycleCompatibilityResultV1 | null;
		  },
	evidence: readonly SourceEvidenceV1[],
): ItemLifecyclePlanV1 {
	const target = targetFor(input);
	const issue =
		options.status === "review-blocked"
			? createPlanIssue({
					severity: "review-blocked",
					code: options.code,
					message: options.reason,
					path: issuePath(target),
					reviewBlockerId: options.reviewBlockerId,
					instructions: options.instructions ?? null,
					evidence,
				})
			: createPlanIssue({
					severity: "manual",
					code: options.code,
					message: options.reason,
					path: issuePath(target),
					instructions: options.instructions ?? null,
					evidence,
				});
	const sourceIds = uniqueSourceIds(evidence);
	const compatibility = options.compatibility ?? null;
	const base = {
		version: ITEM_LIFECYCLE_PLAN_VERSION,
		planId: planIdFor(input, {
			status: options.status,
			outcome: "blocked",
			target,
			sourceIds,
			operationIds: [],
			issueIds: [issue.issueId],
			compatibility,
		}),
		action: input.action.kind,
		target,
		sourceIds,
		sourceEvidence: evidence.map((entry) => cloneSerializable(entry)),
		operations: [] as [],
		issues: [issue],
		compatibility,
		outcome: "blocked" as const,
		canApply: false as const,
		manual: {
			reason: options.reason,
			instructions: options.instructions ?? null,
		},
	};
	if (options.status === "review-blocked") {
		return {
			...base,
			status: "review-blocked",
			reviewBlockerId: options.reviewBlockerId,
		};
	}
	return { ...base, status: "manual", reviewBlockerId: null };
}

function automatedPlan(
	input: ItemLifecyclePlanInput,
	options: {
		outcome: "ready" | "noop" | "incompatible";
		operations?: readonly ItemLifecycleOperationV1[];
		compatibility?: ItemLifecycleCompatibilityResultV1 | null;
	},
	evidence: readonly SourceEvidenceV1[],
): ItemLifecyclePlanV1 {
	const target = targetFor(input);
	const sourceIds = uniqueSourceIds(evidence);
	const operations = (options.operations ?? []).map((operation) =>
		cloneSerializable(operation),
	);
	const compatibility = options.compatibility ?? null;
	return {
		version: ITEM_LIFECYCLE_PLAN_VERSION,
		planId: planIdFor(input, {
			status: "automated",
			outcome: options.outcome,
			target,
			sourceIds,
			operationIds: operations.map((operation) => operation.operationId),
			issueIds: [],
			compatibility,
		}),
		action: input.action.kind,
		target,
		sourceIds,
		sourceEvidence: evidence.map((entry) => cloneSerializable(entry)),
		operations,
		issues: [],
		compatibility,
		status: "automated",
		outcome: options.outcome,
		canApply: options.outcome !== "incompatible",
		manual: null,
		reviewBlockerId: null,
	};
}

function compatibilityResult(
	kind: ItemLifecycleCompatibilityKind,
	candidate: ItemLifecycleSourceInput | null,
	decision: ItemLifecycleCompatibilityDecisionV1,
): ItemLifecycleCompatibilityResultV1 {
	return {
		version: ITEM_LIFECYCLE_PLAN_VERSION,
		kind,
		status: decision.status,
		compatible: decision.status === "automated" ? decision.compatible : null,
		candidateSourceId: normalizeId(candidate?.sourceId),
		decisionSourceId: normalizeId(decision.source?.sourceId),
		reason: decision.reason,
		reviewBlockerId:
			decision.status === "review-blocked" ? decision.reviewBlockerId : null,
	};
}

function resolveCompatibility(
	input: ItemLifecyclePlanInput,
	kind: ItemLifecycleCompatibilityKind,
	candidate: ItemLifecycleSourceInput | null,
	decision: ItemLifecycleCompatibilityDecisionV1,
	baseEvidence: readonly SourceEvidenceV1[],
):
	| {
			status: "compatible";
			evidence: SourceEvidenceV1[];
			result: ItemLifecycleCompatibilityResultV1;
	  }
	| { status: "finished"; plan: ItemLifecyclePlanV1 } {
	const decisionEvidence = decision.source
		? sourceEvidence(decision.source)
		: null;
	const candidateEvidence = candidate ? sourceEvidence(candidate) : null;
	const evidence = [
		...baseEvidence,
		...(candidateEvidence ? [candidateEvidence] : []),
		...(decisionEvidence ? [decisionEvidence] : []),
	];
	const result = compatibilityResult(kind, candidate, decision);

	if (decision.status === "review-blocked") {
		return {
			status: "finished",
			plan: blockedPlan(
				input,
				{
					status: "review-blocked",
					code: "item-lifecycle-compatibility-review-blocked",
					reason: decision.reason,
					reviewBlockerId: decision.reviewBlockerId,
					instructions: decision.instructions ?? null,
					compatibility: result,
				},
				evidence,
			),
		};
	}
	if (decision.status === "manual") {
		return {
			status: "finished",
			plan: blockedPlan(
				input,
				{
					status: "manual",
					code: "item-lifecycle-compatibility-manual",
					reason: decision.reason,
					instructions: decision.instructions ?? null,
					compatibility: result,
				},
				evidence,
			),
		};
	}
	if (!normalizeId(decision.source.sourceId)) {
		return {
			status: "finished",
			plan: blockedPlan(
				input,
				{
					status: "manual",
					code: "item-lifecycle-compatibility-source-id-missing",
					reason:
						"Automated compatibility requires an explicit stable rule source ID.",
					instructions:
						"Supply the persisted or canonical rule source; do not derive it from a display name.",
					compatibility: result,
				},
				evidence,
			),
		};
	}
	if (candidate && !normalizeId(candidate.sourceId)) {
		return {
			status: "finished",
			plan: blockedPlan(
				input,
				{
					status: "manual",
					code: "item-lifecycle-candidate-source-id-missing",
					reason:
						"Compatibility candidates require an explicit persisted or canonical ID.",
					instructions: "Resolve the candidate identity before automation.",
					compatibility: result,
				},
				evidence,
			),
		};
	}
	if (!decision.compatible) {
		return {
			status: "finished",
			plan: automatedPlan(
				input,
				{ outcome: "incompatible", compatibility: result },
				evidence,
			),
		};
	}
	return { status: "compatible", evidence, result };
}

function equipmentOperation(
	action: ItemLifecycleOperationV1["action"],
	equipment: ItemLifecycleEquipmentRow,
	field: ItemLifecycleMutableField,
	before: boolean | number | null,
	after: boolean | number,
	evidence: readonly SourceEvidenceV1[],
	guards: readonly ItemLifecycleOperationGuardV1[] = [],
): ItemLifecycleOperationV1 {
	const target = {
		kind: "equipment" as const,
		targetId: equipment.id.trim(),
		label: equipment.name.trim() || null,
	};
	const operationId = createStableOperationId({
		action,
		target: { kind: target.kind, targetId: target.targetId },
		expectedBefore: { field, value: before },
		after: { field, value: after },
		guards,
		sourceIds: uniqueSourceIds(evidence),
	});
	return {
		version: ITEM_LIFECYCLE_PLAN_VERSION,
		operationId,
		kind: "equipment-update",
		action,
		target,
		expectedBefore: { field, value: before },
		after: { field, value: after },
		guards: guards.map((guard) => cloneSerializable(guard)),
		sourceIds: uniqueSourceIds(evidence),
		sourceEvidence: evidence.map((entry) => cloneSerializable(entry)),
	};
}

function isNonnegativeSafeInteger(value: number): boolean {
	return Number.isSafeInteger(value) && value >= 0;
}

/**
 * Build a deterministic item lifecycle plan. This function never reads a
 * clock, creates a random ID, parses display prose, or invents compatibility.
 * Manual and review-blocked inputs always produce zero operations.
 */
export function planItemLifecycleV1(
	input: ItemLifecyclePlanInput,
): ItemLifecyclePlanV1 {
	const primaryEvidence = sourceEvidence(input.source);
	const evidence = [primaryEvidence];

	if (input.resolution?.status === "review-blocked") {
		return blockedPlan(
			input,
			{
				status: "review-blocked",
				code: "item-lifecycle-review-blocked",
				reason: input.resolution.reason,
				reviewBlockerId: input.resolution.reviewBlockerId,
				instructions: input.resolution.instructions ?? null,
			},
			evidence,
		);
	}
	if (input.resolution?.status === "manual") {
		return blockedPlan(
			input,
			{
				status: "manual",
				code: "item-lifecycle-manual",
				reason: input.resolution.reason,
				instructions: input.resolution.instructions ?? null,
			},
			evidence,
		);
	}

	const target = targetFor(input);
	if (!normalizeId(input.source.sourceId)) {
		return blockedPlan(
			input,
			{
				status: "manual",
				code: "item-lifecycle-source-id-missing",
				reason: "Automated lifecycle plans require a stable source ID.",
				instructions:
					"Supply a persisted or canonical source ID; never derive one from the display name.",
			},
			evidence,
		);
	}
	if (!input.source.sourceType.trim()) {
		return blockedPlan(
			input,
			{
				status: "manual",
				code: "item-lifecycle-source-type-missing",
				reason: "Automated lifecycle plans require an explicit source type.",
			},
			evidence,
		);
	}
	if (!normalizeId(target.targetId)) {
		return blockedPlan(
			input,
			{
				status: "manual",
				code: "item-lifecycle-target-id-missing",
				reason: "Automated lifecycle plans require a stable target ID.",
			},
			evidence,
		);
	}

	if (input.action.kind === "check-compatibility") {
		const resolution = resolveCompatibility(
			input,
			input.action.compatibilityKind,
			input.action.candidate,
			input.action.decision,
			evidence,
		);
		if (resolution.status === "finished") return resolution.plan;
		return automatedPlan(
			input,
			{ outcome: "noop", compatibility: resolution.result },
			resolution.evidence,
		);
	}

	if (!("equipment" in input)) {
		return blockedPlan(
			input,
			{
				status: "manual",
				code: "item-lifecycle-equipment-state-missing",
				reason: "This lifecycle action requires persisted equipment state.",
			},
			evidence,
		);
	}
	const equipment = input.equipment;

	switch (input.action.kind) {
		case "equip": {
			if (equipment.is_equipped) {
				return automatedPlan(input, { outcome: "noop" }, evidence);
			}
			return automatedPlan(
				input,
				{
					outcome: "ready",
					operations: [
						equipmentOperation(
							"equip",
							equipment,
							"is_equipped",
							false,
							true,
							evidence,
						),
					],
				},
				evidence,
			);
		}
		case "unequip": {
			if (!equipment.is_equipped) {
				return automatedPlan(input, { outcome: "noop" }, evidence);
			}
			return automatedPlan(
				input,
				{
					outcome: "ready",
					operations: [
						equipmentOperation(
							"unequip",
							equipment,
							"is_equipped",
							true,
							false,
							evidence,
						),
					],
				},
				evidence,
			);
		}
		case "attune": {
			if (!isNonnegativeSafeInteger(input.action.currentAttunedCount)) {
				return blockedPlan(
					input,
					{
						status: "manual",
						code: "item-lifecycle-attuned-count-invalid",
						reason: "Current attuned count must be a nonnegative safe integer.",
					},
					evidence,
				);
			}
			if (equipment.is_attuned) {
				return automatedPlan(input, { outcome: "noop" }, evidence);
			}
			const validation = canAttuneItem(
				{
					id: equipment.id,
					name: equipment.name,
					requiresAttunement: equipment.requires_attunement,
					isAttuned: equipment.is_attuned,
				},
				input.action.currentAttunedCount,
			);
			if (!validation.allowed) {
				return blockedPlan(
					input,
					{
						status: "manual",
						code: "item-lifecycle-attunement-rejected",
						reason: validation.reason,
					},
					evidence,
				);
			}
			return automatedPlan(
				input,
				{
					outcome: "ready",
					operations: [
						equipmentOperation(
							"attune",
							equipment,
							"is_attuned",
							false,
							true,
							evidence,
							[
								{
									kind: "equipment-field-equals",
									field: "requires_attunement",
									value: true,
								},
								{
									kind: "attuned-count-equals",
									value: input.action.currentAttunedCount,
									maximum: MAX_ATTUNEMENT_SLOTS,
								},
							],
						),
					],
				},
				evidence,
			);
		}
		case "unattune": {
			if (!equipment.is_attuned) {
				return automatedPlan(input, { outcome: "noop" }, evidence);
			}
			const validation = canUnattuneItem({
				id: equipment.id,
				name: equipment.name,
				requiresAttunement: equipment.requires_attunement,
				isAttuned: equipment.is_attuned,
			});
			if (!validation.allowed) {
				return blockedPlan(
					input,
					{
						status: "manual",
						code: "item-lifecycle-unattunement-rejected",
						reason: validation.reason,
					},
					evidence,
				);
			}
			return automatedPlan(
				input,
				{
					outcome: "ready",
					operations: [
						equipmentOperation(
							"unattune",
							equipment,
							"is_attuned",
							true,
							false,
							evidence,
						),
					],
				},
				evidence,
			);
		}
		case "set-charges": {
			const maximum = equipment.charges_max;
			const current = equipment.charges_current;
			if (
				maximum == null ||
				current == null ||
				!isNonnegativeSafeInteger(maximum) ||
				!isNonnegativeSafeInteger(current) ||
				current > maximum
			) {
				return blockedPlan(
					input,
					{
						status: "manual",
						code: "item-lifecycle-charge-state-invalid",
						reason:
							"Automated charge changes require explicit nonnegative current/max values with current no greater than max.",
						instructions:
							"Resolve the persisted charge ledger; do not infer recharge or capacity from prose.",
					},
					evidence,
				);
			}
			if (
				!isNonnegativeSafeInteger(input.action.chargesCurrent) ||
				input.action.chargesCurrent > maximum
			) {
				return blockedPlan(
					input,
					{
						status: "manual",
						code: "item-lifecycle-charge-target-invalid",
						reason: `Requested charges must be a nonnegative safe integer no greater than ${maximum}.`,
					},
					evidence,
				);
			}
			if (current === input.action.chargesCurrent) {
				return automatedPlan(input, { outcome: "noop" }, evidence);
			}
			return automatedPlan(
				input,
				{
					outcome: "ready",
					operations: [
						equipmentOperation(
							"set-charges",
							equipment,
							"charges_current",
							current,
							input.action.chargesCurrent,
							evidence,
							[
								{
									kind: "equipment-field-equals",
									field: "charges_max",
									value: maximum,
								},
							],
						),
					],
				},
				evidence,
			);
		}
		case "set-sockets": {
			const resolution = resolveCompatibility(
				input,
				"socket",
				null,
				input.action.compatibility,
				evidence,
			);
			if (resolution.status === "finished") return resolution.plan;
			if (
				!isNonnegativeSafeInteger(equipment.sigil_slots_base) ||
				!isNonnegativeSafeInteger(input.action.sigilSlotsBase)
			) {
				return blockedPlan(
					input,
					{
						status: "manual",
						code: "item-lifecycle-socket-count-invalid",
						reason: "Socket counts must be nonnegative safe integers.",
						compatibility: resolution.result,
					},
					resolution.evidence,
				);
			}
			if (equipment.sigil_slots_base === input.action.sigilSlotsBase) {
				return automatedPlan(
					input,
					{ outcome: "noop", compatibility: resolution.result },
					resolution.evidence,
				);
			}
			return automatedPlan(
				input,
				{
					outcome: "ready",
					compatibility: resolution.result,
					operations: [
						equipmentOperation(
							"set-sockets",
							equipment,
							"sigil_slots_base",
							equipment.sigil_slots_base,
							input.action.sigilSlotsBase,
							resolution.evidence,
						),
					],
				},
				resolution.evidence,
			);
		}
	}
}

/** Concise alias for callers that do not encode the schema version in names. */
export const planItemLifecycle = planItemLifecycleV1;
