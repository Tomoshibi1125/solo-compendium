export type SourcebookSlug =
	| "ascendant"
	| "warden"
	| "worldbook"
	| "awakened-arts"
	| "vaults"
	| "anomaly-manual"
	| "run-silent"
	| "glassline-claim";

export interface SourcebookVolumeDefinition {
	slug: SourcebookSlug;
	title: string;
	outputBase: string;
	minimumPageTarget: number | null;
	sections: readonly string[];
}

export const sourcebookVolumes = [
	{
		slug: "ascendant",
		title: "Rift Ascendant — Ascendant Guide",
		outputBase: "Rift Ascendant - Ascendant Guide",
		minimumPageTarget: 300,
		sections: [
			"world-lore",
			"core-mechanics",
			"quick-reference",
			"party-roles",
			"character-creation",
			"jobs",
			"paths",
			"backgrounds",
			"skills",
			"feats",
			"fighting-styles",
			"advancement",
			"sample-builds",
			"combat-example",
			"techniques",
			"powers",
			"spells",
			"runes",
			"sigils-tattoos",
			"equipment",
			"relics-artifacts",
			"vehicles",
			"conditions",
			"player-index",
		],
	},
	{
		slug: "warden",
		title: "Rift Ascendant — Warden Guide",
		outputBase: "Rift Ascendant - Warden Guide",
		minimumPageTarget: 250,
		sections: [
			"session-zero",
			"safety-tools",
			"campaign-frames",
			"warden-procedures",
			"pressure-clocks",
			"scenario-frameworks",
			"rift-hazards-domains",
			"bureau-afa-guilds",
			"adjudication-rulings",
			"aftermath-living-world",
			"downtime",
			"world-directory",
			"regents-pantheon",
			"encounter-anomaly-design",
			"warden-contract-seeds",
			"threat-rosters",
			"rewards-tables-conditions",
			"warden-appendices",
			"warden-index",
		],
	},
	{
		slug: "worldbook",
		title: "Rift Ascendant — Rift Age Worldbook",
		outputBase: "Rift Ascendant - Rift Age Worldbook",
		minimumPageTarget: null,
		sections: [
			"the-rift-age",
			"worldbook-timeline",
			"worldbook-everyday-life",
			"worldbook-essence-industry",
			"rifts-and-ecology",
			"essence-and-awakening",
			"anomalies-as-force",
			"relics-in-society",
			"factions",
			"locations",
			"domains-persistent",
			"regents",
			"pantheon",
			"in-universe-docs",
			"worldbook-campaign-seeds",
			"worldbook-index",
		],
	},
	{
		slug: "awakened-arts",
		title: "Rift Ascendant — Awakened Arts",
		outputBase: "Rift Ascendant - Awakened Arts",
		minimumPageTarget: null,
		sections: [
			"using-this-book",
			"rune-mechanics",
			"warden-guidance",
			"inscription-guide",
			"build-combos",
			"techniques-catalog",
			"powers-catalog",
			"spells-catalog",
			"runes-catalog",
			"sigils-catalog",
			"tattoos-catalog",
			"arts-app-guide",
			"arts-index",
		],
	},
	{
		slug: "vaults",
		title: "Rift Ascendant — Vaults of the Rift",
		outputBase: "Rift Ascendant - Vaults of the Rift",
		minimumPageTarget: null,
		sections: [
			"using-the-vaults",
			"gear-depth-guide",
			"expanded-runes",
			"expanded-items",
			"relics",
			"artifacts",
			"relic-campaign-notes",
			"loot-generation",
			"vehicles-mounts",
			"vault-index",
		],
	},
	{
		slug: "anomaly-manual",
		title: "Rift Ascendant — Anomaly Manual",
		outputBase: "Rift Ascendant - Anomaly Manual",
		minimumPageTarget: null,
		sections: [
			"using-the-manual",
			"anomaly-nature",
			"anomaly-scaling",
			"anomaly-catalog",
			"shadow-soldiers",
			"variant-templates",
			"noncombat-anomalies",
			"harvesting-guide",
			"anomaly-index",
		],
	},
	{
		slug: "run-silent",
		title: "Rift Ascendant - Run Silent",
		outputBase: "Rift Ascendant - Run Silent Campaign",
		minimumPageTarget: null,
		sections: [
			"front-matter",
			"material-world-opening",
			"field-systems",
			"map-does-not-end",
			"rift-ascendant-lore-alignment",
			"running-this-horror",
			"gloamreach-gazetteer",
			"major-locations",
			"pressure-quests-rewards",
			"endgame",
			"appendices-allies-factions-encounters",
			"appendices-quiet-transport-reference",
			"appendix-domain-stewardship",
		],
	},
	{
		slug: "glassline-claim",
		title: "Rift Ascendant - The Glassline Claim",
		outputBase: "Rift Ascendant - The Glassline Claim",
		minimumPageTarget: null,
		sections: [
			"warden-overview",
			"episode-and-briefing",
			"npc-and-escort-duty",
			"rules-and-scaling",
			"scenes-1-2",
			"scenes-3-4",
			"scene-5-rival-claim",
			"scene-6-glassline-seam",
			"scene-7-claim-guardian",
			"scene-8-debrief",
			"rewards",
			"handouts-and-run-sheet",
		],
	},
] as const satisfies readonly SourcebookVolumeDefinition[];

export const sourcebookVolumeBySlug = Object.fromEntries(
	sourcebookVolumes.map((volume) => [volume.slug, volume]),
) as Record<SourcebookSlug, (typeof sourcebookVolumes)[number]>;

export const activeSourcebookSlugs = sourcebookVolumes.map(
	(volume) => volume.slug,
) as SourcebookSlug[];

export const activeSourcebookOutputBases = sourcebookVolumes.map(
	(volume) => volume.outputBase,
);

export type CanonicalPublicationCategory =
	| "anomalies"
	| "artifacts"
	| "backgrounds"
	| "conditions"
	| "crafting"
	| "feats"
	| "fighting-styles"
	| "guild-base"
	| "items"
	| "jobs"
	| "locations"
	| "npcs"
	| "pantheon"
	| "paths"
	| "powers"
	| "regents"
	| "relics"
	| "rollable-tables"
	| "runes"
	| "shadow-soldiers"
	| "sigils"
	| "skills"
	| "spells"
	| "tattoos"
	| "techniques"
	| "vehicles";

export interface PublicationLocation {
	volume: SourcebookSlug;
	section: string;
	selector: string;
}

type CanonicalRecord = Record<string, unknown>;

function text(value: unknown): string {
	return value == null ? "" : String(value).trim();
}

export function isCoreSourcebookItem(entry: CanonicalRecord): boolean {
	const id = text(entry.id).toLowerCase();
	const rarity = text(entry.rarity).toLowerCase();
	return id.startsWith("base-") || rarity === "common";
}

export function isCoreSourcebookRune(entry: CanonicalRecord): boolean {
	const rank = text(entry.rank).toLowerCase();
	const rarity = text(entry.rarity).toLowerCase();
	return (
		rarity === "common" ||
		rank === "d" ||
		rank === "level 1 power" ||
		rank === "level 1 technique"
	);
}

const campaignScopedPatterns = [
	/\bRun Silent\b/i,
	/\bGloamreach\b/i,
	/\bThe Quiet\b/i,
	/\bHunt Clock\b/i,
	/\bRunning This Horror\b/i,
	/\bsandbox\b/i,
];

export function isCampaignScopedSourcebookEntry(
	entry: CanonicalRecord,
): boolean {
	const title = text(
		entry.name ?? entry.display_name ?? entry.title ?? entry.id,
	);
	if (/\b(the quiet|hollowed|caller|worn|wrong shape)\b/i.test(title)) {
		return true;
	}
	const serialized = JSON.stringify(entry);
	return campaignScopedPatterns.some((pattern) => pattern.test(serialized));
}

const fixedLocations: Partial<
	Record<CanonicalPublicationCategory, PublicationLocation>
> = {
	artifacts: {
		volume: "vaults",
		section: "artifacts",
		selector: "Complete artifacts catalog rendered by buildVaultsBook().",
	},
	backgrounds: {
		volume: "ascendant",
		section: "backgrounds",
		selector:
			"Complete allBackgrounds catalog rendered by buildAscendantBook().",
	},
	conditions: {
		volume: "ascendant",
		section: "conditions",
		selector: "Complete conditions catalog rendered by conditionsQuickRef().",
	},
	feats: {
		volume: "ascendant",
		section: "feats",
		selector:
			"Complete comprehensiveFeats catalog rendered by buildAscendantBook().",
	},
	"fighting-styles": {
		volume: "ascendant",
		section: "fighting-styles",
		selector:
			"Complete FIGHTING_STYLES catalog rendered by buildAscendantBook().",
	},
	jobs: {
		volume: "ascendant",
		section: "jobs",
		selector: "Complete jobs catalog rendered by buildAscendantBook().",
	},
	pantheon: {
		volume: "worldbook",
		section: "pantheon",
		selector:
			"Complete PRIME_PANTHEON catalog rendered by buildWorldbookBook().",
	},
	paths: {
		volume: "ascendant",
		section: "paths",
		selector: "Complete paths catalog rendered by buildAscendantBook().",
	},
	powers: {
		volume: "awakened-arts",
		section: "powers-catalog",
		selector: "Complete powers catalog rendered by buildAwakenedArtsBook().",
	},
	regents: {
		volume: "worldbook",
		section: "regents",
		selector: "Complete regents catalog rendered by buildWorldbookBook().",
	},
	relics: {
		volume: "vaults",
		section: "relics",
		selector:
			"Complete comprehensiveRelics catalog rendered by buildVaultsBook().",
	},
	"rollable-tables": {
		volume: "warden",
		section: "warden-appendices",
		selector:
			"Complete rollableTables catalog rendered by wardenFullReferenceAppendices().",
	},
	runes: {
		volume: "awakened-arts",
		section: "runes-catalog",
		selector: "Complete allRunes catalog rendered by buildAwakenedArtsBook().",
	},
	sigils: {
		volume: "awakened-arts",
		section: "sigils-catalog",
		selector: "Complete sigils catalog rendered by buildAwakenedArtsBook().",
	},
	skills: {
		volume: "ascendant",
		section: "skills",
		selector:
			"Complete comprehensiveSkills catalog rendered by buildAscendantBook().",
	},
	spells: {
		volume: "awakened-arts",
		section: "spells-catalog",
		selector: "Complete spells catalog rendered by buildAwakenedArtsBook().",
	},
	tattoos: {
		volume: "awakened-arts",
		section: "tattoos-catalog",
		selector: "Complete tattoos catalog rendered by buildAwakenedArtsBook().",
	},
	techniques: {
		volume: "awakened-arts",
		section: "techniques-catalog",
		selector:
			"Complete techniques catalog rendered by buildAwakenedArtsBook().",
	},
	vehicles: {
		volume: "vaults",
		section: "vehicles-mounts",
		selector: "Complete allVehicles catalog rendered by buildVaultsBook().",
	},
};

export function locateCanonicalSourcebookEntry(
	category: CanonicalPublicationCategory,
	entry: CanonicalRecord,
): PublicationLocation | null {
	if (category === "items") {
		return isCoreSourcebookItem(entry)
			? {
					volume: "ascendant",
					section: "equipment",
					selector:
						"coreItems(): IDs beginning base- or entries with common rarity.",
				}
			: {
					volume: "vaults",
					section: "expanded-items",
					selector:
						"vaultItems(): allItems entries not selected by coreItems().",
				};
	}
	if (category === "anomalies") {
		return isCampaignScopedSourcebookEntry(entry)
			? null
			: {
					volume: "anomaly-manual",
					section: "anomaly-catalog",
					selector:
						"generalAnomalies(): anomalies excluding authored campaign-scoped patterns.",
				};
	}
	if (category === "shadow-soldiers") {
		return isCampaignScopedSourcebookEntry(entry)
			? null
			: {
					volume: "anomaly-manual",
					section: "shadow-soldiers",
					selector:
						"generalShadowSoldiers(): shadow soldiers excluding authored campaign-scoped patterns.",
				};
	}
	if (category === "locations") {
		return isCampaignScopedSourcebookEntry(entry)
			? null
			: {
					volume: "worldbook",
					section: "locations",
					selector:
						"buildWorldbookBook() locationCatalog excluding authored campaign-scoped patterns.",
				};
	}
	return fixedLocations[category] ?? null;
}

export function assertSourcebookDefinitionMatchesInventory(definition: {
	slug: SourcebookSlug;
	title: string;
	outputBase: string;
	sections: readonly { id: string }[];
}): void {
	const expected = sourcebookVolumeBySlug[definition.slug];
	const actualSections = definition.sections.map((section) => section.id);
	const errors: string[] = [];
	if (definition.title !== expected.title) {
		errors.push(
			`title ${JSON.stringify(definition.title)} != ${JSON.stringify(expected.title)}`,
		);
	}
	if (definition.outputBase !== expected.outputBase) {
		errors.push(
			`outputBase ${JSON.stringify(definition.outputBase)} != ${JSON.stringify(expected.outputBase)}`,
		);
	}
	if (JSON.stringify(actualSections) !== JSON.stringify(expected.sections)) {
		errors.push(
			`sections ${JSON.stringify(actualSections)} != ${JSON.stringify(expected.sections)}`,
		);
	}
	if (errors.length) {
		throw new Error(
			`Sourcebook publication inventory drift for ${definition.slug}: ${errors.join("; ")}`,
		);
	}
}
