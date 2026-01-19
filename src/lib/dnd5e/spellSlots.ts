/**
 * D&D 5e Spell Slots System
 * Manages spell slots for spellcasting classes
 */

export interface SpellSlots {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
  level7: number;
  level8: number;
  level9: number;
}

export interface SpellSlotState {
  total: SpellSlots;
  used: SpellSlots;
  available: SpellSlots;
}

export interface SpellCastingClass {
  name: string;
  spellcastingAbility: keyof SpellSlots;
  spellProgression: 'full' | 'half' | 'third' | 'pact' | 'artificer';
  pactMagic?: {
    pactLevel: number;
    pactSlots: number;
  };
}

// Spell slot progression by level for full casters
const fullCasterProgression: Record<number, SpellSlots> = {
  1: { level1: 2, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  2: { level1: 3, level2: 0, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  3: { level1: 4, level2: 2, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  4: { level1: 4, level2: 3, level3: 0, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  5: { level1: 4, level2: 3, level3: 2, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  6: { level1: 4, level2: 3, level3: 3, level4: 0, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  7: { level1: 4, level2: 3, level3: 3, level4: 1, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  8: { level1: 4, level2: 3, level3: 3, level4: 2, level5: 0, level6: 0, level7: 0, level8: 0, level9: 0 },
  9: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 1, level6: 0, level7: 0, level8: 0, level9: 0 },
  10: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 0, level7: 0, level8: 0, level9: 0 },
  11: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 0, level8: 0, level9: 0 },
  12: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 0, level8: 0, level9: 0 },
  13: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 0, level9: 0 },
  14: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 0, level9: 0 },
  15: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 0 },
  16: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 0 },
  17: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 2, level6: 1, level7: 1, level8: 1, level9: 1 },
  18: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 1, level7: 1, level8: 1, level9: 1 },
  19: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 2, level7: 1, level8: 1, level9: 1 },
  20: { level1: 4, level2: 3, level3: 3, level4: 3, level5: 3, level6: 2, level7: 2, level8: 1, level9: 1 }
};

// Pact magic progression for Warlocks
const pactMagicProgression: Record<number, { pactLevel: number; pactSlots: number }> = {
  1: { pactLevel: 1, pactSlots: 1 },
  2: { pactLevel: 1, pactSlots: 1 },
  3: { pactLevel: 2, pactSlots: 2 },
  4: { pactLevel: 2, pactSlots: 2 },
  5: { pactLevel: 3, pactSlots: 2 },
  6: { pactLevel: 3, pactSlots: 2 },
  7: { pactLevel: 4, pactSlots: 2 },
  8: { pactLevel: 4, pactSlots: 2 },
  9: { pactLevel: 5, pactSlots: 2 },
  10: { pactLevel: 5, pactSlots: 2 },
  11: { pactLevel: 5, pactSlots: 3 },
  12: { pactLevel: 5, pactSlots: 3 },
  13: { pactLevel: 5, pactSlots: 3 },
  14: { pactLevel: 5, pactSlots: 3 },
  15: { pactLevel: 5, pactSlots: 3 },
  16: { pactLevel: 5, pactSlots: 3 },
  17: { pactLevel: 5, pactSlots: 3 },
  18: { pactLevel: 5, pactSlots: 3 },
  19: { pactLevel: 5, pactSlots: 3 },
  20: { pactLevel: 5, pactSlots: 3 }
};

// Initialize spell slots for a character
export function initializeSpellSlots(
  level: number,
  castingClass: SpellCastingClass
): SpellSlotState {
  let total: SpellSlots;

  switch (castingClass.spellProgression) {
    case 'full':
      total = fullCasterProgression[level] || createEmptySpellSlots();
      break;
    case 'half':
      total = getHalfCasterSlots(level);
      break;
    case 'third':
      total = getThirdCasterSlots(level);
      break;
    case 'pact':
      total = getPactCasterSlots(level);
      break;
    case 'artificer':
      total = getArtificerSlots(level);
      break;
    default:
      total = createEmptySpellSlots();
  }

  return {
    total,
    used: createEmptySpellSlots(),
    available: total
  };
}

// Create empty spell slots
function createEmptySpellSlots(): SpellSlots {
  return {
    level1: 0,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    level6: 0,
    level7: 0,
    level8: 0,
    level9: 0
  };
}

// Get half caster spell slots (Paladin, Ranger)
function getHalfCasterSlots(level: number): SpellSlots {
  const fullCasterLevel = Math.ceil(level / 2);
  return fullCasterProgression[fullCasterLevel] || createEmptySpellSlots();
}

// Get third caster spell slots (Eldritch Knight)
function getThirdCasterSlots(level: number): SpellSlots {
  const fullCasterLevel = Math.ceil(level / 3);
  return fullCasterProgression[fullCasterLevel] || createEmptySpellSlots();
}

// Get pact caster spell slots (Warlock)
function getPactCasterSlots(level: number): SpellSlots {
  const pactInfo = pactMagicProgression[level];
  const slots = createEmptySpellSlots();
  
  if (pactInfo) {
    // Warlock slots are at their pact level
    const slotKey = `level${pactInfo.pactLevel}` as keyof SpellSlots;
    slots[slotKey] = pactInfo.pactSlots;
  }
  
  return slots;
}

// Get artificer spell slots
function getArtificerSlots(level: number): SpellSlots {
  const fullCasterLevel = Math.ceil(level / 2);
  return fullCasterProgression[fullCasterLevel] || createEmptySpellSlots();
}

// Use a spell slot
export function useSpellSlot(
  state: SpellSlotState,
  level: keyof SpellSlots
): SpellSlotState {
  if (state.available[level] <= 0) {
    throw new Error(`No ${level} spell slots available`);
  }

  const newUsed = { ...state.used };
  const newAvailable = { ...state.available };
  
  newUsed[level] = state.used[level] + 1;
  newAvailable[level] = state.available[level] - 1;

  return {
    ...state,
    used: newUsed,
    available: newAvailable
  };
}

// Restore spell slots (on long rest)
export function restoreSpellSlots(state: SpellSlotState): SpellSlotState {
  return {
    ...state,
    used: createEmptySpellSlots(),
    available: state.total
  };
}

// Restore some spell slots (on short rest for Warlocks)
export function restorePactSlots(state: SpellSlotState): SpellSlotState {
  // For Warlocks, restore all pact slots
  const newUsed = { ...state.used };
  const newAvailable = { ...state.available };

  // Find the highest level with slots (pact slots)
  for (let level = 9; level >= 1; level--) {
    const slotKey = `level${level}` as keyof SpellSlots;
    if (state.total[slotKey] > 0) {
      newUsed[slotKey] = 0;
      newAvailable[slotKey] = state.total[slotKey];
      break;
    }
  }

  return {
    ...state,
    used: newUsed,
    available: newAvailable
  };
}

// Get spell slot status
export function getSpellSlotStatus(state: SpellSlotState): {
  [key in keyof SpellSlots]: { total: number; used: number; available: number };
} {
  const status = {} as ReturnType<typeof getSpellSlotStatus>;
  
  for (const level in state.total) {
    const levelKey = level as keyof SpellSlots;
    status[levelKey] = {
      total: state.total[levelKey],
      used: state.used[levelKey],
      available: state.available[levelKey]
    };
  }
  
  return status;
}

// Check if spell slot is available
export function canCastSpell(state: SpellSlotState, level: keyof SpellSlots): boolean {
  return state.available[level] > 0;
}

// Get highest available spell slot
export function getHighestAvailableSlot(state: SpellSlotState): keyof SpellSlots | null {
  for (let level = 9; level >= 1; level--) {
    const slotKey = `level${level}` as keyof SpellSlots;
    if (state.available[slotKey] > 0) {
      return slotKey;
    }
  }
  return null;
}
