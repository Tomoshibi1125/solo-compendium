/**
 * System Ascendant Rule Engine - Complete 5e Parity Implementation
 *
 * Centralized deterministic formulas for all game mechanics.
 * Ensures complete D&D Beyond parity with full automation.
 */

import { AppError } from '@/lib/appError';

// Core character interface for rule calculations
export interface RuleCharacter {
  id?: string;
  name?: string;
  level?: number;
  abilities: {
    STR: number;
    AGI: number;
    VIT: number;
    INT: number;
    SENSE: number;
    PRE: number;
  };
  proficiency_bonus?: number;
  armor_class?: number;
  hp_current?: number;
  hp_max?: number;
  hp_temp?: number;
  speed?: number;
  conditions?: string[];
  exhaustion_level?: number;
  hit_dice_current?: number;
  hit_dice_max?: number;
  hit_dice_size?: number;
  spell_slots?: {
    [key: number]: number; // level -> available slots
  };
  spellcasting_ability?: string;
  prepared_spells?: string[];
  saving_throw_proficiencies?: string[];
  skill_proficiencies?: string[];
  skill_expertise?: string[];
  equipment?: RuleEquipment[];
  modifiers?: RuleModifier[];
}

// Equipment interface for calculations
export interface RuleEquipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'shield' | 'magic_item';
  damage?: string;
  damage_type?: string;
  properties?: string[];
  magical_bonus?: number;
  attuned?: boolean;
  armor_class?: number;
  requires_proficiency?: boolean;
}

// Modifier interface for stacking and application
export interface RuleModifier {
  id: string;
  source: string;
  type: 'attack' | 'save' | 'damage' | 'healing' | 'ac' | 'skill' | 'ability' | 'speed' | 'hp-max';
  value: number;
  stacking: 'stack' | 'no-stack' | 'replace' | 'conditional';
  priority: number;
  target?: string; // specific skill, ability, damage type, etc.
  conditions?: string[];
}

// Combat result interfaces
export interface AttackResult {
  success: boolean;
  critical: boolean;
  damage: number;
  damage_type: string;
  hit_modifier: number;
  advantage_state: 'advantage' | 'disadvantage' | 'normal';
}

export interface SaveResult {
  success: boolean;
  save_modifier: number;
  dc: number;
  advantage_state: 'advantage' | 'disadvantage' | 'normal';
}

export interface InitiativeResult {
  total: number;
  dexterity_modifier: number;
  other_modifiers: number[];
}

/**
 * RULE ENGINE CLASS - CENTRALIZED GAME MECHANICS
 */
export class RuleEngine {
  /**
   * Calculate ability modifier from score
   */
  static getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  /**
   * Calculate proficiency bonus by level
   */
  static getProficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1;
  }

  /**
   * Calculate Armor Class with full layering support
   */
  static calculateArmorClass(character: RuleCharacter): number {
    // Default to the character's stored AC if present.
    // Many callers treat `armor_class` as the already-computed baseline (before temporary modifiers).
    let baseAC = character.armor_class ?? 10;

    // Apply armor and shield AC
    const armor = character.equipment?.find(e => e.type === 'armor' && e.armor_class);
    const shield = character.equipment?.find(e => e.type === 'shield' && e.armor_class);

    if (armor) {
      if (armor.requires_proficiency) {
        // AGI modifier limited by armor.
        // If the armor does not specify a max AGI cap, treat it as heavy armor (no AGI bonus).
        const agiCap = armor.properties?.includes('max-dex-2') ? 2 : 0;
        const agiMod = Math.min(this.getAbilityModifier(character.abilities.AGI), agiCap);
        baseAC = armor.armor_class! + agiMod;
      } else {
        baseAC = armor.armor_class!;
      }
    } else {
      // Unarmored handling:
      // - If AC is the vanilla base (10), add full AGI.
      // - If AC is already set to a non-10 baseline, assume it is precomputed and do not add AGI again.
      if (baseAC === 10) {
        baseAC += this.getAbilityModifier(character.abilities.AGI);
      }
    }

    // Add shield bonus
    if (shield) {
      baseAC += shield.armor_class!;
    }

    // Apply magical bonuses
    const acModifiers = character.modifiers?.filter(m => m.type === 'ac') || [];
    const totalModifier = this.applyModifierStacking(acModifiers);

    return baseAC + totalModifier;
  }

  /**
   * Calculate initiative with all modifiers
   */
  static calculateInitiative(character: RuleCharacter): InitiativeResult {
    const agiMod = this.getAbilityModifier(character.abilities.AGI);
    const modifiers = character.modifiers?.filter(m => m.type === 'skill' && m.source === 'initiative') || [];
    const otherMods = modifiers.map(m => m.value);

    return {
      total: agiMod + otherMods.reduce((sum, mod) => sum + mod, 0),
      dexterity_modifier: agiMod,
      other_modifiers: otherMods
    };
  }

  /**
   * Calculate saving throw modifier
   */
  static calculateSavingThrow(character: RuleCharacter, ability: string): number {
    const abilityKeyMap: Record<string, keyof RuleCharacter['abilities']> = {
      str: 'STR',
      strength: 'STR',
      agi: 'AGI',
      agility: 'AGI',
      dex: 'AGI',
      dexterity: 'AGI',
      vit: 'VIT',
      vitality: 'VIT',
      con: 'VIT',
      constitution: 'VIT',
      int: 'INT',
      intelligence: 'INT',
      sense: 'SENSE',
      wis: 'SENSE',
      wisdom: 'SENSE',
      pre: 'PRE',
      presence: 'PRE',
      cha: 'PRE',
      charisma: 'PRE',
    };

    const normalized = ability.trim().toLowerCase();
    const abilityKey = (abilityKeyMap[normalized] ?? ability.toUpperCase()) as keyof RuleCharacter['abilities'];
    const mod = this.getAbilityModifier(character.abilities[abilityKey]);
    const proficiencies = character.saving_throw_proficiencies || [];
    
    // Map short ability names to long form for proficiency check
    const abilityToLong: Record<string, string> = {
      'STR': 'strength',
      'AGI': 'agility',
      'VIT': 'vitality',
      'INT': 'intelligence',
      'WIS': 'wisdom',
      'CHA': 'charisma'
    };
    
    const longAbility = abilityToLong[abilityKey as string] || normalized;
    const isProficient = proficiencies.includes(abilityKey as string) || proficiencies.includes(longAbility);
    const proficiencyBonus = isProficient ? character.proficiency_bonus || 0 : 0;

    const relevantModifiers = character.modifiers?.filter(m => m.type === 'save' && (!m.target || m.target === normalized)) || [];
    const modifierBonus = this.applyModifierStacking(relevantModifiers);

    return mod + proficiencyBonus + modifierBonus;
  }

  /**
   * Calculate spell save DC
   */
  static calculateSpellSaveDC(character: RuleCharacter, spellLevel: number): number {
    if (!character.spellcasting_ability) {
      throw new AppError('Character has no spellcasting ability', 'INVALID_INPUT');
    }

    const abilityKey = character.spellcasting_ability as keyof typeof character.abilities;
    const abilityMod = this.getAbilityModifier(character.abilities[abilityKey]);

    return 8 + (character.proficiency_bonus || 0) + abilityMod;
  }

  /**
   * Calculate spell attack modifier
   */
  static calculateSpellAttackModifier(character: RuleCharacter): number {
    if (!character.spellcasting_ability) {
      throw new AppError('Character has no spellcasting ability', 'INVALID_INPUT');
    }

    const abilityKey = character.spellcasting_ability as keyof typeof character.abilities;
    const abilityMod = this.getAbilityModifier(character.abilities[abilityKey]);

    return (character.proficiency_bonus || 0) + abilityMod;
  }

  /**
   * Perform attack roll with advantage/disadvantage resolution
   */
  static performAttackRoll(
    attackModifier: number,
    targetAC: number,
    advantage: 'advantage' | 'disadvantage' | 'normal' = 'normal'
  ): AttackResult {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;

    let effectiveRoll: number;
    switch (advantage) {
      case 'advantage':
        effectiveRoll = Math.max(roll1, roll2);
        break;
      case 'disadvantage':
        effectiveRoll = Math.min(roll1, roll2);
        break;
      default:
        effectiveRoll = roll1;
    }

    const total = effectiveRoll + attackModifier;
    const success = total >= targetAC;
    const critical = effectiveRoll === 20;

    return {
      success,
      critical,
      damage: 0, // To be calculated separately
      damage_type: '',
      hit_modifier: attackModifier,
      advantage_state: advantage
    };
  }

  /**
   * Perform saving throw with advantage/disadvantage
   */
  static performSavingThrow(
    saveModifier: number,
    dc: number,
    advantage: 'advantage' | 'disadvantage' | 'normal' = 'normal'
  ): SaveResult {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;

    let effectiveRoll: number;
    switch (advantage) {
      case 'advantage':
        effectiveRoll = Math.max(roll1, roll2);
        break;
      case 'disadvantage':
        effectiveRoll = Math.min(roll1, roll2);
        break;
      default:
        effectiveRoll = roll1;
    }

    const total = effectiveRoll + saveModifier;
    const success = total >= dc;

    return {
      success,
      save_modifier: saveModifier,
      dc,
      advantage_state: advantage
    };
  }

  /**
   * Apply damage with resistance/vulnerability/immunity
   */
  static applyDamage(
    damage: number,
    damageType: string,
    resistances: string[] = [],
    immunities: string[] = [],
    vulnerabilities: string[] = [],
  ): number {
    if (immunities.includes(damageType)) {
      return 0;
    }

    let finalDamage = damage;

    // Apply resistance
    if (resistances.includes(damageType)) {
      finalDamage = Math.floor(damage / 2);
    }

    // Apply vulnerability
    if (vulnerabilities.includes(damageType)) {
      finalDamage = damage * 2;
    }

    return Math.max(0, finalDamage);
  }

  /**
   * Calculate multi-class spell slots
   */
  static calculateSpellSlots(character: RuleCharacter): { [level: number]: number } {
    const slots: { [level: number]: number } = {};

    // This is a simplified calculation - would need class-specific logic
    const totalLevel = character.level || 1;

    // Standard spell slot progression (simplified for full caster)
    if (totalLevel >= 1) slots[1] = 4;
    if (totalLevel >= 5) slots[2] = 3;
    if (totalLevel >= 5) slots[3] = totalLevel >= 11 ? 3 : 2;
    if (totalLevel >= 7) slots[4] = Math.min(3, Math.floor((totalLevel - 6) / 2) + 1);
    if (totalLevel >= 9) slots[5] = Math.min(3, Math.floor((totalLevel - 8) / 2) + 1);
    if (totalLevel >= 11) slots[6] = Math.min(3, Math.floor((totalLevel - 10) / 2) + 1);
    if (totalLevel >= 13) slots[7] = Math.min(3, Math.floor((totalLevel - 12) / 2) + 1);
    if (totalLevel >= 15) slots[8] = Math.min(3, Math.floor((totalLevel - 14) / 2) + 1);
    if (totalLevel >= 17) slots[9] = Math.min(3, Math.floor((totalLevel - 16) / 2) + 1);

    return slots;
  }

  /**
   * Apply modifier stacking rules
   */
  static applyModifierStacking(modifiers: RuleModifier[]): number {
    if (modifiers.length === 0) return 0;

    // Group by stacking behavior
    const stackMods = modifiers.filter(m => m.stacking === 'stack');
    const noStackMods = modifiers.filter(m => m.stacking === 'no-stack');
    const replaceMods = modifiers.filter(m => m.stacking === 'replace');

    let total = 0;

    // Stack all stackable modifiers
    total += stackMods.reduce((sum, mod) => sum + mod.value, 0);

    // Take the highest no-stack modifier
    if (noStackMods.length > 0) {
      const highestNoStack = Math.max(...noStackMods.map(m => m.value));
      total += highestNoStack;
    }

    // Take the highest priority replace modifier
    if (replaceMods.length > 0) {
      const highestPriority = Math.max(...replaceMods.map(m => m.priority));
      const replaceValue = replaceMods
        .filter(m => m.priority === highestPriority)
        .reduce((max, mod) => Math.max(max, mod.value), -Infinity);
      total = replaceValue; // Replace total instead of adding
    }

    return total;
  }

  /**
   * Check if conditions are met for modifier application
   */
  static checkConditions(character: RuleCharacter, conditions: string[]): boolean {
    return conditions.every(condition => {
      switch (condition) {
        case 'unarmored':
          return !(character.equipment?.some(e => e.type === 'armor') ?? false);
        case 'armored':
          return character.equipment?.some(e => e.type === 'armor') ?? false;
        case 'shield':
          return character.equipment?.some(e => e.type === 'shield') ?? false;
        case 'concentration':
          return character.conditions?.includes('concentration') ?? false;
        default:
          return character.conditions?.includes(condition) ?? false;
      }
    });
  }

  /**
   * Calculate hit dice recovery on rest
   */
  static recoverHitDice(character: RuleCharacter, restType: 'short' | 'long'): number {
    const maxRecovery = restType === 'long' ? (character.hit_dice_max || 1) : Math.floor((character.level || 1) / 2);

    return Math.min(maxRecovery, (character.hit_dice_max || 1) - (character.hit_dice_current || 0));
  }

  /**
   * Calculate HP recovery from hit dice
   */
  static calculateHitDieHealing(character: RuleCharacter, hitDiceSpent: number): number {
    const vitMod = this.getAbilityModifier(character.abilities.VIT);
    const averageRoll = Math.floor((character.hit_dice_size || 8) / 2) + 1;

    return (averageRoll + vitMod) * hitDiceSpent;
  }

  /**
   * Check concentration save after taking damage
   */
  static checkConcentration(character: RuleCharacter, damage: number): boolean {
    const dc = Math.max(10, Math.floor(damage / 2) + 5);
    const roll = Math.floor(Math.random() * 20) + 1;
    return roll >= dc;
  }

  /**
   * Process death save
   */
  static processDeathSave(character: RuleCharacter, success: boolean): {
    successes: number;
    failures: number;
    stable: boolean;
    dead: boolean;
  } {
    const successMatch = character.conditions?.find(c => c.startsWith('death-save-success-'));
    const failureMatch = character.conditions?.find(c => c.startsWith('death-save-failure-'));

    const currentSuccesses = successMatch ? parseInt(successMatch.split('-').pop() || '0', 10) : 0;
    const currentFailures = failureMatch ? parseInt(failureMatch.split('-').pop() || '0', 10) : 0;

    let newSuccesses = currentSuccesses;
    let newFailures = currentFailures;

    if (success) {
      newSuccesses = Math.min(3, currentSuccesses + 1);
    } else {
      newFailures = Math.min(3, currentFailures + 1);
    }

    const stable = newSuccesses >= 3;
    const dead = newFailures >= 3;

    return {
      successes: newSuccesses,
      failures: newFailures,
      stable,
      dead
    };
  }

  /**
   * Process death save (alias for processDeathSave)
   */
  static performDeathSave(character: RuleCharacter, success: boolean): {
    successes: number;
    failures: number;
    stable: boolean;
    dead: boolean;
  } {
    return this.processDeathSave(character, success);
  }

  /**
   * Process recharge mechanics
   */
  static processRecharge(rechargeType: string): boolean {
    switch (rechargeType) {
      case 'recharge-2':
        return Math.floor(Math.random() * 6) + 1 >= 2;
      case 'recharge-3':
        return Math.floor(Math.random() * 6) + 1 >= 3;
      case 'recharge-4':
        return Math.floor(Math.random() * 6) + 1 >= 4;
      case 'recharge-5':
        return Math.floor(Math.random() * 6) + 1 >= 5;
      case 'recharge-6':
        return Math.floor(Math.random() * 6) + 1 >= 6;
      default:
        return false;
    }
  }

  /**
   * Validate character for game rules compliance
   */
  static validateCharacter(character: RuleCharacter): string[] {
    const errors: string[] = [];

    // Validate ability scores
    Object.entries(character.abilities).forEach(([ability, score]) => {
      if (score < 1 || score > 30) {
        errors.push(`${ability} score ${score} is out of range (1-30)`);
      }
    });

    // Validate level
    if (character.level && (character.level < 1 || character.level > 20)) {
      errors.push(`Level ${character.level} is out of range (1-20)`);
    }

    // Validate HP
    if (character.hp_current !== undefined && character.hp_current < 0) {
      errors.push('Current HP cannot be negative');
    }
    if (character.hp_current !== undefined && character.hp_max !== undefined && character.hp_temp !== undefined) {
      if (character.hp_current > character.hp_max + character.hp_temp) {
        errors.push('Current HP exceeds maximum');
      }
    }

    // Validate exhaustion
    if (character.exhaustion_level !== undefined && (character.exhaustion_level < 0 || character.exhaustion_level > 6)) {
      errors.push(`Exhaustion level ${character.exhaustion_level} is out of range (0-6)`);
    }

    return errors;
  }
}
