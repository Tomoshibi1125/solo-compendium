import type { ChoiceSourceData, LedgerChoice } from "@/lib/choiceCalculations";
import type {
	Regent,
	RegentClassFeature,
	RegentFeatureCanonStatus,
	RegentFeatureFrequency,
	RegentFeatureProvenance,
	RegentFeatureSourceKind,
	RegentFeatureTracking,
	RegentFeatureType,
	RegentFeatureUseDefinition,
} from "@/lib/regentTypes";

export type {
	RegentFeatureFrequency,
	RegentFeatureType,
} from "@/lib/regentTypes";

export interface RegentLeveledFeature extends RegentClassFeature {
	id: string;
	canonStatus: RegentFeatureCanonStatus;
	provenance: RegentFeatureProvenance;
}

const SOURCE_PATH = "src/data/compendium/regents.ts" as const;
const REVIEW_DESCRIPTION =
	"Canon review required: the progression names this feature, but the current repository source does not author its mechanics. No automated gameplay effect is applied.";

/** Cadence text conflicts or abbreviations that cannot safely seed charges. */
const MANUAL_CADENCE_KEYS = new Set([
	"beast_regent:1:apex-form",
	"beast_regent:2:beast-king-s-call",
	"plague_regent:2:pandemic-decree",
	"frost_regent:3:glacial-eternity",
	"spatial_regent:9:reality-rewrite",
	"mimic_regent:1:power-theft",
	"blood_regent:5:sanguine-rebirth",
	"blood_regent:9:blood-apocalypse",
]);

const normalizeName = (name: string): string =>
	name
		.trim()
		.toLowerCase()
		.replace(/\s*\((?:active|passive)\)\s*$/i, "")
		.replace(/\s+/g, " ");

const slug = (value: string): string =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");

export const buildRegentFeatureId = (
	regentId: string,
	level: number,
	name: string,
): string => `regent-feature:${regentId}:${level}:${slug(name)}`;

const toActionType = (type: RegentFeatureType): string => {
	switch (type) {
		case "bonus-action":
			return "Bonus action";
		case "reaction":
			return "Reaction";
		case "action":
			return "Action";
		case "active":
			return "Active";
		default:
			return "Passive";
	}
};

const toUses = (
	frequency: RegentFeatureFrequency | undefined,
	manualCadence: boolean,
): RegentFeatureUseDefinition | undefined => {
	if (manualCadence) return undefined;
	if (frequency === "short-rest") {
		return { formula: "1", recharge: "short-rest" };
	}
	if (frequency === "long-rest" || frequency === "once-per-long-rest") {
		return { formula: "1", recharge: "long-rest" };
	}
	// A day is not guaranteed to equal a long rest. Daily features remain manual
	// until the shared duration/recovery lifecycle can represent calendar cadence.
	return undefined;
};

type SourceFeature = {
	name: string;
	description: string;
	type?: RegentFeatureType;
	frequency?: RegentFeatureFrequency;
	level?: number;
	power_level?: number;
	actionType?: string;
	uses?: RegentFeatureUseDefinition;
	resource?: string;
	tracking?: RegentFeatureTracking;
	sourceKind: Exclude<RegentFeatureSourceKind, "progression_table">;
	sourceIndex: number;
};

const collectSourceFeatures = (regent: Regent): SourceFeature[] => [
	...(regent.class_features ?? []).flatMap((feature, sourceIndex) =>
		feature.canonStatus === "review-blocked"
			? []
			: [
					{
						...feature,
						sourceKind: "class_features" as const,
						sourceIndex,
					},
				],
	),
	...(regent.abilities ?? []).map((feature, sourceIndex) => ({
		...feature,
		sourceKind: "abilities" as const,
		sourceIndex,
	})),
	...(regent.features ?? []).map((feature, sourceIndex) => ({
		...feature,
		type: feature.type ?? ("passive" as const),
		sourceKind: "features" as const,
		sourceIndex,
	})),
];

const sourcePriority: Record<SourceFeature["sourceKind"], number> = {
	class_features: 0,
	abilities: 1,
	features: 2,
};

function selectSourceFeature(
	sources: SourceFeature[],
	name: string,
	level: number,
): SourceFeature | undefined {
	const candidates = sources.filter(
		(source) => normalizeName(source.name) === normalizeName(name),
	);
	return candidates.sort((left, right) => {
		const leftExactLevel = left.level === level ? 0 : 1;
		const rightExactLevel = right.level === level ? 0 : 1;
		if (leftExactLevel !== rightExactLevel)
			return leftExactLevel - rightExactLevel;
		const leftExactPower = left.power_level === level ? 0 : 1;
		const rightExactPower = right.power_level === level ? 0 : 1;
		if (leftExactPower !== rightExactPower)
			return leftExactPower - rightExactPower;
		const priority =
			sourcePriority[left.sourceKind] - sourcePriority[right.sourceKind];
		if (priority !== 0) return priority;
		return left.sourceIndex - right.sourceIndex;
	})[0];
}

function selectMetadataFeature(
	sources: SourceFeature[],
	name: string,
	level: number,
	fallback: SourceFeature | undefined,
): SourceFeature | undefined {
	const candidates = sources.filter(
		(source) => normalizeName(source.name) === normalizeName(name),
	);
	return (
		candidates.find(
			(source) =>
				source.sourceKind === "class_features" && source.level === level,
		) ??
		candidates.find((source) => source.sourceKind === "abilities") ??
		fallback
	);
}

const sourceFieldPath = (source: SourceFeature): string =>
	`${source.sourceKind}[${source.sourceIndex}]`;

function materializeProgressionFeature(
	regent: Regent,
	sources: SourceFeature[],
	level: number,
	name: string,
	progressionIndex: number,
): RegentLeveledFeature {
	const source = selectSourceFeature(sources, name, level);
	const metadataSource = selectMetadataFeature(sources, name, level, source);
	const id = buildRegentFeatureId(regent.id, level, name);
	const manualCadence = MANUAL_CADENCE_KEYS.has(
		`${regent.id}:${level}:${slug(name)}`,
	);
	const type = metadataSource?.type ?? source?.type ?? "passive";
	const frequency = metadataSource?.frequency ?? source?.frequency;
	const uses =
		metadataSource?.uses ?? source?.uses ?? toUses(frequency, manualCadence);
	const resource = metadataSource?.resource ?? source?.resource;
	const explicitTracking = metadataSource?.tracking ?? source?.tracking;
	const tracking: RegentFeatureTracking | undefined = explicitTracking
		? explicitTracking
		: resource
			? "resource"
			: uses
				? "uses"
				: !source || manualCadence || type !== "passive"
					? "manual"
					: undefined;
	const sourceLevel = source?.level ?? source?.power_level;
	const conflict =
		sourceLevel !== undefined && sourceLevel !== level
			? `progression_table grants level ${level}; ${source?.sourceKind} labels the matching source row ${sourceLevel}`
			: undefined;
	const provenance: RegentFeatureProvenance = source
		? {
				levelSource: "progression_table",
				mechanicsSource: source.sourceKind,
				sourcePath: SOURCE_PATH,
				fieldPath: sourceFieldPath(source),
				sourceName: source.name,
				sourceLevel,
				conflict,
			}
		: {
				levelSource: "progression_table",
				mechanicsSource: "progression_table",
				sourcePath: SOURCE_PATH,
				fieldPath: `progression_table.${level}.features_gained[${progressionIndex}]`,
				sourceName: name,
			};

	return {
		id,
		level,
		name,
		description: source?.description ?? REVIEW_DESCRIPTION,
		type,
		frequency,
		actionType:
			metadataSource?.actionType ?? source?.actionType ?? toActionType(type),
		uses,
		resource,
		tracking,
		canonStatus: source ? "source-backed" : "review-blocked",
		provenance,
		reviewBlockerId: !source
			? `task7:${regent.id}:progression-mechanics`
			: manualCadence
				? `task7:${regent.id}:progression-mechanics`
				: undefined,
	};
}

/**
 * Materialize one direct canonical ledger from the authored progression table.
 * Levels and names come only from progression_table; mechanics come only from
 * exact-name source rows. Missing mechanics remain explicit review blockers —
 * no power-level remapping, thematic fallback, aliases, or invented prose.
 */
export function materializeCanonicalRegentLedger(
	regent: Regent,
): RegentLeveledFeature[] {
	const sources = collectSourceFeatures(regent);
	const table = regent.progression_table;
	if (!table) {
		return (regent.class_features ?? []).map((feature, index) => ({
			...feature,
			id:
				feature.id ??
				buildRegentFeatureId(regent.id, feature.level, feature.name),
			canonStatus: feature.canonStatus ?? "source-backed",
			provenance: feature.provenance ?? {
				levelSource: "class_features",
				mechanicsSource: "class_features",
				sourcePath: SOURCE_PATH,
				fieldPath: `class_features[${index}]`,
				sourceName: feature.name,
				sourceLevel: feature.level,
			},
		}));
	}

	return Object.entries(table)
		.map(([levelKey, row]) => [Number(levelKey), row] as const)
		.filter(([level]) => Number.isInteger(level) && level >= 1 && level <= 20)
		.sort(([left], [right]) => left - right)
		.flatMap(([level, row]) =>
			(row.features_gained ?? []).map((name, index) =>
				materializeProgressionFeature(regent, sources, level, name, index),
			),
		);
}

/** Return only the already-materialized canonical Regent ledger. */
export function getRegentLeveledFeatures(
	regent: Regent,
): RegentLeveledFeature[] {
	return (regent.class_features ?? [])
		.map(
			(feature, index): RegentLeveledFeature => ({
				...feature,
				id:
					feature.id ??
					buildRegentFeatureId(regent.id, feature.level, feature.name),
				canonStatus: feature.canonStatus ?? "source-backed",
				provenance: feature.provenance ?? {
					levelSource: "class_features",
					mechanicsSource: "class_features",
					sourcePath: SOURCE_PATH,
					fieldPath: `class_features[${index}]`,
					sourceName: feature.name,
					sourceLevel: feature.level,
				},
			}),
		)
		.sort((left, right) => left.level - right.level);
}

/** Features a Regent grants at exactly the given character level. */
export function getRegentFeaturesAtLevel(
	regent: Regent,
	level: number,
): RegentLeveledFeature[] {
	return getRegentLeveledFeatures(regent).filter(
		(feature) => feature.level === level,
	);
}

/** Adapt a Regent's declared pick-count ledger to the shared choice engine. */
export function regentToChoiceSource(regent: Regent): ChoiceSourceData {
	return {
		name: regent.name,
		skill_choice_count: 0,
		cantrips_known: regent.spellcasting?.cantrips_known,
		spells_known: regent.spellcasting?.spells_known,
		powers_known: regent.powersKnown,
		techniques_known: regent.techniquesKnown,
		level_choices: regent.levelChoices as LedgerChoice[] | undefined,
	};
}
