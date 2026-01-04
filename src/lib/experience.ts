/**
 * Experience points and leveling calculations
 */

// XP thresholds for each level
export const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};

// CR to XP mapping
export const CR_XP_MAP: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '25': 75000,
  '26': 90000,
  '27': 105000,
  '28': 120000,
  '29': 135000,
  '30': 155000,
};

// Encounter multipliers based on number of monsters
export const ENCOUNTER_MULTIPLIERS: Record<string, number> = {
  '1': 1,
  '2': 1.5,
  '3-6': 2,
  '7-10': 2.5,
  '11-14': 3,
  '15+': 4,
};

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 20; i >= 1; i--) {
    if (xp >= XP_THRESHOLDS[i]) {
      level = i;
      break;
    }
  }
  return level;
}

export function getXPForLevel(level: number): number {
  return XP_THRESHOLDS[level] || 0;
}

export function getXPToNextLevel(currentXP: number): { needed: number; progress: number } {
  const currentLevel = getLevelFromXP(currentXP);
  
  if (currentLevel >= 20) {
    return { needed: 0, progress: 100 };
  }

  const currentThreshold = XP_THRESHOLDS[currentLevel];
  const nextThreshold = XP_THRESHOLDS[currentLevel + 1];
  const xpInLevel = currentXP - currentThreshold;
  const xpNeededForLevel = nextThreshold - currentThreshold;
  
  return {
    needed: nextThreshold - currentXP,
    progress: Math.floor((xpInLevel / xpNeededForLevel) * 100),
  };
}

export function getCRXP(cr: string): number {
  return CR_XP_MAP[cr] || 0;
}

export function getEncounterMultiplier(monsterCount: number): number {
  if (monsterCount === 1) return 1;
  if (monsterCount === 2) return 1.5;
  if (monsterCount <= 6) return 2;
  if (monsterCount <= 10) return 2.5;
  if (monsterCount <= 14) return 3;
  return 4;
}

export function calculateEncounterXP(monsters: { cr: string; count: number }[]): {
  baseXP: number;
  adjustedXP: number;
  totalMonsters: number;
} {
  let baseXP = 0;
  let totalMonsters = 0;

  monsters.forEach(m => {
    baseXP += getCRXP(m.cr) * m.count;
    totalMonsters += m.count;
  });

  const multiplier = getEncounterMultiplier(totalMonsters);
  const adjustedXP = Math.floor(baseXP * multiplier);

  return { baseXP, adjustedXP, totalMonsters };
}

export function getEncounterDifficulty(
  adjustedXP: number,
  partyLevels: number[]
): 'trivial' | 'easy' | 'medium' | 'hard' | 'deadly' {
  const thresholds = {
    easy: [25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100, 2400, 2800],
    medium: [50, 100, 150, 250, 500, 600, 750, 900, 1100, 1200, 1600, 2000, 2200, 2500, 2800, 3200, 3900, 4200, 4900, 5700],
    hard: [75, 150, 225, 375, 750, 900, 1100, 1400, 1600, 1900, 2400, 3000, 3400, 3800, 4300, 4800, 5900, 6300, 7300, 8500],
    deadly: [100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 2800, 3600, 4500, 5100, 5700, 6400, 7200, 8800, 9500, 10900, 12700],
  };

  let easyTotal = 0, mediumTotal = 0, hardTotal = 0, deadlyTotal = 0;

  partyLevels.forEach(level => {
    const idx = Math.min(level - 1, 19);
    easyTotal += thresholds.easy[idx];
    mediumTotal += thresholds.medium[idx];
    hardTotal += thresholds.hard[idx];
    deadlyTotal += thresholds.deadly[idx];
  });

  if (adjustedXP >= deadlyTotal) return 'deadly';
  if (adjustedXP >= hardTotal) return 'hard';
  if (adjustedXP >= mediumTotal) return 'medium';
  if (adjustedXP >= easyTotal) return 'easy';
  return 'trivial';
}
