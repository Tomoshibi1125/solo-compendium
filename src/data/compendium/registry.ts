// biome-ignore-all format: Source descriptors and lineage tables intentionally stay compact for reviewable canon diffs.
/**
 * Universal Rift Ascendant compendium registry.
 *
 * This module is the inventory and reconciliation boundary for in-project canon.
 * It deliberately collects source shards before provider transforms so source
 * lineage, losing candidates, and contradictions remain observable.
 */

import { canonicalConflictResolutions } from "./conflict-resolutions";

export const RA_CANON_SOURCE_BOOK = "Rift Ascendant Canon" as const;

export const compendiumCategories = [
	"anomalies",
	"artifacts",
	"backgrounds",
	"campaign-modules",
	"conditions",
	"crafting",
	"feats",
	"fighting-styles",
	"guild-base",
	"items",
	"jobs",
	"languages",
	"locations",
	"npcs",
	"pantheon",
	"paths",
	"powers",
	"quest-contracts",
	"regents",
	"relics",
	"reward-tables",
	"rollable-tables",
	"runes",
	"shadow-soldiers",
	"sigils",
	"skills",
	"spells",
	"tattoos",
	"techniques",
	"vehicle-mods",
	"vehicles",
	"world-reference",
] as const;

export type CompendiumCategory = (typeof compendiumCategories)[number];

export const providerBackedCompendiumCategories = [
	"anomalies",
	"artifacts",
	"backgrounds",
	"conditions",
	"crafting",
	"feats",
	"fighting-styles",
	"guild-base",
	"items",
	"jobs",
	"locations",
	"npcs",
	"pantheon",
	"paths",
	"powers",
	"regents",
	"relics",
	"rollable-tables",
	"runes",
	"shadow-soldiers",
	"sigils",
	"skills",
	"spells",
	"tattoos",
	"techniques",
	"vehicles",
] as const satisfies readonly CompendiumCategory[];

export type ProviderBackedCompendiumCategory =
	(typeof providerBackedCompendiumCategories)[number];

export const canonicalPublicEntryTypes = [
	"jobs",
	"paths",
	"powers",
	"runes",
	"relics",
	"anomalies",
	"backgrounds",
	"conditions",
	"regents",
	"vehicles",
	"crafting",
	"guild-base",
	"feats",
	"fighting-styles",
	"skills",
	"equipment",
	"shadow-soldiers",
	"items",
	"spells",
	"techniques",
	"artifacts",
	"locations",
	"sigils",
	"tattoos",
	"rollable-tables",
	"deities",
	"pantheon",
	"npcs",
] as const;

export type CanonicalPublicEntryType =
	(typeof canonicalPublicEntryTypes)[number];

export const compendiumProviderMethods = [
	"getAnomalies",
	"getArtifacts",
	"getBackgrounds",
	"getConditions",
	"getCrafting",
	"getFeats",
	"getFightingStyles",
	"getGuildBase",
	"getItems",
	"getJobs",
	"getLocations",
	"getNpcs",
	"getPantheon",
	"getPaths",
	"getPowers",
	"getRegents",
	"getRelics",
	"getRollableTables",
	"getRunes",
	"getShadowSoldiers",
	"getSigils",
	"getSkills",
	"getSpells",
	"getTattoos",
	"getTechniques",
	"getVehicles",
] as const;

export type CompendiumProviderMethod =
	(typeof compendiumProviderMethods)[number];

export type SourceRole =
	| "authoritative"
	| "supplemental"
	| "derived"
	| "legacy";

export type OriginKind = "homebrew" | "srd" | "generated";

export type CanonicalEntryRecord = Record<string, unknown>;

export interface CanonicalEntrySchema {
	requiredFields: readonly ["id", "name"];
	idFields: readonly string[];
	nameFields: readonly string[];
	descriptionFields: readonly string[];
	setLikeFields: readonly string[];
	/** Authored fields that may contribute to runtime mechanics. */
	mechanicalFields: readonly string[];
	/** Versioned field that carries automation/manual classification when present. */
	resolutionField: string | null;
}

export interface ReferenceDescriptor {
	id: string;
	fromCategory: CompendiumCategory;
	fieldPath: string;
	targetCategories: readonly CompendiumCategory[];
	discriminatorPath?: string;
	targetCategoryByDiscriminator?: Readonly<
		Record<string, CompendiumCategory>
	>;
	matchBy?: "id" | "id-or-name";
	requiredWhenPresent: boolean;
	description: string;
}

export interface CompendiumCategoryDefinition {
	id: CompendiumCategory;
	description: string;
	providerMethod: CompendiumProviderMethod | null;
	publicTypes: readonly CanonicalPublicEntryType[];
	sourceIds: readonly string[];
	schema: CanonicalEntrySchema;
	references: readonly ReferenceDescriptor[];
}

export interface CompendiumSourceDescriptor {
	id: string;
	category: CompendiumCategory;
	modulePath: string;
	exportName: string;
	role: SourceRole;
	origin: OriginKind;
	loadPolicy: "eager" | "deferred";
	sourceBook: typeof RA_CANON_SOURCE_BOOK;
	lineage: readonly string[];
	description: string;
}

export interface RegisteredCompendiumSource
	extends CompendiumSourceDescriptor {
	load: () => Promise<readonly unknown[]>;
}

export type CompendiumLineageKind =
	| "aggregate"
	| "normalization"
	| "provider-transform"
	| "public-view"
	| "audit"
	| "publication";

export interface CompendiumLineageDescriptor {
	id: string;
	kind: CompendiumLineageKind;
	modulePath: string;
	inputIds: readonly string[];
	outputCategories: readonly CompendiumCategory[];
	independentEvidence: false;
	description: string;
}

export interface CompendiumCandidate<T = CanonicalEntryRecord> {
	category: CompendiumCategory;
	source: CompendiumSourceDescriptor;
	raw: T;
	ordinal: number;
	sequence: number;
	rawId: string | null;
	rawName: string | null;
	normalizedName: string | null;
}

export type ProvenanceOperation =
	| "single"
	| "equal"
	| "filled-missing"
	| "object-merge"
	| "array-superset"
	| "declared-union"
	| "explicit-resolution";

export interface FieldProvenance {
	chosenSourceIds: string[];
	agreeingSourceIds: string[];
	operation: ProvenanceOperation;
}

export interface EntryProvenance {
	canonicalKey: string;
	category: CompendiumCategory;
	sourceIds: string[];
	fields: Record<string, FieldProvenance>;
}

export type MergeConflictKind =
	| "ambiguous-name"
	| "ambiguous-reference"
	| "category-membership"
	| "field-disagreement"
	| "identity-collision"
	| "invalid-candidate"
	| "registry-configuration"
	| "shape-mismatch"
	| "source-load-failure"
	| "unresolved-reference";

export interface MergeConflictCandidate {
	sourceId: string;
	ordinal?: number;
	rawId?: string | null;
	value: unknown;
}

export interface MergeConflict {
	id: string;
	kind: MergeConflictKind;
	category: CompendiumCategory;
	canonicalKey?: string;
	fieldPath?: string;
	candidates: MergeConflictCandidate[];
	message: string;
	status: "unresolved" | "resolved";
	blocking: boolean;
	resolutionId?: string;
}

export interface MergeResolution {
	conflictId: string;
	selectedSourceId?: string;
	value?: unknown;
	rationale: string;
	reviewedBy: string;
}

export interface CanonicalRegistryEntry<
	T extends CanonicalEntryRecord = CanonicalEntryRecord,
> {
	key: string;
	category: CompendiumCategory;
	value: T;
	provenance: EntryProvenance;
	sourceLineage: CompendiumSourceDescriptor[];
}

export interface ReferenceResolution {
	descriptorId: string;
	fromKey: string;
	fieldPath: string;
	reference: string;
	targetCategory: CompendiumCategory | null;
	targetKey: string | null;
	matchedBy: "id" | "name" | "none" | "ambiguous";
	required: boolean;
}

export interface CanonicalRegistrySnapshot {
	entries: Record<CompendiumCategory, CanonicalRegistryEntry[]>;
	candidates: Record<CompendiumCategory, CompendiumCandidate[]>;
	conflicts: MergeConflict[];
	blockingConflicts: MergeConflict[];
	references: ReferenceResolution[];
	loadedSourceIds: string[];
	sourceCounts: Record<string, number>;
	candidateCount: number;
	entryCount: number;
}

export interface MergeCanonicalCandidatesResult<
	T extends CanonicalEntryRecord = CanonicalEntryRecord,
> {
	entries: CanonicalRegistryEntry<T>[];
	conflicts: MergeConflict[];
}

const universalSchema = (
	setLikeFields: readonly string[] = [
		"aliases",
		"classes",
		"tags",
		"theme_tags",
	],
): CanonicalEntrySchema => ({
	requiredFields: ["id", "name"],
	idFields: ["id"],
	nameFields: ["name", "display_name", "title"],
	descriptionFields: ["description", "summary", "overview"],
	setLikeFields,
	mechanicalFields: [],
	resolutionField: null,
});

const abilitySchema = (
	kind: "power" | "spell" | "technique",
): CanonicalEntrySchema => ({
	...universalSchema(["aliases", "classes", "tags", "theme_tags"]),
	descriptionFields: [
		"description",
		"effect",
		"effect_description",
		"mechanics.special",
	],
	mechanicalFields: [
		"activation",
		"activation_time",
		"casting_time",
		"target",
		"range",
		"duration",
		"attack",
		"saving_throw",
		"damage_roll",
		"damage_type",
		"healing",
		"higher_levels",
		"uses_per_rest_formula",
		"limitations",
		"mechanics",
	],
	resolutionField: "ability_resolution",
	setLikeFields:
		kind === "technique"
			? ["aliases", "classes", "tags", "theme_tags", "prerequisites.proficiency", "prerequisites.technique"]
			: ["aliases", "classes", "tags", "theme_tags"],
});

const pathJobReference: ReferenceDescriptor = {
	id: "paths.parent-job",
	fromCategory: "paths",
	fieldPath: "jobId",
	targetCategories: ["jobs"],
	matchBy: "id",
	requiredWhenPresent: true,
	description: "Every path belongs to one canonical job.",
};

const runeAbilityReference: ReferenceDescriptor = {
	id: "runes.taught-ability",
	fromCategory: "runes",
	fieldPath: "teaches.ref",
	targetCategories: ["spells", "powers", "techniques"],
	discriminatorPath: "teaches.kind",
	targetCategoryByDiscriminator: {
		spell: "spells",
		power: "powers",
		technique: "techniques",
	},
	matchBy: "id",
	requiredWhenPresent: true,
	description: "A learning rune must resolve the exact ability it teaches.",
};

const jobAbilityReferences: readonly ReferenceDescriptor[] = [
	{
		id: "jobs.innate-spells",
		fromCategory: "jobs",
		fieldPath: "innate_channeling.spells[].name",
		targetCategories: ["spells"],
		matchBy: "id-or-name",
		requiredWhenPresent: false,
		description: "Authored innate spell grants are reconciled by canonical ID or exact name.",
	},
	{
		id: "jobs.explicit-spell-grants",
		fromCategory: "jobs",
		fieldPath: "ability_grants.spells[]",
		targetCategories: ["spells"],
		matchBy: "id",
		requiredWhenPresent: false,
		description: "Structured Job spell grants resolve only by canonical ID.",
	},
	{
		id: "jobs.explicit-power-grants",
		fromCategory: "jobs",
		fieldPath: "ability_grants.powers[]",
		targetCategories: ["powers"],
		matchBy: "id",
		requiredWhenPresent: false,
		description: "Structured Job power grants resolve only by canonical ID.",
	},
	{
		id: "jobs.explicit-technique-grants",
		fromCategory: "jobs",
		fieldPath: "ability_grants.techniques[]",
		targetCategories: ["techniques"],
		matchBy: "id",
		requiredWhenPresent: false,
		description: "Structured Job technique grants resolve only by canonical ID.",
	},
];

const pathAbilityReferences: readonly ReferenceDescriptor[] = [
	{
		id: "paths.explicit-spell-grants",
		fromCategory: "paths",
		fieldPath: "ability_grants.spells[]",
		targetCategories: ["spells"],
		matchBy: "id",
		requiredWhenPresent: false,
		description: "Structured Path spell grants resolve only by canonical ID.",
	},
	{
		id: "paths.explicit-power-grants",
		fromCategory: "paths",
		fieldPath: "ability_grants.powers[]",
		targetCategories: ["powers"],
		matchBy: "id",
		requiredWhenPresent: false,
		description: "Structured Path power grants resolve only by canonical ID.",
	},
	{
		id: "paths.explicit-technique-grants",
		fromCategory: "paths",
		fieldPath: "ability_grants.techniques[]",
		targetCategories: ["techniques"],
		matchBy: "id",
		requiredWhenPresent: false,
		description: "Structured Path technique grants resolve only by canonical ID.",
	},
];

const regentAbilityReferences: readonly ReferenceDescriptor[] = [
	{
		id: "regents.additional-spells",
		fromCategory: "regents",
		fieldPath: "spellcasting.additional_spells[]",
		targetCategories: ["spells"],
		matchBy: "id-or-name",
		requiredWhenPresent: false,
		description: "Named Regent spells remain visible even when canon review cannot resolve them.",
	},
	{
		id: "regents.explicit-power-grants",
		fromCategory: "regents",
		fieldPath: "ability_grants.powers[]",
		targetCategories: ["powers"],
		matchBy: "id",
		requiredWhenPresent: false,
		description: "Structured Regent power options resolve only by canonical ID.",
	},
	{
		id: "regents.explicit-technique-grants",
		fromCategory: "regents",
		fieldPath: "ability_grants.techniques[]",
		targetCategories: ["techniques"],
		matchBy: "id",
		requiredWhenPresent: false,
		description: "Structured Regent technique options resolve only by canonical ID.",
	},
];

const vehicleAnomalyReference: ReferenceDescriptor = {
	id: "vehicles.bonded-anomaly",
	fromCategory: "vehicles",
	fieldPath: "anomaly_id",
	targetCategories: ["anomalies"],
	matchBy: "id",
	requiredWhenPresent: true,
	description: "A mount anomaly_id must resolve to its source anomaly.",
};

const craftingReferences: readonly ReferenceDescriptor[] = [
	{
		id: "crafting.recipe-materials",
		fromCategory: "crafting",
		fieldPath: "materials[].material_id",
		targetCategories: ["crafting"],
		matchBy: "id",
		requiredWhenPresent: true,
		description: "Recipe materials must resolve to canonical crafting materials.",
	},
	{
		id: "crafting.project-recipe",
		fromCategory: "crafting",
		fieldPath: "recipe_id",
		targetCategories: ["crafting"],
		matchBy: "id",
		requiredWhenPresent: true,
		description: "Generated projects must resolve to their source recipe.",
	},
	{
		id: "crafting.project-materials",
		fromCategory: "crafting",
		fieldPath: "material_requirements[].material_id",
		targetCategories: ["crafting"],
		matchBy: "id",
		requiredWhenPresent: true,
		description: "Project material requirements must resolve to materials.",
	},
];

const pantheonRelationshipReference: ReferenceDescriptor = {
	id: "pantheon.relationships",
	fromCategory: "pantheon",
	fieldPath: "relationships[].id",
	targetCategories: ["pantheon"],
	matchBy: "id-or-name",
	requiredWhenPresent: true,
	description: "Pantheon relationships must resolve to another canonical deity.",
};

export const compendiumCategoryDefinitions = {
	anomalies: {
		id: "anomalies",
		description: "Encounter-facing anomaly stat blocks by gate rank.",
		providerMethod: "getAnomalies",
		publicTypes: ["anomalies"],
		sourceIds: [
			"anomalies/rank-s",
			"anomalies/rank-c",
			"anomalies/rank-b",
			"anomalies/rank-a",
			"anomalies/rank-d",
		],
		schema: universalSchema(),
		references: [],
	},
	artifacts: {
		id: "artifacts",
		description: "Artifact catalog; also projected into the broad item browser.",
		providerMethod: "getArtifacts",
		publicTypes: ["artifacts"],
		sourceIds: ["artifacts/catalog"],
		schema: universalSchema(),
		references: [],
	},
	backgrounds: {
		id: "backgrounds",
		description: "Character backgrounds and their expanded catalog.",
		providerMethod: "getBackgrounds",
		publicTypes: ["backgrounds"],
		sourceIds: ["backgrounds/core", "backgrounds/expanded"],
		schema: universalSchema(),
		references: [],
	},
	"campaign-modules": {
		id: "campaign-modules",
		description: "Authored campaign modules and their complete source lineage.",
		providerMethod: null,
		publicTypes: [],
		sourceIds: [
			"campaigns/run-silent/world-lore",
			"campaigns/run-silent/chapters-1",
			"campaigns/run-silent/chapters-2",
			"campaigns/run-silent/chapters-3",
			"campaigns/run-silent/chapters-4",
			"campaigns/run-silent/chapters-5",
			"campaigns/run-silent/chapters-6",
			"campaigns/run-silent/chapters-7",
			"campaigns/run-silent/chapters-8",
			"campaigns/run-silent/encounters",
			"campaigns/run-silent/factions",
			"campaigns/run-silent/handouts",
			"campaigns/run-silent/loot",
			"campaigns/run-silent/quests",
			"campaigns/run-silent/sessions",
			"campaigns/run-silent/timeline",
			"campaigns/run-silent/warden-notes",
			"campaigns/run-silent",
		],
		schema: universalSchema(),
		references: [],
	},
	conditions: {
		id: "conditions",
		description: "Rift Ascendant condition vocabulary and rules payloads.",
		providerMethod: "getConditions",
		publicTypes: ["conditions"],
		sourceIds: ["conditions/catalog"],
		schema: universalSchema(["tags", "effects", "removal"]),
		references: [],
	},
	crafting: {
		id: "crafting",
		description: "Materials, recipes, generated projects, and guild salvage.",
		providerMethod: "getCrafting",
		publicTypes: ["crafting"],
		sourceIds: [
			"crafting/materials",
			"crafting/recipes",
			"crafting/projects-generated",
			"crafting/guild-salvage",
		],
		schema: universalSchema(["tags", "required_tools"]),
		references: craftingReferences,
	},
	feats: {
		id: "feats",
		description: "Awakening, general, fighting-style, and Zenith feat tiers.",
		providerMethod: "getFeats",
		publicTypes: ["feats"],
		sourceIds: [
			"feats/awakening",
			"feats/general",
			"feats/fighting-style",
			"feats/zenith-boons",
		],
		schema: universalSchema(),
		references: [],
	},
	"fighting-styles": {
		id: "fighting-styles",
		description: "Canonical fighting style option catalog.",
		providerMethod: "getFightingStyles",
		publicTypes: ["fighting-styles"],
		sourceIds: ["fighting-styles/catalog"],
		schema: universalSchema(),
		references: [],
	},
	"guild-base": {
		id: "guild-base",
		description: "Guild bases, facilities, and guild skill progression.",
		providerMethod: "getGuildBase",
		publicTypes: ["guild-base"],
		sourceIds: ["guild/bases", "guild/facilities", "guild/skills"],
		schema: universalSchema(),
		references: [],
	},
	items: {
		id: "items",
		description: "All item shards; equipment is a declared view over this category.",
		providerMethod: "getItems",
		publicTypes: ["items", "equipment"],
		sourceIds: [
			"items/base-equipment",
			"items/part-1",
			"items/part-2",
			"items/part-3",
			"items/part-4",
			"items/part-5",
			"items/part-6",
			"items/part-7",
			"items/part-8",
			"items/part-9",
			"items/gap-fill",
			"items/artifact-membership",
		],
		schema: universalSchema(["aliases", "properties", "simple_properties", "tags"]),
		references: [],
	},
	jobs: {
		id: "jobs",
		description: "The complete Rift Ascendant job chassis catalog.",
		providerMethod: "getJobs",
		publicTypes: ["jobs"],
		sourceIds: ["jobs/catalog"],
		schema: universalSchema([
			"aliases",
			"armorProficiencies",
			"classes",
			"languages",
			"savingThrows",
			"skillChoices",
			"tags",
			"toolProficiencies",
			"weaponProficiencies",
		]),
		references: jobAbilityReferences,
	},
	languages: {
		id: "languages",
		description: "Character-selectable real-world language vocabulary.",
		providerMethod: null,
		publicTypes: [],
		sourceIds: ["languages/earth"],
		schema: universalSchema(),
		references: [],
	},
	locations: {
		id: "locations",
		description: "Browsable setting locations.",
		providerMethod: "getLocations",
		publicTypes: ["locations"],
		sourceIds: ["locations/catalog"],
		schema: universalSchema(),
		references: [],
	},
	npcs: {
		id: "npcs",
		description: "Sandbox and field-roster recruitable/story NPCs.",
		providerMethod: "getNpcs",
		publicTypes: ["npcs"],
		sourceIds: ["npcs/sandbox", "npcs/field-roster"],
		schema: universalSchema(),
		references: [],
	},
	pantheon: {
		id: "pantheon",
		description: "The physical deity catalog; deities is a public alias.",
		providerMethod: "getPantheon",
		publicTypes: ["pantheon", "deities"],
		sourceIds: ["pantheon/prime"],
		schema: universalSchema(["dogma", "portfolio", "specializations", "tags"]),
		references: [pantheonRelationshipReference],
	},
	paths: {
		id: "paths",
		description: "All job path progressions and parent-job links.",
		providerMethod: "getPaths",
		publicTypes: ["paths"],
		sourceIds: ["paths/catalog"],
		schema: universalSchema(["aliases", "requirements.prerequisites", "requirements.skills", "tags"]),
		references: [pathJobReference, ...pathAbilityReferences],
	},
	powers: {
		id: "powers",
		description: "Core, supplemental, and archetype power catalogs.",
		providerMethod: "getPowers",
		publicTypes: ["powers"],
		sourceIds: ["powers/core", "powers/supplemental", "powers/archetype"],
		schema: abilitySchema("power"),
		references: [],
	},
	"quest-contracts": {
		id: "quest-contracts",
		description: "Global Bureau gate-contract templates.",
		providerMethod: null,
		publicTypes: [],
		sourceIds: ["quests/prebuilt-contracts"],
		schema: universalSchema(["objectives", "tags"]),
		references: [],
	},
	regents: {
		id: "regents",
		description: "The twelve canonical Regent overlays.",
		providerMethod: "getRegents",
		publicTypes: ["regents"],
		sourceIds: ["regents/catalog", "regents/portraits"],
		schema: universalSchema(),
		references: regentAbilityReferences,
	},
	relics: {
		id: "relics",
		description: "Canonical relic catalog.",
		providerMethod: "getRelics",
		publicTypes: ["relics"],
		sourceIds: ["relics/comprehensive"],
		schema: universalSchema(),
		references: [],
	},
	"reward-tables": {
		id: "reward-tables",
		description: "Warden treasure probabilities, rank ladders, and material results.",
		providerMethod: null,
		publicTypes: [],
		sourceIds: ["rewards/warden-tables"],
		schema: universalSchema(["item_rarities", "materials", "relic_rarities", "tags"]),
		references: [],
	},
	"rollable-tables": {
		id: "rollable-tables",
		description: "Canonical rollable table records.",
		providerMethod: "getRollableTables",
		publicTypes: ["rollable-tables"],
		sourceIds: ["tables/rollable"],
		schema: universalSchema(["entries", "tags"]),
		references: [],
	},
	runes: {
		id: "runes",
		description: "Generated ability-learning runes with explicit source ability links.",
		providerMethod: "getRunes",
		publicTypes: ["runes"],
		sourceIds: ["runes/generated-ability-catalog"],
		schema: universalSchema(),
		references: [runeAbilityReference],
	},
	"shadow-soldiers": {
		id: "shadow-soldiers",
		description: "Umbral Legion controlled-entity stat blocks.",
		providerMethod: "getShadowSoldiers",
		publicTypes: ["shadow-soldiers"],
		sourceIds: ["shadow-soldiers/catalog"],
		schema: universalSchema(),
		references: [],
	},
	sigils: {
		id: "sigils",
		description: "Inscribable sigil catalog.",
		providerMethod: "getSigils",
		publicTypes: ["sigils"],
		sourceIds: ["sigils/catalog"],
		schema: universalSchema(["aliases", "can_inscribe_on", "tags", "theme_tags"]),
		references: [],
	},
	skills: {
		id: "skills",
		description: "Canonical skill vocabulary.",
		providerMethod: "getSkills",
		publicTypes: ["skills"],
		sourceIds: ["skills/comprehensive"],
		schema: universalSchema(),
		references: [],
	},
	spells: {
		id: "spells",
		description: "Rank-D, supplemental, and archetype spell catalogs.",
		providerMethod: "getSpells",
		publicTypes: ["spells"],
		sourceIds: ["spells/rank-d", "spells/supplemental", "spells/archetype"],
		schema: abilitySchema("spell"),
		references: [],
	},
	tattoos: {
		id: "tattoos",
		description: "Magical tattoo catalog.",
		providerMethod: "getTattoos",
		publicTypes: ["tattoos"],
		sourceIds: ["tattoos/catalog"],
		schema: universalSchema(["active_veins", "aliases", "tags", "theme_tags"]),
		references: [],
	},
	techniques: {
		id: "techniques",
		description: "Core, supplemental, and archetype martial technique catalogs.",
		providerMethod: "getTechniques",
		publicTypes: ["techniques"],
		sourceIds: [
			"techniques/core",
			"techniques/supplemental",
			"techniques/archetype",
		],
		schema: abilitySchema("technique"),
		references: [],
	},
	"vehicle-mods": {
		id: "vehicle-mods",
		description: "Vehicle and mount modification catalogs.",
		providerMethod: null,
		publicTypes: [],
		sourceIds: ["vehicle-mods/vehicle", "vehicle-mods/mount"],
		schema: universalSchema(["requirements", "tags"]),
		references: [],
	},
	vehicles: {
		id: "vehicles",
		description: "Vehicles and mounts, including bonded anomaly overlays.",
		providerMethod: "getVehicles",
		publicTypes: ["vehicles"],
		sourceIds: ["vehicles/catalog"],
		schema: universalSchema(),
		references: [vehicleAnomalyReference],
	},
	"world-reference": {
		id: "world-reference",
		description: "Canonical setting gazetteers and map-backed reference records.",
		providerMethod: null,
		publicTypes: [],
		sourceIds: ["world/meridian"],
		schema: universalSchema(),
		references: [],
	},
} as const satisfies Record<CompendiumCategory, CompendiumCategoryDefinition>;

export const canonicalCategoryByPublicType = {
	jobs: "jobs",
	paths: "paths",
	powers: "powers",
	runes: "runes",
	relics: "relics",
	anomalies: "anomalies",
	backgrounds: "backgrounds",
	conditions: "conditions",
	regents: "regents",
	vehicles: "vehicles",
	crafting: "crafting",
	"guild-base": "guild-base",
	feats: "feats",
	"fighting-styles": "fighting-styles",
	skills: "skills",
	equipment: "items",
	"shadow-soldiers": "shadow-soldiers",
	items: "items",
	spells: "spells",
	techniques: "techniques",
	artifacts: "artifacts",
	locations: "locations",
	sigils: "sigils",
	tattoos: "tattoos",
	"rollable-tables": "rollable-tables",
	deities: "pantheon",
	pantheon: "pantheon",
	npcs: "npcs",
} as const satisfies Record<CanonicalPublicEntryType, CompendiumCategory>;

export const canonicalProviderMethodByType = Object.fromEntries(
	canonicalPublicEntryTypes.map((type) => {
		const category = canonicalCategoryByPublicType[type];
		const providerMethod = compendiumCategoryDefinitions[category].providerMethod;
		if (!providerMethod) {
			throw new Error(`Public compendium type ${type} has no provider method.`);
		}
		return [type, providerMethod];
	}),
) as Record<CanonicalPublicEntryType, CompendiumProviderMethod>;

function registeredSource(
	descriptor: Omit<
		RegisteredCompendiumSource,
		"loadPolicy" | "sourceBook"
	> &
		Partial<Pick<RegisteredCompendiumSource, "loadPolicy">>,
): RegisteredCompendiumSource {
	return {
		...descriptor,
		loadPolicy: descriptor.loadPolicy ?? "eager",
		sourceBook: RA_CANON_SOURCE_BOOK,
	};
}

const asUnknownArray = (value: readonly unknown[]): readonly unknown[] => value;

// biome-ignore format: Source descriptors stay one-record-per-line so lineage edits remain reviewable.
export const compendiumSourceRegistry: readonly RegisteredCompendiumSource[] = [
	registeredSource({ id: "anomalies/rank-s", category: "anomalies", modulePath: "src/data/compendium/anomalies/rank-s.ts", exportName: "anomalies_s", role: "authoritative", origin: "homebrew", lineage: [], description: "S-rank anomaly shard.", load: () => import("./anomalies/rank-s").then((m) => asUnknownArray(m.anomalies_s)) }),
	registeredSource({ id: "anomalies/rank-c", category: "anomalies", modulePath: "src/data/compendium/anomalies/rank-c.ts", exportName: "anomalies_c", role: "authoritative", origin: "homebrew", lineage: [], description: "C-rank anomaly shard.", load: () => import("./anomalies/rank-c").then((m) => asUnknownArray(m.anomalies_c)) }),
	registeredSource({ id: "anomalies/rank-b", category: "anomalies", modulePath: "src/data/compendium/anomalies/rank-b.ts", exportName: "anomalies_b", role: "authoritative", origin: "homebrew", lineage: [], description: "B-rank anomaly shard.", load: () => import("./anomalies/rank-b").then((m) => asUnknownArray(m.anomalies_b)) }),
	registeredSource({ id: "anomalies/rank-a", category: "anomalies", modulePath: "src/data/compendium/anomalies/rank-a.ts", exportName: "anomalies_a", role: "authoritative", origin: "homebrew", lineage: [], description: "A-rank anomaly shard.", load: () => import("./anomalies/rank-a").then((m) => asUnknownArray(m.anomalies_a)) }),
	registeredSource({ id: "anomalies/rank-d", category: "anomalies", modulePath: "src/data/compendium/anomalies/rank-d.ts", exportName: "anomalies_d", role: "authoritative", origin: "homebrew", lineage: [], description: "D-rank anomaly shard.", load: () => import("./anomalies/rank-d").then((m) => asUnknownArray(m.anomalies_d)) }),
	registeredSource({ id: "artifacts/catalog", category: "artifacts", modulePath: "src/data/compendium/artifacts.ts", exportName: "artifacts", role: "authoritative", origin: "homebrew", lineage: [], description: "Artifact catalog.", load: () => import("./artifacts").then((m) => asUnknownArray(m.artifacts)) }),
	registeredSource({ id: "backgrounds/core", category: "backgrounds", modulePath: "src/data/compendium/backgrounds.ts", exportName: "backgrounds", role: "authoritative", origin: "homebrew", lineage: [], description: "Core character backgrounds.", load: () => import("./backgrounds").then((m) => asUnknownArray(m.backgrounds)) }),
	registeredSource({ id: "backgrounds/expanded", category: "backgrounds", modulePath: "src/data/compendium/backgrounds-part2.ts", exportName: "expandedBackgrounds", role: "supplemental", origin: "homebrew", lineage: [], description: "Expanded character backgrounds.", load: () => import("./backgrounds-part2").then((m) => asUnknownArray(m.expandedBackgrounds)) }),
	registeredSource({ id: "campaigns/run-silent/world-lore", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/rift-ascendant-world-lore.ts", exportName: "riftAscendantWorldLoreChapter", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent world-lore chapter; deferred because it imports Markdown through Vite.", load: () => import("./sandbox/rift-ascendant-world-lore").then((m) => [m.riftAscendantWorldLoreChapter]) }),
	registeredSource({ id: "campaigns/run-silent/chapters-1", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-chapters-part1.ts", exportName: "chaptersPart1", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent chapter shard 1.", load: () => import("./sandbox/sandbox-chapters-part1").then((m) => asUnknownArray(m.chaptersPart1)) }),
	registeredSource({ id: "campaigns/run-silent/chapters-2", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-chapters-part2.ts", exportName: "chaptersPart2", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent chapter shard 2.", load: () => import("./sandbox/sandbox-chapters-part2").then((m) => asUnknownArray(m.chaptersPart2)) }),
	registeredSource({ id: "campaigns/run-silent/chapters-3", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-chapters-part3.ts", exportName: "chaptersPart3", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent chapter shard 3.", load: () => import("./sandbox/sandbox-chapters-part3").then((m) => asUnknownArray(m.chaptersPart3)) }),
	registeredSource({ id: "campaigns/run-silent/chapters-4", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-chapters-part4.ts", exportName: "chaptersPart4", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent chapter shard 4.", load: () => import("./sandbox/sandbox-chapters-part4").then((m) => asUnknownArray(m.chaptersPart4)) }),
	registeredSource({ id: "campaigns/run-silent/chapters-5", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-chapters-part5.ts", exportName: "chaptersPart5", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent chapter shard 5.", load: () => import("./sandbox/sandbox-chapters-part5").then((m) => asUnknownArray(m.chaptersPart5)) }),
	registeredSource({ id: "campaigns/run-silent/chapters-6", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-chapters-part6.ts", exportName: "chaptersPart6", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent chapter shard 6.", load: () => import("./sandbox/sandbox-chapters-part6").then((m) => asUnknownArray(m.chaptersPart6)) }),
	registeredSource({ id: "campaigns/run-silent/chapters-7", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-chapters-part7.ts", exportName: "chaptersPart7", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent chapter shard 7.", load: () => import("./sandbox/sandbox-chapters-part7").then((m) => asUnknownArray(m.chaptersPart7)) }),
	registeredSource({ id: "campaigns/run-silent/chapters-8", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-chapters-part8.ts", exportName: "chaptersPart8", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent chapter shard 8.", load: () => import("./sandbox/sandbox-chapters-part8").then((m) => asUnknownArray(m.chaptersPart8)) }),
	registeredSource({ id: "campaigns/run-silent/encounters", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-encounters.ts", exportName: "sandboxEncounters", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent encounters.", load: () => import("./sandbox/sandbox-encounters").then((m) => asUnknownArray(m.sandboxEncounters)) }),
	registeredSource({ id: "campaigns/run-silent/factions", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-factions.ts", exportName: "sandboxFactions", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent factions.", load: () => import("./sandbox/sandbox-factions").then((m) => asUnknownArray(m.sandboxFactions)) }),
	registeredSource({ id: "campaigns/run-silent/handouts", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-handouts.ts", exportName: "sandboxHandoutsExpanded", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent player handouts.", load: () => import("./sandbox/sandbox-handouts").then((m) => asUnknownArray(m.sandboxHandoutsExpanded)) }),
	registeredSource({ id: "campaigns/run-silent/loot", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-loot.ts", exportName: "sandboxLootTables", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent loot tables.", load: () => import("./sandbox/sandbox-loot").then((m) => asUnknownArray(m.sandboxLootTables)) }),
	registeredSource({ id: "campaigns/run-silent/quests", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-quests.ts", exportName: "sandboxQuests", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent quests.", load: () => import("./sandbox/sandbox-quests").then((m) => asUnknownArray(m.sandboxQuests)) }),
	registeredSource({ id: "campaigns/run-silent/sessions", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-sessions.ts", exportName: "sandboxSessions", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent session structure.", load: () => import("./sandbox/sandbox-sessions").then((m) => asUnknownArray(m.sandboxSessions)) }),
	registeredSource({ id: "campaigns/run-silent/timeline", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-timeline.ts", exportName: "sandboxTimeline", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent timeline.", load: () => import("./sandbox/sandbox-timeline").then((m) => asUnknownArray(m.sandboxTimeline)) }),
	registeredSource({ id: "campaigns/run-silent/warden-notes", category: "campaign-modules", modulePath: "src/data/compendium/sandbox/sandbox-warden-notes.ts", exportName: "sandboxWardenNotes", role: "authoritative", origin: "homebrew", loadPolicy: "deferred", lineage: [], description: "Run Silent Warden notes.", load: () => import("./sandbox/sandbox-warden-notes").then((m) => asUnknownArray(m.sandboxWardenNotes)) }),
	registeredSource({ id: "campaigns/run-silent", category: "campaign-modules", modulePath: "src/data/compendium/ascendant-sandbox-module.ts", exportName: "massiveSandboxModule", role: "derived", origin: "homebrew", loadPolicy: "deferred", lineage: ["campaigns/run-silent/world-lore", "campaigns/run-silent/chapters-1", "campaigns/run-silent/chapters-2", "campaigns/run-silent/chapters-3", "campaigns/run-silent/chapters-4", "campaigns/run-silent/chapters-5", "campaigns/run-silent/chapters-6", "campaigns/run-silent/chapters-7", "campaigns/run-silent/chapters-8", "campaigns/run-silent/encounters", "campaigns/run-silent/factions", "campaigns/run-silent/handouts", "campaigns/run-silent/loot", "campaigns/run-silent/quests", "campaigns/run-silent/sessions", "campaigns/run-silent/timeline", "campaigns/run-silent/warden-notes"], description: "Run Silent campaign aggregate; derived descendants are not independent corroboration. Deferred in Node because its source imports Markdown through Vite.", load: () => import("./ascendant-sandbox-module").then((m) => [{ ...m.massiveSandboxModule, name: m.massiveSandboxModule.title, source_book: RA_CANON_SOURCE_BOOK }]) }),
	registeredSource({ id: "conditions/catalog", category: "conditions", modulePath: "src/data/compendium/conditions.ts", exportName: "conditions", role: "authoritative", origin: "srd", lineage: [], description: "RA condition catalog, including adapted standard conditions.", load: () => import("./conditions").then((m) => asUnknownArray(m.conditions)) }),
	registeredSource({ id: "crafting/materials", category: "crafting", modulePath: "src/data/compendium/crafting.ts", exportName: "craftingMaterials", role: "authoritative", origin: "homebrew", lineage: [], description: "Crafting material records.", load: () => import("./crafting").then((m) => asUnknownArray(m.craftingMaterials)) }),
	registeredSource({ id: "crafting/recipes", category: "crafting", modulePath: "src/data/compendium/crafting.ts", exportName: "craftingRecipes", role: "authoritative", origin: "homebrew", lineage: [], description: "Crafting recipe records.", load: () => import("./crafting").then((m) => asUnknownArray(m.craftingRecipes)) }),
	registeredSource({ id: "crafting/projects-generated", category: "crafting", modulePath: "src/data/compendium/crafting.ts", exportName: "craftingProjects", role: "derived", origin: "generated", lineage: ["crafting/recipes", "crafting/materials"], description: "Projects generated one-to-one from crafting recipes.", load: () => import("./crafting").then((m) => asUnknownArray(m.craftingProjects)) }),
	registeredSource({ id: "crafting/guild-salvage", category: "crafting", modulePath: "src/data/compendium/guild-base-materials.ts", exportName: "GUILD_BASE_MATERIALS", role: "supplemental", origin: "homebrew", lineage: [], description: "Guild-base salvage consumed by the crafting system.", load: () => import("./guild-base-materials").then((m) => asUnknownArray(m.GUILD_BASE_MATERIALS)) }),
	registeredSource({ id: "feats/awakening", category: "feats", modulePath: "src/data/compendium/feats-generator.ts", exportName: "awakeningFeats", role: "authoritative", origin: "homebrew", lineage: [], description: "Awakening feat tier.", load: () => import("./feats-generator").then((m) => asUnknownArray(m.awakeningFeats)) }),
	registeredSource({ id: "feats/general", category: "feats", modulePath: "src/data/compendium/feats-general.ts", exportName: "generalFeats", role: "authoritative", origin: "homebrew", lineage: [], description: "General feat tier.", load: () => import("./feats-general").then((m) => asUnknownArray(m.generalFeats)) }),
	registeredSource({ id: "feats/fighting-style", category: "feats", modulePath: "src/data/compendium/feats-styles-boons.ts", exportName: "fightingStyleFeats", role: "authoritative", origin: "homebrew", lineage: [], description: "Feat-form fighting styles.", load: () => import("./feats-styles-boons").then((m) => asUnknownArray(m.fightingStyleFeats)) }),
	registeredSource({ id: "feats/zenith-boons", category: "feats", modulePath: "src/data/compendium/feats-styles-boons.ts", exportName: "zenithBoons", role: "authoritative", origin: "homebrew", lineage: [], description: "Level-19 Zenith boons.", load: () => import("./feats-styles-boons").then((m) => asUnknownArray(m.zenithBoons)) }),
	registeredSource({ id: "fighting-styles/catalog", category: "fighting-styles", modulePath: "src/data/compendium/fightingStyles.ts", exportName: "FIGHTING_STYLES", role: "authoritative", origin: "homebrew", lineage: [], description: "Character fighting style choices.", load: () => import("./fightingStyles").then((m) => asUnknownArray(m.FIGHTING_STYLES)) }),
	registeredSource({ id: "guild/bases", category: "guild-base", modulePath: "src/data/compendium/guild-bases.ts", exportName: "GUILD_BASES", role: "authoritative", origin: "homebrew", lineage: [], description: "Purchasable guild base properties.", load: () => import("./guild-bases").then((m) => asUnknownArray(m.GUILD_BASES)) }),
	registeredSource({ id: "guild/facilities", category: "guild-base", modulePath: "src/data/compendium/guild-base-mods.ts", exportName: "GUILD_FACILITIES", role: "authoritative", origin: "homebrew", lineage: [], description: "Tiered guild facilities.", load: () => import("./guild-base-mods").then((m) => asUnknownArray(m.GUILD_FACILITIES)) }),
	registeredSource({ id: "guild/skills", category: "guild-base", modulePath: "src/data/compendium/guild-skills.ts", exportName: "GUILD_SKILLS", role: "authoritative", origin: "homebrew", lineage: [], description: "Guild skill tree.", load: () => import("./guild-skills").then((m) => asUnknownArray(m.GUILD_SKILLS)) }),
	registeredSource({ id: "items/base-equipment", category: "items", modulePath: "src/data/compendium/items-base-equipment.ts", exportName: "baseEquipment", role: "authoritative", origin: "srd", lineage: [], description: "Base equipment chassis adapted to RA.", load: () => import("./items-base-equipment").then((m) => asUnknownArray(m.baseEquipment)) }),
	registeredSource({ id: "items/part-1", category: "items", modulePath: "src/data/compendium/items-part1.ts", exportName: "items_part1", role: "authoritative", origin: "homebrew", lineage: [], description: "Item catalog shard 1.", load: () => import("./items-part1").then((m) => asUnknownArray(m.items_part1)) }),
	registeredSource({ id: "items/part-2", category: "items", modulePath: "src/data/compendium/items-part2.ts", exportName: "items_part2", role: "authoritative", origin: "homebrew", lineage: [], description: "Item catalog shard 2.", load: () => import("./items-part2").then((m) => asUnknownArray(m.items_part2)) }),
	registeredSource({ id: "items/part-3", category: "items", modulePath: "src/data/compendium/items-part3.ts", exportName: "items_part3", role: "authoritative", origin: "homebrew", lineage: [], description: "Item catalog shard 3.", load: () => import("./items-part3").then((m) => asUnknownArray(m.items_part3)) }),
	registeredSource({ id: "items/part-4", category: "items", modulePath: "src/data/compendium/items-part4.ts", exportName: "items_part4", role: "authoritative", origin: "homebrew", lineage: [], description: "Item catalog shard 4.", load: () => import("./items-part4").then((m) => asUnknownArray(m.items_part4)) }),
	registeredSource({ id: "items/part-5", category: "items", modulePath: "src/data/compendium/items-part5.ts", exportName: "items_part5", role: "authoritative", origin: "homebrew", lineage: [], description: "Item catalog shard 5.", load: () => import("./items-part5").then((m) => asUnknownArray(m.items_part5)) }),
	registeredSource({ id: "items/part-6", category: "items", modulePath: "src/data/compendium/items-part6.ts", exportName: "items_part6", role: "authoritative", origin: "homebrew", lineage: [], description: "Item catalog shard 6.", load: () => import("./items-part6").then((m) => asUnknownArray(m.items_part6)) }),
	registeredSource({ id: "items/part-7", category: "items", modulePath: "src/data/compendium/items-part7.ts", exportName: "items_part7", role: "authoritative", origin: "homebrew", lineage: [], description: "Item catalog shard 7.", load: () => import("./items-part7").then((m) => asUnknownArray(m.items_part7)) }),
	registeredSource({ id: "items/part-8", category: "items", modulePath: "src/data/compendium/items-part8.ts", exportName: "items_part8", role: "authoritative", origin: "homebrew", lineage: [], description: "Item catalog shard 8.", load: () => import("./items-part8").then((m) => asUnknownArray(m.items_part8)) }),
	registeredSource({ id: "items/part-9", category: "items", modulePath: "src/data/compendium/items-part9.ts", exportName: "items_part9", role: "authoritative", origin: "homebrew", lineage: [], description: "Item catalog shard 9.", load: () => import("./items-part9").then((m) => asUnknownArray(m.items_part9)) }),
	registeredSource({ id: "items/gap-fill", category: "items", modulePath: "src/data/compendium/items-gap-fill.ts", exportName: "items_gap_fill", role: "supplemental", origin: "homebrew", lineage: [], description: "Gap-fill item additions.", load: () => import("./items-gap-fill").then((m) => asUnknownArray(m.items_gap_fill)) }),
	registeredSource({ id: "items/artifact-membership", category: "items", modulePath: "src/data/compendium/artifacts.ts", exportName: "artifacts", role: "supplemental", origin: "homebrew", lineage: ["artifacts/catalog"], description: "Artifact membership in the broad item browser; not independent corroboration.", load: () => import("./artifacts").then((m) => asUnknownArray(m.artifacts)) }),
	registeredSource({ id: "jobs/catalog", category: "jobs", modulePath: "src/data/compendium/jobs.ts", exportName: "jobs", role: "authoritative", origin: "homebrew", lineage: [], description: "Complete job catalog.", load: () => import("./jobs").then((m) => asUnknownArray(m.jobs)) }),
	registeredSource({ id: "languages/earth", category: "languages", modulePath: "src/types/character.ts", exportName: "EARTH_LANGUAGES", role: "authoritative", origin: "homebrew", lineage: [], description: "Selectable Earth languages used by character creation.", load: () => import("../../types/character").then((m) => m.EARTH_LANGUAGES.map((name) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, description: `${name} language proficiency.`, source_book: RA_CANON_SOURCE_BOOK }))) }),
	registeredSource({ id: "locations/catalog", category: "locations", modulePath: "src/data/compendium/locations.ts", exportName: "locations", role: "authoritative", origin: "homebrew", lineage: [], description: "Browsable location catalog.", load: () => import("./locations").then((m) => asUnknownArray(m.locations)) }),
	registeredSource({ id: "npcs/sandbox", category: "npcs", modulePath: "src/data/compendium/sandbox-npcs.ts", exportName: "sandboxRecruitableNPCs", role: "authoritative", origin: "homebrew", lineage: [], description: "Run Silent and setting NPC roster.", load: () => import("./sandbox-npcs").then((m) => asUnknownArray(m.sandboxRecruitableNPCs)) }),
	registeredSource({ id: "npcs/field-roster", category: "npcs", modulePath: "src/data/compendium/recruitable-roster.ts", exportName: "fieldRosterNPCs", role: "supplemental", origin: "homebrew", lineage: [], description: "Glassline, Bureau field, and independent roster.", load: () => import("./recruitable-roster").then((m) => asUnknownArray(m.fieldRosterNPCs)) }),
	registeredSource({ id: "pantheon/prime", category: "pantheon", modulePath: "src/data/compendium/pantheon.ts", exportName: "PRIME_PANTHEON", role: "authoritative", origin: "homebrew", lineage: [], description: "Prime pantheon catalog.", load: () => import("./pantheon").then((m) => asUnknownArray(m.PRIME_PANTHEON)) }),
	registeredSource({ id: "paths/catalog", category: "paths", modulePath: "src/data/compendium/paths.ts", exportName: "paths", role: "authoritative", origin: "homebrew", lineage: [], description: "All job paths.", load: () => import("./paths").then((m) => asUnknownArray(m.paths)) }),
	registeredSource({ id: "powers/core", category: "powers", modulePath: "src/data/compendium/powers-core.ts", exportName: "powers_core", role: "authoritative", origin: "homebrew", lineage: [], description: "Core power catalog.", load: () => import("./powers-core").then((m) => asUnknownArray(m.powers_core)) }),
	registeredSource({ id: "powers/supplemental", category: "powers", modulePath: "src/data/compendium/powers-supplemental.ts", exportName: "powers_supplemental", role: "supplemental", origin: "homebrew", lineage: [], description: "Supplemental power catalog.", load: () => import("./powers-supplemental").then((m) => asUnknownArray(m.powers_supplemental)) }),
	registeredSource({ id: "powers/archetype", category: "powers", modulePath: "src/data/compendium/powers-archetype.ts", exportName: "powers_archetype", role: "supplemental", origin: "homebrew", lineage: [], description: "Archetype-shared power catalog.", load: () => import("./powers-archetype").then((m) => asUnknownArray(m.powers_archetype)) }),
	registeredSource({ id: "quests/prebuilt-contracts", category: "quest-contracts", modulePath: "src/data/compendium/quest-contracts.ts", exportName: "PREBUILT_QUEST_CONTRACTS", role: "authoritative", origin: "homebrew", lineage: [], description: "Global Bureau quest templates.", load: () => import("./quest-contracts").then((m) => m.PREBUILT_QUEST_CONTRACTS.map((quest) => ({ ...quest, name: quest.title, description: quest.summary, source_book: RA_CANON_SOURCE_BOOK }))) }),
	registeredSource({ id: "regents/catalog", category: "regents", modulePath: "src/data/compendium/regents.ts", exportName: "regents", role: "authoritative", origin: "homebrew", lineage: [], description: "Twelve canonical Regents.", load: () => import("./regents").then((m) => asUnknownArray(m.regents)) }),
	registeredSource({ id: "regents/portraits", category: "regents", modulePath: "src/data/compendium/regentPortraits.ts", exportName: "REGENT_PORTRAITS_DATA", role: "supplemental", origin: "homebrew", lineage: ["regents/catalog"], description: "Canonical Regent portrait and visual-tag metadata.", load: () => import("./regentPortraits").then((m) => m.REGENT_PORTRAITS_DATA.map((portrait) => ({ id: portrait.regentId, name: portrait.name, image: portrait.imageUrl, tags: portrait.tags }))) }),
	registeredSource({ id: "relics/comprehensive", category: "relics", modulePath: "src/data/compendium/relics-comprehensive.ts", exportName: "comprehensiveRelics", role: "authoritative", origin: "homebrew", lineage: [], description: "Comprehensive relic catalog.", load: () => import("./relics-comprehensive").then((m) => asUnknownArray(m.comprehensiveRelics)) }),
	registeredSource({ id: "rewards/warden-tables", category: "reward-tables", modulePath: "src/data/compendium/wardenToolConfig.ts", exportName: "TREASURE_TABLES", role: "authoritative", origin: "homebrew", lineage: [], description: "Rank-indexed treasure and material tables.", load: () => import("./wardenToolConfig").then((m) => m.GATE_RANKS.map((rank) => ({ id: `reward-table-${rank.toLowerCase()}`, name: `${rank}-Rank Reward Table`, description: `Canonical ${rank}-Rank treasure probabilities and result pools.`, rank, ...m.TREASURE_TABLES[rank], item_rarities: m.TREASURE_ITEM_RARITIES[rank], relic_rarities: m.TREASURE_RELIC_RARITIES[rank], materials: m.TREASURE_MATERIALS[rank], source_book: RA_CANON_SOURCE_BOOK }))) }),
	registeredSource({ id: "tables/rollable", category: "rollable-tables", modulePath: "src/data/compendium/rollableTables.ts", exportName: "rollableTables", role: "authoritative", origin: "homebrew", lineage: [], description: "Rollable table catalog.", load: () => import("./rollableTables").then((m) => asUnknownArray(m.rollableTables)) }),
	registeredSource({ id: "runes/generated-ability-catalog", category: "runes", modulePath: "src/data/compendium/runes/index.ts", exportName: "allRunes", role: "derived", origin: "generated", lineage: ["spells/rank-d", "spells/supplemental", "spells/archetype", "powers/core", "powers/supplemental", "powers/archetype", "techniques/core", "techniques/supplemental", "techniques/archetype"], description: "One generated learning rune per canonical spell, power, or technique; not independent corroboration.", load: () => import("./runes/index").then((m) => asUnknownArray(m.allRunes)) }),
	registeredSource({ id: "shadow-soldiers/catalog", category: "shadow-soldiers", modulePath: "src/data/compendium/shadow-soldiers.ts", exportName: "shadowSoldiers", role: "authoritative", origin: "homebrew", lineage: [], description: "Umbral Legion stat blocks.", load: () => import("./shadow-soldiers").then((m) => asUnknownArray(m.shadowSoldiers)) }),
	registeredSource({ id: "sigils/catalog", category: "sigils", modulePath: "src/data/compendium/sigils.ts", exportName: "sigils", role: "authoritative", origin: "homebrew", lineage: [], description: "Sigil catalog.", load: () => import("./sigils").then((m) => asUnknownArray(m.sigils)) }),
	registeredSource({ id: "skills/comprehensive", category: "skills", modulePath: "src/data/compendium/skills-comprehensive.ts", exportName: "comprehensiveSkills", role: "authoritative", origin: "homebrew", lineage: [], description: "Comprehensive skill catalog.", load: () => import("./skills-comprehensive").then((m) => asUnknownArray(m.comprehensiveSkills)) }),
	registeredSource({ id: "spells/rank-d", category: "spells", modulePath: "src/data/compendium/spells/rank-d.ts", exportName: "spells_d", role: "authoritative", origin: "homebrew", lineage: [], description: "Rank-D spell catalog.", load: () => import("./spells/rank-d").then((m) => asUnknownArray(m.spells_d)) }),
	registeredSource({ id: "spells/supplemental", category: "spells", modulePath: "src/data/compendium/spells/supplemental.ts", exportName: "spells_supplemental", role: "supplemental", origin: "homebrew", lineage: [], description: "Supplemental spell catalog.", load: () => import("./spells/supplemental").then((m) => asUnknownArray(m.spells_supplemental)) }),
	registeredSource({ id: "spells/archetype", category: "spells", modulePath: "src/data/compendium/spells/archetype.ts", exportName: "spells_archetype", role: "supplemental", origin: "homebrew", lineage: [], description: "Archetype spell catalog.", load: () => import("./spells/archetype").then((m) => asUnknownArray(m.spells_archetype)) }),
	registeredSource({ id: "tattoos/catalog", category: "tattoos", modulePath: "src/data/compendium/tattoos.ts", exportName: "tattoos", role: "authoritative", origin: "homebrew", lineage: [], description: "Magical tattoo catalog.", load: () => import("./tattoos").then((m) => asUnknownArray(m.tattoos)) }),
	registeredSource({ id: "techniques/core", category: "techniques", modulePath: "src/data/compendium/techniques-core.ts", exportName: "techniques_core", role: "authoritative", origin: "homebrew", lineage: [], description: "Core martial technique catalog.", load: () => import("./techniques-core").then((m) => asUnknownArray(m.techniques_core)) }),
	registeredSource({ id: "techniques/supplemental", category: "techniques", modulePath: "src/data/compendium/techniques-supplemental.ts", exportName: "techniques_supplemental", role: "supplemental", origin: "homebrew", lineage: [], description: "Supplemental technique catalog.", load: () => import("./techniques-supplemental").then((m) => asUnknownArray(m.techniques_supplemental)) }),
	registeredSource({ id: "techniques/archetype", category: "techniques", modulePath: "src/data/compendium/techniques-archetype.ts", exportName: "techniques_archetype", role: "supplemental", origin: "homebrew", lineage: [], description: "Archetype-shared technique catalog.", load: () => import("./techniques-archetype").then((m) => asUnknownArray(m.techniques_archetype)) }),
	registeredSource({ id: "vehicle-mods/vehicle", category: "vehicle-mods", modulePath: "src/data/compendium/vehicleMods.ts", exportName: "vehicleMods", role: "authoritative", origin: "homebrew", lineage: [], description: "Vehicle modifications.", load: () => import("./vehicleMods").then((m) => asUnknownArray(m.vehicleMods)) }),
	registeredSource({ id: "vehicle-mods/mount", category: "vehicle-mods", modulePath: "src/data/compendium/vehicleMods.ts", exportName: "mountMods", role: "authoritative", origin: "homebrew", lineage: [], description: "Mount modifications.", load: () => import("./vehicleMods").then((m) => asUnknownArray(m.mountMods)) }),
	registeredSource({ id: "vehicles/catalog", category: "vehicles", modulePath: "src/data/compendium/vehicles.ts", exportName: "allVehicles", role: "authoritative", origin: "homebrew", lineage: [], description: "Vehicles and mounts.", load: () => import("./vehicles").then((m) => asUnknownArray(m.allVehicles)) }),
	registeredSource({ id: "world/meridian", category: "world-reference", modulePath: "src/data/compendium/meridian.ts", exportName: "MERIDIAN", role: "authoritative", origin: "homebrew", lineage: [], description: "Meridian city gazetteer and district maps.", load: () => import("./meridian").then((m) => [{ ...m.MERIDIAN, id: m.MERIDIAN.slug, description: m.MERIDIAN.overview, source_book: RA_CANON_SOURCE_BOOK }]) }),
] as const;

/**
 * Derived consumers and transforms are lineage nodes, never additional canon
 * evidence. This makes the current app/provider/audit/publication paths
 * inspectable without pretending an aggregate or generated book corroborates
 * the source shards from which it was produced.
 */
// biome-ignore format: Lineage tables are kept compact and aligned with source ids above.
export const compendiumLineageRegistry: readonly CompendiumLineageDescriptor[] = [
	{
		id: "aggregate/anomalies",
		kind: "aggregate",
		modulePath: "src/data/compendium/anomalies/index.ts",
		inputIds: ["anomalies/rank-s", "anomalies/rank-c", "anomalies/rank-b", "anomalies/rank-a", "anomalies/rank-d"],
		outputCategories: ["anomalies"],
		independentEvidence: false,
		description: "Legacy anomaly concatenation in authored rank order.",
	},
	{
		id: "aggregate/backgrounds",
		kind: "aggregate",
		modulePath: "src/data/compendium/backgrounds-index.ts",
		inputIds: ["backgrounds/core", "backgrounds/expanded"],
		outputCategories: ["backgrounds"],
		independentEvidence: false,
		description: "Legacy background concatenation.",
	},
	{
		id: "aggregate/feats",
		kind: "aggregate",
		modulePath: "src/data/compendium/feats-comprehensive.ts",
		inputIds: ["feats/awakening", "feats/general", "feats/fighting-style", "feats/zenith-boons"],
		outputCategories: ["feats"],
		independentEvidence: false,
		description: "Four feat tiers combined for compatibility consumers.",
	},
	{
		id: "aggregate/items-static",
		kind: "normalization",
		modulePath: "src/data/compendium/items-index.ts",
		inputIds: compendiumCategoryDefinitions.items.sourceIds,
		outputCategories: ["items", "artifacts"],
		independentEvidence: false,
		description: "Synchronous completeness-first item compatibility view with an observable conflict ledger.",
	},
	{
		id: "aggregate/items-lazy",
		kind: "normalization",
		modulePath: "src/data/compendium/items-lazy.ts",
		inputIds: compendiumCategoryDefinitions.items.sourceIds,
		outputCategories: ["items", "artifacts"],
		independentEvidence: false,
		description: "Chunk-preserving lazy item compatibility view.",
	},
	{
		id: "aggregate/spells",
		kind: "normalization",
		modulePath: "src/data/compendium/spells/index.ts",
		inputIds: compendiumCategoryDefinitions.spells.sourceIds,
		outputCategories: ["spells"],
		independentEvidence: false,
		description: "Spell concatenation and mirrored-mechanics normalization.",
	},
	{
		id: "aggregate/powers",
		kind: "normalization",
		modulePath: "src/data/compendium/powers.ts",
		inputIds: compendiumCategoryDefinitions.powers.sourceIds,
		outputCategories: ["powers"],
		independentEvidence: false,
		description: "Power concatenation and mirrored-mechanics normalization.",
	},
	{
		id: "aggregate/techniques",
		kind: "normalization",
		modulePath: "src/data/compendium/techniques.ts",
		inputIds: compendiumCategoryDefinitions.techniques.sourceIds,
		outputCategories: ["techniques"],
		independentEvidence: false,
		description: "Technique concatenation and mirrored-mechanics normalization.",
	},
	{
		id: "aggregate/crafting",
		kind: "aggregate",
		modulePath: "src/data/compendium/crafting.ts",
		inputIds: ["crafting/materials", "crafting/recipes", "crafting/projects-generated"],
		outputCategories: ["crafting"],
		independentEvidence: false,
		description: "Materials, recipes, and generated projects combined for legacy consumers.",
	},
	{
		id: "registry/raw-candidates",
		kind: "aggregate",
		modulePath: "src/data/compendium/registry.ts",
		inputIds: compendiumSourceRegistry.map((source) => source.id),
		outputCategories: compendiumCategories,
		independentEvidence: false,
		description: "All source candidates collected before identity resolution or provider transforms.",
	},
	{
		id: "registry/completeness-merge",
		kind: "normalization",
		modulePath: "src/data/compendium/registry.ts",
		inputIds: ["registry/raw-candidates"],
		outputCategories: compendiumCategories,
		independentEvidence: false,
		description: "Field-level completeness merge, provenance, conflict ledger, and reference graph.",
	},
	{
		id: "providers/static",
		kind: "provider-transform",
		modulePath: "src/data/compendium/providers/index.ts",
		inputIds: ["registry/completeness-merge", "aggregate/items-lazy", "aggregate/spells", "aggregate/powers", "aggregate/techniques"],
		outputCategories: providerBackedCompendiumCategories,
		independentEvidence: false,
		description: "UI compatibility transforms exposed through the 26 provider methods.",
	},
	{
		id: "canonical/public-views",
		kind: "public-view",
		modulePath: "src/lib/canonicalCompendium.ts",
		inputIds: ["providers/static"],
		outputCategories: providerBackedCompendiumCategories,
		independentEvidence: false,
		description: "Public aliases and views, including equipment over items and deities over pantheon.",
	},
	{
		id: "audit/provider-and-registry",
		kind: "audit",
		modulePath: "src/lib/compendiumAudit.ts",
		inputIds: ["registry/completeness-merge", "providers/static"],
		outputCategories: compendiumCategories,
		independentEvidence: false,
		description: "Blocking source, conflict, reference, and transformed-content audit.",
	},
	{
		id: "publication/books-direct",
		kind: "publication",
		modulePath: "books/scripts/build-books.ts",
		inputIds: ["aggregate/anomalies", "aggregate/backgrounds", "aggregate/feats", "aggregate/items-static", "aggregate/spells", "aggregate/powers", "aggregate/techniques", "jobs/catalog", "paths/catalog"],
		outputCategories: providerBackedCompendiumCategories,
		independentEvidence: false,
		description: "Current book build lineage; publication output is derived and never corroborating evidence.",
	},
];

const sourceById = new Map(
	compendiumSourceRegistry.map((source) => [source.id, source]),
);

function descriptorWithoutLoader(
	source: RegisteredCompendiumSource,
): CompendiumSourceDescriptor {
	const { load: _load, ...descriptor } = source;
	return descriptor;
}

function isRecord(value: unknown): value is CanonicalEntryRecord {
	return !!value && typeof value === "object" && !Array.isArray(value);
}

export function normalizeCanonicalName(value: string): string {
	return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function normalizeCanonicalId(value: string): string {
	return value.trim().toLocaleLowerCase();
}

function getStringAtFields(
	record: CanonicalEntryRecord,
	fields: readonly string[],
): string | null {
	for (const field of fields) {
		const value = getValueAtPath(record, field);
		if (typeof value === "string" && value.trim()) return value.trim();
	}
	return null;
}

export function createCompendiumCandidate<T extends CanonicalEntryRecord>(
	category: CompendiumCategory,
	source: CompendiumSourceDescriptor,
	raw: T,
	ordinal: number,
	sequence = ordinal,
): CompendiumCandidate<T> {
	const schema = compendiumCategoryDefinitions[category].schema;
	const rawId = getStringAtFields(raw, schema.idFields);
	const rawName = getStringAtFields(raw, schema.nameFields);
	return {
		category,
		source,
		raw,
		ordinal,
		sequence,
		rawId,
		rawName,
		normalizedName: rawName ? normalizeCanonicalName(rawName) : null,
	};
}

function isMissing(value: unknown): boolean {
	if (value === undefined || value === null) return true;
	if (typeof value === "string") return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (isRecord(value)) return Object.keys(value).length === 0;
	return false;
}

function cloneValue<T>(value: T): T {
	if (Array.isArray(value)) return value.map(cloneValue) as T;
	if (isRecord(value)) {
		return Object.fromEntries(
			Object.entries(value).map(([key, child]) => [key, cloneValue(child)]),
		) as T;
	}
	return value;
}

function deepEqual(left: unknown, right: unknown): boolean {
	if (Object.is(left, right)) return true;
	if (Array.isArray(left) && Array.isArray(right)) {
		return (
			left.length === right.length &&
			left.every((value, index) => deepEqual(value, right[index]))
		);
	}
	if (isRecord(left) && isRecord(right)) {
		const leftKeys = Object.keys(left).sort();
		const rightKeys = Object.keys(right).sort();
		return (
			deepEqual(leftKeys, rightKeys) &&
			leftKeys.every((key) => deepEqual(left[key], right[key]))
		);
	}
	return false;
}

function completenessScore(value: unknown): number {
	if (isMissing(value)) return 0;
	if (Array.isArray(value)) {
		return 1 + value.reduce((total, child) => total + completenessScore(child), 0);
	}
	if (isRecord(value)) {
		return Object.values(value).reduce<number>(
			(total, child) => total + completenessScore(child),
			1,
		);
	}
	return 1;
}

function stableValueKey(value: unknown): string {
	if (Array.isArray(value)) return `[${value.map(stableValueKey).join(",")}]`;
	if (isRecord(value)) {
		return `{${Object.keys(value)
			.sort()
			.map((key) => `${JSON.stringify(key)}:${stableValueKey(value[key])}`)
			.join(",")}}`;
	}
	return JSON.stringify(value);
}

function isOrderedSuperset(candidate: unknown[], subset: unknown[]): boolean {
	if (candidate.length < subset.length) return false;
	return subset.every((value, index) => deepEqual(value, candidate[index]));
}

function conflictId(
	category: CompendiumCategory,
	canonicalKey: string,
	kind: MergeConflictKind,
	fieldPath?: string,
): string {
	return [category, canonicalKey, kind, fieldPath || "entry"]
		.join("|")
		.replace(/\s+/g, "-")
		.toLocaleLowerCase();
}

interface ValueCandidate {
	candidate: CompendiumCandidate;
	value: unknown;
}

interface MergeContext {
	category: CompendiumCategory;
	canonicalKey: string;
	allCandidates: CompendiumCandidate[];
	rankedCandidates: CompendiumCandidate[];
	setLikeFields: Set<string>;
	resolutions: Map<string, MergeResolution>;
	conflicts: MergeConflict[];
	provenance: Record<string, FieldProvenance>;
}

function uniqueSourceIds(nodes: readonly ValueCandidate[]): string[] {
	return [...new Set(nodes.map((node) => node.candidate.source.id))];
}

function rankedNode(
	nodes: readonly ValueCandidate[],
	context: MergeContext,
): ValueCandidate {
	for (const ranked of context.rankedCandidates) {
		const node = nodes.find((candidate) => candidate.candidate === ranked);
		if (node) return node;
	}
	return nodes[0];
}

function registerConflict(
	kind: MergeConflictKind,
	path: string,
	nodes: readonly ValueCandidate[],
	context: MergeContext,
	message: string,
): { resolution: MergeResolution | null; id: string } {
	const id = conflictId(
		context.category,
		context.canonicalKey,
		kind,
		path,
	);
	const resolution = context.resolutions.get(id) ?? null;
	context.conflicts.push({
		id,
		kind,
		category: context.category,
		canonicalKey: context.canonicalKey,
		fieldPath: path || undefined,
		candidates: nodes.map(({ candidate, value }) => ({
			sourceId: candidate.source.id,
			ordinal: candidate.ordinal,
			rawId: candidate.rawId,
			value,
		})),
		message,
		status: resolution ? "resolved" : "unresolved",
		blocking: !resolution,
		resolutionId: resolution?.conflictId,
	});
	return { resolution, id };
}

function valueFromResolution(
	resolution: MergeResolution,
	nodes: readonly ValueCandidate[],
): unknown {
	if (Object.hasOwn(resolution, "value")) return cloneValue(resolution.value);
	if (resolution.selectedSourceId) {
		const selected = nodes.find(
			(node) => node.candidate.source.id === resolution.selectedSourceId,
		);
		if (selected) return cloneValue(selected.value);
	}
	return cloneValue(nodes[0]?.value);
}

function mergeValueCandidates(
	nodesWithMissing: readonly ValueCandidate[],
	path: string,
	context: MergeContext,
): unknown {
	const nodes = nodesWithMissing.filter((node) => !isMissing(node.value));
	if (nodes.length === 0) return undefined;

	const sourceIds = uniqueSourceIds(nodes);
	if (nodes.every((node) => deepEqual(node.value, nodes[0].value))) {
		context.provenance[path] = {
			chosenSourceIds: sourceIds,
			agreeingSourceIds: sourceIds,
			operation:
				nodes.length === context.allCandidates.length ? "equal" : "filled-missing",
		};
		return cloneValue(nodes[0].value);
	}

	const allRecords = nodes.every((node) => isRecord(node.value));
	if (allRecords) {
		const records = nodes as Array<
			ValueCandidate & { value: CanonicalEntryRecord }
		>;
		const keys = [
			...new Set(records.flatMap((node) => Object.keys(node.value))),
		];
		const merged: CanonicalEntryRecord = {};
		for (const key of keys) {
			const childPath = path ? `${path}.${key}` : key;
			const childNodes = records.map((node) => ({
				candidate: node.candidate,
				value: node.value[key],
			}));
			const child = mergeValueCandidates(childNodes, childPath, context);
			if (child !== undefined) merged[key] = child;
		}
		context.provenance[path] = {
			chosenSourceIds: sourceIds,
			agreeingSourceIds: [],
			operation: "object-merge",
		};
		return merged;
	}

	const allArrays = nodes.every((node) => Array.isArray(node.value));
	if (allArrays) {
		const arrays = nodes as Array<ValueCandidate & { value: unknown[] }>;
		const leaf = path.split(".").at(-1) ?? path;
		if (context.setLikeFields.has(path) || context.setLikeFields.has(leaf)) {
			const seen = new Set<string>();
			const union: unknown[] = [];
			for (const node of arrays) {
				for (const value of node.value) {
					const key = stableValueKey(value);
					if (seen.has(key)) continue;
					seen.add(key);
					union.push(cloneValue(value));
				}
			}
			context.provenance[path] = {
				chosenSourceIds: sourceIds,
				agreeingSourceIds: [],
				operation: "declared-union",
			};
			return union;
		}

		const longest = [...arrays].sort(
			(left, right) => right.value.length - left.value.length,
		)[0];
		if (arrays.every((node) => isOrderedSuperset(longest.value, node.value))) {
			context.provenance[path] = {
				chosenSourceIds: [longest.candidate.source.id],
				agreeingSourceIds: arrays
					.filter((node) => deepEqual(node.value, longest.value))
					.map((node) => node.candidate.source.id),
				operation: "array-superset",
			};
			return cloneValue(longest.value);
		}

		const registered = registerConflict(
			"field-disagreement",
			path,
			arrays,
			context,
			`Ordered array field "${path}" has incompatible non-empty canon claims.`,
		);
		if (registered.resolution) {
			context.provenance[path] = {
				chosenSourceIds: registered.resolution.selectedSourceId
					? [registered.resolution.selectedSourceId]
					: [],
				agreeingSourceIds: [],
				operation: "explicit-resolution",
			};
			return valueFromResolution(registered.resolution, arrays);
		}
		const provisional = rankedNode(arrays, context);
		context.provenance[path] = {
			chosenSourceIds: [provisional.candidate.source.id],
			agreeingSourceIds: [],
			operation: "single",
		};
		return cloneValue(provisional.value);
	}

	const kinds = new Set(
		nodes.map((node) =>
			Array.isArray(node.value)
				? "array"
				: isRecord(node.value)
					? "object"
					: typeof node.value,
		),
	);
	const kind: MergeConflictKind =
		kinds.size > 1 ? "shape-mismatch" : "field-disagreement";
	const registered = registerConflict(
		kind,
		path,
		nodes,
		context,
		`Field "${path}" has incompatible non-empty canon claims.`,
	);
	if (registered.resolution) {
		context.provenance[path] = {
			chosenSourceIds: registered.resolution.selectedSourceId
				? [registered.resolution.selectedSourceId]
				: [],
			agreeingSourceIds: [],
			operation: "explicit-resolution",
		};
		return valueFromResolution(registered.resolution, nodes);
	}
	const provisional = rankedNode(nodes, context);
	context.provenance[path] = {
		chosenSourceIds: [provisional.candidate.source.id],
		agreeingSourceIds: [],
		operation: "single",
	};
	return cloneValue(provisional.value);
}

function groupCandidates(
	candidates: CompendiumCandidate[],
): CompendiumCandidate[][] {
	const groups = new Map<string, CompendiumCandidate[]>();
	for (const candidate of candidates) {
		const identity = candidate.rawId
			? `id:${normalizeCanonicalId(candidate.rawId)}`
			: `name:${candidate.normalizedName ?? `${candidate.source.id}:${candidate.ordinal}`}`;
		const group = groups.get(identity) ?? [];
		group.push(candidate);
		groups.set(identity, group);
	}
	return [...groups.values()].sort(
		(left, right) =>
			Math.min(...left.map((candidate) => candidate.sequence)) -
			Math.min(...right.map((candidate) => candidate.sequence)),
	);
}

function findCrossIdNameConflicts(
	category: CompendiumCategory,
	candidates: readonly CompendiumCandidate[],
	resolutions: ReadonlyMap<string, MergeResolution>,
): MergeConflict[] {
	const byName = new Map<string, CompendiumCandidate[]>();
	for (const candidate of candidates) {
		if (!candidate.normalizedName) continue;
		const matches = byName.get(candidate.normalizedName) ?? [];
		matches.push(candidate);
		byName.set(candidate.normalizedName, matches);
	}

	const conflicts: MergeConflict[] = [];
	for (const [normalizedName, matches] of byName) {
		const ids = [
			...new Set(
				matches
					.map((candidate) => candidate.rawId)
					.filter((id): id is string => Boolean(id))
					.map(normalizeCanonicalId),
			),
		];
		if (ids.length <= 1) continue;
		const canonicalKey = `${category}:name:${normalizedName}`;
		const id = conflictId(
			category,
			canonicalKey,
			"identity-collision",
			"normalized-name",
		);
		const resolution = resolutions.get(id);
		conflicts.push({
			id,
			kind: "identity-collision",
			category,
			canonicalKey,
			fieldPath: "name",
			candidates: matches.map((candidate) => ({
				sourceId: candidate.source.id,
				ordinal: candidate.ordinal,
				rawId: candidate.rawId,
				value: candidate.rawName,
			})),
			message: `Normalized name "${normalizedName}" identifies ${ids.length} distinct ids; the entries remain separate until an explicit alias or resolution is reviewed.`,
			status: resolution ? "resolved" : "unresolved",
			blocking: !resolution,
			resolutionId: resolution?.conflictId,
		});
	}
	return conflicts;
}

export function mergeCanonicalCandidates<
	T extends CanonicalEntryRecord = CanonicalEntryRecord,
>(
	category: CompendiumCategory,
	candidates: readonly CompendiumCandidate<T>[],
	resolutions: readonly MergeResolution[] = [],
): MergeCanonicalCandidatesResult<T> {
	const conflicts: MergeConflict[] = [];
	const valid: CompendiumCandidate<T>[] = [];
	for (const candidate of candidates) {
		if (!candidate.rawId || !candidate.rawName) {
			const missing = [
				...(candidate.rawId ? [] : ["id"]),
				...(candidate.rawName ? [] : ["name"]),
			];
			conflicts.push({
				id: conflictId(
					category,
					`${candidate.source.id}:${candidate.ordinal}`,
					"invalid-candidate",
					missing.join(","),
				),
				kind: "invalid-candidate",
				category,
				candidates: [
					{
						sourceId: candidate.source.id,
						ordinal: candidate.ordinal,
						rawId: candidate.rawId,
						value: candidate.raw,
					},
				],
				message: `Raw candidate is missing required ${missing.join(" and ")}.`,
				status: "unresolved",
				blocking: true,
			});
			continue;
		}
		valid.push(candidate);
	}

	const resolutionMap = new Map(
		resolutions.map((resolution) => [resolution.conflictId, resolution]),
	);
	conflicts.push(...findCrossIdNameConflicts(category, valid, resolutionMap));
	const entries: CanonicalRegistryEntry<T>[] = [];
	for (const group of groupCandidates(valid)) {
		const ranked = [...group].sort(
			(left, right) =>
				completenessScore(right.raw) - completenessScore(left.raw) ||
				left.sequence - right.sequence,
		);
		const provisional = ranked[0];
		const ids = [...new Set(group.map((candidate) => candidate.rawId))];
		const names = [
			...new Set(group.map((candidate) => candidate.normalizedName)),
		];
		const canonicalIdentity = provisional.rawId || provisional.normalizedName || "unknown";
		const canonicalKey = `${category}:${canonicalIdentity}`;
		const provenance: Record<string, FieldProvenance> = {};
		const context: MergeContext = {
			category,
			canonicalKey,
			allCandidates: group,
			rankedCandidates: ranked,
			setLikeFields: new Set(compendiumCategoryDefinitions[category].schema.setLikeFields),
			resolutions: resolutionMap,
			conflicts,
			provenance,
		};

		if (ids.length > 1 || names.length > 1) {
			registerConflict(
				"identity-collision",
				"identity",
				group.map((candidate) => ({ candidate, value: { id: candidate.rawId, name: candidate.rawName } })),
				context,
				`Candidates joined by id/name disagree on identity (${ids.length} ids, ${names.length} normalized names).`,
			);
		}

		const merged = mergeValueCandidates(
			group.map((candidate) => ({ candidate, value: candidate.raw })),
			"",
			context,
		);
		if (!isRecord(merged)) continue;
		entries.push({
			key: canonicalKey,
			category,
			value: merged as T,
			provenance: {
				canonicalKey,
				category,
				sourceIds: uniqueSourceIds(
					group.map((candidate) => ({ candidate, value: candidate.raw })),
				),
				fields: provenance,
			},
			sourceLineage: group.map((candidate) => candidate.source).filter(
				(source, index, sources) =>
					sources.findIndex((candidate) => candidate.id === source.id) === index,
			),
		});
	}
	return { entries, conflicts };
}

export function createCompletenessFirstNameView<
	T extends CanonicalEntryRecord,
>(values: readonly T[]): T[] {
	const selected = new Map<string, { value: T; score: number }>();
	for (const value of values) {
		const name =
			typeof value.name === "string" && value.name.trim()
				? normalizeCanonicalName(value.name)
				: null;
		const key = name ?? `__unnamed_${selected.size}`;
		const score = completenessScore(value);
		const existing = selected.get(key);
		if (!existing) {
			selected.set(key, { value, score });
			continue;
		}
		if (score > existing.score) {
			selected.set(key, { value, score });
		}
	}
	return [...selected.values()].map(({ value }) => value);
}

function getValueAtPath(value: unknown, path: string): unknown {
	let current = value;
	for (const segment of path.split(".")) {
		if (!isRecord(current)) return undefined;
		current = current[segment];
	}
	return current;
}

function collectValuesAtPath(value: unknown, path: string): unknown[] {
	const segments = path.split(".");
	const visit = (current: unknown, index: number): unknown[] => {
		if (index >= segments.length) return [current];
		const segment = segments[index];
		const isArraySegment = segment.endsWith("[]");
		const key = isArraySegment ? segment.slice(0, -2) : segment;
		if (!isRecord(current)) return [];
		const child = current[key];
		if (isArraySegment) {
			if (!Array.isArray(child)) return [];
			return child.flatMap((entry) => visit(entry, index + 1));
		}
		return visit(child, index + 1);
	};
	return visit(value, 0);
}

function resolveReferences(
	entries: Record<CompendiumCategory, CanonicalRegistryEntry[]>,
	resolutions: readonly MergeResolution[],
): { references: ReferenceResolution[]; conflicts: MergeConflict[] } {
	const resolutionMap = new Map(
		resolutions.map((resolution) => [resolution.conflictId, resolution]),
	);
	const references: ReferenceResolution[] = [];
	const conflicts: MergeConflict[] = [];
	const byCategoryAndId = new Map<string, CanonicalRegistryEntry[]>();
	const byCategoryAndName = new Map<string, CanonicalRegistryEntry[]>();
	for (const category of compendiumCategories) {
		for (const entry of entries[category]) {
			const id = getStringAtFields(
				entry.value,
				compendiumCategoryDefinitions[category].schema.idFields,
			);
			const name = getStringAtFields(
				entry.value,
				compendiumCategoryDefinitions[category].schema.nameFields,
			);
			if (id) {
				const key = `${category}:${normalizeCanonicalId(id)}`;
				byCategoryAndId.set(key, [
					...(byCategoryAndId.get(key) ?? []),
					entry,
				]);
			}
			if (name) {
				const key = `${category}:${normalizeCanonicalName(name)}`;
				byCategoryAndName.set(key, [
					...(byCategoryAndName.get(key) ?? []),
					entry,
				]);
			}
		}
	}

	for (const category of compendiumCategories) {
		for (const descriptor of compendiumCategoryDefinitions[category].references) {
			for (const from of entries[category]) {
				const rawReferences = collectValuesAtPath(
					from.value,
					descriptor.fieldPath,
				).filter((value): value is string =>
					typeof value === "string" && value.trim().length > 0,
				);
				for (const rawReference of rawReferences) {
					const reference = rawReference.trim();
					const discriminator = descriptor.discriminatorPath
						? getValueAtPath(from.value, descriptor.discriminatorPath)
						: null;
					const targetCategory =
						typeof discriminator === "string" &&
						descriptor.targetCategoryByDiscriminator
							? (descriptor.targetCategoryByDiscriminator[discriminator] ?? null)
							: descriptor.targetCategories.length === 1
								? descriptor.targetCategories[0]
								: null;
					let matches: CanonicalRegistryEntry[] = [];
					let matchedBy: ReferenceResolution["matchedBy"] = "none";
					if (targetCategory) {
						matches =
							byCategoryAndId.get(
								`${targetCategory}:${normalizeCanonicalId(reference)}`,
							) ?? [];
						if (matches.length > 0) matchedBy = "id";
						if (
							matches.length === 0 &&
							descriptor.matchBy === "id-or-name"
						) {
							matches =
								byCategoryAndName.get(
									`${targetCategory}:${normalizeCanonicalName(reference)}`,
								) ?? [];
							if (matches.length > 0) matchedBy = "name";
						}
					}
					if (matches.length > 1) matchedBy = "ambiguous";
					references.push({
						descriptorId: descriptor.id,
						fromKey: from.key,
						fieldPath: descriptor.fieldPath,
						reference,
						targetCategory,
						targetKey: matches.length === 1 ? matches[0].key : null,
						matchedBy,
						required: descriptor.requiredWhenPresent,
					});
					if (
						descriptor.requiredWhenPresent &&
						(matches.length !== 1 || !targetCategory)
					) {
						const kind: MergeConflictKind =
							matches.length > 1
								? "ambiguous-reference"
								: "unresolved-reference";
						const id = conflictId(
							category,
							from.key,
							kind,
							`${descriptor.id}:${reference}`,
						);
						const resolution = resolutionMap.get(id);
						conflicts.push({
							id,
							kind,
							category,
							canonicalKey: from.key,
							fieldPath: descriptor.fieldPath,
							candidates: from.sourceLineage.map((source) => ({
								sourceId: source.id,
								value: reference,
							})),
							message: `${descriptor.description} Reference "${reference}" ${matches.length > 1 ? "is ambiguous" : "does not resolve"}.`,
							status: resolution ? "resolved" : "unresolved",
							blocking: !resolution,
							resolutionId: resolution?.conflictId,
						});
					}
				}
			}
		}
	}
	return { references, conflicts };
}

function emptyCategoryRecord<T>(): Record<CompendiumCategory, T[]> {
	return Object.fromEntries(
		compendiumCategories.map((category) => [category, [] as T[]]),
	) as unknown as Record<CompendiumCategory, T[]>;
}

function registryConfigurationConflicts(): MergeConflict[] {
	const conflicts: MergeConflict[] = [];
	const sourceIds = new Set<string>();
	for (const source of compendiumSourceRegistry) {
		if (sourceIds.has(source.id)) {
			conflicts.push({
				id: conflictId(source.category, source.id, "registry-configuration", "duplicate-source"),
				kind: "registry-configuration",
				category: source.category,
				candidates: [{ sourceId: source.id, value: source.modulePath }],
				message: `Source id "${source.id}" is registered more than once.`,
				status: "unresolved",
				blocking: true,
			});
		}
		sourceIds.add(source.id);
	}
	for (const category of compendiumCategories) {
		for (const sourceId of compendiumCategoryDefinitions[category].sourceIds) {
			const source = sourceById.get(sourceId);
			if (!source || source.category !== category) {
				conflicts.push({
					id: conflictId(category, sourceId, "registry-configuration", "source-membership"),
					kind: "registry-configuration",
					category,
					candidates: [{ sourceId, value: source?.category ?? null }],
					message: `Category "${category}" references missing or mismatched source "${sourceId}".`,
					status: "unresolved",
					blocking: true,
				});
			}
		}
	}
	return conflicts;
}

export async function buildCanonicalRegistry(
	resolutions: readonly MergeResolution[] = [],
): Promise<CanonicalRegistrySnapshot> {
	const candidates = emptyCategoryRecord<CompendiumCandidate>();
	const entries = emptyCategoryRecord<CanonicalRegistryEntry>();
	const conflicts = registryConfigurationConflicts();
	const loadedSourceIds: string[] = [];
	const sourceCounts: Record<string, number> = {};
	let sequence = 0;

	const sourcesToLoad = compendiumSourceRegistry.filter(
		(source) => source.loadPolicy === "eager",
	);
	for (const source of compendiumSourceRegistry) sourceCounts[source.id] = 0;
	const settled = await Promise.allSettled(
		sourcesToLoad.map(async (source) => ({
			source,
			values: await source.load(),
		})),
	);
	for (const [index, result] of settled.entries()) {
		const source = sourcesToLoad[index];
		if (result.status === "rejected") {
			conflicts.push({
				id: conflictId(source.category, source.id, "source-load-failure", "load"),
				kind: "source-load-failure",
				category: source.category,
				candidates: [{ sourceId: source.id, value: String(result.reason) }],
				message: `Failed to load ${source.modulePath}#${source.exportName}: ${String(result.reason)}`,
				status: "unresolved",
				blocking: true,
			});
			continue;
		}
		loadedSourceIds.push(source.id);
		sourceCounts[source.id] = result.value.values.length;
		const descriptor = descriptorWithoutLoader(source);
		for (const [ordinal, raw] of result.value.values.entries()) {
			if (!isRecord(raw)) {
				conflicts.push({
					id: conflictId(source.category, `${source.id}:${ordinal}`, "invalid-candidate", "shape"),
					kind: "invalid-candidate",
					category: source.category,
					candidates: [{ sourceId: source.id, ordinal, value: raw }],
					message: "Source emitted a non-object candidate.",
					status: "unresolved",
					blocking: true,
				});
				continue;
			}
			candidates[source.category].push(
				createCompendiumCandidate(
					source.category,
					descriptor,
					raw,
					ordinal,
					sequence++,
				),
			);
		}
	}

	for (const category of compendiumCategories) {
		const merged = mergeCanonicalCandidates(
			category,
			candidates[category],
			resolutions,
		);
		entries[category] = merged.entries;
		conflicts.push(...merged.conflicts);
	}
	const referenceResult = resolveReferences(entries, resolutions);
	conflicts.push(...referenceResult.conflicts);
	const blockingConflicts = conflicts.filter((conflict) => conflict.blocking);
	return {
		entries,
		candidates,
		conflicts,
		blockingConflicts,
		references: referenceResult.references,
		loadedSourceIds,
		sourceCounts,
		candidateCount: Object.values(candidates).reduce(
			(total, categoryCandidates) => total + categoryCandidates.length,
			0,
		),
		entryCount: Object.values(entries).reduce(
			(total, categoryEntries) => total + categoryEntries.length,
			0,
		),
	};
}

let canonicalRegistryPromise: Promise<CanonicalRegistrySnapshot> | null = null;

export function loadCanonicalRegistry(): Promise<CanonicalRegistrySnapshot> {
	if (!canonicalRegistryPromise) {
		canonicalRegistryPromise = buildCanonicalRegistry(
			canonicalConflictResolutions,
		);
	}
	return canonicalRegistryPromise;
}

export function clearCanonicalRegistryCache(): void {
	canonicalRegistryPromise = null;
}

export function getRegisteredSource(
	sourceId: string,
): CompendiumSourceDescriptor | null {
	const source = sourceById.get(sourceId);
	return source ? descriptorWithoutLoader(source) : null;
}

export function getRegisteredSourcesForCategory(
	category: CompendiumCategory,
): CompendiumSourceDescriptor[] {
	return compendiumCategoryDefinitions[category].sourceIds
		.map((sourceId) => sourceById.get(sourceId))
		.filter((source): source is RegisteredCompendiumSource => Boolean(source))
		.map(descriptorWithoutLoader);
}
