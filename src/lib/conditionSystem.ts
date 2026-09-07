import type { Json } from "@/integrations/supabase/types";
import {
	type ConditionAutomationState,
	getConditionEffect,
	normalizeConditionId,
} from "./conditionEffects";

export const CONDITION_APPLICATION_VERSION = 1 as const;
export const CONDITION_LIFECYCLE_VERSION = 1 as const;

export type ConditionSourceType =
	| "spell"
	| "feature"
	| "item"
	| "manual"
	| "regent"
	| "environment";

export type ConditionDurationUnit =
	| "round"
	| "turn"
	| "rest"
	| "concentration"
	| "indefinite"
	| "manual";

export type ConditionDurationAnchor =
	| "round"
	| "round-end"
	| "turn-start"
	| "turn-end"
	| "short-rest"
	| "long-rest"
	| "rest"
	| "concentration"
	| "manual";

export type ConditionDurationV1 = {
	unit: ConditionDurationUnit;
	anchor: ConditionDurationAnchor;
	value: number | null;
	remaining: number | null;
};

export type ConditionSaveMetadataV1 = {
	ability: string;
	dc: number | null;
	endsOnSuccess: boolean;
	repeat: {
		enabled: boolean;
		anchor: "turn-start" | "turn-end" | "round-end" | "manual";
	} | null;
};

export type ConditionStackingPolicy =
	| "refresh"
	| "replace"
	| "stack"
	| "ignore";

export type ConditionRestPolicy =
	| "persist"
	| "remove-on-short-rest"
	| "remove-on-long-rest"
	| "remove-on-rest"
	| "manual";

export type ConditionSourceIdentityV1 = {
	type: ConditionSourceType;
	id: string | null;
	name: string;
	actorId: string | null;
};

export type ConditionApplicationV1 = {
	version: typeof CONDITION_APPLICATION_VERSION;
	conditionId: string;
	source: ConditionSourceIdentityV1;
	duration: ConditionDurationV1;
	save: ConditionSaveMetadataV1 | null;
	stackingPolicy: ConditionStackingPolicy;
	restPolicy: ConditionRestPolicy;
	automationState: ConditionAutomationState;
	concentrationId: string | null;
	notes: string | null;
	/** True when adapted from an untyped string payload or timer. */
	legacy: boolean;
};

export interface ConditionEntry {
	id: string;
	conditionName: string;
	sourceType: ConditionSourceType;
	sourceId: string | null;
	sourceName: string;
	appliedAt: string;
	durationRounds: number | null;
	remainingRounds: number | null;
	concentrationSpellId: string | null;
	isActive: boolean;
	notes?: string;
	/** Additive v1 lifecycle metadata; legacy persisted entries may omit it. */
	version?: typeof CONDITION_APPLICATION_VERSION;
	conditionId?: string;
	sourceIdentity?: ConditionSourceIdentityV1;
	duration?: ConditionDurationV1;
	save?: ConditionSaveMetadataV1 | null;
	stackingPolicy?: ConditionStackingPolicy;
	restPolicy?: ConditionRestPolicy;
	automationState?: ConditionAutomationState;
	legacy?: boolean;
	[key: string]: Json | undefined;
}

export type ConditionChangeType =
	| "added"
	| "removed"
	| "expired"
	| "concentration_broken"
	| "refreshed"
	| "replaced"
	| "ignored"
	| "save_succeeded";

export interface ConditionChange {
	type: ConditionChangeType;
	condition: ConditionEntry;
	round?: number;
	previousCondition?: ConditionEntry;
}

export type ConditionRuntimeOptions = {
	id?: string;
	appliedAt?: string;
	idFactory?: () => string;
	now?: () => Date | string | number;
};

export type LegacyApplyConditionOptions = ConditionRuntimeOptions & {
	sourceId?: string;
	sourceActorId?: string;
	durationRounds?: number;
	concentrationSpellId?: string;
	notes?: string;
	duration?: ConditionDurationV1;
	save?: ConditionSaveMetadataV1 | null;
	stackingPolicy?: ConditionStackingPolicy;
	restPolicy?: ConditionRestPolicy;
	automationState?: ConditionAutomationState;
	legacy?: boolean;
};

export interface ApplyConditionResult {
	conditions: ConditionEntry[];
	change: ConditionChange;
	changes: ConditionChange[];
}

function resolveAppliedAt(options: ConditionRuntimeOptions): string {
	if (options.appliedAt) return options.appliedAt;
	const value = options.now?.() ?? new Date();
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime())
		? new Date(0).toISOString()
		: date.toISOString();
}

function createEntryId(
	options: ConditionRuntimeOptions,
	prefix = "cond",
): string {
	if (options.id) return options.id;
	if (options.idFactory) return options.idFactory();
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeCount(value: number | null): number | null {
	if (value === null) return null;
	if (!Number.isFinite(value)) return null;
	return Math.max(0, Math.floor(value));
}

function normalizeDuration(duration: ConditionDurationV1): ConditionDurationV1 {
	const value = normalizeCount(duration.value);
	const remaining = normalizeCount(duration.remaining);
	return {
		unit: duration.unit,
		anchor: duration.anchor,
		value,
		remaining,
	};
}

export function createConditionApplicationV1(input: {
	conditionId: string;
	source: ConditionSourceIdentityV1;
	duration: ConditionDurationV1;
	save?: ConditionSaveMetadataV1 | null;
	stackingPolicy?: ConditionStackingPolicy;
	restPolicy?: ConditionRestPolicy;
	automationState?: ConditionAutomationState;
	concentrationId?: string | null;
	notes?: string | null;
	legacy?: boolean;
}): ConditionApplicationV1 {
	const conditionId = normalizeConditionId(input.conditionId);
	return {
		version: CONDITION_APPLICATION_VERSION,
		conditionId,
		source: {
			type: input.source.type,
			id: input.source.id?.trim() || null,
			name: input.source.name.trim() || "Unknown source",
			actorId: input.source.actorId?.trim() || null,
		},
		duration: normalizeDuration(input.duration),
		save: input.save
			? {
					ability: input.save.ability.trim(),
					dc:
						typeof input.save.dc === "number" && Number.isFinite(input.save.dc)
							? input.save.dc
							: null,
					endsOnSuccess: input.save.endsOnSuccess,
					repeat: input.save.repeat
						? {
								enabled: input.save.repeat.enabled,
								anchor: input.save.repeat.anchor,
							}
						: null,
				}
			: null,
		stackingPolicy: input.stackingPolicy ?? "stack",
		restPolicy: input.restPolicy ?? "remove-on-long-rest",
		automationState:
			input.automationState ??
			getConditionEffect(conditionId)?.automationState ??
			"manual",
		concentrationId: input.concentrationId?.trim() || null,
		notes: input.notes?.trim() || null,
		legacy: input.legacy ?? false,
	};
}

function legacyApplication(
	conditionName: string,
	sourceType: ConditionSourceType,
	sourceName: string,
	options: LegacyApplyConditionOptions,
): ConditionApplicationV1 {
	const hasRoundDuration = options.durationRounds !== undefined;
	const roundCount = hasRoundDuration
		? normalizeCount(options.durationRounds ?? null)
		: null;
	return createConditionApplicationV1({
		conditionId: conditionName,
		source: {
			type: sourceType,
			id: options.sourceId ?? null,
			name: sourceName,
			actorId: options.sourceActorId ?? null,
		},
		duration:
			options.duration ??
			(hasRoundDuration
				? {
						unit: "round",
						anchor: "round",
						value: roundCount,
						remaining: roundCount,
					}
				: {
						unit: "indefinite",
						anchor: "manual",
						value: null,
						remaining: null,
					}),
		save: options.save,
		stackingPolicy: options.stackingPolicy ?? "stack",
		restPolicy: options.restPolicy ?? "remove-on-long-rest",
		automationState: options.automationState,
		concentrationId: options.concentrationSpellId ?? null,
		notes: options.notes ?? null,
		legacy: options.legacy ?? true,
	});
}

function entryFromApplication(
	application: ConditionApplicationV1,
	options: ConditionRuntimeOptions,
): ConditionEntry {
	const duration = normalizeDuration(application.duration);
	const durationRounds = duration.unit === "round" ? duration.value : null;
	const remainingRounds = duration.unit === "round" ? duration.remaining : null;
	return {
		id: createEntryId(options),
		conditionName: application.conditionId,
		sourceType: application.source.type,
		sourceId: application.source.id,
		sourceName: application.source.name,
		appliedAt: resolveAppliedAt(options),
		durationRounds,
		remainingRounds,
		concentrationSpellId: application.concentrationId,
		isActive: true,
		notes: application.notes ?? undefined,
		version: CONDITION_APPLICATION_VERSION,
		conditionId: application.conditionId,
		sourceIdentity: application.source,
		duration,
		save: application.save,
		stackingPolicy: application.stackingPolicy,
		restPolicy: application.restPolicy,
		automationState: application.automationState,
		legacy: application.legacy,
	};
}

function sourceIdentityForEntry(
	entry: ConditionEntry,
): ConditionSourceIdentityV1 {
	return (
		entry.sourceIdentity ?? {
			type: entry.sourceType,
			id: entry.sourceId,
			name: entry.sourceName,
			actorId: null,
		}
	);
}

function sameSource(
	entry: ConditionEntry,
	application: ConditionApplicationV1,
): boolean {
	const source = sourceIdentityForEntry(entry);
	return (
		source.type === application.source.type &&
		source.id === application.source.id &&
		source.actorId === application.source.actorId &&
		source.name === application.source.name
	);
}

export function applyCondition(
	conditions: ConditionEntry[],
	application: ConditionApplicationV1,
	options?: ConditionRuntimeOptions,
): ApplyConditionResult;
export function applyCondition(
	conditions: ConditionEntry[],
	conditionName: string,
	sourceType: ConditionSourceType,
	sourceName: string,
	options?: LegacyApplyConditionOptions,
): ApplyConditionResult;
export function applyCondition(
	conditions: ConditionEntry[],
	conditionOrApplication: string | ConditionApplicationV1,
	sourceTypeOrOptions?: ConditionSourceType | ConditionRuntimeOptions,
	sourceName?: string,
	legacyOptions: LegacyApplyConditionOptions = {},
): ApplyConditionResult {
	const typed = typeof conditionOrApplication !== "string";
	const options = typed
		? ((sourceTypeOrOptions as ConditionRuntimeOptions | undefined) ?? {})
		: legacyOptions;
	const application = typed
		? createConditionApplicationV1(conditionOrApplication)
		: legacyApplication(
				conditionOrApplication,
				sourceTypeOrOptions as ConditionSourceType,
				sourceName ?? "Unknown source",
				legacyOptions,
			);
	const entry = entryFromApplication(application, options);
	const matchingName = conditions.filter(
		(condition) =>
			condition.isActive &&
			normalizeConditionId(condition.conditionName) === application.conditionId,
	);
	const duplicate = matchingName.find((condition) =>
		sameSource(condition, application),
	);

	if (application.stackingPolicy === "ignore" && duplicate) {
		const change: ConditionChange = { type: "ignored", condition: duplicate };
		return { conditions, change, changes: [change] };
	}

	if (application.stackingPolicy === "refresh" && duplicate) {
		const refreshed: ConditionEntry = {
			...entry,
			id: duplicate.id,
			appliedAt: duplicate.appliedAt,
		};
		const next = conditions.map((condition) =>
			condition.id === duplicate.id ? refreshed : condition,
		);
		const change: ConditionChange = {
			type: "refreshed",
			condition: refreshed,
			previousCondition: duplicate,
		};
		return { conditions: next, change, changes: [change] };
	}

	if (application.stackingPolicy === "replace" && matchingName.length > 0) {
		const replaced = matchingName[0];
		const next = [
			...conditions.filter(
				(condition) =>
					normalizeConditionId(condition.conditionName) !==
					application.conditionId,
			),
			entry,
		];
		const change: ConditionChange = {
			type: "replaced",
			condition: entry,
			previousCondition: replaced,
		};
		return { conditions: next, change, changes: [change] };
	}

	const change: ConditionChange = { type: "added", condition: entry };
	return {
		conditions: [...conditions, entry],
		change,
		changes: [change],
	};
}

export function removeCondition(
	conditions: ConditionEntry[],
	conditionId: string,
): { conditions: ConditionEntry[]; change: ConditionChange | null } {
	const removed = conditions.find((condition) => condition.id === conditionId);
	if (!removed) return { conditions, change: null };
	return {
		conditions: conditions.filter((condition) => condition.id !== conditionId),
		change: { type: "removed", condition: removed },
	};
}

export type ConditionLifecycleEventV1 =
	| {
			version: typeof CONDITION_LIFECYCLE_VERSION;
			type: "round" | "round-end";
			round: number;
			amount?: number;
	  }
	| {
			version: typeof CONDITION_LIFECYCLE_VERSION;
			type: "turn-start" | "turn-end";
			actorId?: string | null;
			round?: number;
			amount?: number;
	  }
	| {
			version: typeof CONDITION_LIFECYCLE_VERSION;
			type: "rest";
			restType: "short" | "long";
	  }
	| {
			version: typeof CONDITION_LIFECYCLE_VERSION;
			type: "concentration-broken";
			concentrationId?: string | null;
			round?: number;
	  }
	| {
			version: typeof CONDITION_LIFECYCLE_VERSION;
			type: "save-result";
			conditionEntryId: string;
			success: boolean;
			round?: number;
	  }
	| {
			version: typeof CONDITION_LIFECYCLE_VERSION;
			type: "manual-remove";
			conditionEntryId: string;
			round?: number;
	  };

export interface ConditionLifecycleResult {
	conditions: ConditionEntry[];
	changes: ConditionChange[];
}

function durationForEntry(entry: ConditionEntry): ConditionDurationV1 {
	if (entry.duration) return normalizeDuration(entry.duration);
	if (entry.remainingRounds !== null) {
		return {
			unit: "round",
			anchor: "round",
			value: normalizeCount(entry.durationRounds),
			remaining: normalizeCount(entry.remainingRounds),
		};
	}
	return {
		unit: "indefinite",
		anchor: "manual",
		value: null,
		remaining: null,
	};
}

function eventAdvancesDuration(
	duration: ConditionDurationV1,
	event: ConditionLifecycleEventV1,
): boolean {
	if (duration.unit === "round") {
		return (
			(event.type === "round" && duration.anchor === "round") ||
			(event.type === "round-end" && duration.anchor === "round-end")
		);
	}
	if (duration.unit === "turn") {
		return duration.anchor === event.type;
	}
	return false;
}

function restRemovesCondition(
	entry: ConditionEntry,
	restType: "short" | "long",
): boolean {
	const duration = durationForEntry(entry);
	if (duration.unit === "rest") {
		if (duration.anchor === "rest") return true;
		if (duration.anchor === "long-rest") return restType === "long";
		if (duration.anchor === "short-rest") return true;
	}

	const policy = entry.restPolicy ?? "remove-on-long-rest";
	if (policy === "remove-on-rest") return true;
	if (policy === "remove-on-long-rest") return restType === "long";
	if (policy === "remove-on-short-rest") return true;
	return false;
}

function lifecycleRound(event: ConditionLifecycleEventV1): number | undefined {
	return "round" in event ? event.round : undefined;
}

export function reduceConditionLifecycle(
	conditions: readonly ConditionEntry[],
	event: ConditionLifecycleEventV1,
): ConditionLifecycleResult {
	const next: ConditionEntry[] = [];
	const changes: ConditionChange[] = [];

	for (const condition of conditions) {
		if (!condition.isActive) {
			next.push(condition);
			continue;
		}

		if (event.type === "manual-remove") {
			if (condition.id === event.conditionEntryId) {
				changes.push({
					type: "removed",
					condition,
					round: event.round,
				});
				continue;
			}
			next.push(condition);
			continue;
		}

		if (event.type === "save-result") {
			if (
				condition.id === event.conditionEntryId &&
				event.success &&
				condition.save?.endsOnSuccess
			) {
				changes.push({
					type: "save_succeeded",
					condition,
					round: event.round,
				});
				continue;
			}
			next.push(condition);
			continue;
		}

		if (event.type === "concentration-broken") {
			const duration = durationForEntry(condition);
			const matchesExplicitId =
				condition.concentrationSpellId !== null &&
				(event.concentrationId == null ||
					condition.concentrationSpellId === event.concentrationId);
			const matchesConcentrationDuration =
				duration.unit === "concentration" &&
				(event.concentrationId == null ||
					condition.concentrationSpellId == null ||
					condition.concentrationSpellId === event.concentrationId);
			if (matchesExplicitId || matchesConcentrationDuration) {
				changes.push({
					type: "concentration_broken",
					condition,
					round: event.round,
				});
				continue;
			}
			next.push(condition);
			continue;
		}

		if (event.type === "rest") {
			if (restRemovesCondition(condition, event.restType)) {
				changes.push({ type: "expired", condition });
				continue;
			}
			next.push(condition);
			continue;
		}

		const duration = durationForEntry(condition);
		if (!eventAdvancesDuration(duration, event)) {
			next.push(condition);
			continue;
		}

		const remaining = duration.remaining;
		if (remaining === null) {
			next.push(condition);
			continue;
		}
		const amount = Math.max(
			1,
			Math.floor("amount" in event ? (event.amount ?? 1) : 1),
		);
		const nextRemaining = remaining - amount;
		if (nextRemaining <= 0) {
			changes.push({
				type: "expired",
				condition,
				round: lifecycleRound(event),
			});
			continue;
		}

		const nextDuration = { ...duration, remaining: nextRemaining };
		next.push({
			...condition,
			duration: nextDuration,
			remainingRounds:
				duration.unit === "round" ? nextRemaining : condition.remainingRounds,
		});
	}

	return { conditions: next, changes };
}

export const applyConditionLifecycleEvent = reduceConditionLifecycle;

export function advanceConditionRound(
	conditions: ConditionEntry[],
	currentRound: number,
): ConditionLifecycleResult {
	return reduceConditionLifecycle(conditions, {
		version: CONDITION_LIFECYCLE_VERSION,
		type: "round",
		round: currentRound,
	});
}

export function advanceConditionTurn(
	conditions: readonly ConditionEntry[],
	anchor: "turn-start" | "turn-end",
	options: { actorId?: string | null; round?: number } = {},
): ConditionLifecycleResult {
	return reduceConditionLifecycle(conditions, {
		version: CONDITION_LIFECYCLE_VERSION,
		type: anchor,
		actorId: options.actorId,
		round: options.round,
	});
}

export function breakConcentration(
	conditions: readonly ConditionEntry[],
	concentrationId?: string | null,
): ConditionLifecycleResult {
	return reduceConditionLifecycle(conditions, {
		version: CONDITION_LIFECYCLE_VERSION,
		type: "concentration-broken",
		concentrationId,
	});
}

export function advanceConditionsForRest(
	conditions: readonly ConditionEntry[],
	restType: "short" | "long",
): ConditionLifecycleResult {
	return reduceConditionLifecycle(conditions, {
		version: CONDITION_LIFECYCLE_VERSION,
		type: "rest",
		restType,
	});
}

export function getActiveConditionNames(
	conditions: ConditionEntry[],
): string[] {
	return [
		...new Set(
			conditions
				.filter((condition) => condition.isActive)
				.map((condition) => condition.conditionName),
		),
	];
}

export function migrateLegacyConditions(
	legacyConditions: string[],
	options: ConditionRuntimeOptions = {},
): ConditionEntry[] {
	const appliedAt = resolveAppliedAt(options);
	return legacyConditions
		.filter((name) => typeof name === "string" && name.trim().length > 0)
		.map((name, index) => {
			const application = createConditionApplicationV1({
				conditionId: name,
				source: {
					type: "manual",
					id: null,
					name: "Legacy condition",
					actorId: null,
				},
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
			});
			return entryFromApplication(application, {
				...options,
				id:
					options.id && legacyConditions.length > 1
						? `${options.id}-${index + 1}`
						: options.id,
				appliedAt,
			});
		});
}

const SOURCE_TYPES = new Set<ConditionSourceType>([
	"spell",
	"feature",
	"item",
	"manual",
	"regent",
	"environment",
]);
const STACKING_POLICIES = new Set<ConditionStackingPolicy>([
	"refresh",
	"replace",
	"stack",
	"ignore",
]);
const REST_POLICIES = new Set<ConditionRestPolicy>([
	"persist",
	"remove-on-short-rest",
	"remove-on-long-rest",
	"remove-on-rest",
	"manual",
]);
const AUTOMATION_STATES = new Set<ConditionAutomationState>([
	"automated",
	"manual",
	"review-blocked",
]);
const DURATION_ANCHORS_BY_UNIT: Record<
	ConditionDurationUnit,
	ReadonlySet<ConditionDurationAnchor>
> = {
	round: new Set(["round", "round-end"]),
	turn: new Set(["turn-start", "turn-end"]),
	rest: new Set(["short-rest", "long-rest", "rest"]),
	concentration: new Set(["concentration"]),
	indefinite: new Set(["manual"]),
	manual: new Set(["manual"]),
};
const SAVE_REPEAT_ANCHORS = new Set<
	NonNullable<ConditionSaveMetadataV1["repeat"]>["anchor"]
>(["turn-start", "turn-end", "round-end", "manual"]);

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

function nonNegativeIntegerOrNull(value: unknown): value is number | null {
	return (
		value === null ||
		(typeof value === "number" &&
			Number.isFinite(value) &&
			Number.isInteger(value) &&
			value >= 0)
	);
}

export function isConditionSourceIdentityV1(
	value: unknown,
): value is ConditionSourceIdentityV1 {
	return (
		isRecord(value) &&
		SOURCE_TYPES.has(value.type as ConditionSourceType) &&
		(value.id === null || nonEmptyString(value.id)) &&
		nonEmptyString(value.name) &&
		(value.actorId === null || nonEmptyString(value.actorId))
	);
}

export function isConditionDurationV1(
	value: unknown,
): value is ConditionDurationV1 {
	if (!isRecord(value)) return false;
	const unit = value.unit as ConditionDurationUnit;
	const anchor = value.anchor as ConditionDurationAnchor;
	if (!DURATION_ANCHORS_BY_UNIT[unit]?.has(anchor)) return false;
	if (
		!nonNegativeIntegerOrNull(value.value) ||
		!nonNegativeIntegerOrNull(value.remaining)
	) {
		return false;
	}
	if (unit === "round" || unit === "turn") {
		return (
			typeof value.value === "number" &&
			typeof value.remaining === "number" &&
			value.remaining <= value.value
		);
	}
	return value.value === null && value.remaining === null;
}

export function isConditionSaveMetadataV1(
	value: unknown,
): value is ConditionSaveMetadataV1 {
	if (!isRecord(value)) return false;
	if (
		!nonEmptyString(value.ability) ||
		!(
			value.dc === null ||
			(typeof value.dc === "number" &&
				Number.isFinite(value.dc) &&
				value.dc >= 0)
		) ||
		typeof value.endsOnSuccess !== "boolean"
	) {
		return false;
	}
	if (value.repeat === null) return true;
	return (
		isRecord(value.repeat) &&
		typeof value.repeat.enabled === "boolean" &&
		SAVE_REPEAT_ANCHORS.has(
			value.repeat.anchor as NonNullable<
				ConditionSaveMetadataV1["repeat"]
			>["anchor"],
		)
	);
}

export function isConditionStackingPolicy(
	value: unknown,
): value is ConditionStackingPolicy {
	return STACKING_POLICIES.has(value as ConditionStackingPolicy);
}

export function isConditionRestPolicy(
	value: unknown,
): value is ConditionRestPolicy {
	return REST_POLICIES.has(value as ConditionRestPolicy);
}

export function isConditionAutomationState(
	value: unknown,
): value is ConditionAutomationState {
	return AUTOMATION_STATES.has(value as ConditionAutomationState);
}

export function isConditionEntry(value: unknown): value is ConditionEntry {
	if (!isRecord(value)) return false;
	const entry = value as Record<string, unknown>;
	if (
		!nonEmptyString(entry.id) ||
		!nonEmptyString(entry.conditionName) ||
		!SOURCE_TYPES.has(entry.sourceType as ConditionSourceType) ||
		!(entry.sourceId === null || nonEmptyString(entry.sourceId)) ||
		!nonEmptyString(entry.sourceName) ||
		!nonEmptyString(entry.appliedAt) ||
		Number.isNaN(Date.parse(entry.appliedAt)) ||
		!nonNegativeIntegerOrNull(entry.durationRounds) ||
		!nonNegativeIntegerOrNull(entry.remainingRounds) ||
		(entry.durationRounds === null) !== (entry.remainingRounds === null) ||
		(typeof entry.durationRounds === "number" &&
			typeof entry.remainingRounds === "number" &&
			entry.remainingRounds > entry.durationRounds) ||
		!(
			entry.concentrationSpellId === null ||
			nonEmptyString(entry.concentrationSpellId)
		) ||
		typeof entry.isActive !== "boolean"
	) {
		return false;
	}
	if (
		entry.notes !== undefined &&
		entry.notes !== null &&
		typeof entry.notes !== "string"
	) {
		return false;
	}
	if (
		entry.version !== undefined &&
		entry.version !== CONDITION_APPLICATION_VERSION
	) {
		return false;
	}
	if (
		entry.version === CONDITION_APPLICATION_VERSION &&
		(!nonEmptyString(entry.conditionId) ||
			!isConditionSourceIdentityV1(entry.sourceIdentity) ||
			!isConditionDurationV1(entry.duration) ||
			!Object.hasOwn(entry, "save") ||
			!(entry.save === null || isConditionSaveMetadataV1(entry.save)) ||
			!isConditionStackingPolicy(entry.stackingPolicy) ||
			!isConditionRestPolicy(entry.restPolicy) ||
			!isConditionAutomationState(entry.automationState) ||
			typeof entry.legacy !== "boolean")
	) {
		return false;
	}
	if (
		entry.conditionId !== undefined &&
		(!nonEmptyString(entry.conditionId) ||
			normalizeConditionId(entry.conditionId) !==
				normalizeConditionId(entry.conditionName as string))
	) {
		return false;
	}
	if (entry.sourceIdentity !== undefined) {
		if (!isConditionSourceIdentityV1(entry.sourceIdentity)) return false;
		if (
			entry.sourceIdentity.type !== entry.sourceType ||
			entry.sourceIdentity.id !== entry.sourceId ||
			entry.sourceIdentity.name !== entry.sourceName
		) {
			return false;
		}
	}
	if (entry.duration !== undefined) {
		if (!isConditionDurationV1(entry.duration)) return false;
		if (entry.duration.unit === "round") {
			if (
				entry.duration.value !== entry.durationRounds ||
				entry.duration.remaining !== entry.remainingRounds
			) {
				return false;
			}
		} else if (
			entry.durationRounds !== null ||
			entry.remainingRounds !== null
		) {
			return false;
		}
	}
	if (
		entry.save !== undefined &&
		entry.save !== null &&
		!isConditionSaveMetadataV1(entry.save)
	) {
		return false;
	}
	if (
		entry.stackingPolicy !== undefined &&
		!isConditionStackingPolicy(entry.stackingPolicy)
	) {
		return false;
	}
	if (
		entry.restPolicy !== undefined &&
		!isConditionRestPolicy(entry.restPolicy)
	) {
		return false;
	}
	if (
		entry.automationState !== undefined &&
		!isConditionAutomationState(entry.automationState)
	) {
		return false;
	}
	if (entry.legacy !== undefined && typeof entry.legacy !== "boolean") {
		return false;
	}
	return true;
}

export interface NormalizedCombatConditions {
	conditions: string[];
	advancedConditions: ConditionEntry[];
}

/** Filter malformed persisted entries and safely backfill legacy strings. */
export function normalizeCombatConditions(source: {
	conditions?: unknown;
	advancedConditions?: unknown;
}): NormalizedCombatConditions {
	const legacyConditions = Array.isArray(source.conditions)
		? source.conditions.filter(
				(condition): condition is string =>
					typeof condition === "string" && condition.trim().length > 0,
			)
		: [];
	const advancedSource = source.advancedConditions;
	const hasAdvancedArray = Array.isArray(advancedSource);
	const advancedConditions = hasAdvancedArray
		? advancedSource.filter(isConditionEntry)
		: migrateLegacyConditions(legacyConditions);
	const conditions =
		legacyConditions.length > 0 || !hasAdvancedArray
			? legacyConditions
			: getActiveConditionNames(advancedConditions);
	return { conditions, advancedConditions };
}

/**
 * Legacy no-argument calls still produce an empty list. Passing actual
 * advanced conditions applies the explicit/default compatibility rest policy.
 */
export function clearConditionsOnLongRest(): ConditionEntry[];
export function clearConditionsOnLongRest(
	conditions: readonly ConditionEntry[],
): ConditionEntry[];
export function clearConditionsOnLongRest(
	conditions?: readonly ConditionEntry[],
): ConditionEntry[] {
	if (conditions === undefined) return [];
	return advanceConditionsForRest(conditions, "long").conditions;
}
