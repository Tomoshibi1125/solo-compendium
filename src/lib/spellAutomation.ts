/**
 * Spell Automation System - Digital Character Sheet Style
 * 
 * Advanced spell casting mechanics including spell slots, concentration,
 * spell attacks, saving throws, and magical effects
 */

import { AppError } from '@/lib/appError';
import { 
  RollResult, 
  rollWithAdvantage, 
  formatRollResult 
} from './advancedDiceEngine';

// Character interface (simplified)
interface Character {
  id: string;
  name: string;
  level: number;
  abilities: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
  proficiency_bonus: number;
  armor_class?: number;
  hp_current: number;
  hp_max: number;
  speed: number;
  conditions: string[];
  spell_slots: {
    level_1: number;
    level_2: number;
    level_3: number;
    level_4: number;
    level_5: number;
    level_6: number;
    level_7: number;
    level_8: number;
    level_9: number;
  };
  spellcasting_ability?: string;
  prepared_spells?: string[];
}

// Spell interface
interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  casting_time: string;
  range: string;
  components: string[];
  duration: string;
  concentration: boolean;
  description: string;
  damage?: string;
  damage_type?: string;
  save_ability?: string;
  save_dc?: number;
  spell_attack?: boolean;
  higher_levels?: string;
}

export interface SpellAttackResult extends RollResult {
  spell: string;
  spellLevel: number;
  spellDC?: number;
  concentration?: boolean;
  hit?: boolean;
  critical?: boolean;
  damage?: number;
  effects?: string[];
}

export interface SpellSaveResult extends RollResult {
  ability: string;
  saveBonus: number;
  dc: number;
  success: boolean;
  effects?: string[];
  halfDamage?: boolean;
  concentration?: boolean;
}

export interface SpellSlotResult {
  level: number;
  available: number;
  used: number;
  total: number;
}

/**
 * Get ability modifier
 */
function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Calculate spell save DC
 */
export function calculateSpellDC(character: Character, _spell: Spell): number {
  if (!character.spellcasting_ability) {
    throw new AppError('Character has no spellcasting ability defined', 'INVALID_INPUT');
  }
  
  const abilityKey = character.spellcasting_ability as keyof typeof character.abilities;
  const abilityMod = getAbilityModifier(character.abilities[abilityKey]);
  
  return 8 + character.proficiency_bonus + abilityMod;
}

/**
 * Calculate spell attack bonus
 */
export function calculateSpellAttack(character: Character, _spell: Spell): number {
  if (!character.spellcasting_ability) {
    throw new AppError('Character has no spellcasting ability defined', 'INVALID_INPUT');
  }
  
  const abilityKey = character.spellcasting_ability as keyof typeof character.abilities;
  const abilityMod = getAbilityModifier(character.abilities[abilityKey]);
  
  return character.proficiency_bonus + abilityMod;
}

/**
 * Perform a spell attack roll
 */
export function performSpellAttack(
  caster: Character,
  target: Character,
  spell: Spell,
  advantage: 'advantage' | 'disadvantage' | 'normal' = 'normal'
): SpellAttackResult {
  if (!spell.spell_attack) {
    throw new AppError(`${spell.name} is not an attack spell`, 'INVALID_INPUT');
  }
  
  const attackBonus = calculateSpellAttack(caster, spell);
  const attackRoll = rollWithAdvantage('1d20', advantage);
  const totalAttack = attackRoll.total + attackBonus;
  
  // Check if hit (assuming target AC for this example)
  const targetAC = target.armor_class || 15;
  const hit = totalAttack >= targetAC;
  const critical = attackRoll.isNatural20;
  
  // Calculate damage if hit
  let damage: number | undefined;
  if (hit && spell.damage) {
    // This would parse and roll the damage formula
    damage = parseAndRollDamage(spell.damage, critical);
  }
  
  return {
    ...attackRoll,
    spell: spell.name,
    spellLevel: spell.level,
    spellDC: calculateSpellDC(caster, spell),
    concentration: spell.concentration,
    hit,
    critical,
    damage,
    effects: spell.concentration ? ['Concentration'] : [],
  };
}

/**
 * Perform a spell saving throw
 */
export function performSpellSave(
  target: Character,
  spell: Spell,
  caster: Character,
  advantage: 'advantage' | 'disadvantage' | 'normal' = 'normal'
): SpellSaveResult {
  if (!spell.save_ability) {
    throw new AppError(`${spell.name} does not require a saving throw`, 'INVALID_INPUT');
  }
  
  const dc = calculateSpellDC(caster, spell);
  const abilityKey = spell.save_ability as keyof typeof target.abilities;
  const saveBonus = getAbilityModifier(target.abilities[abilityKey]);
  
  const saveRoll = rollWithAdvantage('1d20', advantage);
  const totalSave = saveRoll.total + saveBonus;
  const success = totalSave >= dc;
  
  return {
    ...saveRoll,
    ability: spell.save_ability,
    saveBonus,
    dc,
    success,
    halfDamage: !success,
    concentration: spell.concentration,
    effects: success ? [] : [`${spell.name} effect`],
  };
}

/**
 * Calculate spell duration with concentration
 */
export function calculateSpellDuration(spell: Spell, concentration: boolean): string {
  if (spell.concentration && concentration) {
    return `Concentration, up to ${spell.duration}`;
  }
  return spell.duration;
}

/**
 * Consume a spell slot
 */
export function consumeSpellSlot(character: Character, level: number): Character {
  const slotKey = `level_${level}` as keyof typeof character.spell_slots;
  const currentSlots = character.spell_slots[slotKey];
  
  if (currentSlots <= 0) {
    throw new AppError(`No level ${level} spell slots remaining`, 'INVALID_INPUT');
  }
  
  const updatedSlots = {
    ...character.spell_slots,
    [slotKey]: currentSlots - 1
  };
  
  return {
    ...character,
    spell_slots: updatedSlots,
  };
}

/**
 * Check spell slot availability
 */
export function checkSpellSlotAvailability(character: Character, level: number): boolean {
  const slotKey = `level_${level}` as keyof typeof character.spell_slots;
  return character.spell_slots[slotKey] > 0;
}

/**
 * Recover spell slots on rest
 */
export function recoverSpellSlots(
  character: Character, 
  restType: 'short' | 'long'
): Character {
  if (restType === 'short') {
    // Warlocks recover spell slots on short rest
    // Other classes might have features that allow this
    return character;
  }
  
  // Long rest - recover all spell slots
  const maxSlots = calculateMaxSpellSlots(character);
  
  return {
    ...character,
    spell_slots: maxSlots,
  };
}

/**
 * Calculate maximum spell slots for a character
 */
export function calculateMaxSpellSlots(character: Character): Character['spell_slots'] {
  // This is a simplified calculation - would need to be based on class
  const slots = {
    level_1: 0,
    level_2: 0,
    level_3: 0,
    level_4: 0,
    level_5: 0,
    level_6: 0,
    level_7: 0,
    level_8: 0,
    level_9: 0,
  };
  
  // Example for a level 5 wizard
  if (character.level >= 1) slots.level_1 = 4;
  if (character.level >= 3) slots.level_2 = 3;
  if (character.level >= 5) slots.level_3 = 2;
  
  return slots;
}

/**
 * Prepare spells for the day
 */
export function prepareSpells(character: Character, spells: Spell[]): Character {
  const preparedSpellIds = spells.map(spell => spell.id);
  
  return {
    ...character,
    prepared_spells: preparedSpellIds,
  };
}

/**
 * Check if a spell is prepared
 */
export function checkPreparedSpells(character: Character, spell: Spell): boolean {
  if (!character.prepared_spells) return false;
  return character.prepared_spells.includes(spell.id);
}

/**
 * Apply concentration effects
 */
export function applyConcentration(
  character: Character,
  spell: Spell
): Character {
  if (!spell.concentration) return character;
  
  // Remove any existing concentration spells
  const existingConditions = character.conditions || [];
  const newConditions = existingConditions.filter(c => c !== 'Concentration');
  
  // Add new concentration
  newConditions.push('Concentration');
  
  return {
    ...character,
    conditions: newConditions,
  };
}

/**
 * Break concentration
 */
export function breakConcentration(character: Character): Character {
  const existingConditions = character.conditions || [];
  const newConditions = existingConditions.filter(c => c !== 'Concentration');
  
  return {
    ...character,
    conditions: newConditions,
  };
}

/**
 * Check concentration save
 */
export function checkConcentrationSave(
  character: Character,
  damage: number
): boolean {
  const dc = Math.max(10, Math.floor(damage / 2));
  const conSave = getAbilityModifier(character.abilities.CON);
  const saveRoll = Math.floor(Math.random() * 20) + 1 + conSave;
  
  return saveRoll >= dc;
}

/**
 * Parse and roll damage formula
 */
function parseAndRollDamage(damageFormula: string, isCritical: boolean): number {
  // Simple damage parsing - would need to be more sophisticated
  const match = damageFormula.match(/(\d+)d(\d+)/);
  if (!match) return 0;
  
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const multiplier = isCritical ? 2 : 1;
  
  let total = 0;
  for (let i = 0; i < count * multiplier; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  
  return total;
}

/**
 * Get spell slot status
 */
export function getSpellSlotStatus(character: Character): SpellSlotResult[] {
  const slots: SpellSlotResult[] = [];
  
  for (let level = 1; level <= 9; level++) {
    const slotKey = `level_${level}` as keyof typeof character.spell_slots;
    const available = character.spell_slots[slotKey];
    const total = calculateMaxSpellSlots(character)[slotKey];
    const used = total - available;
    
    slots.push({
      level,
      available,
      used,
      total,
    });
  }
  
  return slots;
}

/**
 * Check if character can cast spell
 */
export function canCastSpell(
  character: Character,
  spell: Spell,
  isPreparedOnly: boolean = true
): { canCast: boolean; reason?: string } {
  // Check spell slot availability
  if (!checkSpellSlotAvailability(character, spell.level)) {
    return { canCast: false, reason: `No level ${spell.level} spell slots available` };
  }
  
  // Check if spell is prepared (if required)
  if (isPreparedOnly && !checkPreparedSpells(character, spell)) {
    return { canCast: false, reason: 'Spell is not prepared' };
  }
  
  // Check concentration
  if (spell.concentration && character.conditions?.includes('Concentration')) {
    return { canCast: false, reason: 'Already concentrating on another spell' };
  }
  
  return { canCast: true };
}

/**
 * Format spell attack result
 */
export function formatSpellAttackResult(attack: SpellAttackResult): string {
  const rollStr = formatRollResult(attack);
  const hitMiss = attack.hit ? 'HIT' : 'MISS';
  const critStr = attack.critical ? ' CRITICAL!' : '';
  
  let result = `${attack.spell}: ${rollStr} +${calculateSpellAttack({} as Character, {} as Spell)} = ${attack.total} vs AC - ${hitMiss}${critStr}`;
  
  if (attack.damage && attack.hit) {
    result += ` (${attack.damage} damage)`;
  }
  
  if (attack.concentration) {
    result += ' [Concentration]';
  }
  
  return result;
}

/**
 * Format spell save result
 */
export function formatSpellSaveResult(save: SpellSaveResult): string {
  const rollStr = formatRollResult(save);
  const successFail = save.success ? 'SUCCESS' : 'FAILURE';
  const halfStr = save.halfDamage ? ' (half damage)' : '';
  
  return `${save.ability} Save vs ${save.dc}: ${rollStr} = ${save.total} - ${successFail}${halfStr}`;
}

