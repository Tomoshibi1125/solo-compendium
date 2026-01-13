#!/usr/bin/env tsx

/**
 * Complete Coverage Verification
 * 
 * Verifies that ALL compendium entries have ALL required assets.
 * No fallbacks, no missing assets - 100% coverage requirement.
 */

import fs from 'fs';
import path from 'path';
import { staticDataProvider } from '../src/data/compendium/staticDataProvider';

interface CoverageResult {
  entryId: string;
  entryType: string;
  entryName: string;
  requiredAssets: string[];
  existingAssets: string[];
  missingAssets: string[];
  coverage: number;
}

async function verifyCompleteCoverage(): Promise<{
  totalEntries: number;
  perfectCoverage: number;
  partialCoverage: number;
  zeroCoverage: number;
  results: CoverageResult[];
  summary: {
    totalRequiredAssets: number;
    totalExistingAssets: number;
    totalMissingAssets: number;
    coveragePercentage: number;
  };
}> {
  console.log('🔍 Verifying Complete Asset Coverage...\n');

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

  console.log(`📊 Checking ${allEntries.length} entries for complete coverage...\n`);

  const publicDir = path.join(process.cwd(), 'public');
  const results: CoverageResult[] = [];
  let totalRequiredAssets = 0;
  let totalExistingAssets = 0;
  let totalMissingAssets = 0;

  for (const entry of allEntries) {
    const requiredAssets: string[] = [];
    const existingAssets: string[] = [];
    const missingAssets: string[] = [];

    // Define required assets for this entry type
    const assetTypes = ['portrait', 'thumbnail', 'icon', 'banner'] as const;
    
    for (const assetType of assetTypes) {
      // Check for SVG version (generated)
      const svgPath = path.join(publicDir, 'generated', 'compendium', `${entry.type}s`, `${entry.id}_${assetType}.svg`);
      requiredAssets.push(`/generated/compendium/${entry.type}s/${entry.id}_${assetType}.svg`);
      
      if (fs.existsSync(svgPath)) {
        existingAssets.push(`/generated/compendium/${entry.type}s/${entry.id}_${assetType}.svg`);
      } else {
        missingAssets.push(`/generated/compendium/${entry.type}s/${entry.id}_${assetType}.svg`);
      }

      // Also check for original JPG if it exists
      const jpgPath = path.join(publicDir, 'generated', 'compendium', `${entry.type}s`, `${entry.id}.jpg`);
      if (fs.existsSync(jpgPath)) {
        if (!existingAssets.includes(`/generated/compendium/${entry.type}s/${entry.id}.jpg`)) {
          existingAssets.push(`/generated/compendium/${entry.type}s/${entry.id}.jpg`);
        }
      }
    }

    // Check monster tokens
    if (entry.type === 'monster') {
      const tokenPath = path.join(publicDir, 'generated', 'compendium', 'monsters', 'tokens', `${entry.id}_token.svg`);
      requiredAssets.push(`/generated/compendium/monsters/tokens/${entry.id}_token.svg`);
      
      if (fs.existsSync(tokenPath)) {
        existingAssets.push(`/generated/compendium/monsters/tokens/${entry.id}_token.svg`);
      } else {
        missingAssets.push(`/generated/compendium/monsters/tokens/${entry.id}_token.svg`);
      }
    }

    const coverage = requiredAssets.length > 0 ? (existingAssets.length / requiredAssets.length) * 100 : 0;

    results.push({
      entryId: entry.id,
      entryType: entry.type,
      entryName: entry.name,
      requiredAssets,
      existingAssets,
      missingAssets,
      coverage
    });

    totalRequiredAssets += requiredAssets.length;
    totalExistingAssets += existingAssets.length;
    totalMissingAssets += missingAssets.length;
  }

  // Calculate summary statistics
  const perfectCoverage = results.filter(r => r.coverage === 100).length;
  const partialCoverage = results.filter(r => r.coverage > 0 && r.coverage < 100).length;
  const zeroCoverage = results.filter(r => r.coverage === 0).length;
  const overallCoverage = totalRequiredAssets > 0 ? (totalExistingAssets / totalRequiredAssets) * 100 : 0;

  return {
    totalEntries: allEntries.length,
    perfectCoverage,
    partialCoverage,
    zeroCoverage,
    results,
    summary: {
      totalRequiredAssets,
      totalExistingAssets,
      totalMissingAssets,
      coveragePercentage: overallCoverage
    }
  };
}

function generateCoverageReport(verification: Awaited<ReturnType<typeof verifyCompleteCoverage>>): void {
  console.log('📋 Complete Coverage Verification Report');
  console.log('='.repeat(60));
  
  console.log('\n📊 Overall Summary:');
  console.log(`Total Entries: ${verification.totalEntries}`);
  console.log(`Perfect Coverage (100%): ${verification.perfectCoverage}`);
  console.log(`Partial Coverage: ${verification.partialCoverage}`);
  console.log(`Zero Coverage: ${verification.zeroCoverage}`);
  
  console.log('\n🎯 Asset Coverage:');
  console.log(`Required Assets: ${verification.summary.totalRequiredAssets}`);
  console.log(`Existing Assets: ${verification.summary.totalExistingAssets}`);
  console.log(`Missing Assets: ${verification.summary.totalMissingAssets}`);
  console.log(`Coverage Percentage: ${verification.summary.coveragePercentage.toFixed(2)}%`);

  if (verification.perfectCoverage === verification.totalEntries && verification.summary.totalMissingAssets === 0) {
    console.log('\n🎉 SUCCESS: Complete asset coverage achieved!');
    console.log('✅ Every compendium entry has all required assets');
    console.log('✅ Zero missing assets across all categories');
  } else {
    console.log('\n❌ INCOMPLETE: Missing assets detected');
    
    if (verification.zeroCoverage > 0) {
      console.log(`\n🚨 Entries with ZERO coverage (${verification.zeroCoverage}):`);
      verification.results
        .filter(r => r.coverage === 0)
        .forEach(result => {
          console.log(`  ${result.entryType}:${result.entryId} - ${result.entryName}`);
        });
    }

    if (verification.partialCoverage > 0) {
      console.log(`\n⚠️  Entries with partial coverage (${verification.partialCoverage}):`);
      verification.results
        .filter(r => r.coverage > 0 && r.coverage < 100)
        .forEach(result => {
          console.log(`  ${result.entryType}:${result.entryId} - ${result.coverage.toFixed(1)}% (${result.missingAssets.length} missing)`);
        });
    }

    console.log(`\n📋 All missing assets (${verification.summary.totalMissingAssets}):`);
    verification.results
      .filter(r => r.missingAssets.length > 0)
      .forEach(result => {
        console.log(`\n${result.entryType}:${result.entryId} (${result.entryName})`);
        result.missingAssets.forEach(asset => {
          console.log(`  ❌ ${asset}`);
        });
      });
  }

  console.log('\n✅ Verification complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting Complete Coverage Verification...\n');
  verifyCompleteCoverage()
    .then(generateCoverageReport)
    .catch(error => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
} else {
  // Always run when imported for testing
  console.log('🚀 Starting Complete Coverage Verification...\n');
  verifyCompleteCoverage()
    .then(generateCoverageReport)
    .catch(error => {
      console.error('❌ Verification failed:', error);
    });
}

export { verifyCompleteCoverage };
