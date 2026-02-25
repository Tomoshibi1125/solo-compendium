/**
 * Condition & Exhaustion Effects Engine
 *
 * D&D Beyond parity: automatically applies mechanical penalties
 * from active conditions and exhaustion levels to rolls/stats.
 *
 * All functions are pure — callers provide state, functions return modifiers.
 */

// ---------------------------------------------------------------------------
// Condition definitions (SRD 5e)
// ---------------------------------------------------------------------------

export interface ConditionEffect {
  name: string;
  description: string;
  mechanicalEffects: MechanicalEffect[];
}

export interface MechanicalEffect {
  type: 'disadvantage' | 'advantage' | 'auto_fail' | 'speed_zero' | 'speed_halved' | 'modifier' | 'incapacitated';
  target: string; // 'attack_rolls', 'ability_checks', 'saving_throws', 'AGI_saves', 'STR_saves', etc.
  value?: number; // for 'modifier' type
}

export const CONDITION_EFFECTS: Record<string, ConditionEffect> = {
  blinded: {
    name: 'Blinded',
    description: 'Cannot see. Auto-fails checks requiring sight. Attack rolls have disadvantage. Attacks against have advantage.',
    mechanicalEffects: [
      { type: 'disadvantage', target: 'attack_rolls' },
      { type: 'auto_fail', target: 'sight_checks' },
    ],
  },
  charmed: {
    name: 'Charmed',
    description: 'Cannot attack the charmer. Charmer has advantage on social checks.',
    mechanicalEffects: [],
  },
  deafened: {
    name: 'Deafened',
    description: 'Cannot hear. Auto-fails checks requiring hearing.',
    mechanicalEffects: [
      { type: 'auto_fail', target: 'hearing_checks' },
    ],
  },
  frightened: {
    name: 'Frightened',
    description: 'Disadvantage on ability checks and attack rolls while source of fear is in line of sight.',
    mechanicalEffects: [
      { type: 'disadvantage', target: 'ability_checks' },
      { type: 'disadvantage', target: 'attack_rolls' },
    ],
  },
  grappled: {
    name: 'Grappled',
    description: 'Speed becomes 0.',
    mechanicalEffects: [
      { type: 'speed_zero', target: 'speed' },
    ],
  },
  incapacitated: {
    name: 'Incapacitated',
    description: 'Cannot take actions or reactions.',
    mechanicalEffects: [
      { type: 'incapacitated', target: 'actions' },
    ],
  },
  invisible: {
    name: 'Invisible',
    description: 'Advantage on attack rolls. Attacks against have disadvantage.',
    mechanicalEffects: [
      { type: 'advantage', target: 'attack_rolls' },
    ],
  },
  paralyzed: {
    name: 'Paralyzed',
    description: 'Incapacitated. Auto-fail STR and AGI saves. Attacks have advantage. Melee hits are crits.',
    mechanicalEffects: [
      { type: 'incapacitated', target: 'actions' },
      { type: 'auto_fail', target: 'STR_saves' },
      { type: 'auto_fail', target: 'AGI_saves' },
    ],
  },
  petrified: {
    name: 'Petrified',
    description: 'Incapacitated. Auto-fail STR and AGI saves. Resistance to all damage.',
    mechanicalEffects: [
      { type: 'incapacitated', target: 'actions' },
      { type: 'auto_fail', target: 'STR_saves' },
      { type: 'auto_fail', target: 'AGI_saves' },
    ],
  },
  poisoned: {
    name: 'Poisoned',
    description: 'Disadvantage on attack rolls and ability checks.',
    mechanicalEffects: [
      { type: 'disadvantage', target: 'attack_rolls' },
      { type: 'disadvantage', target: 'ability_checks' },
    ],
  },
  prone: {
    name: 'Prone',
    description: 'Disadvantage on attack rolls. Melee attacks within 5ft have advantage. Ranged attacks have disadvantage.',
    mechanicalEffects: [
      { type: 'disadvantage', target: 'attack_rolls' },
    ],
  },
  restrained: {
    name: 'Restrained',
    description: 'Speed 0. Disadvantage on AGI saves. Disadvantage on attack rolls. Attacks against have advantage.',
    mechanicalEffects: [
      { type: 'speed_zero', target: 'speed' },
      { type: 'disadvantage', target: 'AGI_saves' },
      { type: 'disadvantage', target: 'attack_rolls' },
    ],
  },
  stunned: {
    name: 'Stunned',
    description: 'Incapacitated. Auto-fail STR and AGI saves. Attacks against have advantage.',
    mechanicalEffects: [
      { type: 'incapacitated', target: 'actions' },
      { type: 'auto_fail', target: 'STR_saves' },
      { type: 'auto_fail', target: 'AGI_saves' },
    ],
  },
  unconscious: {
    name: 'Unconscious',
    description: 'Incapacitated. Drops items. Auto-fail STR and AGI saves. Attacks have advantage. Melee crits.',
    mechanicalEffects: [
      { type: 'incapacitated', target: 'actions' },
      { type: 'auto_fail', target: 'STR_saves' },
      { type: 'auto_fail', target: 'AGI_saves' },
      { type: 'speed_zero', target: 'speed' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Exhaustion table (SRD 5e)
// ---------------------------------------------------------------------------

export interface ExhaustionLevel {
  level: number;
  effects: MechanicalEffect[];
  description: string;
}

export const EXHAUSTION_TABLE: ExhaustionLevel[] = [
  { level: 0, effects: [], description: 'No exhaustion.' },
  {
    level: 1,
    effects: [{ type: 'disadvantage', target: 'ability_checks' }],
    description: 'Disadvantage on ability checks.',
  },
  {
    level: 2,
    effects: [
      { type: 'disadvantage', target: 'ability_checks' },
      { type: 'speed_halved', target: 'speed' },
    ],
    description: 'Disadvantage on ability checks. Speed halved.',
  },
  {
    level: 3,
    effects: [
      { type: 'disadvantage', target: 'ability_checks' },
      { type: 'speed_halved', target: 'speed' },
      { type: 'disadvantage', target: 'attack_rolls' },
      { type: 'disadvantage', target: 'saving_throws' },
    ],
    description: 'Disadvantage on ability checks, attack rolls, and saving throws. Speed halved.',
  },
  {
    level: 4,
    effects: [
      { type: 'disadvantage', target: 'ability_checks' },
      { type: 'speed_halved', target: 'speed' },
      { type: 'disadvantage', target: 'attack_rolls' },
      { type: 'disadvantage', target: 'saving_throws' },
      { type: 'modifier', target: 'hp_max', value: -0.5 }, // HP max halved (represented as multiplier)
    ],
    description: 'All level 3 effects. HP maximum halved.',
  },
  {
    level: 5,
    effects: [
      { type: 'disadvantage', target: 'ability_checks' },
      { type: 'speed_zero', target: 'speed' },
      { type: 'disadvantage', target: 'attack_rolls' },
      { type: 'disadvantage', target: 'saving_throws' },
      { type: 'modifier', target: 'hp_max', value: -0.5 },
    ],
    description: 'All level 4 effects. Speed reduced to 0.',
  },
  {
    level: 6,
    effects: [],
    description: 'Death.',
  },
];

// ---------------------------------------------------------------------------
// Roll modifier resolution
// ---------------------------------------------------------------------------

export type AdvantageState = 'advantage' | 'disadvantage' | 'normal';

export interface RollModifiers {
  advantageState: AdvantageState;
  autoFail: boolean;
  flatModifier: number;
  speedMultiplier: number; // 1 = normal, 0.5 = halved, 0 = zero
  hpMaxMultiplier: number; // 1 = normal, 0.5 = halved
  isIncapacitated: boolean;
  isDead: boolean;
  activeConditions: string[];
  exhaustionLevel: number;
}

/**
 * Resolve all mechanical effects from active conditions + exhaustion for a specific roll type.
 */
export function resolveRollModifiers(
  conditions: string[],
  exhaustionLevel: number,
  rollType: 'attack_rolls' | 'ability_checks' | 'saving_throws' | 'AGI_saves' | 'STR_saves'
): RollModifiers {
  const result: RollModifiers = {
    advantageState: 'normal',
    autoFail: false,
    flatModifier: 0,
    speedMultiplier: 1,
    hpMaxMultiplier: 1,
    isIncapacitated: false,
    isDead: false,
    activeConditions: [...conditions],
    exhaustionLevel,
  };

  if (exhaustionLevel >= 6) {
    result.isDead = true;
    return result;
  }

  let hasAdvantage = false;
  let hasDisadvantage = false;

  // Process condition effects
  for (const conditionName of conditions) {
    const normalized = conditionName.trim().toLowerCase();
    const condition = CONDITION_EFFECTS[normalized];
    if (!condition) continue;

    for (const effect of condition.mechanicalEffects) {
      if (effect.target === rollType || effect.target === 'all') {
        switch (effect.type) {
          case 'disadvantage':
            hasDisadvantage = true;
            break;
          case 'advantage':
            hasAdvantage = true;
            break;
          case 'auto_fail':
            result.autoFail = true;
            break;
          case 'modifier':
            result.flatModifier += effect.value ?? 0;
            break;
          case 'incapacitated':
            result.isIncapacitated = true;
            break;
          default:
            break;
        }
      }

      // Speed effects always apply
      if (effect.type === 'speed_zero') {
        result.speedMultiplier = 0;
      } else if (effect.type === 'speed_halved' && result.speedMultiplier > 0) {
        result.speedMultiplier = Math.min(result.speedMultiplier, 0.5);
      }
    }
  }

  // Process exhaustion effects
  const exhaustion = EXHAUSTION_TABLE[Math.min(exhaustionLevel, 5)];
  if (exhaustion) {
    for (const effect of exhaustion.effects) {
      if (effect.target === rollType || effect.target === 'all') {
        if (effect.type === 'disadvantage') hasDisadvantage = true;
        if (effect.type === 'auto_fail') result.autoFail = true;
      }
      if (effect.type === 'speed_halved' && result.speedMultiplier > 0) {
        result.speedMultiplier = Math.min(result.speedMultiplier, 0.5);
      }
      if (effect.type === 'speed_zero') {
        result.speedMultiplier = 0;
      }
      if (effect.type === 'modifier' && effect.target === 'hp_max') {
        result.hpMaxMultiplier = Math.min(result.hpMaxMultiplier, 0.5);
      }
    }
  }

  // Resolve advantage/disadvantage (they cancel if both present — 5e rule)
  if (hasAdvantage && hasDisadvantage) {
    result.advantageState = 'normal';
  } else if (hasAdvantage) {
    result.advantageState = 'advantage';
  } else if (hasDisadvantage) {
    result.advantageState = 'disadvantage';
  }

  return result;
}

/**
 * Get effective speed after condition/exhaustion penalties.
 */
export function getEffectiveSpeed(baseSpeed: number, conditions: string[], exhaustionLevel: number): number {
  const mods = resolveRollModifiers(conditions, exhaustionLevel, 'ability_checks');
  return Math.floor(baseSpeed * mods.speedMultiplier);
}

/**
 * Get effective HP max after exhaustion penalties.
 */
export function getEffectiveHPMax(baseHPMax: number, exhaustionLevel: number): number {
  if (exhaustionLevel >= 4) {
    return Math.floor(baseHPMax * 0.5);
  }
  return baseHPMax;
}

/**
 * Check if a character is incapacitated by any condition.
 */
export function isIncapacitated(conditions: string[]): boolean {
  const incapConditions = ['incapacitated', 'paralyzed', 'petrified', 'stunned', 'unconscious'];
  return conditions.some((c) => incapConditions.includes(c.trim().toLowerCase()));
}

/**
 * Get a human-readable summary of all active penalties.
 */
export function getActivePenaltySummary(conditions: string[], exhaustionLevel: number): string[] {
  const summaries: string[] = [];

  for (const conditionName of conditions) {
    const normalized = conditionName.trim().toLowerCase();
    const condition = CONDITION_EFFECTS[normalized];
    if (condition) {
      summaries.push(`${condition.name}: ${condition.description}`);
    }
  }

  if (exhaustionLevel > 0 && exhaustionLevel <= 5) {
    summaries.push(`Exhaustion ${exhaustionLevel}: ${EXHAUSTION_TABLE[exhaustionLevel].description}`);
  } else if (exhaustionLevel >= 6) {
    summaries.push('Exhaustion 6: Death.');
  }

  return summaries;
}

// ---------------------------------------------------------------------------
// Condition Lifecycle Management (Phase 2)
// ---------------------------------------------------------------------------

import type { ActiveCondition } from './characterEngine';

/**
 * Remove all conditions tied to a specific concentration spell.
 * Called when concentration is broken (damage, casting another spell, etc.)
 */
export function breakConcentrationConditions(
  conditions: ActiveCondition[],
  spellId: string
): ActiveCondition[] {
  return conditions.filter(c => !(c.concentration && c.spellId === spellId));
}

/**
 * Tick round-based durations (call at end of each round).
 * Returns { active, expired } condition arrays.
 */
export function tickRoundDurations(
  conditions: ActiveCondition[]
): { active: ActiveCondition[]; expired: ActiveCondition[] } {
  const active: ActiveCondition[] = [];
  const expired: ActiveCondition[] = [];

  for (const condition of conditions) {
    if (condition.duration?.type === 'rounds' && condition.duration.remainingRounds !== undefined) {
      const remaining = condition.duration.remainingRounds - 1;
      if (remaining <= 0) {
        expired.push(condition);
      } else {
        active.push({
          ...condition,
          duration: { ...condition.duration, remainingRounds: remaining },
        });
      }
    } else {
      active.push(condition);
    }
  }

  return { active, expired };
}

/**
 * Filter out time-expired conditions (minutes/hours with expiresAt).
 */
export function filterExpiredConditions(
  conditions: ActiveCondition[],
  now: Date = new Date()
): { active: ActiveCondition[]; expired: ActiveCondition[] } {
  const active: ActiveCondition[] = [];
  const expired: ActiveCondition[] = [];

  for (const condition of conditions) {
    if (condition.expiresAt && condition.expiresAt <= now) {
      expired.push(condition);
    } else {
      active.push(condition);
    }
  }

  return { active, expired };
}
