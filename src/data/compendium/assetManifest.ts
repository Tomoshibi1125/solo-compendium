/**
 * Canonical Asset Mapping System
 * 
 * Provides deterministic mapping between compendium entries and their assets.
 * Includes fallback handling and asset validation.
 */

import comprehensiveAssetIndex from '@/data/comprehensive-asset-index';

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
  };
}

export interface AssetManifest {
  mappings: Record<string, AssetMapping>;
  globalFallbacks: {
    portrait: string;
    thumbnail: string;
    icon: string;
    banner: string;
  };
  statistics: {
    totalMappings: number;
    mappingsWithAssets: number;
    missingAssets: string[];
  };
}

// Base asset paths
const ASSET_BASE_PATH = '/generated/compendium';
const UI_ASSET_BASE_PATH = '/generated/ui';

// Default fallback assets (using placeholder.svg for now)
const DEFAULT_FALLBACKS = {
  portrait: '/placeholder.svg',
  thumbnail: '/placeholder.svg',
  icon: '/placeholder.svg',
  banner: '/placeholder.svg',
};

// Generate deterministic asset paths
function generateAssetPaths(id: string, type: string): AssetMapping['assets'] {
  const basePath = `${ASSET_BASE_PATH}/${type}s`;
  
  return {
    portrait: `${basePath}/${id}_portrait.svg`,
    thumbnail: `${basePath}/${id}_thumbnail.svg`,
    banner: `${basePath}/${id}_banner.svg`,
    icon: `${basePath}/${id}_icon.svg`,
    token: type === 'monster' ? `${basePath}/tokens/${id}_token.svg` : undefined,
  };
}

// Create the manifest
export function createAssetManifest(): AssetManifest {
  const mappings: Record<string, AssetMapping> = {};
  let mappingsWithAssets = 0;
  const missingAssets: string[] = [];

  // TODO: Process all compendium entries and create mappings
  // For now, create a basic structure
  
  return {
    mappings,
    globalFallbacks: DEFAULT_FALLBACKS,
    statistics: {
      totalMappings: Object.keys(mappings).length,
      mappingsWithAssets,
      missingAssets,
    },
  };
}

// Get asset URL with fallback
export function getAssetUrl(
  entryId: string, 
  entryType: string, 
  assetType: keyof AssetMapping['assets']
): string {
  const manifest = createAssetManifest();
  const mapping = manifest.mappings[entryId];
  
  if (mapping?.assets[assetType]) {
    return mapping.assets[assetType];
  }
  
  // Use type-specific fallback
  return mapping?.fallbacks[assetType] || manifest.globalFallbacks[assetType];
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
  const manifest = createAssetManifest();
  const missing: string[] = [];
  
  for (const [entryId, mapping] of Object.entries(manifest.mappings)) {
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
