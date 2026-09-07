import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
	type CanonicalPublicationCategory,
	locateCanonicalSourcebookEntry,
	sourcebookVolumes,
} from "../books/scripts/sourcebook-publication";
import { anomalies } from "../src/data/compendium/anomalies";
import { artifacts } from "../src/data/compendium/artifacts";
import { allBackgrounds } from "../src/data/compendium/backgrounds-index";
import { conditions } from "../src/data/compendium/conditions";
import { comprehensiveFeats } from "../src/data/compendium/feats-comprehensive";
import { FIGHTING_STYLES } from "../src/data/compendium/fightingStyles";
import { allItems } from "../src/data/compendium/items-index";
import { jobs } from "../src/data/compendium/jobs";
import { locations } from "../src/data/compendium/locations";
import { PRIME_PANTHEON } from "../src/data/compendium/pantheon";
import { paths } from "../src/data/compendium/paths";
import { powers } from "../src/data/compendium/powers";
import { staticDataProvider } from "../src/data/compendium/providers";
import { regents } from "../src/data/compendium/regents";
import { comprehensiveRelics } from "../src/data/compendium/relics-comprehensive";
import { rollableTables } from "../src/data/compendium/rollableTables";
import { allRunes } from "../src/data/compendium/runes";
import { shadowSoldiers } from "../src/data/compendium/shadow-soldiers";
import { sigils } from "../src/data/compendium/sigils";
import { comprehensiveSkills } from "../src/data/compendium/skills-comprehensive";
import { spells } from "../src/data/compendium/spells";
import { tattoos } from "../src/data/compendium/tattoos";
import { techniques } from "../src/data/compendium/techniques";
import { allVehicles } from "../src/data/compendium/vehicles";

/**
 * Read-only by default:
 *   npx --no-install tsx scripts/validate-sourcebook-canon-parity.ts
 *
 * Refresh the tracked authored manifest after an intentional canon/publication
 * change, then review the diff:
 *   npx --no-install tsx scripts/validate-sourcebook-canon-parity.ts --write-manifest
 */

type CanonicalRecord = Record<string, unknown>;
type ProviderGetter = () => Promise<readonly unknown[]>;

interface CatalogDefinition {
	category: CanonicalPublicationCategory;
	bookRecords: readonly unknown[] | null;
	getAppRecords: ProviderGetter;
}

interface FieldSpec {
	label: string;
	book: readonly string[];
	app: readonly string[];
}

interface PublicationManifestEntry {
	canonicalId: string;
	category: CanonicalPublicationCategory;
	canonicalName: string;
	sourceBook: string | null;
	fieldDigest: string;
	publication: {
		status: "published" | "manual-review" | "not-published";
		volume: string | null;
		section: string | null;
		version: null;
		versionStatus: "manual";
		page: null;
		pageStatus: "manual";
	};
	evidence: {
		source: string;
		selector: string;
	};
}

interface PublicationManifest {
	schemaVersion: 1;
	keyFormat: "category:canonicalId";
	evidencePolicy: string;
	volumes: Array<{
		slug: string;
		title: string;
		outputBase: string;
		version: null;
		versionStatus: "manual";
		sections: readonly string[];
	}>;
	entries: Record<string, PublicationManifestEntry>;
}

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const manifestPath = resolve(
	repoRoot,
	"books/data/canonical-publication-manifest.json",
);
const writeManifest = process.argv.includes("--write-manifest");
const selfTest = process.argv.includes("--self-test");

const asRecords = (records: readonly unknown[]): readonly CanonicalRecord[] =>
	records as readonly CanonicalRecord[];
const fromProvider = (
	getter: () => Promise<readonly unknown[]>,
): ProviderGetter => getter;

const catalogs: readonly CatalogDefinition[] = [
	{
		category: "anomalies",
		bookRecords: anomalies,
		getAppRecords: fromProvider(() => staticDataProvider.getAnomalies()),
	},
	{
		category: "artifacts",
		bookRecords: artifacts,
		getAppRecords: fromProvider(() => staticDataProvider.getArtifacts()),
	},
	{
		category: "backgrounds",
		bookRecords: allBackgrounds,
		getAppRecords: fromProvider(() => staticDataProvider.getBackgrounds()),
	},
	{
		category: "conditions",
		bookRecords: conditions,
		getAppRecords: fromProvider(() => staticDataProvider.getConditions()),
	},
	{
		category: "crafting",
		bookRecords: null,
		getAppRecords: fromProvider(() => staticDataProvider.getCrafting()),
	},
	{
		category: "feats",
		bookRecords: comprehensiveFeats,
		getAppRecords: fromProvider(() => staticDataProvider.getFeats()),
	},
	{
		category: "fighting-styles",
		bookRecords: FIGHTING_STYLES,
		getAppRecords: fromProvider(() => staticDataProvider.getFightingStyles()),
	},
	{
		category: "guild-base",
		bookRecords: null,
		getAppRecords: fromProvider(() => staticDataProvider.getGuildBase()),
	},
	{
		category: "items",
		bookRecords: allItems,
		getAppRecords: fromProvider(() => staticDataProvider.getItems()),
	},
	{
		category: "jobs",
		bookRecords: jobs,
		getAppRecords: fromProvider(() => staticDataProvider.getJobs()),
	},
	{
		category: "locations",
		bookRecords: locations,
		getAppRecords: fromProvider(() => staticDataProvider.getLocations()),
	},
	{
		category: "npcs",
		bookRecords: null,
		getAppRecords: fromProvider(() => staticDataProvider.getNpcs()),
	},
	{
		category: "pantheon",
		bookRecords: PRIME_PANTHEON,
		getAppRecords: fromProvider(() => staticDataProvider.getPantheon()),
	},
	{
		category: "paths",
		bookRecords: paths,
		getAppRecords: fromProvider(() => staticDataProvider.getPaths()),
	},
	{
		category: "powers",
		bookRecords: powers,
		getAppRecords: fromProvider(() => staticDataProvider.getPowers()),
	},
	{
		category: "regents",
		bookRecords: regents,
		getAppRecords: fromProvider(() => staticDataProvider.getRegents()),
	},
	{
		category: "relics",
		bookRecords: comprehensiveRelics,
		getAppRecords: fromProvider(() => staticDataProvider.getRelics()),
	},
	{
		category: "rollable-tables",
		bookRecords: rollableTables,
		getAppRecords: fromProvider(() => staticDataProvider.getRollableTables()),
	},
	{
		category: "runes",
		bookRecords: allRunes,
		getAppRecords: fromProvider(() => staticDataProvider.getRunes()),
	},
	{
		category: "shadow-soldiers",
		bookRecords: shadowSoldiers,
		getAppRecords: fromProvider(() => staticDataProvider.getShadowSoldiers()),
	},
	{
		category: "sigils",
		bookRecords: sigils,
		getAppRecords: fromProvider(() => staticDataProvider.getSigils()),
	},
	{
		category: "skills",
		bookRecords: comprehensiveSkills,
		getAppRecords: fromProvider(() => staticDataProvider.getSkills()),
	},
	{
		category: "spells",
		bookRecords: spells,
		getAppRecords: fromProvider(() => staticDataProvider.getSpells()),
	},
	{
		category: "tattoos",
		bookRecords: tattoos,
		getAppRecords: fromProvider(() => staticDataProvider.getTattoos()),
	},
	{
		category: "techniques",
		bookRecords: techniques,
		getAppRecords: fromProvider(() => staticDataProvider.getTechniques()),
	},
	{
		category: "vehicles",
		bookRecords: allVehicles,
		getAppRecords: fromProvider(() => staticDataProvider.getVehicles()),
	},
];

const commonFields: readonly FieldSpec[] = [
	{
		label: "name",
		book: ["name", "display_name", "title"],
		app: ["name", "display_name", "title"],
	},
	{
		label: "description",
		book: ["description", "summary", "overview"],
		app: ["description", "summary", "overview"],
	},
	{
		label: "sourceBook",
		book: ["source_book", "source"],
		app: ["source_book", "source"],
	},
];

const fieldsByCategory: Partial<
	Record<CanonicalPublicationCategory, readonly FieldSpec[]>
> = {
	anomalies: [
		{ label: "rank", book: ["rank", "gate_rank"], app: ["rank", "gate_rank"] },
		{ label: "xp", book: ["xp"], app: ["xp"] },
		{
			label: "armorClass",
			book: ["armor_class", "ac"],
			app: ["armor_class", "ac"],
		},
		{
			label: "hitPoints",
			book: ["hit_points_average", "hp"],
			app: ["hit_points_average", "hp"],
		},
	],
	artifacts: [{ label: "rarity", book: ["rarity"], app: ["rarity"] }],
	backgrounds: [
		{
			label: "featureName",
			book: ["feature_name"],
			app: ["feature_name"],
		},
		{
			label: "featureDescription",
			book: ["feature_description"],
			app: ["feature_description"],
		},
	],
	conditions: [
		{
			label: "effects",
			book: ["effects"],
			app: ["condition_effects", "effects"],
		},
		{
			label: "duration",
			book: ["duration"],
			app: ["condition_duration", "duration"],
		},
		{
			label: "removal",
			book: ["removal"],
			app: ["condition_removal", "removal"],
		},
	],
	items: [
		{ label: "rarity", book: ["rarity"], app: ["rarity"] },
		{
			label: "itemType",
			book: ["item_type", "equipment_type", "type"],
			app: ["item_type", "equipment_type", "type"],
		},
		{ label: "damage", book: ["damage"], app: ["damage"] },
	],
	jobs: [
		{ label: "rank", book: ["rank"], app: ["rank"] },
		{
			label: "hitDice",
			book: ["hitDice", "hitDie", "hit_dice"],
			app: ["hit_dice", "hitDie"],
		},
		{
			label: "primaryAbilities",
			book: ["primary_abilities"],
			app: ["primary_abilities"],
		},
	],
	locations: [
		{
			label: "locationType",
			book: ["location_type", "type"],
			app: ["location_type", "type"],
		},
		{ label: "rank", book: ["rank"], app: ["rank"] },
	],
	pantheon: [
		{ label: "portfolio", book: ["portfolio"], app: ["portfolio"] },
		{ label: "dogma", book: ["dogma"], app: ["dogma"] },
	],
	paths: [
		{ label: "jobId", book: ["jobId", "job_id"], app: ["job_id", "jobId"] },
		{ label: "tier", book: ["tier"], app: ["path_tier", "tier"] },
	],
	powers: [
		{
			label: "level",
			book: ["level", "power_level"],
			app: ["level", "power_level"],
		},
		{ label: "rank", book: ["rank"], app: ["rank"] },
		{
			label: "powerType",
			book: ["power_type", "type"],
			app: ["power_type", "type"],
		},
	],
	regents: [
		{ label: "title", book: ["title"], app: ["regent_title", "title"] },
		{ label: "theme", book: ["theme"], app: ["regent_theme", "theme"] },
	],
	relics: [
		{ label: "rarity", book: ["rarity"], app: ["rarity"] },
		{
			label: "itemType",
			book: ["item_type", "type"],
			app: ["item_type", "type"],
		},
	],
	"rollable-tables": [
		{ label: "group", book: ["group"], app: ["table_group"] },
		{
			label: "dice",
			book: ["diceFormula", "dice"],
			app: ["dice_formula", "dice"],
		},
		{ label: "entries", book: ["entries"], app: ["rollable_entries"] },
	],
	runes: [
		{ label: "rarity", book: ["rarity"], app: ["rarity"] },
		{ label: "rank", book: ["rank"], app: ["rank"] },
		{ label: "teaches", book: ["teaches"], app: ["teaches"] },
	],
	"shadow-soldiers": [
		{ label: "rank", book: ["rank", "gate_rank"], app: ["rank", "gate_rank"] },
		{ label: "xp", book: ["xp"], app: ["xp"] },
		{
			label: "armorClass",
			book: ["armor_class", "ac"],
			app: ["armor_class", "ac"],
		},
		{
			label: "hitPoints",
			book: ["hit_points_average", "hp"],
			app: ["hit_points_average", "hp"],
		},
	],
	sigils: [{ label: "rarity", book: ["rarity"], app: ["rarity"] }],
	skills: [{ label: "ability", book: ["ability"], app: ["ability"] }],
	spells: [
		{
			label: "level",
			book: ["level", "spell_level"],
			app: ["level", "spell_level"],
		},
		{ label: "rank", book: ["rank"], app: ["rank"] },
		{ label: "school", book: ["school"], app: ["school"] },
		{
			label: "spellType",
			book: ["spell_type", "type"],
			app: ["spell_type", "type"],
		},
	],
	tattoos: [{ label: "rarity", book: ["rarity"], app: ["rarity"] }],
	techniques: [
		{ label: "level", book: ["level"], app: ["level"] },
		{ label: "rank", book: ["rank"], app: ["rank"] },
		{
			label: "techniqueType",
			book: ["technique_type", "type"],
			app: ["technique_type", "type"],
		},
	],
	vehicles: [
		{ label: "rarity", book: ["rarity"], app: ["rarity"] },
		{
			label: "vehicleType",
			book: ["vehicle_type", "type"],
			app: ["vehicle_type", "type"],
		},
	],
};

function recordId(record: CanonicalRecord): string | null {
	const value = record.id;
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

function firstValue(
	record: CanonicalRecord,
	aliases: readonly string[],
): unknown {
	for (const alias of aliases) {
		if (record[alias] !== undefined && record[alias] !== null) {
			return record[alias];
		}
	}
	return undefined;
}

function normalize(value: unknown): unknown {
	if (typeof value === "string") {
		return value.replace(/\r\n/g, "\n").trim();
	}
	if (Array.isArray(value)) return value.map(normalize);
	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value as CanonicalRecord)
				.filter(([, child]) => child !== undefined)
				.sort(([left], [right]) => left.localeCompare(right))
				.map(([key, child]) => [key, normalize(child)]),
		);
	}
	return value;
}

function stableValue(value: unknown): string {
	return JSON.stringify(normalize(value));
}

function fieldSpecs(
	category: CanonicalPublicationCategory,
): readonly FieldSpec[] {
	const stableCommonFields =
		category === "runes"
			? commonFields.filter((field) => field.label !== "description")
			: commonFields;
	return [...stableCommonFields, ...(fieldsByCategory[category] ?? [])];
}

function appProjection(
	category: CanonicalPublicationCategory,
	record: CanonicalRecord,
): CanonicalRecord {
	const projection: CanonicalRecord = { id: recordId(record) };
	for (const field of fieldSpecs(category)) {
		const value = firstValue(record, field.app);
		if (value !== undefined) projection[field.label] = normalize(value);
	}
	return projection;
}

function digest(value: unknown): string {
	return createHash("sha256").update(stableValue(value)).digest("hex");
}

function indexRecords(
	category: CanonicalPublicationCategory,
	side: "app" | "book",
	records: readonly CanonicalRecord[],
	errors: string[],
): Map<string, CanonicalRecord> {
	const result = new Map<string, CanonicalRecord>();
	for (const [index, record] of records.entries()) {
		const id = recordId(record);
		if (!id) {
			errors.push(
				`${category} ${side} record ${index} has no canonical string id.`,
			);
			continue;
		}
		if (result.has(id)) {
			errors.push(`${category} ${side} has duplicate canonical id ${id}.`);
			continue;
		}
		result.set(id, record);
	}
	return result;
}

function compareBookAndAppFields(
	category: CanonicalPublicationCategory,
	id: string,
	book: CanonicalRecord,
	app: CanonicalRecord,
	errors: string[],
): void {
	for (const field of fieldSpecs(category)) {
		const bookValue = firstValue(book, field.book);
		if (bookValue === undefined) continue;
		const appValue = firstValue(app, field.app);
		if (appValue === undefined) {
			errors.push(
				`${category}:${id} app entry is missing book field ${field.label}.`,
			);
			continue;
		}
		if (stableValue(bookValue) !== stableValue(appValue)) {
			errors.push(
				`${category}:${id} field ${field.label} differs (book=${stableValue(bookValue)}, app=${stableValue(appValue)}).`,
			);
		}
	}
}

async function buildExpectedManifest(): Promise<{
	manifest: PublicationManifest;
	errors: string[];
	counts: Record<string, number>;
}> {
	const errors: string[] = [];
	const counts: Record<string, number> = {};
	const entries: Array<[string, PublicationManifestEntry]> = [];

	for (const catalog of catalogs) {
		const appRecords = asRecords(await catalog.getAppRecords());
		const appById = indexRecords(catalog.category, "app", appRecords, errors);
		const bookById = catalog.bookRecords
			? indexRecords(
					catalog.category,
					"book",
					asRecords(catalog.bookRecords),
					errors,
				)
			: null;
		counts[catalog.category] = appById.size;

		if (bookById) {
			for (const id of bookById.keys()) {
				if (!appById.has(id)) {
					errors.push(
						`${catalog.category}:${id} is printed by books but missing from the app provider.`,
					);
				}
			}
		}

		for (const [id, appRecord] of appById) {
			const bookRecord = bookById?.get(id) ?? null;
			if (bookById && !bookRecord) {
				errors.push(
					`${catalog.category}:${id} is in the app provider but missing from the book catalog input.`,
				);
			}
			if (bookRecord) {
				compareBookAndAppFields(
					catalog.category,
					id,
					bookRecord,
					appRecord,
					errors,
				);
			}

			const nameValue = firstValue(appRecord, [
				"name",
				"display_name",
				"title",
			]);
			const canonicalName =
				typeof nameValue === "string" ? nameValue.trim() : "";
			if (!canonicalName) {
				errors.push(`${catalog.category}:${id} has no canonical app name.`);
			}
			const sourceValue = firstValue(appRecord, ["source_book", "source"]);
			const sourceBook =
				typeof sourceValue === "string" && sourceValue.trim()
					? sourceValue.trim()
					: null;
			const location = bookRecord
				? locateCanonicalSourcebookEntry(catalog.category, bookRecord)
				: null;
			const status = location
				? "published"
				: catalog.bookRecords
					? "manual-review"
					: "not-published";
			const selector = location
				? location.selector
				: catalog.bookRecords
					? "The active build selector does not place this campaign-scoped record in a verified canonical catalog section; assign only after authored review."
					: `The active eight-book build has no complete ${catalog.category} catalog; no volume or section is claimed.`;
			const key = `${catalog.category}:${id}`;
			entries.push([
				key,
				{
					canonicalId: id,
					category: catalog.category,
					canonicalName,
					sourceBook,
					fieldDigest: digest(appProjection(catalog.category, appRecord)),
					publication: {
						status,
						volume: location?.volume ?? null,
						section: location?.section ?? null,
						version: null,
						versionStatus: "manual",
						page: null,
						pageStatus: "manual",
					},
					evidence: {
						source: "books/scripts/build-books.ts",
						selector,
					},
				},
			]);
		}
	}

	entries.sort(([left], [right]) => left.localeCompare(right));
	return {
		manifest: {
			schemaVersion: 1,
			keyFormat: "category:canonicalId",
			evidencePolicy:
				"Volume and section come only from authored active build selectors. No authored edition or stable pagination exists, so every version and page is null with manual status; generated PDFs, reports, dates, and page targets are never publication evidence.",
			volumes: sourcebookVolumes.map((volume) => ({
				slug: volume.slug,
				title: volume.title,
				outputBase: volume.outputBase,
				version: null,
				versionStatus: "manual",
				sections: volume.sections,
			})),
			entries: Object.fromEntries(entries),
		},
		errors,
		counts,
	};
}

function validateManifestShape(manifest: PublicationManifest): string[] {
	const errors: string[] = [];
	if (manifest.schemaVersion !== 1) errors.push("schemaVersion must be 1.");
	if (manifest.keyFormat !== "category:canonicalId") {
		errors.push("keyFormat must be category:canonicalId.");
	}
	if (manifest.volumes.length !== 8) {
		errors.push(
			`manifest must declare exactly eight volumes, found ${manifest.volumes.length}.`,
		);
	}
	const volumeBySlug = new Map(
		manifest.volumes.map((volume) => [volume.slug, volume]),
	);
	for (const expected of sourcebookVolumes) {
		const actual = volumeBySlug.get(expected.slug);
		if (!actual) {
			errors.push(`missing manifest volume ${expected.slug}.`);
			continue;
		}
		if (actual.version !== null || actual.versionStatus !== "manual") {
			errors.push(
				`${expected.slug} version must remain null/manual until authored.`,
			);
		}
		if (stableValue(actual.sections) !== stableValue(expected.sections)) {
			errors.push(
				`${expected.slug} manifest sections drift from authored inventory.`,
			);
		}
	}

	for (const [key, entry] of Object.entries(manifest.entries)) {
		if (key !== `${entry.category}:${entry.canonicalId}`) {
			errors.push(`${key} does not match its category and canonicalId.`);
		}
		if (!entry.canonicalName.trim())
			errors.push(`${key} has no canonicalName.`);
		if (!/^[a-f0-9]{64}$/.test(entry.fieldDigest)) {
			errors.push(`${key} has an invalid fieldDigest.`);
		}
		if (
			entry.publication.version !== null ||
			entry.publication.versionStatus !== "manual"
		) {
			errors.push(`${key} version must be null/manual until authored.`);
		}
		if (
			entry.publication.page !== null ||
			entry.publication.pageStatus !== "manual"
		) {
			errors.push(
				`${key} page must be null/manual until stable pagination is authored.`,
			);
		}
		if (entry.publication.status === "published") {
			const volume = entry.publication.volume
				? volumeBySlug.get(entry.publication.volume)
				: null;
			if (!volume) {
				errors.push(`${key} published placement has an unknown volume.`);
			} else if (
				!entry.publication.section ||
				!volume.sections.includes(entry.publication.section)
			) {
				errors.push(`${key} published placement has an unknown section.`);
			}
		} else if (
			entry.publication.volume !== null ||
			entry.publication.section !== null
		) {
			errors.push(
				`${key} non-published placement must not invent volume/section values.`,
			);
		}
	}
	return errors;
}

function runShapeSelfTest(manifest: PublicationManifest): void {
	const clone = structuredClone(manifest);
	const first = Object.values(clone.entries)[0];
	if (!first)
		throw new Error("Self-test requires at least one manifest entry.");
	(first.publication as { page: number | null }).page = 1;
	if (
		!validateManifestShape(clone).some((error) =>
			error.includes("page must be null/manual"),
		)
	) {
		throw new Error("Self-test failed: invented page value was not rejected.");
	}
	console.log("PASS self-test: invented page values are rejected.");
}

async function main(): Promise<void> {
	const {
		manifest: expected,
		errors: parityErrors,
		counts,
	} = await buildExpectedManifest();
	const shapeErrors = validateManifestShape(expected);
	const errors = [...parityErrors, ...shapeErrors];
	if (selfTest) runShapeSelfTest(expected);

	if (errors.length) {
		console.error(
			`Sourcebook canon parity failed with ${errors.length} error(s):`,
		);
		for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
		if (errors.length > 100) {
			console.error(`- ... ${errors.length - 100} additional errors omitted.`);
		}
		process.exitCode = 1;
		return;
	}

	const serialized = `${JSON.stringify(expected, null, 2)}\n`;
	if (writeManifest) {
		mkdirSync(dirname(manifestPath), { recursive: true });
		writeFileSync(manifestPath, serialized, "utf8");
		console.log(`Wrote authored publication manifest: ${manifestPath}`);
	} else if (!existsSync(manifestPath)) {
		console.error(`Missing publication manifest: ${manifestPath}`);
		console.error(
			"Run with --write-manifest once, review the authored evidence diff, then commit it.",
		);
		process.exitCode = 1;
		return;
	} else {
		const actualText = readFileSync(manifestPath, "utf8");
		let actual: PublicationManifest;
		try {
			actual = JSON.parse(actualText) as PublicationManifest;
		} catch (error) {
			console.error(`Publication manifest is not valid JSON: ${String(error)}`);
			process.exitCode = 1;
			return;
		}
		const actualShapeErrors = validateManifestShape(actual);
		if (actualShapeErrors.length) {
			for (const error of actualShapeErrors) console.error(`- ${error}`);
			process.exitCode = 1;
			return;
		}
		if (actualText.replace(/\r\n/g, "\n") !== serialized) {
			console.error(
				"Publication manifest is stale. Run with --write-manifest and review the canon/publication changes.",
			);
			process.exitCode = 1;
			return;
		}
	}

	const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
	console.log(
		`PASS sourcebook canon parity: ${total} canonical entries across ${catalogs.length} app categories; eight authored volumes; all unknown versions/pages remain null/manual.`,
	);
	console.log(
		Object.entries(counts)
			.map(([category, count]) => `${category}=${count}`)
			.join(", "),
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
