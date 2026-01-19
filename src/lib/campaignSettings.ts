export type LevelingMode = 'xp' | 'milestone';

const VALID_LEVELING_MODES: LevelingMode[] = ['xp', 'milestone'];

export function getLevelingMode(settings?: Record<string, unknown>): LevelingMode {
  const raw = settings?.leveling_mode;
  return VALID_LEVELING_MODES.includes(raw as LevelingMode) ? (raw as LevelingMode) : 'milestone';
}
