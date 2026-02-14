// SIMPLIFIED REGENT SYSTEM WITH LOCAL AI INTEGRATION
// This version uses the existing character interface and integrates local AI

import { LocalAIIntegration } from './localAIIntegration';

// Simplified regent types
export interface SimpleRegent {
  id: string;
  name: string;
  type: string;
  description: string;
  abilities: string[];
  requirements: {
    level: number;
    statThreshold: number;
  };
}

// Simplified fusion result
export interface SimpleGeminiSovereign {
  id: string;
  name: string;
  baseClass: string;
  regent1: SimpleRegent;
  regent2: SimpleRegent;
  fusionType: 'Perfect' | 'Good' | 'Average';
  description: string;
  abilities: string[];
  features: string[];
  spells: string[];
  techniques: string[];
  traits: string[];
  statBonuses: Record<string, number>;
  specialAbilities: string[];
  isPermanent: boolean; // NEW: Permanent flag
  createdAt: Date; // NEW: Creation timestamp
  playerId: string; // NEW: Player ID association
}

// Simplified regent system
export class SimpleRegentSystem {
  private static readonly REGENT_DATABASE: SimpleRegent[] = [
    {
      id: 'iron_fist_regent',
      name: 'Iron Fist Regent',
      type: 'Strength',
      description: 'Master of physical combat and martial prowess',
      abilities: ['Unarmed Strike Mastery', 'Brute Force', 'Physical Dominance'],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'warlord_regent',
      name: 'Warlord Regent',
      type: 'Strength',
      description: 'Commander of armies and master of warfare',
      abilities: ['Battle Command', 'Tactical Mastery', 'Army Leadership'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'berserker_regent',
      name: 'Berserker Regent',
      type: 'Strength',
      description: 'Unleashed fury and unstoppable rage',
      abilities: ['Rage Transformation', 'Fury Strike', 'Unstoppable Force'],
      requirements: { level: 12, statThreshold: 17 }
    },
    {
      id: 'shadow_dancer_regent',
      name: 'Shadow Dancer Regent',
      type: 'Dexterity',
      description: 'Master of stealth and acrobatic movement',
      abilities: ['Shadow Step', 'Perfect Balance', 'Acrobatic Mastery'],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'wind_walker_regent',
      name: 'Wind Walker Regent',
      type: 'Dexterity',
      description: 'Swift as the wind, impossible to catch',
      abilities: ['Wind Step', 'Lightning Speed', 'Evasion Mastery'],
      requirements: { level: 12, statThreshold: 17 }
    },
    {
      id: 'phantom_blade_regent',
      name: 'Phantom Blade Regent',
      type: 'Dexterity',
      description: 'Master of weapon techniques and precision strikes',
      abilities: ['Phantom Strike', 'Weapon Mastery', 'Perfect Aim'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'iron_body_regent',
      name: 'Iron Body Regent',
      type: 'Constitution',
      description: 'Unbreakable body and incredible endurance',
      abilities: ['Iron Skin', 'Endurance Mastery', 'Pain Resistance'],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'earth_guardian_regent',
      name: 'Earth Guardian Regent',
      type: 'Constitution',
      description: 'Protector of the land and its people',
      abilities: ['Earth Shield', 'Ground Control', 'Protection Aura'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'life_binder_regent',
      name: 'Life Binder Regent',
      type: 'Constitution',
      description: 'Master of life force and healing',
      abilities: ['Life Force Control', 'Healing Touch', 'Vitality Mastery'],
      requirements: { level: 12, statThreshold: 17 }
    },
    {
      id: 'arcane_master_regent',
      name: 'Arcane Master Regent',
      type: 'Intelligence',
      description: 'Supreme mastery of magical arts',
      abilities: ['Spell Mastery', 'Arcane Insight', 'Reality Manipulation'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'technomancer_regent',
      name: 'Technomancer Regent',
      type: 'Intelligence',
      description: 'Fusion of magic and technology',
      abilities: ['Tech Integration', 'Invention Mastery', 'Digital Control'],
      requirements: { level: 12, statThreshold: 17 }
    },
    {
      id: 'mind_lord_regent',
      name: 'Mind Lord Regent',
      type: 'Intelligence',
      description: 'Master of mental powers and psionics',
      abilities: ['Telepathy', 'Mind Control', 'Psychic Domination'],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'divine_seer_regent',
      name: 'Divine Seer Regent',
      type: 'Wisdom',
      description: 'Prophet with divine insight and foresight',
      abilities: ['Divine Sight', 'Prophecy', 'Healing Hands'],
      requirements: { level: 12, statThreshold: 17 }
    },
    {
      id: 'nature_lord_regent',
      name: 'Nature Lord Regent',
      type: 'Wisdom',
      description: 'Master of natural world and its creatures',
      abilities: ['Beast Command', 'Plant Control', 'Weather Mastery'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'spirit_walker_regent',
      name: 'Spirit Walker Regent',
      type: 'Wisdom',
      description: 'Traveler between spirit and material worlds',
      abilities: ['Spirit Form', 'Astral Projection', 'Soul Sight'],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'silver_tongue_regent',
      name: 'Silver Tongue Regent',
      type: 'Charisma',
      description: 'Master of persuasion and social manipulation',
      abilities: ['Persuasion Mastery', 'Charm Person', 'Leadership Aura'],
      requirements: { level: 10, statThreshold: 16 }
    },
    {
      id: 'royal_commander_regent',
      name: 'Royal Commander Regent',
      type: 'Charisma',
      description: 'Natural leader with royal authority',
      abilities: ['Royal Command', 'Inspire Loyalty', 'Noble Presence'],
      requirements: { level: 15, statThreshold: 18 }
    },
    {
      id: 'soul_binder_regent',
      name: 'Soul Binder Regent',
      type: 'Charisma',
      description: 'Master of souls and spiritual contracts',
      abilities: ['Soul Binding', 'Spirit Contracts', 'Life Force Manipulation'],
      requirements: { level: 12, statThreshold: 17 }
    }
  ];

  // NEW: Track existing sovereigns (one per player)
  private static readonly PLAYER_SOVEREIGNS: Map<string, SimpleGeminiSovereign> = new Map();

  // Initialize AI system
  static async initializeAI(): Promise<boolean> {
    return await LocalAIIntegration.initializeAI();
  }

  // Generate regent choices using local AI
  static async generateRegentChoices(character: any): Promise<any[]> {
    const highestStat = this.getHighestStat(character);
    const availableRegents = this.REGENT_DATABASE.filter(regent => 
      regent.requirements.level <= character.level &&
      regent.requirements.statThreshold <= character.abilityScores[highestStat]
    );

    // Use local AI for selection
    const choices = await LocalAIIntegration.generateRegentChoices(
      character,
      availableRegents,
      highestStat
    );

    return choices || this.generateFallbackChoices(character, availableRegents, highestStat);
  }

  // Create Gemini Protocol fusion using local AI
  static async createGeminiFusion(
    character: any,
    regent1: SimpleRegent,
    regent2: SimpleRegent
  ): Promise<SimpleGeminiSovereign> {
    
    // NEW: Check if player already has a sovereign
    const playerId = character.id || character.name || 'unknown';
    if (this.PLAYER_SOVEREIGNS.has(playerId)) {
      throw new Error(`Player ${playerId} already has a sovereign. Only one sovereign per player is allowed and it is permanent.`);
    }
    
    // Use local AI for fusion
    const fusion = await LocalAIIntegration.generateGeminiFusion(
      character,
      regent1,
      regent2
    );

    const sovereign = fusion || this.generateFallbackFusion(character, regent1, regent2);
    
    // NEW: Add permanent properties
    const permanentSovereign: SimpleGeminiSovereign = {
      ...sovereign,
      isPermanent: true,
      createdAt: new Date(),
      playerId: playerId
    };
    
    // NEW: Store the sovereign for this player
    this.PLAYER_SOVEREIGNS.set(playerId, permanentSovereign);
    
    return permanentSovereign;
  }

  // NEW: Check if player has a sovereign
  static hasSovereign(playerId: string): boolean {
    return this.PLAYER_SOVEREIGNS.has(playerId);
  }

  // NEW: Get player's sovereign
  static getPlayerSovereign(playerId: string): SimpleGeminiSovereign | null {
    return this.PLAYER_SOVEREIGNS.get(playerId) || null;
  }

  // NEW: Get all sovereigns (for admin purposes)
  static getAllSovereigns(): Map<string, SimpleGeminiSovereign> {
    return new Map(this.PLAYER_SOVEREIGNS);
  }

  // NEW: Reset sovereign (admin only)
  static resetSovereign(playerId: string): boolean {
    return this.PLAYER_SOVEREIGNS.delete(playerId);
  }

  // Private helper methods
  private static getHighestStat(character: any): string {
    const abilities = character.abilityScores || character.abilities || {};
    return Object.entries(abilities).reduce((highest, [stat, value]) => 
      value > abilities[highest] ? stat : highest, 
      'strength'
    );
  }

  // Fallback methods when AI is unavailable
  private static generateFallbackChoices(character: any, availableRegents: SimpleRegent[], highestStat: string): any[] {
    return availableRegents.slice(0, 3).map((regent, index) => ({
      regent,
      aiReasoning: `This regent aligns well with your ${highestStat} stat.`,
      statAlignment: character.abilityScores[highestStat] - regent.requirements.statThreshold,
      compatibilityScore: 85 - (index * 5)
    }));
  }

  private static generateFallbackFusion(
    character: any,
    regent1: SimpleRegent,
    regent2: SimpleRegent
  ): SimpleGeminiSovereign {
    
    const fusionName = `${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Sovereign`;
    const playerId = character.id || character.name || 'unknown';
    
    return {
      id: `gemini_${regent1.id}_${regent2.id}`,
      name: fusionName,
      baseClass: character.class || 'Unknown',
      regent1,
      regent2,
      fusionType: 'Good',
      description: `Fusion of ${regent1.name} and ${regent2.name} with ${character.class} mastery`,
      abilities: [
        ...regent1.abilities,
        ...regent2.abilities,
        `${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Fusion`,
        `Dual ${regent1.name.split(' ')[0]} ${regent2.name.split(' ')[0]} Mastery`
      ],
      features: [
        `Fusion Mastery: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]}`,
        `Enhanced power when both regents are active`
      ],
      spells: [], // Fixed: SimpleRegent doesn't have spells property
      techniques: [
        `${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Combination Attack`,
        `Dual ${regent1.name.split(' ')[0]} Defense`
      ],
      traits: [`Gemini Fusion: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]}`],
      statBonuses: {
        strength: 4,
        dexterity: 2,
        constitution: 2,
        intelligence: 2,
        wisdom: 2,
        charisma: 2
      },
      specialAbilities: [
        `Gemini Fusion: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Awakening`,
        `Dual Regent Mastery: Perfect control over both regent powers`,
        `Sovereign Authority: Commands respected by all subjects`,
        `Ultimate Fusion: Combine both regents into ultimate form`
      ],
      // NEW: Permanent properties
      isPermanent: true,
      createdAt: new Date(),
      playerId: playerId
    };
  }

  // Get AI status
  static async getAIStatus(): Promise<{
    available: boolean;
    model: string;
    endpoint: string;
    lastCheck: Date;
  }> {
    return await LocalAIIntegration.getAIStatus();
  }

  // Generate quest recommendations using local AI
  static async generateQuestRecommendations(character: any, availableQuests: any[]): Promise<any[]> {
    return await LocalAIIntegration.generateQuestRecommendations(character, availableQuests);
  }

  // Generate character optimization suggestions using local AI
  static async generateOptimizationSuggestions(character: any): Promise<any> {
    return await LocalAIIntegration.generateOptimizationSuggestions(character);
  }
}

export { SimpleRegent, SimpleGeminiSovereign, SimpleRegentSystem };
