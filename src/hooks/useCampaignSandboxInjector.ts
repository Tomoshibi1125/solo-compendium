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

		let wikiCount = 0;
		let sceneCount = 0;
		let npcCount = 0;
		let handoutCount = 0;

		try {
			// 0. Verify RLS and propagation are settled before injecting
			setInjectionState({
				isInjecting: true,
				progressString: "Verifying Database Connection & Permissions...",
			});

			let isReady = false;
			for (let attempt = 0; attempt < 5; attempt++) {
				const { data: campaignTest, error: testError } = await supabase
					.from("campaigns")
					.select("id")
					.eq("id", targetId)
					.maybeSingle();
				
				if (campaignTest) {
					isReady = true;
					break;
				}
				
				await new Promise((resolve) => setTimeout(resolve, 800));
			}

			if (!isReady) {
				toast({
					title: "Pre-Flight Check Failed",
					description: "Campaign database is not responsive or sync is delayed. Try again in a few moments.",
					variant: "destructive"
				});
				return;
			}

			// 1. Inject Wiki Chapters
			setInjectionState({
				isInjecting: true,
				progressString: `Generating Regional Wiki Lore (0/${massiveSandboxModule.chapters.length})...`,
			});

			for (let i = 0; i < massiveSandboxModule.chapters.length; i++) {
				const chapter = massiveSandboxModule.chapters[i];

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
							category: "lore",
							is_public: true,
						});

					if (wikiError) {
						console.error(
							"[SandboxInjector] Wiki insert failed:",
							chapter.title,
							wikiError,
						);
						// If the very first insert fails, it's likely an RLS issue — abort early
						if (i === 0) {
							toast({
								title: "Module Import Failed",
								description:
									`Database error: ${wikiError.message || "Permission Denied"}. Please ensure you are the Warden.`,
								variant: "destructive",
							});
							return;
						}
					} else {
						wikiCount++;
					}
				}

				if (i % 5 === 0) {
					setInjectionState({
						isInjecting: true,
						progressString: `Generating Regional Wiki Lore (${i + 1}/${massiveSandboxModule.chapters.length})...`,
					});
				}
			}

			// 2. Inject VTT Maps, Sessions, and Tokens
			setInjectionState({
				isInjecting: true,
				progressString: `Constructing Sandbox Maps (0/${massiveSandboxModule.scenes.length})...`,
			});

			for (let i = 0; i < massiveSandboxModule.scenes.length; i++) {
				const scene = massiveSandboxModule.scenes[i];
				const sessionTitle = `Sandbox Region: ${scene.name}`;

				// Dedup check: Avoid inserting the same scene session multiple times
				const { data: existingSession } = await supabase
					.from("active_sessions")
					.select("id")
					.eq("campaign_id", targetId)
					.eq("title", sessionTitle)
					.maybeSingle();

				if (existingSession) continue;

				// Generate a session_id
				const newSessionId = crypto.randomUUID();

				// Insert Active Session
				const { error: sessionError } = await supabase
					.from("active_sessions")
					.insert({
						id: newSessionId,
						campaign_id: targetId,
						created_by: user.id,
						title: sessionTitle,
						status: "prep",
						description: "Sandbox Map - Auto Generated",
					});

				if (sessionError) {
					console.error(
						"[SandboxInjector] Session insert failed:",
						sessionTitle,
						sessionError,
					);
					continue;
				}

				sceneCount++;

				// Insert Settings
				const { error: settingsError } = await supabase
					.from("vtt_settings")
					.insert({
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

				if (settingsError) {
					console.error(
						"[SandboxInjector] VTT settings insert failed:",
						sessionTitle,
						settingsError,
					);
				}

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
					const { error: tokenError } = await supabase
						.from("vtt_tokens")
						.insert(tokenInserts);
					if (tokenError) {
						console.error(
							"[SandboxInjector] Token insert failed:",
							scene.name,
							tokenError,
						);
					}
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
					const { error: audioError } = await supabase
						.from("vtt_audio_tracks")
						.insert(audioInserts);
					if (audioError) {
						console.error(
							"[SandboxInjector] Audio insert failed:",
							scene.name,
							audioError,
						);
					}
				}

				setInjectionState({
					isInjecting: true,
					progressString: `Constructing Sandbox Maps (${i + 1}/${massiveSandboxModule.scenes.length})...`,
				});
			}

			// 3. Inject NPCs
			setInjectionState({
				isInjecting: true,
				progressString: `Sowing NPC Roster (0/${massiveSandboxModule.npcs?.length ?? 0})...`,
			});

			if (massiveSandboxModule.npcs && massiveSandboxModule.npcs.length > 0) {
				for (let i = 0; i < massiveSandboxModule.npcs.length; i++) {
					const npc = massiveSandboxModule.npcs[i];

					const { data: existingNpc } = await supabase
						.from("campaign_wiki_articles")
						.select("id")
						.eq("campaign_id", targetId)
						.eq("title", npc.name)
						.maybeSingle();

					if (!existingNpc) {
						// Build markdown stat block for NPC
						const npcContent = [
							`## ${npc.name}`,
							`**Role:** ${npc.title}`,
							`**Affiliation:** ${npc.guildAffiliation ?? "Unaffiliated"}`,
							``,
							`**Description:**`,
							npc.description,
							``,
							`### Personality`,
							npc.personality,
							``,
							`### Motivation`,
							npc.motivation,
							``,
							`### Backstory`,
							npc.backstory,
							``,
							`### Key Abilities`,
							...npc.keyAbilities.map((a) => `- ${a}`),
							``,
							`### Mechanics`,
							`- **Level:** ${npc.level}`,
							`- **Class/Job:** ${npc.job}`,
							`- **HP:** ${npc.hp} | **AC:** ${npc.ac}`,
							`- **Recruitable:** ${npc.isRecruitable ? "Yes" : "No"}`,
							`- **Recruit Condition:** ${npc.recruitCondition}`,
						].join("\n");

						const { error: npcError } = await supabase
							.from("campaign_wiki_articles")
							.insert({
								campaign_id: targetId,
								title: npc.name,
								content: npcContent,
								category: "npc",
								is_public: true,
							});

						if (npcError) {
							console.error(
								"[SandboxInjector] NPC insert failed:",
								npc.name,
								npcError,
							);
						} else {
							npcCount++;
						}
					}

					if (i % 10 === 0) {
						setInjectionState({
							isInjecting: true,
							progressString: `Sowing NPC Roster (${i + 1}/${massiveSandboxModule.npcs.length})...`,
						});
					}
				}
			}

			// 4. Inject Handouts
			setInjectionState({
				isInjecting: true,
				progressString: `Sowing Campaign Handouts (0/${massiveSandboxModule.handouts?.length ?? 0})...`,
			});

			if (
				massiveSandboxModule.handouts &&
				massiveSandboxModule.handouts.length > 0
			) {
				for (let i = 0; i < massiveSandboxModule.handouts.length; i++) {
					const h = massiveSandboxModule.handouts[i];

					const { data: existingHandout } = await supabase
						.from("vtt_journal_entries")
						.select("id")
						.eq("campaign_id", targetId)
						.eq("title", h.title)
						.maybeSingle();

					if (!existingHandout) {
						const { error: handoutError } = await supabase
							.from("vtt_journal_entries")
							.insert({
								campaign_id: targetId,
								user_id: user.id,
								title: h.title,
								content: h.content,
								visible_to_players: h.visibleToPlayers,
								category: h.category,
							});

						if (handoutError) {
							console.error(
								"[SandboxInjector] Handout insert failed:",
								h.title,
								handoutError,
							);
						} else {
							handoutCount++;
						}
					}
				}
			}

			const summary = [
				wikiCount > 0 ? `${wikiCount} wiki chapters` : null,
				sceneCount > 0 ? `${sceneCount} VTT maps` : null,
				npcCount > 0 ? `${npcCount} NPCs` : null,
				handoutCount > 0 ? `${handoutCount} handouts` : null,
			]
				.filter(Boolean)
				.join(", ");

			if (summary) {
				toast({
					title: "Sandbox Generated Successfully!",
					description: `Imported: ${summary}.`,
				});
			} else {
				toast({
					title: "Sandbox Already Imported",
					description:
						"All module content was already present. No new data was added.",
				});
			}

			// Invalidate queries with campaign-scoped keys
			queryClient.invalidateQueries({
				queryKey: ["campaign_wiki_articles", targetId],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaign_wiki_articles"],
			});
			queryClient.invalidateQueries({
				queryKey: ["active_sessions", targetId],
			});
			queryClient.invalidateQueries({ queryKey: ["active_sessions"] });
			queryClient.invalidateQueries({
				queryKey: ["vtt_journal_entries", targetId],
			});
			queryClient.invalidateQueries({ queryKey: ["vtt_journal_entries"] });
			queryClient.invalidateQueries({
				queryKey: ["campaign_sessions", targetId],
			});
		} catch (error) {
			console.error("Sandbox Injection Error:", error);
			toast({
				title: "Sandbox Injection Failed",
				description:
					"An error occurred while generating the sandbox. See console for details.",
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
