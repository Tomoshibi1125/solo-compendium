import {
	buildCharacterCreationPlanV1,
	buildLevelTransitionPlanV1,
	type CharacterChoiceRequirementInputV1,
	type CharacterCreationPlanV1,
	type CharacterGrantType,
	type LevelTransitionPlanV1,
	type LifecycleDisposition,
	type LifecycleProvenanceV1,
	type OrderedCharacterGrantInputV1,
	type RecordedCharacterChoiceV1,
} from "@/lib/planning/characterLifecyclePlans";
import {
	cloneSerializable,
	createPlanIssue,
	createStablePlanningId,
	type MechanicalReference,
	PLANNING_SCHEMA_VERSION,
	type PlanIssue,
	type SerializableRecord,
	type SourceEvidenceV1,
} from "@/lib/planning/contracts";
import {
	type CharacterMechanicalSnapshotV1,
	createCharacterMechanicalSnapshotV1,
	type StoredCharacterMechanicalBasesV1,
	type TransientConditionSnapshotV1,
	type TransientEffectSnapshotV1,
	type TransientModifierSnapshotV1,
	type TransientResourceSnapshotV1,
} from "@/lib/planning/mechanicalSnapshot";
import {
	buildReconciliationPlanV1,
	createReconciliationRecordV1,
	type DesiredReconciliationRecordInputV1,
	type ReconciliationPlanV1,
} from "@/lib/planning/reconciliationPlan";

export const CHARACTER_WORKFLOW_ADAPTER_VERSION = 1 as const;

export type CharacterWorkflowSourceKindV1 =
	| "canonical"
	| "homebrew"
	| "source-address"
	| "stored";

export type CharacterWorkflowPersistenceV1 =
	| "id"
	| "source-address"
	| "display-only";

export type CharacterWorkflowSelectionKindV1 =
	| "job"
	| "path"
	| "background"
	| "feature"
	| "feat"
	| "ability-increase"
	| "power"
	| "technique"
	| "cantrip"
	| "spell"
	| "spellbook"
	| "fighting-style"
	| "skill"
	| "language"
	| "equipment"
	| "ledger";

/**
 * ID-first identity accepted by the lifecycle adapters. `label` is display-only:
 * it is never used to create an entity, grant, choice, or provenance identity.
 * When canon has no entity ID, callers must provide an authored source address
 * (owner ID + field path/index), not a name-derived pseudo-ID.
 */
export interface CharacterWorkflowIdentityV1 {
	id: string | null;
	label: string;
	sourceKind: CharacterWorkflowSourceKindV1;
	collection: string;
	canonicalType?: string | null;
	sourceBook?: string | null;
	sourceVersion?: string | number | null;
	sourcePath?: string | null;
	persistence?: CharacterWorkflowPersistenceV1;
	payload?: SerializableRecord;
}

export function createCharacterWorkflowSourceAddressV1(input: {
	ownerId: string;
	collection: string;
	sourcePath: string;
	label: string;
	payload?: SerializableRecord;
	persistence?: CharacterWorkflowPersistenceV1;
}): CharacterWorkflowIdentityV1 {
	return {
		id: createStablePlanningId("character-source-address", {
			ownerId: input.ownerId,
			collection: input.collection,
			sourcePath: input.sourcePath,
		}),
		label: input.label,
		sourceKind: "source-address",
		collection: input.collection,
		sourcePath: input.sourcePath,
		persistence: input.persistence ?? "source-address",
		payload: input.payload ? cloneSerializable(input.payload) : undefined,
	};
}

export interface CharacterWorkflowFeatureInputV1 {
	identity: CharacterWorkflowIdentityV1;
	owner: CharacterWorkflowIdentityV1;
	level: number;
	payload?: SerializableRecord;
	disposition?: LifecycleDisposition;
	instructions?: string | null;
	reviewBlockerId?: string | null;
}

export interface CharacterWorkflowFixedGrantInputV1 {
	kind: CharacterWorkflowSelectionKindV1;
	identity: CharacterWorkflowIdentityV1;
	owner?: CharacterWorkflowIdentityV1 | null;
	level: number;
	grantType: CharacterGrantType;
	occurrence?: number;
	payload?: SerializableRecord;
	disposition?: LifecycleDisposition;
	instructions?: string | null;
	reviewBlockerId?: string | null;
}

export interface CharacterWorkflowChoiceInputV1 {
	kind: CharacterWorkflowSelectionKindV1;
	source: CharacterWorkflowIdentityV1;
	/** Authored array/ledger index. Never substitute the source's display label. */
	sourceIndex: number;
	level: number;
	count: number;
	prompt: string;
	options: readonly CharacterWorkflowIdentityV1[];
	selectedOptionIds: readonly string[];
	grantType: CharacterGrantType;
}

export interface CharacterCreationWorkflowInputV1 {
	characterId: string;
	job: CharacterWorkflowIdentityV1;
	background: CharacterWorkflowIdentityV1;
	path?: CharacterWorkflowIdentityV1 | null;
	features?: readonly CharacterWorkflowFeatureInputV1[];
	fixedGrants?: readonly CharacterWorkflowFixedGrantInputV1[];
	choices?: readonly CharacterWorkflowChoiceInputV1[];
	issues?: readonly PlanIssue[];
}

export type CharacterWorkflowAbilityCode =
	| "STR"
	| "AGI"
	| "VIT"
	| "INT"
	| "SENSE"
	| "PRE";

export interface CharacterWorkflowAbilityIncreaseV1 {
	source: CharacterWorkflowIdentityV1;
	points: Partial<Record<CharacterWorkflowAbilityCode, number>>;
	expectedPoints: number;
}

export interface CharacterWorkflowRetrainV1 {
	kind: "spell" | "power" | "technique";
	ownedRowId: string;
	currentReferenceId: string | null;
	replacement: CharacterWorkflowIdentityV1;
}

export interface CharacterWorkflowUnresolvedLedgerV1 {
	owner: CharacterWorkflowIdentityV1;
	ledgerIndex: number;
	level: number;
	type: string;
	count: number;
}

export interface CharacterLevelUpWorkflowInputV1 {
	characterId: string;
	fromLevel: number;
	toLevel: number;
	job: CharacterWorkflowIdentityV1;
	pathSelection?: CharacterWorkflowIdentityV1 | null;
	features?: readonly CharacterWorkflowFeatureInputV1[];
	fixedGrants?: readonly CharacterWorkflowFixedGrantInputV1[];
	choices?: readonly CharacterWorkflowChoiceInputV1[];
	abilityIncrease?: CharacterWorkflowAbilityIncreaseV1 | null;
	retrain?: CharacterWorkflowRetrainV1 | null;
	unresolvedLedger?: readonly CharacterWorkflowUnresolvedLedgerV1[];
	issues?: readonly PlanIssue[];
}

function evidenceKind(
	kind: CharacterWorkflowSourceKindV1,
): SourceEvidenceV1["kind"] {
	if (kind === "homebrew") return "homebrew";
	if (kind === "stored") return "stored";
	return "canonical";
}

export function createCharacterWorkflowEvidenceV1(
	identity: CharacterWorkflowIdentityV1,
): SourceEvidenceV1 {
	return {
		version: PLANNING_SCHEMA_VERSION,
		kind: evidenceKind(identity.sourceKind),
		sourceType: identity.collection,
		sourceId: identity.id,
		sourceVersion: identity.sourceVersion ?? null,
		path: identity.sourcePath ?? null,
		label: identity.label || null,
		observed: {
			id: identity.id,
			collection: identity.collection,
			sourceKind: identity.sourceKind,
		},
	};
}

function canonicalReference(
	identity: CharacterWorkflowIdentityV1,
): MechanicalReference | null {
	if (identity.sourceKind !== "canonical" || !identity.id) return null;
	return {
		version: PLANNING_SCHEMA_VERSION,
		kind: "canonical",
		id: identity.id,
		label: identity.label || null,
		evidence: [createCharacterWorkflowEvidenceV1(identity)],
		canonicalType: identity.canonicalType ?? identity.collection,
		collection: identity.collection,
		sourceBook: identity.sourceBook ?? null,
	};
}

function provenance(
	identity: CharacterWorkflowIdentityV1,
	level: number,
	owner?: CharacterWorkflowIdentityV1 | null,
): LifecycleProvenanceV1 {
	const sourceEvidence = [createCharacterWorkflowEvidenceV1(identity)];
	if (
		owner?.id &&
		(owner.id !== identity.id || owner.collection !== identity.collection)
	) {
		sourceEvidence.push(createCharacterWorkflowEvidenceV1(owner));
	}
	return {
		version: PLANNING_SCHEMA_VERSION,
		ruleId: createStablePlanningId("character-rule", {
			owner: owner
				? {
						id: owner.id,
						collection: owner.collection,
						sourceKind: owner.sourceKind,
					}
				: null,
			identity: {
				id: identity.id,
				collection: identity.collection,
				sourceKind: identity.sourceKind,
			},
			level,
		}),
		sourceLevel: level,
		reference: canonicalReference(identity),
		sourceEvidence,
	};
}

function identityIssue(
	identity: CharacterWorkflowIdentityV1,
	path: string,
): PlanIssue[] {
	const issues: PlanIssue[] = [];
	if (!identity.id?.trim()) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "character-workflow-identity-required",
				message: `${identity.collection || "Lifecycle selection"} requires an explicit catalog, homebrew, stored, or source-address ID`,
				path,
				evidence: [createCharacterWorkflowEvidenceV1(identity)],
			}),
		);
	}
	if (!identity.collection.trim()) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "character-workflow-collection-required",
				message: "Lifecycle identities require an explicit source collection",
				path,
				evidence: [createCharacterWorkflowEvidenceV1(identity)],
			}),
		);
	}
	if (
		identity.sourceKind === "source-address" &&
		!identity.sourcePath?.trim()
	) {
		issues.push(
			createPlanIssue({
				severity: "strict",
				code: "character-workflow-source-address-required",
				message: `${identity.collection} has no official entity ID and requires an authored source path`,
				path,
				evidence: [createCharacterWorkflowEvidenceV1(identity)],
			}),
		);
	}
	return issues;
}

function selectedPersistenceIssue(
	identity: CharacterWorkflowIdentityV1,
	path: string,
): PlanIssue | null {
	if ((identity.persistence ?? "id") !== "display-only") return null;
	return createPlanIssue({
		severity: "review-blocked",
		code: "character-workflow-identity-not-persisted",
		message: `${identity.label || identity.collection} has an ID in the resolved catalog, but the current persisted row stores only its display value`,
		path,
		reviewBlockerId: createStablePlanningId(
			"character-workflow-persistence-blocker",
			{
				id: identity.id,
				collection: identity.collection,
				sourceKind: identity.sourceKind,
			},
		),
		instructions:
			"Choose an entry whose stable ID is persisted, or add an ID-preserving repository mapping before applying this lifecycle plan.",
		evidence: [createCharacterWorkflowEvidenceV1(identity)],
	});
}

function payloadForIdentity(
	kind: CharacterWorkflowSelectionKindV1,
	identity: CharacterWorkflowIdentityV1,
	extra?: SerializableRecord,
): SerializableRecord {
	return {
		...(identity.payload ? cloneSerializable(identity.payload) : {}),
		...(extra ? cloneSerializable(extra) : {}),
		selectionKind: kind,
		entityId: identity.id,
		label: identity.label,
		sourceKind: identity.sourceKind,
		collection: identity.collection,
		persistence: identity.persistence ?? "id",
	};
}

function fixedGrant(
	input: CharacterWorkflowFixedGrantInputV1,
	order: number,
): OrderedCharacterGrantInputV1 {
	return {
		grantId: createStablePlanningId("character-grant", {
			kind: input.kind,
			identity: {
				id: input.identity.id,
				collection: input.identity.collection,
				sourceKind: input.identity.sourceKind,
			},
			owner: input.owner
				? {
						id: input.owner.id,
						collection: input.owner.collection,
						sourceKind: input.owner.sourceKind,
					}
				: null,
			level: input.level,
			occurrence: input.occurrence ?? 0,
		}),
		order,
		level: input.level,
		grantType: input.grantType,
		payload: payloadForIdentity(input.kind, input.identity, input.payload),
		disposition: input.disposition ?? "automatic",
		instructions: input.instructions ?? null,
		reviewBlockerId: input.reviewBlockerId ?? null,
		provenance: provenance(input.identity, input.level, input.owner),
	};
}

function featureGrant(
	input: CharacterWorkflowFeatureInputV1,
	order: number,
	occurrence: number,
): OrderedCharacterGrantInputV1 {
	return fixedGrant(
		{
			kind: "feature",
			identity: input.identity,
			owner: input.owner,
			level: input.level,
			grantType: "feature",
			occurrence,
			payload: input.payload,
			disposition: input.disposition,
			instructions: input.instructions,
			reviewBlockerId: input.reviewBlockerId,
		},
		order,
	);
}

interface MappedChoicesV1 {
	requirements: CharacterChoiceRequirementInputV1[];
	recorded: RecordedCharacterChoiceV1[];
	grants: OrderedCharacterGrantInputV1[];
	issues: PlanIssue[];
}

function mapChoices(
	choices: readonly CharacterWorkflowChoiceInputV1[],
	startingOrder: number,
): MappedChoicesV1 {
	const requirements: CharacterChoiceRequirementInputV1[] = [];
	const recorded: RecordedCharacterChoiceV1[] = [];
	const grants: OrderedCharacterGrantInputV1[] = [];
	const issues: PlanIssue[] = [];
	let grantOrder = startingOrder;

	for (const [choicePosition, choice] of choices.entries()) {
		if (choice.count <= 0) continue;
		issues.push(
			...identityIssue(
				choice.source,
				`choices.${choice.kind}.${choice.sourceIndex}.source`,
			),
		);
		for (const [optionIndex, option] of choice.options.entries()) {
			issues.push(
				...identityIssue(
					option,
					`choices.${choice.kind}.${choice.sourceIndex}.options.${optionIndex}`,
				),
			);
		}
		const choiceId = createStablePlanningId("character-choice", {
			kind: choice.kind,
			source: {
				id: choice.source.id,
				collection: choice.source.collection,
				sourceKind: choice.source.sourceKind,
			},
			sourceIndex: choice.sourceIndex,
			level: choice.level,
		});
		requirements.push({
			choiceId,
			order: choicePosition,
			level: choice.level,
			count: choice.count,
			prompt: choice.prompt,
			options: choice.options.map((option) => ({
				optionId: option.id ?? "",
				label: option.label,
				payload: payloadForIdentity(choice.kind, option),
			})),
			provenance: provenance(choice.source, choice.level),
		});
		recorded.push({
			choiceId,
			selectedOptionIds: [...choice.selectedOptionIds],
			provenance: [createCharacterWorkflowEvidenceV1(choice.source)],
		});
		const optionById = new Map(
			choice.options
				.filter(
					(option): option is CharacterWorkflowIdentityV1 & { id: string } =>
						Boolean(option.id),
				)
				.map((option) => [option.id, option]),
		);
		for (const [
			selectedIndex,
			selectedId,
		] of choice.selectedOptionIds.entries()) {
			const selected = optionById.get(selectedId);
			if (!selected) continue;
			const persistenceIssue = selectedPersistenceIssue(
				selected,
				`choices.${choice.kind}.${choice.sourceIndex}.selected.${selectedId}`,
			);
			if (persistenceIssue) issues.push(persistenceIssue);
			grants.push(
				fixedGrant(
					{
						kind: choice.kind,
						identity: selected,
						owner: choice.source,
						level: choice.level,
						grantType: choice.grantType,
						occurrence: choice.sourceIndex * 1000 + selectedIndex,
						payload: { choiceId },
					},
					grantOrder,
				),
			);
			grantOrder += 1;
		}
	}

	return { requirements, recorded, grants, issues };
}

function mapCommon(input: {
	features: readonly CharacterWorkflowFeatureInputV1[];
	fixedGrants: readonly CharacterWorkflowFixedGrantInputV1[];
	choices: readonly CharacterWorkflowChoiceInputV1[];
}): {
	grants: OrderedCharacterGrantInputV1[];
	requirements: CharacterChoiceRequirementInputV1[];
	recorded: RecordedCharacterChoiceV1[];
	issues: PlanIssue[];
} {
	const issues: PlanIssue[] = [];
	const grants: OrderedCharacterGrantInputV1[] = [];
	let order = 0;
	for (const [index, feature] of input.features.entries()) {
		issues.push(
			...identityIssue(feature.identity, `features.${index}.identity`),
			...identityIssue(feature.owner, `features.${index}.owner`),
		);
		const persistenceIssue = selectedPersistenceIssue(
			feature.identity,
			`features.${index}.identity`,
		);
		if (persistenceIssue) issues.push(persistenceIssue);
		grants.push(featureGrant(feature, order, index));
		order += 1;
	}
	for (const [index, grant] of input.fixedGrants.entries()) {
		issues.push(
			...identityIssue(grant.identity, `fixedGrants.${index}.identity`),
			...(grant.owner
				? identityIssue(grant.owner, `fixedGrants.${index}.owner`)
				: []),
		);
		const persistenceIssue = selectedPersistenceIssue(
			grant.identity,
			`fixedGrants.${index}.identity`,
		);
		if (persistenceIssue) issues.push(persistenceIssue);
		grants.push(fixedGrant(grant, order));
		order += 1;
	}
	const mappedChoices = mapChoices(input.choices, order);
	return {
		grants: [...grants, ...mappedChoices.grants],
		requirements: mappedChoices.requirements,
		recorded: mappedChoices.recorded,
		issues: [...issues, ...mappedChoices.issues],
	};
}

export function buildCharacterCreationWorkflowPlanV1(
	input: CharacterCreationWorkflowInputV1,
): CharacterCreationPlanV1 {
	const issues: PlanIssue[] = [...(input.issues ?? [])];
	issues.push(
		...identityIssue(input.job, "job"),
		...identityIssue(input.background, "background"),
		...(input.path ? identityIssue(input.path, "path") : []),
	);
	const coreSelections: CharacterWorkflowFixedGrantInputV1[] = [
		{
			kind: "job",
			identity: input.job,
			level: 1,
			grantType: "custom",
		},
		{
			kind: "background",
			identity: input.background,
			level: 1,
			grantType: "custom",
		},
	];
	if (input.path) {
		coreSelections.push({
			kind: "path",
			identity: input.path,
			owner: input.job,
			level: 1,
			grantType: "custom",
		});
	}
	const mapped = mapCommon({
		features: input.features ?? [],
		fixedGrants: [...coreSelections, ...(input.fixedGrants ?? [])],
		choices: input.choices ?? [],
	});
	return buildCharacterCreationPlanV1({
		characterId: input.characterId,
		targetLevel: 1,
		grants: mapped.grants,
		choiceRequirements: mapped.requirements,
		recordedChoices: mapped.recorded,
		issues: [...issues, ...mapped.issues],
	});
}

export function buildCharacterLevelUpWorkflowPlanV1(
	input: CharacterLevelUpWorkflowInputV1,
): LevelTransitionPlanV1 {
	const issues: PlanIssue[] = [
		...(input.issues ?? []),
		...identityIssue(input.job, "job"),
		...(input.pathSelection
			? identityIssue(input.pathSelection, "pathSelection")
			: []),
	];
	if (input.toLevel !== input.fromLevel + 1) {
		issues.push(
			createPlanIssue({
				severity: "review-blocked",
				code: "character-workflow-multi-level-resolution-incomplete",
				message:
					"This wizard resolves exact-level grants only and cannot prove every intermediate level grant",
				path: "toLevel",
				reviewBlockerId: createStablePlanningId(
					"character-multi-level-blocker",
					{
						characterId: input.characterId,
						fromLevel: input.fromLevel,
						toLevel: input.toLevel,
					},
				),
				instructions: "Advance one level at a time.",
			}),
		);
	}

	const fixedGrants: CharacterWorkflowFixedGrantInputV1[] = [
		...(input.fixedGrants ?? []),
	];
	if (input.pathSelection) {
		fixedGrants.unshift({
			kind: "path",
			identity: input.pathSelection,
			owner: input.job,
			level: input.toLevel,
			grantType: "custom",
		});
	}
	if (input.abilityIncrease) {
		issues.push(
			...identityIssue(input.abilityIncrease.source, "abilityIncrease"),
		);
		let totalPoints = 0;
		let invalidPoints = false;
		const normalizedPoints: SerializableRecord = {};
		for (const [ability, points] of Object.entries(
			input.abilityIncrease.points,
		)) {
			if (!Number.isInteger(points) || points < 0) invalidPoints = true;
			if (typeof points === "number" && Number.isFinite(points)) {
				totalPoints += points;
				normalizedPoints[ability] = points;
			}
		}
		if (invalidPoints) {
			issues.push(
				createPlanIssue({
					severity: "strict",
					code: "character-workflow-ability-increase-invalid",
					message: "Ability increases must use non-negative integer points",
					path: "abilityIncrease.points",
					evidence: [
						createCharacterWorkflowEvidenceV1(input.abilityIncrease.source),
					],
				}),
			);
		}
		if (totalPoints !== input.abilityIncrease.expectedPoints) {
			issues.push(
				createPlanIssue({
					severity: "manual",
					code: "character-workflow-ability-increase-incomplete",
					message: `Ability increase requires ${input.abilityIncrease.expectedPoints} point${input.abilityIncrease.expectedPoints === 1 ? "" : "s"}; ${totalPoints} selected`,
					path: "abilityIncrease.points",
					instructions:
						"Allocate the full authored ability increase before leveling up.",
					evidence: [
						createCharacterWorkflowEvidenceV1(input.abilityIncrease.source),
					],
				}),
			);
		}
		if (totalPoints > 0) {
			fixedGrants.push({
				kind: "ability-increase",
				identity: input.abilityIncrease.source,
				owner: input.job,
				level: input.toLevel,
				grantType: "ability-increase",
				payload: { points: normalizedPoints },
			});
		}
	}

	if (input.retrain) {
		issues.push(
			createPlanIssue({
				severity: "review-blocked",
				code: "character-workflow-retrain-not-representable-v1",
				message: `${input.retrain.kind} retraining replaces an owned row, but LevelTransitionPlanV1 supports additive grants only`,
				path: "retrain",
				reviewBlockerId: createStablePlanningId("character-retrain-blocker", {
					characterId: input.characterId,
					kind: input.retrain.kind,
					ownedRowId: input.retrain.ownedRowId,
					currentReferenceId: input.retrain.currentReferenceId,
					replacementId: input.retrain.replacement.id,
				}),
				instructions:
					"Cancel the retrain or use a future replacement plan that records expected-before state and can restore the old row.",
				evidence: [
					createCharacterWorkflowEvidenceV1(input.retrain.replacement),
				],
			}),
		);
	}
	for (const unresolved of input.unresolvedLedger ?? []) {
		issues.push(
			createPlanIssue({
				severity: "review-blocked",
				code: "character-workflow-ledger-options-unresolved",
				message: `Ledger entry ${unresolved.type} requires ${unresolved.count} selection${unresolved.count === 1 ? "" : "s"}, but no ID-addressable option catalog is available`,
				path: `ledger.${unresolved.ledgerIndex}`,
				reviewBlockerId: createStablePlanningId("character-ledger-blocker", {
					ownerId: unresolved.owner.id,
					ledgerIndex: unresolved.ledgerIndex,
					level: unresolved.level,
					type: unresolved.type,
				}),
				instructions:
					"Author stable ledger option IDs or complete this choice through an explicit manual workflow; no pending placeholder will be invented.",
				evidence: [createCharacterWorkflowEvidenceV1(unresolved.owner)],
			}),
		);
	}

	const mapped = mapCommon({
		features: input.features ?? [],
		fixedGrants,
		choices: input.choices ?? [],
	});
	return buildLevelTransitionPlanV1({
		characterId: input.characterId,
		fromLevel: input.fromLevel,
		toLevel: input.toLevel,
		grants: mapped.grants,
		choiceRequirements: mapped.requirements,
		recordedChoices: mapped.recorded,
		issues: [...issues, ...mapped.issues],
	});
}

export interface CharacterProgressionReconciliationRecordV1 {
	recordKey: string;
	level: number;
	value: SerializableRecord;
	/** Must come from durable ownership metadata, never a parsed display/source label. */
	provenSourceKey: string | null;
	customState?: SerializableRecord | null;
	manualState?: SerializableRecord | null;
}

export interface CharacterLevelDownPreflightInputV1 {
	characterId: string;
	fromLevel: number;
	toLevel: number;
	sourceKey: string;
	records: readonly CharacterProgressionReconciliationRecordV1[];
	/** True only when every removable grant and all required reversal history were read. */
	ownershipAndHistoryComplete: boolean;
}

export interface CharacterLevelDownPreflightV1 {
	version: typeof CHARACTER_WORKFLOW_ADAPTER_VERSION;
	reconciliationPlan: ReconciliationPlanV1;
	canRemoveProgression: boolean;
	blockers: PlanIssue[];
}

/**
 * Preflight level-down removals without mutating data. Unknown/manual/custom rows
 * remain untouched. The caller may invoke a destructive repository helper only
 * when `canRemoveProgression` is true.
 */
export function buildCharacterLevelDownPreflightV1(
	input: CharacterLevelDownPreflightInputV1,
): CharacterLevelDownPreflightV1 {
	const current = input.records.map((record) =>
		createReconciliationRecordV1({
			recordKey: record.recordKey,
			value: {
				...cloneSerializable(record.value),
				level: record.level,
			},
			ownership:
				record.provenSourceKey === input.sourceKey
					? {
							kind: "source" as const,
							sourceKey: input.sourceKey,
							evidence: [],
						}
					: {
							kind: "manual" as const,
							reason:
								"No durable lifecycle source ownership was supplied for this row",
						},
			customState: record.customState ?? null,
			manualState: record.manualState ?? null,
		}),
	);
	const desired: DesiredReconciliationRecordInputV1[] = input.records
		.filter(
			(record) =>
				record.level <= input.toLevel &&
				record.provenSourceKey === input.sourceKey,
		)
		.map((record) => ({
			recordKey: record.recordKey,
			value: {
				...cloneSerializable(record.value),
				level: record.level,
			},
		}));

	const unsafeRows = input.records.filter(
		(record) =>
			record.level > input.toLevel &&
			record.provenSourceKey !== input.sourceKey,
	);
	if (!input.ownershipAndHistoryComplete || unsafeRows.length > 0) {
		desired.push({
			recordKey: "preflight:ownership-and-history-proof",
			value: {
				fromLevel: input.fromLevel,
				toLevel: input.toLevel,
				unsafeRecordKeys: unsafeRows.map((record) => record.recordKey).sort(),
			},
			disposition: "review-blocked" as const,
			reviewBlockerId: createStablePlanningId(
				"character-level-down-proof-blocker",
				{
					characterId: input.characterId,
					fromLevel: input.fromLevel,
					toLevel: input.toLevel,
					unsafeRecordKeys: unsafeRows.map((record) => record.recordKey).sort(),
				},
			),
			instructions:
				"Level-down requires durable source ownership plus recorded HP, ASI, choice, and retrain history. Current scores or source labels cannot be used to infer that history.",
		});
	}

	const reconciliationPlan = buildReconciliationPlanV1({
		scopeKey: "character-level-down",
		targetId: input.characterId,
		sourceKey: input.sourceKey,
		current,
		desired,
	});
	const removableOperationsAreProven = reconciliationPlan.operations
		.filter((operation) => operation.status === "remove")
		.every(
			(operation) =>
				operation.expectedBefore.state === "present" &&
				operation.expectedBefore.value.ownership.kind === "source" &&
				operation.expectedBefore.value.ownership.sourceKey === input.sourceKey,
		);
	const canRemoveProgression =
		input.ownershipAndHistoryComplete &&
		unsafeRows.length === 0 &&
		reconciliationPlan.canApply &&
		removableOperationsAreProven;
	return {
		version: CHARACTER_WORKFLOW_ADAPTER_VERSION,
		reconciliationPlan,
		canRemoveProgression,
		blockers: reconciliationPlan.blockers,
	};
}

export type CharacterWorkflowKindV1 = "creation" | "transition";

export interface CharacterWorkflowHandoffInputV1 {
	workflowKind: CharacterWorkflowKindV1;
	plan: {
		characterId: string;
		planId: string;
		canApply: boolean;
	};
	displayName?: string | null;
	storedBases: StoredCharacterMechanicalBasesV1;
	transient?: {
		modifiers?: readonly TransientModifierSnapshotV1[];
		resources?: readonly TransientResourceSnapshotV1[];
		effects?: readonly TransientEffectSnapshotV1[];
		conditions?: readonly TransientConditionSnapshotV1[];
	};
}

export interface CharacterWorkflowHandoffV1 {
	version: typeof CHARACTER_WORKFLOW_ADAPTER_VERSION;
	workflowKind: CharacterWorkflowKindV1;
	planId: string;
	snapshot: CharacterMechanicalSnapshotV1;
	cacheInvalidationKeys: readonly (readonly string[])[];
}

/**
 * Build the single post-write handoff. Derived and transient observations stay
 * inside the snapshot and are never projected back into persisted base fields.
 */
export function createCharacterWorkflowHandoffV1(
	input: CharacterWorkflowHandoffInputV1,
): CharacterWorkflowHandoffV1 {
	if (!input.plan.canApply) {
		throw new TypeError("Cannot hand off a blocked character lifecycle plan");
	}
	const sourceEvidence: SourceEvidenceV1[] = [
		{
			version: PLANNING_SCHEMA_VERSION,
			kind: "stored",
			sourceType: `${input.workflowKind}-lifecycle-plan`,
			sourceId: input.plan.planId,
			sourceVersion: CHARACTER_WORKFLOW_ADAPTER_VERSION,
			path: null,
			label: null,
			observed: { planId: input.plan.planId },
		},
	];
	const snapshot = createCharacterMechanicalSnapshotV1({
		characterId: input.plan.characterId,
		displayName: input.displayName ?? null,
		storedBases: {
			...cloneSerializable(input.storedBases),
			additional: {
				...cloneSerializable(input.storedBases.additional),
				lifecyclePlanId: input.plan.planId,
				lifecycleWorkflowKind: input.workflowKind,
			},
		},
		canonicalDerivedValues: [],
		transient: {
			modifiers: input.transient?.modifiers ?? [],
			resources: input.transient?.resources ?? [],
			effects: input.transient?.effects ?? [],
			conditions: input.transient?.conditions ?? [],
		},
		referenceResolutions: [],
		sourceEvidence,
	});
	const cacheInvalidationKeys: readonly (readonly string[])[] =
		input.workflowKind === "creation"
			? [["characters"], ["character", snapshot.character.id]]
			: [
					["powers", snapshot.character.id],
					["character-spells", snapshot.character.id],
					["features", snapshot.character.id],
					["character-features", snapshot.character.id],
					["character-techniques", snapshot.character.id],
					["character", snapshot.character.id],
					["characters"],
					["combat-actions", snapshot.character.id],
				];
	return {
		version: CHARACTER_WORKFLOW_ADAPTER_VERSION,
		workflowKind: input.workflowKind,
		planId: input.plan.planId,
		snapshot,
		cacheInvalidationKeys,
	};
}

export function summarizeCharacterWorkflowBlockersV1(
	blockers: readonly PlanIssue[],
): string {
	if (blockers.length === 0) return "No lifecycle blockers.";
	const displayed = blockers.slice(0, 3).map((blocker) => {
		const instructions =
			"instructions" in blocker && blocker.instructions
				? ` ${blocker.instructions}`
				: "";
		return `${blocker.message}.${instructions}`;
	});
	if (blockers.length > displayed.length) {
		displayed.push(
			`${blockers.length - displayed.length} additional blocker${blockers.length - displayed.length === 1 ? "" : "s"} must be resolved.`,
		);
	}
	return displayed.join(" ");
}
