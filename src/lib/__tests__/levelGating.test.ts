import { describe, it, expect } from 'vitest';
import {
  canUnlockPath,
  canAcquireFeature,
  canAccessPower,
  filterAccessiblePaths,
  filterAccessibleFeatures,
  filterAccessiblePowers,
  getFeaturesUnlockedAtLevel,
  isPathUnlockLevel,
  isASILevel,
  getASILevels,
  getASICountAtLevel,
  getMaxAccessiblePowerLevel,
  getAvailableSpellSlots,
  getCantripLimit,
  getSpellsKnown,
  buildLevelUpGatingSummary,
  type PathUnlockMeta,
  type FeatureGateMeta,
  type PowerGateMeta,
} from '@/lib/levelGating';

// ---------------------------------------------------------------------------
// Path unlock gating
// ---------------------------------------------------------------------------

describe('canUnlockPath', () => {
  const path: PathUnlockMeta = {
    pathId: 'p1',
    pathName: 'Shadow Blade',
    pathLevel: 3,
    jobId: 'j1',
    jobName: 'Assassin',
  };

  it('allows path selection at or above the unlock level', () => {
    expect(canUnlockPath(3, path).allowed).toBe(true);
    expect(canUnlockPath(5, path).allowed).toBe(true);
    expect(canUnlockPath(20, path).allowed).toBe(true);
  });

  it('denies path selection below the unlock level', () => {
    expect(canUnlockPath(1, path).allowed).toBe(false);
    expect(canUnlockPath(2, path).allowed).toBe(false);
  });

  it('returns a descriptive reason', () => {
    const denied = canUnlockPath(2, path);
    expect(denied.reason).toContain('level 3');
    expect(denied.reason).toContain('level: 2');
  });
});

describe('filterAccessiblePaths', () => {
  const paths: PathUnlockMeta[] = [
    { pathId: 'p1', pathName: 'Early Path', pathLevel: 1, jobId: 'j1', jobName: 'Vanguard' },
    { pathId: 'p2', pathName: 'Mid Path', pathLevel: 3, jobId: 'j1', jobName: 'Vanguard' },
    { pathId: 'p3', pathName: 'Late Path', pathLevel: 7, jobId: 'j1', jobName: 'Vanguard' },
  ];

  it('returns only paths at or below the character level', () => {
    expect(filterAccessiblePaths(1, paths).map((p) => p.pathName)).toEqual(['Early Path']);
    expect(filterAccessiblePaths(3, paths).map((p) => p.pathName)).toEqual(['Early Path', 'Mid Path']);
    expect(filterAccessiblePaths(10, paths).map((p) => p.pathName)).toEqual(['Early Path', 'Mid Path', 'Late Path']);
  });
});

describe('isPathUnlockLevel', () => {
  const paths: PathUnlockMeta[] = [
    { pathId: 'p1', pathName: 'A', pathLevel: 3, jobId: 'j1', jobName: 'X' },
    { pathId: 'p2', pathName: 'B', pathLevel: 3, jobId: 'j1', jobName: 'X' },
  ];

  it('returns true when level matches a path unlock level', () => {
    expect(isPathUnlockLevel(3, paths)).toBe(true);
  });

  it('returns false when level does not match', () => {
    expect(isPathUnlockLevel(2, paths)).toBe(false);
    expect(isPathUnlockLevel(4, paths)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Feature gating
// ---------------------------------------------------------------------------

describe('canAcquireFeature', () => {
  const feature: FeatureGateMeta = {
    featureId: 'f1',
    featureName: 'Extra Attack',
    requiredLevel: 5,
    isPathFeature: false,
  };

  it('allows at or above required level', () => {
    expect(canAcquireFeature(5, feature).allowed).toBe(true);
    expect(canAcquireFeature(10, feature).allowed).toBe(true);
  });

  it('denies below required level', () => {
    expect(canAcquireFeature(4, feature).allowed).toBe(false);
    expect(canAcquireFeature(1, feature).allowed).toBe(false);
  });
});

describe('getFeaturesUnlockedAtLevel', () => {
  const features: FeatureGateMeta[] = [
    { featureId: 'f1', featureName: 'A', requiredLevel: 1, isPathFeature: false },
    { featureId: 'f2', featureName: 'B', requiredLevel: 3, isPathFeature: false },
    { featureId: 'f3', featureName: 'C', requiredLevel: 3, isPathFeature: true },
    { featureId: 'f4', featureName: 'D', requiredLevel: 5, isPathFeature: false },
  ];

  it('returns only features at the exact level', () => {
    expect(getFeaturesUnlockedAtLevel(3, features).map((f) => f.featureName)).toEqual(['B', 'C']);
    expect(getFeaturesUnlockedAtLevel(1, features).map((f) => f.featureName)).toEqual(['A']);
    expect(getFeaturesUnlockedAtLevel(2, features)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Power / spell gating
// ---------------------------------------------------------------------------

describe('canAccessPower', () => {
  const fireball: PowerGateMeta = {
    powerId: 'pw1',
    powerName: 'Fireball',
    powerLevel: 3,
    jobNames: ['Mage'],
  };

  const cantrip: PowerGateMeta = {
    powerId: 'pw2',
    powerName: 'Fire Bolt',
    powerLevel: 0,
    jobNames: ['Mage'],
  };

  it('allows cantrips for casters', () => {
    expect(canAccessPower(1, 'Mage', cantrip).allowed).toBe(true);
  });

  it('denies cantrips for non-casters', () => {
    expect(canAccessPower(1, 'Vanguard', cantrip).allowed).toBe(false);
  });

  it('allows spells at correct level', () => {
    // Mage (full caster) gets level 3 spells at character level 5
    expect(canAccessPower(5, 'Mage', fireball).allowed).toBe(true);
  });

  it('denies spells above max power level', () => {
    // Mage at level 3 can only cast up to level 2 spells
    expect(canAccessPower(3, 'Mage', fireball).allowed).toBe(false);
  });

  it('denies spells for wrong job', () => {
    expect(canAccessPower(10, 'Vanguard', fireball).allowed).toBe(false);
  });
});

describe('filterAccessiblePowers', () => {
  const powers: PowerGateMeta[] = [
    { powerId: 'p1', powerName: 'Cantrip', powerLevel: 0, jobNames: ['Mage'] },
    { powerId: 'p2', powerName: 'Shield', powerLevel: 1, jobNames: ['Mage'] },
    { powerId: 'p3', powerName: 'Fireball', powerLevel: 3, jobNames: ['Mage'] },
    { powerId: 'p4', powerName: 'Wish', powerLevel: 9, jobNames: ['Mage'] },
  ];

  it('filters based on level and job', () => {
    const accessible = filterAccessiblePowers(1, 'Mage', powers);
    expect(accessible.map((p) => p.powerName)).toEqual(['Cantrip', 'Shield']);
  });

  it('opens more powers at higher levels', () => {
    const accessible = filterAccessiblePowers(5, 'Mage', powers);
    expect(accessible.map((p) => p.powerName)).toEqual(['Cantrip', 'Shield', 'Fireball']);
  });

  it('returns all for max level full caster', () => {
    const accessible = filterAccessiblePowers(17, 'Mage', powers);
    expect(accessible.length).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// ASI / Feat gating
// ---------------------------------------------------------------------------

describe('ASI gating', () => {
  it('standard ASI levels are 4, 8, 12, 16, 19', () => {
    const levels = getASILevels('Mage');
    expect(levels).toEqual([4, 8, 12, 16, 19]);
  });

  it('Vanguard has extra ASI levels at 6 and 14', () => {
    const levels = getASILevels('Vanguard');
    expect(levels).toContain(6);
    expect(levels).toContain(14);
    expect(levels.length).toBe(7);
  });

  it('isASILevel correctly identifies ASI levels', () => {
    expect(isASILevel(4, 'Mage')).toBe(true);
    expect(isASILevel(5, 'Mage')).toBe(false);
    expect(isASILevel(6, 'Vanguard')).toBe(true);
    expect(isASILevel(6, 'Mage')).toBe(false);
  });

  it('getASICountAtLevel counts correctly', () => {
    expect(getASICountAtLevel(1, 'Mage')).toBe(0);
    expect(getASICountAtLevel(4, 'Mage')).toBe(1);
    expect(getASICountAtLevel(8, 'Mage')).toBe(2);
    expect(getASICountAtLevel(20, 'Mage')).toBe(5);
    expect(getASICountAtLevel(20, 'Vanguard')).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// Spell slot / power level gating
// ---------------------------------------------------------------------------

describe('spell/power level gating', () => {
  it('non-caster has 0 max power level', () => {
    expect(getMaxAccessiblePowerLevel('Vanguard', 20)).toBe(0);
  });

  it('full caster progression matches SRD', () => {
    expect(getMaxAccessiblePowerLevel('Mage', 1)).toBe(1);
    expect(getMaxAccessiblePowerLevel('Mage', 3)).toBe(2);
    expect(getMaxAccessiblePowerLevel('Mage', 5)).toBe(3);
    expect(getMaxAccessiblePowerLevel('Mage', 17)).toBe(9);
  });

  it('half caster has reduced progression', () => {
    expect(getMaxAccessiblePowerLevel('Holy Knight', 1)).toBe(0);
    expect(getMaxAccessiblePowerLevel('Holy Knight', 2)).toBe(1);
    expect(getMaxAccessiblePowerLevel('Holy Knight', 5)).toBe(2);
    expect(getMaxAccessiblePowerLevel('Holy Knight', 17)).toBe(5);
  });

  it('pact caster caps at level 5 spells', () => {
    expect(getMaxAccessiblePowerLevel('Contractor', 1)).toBe(1);
    expect(getMaxAccessiblePowerLevel('Contractor', 9)).toBe(5);
    expect(getMaxAccessiblePowerLevel('Contractor', 20)).toBe(5);
  });

  it('getAvailableSpellSlots returns correct slot counts', () => {
    const slots = getAvailableSpellSlots('Mage', 1);
    expect(slots[1]).toBe(2);
    expect(slots[2]).toBe(0);
  });

  it('getCantripLimit returns null for non-casters', () => {
    expect(getCantripLimit('Vanguard', 5)).toBeNull();
  });

  it('getCantripLimit returns correct values for casters', () => {
    // Mage at level 1 gets 3 cantrips
    expect(getCantripLimit('Mage', 1)).toBe(3);
    expect(getCantripLimit('Mage', 10)).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// Composite summary
// ---------------------------------------------------------------------------

describe('buildLevelUpGatingSummary', () => {
  const paths: PathUnlockMeta[] = [
    { pathId: 'p1', pathName: 'Champion', pathLevel: 3, jobId: 'j1', jobName: 'Vanguard' },
  ];

  const features: FeatureGateMeta[] = [
    { featureId: 'f1', featureName: 'Second Wind', requiredLevel: 1, isPathFeature: false },
    { featureId: 'f2', featureName: 'Action Surge', requiredLevel: 2, isPathFeature: false },
    { featureId: 'f3', featureName: 'Champion Feature', requiredLevel: 3, isPathFeature: true, pathId: 'p1' },
  ];

  it('builds correct summary for path unlock level', () => {
    const summary = buildLevelUpGatingSummary(3, 'Vanguard', null, paths, features);
    expect(summary.isPathUnlockLevel).toBe(true);
    expect(summary.newFeatureCount).toBe(1); // Champion Feature at level 3
    expect(summary.spellsKnownLimit).toBeNull();
  });

  it('identifies ASI levels', () => {
    const summary = buildLevelUpGatingSummary(4, 'Vanguard', 'Champion', paths, features);
    expect(summary.isASILevel).toBe(true);
    expect(summary.asiCount).toBe(1);
  });

  it('tracks max power level', () => {
    const summary = buildLevelUpGatingSummary(5, 'Mage', null, [], []);
    expect(summary.maxPowerLevel).toBe(3);
  });
});
