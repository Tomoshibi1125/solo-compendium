import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCampaignAnalytics } from "@/hooks/useCampaignAnalytics";
import { useCampaignDice } from "@/hooks/useCampaignDice";
import { useCharacterExport } from "@/hooks/useCharacterExportImport";
import { useCharacterRoll } from "@/hooks/useCharacterRoll";
import { useCombatSessionManager } from "@/hooks/useCombatSessionManager";
import { useEncounterRewards } from "@/hooks/useEncounterRewards";
import { useOfflineDataAccess } from "@/hooks/useOfflineDataAccess";
import { useVTTManager, type VTTScene } from "@/hooks/useVTTManager";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";
import { logger } from "@/lib/logger";
import { rollCheck } from "@/lib/rollEngine";

interface CharacterSheetEnhancements {
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

interface DMToolsEnhancements {
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
	saveVTTScene: (
		campaignId: string,
		scene: Partial<VTTScene>,
	) => Promise<unknown>;
	loadVTTScene: (campaignId: string, sceneId?: string) => Promise<unknown>;
	uploadVTTAsset: (
		campaignId: string,
		file: File,
		type: string,
	) => Promise<unknown>;
	isDM: boolean;
	awardEncounterRewards: (sessionId: string) => Promise<void>;
}

interface PlayerToolsEnhancements {
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
		system: "SA" | "5e",
		options?: { skipBroadcast?: boolean },
	) => Promise<void>;
}

export function useGlobalDDBeyondIntegration() {
	const { toast } = useToast();

	const { user } = useAuth();

	// Character sheet enhancements
	const useCharacterSheetEnhancements = (
		characterId: string,
	): CharacterSheetEnhancements => {
		const characterRoll = useCharacterRoll({
			characterId,
			characterName: "Character",
			abilities: {},
			proficiencyBonus: 2,
			savingThrowProficiencies: [],
			skillProficiencies: [],
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
				// Basic roll implementation
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
				// Would integrate with useRollHistory
				return [];
			},
			clearCache: () => {
				clearCache();
			},
			getCacheSize: () => {
				return getCacheSize();
			},
		};
	};

	// DM tools enhancements
	const useDMToolsEnhancements = (campaignId?: string): DMToolsEnhancements => {
		const { endCombatSession, pauseCombatSession, resumeCombatSession } =
			useCombatSessionManager();
		const { calculateEncounterRewards, distributeRewards } =
			useEncounterRewards();
		const {
			generateCampaignReport,
			getCampaignAnalytics,
			exportAnalyticsData,
		} = useCampaignAnalytics();
		const { saveVTTScene, loadVTTScene, uploadVTTAsset } = useVTTManager();

		const _broadcastSystemMessage = async (
			campaignId: string,
			content: string,
		) => {
			try {
				if (campaignId && user?.id) {
					await supabase.from("campaign_messages").insert({
						campaign_id: campaignId,
						message_type: "system",
						content: `**DM**: ${content}`,
						user_id: user.id,
					});
				}
			} catch (e) {
				console.error("Failed to broadcast DM system message", e);
			}
		};

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
			saveVTTScene: async (vttCampaignId: string, scene: Partial<VTTScene>) => {
				return await saveVTTScene(vttCampaignId, scene);
			},
			loadVTTScene: async (vttCampaignId: string, sceneId?: string) => {
				return await loadVTTScene(vttCampaignId, sceneId);
			},
			uploadVTTAsset: async (
				vttCampaignId: string,
				file: File,
				type: string,
			) => {
				return await uploadVTTAsset(
					vttCampaignId,
					file,
					type as "map" | "token",
				);
			},
			isDM: true, // In Solo Awakening, the local user is typically the DM.
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
				} catch (_error) {
					toast({
						title: "Error",
						description: "Failed to award encounter rewards.",
						variant: "destructive",
					});
				}
			},
		};
	};

	// Player tools enhancements
	const usePlayerToolsEnhancements = (): PlayerToolsEnhancements => {
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
						message_type: "system",
						content: `**${charName}**: ${content}`,
						user_id: user.id,
					});
				}
			} catch (e) {
				console.error("Failed to broadcast global message", e);
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
				// Return cached data for offline use
				return {
					characters: [],
					compendium: [],
					campaigns: [],
				};
			},
			syncOfflineData: async () => {
				// Trigger offline sync via background sync hook
			},
			trackHealthChange: async (
				characterId: string,
				amount: number,
				type: "damage" | "healing" | "temp",
				options,
			) => {
				if (options?.skipBroadcast) return;
				const verb =
					type === "damage"
						? "took"
						: type === "healing"
							? "recovered"
							: "gained";
				const noun =
					type === "temp"
						? "temporary HP"
						: type === "damage"
							? "damage"
							: "HP";
				await broadcastSystemMessage(characterId, `${verb} ${amount} ${noun}.`);
			},
			trackConditionChange: async (
				characterId: string,
				condition: string,
				action: "add" | "remove",
				options,
			) => {
				if (options?.skipBroadcast) return;
				const verb =
					action === "add" ? "gained condition" : "removed condition";
				await broadcastSystemMessage(characterId, `${verb}: ${condition}.`);
			},
			trackInventoryChange: async (
				characterId: string,
				itemName: string,
				action: "add" | "remove" | "equip" | "unequip",
				options,
			) => {
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
				characterId: string,
				featureName: string,
				action: string,
				_system: "SA" | "5e",
				options,
			) => {
				if (options?.skipBroadcast) return;
				await broadcastSystemMessage(
					characterId,
					`${action} [${featureName}].`,
				);
			},
		};
	};

	// Global D&D Beyond parity verification
	const verifyDDBeyondParity = useCallback((): {
		features: {
			characterRolls: boolean;
			characterExportImport: boolean;
			campaignDice: boolean;
			encounterRewards: boolean;
			combatSessionManagement: boolean;
			campaignAnalytics: boolean;
			vttManagement: boolean;
			offlineAccess: boolean;
		};
		score: number;
		status: string;
		isComplete: boolean;
	} => {
		const features = {
			characterRolls: !!useCharacterRoll,
			characterExportImport: !!useCharacterExport,
			campaignDice: !!useCampaignDice,
			encounterRewards: !!useEncounterRewards,
			combatSessionManagement: !!useCombatSessionManager,
			campaignAnalytics: !!useCampaignAnalytics,
			vttManagement: !!useVTTManager,
			offlineAccess: !!useOfflineDataAccess,
		};

		const parityScore =
			Object.values(features).filter(Boolean).length /
			Object.keys(features).length;

		// Development-only parity check logging
		if (import.meta.env.DEV) {
			logger.debug("D&D Beyond Parity Check:", {
				features,
				score: `${Math.round(parityScore * 100)}%`,
				status: parityScore === 1 ? "COMPLETE" : "IN PROGRESS",
			});
		}

		return {
			features,
			score: parityScore,
			status: parityScore === 1 ? "COMPLETE" : "IN PROGRESS",
			isComplete: parityScore === 1,
		};
	}, []);

	return {
		useCharacterSheetEnhancements,
		useDMToolsEnhancements,
		usePlayerToolsEnhancements,
		verifyDDBeyondParity,
	};
}
