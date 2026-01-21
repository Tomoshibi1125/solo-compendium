/**
 * SRD 5e Concentration System
 * Manages concentration mechanics for spells and abilities
 */

export interface ConcentrationEffect {
  id: string;
  name: string;
  description: string;
  duration: number; // in rounds
  remainingRounds: number;
  concentrationDC?: number;
  breakOnDamage?: boolean;
}

export interface ConcentrationState {
  isConcentrating: boolean;
  currentEffect: ConcentrationEffect | null;
  concentrationCheckDC?: number;
  damageTakenThisRound: number;
}

// Initialize concentration state
export function initializeConcentration(): ConcentrationState {
  return {
    isConcentrating: false,
    currentEffect: null,
    damageTakenThisRound: 0
  };
}

// Start concentrating on a spell or ability
export function startConcentration(
  state: ConcentrationState,
  effect: Omit<ConcentrationEffect, 'remainingRounds'>
): ConcentrationState {
  return {
    ...state,
    isConcentrating: true,
    currentEffect: {
      ...effect,
      remainingRounds: effect.duration
    },
    damageTakenThisRound: 0
  };
}

// Maintain concentration (called at start of turn)
export function maintainConcentration(state: ConcentrationState): ConcentrationState {
  if (!state.isConcentrating || !state.currentEffect) {
    return state;
  }

  const newRemainingRounds = state.currentEffect.remainingRounds - 1;
  
  if (newRemainingRounds <= 0) {
    // Concentration ends naturally
    return {
      ...state,
      isConcentrating: false,
      currentEffect: null,
      damageTakenThisRound: 0
    };
  }

  return {
    ...state,
    currentEffect: {
      ...state.currentEffect,
      remainingRounds: newRemainingRounds
    },
    damageTakenThisRound: 0
  };
}

// Take damage while concentrating
export function takeConcentrationDamage(
  state: ConcentrationState,
  damage: number
): ConcentrationState {
  if (!state.isConcentrating) {
    return state;
  }

  const totalDamage = state.damageTakenThisRound + damage;
  
  // Check if concentration breaks
  const breaksConcentration = checkConcentrationBreak(state, totalDamage);
  
  if (breaksConcentration) {
    return {
      ...state,
      isConcentrating: false,
      currentEffect: null,
      damageTakenThisRound: 0
    };
  }

  return {
    ...state,
    damageTakenThisRound: totalDamage
  };
}

// Check if concentration breaks from damage
function checkConcentrationBreak(state: ConcentrationState, damage: number): boolean {
  // If damage is 0 or less, concentration doesn't break
  if (damage <= 0) {
    return false;
  }

  // If damage is 10 or half of max HP (rounded down), concentration breaks
  // For simplicity, we'll use a fixed threshold of 10 damage
  if (damage >= 10) {
    return true;
  }

  // If there's a concentration DC, make a Constitution saving throw
  if (state.concentrationCheckDC) {
    // This would need to be resolved by the character's Constitution save
    // For now, we'll return false and let the calling code handle the save
    return false;
  }

  return false;
}

// End concentration voluntarily
export function endConcentration(state: ConcentrationState): ConcentrationState {
  return {
    ...state,
    isConcentrating: false,
    currentEffect: null,
    damageTakenThisRound: 0
  };
}

// Make concentration saving throw
export function makeConcentrationSave(
  state: ConcentrationState,
  conSaveModifier: number,
  dc: number
): { success: boolean; newState: ConcentrationState } {
  const roll = Math.floor(Math.random() * 20) + 1 + conSaveModifier;
  const success = roll >= dc;

  if (!success) {
    return {
      success: false,
      newState: {
        ...state,
        isConcentrating: false,
        currentEffect: null,
        damageTakenThisRound: 0
      }
    };
  }

  return {
    success: true,
    newState: {
      ...state,
      damageTakenThisRound: 0
    }
  };
}

// Get concentration status for display
export function getConcentrationStatus(state: ConcentrationState): {
  isConcentrating: boolean;
  effectName?: string;
  remainingRounds?: number;
  description?: string;
} {
  if (!state.isConcentrating || !state.currentEffect) {
    return {
      isConcentrating: false
    };
  }

  return {
    isConcentrating: true,
    effectName: state.currentEffect.name,
    remainingRounds: state.currentEffect.remainingRounds,
    description: state.currentEffect.description
  };
}

