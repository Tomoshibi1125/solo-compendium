// REGENT & GEMINI PROTOCOL SYSTEM
// Advanced sovereign class system with AI-driven fusion mechanics
// Nine Regents inspired by Solo Leveling's Nine Monarchs

import { Character } from '../types/character';
import { LocalAIIntegration } from './localAIIntegration';
import { NINE_REGENTS } from './nineRegents';

type AbilityScore = 'STR' | 'AGI' | 'VIT' | 'INT' | 'SENSE' | 'PRE';
type Job = string;

export { RegentType } from './regentTypes';
export type { RegentPath, Feature, Spell, Trait, StructuredSpell } from './regentTypes';
import { RegentType, type RegentPath, type Feature, type Spell, type Trait } from './regentTypes';

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
  adaptationNote?: string; // How the regent is adapted for martial/caster compatibility
  compatibilityScore: number;
}

// Complete regent system implementation
// The Nine Regents - Inspired by Solo Leveling's Nine Monarchs
//
// REGENT SELECTION RULES:
// 1. On quest unlock, AI presents 3 regent choices
// 2. Choices are based on character's stats, job, playstyle
// 3. Player picks ONE regent
// 4. When DM unlocks second quest, AI presents 3 NEW choices (cannot pick same regent twice)
// 5. Player picks ONE more regent (MAX 2 REGENTS TOTAL)
// 6. If martial picks caster regent (or vice versa), AI adapts it for compatibility
// 7. When player has 2 regents, they can fuse via Gemini Protocol
// 8. ALL 9x9 regent combinations are valid for fusion (81 possible sovereigns)
export class RegentGeminiSystem {
  // Import the Nine Regents from nineRegents.ts
  static readonly REGENT_DATABASE: RegentPath[] = NINE_REGENTS;
  static readonly MAX_REGENTS_PER_CHARACTER = 2;

  /**
   * Generate 3 regent choices on quest unlock
   * AI considers: character stats, job type (martial/caster), playstyle, current regents
   */
  static async generateRegentChoices(
    character: Character,
    currentRegents: string[] = [] // IDs of regents already chosen
  ): Promise<RegentChoice[]> {
    // Cannot have more than 2 regents
    if (currentRegents.length >= this.MAX_REGENTS_PER_CHARACTER) {
      throw new Error(`Character already has maximum ${this.MAX_REGENTS_PER_CHARACTER} regents. Cannot choose more.`);
    }

    const abilities = this.getCharacterAbilities(character);
    const job = this.getCharacterJob(character);
    const jobType = this.getJobType(job); // 'martial', 'caster', 'halfcaster', 'pactcaster'

    // Filter out regents already chosen
    const availableRegents = this.REGENT_DATABASE.filter(
      regent => !currentRegents.includes(regent.id) &&
        regent.requirements.statThreshold <= this.getHighestAbilityScore(abilities)
    );

    // Use AI to select and rank the best 3 options
    // AI considers stat alignment, job compatibility, and adaptation needs
    const aiChoices = await this.aiSelectRegents(character, availableRegents, jobType);

    return aiChoices.slice(0, 3); // Return top 3 choices
  }

  /**
   * Create Gemini Protocol fusion (Sovereign)
   * ALL 9x9 combinations are possible (81 total sovereigns)
   * AI generates unique fusion based on: Job + Path + Regent A + Regent B
   */
  static async createGeminiFusion(
    character: Character,
    regent1: RegentPath,
    regent2: RegentPath
  ): Promise<GeminiSovereign> {
    const baseJob = this.getCharacterJob(character);
    const basePath = this.getCharacterPath(character);
    const jobType = this.getJobType(baseJob);

    // AI generates fusion based on regents and base job
    // Adapts regent features for martial/caster compatibility if needed
    const fusion = await this.aiGenerateFusion(character, regent1, regent2, baseJob, basePath);

    // Calculate fusion quality based on thematic/mechanical synergy (not stats)
    const fusionType = this.calculateFusionSynergy(regent1, regent2, jobType);

    return {
      id: fusion.id,
      name: fusion.name,
      description: fusion.description,
      abilities: fusion.abilities,
      features: fusion.features,
      spells: fusion.spells,
      techniques: fusion.techniques,
      traits: fusion.traits,
      statBonuses: {}, // NO stat bonuses - sovereigns are powerful subclass overlays
      specialAbilities: fusion.specialAbilities,
      baseJob,
      basePath,
      regent1,
      regent2,
      fusionType
    };
  }

  // Private helper methods
  private static getHighestStat(abilities: Record<AbilityScore, number>): AbilityScore {
    let highest: AbilityScore = 'STR';
    const abilityOrder: AbilityScore[] = ['STR', 'AGI', 'VIT', 'INT', 'SENSE', 'PRE'];
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
      'AGI': RegentType.AGILITY_REGENT,
      'VIT': RegentType.VITALITY_REGENT,
      'INT': RegentType.INTELLIGENCE_REGENT,
      'SENSE': RegentType.SENSE_REGENT,
      'PRE': RegentType.PRESENCE_REGENT
    };
    return statToRegent[stat];
  }

  private static getHighestAbilityScore(abilities: Record<AbilityScore, number>): number {
    return Math.max(...Object.values(abilities));
  }

  /**
   * Determine job type for regent adaptation
   * Martial jobs: Destroyer, Berserker, Assassin, Holy Knight, Stalker, Striker
   * Casters: Mage, Herald, Summoner, Esper, Revenant, Idol
   * Halfcasters: None currently (but supported for future)
   * Pactcasters: Contractor, Technomancer
   */
  private static getJobType(job: string): 'martial' | 'caster' | 'halfcaster' | 'pactcaster' {
    const martialJobs = ['destroyer', 'berserker', 'assassin', 'holy knight', 'stalker', 'striker'];
    const casterJobs = ['mage', 'herald', 'summoner', 'esper', 'revenant', 'idol'];
    const pactcasterJobs = ['contractor', 'technomancer'];

    const jobLower = job.toLowerCase();

    if (martialJobs.includes(jobLower)) return 'martial';
    if (casterJobs.includes(jobLower)) return 'caster';
    if (pactcasterJobs.includes(jobLower)) return 'pactcaster';

    return 'halfcaster'; // Default for unknown jobs
  }

  /**
   * Calculate fusion synergy based on thematic/mechanical compatibility
   * ALL 9x9 combinations are valid, but some synergize better
   * Returns: Perfect (complementary themes), Good (neutral themes), Average (opposed themes)
   */
  private static calculateFusionSynergy(
    regent1: RegentPath,
    regent2: RegentPath,
    jobType: string
  ): 'Perfect' | 'Good' | 'Average' {
    // Perfect synergy examples:
    // - Shadow + Mimic (both deception/adaptation)
    // - Dragon + Beast (both primal transformation)
    // - Architect + Frost (both reality manipulation)
    // - Plague + Shadow (both death/decay themes)
    // - Titan + Beast (both physical dominance)

    const synergies: Record<string, string[]> = {
      shadow_regent: ['mimic_regent', 'plague_regent', 'architect_regent'],
      dragon_regent: ['beast_regent', 'titan_regent'],
      frost_regent: ['architect_regent', 'plague_regent'],
      beast_regent: ['dragon_regent', 'titan_regent'],
      titan_regent: ['beast_regent', 'dragon_regent'],
      plague_regent: ['shadow_regent', 'frost_regent'],
      architect_regent: ['shadow_regent', 'frost_regent', 'radiant_regent'],
      radiant_regent: ['architect_regent', 'titan_regent'],
      mimic_regent: ['shadow_regent', 'plague_regent']
    };

    // Check if regents have perfect synergy
    if (synergies[regent1.id]?.includes(regent2.id) || synergies[regent2.id]?.includes(regent1.id)) {
      return 'Perfect';
    }

    // Opposed themes (still valid, just less synergy):
    // - Radiant vs Shadow (light vs dark)
    // - Titan vs Mimic (immovable vs adaptable)
    const oppositions: Record<string, string[]> = {
      radiant_regent: ['shadow_regent', 'plague_regent'],
      shadow_regent: ['radiant_regent'],
      titan_regent: ['mimic_regent'],
      mimic_regent: ['titan_regent']
    };

    if (oppositions[regent1.id]?.includes(regent2.id) || oppositions[regent2.id]?.includes(regent1.id)) {
      return 'Average';
    }

    // Everything else is Good synergy
    return 'Good';
  }

  // AI integration for regent selection
  private static async aiSelectRegents(
    character: Character,
    availableRegents: RegentPath[],
    jobType: string
  ): Promise<RegentChoice[]> {

    // Simulate AI analysis with comprehensive scoring
    const choices: RegentChoice[] = [];

    for (const regent of availableRegents) {
      const score = await this.aiAnalyzeRegentChoice(character, regent, jobType);

      // Check if regent needs adaptation for job type compatibility
      const adaptationNote = this.generateAdaptationNote(regent, jobType);

      choices.push({
        regent,
        aiReasoning: score.reasoning,
        adaptationNote,
        compatibilityScore: score.compatibility
      });
    }

    // Sort by compatibility score
    return choices.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  /**
   * Generate adaptation note if regent needs to be adapted for job type
   * Martial selecting caster regent: Adapt spells to martial techniques
   * Caster selecting martial regent: Adapt physical abilities to magical versions
   */
  private static generateAdaptationNote(regent: RegentPath, jobType: string): string | undefined {
    // Determine if regent is spell-heavy or martial-heavy
    const isSpellHeavyRegent = regent.spells.length > 3;
    const isMartialHeavyRegent = regent.features.some(f =>
      f.description.toLowerCase().includes('weapon') ||
      f.description.toLowerCase().includes('attack') ||
      f.description.toLowerCase().includes('physical')
    );

    if (jobType === 'martial' && isSpellHeavyRegent) {
      return `ADAPTED FOR MARTIAL: Spells converted to martial techniques. Example: "${regent.spells[0]}" becomes a physical technique with similar effect.`;
    }

    if ((jobType === 'caster' || jobType === 'pactcaster') && isMartialHeavyRegent) {
      return `ADAPTED FOR CASTER: Physical abilities converted to magical versions. Example: Natural weapons become force constructs, transformations become magical polymorphs.`;
    }

    // Halfcasters get hybrid versions
    if (jobType === 'halfcaster' && (isSpellHeavyRegent || isMartialHeavyRegent)) {
      return `ADAPTED FOR HALFCASTER: Abilities balanced between martial and magical. You can use both versions (physical techniques OR spells) as appropriate.`;
    }

    return undefined; // No adaptation needed
  }

  // AI analysis for regent compatibility
  private static async aiAnalyzeRegentChoice(
    character: Character,
    regent: RegentPath,
    jobType: string
  ): Promise<{ reasoning: string; alignment: number; compatibility: number }> {
    const abilities = this.getCharacterAbilities(character);
    const job = this.getCharacterJob(character);
    const highestStat = this.getHighestStat(abilities);

    // Simulate AI reasoning process
    const statAlignment = abilities[highestStat] - regent.requirements.statThreshold;
    const levelAlignment = character.level - (regent.requirements.level ?? 0);
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
        level: Math.max(regent1.requirements.level ?? 0, regent2.requirements.level ?? 0),
        school: 'fusion'
      },
      {
        name: `Dual ${regent1.name.split(' ')[0]} ${regent2.name.split(' ')[0]} Aura`,
        description: `Aura combining both regent powers`,
        level: Math.max(regent1.requirements.level ?? 0, regent2.requirements.level ?? 0) + 1,
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
    if (regent1Type === RegentType.AGILITY_REGENT || regent2Type === RegentType.AGILITY_REGENT) {
      bonuses.AGI = 4;
    }
    if (regent1Type === RegentType.VITALITY_REGENT || regent2Type === RegentType.VITALITY_REGENT) {
      bonuses.VIT = 4;
    }
    if (regent1Type === RegentType.INTELLIGENCE_REGENT || regent2Type === RegentType.INTELLIGENCE_REGENT) {
      bonuses.INT = 4;
    }
    if (regent1Type === RegentType.SENSE_REGENT || regent2Type === RegentType.SENSE_REGENT) {
      bonuses.SENSE = 4;
    }
    if (regent1Type === RegentType.PRESENCE_REGENT || regent2Type === RegentType.PRESENCE_REGENT) {
      bonuses.PRE = 4;
    }

    // Fusion bonus
    bonuses.STR = (bonuses.STR || 0) + 2;
    bonuses.AGI = (bonuses.AGI || 0) + 2;
    bonuses.VIT = (bonuses.VIT || 0) + 2;
    bonuses.INT = (bonuses.INT || 0) + 2;
    bonuses.SENSE = (bonuses.SENSE || 0) + 2;
    bonuses.PRE = (bonuses.PRE || 0) + 2;

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
    const jobRegentMap: Record<string, string[]> = {
      'Contractor': ['Presence Regent', 'Sense Regent', 'Intelligence Regent'],
      'Mage': ['Intelligence Regent', 'Sense Regent', 'Presence Regent'],
      'Assassin': ['Agility Regent', 'Presence Regent', 'Intelligence Regent'],
      'Herald': ['Sense Regent', 'Presence Regent', 'Vitality Regent'],
      'Stalker': ['Agility Regent', 'Sense Regent', 'Vitality Regent'],
      'Berserker': ['Strength Regent', 'Vitality Regent', 'Agility Regent'],
      'Destroyer': ['Strength Regent', 'Vitality Regent', 'Agility Regent'],
      'Summoner': ['Presence Regent', 'Intelligence Regent', 'Vitality Regent'],
      'Holy Knight': ['Strength Regent', 'Presence Regent', 'Vitality Regent'],
      'Technomancer': ['Intelligence Regent', 'Agility Regent', 'Sense Regent'],
      'Esper': ['Presence Regent', 'Intelligence Regent', 'Vitality Regent'],
      'Revenant': ['Intelligence Regent', 'Sense Regent', 'Vitality Regent'],
      'Striker': ['Agility Regent', 'Sense Regent', 'Strength Regent'],
      'Idol': ['Presence Regent', 'Agility Regent', 'Intelligence Regent']
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
    const levelDiff = Math.abs((regent1.requirements.level ?? 0) - (regent2.requirements.level ?? 0));
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
      return character.abilities as unknown as Record<AbilityScore, number>;
    }

    const scores = (character as Record<string, any>).abilityScores;
    return {
      STR: scores?.strength ?? 10,
      AGI: scores?.dexterity ?? scores?.agility ?? 10,
      VIT: scores?.constitution ?? scores?.vitality ?? 10,
      INT: scores?.intelligence ?? 10,
      SENSE: scores?.wisdom ?? scores?.sense ?? 10,
      PRE: scores?.charisma ?? scores?.presence ?? 10,
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
    /** @deprecated Regent quests are DM/Warden-gated — level is advisory only */
    level?: number;
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
