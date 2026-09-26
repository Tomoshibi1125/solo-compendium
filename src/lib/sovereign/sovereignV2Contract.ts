import { z } from "zod";
import type { FeatureEffect } from "@/types/featureEffects";
import { SOVEREIGN_ABILITY_LEVELS } from "@/lib/sovereign/sovereignContract";

/**
 * Sovereign definition v2 contract.
 *
 * This module intentionally owns only the contract/compatibility boundary. It
 * does not persist, attach, project, or execute Sovereigns; those are later
 * delivery slices. Numeric limits below are serialization-safety bounds, not
 * game-balance ceilings. Balance budgets remain an explicit design decision.
 */
export const SOVEREIGN_V2_SCHEMA_VERSION = 2 as const;

export const SOVEREIGN_ACTION_TYPES = [
	"action",
	"bonus-action",
	"reaction",
	"passive",
] as const;
export const SOVEREIGN_RECHARGE_TYPES = [
	"at-will",
	"short-rest",
	"long-rest",
] as const;
export const SOVEREIGN_ANCESTRY_SOURCES = [
	"job",
	"path",
	"regent-a",
	"regent-b",
] as const;
export const SOVEREIGN_ABILITY_SCORES = [
	"STR",
	"AGI",
	"VIT",
	"INT",
	"SENSE",
	"PRE",
] as const;

const ActionTypeSchema = z.enum(SOVEREIGN_ACTION_TYPES);
const RechargeSchema = z.enum(SOVEREIGN_RECHARGE_TYPES);
const AncestrySourceSchema = z.enum(SOVEREIGN_ANCESTRY_SOURCES);
const AbilityScoreSchema = z.enum(SOVEREIGN_ABILITY_SCORES);

const StableIdSchema = z
	.string()
	.trim()
	.min(1)
	.max(128)
	.regex(
		/^[A-Za-z0-9][A-Za-z0-9._:-]*$/,
		"must be a stable identifier containing only letters, numbers, ., _, :, or -",
	);
const ShortStringSchema = z.string().trim().min(1).max(160);
const LongStringSchema = z.string().trim().min(1).max(12_000);
const OptionalLongStringSchema = z.string().trim().min(1).max(4_000).optional();
const SafeIntegerSchema = z
	.number()
	.int()
	.min(Number.MIN_SAFE_INTEGER)
	.max(Number.MAX_SAFE_INTEGER);
const NonNegativeSafeIntegerSchema = z
	.number()
	.int()
	.min(0)
	.max(Number.MAX_SAFE_INTEGER);
const PositiveSafeIntegerSchema = z
	.number()
	.int()
	.min(1)
	.max(Number.MAX_SAFE_INTEGER);

const AncestrySchema = z
	.array(AncestrySourceSchema)
	.min(1)
	.max(SOVEREIGN_ANCESTRY_SOURCES.length)
	.superRefine((sources, context) => {
		if (new Set(sources).size !== sources.length) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "ancestry sources must be unique",
			});
		}
	});

const ConstantExpressionSchema = z
	.object({
		kind: z.literal("constant"),
		value: SafeIntegerSchema,
	})
	.strict();
const ProficiencyExpressionSchema = z
	.object({ kind: z.literal("proficiency-bonus") })
	.strict();
const AbilityModifierExpressionSchema = z
	.object({
		kind: z.literal("ability-modifier"),
		ability: AbilityScoreSchema,
	})
	.strict();
const DiceExpressionSchema = z
	.object({
		kind: z.literal("dice"),
		count: PositiveSafeIntegerSchema,
		sides: z.number().int().min(2).max(Number.MAX_SAFE_INTEGER),
		bonus: SafeIntegerSchema.optional(),
	})
	.strict();

const AtomicExpressionSchema = z.discriminatedUnion("kind", [
	ConstantExpressionSchema,
	ProficiencyExpressionSchema,
	AbilityModifierExpressionSchema,
	DiceExpressionSchema,
]);

/**
 * Declarative bounded expression grammar. Arbitrary formula strings are not
 * accepted. Sums are deliberately flat to keep evaluation deterministic.
 */
export const SovereignExpressionSchema = z.discriminatedUnion("kind", [
	ConstantExpressionSchema,
	ProficiencyExpressionSchema,
	AbilityModifierExpressionSchema,
	DiceExpressionSchema,
	z
		.object({
			kind: z.literal("sum"),
			terms: z.array(AtomicExpressionSchema).min(1).max(64),
		})
		.strict(),
]);

const ModifierCommon = {
	id: StableIdSchema,
	source_id: StableIdSchema,
	ancestry: AncestrySchema,
	duration: z.literal("persistent"),
	stacking: z.literal("engine-default"),
};

const ResistanceModifierSchema = z
	.object({
		...ModifierCommon,
		kind: z.literal("resistance"),
		damage_type: ShortStringSchema,
	})
	.strict();
const AdvantageModifierSchema = z
	.object({
		...ModifierCommon,
		kind: z.literal("advantage"),
		roll_type: z.enum(["attack", "check", "save"]),
		condition: z.string().trim().min(1).max(240).optional(),
	})
	.strict();
const ProficiencyModifierSchema = z
	.object({
		...ModifierCommon,
		kind: z.literal("proficiency"),
		proficiency_type: z.enum([
			"skill",
			"save",
			"tool",
			"weapon",
			"armor",
			"language",
		]),
		target: ShortStringSchema,
	})
	.strict();
const ExpertiseModifierSchema = z
	.object({
		...ModifierCommon,
		kind: z.literal("expertise"),
		skill: ShortStringSchema,
	})
	.strict();
const SaveProficiencyModifierSchema = z
	.object({
		...ModifierCommon,
		kind: z.literal("save-proficiency"),
		ability: AbilityScoreSchema,
	})
	.strict();

/**
 * Only modifier kinds with an existing FeatureEffect consumer are accepted in
 * v2. Unsupported automation is rejected at validation instead of being
 * silently ignored. Additional operations can be added after their rules and
 * engine consumers are defined.
 */
export const SovereignModifierSchema = z.discriminatedUnion("kind", [
	ResistanceModifierSchema,
	AdvantageModifierSchema,
	ProficiencyModifierSchema,
	ExpertiseModifierSchema,
	SaveProficiencyModifierSchema,
]);

const EntityCompatibilitySchema = z.enum(["native", "manual-only"]);
const EntityFields = {
	id: StableIdSchema,
	name: ShortStringSchema,
	description: LongStringSchema,
	ancestry: AncestrySchema,
	modifier_ids: z.array(StableIdSchema).max(256),
	compatibility: EntityCompatibilitySchema,
};

const TraitSchema = z.object(EntityFields).strict();
const FeatureSchema = z.object(EntityFields).strict();
const AffinitySchema = z
	.object({
		id: StableIdSchema,
		name: ShortStringSchema,
		description: OptionalLongStringSchema,
		ancestry: AncestrySchema,
	})
	.strict();

const ResourceSchema = z
	.object({
		id: StableIdSchema,
		name: ShortStringSchema,
		description: LongStringSchema,
		ancestry: AncestrySchema,
		maximum: SovereignExpressionSchema,
		recharge: z.enum(["short-rest", "long-rest"]),
	})
	.strict();

const ResourceCostSchema = z
	.object({
		resource_id: StableIdSchema,
		amount: PositiveSafeIntegerSchema,
	})
	.strict();

const AbilitySchema = z
	.object({
		id: StableIdSchema,
		name: ShortStringSchema,
		description: LongStringSchema,
		level: z.number().int().min(1).max(20),
		action_type: ActionTypeSchema,
		recharge: RechargeSchema.nullable(),
		is_capstone: z.boolean(),
		ancestry: AncestrySchema,
		modifier_ids: z.array(StableIdSchema).max(256),
		resource_costs: z.array(ResourceCostSchema).max(64),
		compatibility: EntityCompatibilitySchema,
	})
	.strict();

const GenerationMetadataSchema = z
	.object({
		contract_revision: z.literal(SOVEREIGN_V2_SCHEMA_VERSION),
		ruleset_revision: StableIdSchema,
		canonical_source_revision: StableIdSchema,
		generator: ShortStringSchema,
		generated_at: z.string().datetime(),
		operation_id: StableIdSchema,
		source_ids: z
			.object({
				job: StableIdSchema,
				path: StableIdSchema,
				regent_a: StableIdSchema,
				regent_b: StableIdSchema,
			})
			.strict(),
	})
	.strict();

export const SovereignV2DefinitionSchema = z
	.object({
		schema_version: z.literal(SOVEREIGN_V2_SCHEMA_VERSION),
		id: StableIdSchema,
		identity: z
			.object({
				name: ShortStringSchema,
				title: ShortStringSchema,
				epithet: ShortStringSchema,
			})
			.strict(),
		description: LongStringSchema,
		manifestation: LongStringSchema,
		fusion_theme: ShortStringSchema,
		combat_doctrine: LongStringSchema,
		primary_abilities: z.array(AbilityScoreSchema).min(1).max(6),
		affinities: z.array(AffinitySchema).max(256),
		traits: z.array(TraitSchema).max(256),
		features: z.array(FeatureSchema).max(256),
		abilities: z.array(AbilitySchema).length(SOVEREIGN_ABILITY_LEVELS.length),
		resources: z.array(ResourceSchema).max(256),
		modifiers: z.array(SovereignModifierSchema).max(512),
		generation: GenerationMetadataSchema,
		compatibility: z
			.object({
				status: z.literal("native"),
				notes: z.array(z.string().trim().min(1).max(500)).max(64),
			})
			.strict(),
	})
	.strict();

export type SovereignV2Definition = z.infer<typeof SovereignV2DefinitionSchema>;
export type SovereignV2Modifier = z.infer<typeof SovereignModifierSchema>;
export type SovereignV2Expression = z.infer<typeof SovereignExpressionSchema>;
export type SovereignV2SourceIds = SovereignV2Definition["generation"]["source_ids"];

export type SovereignV2ValidationResult =
	| { ok: true; definition: SovereignV2Definition }
	| { ok: false; errors: string[] };

const normalizedName = (value: string): string => value.trim().toLocaleLowerCase();

const duplicateValues = (values: readonly string[]): string[] => {
	const seen = new Set<string>();
	const duplicates = new Set<string>();
	for (const value of values) {
		const key = normalizedName(value);
		if (seen.has(key)) duplicates.add(value);
		seen.add(key);
	}
	return [...duplicates];
};

const hasEveryAncestrySource = (sources: readonly string[]): boolean => {
	const present = new Set(sources);
	return SOVEREIGN_ANCESTRY_SOURCES.every((source) => present.has(source));
};

/**
 * Strict semantic validation shared by generated and imported v2 definitions.
 */
export function validateSovereignV2Definition(
	raw: unknown,
	expectedSources?: Partial<SovereignV2SourceIds>,
): SovereignV2ValidationResult {
	const parsed = SovereignV2DefinitionSchema.safeParse(raw);
	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.issues.map(
				(issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
			),
		};
	}

	const definition = parsed.data;
	const errors: string[] = [];

	if (new Set(definition.primary_abilities).size !== definition.primary_abilities.length) {
		errors.push("primary_abilities must be unique");
	}

	if (definition.generation.source_ids.regent_a === definition.generation.source_ids.regent_b) {
		errors.push("generation.source_ids requires two distinct Regents");
	}

	for (const [key, expected] of Object.entries(expectedSources ?? {})) {
		if (expected && definition.generation.source_ids[key as keyof SovereignV2SourceIds] !== expected) {
			errors.push(`generation.source_ids.${key} does not match the canonical input`);
		}
	}

	for (let index = 0; index < SOVEREIGN_ABILITY_LEVELS.length; index++) {
		const ability = definition.abilities[index];
		const expectedLevel = SOVEREIGN_ABILITY_LEVELS[index];
		if (ability.level !== expectedLevel) {
			errors.push(`abilities.${index}.level must be the ordered level-${expectedLevel} milestone`);
		}
		const expectedCapstone = expectedLevel === 17 || expectedLevel === 20;
		if (ability.is_capstone !== expectedCapstone) {
			errors.push(
				expectedCapstone
					? `abilities.${index} must be a capstone`
					: `abilities.${index} must not be a capstone`,
			);
		}
		if (expectedCapstone && !hasEveryAncestrySource(ability.ancestry)) {
			errors.push(`abilities.${index}.ancestry must identify all four fusion sources`);
		}
	}

	const ancestry = [
		...definition.affinities.flatMap((entry) => entry.ancestry),
		...definition.traits.flatMap((entry) => entry.ancestry),
		...definition.features.flatMap((entry) => entry.ancestry),
		...definition.abilities.flatMap((entry) => entry.ancestry),
		...definition.resources.flatMap((entry) => entry.ancestry),
		...definition.modifiers.flatMap((entry) => entry.ancestry),
	];
	if (!hasEveryAncestrySource(ancestry)) {
		errors.push("ancestry tags across the package must represent job, path, Regent A, and Regent B");
	}

	const identifiedEntities = [
		...definition.affinities.map((entry) => ({ id: entry.id, name: entry.name })),
		...definition.traits.map((entry) => ({ id: entry.id, name: entry.name })),
		...definition.features.map((entry) => ({ id: entry.id, name: entry.name })),
		...definition.abilities.map((entry) => ({ id: entry.id, name: entry.name })),
		...definition.resources.map((entry) => ({ id: entry.id, name: entry.name })),
		...definition.modifiers.map((entry) => ({ id: entry.id, name: entry.id })),
	];
	const duplicateIds = duplicateValues(identifiedEntities.map((entry) => entry.id));
	if (duplicateIds.length > 0) {
		errors.push(`stable IDs must be globally unique: ${duplicateIds.join(", ")}`);
	}
	const duplicateNames = duplicateValues(
		identifiedEntities
			.filter((entry) => entry.name !== entry.id)
			.map((entry) => entry.name),
	);
	if (duplicateNames.length > 0) {
		errors.push(`entity names must be unique: ${duplicateNames.join(", ")}`);
	}

	const modifiersById = new Map(definition.modifiers.map((modifier) => [modifier.id, modifier]));
	const resourceIds = new Set(definition.resources.map((resource) => resource.id));
	const modifierOwners = new Set([
		...definition.traits.map((entry) => entry.id),
		...definition.features.map((entry) => entry.id),
		...definition.abilities.map((entry) => entry.id),
	]);

	for (const modifier of definition.modifiers) {
		if (!modifierOwners.has(modifier.source_id)) {
			errors.push(`modifier ${modifier.id} source_id does not reference a trait, feature, or ability`);
		}
	}

	const entitiesWithModifiers = [
		...definition.traits,
		...definition.features,
		...definition.abilities,
	];
	for (const entity of entitiesWithModifiers) {
		if (new Set(entity.modifier_ids).size !== entity.modifier_ids.length) {
			errors.push(`${entity.id}.modifier_ids must not contain duplicates`);
		}
		for (const modifierId of entity.modifier_ids) {
			const modifier = modifiersById.get(modifierId);
			if (!modifier) {
				errors.push(`${entity.id}.modifier_ids references unknown modifier ${modifierId}`);
				continue;
			}
			if (modifier.source_id !== entity.id) {
				errors.push(`${entity.id}.modifier_ids references modifier ${modifierId} owned by ${modifier.source_id}`);
			}
		}
		if (entity.compatibility === "manual-only" && entity.modifier_ids.length > 0) {
			errors.push(`${entity.id} is manual-only and cannot claim automated modifiers`);
		}
	}

	for (const ability of definition.abilities) {
		const seenCosts = new Set<string>();
		for (const cost of ability.resource_costs) {
			if (!resourceIds.has(cost.resource_id)) {
				errors.push(`${ability.id}.resource_costs references unknown resource ${cost.resource_id}`);
			}
			if (seenCosts.has(cost.resource_id)) {
				errors.push(`${ability.id}.resource_costs must not repeat ${cost.resource_id}`);
			}
			seenCosts.add(cost.resource_id);
		}
	}

	return errors.length > 0 ? { ok: false, errors } : { ok: true, definition };
}

/** Map a validated v2 modifier into the existing structured effect consumer. */
export function sovereignModifierToFeatureEffect(
	modifier: SovereignV2Modifier,
): FeatureEffect {
	switch (modifier.kind) {
		case "resistance":
			return { kind: "resistance", damageType: modifier.damage_type };
		case "advantage":
			return {
				kind: "advantage",
				rollType: modifier.roll_type,
				...(modifier.condition ? { condition: modifier.condition } : {}),
			};
		case "proficiency":
			return {
				kind: "proficiency",
				proficiencyType: modifier.proficiency_type,
				target: modifier.target,
			};
		case "expertise":
			return { kind: "expertise", skill: modifier.skill };
		case "save-proficiency":
			return { kind: "save_proficiency", ability: modifier.ability };
	}
}

const LegacyAbilitySchema = z
	.object({
		name: z.string().min(1),
		description: z.string().min(1),
		level: z.number().int().min(1).max(20),
	})
	.passthrough();

const LegacySovereignSchema = z
	.object({
		name: z.string().min(1),
		title: z.string().min(1),
		description: z.string().min(1),
		abilities: z.array(LegacyAbilitySchema),
	})
	.passthrough();

export type SovereignDefinitionReadResult =
	| {
			ok: true;
			kind: "v2";
			definition: SovereignV2Definition;
			compatibility: { status: "native"; unsupported: string[] };
	  }
	| {
			ok: true;
			kind: "legacy";
			definition: Record<string, unknown>;
			compatibility: { status: "legacy-visible"; unsupported: string[] };
	  }
	| { ok: false; errors: string[] };

/**
 * Compatibility reader for persisted/imported definitions. Unversioned v1
 * records remain visible exactly as stored; the reader does not manufacture
 * v2 IDs, ancestry, resources, or mechanics for them.
 */
export function readSovereignDefinition(raw: unknown): SovereignDefinitionReadResult {
	if (
		raw &&
		typeof raw === "object" &&
		!Array.isArray(raw) &&
		(raw as Record<string, unknown>).schema_version === SOVEREIGN_V2_SCHEMA_VERSION
	) {
		const validation = validateSovereignV2Definition(raw);
		return validation.ok
			? {
					ok: true,
					kind: "v2",
					definition: validation.definition,
					compatibility: { status: "native", unsupported: [] },
				}
			: validation;
	}

	const legacy = LegacySovereignSchema.safeParse(raw);
	if (!legacy.success || !raw || typeof raw !== "object" || Array.isArray(raw)) {
		return {
			ok: false,
			errors: legacy.success
				? ["legacy Sovereign must be an object"]
				: legacy.error.issues.map(
						(issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`,
					),
		};
	}

	return {
		ok: true,
		kind: "legacy",
		definition: raw as Record<string, unknown>,
		compatibility: {
			status: "legacy-visible",
			unsupported: [
				"stable-entity-ids",
				"structured-mechanics",
				"declared-ancestry",
				"typed-resources",
			],
		},
	};
}

export function normalizeExternalSovereignActionType(
	value: string | null | undefined,
): z.infer<typeof ActionTypeSchema> | null {
	if (!value) return null;
	const normalized = value.trim().toLowerCase().replace(/_/g, "-");
	switch (normalized) {
		case "action":
		case "1 action":
			return "action";
		case "bonus-action":
		case "bonus action":
		case "1 bonus action":
			return "bonus-action";
		case "reaction":
		case "1 reaction":
			return "reaction";
		case "passive":
			return "passive";
		default:
			return null;
	}
}

export function toExternalSovereignActionType(
	value: z.infer<typeof ActionTypeSchema>,
): string {
	switch (value) {
		case "action":
			return "1 action";
		case "bonus-action":
			return "1 bonus action";
		case "reaction":
			return "1 reaction";
		case "passive":
			return "Passive";
	}
}

export function normalizeExternalSovereignRecharge(
	value: string | null | undefined,
): z.infer<typeof RechargeSchema> | null {
	if (!value) return null;
	const normalized = value.trim().toLowerCase().replace(/_/g, "-");
	switch (normalized) {
		case "at will":
		case "at-will":
			return "at-will";
		case "short rest":
		case "short-rest":
			return "short-rest";
		case "long rest":
		case "long-rest":
			return "long-rest";
		default:
			return null;
	}
}

export function toExternalSovereignRecharge(
	value: z.infer<typeof RechargeSchema> | null,
): string | null {
	switch (value) {
		case "at-will":
			return "At will";
		case "short-rest":
			return "Short Rest";
		case "long-rest":
			return "Long Rest";
		case null:
			return null;
	}
}

// This type import documents the legacy object boundary without converting it.
export type LegacyGeneratedSovereign = import("@/lib/geminiProtocol").GeneratedSovereign;
