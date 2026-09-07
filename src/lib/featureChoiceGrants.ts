/**
 * Guarded grant-building for Selection Protocols: versioned canonical grants,
 * compatibility parsing for persisted JSON, structured admin drafts, and CSV
 * bulk-import mapping. All helpers are pure and deterministic.
 */

import type { Json } from "@/integrations/supabase/types";

export const GRANT_ABILITIES = [
	"STR",
	"AGI",
	"VIT",
	"INT",
	"SENSE",
	"PRE",
] as const;
export type GrantAbility = (typeof GRANT_ABILITIES)[number];

// ── Versioned grant contract ───────────────────────────────────────

export const FEATURE_CHOICE_GRANT_SCHEMA_VERSION = 1 as const;
/** Alias for callers that describe the schema as a contract version. */
export const FEATURE_CHOICE_GRANT_CONTRACT_VERSION =
	FEATURE_CHOICE_GRANT_SCHEMA_VERSION;

export type FeatureChoiceGrantStatus = "strict" | "warning" | "manual";
export type FeatureChoiceGrantTargetCategory = "feature" | "feat" | "ability";
export type FeatureChoiceGrantChoicePolicy = "fixed" | "choose";
export type FeatureChoiceGrantReplacementPolicy = "none" | "replace";
export type FeatureChoiceGrantProvenanceKind =
	| "canonical"
	| "legacy"
	| "manual";

export interface FeatureChoiceGrantProvenanceV1 {
	kind: FeatureChoiceGrantProvenanceKind;
	/** Repository/data-source category, not a target category. */
	sourceType: string;
	/** Explicit source identity when one exists; never derived from a name. */
	sourceId: string | null;
	path: string | null;
}

interface FeatureChoiceGrantBaseV1 {
	version: typeof FEATURE_CHOICE_GRANT_SCHEMA_VERSION;
	targetCategory: FeatureChoiceGrantTargetCategory;
	/** Null is permitted only for a manual/unresolved grant. */
	targetId: string | null;
	provenance: FeatureChoiceGrantProvenanceV1;
	choicePolicy: FeatureChoiceGrantChoicePolicy;
	replacementPolicy: FeatureChoiceGrantReplacementPolicy;
	/** Explicit target being replaced, only when replacementPolicy is replace. */
	replacementTargetId: string | null;
	status: FeatureChoiceGrantStatus;
	/** Zero-based occurrence within the parsed grant array. */
	sourceOrdinal: number;
	/** Deterministic identity of the source occurrence, not a canonical target ID. */
	sourceKey: string;
	/** Deterministic identity of the projected operation. */
	projectionKey: string;
}

export interface FeatureChoiceFeatureGrantV1 extends FeatureChoiceGrantBaseV1 {
	type: "feature";
	targetCategory: "feature";
	name: string;
	description?: string;
	action_type?: string;
}

export interface FeatureChoiceFeatGrantV1 extends FeatureChoiceGrantBaseV1 {
	type: "feat";
	targetCategory: "feat";
	name: string;
	description?: string;
}

export interface FeatureChoiceAbilityIncreaseGrantV1
	extends FeatureChoiceGrantBaseV1 {
	type: "ability_increase";
	targetCategory: "ability";
	targetId: GrantAbility;
	ability: GrantAbility;
	amount: number;
}

/** Canonical, typed grant operations understood by the shared contract. */
export type FeatureChoiceGrantV1 =
	| FeatureChoiceFeatureGrantV1
	| FeatureChoiceFeatGrantV1
	| FeatureChoiceAbilityIncreaseGrantV1;
export type CanonicalFeatureChoiceGrant = FeatureChoiceGrantV1;
export type FeatureChoiceGrant = FeatureChoiceGrantV1;

const LEGACY_NAME_GRANT_TYPES = [
	"tool_proficiency",
	"technique",
	"skill_proficiency",
	"skill_expertise",
	"power",
	"equipment",
	"rune",
] as const;
export type LegacyNameGrantType = (typeof LEGACY_NAME_GRANT_TYPES)[number];

type JsonRecord = { [key: string]: Json };

/**
 * Proven persisted grant kinds that are outside the canonical Task 10 union.
 * They pass through unchanged and stay manual; they are never reclassified.
 */
export interface LegacyFeatureChoiceGrantV1 {
	version: typeof FEATURE_CHOICE_GRANT_SCHEMA_VERSION;
	type: "legacy_passthrough";
	legacyType: LegacyNameGrantType;
	targetCategory: "legacy";
	targetId: null;
	provenance: FeatureChoiceGrantProvenanceV1;
	choicePolicy: "fixed";
	replacementPolicy: "none";
	replacementTargetId: null;
	status: "manual";
	sourceOrdinal: number;
	sourceKey: string;
	projectionKey: string;
	raw: JsonRecord;
}

export type ParsedFeatureChoiceGrantV1 =
	| FeatureChoiceGrantV1
	| LegacyFeatureChoiceGrantV1;

export interface FeatureChoiceGrantValidationIssue {
	status: FeatureChoiceGrantStatus;
	code: string;
	message: string;
	index: number | null;
	path: string;
}

export interface FeatureChoiceGrantParseResult {
	ok: boolean;
	valid: boolean;
	grants: ParsedFeatureChoiceGrantV1[];
	/** Persistence-safe payload preserving canonical entries and legacy shapes. */
	persistedGrants: Json;
	issues: FeatureChoiceGrantValidationIssue[];
	errors: string[];
}

export interface FeatureChoiceGrantParseOptions {
	/** Provenance used only for unversioned compatibility grants. */
	provenance?: Partial<FeatureChoiceGrantProvenanceV1>;
}

const GRANT_STATUSES = ["strict", "warning", "manual"] as const;
const CHOICE_POLICIES = ["fixed", "choose"] as const;
const REPLACEMENT_POLICIES = ["none", "replace"] as const;
const PROVENANCE_KINDS = ["canonical", "legacy", "manual"] as const;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isJson(value: unknown): value is Json {
	if (
		value === null ||
		typeof value === "string" ||
		typeof value === "boolean"
	) {
		return true;
	}
	if (typeof value === "number") return Number.isFinite(value);
	if (Array.isArray(value)) return value.every(isJson);
	if (!isRecord(value)) return false;
	return Object.values(value).every(
		(entry) => entry === undefined || isJson(entry),
	);
}

function isGrantAbility(value: unknown): value is GrantAbility {
	return (
		typeof value === "string" &&
		(GRANT_ABILITIES as readonly string[]).includes(value)
	);
}

function isGrantStatus(value: unknown): value is FeatureChoiceGrantStatus {
	return (
		typeof value === "string" &&
		(GRANT_STATUSES as readonly string[]).includes(value)
	);
}

function isChoicePolicy(
	value: unknown,
): value is FeatureChoiceGrantChoicePolicy {
	return (
		typeof value === "string" &&
		(CHOICE_POLICIES as readonly string[]).includes(value)
	);
}

function isReplacementPolicy(
	value: unknown,
): value is FeatureChoiceGrantReplacementPolicy {
	return (
		typeof value === "string" &&
		(REPLACEMENT_POLICIES as readonly string[]).includes(value)
	);
}

function isProvenanceKind(
	value: unknown,
): value is FeatureChoiceGrantProvenanceKind {
	return (
		typeof value === "string" &&
		(PROVENANCE_KINDS as readonly string[]).includes(value)
	);
}

function isLegacyNameGrantType(value: unknown): value is LegacyNameGrantType {
	return (
		typeof value === "string" &&
		(LEGACY_NAME_GRANT_TYPES as readonly string[]).includes(value)
	);
}

function canonicalize(value: Json): Json {
	if (Array.isArray(value)) return value.map(canonicalize);
	if (value !== null && typeof value === "object") {
		return Object.fromEntries(
			Object.keys(value)
				.sort((left, right) => left.localeCompare(right))
				.filter((key) => value[key] !== undefined)
				.map((key) => [key, canonicalize(value[key] as Json)]),
		) as Json;
	}
	return value;
}

function stableSerialize(value: Json): string {
	return JSON.stringify(canonicalize(value));
}

function stableHash(value: string): string {
	let hash = 14695981039346656037n;
	const prime = 1099511628211n;
	const mask = 0xffffffffffffffffn;
	for (let index = 0; index < value.length; index += 1) {
		hash ^= BigInt(value.charCodeAt(index));
		hash = (hash * prime) & mask;
	}
	return hash.toString(36).padStart(13, "0");
}

function stableKey(namespace: string, seed: Json): string {
	return `${namespace}:v${FEATURE_CHOICE_GRANT_SCHEMA_VERSION}:${stableHash(stableSerialize(seed))}`;
}

type GrantWithProvenance = Pick<
	ParsedFeatureChoiceGrantV1,
	"provenance" | "sourceOrdinal"
>;

/** Build a deterministic source-occurrence key without claiming a target ID. */
export function createFeatureChoiceGrantSourceKey(
	input: FeatureChoiceGrantProvenanceV1 | GrantWithProvenance,
	ordinal = 0,
): string {
	const fromGrant = "provenance" in input;
	const provenance = fromGrant ? input.provenance : input;
	const sourceOrdinal = fromGrant ? input.sourceOrdinal : ordinal;
	return stableKey("feature-choice-grant-source", {
		provenance: provenance as unknown as Json,
		ordinal: sourceOrdinal,
	});
}

/** Concise aliases for consumers that prefer lookup-style naming. */
export const featureChoiceGrantSourceKey = createFeatureChoiceGrantSourceKey;
export const getFeatureChoiceGrantSourceKey = createFeatureChoiceGrantSourceKey;

function projectionSeed(grant: ParsedFeatureChoiceGrantV1): Json {
	if (grant.type === "legacy_passthrough") {
		return {
			type: grant.legacyType,
			raw: grant.raw,
			choicePolicy: grant.choicePolicy,
			replacementPolicy: grant.replacementPolicy,
		};
	}
	if (grant.type === "ability_increase") {
		return {
			type: grant.type,
			targetCategory: grant.targetCategory,
			targetId: grant.targetId,
			ability: grant.ability,
			amount: grant.amount,
			choicePolicy: grant.choicePolicy,
			replacementPolicy: grant.replacementPolicy,
			replacementTargetId: grant.replacementTargetId,
		};
	}
	return {
		type: grant.type,
		targetCategory: grant.targetCategory,
		targetId: grant.targetId,
		name: grant.name,
		...(grant.description ? { description: grant.description } : {}),
		...(grant.type === "feature" && grant.action_type
			? { action_type: grant.action_type }
			: {}),
		choicePolicy: grant.choicePolicy,
		replacementPolicy: grant.replacementPolicy,
		replacementTargetId: grant.replacementTargetId,
	};
}

/** Build a deterministic key for the operation projected by a parsed grant. */
export function createFeatureChoiceGrantProjectionKey(
	grant: ParsedFeatureChoiceGrantV1,
): string {
	return stableKey("feature-choice-grant-projection", projectionSeed(grant));
}

export const featureChoiceGrantProjectionKey =
	createFeatureChoiceGrantProjectionKey;
export const getFeatureChoiceGrantProjectionKey =
	createFeatureChoiceGrantProjectionKey;

function issue(
	status: FeatureChoiceGrantStatus,
	code: string,
	message: string,
	index: number | null,
	path: string,
): FeatureChoiceGrantValidationIssue {
	return { status, code, message, index, path };
}

function defaultProvenance(
	options: FeatureChoiceGrantParseOptions,
	index: number,
): FeatureChoiceGrantProvenanceV1 {
	const input = options.provenance;
	return {
		kind: isProvenanceKind(input?.kind) ? input.kind : "legacy",
		sourceType:
			typeof input?.sourceType === "string" && input.sourceType.trim()
				? input.sourceType.trim()
				: "legacy-json",
		sourceId:
			typeof input?.sourceId === "string" && input.sourceId.trim()
				? input.sourceId.trim()
				: null,
		path:
			typeof input?.path === "string" && input.path.trim()
				? `${input.path.trim()}[${index}]`
				: `$[${index}]`,
	};
}

function parseCanonicalProvenance(
	value: unknown,
	index: number,
	path: string,
	issues: FeatureChoiceGrantValidationIssue[],
): FeatureChoiceGrantProvenanceV1 | null {
	if (!isRecord(value)) {
		issues.push(
			issue(
				"strict",
				"grant-provenance-required",
				"Canonical grant provenance is required.",
				index,
				`${path}.provenance`,
			),
		);
		return null;
	}
	if (!isProvenanceKind(value.kind)) {
		issues.push(
			issue(
				"strict",
				"grant-provenance-kind-invalid",
				"Canonical grant provenance kind is invalid.",
				index,
				`${path}.provenance.kind`,
			),
		);
		return null;
	}
	if (typeof value.sourceType !== "string" || !value.sourceType.trim()) {
		issues.push(
			issue(
				"strict",
				"grant-provenance-source-type-required",
				"Canonical grant provenance sourceType is required.",
				index,
				`${path}.provenance.sourceType`,
			),
		);
		return null;
	}
	if (value.sourceId !== null && typeof value.sourceId !== "string") {
		issues.push(
			issue(
				"strict",
				"grant-provenance-source-id-invalid",
				"Canonical grant provenance sourceId must be a string or null.",
				index,
				`${path}.provenance.sourceId`,
			),
		);
		return null;
	}
	if (value.path !== null && typeof value.path !== "string") {
		issues.push(
			issue(
				"strict",
				"grant-provenance-path-invalid",
				"Canonical grant provenance path must be a string or null.",
				index,
				`${path}.provenance.path`,
			),
		);
		return null;
	}
	return {
		kind: value.kind,
		sourceType: value.sourceType.trim(),
		sourceId:
			typeof value.sourceId === "string" ? value.sourceId.trim() || null : null,
		path: typeof value.path === "string" ? value.path.trim() || null : null,
	};
}

interface ParsedPolicies {
	choicePolicy: FeatureChoiceGrantChoicePolicy;
	replacementPolicy: FeatureChoiceGrantReplacementPolicy;
	replacementTargetId: string | null;
}

function parseCanonicalPolicies(
	value: Readonly<Record<string, unknown>>,
	index: number,
	path: string,
	issues: FeatureChoiceGrantValidationIssue[],
): ParsedPolicies | null {
	if (!isChoicePolicy(value.choicePolicy)) {
		issues.push(
			issue(
				"strict",
				"grant-choice-policy-invalid",
				"Canonical grant choicePolicy must be fixed or choose.",
				index,
				`${path}.choicePolicy`,
			),
		);
		return null;
	}
	if (!isReplacementPolicy(value.replacementPolicy)) {
		issues.push(
			issue(
				"strict",
				"grant-replacement-policy-invalid",
				"Canonical grant replacementPolicy must be none or replace.",
				index,
				`${path}.replacementPolicy`,
			),
		);
		return null;
	}
	const replacementTargetId =
		typeof value.replacementTargetId === "string" &&
		value.replacementTargetId.trim()
			? value.replacementTargetId.trim()
			: null;
	if (
		(value.replacementPolicy === "replace" && !replacementTargetId) ||
		(value.replacementPolicy === "none" && replacementTargetId)
	) {
		issues.push(
			issue(
				"strict",
				"grant-replacement-target-invalid",
				"replacementTargetId is required only for replace policy.",
				index,
				`${path}.replacementTargetId`,
			),
		);
		return null;
	}
	return {
		choicePolicy: value.choicePolicy,
		replacementPolicy: value.replacementPolicy,
		replacementTargetId,
	};
}

function optionalText(
	value: unknown,
	field: string,
	index: number,
	path: string,
	issues: FeatureChoiceGrantValidationIssue[],
): string | undefined {
	if (value === undefined || value === null || value === "") return undefined;
	if (typeof value !== "string") {
		issues.push(
			issue(
				"strict",
				`grant-${field}-invalid`,
				`${field} must be a string when provided.`,
				index,
				`${path}.${field}`,
			),
		);
		return undefined;
	}
	return value.trim() || undefined;
}

function explicitLegacyTargetId(
	value: Readonly<Record<string, unknown>>,
): string | null {
	for (const candidate of [value.targetId, value.target_id]) {
		if (typeof candidate === "string" && candidate.trim()) {
			return candidate.trim();
		}
	}
	return null;
}

type DerivedGrantKey = "sourceOrdinal" | "sourceKey" | "projectionKey";
type DerivedGrantFields = Pick<FeatureChoiceGrantBaseV1, DerivedGrantKey>;
type WithoutDerivedKeys<T> = T extends unknown
	? Omit<T, DerivedGrantKey>
	: never;
type UnkeyedFeatureChoiceGrant = WithoutDerivedKeys<FeatureChoiceGrantV1>;
type UnkeyedLegacyGrant = Omit<LegacyFeatureChoiceGrantV1, DerivedGrantKey>;

function withDerivedKeys<T extends UnkeyedFeatureChoiceGrant>(
	grant: T,
	index: number,
): T & DerivedGrantFields;
function withDerivedKeys(
	grant: UnkeyedLegacyGrant,
	index: number,
): LegacyFeatureChoiceGrantV1;
function withDerivedKeys(
	grant: UnkeyedFeatureChoiceGrant | UnkeyedLegacyGrant,
	index: number,
): ParsedFeatureChoiceGrantV1 {
	const sourceKey = createFeatureChoiceGrantSourceKey(grant.provenance, index);
	const keyed = {
		...grant,
		sourceOrdinal: index,
		sourceKey,
		projectionKey: "",
	} as ParsedFeatureChoiceGrantV1;
	return {
		...keyed,
		projectionKey: createFeatureChoiceGrantProjectionKey(keyed),
	} as ParsedFeatureChoiceGrantV1;
}

function parseCanonicalGrant(
	value: Readonly<Record<string, unknown>>,
	index: number,
	issues: FeatureChoiceGrantValidationIssue[],
): FeatureChoiceGrantV1 | null {
	const path = `$[${index}]`;
	if (value.version !== FEATURE_CHOICE_GRANT_SCHEMA_VERSION) {
		issues.push(
			issue(
				"strict",
				"grant-version-unsupported",
				`Unsupported grant version ${String(value.version)}.`,
				index,
				`${path}.version`,
			),
		);
		return null;
	}
	if (!isGrantStatus(value.status)) {
		issues.push(
			issue(
				"strict",
				"grant-status-invalid",
				"Canonical grant status must be strict, warning, or manual.",
				index,
				`${path}.status`,
			),
		);
		return null;
	}
	const provenance = parseCanonicalProvenance(
		value.provenance,
		index,
		path,
		issues,
	);
	const policies = parseCanonicalPolicies(value, index, path, issues);
	if (!provenance || !policies) return null;

	const targetId =
		typeof value.targetId === "string" && value.targetId.trim()
			? value.targetId.trim()
			: null;
	if (!targetId && value.status !== "manual") {
		issues.push(
			issue(
				"strict",
				"grant-target-id-required",
				"A non-manual canonical grant requires an explicit targetId.",
				index,
				`${path}.targetId`,
			),
		);
		return null;
	}

	if (value.type === "feature" || value.type === "feat") {
		const expectedCategory = value.type;
		if (value.targetCategory !== expectedCategory) {
			issues.push(
				issue(
					"strict",
					"grant-target-category-mismatch",
					`${value.type} grants require targetCategory ${expectedCategory}.`,
					index,
					`${path}.targetCategory`,
				),
			);
			return null;
		}
		if (typeof value.name !== "string" || !value.name.trim()) {
			issues.push(
				issue(
					"strict",
					"grant-name-required",
					`${value.type} name is required.`,
					index,
					`${path}.name`,
				),
			);
			return null;
		}
		const issueCount = issues.length;
		const description = optionalText(
			value.description,
			"description",
			index,
			path,
			issues,
		);
		const actionType =
			value.type === "feature"
				? optionalText(value.action_type, "action_type", index, path, issues)
				: undefined;
		if (issues.length !== issueCount) return null;
		const common = {
			version: FEATURE_CHOICE_GRANT_SCHEMA_VERSION,
			targetId,
			provenance,
			...policies,
			status: value.status,
		};
		if (value.type === "feature") {
			return withDerivedKeys(
				{
					...common,
					type: "feature",
					targetCategory: "feature",
					name: value.name.trim(),
					...(description ? { description } : {}),
					...(actionType ? { action_type: actionType } : {}),
				},
				index,
			);
		}
		return withDerivedKeys(
			{
				...common,
				type: "feat",
				targetCategory: "feat",
				name: value.name.trim(),
				...(description ? { description } : {}),
			},
			index,
		);
	}

	if (value.type === "ability_increase") {
		if (value.targetCategory !== "ability" || !isGrantAbility(value.ability)) {
			issues.push(
				issue(
					"strict",
					"grant-ability-invalid",
					"ability_increase requires a known ability target.",
					index,
					`${path}.ability`,
				),
			);
			return null;
		}
		if (targetId !== value.ability) {
			issues.push(
				issue(
					"strict",
					"grant-ability-target-mismatch",
					"ability_increase targetId must equal its explicit ability code.",
					index,
					`${path}.targetId`,
				),
			);
			return null;
		}
		if (
			typeof value.amount !== "number" ||
			!Number.isInteger(value.amount) ||
			value.amount < 1 ||
			value.amount > 3
		) {
			issues.push(
				issue(
					"strict",
					"grant-amount-invalid",
					"ability_increase amount must be a whole number from 1 to 3.",
					index,
					`${path}.amount`,
				),
			);
			return null;
		}
		return withDerivedKeys(
			{
				version: FEATURE_CHOICE_GRANT_SCHEMA_VERSION,
				type: "ability_increase",
				targetCategory: "ability",
				targetId: value.ability,
				ability: value.ability,
				amount: value.amount,
				provenance,
				...policies,
				status: value.status,
			},
			index,
		);
	}

	issues.push(
		issue(
			"strict",
			"grant-type-unknown",
			`Unknown canonical grant type "${String(value.type)}".`,
			index,
			`${path}.type`,
		),
	);
	return null;
}

function parseLegacyGrant(
	value: Readonly<Record<string, unknown>>,
	index: number,
	options: FeatureChoiceGrantParseOptions,
	issues: FeatureChoiceGrantValidationIssue[],
): ParsedFeatureChoiceGrantV1 | null {
	const path = `$[${index}]`;
	const provenance = defaultProvenance(options, index);
	const policies = {
		choicePolicy: "fixed" as const,
		replacementPolicy: "none" as const,
		replacementTargetId: null,
	};

	if (value.type === "feature" || value.type === "feat") {
		if (typeof value.name !== "string" || !value.name.trim()) {
			issues.push(
				issue(
					"strict",
					"grant-name-required",
					`${value.type} name is required.`,
					index,
					`${path}.name`,
				),
			);
			return null;
		}
		const issueCount = issues.length;
		const description = optionalText(
			value.description,
			"description",
			index,
			path,
			issues,
		);
		const actionType =
			value.type === "feature"
				? optionalText(value.action_type, "action_type", index, path, issues)
				: undefined;
		if (issues.length !== issueCount) return null;
		const targetId = explicitLegacyTargetId(value);
		const status: FeatureChoiceGrantStatus = targetId ? "warning" : "manual";
		if (!targetId) {
			issues.push(
				issue(
					"manual",
					"grant-target-id-unresolved",
					`${value.type} grant "${value.name.trim()}" has no explicit targetId; its name was not promoted to an ID.`,
					index,
					`${path}.targetId`,
				),
			);
		}
		const common = {
			version: FEATURE_CHOICE_GRANT_SCHEMA_VERSION,
			targetId,
			provenance,
			...policies,
			status,
		};
		if (value.type === "feature") {
			return withDerivedKeys(
				{
					...common,
					type: "feature",
					targetCategory: "feature",
					name: value.name.trim(),
					...(description ? { description } : {}),
					...(actionType ? { action_type: actionType } : {}),
				},
				index,
			);
		}
		return withDerivedKeys(
			{
				...common,
				type: "feat",
				targetCategory: "feat",
				name: value.name.trim(),
				...(description ? { description } : {}),
			},
			index,
		);
	}

	if (value.type === "ability_increase") {
		if (!isGrantAbility(value.ability)) {
			issues.push(
				issue(
					"strict",
					"grant-ability-invalid",
					`unknown ability "${String(value.ability)}".`,
					index,
					`${path}.ability`,
				),
			);
			return null;
		}
		const amount =
			typeof value.amount === "string" && /^\d+$/.test(value.amount.trim())
				? Number(value.amount)
				: value.amount;
		if (
			typeof amount !== "number" ||
			!Number.isInteger(amount) ||
			amount < 1 ||
			amount > 3
		) {
			issues.push(
				issue(
					"strict",
					"grant-amount-invalid",
					"ability_increase amount must be a whole number from 1 to 3.",
					index,
					`${path}.amount`,
				),
			);
			return null;
		}
		return withDerivedKeys(
			{
				version: FEATURE_CHOICE_GRANT_SCHEMA_VERSION,
				type: "ability_increase",
				targetCategory: "ability",
				targetId: value.ability,
				ability: value.ability,
				amount,
				provenance,
				...policies,
				status: "warning",
			},
			index,
		);
	}

	if (isLegacyNameGrantType(value.type)) {
		if (
			typeof value.name !== "string" ||
			!value.name.trim() ||
			!isJson(value)
		) {
			issues.push(
				issue(
					"strict",
					"legacy-grant-invalid",
					`${value.type} legacy grant requires a name and JSON-safe fields.`,
					index,
					path,
				),
			);
			return null;
		}
		issues.push(
			issue(
				"manual",
				"legacy-grant-passthrough",
				`${value.type} remains a manual legacy passthrough grant.`,
				index,
				path,
			),
		);
		return withDerivedKeys(
			{
				version: FEATURE_CHOICE_GRANT_SCHEMA_VERSION,
				type: "legacy_passthrough",
				legacyType: value.type,
				targetCategory: "legacy",
				targetId: null,
				provenance,
				...policies,
				status: "manual",
				raw: { ...(value as JsonRecord), name: value.name.trim() },
			},
			index,
		);
	}

	issues.push(
		issue(
			"strict",
			"grant-type-unknown",
			`Unknown grant type "${String(value.type)}".`,
			index,
			`${path}.type`,
		),
	);
	return null;
}

function finalizeParse(
	grants: ParsedFeatureChoiceGrantV1[],
	issues: FeatureChoiceGrantValidationIssue[],
	persistedGrants: Json[] = [],
): FeatureChoiceGrantParseResult {
	const errors = issues
		.filter((entry) => entry.status === "strict")
		.map((entry) => entry.message);
	return {
		ok: errors.length === 0,
		valid: errors.length === 0,
		grants,
		persistedGrants,
		issues,
		errors,
	};
}

/**
 * Parse and validate a JSON grant array. Versioned entries must satisfy the
 * full canonical contract. Unversioned feature/feat/ability_increase entries
 * are normalized compatibly; unresolved names stay manual with targetId null.
 */
export function parseFeatureChoiceGrants(
	input: unknown,
	options: FeatureChoiceGrantParseOptions = {},
): FeatureChoiceGrantParseResult {
	let value = input;
	if (typeof value === "string") {
		if (!value.trim()) value = [];
		else {
			try {
				value = JSON.parse(value) as unknown;
			} catch {
				return finalizeParse(
					[],
					[
						issue(
							"strict",
							"grants-invalid-json",
							"grants is not valid JSON.",
							null,
							"$",
						),
					],
				);
			}
		}
	}
	if (!Array.isArray(value)) {
		return finalizeParse(
			[],
			[
				issue(
					"strict",
					"grants-not-array",
					"grants must be a JSON array.",
					null,
					"$",
				),
			],
		);
	}

	const grants: ParsedFeatureChoiceGrantV1[] = [];
	const persistedGrants: Json[] = [];
	const issues: FeatureChoiceGrantValidationIssue[] = [];
	for (const [index, entry] of value.entries()) {
		if (!isRecord(entry)) {
			issues.push(
				issue(
					"strict",
					"grant-object-required",
					`Grant ${index + 1} must be a JSON object.`,
					index,
					`$[${index}]`,
				),
			);
			continue;
		}
		const isCanonicalInput = Object.hasOwn(entry, "version");
		const parsed = isCanonicalInput
			? parseCanonicalGrant(entry, index, issues)
			: parseLegacyGrant(entry, index, options, issues);
		if (parsed) {
			grants.push(parsed);
			persistedGrants.push(
				isCanonicalInput && parsed.type !== "legacy_passthrough"
					? serializeCanonicalFeatureChoiceGrant(parsed)
					: projectFeatureChoiceGrant(parsed),
			);
		}
	}
	return finalizeParse(grants, issues, persistedGrants);
}

/** Validate with the same compatibility boundary used by parsing and CSV. */
export const validateFeatureChoiceGrants = parseFeatureChoiceGrants;

export interface FeatureChoiceGrantSingleParseResult {
	ok: boolean;
	valid: boolean;
	grant: ParsedFeatureChoiceGrantV1 | null;
	persistedGrant: Json | null;
	issues: FeatureChoiceGrantValidationIssue[];
	errors: string[];
}

/** Parse one grant while retaining the same index-aware diagnostics. */
export function parseFeatureChoiceGrant(
	input: unknown,
	options: FeatureChoiceGrantParseOptions = {},
): FeatureChoiceGrantSingleParseResult {
	const parsed = parseFeatureChoiceGrants([input], options);
	return {
		ok: parsed.ok,
		valid: parsed.valid,
		grant: parsed.grants[0] ?? null,
		persistedGrant: Array.isArray(parsed.persistedGrants)
			? (parsed.persistedGrants[0] ?? null)
			: null,
		issues: parsed.issues,
		errors: parsed.errors,
	};
}

/** Project a parsed grant back to the persisted legacy shape current consumers read. */
export function projectFeatureChoiceGrant(
	grant: ParsedFeatureChoiceGrantV1,
): Json {
	if (grant.type === "legacy_passthrough") return { ...grant.raw };
	if (grant.type === "ability_increase") {
		return {
			type: grant.type,
			ability: grant.ability,
			amount: grant.amount,
		};
	}
	return {
		type: grant.type,
		name: grant.name,
		...(grant.description ? { description: grant.description } : {}),
		...(grant.type === "feature" && grant.action_type
			? { action_type: grant.action_type }
			: {}),
	};
}

export function projectFeatureChoiceGrants(
	grants: readonly ParsedFeatureChoiceGrantV1[],
): Json {
	return grants.map(projectFeatureChoiceGrant);
}

/** Serialize a canonical grant without downgrading identity or policy fields. */
export function serializeCanonicalFeatureChoiceGrant(
	grant: FeatureChoiceGrantV1,
): Json {
	const common: JsonRecord = {
		version: grant.version,
		type: grant.type,
		targetCategory: grant.targetCategory,
		targetId: grant.targetId,
		provenance: grant.provenance as unknown as Json,
		choicePolicy: grant.choicePolicy,
		replacementPolicy: grant.replacementPolicy,
		replacementTargetId: grant.replacementTargetId,
		status: grant.status,
		sourceOrdinal: grant.sourceOrdinal,
		sourceKey: grant.sourceKey,
		projectionKey: grant.projectionKey,
	};
	if (grant.type === "ability_increase") {
		return {
			...common,
			ability: grant.ability,
			amount: grant.amount,
		};
	}
	return {
		...common,
		name: grant.name,
		...(grant.description ? { description: grant.description } : {}),
		...(grant.type === "feature" && grant.action_type
			? { action_type: grant.action_type }
			: {}),
	};
}

// ── Legacy admin draft API ─────────────────────────────────────────

export type GrantDraftType = "feature" | "feat" | "ability_increase";

export interface GrantDraft {
	type: GrantDraftType;
	/** feature/feat display name. */
	name: string;
	/** feature rules text (optional). */
	description: string;
	/** ability_increase target. */
	ability: GrantAbility;
	/** ability_increase magnitude (1–3). */
	amount: number;
}

export const emptyGrantDraft = (): GrantDraft => ({
	type: "feature",
	name: "",
	description: "",
	ability: "STR",
	amount: 1,
});

/**
 * Validate structured drafts and build the persisted legacy `grants` JSON
 * array the current character engine consumes. The original result shape is
 * retained so existing forms can surface errors inline.
 */
export function buildGrants(drafts: ReadonlyArray<GrantDraft>): {
	grants?: Json;
	error?: string;
} {
	if (drafts.length === 0) {
		return { error: "Add at least one grant." };
	}

	const projected: Json[] = [];
	for (const [index, draft] of drafts.entries()) {
		const label = `Grant ${index + 1}`;
		if (draft.type === "feature") {
			if (!draft.name.trim()) {
				return { error: `${label}: feature name is required.` };
			}
			projected.push({
				type: "feature",
				name: draft.name.trim(),
				...(draft.description.trim()
					? { description: draft.description.trim() }
					: {}),
			});
		} else if (draft.type === "feat") {
			if (!draft.name.trim()) {
				return { error: `${label}: feat name is required.` };
			}
			projected.push({ type: "feat", name: draft.name.trim() });
		} else if (draft.type === "ability_increase") {
			if (!GRANT_ABILITIES.includes(draft.ability)) {
				return { error: `${label}: unknown ability "${draft.ability}".` };
			}
			if (
				!Number.isInteger(draft.amount) ||
				draft.amount < 1 ||
				draft.amount > 3
			) {
				return {
					error: `${label}: amount must be a whole number from 1 to 3.`,
				};
			}
			projected.push({
				type: "ability_increase",
				ability: draft.ability,
				amount: draft.amount,
			});
		} else {
			return { error: `${label}: unknown grant type.` };
		}
	}

	const parsed = parseFeatureChoiceGrants(projected);
	if (!parsed.valid) return { error: parsed.errors[0] };
	return { grants: projectFeatureChoiceGrants(parsed.grants) };
}

export interface ChoiceOptionInsert {
	option_key: string;
	name: string;
	description: string | null;
	grants: Json;
}

/**
 * Map parsed CSV rows (columns: option_key, name, description, grants) to
 * insert-ready option rows. Grant JSON is routed through the shared parser;
 * valid rows retain the persisted legacy projection. Row problems are
 * collected rather than aborting the whole import.
 */
export function csvRowsToChoiceOptions(
	rows: ReadonlyArray<Record<string, string>>,
): { options: ChoiceOptionInsert[]; errors: string[] } {
	const options: ChoiceOptionInsert[] = [];
	const errors: string[] = [];

	rows.forEach((row, index) => {
		const line = index + 2; // header is line 1
		const optionKey = (row.option_key ?? "").trim();
		const name = (row.name ?? "").trim();
		if (!optionKey || !name) {
			errors.push(`Line ${line}: option_key and name are required.`);
			return;
		}

		const parsed = parseFeatureChoiceGrants((row.grants ?? "").trim(), {
			provenance: {
				kind: "legacy",
				sourceType: "feature-choice-csv",
				sourceId: optionKey,
				path: `line:${line}.grants`,
			},
		});
		if (!parsed.valid) {
			errors.push(`Line ${line}: ${parsed.errors[0]}`);
			return;
		}

		options.push({
			option_key: optionKey,
			name,
			description: (row.description ?? "").trim() || null,
			grants: parsed.persistedGrants,
		});
	});

	return { options, errors };
}
