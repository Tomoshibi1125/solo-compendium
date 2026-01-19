/**
 * Unified Spell/Power System
 * Merges Solo Leveling powers with D&D 5e spells
 */

import { 
  UnifiedCharacter, 
  UnifiedClass, 
  UnifiedAbilityScores,
  UnifiedSpellSlots,
  getUnifiedAbilityModifier,
  getUnifiedProficiencyBonus
} from './rulesEngine';

// Unified Spell/Power Schools (Solo Leveling adapted to D&D 5e)
export type UnifiedSchool = 
  | 'abjuration' | 'conjuration' | 'divination' | 'enchantment' | 'evocation'
  | 'illusion' | 'necromancy' | 'transmutation' | 'shadow' | 'technomancy'
  | 'healing' | 'destruction' | 'protection' | 'summoning';

// Unified Spell/Power Components
export interface UnifiedComponents {
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  materialDescription?: string;
  shadowEnergy?: boolean; // Only for monarch-level powers
  systemFavor?: boolean;
}

// Unified Spell/Power Range
export type UnifiedRange = 
  | 'self' | 'touch' | '5ft' | '10ft' | '30ft' | '60ft' | '90ft' | '120ft' | '150ft' | '300ft'
  | 'sight' | 'unlimited' | 'special';

// Unified Spell/Power Duration
export type UnifiedDuration = 
  | 'instantaneous' | 'concentration' | '1 minute' | '10 minutes' | '1 hour'
  | '8 hours' | '24 hours' | 'until dispelled' | 'special';

// Unified Spell/Power (Solo Leveling powers with D&D 5e structure)
export interface UnifiedSpell {
  id: string;
  name: string;
  description: string;
  level: number; // 0-9 (0 = cantrip)
  school: UnifiedSchool;
  
  // D&D 5e mechanics
  castingTime: string;
  range: UnifiedRange;
  components: UnifiedComponents;
  duration: UnifiedDuration;
  concentration: boolean;
  ritual: boolean;
  
  // Solo Leveling adaptations
  monarchPowerCost?: number; // Only available to monarchs and their chosen
  systemFavorCost?: number;
  monarchRequirement?: string;
  gateRank?: string;
  
  // Class and level requirements
  classes: UnifiedClass[];
  levelRequired: number;
  
  // Effects
  damage?: {
    amount: string;
    type: string;
    save?: {
      ability: keyof UnifiedAbilityScores;
      dc: string;
      success: string;
      failure: string;
    };
  };
  healing?: {
    amount: string;
    type: 'hp' | 'temp-hp' | 'condition';
  };
  effects: {
    primary: string;
    secondary?: string;
    tertiary?: string;
  };
  
  // Scaling
  higherLevels?: {
    level: number;
    effect: string;
  }[];
  
  // Solo Leveling unique properties
  uniqueProperties?: string[];
  flavorText?: string;
}

// Unified Spellcasting Modifier
export interface UnifiedSpellcastingModifier {
  ability: keyof UnifiedAbilityScores;
  spellAttackBonus: number;
  spellSaveDC: number;
}

// Calculate unified spellcasting modifier
export function calculateUnifiedSpellcastingModifier(
  character: UnifiedCharacter,
  spellcastingAbility: keyof UnifiedAbilityScores
): UnifiedSpellcastingModifier {
  const abilityMod = getUnifiedAbilityModifier(spellcastingAbility, character.abilities[spellcastingAbility]);
  const profBonus = character.proficiencyBonus;
  
  return {
    ability: spellcastingAbility,
    spellAttackBonus: abilityMod + profBonus,
    spellSaveDC: 8 + abilityMod + profBonus
  };
}

// Check if character can cast unified spell
export function canCastUnifiedSpell(
  character: UnifiedCharacter,
  spell: UnifiedSpell
): { canCast: boolean; reason?: string } {
  // Check level requirement
  if (character.level < spell.levelRequired) {
    return { canCast: false, reason: `Level ${spell.levelRequired} required` };
  }
  
  // Check class requirement
  if (!spell.classes.includes(character.class)) {
    return { canCast: false, reason: 'Class does not have access to this spell' };
  }
  
  // Check spell slot availability
  if (spell.level > 0) {
    const slotKey = `level${spell.level}` as keyof UnifiedSpellSlots;
    if (character.spellSlots[slotKey] <= 0) {
      return { canCast: false, reason: `No level ${spell.level} spell slots remaining` };
    }
  }
  
  // Check monarch power cost (replaces shadow energy)
  if (spell.monarchPowerCost) {
    if (!character.activeMonarch || character.systemFavorCurrent < spell.monarchPowerCost) {
      return { canCast: false, reason: `Insufficient Monarch Power (requires ${spell.monarchPowerCost})` };
    }
  }
  
  // Check system favor cost
  if (spell.systemFavorCost) {
    if (character.systemFavorCurrent < spell.systemFavorCost) {
      return { canCast: false, reason: `Insufficient System Favor (requires ${spell.systemFavorCost})` };
    }
  }
  
  // Check monarch requirement
  if (spell.monarchRequirement) {
    if (!character.monarchUnlocks?.includes(spell.monarchRequirement)) {
      return { canCast: false, reason: `Monarch unlock required: ${spell.monarchRequirement}` };
    }
  }
  
  return { canCast: true };
}

// Cast unified spell
export function castUnifiedSpell(
  character: UnifiedCharacter,
  spell: UnifiedSpell,
  spellcastingAbility: keyof UnifiedAbilityScores,
  upcastLevel?: number
): { 
  success: boolean; 
  newCharacter: UnifiedCharacter; 
  result: string;
  damage?: number;
  healing?: number;
} {
  const canCast = canCastUnifiedSpell(character, spell);
  if (!canCast.canCast) {
    return { 
      success: false, 
      newCharacter: character, 
      result: canCast.reason || 'Cannot cast spell' 
    };
  }
  
  let newCharacter = { ...character };
  const results: string[] = [];
  
  // Consume spell slot
  if (spell.level > 0) {
    const slotKey = `level${upcastLevel || spell.level}` as keyof UnifiedSpellSlots;
    newCharacter = {
      ...newCharacter,
      spellSlots: {
        ...newCharacter.spellSlots,
        [slotKey]: newCharacter.spellSlots[slotKey] - 1
      }
    };
    results.push(`Consumed level ${upcastLevel || spell.level} spell slot`);
  }
  
  // Consume monarch power (replaces shadow energy)
  if (spell.monarchPowerCost && newCharacter.activeMonarch) {
    newCharacter = {
      ...newCharacter,
      systemFavorCurrent: newCharacter.systemFavorCurrent - spell.monarchPowerCost
    };
    results.push(`Consumed ${spell.monarchPowerCost} Monarch Power`);
  }
  
  // Consume system favor
  if (spell.systemFavorCost) {
    newCharacter = {
      ...newCharacter,
      systemFavorCurrent: newCharacter.systemFavorCurrent - spell.systemFavorCost
    };
    results.push(`Consumed ${spell.systemFavorCost} System Favor`);
  }
  
  // Calculate damage
  let damage: number | undefined;
  if (spell.damage) {
    const damageMatch = spell.damage.amount.match(/(\d+)d(\d+)(?:\+(\d+))?/);
    if (damageMatch) {
      const [, numDice, dieSize, bonus] = damageMatch;
      const diceCount = parseInt(numDice) + (upcastLevel ? upcastLevel - spell.level : 0);
      const dieMax = parseInt(dieSize);
      const damageBonus = bonus ? parseInt(bonus) : 0;
      
      let totalDamage = 0;
      for (let i = 0; i < diceCount; i++) {
        totalDamage += Math.floor(Math.random() * dieMax) + 1;
      }
      totalDamage += damageBonus;
      
      damage = totalDamage;
      results.push(`Dealt ${totalDamage} ${spell.damage.type} damage`);
    }
  }
  
  // Calculate healing
  let healing: number | undefined;
  if (spell.healing) {
    const healingMatch = spell.healing.amount.match(/(\d+)d(\d+)(?:\+(\d+))?/);
    if (healingMatch) {
      const [, numDice, dieSize, bonus] = healingMatch;
      const diceCount = parseInt(numDice) + (upcastLevel ? upcastLevel - spell.level : 0);
      const dieMax = parseInt(dieSize);
      const healingBonus = bonus ? parseInt(bonus) : 0;
      
      let totalHealing = 0;
      for (let i = 0; i < diceCount; i++) {
        totalHealing += Math.floor(Math.random() * dieMax) + 1;
      }
      totalHealing += healingBonus;
      
      healing = totalHealing;
      results.push(`Healed ${totalHealing} HP`);
      
      // Apply healing to character
      const maxHP = newCharacter.hitPoints.max;
      const currentHP = newCharacter.hitPoints.current;
      const newHP = Math.min(currentHP + totalHealing, maxHP);
      
      newCharacter = {
        ...newCharacter,
        hitPoints: {
          ...newCharacter.hitPoints,
          current: newHP
        }
      };
    }
  }
  
  // Handle concentration
  if (spell.concentration) {
    results.push('Concentration required');
  }
  
  return {
    success: true,
    newCharacter,
    result: results.join(', '),
    damage,
    healing
  };
}

// Get unified spell list for character
export function getUnifiedSpellList(
  character: UnifiedCharacter,
  allSpells: UnifiedSpell[]
): UnifiedSpell[] {
  return allSpells.filter(spell => 
    spell.classes.includes(character.class) &&
    character.level >= spell.levelRequired &&
    (!spell.monarchRequirement || character.monarchUnlocks?.includes(spell.monarchRequirement))
  );
}

// Get unified cantrips (level 0 spells)
export function getUnifiedCantrips(
  character: UnifiedCharacter,
  allSpells: UnifiedSpell[]
): UnifiedSpell[] {
  return getUnifiedSpellList(character, allSpells).filter(spell => spell.level === 0);
}

// Get unified spells by level
export function getUnifiedSpellsByLevel(
  character: UnifiedCharacter,
  allSpells: UnifiedSpell[],
  level: number
): UnifiedSpell[] {
  return getUnifiedSpellList(character, allSpells).filter(spell => spell.level === level);
}

// Calculate unified spell save DC
export function calculateUnifiedSpellSaveDC(
  character: UnifiedCharacter,
  spellcastingAbility: keyof UnifiedAbilityScores
): number {
  const abilityMod = getUnifiedAbilityModifier(spellcastingAbility, character.abilities[spellcastingAbility]);
  const profBonus = character.proficiencyBonus;
  
  return 8 + abilityMod + profBonus;
}

// Perform unified spell attack roll
export function performUnifiedSpellAttackRoll(
  character: UnifiedCharacter,
  spellcastingAbility: keyof UnifiedAbilityScores
): number {
  const abilityMod = getUnifiedAbilityModifier(spellcastingAbility, character.abilities[spellcastingAbility]);
  const profBonus = character.proficiencyBonus;
  
  return abilityMod + profBonus;
}

// Check unified spell resistance/immunity
export function checkUnifiedSpellResistance(
  target: { damageResistances?: string[]; damageImmunities?: string[] },
  damageType: string
): { resistance: boolean; immunity: boolean; vulnerability: boolean } {
  const resistance = target.damageResistances?.includes(damageType) || false;
  const immunity = target.damageImmunities?.includes(damageType) || false;
  const vulnerability = false; // Would need to track vulnerabilities
  
  return { resistance, immunity, vulnerability };
}

// Apply unified spell damage with resistance/immunity
export function applyUnifiedSpellDamage(
  damage: number,
  damageType: string,
  target: { damageResistances?: string[]; damageImmunities?: string[] }
): { finalDamage: number; resisted: boolean; immune: boolean } {
  const { resistance, immunity } = checkUnifiedSpellResistance(target, damageType);
  
  if (immunity) {
    return { finalDamage: 0, resisted: false, immune: true };
  }
  
  if (resistance) {
    return { finalDamage: Math.floor(damage / 2), resisted: true, immune: false };
  }
  
  return { finalDamage: damage, resisted: false, immune: false };
}

// Get unified spell casting time categories
export type UnifiedCastingTime = 
  | 'action' | 'bonus-action' | 'reaction' | 'minute' | 'hour' | 'special';

// Parse unified casting time
export function parseUnifiedCastingTime(castingTime: string): {
  type: UnifiedCastingTime;
  value?: number;
  description: string;
} {
  const actionMatch = castingTime.match(/(\d+)\s*(action|bonus action|reaction|minute|hour)/i);
  
  if (actionMatch) {
    const [, value, type] = actionMatch;
    return {
      type: type.toLowerCase().replace(' ', '-') as UnifiedCastingTime,
      value: parseInt(value),
      description: castingTime
    };
  }
  
  return {
    type: 'special',
    description: castingTime
  };
}

// Get unified spell school descriptions
export function getUnifiedSchoolDescription(school: UnifiedSchool): string {
  const descriptions: Record<UnifiedSchool, string> = {
    abjuration: 'Protective spells that create barriers, ward against harm, or banish intruders',
    conjuration: 'Spells that transport creatures or objects, create objects, or call creatures',
    divination: 'Spells that reveal information, foresee the future, or communicate across distances',
    enchantment: 'Spells that affect the minds of others, influencing or controlling their behavior',
    evocation: 'Spells that manipulate energy or create something from nothing',
    illusion: 'Spells that deceive the senses or minds of others',
    necromancy: 'Spells that manipulate life force, death, and undeath',
    transmutation: 'Spells that transform creatures or objects',
    shadow: 'Solo Leveling shadow magic that manipulates darkness and shadow energy',
    technomancy: 'Solo Leveling technological magic that combines arcane power with technology',
    healing: 'Solo Leveling restorative magic that heals wounds and cures conditions',
    destruction: 'Solo Leveling destructive magic that deals massive damage',
    protection: 'Solo Leveling protective magic that wards against harm',
    summoning: 'Solo Leveling summoning magic that calls forth creatures and allies'
  };
  
  return descriptions[school] || 'Unknown school of magic';
}

// Get unified spell component descriptions
export function getUnifiedComponentDescription(components: UnifiedComponents): string[] {
  const descriptions: string[] = [];
  
  if (components.verbal) descriptions.push('Verbal (V)');
  if (components.somatic) descriptions.push('Somatic (S)');
  if (components.material) {
    const materialDesc = components.materialDescription ? `Material (${components.materialDescription})` : 'Material (M)';
    descriptions.push(materialDesc);
  }
  if (components.shadowEnergy) descriptions.push('Shadow Energy (SE)');
  if (components.systemFavor) descriptions.push('System Favor (SF)');
  
  return descriptions;
}
