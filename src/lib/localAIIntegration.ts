// LOCAL AI INTEGRATION WITH OLLAMA
// Uses Mistral 7B/Mixtral 8x7B for regent and gemini systems

import { log, error as logError } from "@/lib/logger";

/** Minimal character shape required by AI integration methods */
interface AICharacterInput {
	name: string;
	level: number;
	job: string;
	abilities: Record<string, number>;
	equipment?: unknown[];
}

/** Minimal regent shape required by AI integration methods */
interface AIRegentInput {
	id?: string;
	name: string;
	type: string;
	description: string;
	abilities: string[];
	features?: unknown[];
	spells?: unknown[];
	requirements: { level: number; statThreshold: number };
}

/** Minimal quest shape required by AI integration methods */
interface AIQuestInput {
	id: string;
	name: string;
	description: string;
	requirements: { level: number };
}

/** Optimization suggestion result shape */
interface OptimizationSuggestions {
	statPriorities: string[];
	equipment: string[];
	feats: string[];
	abilities: string[];
	levelUp: string[];
}

export class LocalAIIntegration {
	private static ollamaEndpoint = "http://localhost:11434/api/generate";
	private static model = "mixtral:8x7b"; // Best free model available
	private static isAvailable = false;

	// Initialize AI connection
	static async initializeAI(): Promise<boolean> {
		try {
			// Check if Ollama is running
			const response = await fetch("http://localhost:11434/api/tags");
			const data = await response.json();

			if (data.models && data.models.length > 0) {
				LocalAIIntegration.isAvailable = true;
				log("✅ Local AI (Ollama) connected with Mixtral 8x7B");
				return true;
			}

			LocalAIIntegration.isAvailable = false;
			log("⚠️ Ollama not available, using fallback logic");
			return false;
		} catch (error: unknown) {
			logError("AI initialization failed, using fallback:", error);
			LocalAIIntegration.isAvailable = false;
			return false;
		}
	}

	// Generate regent choices using local AI
	static async generateRegentChoices(
		character: AICharacterInput,
		availableRegents: AIRegentInput[],
		highestStat: string,
	): Promise<unknown[]> {
		if (LocalAIIntegration.isAvailable) {
			try {
				const prompt = `
You are an expert RPG game master AI for System Ascendant, a 5e SRD TTRPG with dark manhwa-inspired flavor.
Ability scores: STR (Strength), AGI (Agility), VIT (Vitality), INT (Intelligence), SENSE (Sense), PRE (Presence).
Classes are called "Jobs". Regents are quest/DM-gated power overlays (not level-gated).

Help this player choose their regent path.

PLAYER INFO:
- Name: ${character.name}
- Level: ${character.level}
- Class: ${character.job}
- Highest Stat: ${highestStat} (${character.abilities[highestStat]})
- Current Abilities: ${JSON.stringify(character.abilities)}

AVAILABLE REGENTS:
${availableRegents.map((r) => `- ${r.name}: ${r.description}`).join("\n")}

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

				const choices = await LocalAIIntegration.callLocalAI(prompt);
				const parsed = LocalAIIntegration.parseAIResponse(choices);
				return Array.isArray(parsed) ? parsed : [];
			} catch (error: unknown) {
				logError("AI generation failed:", error);
				return LocalAIIntegration.generateFallbackChoices(
					character,
					availableRegents,
					highestStat,
				);
			}
		} else {
			return LocalAIIntegration.generateFallbackChoices(
				character,
				availableRegents,
				highestStat,
			);
		}
	}

	// Generate Gemini fusion using local AI
	static async generateGeminiFusion(
		character: AICharacterInput,
		regent1: AIRegentInput,
		regent2: AIRegentInput,
	): Promise<unknown> {
		if (LocalAIIntegration.isAvailable) {
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
- Abilities: ${regent1.abilities.join(", ")}

REGENT 2:
- Name: ${regent2.name}
- Type: ${regent2.type}
- Abilities: ${regent2.abilities.join(", ")}

SYSTEM: System Ascendant is a 5e SRD TTRPG with dark manhwa-inspired flavor.
Ability scores: STR (Strength), AGI (Agility), VIT (Vitality), INT (Intelligence), SENSE (Sense), PRE (Presence).
Classes are called "Jobs". Regents are quest/DM-gated power overlays. Two regents fuse via the Gemini Protocol.

TASK:
Create a unique fusion sovereign class by combining both regents with the character's base job via the Gemini Protocol.

Generate:
1. Epic fusion name
2. Fusion description explaining the combination
3. Fusion type: "Perfect", "Good", or "Average"
4. 6 unique fusion abilities (blends of both regents + base job)
5. 4 fusion features (passive/active abilities with 5e action economy)
6. 8 fusion spells/powers (magical combinations)
7. 5 fusion techniques (special moves)
8. 6 fusion traits (characteristics)
9. Stat bonuses using System Ascendant names (STR, AGI, VIT, INT, SENSE, PRE)
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
  "statBonuses": {"STR": 4, "AGI": 2, "VIT": 2, "INT": 0, "SENSE": 0, "PRE": 2},
  "specialAbilities": ["Ultimate1", "Ultimate2", ...]
}

Be creative! Features should include action types (action/bonus action/reaction/passive) and uses/recharge where appropriate.
`;

				const fusion = await LocalAIIntegration.callLocalAI(prompt);
				return LocalAIIntegration.parseAIResponse(fusion);
			} catch (error: unknown) {
				logError("Fusion generation failed:", error);
				return LocalAIIntegration.generateFallbackFusion(
					character,
					regent1,
					regent2,
				);
			}
		} else {
			return LocalAIIntegration.generateFallbackFusion(
				character,
				regent1,
				regent2,
			);
		}
	}

	// Generate quest recommendations using local AI
	static async generateQuestRecommendations(
		character: AICharacterInput,
		availableQuests: AIQuestInput[],
	): Promise<unknown[]> {
		if (LocalAIIntegration.isAvailable) {
			try {
				const prompt = `
You are an expert RPG quest master AI recommending quests for a player.

PLAYER INFO:
- Name: ${character.name}
- Level: ${character.level}
- Class: ${character.job}
- Abilities: ${JSON.stringify(character.abilities)}

AVAILABLE QUESTS:
${availableQuests.map((q) => `- ${q.name}: ${q.description}`).join("\n")}

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

				const recommendations = await LocalAIIntegration.callLocalAI(prompt);
				const parsed = LocalAIIntegration.parseAIResponse(recommendations);
				return Array.isArray(parsed) ? parsed : [];
			} catch (error: unknown) {
				logError("Quest recommendations failed:", error);
				return LocalAIIntegration.generateFallbackQuests(
					character,
					availableQuests,
				);
			}
		} else {
			return LocalAIIntegration.generateFallbackQuests(
				character,
				availableQuests,
			);
		}
	}

	// Call local Ollama API
	private static async callLocalAI(prompt: string): Promise<string> {
		try {
			const response = await fetch(LocalAIIntegration.ollamaEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: LocalAIIntegration.model,
					prompt: prompt,
					stream: false,
					options: {
						temperature: 0.7,
						top_p: 0.9,
						max_tokens: 2000,
					},
				}),
			});

			if (!response.ok) {
				throw new Error(`AI API error: ${response.status}`);
			}

			const data = await response.json();
			return data.response || data.content || "";
		} catch (error: unknown) {
			logError("Local AI call failed:", error);
			throw error;
		}
	}

	// Parse AI response
	private static parseAIResponse(response: string): unknown {
		try {
			// Try to extract JSON from response
			const jsonMatch = response.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				return JSON.parse(jsonMatch[0]);
			}

			// Fallback: try to parse entire response
			return JSON.parse(response);
		} catch (error: unknown) {
			logError("Failed to parse AI response:", error);
			return null;
		}
	}

	// Fallback regent choices (when AI unavailable)
	private static generateFallbackChoices(
		character: AICharacterInput,
		availableRegents: AIRegentInput[],
		highestStat: string,
	): unknown[] {
		return availableRegents.slice(0, 3).map((regent, index) => ({
			regent,
			name: regent.name,
			description: regent.description,
			compatibility: 85 - index * 5,
			reasoning: `This regent aligns well with your ${highestStat} stat and ${character.job} class.`,
			statAlignment:
				character.abilities[highestStat] - regent.requirements.statThreshold,
		}));
	}

	// Fallback fusion (when AI unavailable)
	private static generateFallbackFusion(
		character: AICharacterInput,
		regent1: AIRegentInput,
		regent2: AIRegentInput,
	): unknown {
		const fusionName = `${regent1.name.split(" ")[0]}-${regent2.name.split(" ")[0]} Sovereign`;

		return {
			id: `gemini_${regent1.id}_${regent2.id}`,
			name: fusionName,
			description: `Fusion of ${regent1.name} and ${regent2.name} with ${character.job} mastery`,
			fusionType: "Good",
			abilities: [
				...regent1.abilities,
				...regent2.abilities,
				`${regent1.name.split(" ")[0]}-${regent2.name.split(" ")[0]} Fusion`,
				`Dual ${regent1.name.split(" ")[0]} ${regent2.name.split(" ")[0]} Mastery`,
			],
			features: [
				...(regent1.features || []),
				...(regent2.features || []),
				{
					name: `Fusion Mastery: ${regent1.name.split(" ")[0]}-${regent2.name.split(" ")[0]}`,
					description: `Ultimate combination of both regents`,
					type: "fusion",
				},
			],
			spells: [...(regent1.spells || []), ...(regent2.spells || [])],
			techniques: [
				`${regent1.name.split(" ")[0]}-${regent2.name.split(" ")[0]} Combination Attack`,
				`Dual ${regent1.name.split(" ")[0]} ${regent2.name.split(" ")[0]} Defense`,
			],
			traits: [
				{
					name: `Gemini Fusion: ${regent1.name.split(" ")[0]}-${regent2.name.split(" ")[0]}`,
					description: `Permanent fusion of both regents`,
					type: "fusion",
					benefits: [
						`Access to both ${regent1.name} and ${regent2.name} abilities`,
						`Enhanced power when both regents are active`,
					],
				},
			],
			statBonuses: {
				STR: regent1.type.includes("Strength")
					? 4
					: regent2.type.includes("Strength")
						? 4
						: 2,
				DEX: regent1.type.includes("Dexterity")
					? 4
					: regent2.type.includes("Dexterity")
						? 4
						: 2,
				CON: regent1.type.includes("Constitution")
					? 4
					: regent2.type.includes("Constitution")
						? 4
						: 2,
				INT: regent1.type.includes("Intelligence")
					? 4
					: regent2.type.includes("Intelligence")
						? 4
						: 2,
				WIS: regent1.type.includes("Wisdom")
					? 4
					: regent2.type.includes("Wisdom")
						? 4
						: 2,
				CHA: regent1.type.includes("Charisma")
					? 4
					: regent2.type.includes("Charisma")
						? 4
						: 2,
			},
			specialAbilities: [
				`Gemini Fusion: ${regent1.name.split(" ")[0]}-${regent2.name.split(" ")[0]} Awakening`,
				`Dual Regent Mastery: Perfect control over both regent powers`,
				`Sovereign Authority: Commands respected by all subjects`,
				`Ultimate Fusion: Combine both regents into ultimate form`,
			],
		};
	}

	// Fallback quest recommendations (when AI unavailable)
	private static generateFallbackQuests(
		character: AICharacterInput,
		availableQuests: AIQuestInput[],
	): unknown[] {
		return availableQuests
			.filter((quest) => quest.requirements.level <= character.level)
			.slice(0, 3)
			.map((quest, index) => ({
				quest: quest.id,
				name: quest.name,
				difficulty:
					character.level >= quest.requirements.level - 2
						? "Easy"
						: character.level >= quest.requirements.level
							? "Medium"
							: "Hard",
				successChance: Math.max(
					50,
					100 - (quest.requirements.level - character.level) * 10,
				),
				reasoning: `This quest matches your level ${character.level} and ${character.job} class.`,
				preparation: [
					"Ensure proper equipment",
					"Review abilities and spells",
					"Prepare healing items",
				],
			}));
	}

	// Check AI availability
	static isAIAvailable(): boolean {
		return LocalAIIntegration.isAvailable;
	}

	// Get AI status
	static async getAIStatus(): Promise<{
		available: boolean;
		model: string;
		endpoint: string;
		lastCheck: Date;
	}> {
		await LocalAIIntegration.initializeAI();

		return {
			available: LocalAIIntegration.isAvailable,
			model: LocalAIIntegration.model,
			endpoint: LocalAIIntegration.ollamaEndpoint,
			lastCheck: new Date(),
		};
	}

	// Generate character optimization suggestions
	static async generateOptimizationSuggestions(
		character: AICharacterInput,
	): Promise<OptimizationSuggestions | null> {
		if (LocalAIIntegration.isAvailable) {
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

				const suggestions = await LocalAIIntegration.callLocalAI(prompt);
				return LocalAIIntegration.parseAIResponse(
					suggestions,
				) as OptimizationSuggestions | null;
			} catch (error: unknown) {
				logError("Optimization suggestions failed:", error);
				return LocalAIIntegration.generateFallbackOptimizations(character);
			}
		} else {
			return LocalAIIntegration.generateFallbackOptimizations(character);
		}
	}

	// Fallback optimizations (when AI unavailable)
	private static generateFallbackOptimizations(
		character: AICharacterInput,
	): OptimizationSuggestions {
		const abilities = character.abilities;
		const lowestStats = (Object.entries(abilities) as Array<[string, unknown]>)
			.sort(([, a], [, b]) => {
				const aNum = typeof a === "number" ? a : Number(a);
				const bNum = typeof b === "number" ? b : Number(b);
				return aNum - bNum;
			})
			.slice(0, 3)
			.map(([stat]) => stat);

		return {
			statPriorities: lowestStats,
			equipment: ["Magic Weapon", "Protective Armor", "Healing Potions"],
			feats: [
				"Ability Score Improvement",
				"Reinforced Vitality",
				"Weapon Attunement",
			],
			abilities: ["Devastating Blow", "Honed Instinct", "Threat Processor"],
			levelUp: [
				"Focus on core stats",
				"Consider regent overlay options",
				"Plan equipment upgrades",
			],
		};
	}
}

export default LocalAIIntegration;
