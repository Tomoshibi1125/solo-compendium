/**
 * Comprehensive choice calculation utilities for character creation
 * Handles additional grants from awakening features, traits, paths, regents, etc.
 */

export interface ChoiceGrant {
  type: 'skills' | 'feats' | 'spells' | 'powers' | 'techniques' | 'runes' | 'items' | 'tools' | 'languages' | 'expertise';
  count: number;
  source: string;
  description: string;
}

export interface TotalChoices {
  skills: number;
  feats: number;
  spells: number;
  powers: number;
  techniques: number;
  runes: number;
  items: number;
  tools: number;
  languages: number;
  expertise: number;
}

/**
 * Parse a description for choice grants using comprehensive pattern matching
 */
export function parseChoiceGrants(
  description: string,
  source: string
): ChoiceGrant[] {
  const grants: ChoiceGrant[] = [];
  const desc = description.toLowerCase();

  // Skill proficiency patterns
  const skillPatterns = [
    /gain\s+proficiency\s+in\s+(\d+)\s+additional\s+skills?/i,
    /gain\s+(\d+)\s+additional\s+skill\s+proficiencies?/i,
    /proficient\s+in\s+(\d+)\s+additional\s+skills?/i,
    /learn\s+(\d+)\s+additional\s+skills?/i,
    /choose\s+(\d+)\s+additional\s+skills?/i,
    /select\s+(\d+)\s+additional\s+skills?/i
  ];

  for (const pattern of skillPatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'skills',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  // Feat patterns
  const featPatterns = [
    /gain\s+(\d+)\s+additional\s+feats?/i,
    /learn\s+(\d+)\s+additional\s+feats?/i,
    /choose\s+(\d+)\s+additional\s+feats?/i,
    /select\s+(\d+)\s+additional\s+feats?/i,
    /gain\s+(\d+)\s+feat(s)?\s+of\s+your\s+choice/i
  ];

  for (const pattern of featPatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'feats',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  // Spell patterns
  const spellPatterns = [
    /learn\s+(\d+)\s+additional\s+spells?/i,
    /gain\s+(\d+)\s+additional\s+spells?/i,
    /know\s+(\d+)\s+additional\s+spells?/i,
    /choose\s+(\d+)\s+additional\s+spells?/i,
    /select\s+(\d+)\s+additional\s+spells?/i,
    /add\s+(\d+)\s+spells?\s+to\s+your\s+spellbook/i
  ];

  for (const pattern of spellPatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'spells',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  // Power patterns
  const powerPatterns = [
    /gain\s+(\d+)\s+additional\s+powers?/i,
    /learn\s+(\d+)\s+additional\s+powers?/i,
    /choose\s+(\d+)\s+additional\s+powers?/i,
    /select\s+(\d+)\s+additional\s+powers?/i,
    /unlock\s+(\d+)\s+additional\s+powers?/i
  ];

  for (const pattern of powerPatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'powers',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  // Technique patterns
  const techniquePatterns = [
    /learn\s+(\d+)\s+additional\s+techniques?/i,
    /gain\s+(\d+)\s+additional\s+techniques?/i,
    /master\s+(\d+)\s+additional\s+techniques?/i,
    /choose\s+(\d+)\s+additional\s+techniques?/i,
    /select\s+(\d+)\s+additional\s+techniques?/i
  ];

  for (const pattern of techniquePatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'techniques',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  // Rune patterns
  const runePatterns = [
    /learn\s+(\d+)\s+additional\s+runes?/i,
    /gain\s+(\d+)\s+additional\s+runes?/i,
    /discover\s+(\d+)\s+additional\s+runes?/i,
    /choose\s+(\d+)\s+additional\s+runes?/i,
    /select\s+(\d+)\s+additional\s+runes?/i,
    /absorb\s+(\d+)\s+additional\s+runes?/i
  ];

  for (const pattern of runePatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'runes',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  // Item patterns
  const itemPatterns = [
    /gain\s+(\d+)\s+additional\s+items?/i,
    /receive\s+(\d+)\s+additional\s+items?/i,
    /choose\s+(\d+)\s+additional\s+items?/i,
    /select\s+(\d+)\s+additional\s+items?/i,
    /craft\s+(\d+)\s+additional\s+items?/i
  ];

  for (const pattern of itemPatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'items',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  // Tool patterns
  const toolPatterns = [
    /gain\s+proficiency\s+in\s+(\d+)\s+additional\s+tools?/i,
    /become\s+proficient\s+with\s+(\d+)\s+additional\s+tools?/i,
    /learn\s+to\s+use\s+(\d+)\s+additional\s+tools?/i,
    /choose\s+(\d+)\s+additional\s+tool\s+proficiencies?/i
  ];

  for (const pattern of toolPatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'tools',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  // Language patterns
  const languagePatterns = [
    /learn\s+(\d+)\s+additional\s+languages?/i,
    /speak\s+(\d+)\s+additional\s+languages?/i,
    /know\s+(\d+)\s+additional\s+languages?/i,
    /choose\s+(\d+)\s+additional\s+languages?/i,
    /select\s+(\d+)\s+additional\s+languages?/i
  ];

  for (const pattern of languagePatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'languages',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  // Expertise patterns (double proficiency)
  const expertisePatterns = [
    /double\s+proficiency\s+on\s+(\d+)\s+chosen\s+skill\s+proficiencies?/i,
    /gain\s+expertise\s+in\s+(\d+)\s+skills?/i,
    /choose\s+(\d+)\s+skills?\s+to\s+gain\s+expertise\s+in/i,
    /select\s+(\d+)\s+skills?\s+for\s+expertise/i
  ];

  for (const pattern of expertisePatterns) {
    const match = desc.match(pattern);
    if (match) {
      grants.push({
        type: 'expertise',
        count: parseInt(match[1], 10),
        source,
        description: description.substring(0, 100) + '...'
      });
      break;
    }
  }

  return grants;
}

/**
 * Calculate total additional choices from all sources (job, path, regent)
 */
export function calculateTotalChoices(
  jobData: any,
  pathData: any,
  regentData: any[],
  level: number = 1
): TotalChoices {
  const totals: TotalChoices = {
    skills: 0,
    feats: 0,
    spells: 0,
    powers: 0,
    techniques: 0,
    runes: 0,
    items: 0,
    tools: 0,
    languages: 0,
    expertise: 0
  };

  // Base job choices
  if (jobData) {
    totals.skills += jobData.skill_choice_count || 0;
    
    // Job awakening features
    if (jobData.awakeningFeatures) {
      for (const feature of jobData.awakeningFeatures) {
        if (feature.level <= level) {
          const grants = parseChoiceGrants(feature.description, `Job: ${feature.name}`);
          for (const grant of grants) {
            totals[grant.type] += grant.count;
          }
        }
      }
    }

    // Job traits
    if (jobData.jobTraits) {
      for (const trait of jobData.jobTraits) {
        const grants = parseChoiceGrants(trait.description, `Trait: ${trait.name}`);
        for (const grant of grants) {
          totals[grant.type] += grant.count;
        }
      }
    }
  }

  // Path features
  if (pathData && pathData.features) {
    for (const feature of pathData.features) {
      if (feature.level <= level) {
        const grants = parseChoiceGrants(feature.description, `Path: ${feature.name}`);
        for (const grant of grants) {
          totals[grant.type] += grant.count;
        }
      }
    }
  }

  // Regent features
  if (regentData) {
    for (const regent of regentData) {
      if (regent.class_features) {
        for (const feature of regent.class_features) {
          if (feature.level <= level) {
            const grants = parseChoiceGrants(feature.description, `Regent: ${regent.name}`);
            for (const grant of grants) {
              totals[grant.type] += grant.count;
            }
          }
        }
      }
    }
  }

  return totals;
}

/**
 * Get all choice grants with details for UI display
 */
export function getChoiceGrantDetails(
  jobData: any,
  pathData: any,
  regentData: any[],
  level: number = 1
): ChoiceGrant[] {
  const allGrants: ChoiceGrant[] = [];

  // Job awakening features
  if (jobData?.awakeningFeatures) {
    for (const feature of jobData.awakeningFeatures) {
      if (feature.level <= level) {
        const grants = parseChoiceGrants(feature.description, `Job: ${feature.name}`);
        allGrants.push(...grants);
      }
    }
  }

  // Job traits
  if (jobData?.jobTraits) {
    for (const trait of jobData.jobTraits) {
      const grants = parseChoiceGrants(trait.description, `Trait: ${trait.name}`);
      allGrants.push(...grants);
    }
  }

  // Path features
  if (pathData?.features) {
    for (const feature of pathData.features) {
      if (feature.level <= level) {
        const grants = parseChoiceGrants(feature.description, `Path: ${feature.name}`);
        allGrants.push(...grants);
      }
    }
  }

  // Regent features
  if (regentData) {
    for (const regent of regentData) {
      if (regent.class_features) {
        for (const feature of regent.class_features) {
          if (feature.level <= level) {
            const grants = parseChoiceGrants(feature.description, `Regent: ${regent.name}`);
            allGrants.push(...grants);
          }
        }
      }
    }
  }

  return allGrants;
}
