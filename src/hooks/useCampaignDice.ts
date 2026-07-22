import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { aiService } from "@/lib/ai/aiService";
import { useAuth } from "@/lib/auth/authContext";
import { publishCampaignRollEvent } from "@/lib/campaignRollEvents";
import { enqueueSyncItem } from "@/lib/syncManager";

type _Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
type _CampaignMember = Database["public"]["Tables"]["campaign_members"]["Row"];

export function useCampaignDice() {
	const { toast } = useToast();
	const { user } = useAuth();

	const getCampaignsForRolling = useCallback(async () => {
		if (!user || !isSupabaseConfigured) return [];

		const { data, error } = await supabase
			.from("campaign_details")
			.select(`
        id,
        name,
        campaign_members!inner(
          user_id,
          role
        )
      `)
			.or(`campaign_members.user_id.eq.${user.id},created_by.eq.${user.id}`);

		if (error) {
			console.error("Error fetching campaigns:", error);
			return [];
		}

		return data || [];
	}, [user]);

	const rollInCampaign = useCallback(
		async (
			campaignId: string,
			rollData: {
				dice_formula: string;
				result: number;
				roll_type: string;
				rolls: number[];
				context?: string;
				modifiers?: Record<string, Json | undefined>;
				character_id?: string;
				character_name?: string;
			},
		) => {
			if (!user || !isSupabaseConfigured) {
				toast({
					title: "Error",
					description: "Must be logged in to roll in campaign",
					variant: "destructive",
				});
				return null;
			}

			// `character_name` is a feed-only field — `roll_history` has no such
			// column, so keep it out of that insert and use it only for the
			// shared campaign roll feed ("Game Log").
			const { character_name, ...historyRoll } = rollData;

			const isOfflineMode =
				typeof navigator !== "undefined" && !navigator.onLine;

			// Publish to the persistent campaign roll feed regardless of the
			// offline branch below — the feed is the durable shared Game Log
			// every member's CampaignRollFeed subscribes to.
			void publishCampaignRollEvent(
				{
					campaign_id: campaignId,
					character_id: historyRoll.character_id ?? null,
					character_name: character_name ?? null,
					dice_formula: historyRoll.dice_formula,
					result: historyRoll.result,
					rolls: historyRoll.rolls,
					roll_type: historyRoll.roll_type,
					context: historyRoll.context ?? null,
					modifiers: (historyRoll.modifiers ?? null) as Json | null,
				},
				user.id,
			);

			try {
				if (isOfflineMode) {
					await enqueueSyncItem("roll", "create", {
						...historyRoll,
						campaign_id: campaignId,
						user_id: user.id,
					});
					toast({
						title: "Roll Saved Offline",
						description: "Roll will sync when reconnected",
					});
					return { ...historyRoll, id: crypto.randomUUID() };
				}

				const { data, error } = await supabase
					.from("roll_history")
					.insert({
						...historyRoll,
						campaign_id: campaignId,
						user_id: user.id,
					})
					.select()
					.single();

				if (error) throw error;

				// Send to campaign chat
				await supabase.from("campaign_messages").insert({
					campaign_id: campaignId,
					user_id: user.id,
					message_type: "roll",
					content: `${rollData.context || "Roll"}: ${rollData.dice_formula} = ${rollData.result}`,
					metadata: {
						roll_data: rollData,
					},
				});

				// AI Automated Combat Resolution
				// We do this non-blocking or at least after the roll is registered
				const { data: campaignData, error: campaignError } = await supabase
					.from("campaigns")
					.select("settings")
					.eq("id", campaignId)
					.single();

				if (!campaignError && campaignData?.settings) {
					const settings = campaignData.settings as Record<string, unknown>;
					if (
						settings.automated_combat === true &&
						(rollData.roll_type === "attack" ||
							rollData.context?.toLowerCase().includes("attack"))
					) {
						// Fire and forget the AI narrative generation
						(async () => {
							try {
								const prompt = `A character just performed an attack roll.
Context: ${rollData.context || "Standard Attack"}
Roll Result: ${rollData.result} (Formula: ${rollData.dice_formula})
Generate a brief (1-2 sentences), hyper-flavorful, cinematic description of this attack occurring in the dark-fantasy Rift Ascendant universe. Do not include mechanical numbers in the narrative.`;

								const response = await aiService.processRequest({
									service: aiService.getConfiguration().defaultService,
									type: "generate-content",
									input: prompt,
								});

								if (response.success && response.data) {
									const content =
										typeof response.data === "string"
											? response.data
											: (response.data as { content?: string }).content;
									if (content) {
										await supabase.from("campaign_messages").insert({
											campaign_id: campaignId,
											user_id: user.id,
											message_type: "rift",
											content: `**Warden AI:** ${content}`,
										});
									}
								}
							} catch (err) {
								console.error("Failed to generate AI combat narrative:", err);
							}
						})();
					}
				}

				toast({
					title: "Roll Recorded",
					description: `Roll added to campaign`,
				});

				return data;
			} catch (error) {
				toast({
					title: "Roll Failed",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return null;
			}
		},
		[user, toast],
	);

	return {
		getCampaignsForRolling,
		rollInCampaign,
	};
}
