/**
 * Unified System Integration
 * Main integration point for System Ascendant + SRD 5e merged system
 */

import { 
  UnifiedCharacter, 
  UnifiedClass, 
  UnifiedAbilityScores,
  getUnifiedAbilityModifier,
  getUnifiedProficiencyBonus,
  getSystemFavorMax
} from './rulesEngine';

import { 
  UnifiedCharacterCreation,
  createUnifiedCharacter,
  validateUnifiedCharacter,
  unifiedClassPackages
} from './characterCreation';

import {
  UnifiedCombatState,
  UnifiedCombatEncounter,
  performUnifiedAttack,
  performUnifiedSavingThrow,
  applySystemFavor as applySystemFavorUtil,
  applyMonarchPower as applyMonarchPowerUtil,
  calculateUnifiedInitiative
} from './combatSystem';

import {
  UnifiedSpell,
  castUnifiedSpell,
} from './spellSystem';

// Main Unified System Class
export class UnifiedSystem {
  private character: UnifiedCharacter;
  private combatState: UnifiedCombatState;
  private currentEncounter?: UnifiedCombatEncounter;

  constructor(character: UnifiedCharacter) {
    this.character = character;
    this.combatState = this.initializeCombatState();
  }

  // Initialize combat state
  private initializeCombatState(): UnifiedCombatState {
    return {
      isActive: false,
      initiative: 0,
      currentTurn: false,
      actionsTaken: 0,
      bonusActionsTaken: 0,
      reactionsAvailable: 1,
      movementRemaining: this.character.speed,
      concentrationActive: false,
      systemFavorUsed: false,
      monarchPowerUsed: false
    };
  }

  // Get current character
  getCharacter(): UnifiedCharacter {
    return this.character;
  }

  // Update character
  updateCharacter(character: Partial<UnifiedCharacter>): void {
    this.character = { ...this.character, ...character };
  }

  // Get combat state
  getCombatState(): UnifiedCombatState {
    return this.combatState;
  }

  // Start combat encounter
  startCombat(encounter: UnifiedCombatEncounter): void {
    this.currentEncounter = encounter;
    this.combatState.isActive = true;
    this.combatState.initiative = calculateUnifiedInitiative(this.character);
  }

  // End combat encounter
  endCombat(): void {
    this.currentEncounter = undefined;
    this.combatState = this.initializeCombatState();
  }

  // Perform attack action
  performAttack(
    target: UnifiedCharacter,
    attackType: 'melee' | 'ranged' | 'spell' = 'melee',
    damage?: string,
    damageType?: string
  ) {
    return performUnifiedAttack(this.character, target, attackType, damage, damageType);
  }

  // Perform saving throw
  performSavingThrow(ability: keyof UnifiedAbilityScores, dc: number) {
    return performUnifiedSavingThrow(this.character, ability, dc);
  }

  // Cast spell/power
  castSpell(spell: UnifiedSpell, spellcastingAbility: keyof UnifiedAbilityScores, upcastLevel?: number) {
    const result = castUnifiedSpell(this.character, spell, spellcastingAbility, upcastLevel);
    if (result.success) {
      this.updateCharacter(result.newCharacter);
    }
    return result;
  }

  // Apply System Favor
  applySystemFavor(effect: 'reroll' | 'advantage' | 'bonus' | 'heal') {
    const result = applySystemFavorUtil(this.character, effect);
    if (result.success) {
      this.updateCharacter(result.newCharacter);
    }
    return result;
  }

  // Apply Monarch Power (replaces Umbral Energy)
  applyMonarchPower(cost: number, effect: string) {
    const result = applyMonarchPowerUtil(this.character, cost, effect);
    if (result.success) {
      this.updateCharacter(result.newCharacter);
    }
    return result;
  }

  // Level up character
  levelUp(): void {
    const newLevel = this.character.level + 1;
    const proficiencyBonus = getUnifiedProficiencyBonus(newLevel);
    const systemFavorMax = getSystemFavorMax(newLevel);

    this.updateCharacter({
      level: newLevel,
      proficiencyBonus,
      systemFavorMax,
      systemFavorCurrent: systemFavorMax // Restore System Favor on level up
    });
  }

  // Take damage
  takeDamage(damage: number, _damageType?: string): void {
    const newHP = Math.max(0, this.character.hitPoints.current - damage);
    this.updateCharacter({
      hitPoints: {
        ...this.character.hitPoints,
        current: newHP
      }
    });
  }

  // Heal damage
  healDamage(healing: number, temporary: boolean = false): void {
    if (temporary) {
      this.updateCharacter({
        hitPoints: {
          ...this.character.hitPoints,
          temp: this.character.hitPoints.temp + healing
        }
      });
    } else {
      const newHP = Math.min(this.character.hitPoints.max, this.character.hitPoints.current + healing);
      this.updateCharacter({
        hitPoints: {
          ...this.character.hitPoints,
          current: newHP
        }
      });
    }
  }

  // Rest (short rest)
  shortRest(): void {
    // Restore some resources
    const systemFavorRestore = Math.ceil(this.character.systemFavorMax / 2);
    this.updateCharacter({
      systemFavorCurrent: Math.min(this.character.systemFavorMax, this.character.systemFavorCurrent + systemFavorRestore),
      hitPoints: {
        ...this.character.hitPoints,
        temp: 0 // Clear temporary HP
      }
    });

    // Restore spell slots for pact casters
    if (this.character.class === 'warlock') {
      // Warlocks restore all pact slots on short rest
      const pactLevel = Math.ceil(this.character.level / 2);
      const slotKey = `level${pactLevel}` as keyof typeof this.character.spellSlots;
      this.updateCharacter({
        spellSlots: {
          ...this.character.spellSlots,
          [slotKey]: 2 // Warlocks get 2 pact slots
        }
      });
    }
  }

  // Rest (long rest)
  longRest(): void {
    // Restore all resources
    this.updateCharacter({
      systemFavorCurrent: this.character.systemFavorMax,
      hitPoints: {
        ...this.character.hitPoints,
        current: this.character.hitPoints.max,
        temp: 0
      },
      spellSlots: this.getFullSpellSlots()
    });

    // Restore system favor (replaces shadow energy)
    this.updateCharacter({
      systemFavorCurrent: this.character.systemFavorMax
    });
  }

  // Get full spell slots for character
  private getFullSpellSlots() {
    const slots = this.character.spellSlots;
    // This would need to be calculated based on class and level
    // For now, just return current slots (would need proper calculation)
    return slots;
  }

  // Get character summary
  getCharacterSummary() {
    return {
      name: this.character.name || 'Unnamed Character',
      level: this.character.level,
      class: this.character.class,
      race: this.character.race,
      background: this.character.background,
      abilities: this.character.abilities,
      hp: {
        current: this.character.hitPoints.current,
        max: this.character.hitPoints.max,
        temp: this.character.hitPoints.temp
      },
      ac: this.character.armorClass,
      proficiencyBonus: this.character.proficiencyBonus,
      systemFavor: {
        current: this.character.systemFavorCurrent,
        max: this.character.systemFavorMax
      },
      monarchPower: this.character.activeMonarch ? {
        current: this.character.systemFavorCurrent,
        max: this.character.systemFavorMax
      } : undefined,
      spellSlots: this.character.spellSlots,
      skills: this.character.skillProficiencies,
      saves: this.character.savingThrowProficiencies,
      equipment: this.character.equipment.length,
      powers: this.character.knownPowers.length,
      monarchUnlocks: this.character.monarchUnlocks?.length || 0,
      shadowSoldiers: this.character.shadowSoldiers?.length || 0,
      runeInscriptions: this.character.runeInscriptions?.length || 0
    };
  }

  // Get combat summary
  getCombatSummary() {
    return {
      isActive: this.combatState.isActive,
      initiative: this.combatState.initiative,
      currentTurn: this.combatState.currentTurn,
      actionsRemaining: 1 - this.combatState.actionsTaken,
      bonusActionsRemaining: 1 - this.combatState.bonusActionsTaken,
      reactionsRemaining: this.combatState.reactionsAvailable,
      movementRemaining: this.combatState.movementRemaining,
      concentrationActive: this.combatState.concentrationActive,
      systemFavorUsed: this.combatState.systemFavorUsed,
      monarchPowerUsed: this.combatState.monarchPowerUsed
    };
  }
}

// Factory function to create unified character from creation options
export function createUnifiedSystemCharacter(options: UnifiedCharacterCreation): UnifiedSystem {
  const character = createUnifiedCharacter(options);
  return new UnifiedSystem(character);
}

// Validate unified character creation
export function validateUnifiedSystemCharacter(options: UnifiedCharacterCreation) {
  return validateUnifiedCharacter(options);
}

// Get available classes
export function getAvailableClasses(): UnifiedClass[] {
  return Object.keys(unifiedClassPackages) as UnifiedClass[];
}

// Get class package information
export function getClassPackage(classType: UnifiedClass) {
  return unifiedClassPackages[classType];
}

// Get ability modifier
export function getAbilityModifier(ability: keyof UnifiedAbilityScores, score: number): number {
  return getUnifiedAbilityModifier(ability, score);
}

// Get proficiency bonus
export function getProficiencyBonus(level: number): number {
  return getUnifiedProficiencyBonus(level);
}

// Export all types and interfaces for external use
export type {
  UnifiedCharacter,
  UnifiedClass,
  UnifiedAbilityScores,
  UnifiedCharacterCreation,
  UnifiedSpell,
  UnifiedCombatState,
  UnifiedCombatEncounter
};

// Export constants
export const UNIFIED_SYSTEM_VERSION = '1.0.0';
export const UNIFIED_SYSTEM_NAME = 'System Ascendant + SRD 5e Unified System';

// System configuration
export const UNIFIED_CONFIG = {
  // Ability score limits
  MIN_ABILITY_SCORE: 1,
  MAX_ABILITY_SCORE: 20,
  STANDARD_ARRAY: [15, 14, 13, 12, 10, 8],
  
  // Level limits
  MIN_LEVEL: 1,
  MAX_LEVEL: 20,
  
  // Combat limits
  MAX_ACTIONS_PER_TURN: 1,
  MAX_BONUS_ACTIONS_PER_TURN: 1,
  MAX_REACTIONS_PER_TURN: 1,
  
  // Resource limits
  MAX_SYSTEM_FAVOR: 6,
  MAX_SHADOW_ENERGY: 40,
  
  // Spell limits
  MAX_SPELL_LEVEL: 9,
  MAX_CANTRIPS: 6,
  
  // Equipment limits
  MAX_EQUIPMENT_SLOTS: 20,
  MAX_RUNE_INSCRIPTIONS: 10,
  
  // System Ascendant specific
  MAX_MONARCH_UNLOCKS: 10,
  MAX_SHADOW_SOLDIERS: 5,
  
  // Combat ranges
  MELEE_RANGE: 5,
  RANGED_RANGE: 120,
  SPELL_RANGE_MAX: 300
};

// Utility functions
export const UnifiedUtils = {
  // Format ability score with modifier
  formatAbility(score: number): string {
    const mod = getUnifiedAbilityModifier('STR' as keyof UnifiedAbilityScores, score);
    return `${score} (${mod >= 0 ? '+' : ''}${mod})`;
  },

  // Format HP with status
  formatHP(current: number, max: number, temp: number = 0): string {
    const total = current + temp;
    const status = current <= 0 ? 'Unconscious' : current < max / 2 ? 'Wounded' : 'Healthy';
    return `${total}/${max} HP (${status})${temp > 0 ? ` (+${temp} temp)` : ''}`;
  },

  // Format spell slots
  formatSpellSlots(slots: Record<string, number>): string {
    const activeSlots = Object.entries(slots)
      .filter(([_, count]) => count > 0)
      .map(([level, count]) => `${level}: ${count}`)
      .join(', ');
    return activeSlots || 'No spell slots remaining';
  },

  // Calculate proficiency bonus
  getProficiencyBonus(level: number): number {
    return Math.floor((level - 1) / 4) + 2;
  },

  // Check if character is spellcaster
  isSpellcaster(classType: UnifiedClass): boolean {
    const spellcasters: UnifiedClass[] = ['mage', 'warlock', 'necromancer', 'technomancer', 'paladin', 'ranger'];
    return spellcasters.includes(classType);
  },

  // Check if character uses shadow energy (monarch-only)
  usesShadowEnergy(classType: UnifiedClass, isMonarch: boolean = false): boolean {
    return isMonarch; // Only monarchs can use shadow energy
  },

  // Get class primary abilities
  getPrimaryAbilities(classType: UnifiedClass): (keyof UnifiedAbilityScores)[] {
    return unifiedClassPackages[classType].primaryAbilities;
  },

  // Format challenge rating
  formatCR(cr: number): string {
    if (cr < 1) return `1/${Math.round(1/cr)}`;
    if (cr <= 20) return cr.toString();
    return `${cr/10} (CR ${cr})`;
  },

  // Calculate experience from CR
  calculateXP(cr: number): number {
    const xpTable: Record<number, number> = {
      0: 10, 0.125: 25, 0.25: 50, 0.5: 100, 1: 200, 2: 450, 3: 700, 4: 1100,
      5: 1800, 6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900, 11: 7200, 12: 8400,
      13: 10000, 14: 11500, 15: 13000, 16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000
    };
    return xpTable[cr] || 0;
  }
};

