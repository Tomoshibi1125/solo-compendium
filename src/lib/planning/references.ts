import {
	cloneSerializable,
	createPlanIssue,
	createStablePlanningId,
	type MechanicalReference,
	type MechanicalReferenceKind,
	PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	type SerializableRecord,
	type SourceEvidenceV1,
} from "./contracts";

export interface ForbiddenReferencePolicyV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	code: string;
	reason: string;
	reviewBlockerId: string | null;
	evidence: SourceEvidenceV1[];
}

export interface MechanicalReferenceRequestV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	requestId: string;
	kind: MechanicalReferenceKind;
	requestedName: string | null;
	explicitCandidate: MechanicalReference | null;
	forbidden: ForbiddenReferencePolicyV1 | null;
	context: SerializableRecord;
}

export interface MechanicalReferenceRequestInput {
	requestId?: string;
	requestKey?: string | null;
	kind: MechanicalReferenceKind;
	requestedName?: string | null;
	explicitCandidate?: MechanicalReference | null;
	forbidden?: {
		code: string;
		reason: string;
		reviewBlockerId?: string | null;
		evidence?: readonly SourceEvidenceV1[];
	} | null;
	context?: SerializableRecord;
}

export type MechanicalReferenceResolutionV1 =
	| {
			version: typeof PLANNING_SCHEMA_VERSION;
			status: "resolved";
			request: MechanicalReferenceRequestV1;
			reference: MechanicalReference;
			issues: PlanIssue[];
	  }
	| {
			version: typeof PLANNING_SCHEMA_VERSION;
			status: "unresolved";
			request: MechanicalReferenceRequestV1;
			reference: null;
			issues: PlanIssue[];
	  }
	| {
			version: typeof PLANNING_SCHEMA_VERSION;
			status: "forbidden";
			request: MechanicalReferenceRequestV1;
			reference: null;
			issues: PlanIssue[];
	  };

export interface UnresolvedMechanicalReferenceV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	requestId: string;
	kind: MechanicalReferenceKind;
	requestedName: string | null;
	candidateId: null;
	reason: string;
	issues: PlanIssue[];
}

export function createMechanicalReferenceRequestV1(
	input: MechanicalReferenceRequestInput,
): MechanicalReferenceRequestV1 {
	const requestedName = input.requestedName?.trim() || null;
	const requestId =
		input.requestId ??
		createStablePlanningId("reference-request", {
			kind: input.kind,
			requestedName,
			requestKey: input.requestKey ?? null,
			context: input.context ?? {},
		});

	return {
		version: PLANNING_SCHEMA_VERSION,
		requestId,
		kind: input.kind,
		requestedName,
		explicitCandidate: input.explicitCandidate
			? cloneSerializable(input.explicitCandidate)
			: null,
		forbidden: input.forbidden
			? {
					version: PLANNING_SCHEMA_VERSION,
					code: input.forbidden.code,
					reason: input.forbidden.reason,
					reviewBlockerId: input.forbidden.reviewBlockerId ?? null,
					evidence: (input.forbidden.evidence ?? []).map((entry) =>
						cloneSerializable(entry),
					),
				}
			: null,
		context: cloneSerializable(input.context ?? {}),
	};
}

function candidateIssue(
	request: MechanicalReferenceRequestV1,
	code: string,
	message: string,
): PlanIssue {
	return createPlanIssue({
		severity: "strict",
		code,
		message,
		path: `references.${request.requestId}`,
		evidence: request.explicitCandidate?.evidence ?? [],
	});
}

/**
 * Resolve only an explicitly supplied candidate. A name is descriptive input,
 * never evidence of a persisted or canonical ID.
 */
export function resolveMechanicalReferenceV1(
	input: MechanicalReferenceRequestInput | MechanicalReferenceRequestV1,
): MechanicalReferenceResolutionV1 {
	const request =
		"version" in input
			? cloneSerializable(input)
			: createMechanicalReferenceRequestV1(input);

	if (request.forbidden) {
		const issue = request.forbidden.reviewBlockerId
			? createPlanIssue({
					severity: "review-blocked",
					code: request.forbidden.code,
					message: request.forbidden.reason,
					path: `references.${request.requestId}`,
					reviewBlockerId: request.forbidden.reviewBlockerId,
					evidence: request.forbidden.evidence,
				})
			: createPlanIssue({
					severity: "strict",
					code: request.forbidden.code,
					message: request.forbidden.reason,
					path: `references.${request.requestId}`,
					evidence: request.forbidden.evidence,
				});
		return {
			version: PLANNING_SCHEMA_VERSION,
			status: "forbidden",
			request,
			reference: null,
			issues: [issue],
		};
	}

	const candidate = request.explicitCandidate;
	if (!candidate) {
		const label = request.requestedName
			? `“${request.requestedName}”`
			: `the requested ${request.kind} reference`;
		return {
			version: PLANNING_SCHEMA_VERSION,
			status: "unresolved",
			request,
			reference: null,
			issues: [
				createPlanIssue({
					severity: "manual",
					code: "reference-explicit-candidate-required",
					message: `${label} has no explicit identity candidate`,
					path: `references.${request.requestId}`,
					instructions:
						"Supply a candidate with an explicit ID; do not derive an ID from the display name.",
				}),
			],
		};
	}

	if (candidate.kind !== request.kind) {
		return {
			version: PLANNING_SCHEMA_VERSION,
			status: "unresolved",
			request,
			reference: null,
			issues: [
				candidateIssue(
					request,
					"reference-kind-mismatch",
					`Explicit ${candidate.kind} candidate cannot satisfy a ${request.kind} request`,
				),
			],
		};
	}

	if (candidate.id.trim().length === 0) {
		return {
			version: PLANNING_SCHEMA_VERSION,
			status: "unresolved",
			request,
			reference: null,
			issues: [
				candidateIssue(
					request,
					"reference-id-empty",
					"Explicit reference candidate must carry a non-empty ID",
				),
			],
		};
	}

	return {
		version: PLANNING_SCHEMA_VERSION,
		status: "resolved",
		request,
		reference: cloneSerializable(candidate),
		issues: [],
	};
}

export function resolveMechanicalReferencesV1(
	inputs: readonly (
		| MechanicalReferenceRequestInput
		| MechanicalReferenceRequestV1
	)[],
): MechanicalReferenceResolutionV1[] {
	return inputs.map(resolveMechanicalReferenceV1);
}

export function toUnresolvedMechanicalReferenceV1(
	resolution: MechanicalReferenceResolutionV1,
): UnresolvedMechanicalReferenceV1 | null {
	if (resolution.status === "resolved") return null;
	return {
		version: PLANNING_SCHEMA_VERSION,
		requestId: resolution.request.requestId,
		kind: resolution.request.kind,
		requestedName: resolution.request.requestedName,
		candidateId: null,
		reason:
			resolution.status === "forbidden"
				? (resolution.request.forbidden?.reason ?? "Reference is forbidden")
				: "No valid explicit identity candidate was supplied",
		issues: resolution.issues.map((issue) => cloneSerializable(issue)),
	};
}

/** Concise alias for callers that do not encode the schema version in names. */
export const resolveMechanicalReference = resolveMechanicalReferenceV1;
