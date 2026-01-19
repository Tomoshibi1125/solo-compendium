/**
 * D&D 5e Death Saving Throws System
 * Manages death saving throws and stabilization
 */

export interface DeathSaveState {
  deathSaveSuccesses: number;
  deathSaveFailures: number;
  isStable: boolean;
  isDead: boolean;
  lastDamageTime?: number;
  damageTakenSinceLastSave?: number;
}

export interface DeathSaveResult {
  roll: number;
  modifier: number;
  total: number;
  success: boolean;
  criticalSuccess: boolean;
  criticalFailure: boolean;
  newState: DeathSaveState;
}

// Initialize death save state
export function initializeDeathSaves(): DeathSaveState {
  return {
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    isStable: false,
    isDead: false
  };
}

// Make a death saving throw
export function makeDeathSave(
  state: DeathSaveState,
  modifier: number = 0,
  advantage: boolean = false,
  disadvantage: boolean = false
): DeathSaveResult {
  // Roll 1d20 with advantage/disadvantage
  const roll1 = Math.floor(Math.random() * 20) + 1;
  const roll2 = Math.floor(Math.random() * 20) + 1;
  
  let roll = roll1;
  if (advantage && !disadvantage) {
    roll = Math.max(roll1, roll2);
  } else if (disadvantage && !advantage) {
    roll = Math.min(roll1, roll2);
  }
  
  const total = roll + modifier;
  
  // Check for critical success (20)
  const criticalSuccess = roll === 20;
  // Check for critical failure (1)
  const criticalFailure = roll === 1;
  
  // Determine success
  let success = total >= 10;
  
  // Apply critical effects
  if (criticalSuccess) {
    success = true;
    // Critical success: +2 successes, regain 1 HP
    return {
      roll,
      modifier,
      total,
      success: true,
      criticalSuccess: true,
      criticalFailure: false,
      newState: {
        ...state,
        deathSaveSuccesses: Math.min(state.deathSaveSuccesses + 2, 3),
        isStable: true
      }
    };
  }
  
  if (criticalFailure) {
    success = false;
    // Critical failure: +2 failures
    const newFailures = Math.min(state.deathSaveFailures + 2, 3);
    return {
      roll,
      modifier,
      total,
      success: false,
      criticalSuccess: false,
      criticalFailure: true,
      newState: {
        ...state,
        deathSaveFailures: newFailures,
        isDead: newFailures >= 3
      }
    };
  }
  
  // Normal save result
  let newState: DeathSaveState;
  
  if (success) {
    const newSuccesses = Math.min(state.deathSaveSuccesses + 1, 3);
    newState = {
      ...state,
      deathSaveSuccesses: newSuccesses,
      isStable: newSuccesses >= 3
    };
  } else {
    const newFailures = Math.min(state.deathSaveFailures + 1, 3);
    newState = {
      ...state,
      deathSaveFailures: newFailures,
      isDead: newFailures >= 3
    };
  }
  
  return {
    roll,
    modifier,
    total,
    success,
    criticalSuccess: false,
    criticalFailure: false,
    newState
  };
}

// Take damage while at 0 HP
export function takeDamageAtZeroHP(
  state: DeathSaveState,
  damage: number
): DeathSaveState {
  // If damage >= max HP, die instantly
  // For simplicity, we'll use 20 as a threshold for instant death
  if (damage >= 20) {
    return {
      ...state,
      isDead: true
    };
  }
  
  // Otherwise, fail a death save
  const newFailures = Math.min(state.deathSaveFailures + 1, 3);
  
  return {
    ...state,
    deathSaveFailures: newFailures,
    isDead: newFailures >= 3,
    lastDamageTime: Date.now(),
    damageTakenSinceLastSave: (state.damageTakenSinceLastSave || 0) + damage
  };
}

// Heal while at 0 HP
export function healAtZeroHP(
  state: DeathSaveState,
  healing: number
): DeathSaveState {
  if (healing > 0) {
    // Any healing resets death saves
    return initializeDeathSaves();
  }
  
  return state;
}

// Stabilize a character
export function stabilizeCharacter(state: DeathSaveState): DeathSaveState {
  return {
    ...state,
    isStable: true
  };
}

// Check if character needs to make death saves
export function needsDeathSaves(state: DeathSaveState): boolean {
  return !state.isDead && !state.isStable && (state.deathSaveSuccesses < 3 && state.deathSaveFailures < 3);
}

// Get death save status
export function getDeathSaveStatus(state: DeathSaveState): {
  status: 'healthy' | 'dying' | 'stable' | 'dead';
  successes: number;
  failures: number;
  message: string;
} {
  if (state.isDead) {
    return {
      status: 'dead',
      successes: state.deathSaveSuccesses,
      failures: state.deathSaveFailures,
      message: 'Character is dead.'
    };
  }
  
  if (state.isStable) {
    return {
      status: 'stable',
      successes: state.deathSaveSuccesses,
      failures: state.deathSaveFailures,
      message: 'Character is stable but unconscious.'
    };
  }
  
  if (state.deathSaveSuccesses >= 3) {
    return {
      status: 'stable',
      successes: state.deathSaveSuccesses,
      failures: state.deathSaveFailures,
      message: 'Character has stabilized.'
    };
  }
  
  if (state.deathSaveFailures >= 3) {
    return {
      status: 'dead',
      successes: state.deathSaveSuccesses,
      failures: state.deathSaveFailures,
      message: 'Character has died.'
    };
  }
  
  return {
    status: 'dying',
    successes: state.deathSaveSuccesses,
    failures: state.deathSaveFailures,
    message: `Character is dying (${state.deathSaveSuccesses} successes, ${state.deathSaveFailures} failures).`
  };
}

// Reset death saves (when character regains consciousness)
export function resetDeathSaves(): DeathSaveState {
  return initializeDeathSaves();
}

// Get death save probability
export function getDeathSaveProbability(
  state: DeathSaveState,
  modifier: number = 0,
  advantage: boolean = false
): { survivalChance: number; deathChance: number } {
  const successesNeeded = 3 - state.deathSaveSuccesses;
  const failuresAllowed = 3 - state.deathSaveFailures;
  
  if (successesNeeded <= 0) {
    return { survivalChance: 1.0, deathChance: 0.0 };
  }
  
  if (failuresAllowed <= 0) {
    return { survivalChance: 0.0, deathChance: 1.0 };
  }
  
  // Simplified probability calculation
  // In reality, this would be more complex due to critical successes/failures
  const successThreshold = 10 - modifier;
  const successProbability = advantage ? 
    (1 - Math.pow((1 - (21 - successThreshold) / 20), 2)) : // Advantage formula
    Math.max(0, Math.min(1, (21 - successThreshold) / 20)); // Normal formula
  
  // This is a simplified calculation - actual probability would need more complex math
  const survivalChance = Math.pow(successProbability, successesNeeded);
  const deathChance = 1 - survivalChance;
  
  return { survivalChance, deathChance };
}
