/**
 * Combat Automation System - Digital Character Sheet Style
 * 
 * Advanced combat calculations including attacks, damage, saving throws,
 * critical hits, and combat flow automation
 */

import { AppError } from '@/lib/appError';
import { 
  RollResult, 
  rollWithAdvantage, 
  rollCritical, 
  applyAbilityModifier, 
  applyProficiencyBonus,
  formatRollResult 
} from './advancedDiceEngine';

// Character interface (simplified for this example)
interface Character {
  id: string;
  name: string;
  level: number;
  abilities: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
  proficiency_bonus: number;
  armor_class: number;
  hp_current: number;
  hp_max: number;
  speed: number;
  conditions: string[];
  saving_throw_proficiencies: string[];
  skill_proficiencies: string[];
  skill_expertise: string[];
  equipment: Equipment[];
}

// Equipment interface
interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'shield' | 'magic_item';
  damage?: string;
  damage_type?: string;
  properties?: string[];
  magical_bonus?: number;
  attuned?: boolean;
  requirements?: {
    ability?: string;
    minimum?: number;
  };
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
  ability: string;
  saveBonus: number;
  dc: number;
  success: boolean;
  effects?: string[];
  halfDamage?: boolean;
}

export interface InitiativeResult extends RollResult {
  initiative: number;
  dexterityBonus: number;
  otherBonuses: number[];
  surprised?: boolean;
}

/**
 * Get ability modifier
 */
function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Calculate attack bonus for a weapon
 */
export function calculateAttackBonus(
  character: Character, 
  weapon: Equipment, 
  isProficient: boolean
): number {
  let bonus = 0;
  
  // Add ability modifier (STR for melee, DEX for ranged/finesse)
  const isFinesse = weapon.properties?.includes('Finesse');
  const isRanged = weapon.properties?.includes('Range') || weapon.properties?.includes('Ammunition');
  
  if (isRanged || isFinesse) {
    bonus += getAbilityModifier(character.abilities.DEX);
  } else {
    bonus += getAbilityModifier(character.abilities.STR);
  }
  
  // Add proficiency bonus if proficient
  if (isProficient) {
    bonus += character.proficiency_bonus;
  }
  
  // Add magical bonus
  if (weapon.magical_bonus) {
    bonus += weapon.magical_bonus;
  }
  
  return bonus;
}

/**
 * Perform an attack roll
 */
export function performAttackRoll(
  attacker: Character,
  target: Character,
  weapon: Equipment,
  advantage: 'advantage' | 'disadvantage' | 'normal' = 'normal'
): AttackResult {
  // Check if attacker is proficient with weapon
  const isProficient = checkWeaponProficiency(attacker, weapon);
  
  // Calculate attack bonus
  const attackBonus = calculateAttackBonus(attacker, weapon, isProficient);
  
  // Roll attack
  const attackRoll = rollWithAdvantage('1d20', advantage);
  const totalAttackBonus = attackRoll.total + attackBonus;
  
  // Check if hit
  const targetAC = target.armor_class;
  const hit = totalAttackBonus >= targetAC;
  
  // Check for critical hit
  const critical = attackRoll.isNatural20;
  
  // Calculate damage if hit
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
 * Calculate weapon damage
 */
export function calculateWeaponDamage(
  weapon: Equipment,
  character: Character,
  isCritical: boolean
): DamageResult {
  if (!weapon.damage) {
    throw new AppError(`Weapon ${weapon.name} has no damage defined`, 'INVALID_INPUT');
  }
  
  // Roll base damage
  const damageRoll = rollCritical(weapon.damage, isCritical);
  
  // Add ability modifier to damage (unless thrown with finesse/ranged rules)
  let abilityMod = 0;
  const isFinesse = weapon.properties?.includes('Finesse');
  const isRanged = weapon.properties?.includes('Range') || weapon.properties?.includes('Ammunition');
  const isThrown = weapon.properties?.includes('Thrown');
  
  if (!isRanged || (isThrown && isFinesse)) {
    if (isFinesse) {
      abilityMod = Math.max(
        getAbilityModifier(character.abilities.STR),
        getAbilityModifier(character.abilities.DEX)
      );
    } else if (!isRanged) {
      abilityMod = getAbilityModifier(character.abilities.STR);
    }
  }
  
  // Add magical bonus to damage
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
 * Apply damage resistances, immunities, and vulnerabilities
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
    
    // Check immunity first
    if (immunities.includes(damageType)) {
      finalAmount = 0;
    }
    // Check resistance
    else if (resistances.includes(damageType)) {
      finalAmount = Math.floor(amount / 2);
    }
    // Check vulnerability
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
 * Calculate saving throw bonus
 */
export function calculateSavingThrow(
  character: Character,
  ability: string,
  isProficient: boolean
): number {
  const abilityKey = ability as keyof typeof character.abilities;
  const abilityMod = getAbilityModifier(character.abilities[abilityKey]);
  
  let bonus = abilityMod;
  
  if (isProficient) {
    bonus += character.proficiency_bonus;
  }
  
  return bonus;
}

/**
 * Perform a saving throw
 */
export function performSavingThrow(
  character: Character,
  ability: string,
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
 * Calculate initiative
 */
export function calculateInitiative(
  character: Character,
  dexterityBonus: number,
  otherBonuses: number[] = []
): number {
  return dexterityBonus + otherBonuses.reduce((sum, bonus) => sum + bonus, 0);
}

/**
 * Roll initiative for combat
 */
export function rollInitiative(
  character: Character,
  advantage: 'advantage' | 'disadvantage' | 'normal' = 'normal'
): InitiativeResult {
  const dexBonus = getAbilityModifier(character.abilities.DEX);
  const initiativeBonus = calculateInitiative(character, dexBonus);
  
  const initiativeRoll = rollWithAdvantage('1d20', advantage);
  const totalInitiative = initiativeRoll.total + initiativeBonus;
  
  return {
    ...initiativeRoll,
    initiative: totalInitiative,
    dexterityBonus: dexBonus,
    otherBonuses: [initiativeBonus - dexBonus],
    surprised: false,
  };
}

/**
 * Check if character is proficient with weapon
 */
function checkWeaponProficiency(character: Character, weapon: Equipment): boolean {
  // This would check against character's weapon proficiencies
  // For now, assume proficiency with simple weapons
  return true;
}

/**
 * Apply damage to character
 */
export function applyDamage(
  character: Character,
  damage: DamageResult,
  damageType: string
): Character {
  const currentHP = character.hp_current;
  const newHP = Math.max(0, currentHP - damage.totalDamage);
  
  return {
    ...character,
    hp_current: newHP,
  };
}

/**
 * Apply healing to character
 */
export function applyHealing(
  character: Character,
  healing: number,
  canExceedMax: boolean = false
): Character {
  const currentHP = character.hp_current;
  const maxHP = character.hp_max;
  const newHP = canExceedMax ? 
    currentHP + healing : 
    Math.min(maxHP, currentHP + healing);
  
  return {
    ...character,
    hp_current: newHP,
  };
}

/**
 * Apply condition to character
 */
export function applyCondition(
  character: Character,
  condition: string,
  duration?: number
): Character {
  const existingConditions = character.conditions || [];
  const newConditions = [...existingConditions];
  
  if (!newConditions.includes(condition)) {
    newConditions.push(condition);
  }
  
  return {
    ...character,
    conditions: newConditions,
  };
}

/**
 * Remove condition from character
 */
export function removeCondition(
  character: Character,
  condition: string
): Character {
  const existingConditions = character.conditions || [];
  const newConditions = existingConditions.filter(c => c !== condition);
  
  return {
    ...character,
    conditions: newConditions,
  };
}

/**
 * Check if character is dead
 */
export function isCharacterDead(character: Character): boolean {
  return character.hp_current <= 0 && 
         character.conditions?.includes('dead');
}

/**
 * Check if character is stable
 */
export function isCharacterStable(character: Character): boolean {
  return character.hp_current <= 0 && 
         character.conditions?.includes('stable');
}

/**
 * Format attack result for display
 */
export function formatAttackResult(attack: AttackResult): string {
  const rollStr = formatRollResult(attack);
  const hitMiss = attack.hit ? 'HIT' : 'MISS';
  const critStr = attack.critical ? ' CRITICAL!' : '';
  
  let result = `${attack.weapon}: ${rollStr} +${attack.attackBonus} = ${attack.total} vs AC ${attack.targetAC} - ${hitMiss}${critStr}`;
  
  if (attack.damage && attack.hit) {
    const damageStr = Object.entries(attack.damage.damageTypes)
      .map(([type, amount]) => `${amount} ${type}`)
      .join(' + ');
    result += ` (${damageStr} damage)`;
  }
  
  return result;
}

/**
 * Format save result for display
 */
export function formatSaveResult(save: SaveResult): string {
  const rollStr = formatRollResult(save);
  const successFail = save.success ? 'SUCCESS' : 'FAILURE';
  
  return `${save.ability} Save: ${rollStr} +${save.saveBonus} = ${save.total} vs DC ${save.dc} - ${successFail}`;
}

/**
 * Format initiative result for display
 */
export function formatInitiativeResult(initiative: InitiativeResult): string {
  const rollStr = formatRollResult(initiative);
  return `Initiative: ${rollStr} +${initiative.dexterityBonus} = ${initiative.initiative}`;
}

