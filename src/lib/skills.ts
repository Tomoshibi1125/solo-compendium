import type { AbilityScore } from '@/types/system-rules';
import { getAbilityModifier } from './characterCalculations';

export interface SkillDefinition {
  name: string;
  ability: AbilityScore;
}

export const SKILLS: Record<string, SkillDefinition> = {
  'Athletics': { name: 'Athletics', ability: 'STR' },
  'Acrobatics': { name: 'Acrobatics', ability: 'AGI' },
  'Sleight of Hand': { name: 'Sleight of Hand', ability: 'AGI' },
  'Stealth': { name: 'Stealth', ability: 'AGI' },
  'Investigation': { name: 'Investigation', ability: 'INT' },
  'History': { name: 'History', ability: 'INT' },
  'Arcana': { name: 'Arcana', ability: 'INT' },
  'Nature': { name: 'Nature', ability: 'INT' },
  'Religion': { name: 'Religion', ability: 'INT' },
  'Perception': { name: 'Perception', ability: 'SENSE' },
  'Insight': { name: 'Insight', ability: 'SENSE' },
  'Medicine': { name: 'Medicine', ability: 'SENSE' },
  'Survival': { name: 'Survival', ability: 'SENSE' },
  'Deception': { name: 'Deception', ability: 'PRE' },
  'Intimidation': { name: 'Intimidation', ability: 'PRE' },
  'Performance': { name: 'Performance', ability: 'PRE' },
  'Persuasion': { name: 'Persuasion', ability: 'PRE' },
};

export function calculateSkillModifier(
  skillName: string,
  abilities: Record<AbilityScore, number>,
  proficiencies: string[],
  expertise: string[],
  proficiencyBonus: number
): number {
  const skill = SKILLS[skillName];
  if (!skill) return 0;

  const abilityMod = getAbilityModifier(abilities[skill.ability]);
  let modifier = abilityMod;

  if (expertise.includes(skillName)) {
    modifier += proficiencyBonus * 2;
  } else if (proficiencies.includes(skillName)) {
    modifier += proficiencyBonus;
  }

  return modifier;
}

export function calculatePassiveSkill(
  skillName: string,
  abilities: Record<AbilityScore, number>,
  proficiencies: string[],
  expertise: string[],
  proficiencyBonus: number
): number {
  const modifier = calculateSkillModifier(skillName, abilities, proficiencies, expertise, proficiencyBonus);
  return 10 + modifier;
}

export function getAllSkills(): SkillDefinition[] {
  return Object.values(SKILLS);
}



