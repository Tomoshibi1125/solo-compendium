/**
 * D&D 5e Integration System
 * Provides dual system support for Solo Leveling and D&D 5e mechanics
 */

import { Dnd5eCharacter, getDnd5eAbilityModifier, getDnd5eProficiencyBonus, Dnd5eSkill } from './rulesEngine';
import { ConcentrationState, initializeConcentration } from './concentration';
import { SpellSlotState, initializeSpellSlots, SpellSlots } from './spellSlots';
import { DeathSaveState, initializeDeathSaves } from './deathSaves';

export type RulesSystem = 'solo-leveling' | 'dnd5e' | 'hybrid';

export interface DualSystemCharacter {
  // Solo Leveling system
  soloLeveling: {
    level: number;
    abilities: Record<string, number>;
    job: string;
    path?: string;
    // Other Solo Leveling specific properties
  };
  
  // D&D 5e system
  dnd5e: Dnd5eCharacter;
  
  // Active system
  activeSystem: RulesSystem;
  
  // Shared state
  concentration: ConcentrationState;
  spellSlots: SpellSlotState;
  deathSaves: DeathSaveState;
}

// Convert Solo Leveling abilities to D&D 5e abilities
export function convertSoloLevelingToDnd5e(soloAbilities: Record<string, number>): Dnd5eCharacter['abilityScores'] {
  return {
    strength: soloAbilities.STR || 10,
    dexterity: soloAbilities.AGI || 10,
    constitution: soloAbilities.VIT || 10,
    intelligence: soloAbilities.INT || 10,
    wisdom: soloAbilities.SENSE || 10,
    charisma: soloAbilities.PRE || 10
  };
}

// Convert D&D 5e abilities to Solo Leveling abilities
export function convertDnd5eToSoloLeveling(dndAbilities: Dnd5eCharacter['abilityScores']): Record<string, number> {
  return {
    STR: dndAbilities.strength,
    AGI: dndAbilities.dexterity,
    VIT: dndAbilities.constitution,
    INT: dndAbilities.intelligence,
    SENSE: dndAbilities.wisdom,
    PRE: dndAbilities.charisma
  };
}

// Initialize dual system character
export function initializeDualSystemCharacter(
  soloLevelingData: any,
  rulesSystem: RulesSystem = 'solo-leveling'
): DualSystemCharacter {
  const dnd5eAbilities = convertSoloLevelingToDnd5e(soloLevelingData.abilities || {});
  
  const dnd5eCharacter: Dnd5eCharacter = {
    level: soloLevelingData.level || 1,
    abilityScores: dnd5eAbilities,
    skillProficiencies: [], // Would need to be mapped from Solo Leveling skills
    savingThrowProficiencies: [], // Would need to be mapped from Solo Leveling saves
    proficiencyBonus: getDnd5eProficiencyBonus(soloLevelingData.level || 1),
    class: soloLevelingData.job || 'Commoner',
    subclass: soloLevelingData.path,
    race: 'Human', // Default for Solo Leveling
    background: 'Adventurer' // Default for Solo Leveling
  };

  return {
    soloLeveling: soloLevelingData,
    dnd5e: dnd5eCharacter,
    activeSystem: rulesSystem,
    concentration: initializeConcentration(),
    spellSlots: initializeSpellSlots(soloLevelingData.level || 1, {
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
  if (character.activeSystem === 'solo-leveling' || character.activeSystem === 'hybrid') {
    return character.soloLeveling.abilities;
  } else {
    return convertDnd5eToSoloLeveling(character.dnd5e.abilityScores);
  }
}

// Get current proficiency bonus based on active system
export function getCurrentProficiencyBonus(character: DualSystemCharacter): number {
  if (character.activeSystem === 'solo-leveling' || character.activeSystem === 'hybrid') {
    // Solo Leveling might use a different formula
    return Math.floor((character.soloLeveling.level - 1) / 4) + 2;
  } else {
    return character.dnd5e.proficiencyBonus;
  }
}

// Get current level (both systems should be synchronized)
export function getCurrentLevel(character: DualSystemCharacter): number {
  return character.soloLeveling.level; // Both systems should use the same level
}

// Calculate unified armor class
export function calculateUnifiedArmorClass(
  character: DualSystemCharacter,
  armorType?: string,
  shield?: boolean
): number {
  if (character.activeSystem === 'dnd5e') {
    // Use D&D 5e AC calculation
    const abilities = character.dnd5e.abilityScores;
    const dexMod = getDnd5eAbilityModifier(abilities.dexterity);
    
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
    // Use Solo Leveling AC calculation (would need to be implemented)
    const abilities = character.soloLeveling.abilities;
    const agiMod = Math.floor((abilities.AGI - 10) / 2);
    return 10 + agiMod + (shield ? 2 : 0);
  }
}

// Get unified skill modifier
export function getUnifiedSkillModifier(
  character: DualSystemCharacter,
  skill: string
): number {
  if (character.activeSystem === 'dnd5e') {
    // Use D&D 5e skill calculation
    const dndSkill = mapSoloSkillToDnd5e(skill);
    if (dndSkill) {
      const skillProf = character.dnd5e.skillProficiencies.find(p => p.skill === dndSkill);
      const ability = getSkillAbilityForDnd5e(dndSkill);
      const abilityMod = getDnd5eAbilityModifier(character.dnd5e.abilityScores[ability]);
      const profBonus = skillProf?.proficient ? character.dnd5e.proficiencyBonus : 0;
      const expertiseBonus = skillProf?.expertise ? character.dnd5e.proficiencyBonus : 0;
      
      return abilityMod + profBonus + expertiseBonus;
    }
  }
  
  // Use Solo Leveling skill calculation (would need to be implemented)
  const abilities = character.soloLeveling.abilities;
  return Math.floor((abilities.AGI - 10) / 2); // Simplified
}

// Map Solo Leveling skills to D&D 5e skills
function mapSoloSkillToDnd5e(soloSkill: string): Dnd5eSkill | null {
  const skillMap: Record<string, Dnd5eSkill> = {
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
  
  return skillMap[soloSkill.toLowerCase()] || null;
}

// Get ability for D&D 5e skill
function getSkillAbilityForDnd5e(skill: Dnd5eSkill): keyof Dnd5eCharacter['abilityScores'] {
  const skillAbilities: Record<Dnd5eSkill, keyof Dnd5eCharacter['abilityScores']> = {
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
