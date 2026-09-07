import {
	type ActionResolutionContext,
	type ActionResolutionPayload,
	type ActionStateChangeIntent,
	type ResolveActionResult,
	resolveAction,
} from "@/lib/actionResolution";
import {
	applyResourceRest,
	type CharacterResources,
} from "@/lib/characterResources";
import {
	advanceConditionsForRest,
	breakConcentration,
	CONDITION_LIFECYCLE_VERSION,
	type ConditionDurationV1,
	type ConditionEntry,
	isConditionDurationV1,
	isConditionEntry,
} from "@/lib/conditionSystem";
import {
	blockingPlanIssues,
	cloneSerializable,
	createPlanIssue,
	createStableOperationId,
	createStablePlanningId,
	isSerializableValue,
	PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	presentExpectedBefore,
	type SerializableRecord,
	type SerializableValue,
	type SourceEvidenceV1,
	type StablePlanOperationV1,
} from "./contracts";
import type { CharacterMechanicalSnapshotV1 } from "./mechanicalSnapshot";

export const COMBAT_ACTION_PLAN_VERSION = 1 as const;
export const REST_ACTION_PLAN_VERSION = 1 as const;

export type ActionPlanOperationKind =
	| "hit-points"
	| "temporary-hit-points"
	| "resource-cost"
	| "resource-recovery"
	| "condition"
	| "condition-lifecycle"
	| "concentration"
	| "death-saves"
	| "hit-dice";

export interface ActionPlanOperationV1
	extends StablePlanOperationV1<SerializableValue, SerializableValue> {
	kind: ActionPlanOperationKind;
	targetId: string;
	path: string;
	description: string;
	intent: SerializableRecord;
}

export interface RequiredActionChoiceV1 {
	version: typeof PLANNING_SCHEMA_VERSION;
	choiceId: string;
	kind: "state" | "duration" | "action-economy" | "rest" | "manual";
	prompt: string;
	options: Array<{ value: string; label: string }>;
	selection: SerializableValue | null;
	resolved: boolean;
}

export interface CombatActionPlanInputV1 {
	snapshot: CharacterMechanicalSnapshotV1;
	payload: ActionResolutionPayload;
	context: ActionResolutionContext;
	/** Supply a prior preview/outcome/application to avoid rolling twice. */
	resolvedAction?: ResolveActionResult;
	conditionDurationChoices?: Readonly<Record<string, ConditionDurationV1>>;
	actionEconomyChoice?: string | null;
	sourceEvidence?: readonly SourceEvidenceV1[];
}

export interface CombatActionPlanV1 {
	version: typeof COMBAT_ACTION_PLAN_VERSION;
	kind: "combat-action-plan";
	planId: string;
	snapshotId: string;
	characterId: string;
	payloadVersion: 1 | 2;
	resolution: ResolveActionResult;
	operations: ActionPlanOperationV1[];
	requiredChoices: RequiredActionChoiceV1[];
	resourceCosts: Array<{
		resourceId: string;
		amount: number;
		expectedBefore: number | null;
	}>;
	temporaryHitPoints: {
		before: number;
		after: number;
		delta: number;
	} | null;
	concentration: {
		before: string | null;
		after: string | null;
		operation: "start" | "replace" | "none";
	} | null;
	issues: PlanIssue[];
	blockers: PlanIssue[];
	canApply: boolean;
}

export type ShortRestHitDiceChoiceV1 =
	| { choice: "none" }
	| {
			choice: "spend";
			hitDiceSpent: number;
			hitPointsRecovered: number;
	  };

export interface RestActionPlanInputV1 {
	snapshot: CharacterMechanicalSnapshotV1;
	restType: "short" | "long";
	resources: CharacterResources;
	conditions?: readonly ConditionEntry[];
	currentHitPoints?: number | null;
	currentHitDice?: number | null;
	shortRestHitDice?: ShortRestHitDiceChoiceV1;
	concentrationId?: string | null;
	/** Required when a concentration identity is active. */
	breakConcentration?: boolean;
	sourceEvidence?: readonly SourceEvidenceV1[];
}

export interface RestActionPlanV1 {
	version: typeof REST_ACTION_PLAN_VERSION;
	kind: "rest-action-plan";
	planId: string;
	snapshotId: string;
	characterId: string;
	restType: "short" | "long";
	operations: ActionPlanOperationV1[];
	requiredChoices: RequiredActionChoiceV1[];
	resourcesBefore: CharacterResources;
	resourcesAfter: CharacterResources;
	conditionsBefore: ConditionEntry[];
	conditionsAfter: ConditionEntry[];
	concentration: {
		before: string | null;
		after: string | null;
		broken: boolean;
	};
	issues: PlanIssue[];
	blockers: PlanIssue[];
	canApply: boolean;
}

function jsonClone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

function serializable(value: unknown): SerializableValue {
	const cloned = jsonClone(value);
	if (!isSerializableValue(cloned)) {
		throw new TypeError("Action plans require finite JSON-serializable values");
	}
	return cloned;
}

function serializableRecord(value: unknown): SerializableRecord {
	const cloned = serializable(value);
	if (cloned === null || Array.isArray(cloned) || typeof cloned !== "object") {
		throw new TypeError("Action plan operation intent must be an object");
	}
	return cloned;
}

function makeOperation(input: {
	kind: ActionPlanOperationKind;
	targetId: string;
	path: string;
	description: string;
	before: unknown;
	after: unknown;
	intent: unknown;
	identity?: unknown;
	sourceEvidence?: readonly SourceEvidenceV1[];
}): ActionPlanOperationV1 {
	const before = serializable(input.before);
	const after = serializable(input.after);
	const intent = serializableRecord(input.intent);
	const operationSeed = {
		kind: input.kind,
		targetId: input.targetId,
		path: input.path,
		before,
		after,
		intent,
		...(input.identity === undefined
			? {}
			: { identity: serializable(input.identity) }),
	};
	return {
		version: PLANNING_SCHEMA_VERSION,
		operationId: createStableOperationId(operationSeed),
		kind: input.kind,
		targetId: input.targetId,
		path: input.path,
		description: input.description,
		expectedBefore: presentExpectedBefore(before),
		after: presentExpectedBefore(after),
		intent,
		sourceEvidence: (input.sourceEvidence ?? []).map((entry) =>
			cloneSerializable(entry),
		),
	};
}

function requiredChoice(input: {
	choiceId: string;
	kind: RequiredActionChoiceV1["kind"];
	prompt: string;
	options?: Array<{ value: string; label: string }>;
	selection?: SerializableValue | null;
}): RequiredActionChoiceV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		choiceId: input.choiceId,
		kind: input.kind,
		prompt: input.prompt,
		options: input.options ?? [],
		selection: input.selection ?? null,
		resolved: input.selection !== undefined && input.selection !== null,
	};
}

function choiceIssue(choice: RequiredActionChoiceV1): PlanIssue | null {
	if (choice.resolved) return null;
	return createPlanIssue({
		severity: "manual",
		code: "action-plan-choice-required",
		message: choice.prompt,
		path: `requiredChoices.${choice.choiceId}`,
		instructions: "Provide an explicit choice; the planner will not guess.",
	});
}

function snapshotIssues(snapshot: CharacterMechanicalSnapshotV1): PlanIssue[] {
	const issues = snapshot.issues.map((issue) => cloneSerializable(issue));
	for (const unresolved of snapshot.references.unresolved) {
		issues.push(
			createPlanIssue({
				severity: "manual",
				code: "action-plan-unresolved-reference",
				message: `Resolve mechanical reference ${unresolved.requestId} before applying the plan.`,
				path: `snapshot.references.unresolved.${unresolved.requestId}`,
				instructions: "Resolve the referenced canonical or campaign identity.",
			}),
		);
	}
	return issues;
}

function operationForCombatIntent(
	intent: ActionStateChangeIntent,
	sourceEvidence: readonly SourceEvidenceV1[],
	intentIndex: number,
): ActionPlanOperationV1 {
	const makeCombatOperation = (
		input: Omit<Parameters<typeof makeOperation>[0], "identity">,
	) =>
		makeOperation({
			...input,
			identity: { stateChangeIntentIndex: intentIndex },
		});

	switch (intent.type) {
		case "hit-points":
			return makeCombatOperation({
				kind: "hit-points",
				targetId: intent.targetId,
				path: "hitPoints",
				description: "Apply resolved hit-point change.",
				before: intent.expectedBefore,
				after: intent.after,
				intent,
				sourceEvidence,
			});
		case "temporary-hit-points":
			return makeCombatOperation({
				kind: "temporary-hit-points",
				targetId: intent.targetId,
				path: "temporaryHitPoints",
				description: "Apply resolved temporary hit-point change.",
				before: intent.expectedBefore,
				after: intent.after,
				intent,
				sourceEvidence,
			});
		case "resource-cost":
			return makeCombatOperation({
				kind: "resource-cost",
				targetId: intent.actorId,
				path: `resources.${intent.resourceId}.current`,
				description: `Spend ${intent.amount} ${intent.resourceId}.`,
				before: intent.expectedBefore,
				after: intent.after,
				intent,
				sourceEvidence,
			});
		case "condition":
			return makeCombatOperation({
				kind: "condition",
				targetId: intent.targetId,
				path: `conditions.${intent.application.conditionId}`,
				description: `Apply ${intent.application.conditionId} on ${intent.gate}.`,
				before: { state: "not-observed" },
				after: { application: intent.application },
				intent,
				sourceEvidence,
			});
		case "concentration":
			return makeCombatOperation({
				kind: "concentration",
				targetId: intent.actorId,
				path: "concentrationId",
				description: `${intent.operation} concentration.`,
				before: intent.previousConcentrationId,
				after: intent.concentrationId,
				intent,
				sourceEvidence,
			});
	}
}

interface ConditionDurationChoiceDescriptor {
	intentIndex: number;
	conditionId: string;
	choiceId: string;
	selection?: ConditionDurationV1;
}

function conditionDurationChoiceDescriptors(
	resolution: ResolveActionResult,
	choices: CombatActionPlanInputV1["conditionDurationChoices"],
): ConditionDurationChoiceDescriptor[] {
	const manualIntents = resolution.preview.payload.conditionIntents
		.map((intent, intentIndex) => ({ intent, intentIndex }))
		.filter(({ intent }) => intent.duration.unit === "manual");
	const totals = new Map<string, number>();
	for (const { intent } of manualIntents) {
		totals.set(intent.conditionId, (totals.get(intent.conditionId) ?? 0) + 1);
	}
	const occurrences = new Map<string, number>();
	return manualIntents.map(({ intent, intentIndex }) => {
		const occurrence = (occurrences.get(intent.conditionId) ?? 0) + 1;
		occurrences.set(intent.conditionId, occurrence);
		const duplicate = (totals.get(intent.conditionId) ?? 0) > 1;
		const choiceId = duplicate
			? `condition-duration:${intent.conditionId}:${occurrence}`
			: `condition-duration:${intent.conditionId}`;
		const candidate =
			choices?.[choiceId] ??
			(!duplicate ? choices?.[intent.conditionId] : undefined);
		const selection =
			candidate &&
			candidate.unit !== "manual" &&
			isConditionDurationV1(candidate)
				? { ...candidate }
				: undefined;
		return {
			intentIndex,
			conditionId: intent.conditionId,
			choiceId,
			selection,
		};
	});
}

function applyConditionDurationChoices(
	resolution: ResolveActionResult,
	descriptors: readonly ConditionDurationChoiceDescriptor[],
): ResolveActionResult {
	const durationByIntent = new Map(
		descriptors.flatMap((descriptor) =>
			descriptor.selection
				? ([[descriptor.intentIndex, descriptor.selection]] as const)
				: [],
		),
	);
	if (durationByIntent.size === 0) return resolution;

	const conditionIntents = resolution.preview.payload.conditionIntents.map(
		(intent, index) => {
			const duration = durationByIntent.get(index);
			return duration ? { ...intent, duration: { ...duration } } : intent;
		},
	);
	const conditions = resolution.application.conditions.map(
		(decision, index) => {
			const duration = durationByIntent.get(index);
			return duration && decision.application
				? {
						...decision,
						application: {
							...decision.application,
							duration: { ...duration },
						},
					}
				: decision;
		},
	);
	const applications = conditions.flatMap((decision) =>
		decision.application ? [decision.application] : [],
	);
	let applicationIndex = 0;
	const stateChangeIntents = resolution.stateChangeIntents.map((intent) => {
		if (intent.type !== "condition") return intent;
		const application = applications[applicationIndex++];
		return application ? { ...intent, application } : intent;
	});

	return {
		...resolution,
		preview: {
			...resolution.preview,
			payload: {
				...resolution.preview.payload,
				conditionIntents,
			},
		},
		application: {
			...resolution.application,
			conditions,
			stateChangeIntents,
		},
		stateChangeIntents,
	};
}

function concentrationLifecycleOperations(
	resolution: ResolveActionResult,
	context: ActionResolutionContext,
	sourceEvidence: readonly SourceEvidenceV1[],
): ActionPlanOperationV1[] {
	const replacement = resolution.stateChangeIntents.find(
		(intent) =>
			intent.type === "concentration" &&
			intent.operation === "replace" &&
			intent.previousConcentrationId !== null,
	);
	if (replacement?.type !== "concentration") return [];

	const participants = new Map<string, ConditionEntry[]>();
	for (const participant of [context.actor, context.target]) {
		if (!participant) continue;
		const existing = participants.get(participant.id) ?? [];
		const byId = new Map(existing.map((entry) => [entry.id, entry]));
		for (const condition of participant.conditions ?? []) {
			if (isConditionEntry(condition)) byId.set(condition.id, condition);
		}
		participants.set(participant.id, [...byId.values()]);
	}

	const operations: ActionPlanOperationV1[] = [];
	for (const [participantId, conditions] of participants) {
		const lifecycle = breakConcentration(
			conditions,
			replacement.previousConcentrationId,
		);
		if (lifecycle.changes.length === 0) continue;
		operations.push(
			makeOperation({
				kind: "condition-lifecycle",
				targetId: participantId,
				path: "advancedConditions",
				description: "Remove effects tied to the replaced concentration.",
				before: conditions,
				after: lifecycle.conditions,
				intent: {
					version: CONDITION_LIFECYCLE_VERSION,
					type: "concentration-broken",
					concentrationId: replacement.previousConcentrationId,
					removedConditionIds: lifecycle.changes.map(
						(change) => change.condition.id,
					),
				},
				sourceEvidence,
			}),
		);
	}
	return operations;
}

function sortPlanParts(
	_operations: ActionPlanOperationV1[],
	choices: RequiredActionChoiceV1[],
	issues: PlanIssue[],
): void {
	choices.sort((left, right) => left.choiceId.localeCompare(right.choiceId));
	issues.sort((left, right) => left.issueId.localeCompare(right.issueId));
}

/**
 * Resolve and plan a combat action without mutating the snapshot, target, or
 * resource state. Callers may inject a previously resolved action so preview,
 * outcome, and application are recorded exactly once.
 */
export function buildCombatActionPlanV1(
	input: CombatActionPlanInputV1,
): CombatActionPlanV1 {
	const baseResolution =
		input.resolvedAction ?? resolveAction(input.payload, input.context);
	const durationChoices = conditionDurationChoiceDescriptors(
		baseResolution,
		input.conditionDurationChoices,
	);
	const resolution = applyConditionDurationChoices(
		baseResolution,
		durationChoices,
	);
	const sourceEvidence = input.sourceEvidence ?? input.snapshot.sourceEvidence;
	const operations = [
		...concentrationLifecycleOperations(
			resolution,
			input.context,
			sourceEvidence,
		),
		...resolution.stateChangeIntents.map((intent, intentIndex) =>
			operationForCombatIntent(intent, sourceEvidence, intentIndex),
		),
	];
	const requiredChoices: RequiredActionChoiceV1[] = [];
	const issues = snapshotIssues(input.snapshot);
	const payload = resolution.preview.payload;

	if (payload.actionEconomy.type === "manual") {
		requiredChoices.push(
			requiredChoice({
				choiceId: "action-economy",
				kind: "action-economy",
				prompt: "Choose the action-economy cost for this legacy/manual action.",
				options: [
					{ value: "action", label: "Action" },
					{ value: "bonus-action", label: "Bonus action" },
					{ value: "reaction", label: "Reaction" },
					{ value: "free", label: "Free/special" },
				],
				selection: input.actionEconomyChoice,
			}),
		);
	}
	for (const choice of durationChoices) {
		requiredChoices.push(
			requiredChoice({
				choiceId: choice.choiceId,
				kind: "duration",
				prompt: `Choose an authored duration for ${choice.conditionId}.`,
				options: [
					{ value: "indefinite", label: "Indefinite" },
					{ value: "round", label: "Rounds" },
					{ value: "turn", label: "Turn boundary" },
					{ value: "rest", label: "Rest" },
					{ value: "concentration", label: "Concentration" },
				],
				selection: choice.selection ? serializable(choice.selection) : null,
			}),
		);
	}
	for (const blocker of resolution.application.blockers) {
		issues.push(
			createPlanIssue({
				severity: "manual",
				code: "combat-resolution-blocker",
				message: blocker,
				path: "resolution.application",
				instructions: "Resolve the blocker before applying state changes.",
			}),
		);
	}
	for (const cost of payload.resourceCosts) {
		const before = input.context.actor?.resources?.[cost.resourceId];
		if (before === undefined) {
			issues.push(
				createPlanIssue({
					severity: "manual",
					code: "resource-balance-required",
					message: `Current balance for ${cost.resourceId} is required.`,
					path: `context.actor.resources.${cost.resourceId}`,
					instructions:
						"Provide the resource by stable ID and current balance.",
				}),
			);
		}
	}
	for (const choice of requiredChoices) {
		const issue = choiceIssue(choice);
		if (issue) issues.push(issue);
	}
	if (payload.automationState === "review-blocked") {
		issues.push(
			createPlanIssue({
				severity: "review-blocked",
				code: "combat-action-review-blocked",
				message: "The authored action is review-blocked.",
				path: "payload.automationState",
				reviewBlockerId: `action:${payload.id}`,
				instructions: "Review and author the missing mechanics.",
			}),
		);
	}
	sortPlanParts(operations, requiredChoices, issues);
	const blockers = blockingPlanIssues(issues);
	const resourceCosts = payload.resourceCosts.map((cost) => ({
		resourceId: cost.resourceId,
		amount: cost.amount,
		expectedBefore:
			input.context.actor?.resources?.[cost.resourceId] ??
			cost.expectedBefore ??
			null,
	}));
	const temporaryIntent = resolution.stateChangeIntents.find(
		(intent) => intent.type === "temporary-hit-points",
	);
	const concentrationIntent = resolution.stateChangeIntents.find(
		(intent) => intent.type === "concentration",
	);
	const planSeed = {
		snapshotId: input.snapshot.snapshotId,
		payloadId: payload.id,
		payloadVersion: input.payload.version,
		targetId: input.context.target.id,
		outcome: serializable(resolution.outcome),
		operationIds: operations.map((operation) => operation.operationId),
		choices: requiredChoices.map((choice) => ({
			choiceId: choice.choiceId,
			selection: choice.selection,
		})),
	};
	return {
		version: COMBAT_ACTION_PLAN_VERSION,
		kind: "combat-action-plan",
		planId: createStablePlanningId("combat-action-plan", planSeed),
		snapshotId: input.snapshot.snapshotId,
		characterId: input.snapshot.character.id,
		payloadVersion: input.payload.version,
		resolution: jsonClone(resolution),
		operations,
		requiredChoices,
		resourceCosts,
		temporaryHitPoints:
			temporaryIntent?.type === "temporary-hit-points"
				? {
						before: temporaryIntent.expectedBefore,
						after: temporaryIntent.after,
						delta: temporaryIntent.delta,
					}
				: null,
		concentration:
			concentrationIntent?.type === "concentration"
				? {
						before: concentrationIntent.previousConcentrationId,
						after: concentrationIntent.concentrationId,
						operation: concentrationIntent.operation,
					}
				: null,
		issues,
		blockers,
		canApply: blockers.length === 0,
	};
}

export const buildCombatActionPlan = buildCombatActionPlanV1;
export const createCombatActionPlanV1 = buildCombatActionPlanV1;

function restOperation(input: {
	kind: ActionPlanOperationKind;
	targetId: string;
	path: string;
	description: string;
	before: unknown;
	after: unknown;
	sourceEvidence: readonly SourceEvidenceV1[];
}): ActionPlanOperationV1 {
	return makeOperation({
		...input,
		intent: { rest: true, path: input.path },
	});
}

/** Plan short/long rest recovery using shared resource and condition engines. */
export function buildRestActionPlanV1(
	input: RestActionPlanInputV1,
): RestActionPlanV1 {
	const sourceEvidence = input.sourceEvidence ?? input.snapshot.sourceEvidence;
	const resourcesBefore = jsonClone(input.resources);
	const conditionsBefore: ConditionEntry[] = jsonClone([
		...(input.conditions ?? input.resources.conditions ?? []),
	]);
	const recoveredResources = applyResourceRest(resourcesBefore, input.restType);
	const restLifecycle = advanceConditionsForRest(
		conditionsBefore,
		input.restType,
	);
	let conditionsAfter = restLifecycle.conditions;
	let concentrationAfter = input.concentrationId ?? null;
	let concentrationBroken = false;
	const requiredChoices: RequiredActionChoiceV1[] = [];
	const issues = snapshotIssues(input.snapshot);
	const operations: ActionPlanOperationV1[] = [];

	if (input.concentrationId) {
		if (input.breakConcentration === undefined) {
			requiredChoices.push(
				requiredChoice({
					choiceId: "break-concentration",
					kind: "rest",
					prompt: "Confirm whether this rest breaks active concentration.",
					options: [
						{ value: "break", label: "Break concentration" },
						{ value: "preserve", label: "Preserve concentration" },
					],
				}),
			);
		} else if (input.breakConcentration) {
			conditionsAfter = breakConcentration(
				conditionsAfter,
				input.concentrationId,
			).conditions;
			concentrationAfter = null;
			concentrationBroken = true;
			operations.push(
				restOperation({
					kind: "concentration",
					targetId: input.snapshot.character.id,
					path: "concentrationId",
					description: "Break concentration during rest.",
					before: input.concentrationId,
					after: null,
					sourceEvidence,
				}),
			);
		}
	}

	const resourcesAfter: CharacterResources = {
		...recoveredResources,
		conditions: jsonClone(conditionsAfter),
	};
	const beforeById = new Map(
		resourcesBefore.custom_resources.map((resource) => [resource.id, resource]),
	);
	for (const resource of resourcesAfter.custom_resources) {
		const before = beforeById.get(resource.id);
		if (!before) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "rest-resource-identity-missing",
					message: `Rest output introduced unknown resource ${resource.id}.`,
					path: `resources.custom_resources.${resource.id}`,
				}),
			);
			continue;
		}
		operations.push(
			restOperation({
				kind: "resource-recovery",
				targetId: input.snapshot.character.id,
				path: `resources.custom_resources.${resource.id}.current`,
				description: `Apply ${input.restType}-rest recovery for ${resource.name}.`,
				before: before.current,
				after: resource.current,
				sourceEvidence,
			}),
		);
	}
	if (input.restType === "long") {
		operations.push(
			restOperation({
				kind: "death-saves",
				targetId: input.snapshot.character.id,
				path: "resources.death_saves",
				description: "Reset death saves on a long rest.",
				before: resourcesBefore.death_saves,
				after: resourcesAfter.death_saves,
				sourceEvidence,
			}),
		);
		if (
			input.currentHitPoints === undefined ||
			input.currentHitPoints === null
		) {
			requiredChoices.push(
				requiredChoice({
					choiceId: "current-hit-points",
					kind: "state",
					prompt: "Provide current hit points before long-rest recovery.",
				}),
			);
		} else {
			operations.push(
				restOperation({
					kind: "hit-points",
					targetId: input.snapshot.character.id,
					path: "hitPoints",
					description: "Restore hit points to the stored maximum.",
					before: input.currentHitPoints,
					after: input.snapshot.storedBases.hitPointsMaximum,
					sourceEvidence,
				}),
			);
		}
		if (input.currentHitDice === undefined || input.currentHitDice === null) {
			requiredChoices.push(
				requiredChoice({
					choiceId: "current-hit-dice",
					kind: "state",
					prompt: "Provide current hit dice before long-rest recovery.",
				}),
			);
		} else {
			const maximum = input.snapshot.storedBases.hitDice.maximum;
			const recovered = Math.max(1, Math.floor(maximum / 2));
			operations.push(
				restOperation({
					kind: "hit-dice",
					targetId: input.snapshot.character.id,
					path: "hitDice.current",
					description: "Recover half of maximum hit dice, capped at maximum.",
					before: input.currentHitDice,
					after: Math.min(maximum, input.currentHitDice + recovered),
					sourceEvidence,
				}),
			);
		}
	} else if (input.shortRestHitDice === undefined) {
		requiredChoices.push(
			requiredChoice({
				choiceId: "short-rest-hit-dice",
				kind: "rest",
				prompt: "Choose whether to spend hit dice during the short rest.",
				options: [
					{ value: "none", label: "Spend none" },
					{ value: "spend", label: "Spend hit dice" },
				],
			}),
		);
	} else if (input.shortRestHitDice.choice === "spend") {
		const choice = input.shortRestHitDice;
		if (
			input.currentHitPoints == null ||
			input.currentHitDice == null ||
			!Number.isInteger(choice.hitDiceSpent) ||
			choice.hitDiceSpent <= 0 ||
			!Number.isFinite(choice.hitPointsRecovered) ||
			choice.hitPointsRecovered < 0
		) {
			issues.push(
				createPlanIssue({
					severity: "manual",
					code: "short-rest-recovery-input-required",
					message:
						"Short-rest hit-die spending needs explicit current state, dice spent, and rolled healing.",
					path: "shortRestHitDice",
					instructions: "Roll healing first and provide the observed values.",
				}),
			);
		} else if (choice.hitDiceSpent > input.currentHitDice) {
			issues.push(
				createPlanIssue({
					severity: "manual",
					code: "short-rest-hit-dice-overdraw",
					message: `Cannot spend ${choice.hitDiceSpent} hit dice when only ${input.currentHitDice} remain.`,
					path: "shortRestHitDice.hitDiceSpent",
					instructions:
						"Choose a hit-die spend no greater than the observed current balance.",
				}),
			);
		} else {
			const maximumHp = input.snapshot.storedBases.hitPointsMaximum;
			operations.push(
				restOperation({
					kind: "hit-dice",
					targetId: input.snapshot.character.id,
					path: "hitDice.current",
					description: "Spend explicitly selected hit dice.",
					before: input.currentHitDice,
					after: input.currentHitDice - choice.hitDiceSpent,
					sourceEvidence,
				}),
				restOperation({
					kind: "hit-points",
					targetId: input.snapshot.character.id,
					path: "hitPoints",
					description: "Apply explicitly rolled short-rest healing.",
					before: input.currentHitPoints,
					after: Math.min(
						maximumHp,
						input.currentHitPoints + choice.hitPointsRecovered,
					),
					sourceEvidence,
				}),
			);
		}
	}

	operations.push(
		restOperation({
			kind: "condition-lifecycle",
			targetId: input.snapshot.character.id,
			path: "resources.conditions",
			description: `Apply explicit/default ${input.restType}-rest condition policies.`,
			before: conditionsBefore.map((condition) => condition.id),
			after: conditionsAfter.map((condition) => condition.id),
			sourceEvidence,
		}),
		restOperation({
			kind: "temporary-hit-points",
			targetId: input.snapshot.character.id,
			path: "resources.temp_hp_sources",
			description: "Preserve temporary HP because no rest expiry was authored.",
			before: resourcesBefore.temp_hp_sources,
			after: resourcesAfter.temp_hp_sources,
			sourceEvidence,
		}),
	);

	for (const choice of requiredChoices) {
		const issue = choiceIssue(choice);
		if (issue) issues.push(issue);
	}
	sortPlanParts(operations, requiredChoices, issues);
	const blockers = blockingPlanIssues(issues);
	return {
		version: REST_ACTION_PLAN_VERSION,
		kind: "rest-action-plan",
		planId: createStablePlanningId("rest-action-plan", {
			snapshotId: input.snapshot.snapshotId,
			restType: input.restType,
			operationIds: operations.map((operation) => operation.operationId),
			choices: requiredChoices.map((choice) => ({
				choiceId: choice.choiceId,
				selection: choice.selection,
			})),
		}),
		snapshotId: input.snapshot.snapshotId,
		characterId: input.snapshot.character.id,
		restType: input.restType,
		operations,
		requiredChoices,
		resourcesBefore,
		resourcesAfter: jsonClone(resourcesAfter),
		conditionsBefore,
		conditionsAfter: jsonClone(conditionsAfter),
		concentration: {
			before: input.concentrationId ?? null,
			after: concentrationAfter,
			broken: concentrationBroken,
		},
		issues,
		blockers,
		canApply: blockers.length === 0,
	};
}

export const buildRestActionPlan = buildRestActionPlanV1;
export const createRestActionPlanV1 = buildRestActionPlanV1;

export type CombatActionPlan = CombatActionPlanV1;
export type RestActionPlan = RestActionPlanV1;
