/**
 * Canonical Asset Mapping System
 *
 * Provides deterministic mapping between compendium entries and their assets.
 * Includes fallback handling and asset validation.
 */

import { backgrounds } from '@/data/compendium/backgrounds';
import { items } from '@/data/compendium/items';
import { jobs } from '@/data/compendium/jobs';
import { locations } from '@/data/compendium/locations';
import { monsters } from '@/data/compendium/monsters';
import { runes } from '@/data/compendium/runes';
import { spells } from '@/data/compendium/spells';

export interface AssetMapping {
  id: string;
  type: 'monster' | 'item' | 'spell' | 'job' | 'location' | 'rune' | 'background';
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

// Base asset paths
const ASSET_BASE_PATH = '/generated/compendium';
const UI_ASSET_BASE_PATH = '/ui';

// Default fallback assets
const DEFAULT_FALLBACKS = {
  portrait: '/ui-art/shadow-silhouette.webp',
  thumbnail: '/ui-art/shadow-soldier-emblem.webp',
  icon: '/ui-art/shadow-soldier-emblem.webp',
  banner: '/ui-art/gate-portal-3d.webp',
  token: '/ui-art/shadow-soldier-emblem.webp',
};

// Generate deterministic asset paths
function generateAssetPaths(id: string, type: string): AssetMapping['assets'] {
  const basePath = `${ASSET_BASE_PATH}/${type}s`;
  
  return {
    portrait: `${basePath}/${id}_portrait.webp`,
    thumbnail: `${basePath}/${id}_thumbnail.webp`,
    banner: `${basePath}/${id}_banner.webp`,
    icon: `${basePath}/${id}_icon.webp`,
    token: type === 'monster' ? `${basePath}/tokens/${id}_token.webp` : undefined,
  };
}

// Create the manifest
function addMappings<T extends { id: string }>(
  mappings: Record<string, AssetMapping>,
  entries: T[],
  type: AssetMapping['type']
) {
  for (const entry of entries) {
    mappings[entry.id] = {
      id: entry.id,
      type,
      assets: generateAssetPaths(entry.id, type),
      fallbacks: {
        portrait: DEFAULT_FALLBACKS.portrait,
        thumbnail: DEFAULT_FALLBACKS.thumbnail,
        icon: DEFAULT_FALLBACKS.icon,
        banner: DEFAULT_FALLBACKS.banner,
        token: DEFAULT_FALLBACKS.token,
      },
    };
  }
}

export function createAssetManifest(): AssetManifest {
  const mappings: Record<string, AssetMapping> = {};

  addMappings(mappings, monsters, 'monster');
  addMappings(mappings, items, 'item');
  addMappings(mappings, spells, 'spell');
  addMappings(mappings, jobs, 'job');
  addMappings(mappings, locations, 'location');
  addMappings(mappings, runes, 'rune');
  addMappings(mappings, backgrounds, 'background');

  const totalMappings = Object.keys(mappings).length;

  return {
    mappings,
    globalFallbacks: DEFAULT_FALLBACKS,
    statistics: {
      totalMappings,
      mappingsWithAssets: totalMappings,
      missingAssets: [],
    },
  };
}

// Get asset URL with fallback
export function getAssetUrl(
  entryId: string, 
  entryType: string, 
  assetType: keyof AssetMapping['assets']
): string {
  const mapping = assetManifest.mappings[entryId];
  
  if (mapping?.assets[assetType]) {
    return mapping.assets[assetType];
  }
  
  // Use type-specific fallback
  return mapping?.fallbacks[assetType] || assetManifest.globalFallbacks[assetType as keyof typeof assetManifest.globalFallbacks] || assetManifest.globalFallbacks.portrait;
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

// Get all missing assets for development
export async function getMissingAssets(): Promise<string[]> {
  const missing: string[] = [];
  
  for (const [entryId, mapping] of Object.entries(assetManifest.mappings)) {
    for (const [assetType, assetUrl] of Object.entries(mapping.assets)) {
      if (assetUrl && !(await validateAsset(assetUrl))) {
        missing.push(`${entryId}:${assetType}`);
      }
    }
  }
  
  return missing;
}

// Export singleton instance
export const assetManifest = createAssetManifest();
