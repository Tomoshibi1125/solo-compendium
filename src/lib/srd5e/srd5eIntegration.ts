/**
 * SRD 5e Integration System
 * Provides dual system support for System Ascendant and SRD 5e mechanics
 */

import { Srd5eCharacter, getSrd5eAbilityModifier, getSrd5eProficiencyBonus, Srd5eSkill } from './rulesEngine';
import { ConcentrationState, initializeConcentration } from './concentration';
import { SpellSlotState, initializeSpellSlots, SpellSlots } from './spellSlots';
import { DeathSaveState, initializeDeathSaves } from './deathSaves';

export type RulesSystem = 'system-ascendant' | 'srd5e' | 'hybrid';

export interface DualSystemCharacter {
  // System Ascendant system
  systemAscendant: {
    level: number;
    abilities: Record<string, number>;
    job: string;
    path?: string;
    // Other System Ascendant specific properties
  };
  
  // SRD 5e system
  srd5e: Srd5eCharacter;
  
  // Active system
  activeSystem: RulesSystem;
  
  // Shared state
  concentration: ConcentrationState;
  spellSlots: SpellSlotState;
  deathSaves: DeathSaveState;
}

// Convert System Ascendant abilities to SRD 5e abilities
export function convertSystemAscendantToSrd5e(systemAbilities: Record<string, number>): Srd5eCharacter['abilityScores'] {
  return {
    strength: systemAbilities.STR || 10,
    dexterity: systemAbilities.AGI || 10,
    constitution: systemAbilities.VIT || 10,
    intelligence: systemAbilities.INT || 10,
    wisdom: systemAbilities.SENSE || 10,
    charisma: systemAbilities.PRE || 10
  };
}

// Convert SRD 5e abilities to System Ascendant abilities
export function convertSrd5eToSystemAscendant(srdAbilities: Srd5eCharacter['abilityScores']): Record<string, number> {
  return {
    STR: srdAbilities.strength,
    AGI: srdAbilities.dexterity,
    VIT: srdAbilities.constitution,
    INT: srdAbilities.intelligence,
    SENSE: srdAbilities.wisdom,
    PRE: srdAbilities.charisma
  };
}

// Initialize dual system character
export function initializeDualSystemCharacter(
  systemAscendantData: any,
  rulesSystem: RulesSystem = 'system-ascendant'
): DualSystemCharacter {
  const srd5eAbilities = convertSystemAscendantToSrd5e(systemAscendantData.abilities || {});
  
  const srd5eCharacter: Srd5eCharacter = {
    level: systemAscendantData.level || 1,
    abilityScores: srd5eAbilities,
    skillProficiencies: [], // Would need to be mapped from System Ascendant skills
    savingThrowProficiencies: [], // Would need to be mapped from System Ascendant saves
    proficiencyBonus: getSrd5eProficiencyBonus(systemAscendantData.level || 1),
    class: systemAscendantData.job || 'Commoner',
    subclass: systemAscendantData.path,
    race: 'Human', // Default for System Ascendant
    background: 'Adventurer' // Default for System Ascendant
  };

  return {
    systemAscendant: systemAscendantData,
    srd5e: srd5eCharacter,
    activeSystem: rulesSystem,
    concentration: initializeConcentration(),
    spellSlots: initializeSpellSlots(systemAscendantData.level || 1, {
      name: 'Mage',
      spellcastingAbility: 'level3' as keyof SpellSlots,
      spellProgression: 'full'
    }),
    deathSaves: initializeDeathSaves()
  };
}

// Switch active rules system
export function switchRulesSystem(
  character: DualSystemCharacter,
  newSystem: RulesSystem
): DualSystemCharacter {
  return {
    ...character,
    activeSystem: newSystem
  };
}

// Get current ability scores based on active system
export function getCurrentAbilityScores(character: DualSystemCharacter): Record<string, number> {
  if (character.activeSystem === 'system-ascendant' || character.activeSystem === 'hybrid') {
    return character.systemAscendant.abilities;
  } else {
    return convertSrd5eToSystemAscendant(character.srd5e.abilityScores);
  }
}

// Get current proficiency bonus based on active system
export function getCurrentProficiencyBonus(character: DualSystemCharacter): number {
  if (character.activeSystem === 'system-ascendant' || character.activeSystem === 'hybrid') {
    // System Ascendant might use a different formula
    return Math.floor((character.systemAscendant.level - 1) / 4) + 2;
  } else {
    return character.srd5e.proficiencyBonus;
  }
}

// Get current level (both systems should be synchronized)
export function getCurrentLevel(character: DualSystemCharacter): number {
  return character.systemAscendant.level; // Both systems should use the same level
}

// Calculate unified armor class
export function calculateUnifiedArmorClass(
  character: DualSystemCharacter,
  armorType?: string,
  shield?: boolean
): number {
  if (character.activeSystem === 'srd5e') {
    // Use SRD 5e AC calculation
    const abilities = character.srd5e.abilityScores;
    const dexMod = getSrd5eAbilityModifier(abilities.dexterity);
    
    switch (armorType) {
      case 'light':
        return 10 + dexMod + (shield ? 2 : 0);
      case 'medium':
        return 10 + Math.min(dexMod, 2) + (shield ? 2 : 0);
      case 'heavy':
        return 10 + (shield ? 2 : 0);
      default:
        return 10 + dexMod + (shield ? 2 : 0);
    }
  } else {
    // Use System Ascendant AC calculation (would need to be implemented)
    const abilities = character.systemAscendant.abilities;
    const agiMod = Math.floor((abilities.AGI - 10) / 2);
    return 10 + agiMod + (shield ? 2 : 0);
  }
}

// Get unified skill modifier
export function getUnifiedSkillModifier(
  character: DualSystemCharacter,
  skill: string
): number {
  if (character.activeSystem === 'srd5e') {
    // Use SRD 5e skill calculation
    const srdSkill = mapSystemSkillToSrd5e(skill);
    if (srdSkill) {
      const skillProf = character.srd5e.skillProficiencies.find(p => p.skill === srdSkill);
      const ability = getSkillAbilityForSrd5e(srdSkill);
      const abilityMod = getSrd5eAbilityModifier(character.srd5e.abilityScores[ability]);
      const profBonus = skillProf?.proficient ? character.srd5e.proficiencyBonus : 0;
      const expertiseBonus = skillProf?.expertise ? character.srd5e.proficiencyBonus : 0;
      
      return abilityMod + profBonus + expertiseBonus;
    }
  }
  
  // Use System Ascendant skill calculation (would need to be implemented)
  const abilities = character.systemAscendant.abilities;
  return Math.floor((abilities.AGI - 10) / 2); // Simplified
}

// Map System Ascendant skills to SRD 5e skills
function mapSystemSkillToSrd5e(systemSkill: string): Srd5eSkill | null {
  const skillMap: Record<string, Srd5eSkill> = {
    'athletics': 'athletics',
    'acrobatics': 'acrobatics',
    'stealth': 'stealth',
    'perception': 'perception',
    'investigation': 'investigation',
    'insight': 'insight',
    'intimidation': 'intimidation',
    'persuasion': 'persuasion',
    'deception': 'deception'
  };
  
  return skillMap[systemSkill.toLowerCase()] || null;
}

// Get ability for SRD 5e skill
function getSkillAbilityForSrd5e(skill: Srd5eSkill): keyof Srd5eCharacter['abilityScores'] {
  const skillAbilities: Record<Srd5eSkill, keyof Srd5eCharacter['abilityScores']> = {
    'athletics': 'strength',
    'acrobatics': 'dexterity',
    'sleight-of-hand': 'dexterity',
    'stealth': 'dexterity',
    'arcana': 'intelligence',
    'history': 'intelligence',
    'investigation': 'intelligence',
    'nature': 'intelligence',
    'religion': 'intelligence',
    'animal-handling': 'wisdom',
    'insight': 'wisdom',
    'medicine': 'wisdom',
    'perception': 'wisdom',
    'survival': 'wisdom',
    'deception': 'charisma',
    'intimidation': 'charisma',
    'performance': 'charisma',
    'persuasion': 'charisma'
  };
  
  return skillAbilities[skill];
}

// Get character status summary
export function getCharacterStatus(character: DualSystemCharacter): {
  system: RulesSystem;
  level: number;
  hp: {
    current: number;
    max: number;
    temp: number;
  };
  ac: number;
  concentration: {
    active: boolean;
    effect?: string;
  };
  spellSlots: {
    [key: string]: { total: number; used: number; available: number };
  };
  deathSaves: {
    status: string;
    successes: number;
    failures: number;
  };
} {
  return {
    system: character.activeSystem,
    level: getCurrentLevel(character),
    hp: {
      current: 0, // Would need to be calculated
      max: 0, // Would need to be calculated
      temp: 0 // Would need to be calculated
    },
    ac: calculateUnifiedArmorClass(character),
    concentration: {
      active: character.concentration.isConcentrating,
      effect: character.concentration.currentEffect?.name
    },
    spellSlots: {
      level1: { total: character.spellSlots.total.level1, used: character.spellSlots.used.level1, available: character.spellSlots.available.level1 },
      level2: { total: character.spellSlots.total.level2, used: character.spellSlots.used.level2, available: character.spellSlots.available.level2 },
      level3: { total: character.spellSlots.total.level3, used: character.spellSlots.used.level3, available: character.spellSlots.available.level3 },
      level4: { total: character.spellSlots.total.level4, used: character.spellSlots.used.level4, available: character.spellSlots.available.level4 },
      level5: { total: character.spellSlots.total.level5, used: character.spellSlots.used.level5, available: character.spellSlots.available.level5 },
      level6: { total: character.spellSlots.total.level6, used: character.spellSlots.used.level6, available: character.spellSlots.available.level6 },
      level7: { total: character.spellSlots.total.level7, used: character.spellSlots.used.level7, available: character.spellSlots.available.level7 },
      level8: { total: character.spellSlots.total.level8, used: character.spellSlots.used.level8, available: character.spellSlots.available.level8 },
      level9: { total: character.spellSlots.total.level9, used: character.spellSlots.used.level9, available: character.spellSlots.available.level9 }
    },
    deathSaves: {
      status: character.deathSaves.isDead ? 'dead' : character.deathSaves.isStable ? 'stable' : 'dying',
      successes: character.deathSaves.deathSaveSuccesses,
      failures: character.deathSaves.deathSaveFailures
    }
  };
}



