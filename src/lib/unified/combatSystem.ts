/**
 * Unified Combat System
 * Merges System Ascendant combat mechanics with SRD 5e rules
 */

import { 
  UnifiedCharacter, 
  UnifiedAbilityScores, 
  UnifiedSkill,
  getUnifiedAbilityModifier,
  getUnifiedSavingThrowModifier
} from './rulesEngine';
import { formatMonarchVernacular } from '@/lib/vernacular';

// Unified Combat Action Types
export type UnifiedActionType = 
  | 'attack' | 'spell' | 'power' | 'technique' | 'ability'
  | 'dodge' | 'parry' | 'block' | 'counter'
  | 'move' | 'dash' | 'disengage' | 'hide'
  | 'help' | 'use-item' | 'interact-object';

// Unified Combat States
export interface UnifiedCombatState {
  isActive: boolean;
  initiative: number;
  currentTurn: boolean;
  actionsTaken: number;
  bonusActionsTaken: number;
  reactionsAvailable: number;
  movementRemaining: number;
  concentrationActive: boolean;
  systemFavorUsed: boolean;
  monarchPowerUsed: boolean;
}

// Unified Attack Result
export interface UnifiedAttackResult {
  success: boolean;
  criticalHit: boolean;
  criticalFail: boolean;
  attackRoll: number;
  attackBonus: number;
  armorClass: number;
  damage?: string;
  damageType?: string;
  conditions?: string[];
  specialEffects?: string[];
}

// Unified Combat Action
export interface UnifiedCombatAction {
  id: string;
  name: string;
  type: UnifiedActionType;
  description: string;
  actionCost: 'action' | 'bonus-action' | 'reaction' | 'free';
  range: string;
  duration?: string;
  concentration?: boolean;
  systemFavorCost?: number;
  shadowEnergyCost?: number;
  requirements?: {
    level?: number;
    class?: string;
    ability?: keyof UnifiedAbilityScores;
    score?: number;
    equipment?: string;
  };
  effects: {
    primary: string;
    secondary?: string;
    tertiary?: string;
  };
}

// System Ascendant Techniques adapted to SRD 5e actions
export interface UnifiedTechnique extends UnifiedCombatAction {
  type: 'technique';
  style: 'unarmed' | 'weapon' | 'ranged' | 'dual-wielding' | 'two-handed' | 'shield' | 'any';
  activation: {
    type: 'action' | 'bonus-action' | 'reaction' | 'free';
    cost?: string;
  };
  mechanics: {
    attack?: {
      type: 'melee' | 'ranged';
      modifier?: string;
      damage?: string;
    };
    savingThrow?: {
      ability: keyof UnifiedAbilityScores;
      dc: string;
      success: string;
      failure: string;
    };
    movement?: {
      type: 'teleport' | 'step' | 'dash' | 'jump' | 'climb';
      distance?: number;
    };
    condition?: string[];
  };
  limitations?: {
    uses?: string;
    cooldown?: string;
    conditions?: string[];
  };
}

// Unified Combat Encounter
export interface UnifiedCombatEncounter {
  id: string;
  name: string;
  participants: UnifiedCombatParticipant[];
  round: number;
  currentTurn: number;
  isActive: boolean;
  environment: {
    terrain: string;
    lighting: string;
    cover: string[];
    hazards?: string[];
  };
}

// Unified Combat Participant
export interface UnifiedCombatParticipant {
  id: string;
  name: string;
  type: 'player' | 'ally' | 'enemy' | 'neutral';
  character?: UnifiedCharacter;
  creature?: UnifiedCreature;
  combatState: UnifiedCombatState;
  position: {
    x: number;
    y: number;
    z: number;
  };
  conditions: string[];
  temporaryEffects: string[];
}

// Unified Creature (enemies and monsters)
export interface UnifiedCreature {
  name: string;
  type: string;
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
  alignment: string;
  armorClass: number;
  hitPoints: number;
  speed: number;
  abilities: UnifiedAbilityScores;
  savingThrows: Partial<Record<keyof UnifiedAbilityScores, number>>;
  skills: Partial<Record<UnifiedSkill, number>>;
  damageResistances: string[];
  damageImmunities: string[];
  conditionImmunities: string[];
  senses: string[];
  languages: string[];
  challengeRating: number;
  experienceValue: number;
  attacks: UnifiedCreatureAttack[];
  specialAbilities: string[];
  legendaryActions?: string[];
  lairActions?: string[];
}

// Unified Creature Attack
export interface UnifiedCreatureAttack {
  name: string;
  attackBonus: number;
  reach?: string;
  range?: string;
  damage: string;
  damageType: string;
  additionalEffects?: string[];
}

// Calculate unified attack roll
export function calculateUnifiedAttackRoll(
  attacker: UnifiedCharacter,
  attackType: 'melee' | 'ranged' | 'spell',
  proficiency: boolean = false,
  expertise: boolean = false,
  abilityOverride?: keyof UnifiedAbilityScores
): number {
  // Determine ability for attack
  let ability: keyof UnifiedAbilityScores;
  if (abilityOverride) {
    ability = abilityOverride;
  } else if (attackType === 'melee') {
    ability = 'STR';
  } else if (attackType === 'ranged') {
    ability = 'AGI';
  } else {
    ability = 'INT'; // Spell attacks use INT
  }
  
  const abilityMod = getUnifiedAbilityModifier(ability, attacker.abilities[ability]);
  const profBonus = proficiency ? attacker.proficiencyBonus : 0;
  const expertiseBonus = expertise ? attacker.proficiencyBonus : 0;
  
  return abilityMod + profBonus + expertiseBonus;
}

// Perform unified attack
export function performUnifiedAttack(
  attacker: UnifiedCharacter,
  target: UnifiedCharacter | UnifiedCreature,
  attackType: 'melee' | 'ranged' | 'spell',
  damage?: string,
  damageType?: string,
  advantage: boolean = false,
  disadvantage: boolean = false,
  criticalThreshold: number = 20
): UnifiedAttackResult {
  // Calculate attack bonus
  const attackBonus = calculateUnifiedAttackRoll(attacker, attackType);
  
  // Get target AC
  const targetAC = 'hitPoints' in target ? target.armorClass : (target as UnifiedCreature).armorClass;
  
  // Roll attack with advantage/disadvantage
  const roll1 = Math.floor(Math.random() * 20) + 1;
  const roll2 = Math.floor(Math.random() * 20) + 1;
  
  let roll = roll1;
  if (advantage && !disadvantage) {
    roll = Math.max(roll1, roll2);
  } else if (disadvantage && !advantage) {
    roll = Math.min(roll1, roll2);
  }
  
  const attackRoll = roll + attackBonus;
  const criticalHit = roll >= criticalThreshold;
  const criticalFail = roll === 1;
  const success = !criticalFail && attackRoll >= targetAC;
  
  return {
    success,
    criticalHit,
    criticalFail,
    attackRoll,
    attackBonus,
    armorClass: targetAC,
    damage: success ? damage : undefined,
    damageType: success ? damageType : undefined,
    conditions: criticalHit ? ['critical-hit'] : criticalFail ? ['critical-fail'] : [],
    specialEffects: []
  };
}

// Calculate unified damage
export function calculateUnifiedDamage(
  damage: string,
  abilityMod: number = 0,
  criticalHit: boolean = false,
  damageBonus: number = 0
): { total: number; rolls: string[] } {
  // Parse damage string (e.g., "2d6+3", "1d8", "4d4+2")
  const damageMatch = damage.match(/(\d+)d(\d+)(?:\+(\d+))?/);
  if (!damageMatch) {
    return { total: 0, rolls: [] };
  }
  
  const [, numDice, dieSize, bonus] = damageMatch;
  const diceCount = parseInt(numDice);
  const dieMax = parseInt(dieSize);
  const damageBonusNum = bonus ? parseInt(bonus) : 0;
  
  const rolls: string[] = [];
  let total = 0;
  
  // Roll dice
  for (let i = 0; i < diceCount; i++) {
    const roll = Math.floor(Math.random() * dieMax) + 1;
    rolls.push(`d${dieMax}: ${roll}`);
    total += roll;
  }
  
  // Add bonuses
  total += damageBonusNum + abilityMod + damageBonus;
  
  // Critical hit - double damage dice
  if (criticalHit) {
    const critTotal = total + (total - damageBonusNum - abilityMod - damageBonus);
    total = critTotal;
    rolls.push('Critical hit: Double damage dice');
  }
  
  return { total, rolls };
}

// Perform unified saving throw
export function performUnifiedSavingThrow(
  character: UnifiedCharacter,
  ability: keyof UnifiedAbilityScores,
  dc: number,
  advantage: boolean = false,
  disadvantage: boolean = false
): { success: boolean; roll: number; modifier: number; total: number } {
  const modifier = getUnifiedSavingThrowModifier(character, ability);
  
  // Roll with advantage/disadvantage
  const roll1 = Math.floor(Math.random() * 20) + 1;
  const roll2 = Math.floor(Math.random() * 20) + 1;
  
  let roll = roll1;
  if (advantage && !disadvantage) {
    roll = Math.max(roll1, roll2);
  } else if (disadvantage && !advantage) {
    roll = Math.min(roll1, roll2);
  }
  
  const total = roll + modifier;
  const success = total >= dc;
  
  return { success, roll, modifier, total };
}

// Calculate unified movement
export function calculateUnifiedMovement(
  character: UnifiedCharacter,
  actionType: 'move' | 'dash' | 'disengage' = 'move',
  difficultTerrain: boolean = false
): number {
  let movement = character.speed;
  
  // Dash action doubles movement
  if (actionType === 'dash') {
    movement *= 2;
  }
  
  // Difficult terrain halves movement
  if (difficultTerrain) {
    movement = Math.floor(movement / 2);
  }
  
  return movement;
}

// Apply System Favor (System Ascendant mechanic adapted)
export function applySystemFavor(
  character: UnifiedCharacter,
  effect: 'reroll' | 'advantage' | 'bonus' | 'heal'
): { success: boolean; newCharacter: UnifiedCharacter; effect: string } {
  if (character.systemFavorCurrent <= 0) {
    return { 
      success: false, 
      newCharacter: character, 
      effect: 'No System Favor remaining' 
    };
  }
  
  const newCharacter = {
    ...character,
    systemFavorCurrent: character.systemFavorCurrent - 1
  };
  
  let effectDescription = '';
  switch (effect) {
    case 'reroll':
      effectDescription = 'Reroll a failed attack, save, or ability check';
      break;
    case 'advantage':
      effectDescription = 'Gain advantage on an attack roll or saving throw';
      break;
    case 'bonus':
      effectDescription = 'Add +1d6 to any ability check, attack roll, or saving throw';
      break;
    case 'heal':
      effectDescription = 'Regain hit points equal to your level';
      break;
  }
  
  return { 
    success: true, 
    newCharacter, 
    effect: effectDescription 
  };
}

// Apply Monarch Power (System Ascendant mechanic adapted for monarchs only)
export function applyMonarchPower(
  character: UnifiedCharacter,
  cost: number,
  effect: string
): { success: boolean; newCharacter: UnifiedCharacter; effect: string } {
  // Only characters with active monarch can use monarch power
  if (!character.activeMonarch) {
    return { 
      success: false, 
      newCharacter: character, 
      effect: formatMonarchVernacular('No active monarch - monarch power unavailable')
    };
  }
  
  // For now, we'll use systemFavor as the resource for monarch power
  // This could be expanded to use monarch-specific resources later
  if (character.systemFavorCurrent < cost) {
    return { 
      success: false, 
      newCharacter: character, 
      effect: formatMonarchVernacular('Insufficient System Favor for monarch power')
    };
  }
  
  const newCharacter = {
    ...character,
    systemFavorCurrent: character.systemFavorCurrent - cost
  };
  
  return { 
    success: true, 
    newCharacter, 
    effect 
  };
}

// Calculate unified initiative
export function calculateUnifiedInitiative(
  character: UnifiedCharacter,
  advantage: boolean = false
): number {
  const agiMod = getUnifiedAbilityModifier('AGI', character.abilities.AGI);
  
  let roll = Math.floor(Math.random() * 20) + 1;
  if (advantage) {
    roll = Math.max(roll, Math.floor(Math.random() * 20) + 1);
  }
  
  return roll + agiMod;
}

// Check for opportunity attack conditions
export function checkOpportunityAttack(
  movingCharacter: UnifiedCharacter,
  threateningCharacter: UnifiedCharacter,
  movementDistance: number
): boolean {
  // Check if moving character is within threatening character's reach
  const threateningReach = 5; // Standard reach
  const isWithinReach = movementDistance <= threateningReach;
  
  // Check if moving character is using disengage action
  const isDisengaging = false; // Would need to track this in combat state
  
  return isWithinReach && !isDisengaging;
}

// Perform opportunity attack
export function performOpportunityAttack(
  attacker: UnifiedCharacter,
  target: UnifiedCharacter
): UnifiedAttackResult {
  // Opportunity attacks are melee attacks with disadvantage
  return performUnifiedAttack(
    attacker,
    target,
    'melee',
    undefined,
    undefined,
    false,
    true // disadvantage
  );
}

// Get unified combat status
export function getUnifiedCombatStatus(
  character: UnifiedCharacter,
  combatState: UnifiedCombatState
): {
  hp: { current: number; max: number; percentage: number };
  ac: number;
  initiative: number;
  actionsRemaining: number;
  bonusActionsRemaining: number;
  reactionsRemaining: number;
  movementRemaining: number;
  systemFavorRemaining: number;
  shadowEnergyRemaining?: number;
  conditions: string[];
  status: 'healthy' | 'wounded' | 'critical' | 'unconscious' | 'dead';
} {
  const hpPercentage = (character.hitPoints.current / character.hitPoints.max) * 100;
  
  let status: 'healthy' | 'wounded' | 'critical' | 'unconscious' | 'dead';
  if (character.hitPoints.current <= 0) {
    status = 'unconscious';
  } else if (hpPercentage <= 25) {
    status = 'critical';
  } else if (hpPercentage <= 50) {
    status = 'wounded';
  } else {
    status = 'healthy';
  }
  
  return {
    hp: {
      current: character.hitPoints.current,
      max: character.hitPoints.max,
      percentage: hpPercentage
    },
    ac: character.armorClass,
    initiative: combatState.initiative,
    actionsRemaining: 1 - combatState.actionsTaken,
    bonusActionsRemaining: 1 - combatState.bonusActionsTaken,
    reactionsRemaining: combatState.reactionsAvailable,
    movementRemaining: combatState.movementRemaining,
    systemFavorRemaining: character.systemFavorCurrent,
    shadowEnergyRemaining: character.activeMonarch ? character.systemFavorCurrent : 0,
    conditions: [], // Would need to track conditions in combat state
    status
  };
}

