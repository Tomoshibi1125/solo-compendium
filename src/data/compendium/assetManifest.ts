/**
 * Canonical Asset Mapping System
 *
 * Provides deterministic URL generation for compendium entry assets.
 * Zero-import: generates paths from ID + type without loading any compendium data.
 * This keeps the initial bundle small — compendium data is only loaded on-demand.
 */

// Base asset paths
const ASSET_BASE_PATH = '/generated/compendium';

// Default fallback assets
const DEFAULT_FALLBACKS = {
  portrait: '/ui-art/shadow-silhouette.webp',
  thumbnail: '/ui-art/shadow-soldier-emblem.webp',
  icon: '/ui-art/shadow-soldier-emblem.webp',
  banner: '/ui-art/gate-portal-3d.webp',
  token: '/ui-art/shadow-soldier-emblem.webp',
};

// Type → folder mapping
const TYPE_FOLDER_MAP: Record<string, string> = {
  monster: 'monsters',
  monsters: 'monsters',
  item: 'items',
  items: 'items',
  spell: 'spells',
  spells: 'spells',
  job: 'jobs',
  jobs: 'jobs',
  location: 'locations',
  locations: 'locations',
  rune: 'runes',
  runes: 'runes',
  background: 'backgrounds',
  backgrounds: 'backgrounds',
  technique: 'techniques',
  techniques: 'techniques',
  artifact: 'artifacts',
  artifacts: 'artifacts',
  power: 'powers',
  powers: 'powers',
  monarch: 'monarchs',
  monarchs: 'monarchs',
  regent: 'monarchs',
  regents: 'monarchs',
};

/**
 * Get asset URL deterministically from entry ID and type.
 * No data loading required — pure path generation.
 */
export function getAssetUrl(
  entryId: string,
  entryType: string,
  _assetType?: keyof AssetMapping['assets']
): string {
  const folder = TYPE_FOLDER_MAP[entryType];
  if (folder) {
    return `${ASSET_BASE_PATH}/${folder}/${entryId}.webp`;
  }
  return DEFAULT_FALLBACKS.portrait;
}

/**
 * Get fallback asset URL for a given asset type.
 */
export function getFallbackUrl(assetType: keyof typeof DEFAULT_FALLBACKS): string {
  return DEFAULT_FALLBACKS[assetType] || DEFAULT_FALLBACKS.portrait;
}

// Validate asset exists (client-side check)
export async function validateAsset(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Lightweight manifest stub for backward compatibility
export interface AssetManifest {
  mappings: Record<string, AssetMapping>;
  globalFallbacks: {
    portrait: string;
    thumbnail: string;
    icon: string;
    banner: string;
    token?: string;
  };
  statistics: {
    totalMappings: number;
    mappingsWithAssets: number;
    missingAssets: string[];
  };
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

export const assetManifest: AssetManifest = {
  mappings: {},
  globalFallbacks: DEFAULT_FALLBACKS,
  statistics: { totalMappings: 0, mappingsWithAssets: 0, missingAssets: [] },
};

// Legacy compatibility
export function createAssetManifest(): AssetManifest {
  return assetManifest;
}
