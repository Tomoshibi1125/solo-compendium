/**
 * Structured Path choices (RA-23) and Path casting, read from the static Path
 * catalog. Callers that build choice sources from a Path row merge these
 * fields in so the shared choice totals see them; the sheet's Path choices
 * panel lists the named options that are still open.
 *
 * The catalog is passed in (see useStaticPathCatalog) so the large Path data
 * module stays lazily loaded.
 */
import type {
	Path,
	PathChoiceOption,
	PathLevelChoice,
} from "@/data/compendium/paths";
import type {
	ChoiceSourceData,
	LedgerChoice,
	LedgerChoiceType,
} from "@/lib/choiceCalculations";

export type StaticPathReference =
	| string
	| { id?: string | null; name?: string | null }
	| null
	| undefined;

export const normalizePathToken = (value: string | null | undefined): string =>
	(value ?? "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

const indexCache = new WeakMap<readonly Path[], Map<string, Path>>();

function indexCatalog(catalog: readonly Path[]): Map<string, Path> {
	const cached = indexCache.get(catalog);
	if (cached) return cached;
	const index = new Map<string, Path>();
	for (const path of catalog) {
		for (const token of [path.id, path.name, ...(path.aliases ?? [])]) {
			const key = normalizePathToken(token);
			if (key && !index.has(key)) index.set(key, path);
		}
	}
	indexCache.set(catalog, index);
	return index;
}

/** Resolve a stored Path id, name, or declared alias within a catalog. */
export function findPathIn(
	catalog: readonly Path[] | null | undefined,
	ref: StaticPathReference,
): Path | null {
	if (!catalog?.length) return null;
	const index = indexCatalog(catalog);
	const tokens =
		typeof ref === "string" ? [ref] : ref ? [ref.id, ref.name] : [];
	for (const token of tokens) {
		const found = index.get(normalizePathToken(token));
		if (found) return found;
	}
	return null;
}

/** Load the static Path catalog on demand. */
export async function loadStaticPathCatalog(): Promise<Path[]> {
	return (await import("@/data/compendium/paths")).paths;
}

type PathLedgerFields = Pick<
	ChoiceSourceData,
	"level_choices" | "cantrips_known" | "spells_known" | "structured_sources"
>;

/**
 * The Path's structured picks in choice-source form. Named `path-option`
 * entries are left out: the Path choices panel records those, so they never
 * become generic picker counts.
 */
export function getPathChoiceLedger(
	path: Pick<Path, "levelChoices" | "spellcasting"> | null | undefined,
): PathLedgerFields {
	if (!path) return {};
	const levelChoices: LedgerChoice[] = (path.levelChoices ?? [])
		.filter((choice) => choice.type !== "path-option")
		.map((choice) => ({
			level: choice.level,
			type: choice.type as LedgerChoiceType,
			count: choice.count,
			source: choice.source,
			...(choice.options
				? { options: choice.options.map((option) => option.name) }
				: {}),
		}));
	const structuredSources = new Set<string>(
		(path.levelChoices ?? []).map((choice) => choice.source),
	);
	if (path.spellcasting) structuredSources.add(path.spellcasting.source);
	return {
		...(levelChoices.length > 0 ? { level_choices: levelChoices } : {}),
		...(path.spellcasting
			? {
					cantrips_known: path.spellcasting.cantripsKnown,
					spells_known: path.spellcasting.spellsKnown,
				}
			: {}),
		...(structuredSources.size > 0
			? { structured_sources: [...structuredSources] }
			: {}),
	};
}

/**
 * Merge the static Path ledger into a choice source built from a Path row.
 * Without the catalog (still loading) the source is returned unchanged.
 */
export function withStaticPathLedger<T extends ChoiceSourceData>(
	source: T | null | undefined,
	ref: StaticPathReference,
	catalog: readonly Path[] | null | undefined,
): T | null {
	if (!source) return null;
	const ledger = getPathChoiceLedger(findPathIn(catalog, ref));
	return Object.keys(ledger).length > 0 ? { ...source, ...ledger } : source;
}

/** Stable feature id for a recorded Path option. */
export function buildPathOptionFeatureId(
	pathId: string,
	source: string,
	option: string,
): string {
	return `path-option:${pathId}:${normalizePathToken(source)}:${normalizePathToken(option)}`;
}

/** Sheet name of a recorded Path option (RA-23: its own feature entry). */
export const pathOptionFeatureName = (source: string, option: string) =>
	`${source}: ${option}`;

export interface PathOptionGroup {
	source: string;
	/** Picks owed at the character's level. */
	required: number;
	/** Every option the feature offers. */
	options: PathChoiceOption[];
	/** Option names already recorded on the sheet. */
	chosen: string[];
	/** Level of the latest entry in effect. */
	level: number;
}

interface RecordedFeatureRow {
	name?: string | null;
	feature_id?: string | null;
}

/**
 * Named Path options owed at `characterLevel`, grouped by granting feature.
 * A later grant of the same feature adds to the earlier picks (RA-23).
 */
export function getPathOptionGroups(
	path: Pick<Path, "id" | "levelChoices"> | null | undefined,
	characterLevel: number,
	recordedFeatures: readonly RecordedFeatureRow[],
): PathOptionGroup[] {
	if (!path?.levelChoices) return [];
	const groups = new Map<string, PathOptionGroup>();
	for (const choice of path.levelChoices) {
		if (choice.type !== "path-option" || choice.level > characterLevel)
			continue;
		const group = groups.get(choice.source) ?? {
			source: choice.source,
			required: 0,
			options: [],
			chosen: [],
			level: choice.level,
		};
		group.required += choice.count;
		group.level = Math.max(group.level, choice.level);
		for (const option of choice.options ?? []) {
			if (!group.options.some((known) => known.name === option.name)) {
				group.options.push(option);
			}
		}
		groups.set(choice.source, group);
	}
	for (const group of groups.values()) {
		group.chosen = group.options
			.filter((option) =>
				recordedFeatures.some(
					(row) =>
						row.feature_id ===
							buildPathOptionFeatureId(path.id, group.source, option.name) ||
						row.name === pathOptionFeatureName(group.source, option.name),
				),
			)
			.map((option) => option.name);
	}
	return [...groups.values()];
}

/** Options still to pick, across every group. */
export const countOpenPathOptions = (groups: readonly PathOptionGroup[]) =>
	groups.reduce(
		(total, group) => total + Math.max(0, group.required - group.chosen.length),
		0,
	);

/**
 * Problems with a Path's structured choices: every entry needs a positive
 * count and a granting feature on the Path at or below its level, and every
 * named-option feature must offer at least as many described options as it
 * ever asks for.
 */
export function getPathChoiceIssues(path: Path): string[] {
	const issues: string[] = [];
	const hasGrantingFeature = (choice: PathLevelChoice) =>
		path.features.some(
			(feature) =>
				feature.name === choice.source && feature.level <= choice.level,
		);
	const owedBySource = new Map<string, number>();
	const optionsBySource = new Map<string, Set<string>>();
	for (const choice of path.levelChoices ?? []) {
		if (choice.count < 1) issues.push(`${choice.source}: count < 1`);
		if (!hasGrantingFeature(choice))
			issues.push(`${choice.source}: no granting feature at L${choice.level}`);
		if (choice.type !== "path-option") continue;
		owedBySource.set(
			choice.source,
			(owedBySource.get(choice.source) ?? 0) + choice.count,
		);
		const names = optionsBySource.get(choice.source) ?? new Set<string>();
		for (const option of choice.options ?? []) {
			if (!option.name.trim() || !option.description.trim())
				issues.push(`${choice.source}: blank option`);
			names.add(option.name);
		}
		optionsBySource.set(choice.source, names);
	}
	for (const [source, owed] of owedBySource) {
		const offered = optionsBySource.get(source)?.size ?? 0;
		if (offered < owed)
			issues.push(`${source}: ${owed} picks but ${offered} options`);
	}
	return issues;
}
