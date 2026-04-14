import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { massiveSandboxModule } from "@/data/compendium/ascendant-sandbox-module";
import { useToast } from "@/hooks/use-toast";
import { saveCampaignToolState } from "@/hooks/useToolState";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/authContext";
import {
	type CampaignWikiArticleRow,
	readLocalJournals,
	readLocalWikiArticles,
	saveLocalJournals,
	saveLocalWikiArticles,
	type VttJournalEntryRow,
} from "@/lib/guestStore";
import type { VTTScene, VTTTokenInstance } from "@/types/vtt";

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
						description:
							"Campaign database is not responsive or sync is delayed. Try again in a few moments.",
						variant: "destructive",
					});
					return;
				}
			}

			// 1. Inject Wiki Chapters (Lore)
			setInjectionState({
				isInjecting: true,
				progressString: `Generating Regional Wiki Lore (0/${massiveSandboxModule.chapters.length})...`,
			});

			if (isLocalMode()) {
				const existingWiki = readLocalWikiArticles(targetId);
				for (let i = 0; i < massiveSandboxModule.chapters.length; i++) {
					const chapter = massiveSandboxModule.chapters[i];
					if (!existingWiki.find((w) => w.title === chapter.title)) {
						existingWiki.push({
							id: crypto.randomUUID(),
							campaign_id: targetId,
							title: chapter.title,
							content: chapter.content,
							category: "lore",
							is_public: true,
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
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
			}

			// 2. Inject VTT Maps directly into campaign_tool_states (Supabase & Local via saveCampaignToolState)
			setInjectionState({
				isInjecting: true,
				progressString: `Constructing Sandbox VTT Maps (0/${massiveSandboxModule.scenes.length})...`,
			});

			const scenes: VTTScene[] = massiveSandboxModule.scenes.map((scene) => {
				const tokens: VTTTokenInstance[] = (scene.tokens || []).map((t) => ({
					id: crypto.randomUUID(),
					name: t.name,
					x: t.x * (scene.gridSize || 100), // Scale map grid correctly
					y: t.y * (scene.gridSize || 100),
					size: (t.size as any) || "medium",
					imageUrl: t.imageUrl,
					tokenType: (t.tokenType as any) || "npc",
					visible: !scene.fogOfWar,
					locked: false,
					layer: 0,
					rotation: 0,
					hp: t.hp,
					hp_current: t.hp,
					hp_max: t.maxHp || t.hp,
					maxHp: t.maxHp || t.hp,
					ac: t.ac || 10,
				}));

				return {
					id: crypto.randomUUID(),
					name: scene.name,
					width: 4000,
					height: 4000,
					backgroundImage: scene.backgroundImage,
					gridSize: scene.gridSize || 100,
					gridType: "square",
					tokens: tokens,
					drawings: [],
					annotations: [],
					walls: [],
					lights: [],
					fogOfWar: scene.fogOfWar,
				};
			});

			if (scenes.length > 0) {
				await saveCampaignToolState<{
					scenes: VTTScene[];
					currentSceneId: string | null;
				}>(targetId, user?.id || "guest", "vtt-scenes", {
					scenes,
					currentSceneId: scenes[0].id,
				});
				sceneCount = scenes.length;
			}

			// 3. Inject NPCs
			setInjectionState({
				isInjecting: true,
				progressString: `Sowing NPC Roster...`,
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
					}
				}
			}

			// 4. Inject Handouts
			setInjectionState({
				isInjecting: true,
				progressString: `Sowing Campaign Handouts...`,
			});

			if (
				massiveSandboxModule.handouts &&
				massiveSandboxModule.handouts.length > 0
			) {
				if (isLocalMode()) {
					const existingJournals = readLocalJournals(targetId);
					for (let i = 0; i < massiveSandboxModule.handouts.length; i++) {
						const h = massiveSandboxModule.handouts[i];
						if (!existingJournals.find((j) => j.title === h.title)) {
							existingJournals.push({
								id: crypto.randomUUID(),
								campaign_id: targetId,
								title: h.title,
								content: h.content,
								category: h.category,
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
									content: h.content,
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
						"All module content was already present. No new data was added. Go to the VTT to view the map.",
				});
			}

			// Invalidate queries with campaign-scoped keys to immediately reflect UI
			queryClient.invalidateQueries({ queryKey: ["campaign_wiki_articles"] });
			queryClient.invalidateQueries({ queryKey: ["vtt_journal_entries"] });
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
