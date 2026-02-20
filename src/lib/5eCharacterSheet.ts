/**
 * 5e Character Sheet Integration with System Ascendant Flavor
 * Provides character sheet data structure and calculations
 */

import type { AbilityScore, Character } from './5eRulesEngine';
import { getAbilityModifier } from './5eRulesEngine';
import { calculateCharacterStats, calculateHPMax, getSpellSlotsPerLevel, getCasterType, getSpellcastingAbility } from './5eCharacterCalculations';
import { getCharacterSpellSlots, prepareSpells, type PreparedSpell } from './5eSpellSystem';
import { Formatters } from './5eUIIntegration';

// Character sheet data structure
export interface CharacterSheet {
  character: Character;
  calculated: {
    abilityModifiers: Record<AbilityScore, number>;
    savingThrows: Record<AbilityScore, number>;
    skills: Record<string, number>;
    proficiencyBonus: number;
    initiative: number;
    armorClass: number;
    speed: number;
    passivePerception: number;
    carryingCapacity: number;
  };
  spellcasting: {
    canCastSpells: boolean;
    spellSlots: Record<string, number>;
    spellSaveDC: number;
    spellAttackBonus: number;
    preparedSpells: PreparedSpell[];
    knownSpells: string[];
  };
  combat: {
    conditions: string[];
    exhaustionLevel: number;
    deathSaveSuccesses: number;
    deathSaveFailures: number;
    stable: boolean;
  };
  equipment: {
    weapons: string[];
    armor: string[];
    relics: string[];
    attunedRelics: string[];
    gold: number;
    weight: number;
  };
}

/**
 * Create a complete character sheet from character data
 */
export function createCharacterSheet(character: Character): CharacterSheet {
  // Calculate derived stats
  const calculated = calculateCharacterStats({
    level: character.level,
    abilities: character.abilities,
    savingThrowProficiencies: character.savingThrowProficiencies,
    skillProficiencies: character.skillProficiencies,
    skillExpertise: character.skillExpertise,
    armorClass: character.armorClass,
    speed: character.speed
  });

  // Calculate spellcasting information
  const spellcasting = calculateSpellcastingInfo(character);

  // Combat status
  const combat = {
    conditions: character.conditions || [],
    exhaustionLevel: character.exhaustionLevel || 0,
    deathSaveSuccesses: 0,
    deathSaveFailures: 0,
    stable: character.hitPoints.current > 0
  };

  // Equipment summary
  const equipment = {
    weapons: character.equipment || [],
    armor: [],
    relics: character.relics || [],
    attunedRelics: character.attunedRelics || [],
    gold: 0,
    weight: 0
  };

  return {
    character,
    calculated,
    spellcasting,
    combat,
    equipment
  };
}

/**
 * Calculate spellcasting information for character sheet
 */
function calculateSpellcastingInfo(character: Character) {
  const casterType = getCasterType(character.job);
  const canCastSpells = casterType !== 'none';
  
  if (!canCastSpells) {
    return {
      canCastSpells: false,
      spellSlots: {},
      spellSaveDC: 0,
      spellAttackBonus: 0,
      preparedSpells: [],
      knownSpells: []
    };
  }

  // Get spell slots
  const slots = getCharacterSpellSlots(character);
  const spellSlots: Record<string, number> = {};
  
  if (slots.cantrips > 0) spellSlots['cantrips'] = slots.cantrips;
  for (let level = 1; level <= 9; level++) {
    const slotKey = `level${level}` as keyof typeof slots;
    const count = slots[slotKey];
    if (count > 0) spellSlots[`level${level}`] = count;
  }

  // Calculate spell save DC and attack bonus
  const spellSaveDC = calculateSpellSaveDC(character);
  const spellAttackBonus = calculateSpellAttackBonus(character);

  return {
    canCastSpells: true,
    spellSlots,
    spellSaveDC,
    spellAttackBonus,
    preparedSpells: [],
    knownSpells: []
  };
}

/**
 * Calculate spell save DC
 */
function calculateSpellSaveDC(character: Character): number {
  const spellAbility = getSpellcastingAbility(character.job);
  const abilityMod = spellAbility ? getAbilityModifier(character.abilities[spellAbility]) : 0;
  return 8 + character.proficiencyBonus + abilityMod;
}

/**
 * Calculate spell attack bonus
 */
function calculateSpellAttackBonus(character: Character): number {
  const spellAbility = getSpellcastingAbility(character.job);
  const abilityMod = spellAbility ? getAbilityModifier(character.abilities[spellAbility]) : 0;
  return character.proficiencyBonus + abilityMod;
}

/**
 * Update character sheet after level up
 */
export function levelUpCharacter(character: Character, newLevel: number): CharacterSheet {
  const updatedCharacter = {
    ...character,
    level: newLevel,
    hitPoints: {
      ...character.hitPoints,
      max: calculateHPMax(newLevel, 8, Math.floor((character.abilities.VIT - 10) / 2))
    }
  };

  return createCharacterSheet(updatedCharacter);
}

/**
 * Update character sheet after taking damage
 */
export function applyDamage(characterSheet: CharacterSheet, damage: number): CharacterSheet {
  const newHP = Math.max(0, characterSheet.character.hitPoints.current - damage);
  
  const updatedCharacter = {
    ...characterSheet.character,
    hitPoints: {
      ...characterSheet.character.hitPoints,
      current: newHP
    }
  };

  return createCharacterSheet(updatedCharacter);
}

/**
 * Update character sheet after healing
 */
export function applyHealing(characterSheet: CharacterSheet, healing: number): CharacterSheet {
  const newHP = Math.min(
    characterSheet.character.hitPoints.max,
    characterSheet.character.hitPoints.current + healing
  );
  
  const updatedCharacter = {
    ...characterSheet.character,
    hitPoints: {
      ...characterSheet.character.hitPoints,
      current: newHP
    }
  };

  return createCharacterSheet(updatedCharacter);
}

/**
 * Update character sheet after long rest
 */
export function longRest(characterSheet: CharacterSheet): CharacterSheet {
  const char = characterSheet.character;

  // Hit dice recovery: regain up to half max (min 1)
  const hitDiceRecovery = Math.max(1, Math.floor(char.hitDice.max / 2));
  const newHitDiceCurrent = Math.min(char.hitDice.max, char.hitDice.current + hitDiceRecovery);

  // Spell slot recovery: all slots restored to max
  const maxSlots = getCharacterSpellSlots(char);
  const restoredSlots: Record<number, number> = {};
  for (let lvl = 1; lvl <= 9; lvl++) {
    const key = `level${lvl}` as keyof typeof maxSlots;
    const max = maxSlots[key] as number;
    if (max > 0) restoredSlots[lvl] = max;
  }

  const updatedCharacter: Character = {
    ...char,
    hitPoints: {
      ...char.hitPoints,
      current: char.hitPoints.max,
      temp: 0,
    },
    hitDice: {
      ...char.hitDice,
      current: newHitDiceCurrent,
    },
    spellSlots: restoredSlots,
    conditions: [],
    exhaustionLevel: Math.max(0, char.exhaustionLevel - 1),
  };

  return createCharacterSheet(updatedCharacter);
}

/**
 * Format character sheet for display
 */
export function formatCharacterSheet(sheet: CharacterSheet): string {
  const lines = [
    `**${sheet.character.name}** - Level ${sheet.character.level} ${sheet.character.job}`,
    '',
    '**Ability Scores**',
    Formatters.abilityScore('STR', sheet.character.abilities.STR),
    Formatters.abilityScore('AGI', sheet.character.abilities.AGI),
    Formatters.abilityScore('VIT', sheet.character.abilities.VIT),
    Formatters.abilityScore('INT', sheet.character.abilities.INT),
    Formatters.abilityScore('SENSE', sheet.character.abilities.SENSE),
    Formatters.abilityScore('PRE', sheet.character.abilities.PRE),
    '',
    '**Combat Stats**',
    Formatters.hitPoints(sheet.character),
    Formatters.armorClass(sheet.character),
    Formatters.initiative(sheet.character),
    Formatters.speed(sheet.character),
    `Proficiency Bonus: +${sheet.calculated.proficiencyBonus}`,
    '',
    '**Saving Throws**',
    ...Object.entries(sheet.calculated.savingThrows).map(([ability, bonus]) => 
      Formatters.savingThrow(ability as AbilityScore, bonus, sheet.character.savingThrowProficiencies.includes(ability as AbilityScore))
    ),
    '',
    '**Skills**',
    ...Object.entries(sheet.calculated.skills).map(([skill, bonus]) => 
      Formatters.skill(skill, bonus, sheet.character.skillProficiencies.includes(skill), sheet.character.skillExpertise.includes(skill))
    ),
    '',
    '**System Favor**',
    Formatters.systemFavor(sheet.character),
    ''
  ];

  // Add spellcasting information if applicable
  if (sheet.spellcasting.canCastSpells) {
    lines.push(
      '**Spellcasting**',
      `Spell Save DC: ${sheet.spellcasting.spellSaveDC}`,
      `Spell Attack Bonus: +${sheet.spellcasting.spellAttackBonus}`,
      ...Formatters.spellSlots(sheet.character),
      ''
    );
  }

  // Add combat status
  lines.push(
    '**Status**',
    Formatters.conditions(sheet.character),
    Formatters.deathSaves(sheet.character),
    ''
  );

  // Add equipment
  lines.push(
    '**Equipment**',
    Formatters.equipment(sheet.character)
  );

  return lines.join('\n');
}

/**
 * Validate character sheet data
 */
export function validateCharacterSheet(sheet: CharacterSheet): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate ability scores
  Object.entries(sheet.character.abilities).forEach(([ability, score]) => {
    if (score < 1 || score > 20) {
      errors.push(`${ability} score ${score} is out of range (1-20)`);
    }
  });

  // Validate HP
  if (sheet.character.hitPoints.current > sheet.character.hitPoints.max) {
    warnings.push('Current HP exceeds maximum HP');
  }

  // Validate level
  if (sheet.character.level < 1 || sheet.character.level > 20) {
    errors.push(`Level ${sheet.character.level} is out of range (1-20)`);
  }

  // Validate proficiency bonus
  const expectedProficiency = Math.ceil(sheet.character.level / 4) + 1;
  if (sheet.calculated.proficiencyBonus !== expectedProficiency) {
    errors.push(`Proficiency bonus ${sheet.calculated.proficiencyBonus} doesn't match expected ${expectedProficiency}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// Export character sheet functions
export const CharacterSheetSystem = {
  create: createCharacterSheet,
  levelUp: levelUpCharacter,
  applyDamage,
  applyHealing,
  longRest,
  format: formatCharacterSheet,
  validate: validateCharacterSheet
};
