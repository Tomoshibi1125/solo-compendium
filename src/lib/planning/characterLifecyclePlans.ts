import {
	blockingPlanIssues,
	cloneSerializable,
	createPlanIssue,
	createStablePlanningId,
	type MechanicalReference,
	PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	type SerializableRecord,
	type SourceEvidenceV1,
} from "./contracts";

export const CHARACTER_CREATION_PLAN_VERSION = 1 as const;
export const LEVEL_TRANSITION_PLAN_VERSION = 1 as const;

export interface LifecycleProvenanceV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	ruleId: string;
	sourceLevel: number;
	reference: MechanicalReference | null;
	sourceEvidence: SourceEvidenceV1[];
}

export type CharacterGrantType =
	| "feature"
	| "feat"
	| "ability-increase"
	| "proficiency"
	| "resource"
	| "spell"
	| "power"
	| "technique"
	| "equipment"
	| "custom";

export type LifecycleDisposition = "automatic" | "manual" | "review-blocked";

export interface OrderedCharacterGrantV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	grantId: string;
	order: number;
	level: number;
	grantType: CharacterGrantType;
	payload: SerializableRecord;
	disposition: LifecycleDisposition;
	instructions: string | null;
	reviewBlockerId: string | null;
	provenance: LifecycleProvenanceV1;
}

export interface OrderedCharacterGrantInputV1 {
	grantId: string;
	order: number;
	level: number;
	grantType: CharacterGrantType;
	payload?: SerializableRecord;
	disposition?: LifecycleDisposition;
	instructions?: string | null;
	reviewBlockerId?: string | null;
	provenance: LifecycleProvenanceV1;
}

export interface CharacterChoiceOptionV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	optionId: string;
	label: string;
	payload: SerializableRecord;
}

export interface CharacterChoiceOptionInputV1 {
	optionId: string;
	label: string;
	payload?: SerializableRecord;
}

export interface CharacterChoiceRequirementInputV1 {
	choiceId: string;
	order: number;
	level: number;
	count: number;
	prompt: string;
	options: readonly CharacterChoiceOptionInputV1[];
	provenance: LifecycleProvenanceV1;
}

export interface RecordedCharacterChoiceV1 {
	choiceId: string;
	selectedOptionIds: readonly string[];
	provenance: SourceEvidenceV1[];
}

/** Explicit history retained when no authored requirement is available. */
export interface UnmatchedRecordedCharacterChoiceV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	status: "uninterpreted";
	choiceId: string;
	selectedOptionIds: string[];
	provenance: SourceEvidenceV1[];
}

export type CharacterChoicePlanStatus =
	| "selected"
	| "required"
	| "historical-unresolved"
	| "invalid";

export interface CharacterChoicePlanEntryV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	choiceId: string;
	order: number;
	level: number;
	count: number;
	prompt: string;
	options: CharacterChoiceOptionV1[];
	selectedOptionIds: string[];
	status: CharacterChoicePlanStatus;
	historical: boolean;
	provenance: LifecycleProvenanceV1;
	selectionEvidence: SourceEvidenceV1[];
	issueIds: string[];
}

interface CharacterLifecyclePlanBaseV1 {
	characterId: string;
	orderedGrants: OrderedCharacterGrantV1[];
	choices: CharacterChoicePlanEntryV1[];
	unmatchedRecordedChoices: UnmatchedRecordedCharacterChoiceV1[];
	issues: PlanIssue[];
	blockers: PlanIssue[];
	canApply: boolean;
}

export interface CharacterCreationPlanV1 extends CharacterLifecyclePlanBaseV1 {
	version: typeof CHARACTER_CREATION_PLAN_VERSION;
	kind: "character-creation-plan";
	planId: string;
	targetLevel: number;
}

export interface LevelTransitionPlanV1 extends CharacterLifecyclePlanBaseV1 {
	version: typeof LEVEL_TRANSITION_PLAN_VERSION;
	kind: "level-transition-plan";
	planId: string;
	fromLevel: number;
	toLevel: number;
}

export interface CharacterCreationPlanInputV1 {
	characterId: string;
	/** `targetLevel` is preferred; `level` is accepted for adapter convenience. */
	targetLevel?: number;
	level?: number;
	grants?: readonly OrderedCharacterGrantInputV1[];
	choiceRequirements?: readonly CharacterChoiceRequirementInputV1[];
	recordedChoices?: readonly RecordedCharacterChoiceV1[];
	issues?: readonly PlanIssue[];
}

export interface LevelTransitionPlanInputV1 {
	characterId: string;
	fromLevel: number;
	toLevel: number;
	grants?: readonly OrderedCharacterGrantInputV1[];
	choiceRequirements?: readonly CharacterChoiceRequirementInputV1[];
	recordedChoices?: readonly RecordedCharacterChoiceV1[];
	issues?: readonly PlanIssue[];
}

function levelInRange(level: number): boolean {
	return Number.isInteger(level) && level >= 1 && level <= 20;
}

function normalizeGrant(
	grant: OrderedCharacterGrantInputV1,
): OrderedCharacterGrantV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		grantId: grant.grantId,
		order: grant.order,
		level: grant.level,
		grantType: grant.grantType,
		payload: cloneSerializable(grant.payload ?? {}),
		disposition: grant.disposition ?? "automatic",
		instructions: grant.instructions ?? null,
		reviewBlockerId: grant.reviewBlockerId ?? null,
		provenance: cloneSerializable(grant.provenance),
	};
}

function grantSort(
	left: OrderedCharacterGrantV1,
	right: OrderedCharacterGrantV1,
): number {
	return (
		left.level - right.level ||
		left.order - right.order ||
		left.grantId.localeCompare(right.grantId)
	);
}

function duplicateValues(values: readonly string[]): string[] {
	const seen = new Set<string>();
	const duplicates = new Set<string>();
	for (const value of values) {
		if (seen.has(value)) duplicates.add(value);
		seen.add(value);
	}
	return [...duplicates].sort((left, right) => left.localeCompare(right));
}

function grantIssues(
	grants: readonly OrderedCharacterGrantV1[],
	includeDisposition: (grant: OrderedCharacterGrantV1) => boolean = () => true,
): PlanIssue[] {
	const issues: PlanIssue[] = [];
	for (const grantId of duplicateValues(grants.map((grant) => grant.grantId))) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "lifecycle-duplicate-grant",
				message: `Grant ID ${grantId} appears more than once`,
				path: `grants.${grantId}`,
			}),
		);
	}
	for (const grant of grants) {
		if (!grant.grantId.trim()) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-grant-id-required",
					message: "Every lifecycle grant requires a stable grant ID",
					path: "grants",
				}),
			);
		}
		if (!Number.isInteger(grant.order) || grant.order < 0) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-grant-order-invalid",
					message: `Grant ${grant.grantId} must have a non-negative integer order`,
					path: `grants.${grant.grantId}.order`,
				}),
			);
		}
		if (!levelInRange(grant.level)) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-grant-level-out-of-range",
					message: `Grant ${grant.grantId} level must be from 1 through 20`,
					path: `grants.${grant.grantId}.level`,
				}),
			);
		}
		if (!grant.provenance.ruleId.trim()) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-grant-provenance-required",
					message: `Grant ${grant.grantId} has no source rule identity`,
					path: `grants.${grant.grantId}.provenance.ruleId`,
				}),
			);
		}
		if (!includeDisposition(grant)) continue;
		if (grant.disposition === "manual") {
			issues.push(
				createPlanIssue({
					severity: "manual",
					code: "lifecycle-grant-manual",
					message: `Grant ${grant.grantId} requires manual application`,
					path: `grants.${grant.grantId}`,
					instructions: grant.instructions,
					evidence: grant.provenance.sourceEvidence,
				}),
			);
		}
		if (grant.disposition === "review-blocked") {
			issues.push(
				createPlanIssue({
					severity: "review-blocked",
					code: "lifecycle-grant-review-blocked",
					message: `Grant ${grant.grantId} is blocked for review`,
					path: `grants.${grant.grantId}`,
					reviewBlockerId:
						grant.reviewBlockerId ??
						createStablePlanningId("review-blocker", {
							grantId: grant.grantId,
							ruleId: grant.provenance.ruleId,
						}),
					instructions: grant.instructions,
					evidence: grant.provenance.sourceEvidence,
				}),
			);
		}
	}
	return issues;
}

function normalizeChoiceOption(
	option: CharacterChoiceOptionInputV1,
): CharacterChoiceOptionV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		optionId: option.optionId,
		label: option.label,
		payload: cloneSerializable(option.payload ?? {}),
	};
}

function choicePlan(input: {
	requirements: readonly CharacterChoiceRequirementInputV1[];
	recordedChoices: readonly RecordedCharacterChoiceV1[];
	historicalThroughLevel: number;
	include: (level: number) => boolean;
}): {
	choices: CharacterChoicePlanEntryV1[];
	unmatchedRecordedChoices: UnmatchedRecordedCharacterChoiceV1[];
	issues: PlanIssue[];
} {
	const issues: PlanIssue[] = [];
	const choices: CharacterChoicePlanEntryV1[] = [];
	const recordedByChoice = new Map<string, RecordedCharacterChoiceV1[]>();
	for (const recorded of input.recordedChoices) {
		const matches = recordedByChoice.get(recorded.choiceId) ?? [];
		matches.push(recorded);
		recordedByChoice.set(recorded.choiceId, matches);
		if (!recorded.choiceId.trim()) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-recorded-choice-id-required",
					message: "Recorded choices require a stable choice ID",
					path: "recordedChoices",
					evidence: recorded.provenance,
				}),
			);
		}
	}

	for (const duplicate of duplicateValues(
		input.requirements.map((requirement) => requirement.choiceId),
	)) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "lifecycle-duplicate-choice-requirement",
				message: `Choice requirement ${duplicate} appears more than once`,
				path: `choices.${duplicate}`,
			}),
		);
	}
	for (const duplicate of duplicateValues(
		input.recordedChoices.map((recorded) => recorded.choiceId),
	)) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "lifecycle-duplicate-recorded-choice",
				message: `Choice ${duplicate} has multiple recorded selections`,
				path: `recordedChoices.${duplicate}`,
			}),
		);
	}

	const requirements = [...input.requirements]
		.filter((requirement) => input.include(requirement.level))
		.sort(
			(left, right) =>
				left.level - right.level ||
				left.order - right.order ||
				left.choiceId.localeCompare(right.choiceId),
		);

	for (const requirement of requirements) {
		const entryIssues: PlanIssue[] = [];
		const historical = requirement.level <= input.historicalThroughLevel;
		const recordedMatches = recordedByChoice.get(requirement.choiceId) ?? [];
		const recorded = recordedMatches.length === 1 ? recordedMatches[0] : null;
		const options = requirement.options
			.map(normalizeChoiceOption)
			.sort(
				(left, right) =>
					left.optionId.localeCompare(right.optionId) ||
					left.label.localeCompare(right.label),
			);
		let status: CharacterChoicePlanStatus = "selected";

		if (!requirement.choiceId.trim()) {
			entryIssues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-choice-id-required",
					message: "Choice requirements require a stable choice ID",
					path: "choices",
				}),
			);
		}
		if (!Number.isInteger(requirement.order) || requirement.order < 0) {
			entryIssues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-choice-order-invalid",
					message: `Choice ${requirement.choiceId} must have a non-negative integer order`,
					path: `choices.${requirement.choiceId}.order`,
				}),
			);
		}
		if (!levelInRange(requirement.level)) {
			entryIssues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-choice-level-out-of-range",
					message: `Choice ${requirement.choiceId} level must be from 1 through 20`,
					path: `choices.${requirement.choiceId}.level`,
				}),
			);
		}
		if (
			!requirement.provenance.ruleId.trim() ||
			!levelInRange(requirement.provenance.sourceLevel) ||
			requirement.provenance.sourceLevel !== requirement.level
		) {
			entryIssues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-choice-provenance-invalid",
					message: `Choice ${requirement.choiceId} requires source provenance for its authored level`,
					path: `choices.${requirement.choiceId}.provenance`,
					evidence: requirement.provenance.sourceEvidence,
				}),
			);
		}
		if (!Number.isInteger(requirement.count) || requirement.count < 1) {
			entryIssues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-choice-count-invalid",
					message: `Choice ${requirement.choiceId} requires a positive integer count`,
					path: `choices.${requirement.choiceId}.count`,
				}),
			);
		}
		if (options.length < requirement.count) {
			entryIssues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-choice-options-insufficient",
					message: `Choice ${requirement.choiceId} has fewer options than its required count`,
					path: `choices.${requirement.choiceId}.options`,
				}),
			);
		}
		for (const option of options) {
			if (!option.optionId.trim()) {
				entryIssues.push(
					createPlanIssue({
						severity: "strict",
						code: "lifecycle-choice-option-id-required",
						message: `Choice ${requirement.choiceId} has an option without a stable ID`,
						path: `choices.${requirement.choiceId}.options`,
					}),
				);
			}
		}
		for (const optionId of duplicateValues(
			options.map((option) => option.optionId),
		)) {
			entryIssues.push(
				createPlanIssue({
					severity: "strict",
					code: "lifecycle-duplicate-choice-option",
					message: `Choice ${requirement.choiceId} repeats option ${optionId}`,
					path: `choices.${requirement.choiceId}.options.${optionId}`,
				}),
			);
		}

		if (recordedMatches.length > 1) {
			status = "invalid";
		} else if (!recorded) {
			status = historical ? "historical-unresolved" : "required";
			entryIssues.push(
				historical
					? createPlanIssue({
							severity: "review-blocked",
							code: "lifecycle-historical-choice-unresolved",
							message: `Historical choice ${requirement.choiceId} has no recorded selection`,
							path: `choices.${requirement.choiceId}`,
							reviewBlockerId: createStablePlanningId(
								"historical-choice-blocker",
								{
									choiceId: requirement.choiceId,
									level: requirement.level,
								},
							),
							instructions:
								"Supply an actual historical choice record; do not infer one from current statistics.",
							evidence: requirement.provenance.sourceEvidence,
						})
					: createPlanIssue({
							severity: "manual",
							code: "lifecycle-choice-required",
							message: `Choice ${requirement.choiceId} requires an explicit selection`,
							path: `choices.${requirement.choiceId}`,
							instructions: requirement.prompt,
							evidence: requirement.provenance.sourceEvidence,
						}),
			);
		} else {
			const duplicateSelections = duplicateValues(recorded.selectedOptionIds);
			const optionIds = new Set(options.map((option) => option.optionId));
			const unknownSelections = recorded.selectedOptionIds.filter(
				(optionId) => !optionIds.has(optionId),
			);
			if (
				recorded.selectedOptionIds.length !== requirement.count ||
				duplicateSelections.length > 0 ||
				unknownSelections.length > 0
			) {
				status = "invalid";
				entryIssues.push(
					createPlanIssue({
						severity: "strict",
						code: "lifecycle-recorded-choice-invalid",
						message: `Recorded selection for ${requirement.choiceId} does not satisfy its authored options and count`,
						path: `recordedChoices.${requirement.choiceId}`,
						evidence: recorded.provenance,
					}),
				);
			}
		}

		if (entryIssues.some((issue) => issue.severity === "strict")) {
			status = "invalid";
		}
		issues.push(...entryIssues);
		choices.push({
			version: PLANNING_SCHEMA_VERSION,
			choiceId: requirement.choiceId,
			order: requirement.order,
			level: requirement.level,
			count: requirement.count,
			prompt: requirement.prompt,
			options,
			selectedOptionIds: recorded ? [...recorded.selectedOptionIds] : [],
			status,
			historical,
			provenance: cloneSerializable(requirement.provenance),
			selectionEvidence: recorded
				? recorded.provenance.map((entry) => cloneSerializable(entry))
				: [],
			issueIds: entryIssues.map((issue) => issue.issueId).sort(),
		});
	}

	const activeRequirementIds = new Set(
		requirements.map((requirement) => requirement.choiceId),
	);
	const unmatchedRecordedChoices = input.recordedChoices
		.filter((recorded) => !activeRequirementIds.has(recorded.choiceId))
		.map(
			(recorded): UnmatchedRecordedCharacterChoiceV1 => ({
				version: PLANNING_SCHEMA_VERSION,
				status: "uninterpreted",
				choiceId: recorded.choiceId,
				selectedOptionIds: [...recorded.selectedOptionIds],
				provenance: recorded.provenance.map((entry) =>
					cloneSerializable(entry),
				),
			}),
		)
		.sort(
			(left, right) =>
				left.choiceId.localeCompare(right.choiceId) ||
				left.selectedOptionIds
					.join("\u0000")
					.localeCompare(right.selectedOptionIds.join("\u0000")),
		);
	for (const recorded of unmatchedRecordedChoices) {
		issues.push(
			createPlanIssue({
				severity: "warning",
				code: "lifecycle-recorded-choice-without-requirement",
				message: `Recorded choice ${recorded.choiceId} has no active supplied requirement and was preserved without interpretation`,
				path: `recordedChoices.${recorded.choiceId}`,
				evidence: recorded.provenance,
			}),
		);
	}

	return { choices, unmatchedRecordedChoices, issues };
}

function finalIssues(issues: readonly PlanIssue[]): PlanIssue[] {
	const unique = new Map(
		issues.map((issue) => [issue.issueId, cloneSerializable(issue)]),
	);
	return [...unique.values()].sort((left, right) =>
		left.issueId.localeCompare(right.issueId),
	);
}

/** Build a level-1 creation plan without applying grants or choosing options. */
export function buildCharacterCreationPlanV1(
	input: CharacterCreationPlanInputV1,
): CharacterCreationPlanV1 {
	const targetLevel = input.targetLevel ?? input.level ?? 1;
	const allGrants = (input.grants ?? []).map(normalizeGrant).sort(grantSort);
	const issues: PlanIssue[] = [
		...(input.issues ?? []).map((issue) => cloneSerializable(issue)),
	];
	if (!input.characterId.trim()) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "creation-character-id-required",
				message:
					"Character creation planning requires an explicit character ID",
				path: "characterId",
			}),
		);
	}
	if (targetLevel !== 1) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "creation-level-must-be-one",
				message: "A CharacterCreationPlanV1 must target level 1",
				path: "targetLevel",
			}),
		);
	}
	for (const grant of allGrants) {
		if (grant.level !== 1) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "creation-grant-level-must-be-one",
					message: `Creation grant ${grant.grantId} must be a level-1 grant`,
					path: `grants.${grant.grantId}.level`,
				}),
			);
		}
	}
	issues.push(...grantIssues(allGrants));
	const choiceResult = choicePlan({
		requirements: input.choiceRequirements ?? [],
		recordedChoices: input.recordedChoices ?? [],
		historicalThroughLevel: 0,
		include: () => true,
	});
	for (const choice of choiceResult.choices) {
		if (choice.level !== 1) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "creation-choice-level-must-be-one",
					message: `Creation choice ${choice.choiceId} must be a level-1 choice`,
					path: `choices.${choice.choiceId}.level`,
				}),
			);
		}
	}
	issues.push(...choiceResult.issues);
	const normalizedIssues = finalIssues(issues);
	const blockers = blockingPlanIssues(normalizedIssues);
	return {
		version: CHARACTER_CREATION_PLAN_VERSION,
		kind: "character-creation-plan",
		planId: createStablePlanningId("character-creation-plan", {
			characterId: input.characterId,
			targetLevel,
			grants: allGrants,
			choices: choiceResult.choices,
			unmatchedRecordedChoices: choiceResult.unmatchedRecordedChoices,
		}),
		characterId: input.characterId,
		targetLevel,
		orderedGrants: allGrants,
		choices: choiceResult.choices,
		unmatchedRecordedChoices: choiceResult.unmatchedRecordedChoices,
		issues: normalizedIssues,
		blockers,
		canApply: blockers.length === 0,
	};
}

/**
 * Build a 1–20 transition. Missing past choices become review blockers; the
 * builder never reconstructs a choice from current scores or other state.
 */
export function buildLevelTransitionPlanV1(
	input: LevelTransitionPlanInputV1,
): LevelTransitionPlanV1 {
	const allGrants = (input.grants ?? []).map(normalizeGrant).sort(grantSort);
	const orderedGrants = allGrants.filter(
		(grant) => grant.level > input.fromLevel && grant.level <= input.toLevel,
	);
	const issues: PlanIssue[] = [
		...(input.issues ?? []).map((issue) => cloneSerializable(issue)),
	];
	if (!input.characterId.trim()) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "transition-character-id-required",
				message: "Level transition planning requires an explicit character ID",
				path: "characterId",
			}),
		);
	}
	if (!levelInRange(input.fromLevel) || !levelInRange(input.toLevel)) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "transition-level-out-of-range",
				message: "Level transitions must remain within levels 1 through 20",
				path: "levels",
			}),
		);
	}
	if (input.toLevel <= input.fromLevel) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "transition-level-order-invalid",
				message: "A level transition must increase the character level",
				path: "toLevel",
			}),
		);
	}
	issues.push(
		...grantIssues(
			allGrants,
			(grant) => grant.level > input.fromLevel && grant.level <= input.toLevel,
		),
	);
	for (const grant of allGrants) {
		if (grant.level <= input.fromLevel || grant.level > input.toLevel) {
			issues.push(
				createPlanIssue({
					severity: "warning",
					code: "transition-grant-outside-range",
					message: `Grant ${grant.grantId} is outside this transition and will not be applied`,
					path: `grants.${grant.grantId}`,
					evidence: grant.provenance.sourceEvidence,
				}),
			);
		}
	}
	const choiceResult = choicePlan({
		requirements: input.choiceRequirements ?? [],
		recordedChoices: input.recordedChoices ?? [],
		historicalThroughLevel: input.fromLevel,
		include: (level) => !levelInRange(level) || level <= input.toLevel,
	});
	issues.push(...choiceResult.issues);
	const normalizedIssues = finalIssues(issues);
	const blockers = blockingPlanIssues(normalizedIssues);
	return {
		version: LEVEL_TRANSITION_PLAN_VERSION,
		kind: "level-transition-plan",
		planId: createStablePlanningId("level-transition-plan", {
			characterId: input.characterId,
			fromLevel: input.fromLevel,
			toLevel: input.toLevel,
			grants: orderedGrants,
			choices: choiceResult.choices,
			unmatchedRecordedChoices: choiceResult.unmatchedRecordedChoices,
		}),
		characterId: input.characterId,
		fromLevel: input.fromLevel,
		toLevel: input.toLevel,
		orderedGrants,
		choices: choiceResult.choices,
		unmatchedRecordedChoices: choiceResult.unmatchedRecordedChoices,
		issues: normalizedIssues,
		blockers,
		canApply: blockers.length === 0,
	};
}

export const buildCharacterCreationPlan = buildCharacterCreationPlanV1;
export const buildLevelTransitionPlan = buildLevelTransitionPlanV1;
