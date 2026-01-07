import type { Database } from '@/integrations/supabase/types';

type Monster = Database['public']['Tables']['compendium_monsters']['Row'];

const DIFFICULTY_THRESHOLDS = {
  easy: { 1: 25, 2: 50, 3: 75, 4: 100, 5: 125, 6: 150, 7: 175, 8: 200, 9: 225, 10: 250 },
  medium: { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250, 6: 300, 7: 350, 8: 400, 9: 450, 10: 500 },
  hard: { 1: 75, 2: 150, 3: 225, 4: 300, 5: 375, 6: 450, 7: 525, 8: 600, 9: 675, 10: 750 },
  deadly: { 1: 100, 2: 200, 3: 300, 4: 450, 5: 550, 6: 600, 7: 750, 8: 900, 9: 1100, 10: 1200 },
} as const;

export type EncounterDifficulty = 'easy' | 'medium' | 'hard' | 'deadly';

export function calculateXP(monster: Monster, quantity: number): number {
  const xp = monster.xp || 0;
  return xp * quantity;
}

export function calculateDifficulty(
  totalXP: number,
  hunterLevel: number,
  hunterCount: number
): EncounterDifficulty {
  const multiplier = hunterCount === 1 ? 1 : hunterCount <= 2 ? 1.5 : hunterCount <= 6 ? 2 : 2.5;
  const adjustedXP = totalXP * multiplier;
  const thresholds = DIFFICULTY_THRESHOLDS;

  if (adjustedXP >= (thresholds.deadly[hunterLevel as keyof typeof thresholds.deadly] || 1200)) {
    return 'deadly';
  }
  if (adjustedXP >= (thresholds.hard[hunterLevel as keyof typeof thresholds.hard] || 750)) {
    return 'hard';
  }
  if (adjustedXP >= (thresholds.medium[hunterLevel as keyof typeof thresholds.medium] || 500)) {
    return 'medium';
  }
  return 'easy';
}


