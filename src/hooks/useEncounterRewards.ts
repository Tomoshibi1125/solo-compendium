import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";

type _CampaignCombatSession =
	Database["public"]["Tables"]["campaign_combat_sessions"]["Row"];
type _CampaignCombatant =
	Database["public"]["Tables"]["campaign_combatants"]["Row"];

interface EncounterRewards {
	xpTotal: number;
	combatants: Array<{
		id: string;
		name: string;
		xp: number;
	}>;
	loot: Array<{
		name: string;
		value: number;
		description?: string;
	}>;
}

export function useEncounterRewards() {
	const { toast } = useToast();

	const { user } = useAuth();

	const calculateEncounterRewards = useCallback(
		async (sessionId: string): Promise<EncounterRewards | null> => {
			if (!isSupabaseConfigured) {
				throw new Error("Backend not configured");
			}

			try {
				// Get combat session with combatants
				const { data: session, error: sessionError } = await supabase
					.from("campaign_combat_sessions")
					.select(`
          *,
          campaign_combatants!inner(
            id,
            name,
            stats,
            conditions
          )
        `)
					.eq("id", sessionId)
					.single();

				if (sessionError || !session) {
					throw new Error("Combat session not found");
				}

				const combatants = session.campaign_combatants || [];

				// Calculate XP based on combatant stats
				let xpTotal = 0;
				const combatantRewards: Array<{
					id: string;
					name: string;
					xp: number;
				}> = [];

				for (const combatant of combatants) {
					const stats = combatant.stats as Record<string, unknown> | null;
					const conditions = combatant.conditions as string[] | null;

					// Check if combatant is defeated (has 'defeated' condition)
					const isDefeated =
						conditions &&
						Array.isArray(conditions) &&
						conditions.includes("defeated");

					if (isDefeated) {
						// Calculate XP based on CR or challenge rating in stats
						const crRaw = stats?.challenge_rating ?? stats?.cr ?? "0";
						const cr = parseFloat(String(crRaw));
						const xp = calculateXPByCR(cr);
						xpTotal += xp;

						combatantRewards.push({
							id: combatant.id,
							name: combatant.name,
							xp,
						});
					}
				}

				// Generate loot based on encounter difficulty
				const loot = generateLootForEncounter(combatantRewards, xpTotal);

				return {
					xpTotal,
					combatants: combatantRewards,
					loot,
				};
			} catch (error) {
				toast({
					title: "Error Calculating Rewards",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[toast],
	);

	const distributeRewards = useCallback(
		async (
			campaignId: string,
			rewards: EncounterRewards,
			selectedCharacters: string[],
			xpSplitMode: "equal" | "custom" = "equal",
			customXP?: Record<string, number>,
		) => {
			if (!user || !isSupabaseConfigured) {
				throw new Error("Must be logged in to distribute rewards");
			}

			try {
				// Get campaign to check leveling mode
				const { data: campaign } = await supabase
					.from("campaigns")
					.select("settings")
					.eq("id", campaignId)
					.single();

				const settings = campaign?.settings as Record<string, unknown>;
				const isXPMode = settings?.leveling_mode === "xp";

				// Distribute XP if in XP mode
				if (isXPMode && rewards.xpTotal > 0) {
					const xpDistribution: Record<string, number> = {};

					if (xpSplitMode === "equal") {
						const xpPerCharacter = Math.floor(
							rewards.xpTotal / selectedCharacters.length,
						);
						selectedCharacters.forEach((charId) => {
							xpDistribution[charId] = xpPerCharacter;
						});
					} else if (customXP) {
						Object.assign(xpDistribution, customXP);
					}

					// Update character XP using RPC function
					for (const [characterId, xp] of Object.entries(xpDistribution)) {
						try {
							const { data, error } = await supabase.rpc(
								"update_character_xp",
								{
									character_id: characterId,
									xp_amount: xp,
									campaign_id: campaignId,
									reason: "Encounter reward",
								},
							);

							if (error) {
								console.error(
									"Failed to update XP for character",
									characterId,
									error,
								);
								toast({
									title: "XP Update Failed",
									description: `Could not award XP to character ${characterId}`,
									variant: "destructive",
								});
							} else if (data && Array.isArray(data) && data.length > 0) {
								const result = data[0] as {
									success?: boolean;
									message?: string;
								};
								if (result.success) {
									toast({
										title: "XP Awarded",
										description: result.message,
										variant: "default",
									});
								} else {
									toast({
										title: "XP Update Failed",
										description: result.message,
										variant: "destructive",
									});
								}
							}
						} catch (error) {
							console.error("Error updating XP:", error);
							toast({
								title: "XP Update Error",
								description: "An unexpected error occurred while awarding XP",
								variant: "destructive",
							});
						}
					}
				}

				// Create session log entry
				await supabase.from("campaign_session_logs").insert({
					campaign_id: campaignId,
					author_id: user.id,
					title: "Encounter Rewards",
					content: `Distributed ${rewards.xpTotal} XP and loot to ${selectedCharacters.length} characters`,
					log_type: "loot",
					metadata: {
						xp_total: rewards.xpTotal,
						combatants_defeated: rewards.combatants,
						loot_distributed: rewards.loot,
						distributed_to: selectedCharacters,
					},
					is_player_visible: true,
				});

				toast({
					title: "Rewards Distributed",
					description: `Successfully distributed rewards to ${selectedCharacters.length} characters`,
				});

				return true;
			} catch (error) {
				toast({
					title: "Distribution Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return false;
			}
		},
		[user, toast],
	);

	return {
		calculateEncounterRewards,
		distributeRewards,
	};
}

// Helper function to calculate XP by CR
function calculateXPByCR(cr: number): number {
	const xpTable: Record<number, number> = {
		0: 10,
		0.125: 25,
		0.25: 50,
		0.5: 100,
		1: 200,
		2: 450,
		3: 700,
		4: 1100,
		5: 1800,
		6: 2300,
		7: 2900,
		8: 3900,
		9: 5000,
		10: 5900,
		11: 7200,
		12: 8400,
		13: 10000,
		14: 11500,
		15: 13000,
		16: 15000,
		17: 18000,
		18: 20000,
		19: 22000,
		20: 25000,
		21: 33000,
		22: 41000,
		23: 50000,
		24: 62000,
		30: 155000,
	};

	return xpTable[cr] || 100;
}

// Generate loot based on encounter difficulty
function generateLootForEncounter(
	combatants: Array<{ id: string; name: string; xp: number }>,
	totalXP: number,
): Array<{ name: string; value: number; description?: string }> {
	const loot: Array<{ name: string; value: number; description?: string }> = [];

	// Basic loot generation based on total XP
	const goldValue = Math.floor(totalXP * 0.1); // 10% of XP in gold value

	if (goldValue > 0) {
		loot.push({
			name: "Gold Pieces",
			value: goldValue,
			description: "Coins recovered from the encounter",
		});
	}

	// Chance for magic items based on encounter size
	if (combatants.length >= 3 && Math.random() > 0.7) {
		loot.push({
			name: "Potion of Healing",
			value: 50,
			description: "A magical healing potion",
		});
	}

	if (combatants.length >= 5 && Math.random() > 0.8) {
		loot.push({
			name: "Scroll of Protection",
			value: 100,
			description: "A magical scroll",
		});
	}

	return loot;
}
