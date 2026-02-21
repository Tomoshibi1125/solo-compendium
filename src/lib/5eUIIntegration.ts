/**
 * 5e UI Integration with System Ascendant Flavor
 * Converts 5e mechanics to display with System Ascendant terminology
 */

import type { AbilityScore, Character } from './5eRulesEngine';
import { getAbilityDisplayName, normalizeAbility } from './5eRulesEngine';
import { getCharacterSpellSlots } from './5eSpellSystem';

// UI display functions that show System Ascendant flavor while using 5e mechanics

export function formatAbilityScore(ability: AbilityScore, score: number): string {
  const displayName = getAbilityDisplayName(ability);
  const modifier = Math.floor((score - 10) / 2);
  const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  return `${displayName}: ${score} (${modifierStr})`;
}

export function formatSkill(skill: string, modifier: number, proficient: boolean, expertise: boolean): string {
  const proficiencyMarkers = expertise ? '***' : proficient ? '**' : '';
  const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  
  // Map System Ascendant skill names to display format
  const skillDisplayNames: Record<string, string> = {
    'acrobatics': 'Acrobatics (AGI)',
    'sleight-of-hand': 'Sleight of Hand (AGI)',
    'stealth': 'Stealth (AGI)',
    'animal-handling': 'Animal Handling (SENSE)',
    'insight': 'Insight (SENSE)',
    'medicine': 'Medicine (SENSE)',
    'perception': 'Perception (SENSE)',
    'survival': 'Survival (SENSE)',
    'deception': 'Deception (PRE)',
    'intimidation': 'Intimidation (PRE)',
    'performance': 'Performance (PRE)',
    'persuasion': 'Persuasion (PRE)',
  };
  
  const displayName = skillDisplayNames[skill] || skill;
  return `${proficiencyMarkers}${displayName}: ${modifierStr}`;
}

export function formatSavingThrow(ability: AbilityScore, modifier: number, proficient: boolean): string {
  const displayName = getAbilityDisplayName(ability);
  const proficiencyMarker = proficient ? '*' : '';
  const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  return `${proficiencyMarker}${displayName} Save: ${modifierStr}`;
}

export function formatSystemFavor(character: Character): string {
  const current = character.systemFavor?.current || 0;
  const max = character.systemFavor?.max || 0;
  const die = character.systemFavor?.dieSize || 6;
  return `System Favor: ${current}/${max} (d${die})`;
}

export function formatHitPoints(character: Character): string {
  const current = character.hitPoints.current;
  const max = character.hitPoints.max;
  const temp = character.hitPoints.temp;
  
  let hpStr = `HP: ${current}/${max}`;
  if (temp > 0) {
    hpStr += ` (+${temp} temp)`;
  }
  
  return hpStr;
}

export function formatArmorClass(character: Character): string {
  const ac = character.armorClass;
  const agiMod = Math.floor((character.abilities.AGI - 10) / 2);
  
  // Check if character is using heavy armor (no AGI bonus)
  const isHeavyArmor = ac === 10 + Math.max(0, Math.min(agiMod, 2)); // Medium armor assumption
  
  let acStr = `AC: ${ac}`;
  if (!isHeavyArmor && agiMod > 0) {
    acStr += ` (10 + AGI ${agiMod >= 0 ? '+' : ''}${agiMod})`;
  }
  
  return acStr;
}

export function formatInitiative(character: Character): string {
  const agiMod = Math.floor((character.abilities.AGI - 10) / 2);
  const initiative = character.initiative || agiMod;
  const modifierStr = agiMod >= 0 ? `+${agiMod}` : `${agiMod}`;
  return `Initiative: ${initiative} (AGI ${modifierStr})`;
}

export function formatSpeed(character: Character): string {
  const speed = character.speed || 30;
  return `Speed: ${speed} ft.`;
}

export function formatSpellSlots(character: Character): string[] {
  const slots = getCharacterSpellSlots(character);
  
  const slotsArray: string[] = [];
  
  if (slots.cantrips > 0) {
    slotsArray.push(`Cantrips: ${slots.cantrips}`);
  }
  
  for (let level = 1; level <= 9; level++) {
    const slotKey = `level${level}` as keyof typeof slots;
    const count = slots[slotKey];
    if (count > 0) {
      slotsArray.push(`Level ${level}: ${count}`);
    }
  }
  
  return slotsArray.length > 0 ? slotsArray : ['No spell slots'];
}

export function formatConditions(character: Character): string {
  const conditions = character.conditions || [];
  if (conditions.length === 0) return 'No conditions';
  
  return conditions.join(', ');
}

export function formatDeathSaves(character: Character): string {
  // Enhanced death save status based on HP and conditions
  const hp = character.hitPoints?.current || 0;
  const maxHp = character.hitPoints?.max || 1;
  const hpPercentage = (hp / maxHp) * 100;
  
  if (hp > 0) {
    if (hpPercentage >= 75) return 'Healthy';
    if (hpPercentage >= 50) return 'Wounded';
    if (hpPercentage >= 25) return 'Bloodied';
    if (hpPercentage > 0) return 'Critical';
  }
  
  // At 0 HP or below - death saves needed
  return 'Dying (Death saves required)';
}

export function formatEquipment(character: Character): string {
  // Format equipment list with categories and details
  const equipment = character.equipment || [];
  
  if (equipment.length === 0) {
    return 'No equipment';
  }
  
  // Group equipment by type (simple categorization)
  const weapons = equipment.filter(item => 
    item.toLowerCase().includes('sword') || 
    item.toLowerCase().includes('axe') || 
    item.toLowerCase().includes('bow') ||
    item.toLowerCase().includes('staff') ||
    item.toLowerCase().includes('dagger')
  );
  
  const armor = equipment.filter(item => 
    item.toLowerCase().includes('armor') || 
    item.toLowerCase().includes('helmet') ||
    item.toLowerCase().includes('shield') ||
    item.toLowerCase().includes('mail') ||
    item.toLowerCase().includes('plate')
  );
  
  const magic = equipment.filter(item => 
    item.toLowerCase().includes('amulet') || 
    item.toLowerCase().includes('ring') ||
    item.toLowerCase().includes('wand') ||
    item.toLowerCase().includes('potion') ||
    item.toLowerCase().includes('scroll')
  );
  
  const other = equipment.filter(item => 
    !weapons.includes(item) && !armor.includes(item) && !magic.includes(item)
  );
  
  const parts = [];
  if (weapons.length > 0) parts.push(`${weapons.length} weapons`);
  if (armor.length > 0) parts.push(`${armor.length} armor`);
  if (magic.length > 0) parts.push(`${magic.length} magic items`);
  if (other.length > 0) parts.push(`${other.length} other items`);
  
  return `Equipment: ${parts.join(', ')} (${equipment.length} total)`;
}

export function formatCharacterSummary(character: Character): string {
  const lines = [
    `**${character.name}** - Level ${character.level} ${character.job}`,
    formatAbilityScore('STR', character.abilities.STR),
    formatAbilityScore('AGI', character.abilities.AGI),
    formatAbilityScore('VIT', character.abilities.VIT),
    formatAbilityScore('INT', character.abilities.INT),
    formatAbilityScore('SENSE', character.abilities.SENSE),
    formatAbilityScore('PRE', character.abilities.PRE),
    formatHitPoints(character),
    formatArmorClass(character),
    formatInitiative(character),
    formatSpeed(character),
    formatSystemFavor(character),
  ];
  
  return lines.join('\n');
}

// Combat-specific UI formatting
export function formatAttackRoll(attackBonus: number, advantage: 'advantage' | 'disadvantage' | 'normal'): string {
  const advantageStr = advantage === 'advantage' ? ' (Adv)' : advantage === 'disadvantage' ? ' (Dis)' : '';
  const bonusStr = attackBonus >= 0 ? `+${attackBonus}` : `${attackBonus}`;
  return `Attack Roll: d20${bonusStr}${advantageStr}`;
}

export function formatDamageRoll(damage: string, damageType: string): string {
  return `Damage: ${damage} ${damageType}`;
}

export function formatSavingThrowDC(dc: number, ability: AbilityScore): string {
  const displayName = getAbilityDisplayName(ability);
  return `DC ${dc} ${displayName} Save`;
}

export function formatConcentrationCheck(damage: number): string {
  const dc = Math.max(10, Math.floor(damage / 2));
  return `Concentration Check: DC ${dc} (10 + ${Math.floor(damage / 2)} from ${damage} damage)`;
}

// Spell-specific UI formatting with System Ascendant flavor
export function formatSpellPower(spell: {
  name: string;
  level?: number;
  rank?: 'D' | 'C' | 'B' | 'A' | 'S';
  manaCost?: number;
  castingTime?: string;
  range?: string;
  duration?: string;
  concentration?: boolean;
}): string {
  const level = spell.level || 0;
  const rank = spell.rank || 'D';
  const manaCost = spell.manaCost || 0;
  
  let levelStr = level === 0 ? 'Cantrip' : `Level ${level}`;
  if (spell.rank) {
    levelStr += ` (${rank}-rank)`;
  }
  
  let components: string[] = [];
  if (spell.castingTime) components.push(`Casting: ${spell.castingTime}`);
  if (spell.range) components.push(`Range: ${spell.range}`);
  if (spell.duration) components.push(`Duration: ${spell.duration}`);
  if (spell.concentration) components.push('Concentration');
  if (spell.manaCost) components.push(`Mana Cost: ${manaCost}`);
  
  return `${spell.name} - ${levelStr}\n${components.join(', ')}`;
}

// Relic-specific UI formatting with System Ascendant flavor
export function formatRelic(relic: {
  name: string;
  rarity: string;
  type: string;
  attunement: boolean;
  systemTier?: string;
  corruptionRisk?: string;
}): string {
  const rarity = relic.rarity;
  const tier = relic.systemTier ? ` (${relic.systemTier})` : '';
  const attunement = relic.attunement ? ' (Requires Attunement)' : '';
  const corruption = relic.corruptionRisk ? ` [Corruption Risk: ${relic.corruptionRisk}]` : '';
  
  return `${relic.name} - ${rarity}${tier} ${relic.type}${attunement}${corruption}`;
}

// Helper function to create tooltips with System Ascendant flavor
export function createTooltip(content: string, systemFlavor?: string): string {
  if (systemFlavor) {
    return `${content}\n\n*System Ascendant: ${systemFlavor}*`;
  }
  return content;
}

// Export all formatting functions for use in UI components
export const Formatters = {
  abilityScore: formatAbilityScore,
  skill: formatSkill,
  savingThrow: formatSavingThrow,
  systemFavor: formatSystemFavor,
  hitPoints: formatHitPoints,
  armorClass: formatArmorClass,
  initiative: formatInitiative,
  speed: formatSpeed,
  spellSlots: formatSpellSlots,
  conditions: formatConditions,
  deathSaves: formatDeathSaves,
  equipment: formatEquipment,
  characterSummary: formatCharacterSummary,
  attackRoll: formatAttackRoll,
  damageRoll: formatDamageRoll,
  savingThrowDC: formatSavingThrowDC,
  concentrationCheck: formatConcentrationCheck,
  spellPower: formatSpellPower,
  relic: formatRelic,
  tooltip: createTooltip,
};
