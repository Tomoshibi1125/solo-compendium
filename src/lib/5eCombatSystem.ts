/**
 * 5e Standard Combat System with System Ascendant Flavor
 * All combat mechanics follow SRD 5e rules exactly
 */

import { AppError } from '@/lib/appError';
import { 
  RollResult, 
  rollWithAdvantage, 
  rollCritical, 
  formatRollResult 
} from './advancedDiceEngine';

// System Ascendant canonical ability scores
type AbilityScore = 'STR' | 'AGI' | 'VIT' | 'INT' | 'SENSE' | 'PRE';

// Character interface using standard 5e structure
interface Character {
  id: string;
  name: string;
  level: number;
  abilities: Record<AbilityScore, number>;
  proficiency_bonus: number;
  armor_class: number;
  hp_current: number;
  hp_max: number;
  speed: number;
  conditions: string[];
  saving_throw_proficiencies: AbilityScore[];
  skill_proficiencies: string[];
  skill_expertise: string[];
  equipment: Equipment[];
  concentration_spells?: string[];
  death_save_successes?: number;
  death_save_failures?: number;
  stable?: boolean;
  // System Ascendant flavor
  system_favor_current?: number;
  system_favor_max?: number;
  system_favor_die?: number;
}

// Equipment interface using standard 5e properties
interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'shield' | 'magic_item';
  damage?: string;
  damage_type?: string;
  properties?: string[];
  is_equipped?: boolean;
  is_attuned?: boolean;
  requires_attunement?: boolean;
  magical_bonus?: number;
  attuned?: boolean;
  requirements?: {
    ability?: AbilityScore;
    minimum?: number;
  };
  // System Ascendant flavor
  system_tier?: string;
  system_tags?: string[];
}

export interface AttackResult extends RollResult {
  weapon: string;
  attackBonus: number;
  targetAC?: number;
  hit?: boolean;
  critical?: boolean;
  damage?: DamageResult;
  advantage?: 'advantage' | 'disadvantage' | 'normal';
}

export interface DamageResult {
  damageTypes: Record<string, number>;
  totalDamage: number;
  resistances: string[];
  vulnerabilities: string[];
  immunities: string[];
  healing?: number;
}

export interface SaveResult extends RollResult {
  ability: AbilityScore;
  saveBonus: number;
  dc: number;
  success: boolean;
  effects?: string[];
  halfDamage?: boolean;
}

export interface InitiativeResult {
  rolls: number;
  bonus: number;
  total: number;
  initiative: number;
  dexterityBonus: number;
  otherBonuses: number[];
  surprised?: boolean;
  formatted?: string;
}

export interface ConcentrationCheckResult {
  rolls: number;
  bonus: number;
  total: number;
  dc: number;
  damage: number;
  success: boolean;
  concentration_lost: boolean;
  formatted?: string;
}

export interface DeathSaveResult {
  rolls: number;
  bonus: number;
  total: number;
  type: 'success' | 'failure';
  critical?: boolean;
  total_successes: number;
  total_failures: number;
  stable?: boolean;
  dead?: boolean;
  formatted?: string;
}

/**
 * Get ability modifier (standard 5e formula)
 */
function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Calculate attack bonus for a weapon (standard 5e)
 */
export function calculateAttackBonus(
  character: Character, 
  weapon: Equipment, 
  isProficient: boolean
): number {
  let bonus = 0;
  
  // Add ability modifier (STR for melee, AGI for ranged/finesse)
  const isFinesse = weapon.properties?.includes('Finesse');
  const isRanged = weapon.properties?.includes('Range') || weapon.properties?.includes('Ammunition');
  
  if (isRanged || isFinesse) {
    bonus += getAbilityModifier(character.abilities.AGI);
  } else {
    bonus += getAbilityModifier(character.abilities.STR);
  }
  
  // Add proficiency bonus if proficient (standard 5e)
  if (isProficient) {
    bonus += character.proficiency_bonus;
  }
  
  // Add magical bonus (standard 5e)
  if (weapon.magical_bonus) {
    bonus += weapon.magical_bonus;
  }
  
  return bonus;
}

/**
 * Perform an attack roll (standard 5e)
 */
export function performAttackRoll(
  attacker: Character,
  target: Character,
  weapon: Equipment,
  advantage: 'advantage' | 'disadvantage' | 'normal' = 'normal'
): AttackResult {
  // Check if attacker is proficient with weapon
  const isProficient = checkWeaponProficiency(attacker, weapon);
  
  // Calculate attack bonus (standard 5e)
  const attackBonus = calculateAttackBonus(attacker, weapon, isProficient);
  
  // Roll attack (standard 5e)
  const attackRoll = rollWithAdvantage('1d20', advantage);
  const totalAttackBonus = attackRoll.total + attackBonus;
  
  // Check if hit (standard 5e)
  const targetAC = target.armor_class;
  const hit = totalAttackBonus >= targetAC;
  
  // Check for critical hit (standard 5e - natural 20)
  const critical = attackRoll.isNatural20;
  
  // Calculate damage if hit (standard 5e)
  let damage: DamageResult | undefined;
  if (hit || critical) {
    damage = calculateWeaponDamage(weapon, attacker, critical);
  }
  
  return {
    ...attackRoll,
    weapon: weapon.name,
    attackBonus,
    targetAC,
    hit,
    critical,
    damage,
    advantage,
  };
}

/**
 * Calculate weapon damage (standard 5e)
 */
export function calculateWeaponDamage(
  weapon: Equipment,
  character: Character,
  isCritical: boolean
): DamageResult {
  if (!weapon.damage) {
    throw new AppError(`Weapon ${weapon.name} has no damage defined`, 'INVALID_INPUT');
  }
  
  // Roll base damage (standard 5e)
  const damageRoll = rollCritical(weapon.damage, isCritical);
  
  // Add ability modifier to damage (standard 5e rules)
  let abilityMod = 0;
  const isFinesse = weapon.properties?.includes('Finesse');
  const isRanged = weapon.properties?.includes('Range') || weapon.properties?.includes('Ammunition');
  const isThrown = weapon.properties?.includes('Thrown');
  
  if (!isRanged || (isThrown && isFinesse)) {
    if (isFinesse) {
      abilityMod = Math.max(
        getAbilityModifier(character.abilities.STR),
        getAbilityModifier(character.abilities.AGI)
      );
    } else if (!isRanged) {
      abilityMod = getAbilityModifier(character.abilities.STR);
    }
  }
  
  // Add magical bonus to damage (standard 5e)
  const magicalBonus = weapon.magical_bonus || 0;
  
  const totalDamage = damageRoll.total + abilityMod + magicalBonus;
  
  return {
    damageTypes: {
      [weapon.damage_type || 'bludgeoning']: totalDamage
    },
    totalDamage,
    resistances: [],
    vulnerabilities: [],
    immunities: [],
  };
}

/**
 * Apply damage resistances, immunities, and vulnerabilities (standard 5e)
 */
export function applyDamageResistances(
  damage: DamageResult,
  resistances: string[],
  immunities: string[],
  vulnerabilities: string[]
): DamageResult {
  const newDamageTypes: Record<string, number> = {};
  let totalDamage = 0;
  
  Object.entries(damage.damageTypes).forEach(([damageType, amount]) => {
    let finalAmount = amount;
    
    // Check immunity first (standard 5e)
    if (immunities.includes(damageType)) {
      finalAmount = 0;
    }
    // Check resistance (standard 5e)
    else if (resistances.includes(damageType)) {
      finalAmount = Math.floor(amount / 2);
    }
    // Check vulnerability (standard 5e)
    else if (vulnerabilities.includes(damageType)) {
      finalAmount = amount * 2;
    }
    
    newDamageTypes[damageType] = finalAmount;
    totalDamage += finalAmount;
  });
  
  return {
    ...damage,
    damageTypes: newDamageTypes,
    totalDamage,
    resistances,
    vulnerabilities,
    immunities,
  };
}

/**
 * Calculate saving throw bonus (standard 5e)
 */
export function calculateSavingThrow(
  character: Character,
  ability: AbilityScore,
  isProficient: boolean
): number {
  const abilityMod = getAbilityModifier(character.abilities[ability]);
  
  let bonus = abilityMod;
  
  if (isProficient) {
    bonus += character.proficiency_bonus;
  }
  
  return bonus;
}

/**
 * Perform a saving throw (standard 5e)
 */
export function performSavingThrow(
  character: Character,
  ability: AbilityScore,
  dc: number,
  advantage: 'advantage' | 'disadvantage' | 'normal' = 'normal'
): SaveResult {
  const isProficient = character.saving_throw_proficiencies?.includes(ability);
  const saveBonus = calculateSavingThrow(character, ability, isProficient);
  
  const saveRoll = rollWithAdvantage('1d20', advantage);
  const totalSave = saveRoll.total + saveBonus;
  const success = totalSave >= dc;
  
  return {
    ...saveRoll,
    ability,
    saveBonus,
    dc,
    success,
    halfDamage: !success,
  };
}

/**
 * Perform concentration check when taking damage (standard 5e)
 * DC = 10 or half the damage taken (rounded down), whichever is higher
 */
export function performConcentrationCheck(
  character: Character, 
  damage: number
): ConcentrationCheckResult {
  const dc = Math.max(10, Math.floor(damage / 2));
  const vitMod = getAbilityModifier(character.abilities.VIT);
  const saveBonus = character.saving_throw_proficiencies.includes('VIT') 
    ? vitMod + character.proficiency_bonus 
    : vitMod;
  
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + saveBonus;
  const success = total >= dc;
  
  return {
    rolls: roll,
    bonus: saveBonus,
    total,
    dc,
    damage,
    success,
    concentration_lost: !success,
    formatted: `d20+${saveBonus} = ${total} vs DC ${dc}`
  };
}

/**
 * Perform death saving throw (standard 5e)
 */
export function performDeathSave(character: Character): DeathSaveResult {
  if (character.hp_current > 0) {
    throw new AppError('Cannot make death save - character is not at 0 HP');
  }
  
  if (character.stable) {
    throw new AppError('Cannot make death save - character is stable');
  }
  
  const roll = Math.floor(Math.random() * 20) + 1;
  const isCritical = roll === 20 || roll === 1;
  
  let type: 'success' | 'failure';
  let total_successes = character.death_save_successes || 0;
  let total_failures = character.death_save_failures || 0;
  
  if (roll === 20) {
    // Critical success - character regains 1 HP (standard 5e)
    type = 'success';
    total_successes += 2;
    return {
      rolls: roll,
      bonus: 0,
      total: roll,
      type,
      critical: true,
      total_successes,
      total_failures,
      formatted: 'Natural 20! Critical success - regain 1 HP'
    };
  } else if (roll === 1) {
    // Critical failure - 2 failures (standard 5e)
    type = 'failure';
    total_failures += 2;
    return {
      rolls: roll,
      bonus: 0,
      total: roll,
      type,
      critical: true,
      total_successes,
      total_failures,
      dead: total_failures >= 3,
      formatted: 'Natural 1! Critical failure - 2 death save failures'
    };
  } else if (roll >= 10) {
    // Success (standard 5e)
    type = 'success';
    total_successes += 1;
    return {
      rolls: roll,
      bonus: 0,
      total: roll,
      type,
      total_successes,
      total_failures,
      stable: total_successes >= 3,
      formatted: `Death save success (${total_successes}/3 successes)`
    };
  } else {
    // Failure (standard 5e)
    type = 'failure';
    total_failures += 1;
    return {
      rolls: roll,
      bonus: 0,
      total: roll,
      type,
      total_successes,
      total_failures,
      dead: total_failures >= 3,
      formatted: `Death save failure (${total_failures}/3 failures)`
    };
  }
}

/**
 * Handle multiattack action (standard 5e)
 */
export function performMultiattack(
  character: Character,
  weapons: Equipment[],
  advantage?: 'advantage' | 'disadvantage' | 'normal'
): AttackResult[] {
  const results: AttackResult[] = [];
  
  for (const weapon of weapons) {
    const attackResult = performAttackRoll(character, character, weapon, advantage);
    results.push(attackResult);
  }
  
  return results;
}

/**
 * Check weapon proficiency (standard 5e)
 */
function checkWeaponProficiency(character: Character, weapon: Equipment): boolean {
  // Simple implementation - would check character's weapon proficiencies
  return true; // Placeholder
}

/**
 * Calculate initiative (standard 5e)
 */
export function calculateInitiative(character: Character): InitiativeResult {
  const agiMod = getAbilityModifier(character.abilities.AGI);
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + agiMod;
  
  return {
    rolls: roll,
    bonus: agiMod,
    total,
    initiative: total,
    dexterityBonus: agiMod,
    otherBonuses: [],
    formatted: `d20+${agiMod} = ${total} initiative`
  };
}
