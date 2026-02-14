// LOCAL AI INTEGRATION WITH OLLAMA
// Uses Mistral 7B/Mixtral 8x7B for regent and gemini systems

export class LocalAIIntegration {
  private static ollamaEndpoint = 'http://localhost:11434/api/generate';
  private static model = 'mixtral:8x7b'; // Best free model available
  private static isAvailable = false;

  // Initialize AI connection
  static async initializeAI(): Promise<boolean> {
    try {
      // Check if Ollama is running
      const response = await fetch('http://localhost:11434/api/tags');
      const data = await response.json();
      
      if (data.models && data.models.length > 0) {
        this.isAvailable = true;
        console.log('✅ Local AI (Ollama) connected with Mixtral 8x7B');
        return true;
      }
      
      this.isAvailable = false;
      console.log('⚠️ Ollama not available, using fallback logic');
      return false;
    } catch (error: any) {
      console.error('AI initialization failed, using fallback:', error);
      this.isAvailable = false;
      return false;
    }
  }

  // Generate regent choices using local AI
  static async generateRegentChoices(
    character: any,
    availableRegents: any[],
    highestStat: string
  ): Promise<any[]> {
    
    if (this.isAvailable) {
      try {
        const prompt = `
You are an expert RPG game master AI helping a player choose their regent path.

PLAYER INFO:
- Name: ${character.name}
- Level: ${character.level}
- Class: ${character.job}
- Highest Stat: ${highestStat} (${character.abilities[highestStat]})
- Current Abilities: ${JSON.stringify(character.abilities)}

AVAILABLE REGENTS:
${availableRegents.map(r => `- ${r.name}: ${r.description}`).join('\n')}

TASK:
Analyze the player's character and available regents. Generate the TOP 3 regent choices that would be best for this player.

For each choice, provide:
1. Choice name and brief description
2. Compatibility score (0-100)
3. AI reasoning explaining why it fits
4. Stat alignment bonus/penalty

Return as JSON array with this structure:
[
  {
    "regent": "regent_id",
    "name": "Regent Name",
    "description": "Brief description",
    "compatibility": 85,
    "reasoning": "Detailed reasoning",
    "statAlignment": 2
  }
]

Focus on: stat synergy, class compatibility, and playstyle enhancement.
`;

        const choices = await this.callLocalAI(prompt);
        return this.parseAIResponse(choices);
        
      } catch (error: unknown) {
        console.error('AI generation failed:', error);
        return this.generateFallbackChoices(character, availableRegents, highestStat);
      }
    } else {
      return this.generateFallbackChoices(character, availableRegents, highestStat);
    }
  }

  // Generate Gemini fusion using local AI
  static async generateGeminiFusion(
    character: any,
    regent1: any,
    regent2: any
  ): Promise<any> {
    
    if (this.isAvailable) {
      try {
        const prompt = `
You are an expert RPG fusion AI creating a unique sovereign class by combining two regents with the character's base class.

CHARACTER INFO:
- Name: ${character.name}
- Base Class: ${character.job}
- Level: ${character.level}

REGENT 1:
- Name: ${regent1.name}
- Type: ${regent1.type}
- Abilities: ${regent1.abilities.join(', ')}

REGENT 2:
- Name: ${regent2.name}
- Type: ${regent2.type}
- Abilities: ${regent2.abilities.join(', ')}

TASK:
Create a unique DBZ-style fusion sovereign class by combining both regents with the character's base class.

Generate:
1. Epic fusion name (DBZ-inspired)
2. Fusion description explaining the combination
3. Fusion type: "Perfect", "Good", or "Average"
4. 6 unique fusion abilities (blends of both regents + base class)
5. 4 fusion features (passive/active abilities)
6. 8 fusion spells (magical combinations)
7. 5 fusion techniques (special moves)
8. 6 fusion traits (characteristics)
9. Stat bonuses (STR, DEX, CON, INT, WIS, CHA)
10. 4 special abilities (ultimate powers)

Return as JSON with this structure:
{
  "name": "Epic Fusion Name",
  "description": "Fusion description",
  "fusionType": "Perfect",
  "abilities": ["Ability1", "Ability2", ...],
  "features": [{"name": "Feature1", "description": "...", "type": "passive"}, ...],
  "spells": ["Spell1", "Spell2", ...],
  "techniques": ["Technique1", "Technique2", ...],
  "traits": [{"name": "Trait1", "description": "...", "type": "fusion"}, ...],
  "statBonuses": {"STR": 4, "DEX": 2, ...},
  "specialAbilities": ["Ultimate1", "Ultimate2", ...]
}

Be creative and make it feel like an epic DBZ fusion with unique mechanics!
`;

        const fusion = await this.callLocalAI(prompt);
        return this.parseAIResponse(fusion);
        
      } catch (error: any) {
        console.error('Fusion generation failed:', error);
        return this.generateFallbackFusion(character, regent1, regent2);
      }
    } else {
      return this.generateFallbackFusion(character, regent1, regent2);
    }
  }

  // Generate quest recommendations using local AI
  static async generateQuestRecommendations(
    character: any,
    availableQuests: any[]
  ): Promise<any[]> {
    
    if (this.isAvailable) {
      try {
        const prompt = `
You are an expert RPG quest master AI recommending quests for a player.

PLAYER INFO:
- Name: ${character.name}
- Level: ${character.level}
- Class: ${character.job}
- Abilities: ${JSON.stringify(character.abilities)}

AVAILABLE QUESTS:
${availableQuests.map(q => `- ${q.name}: ${q.description}`).join('\n')}

TASK:
Analyze the player's character and recommend the TOP 3 quests they should attempt next.

For each recommendation, provide:
1. Quest name
2. Difficulty rating (Easy/Medium/Hard)
3. Success chance (0-100%)
4. AI reasoning explaining why it's suitable
5. Recommended preparation steps

Return as JSON array with this structure:
[
  {
    "quest": "quest_id",
    "name": "Quest Name",
    "difficulty": "Medium",
    "successChance": 75,
    "reasoning": "Detailed reasoning",
    "preparation": ["Step1", "Step2", "Step3"]
  }
]

Focus on: level appropriateness, class synergy, and character strengths.
`;

        const recommendations = await this.callLocalAI(prompt);
        return this.parseAIResponse(recommendations);
        
      } catch (error: any) {
        console.error('Quest recommendations failed:', error);
        return this.generateFallbackQuests(character, availableQuests);
      }
    } else {
      return this.generateFallbackQuests(character, availableQuests);
    }
  }

  // Call local Ollama API
  private static async callLocalAI(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.ollamaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2000
          }
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.content || '';
      
    } catch (error: any) {
      console.error('Local AI call failed:', error);
      throw error;
    }
  }

  // Parse AI response
  private static parseAIResponse(response: string): any {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: try to parse entire response
      return JSON.parse(response);
    } catch (error: any) {
      console.error('Failed to parse AI response:', error);
      return null;
    }
  }

  // Fallback regent choices (when AI unavailable)
  private static generateFallbackChoices(
    character: any,
    availableRegents: any[],
    highestStat: string
  ): any[] {
    
    return availableRegents.slice(0, 3).map((regent, index) => ({
      regent,
      name: regent.name,
      description: regent.description,
      compatibility: 85 - (index * 5),
      reasoning: `This regent aligns well with your ${highestStat} stat and ${character.job} class.`,
      statAlignment: character.abilities[highestStat] - regent.requirements.statThreshold
    }));
  }

  // Fallback fusion (when AI unavailable)
  private static generateFallbackFusion(
    character: any,
    regent1: any,
    regent2: any
  ): any {
    
    const fusionName = `${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Sovereign`;
    
    return {
      id: `gemini_${regent1.id}_${regent2.id}`,
      name: fusionName,
      description: `Fusion of ${regent1.name} and ${regent2.name} with ${character.job} mastery`,
      fusionType: 'Good',
      abilities: [
        ...regent1.abilities,
        ...regent2.abilities,
        `${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Fusion`,
        `Dual ${regent1.name.split(' ')[0]} ${regent2.name.split(' ')[0]} Mastery`
      ],
      features: [
        ...regent1.features,
        ...regent2.features,
        {
          name: `Fusion Mastery: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]}`,
          description: `Ultimate combination of both regents`,
          type: 'fusion'
        }
      ],
      spells: [...regent1.spells, ...regent2.spells],
      techniques: [
        `${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Combination Attack`,
        `Dual ${regent1.name.split(' ')[0]} ${regent2.name.split(' ')[0]} Defense`
      ],
      traits: [
        {
          name: `Gemini Fusion: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]}`,
          description: `Permanent fusion of both regents`,
          type: 'fusion',
          benefits: [
            `Access to both ${regent1.name} and ${regent2.name} abilities`,
            `Enhanced power when both regents are active`
          ]
        }
      ],
      statBonuses: {
        STR: regent1.type.includes('Strength') ? 4 : regent2.type.includes('Strength') ? 4 : 2,
        DEX: regent1.type.includes('Dexterity') ? 4 : regent2.type.includes('Dexterity') ? 4 : 2,
        CON: regent1.type.includes('Constitution') ? 4 : regent2.type.includes('Constitution') ? 4 : 2,
        INT: regent1.type.includes('Intelligence') ? 4 : regent2.type.includes('Intelligence') ? 4 : 2,
        WIS: regent1.type.includes('Wisdom') ? 4 : regent2.type.includes('Wisdom') ? 4 : 2,
        CHA: regent1.type.includes('Charisma') ? 4 : regent2.type.includes('Charisma') ? 4 : 2
      },
      specialAbilities: [
        `Gemini Fusion: ${regent1.name.split(' ')[0]}-${regent2.name.split(' ')[0]} Awakening`,
        `Dual Regent Mastery: Perfect control over both regent powers`,
        `Sovereign Authority: Commands respected by all subjects`,
        `Ultimate Fusion: Combine both regents into ultimate form`
      ]
    };
  }

  // Fallback quest recommendations (when AI unavailable)
  private static generateFallbackQuests(
    character: any,
    availableQuests: any[]
  ): any[] {
    
    return availableQuests
      .filter(quest => quest.requirements.level <= character.level)
      .slice(0, 3)
      .map((quest, index) => ({
        quest: quest.id,
        name: quest.name,
        difficulty: character.level >= quest.requirements.level - 2 ? 'Easy' : 
                   character.level >= quest.requirements.level ? 'Medium' : 'Hard',
        successChance: Math.max(50, 100 - (quest.requirements.level - character.level) * 10),
        reasoning: `This quest matches your level ${character.level} and ${character.job} class.`,
        preparation: [
          'Ensure proper equipment',
          'Review abilities and spells',
          'Prepare healing items'
        ]
      }));
  }

  // Check AI availability
  static isAIAvailable(): boolean {
    return this.isAvailable;
  }

  // Get AI status
  static async getAIStatus(): Promise<{
    available: boolean;
    model: string;
    endpoint: string;
    lastCheck: Date;
  }> {
    await this.initializeAI();
    
    return {
      available: this.isAvailable,
      model: this.model,
      endpoint: this.ollamaEndpoint,
      lastCheck: new Date()
    };
  }

  // Generate character optimization suggestions
  static async generateOptimizationSuggestions(
    character: any
  ): Promise<any> {
    
    if (this.isAvailable) {
      try {
        const prompt = `
You are an expert RPG character optimizer AI.

CHARACTER INFO:
- Name: ${character.name}
- Level: ${character.level}
- Class: ${character.job}
- Abilities: ${JSON.stringify(character.abilities)}
- Current Equipment: ${JSON.stringify(character.equipment || [])}

TASK:
Analyze this character and provide optimization suggestions for:

1. Stat improvement priorities
2. Equipment recommendations
3. Feat suggestions
4. Spell/ability optimization
5. Level up recommendations

Return as JSON with this structure:
{
  "statPriorities": ["STR", "DEX", "CON", "INT", "WIS", "CHA"],
  "equipment": ["Item1", "Item2", "Item3"],
  "feats": ["Feat1", "Feat2", "Feat3"],
  "abilities": ["Ability1", "Ability2", "Ability3"],
  "levelUp": ["Recommendation1", "Recommendation2"]
}

Focus on maximizing character effectiveness and synergy.
`;

        const suggestions = await this.callLocalAI(prompt);
        return this.parseAIResponse(suggestions);
        
      } catch (error: any) {
        console.error('Optimization suggestions failed:', error);
        return this.generateFallbackOptimizations(character);
      }
    } else {
      return this.generateFallbackOptimizations(character);
    }
  }

  // Fallback optimizations (when AI unavailable)
  private static generateFallbackOptimizations(character: any): any {
    const abilities = character.abilities;
    const lowestStats = Object.entries(abilities)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 3)
      .map(([stat]) => stat);

    return {
      statPriorities: lowestStats,
      equipment: ['Magic Weapon', 'Protective Armor', 'Healing Potions'],
      feats: ['Ability Score Improvement', 'Toughness', 'Weapon Focus'],
      abilities: ['Power Attack', 'Expertise', 'Improved Initiative'],
      levelUp: ['Focus on core stats', 'Consider multiclass options', 'Plan equipment upgrades']
    };
  }
}

export default LocalAIIntegration;
