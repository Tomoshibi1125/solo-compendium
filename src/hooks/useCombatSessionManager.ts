import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/lib/auth/authContext";

type CampaignCombatSession =
	Database["public"]["Tables"]["campaign_combat_sessions"]["Row"];

interface CombatSessionEndOptions {
	generateRewards?: boolean;
	distributeRewards?: boolean;
	selectedCharacters?: string[];
	xpSplitMode?: "equal" | "custom";
	customXP?: Record<string, number>;
	logSummary?: boolean;
}

export function useCombatSessionManager() {
	const { toast } = useToast();
	const { user } = useAuth();

	const endCombatSession = useCallback(
		async (sessionId: string, options: CombatSessionEndOptions = {}) => {
			if (!user || !isSupabaseConfigured) {
				throw new Error("Must be logged in to manage combat sessions");
			}

			try {
				// Get session details
				const { data: session, error: sessionError } = await supabase
					.from("campaign_combat_sessions")
					.select("*")
					.eq("id", sessionId)
					.single();

				if (sessionError || !session) {
					throw new Error("Combat session not found");
				}

				// Update session status to 'ended'
				const { error: updateError } = await supabase
					.from("campaign_combat_sessions")
					.update({
						status: "ended",
						updated_at: new Date().toISOString(),
					})
					.eq("id", sessionId);

				if (updateError) {
					throw new Error("Failed to update session status");
				}

				// Generate session summary
				const summary = await generateSessionSummary(sessionId);

				// Create session log entry
				if (options.logSummary) {
					await supabase.from("campaign_session_logs").insert({
						campaign_id: session.campaign_id,
						author_id: user.id,
						title: "Combat Session Ended",
						content: `Combat session concluded. ${summary.totalRounds} rounds, ${summary.totalCombatants} combatants participated.`,
						log_type: "session",
						metadata: {
							session_summary: summary,
							ended_by: user.id,
							ended_at: new Date().toISOString(),
						},
						is_player_visible: true,
					});
				}

				toast({
					title: "Combat Session Ended",
					description: "The combat session has been concluded successfully",
				});

				return {
					success: true,
					sessionId,
					summary,
					rewardsAvailable: options.generateRewards,
				};
			} catch (error) {
				toast({
					title: "Error Ending Session",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return {
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				};
			}
		},
		[user, toast],
	);

	const generateSessionSummary = useCallback(async (sessionId: string) => {
		try {
			// Get combatants from the session
			const { data: combatants } = await supabase
				.from("campaign_combatants")
				.select("*")
				.eq("session_id", sessionId);

			// Get session details for round count
			const { data: session } = await supabase
				.from("campaign_combat_sessions")
				.select("round, current_turn")
				.eq("id", sessionId)
				.single();

			const totalCombatants = combatants?.length || 0;
			const totalRounds = session?.round || 1;

			const defeatedCombatants =
				combatants?.filter((c) => {
					const conditions = c.conditions as Record<string, any>;
					return (
						conditions &&
						(conditions.defeated === true ||
							(Array.isArray(conditions) && conditions.includes("defeated")))
					);
				}) || [];

			const survivingCombatants =
				combatants?.filter((c) => {
					const conditions = c.conditions as Record<string, any>;
					return (
						!conditions ||
						(conditions.defeated !== true &&
							(!Array.isArray(conditions) || !conditions.includes("defeated")))
					);
				}) || [];

			return {
				totalRounds,
				totalCombatants,
				defeatedCombatants: defeatedCombatants.length,
				survivingCombatants: survivingCombatants.length,
				combatDuration: totalRounds * 6, // Assuming 6 seconds per round
				sessionEnd: new Date().toISOString(),
			};
		} catch (error) {
			console.error("Error generating session summary:", error);
			return {
				totalRounds: 0,
				totalCombatants: 0,
				defeatedCombatants: 0,
				survivingCombatants: 0,
				combatDuration: 0,
				sessionEnd: new Date().toISOString(),
			};
		}
	}, []);

	const resumeCombatSession = useCallback(
		async (sessionId: string) => {
			if (!user || !isSupabaseConfigured) {
				throw new Error("Must be logged in to manage combat sessions");
			}

			try {
				const { error } = await supabase
					.from("campaign_combat_sessions")
					.update({
						status: "active",
						updated_at: new Date().toISOString(),
					})
					.eq("id", sessionId);

				if (error) {
					throw new Error("Failed to resume combat session");
				}

				toast({
					title: "Combat Session Resumed",
					description: "The combat session has been reactivated",
				});

				return { success: true };
			} catch (error) {
				toast({
					title: "Error Resuming Session",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return {
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				};
			}
		},
		[user, toast],
	);

	const pauseCombatSession = useCallback(
		async (sessionId: string) => {
			if (!user || !isSupabaseConfigured) {
				throw new Error("Must be logged in to manage combat sessions");
			}

			try {
				const { error } = await supabase
					.from("campaign_combat_sessions")
					.update({
						status: "paused",
						updated_at: new Date().toISOString(),
					})
					.eq("id", sessionId);

				if (error) {
					throw new Error("Failed to pause combat session");
				}

				toast({
					title: "Combat Session Paused",
					description: "The combat session has been paused",
				});

				return { success: true };
			} catch (error) {
				toast({
					title: "Error Pausing Session",
					description: error instanceof Error ? error.message : "Unknown error",
					variant: "destructive",
				});
				return {
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				};
			}
		},
		[user, toast],
	);

	return {
		endCombatSession,
		resumeCombatSession,
		pauseCombatSession,
		generateSessionSummary,
	};
}
