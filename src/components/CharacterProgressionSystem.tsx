/**
 * Character Progression System — 5e-aligned
 *
 * Uses SRD 5e XP thresholds, proficiency bonus, and feature-based
 * progression.  The old skill-tree / skill-point model has been removed.
 *
 * This module is kept for backward compatibility; the primary level-up
 * UI lives at pages/CharacterLevelUp.tsx and components/CharacterLevelUp.tsx.
 */

import { useState, useCallback } from 'react';
import { type LevelingMode } from '@/lib/campaignSettings';
import { getProficiencyBonus, getSystemFavorDie } from '@/types/system-rules';

// ── SRD 5e XP Thresholds ────────────────────────────────────────────────
const XP_THRESHOLDS = [
  0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

function xpForNextLevel(level: number): number {
  return XP_THRESHOLDS[Math.min(level + 1, 20)] ?? Infinity;
}

// ── Public interfaces ───────────────────────────────────────────────────

export interface CharacterProgression {
  characterId: string;
  level: number;
  experience: number;
  proficiencyBonus: number;
  systemFavorDie: number;
  /** @deprecated skill points are not used in 5e — always 0 */
  skillPoints: number;
}

// ── Hook ────────────────────────────────────────────────────────────────

export function useCharacterProgression(
  characterId: string,
  options?: { levelingMode?: LevelingMode }
) {
  const levelingMode = options?.levelingMode ?? 'milestone';
  const isMilestone = levelingMode === 'milestone';

  const [progression, setProgression] = useState<CharacterProgression>({
    characterId,
    level: 1,
    experience: 0,
    proficiencyBonus: getProficiencyBonus(1),
    systemFavorDie: getSystemFavorDie(1),
    skillPoints: 0,
  });

  const canLevelUp = useCallback((): boolean => {
    if (progression.level >= 20) return false;
    if (isMilestone) return true;
    return progression.experience >= xpForNextLevel(progression.level);
  }, [isMilestone, progression]);

  const levelUp = useCallback((): boolean => {
    if (progression.level >= 20) return false;
    if (!isMilestone && !canLevelUp()) return false;

    setProgression((prev) => {
      const newLevel = prev.level + 1;
      return {
        ...prev,
        level: newLevel,
        proficiencyBonus: getProficiencyBonus(newLevel),
        systemFavorDie: getSystemFavorDie(newLevel),
      };
    });

    return true;
  }, [canLevelUp, isMilestone, progression.level]);

  const addExperience = useCallback(
    (xp: number) => {
      if (isMilestone) return;
      setProgression((prev) => ({
        ...prev,
        experience: prev.experience + xp,
      }));
    },
    [isMilestone]
  );

  /** @deprecated no-op — skill trees have been removed */
  const unlockSkill = useCallback((_skillId: string) => false, []);

  return {
    progression,
    canLevelUp,
    levelUp,
    addExperience,
    unlockSkill,
  };
}
