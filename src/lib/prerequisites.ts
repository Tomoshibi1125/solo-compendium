/**
 * Prerequisite Validation (P1.8)
 *
 * Cross-cutting prerequisite check for content that can be added to a
 * character at level-up: feats, spells, powers, techniques, runes.
 *
 * Distinct from `levelGating.ts`, which handles structural progression
 * gates (job features at the right level, path unlock levels, max power
 * level by caster table). This module handles **content-side**
 * prerequisites — e.g. Heavy Armor Master needs proficiency with heavy
 * armor; Great Weapon Master needs STR 13; Sharpshooter needs no
 * prereq; a Mage-only spell needs job === Mage.
 *
 * UX is DDB-style "warn but allow" — `validatePrereq` returns the list
 * of missing requirements so the UI can show a red explanation, but
 * callers may still permit the add (e.g. for homebrew overrides).
 */

import type { AbilityScore } from "@/types/core-rules";

// ── Legacy schema ──────────────────────────────────────────────────

/**
 * Structured prerequisite. All fields are optional; absent fields are
 * unconstrained. Multiple constraints AND together.
 */
export interface PrerequisiteSpec {
	/** Minimum ability score requirements, e.g. `{ STR: 13, AGI: 13 }`. */
	minAbility?: Partial<Record<AbilityScore, number>>;
	/** Minimum character level. */
	minLevel?: number;
	/** Required job (case-insensitive). */
	requiredJob?: string;
	/** Required feature names (any one of). */
	requiredFeature?: readonly string[];
	/** Required proficiency (skill name or armor/weapon category). */
	requiredProficiency?: readonly string[];
	/** Free-form text prerequisite, retained for manual review. */
	textOnly?: string;
}

/** Character snapshot needed for prerequisite checks. */
export interface PrereqCharacterContext {
	level: number;
	job?: string | { name: string } | null;
	abilities: Record<AbilityScore, number>;
	features?: ReadonlyArray<{ name: string }> | null;
	proficiencies?: readonly string[] | null; // armor/weapon/skill names
}

export interface PrereqValidation {
	ok: boolean;
	missing: string[];
}

// ── Versioned grouped contract ─────────────────────────────────────

export const PREREQUISITE_SCHEMA_VERSION = 1 as const;
/** Alias for callers that describe the schema as a contract version. */
export const PREREQUISITE_CONTRACT_VERSION = PREREQUISITE_SCHEMA_VERSION;

/** How an unmet or unverifiable prerequisite must be handled. */
export type PrerequisiteOutcome = "strict" | "warning" | "manual";
export type PrerequisiteGroupOperator = "all" | "any" | "not";

export type PrerequisiteConditionV1 =
	| {
			kind: "ability";
			ability: AbilityScore;
			minimum: number;
	  }
	| {
			kind: "level";
			minimum: number;
	  }
	| {
			kind: "job";
			name: string;
	  }
	| {
			kind: "feature";
			names: readonly string[];
	  }
	| {
			kind: "proficiency";
			names: readonly string[];
	  }
	| {
			kind: "manual";
			text: string;
	  };

export interface PrerequisiteRuleV1 {
	version: typeof PREREQUISITE_SCHEMA_VERSION;
	node: "rule";
	outcome: PrerequisiteOutcome;
	condition: PrerequisiteConditionV1;
}

export interface PrerequisiteGroupV1 {
	version: typeof PREREQUISITE_SCHEMA_VERSION;
	node: "group";
	operator: PrerequisiteGroupOperator;
	outcome: PrerequisiteOutcome;
	children: readonly PrerequisiteNodeV1[];
}

export type PrerequisiteNodeV1 = PrerequisiteRuleV1 | PrerequisiteGroupV1;

export interface PrerequisiteContractV1 {
	version: typeof PREREQUISITE_SCHEMA_VERSION;
	root: PrerequisiteNodeV1 | null;
}

/**
 * Accepted compatibility boundary. Records are inspected field-by-field;
 * unknown fields are retained as manual-review rules rather than interpreted.
 */
export type PrerequisiteInput =
	| PrerequisiteContractV1
	| PrerequisiteNodeV1
	| PrerequisiteSpec
	| string
	| readonly string[]
	| Readonly<Record<string, unknown>>
	| null
	| undefined;

export type PrerequisiteEvaluationState =
	| "satisfied"
	| "unsatisfied"
	| "manual";

export interface PrerequisiteEvaluationIssue {
	outcome: PrerequisiteOutcome;
	message: string;
	path: string;
}

export interface PrerequisiteEvaluationV1 {
	version: typeof PREREQUISITE_SCHEMA_VERSION;
	/** True only when the grouped prerequisite is affirmatively satisfied. */
	ok: boolean;
	/** Strict failures block automatic application; warnings/manual review do not. */
	blocking: boolean;
	/** False whenever any result still requires human interpretation. */
	verified: boolean;
	state: PrerequisiteEvaluationState;
	/** Highest-priority issue outcome, or null when satisfied. */
	outcome: PrerequisiteOutcome | null;
	issues: PrerequisiteEvaluationIssue[];
	missing: string[];
	advisories: string[];
	contract: PrerequisiteContractV1;
}

const ABILITY_SCORES = ["STR", "AGI", "VIT", "INT", "SENSE", "PRE"] as const;
const OUTCOMES = ["strict", "warning", "manual"] as const;
const KNOWN_RECORD_KEYS = new Set([
	"version",
	"root",
	"node",
	"operator",
	"children",
	"condition",
	"kind",
	"outcome",
	"status",
	"all",
	"any",
	"not",
	"minAbility",
	"minLevel",
	"requiredJob",
	"requiredFeature",
	"requiredProficiency",
	"textOnly",
	"level",
	"job",
	"class",
	"ability",
	"score",
]);

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isAbilityScore(value: unknown): value is AbilityScore {
	return (
		typeof value === "string" &&
		(ABILITY_SCORES as readonly string[]).includes(value)
	);
}

function isOutcome(value: unknown): value is PrerequisiteOutcome {
	return (
		typeof value === "string" && (OUTCOMES as readonly string[]).includes(value)
	);
}

function outcomeFrom(
	value: Readonly<Record<string, unknown>>,
	fallback: PrerequisiteOutcome,
): PrerequisiteOutcome {
	if (isOutcome(value.outcome)) return value.outcome;
	if (isOutcome(value.status)) return value.status;
	return fallback;
}

function rule(
	condition: PrerequisiteConditionV1,
	outcome: PrerequisiteOutcome,
): PrerequisiteRuleV1 {
	return {
		version: PREREQUISITE_SCHEMA_VERSION,
		node: "rule",
		outcome,
		condition,
	};
}

function manualRule(text: string): PrerequisiteRuleV1 {
	return rule({ kind: "manual", text }, "manual");
}

function group(
	operator: PrerequisiteGroupOperator,
	children: readonly PrerequisiteNodeV1[],
	outcome: PrerequisiteOutcome,
): PrerequisiteNodeV1 | null {
	if (children.length === 0) return null;
	return {
		version: PREREQUISITE_SCHEMA_VERSION,
		node: "group",
		operator,
		outcome,
		children,
	};
}

function readableValue(value: unknown): string {
	if (typeof value === "string") return value;
	try {
		const serialized = JSON.stringify(value);
		return serialized === undefined ? String(value) : serialized;
	} catch {
		return String(value);
	}
}

function normalizeStringList(value: unknown): string[] | null {
	const entries = typeof value === "string" ? [value] : value;
	if (!Array.isArray(entries)) return null;
	const normalized = entries
		.filter((entry): entry is string => typeof entry === "string")
		.map((entry) => entry.trim())
		.filter(Boolean);
	return normalized.length > 0 ? normalized : null;
}

function isStringListInput(value: unknown): boolean {
	return (
		typeof value === "string" ||
		(Array.isArray(value) && value.every((entry) => typeof entry === "string"))
	);
}

function normalizeConditionRecord(
	value: Readonly<Record<string, unknown>>,
	outcome: PrerequisiteOutcome,
): PrerequisiteNodeV1 | null {
	const source = isRecord(value.condition) ? value.condition : value;
	const kind = source.kind;

	if (
		kind === "ability" &&
		isAbilityScore(source.ability) &&
		typeof source.minimum === "number" &&
		Number.isFinite(source.minimum)
	) {
		return rule(
			{ kind, ability: source.ability, minimum: source.minimum },
			outcome,
		);
	}
	if (
		kind === "level" &&
		typeof source.minimum === "number" &&
		Number.isFinite(source.minimum)
	) {
		return rule({ kind, minimum: source.minimum }, outcome);
	}
	if (kind === "job" && typeof source.name === "string" && source.name.trim()) {
		return rule({ kind, name: source.name.trim() }, outcome);
	}
	if (kind === "feature" || kind === "proficiency") {
		const names = normalizeStringList(source.names);
		if (names) return rule({ kind, names }, outcome);
	}
	if (
		kind === "manual" &&
		typeof source.text === "string" &&
		source.text.trim()
	) {
		return manualRule(source.text.trim());
	}

	return null;
}

function nodesFromParsedSpec(
	spec: PrerequisiteSpec,
	knownOutcome: PrerequisiteOutcome,
): PrerequisiteNodeV1[] {
	const nodes: PrerequisiteNodeV1[] = [];

	if (spec.minAbility) {
		for (const [ability, minimum] of Object.entries(spec.minAbility)) {
			if (isAbilityScore(ability) && Number.isFinite(minimum)) {
				nodes.push(rule({ kind: "ability", ability, minimum }, knownOutcome));
			} else {
				nodes.push(
					manualRule(
						`Unrecognized ability prerequisite ${ability}: ${readableValue(minimum)}`,
					),
				);
			}
		}
	}
	if (typeof spec.minLevel === "number" && Number.isFinite(spec.minLevel)) {
		nodes.push(rule({ kind: "level", minimum: spec.minLevel }, knownOutcome));
	}
	if (typeof spec.requiredJob === "string" && spec.requiredJob.trim()) {
		nodes.push(
			rule({ kind: "job", name: spec.requiredJob.trim() }, knownOutcome),
		);
	}
	const features = normalizeStringList(spec.requiredFeature);
	if (features)
		nodes.push(rule({ kind: "feature", names: features }, knownOutcome));
	const proficiencies = normalizeStringList(spec.requiredProficiency);
	if (proficiencies) {
		nodes.push(
			rule({ kind: "proficiency", names: proficiencies }, knownOutcome),
		);
	}
	if (typeof spec.textOnly === "string" && spec.textOnly.trim()) {
		nodes.push(manualRule(spec.textOnly.trim()));
	}

	return nodes;
}

function normalizeProse(text: string): PrerequisiteNodeV1 | null {
	const parsed = parsePrerequisiteText(text);
	if (!parsed) return null;
	return group("all", nodesFromParsedSpec(parsed, "warning"), "warning");
}

function normalizeGroupValue(
	operator: PrerequisiteGroupOperator,
	value: unknown,
	outcome: PrerequisiteOutcome,
	seen: WeakSet<object>,
): PrerequisiteNodeV1 | null {
	const values =
		operator === "not" ? [value] : Array.isArray(value) ? value : [value];
	const children = values
		.map((entry) => normalizeValue(entry, seen))
		.filter((entry): entry is PrerequisiteNodeV1 => entry !== null);
	if (children.length === 0) {
		return manualRule(`Empty ${operator} prerequisite group`);
	}
	if (operator === "not" && children.length > 1) {
		const all = group("all", children, outcome);
		return all ? group("not", [all], outcome) : null;
	}
	return group(operator, children, outcome);
}

function normalizeRecord(
	value: Readonly<Record<string, unknown>>,
	seen: WeakSet<object>,
): PrerequisiteNodeV1 | null {
	const defaultOutcome = outcomeFrom(value, "strict");
	if (
		Object.hasOwn(value, "node") &&
		value.node !== "rule" &&
		value.node !== "group"
	) {
		return manualRule(
			`Unrecognized prerequisite node: ${readableValue(value.node)}`,
		);
	}
	const canonicalCondition = normalizeConditionRecord(value, defaultOutcome);
	if (value.node === "rule" || value.condition || canonicalCondition) {
		return (
			canonicalCondition ??
			manualRule(`Unrecognized prerequisite rule: ${readableValue(value)}`)
		);
	}

	if (value.node === "group") {
		const operator = value.operator;
		if (operator === "all" || operator === "any" || operator === "not") {
			return normalizeGroupValue(
				operator,
				value.children,
				defaultOutcome,
				seen,
			);
		}
		return manualRule(
			`Unrecognized prerequisite group: ${readableValue(value)}`,
		);
	}

	const nodes: PrerequisiteNodeV1[] = [];
	for (const operator of ["all", "any", "not"] as const) {
		if (Object.hasOwn(value, operator)) {
			const grouped = normalizeGroupValue(
				operator,
				value[operator],
				defaultOutcome,
				seen,
			);
			if (grouped) nodes.push(grouped);
		}
	}

	const legacySpec: PrerequisiteSpec = {};
	if (isRecord(value.minAbility)) {
		legacySpec.minAbility = value.minAbility as Partial<
			Record<AbilityScore, number>
		>;
	}
	if (typeof value.minLevel === "number") legacySpec.minLevel = value.minLevel;
	if (typeof value.requiredJob === "string") {
		legacySpec.requiredJob = value.requiredJob;
	}
	const requiredFeatures = normalizeStringList(value.requiredFeature);
	if (requiredFeatures) legacySpec.requiredFeature = requiredFeatures;
	const requiredProficiencies = normalizeStringList(value.requiredProficiency);
	if (requiredProficiencies) {
		legacySpec.requiredProficiency = requiredProficiencies;
	}
	if (typeof value.textOnly === "string") legacySpec.textOnly = value.textOnly;

	const preserveInvalidField = (key: string, entry: unknown) => {
		nodes.push(
			manualRule(
				`Invalid prerequisite field "${key}": ${readableValue(entry)}`,
			),
		);
	};
	if (Object.hasOwn(value, "minAbility") && !isRecord(value.minAbility)) {
		preserveInvalidField("minAbility", value.minAbility);
	}
	if (
		Object.hasOwn(value, "minLevel") &&
		(typeof value.minLevel !== "number" || !Number.isFinite(value.minLevel))
	) {
		preserveInvalidField("minLevel", value.minLevel);
	}
	if (
		Object.hasOwn(value, "requiredJob") &&
		(typeof value.requiredJob !== "string" || !value.requiredJob.trim())
	) {
		preserveInvalidField("requiredJob", value.requiredJob);
	}
	for (const key of ["requiredFeature", "requiredProficiency"] as const) {
		if (Object.hasOwn(value, key) && !isStringListInput(value[key])) {
			preserveInvalidField(key, value[key]);
		}
	}
	if (Object.hasOwn(value, "textOnly") && typeof value.textOnly !== "string") {
		preserveInvalidField("textOnly", value.textOnly);
	}
	if (
		(Object.hasOwn(value, "outcome") && !isOutcome(value.outcome)) ||
		(Object.hasOwn(value, "status") && !isOutcome(value.status))
	) {
		preserveInvalidField(
			"outcome",
			Object.hasOwn(value, "outcome") ? value.outcome : value.status,
		);
	}
	if (
		Object.hasOwn(value, "kind") &&
		!normalizeConditionRecord(value, defaultOutcome)
	) {
		preserveInvalidField("kind", value.kind);
	}
	if (
		Object.hasOwn(value, "level") &&
		(typeof value.level !== "number" || !Number.isFinite(value.level))
	) {
		preserveInvalidField("level", value.level);
	}
	for (const key of ["job", "class"] as const) {
		if (
			Object.hasOwn(value, key) &&
			(typeof value[key] !== "string" || !value[key].trim())
		) {
			preserveInvalidField(key, value[key]);
		}
	}

	if (typeof value.level === "number" && Number.isFinite(value.level)) {
		nodes.push(rule({ kind: "level", minimum: value.level }, defaultOutcome));
	}
	for (const key of ["job", "class"] as const) {
		if (typeof value[key] === "string" && value[key].trim()) {
			nodes.push(
				rule({ kind: "job", name: value[key].trim() }, defaultOutcome),
			);
		}
	}
	if (
		isAbilityScore(value.ability) &&
		typeof value.score === "number" &&
		Number.isFinite(value.score)
	) {
		nodes.push(
			rule(
				{ kind: "ability", ability: value.ability, minimum: value.score },
				defaultOutcome,
			),
		);
	} else if (Object.hasOwn(value, "ability") || Object.hasOwn(value, "score")) {
		nodes.push(
			manualRule(
				`Unrecognized ability/score prerequisite: ${readableValue({
					ability: value.ability,
					score: value.score,
				})}`,
			),
		);
	}

	nodes.push(...nodesFromParsedSpec(legacySpec, defaultOutcome));

	for (const [key, entry] of Object.entries(value)) {
		if (!KNOWN_RECORD_KEYS.has(key)) {
			nodes.push(
				manualRule(
					`Unrecognized prerequisite field "${key}": ${readableValue(entry)}`,
				),
			);
		}
	}

	return group("all", nodes, defaultOutcome);
}

function normalizeValue(
	value: unknown,
	seen: WeakSet<object>,
): PrerequisiteNodeV1 | null {
	if (value == null) return null;
	if (typeof value === "string") return normalizeProse(value);
	if (Array.isArray(value)) {
		const children = value
			.map((entry) => normalizeValue(entry, seen))
			.filter((entry): entry is PrerequisiteNodeV1 => entry !== null);
		return group("all", children, "warning");
	}
	if (!isRecord(value)) {
		return manualRule(`Unrecognized prerequisite: ${readableValue(value)}`);
	}
	if (Object.hasOwn(value, "root")) {
		if (value.version !== PREREQUISITE_SCHEMA_VERSION) {
			return manualRule(
				`Unsupported prerequisite version: ${readableValue(value.version)}`,
			);
		}
		if (value.root === undefined) {
			return manualRule("Versioned prerequisite root is missing");
		}
		if (seen.has(value)) return manualRule("Circular prerequisite data");
		seen.add(value);
		const normalized = normalizeValue(value.root, seen);
		seen.delete(value);
		return normalized;
	}
	if (
		Object.hasOwn(value, "version") &&
		value.version !== PREREQUISITE_SCHEMA_VERSION
	) {
		return manualRule(
			`Unsupported prerequisite version: ${readableValue(value.version)}`,
		);
	}
	if (
		value.version === PREREQUISITE_SCHEMA_VERSION &&
		Object.keys(value).every((key) => key === "version")
	) {
		return manualRule("Versioned prerequisite node or root is missing");
	}
	if (seen.has(value)) return manualRule("Circular prerequisite data");
	seen.add(value);
	const normalized = normalizeRecord(value, seen);
	seen.delete(value);
	return normalized;
}

/**
 * Normalize old prose, arrays, and records into the versioned grouped model.
 * Only explicit, recognized fields become machine-checkable rules. Everything
 * else remains visible as a manual-review rule; names are never resolved to IDs.
 */
export function normalizePrerequisiteInput(
	input: PrerequisiteInput,
): PrerequisiteContractV1 {
	return {
		version: PREREQUISITE_SCHEMA_VERSION,
		root: normalizeValue(input, new WeakSet()),
	};
}

/** Concise plural alias for collection-oriented callers. */
export const normalizePrerequisites = normalizePrerequisiteInput;

// ── Evaluation ─────────────────────────────────────────────────────

function jobName(
	job: string | { name: string } | null | undefined,
): string | null {
	if (!job) return null;
	if (typeof job === "string") return job;
	return job.name ?? null;
}

const normalize = (s: string) => s.trim().toLowerCase();

interface NodeEvaluation {
	state: PrerequisiteEvaluationState;
	issues: PrerequisiteEvaluationIssue[];
}

function failedRule(
	outcome: PrerequisiteOutcome,
	message: string,
	path: string,
): NodeEvaluation {
	return {
		state: outcome === "manual" ? "manual" : "unsatisfied",
		issues: [{ outcome, message, path }],
	};
}

function evaluateRule(
	node: PrerequisiteRuleV1,
	character: PrereqCharacterContext,
	path: string,
): NodeEvaluation {
	const condition = node.condition;
	if (condition.kind === "manual") {
		return failedRule(
			"manual",
			`Manual review required: ${condition.text}`,
			path,
		);
	}
	if (condition.kind === "ability") {
		const score = character.abilities[condition.ability] ?? 10;
		if (score < condition.minimum) {
			return failedRule(
				node.outcome,
				`Requires ${condition.ability} ${condition.minimum}+ (have ${score}).`,
				path,
			);
		}
	}
	if (condition.kind === "level" && character.level < condition.minimum) {
		return failedRule(
			node.outcome,
			`Requires character level ${condition.minimum} (have ${character.level}).`,
			path,
		);
	}
	if (condition.kind === "job") {
		const currentJob = jobName(character.job);
		if (!currentJob || normalize(currentJob) !== normalize(condition.name)) {
			return failedRule(
				node.outcome,
				`Requires job: ${condition.name}${currentJob ? ` (have ${currentJob})` : ""}.`,
				path,
			);
		}
	}
	if (condition.kind === "feature") {
		const have = new Set(
			(character.features ?? []).map((feature) => normalize(feature.name)),
		);
		if (!condition.names.some((name) => have.has(normalize(name)))) {
			return failedRule(
				node.outcome,
				`Requires feature: ${condition.names.join(" or ")}.`,
				path,
			);
		}
	}
	if (condition.kind === "proficiency") {
		const have = new Set(
			(character.proficiencies ?? []).map((entry) => normalize(entry)),
		);
		if (!condition.names.some((name) => have.has(normalize(name)))) {
			return failedRule(
				node.outcome,
				`Requires proficiency: ${condition.names.join(" or ")}.`,
				path,
			);
		}
	}
	return { state: "satisfied", issues: [] };
}

function evaluateNode(
	node: PrerequisiteNodeV1,
	character: PrereqCharacterContext,
	path: string,
): NodeEvaluation {
	if (node.node === "rule") return evaluateRule(node, character, path);

	const children = node.children.map((child, index) =>
		evaluateNode(child, character, `${path}.${node.operator}[${index}]`),
	);
	if (node.operator === "all") {
		const issues = children
			.flatMap((child) => child.issues)
			.map((entry) =>
				entry.outcome === "manual"
					? entry
					: { ...entry, outcome: node.outcome },
			);
		if (children.some((child) => child.state === "unsatisfied")) {
			return {
				state: node.outcome === "manual" ? "manual" : "unsatisfied",
				issues,
			};
		}
		if (children.some((child) => child.state === "manual")) {
			return { state: "manual", issues };
		}
		return { state: "satisfied", issues: [] };
	}

	if (node.operator === "any") {
		if (children.some((child) => child.state === "satisfied")) {
			return { state: "satisfied", issues: [] };
		}
		const manualIssues = children
			.filter((child) => child.state === "manual")
			.flatMap((child) => child.issues);
		if (manualIssues.length > 0)
			return { state: "manual", issues: manualIssues };
		return failedRule(
			node.outcome,
			"Requires at least one prerequisite in this group.",
			path,
		);
	}

	const child = children[0];
	if (!child) {
		return failedRule(
			"manual",
			"Manual review required: empty not group",
			path,
		);
	}
	if (child.state === "manual") return child;
	if (child.state === "unsatisfied") return { state: "satisfied", issues: [] };
	return failedRule(node.outcome, "A forbidden prerequisite was met.", path);
}

const OUTCOME_PRIORITY: Record<PrerequisiteOutcome, number> = {
	manual: 1,
	warning: 2,
	strict: 3,
};

/** Evaluate an already-normalized contract. */
export function evaluatePrerequisiteContract(
	contract: PrerequisiteContractV1,
	character: PrereqCharacterContext,
): PrerequisiteEvaluationV1 {
	const normalized = normalizePrerequisiteInput(contract);
	const evaluated = normalized.root
		? evaluateNode(normalized.root, character, "root")
		: ({ state: "satisfied", issues: [] } satisfies NodeEvaluation);
	const outcome = evaluated.issues.reduce<PrerequisiteOutcome | null>(
		(highest, issue) =>
			!highest || OUTCOME_PRIORITY[issue.outcome] > OUTCOME_PRIORITY[highest]
				? issue.outcome
				: highest,
		null,
	);

	return {
		version: PREREQUISITE_SCHEMA_VERSION,
		ok: evaluated.state === "satisfied",
		blocking: evaluated.issues.some((issue) => issue.outcome === "strict"),
		verified: evaluated.issues.every((issue) => issue.outcome !== "manual"),
		state: evaluated.state,
		outcome,
		issues: evaluated.issues,
		missing: evaluated.issues.map((issue) => issue.message),
		advisories: evaluated.issues
			.filter((issue) => issue.outcome !== "strict")
			.map((issue) => issue.message),
		contract: normalized,
	};
}

/** Normalize and evaluate any supported legacy or versioned input. */
export function evaluatePrerequisites(
	input: PrerequisiteInput,
	character: PrereqCharacterContext,
): PrerequisiteEvaluationV1 {
	return evaluatePrerequisiteContract(
		normalizePrerequisiteInput(input),
		character,
	);
}

/** Singular alias for callers evaluating one prerequisite tree. */
export const evaluatePrerequisite = evaluatePrerequisites;

// ── Legacy validation API ──────────────────────────────────────────

/**
 * Check a character against a prerequisite spec.
 *
 * Returns `{ ok: true, missing: [] }` when the spec is met (or empty),
 * otherwise `{ ok: false, missing: [...] }` with one short message per
 * unmet requirement. `textOnly` is unverifiable and therefore returned as a
 * manual-review message instead of being silently treated as satisfied.
 */
export function validatePrereq(
	spec: PrerequisiteSpec | null | undefined,
	character: PrereqCharacterContext,
): PrereqValidation {
	const missing: string[] = [];
	if (!spec) return { ok: true, missing };

	// Ability score minimums
	if (spec.minAbility) {
		for (const [ability, min] of Object.entries(spec.minAbility) as Array<
			[AbilityScore, number]
		>) {
			const score = character.abilities[ability] ?? 10;
			if (score < min) {
				missing.push(`Requires ${ability} ${min}+ (have ${score}).`);
			}
		}
	}

	// Minimum level
	if (typeof spec.minLevel === "number" && character.level < spec.minLevel) {
		missing.push(
			`Requires character level ${spec.minLevel} (have ${character.level}).`,
		);
	}

	// Required job
	if (spec.requiredJob) {
		const charJob = jobName(character.job);
		if (!charJob || normalize(charJob) !== normalize(spec.requiredJob)) {
			missing.push(
				`Requires job: ${spec.requiredJob}${charJob ? ` (have ${charJob})` : ""}.`,
			);
		}
	}

	// Required feature (any one of the listed names)
	if (spec.requiredFeature && spec.requiredFeature.length > 0) {
		const have = new Set(
			(character.features ?? []).map((feature) => normalize(feature.name)),
		);
		const matched = spec.requiredFeature.some((required) =>
			have.has(normalize(required)),
		);
		if (!matched) {
			missing.push(`Requires feature: ${spec.requiredFeature.join(" or ")}.`);
		}
	}

	// Required proficiency (any one of the listed names)
	if (spec.requiredProficiency && spec.requiredProficiency.length > 0) {
		const have = new Set(
			(character.proficiencies ?? []).map((entry) => normalize(entry)),
		);
		const matched = spec.requiredProficiency.some((required) =>
			have.has(normalize(required)),
		);
		if (!matched) {
			missing.push(
				`Requires proficiency: ${spec.requiredProficiency.join(" or ")}.`,
			);
		}
	}

	if (spec.textOnly?.trim()) {
		missing.push(`Manual review required: ${spec.textOnly.trim()}`);
	}

	return { ok: missing.length === 0, missing };
}

/**
 * Parse a free-form prerequisite string into a structured PrerequisiteSpec.
 *
 * Handles the most common DDB/SRD patterns:
 *  - "Strength 13 or higher"
 *  - "Dexterity 13 or higher; proficiency with heavy armor"
 *  - "Level 5"
 *  - "Spellcasting feature"
 *
 * Unknown segments are preserved in `textOnly` for display/manual review.
 */
export function parsePrerequisiteText(
	text: string | null | undefined,
): PrerequisiteSpec | null {
	if (!text?.trim()) return null;
	const spec: PrerequisiteSpec = {};
	const abilityNames: Array<[RegExp, AbilityScore]> = [
		[/strength|\bSTR\b/i, "STR"],
		[/dexterity|agility|\b(?:AGI|DEX)\b/i, "AGI"],
		[/constitution|vitality|\b(?:VIT|CON)\b/i, "VIT"],
		[/intelligence|\bINT\b/i, "INT"],
		[/wisdom|sense|\b(?:SENSE|WIS)\b/i, "SENSE"],
		[/charisma|presence|\b(?:PRE|CHA)\b/i, "PRE"],
	];

	const segments = text.split(/[,;]| and /i).map((segment) => segment.trim());
	const unmatched: string[] = [];

	for (const segment of segments) {
		if (!segment) continue;
		let matched = false;

		// "Ability NN or higher" / "NN Ability"
		for (const [pattern, ability] of abilityNames) {
			const match =
				segment.match(new RegExp(`(?:${pattern.source}).*?(\\d+)`, "i")) ??
				segment.match(new RegExp(`(\\d+).*?(?:${pattern.source})`, "i"));
			if (match) {
				const minimum = Number.parseInt(match[1], 10);
				if (Number.isFinite(minimum)) {
					spec.minAbility = spec.minAbility ?? {};
					spec.minAbility[ability] = Math.max(
						spec.minAbility[ability] ?? 0,
						minimum,
					);
					matched = true;
					break;
				}
			}
		}
		if (matched) continue;

		// "Level NN"
		const levelMatch = segment.match(/level\s+(\d+)/i);
		if (levelMatch) {
			spec.minLevel = Math.max(
				spec.minLevel ?? 0,
				Number.parseInt(levelMatch[1], 10),
			);
			continue;
		}

		// "Proficiency with X"
		const proficiencyMatch = segment.match(/proficien(?:cy|t)\s+with\s+(.+)$/i);
		if (proficiencyMatch) {
			spec.requiredProficiency = [
				...(spec.requiredProficiency ?? []),
				proficiencyMatch[1].trim(),
			];
			continue;
		}

		// "Spellcasting feature" or "Pact Magic feature"
		const featureMatch = segment.match(/(.+?)\s+feature/i);
		if (featureMatch) {
			spec.requiredFeature = [
				...(spec.requiredFeature ?? []),
				featureMatch[1].trim(),
			];
			continue;
		}

		unmatched.push(segment);
	}

	if (unmatched.length > 0) {
		spec.textOnly = unmatched.join("; ");
	}

	return Object.keys(spec).length > 0 ? spec : null;
}
