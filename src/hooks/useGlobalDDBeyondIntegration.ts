import { useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCampaignAnalytics } from "@/hooks/useCampaignAnalytics";
import { useCampaignDice } from "@/hooks/useCampaignDice";
import { useCharacterExport } from "@/hooks/useCharacterExportImport";
import { useCharacterRoll } from "@/hooks/useCharacterRoll";
import { useCharacter } from "@/hooks/useCharacters";
import { useCombatSessionManager } from "@/hooks/useCombatSessionManager";
import { useEncounterRewards } from "@/hooks/useEncounterRewards";
import { useOfflineDataAccess } from "@/hooks/useOfflineDataAccess";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";
import { logger } from "@/lib/logger";
import { rollCheck } from "@/lib/rollEngine";
import { getProficiencyBonus } from "@/types/core-rules";

export interface CharacterSheetEnhancements {
	rollAbilityCheck: (ability: string) => Promise<unknown>;
	rollSavingThrow: (ability: string) => Promise<unknown>;
	rollSkillCheck: (skill: string) => Promise<unknown>;
	_quickRoll: (formula: string) => Promise<{
		dice: string;
		modifier: string;
		result: number;
	} | null>;
	exportCharacter: (format: "json" | "pdf") => Promise<boolean>;
	importCharacter: (file: File) => Promise<unknown>;
	getRollHistory: () => Promise<unknown[]>;
	clearCache: () => void;
	getCacheSize: () => number;
	roll: (
		rollKey: string,
		modifier: number,
		kind: "ability" | "save" | "skill" | "attack" | "damage",
		label?: string,
		campaignId?: string,
		advantage?: "advantage" | "disadvantage" | "normal",
	) => Promise<unknown>;
}

export interface WardenToolsEnhancements {
	endCombatSession: (
		sessionId: string,
		options?: Record<string, unknown>,
	) => Promise<{ success: boolean; [key: string]: unknown }>;
	generateSessionReport: (sessionId: string) => Promise<string | null>;
	distributeRewards: (
		sessionId: string,
		rewards: Record<string, unknown>,
		options?: string[],
	) => Promise<boolean>;
	getCampaignAnalytics: (campaignId: string) => Promise<unknown>;
	exportAnalytics: (campaignId: string) => Promise<Blob | null>;
	pauseCombatSession: (sessionId: string) => Promise<boolean>;
	resumeCombatSession: (sessionId: string) => Promise<boolean>;
	isWarden: boolean;
	awardEncounterRewards: (sessionId: string) => Promise<void>;
}

export interface AscendantTools {
	rollInCampaign: (
		campaignId: string,
		rollData: {
			dice_formula: string;
			result: number;
			roll_type: string;
			rolls: number[];
			context?: string;
			modifiers?: Record<string, Json | undefined>;
			character_id?: string;
		},
	) => Promise<unknown>;
	getCampaignsForRolling: () => Promise<unknown[]>;
	accessOfflineData: () => Promise<{
		characters: unknown[];
		compendium: unknown[];
		campaigns: unknown[];
	}>;
	syncOfflineData: () => Promise<void>;
	trackHealthChange: (
		characterId: string,
		amount: number,
		type: "damage" | "healing" | "temp",
		options?: { skipBroadcast?: boolean },
	) => Promise<void>;
	trackConditionChange: (
		characterId: string,
		condition: string,
		action: "add" | "remove",
		options?: { skipBroadcast?: boolean },
	) => Promise<void>;
	trackInventoryChange: (
		characterId: string,
		itemName: string,
		action: "add" | "remove" | "equip" | "unequip",
		options?: { skipBroadcast?: boolean },
	) => Promise<void>;
	trackCustomFeatureUsage: (
		characterId: string,
		featureName: string,
		action: string,
		system: "RA" | "SA",
		options?: { skipBroadcast?: boolean },
	) => Promise<void>;
}

/**
 * Hook to provide character sheet enhancements.
 * Call this at the top level of your component.
 */
export function useCharacterSheetEnhancements(
	characterId: string,
): CharacterSheetEnhancements {
	const { data: character } = useCharacter(characterId);
	const abilities = useMemo(
		() => character?.abilities ?? {},
		[character?.abilities],
	);
	// Always level-derived. The stored proficiency_bonus column goes stale
	// (the import path never writes it; the guest store defaults it to 2), so
	// preferring it made rolls from this hook disagree with the sheet.
	const proficiencyBonus = getProficiencyBonus(character?.level ?? 1);

	const characterRoll = useCharacterRoll({
		characterId,
		characterName: character?.name ?? "Character",
		abilities,
		proficiencyBonus,
		savingThrowProficiencies: character?.saving_throw_proficiencies ?? [],
		skillProficiencies: character?.skill_proficiencies ?? [],
	});

	const { exportCharacterJson, exportCharacterPdf, importCharacterJson } =
		useCharacterExport();
	const { clearCache, getCacheSize } = useOfflineDataAccess();

	return {
		rollAbilityCheck: async (ability: string) => {
			return characterRoll.rollAbilityCheck(ability);
		},
		rollSavingThrow: async (ability: string) => {
			return characterRoll.rollSavingThrow(ability);
		},
		rollSkillCheck: async (skill: string) => {
			return characterRoll.rollSkillCheck(skill);
		},
		roll: async (rollKey, modifier, kind, label, campaignId, advantage) => {
			return characterRoll.roll(
				rollKey,
				modifier,
				kind as never,
				label,
				campaignId,
				advantage,
			);
		},
		_quickRoll: async (formula: string) => {
			const match = formula.match(/(\d+d\d+)?([+-]\d+)?/);
			if (!match) return null;

			const dice = match[1] || "1d20";
			const modifier = match[2] || "0";
			const modNum = parseInt(modifier, 10);
			const rollResult = rollCheck(modNum, "normal");

			return {
				dice,
				modifier,
				result: rollResult.total,
			};
		},
		exportCharacter: async (format: "json" | "pdf") => {
			const result =
				format === "json"
					? await exportCharacterJson(characterId)
					: await exportCharacterPdf(characterId);
			return !!result;
		},
		importCharacter: async (file: File) => {
			return await importCharacterJson(file);
		},
		getRollHistory: async () => {
			return [];
		},
		clearCache: () => {
			clearCache();
		},
		getCacheSize: () => {
			return getCacheSize();
		},
	};
}

/**
 * Hook to provide Warden tools enhancements.
 * Call this at the top level of your component.
 */
export function useWardenToolsEnhancements(
	campaignId?: string,
): WardenToolsEnhancements {
	const { toast } = useToast();
	const { endCombatSession, pauseCombatSession, resumeCombatSession } =
		useCombatSessionManager();
	const { calculateEncounterRewards, distributeRewards } =
		useEncounterRewards();
	const { generateCampaignReport, getCampaignAnalytics, exportAnalyticsData } =
		useCampaignAnalytics();

	return {
		endCombatSession: async (
			sessionId: string,
			options: Record<string, unknown> = {},
		) => {
			const result = await endCombatSession(sessionId, options);
			if (result.success && options.generateRewards) {
				const rewards = await calculateEncounterRewards(sessionId);
				if (rewards && options.distributeRewards) {
					await distributeRewards(campaignId || "", rewards, []);
				}
			}
			return result;
		},
		generateSessionReport: async (sessionId: string) => {
			return await generateCampaignReport(sessionId);
		},
		distributeRewards: async (
			_sessionId: string,
			rewards: Record<string, unknown>,
			options: string[] = [],
		) => {
			return await distributeRewards(
				campaignId || "",
				rewards as never,
				options,
			);
		},
		getCampaignAnalytics: async (analyticsCampaignId: string) => {
			return await getCampaignAnalytics(analyticsCampaignId);
		},
		exportAnalytics: async (analyticsCampaignId: string) => {
			return await exportAnalyticsData(analyticsCampaignId);
		},
		pauseCombatSession: async (sessionId: string) => {
			const result = await pauseCombatSession(sessionId);
			return result.success;
		},
		resumeCombatSession: async (sessionId: string) => {
			const result = await resumeCombatSession(sessionId);
			return result.success;
		},
		isWarden: true,
		awardEncounterRewards: async (sessionId: string) => {
			try {
				const rewards = await calculateEncounterRewards(sessionId);
				if (rewards) {
					await distributeRewards(campaignId || "", rewards, []);
					toast({
						title: "Rewards Distributed",
						description: "XP and loot from the encounter have been awarded.",
					});
				}
			} catch (e) {
				toast({
					title: "Error",
					description: "Failed to award encounter rewards.",
					variant: "destructive",
				});
				logger.error("Failed to award encounter rewards", e);
			}
		},
	};
}

/**
 * Hook to provide Ascendant tools enhancements.
 * Call this at the top level of your component.
 */
export function useAscendantTools(): AscendantTools {
	const { user } = useAuth();
	const { rollInCampaign, getCampaignsForRolling } = useCampaignDice();
	useOfflineDataAccess();

	const broadcastSystemMessage = async (
		characterId: string,
		content: string,
	) => {
		try {
			const { data: member } = await supabase
				.from("campaign_members")
				.select("campaign_id, characters(name)")
				.eq("character_id", characterId)
				.single();

			if (member?.campaign_id && user?.id) {
				const charName =
					(member.characters as Record<string, unknown>)?.name || "Someone";
				await supabase.from("campaign_messages").insert({
					campaign_id: member.campaign_id,
					message_type: "rift",
					content: `**${charName}**: ${content}`,
					user_id: user.id,
				});
			}
		} catch (e) {
			logger.error("Failed to broadcast global message", e);
		}
	};

	return {
		rollInCampaign: async (
			campaignId: string,
			rollData: {
				dice_formula: string;
				result: number;
				roll_type: string;
				rolls: number[];
				context?: string;
				modifiers?: Record<string, Json | undefined>;
				character_id?: string;
			},
		) => {
			return await rollInCampaign(campaignId, rollData);
		},
		getCampaignsForRolling: async () => {
			return await getCampaignsForRolling();
		},
		accessOfflineData: async () => {
			return {
				characters: [],
				compendium: [],
				campaigns: [],
			};
		},
		syncOfflineData: async () => {},
		trackHealthChange: async (characterId, amount, type, options) => {
			if (options?.skipBroadcast) return;
			const verb =
				type === "damage"
					? "took"
					: type === "healing"
						? "recovered"
						: "gained";
			const noun = type === "temp" ? "temporary HP" : "HP";
			await broadcastSystemMessage(characterId, `${verb} ${amount} ${noun}.`);
		},
		trackConditionChange: async (characterId, condition, action, options) => {
			if (options?.skipBroadcast) return;
			const verb = action === "add" ? "gained condition" : "removed condition";
			await broadcastSystemMessage(characterId, `${verb}: ${condition}.`);
		},
		trackInventoryChange: async (characterId, itemName, action, options) => {
			if (options?.skipBroadcast) return;
			const verb =
				action === "add"
					? "added to inventory"
					: action === "remove"
						? "removed from inventory"
						: action === "equip"
							? "equipped"
							: "unequipped";
			await broadcastSystemMessage(characterId, `${verb} ${itemName}.`);
		},
		trackCustomFeatureUsage: async (
			characterId,
			featureName,
			action,
			_system,
			options,
		) => {
			if (options?.skipBroadcast) return;
			await broadcastSystemMessage(characterId, `${action} [${featureName}].`);
		},
	};
}

/**
 * Deprecated aggregator hook removed to satisfy Rules of Hooks.
 * All consumers have been migrated to standalone hooks:
 * - useCharacterSheetEnhancements
 * - useWardenToolsEnhancements
 * - useAscendantTools
 */
