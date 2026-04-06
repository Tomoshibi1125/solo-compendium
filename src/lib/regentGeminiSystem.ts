// REGENT & GEMINI PROTOCOL SYSTEM
// Advanced sovereign class system with AI-driven fusion mechanics
// Nine Regents — S-Rank sovereign powers unlocked through gate trials

import type { Character } from "../types/character";
import { NINE_REGENTS } from "./nineRegents";

export type AbilityScore = "STR" | "AGI" | "VIT" | "INT" | "SENSE" | "PRE";
export type Job = string;

import { aiService } from "./ai/aiService";
import { logger } from "./logger";
import type { Feature, RegentPath, Spell, Trait } from "./regentTypes";

// Gemini Protocol fusion result
interface GeminiSovereign {
	id: string;
	name: string;
	baseJob: Job;
	basePath?: string;
	regent1: RegentPath;
	regent2: RegentPath;
	fusionType: "Perfect" | "Good" | "Average";
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
interface RegentChoice {
	regent: RegentPath;
	aiReasoning: string;
	adaptationNote?: string; // How the regent is adapted for martial/caster compatibility
	compatibilityScore: number;
}

// Complete regent system implementation
// The Nine Regents — S-Rank sovereign class system
//
// REGENT SELECTION RULES:
// 1. On quest unlock, AI presents 3 regent choices
// 2. Choices are based on character's stats, job, playstyle
// 3. Player picks ONE regent
// 4. When Warden (Warden) unlocks second quest, AI presents 3 NEW choices (cannot pick same regent twice)
// 5. Player picks ONE more regent (MAX 2 REGENTS TOTAL)
// 6. If martial picks caster regent (or vice versa), AI adapts it for compatibility
// 7. When player has 2 regents, they can fuse via Gemini Protocol
// 8. ALL 9x9 regent combinations are valid for fusion (81 possible sovereigns)
export class RegentGeminiSystem {
	private constructor() {}

	// Import the Nine Regents from nineRegents.ts
	static readonly REGENT_DATABASE: RegentPath[] = NINE_REGENTS;
	static readonly MAX_REGENTS_PER_CHARACTER = 2;

	/**
	 * Generate 3 regent choices on quest unlock
	 * AI considers: character stats, job type (martial/caster), playstyle, current regents
	 */
	static async generateRegentChoices(
		character: Character,
		currentRegents: string[] = [], // IDs of regents already chosen
	): Promise<RegentChoice[]> {
		// Cannot have more than 2 regents
		if (currentRegents.length >= RegentGeminiSystem.MAX_REGENTS_PER_CHARACTER) {
			throw new Error(
				`Character already has maximum ${RegentGeminiSystem.MAX_REGENTS_PER_CHARACTER} regents. Cannot choose more.`,
			);
		}

		const abilities = RegentGeminiSystem.getCharacterAbilities(character);
		const job = RegentGeminiSystem.getCharacterJob(character);
		const jobType = RegentGeminiSystem.getJobType(job); // 'martial', 'caster', 'halfcaster', 'pactcaster'

		// Filter out regents already chosen
		const availableRegents = RegentGeminiSystem.REGENT_DATABASE.filter(
			(regent) =>
				!currentRegents.includes(regent.id) &&
				regent.requirements.statThreshold <=
					RegentGeminiSystem.getHighestAbilityScore(abilities),
		);

		// Use AI to select and rank the best 3 options
		// AI considers stat alignment, job compatibility, and adaptation needs
		const aiChoices = await RegentGeminiSystem.aiSelectRegents(
			character,
			availableRegents,
			jobType,
		);

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
		regent2: RegentPath,
	): Promise<GeminiSovereign> {
		const baseJob = RegentGeminiSystem.getCharacterJob(character);
		const basePath = RegentGeminiSystem.getCharacterPath(character);
		const jobType = RegentGeminiSystem.getJobType(baseJob);

		// AI generates fusion based on regents and base job
		// Adapts regent features for martial/caster compatibility if needed
		const fusion = await RegentGeminiSystem.aiGenerateFusion(
			character,
			regent1,
			regent2,
			baseJob,
			basePath,
		);

		// Calculate fusion quality based on thematic/mechanical synergy (not stats)
		const fusionType = RegentGeminiSystem.calculateFusionSynergy(
			regent1,
			regent2,
			jobType,
		);

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
			fusionType,
		};
	}

	// Private helper methods
	private static getHighestStat(
		abilities: Record<AbilityScore, number>,
	): AbilityScore {
		let highest: AbilityScore = "STR";
		const abilityOrder: AbilityScore[] = [
			"STR",
			"AGI",
			"VIT",
			"INT",
			"SENSE",
			"PRE",
		];
		for (const ability of abilityOrder) {
			if (abilities[ability] > abilities[highest]) {
				highest = ability;
			}
		}
		return highest;
	}

	private static getHighestAbilityScore(
		abilities: Record<AbilityScore, number>,
	): number {
		return Math.max(...Object.values(abilities));
	}

	/**
	 * Determine job type for regent adaptation
	 * Martial jobs: Destroyer, Berserker, Assassin, Holy Knight, Stalker, Striker
	 * Casters: Mage, Herald, Summoner, Esper, Revenant, Idol
	 * Halfcasters: None currently (but supported for future)
	 * Pactcasters: Contractor, Technomancer
	 */
	private static getJobType(
		job: string,
	): "martial" | "caster" | "halfcaster" | "pactcaster" {
		const martialJobs = [
			"destroyer",
			"berserker",
			"assassin",
			"holy knight",
			"stalker",
			"striker",
		];
		const casterJobs = [
			"mage",
			"herald",
			"summoner",
			"esper",
			"revenant",
			"idol",
		];
		const pactcasterJobs = ["contractor", "technomancer"];

		const jobLower = job.toLowerCase();

		if (martialJobs.includes(jobLower)) return "martial";
		if (casterJobs.includes(jobLower)) return "caster";
		if (pactcasterJobs.includes(jobLower)) return "pactcaster";

		return "halfcaster"; // Default for unknown jobs
	}

	/**
	 * Calculate fusion synergy based on thematic/mechanical compatibility
	 * ALL 9x9 combinations are valid, but some synergize better
	 * Returns: Perfect (complementary themes), Good (neutral themes), Average (opposed themes)
	 */
	private static calculateFusionSynergy(
		regent1: RegentPath,
		regent2: RegentPath,
		_jobType: string,
	): "Perfect" | "Good" | "Average" {
		// Perfect synergy examples:
		// - Shadow + Mimic (both deception/adaptation)
		// - Dragon + Beast (both primal transformation)
		// - Architect + Frost (both reality manipulation)
		// - Plague + Shadow (both death/decay themes)
		// - Titan + Beast (both physical dominance)

		const synergies: Record<string, string[]> = {
			shadow_regent: ["mimic_regent", "plague_regent", "architect_regent"],
			dragon_regent: ["beast_regent", "titan_regent"],
			frost_regent: ["architect_regent", "plague_regent"],
			beast_regent: ["dragon_regent", "titan_regent"],
			titan_regent: ["beast_regent", "dragon_regent"],
			plague_regent: ["shadow_regent", "frost_regent"],
			architect_regent: ["shadow_regent", "frost_regent", "radiant_regent"],
			radiant_regent: ["architect_regent", "titan_regent"],
			mimic_regent: ["shadow_regent", "plague_regent"],
		};

		// Check if regents have perfect synergy
		if (
			synergies[regent1.id]?.includes(regent2.id) ||
			synergies[regent2.id]?.includes(regent1.id)
		) {
			return "Perfect";
		}

		// Opposed themes (still valid, just less synergy):
		// - Radiant vs Shadow (light vs dark)
		// - Titan vs Mimic (immovable vs adaptable)
		const oppositions: Record<string, string[]> = {
			radiant_regent: ["shadow_regent", "plague_regent"],
			shadow_regent: ["radiant_regent"],
			titan_regent: ["mimic_regent"],
			mimic_regent: ["titan_regent"],
		};

		if (
			oppositions[regent1.id]?.includes(regent2.id) ||
			oppositions[regent2.id]?.includes(regent1.id)
		) {
			return "Average";
		}

		// Everything else is Good synergy
		return "Good";
	}

	// AI integration for regent selection
	private static async aiSelectRegents(
		character: Character,
		availableRegents: RegentPath[],
		_jobType: string,
	): Promise<RegentChoice[]> {
		try {
			const abilities = RegentGeminiSystem.getCharacterAbilities(character);
			const highestStat = RegentGeminiSystem.getHighestStat(abilities);

			const response = await aiService.processRequest({
				service: "gemini-proxy",
				type: "generate-regents",
				input: {
					character: {
						name: character.name,
						level: character.level,
						job: character.job,
						abilities,
					},
					availableRegents: availableRegents.map((r) => ({
						id: r.id,
						name: r.name,
						type: r.type,
						description: r.description,
						requirements: r.requirements,
					})),
					highestStat,
				},
			});

			if (response.success && Array.isArray(response.data)) {
				const choices: RegentChoice[] = [];
				for (const aiChoice of response.data) {
					const regent = availableRegents.find((r) => r.id === aiChoice.regent);
					if (regent) {
						choices.push({
							regent,
							aiReasoning: aiChoice.reasoning,
							compatibilityScore: aiChoice.compatibility,
							adaptationNote: RegentGeminiSystem.generateAdaptationNote(
								regent,
								RegentGeminiSystem.getJobType(character.job || ""),
							),
						});
					}
				}
				if (choices.length > 0) return choices;
			}
		} catch (error) {
			logger.error(
				"AI Regent Selection failed, using deterministic fallback",
				error,
			);
		}

		// Fallback to deterministic logic
		const choices: RegentChoice[] = [];
		for (const regent of availableRegents) {
			const score = await RegentGeminiSystem.deterministicAnalyzeRegent(
				character,
				regent,
			);
			choices.push({
				regent,
				aiReasoning: score.reasoning,
				compatibilityScore: score.compatibility,
				adaptationNote: RegentGeminiSystem.generateAdaptationNote(
					regent,
					RegentGeminiSystem.getJobType(character.job || ""),
				),
			});
		}
		return choices.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
	}

	private static async deterministicAnalyzeRegent(
		character: Character,
		regent: RegentPath,
	): Promise<{ reasoning: string; compatibility: number }> {
		const abilities = RegentGeminiSystem.getCharacterAbilities(character);
		const job = character.job || "Adventurer";
		const highestStat = RegentGeminiSystem.getHighestStat(abilities);

		const statAlignment =
			abilities[highestStat] - regent.requirements.statThreshold;
		const jobCompatibility = RegentGeminiSystem.calculateJobCompatibility(
			job,
			regent,
		);

		const compatibility = 50 + statAlignment * 2 + jobCompatibility / 4;
		const reasoning = `[Deterministic Fallback] Aligns with your ${highestStat} stat and ${job} job.`;

		return { reasoning, compatibility };
	}

	/**
	 * Generate adaptation note if regent needs to be adapted for job type
	 * Martial selecting caster regent: Adapt spells to martial techniques
	 * Caster selecting martial regent: Adapt physical abilities to magical versions
	 */
	private static generateAdaptationNote(
		regent: RegentPath,
		jobType: string,
	): string | undefined {
		// Determine if regent is spell-heavy or martial-heavy
		const isSpellHeavyRegent = regent.spells.length > 3;
		const isMartialHeavyRegent = regent.features.some(
			(f) =>
				f.description.toLowerCase().includes("weapon") ||
				f.description.toLowerCase().includes("attack") ||
				f.description.toLowerCase().includes("physical"),
		);

		if (jobType === "martial" && isSpellHeavyRegent) {
			return `ADAPTED FOR MARTIAL: Spells converted to martial techniques. Example: "${regent.spells[0]}" becomes a physical technique with similar effect.`;
		}

		if (
			(jobType === "caster" || jobType === "pactcaster") &&
			isMartialHeavyRegent
		) {
			return `ADAPTED FOR CASTER: Physical abilities converted to magical versions. Example: Natural weapons become force constructs, transformations become magical polymorphs.`;
		}

		// Halfcasters get hybrid versions
		if (
			jobType === "halfcaster" &&
			(isSpellHeavyRegent || isMartialHeavyRegent)
		) {
			return `ADAPTED FOR HALFCASTER: Abilities balanced between martial and magical. You can use both versions (physical techniques OR spells) as appropriate.`;
		}

		return undefined; // No adaptation needed
	}

	/**
	 * AI fusion generation using Gemini Protocol
	 * Consolidates all merging logic into a single high-fidelity AI request
	 */
	private static async aiGenerateFusion(
		character: Character,
		regent1: RegentPath,
		regent2: RegentPath,
		baseJob: Job,
		basePath?: string,
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
		try {
			const response = await aiService.processRequest({
				service: "gemini-proxy",
				type: "generate-fusion",
				input: {
					character: {
						name: character.name,
						level: character.level,
						job: baseJob,
						path: basePath,
						abilities: RegentGeminiSystem.getCharacterAbilities(character),
					},
					regent1: {
						name: regent1.name,
						type: regent1.type,
						description: regent1.description,
						abilities: regent1.abilities,
						features: regent1.features.map((f) => f.name),
					},
					regent2: {
						name: regent2.name,
						type: regent2.type,
						description: regent2.description,
						abilities: regent2.abilities,
						features: regent2.features.map((f) => f.name),
					},
				},
			});

			if (response.success && response.data) {
				const d = response.data;
				return {
					id:
						d.id ||
						`gemini_${baseJob.toLowerCase().replace(/\s+/g, "_")}_${regent1.id}_${regent2.id}`,
					name: d.name || "Unnamed Sovereign",
					description: d.description || "Synthesized sovereign entity.",
					abilities: Array.isArray(d.abilities) ? d.abilities : [],
					features: Array.isArray(d.features) ? d.features : [],
					spells: Array.isArray(d.spells) ? d.spells : [],
					techniques: Array.isArray(d.techniques) ? d.techniques : [],
					traits: Array.isArray(d.traits) ? d.traits : [],
					statBonuses: d.statBonuses || {},
					specialAbilities: Array.isArray(d.specialAbilities)
						? d.specialAbilities
						: [],
				};
			}
		} catch (error) {
			logger.error(
				"Gemini Fusion generation failed, using deterministic fallback",
				error,
			);
		}

		// Robust Deterministic Fallback
		const safeJob = baseJob.toLowerCase().replace(/\s+/g, "_");
		return {
			id: `fallback_gemini_${safeJob}_${regent1.id}_${regent2.id}`,
			name: `${regent1.name.split(" ")[0]}-${regent2.name.split(" ")[0]} ${baseJob} Sovereign`,
			description: `[Deterministic Fallback] A powerful fusion of ${regent1.name} and ${regent2.name} with ${baseJob} doctrine.`,
			abilities: [...regent1.abilities, ...regent2.abilities],
			features: [...regent1.features, ...regent2.features],
			spells: [...regent1.spells, ...regent2.spells],
			techniques: [
				`${baseJob} Fusion: ${regent1.name.split(" ")[0]} Stance`,
				`Dual Resonance: ${regent2.name.split(" ")[0]} Form`,
			],
			traits: [
				{
					name: "Gemini Protocol: Sovereign State",
					description:
						"The character's base job is perfectly adapted to the unified power of two regents.",
					type: "fusion",
					benefits: ["Perfectly adapted job features"],
				},
			],
			statBonuses: { STR: 2, AGI: 2, VIT: 2, INT: 2, SENSE: 2, PRE: 2 },
			specialAbilities: ["Sovereign Awakening", "Dual Conduit Resonance"],
		};
	}

	// Private helper methods (Cleaned up AI Merge Placeholders)

	private static calculateJobCompatibility(
		job: Job,
		regent: RegentPath,
	): number {
		// AI calculates how well regent matches character's base job
		const jobRegentMap: Record<string, string[]> = {
			Contractor: ["Presence Regent", "Sense Regent", "Intelligence Regent"],
			Mage: ["Intelligence Regent", "Sense Regent", "Presence Regent"],
			Assassin: ["Agility Regent", "Presence Regent", "Intelligence Regent"],
			Herald: ["Sense Regent", "Presence Regent", "Vitality Regent"],
			Stalker: ["Agility Regent", "Sense Regent", "Vitality Regent"],
			Berserker: ["Strength Regent", "Vitality Regent", "Agility Regent"],
			Destroyer: ["Strength Regent", "Vitality Regent", "Agility Regent"],
			Summoner: ["Presence Regent", "Intelligence Regent", "Vitality Regent"],
			"Holy Knight": ["Strength Regent", "Presence Regent", "Vitality Regent"],
			Technomancer: ["Intelligence Regent", "Agility Regent", "Sense Regent"],
			Esper: ["Presence Regent", "Intelligence Regent", "Vitality Regent"],
			Revenant: ["Intelligence Regent", "Sense Regent", "Vitality Regent"],
			Striker: ["Agility Regent", "Sense Regent", "Strength Regent"],
			Idol: ["Presence Regent", "Agility Regent", "Intelligence Regent"],
		};

		const compatibleRegents = jobRegentMap[job] || [];
		return compatibleRegents.includes(regent.type) ? 85 : 60;
	}

	private static getCharacterJob(character: Character): Job {
		return character.job || character.class || "Adventurer";
	}

	private static getCharacterPath(character: Character): string | undefined {
		return character.path;
	}

	private static getCharacterAbilities(
		character: Character,
	): Record<AbilityScore, number> {
		// Use a partial record to safely map from character abilities
		const characterAbilities = character.abilities as
			| Record<string, number>
			| undefined;

		if (characterAbilities) {
			return {
				STR: characterAbilities.strength ?? characterAbilities.STR ?? 10,
				AGI:
					characterAbilities.agility ??
					characterAbilities.AGI ??
					characterAbilities.agility ??
					10,
				VIT:
					characterAbilities.vitality ??
					characterAbilities.VIT ??
					characterAbilities.vitality ??
					10,
				INT: characterAbilities.intelligence ?? characterAbilities.INT ?? 10,
				SENSE:
					characterAbilities.sense ??
					characterAbilities.SENSE ??
					characterAbilities.sense ??
					10,
				PRE:
					characterAbilities.presence ??
					characterAbilities.PRE ??
					characterAbilities.presence ??
					10,
			};
		}

		// Fallback for character record with legacy names
		const abilityScores =
			"abilityScores" in character &&
			typeof character.abilityScores === "object" &&
			character.abilityScores !== null
				? (character.abilityScores as Record<string, number>)
				: undefined;
		return {
			STR: abilityScores?.strength ?? 10,
			AGI: abilityScores?.agility ?? abilityScores?.agility ?? 10,
			VIT: abilityScores?.vitality ?? abilityScores?.vitality ?? 10,
			INT: abilityScores?.intelligence ?? 10,
			SENSE: abilityScores?.sense ?? abilityScores?.sense ?? 10,
			PRE: abilityScores?.presence ?? abilityScores?.presence ?? 10,
		};
	}
}

// Quest completion tracking for regent unlocking
interface RegentQuest {
	id: string;
	name: string;
	description: string;
	regentUnlock: string;
	requirements: {
		/** @deprecated Regent quests are Warden/Warden-gated — level is advisory only */
		level?: number;
		prerequisites: string[];
	};
	completed: boolean;
	completedBy: string; // Warden/Warden ID
	completionDate?: Date;
}

// Quest management system
export class RegentQuestManager {
	private constructor() {}

	private static readonly QUEST_DATABASE: RegentQuest[] = [
		{
			id: "iron_fist_trial",
			name: "Trial of the Iron Fist",
			description: "Prove your strength in combat against the arena champions",
			regentUnlock: "iron_fist_regent",
			requirements: { level: 10, prerequisites: ["basic_combat_training"] },
			completed: false,
			completedBy: "",
		},
		{
			id: "shadow_dancer_path",
			name: "Path of the Shadow Dancer",
			description: "Complete the stealth trials in the ancient temple",
			regentUnlock: "shadow_dancer_regent",
			requirements: { level: 10, prerequisites: ["basic_stealth_training"] },
			completed: false,
			completedBy: "",
		},
		{
			id: "arcane_mastery",
			name: "Arcane Mastery Challenge",
			description:
				"Defeat the arcane guardians and prove your magical knowledge",
			regentUnlock: "arcane_master_regent",
			requirements: { level: 15, prerequisites: ["advanced_spell_knowledge"] },
			completed: false,
			completedBy: "",
		},
		// ... more quests for each regent
	];

	/**
	 * Generate a dynamic quest trial for a specific character/regent pair
	 * Uses the unified AI service to create high-fidelity, thematic challenges
	 */
	static async generateDynamicQuest(
		character: Character,
		regentId: string,
	): Promise<{ id: string; name: string; description: string }> {
		const regent = RegentGeminiSystem.REGENT_DATABASE.find(
			(r) => r.id === regentId,
		);

		try {
			const response = await aiService.processRequest({
				service: "gemini-native",
				type: "generate-quests",
				input: {
					character: {
						name: character.name,
						job: character.job,
						level: character.level,
					},
					regent: regent
						? { name: regent.name, type: regent.type }
						: { name: "Unknown Regent" },
				},
			});

			if (response.success && response.data) {
				const d = response.data;
				return {
					id: `dynamic_${crypto.randomUUID()}`,
					name: d.name || `Trial of ${regent?.name || "the Unknown"}`,
					description:
						d.description || "A mysterious trial awaits your presence.",
				};
			}
		} catch (error) {
			logger.error("Dynamic quest generation failed, using fallback", error);
		}

		// Deterministic Fallback
		return {
			id: `fallback_${regentId}_${Date.now()}`,
			name: `Trial of the ${regent?.name.split(" ")[0] || "Unknown"}`,
			description: `A series of thematic trials designed to test your soul's compatibility with the power of ${regent?.name || "the regent"}.`,
		};
	}

	// Check if character has completed required quest
	static hasCompletedQuest(characterId: string, questId: string): boolean {
		const quest = RegentQuestManager.QUEST_DATABASE.find(
			(q) => q.id === questId,
		);
		return Boolean(quest?.completed && quest.completedBy === characterId);
	}

	// Complete quest (Warden/Warden action)
	static completeQuest(questId: string, wardenId: string): void {
		const quest = RegentQuestManager.QUEST_DATABASE.find(
			(q) => q.id === questId,
		);
		if (quest) {
			quest.completed = true;
			quest.completedBy = wardenId;
			quest.completionDate = new Date();
		}
	}

	// Get available regents for character
	static getAvailableRegents(characterId: string): RegentPath[] {
		const completedQuests = RegentQuestManager.QUEST_DATABASE.filter(
			(q) => q.completed && q.completedBy === characterId,
		);

		const unlockedRegentIds = completedQuests.map((q) => q.regentUnlock);

		return RegentGeminiSystem.REGENT_DATABASE.filter((regent) =>
			unlockedRegentIds.includes(regent.id),
		);
	}
}
