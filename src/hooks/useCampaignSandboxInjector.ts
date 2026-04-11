import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { massiveSandboxModule } from "@/data/compendium/ascendant-sandbox-module";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";

interface InjectionState {
	isInjecting: boolean;
	progressString: string;
}

export function useCampaignSandboxInjector(campaignId: string | null) {
	const { user } = useAuth();
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [injectionState, setInjectionState] = useState<InjectionState>({
		isInjecting: false,
		progressString: "",
	});

	const injectSandbox = async (overrideCampaignId?: string) => {
		const targetId = overrideCampaignId || campaignId;
		if (!targetId || !user) return;

		setInjectionState({
			isInjecting: true,
			progressString: "Starting Sandbox Injection...",
		});

		try {
			// Pre-flight: verify the campaign actually exists in Supabase
			const { data: campaign, error: campaignError } = await supabase
				.from("campaigns")
				.select("id")
				.eq("id", targetId)
				.single();

			if (campaignError || !campaign) {
				console.error(
					"[SandboxInjector] Campaign does not exist in database:",
					targetId,
					campaignError,
				);
				toast({
					title: "Sandbox Injection Skipped",
					description:
						"Campaign has not finished saving. Try importing from Campaign Settings later.",
					variant: "destructive",
				});
				return;
			}

			// 1. Inject Wiki Chapters
			setInjectionState({
				isInjecting: true,
				progressString: "Generating Regional Wiki Lore...",
			});
			for (const chapter of massiveSandboxModule.chapters) {
				// Check if exists
				const { data: existing } = await supabase
					.from("campaign_wiki_articles")
					.select("id")
					.eq("campaign_id", targetId)
					.eq("title", chapter.title)
					.maybeSingle();

				if (!existing) {
					const { error: wikiError } = await supabase
						.from("campaign_wiki_articles")
						.insert({
							campaign_id: targetId,
							title: chapter.title,
							content: chapter.content,
						});
					if (wikiError) {
						console.error(
							"[SandboxInjector] Wiki insert failed:",
							chapter.title,
							wikiError,
						);
					}
				}
			}

			// 2. Inject VTT Maps, Sessions, and Tokens
			setInjectionState({
				isInjecting: true,
				progressString: "Constructing Sandbox Maps...",
			});

			for (const scene of massiveSandboxModule.scenes) {
				const sessionTitle = `Sandbox Region: ${scene.name}`;

				// Generate a deterministic session_id or let supersbase make one
				const newSessionId = crypto.randomUUID();

				// Insert Active Session
				await supabase.from("active_sessions").insert({
					id: newSessionId,
					campaign_id: targetId,
					created_by: user.id,
					title: sessionTitle,
					status: "prep",
					description: "Sandbox Map - Auto Generated",
				});

				// Insert Settings
				await supabase.from("vtt_settings").insert({
					session_id: newSessionId,
					created_by: user.id,
					background_color: "#18181b",
					background_image_url: scene.backgroundImage || null,
					dynamic_lighting_enabled: false,
					fog_of_war_enabled: scene.fogOfWar,
					grid_size: scene.gridSize,
					grid_visible: true,
					pan_x: 0,
					pan_y: 0,
					zoom_level: 1,
				});

				// Insert Tokens
				setInjectionState({
					isInjecting: true,
					progressString: `Placing Encounters for ${scene.name}...`,
				});

				if (scene.tokens && scene.tokens.length > 0) {
					const tokenInserts = scene.tokens.map((t) => {
						let numericSize = 1; // Medium
						if (t.size === "small") numericSize = 0.8;
						if (t.size === "large") numericSize = 2;
						if (t.size === "huge") numericSize = 3;

						return {
							id: crypto.randomUUID(),
							session_id: newSessionId,
							created_by: user.id,
							name: t.name,
							token_type: t.tokenType || "npc",
							image_url: t.imageUrl || null,
							size: numericSize,
							x: t.x * scene.gridSize, // Scale to pixel grid
							y: t.y * scene.gridSize,
							is_dm_token: false,
							visible_to_players: !scene.fogOfWar,
							stats: t.hp
								? { hp_max: t.maxHp || t.hp, hp_current: t.hp, ac: t.ac || 10 }
								: null,
							owned_by_user_id: null,
						};
					});

					// Bulk insert
					await supabase.from("vtt_tokens").insert(tokenInserts);
				}

				// Insert Audio Tracks
				if (scene.audioTracks && scene.audioTracks.length > 0) {
					const audioInserts = scene.audioTracks.map((track) => ({
						id: crypto.randomUUID(),
						session_id: newSessionId,
						created_by: user.id,
						name: track.name,
						url: track.url,
						type: "ambient",
						volume: 50,
						loop: true,
						is_playing: true,
					}));
					await supabase.from("vtt_audio_tracks").insert(audioInserts);
				}
			}

			// 3. Inject Handouts
			setInjectionState({
				isInjecting: true,
				progressString: "Sowing Campaign Handouts...",
			});

			if (
				massiveSandboxModule.handouts &&
				massiveSandboxModule.handouts.length > 0
			) {
				// We check against titles to prevent duplicates if Warden clicks 'Import Sandbox' multiple times
				for (const h of massiveSandboxModule.handouts) {
					const { data: existingHandout } = await supabase
						.from("vtt_journal_entries")
						.select("id")
						.eq("campaign_id", targetId)
						.eq("title", h.title)
						.maybeSingle();

					if (!existingHandout) {
						await supabase.from("vtt_journal_entries").insert({
							campaign_id: targetId,
							user_id: user.id,
							title: h.title,
							content: h.content,
							visible_to_players: h.visibleToPlayers,
							category: h.category,
						});
					}
				}
			}

			toast({
				title: "Sandbox Generated Successfully!",
				description: "Wiki chapters and VTT Maps are fully populated.",
			});

			queryClient.invalidateQueries({ queryKey: ["campaign_wiki_articles"] });
			queryClient.invalidateQueries({ queryKey: ["active_sessions"] });
		} catch (error) {
			console.error("Sandbox Injection Error:", error);
			toast({
				title: "Sandbox Injection Failed",
				description:
					"An error occurred while generating the sandbox. See console.",
				variant: "destructive",
			});
		} finally {
			setInjectionState({ isInjecting: false, progressString: "" });
		}
	};

	return {
		injectSandbox,
		isInjecting: injectionState.isInjecting,
		progressString: injectionState.progressString,
	};
}
