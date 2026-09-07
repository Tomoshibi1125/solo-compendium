import {
	applyDamageMitigation,
	type DamageApplicationResult,
	type DamageMitigationProfile,
} from "@/lib/damageApplication";
import { rollDiceString } from "@/lib/diceRoller";
import { rollCheck } from "@/lib/rollEngine";
import {
	type AdvantageState,
	type ConditionAutomationState,
	hasAllDamageResistance,
	resolveIncomingAttackModifiers,
	resolveRollModifiers,
} from "./conditionEffects";
import {
	type ConditionApplicationV1,
	type ConditionDurationV1,
	type ConditionEntry,
	type ConditionRestPolicy,
	type ConditionSaveMetadataV1,
	type ConditionSourceIdentityV1,
	type ConditionStackingPolicy,
	createConditionApplicationV1,
	isConditionAutomationState,
	isConditionDurationV1,
	isConditionRestPolicy,
	isConditionSaveMetadataV1,
	isConditionSourceIdentityV1,
	isConditionStackingPolicy,
} from "./conditionSystem";

function rollDamageFormula(
	formula: string,
	isCritical: boolean,
	extraDice = 0,
): { rolls: number[]; result: number } {
	if (!isCritical) {
		const roll = rollDiceString(formula);
		return { rolls: roll.rolls, result: roll.result };
	}
	let doubled = formula.replace(
		/(\d+)d(\d+)/gi,
		(_match, count: string, sides: string) =>
			`${parseInt(count, 10) * 2}d${sides}`,
	);
	if (extraDice > 0) {
		const firstDie = formula.match(/\d+d(\d+)/i)?.[1];
		if (firstDie) doubled = `${doubled}+${extraDice}d${firstDie}`;
	}
	const roll = rollDiceString(doubled);
	return { rolls: roll.rolls, result: roll.result };
}

export type ResolutionKind =
	| "attack"
	| "save"
	| "healing"
	| "damage"
	| "effect";

export type ActionRollMode = "normal" | "advantage" | "disadvantage";

export type ActionResolutionSourceType =
	| "spell"
	| "Anomaly_action"
	| "technique"
	| "item"
	| "artifact"
	| "relic"
	| "power"
	| "rune";

export interface ActionResolutionSource {
	type: ActionResolutionSourceType;
	entryId: string;
}

export interface ActionAttackSpec {
	roll: string;
	rollMode?: ActionRollMode;
	forceCritical?: boolean;
	critExtraDice?: number;
}

export interface ActionSaveSpec {
	dc: number;
	ability?: string;
	roll?: string;
	rollMode?: ActionRollMode;
}

export interface ActionDamageSpec {
	roll: string;
	type?: string;
}

export interface ActionHealingSpec {
	roll: string;
	mode?: "hit-points" | "temporary-hit-points";
}

/** Exact persisted/producer contract used before v2. */
export interface ActionResolutionPayloadV1 {
	version: 1;
	id: string;
	name: string;
	source: ActionResolutionSource;
	kind: ResolutionKind;
	attack?: ActionAttackSpec;
	save?: ActionSaveSpec;
	damage?: ActionDamageSpec;
	healing?: ActionHealingSpec;
	appliesConditions?: string[];
	description?: string;
}

export type ActionApplicationGate =
	| "always"
	| "on-hit"
	| "on-miss"
	| "on-failed-save"
	| "on-successful-save"
	| "manual";

export type SaveSuccessDamagePolicy = "none" | "half" | "full";
export type ActionMitigationMode = "typed" | "raw" | "manual";

export interface ActionParticipantReferenceV2 {
	id: string;
	name?: string;
}

export interface ActionEconomyV2 {
	type:
		| "action"
		| "bonus-action"
		| "reaction"
		| "free"
		| "movement"
		| "special"
		| "manual";
	cost: number;
}

export interface ActionResourceCostV2 {
	resourceId: string;
	amount: number;
	expectedBefore?: number | null;
}

export interface ActionConcentrationV2 {
	required: boolean;
	concentrationId: string | null;
	breakExisting: boolean;
}

export interface TypedConditionIntentV2 {
	conditionId: string;
	gate: ActionApplicationGate;
	duration: ConditionDurationV1;
	save?: ConditionSaveMetadataV1 | null;
	stackingPolicy: ConditionStackingPolicy;
	restPolicy: ConditionRestPolicy;
	automationState: ConditionAutomationState;
	concentrationId?: string | null;
	source?: ConditionSourceIdentityV1;
	notes?: string | null;
	legacy?: boolean;
}

export interface ActionResolutionPayloadV2 {
	version: 2;
	id: string;
	name: string;
	source: ActionResolutionSource;
	kind: ResolutionKind;
	actor: ActionParticipantReferenceV2 | null;
	targets: ActionParticipantReferenceV2[];
	actionEconomy: ActionEconomyV2;
	resourceCosts: ActionResourceCostV2[];
	conditionIntents: TypedConditionIntentV2[];
	duration: ConditionDurationV1 | null;
	concentration: ActionConcentrationV2 | null;
	saveSuccessDamagePolicy: SaveSuccessDamagePolicy;
	mitigationMode: ActionMitigationMode;
	applicationGate: ActionApplicationGate;
	automationState: ConditionAutomationState;
	attack?: ActionAttackSpec;
	save?: ActionSaveSpec;
	damage?: ActionDamageSpec;
	healing?: ActionHealingSpec;
	temporaryHitPoints?: { roll: string };
	description?: string;
	/** Present only on normalized v1 payloads. */
	legacy?: boolean;
}

/**
 * Backward-compatible public producer surface. V1 callers retain their exact
 * required fields; strict v2 callers can use ActionResolutionPayloadV2.
 */
export interface ActionResolutionPayload {
	version: 1 | 2;
	id: string;
	name: string;
	source: ActionResolutionSource;
	kind: ResolutionKind;
	attack?: ActionAttackSpec;
	save?: ActionSaveSpec;
	damage?: ActionDamageSpec;
	healing?: ActionHealingSpec;
	appliesConditions?: string[];
	description?: string;
	actor?: ActionParticipantReferenceV2 | null;
	targets?: ActionParticipantReferenceV2[];
	actionEconomy?: ActionEconomyV2;
	resourceCosts?: ActionResourceCostV2[];
	conditionIntents?: TypedConditionIntentV2[];
	duration?: ConditionDurationV1 | null;
	concentration?: ActionConcentrationV2 | null;
	saveSuccessDamagePolicy?: SaveSuccessDamagePolicy;
	mitigationMode?: ActionMitigationMode;
	applicationGate?: ActionApplicationGate;
	automationState?: ConditionAutomationState;
	temporaryHitPoints?: { roll: string };
	legacy?: boolean;
}

const STORAGE_KEY = "solo-compendium.pending-resolution.v1";

const RESOLUTION_KINDS = new Set<ResolutionKind>([
	"attack",
	"save",
	"healing",
	"damage",
	"effect",
]);
const SOURCE_TYPES = new Set<ActionResolutionSourceType>([
	"spell",
	"Anomaly_action",
	"technique",
	"item",
	"artifact",
	"relic",
	"power",
	"rune",
]);
const ROLL_MODES = new Set<ActionRollMode>([
	"normal",
	"advantage",
	"disadvantage",
]);
const APPLICATION_GATES = new Set<ActionApplicationGate>([
	"always",
	"on-hit",
	"on-miss",
	"on-failed-save",
	"on-successful-save",
	"manual",
]);
const AUTOMATION_STATES = new Set<ConditionAutomationState>([
	"automated",
	"manual",
	"review-blocked",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function isCanonicalIdentifier(value: unknown): value is string {
	return isNonEmptyString(value) && value === value.trim();
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function validRollMode(value: unknown): boolean {
	return value === undefined || ROLL_MODES.has(value as ActionRollMode);
}

function validAttack(value: unknown): value is ActionAttackSpec {
	return (
		isRecord(value) &&
		isNonEmptyString(value.roll) &&
		validRollMode(value.rollMode) &&
		(value.forceCritical === undefined ||
			typeof value.forceCritical === "boolean") &&
		(value.critExtraDice === undefined ||
			(isFiniteNumber(value.critExtraDice) && value.critExtraDice >= 0))
	);
}

function validSave(value: unknown): value is ActionSaveSpec {
	return (
		isRecord(value) &&
		isFiniteNumber(value.dc) &&
		(value.ability === undefined || typeof value.ability === "string") &&
		(value.roll === undefined || isNonEmptyString(value.roll)) &&
		validRollMode(value.rollMode)
	);
}

function validDamage(value: unknown): value is ActionDamageSpec {
	return (
		isRecord(value) &&
		isNonEmptyString(value.roll) &&
		(value.type === undefined || typeof value.type === "string")
	);
}

function validHealing(value: unknown): value is ActionHealingSpec {
	return (
		isRecord(value) &&
		isNonEmptyString(value.roll) &&
		(value.mode === undefined ||
			value.mode === "hit-points" ||
			value.mode === "temporary-hit-points")
	);
}

function validDuration(value: unknown): value is ConditionDurationV1 {
	return isConditionDurationV1(value);
}

function validSource(value: unknown): value is ActionResolutionSource {
	return (
		isRecord(value) &&
		SOURCE_TYPES.has(value.type as ActionResolutionSourceType) &&
		isNonEmptyString(value.entryId)
	);
}

function validParticipant(
	value: unknown,
): value is ActionParticipantReferenceV2 {
	return (
		isRecord(value) &&
		isNonEmptyString(value.id) &&
		(value.name === undefined || typeof value.name === "string")
	);
}

function validConditionIntent(value: unknown): value is TypedConditionIntentV2 {
	if (!isRecord(value)) return false;
	return (
		isNonEmptyString(value.conditionId) &&
		APPLICATION_GATES.has(value.gate as ActionApplicationGate) &&
		validDuration(value.duration) &&
		isConditionStackingPolicy(value.stackingPolicy) &&
		isConditionRestPolicy(value.restPolicy) &&
		isConditionAutomationState(value.automationState) &&
		(value.save === undefined ||
			value.save === null ||
			isConditionSaveMetadataV1(value.save)) &&
		(value.source === undefined || isConditionSourceIdentityV1(value.source)) &&
		(value.concentrationId === undefined ||
			value.concentrationId === null ||
			isCanonicalIdentifier(value.concentrationId)) &&
		(value.notes === undefined ||
			value.notes === null ||
			typeof value.notes === "string") &&
		(value.legacy === undefined || typeof value.legacy === "boolean")
	);
}

function commonValidationErrors(value: Record<string, unknown>): string[] {
	const errors: string[] = [];
	if (!isNonEmptyString(value.id)) errors.push("id must be a non-empty string");
	if (!isNonEmptyString(value.name))
		errors.push("name must be a non-empty string");
	if (!validSource(value.source)) errors.push("source is invalid");
	if (!RESOLUTION_KINDS.has(value.kind as ResolutionKind)) {
		errors.push("kind is invalid");
	}
	if (value.attack !== undefined && !validAttack(value.attack)) {
		errors.push("attack is invalid");
	}
	if (value.save !== undefined && !validSave(value.save)) {
		errors.push("save is invalid");
	}
	if (value.damage !== undefined && !validDamage(value.damage)) {
		errors.push("damage is invalid");
	}
	if (value.healing !== undefined && !validHealing(value.healing)) {
		errors.push("healing is invalid");
	}
	if (value.kind === "attack" && !validAttack(value.attack)) {
		errors.push("attack kind requires attack data");
	}
	if (value.kind === "save" && !validSave(value.save)) {
		errors.push("save kind requires save data");
	}
	if (value.kind === "healing" && !validHealing(value.healing)) {
		errors.push("healing kind requires healing data");
	}
	if (value.kind === "damage" && !validDamage(value.damage)) {
		errors.push("damage kind requires damage data");
	}
	if (
		value.description !== undefined &&
		typeof value.description !== "string"
	) {
		errors.push("description must be a string");
	}
	return [...new Set(errors)];
}

export type ActionPayloadValidationResult =
	| {
			valid: true;
			payload: ActionResolutionPayloadV1 | ActionResolutionPayloadV2;
	  }
	| { valid: false; errors: string[] };

export function validateActionResolutionPayload(
	value: unknown,
): ActionPayloadValidationResult {
	if (!isRecord(value)) {
		return { valid: false, errors: ["payload must be an object"] };
	}
	if (value.version !== 1 && value.version !== 2) {
		return { valid: false, errors: ["payload version is unsupported"] };
	}
	const errors = commonValidationErrors(value);
	if (value.version === 1) {
		if (
			value.appliesConditions !== undefined &&
			(!Array.isArray(value.appliesConditions) ||
				!value.appliesConditions.every(isNonEmptyString))
		) {
			errors.push("appliesConditions must contain non-empty strings");
		}
		return errors.length > 0
			? { valid: false, errors }
			: { valid: true, payload: value as unknown as ActionResolutionPayloadV1 };
	}

	if (value.actor !== null && !validParticipant(value.actor)) {
		errors.push("actor must be null or a participant reference");
	}
	if (!Array.isArray(value.targets) || !value.targets.every(validParticipant)) {
		errors.push("targets must be participant references");
	}
	if (
		!isRecord(value.actionEconomy) ||
		![
			"action",
			"bonus-action",
			"reaction",
			"free",
			"movement",
			"special",
			"manual",
		].includes(value.actionEconomy.type as string) ||
		!isFiniteNumber(value.actionEconomy.cost) ||
		value.actionEconomy.cost < 0
	) {
		errors.push("actionEconomy is invalid");
	}
	if (
		!Array.isArray(value.resourceCosts) ||
		!value.resourceCosts.every(
			(cost) =>
				isRecord(cost) &&
				isNonEmptyString(cost.resourceId) &&
				isFiniteNumber(cost.amount) &&
				cost.amount >= 0 &&
				(cost.expectedBefore === undefined ||
					cost.expectedBefore === null ||
					isFiniteNumber(cost.expectedBefore)),
		)
	) {
		errors.push("resourceCosts are invalid");
	}
	if (
		!Array.isArray(value.conditionIntents) ||
		!value.conditionIntents.every(validConditionIntent)
	) {
		errors.push("conditionIntents are invalid");
	}
	if (value.duration !== null && !validDuration(value.duration)) {
		errors.push("duration is invalid");
	}
	if (
		value.concentration !== null &&
		(!isRecord(value.concentration) ||
			typeof value.concentration.required !== "boolean" ||
			(value.concentration.concentrationId !== null &&
				!isCanonicalIdentifier(value.concentration.concentrationId)) ||
			typeof value.concentration.breakExisting !== "boolean")
	) {
		errors.push("concentration is invalid");
	}
	if (
		!new Set(["none", "half", "full"]).has(
			value.saveSuccessDamagePolicy as string,
		)
	) {
		errors.push("saveSuccessDamagePolicy is invalid");
	}
	if (
		!new Set(["typed", "raw", "manual"]).has(value.mitigationMode as string)
	) {
		errors.push("mitigationMode is invalid");
	}
	if (!APPLICATION_GATES.has(value.applicationGate as ActionApplicationGate)) {
		errors.push("applicationGate is invalid");
	}
	if (
		!AUTOMATION_STATES.has(value.automationState as ConditionAutomationState)
	) {
		errors.push("automationState is invalid");
	}
	if (
		value.temporaryHitPoints !== undefined &&
		(!isRecord(value.temporaryHitPoints) ||
			!isNonEmptyString(value.temporaryHitPoints.roll))
	) {
		errors.push("temporaryHitPoints is invalid");
	}
	return errors.length > 0
		? { valid: false, errors }
		: { valid: true, payload: value as unknown as ActionResolutionPayloadV2 };
}

export function isActionResolutionPayload(
	value: unknown,
): value is ActionResolutionPayloadV1 | ActionResolutionPayloadV2 {
	return validateActionResolutionPayload(value).valid;
}

export function setPendingResolution(payload: ActionResolutionPayload): void {
	const validation = validateActionResolutionPayload(payload);
	if (!validation.valid) {
		throw new TypeError(
			`Invalid action resolution payload: ${validation.errors.join("; ")}`,
		);
	}
	sessionStorage.setItem(STORAGE_KEY, JSON.stringify(validation.payload));
}

export function getPendingResolution(): ActionResolutionPayload | null {
	let raw: string | null;
	try {
		raw = sessionStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
	if (!raw) return null;
	try {
		const validation = validateActionResolutionPayload(JSON.parse(raw));
		return validation.valid ? validation.payload : null;
	} catch {
		return null;
	}
}

export function clearPendingResolution(): void {
	sessionStorage.removeItem(STORAGE_KEY);
}

function sourceTypeForCondition(
	type: ActionResolutionSourceType,
): ConditionSourceIdentityV1["type"] {
	if (type === "spell") return "spell";
	if (
		type === "item" ||
		type === "artifact" ||
		type === "relic" ||
		type === "rune"
	) {
		return "item";
	}
	return "feature";
}

function legacyConditionIntent(conditionId: string): TypedConditionIntentV2 {
	return {
		conditionId: conditionId.trim().toLowerCase(),
		gate: "always",
		duration: {
			unit: "manual",
			anchor: "manual",
			value: null,
			remaining: null,
		},
		stackingPolicy: "stack",
		restPolicy: "remove-on-long-rest",
		automationState: "manual",
		legacy: true,
	};
}

/** Validate and migrate either wire version into the executable v2 contract. */
export function normalizeActionResolutionPayload(
	value: unknown,
): ActionResolutionPayloadV2 | null {
	const validation = validateActionResolutionPayload(value);
	if (!validation.valid) return null;
	if (validation.payload.version === 2) {
		return JSON.parse(
			JSON.stringify(validation.payload),
		) as ActionResolutionPayloadV2;
	}
	const payload = validation.payload;
	return {
		version: 2,
		id: payload.id,
		name: payload.name,
		source: { ...payload.source },
		kind: payload.kind,
		actor: null,
		targets: [],
		actionEconomy: { type: "manual", cost: 0 },
		resourceCosts: [],
		conditionIntents: (payload.appliesConditions ?? []).map(
			legacyConditionIntent,
		),
		duration: null,
		concentration: null,
		saveSuccessDamagePolicy: "none",
		mitigationMode: "typed",
		applicationGate: "always",
		automationState: "automated",
		attack: payload.attack ? { ...payload.attack } : undefined,
		save: payload.save ? { ...payload.save } : undefined,
		damage: payload.damage ? { ...payload.damage } : undefined,
		healing: payload.healing ? { ...payload.healing } : undefined,
		description: payload.description,
		legacy: true,
	};
}

export const migrateActionResolutionPayloadV1 =
	normalizeActionResolutionPayload;

export type ResolutionOutcome =
	| {
			kind: "attack";
			attackRoll: number;
			attackTotal: number;
			attackMode: ActionRollMode;
			attackD20: [number] | [number, number];
			targetAC: number;
			hit: boolean;
			criticalHit?: boolean;
			damageTotal?: number;
			damageRolls?: number[];
	  }
	| {
			kind: "save";
			saveRoll: number;
			saveTotal: number;
			saveMode: ActionRollMode;
			saveD20: [number] | [number, number];
			dc: number;
			success: boolean;
			damageTotal?: number;
			damageRolls?: number[];
	  }
	| { kind: "healing"; healingTotal: number; healingRolls: number[] }
	| { kind: "damage"; damageTotal: number; damageRolls: number[] }
	| { kind: "effect"; name: string; description?: string };

function parseD20Modifier(roll: string): number | null {
	const normalized = roll.replace(/\s+/g, "");
	const match = normalized.match(/^1d20([+-]\d+)?$/i);
	if (!match) return null;
	return match[1] ? parseInt(match[1], 10) : 0;
}

function rollD20WithMode(
	modifier: number,
	mode: ActionRollMode,
): { d20: number; total: number; result: number; rolls: number[] } {
	if (mode === "normal") {
		const roll = rollCheck(modifier, "normal");
		const d20 = roll.rolls[0] ?? 0;
		return { d20, total: d20, result: roll.total, rolls: [d20] };
	}
	const first = rollCheck(modifier, "normal");
	const second = rollCheck(modifier, "normal");
	const firstD20 = first.rolls[0] ?? 0;
	const secondD20 = second.rolls[0] ?? 0;
	const d20 =
		mode === "advantage"
			? Math.max(firstD20, secondD20)
			: Math.min(firstD20, secondD20);
	return {
		d20,
		total: d20,
		result: d20 + modifier,
		rolls: [firstD20, secondD20],
	};
}

function outcomeD20(roll: {
	total: number;
	rolls?: number[];
}): [number] | [number, number] {
	return roll.rolls?.length === 2
		? [roll.rolls[0], roll.rolls[1]]
		: [roll.rolls?.[0] ?? roll.total];
}

export function resolveAttack(
	payload: ActionResolutionPayload,
	targetAC: number,
): ResolutionOutcome {
	if (!payload.attack) throw new Error("Missing attack payload");
	const mode = payload.attack.rollMode ?? "normal";
	const d20Modifier = parseD20Modifier(payload.attack.roll);
	const isStandardD20 = d20Modifier !== null;
	const attack = isStandardD20
		? rollD20WithMode(d20Modifier, mode)
		: rollDiceString(payload.attack.roll);
	const naturalD20 = isStandardD20
		? (attack as { d20?: number }).d20
		: undefined;
	const automaticMiss = naturalD20 === 1 && !payload.attack.forceCritical;
	const isCritical =
		!automaticMiss &&
		(Boolean(payload.attack.forceCritical) || naturalD20 === 20);
	const hit = !automaticMiss && (isCritical || attack.result >= targetAC);

	if (!hit || !payload.damage) {
		return {
			kind: "attack",
			attackRoll: attack.total,
			attackTotal: attack.result,
			attackMode: mode,
			attackD20: outcomeD20(attack),
			targetAC,
			hit,
			criticalHit: isCritical && hit,
		};
	}
	const damage = rollDamageFormula(
		payload.damage.roll,
		isCritical,
		payload.attack.critExtraDice ?? 0,
	);
	return {
		kind: "attack",
		attackRoll: attack.total,
		attackTotal: attack.result,
		attackMode: mode,
		attackD20: outcomeD20(attack),
		targetAC,
		hit,
		criticalHit: isCritical,
		damageTotal: damage.result,
		damageRolls: damage.rolls,
	};
}

export function resolveSave(
	payload: ActionResolutionPayload,
): ResolutionOutcome {
	if (!payload.save) throw new Error("Missing save payload");
	const mode = payload.save.rollMode ?? "normal";
	const rollFormula = payload.save.roll ?? "1d20";
	const d20Modifier = parseD20Modifier(rollFormula);
	const save =
		d20Modifier !== null
			? rollD20WithMode(d20Modifier, mode)
			: rollDiceString(rollFormula);
	const base = {
		kind: "save" as const,
		saveRoll: save.total,
		saveTotal: save.result,
		saveMode: mode,
		saveD20: outcomeD20(save),
		dc: payload.save.dc,
		success: save.result >= payload.save.dc,
	};
	if (!payload.damage) return base;
	const damage = rollDiceString(payload.damage.roll);
	return {
		...base,
		damageTotal: damage.result,
		damageRolls: damage.rolls,
	};
}

export function resolveHealing(
	payload: ActionResolutionPayload,
): ResolutionOutcome {
	if (!payload.healing) throw new Error("Missing healing payload");
	const healing = rollDiceString(payload.healing.roll);
	return {
		kind: "healing",
		healingTotal: healing.result,
		healingRolls: healing.rolls,
	};
}

export function resolveDamage(
	payload: ActionResolutionPayload,
): ResolutionOutcome {
	if (!payload.damage) throw new Error("Missing damage payload");
	const damage = rollDiceString(payload.damage.roll);
	return {
		kind: "damage",
		damageTotal: damage.result,
		damageRolls: damage.rolls,
	};
}

export function resolveEffect(
	payload: ActionResolutionPayload,
): ResolutionOutcome {
	return {
		kind: "effect",
		name: payload.name,
		description: payload.description,
	};
}

export type ActionConditionState = string | ConditionEntry;

export interface ActionParticipantState {
	id: string;
	name?: string;
	conditions?: readonly ActionConditionState[];
	exhaustionLevel?: number;
	resources?: Readonly<Record<string, number>>;
	concentrationId?: string | null;
}

export interface ActionTargetState extends ActionParticipantState {
	armorClass?: number;
	ac?: number;
	hitPoints?: number;
	hp?: number;
	maxHitPoints?: number;
	maxHp?: number;
	temporaryHitPoints?: number;
	mitigation?: DamageMitigationProfile | null;
	damageResistances?: string[];
	damageImmunities?: string[];
	damageVulnerabilities?: string[];
	conditionImmunities?: string[];
}

export interface ActionResolutionContext {
	actor?: ActionParticipantState | null;
	target: ActionTargetState;
	targetAC?: number;
}

export interface ResolveActionInput extends ActionResolutionContext {
	payload: ActionResolutionPayload;
}

export interface ActionResolutionPreview {
	payload: ActionResolutionPayloadV2;
	actorId: string | null;
	targetId: string;
	attackMode: ActionRollMode;
	saveMode: ActionRollMode;
	attackAutoFail: boolean;
	saveAutoFail: boolean;
	legacyPayload: boolean;
	legacyConditions: string[];
	blockers: string[];
}

export type ActionStateChangeIntent =
	| {
			type: "hit-points";
			targetId: string;
			delta: number;
			expectedBefore: number | null;
			after: number | null;
	  }
	| {
			type: "temporary-hit-points";
			targetId: string;
			delta: number;
			expectedBefore: number;
			after: number;
	  }
	| {
			type: "condition";
			targetId: string;
			application: ConditionApplicationV1;
			gate: ActionApplicationGate;
			legacy: boolean;
	  }
	| {
			type: "resource-cost";
			actorId: string;
			resourceId: string;
			amount: number;
			expectedBefore: number | null;
			after: number | null;
	  }
	| {
			type: "concentration";
			actorId: string;
			operation: "start" | "replace";
			concentrationId: string;
			previousConcentrationId: string | null;
	  };

export interface ConditionApplicationDecision {
	conditionId: string;
	gate: ActionApplicationGate;
	status: "apply" | "skipped-gate" | "immune" | "manual" | "review-blocked";
	legacy: boolean;
	application: ConditionApplicationV1 | null;
}

export interface ActionApplicationResult {
	gateSatisfied: boolean;
	damage: DamageApplicationResult | null;
	damageAfterSavePolicy: number;
	temporaryHitPointsAbsorbed: number;
	healingApplied: number;
	temporaryHitPointsGranted: number;
	conditions: ConditionApplicationDecision[];
	stateChangeIntents: ActionStateChangeIntent[];
	blockers: string[];
}

export interface ResolveActionResult {
	preview: ActionResolutionPreview;
	outcome: ResolutionOutcome;
	application: ActionApplicationResult;
	stateChangeIntents: ActionStateChangeIntent[];
}

function conditionStateNames(
	values: readonly ActionConditionState[] | undefined,
): {
	names: string[];
	legacy: string[];
} {
	const names: string[] = [];
	const legacy: string[] = [];
	for (const value of values ?? []) {
		if (typeof value === "string") {
			const normalized = value.trim().toLowerCase();
			if (!normalized) continue;
			names.push(normalized);
			legacy.push(normalized);
			continue;
		}
		if (value.isActive) names.push(value.conditionName.trim().toLowerCase());
	}
	return { names, legacy };
}

function mergeAdvantageStates(...states: AdvantageState[]): ActionRollMode {
	const hasAdvantage = states.includes("advantage");
	const hasDisadvantage = states.includes("disadvantage");
	if (hasAdvantage === hasDisadvantage) return "normal";
	return hasAdvantage ? "advantage" : "disadvantage";
}

function saveRollTypes(
	ability: string | undefined,
): Array<"saving_throws" | "AGI_saves" | "STR_saves"> {
	const normalized = ability?.trim().toLowerCase();
	if (["agi", "agility", "dex", "dexterity"].includes(normalized ?? "")) {
		return ["saving_throws", "AGI_saves"];
	}
	if (["str", "strength"].includes(normalized ?? "")) {
		return ["saving_throws", "STR_saves"];
	}
	return ["saving_throws"];
}

function normalizeResolveArguments(
	inputOrPayload: ResolveActionInput | ActionResolutionPayload,
	context?: ActionResolutionContext,
): ResolveActionInput {
	if ("payload" in inputOrPayload && "target" in inputOrPayload) {
		return inputOrPayload;
	}
	if (!context) throw new TypeError("resolveAction requires a target context");
	return { payload: inputOrPayload, ...context };
}

export function previewAction(
	input: ResolveActionInput,
): ActionResolutionPreview;
export function previewAction(
	payload: ActionResolutionPayload,
	context: ActionResolutionContext,
): ActionResolutionPreview;
export function previewAction(
	inputOrPayload: ResolveActionInput | ActionResolutionPayload,
	context?: ActionResolutionContext,
): ActionResolutionPreview {
	const input = normalizeResolveArguments(inputOrPayload, context);
	const payload = normalizeActionResolutionPayload(input.payload);
	if (!payload) throw new TypeError("Invalid action resolution payload");
	const actorConditions = conditionStateNames(input.actor?.conditions);
	const targetConditions = conditionStateNames(input.target.conditions);
	const actorAttack = resolveRollModifiers(
		actorConditions.names,
		input.actor?.exhaustionLevel ?? 0,
		"attack_rolls",
	);
	const incomingAttack = resolveIncomingAttackModifiers(targetConditions.names);
	const attackMode = mergeAdvantageStates(
		payload.attack?.rollMode ?? "normal",
		actorAttack.advantageState,
		incomingAttack,
	);
	const saveModifiers = saveRollTypes(payload.save?.ability).map((rollType) =>
		resolveRollModifiers(
			targetConditions.names,
			input.target.exhaustionLevel ?? 0,
			rollType,
		),
	);
	const saveMode = mergeAdvantageStates(
		payload.save?.rollMode ?? "normal",
		...saveModifiers.map((modifier) => modifier.advantageState),
	);
	const blockers: string[] = [];
	if (payload.automationState === "review-blocked") {
		blockers.push("Action payload is review-blocked.");
	}
	if (payload.applicationGate === "manual") {
		blockers.push("Action application requires a manual gate decision.");
	}
	return {
		payload: {
			...payload,
			attack: payload.attack
				? { ...payload.attack, rollMode: attackMode }
				: undefined,
			save: payload.save ? { ...payload.save, rollMode: saveMode } : undefined,
		},
		actorId: input.actor?.id ?? payload.actor?.id ?? null,
		targetId: input.target.id,
		attackMode,
		saveMode,
		attackAutoFail:
			actorAttack.autoFail || actorAttack.isIncapacitated || actorAttack.isDead,
		saveAutoFail: saveModifiers.some(
			(modifier) => modifier.autoFail || modifier.isDead,
		),
		legacyPayload: payload.legacy === true,
		legacyConditions: [...actorConditions.legacy, ...targetConditions.legacy],
		blockers,
	};
}

function gateSatisfied(
	gate: ActionApplicationGate,
	outcome: ResolutionOutcome,
): boolean {
	switch (gate) {
		case "always":
			return true;
		case "on-hit":
			return outcome.kind === "attack" && outcome.hit;
		case "on-miss":
			return outcome.kind === "attack" && !outcome.hit;
		case "on-failed-save":
			return outcome.kind === "save" && !outcome.success;
		case "on-successful-save":
			return outcome.kind === "save" && outcome.success;
		case "manual":
			return false;
	}
}

function rawDamageForOutcome(
	outcome: ResolutionOutcome,
	policy: SaveSuccessDamagePolicy,
): number {
	if (outcome.kind === "attack") {
		return outcome.hit ? (outcome.damageTotal ?? 0) : 0;
	}
	if (outcome.kind === "save") {
		const raw = outcome.damageTotal ?? 0;
		if (!outcome.success) return raw;
		if (policy === "full") return raw;
		if (policy === "half") return Math.floor(raw / 2);
		return 0;
	}
	if (outcome.kind === "damage") return outcome.damageTotal;
	return 0;
}

function targetHitPoints(target: ActionTargetState): number | null {
	const value = target.hitPoints ?? target.hp;
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function targetMaxHitPoints(target: ActionTargetState): number | null {
	const value = target.maxHitPoints ?? target.maxHp;
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function targetMitigation(
	target: ActionTargetState,
): DamageMitigationProfile | null {
	return (
		target.mitigation ?? {
			resistances: target.damageResistances ?? [],
			immunities: target.damageImmunities ?? [],
			vulnerabilities: target.damageVulnerabilities ?? [],
		}
	);
}

function applicationSource(
	payload: ActionResolutionPayloadV2,
	actorId: string | null,
): ConditionSourceIdentityV1 {
	return {
		type: sourceTypeForCondition(payload.source.type),
		id: payload.source.entryId,
		name: payload.name,
		actorId,
	};
}

function resolvedConcentrationId(
	payload: ActionResolutionPayloadV2,
): string | null {
	if (!payload.concentration?.required) return null;
	return payload.concentration.concentrationId ?? payload.id.trim();
}

function conditionDecisions(
	payload: ActionResolutionPayloadV2,
	outcome: ResolutionOutcome,
	target: ActionTargetState,
	actorId: string | null,
): {
	decisions: ConditionApplicationDecision[];
	intents: ActionStateChangeIntent[];
	blockers: string[];
} {
	const immunities = new Set(
		(target.conditionImmunities ?? []).map((condition) =>
			condition.trim().toLowerCase(),
		),
	);
	const decisions: ConditionApplicationDecision[] = [];
	const intents: ActionStateChangeIntent[] = [];
	const blockers: string[] = [];
	for (const intent of payload.conditionIntents) {
		const conditionId = intent.conditionId.trim().toLowerCase();
		const legacy = intent.legacy === true;
		if (intent.gate === "manual") {
			decisions.push({
				conditionId,
				gate: intent.gate,
				status: "manual",
				legacy,
				application: null,
			});
			blockers.push(`${conditionId} requires a manual application decision.`);
			continue;
		}
		if (!gateSatisfied(intent.gate, outcome)) {
			decisions.push({
				conditionId,
				gate: intent.gate,
				status: "skipped-gate",
				legacy,
				application: null,
			});
			continue;
		}
		if (immunities.has(conditionId)) {
			decisions.push({
				conditionId,
				gate: intent.gate,
				status: "immune",
				legacy,
				application: null,
			});
			continue;
		}
		if (intent.automationState === "review-blocked") {
			decisions.push({
				conditionId,
				gate: intent.gate,
				status: "review-blocked",
				legacy,
				application: null,
			});
			blockers.push(`${conditionId} is review-blocked.`);
			continue;
		}
		const application = createConditionApplicationV1({
			conditionId,
			source: intent.source ?? applicationSource(payload, actorId),
			duration: intent.duration,
			save: intent.save,
			stackingPolicy: intent.stackingPolicy,
			restPolicy: intent.restPolicy,
			automationState: intent.automationState,
			concentrationId:
				intent.concentrationId ?? resolvedConcentrationId(payload),
			notes: intent.notes,
			legacy,
		});
		decisions.push({
			conditionId,
			gate: intent.gate,
			status: "apply",
			legacy,
			application,
		});
		intents.push({
			type: "condition",
			targetId: target.id,
			application,
			gate: intent.gate,
			legacy,
		});
	}
	return { decisions, intents, blockers };
}

export function resolveAction(input: ResolveActionInput): ResolveActionResult;
export function resolveAction(
	payload: ActionResolutionPayload,
	context: ActionResolutionContext,
): ResolveActionResult;
export function resolveAction(
	inputOrPayload: ResolveActionInput | ActionResolutionPayload,
	context?: ActionResolutionContext,
): ResolveActionResult {
	const input = normalizeResolveArguments(inputOrPayload, context);
	const preview = previewAction(input);
	const payload = preview.payload;
	const targetAC =
		input.targetAC ?? input.target.armorClass ?? input.target.ac ?? 10;
	let outcome =
		payload.kind === "attack"
			? resolveAttack(payload, targetAC)
			: payload.kind === "save"
				? resolveSave(payload)
				: payload.kind === "healing"
					? resolveHealing(payload)
					: payload.kind === "effect"
						? resolveEffect(payload)
						: resolveDamage(payload);
	if (outcome.kind === "attack" && preview.attackAutoFail) {
		outcome = {
			...outcome,
			hit: false,
			criticalHit: false,
			damageTotal: undefined,
			damageRolls: undefined,
		};
	}
	if (outcome.kind === "save" && preview.saveAutoFail) {
		outcome = { ...outcome, success: false };
	}

	const topLevelGate = gateSatisfied(payload.applicationGate, outcome);
	const blockers = [...preview.blockers];
	const stateChangeIntents: ActionStateChangeIntent[] = [];
	const conditions = conditionDecisions(
		payload,
		outcome,
		input.target,
		preview.actorId,
	);
	blockers.push(...conditions.blockers);
	if (topLevelGate) stateChangeIntents.push(...conditions.intents);

	const rawDamage = topLevelGate
		? rawDamageForOutcome(outcome, payload.saveSuccessDamagePolicy)
		: 0;
	let damage: DamageApplicationResult | null = null;
	let damageAfterSavePolicy = rawDamage;
	let temporaryHitPointsAbsorbed = 0;
	if (rawDamage > 0) {
		if (payload.mitigationMode === "manual") {
			blockers.push("Damage mitigation requires a manual decision.");
		} else {
			damage = applyDamageMitigation({
				rawDamage,
				damageType: payload.damage?.type,
				mitigation: targetMitigation(input.target),
				mode: payload.mitigationMode,
			});
			if (
				payload.mitigationMode === "typed" &&
				hasAllDamageResistance(
					conditionStateNames(input.target.conditions).names,
				) &&
				!damage.immunityApplied &&
				!damage.resistanceApplied
			) {
				damage = {
					...damage,
					finalDamage: Math.floor(damage.finalDamage / 2),
					resistanceApplied: true,
					summary: "Petrified resistance halved the damage.",
				};
			}
			damageAfterSavePolicy = damage.finalDamage;
			const temporaryBefore = Math.max(
				0,
				Math.floor(input.target.temporaryHitPoints ?? 0),
			);
			temporaryHitPointsAbsorbed = Math.min(
				temporaryBefore,
				damage.finalDamage,
			);
			if (temporaryHitPointsAbsorbed > 0) {
				stateChangeIntents.push({
					type: "temporary-hit-points",
					targetId: input.target.id,
					delta: -temporaryHitPointsAbsorbed,
					expectedBefore: temporaryBefore,
					after: temporaryBefore - temporaryHitPointsAbsorbed,
				});
			}
			const hpDamage = damage.finalDamage - temporaryHitPointsAbsorbed;
			if (hpDamage > 0) {
				const before = targetHitPoints(input.target);
				stateChangeIntents.push({
					type: "hit-points",
					targetId: input.target.id,
					delta: -hpDamage,
					expectedBefore: before,
					after: before === null ? null : Math.max(0, before - hpDamage),
				});
			}
		}
	}

	let healingApplied = 0;
	let temporaryHitPointsGranted = 0;
	if (topLevelGate && outcome.kind === "healing") {
		if (payload.healing?.mode === "temporary-hit-points") {
			temporaryHitPointsGranted = outcome.healingTotal;
		} else {
			const before = targetHitPoints(input.target);
			const maximum = targetMaxHitPoints(input.target);
			healingApplied =
				before !== null && maximum !== null
					? Math.max(0, Math.min(outcome.healingTotal, maximum - before))
					: outcome.healingTotal;
			if (healingApplied > 0) {
				stateChangeIntents.push({
					type: "hit-points",
					targetId: input.target.id,
					delta: healingApplied,
					expectedBefore: before,
					after: before === null ? null : before + healingApplied,
				});
			}
		}
	}
	if (topLevelGate && payload.temporaryHitPoints) {
		temporaryHitPointsGranted = Math.max(
			temporaryHitPointsGranted,
			rollDiceString(payload.temporaryHitPoints.roll).result,
		);
	}
	if (topLevelGate && temporaryHitPointsGranted > 0) {
		const before = Math.max(
			0,
			Math.floor(input.target.temporaryHitPoints ?? 0),
		);
		const after = Math.max(before, temporaryHitPointsGranted);
		if (after !== before) {
			stateChangeIntents.push({
				type: "temporary-hit-points",
				targetId: input.target.id,
				delta: after - before,
				expectedBefore: before,
				after,
			});
		}
	}

	if (topLevelGate) {
		for (const cost of payload.resourceCosts) {
			if (!preview.actorId) {
				blockers.push(`Resource ${cost.resourceId} has no actor identity.`);
				continue;
			}
			const before = input.actor?.resources?.[cost.resourceId];
			if (typeof before !== "number" || !Number.isFinite(before)) {
				blockers.push(`Current balance for ${cost.resourceId} is required.`);
				continue;
			}
			if (before < cost.amount) {
				blockers.push(`Insufficient ${cost.resourceId} resource.`);
				continue;
			}
			stateChangeIntents.push({
				type: "resource-cost",
				actorId: preview.actorId,
				resourceId: cost.resourceId,
				amount: cost.amount,
				expectedBefore: before,
				after: before - cost.amount,
			});
		}
		if (payload.concentration?.required) {
			const concentrationId =
				resolvedConcentrationId(payload) ?? payload.id.trim();
			if (!preview.actorId) {
				blockers.push("Concentration requires an actor identity.");
			} else if (
				input.actor?.concentrationId &&
				!payload.concentration.breakExisting
			) {
				blockers.push("Starting concentration would replace an active effect.");
			} else {
				stateChangeIntents.unshift({
					type: "concentration",
					actorId: preview.actorId,
					operation: input.actor?.concentrationId ? "replace" : "start",
					concentrationId,
					previousConcentrationId: input.actor?.concentrationId ?? null,
				});
			}
		}
	}

	const application: ActionApplicationResult = {
		gateSatisfied: topLevelGate,
		damage,
		damageAfterSavePolicy,
		temporaryHitPointsAbsorbed,
		healingApplied,
		temporaryHitPointsGranted,
		conditions: conditions.decisions,
		stateChangeIntents,
		blockers,
	};
	return {
		preview,
		outcome,
		application,
		stateChangeIntents,
	};
}
