/**
 * Unified Character Creation System
 * Merges System Ascendant and SRD 5e character creation
 */

import { 
  UnifiedCharacter, 
  UnifiedClass, 
  UnifiedAbilityScores, 
  UnifiedSkill,
  UnifiedSkillProficiency,
  UnifiedSavingThrow,
  UnifiedSavingThrowProficiency,
  UnifiedSpellSlots,
  getUnifiedAbilityModifier,
  getUnifiedProficiencyBonus,
  getSystemFavorMax
} from './rulesEngine';
import { formatMonarchVernacular } from '@/lib/vernacular';

// Unified Character Creation Options
export interface UnifiedCharacterCreation {
  // Basic Info
  name: string;
  race: string;
  background: string;
  
  // Class Selection
  class: UnifiedClass;
  path?: string;
  
  // Ability Scores (System Ascendant names, SRD 5e point buy or rolled)
  abilities: UnifiedAbilityScores;
  abilityGenerationMethod: 'point-buy' | 'rolled' | 'standard-array';
  
  // Skills and Proficiencies
  skillProficiencies: UnifiedSkill[];
  skillExpertise: UnifiedSkill[];
  savingThrowProficiencies: UnifiedSavingThrow[];
  
  // System Ascendant Unique Options
  systemFavor: boolean; // Whether to use System Favor mechanic
  monarchPower: boolean; // Whether to use Monarch Power (for monarch classes)
  
  // Equipment
  startingEquipment: string[];
}

// Class-specific starting packages (System Ascendant adapted to SRD 5e)
export interface UnifiedClassPackage {
  name: string;
  description: string;
  hitDie: string;
  primaryAbilities: (keyof UnifiedAbilityScores)[];
  savingThrows: (keyof UnifiedAbilityScores)[];
  skillChoices: UnifiedSkill[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  startingEquipment: string[];
  features: string[];
  
  // System Ascendant specific
  systemFavor: boolean;
  monarchPower: boolean;
  uniqueAbilities: string[];
}

// Unified Class Packages
export const unifiedClassPackages: Record<UnifiedClass, UnifiedClassPackage> = {
  warrior: {
    name: 'Warrior',
    description: 'A versatile combatant who masters various weapons and fighting styles. Warriors can specialize in offense, defense, or tactical leadership.',
    hitDie: '1d10',
    primaryAbilities: ['STR', 'VIT'],
    savingThrows: ['STR', 'VIT'],
    skillChoices: ['athletics', 'acrobatics', 'animal-handling', 'history', 'insight', 'intimidation', 'perception', 'survival'],
    armorProficiencies: ['All armor', 'shields'],
    weaponProficiencies: ['Simple weapons', 'martial weapons'],
    toolProficiencies: ['One type of artisan\'s tools'],
    startingEquipment: ['Longsword', 'Shield', 'Chain mail', 'Explorer\'s pack'],
    features: ['Fighting Style', 'Second Wind', 'Action Surge'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Battlefield Instinct', 'Enhanced Physique', 'Combat Focus', 'Leadership Presence']
  },
  
  mage: {
    name: 'Mage',
    description: 'A master of arcane magic who wields powerful spells and magical abilities. Mages can specialize in different schools of magic.',
    hitDie: '1d8',
    primaryAbilities: ['INT'],
    savingThrows: ['INT', 'SENSE'],
    skillChoices: ['arcana', 'history', 'investigation', 'nature', 'religion'],
    armorProficiencies: ['None'],
    weaponProficiencies: ['Daggers', 'darts', 'slings', 'quarterstaffs', 'light crossbows'],
    toolProficiencies: ['None'],
    startingEquipment: ['Quarterstaff', 'Spellbook', 'Arcane focus', 'Scholar\'s pack'],
    features: ['Spellcasting', 'Arcane Recovery', 'Ritual Casting'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Magical Affinity', 'Spell Mastery', 'Arcane Sight', 'Mana Control']
  },
  
  assassin: {
    name: 'Assassin',
    description: 'A master of stealth and precision strikes who excels in infiltration and elimination. Assassins can specialize in different assassination techniques.',
    hitDie: '1d8',
    primaryAbilities: ['AGI', 'SENSE'],
    savingThrows: ['AGI', 'SENSE'],
    skillChoices: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'stealth'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'hand crossbows', 'longswords', 'rapiers', 'shortswords'],
    toolProficiencies: ["Thieves' tools", 'Poisoner\'s kit'],
    startingEquipment: ['Shortsword', 'Shortbow', 'Leather armor', 'Thieves\' tools'],
    features: ['Sneak Attack', 'Thieves\' Cant', 'Cunning Action'],
    systemFavor: true,
    monarchPower: false, // Removed shadow energy - assassins use stealth, not shadow magic
    uniqueAbilities: ['Stealth Mastery', 'Precision Strike', 'Infiltration Expertise', 'Poison Knowledge']
  },
  
  healer: {
    name: 'Healer',
    description: 'A master of restorative magic and medical arts who can heal wounds and cure diseases. Healers can specialize in different healing techniques.',
    hitDie: '1d8',
    primaryAbilities: ['SENSE', 'PRE'],
    savingThrows: ['SENSE', 'PRE'],
    skillChoices: ['insight', 'medicine', 'persuasion', 'religion', 'survival'],
    armorProficiencies: ['Light armor', 'medium armor', 'shields'],
    weaponProficiencies: ['Simple weapons'],
    toolProficiencies: ['Herbalism kit', 'Healer\'s kit'],
    startingEquipment: ['Mace', 'Shield', 'Scale mail', 'Healer\'s kit'],
    features: ['Divine Domain', 'Channel Divinity', 'Divine Spellcasting'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Healing Touch', 'Divine Protection', 'Restorative Power', 'Life Force Control']
  },
  
  ranger: {
    name: 'Ranger',
    description: 'A master of wilderness survival and tracking who excels in ranged combat and natural exploration. Rangers can specialize in different terrains and foes.',
    hitDie: '1d10',
    primaryAbilities: ['AGI', 'SENSE'],
    savingThrows: ['AGI', 'SENSE'],
    skillChoices: ['athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
    armorProficiencies: ['Light armor', 'medium armor', 'shields'],
    weaponProficiencies: ['Simple weapons', 'martial weapons'],
    toolProficiencies: ['None'],
    startingEquipment: ['Longbow', 'Shortsword', 'Leather armor', 'Explorer\'s pack'],
    features: ['Favored Enemy', 'Natural Explorer', 'Ranger Archetype'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Wilderness Tracking', 'Beast Mastery', 'Terrain Adaptation', 'Survival Instincts']
  },
  
  berserker: {
    name: 'Berserker',
    description: 'A master of rage and brutal combat who excels in overwhelming force and destruction. Berserkers can specialize in different rage techniques.',
    hitDie: '1d12',
    primaryAbilities: ['STR', 'VIT'],
    savingThrows: ['STR', 'VIT'],
    skillChoices: ['athletics', 'intimidation', 'perception', 'survival'],
    armorProficiencies: ['Light armor', 'medium armor', 'shields'],
    weaponProficiencies: ['Simple weapons', 'martial weapons'],
    toolProficiencies: ['None'],
    startingEquipment: ['Greataxe', 'Handaxe', 'Chain mail', 'Explorer\'s pack'],
    features: ['Rage', 'Unarmored Defense', 'Reckless Attack'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Berserker Rage', 'Damage Resistance', 'Adrenaline Rush', 'Battle Fury']
  },
  
  tank: {
    name: 'Tank',
    description: 'A master of defense and protection who excels in absorbing damage and protecting allies. Tanks can specialize in different defensive techniques.',
    hitDie: '1d12',
    primaryAbilities: ['VIT', 'STR'],
    savingThrows: ['VIT', 'STR'],
    skillChoices: ['athletics', 'intimidation', 'perception', 'survival'],
    armorProficiencies: ['All armor', 'shields'],
    weaponProficiencies: ['Simple weapons', 'martial weapons'],
    toolProficiencies: ['None'],
    startingEquipment: ['Shield', 'Warhammer', 'Plate armor', 'Explorer\'s pack'],
    features: ['Divine Smite', 'Lay on Hands', 'Aura of Protection'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Defensive Stance', 'Damage Reduction', 'Protective Aura', 'Endurance']
  },
  
  summoner: {
    name: 'Summoner',
    description: 'A master of summoning and controlling creatures who excels in commanding allies and magical beings. Summoners can specialize in different summoning techniques.',
    hitDie: '1d8',
    primaryAbilities: ['PRE', 'INT'],
    savingThrows: ['PRE', 'INT'],
    skillChoices: ['arcana', 'deception', 'insight', 'persuasion', 'religion'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons'],
    toolProficiencies: ['None'],
    startingEquipment: ['Quarterstaff', 'Component pouch', 'Scholar\'s pack'],
    features: ['Summoning', 'Bonded Creature', 'Ethereal Jaunt'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Creature Bond', 'Summoning Mastery', 'Command Authority', 'Magical Link']
  },
  
  paladin: {
    name: 'Paladin',
    description: 'A holy warrior who combines martial prowess with divine magic, dedicated to protecting the innocent and fighting evil.',
    hitDie: '1d10',
    primaryAbilities: ['STR', 'PRE'],
    savingThrows: ['STR', 'PRE'],
    skillChoices: ['athletics', 'insight', 'intimidation', 'persuasion', 'religion'],
    armorProficiencies: ['All armor', 'shields'],
    weaponProficiencies: ['Simple weapons', 'martial weapons'],
    toolProficiencies: ['None'],
    startingEquipment: ['Longsword', 'Shield', 'Chain mail', 'Holy symbol'],
    features: ['Divine Sense', 'Lay on Hands', 'Divine Smite'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Holy Aura', 'Divine Protection', 'Sacred Weapon', 'Oath Power']
  },
  
  technomancer: {
    name: 'Technomancer',
    description: 'A master of technology and magical engineering who combines arcane power with mechanical innovation.',
    hitDie: '1d8',
    primaryAbilities: ['INT', 'AGI'],
    savingThrows: ['INT', 'AGI'],
    skillChoices: ['arcana', 'investigation', 'perception', 'technology', 'sleight-of-hand'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'firearms', 'technological weapons'],
    toolProficiencies: ['Tinker\'s tools', 'technological tools'],
    startingEquipment: ['Pistol', 'Technological focus', 'Light armor', 'Tool kit'],
    features: ['Technomancy', 'Infusion', 'Tool Expertise'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Technological Affinity', 'Magical Engineering', 'Device Manipulation', 'Power Integration']
  },
  
  warlock: {
    name: 'Warlock',
    description: 'A wielder of forbidden magic who makes pacts with powerful entities for supernatural abilities.',
    hitDie: '1d8',
    primaryAbilities: ['PRE', 'SENSE'],
    savingThrows: ['PRE', 'SENSE'],
    skillChoices: ['arcana', 'deception', 'history', 'intimidation', 'religion'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons'],
    toolProficiencies: ['None'],
    startingEquipment: ['Dagger', 'Component pouch', 'Leather armor'],
    features: ['Pact Magic', 'Otherworldly Patron', 'Eldritch Invocations'],
    systemFavor: true,
    monarchPower: false, // Warlocks use pact magic, not shadow energy
    uniqueAbilities: ['Pact Binding', 'Mystic Patron', 'Forbidden Knowledge', 'Pact Magic']
  },
  
  necromancer: {
    name: 'Necromancer',
    description: 'A master of death and undeath who commands the dead and manipulates life force.',
    hitDie: '1d8',
    primaryAbilities: ['INT', 'SENSE'],
    savingThrows: ['INT', 'SENSE'],
    skillChoices: ['arcana', 'history', 'investigation', 'medicine', 'religion'],
    armorProficiencies: ['None'],
    weaponProficiencies: ['Daggers', 'darts', 'quarterstaffs'],
    toolProficiencies: ['None'],
    startingEquipment: ['Quarterstaff', 'Component pouch', 'Scholar\'s pack'],
    features: ['Necromancy', 'Undead Control', 'Life Manipulation'],
    systemFavor: true,
    monarchPower: false, // Necromancers use life/death magic, not shadow energy
    uniqueAbilities: ['Death Affinity', 'Undead Command', 'Life Drain', 'Soul Manipulation']
  },
  
  monk: {
    name: 'Monk',
    description: 'A master of martial arts and inner discipline who excels in unarmed combat and mental focus.',
    hitDie: '1d8',
    primaryAbilities: ['AGI', 'SENSE'],
    savingThrows: ['AGI', 'SENSE'],
    skillChoices: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
    armorProficiencies: ['None'],
    weaponProficiencies: ['Simple weapons', 'shortswords'],
    toolProficiencies: ['One type of artisan\'s tools', 'musical instrument'],
    startingEquipment: ['Shortsword', 'Darts', 'Explorer\'s pack'],
    features: ['Unarmored Defense', 'Martial Arts', 'Ki Points'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Inner Focus', 'Martial Mastery', 'Ki Control', 'Mental Discipline']
  },
  
  bard: {
    name: 'Bard',
    description: 'A master of music and magic who inspires allies and manipulates emotions through performance.',
    hitDie: '1d8',
    primaryAbilities: ['PRE', 'INT'],
    savingThrows: ['PRE', 'INT'],
    skillChoices: ['acrobatics', 'animal-handling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleight-of-hand', 'stealth', 'survival'],
    armorProficiencies: ['Light armor'],
    weaponProficiencies: ['Simple weapons', 'hand crossbows', 'longswords', 'rapiers', 'shortswords'],
    toolProficiencies: ['Three musical instruments'],
    startingEquipment: ['Rapier', 'Lute', 'Leather armor', 'Entertainer\'s pack'],
    features: ['Bardic Inspiration', 'Jack of All Trades', 'Song of Rest'],
    systemFavor: true,
    monarchPower: false,
    uniqueAbilities: ['Musical Magic', 'Performance Mastery', 'Emotional Control', 'Inspiring Presence']
  }
};

// Create unified character from creation options
export function createUnifiedCharacter(options: UnifiedCharacterCreation): UnifiedCharacter {
  const classPackage = unifiedClassPackages[options.class];
  
  // Calculate derived stats
  const proficiencyBonus = getUnifiedProficiencyBonus(1);
  const systemFavorMax = options.systemFavor ? getSystemFavorMax(1) : 0;
  
  // Calculate hit points
  const vitMod = getUnifiedAbilityModifier('VIT', options.abilities.VIT);
  const maxHP = parseInt(classPackage.hitDie.replace('d', '')) + vitMod;
  
  // Calculate armor class
  const agiMod = getUnifiedAbilityModifier('AGI', options.abilities.AGI);
  const ac = 10 + agiMod;
  
  // Calculate spell slots based on class
  const spellSlots = calculateUnifiedSpellSlots(options.class, 1);
  
  // Create skill proficiencies
  const skillProficiencies: UnifiedSkillProficiency[] = options.skillProficiencies.map(skill => ({
    skill,
    proficient: true,
    expertise: options.skillExpertise.includes(skill)
  }));
  
  // Create saving throw proficiencies
  const savingThrowProficiencies: UnifiedSavingThrowProficiency[] = options.savingThrowProficiencies.map(ability => ({
    ability,
    proficient: true
  }));
  
  return {
    level: 1,
    class: options.class,
    race: options.race,
    background: options.background,
    abilities: options.abilities,
    proficiencyBonus,
    skillProficiencies,
    savingThrowProficiencies,
    systemFavorDie: 1,
    systemFavorMax,
    systemFavorCurrent: systemFavorMax,
    hitPoints: {
      max: maxHP,
      current: maxHP,
      temp: 0
    },
    armorClass: ac,
    speed: 30,
    spellSlots,
    knownPowers: [],
    equipment: [],
    monarchUnlocks: [],
    shadowSoldiers: [],
    runeInscriptions: []
  };
}

// Calculate unified spell slots based on class
function calculateUnifiedSpellSlots(classType: UnifiedClass, level: number): UnifiedSpellSlots {
  // Simplified spell slot calculation
  const fullCasterSlots: UnifiedSpellSlots = {
    cantrips: 0,
    level1: 2,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    level6: 0,
    level7: 0,
    level8: 0,
    level9: 0
  };
  
  const halfCasterSlots: UnifiedSpellSlots = {
    cantrips: 0,
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
  
  const pactSlots: UnifiedSpellSlots = {
    cantrips: 0,
    level1: 1,
    level2: 0,
    level3: 0,
    level4: 0,
    level5: 0,
    level6: 0,
    level7: 0,
    level8: 0,
    level9: 0
  };
  
  // Determine spell slot progression based on class
  const spellcasters: UnifiedClass[] = ['mage', 'warlock', 'necromancer', 'technomancer'];
  const halfCasters: UnifiedClass[] = ['paladin', 'ranger'];
  const pactCasters: UnifiedClass[] = ['warlock'];
  
  if (pactCasters.includes(classType)) {
    return pactSlots;
  } else if (halfCasters.includes(classType)) {
    return halfCasterSlots;
  } else if (spellcasters.includes(classType)) {
    return fullCasterSlots;
  } else {
    return {
      cantrips: 0,
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
}

// Validate unified character creation
export function validateUnifiedCharacter(options: UnifiedCharacterCreation): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate name
  if (!options.name || options.name.trim().length === 0) {
    errors.push('Character name is required');
  }
  
  // Validate ability scores
  const totalAbilityScore = Object.values(options.abilities).reduce((sum, score) => sum + score, 0);
  if (totalAbilityScore < 70 || totalAbilityScore > 80) {
    warnings.push('Ability scores should total between 70 and 80 points');
  }
  
  // Validate class
  if (!options.class) {
    errors.push('Class selection is required');
  }
  
  // Validate primary abilities
  const classPackage = unifiedClassPackages[options.class];
  const hasPrimaryAbility = classPackage.primaryAbilities.some(ability => 
    options.abilities[ability] >= 13
  );
  
  if (!hasPrimaryAbility) {
    warnings.push(`Consider allocating higher scores to primary abilities: ${classPackage.primaryAbilities.join(', ')}`);
  }
  
  // Validate skill selections
  if (options.skillProficiencies.length > 2) {
    warnings.push('Most classes only allow 2-3 skill proficiencies at level 1');
  }
  
  // Validate monarch power
  if (options.monarchPower && !classPackage.monarchPower) {
    errors.push(formatMonarchVernacular('Monarch Power is not available for this class'));
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

