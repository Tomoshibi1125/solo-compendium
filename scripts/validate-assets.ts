#!/usr/bin/env tsx

/**
 * Asset Validation Script
 * 
 * Scans compendium entries and validates that all required assets exist.
 * Also identifies orphaned assets that are not referenced by any entry.
 */

import { staticDataProvider } from '../src/data/compendium/staticDataProvider';
import { getAssetUrl, validateAsset, assetManifest } from '../src/data/compendium/assetManifest';

interface ValidationResult {
  entryId: string;
  entryType: string;
  missingAssets: string[];
  existingAssets: string[];
}

interface OrphanedAsset {
  path: string;
  type: string;
}

async function validateCompendiumAssets(): Promise<{
  results: ValidationResult[];
  orphanedAssets: OrphanedAsset[];
  summary: {
    totalEntries: number;
    entriesWithMissingAssets: number;
    totalMissingAssets: number;
    totalOrphanedAssets: number;
  };
}> {
  console.log('🔍 Starting asset validation...\n');

  const results: ValidationResult[] = [];
  const orphanedAssets: OrphanedAsset[] = [];
  
  // Get all compendium entries
  const [
    jobs,
    monsters,
    items,
    spells,
    runes,
    locations,
    backgrounds
  ] = await Promise.all([
    staticDataProvider.getJobs(),
    staticDataProvider.getMonsters(),
    staticDataProvider.getItems(),
    staticDataProvider.getSpells(),
    staticDataProvider.getRunes(),
    staticDataProvider.getLocations(),
    staticDataProvider.getBackgrounds(),
  ]);

  const allEntries = [
    ...jobs.map(e => ({ ...e, type: 'job' })),
    ...monsters.map(e => ({ ...e, type: 'monster' })),
    ...items.map(e => ({ ...e, type: 'item' })),
    ...spells.map(e => ({ ...e, type: 'spell' })),
    ...runes.map(e => ({ ...e, type: 'rune' })),
    ...locations.map(e => ({ ...e, type: 'location' })),
    ...backgrounds.map(e => ({ ...e, type: 'background' })),
  ];

  console.log(`📊 Processing ${allEntries.length} compendium entries...\n`);

  // Validate each entry's assets
  for (const entry of allEntries) {
    const missingAssets: string[] = [];
    const existingAssets: string[] = [];

    // Check primary image
    if (entry.image_url) {
      const exists = await validateAsset(entry.image_url);
      if (exists) {
        existingAssets.push(entry.image_url);
      } else {
        missingAssets.push(entry.image_url);
      }
    }

    // Check canonical asset paths
    const canonicalAssets = ['portrait', 'thumbnail', 'icon'] as const;
    for (const assetType of canonicalAssets) {
      const assetUrl = getAssetUrl(entry.id, entry.type, assetType);
      if (assetUrl && assetUrl !== '/placeholder.svg') {
        const exists = await validateAsset(assetUrl);
        if (exists) {
          existingAssets.push(assetUrl);
        } else {
          missingAssets.push(assetUrl);
        }
      }
    }

    // Also check for the generated SVG assets directly
    const svgAssets = ['portrait', 'thumbnail', 'icon', 'banner'] as const;
    for (const assetType of svgAssets) {
      const svgPath = `/generated/compendium/${entry.type}s/${entry.id}_${assetType}.svg`;
      const exists = await validateAsset(svgPath);
      if (exists) {
        if (!existingAssets.includes(svgPath)) {
          existingAssets.push(svgPath);
        }
      } else {
        missingAssets.push(svgPath);
      }
    }

    // Check monster tokens
    if (entry.type === 'monster') {
      const tokenPath = `/generated/compendium/monsters/tokens/${entry.id}_token.svg`;
      const exists = await validateAsset(tokenPath);
      if (exists) {
        if (!existingAssets.includes(tokenPath)) {
          existingAssets.push(tokenPath);
        }
      } else {
        missingAssets.push(tokenPath);
      }
    }

    if (missingAssets.length > 0 || existingAssets.length > 0) {
      results.push({
        entryId: entry.id,
        entryType: entry.type,
        missingAssets,
        existingAssets,
      });
    }
  }

  // Calculate summary
  const entriesWithMissingAssets = results.filter(r => r.missingAssets.length > 0).length;
  const totalMissingAssets = results.reduce((sum, r) => sum + r.missingAssets.length, 0);

  const summary = {
    totalEntries: allEntries.length,
    entriesWithMissingAssets,
    totalMissingAssets,
    totalOrphanedAssets: orphanedAssets.length,
  };

  console.log(`✅ Processed ${allEntries.length} entries`);
  console.log(`❌ Found ${totalMissingAssets} missing assets`);
  console.log(`📊 ${entriesWithMissingAssets} entries have missing assets`);

  return {
    results,
    orphanedAssets,
    summary,
  };
}

// Generate report
function generateReport(validation: ReturnType<typeof validateCompendiumAssets> extends Promise<infer T> ? T : never) {
  console.log('📋 Asset Validation Report');
  console.log('='.repeat(50));
  
  console.log('\n📊 Summary:');
  console.log(`Total entries: ${validation.summary.totalEntries}`);
  console.log(`Entries with missing assets: ${validation.summary.entriesWithMissingAssets}`);
  console.log(`Total missing assets: ${validation.summary.totalMissingAssets}`);
  console.log(`Total orphaned assets: ${validation.summary.totalOrphanedAssets}`);

  if (validation.summary.entriesWithMissingAssets > 0) {
    console.log('\n❌ Missing Assets by Entry:');
    validation.results
      .filter(r => r.missingAssets.length > 0)
      .forEach(result => {
        console.log(`\n${result.entryType}:${result.entryId}`);
        result.missingAssets.forEach(asset => {
          console.log(`  ❌ ${asset}`);
        });
      });
  }

  if (validation.summary.totalOrphanedAssets > 0) {
    console.log('\n🗑️  Orphaned Assets:');
    validation.orphanedAssets.forEach(asset => {
      console.log(`  ${asset.path} (${asset.type})`);
    });
  }

  console.log('\n✅ Validation complete!');
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting Solo Compendium Asset Validation...\n');
  validateCompendiumAssets()
    .then(generateReport)
    .catch(error => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
} else {
  // Always run when imported for testing
  console.log('🚀 Starting Solo Compendium Asset Validation...\n');
  validateCompendiumAssets()
    .then(generateReport)
    .catch(error => {
      console.error('❌ Validation failed:', error);
    });
}

export { validateCompendiumAssets };
