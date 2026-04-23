import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { massiveSandboxModule } from "@/data/compendium/ascendant-sandbox-module";
import { useToast } from "@/hooks/use-toast";
import {
	saveCampaignToolState,
	writeLocalToolState,
} from "@/hooks/useToolState";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import {
	readLocalJournals,
	readLocalWikiArticles,
	saveLocalJournals,
	saveLocalWikiArticles,
} from "@/lib/guestStore";
import type { VTTScene } from "@/types/vtt";

const isLocalMode = () => !isSupabaseConfigured;

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
		if (!targetId || (!user && !isLocalMode())) return;

		setInjectionState({
			isInjecting: true,
			progressString: "Starting Sandbox Injection...",
		});

		let wikiCount = 0;
		let sceneCount = 0;
		let npcCount = 0;
		let handoutCount = 0;

		try {
			// 0. Verify RLS and propagation are settled before injecting in cloud mode
			if (!isLocalMode()) {
				setInjectionState({
					isInjecting: true,
					progressString: "Verifying Database Connection & Permissions...",
				});

				let isReady = false;
				for (let attempt = 0; attempt < 5; attempt++) {
					const { data: campaignTest, error: _testError } = await supabase
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
						description:
							"Campaign database is not responsive or sync is delayed. Try again in a few moments.",
						variant: "destructive",
					});
					return;
				}
			}

			// 1. Inject Wiki Chapters (Lore)
			try {
				setInjectionState({
					isInjecting: true,
					progressString: `Generating Regional Wiki Lore (0/${massiveSandboxModule.chapters.length})...`,
				});

				if (isLocalMode()) {
					const existingWiki = readLocalWikiArticles(targetId);
					for (let i = 0; i < massiveSandboxModule.chapters.length; i++) {
						const chapter = massiveSandboxModule.chapters[i];
						if (!existingWiki.find((w) => w.title === chapter.title)) {
							// Use staggered timestamps to preserve insertion order
							const ts = new Date(Date.now() + i).toISOString();
							existingWiki.push({
								id: crypto.randomUUID(),
								campaign_id: targetId,
								title: chapter.title,
								content: chapter.content,
								category: "lore",
								is_public: true,
								created_at: ts,
								updated_at: ts,
								created_by: "guest",
							});
							wikiCount++;
						}
						if (i % 5 === 0) {
							setInjectionState({
								isInjecting: true,
								progressString: `Generating Regional Wiki Lore (${i + 1}/${massiveSandboxModule.chapters.length})...`,
							});
						}
					}
					if (wikiCount > 0) saveLocalWikiArticles(targetId, existingWiki);
				} else {
					for (let i = 0; i < massiveSandboxModule.chapters.length; i++) {
						const chapter = massiveSandboxModule.chapters[i];
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
								if (i === 0) {
									toast({
										title: "Module Import Failed",
										description: `Database error: ${wikiError.message || "Permission Denied"}. Please ensure you are the Warden.`,
										variant: "destructive",
									});
									// Still continue with other sections
									break;
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
				}
			} catch (wikiErr) {
				console.error("[SandboxInjector] Wiki section error:", wikiErr);
			}

			// 2. Inject VTT Maps — pass sandbox scenes through directly (they are already complete VTTScene objects)
			try {
				setInjectionState({
					isInjecting: true,
					progressString: `Constructing Sandbox VTT Maps (0/${massiveSandboxModule.scenes.length})...`,
				});

				// The sandbox scenes are already fully-formed VTTScene objects with correct
				// dimensions, gridSize, token positions, and fog settings. Pass them through
				// directly instead of destructively re-mapping.
				const scenes: VTTScene[] = massiveSandboxModule.scenes.map((scene) => ({
					id: scene.id || crypto.randomUUID(),
					name: scene.name,
					width: scene.width,
					height: scene.height,
					backgroundImage: scene.backgroundImage,
					gridSize: scene.gridSize,
					gridType: scene.gridType,
					tokens: scene.tokens || [],
					drawings: scene.drawings || [],
					annotations: scene.annotations || [],
					walls: scene.walls || [],
					lights: scene.lights || [],
					fogOfWar: scene.fogOfWar,
				}));

				if (scenes.length > 0) {
					const scenesPayload = {
						scenes,
						currentSceneId: scenes[0].id,
					};
					// Canonical tool key — MUST match what VTTEnhanced.tsx and PlayerMapView.tsx
					// read via useCampaignToolState. Using "vtt-scenes" (hyphen) would be a silent
					// no-op; the consumer reads "vtt_scenes" (underscore) without any session id.
					const VTT_SCENES_TOOL_KEY = "vtt_scenes";
					// Legacy localStorage key pattern used by the VTT pages for offline fallback
					// (see VTTEnhanced.tsx legacyStorageKey + useCampaignToolState storageKey).
					const legacyStorageKey = `vtt-scenes-${targetId}`;

					if (isLocalMode()) {
						// Guest / offline mode: write directly to localStorage so the VTT
						// legacy-fallback layer picks scenes up on next mount.
						writeLocalToolState(legacyStorageKey, scenesPayload);
						sceneCount = scenes.length;
					} else {
						// Cloud mode: persist to Supabase campaign_tool_states via the
						// canonical tool key. Also mirror into localStorage so VTT hydration
						// has a zero-latency fallback if the remote query hasn't resolved yet.
						await saveCampaignToolState<typeof scenesPayload>(
							targetId,
							user?.id || "guest",
							VTT_SCENES_TOOL_KEY,
							scenesPayload,
						);
						writeLocalToolState(legacyStorageKey, scenesPayload);
						sceneCount = scenes.length;
					}
				}
			} catch (sceneErr) {
				console.error("[SandboxInjector] VTT scene section error:", sceneErr);
			}

			// 3. Inject NPCs
			try {
				setInjectionState({
					isInjecting: true,
					progressString: `Sowing NPC Roster (0/${massiveSandboxModule.npcs?.length ?? 0})...`,
				});

				if (massiveSandboxModule.npcs && massiveSandboxModule.npcs.length > 0) {
					if (isLocalMode()) {
						const existingWiki = readLocalWikiArticles(targetId);
						for (let i = 0; i < massiveSandboxModule.npcs.length; i++) {
							const npc = massiveSandboxModule.npcs[i];
							if (!existingWiki.find((w) => w.title === npc.name)) {
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
									`### Mechanics`,
									`- **Level:** ${npc.level}`,
									`- **Class/Job:** ${npc.job}`,
									`- **HP:** ${npc.hp} | **AC:** ${npc.ac}`,
								].join("\n");

								existingWiki.push({
									id: crypto.randomUUID(),
									campaign_id: targetId,
									title: npc.name,
									content: npcContent,
									category: "npc",
									is_public: true,
									created_at: new Date().toISOString(),
									updated_at: new Date().toISOString(),
									created_by: "guest",
								});
								npcCount++;
							}
							if (i % 10 === 0) {
								setInjectionState({
									isInjecting: true,
									progressString: `Sowing NPC Roster (${i + 1}/${massiveSandboxModule.npcs.length})...`,
								});
							}
						}
						if (npcCount > 0) saveLocalWikiArticles(targetId, existingWiki);
					} else {
						for (let i = 0; i < massiveSandboxModule.npcs.length; i++) {
							const npc = massiveSandboxModule.npcs[i];
							const { data: existingNpc } = await supabase
								.from("campaign_wiki_articles")
								.select("id")
								.eq("campaign_id", targetId)
								.eq("title", npc.name)
								.maybeSingle();

							if (!existingNpc) {
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
									`### Mechanics`,
									`- **Level:** ${npc.level}`,
									`- **Class/Job:** ${npc.job}`,
									`- **HP:** ${npc.hp} | **AC:** ${npc.ac}`,
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

								if (npcError)
									console.error(
										"[SandboxInjector] NPC insert failed:",
										npc.name,
										npcError,
									);
								else npcCount++;
							}

							if (i % 10 === 0) {
								setInjectionState({
									isInjecting: true,
									progressString: `Sowing NPC Roster (${i + 1}/${massiveSandboxModule.npcs.length})...`,
								});
							}
						}
					}
				}
			} catch (npcErr) {
				console.error("[SandboxInjector] NPC section error:", npcErr);
			}

			// 4. Inject Handouts
			try {
				setInjectionState({
					isInjecting: true,
					progressString: `Sowing Campaign Handouts (0/${massiveSandboxModule.handouts?.length ?? 0})...`,
				});

				if (
					massiveSandboxModule.handouts &&
					massiveSandboxModule.handouts.length > 0
				) {
					if (isLocalMode()) {
						const existingJournals = readLocalJournals(targetId);
						for (let i = 0; i < massiveSandboxModule.handouts.length; i++) {
							const h = massiveSandboxModule.handouts[i];
							// Normalize double-escaped newlines from static sandbox data
							const normalizedContent = h.content.replace(/\\n/g, "\n");
							if (!existingJournals.find((j) => j.title === h.title)) {
								existingJournals.push({
									id: crypto.randomUUID(),
									campaign_id: targetId,
									title: h.title,
									content: normalizedContent,
									category: h.category,
									tags: [],
									visible_to_players: h.visibleToPlayers,
									created_at: new Date().toISOString(),
									updated_at: new Date().toISOString(),
									user_id: "guest",
								});
								handoutCount++;
							}
						}
						if (handoutCount > 0) saveLocalJournals(targetId, existingJournals);
					} else {
						for (let i = 0; i < massiveSandboxModule.handouts.length; i++) {
							const h = massiveSandboxModule.handouts[i];
							// Normalize double-escaped newlines from static sandbox data
							const normalizedContent = h.content.replace(/\\n/g, "\n");
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
										user_id: user?.id || "guest",
										title: h.title,
										content: normalizedContent,
										visible_to_players: h.visibleToPlayers,
										category: h.category,
									});

								if (handoutError)
									console.error(
										"[SandboxInjector] Handout insert failed:",
										h.title,
										handoutError,
									);
								else handoutCount++;
							}
						}
					}
				}
			} catch (handoutErr) {
				console.error("[SandboxInjector] Handout section error:", handoutErr);
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
					title: "Module Import Complete ✦ The Shadow of the Regent",
					description: `${summary}. All content is now available in the Wiki, Handouts, and VTT tabs.`,
				});
			} else {
				toast({
					title: "Sandbox Already Imported",
					description:
						"All module content is already present. Check the Wiki, Handouts, and VTT tabs to view imported data.",
				});
			}

			// Invalidate queries with campaign-scoped keys to immediately reflect UI
			// Invalidate with campaign-scoped keys so useCampaignWiki / CampaignHandouts refetch
			queryClient.invalidateQueries({
				queryKey: ["campaign_wiki_articles", targetId],
			});
			queryClient.invalidateQueries({
				queryKey: ["vtt_journal_entries", targetId],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaign_tool_states", targetId],
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
