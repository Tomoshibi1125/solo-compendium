// REGENT & GEMINI PROTOCOL SYSTEM
// Advanced sovereign class system with DBZ-style fusion mechanics

import { Character } from '../types/character';
import { LocalAIIntegration } from './localAIIntegration';

type AbilityScore = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
type Job = string;

interface Feature {
  name: string;
  description: string;
  type: string;
}

interface StructuredSpell {
  name: string;
  description: string;
  level: number;
  school: string;
}

type Spell = string | StructuredSpell;

interface Trait {
  name: string;
  description: string;
  type: string;
  benefits: string[];
}

// Regent types based on highest stat
export enum RegentType {
  STRENGTH_REGENT = 'Strength Regent',
  DEXTERITY_REGENT = 'Dexterity Regent', 
  CONSTITUTION_REGENT = 'Constitution Regent',
  INTELLIGENCE_REGENT = 'Intelligence Regent',
  WISDOM_REGENT = 'Wisdom Regent',
  CHARISMA_REGENT = 'Charisma Regent'
}

// Regent paths with unique abilities
export interface RegentPath {
  id: string;
  name: string;
  type: RegentType;
  description: string;
  abilities: string[];
  features: Feature[];
  spells: Spell[];
  requirements: {
    level: number;
    questCompleted?: string;
    statThreshold: number;
  };
}

// Gemini Protocol fusion result
export interface GeminiSovereign {
  id: string;
  name: string;
  baseJob: Job;
  basePath?: string;
  regent1: RegentPath;
  regent2: RegentPath;
  fusionType: 'Perfect' | 'Good' | 'Average';
  description: string;
  abilities: string[];
  features: Feature[];
  spells: Spell[];
  techniques: string[];
  traits: Trait[];
  statBonuses: Partial<Record<AbilityScore, number>>;
  specialAbilities: string[];
}

// AI-generated regent options
export interface RegentChoice {
  regent: RegentPath;
  aiReasoning: string;
  statAlignment: number;
  compatibilityScore: number;
}

// Complete regent system implementation
export class RegentGeminiSystem {
  static readonly REGENT_DATABASE: RegentPath[] = [
    // Strength-based regents
    {
      id: 'iron_fist_regent',
      name: 'Iron Fist Regent',
      type: RegentType.STRENGTH_REGENT,
      description: 'Master of physical combat and martial prowess',
      abilities: ['Unarmed Strike Mastery', 'Brute Force', 'Physical Dominance'],
      features: [
        {
          name: 'Titanic Strength',
          description: 'Double strength modifier for melee attacks',
          type: 'passive'
        }
      ],
      spells: [],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'warlord_regent',
      name: 'Warlord Regent', 
      type: RegentType.STRENGTH_REGENT,
      description: 'Commander of armies and master of warfare',
      abilities: ['Battle Command', 'Tactical Mastery', 'Army Leadership'],
      features: [
        {
          name: 'Inspiring Presence',
          description: 'Allies gain +2 to attack rolls within 30ft',
          type: 'aura'
        }
      ],
      spells: [],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'berserker_regent',
      name: 'Berserker Regent',
      type: RegentType.STRENGTH_REGENT,
      description: 'Unleashed fury and unstoppable rage',
      abilities: ['Rage Transformation', 'Fury Strike', 'Unstoppable Force'],
      features: [
        {
          name: 'Primal Rage',
          description: 'Enter rage state for enhanced combat abilities',
          type: 'transformation'
        }
      ],
      spells: [],
      requirements: { level: 12, statThreshold: 17 }
    },
    
    // Dexterity-based regents
    {
      id: 'shadow_dancer_regent',
      name: 'Shadow Dancer Regent',
      type: RegentType.DEXTERITY_REGENT,
      description: 'Master of stealth and acrobatic movement',
      abilities: ['Shadow Step', 'Perfect Balance', 'Acrobatic Mastery'],
      features: [
        {
          name: 'Shadowmeld',
          description: 'Become invisible in shadows',
          type: 'stealth'
        }
      ],
      spells: ['Darkness', 'Shadow Strike'],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'wind_walker_regent',
      name: 'Wind Walker Regent',
      type: RegentType.DEXTERITY_REGENT,
      description: 'Swift as the wind, impossible to catch',
      abilities: ['Wind Step', 'Lightning Speed', 'Evasion Mastery'],
      features: [
        {
          name: 'Wind Walk',
          description: 'Move through enemies without provoking attacks',
          type: 'movement'
        }
      ],
      spells: ['Haste', 'Feather Fall'],
      requirements: { level: 12, statThreshold: 17 }
    },
    {
      id: 'phantom_blade_regent',
      name: 'Phantom Blade Regent',
      type: RegentType.DEXTERITY_REGENT,
      description: 'Master of weapon techniques and precision strikes',
      abilities: ['Phantom Strike', 'Weapon Mastery', 'Perfect Aim'],
      features: [
        {
          name: 'Ghost Touch',
          description: 'Attacks ignore armor and resistances',
          type: 'offensive'
        }
      ],
      spells: ['Teleport Strike', 'Blade Ward'],
      requirements: { level: 15, statThreshold: 18 }
    },
    
    // Constitution-based regents
    {
      id: 'iron_body_regent',
      name: 'Iron Body Regent',
      type: RegentType.CONSTITUTION_REGENT,
      description: 'Unbreakable body and incredible endurance',
      abilities: ['Iron Skin', 'Endurance Mastery', 'Pain Resistance'],
      features: [
        {
          name: 'Adamantine Body',
          description: 'Immunity to poison and resistance to all damage',
          type: 'defensive'
        }
      ],
      spells: ['Stoneskin', 'Regeneration'],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'earth_guardian_regent',
      name: 'Earth Guardian Regent',
      type: RegentType.CONSTITUTION_REGENT,
      description: 'Protector of the land and its people',
      abilities: ['Earth Shield', 'Ground Control', 'Protection Aura'],
      features: [
        {
          name: 'Guardian Shield',
          description: 'Protect allies within 30ft with damage reduction',
          type: 'protective'
        }
      ],
      spells: ['Wall of Stone', 'Earthquake'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'life_binder_regent',
      name: 'Life Binder Regent',
      type: RegentType.CONSTITUTION_REGENT,
      description: 'Master of life force and healing',
      abilities: ['Life Force Control', 'Healing Touch', 'Vitality Mastery'],
      features: [
        {
          name: 'Life Transfer',
          description: 'Transfer life force between allies',
          type: 'healing'
        }
      ],
      spells: ['Heal', 'Mass Cure', 'Resurrection'],
      requirements: { level: 12, statThreshold: 17 }
    },
    
    // Intelligence-based regents
    {
      id: 'arcane_master_regent',
      name: 'Arcane Master Regent',
      type: RegentType.INTELLIGENCE_REGENT,
      description: 'Supreme mastery of magical arts',
      abilities: ['Spell Mastery', 'Arcane Insight', 'Reality Manipulation'],
      features: [
        {
          name: 'Spell Weaving',
          description: 'Combine and modify spells in real-time',
          type: 'magical'
        }
      ],
      spells: ['Time Stop', 'Wish', 'Meteor Swarm'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'technomancer_regent',
      name: 'Technomancer Regent',
      type: RegentType.INTELLIGENCE_REGENT,
      description: 'Fusion of magic and technology',
      abilities: ['Tech Integration', 'Invention Mastery', 'Digital Control'],
      features: [
        {
          name: 'Technological Integration',
          description: 'Combine magic with advanced technology',
          type: 'technological'
        }
      ],
      spells: ['Lightning Bolt', 'Force Field', 'Hologram'],
      requirements: { level: 12, statThreshold: 17 }
    },
    {
      id: 'mind_lord_regent',
      name: 'Mind Lord Regent',
      type: RegentType.INTELLIGENCE_REGENT,
      description: 'Master of mental powers and psionics',
      abilities: ['Telepathy', 'Mind Control', 'Psychic Domination'],
      features: [
        {
          name: 'Psychic Network',
          description: 'Create mental network with allies',
          type: 'psionic'
        }
      ],
      spells: ['Dominate Person', 'Mind Blank', 'Psychic Scream'],
      requirements: { level: 10, statThreshold: 16 }
    },
    
    // Wisdom-based regents
    {
      id: 'divine_seer_regent',
      name: 'Divine Seer Regent',
      type: RegentType.WISDOM_REGENT,
      description: 'Prophet with divine insight and foresight',
      abilities: ['Divine Sight', 'Prophecy', 'Healing Hands'],
      features: [
        {
          name: 'Divine Intervention',
          description: 'Call upon divine power for assistance',
          type: 'divine'
        }
      ],
      spells: ['Heal', 'Divine Favor', 'True Seeing'],
      requirements: { level: 12, statThreshold: 17 }
    },
    {
      id: 'nature_lord_regent',
      name: 'Nature Lord Regent',
      type: RegentType.WISDOM_REGENT,
      description: 'Master of natural world and its creatures',
      abilities: ['Beast Command', 'Plant Control', 'Weather Mastery'],
      features: [
        {
          name: 'Nature\'s Wrath',
          description: 'Command natural forces to attack enemies',
          type: 'elemental'
        }
      ],
      spells: ['Call Lightning', 'Control Weather', 'Summon Nature\'s Ally'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'spirit_walker_regent',
      name: 'Spirit Walker Regent',
      type: RegentType.WISDOM_REGENT,
      description: 'Traveler between spirit and material worlds',
      abilities: ['Spirit Form', 'Astral Projection', 'Soul Sight'],
      features: [
        {
          name: 'Ethereal Form',
          description: 'Become ethereal and pass through objects',
          type: 'spiritual'
        }
      ],
      spells: ['Ethereal Jaunt', 'Spirit Guardians', 'Plane Shift'],
      requirements: { level: 10, statThreshold: 16 }
    },
    
    // Charisma-based regents
    {
      id: 'silver_tongue_regent',
      name: 'Silver Tongue Regent',
      type: RegentType.CHARISMA_REGENT,
      description: 'Master of persuasion and social manipulation',
      abilities: ['Persuasion Mastery', 'Charm Person', 'Leadership Aura'],
      features: [
        {
          name: 'Golden Voice',
          description: 'Words have magical persuasive power',
          type: 'social'
        }
      ],
      spells: ['Charm Monster', 'Suggestion', 'Mass Suggestion'],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'royal_commander_regent',
      name: 'Royal Commander Regent',
      type: RegentType.CHARISMA_REGENT,
      description: 'Natural leader with royal authority',
      abilities: ['Royal Command', 'Inspire Loyalty', 'Noble Presence'],
      features: [
        {
          name: 'Royal Authority',
          description: 'Commands must be obeyed by subjects',
          type: 'authority'
        }
      ],
      spells: ['Command', 'Heroism', 'Mass Heroism'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'soul_binder_regent',
      name: 'Soul Binder Regent',
      type: RegentType.CHARISMA_REGENT,
      description: 'Master of souls and spiritual contracts',
      abilities: ['Soul Binding', 'Spirit Contracts', 'Life Force Manipulation'],
      features: [
        {
          name: 'Soul Pact',
          description: 'Make binding contracts with powerful spirits',
          type: 'spiritual'
        }
      ],
      spells: ['Soul Bind', 'Spiritual Weapon', 'True Resurrection'],
      requirements: { level: 12, statThreshold: 17 }
    }
  ];

  // Generate regent choices based on character's highest stat
  static async generateRegentChoices(character: Character): Promise<RegentChoice[]> {
    const abilities = this.getCharacterAbilities(character);
    const highestStat = this.getHighestStat(abilities);
    const availableRegents = this.REGENT_DATABASE.filter(regent => 
      regent.type === this.getRegentType(highestStat) &&
      regent.requirements.level <= character.level &&
      regent.requirements.statThreshold <= abilities[highestStat]
    );

    // Use AI to select and rank the best 3 options
    const aiChoices = await this.aiSelectRegents(character, availableRegents, highestStat);
    
    return aiChoices.slice(0, 3); // Return top 3 choices
  }

  // Create Gemini Protocol fusion
  static async createGeminiFusion(
    character: Character,
    regent1: RegentPath,
    regent2: RegentPath
  ): Promise<GeminiSovereign> {
    const baseJob = this.getCharacterJob(character);
    const basePath = this.getCharacterPath(character);
    
    // AI generates fusion based on regents and base job
    const fusion = await this.aiGenerateFusion(character, regent1, regent2, baseJob, basePath);
    
    return {
      id: fusion.id,
      name: fusion.name,
      description: fusion.description,
      abilities: fusion.abilities,
      features: fusion.features,
      spells: fusion.spells,
      techniques: fusion.techniques,
      traits: fusion.traits,
      statBonuses: fusion.statBonuses,
      specialAbilities: fusion.specialAbilities,
      baseJob,
      basePath,
      regent1,
      regent2,
      fusionType: this.calculateFusionType(regent1, regent2)
    };
  }

  // Private helper methods
  private static getHighestStat(abilities: Record<AbilityScore, number>): AbilityScore {
    let highest: AbilityScore = 'STR';
    const abilityOrder: AbilityScore[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
    for (const ability of abilityOrder) {
      if (abilities[ability] > abilities[highest]) {
        highest = ability;
      }
    }
    return highest;
  }

  private static getRegentType(stat: AbilityScore): RegentType {
    const statToRegent: Record<AbilityScore, RegentType> = {
      'STR': RegentType.STRENGTH_REGENT,
      'DEX': RegentType.DEXTERITY_REGENT,
      'CON': RegentType.CONSTITUTION_REGENT,
      'INT': RegentType.INTELLIGENCE_REGENT,
      'WIS': RegentType.WISDOM_REGENT,
      'CHA': RegentType.CHARISMA_REGENT
    };
    return statToRegent[stat];
  }

  // AI integration for regent selection
  private static async aiSelectRegents(
    character: Character, 
    availableRegents: RegentPath[], 
    highestStat: AbilityScore
  ): Promise<RegentChoice[]> {
    
    // Simulate AI analysis with comprehensive scoring
    const choices: RegentChoice[] = [];
    
    for (const regent of availableRegents) {
      const score = await this.aiAnalyzeRegentChoice(character, regent, highestStat);
      choices.push({
        regent,
        aiReasoning: score.reasoning,
        statAlignment: score.alignment,
        compatibilityScore: score.compatibility
      });
    }
    
    // Sort by compatibility score
    return choices.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  // AI analysis for regent compatibility
  private static async aiAnalyzeRegentChoice(
    character: Character,
    regent: RegentPath,
    highestStat: AbilityScore
  ): Promise<{ reasoning: string; alignment: number; compatibility: number }> {
    const abilities = this.getCharacterAbilities(character);
    const job = this.getCharacterJob(character);
    
    // Simulate AI reasoning process
    const statAlignment = abilities[highestStat] - regent.requirements.statThreshold;
    const levelAlignment = character.level - regent.requirements.level;
    const jobCompatibility = this.calculateJobCompatibility(job, regent);
    const playstyleMatch = this.calculatePlaystyleMatch(character, regent);
    
    const compatibility = (statAlignment * 2) + (levelAlignment * 1.5) + (jobCompatibility * 2) + (playstyleMatch * 1.5);
    
    const reasoning = `This regent aligns ${statAlignment > 0 ? 'perfectly' : 'well'} with your ${highestStat} stat (${abilities[highestStat]} vs ${regent.requirements.statThreshold} needed), matches your ${job} class at ${jobCompatibility}% compatibility, and suits your playstyle at ${playstyleMatch}% match.`;
    
    return {
      reasoning,
      alignment: statAlignment,
      compatibility
    };
  }

  // AI fusion generation
  private static async aiGenerateFusion(
    character: Character,
    regent1: RegentPath,
    regent2: RegentPath,
    baseJob: Job,
    basePath?: string
  ): Promise<{
    id: string;
    name: string;
    description: string;
    abilities: string[];
    features: Feature[];
    spells: Spell[];
    techniques: string[];
    traits: Trait[];
    statBonuses: Partial<Record<AbilityScore, number>>;
    specialAbilities: string[];
  }> {
    
    // AI generates unique fusion name and abilities
    const fusionName = await this.aiGenerateFusionName(regent1, regent2, baseJob, basePath);
    const fusionAbilities = await this.aiMergeAbilities(regent1, regent2, baseJob, basePath);
    const fusionFeatures = await this.aiMergeFeatures(regent1, regent2, baseJob, basePath);
    const fusionSpells = await this.aiMergeSpells(regent1, regent2, character, baseJob, basePath);
    const fusionTechniques = await this.aiGenerateTechniques(regent1, regent2, baseJob, basePath);
    const fusionTraits = await this.aiMergeTraits(regent1, regent2, baseJob, basePath);
    const statBonuses = await this.aiCalculateStatBonuses(regent1, regent2);
    const specialAbilities = await this.aiGenerateSpecialAbilities(regent1, regent2, character, baseJob, basePath);
    const basePathLabel = basePath || 'Base Path';
    const safeJob = baseJob.toLowerCase().replace(/\s+/g, '_');
    
    return {
      id: `gemini_${safeJob}_${regent1.id}_${regent2.id}`,
      name: fusionName,
      description: `${baseJob} ${basePathLabel} synthesis with ${regent1.name} and ${regent2.name}.`,
      abilities: fusionAbilities,
      features: fusionFeatures,
      spells: fusionSpells,
      techniques: fusionTechniques,
      traits: fusionTraits,
      statBonuses,
      specialAbilities
    };
  }

  // AI fusion name generation
  private static async aiGenerateFusionName(
    regent1: RegentPath,
    regent2: RegentPath,
    baseJob: Job,
    basePath?: string
  ): Promise<string> {
    const basePathLabel = basePath || 'Base';
    // Simulate AI creative fusion naming
    const namePatterns = [
      `${baseJob} ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Sovereign`,
      `${basePathLabel} ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Ascendant`,
      `${regent1.name.split(' ')[0]} ${regent2.name.split(' ').pop()}`,
      `${regent2.name.split(' ')[0]} ${regent1.name.split(' ').pop()}`,
      `Fusion ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]}`,
      `${regent1.name.split(' ')[0]} Master ${regent2.name.split(' ')[0]} Lord`,
      `Dual ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Sovereign`
    ];
    
    // AI would select the most epic-sounding name
    return namePatterns[Math.floor(Math.random() * namePatterns.length)];
  }

  // AI ability merging
  private static async aiMergeAbilities(
    regent1: RegentPath,
    regent2: RegentPath,
    baseJob: Job,
    basePath?: string
  ): Promise<string[]> {
    const basePathLabel = basePath || 'Base';
    const allAbilities = [...regent1.abilities, ...regent2.abilities];
    
    // AI creates unique fusion abilities
    const fusionAbilities = [
      ...allAbilities,
      `${baseJob} ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Art`,
      `${basePathLabel} Path Resonance`,
      `${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Fusion`,
      `Dual ${regent1.name.split(' ')[0]} ${regent2.name.split(' ')[0]} Mastery`,
      `Sovereign ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Power`
    ];
    
    return fusionAbilities;
  }

  // AI feature merging
  private static async aiMergeFeatures(
    regent1: RegentPath,
    regent2: RegentPath,
    baseJob: Job,
    basePath?: string
  ): Promise<Feature[]> {
    const basePathLabel = basePath || 'Base';
    const mergedFeatures = [...regent1.features, ...regent2.features];
    
    // AI creates fusion-specific features
    const fusionFeature: Feature = {
      name: `Fusion Mastery: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]}`,
      description: `${baseJob} (${basePathLabel}) techniques fused with ${regent1.name} and ${regent2.name} powers`,
      type: 'fusion'
    };
    
    return [...mergedFeatures, fusionFeature];
  }

  // AI spell merging
  private static async aiMergeSpells(
    regent1: RegentPath,
    regent2: RegentPath,
    character: Character,
    baseJob: Job,
    basePath?: string
  ): Promise<Spell[]> {
    const basePathLabel = basePath || 'Base';
    const allSpells = [...regent1.spells, ...regent2.spells];
    
    // AI creates fusion-specific spells
    const fusionSpells: Spell[] = [
      {
        name: `Fusion ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Strike`,
        description: `Combined power of both regents tempered through ${baseJob} ${basePathLabel} doctrine`,
        level: Math.max(regent1.requirements.level, regent2.requirements.level),
        school: 'fusion'
      },
      {
        name: `Dual ${regent1.name.split(' ')[0]} ${regent2.name.split(' ')[0]} Aura`,
        description: `Aura combining both regent powers`,
        level: Math.max(regent1.requirements.level, regent2.requirements.level) + 1,
        school: 'aura'
      }
    ];
    
    return [...allSpells, ...fusionSpells];
  }

  // AI technique generation
  private static async aiGenerateTechniques(
    regent1: RegentPath,
    regent2: RegentPath,
    baseJob: Job,
    basePath?: string
  ): Promise<string[]> {
    const basePathLabel = basePath || 'Base';
    return [
      `${baseJob} Fusion Technique: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]}`,
      `${basePathLabel} Path Synthesis Stance`,
      `${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Combination Attack`,
      `Dual ${regent1.name.split(' ')[0]} Defense`,
      `${regent2.name.split(' ')[0]}-${regent1.name.split(' ')[0]} Counter`,
      `Fusion ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Ultimate`
    ];
  }

  // AI trait merging
  private static async aiMergeTraits(
    regent1: RegentPath,
    regent2: RegentPath,
    baseJob: Job,
    basePath?: string
  ): Promise<Trait[]> {
    const basePathLabel = basePath || 'Base';
    const fusionTrait: Trait = {
      name: `Gemini Fusion: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]}`,
      description: `Permanent fusion of ${regent1.name} and ${regent2.name} powers`,
      type: 'fusion',
      benefits: [
        `${baseJob} combat doctrine permanently rewritten by Gemini Protocol`,
        `${basePathLabel} path techniques are integrated into every sovereign action`,
        `Access to both ${regent1.name} and ${regent2.name} abilities`,
        `Enhanced power when both regents are active`,
        `Unique fusion abilities and techniques`
      ]
    };
    
    return [fusionTrait];
  }

  // AI stat bonus calculation
  private static async aiCalculateStatBonuses(regent1: RegentPath, regent2: RegentPath): Promise<Partial<Record<AbilityScore, number>>> {
    const bonuses: Partial<Record<AbilityScore, number>> = {};
    
    // AI calculates optimal stat distribution
    const regent1Type = regent1.type;
    const regent2Type = regent2.type;
    
    if (regent1Type === RegentType.STRENGTH_REGENT || regent2Type === RegentType.STRENGTH_REGENT) {
      bonuses.STR = 4;
    }
    if (regent1Type === RegentType.DEXTERITY_REGENT || regent2Type === RegentType.DEXTERITY_REGENT) {
      bonuses.DEX = 4;
    }
    if (regent1Type === RegentType.CONSTITUTION_REGENT || regent2Type === RegentType.CONSTITUTION_REGENT) {
      bonuses.CON = 4;
    }
    if (regent1Type === RegentType.INTELLIGENCE_REGENT || regent2Type === RegentType.INTELLIGENCE_REGENT) {
      bonuses.INT = 4;
    }
    if (regent1Type === RegentType.WISDOM_REGENT || regent2Type === RegentType.WISDOM_REGENT) {
      bonuses.WIS = 4;
    }
    if (regent1Type === RegentType.CHARISMA_REGENT || regent2Type === RegentType.CHARISMA_REGENT) {
      bonuses.CHA = 4;
    }
    
    // Fusion bonus
    bonuses.STR = (bonuses.STR || 0) + 2;
    bonuses.DEX = (bonuses.DEX || 0) + 2;
    bonuses.CON = (bonuses.CON || 0) + 2;
    bonuses.INT = (bonuses.INT || 0) + 2;
    bonuses.WIS = (bonuses.WIS || 0) + 2;
    bonuses.CHA = (bonuses.CHA || 0) + 2;
    
    return bonuses;
  }

  // AI special ability generation
  private static async aiGenerateSpecialAbilities(
    regent1: RegentPath,
    regent2: RegentPath,
    character: Character,
    baseJob: Job,
    basePath?: string
  ): Promise<string[]> {
    const basePathLabel = basePath || 'Base';
    return [
      `${baseJob} Sovereign Awakening: ${basePathLabel} path enhanced by fusion`,
      `Gemini Fusion: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Awakening`,
      `Dual Regent Mastery: Perfect control over both regent powers`,
      `Sovereign Authority: Commands respected by all subjects`,
      `Fusion Resilience: Resistance to all damage types`,
      `Ultimate Fusion: Combine both regents into ultimate form`
    ];
  }

  // Helper methods for compatibility calculation
  private static calculateJobCompatibility(job: Job, regent: RegentPath): number {
    // AI calculates how well regent matches character's base job
    const jobRegentMap: Record<Job, string[]> = {
      'Warrior': ['Strength Regent', 'Constitution Regent', 'Dexterity Regent'],
      'Mage': ['Intelligence Regent', 'Wisdom Regent', 'Charisma Regent'],
      'Rogue': ['Dexterity Regent', 'Charisma Regent', 'Intelligence Regent'],
      'Cleric': ['Wisdom Regent', 'Charisma Regent', 'Constitution Regent'],
      'Ranger': ['Dexterity Regent', 'Wisdom Regent', 'Constitution Regent'],
      'Paladin': ['Strength Regent', 'Charisma Regent', 'Constitution Regent']
    };
    
    const compatibleRegents = jobRegentMap[job] || [];
    return compatibleRegents.includes(regent.type) ? 85 : 60;
  }

  private static calculatePlaystyleMatch(character: Character, regent: RegentPath): number {
    // AI analyzes character's playstyle preferences
    // This would integrate with character's actual gameplay data
    return Math.floor(Math.random() * 30) + 70; // Simulated 70-100% match
  }

  private static calculateFusionType(regent1: RegentPath, regent2: RegentPath): 'Perfect' | 'Good' | 'Average' {
    const levelDiff = Math.abs(regent1.requirements.level - regent2.requirements.level);
    const statDiff = Math.abs(regent1.requirements.statThreshold - regent2.requirements.statThreshold);
    
    if (levelDiff <= 2 && statDiff <= 2) return 'Perfect';
    if (levelDiff <= 5 && statDiff <= 5) return 'Good';
    return 'Average';
  }

  private static getCharacterJob(character: Character): Job {
    return character.job || character.class || 'Adventurer';
  }

  private static getCharacterPath(character: Character): string | undefined {
    return character.path;
  }

  private static getCharacterAbilities(character: Character): Record<AbilityScore, number> {
    if (character.abilities) {
      return character.abilities;
    }

    return {
      STR: character.abilityScores?.strength ?? 10,
      DEX: character.abilityScores?.dexterity ?? 10,
      CON: character.abilityScores?.constitution ?? 10,
      INT: character.abilityScores?.intelligence ?? 10,
      WIS: character.abilityScores?.wisdom ?? 10,
      CHA: character.abilityScores?.charisma ?? 10,
    };
  }
}

// Quest completion tracking for regent unlocking
export interface RegentQuest {
  id: string;
  name: string;
  description: string;
  regentUnlock: string;
  requirements: {
    level: number;
    prerequisites: string[];
  };
  completed: boolean;
  completedBy: string; // DM/Protocol Warden ID
  completionDate?: Date;
}

// Quest management system
export class RegentQuestManager {
  private static readonly QUEST_DATABASE: RegentQuest[] = [
    {
      id: 'iron_fist_trial',
      name: 'Trial of the Iron Fist',
      description: 'Prove your strength in combat against the arena champions',
      regentUnlock: 'iron_fist_regent',
      requirements: { level: 10, prerequisites: ['basic_combat_training'] },
      completed: false,
      completedBy: ''
    },
    {
      id: 'shadow_dancer_path',
      name: 'Path of the Shadow Dancer',
      description: 'Complete the stealth trials in the ancient temple',
      regentUnlock: 'shadow_dancer_regent',
      requirements: { level: 10, prerequisites: ['basic_stealth_training'] },
      completed: false,
      completedBy: ''
    },
    {
      id: 'arcane_mastery',
      name: 'Arcane Mastery Challenge',
      description: 'Defeat the arcane guardians and prove your magical knowledge',
      regentUnlock: 'arcane_master_regent',
      requirements: { level: 15, prerequisites: ['advanced_spell_knowledge'] },
      completed: false,
      completedBy: ''
    }
    // ... more quests for each regent
  ];

  // Check if character has completed required quest
  static hasCompletedQuest(characterId: string, questId: string): boolean {
    const quest = this.QUEST_DATABASE.find(q => q.id === questId);
    return Boolean(quest?.completed && quest.completedBy === characterId);
  }

  // Complete quest (DM/Protocol Warden action)
  static completeQuest(questId: string, wardenId: string): void {
    const quest = this.QUEST_DATABASE.find(q => q.id === questId);
    if (quest) {
      quest.completed = true;
      quest.completedBy = wardenId;
      quest.completionDate = new Date();
    }
  }

  // Get available regents for character
  static getAvailableRegents(characterId: string): RegentPath[] {
    const completedQuests = this.QUEST_DATABASE.filter(q => 
      q.completed && q.completedBy === characterId
    );
    
    const unlockedRegentIds = completedQuests.map(q => q.regentUnlock);
    
    return RegentGeminiSystem.REGENT_DATABASE.filter(regent => 
      unlockedRegentIds.includes(regent.id)
    );
  }
}
