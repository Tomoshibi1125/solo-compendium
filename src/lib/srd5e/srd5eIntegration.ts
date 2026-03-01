/**
 * SRD 5e Integration System
 * Provides dual system support for System Ascendant and SRD 5e mechanics.
 * SA custom mechanics are preserved; SRD 5e only fills gaps where SA
 * doesn't already have coverage.
 */

import { Srd5eCharacter, getSrd5eAbilityModifier, getSrd5eProficiencyBonus, Srd5eSkill } from './rulesEngine';
import { ConcentrationState, initializeConcentration } from './concentration';
import { SpellSlotState, initializeSpellSlots, SpellSlots } from './spellSlots';
import { DeathSaveState, initializeDeathSaves } from './deathSaves';

export type RulesSystem = 'system-ascendant' | 'srd5e' | 'hybrid';

export interface SystemAscendantCharacter {
  level: number;
  abilities: Record<string, number>;
  job: string;
  path?: string;
}

export type SystemAscendantCharacterInput = Partial<SystemAscendantCharacter>;

export interface DualSystemCharacter {
  // System Ascendant system
  systemAscendant: SystemAscendantCharacter;

  // SRD 5e system
  srd5e: Srd5eCharacter;

  // Active system
  activeSystem: RulesSystem;

  // Shared state
  concentration: ConcentrationState;
  spellSlots: SpellSlotState;
  deathSaves: DeathSaveState;
}

// ---------------------------------------------------------------------------
// SA ↔ SRD 5e ability conversion
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// SA Skill → Ability mapping (proper modifier per skill, not just AGI)
// ---------------------------------------------------------------------------

const SA_SKILL_ABILITY_MAP: Record<string, string> = {
  'athletics': 'STR',
  'acrobatics': 'AGI',
  'sleight of hand': 'AGI',
  'stealth': 'AGI',
  'arcana': 'INT',
  'history': 'INT',
  'investigation': 'INT',
  'nature': 'INT',
  'religion': 'INT',
  'animal handling': 'SENSE',
  'insight': 'SENSE',
  'medicine': 'SENSE',
  'perception': 'SENSE',
  'survival': 'SENSE',
  'deception': 'PRE',
  'intimidation': 'PRE',
  'performance': 'PRE',
  'persuasion': 'PRE',
};

// ---------------------------------------------------------------------------
// SA Job → Save proficiency / Skill proficiency mapping
// ---------------------------------------------------------------------------

import type { Srd5eSavingThrowProficiency, Srd5eSkillProficiency } from './rulesEngine';

/** Map SA job names → SRD 5e saving throw proficiencies */
function mapSASaveProficiencies(job: string): Srd5eSavingThrowProficiency[] {
  const saveMap: Record<string, Array<keyof Srd5eCharacter['abilityScores']>> = {
    'warden': ['strength', 'constitution'],
    'striker': ['strength', 'dexterity'],
    'shadow': ['dexterity', 'intelligence'],
    'mage': ['intelligence', 'wisdom'],
    'herald': ['wisdom', 'charisma'],
    'commander': ['strength', 'charisma'],
    'sentinel': ['constitution', 'wisdom'],
    'artificer': ['constitution', 'intelligence'],
  };
  const jobKey = job.toLowerCase();
  const profs = saveMap[jobKey] ?? ['constitution', 'wisdom']; // Default fallback
  return profs.map(ability => ({ ability, proficient: true }));
}

/** Map SA job names → SRD 5e skill proficiencies (base set) */
function mapSASkillProficiencies(job: string): Srd5eSkillProficiency[] {
  const skillMap: Record<string, Srd5eSkill[]> = {
    'warden': ['athletics', 'perception'],
    'striker': ['acrobatics', 'stealth'],
    'shadow': ['stealth', 'deception'],
    'mage': ['arcana', 'investigation'],
    'herald': ['insight', 'persuasion'],
    'commander': ['athletics', 'intimidation'],
    'sentinel': ['perception', 'survival'],
    'artificer': ['arcana', 'investigation'],
  };
  const jobKey = job.toLowerCase();
  const skills = skillMap[jobKey] ?? ['perception', 'insight']; // Default
  return skills.map(skill => ({ skill, proficient: true, expertise: false }));
}

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

export function initializeDualSystemCharacter(
  systemAscendantData: SystemAscendantCharacterInput,
  rulesSystem: RulesSystem = 'system-ascendant'
): DualSystemCharacter {
  const normalizedSystemAscendant: SystemAscendantCharacter = {
    level: systemAscendantData.level ?? 1,
    abilities: systemAscendantData.abilities ?? {},
    job: systemAscendantData.job ?? 'Adventurer',
    path: systemAscendantData.path,
  };

  const srd5eAbilities = convertSystemAscendantToSrd5e(normalizedSystemAscendant.abilities);

  const srd5eCharacter: Srd5eCharacter = {
    level: normalizedSystemAscendant.level,
    abilityScores: srd5eAbilities,
    skillProficiencies: mapSASkillProficiencies(normalizedSystemAscendant.job),
    savingThrowProficiencies: mapSASaveProficiencies(normalizedSystemAscendant.job),
    proficiencyBonus: getSrd5eProficiencyBonus(normalizedSystemAscendant.level),
    class: normalizedSystemAscendant.job,
    subclass: normalizedSystemAscendant.path,
    race: 'Human',
    background: 'Adventurer'
  };

  return {
    systemAscendant: normalizedSystemAscendant,
    srd5e: srd5eCharacter,
    activeSystem: rulesSystem,
    concentration: initializeConcentration(),
    spellSlots: initializeSpellSlots(normalizedSystemAscendant.level, {
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
  return { ...character, activeSystem: newSystem };
}

// Get current ability scores based on active system
export function getCurrentAbilityScores(character: DualSystemCharacter): Record<string, number> {
  if (character.activeSystem === 'system-ascendant' || character.activeSystem === 'hybrid') {
    return character.systemAscendant.abilities;
  }
  return convertSrd5eToSystemAscendant(character.srd5e.abilityScores);
}

// Get current proficiency bonus
export function getCurrentProficiencyBonus(character: DualSystemCharacter): number {
  if (character.activeSystem === 'system-ascendant' || character.activeSystem === 'hybrid') {
    return Math.floor((character.systemAscendant.level - 1) / 4) + 2;
  }
  return character.srd5e.proficiencyBonus;
}

// Get current level
export function getCurrentLevel(character: DualSystemCharacter): number {
  return character.systemAscendant.level;
}

// ---------------------------------------------------------------------------
// Unified AC — uses SRD 5e armor rules with SA ability names
// ---------------------------------------------------------------------------

export function calculateUnifiedArmorClass(
  character: DualSystemCharacter,
  armorType?: string,
  shield?: boolean
): number {
  // Determine the modifier to use (AGI/DEX)
  const dexMod = character.activeSystem === 'srd5e'
    ? getSrd5eAbilityModifier(character.srd5e.abilityScores.dexterity)
    : Math.floor(((character.systemAscendant.abilities.AGI || 10) - 10) / 2);

  const shieldBonus = shield ? 2 : 0;

  switch (armorType) {
    case 'light':
      return 10 + dexMod + shieldBonus;
    case 'medium':
      return 10 + Math.min(dexMod, 2) + shieldBonus;
    case 'heavy':
      return 10 + shieldBonus;
    default:
      return 10 + dexMod + shieldBonus; // Unarmored
  }
}

// ---------------------------------------------------------------------------
// Unified skill modifier — proper ability per skill (not just AGI)
// ---------------------------------------------------------------------------

export function getUnifiedSkillModifier(
  character: DualSystemCharacter,
  skill: string
): number {
  if (character.activeSystem === 'srd5e') {
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

  // SA skill calculation: proper ability modifier per skill
  const abilities = character.systemAscendant.abilities;
  const abilityKey = SA_SKILL_ABILITY_MAP[skill.toLowerCase()] || 'AGI';
  const abilityScore = abilities[abilityKey] || 10;
  return Math.floor((abilityScore - 10) / 2);
}

// Map SA skills ↔ SRD 5e skills
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

// SRD 5e skill → ability mapping
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

// ---------------------------------------------------------------------------
// HP calculation — SA hit dice formula: hitDie + VIT mod per level
// ---------------------------------------------------------------------------

function computeSAHitPoints(character: DualSystemCharacter): number {
  const level = character.systemAscendant.level;
  const vitScore = character.systemAscendant.abilities.VIT || 10;
  const vitMod = Math.floor((vitScore - 10) / 2);
  // Default hit die d8; first level gets max
  const hitDie = 8;
  const firstLevel = hitDie + vitMod;
  const subsequentLevels = Math.max(level - 1, 0) * (Math.floor(hitDie / 2) + 1 + vitMod);
  return Math.max(firstLevel + subsequentLevels, 1);
}

// ---------------------------------------------------------------------------
// Character status summary
// ---------------------------------------------------------------------------

export function getCharacterStatus(character: DualSystemCharacter): {
  system: RulesSystem;
  level: number;
  hp: { current: number; max: number; temp: number };
  ac: number;
  concentration: { active: boolean; effect?: string };
  spellSlots: { [key: string]: { total: number; used: number; available: number } };
  deathSaves: { status: string; successes: number; failures: number };
} {
  const maxHp = computeSAHitPoints(character);
  return {
    system: character.activeSystem,
    level: getCurrentLevel(character),
    hp: { current: maxHp, max: maxHp, temp: 0 },
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
