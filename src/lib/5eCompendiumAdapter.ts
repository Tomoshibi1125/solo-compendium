/**
 * 5e Compendium Adapter with System Ascendant Flavor
 * Converts existing compendium data to use 5e mechanics while preserving homebrew content
 */

import type { AbilityScore, Job, Power, Relic } from './5eRulesEngine';
import { normalizeAbility, getAbilityDisplayName } from './5eRulesEngine';

// Adapter functions to convert System Ascendant compendium data to 5e standard

export function adaptJobTo5e(systemJob: any): Job {
  return {
    id: systemJob.id,
    name: systemJob.name,
    displayName: systemJob.name, // Keep System Ascendant name for display
    description: systemJob.description,
    primaryAbility: adaptAbilityArray(systemJob.primaryAbility || systemJob.primary_abilities),
    secondaryAbility: systemJob.secondaryAbility ? adaptAbilityArray(systemJob.secondaryAbility) : undefined,
    hitDie: parseInt(systemJob.hitDie?.replace('d', '') || '8'),
    proficiencies: {
      armor: systemJob.armorProficiencies || [],
      weapons: systemJob.weaponProficiencies || [],
      tools: systemJob.toolProficiencies || [],
      savingThrows: adaptAbilityArray(systemJob.savingThrows || []),
      skills: systemJob.skillChoices ? {
        choose: systemJob.skillChoices.choose || 2,
        from: systemJob.skillChoices.from || []
      } : { choose: 0, from: [] }
    },
    features: adaptFeaturesTo5e(systemJob.features || []),
    paths: adaptPathsTo5e(systemJob.paths || []),
    // System Ascendant specific
    systemRank: systemJob.rank || 'C',
    awakeningFeatures: systemJob.awakeningFeatures || []
  };
}

function adaptAbilityArray(abilities: string[]): AbilityScore[] {
  return abilities.map(ability => normalizeAbility(ability)).filter(Boolean) as AbilityScore[];
}

function adaptFeaturesTo5e(systemFeatures: any[]): any[] {
  return systemFeatures.map(feature => ({
    id: feature.id,
    name: feature.name,
    level: feature.level,
    description: feature.description,
    actionType: feature.actionType,
    uses: feature.uses,
    prerequisites: feature.prerequisites
  }));
}

function adaptPathsTo5e(systemPaths: any[]): any[] {
  return systemPaths.map(path => ({
    id: path.id,
    name: path.name,
    jobId: path.jobId,
    description: path.description,
    features: adaptFeaturesTo5e(path.features || []),
    // System Ascendant specific
    tier: path.tier,
    systemType: path.pathType
  }));
}

export function adaptPowerTo5e(systemPower: any): Power {
  return {
    id: systemPower.id,
    name: systemPower.name,
    level: adaptRankToLevel(systemPower.rank),
    school: adaptPowerTypeToSchool(systemPower.type),
    castingTime: '1 action', // Default, would be adapted from cooldown
    range: systemPower.range ? `${systemPower.range} feet` : 'Self',
    duration: 'Instantaneous', // Default, would be adapted from effect
    components: 'V, S', // Default as string
    concentration: false, // Default, would be adapted from effect
    description: systemPower.description || systemPower.effect,
    higherLevels: systemPower.higherLevels,
    classes: [adaptPowerToClasses(systemPower)[0] || 'Mage'], // Take first class for simplicity
    // System Ascendant specific
    rank: systemPower.rank,
    systemType: systemPower.type
  };
}

function adaptRankToLevel(rank: string): number {
  const rankMap: Record<string, number> = {
    'D': 1,
    'C': 2,
    'B': 3,
    'A': 4,
    'S': 5
  };
  return rankMap[rank] || 1;
}

function adaptPowerTypeToSchool(type: string): string {
  const typeMap: Record<string, string> = {
    'Attack': 'Evocation',
    'Defense': 'Abjuration',
    'Utility': 'Transmutation',
    'Healing': 'Conjuration'
  };
  return typeMap[type] || 'Universal';
}

function adaptPowerToClasses(systemPower: any): string[] {
  // This would need to be adapted based on the power's intended classes
  // For now, return a default array
  return ['Mage'];
}

export function adaptRelicTo5e(systemRelic: any): Relic {
  return {
    id: systemRelic.id,
    name: systemRelic.name,
    rarity: adaptRarity(systemRelic.rarity),
    type: systemRelic.type,
    attunement: systemRelic.attunement || false,
    attunementRequirements: systemRelic.attunementRequirements,
    description: systemRelic.description,
    properties: systemRelic.properties || [],
    // System Ascendant specific
    systemTier: systemRelic.tier,
    quirks: systemRelic.quirks,
    corruptionRisk: systemRelic.corruptionRisk,
    systemTags: systemRelic.tags
  };
}

function adaptRarity(rarity: string): any {
  const rarityMap: Record<string, any> = {
    'uncommon': 'uncommon',
    'rare': 'rare',
    'very_rare': 'very-rare',
    'epic': 'very-rare',
    'legendary': 'legendary',
    'mythic': 'legendary'
  };
  return rarityMap[rarity] || 'common';
}

// Validation functions for compendium data
export function validateCompendiumData(data: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate jobs
  if (data.jobs) {
    data.jobs.forEach((job: any, index: number) => {
      if (!job.id) errors.push(`Job ${index}: Missing id`);
      if (!job.name) errors.push(`Job ${index}: Missing name`);
      if (!job.description) errors.push(`Job ${index}: Missing description`);
      if (!job.hitDie) warnings.push(`Job ${index}: Missing hit die`);
      if (!job.primaryAbility && !job.primary_abilities) warnings.push(`Job ${index}: Missing primary ability`);
    });
  }

  // Validate powers
  if (data.powers) {
    data.powers.forEach((power: any, index: number) => {
      if (!power.id) errors.push(`Power ${index}: Missing id`);
      if (!power.name) errors.push(`Power ${index}: Missing name`);
      if (!power.description && !power.effect) errors.push(`Power ${index}: Missing description`);
      if (!power.rank) warnings.push(`Power ${index}: Missing rank`);
    });
  }

  // Validate relics
  if (data.relics) {
    data.relics.forEach((relic: any, index: number) => {
      if (!relic.id) errors.push(`Relic ${index}: Missing id`);
      if (!relic.name) errors.push(`Relic ${index}: Missing name`);
      if (!relic.description) errors.push(`Relic ${index}: Missing description`);
      if (!relic.type) warnings.push(`Relic ${index}: Missing type`);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Migration functions to update existing data
export function migrateCompendiumTo5e(compendiumData: any): any {
  const migrated = { ...compendiumData };

  if (migrated.jobs) {
    migrated.jobs = migrated.jobs.map(adaptJobTo5e);
  }

  if (migrated.powers) {
    migrated.powers = migrated.powers.map(adaptPowerTo5e);
  }

  if (migrated.relics) {
    migrated.relics = migrated.relics.map(adaptRelicTo5e);
  }

  return migrated;
}

// Helper functions for UI display
export function formatCompendiumEntry(entry: any, type: 'job' | 'power' | 'relic'): string {
  switch (type) {
    case 'job':
      return `${entry.name} - ${entry.description}\nPrimary: ${entry.primaryAbility?.join(', ') || 'None'}\nHit Die: d${entry.hitDie}`;
    case 'power':
      return `${entry.name} - Level ${entry.level} ${entry.school || ''}\n${entry.description}`;
    case 'relic':
      return `${entry.name} - ${entry.rarity} ${entry.type}\n${entry.description}`;
    default:
      return entry.name || 'Unknown';
  }
}

// Search and filter functions
export function searchCompendium(compendium: any, query: string, type?: string): any[] {
  const results: any[] = [];
  const lowerQuery = query.toLowerCase();

  if (!type || type === 'jobs') {
    (compendium.jobs || []).forEach((job: any) => {
      if (job.name.toLowerCase().includes(lowerQuery) ||
          job.description.toLowerCase().includes(lowerQuery)) {
        results.push({ ...job, type: 'job' });
      }
    });
  }

  if (!type || type === 'powers') {
    (compendium.powers || []).forEach((power: any) => {
      if (power.name.toLowerCase().includes(lowerQuery) ||
          power.description.toLowerCase().includes(lowerQuery) ||
          power.effect?.toLowerCase().includes(lowerQuery)) {
        results.push({ ...power, type: 'power' });
      }
    });
  }

  if (!type || type === 'relics') {
    (compendium.relics || []).forEach((relic: any) => {
      if (relic.name.toLowerCase().includes(lowerQuery) ||
          relic.description.toLowerCase().includes(lowerQuery)) {
        results.push({ ...relic, type: 'relic' });
      }
    });
  }

  return results;
}

// Export all adapter functions
export const CompendiumAdapter = {
  adaptJob: adaptJobTo5e,
  adaptPower: adaptPowerTo5e,
  adaptRelic: adaptRelicTo5e,
  validate: validateCompendiumData,
  migrate: migrateCompendiumTo5e,
  format: formatCompendiumEntry,
  search: searchCompendium
};
