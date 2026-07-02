/**
 * Canonical Asset Mapping Order
 *
 * Provides deterministic URL generation for compendium entry assets.
 * Zero-import: generates paths from ID + type without loading any compendium data.
 * This keeps the initial bundle small — compendium data is only loaded on-demand.
 */

// Base asset paths
const ASSET_BASE_PATH = "/generated/compendium";

// Default fallback assets
const DEFAULT_FALLBACKS = {
	portrait: "/ui-art/shadow-silhouette.webp",
	thumbnail: "/ui-art/shadow-soldier-emblem.webp",
	icon: "/ui-art/shadow-soldier-emblem.webp",
	banner: "/ui-art/gate-portal-3d.webp",
	token: "/ui-art/shadow-soldier-emblem.webp",
};

// Type â†’ folder mapping
const TYPE_FOLDER_MAP: Record<string, string> = {
	Anomaly: "Anomalies",
	Anomalies: "Anomalies",
	item: "items",
	items: "items",
	spell: "spells",
	spells: "spells",
	job: "jobs",
	jobs: "jobs",
	location: "locations",
	locations: "locations",
	rune: "runes",
	runes: "runes",
	background: "backgrounds",
	backgrounds: "backgrounds",
	technique: "techniques",
	techniques: "techniques",
	artifact: "artifacts",
	artifacts: "artifacts",
	power: "powers",
	powers: "powers",
	regent: "regents",
	regents: "regents",
};

/**
 * Get asset URL deterministically from entry ID and type.
 * No data loading required — pure path generation.
 */
export function getAssetUrl(
	entryId: string,
	entryType: string,
	_assetType?: keyof AssetMapping["assets"],
): string {
	const folder = TYPE_FOLDER_MAP[entryType];
	if (folder) {
		return `${ASSET_BASE_PATH}/${folder}/${entryId}.webp`;
	}
	return DEFAULT_FALLBACKS.portrait;
}

export interface AssetMapping {
	id: string;
	type: string;
	assets: {
		portrait?: string;
		thumbnail?: string;
		banner?: string;
		icon?: string;
		token?: string;
	};
	fallbacks: {
		portrait: string;
		thumbnail: string;
		icon: string;
		banner?: string;
		token?: string;
	};
}
