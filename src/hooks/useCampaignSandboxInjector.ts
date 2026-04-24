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
	type CampaignEncounterEntryRow,
	type CampaignEncounterRow,
	type CampaignNoteRow,
	type CampaignSessionLogRow,
	type CampaignSessionRow,
	getLocalUserId,
	type LocalCharacterRow,
	readLocalCampaignNotes,
	readLocalEncounterEntries,
	readLocalEncounters,
	readLocalJournals,
	readLocalNpcCharacters,
	readLocalSessionLogs,
	readLocalSessions,
	readLocalWikiArticles,
	saveLocalCampaignNotes,
	saveLocalEncounterEntries,
	saveLocalEncounters,
	saveLocalJournals,
	saveLocalNpcCharacters,
	saveLocalSessionLogs,
	saveLocalSessions,
	saveLocalWikiArticles,
} from "@/lib/guestStore";
import type { VTTScene } from "@/types/vtt";

/**
 * "Local mode" here means "write to localStorage, not Supabase". It fires
 * in two situations:
 *   1. Supabase isn't configured at all (env vars missing).
 *   2. Supabase is configured but the user is a guest (not signed in).
 *
 * The second case is the important one — a signed-out Warden using
 * "Continue as Guest" should still get a fully populated campaign via the
 * localStorage path. Without this, the injector's cloud branch would try
 * to write to Supabase, fail the RLS pre-flight, and silently return.
 */
const isLocalModeFor = (user: { id?: string } | null | undefined): boolean =>
	!isSupabaseConfigured || !user;

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
		if (!targetId) return;
		// Local mode (guest or no-Supabase) is always allowed; cloud mode
		// requires an authenticated user for the Supabase writes. Capture
		// the flag once and expose it via a no-arg local helper so the
		// section branches below can keep using `isLocalMode()` without
		// threading the user arg through twelve callsites.
		const _localMode = isLocalModeFor(user);
		if (!_localMode && !user) return;
		const isLocalMode = () => _localMode;

		setInjectionState({
			isInjecting: true,
			progressString: "Starting Sandbox Injection...",
		});

		let wikiCount = 0;
		let sceneCount = 0;
		let npcCount = 0;
		let handoutCount = 0;
		let sessionCount = 0;
		let sessionLogCount = 0;
		let wardenNoteCount = 0;
		let npcCharacterCount = 0;
		let encounterCount = 0;
		let questCount = 0;
		let factionCount = 0;
		let lootCount = 0;
		let timelineCount = 0;
		let assetCount = 0;
		let audioCount = 0;

		/**
		 * Stable, non-null author/user id used for guest-mode writes. Cloud
		 * writes always use `user.id`. Kept as a local constant so all
		 * sections agree on the same guest identity.
		 */
		const wardenId = user?.id || getLocalUserId();
		const nowIso = () => new Date().toISOString();

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

			// 5. Inject Campaign Sessions (Day Zero + Sessions 1-5)
			//
			// Each SandboxSession becomes a `campaign_sessions` row, then each
			// `session.logs[]` entry becomes a `campaign_session_logs` row
			// scoped to that session. Idempotent by (campaign_id, title).
			try {
				setInjectionState({
					isInjecting: true,
					progressString: `Scaffolding Campaign Sessions (0/${massiveSandboxModule.sessions?.length ?? 0})...`,
				});

				const sessions = massiveSandboxModule.sessions ?? [];
				if (sessions.length > 0) {
					if (isLocalMode()) {
						const existingSessions = readLocalSessions(targetId);
						const existingLogs = readLocalSessionLogs(targetId);

						for (let i = 0; i < sessions.length; i++) {
							const s = sessions[i];
							let sessionRow = existingSessions.find(
								(row) => row.title === s.title,
							);
							if (!sessionRow) {
								sessionRow = {
									id: crypto.randomUUID(),
									campaign_id: targetId,
									title: s.title,
									description: s.description,
									status: s.status,
									// Stagger scheduled_for by session order so the Sessions
									// tab renders them in declared sequence even though the
									// list view sorts by scheduled_for desc.
									scheduled_for: new Date(
										Date.now() + s.order * 86_400_000,
									).toISOString(),
									location: null,
									created_by: wardenId,
									created_at: nowIso(),
									updated_at: nowIso(),
								} satisfies CampaignSessionRow;
								existingSessions.push(sessionRow);
								sessionCount++;
							}

							for (const log of s.logs) {
								if (
									existingLogs.some(
										(l) =>
											l.session_id === sessionRow?.id && l.title === log.title,
									)
								)
									continue;
								existingLogs.push({
									id: crypto.randomUUID(),
									campaign_id: targetId,
									session_id: sessionRow.id,
									author_id: wardenId,
									log_type: log.logType,
									title: log.title,
									content: log.content,
									metadata: { sceneRefs: s.sceneRefs, npcRefs: s.npcRefs },
									is_player_visible: log.isPlayerVisible,
									created_at: nowIso(),
									updated_at: nowIso(),
								} satisfies CampaignSessionLogRow);
								sessionLogCount++;
							}
						}

						if (sessionCount > 0) saveLocalSessions(targetId, existingSessions);
						if (sessionLogCount > 0)
							saveLocalSessionLogs(targetId, existingLogs);
					} else {
						for (let i = 0; i < sessions.length; i++) {
							const s = sessions[i];
							const { data: existing } = await supabase
								.from("campaign_sessions")
								.select("id")
								.eq("campaign_id", targetId)
								.eq("title", s.title)
								.maybeSingle();

							let sessionId = existing?.id;
							if (!sessionId) {
								const { data: inserted, error } = await supabase
									.from("campaign_sessions")
									.insert({
										campaign_id: targetId,
										title: s.title,
										description: s.description,
										status: s.status,
										scheduled_for: new Date(
											Date.now() + s.order * 86_400_000,
										).toISOString(),
										created_by: wardenId,
									})
									.select("id")
									.single();
								if (error) {
									console.error(
										"[SandboxInjector] Session insert failed:",
										s.title,
										error,
									);
									continue;
								}
								sessionId = inserted?.id;
								if (sessionId) sessionCount++;
							}

							if (!sessionId) continue;

							for (const log of s.logs) {
								const { data: existingLog } = await supabase
									.from("campaign_session_logs")
									.select("id")
									.eq("campaign_id", targetId)
									.eq("session_id", sessionId)
									.eq("title", log.title)
									.maybeSingle();

								if (!existingLog) {
									const { error: logErr } = await supabase
										.from("campaign_session_logs")
										.insert({
											campaign_id: targetId,
											session_id: sessionId,
											author_id: wardenId,
											log_type: log.logType,
											title: log.title,
											content: log.content,
											metadata: {
												sceneRefs: s.sceneRefs,
												npcRefs: s.npcRefs,
											},
											is_player_visible: log.isPlayerVisible,
										});
									if (logErr) {
										console.error(
											"[SandboxInjector] Session log insert failed:",
											log.title,
											logErr,
										);
									} else {
										sessionLogCount++;
									}
								}
							}
						}
					}
				}
			} catch (sessionErr) {
				console.error("[SandboxInjector] Session section error:", sessionErr);
			}

			// 6. Inject 14-Day District Timeline as session_logs (log_type=event)
			try {
				const timeline = massiveSandboxModule.timeline ?? [];
				if (timeline.length > 0) {
					setInjectionState({
						isInjecting: true,
						progressString: `Threading District Timeline (0/${timeline.length})...`,
					});

					if (isLocalMode()) {
						const existingLogs = readLocalSessionLogs(targetId);
						const existingSessions = readLocalSessions(targetId);
						const dayZero = existingSessions.find((s) =>
							s.title.startsWith("Session 0"),
						);
						for (const ev of timeline) {
							const title = `Day ${ev.day} — ${ev.title.replace(/^Day \d+ — /, "")}`;
							if (
								existingLogs.some(
									(l) => l.title === title && l.log_type === "event",
								)
							)
								continue;
							existingLogs.push({
								id: crypto.randomUUID(),
								campaign_id: targetId,
								session_id: dayZero?.id ?? null,
								author_id: wardenId,
								log_type: "event",
								title,
								content: [
									ev.description,
									ev.factionImpact
										? `\n**Faction impact:** ${ev.factionImpact}`
										: "",
									ev.linkedNpcName ? `\n**Key NPC:** ${ev.linkedNpcName}` : "",
									ev.linkedSceneName
										? `\n**Linked scene:** ${ev.linkedSceneName}`
										: "",
								]
									.filter(Boolean)
									.join(""),
								metadata: { day: ev.day, timeline: true },
								is_player_visible: false,
								created_at: nowIso(),
								updated_at: nowIso(),
							} satisfies CampaignSessionLogRow);
							timelineCount++;
						}
						if (timelineCount > 0) saveLocalSessionLogs(targetId, existingLogs);
					} else {
						// Anchor timeline events to Day Zero session if one exists, else null
						const { data: dayZero } = await supabase
							.from("campaign_sessions")
							.select("id")
							.eq("campaign_id", targetId)
							.ilike("title", "Session 0%")
							.maybeSingle();

						for (const ev of timeline) {
							const title = `Day ${ev.day} — ${ev.title.replace(/^Day \d+ — /, "")}`;
							const { data: existing } = await supabase
								.from("campaign_session_logs")
								.select("id")
								.eq("campaign_id", targetId)
								.eq("title", title)
								.eq("log_type", "event")
								.maybeSingle();
							if (existing) continue;
							const { error } = await supabase
								.from("campaign_session_logs")
								.insert({
									campaign_id: targetId,
									session_id: dayZero?.id ?? null,
									author_id: wardenId,
									log_type: "event",
									title,
									content: [
										ev.description,
										ev.factionImpact
											? `\n**Faction impact:** ${ev.factionImpact}`
											: "",
										ev.linkedNpcName
											? `\n**Key NPC:** ${ev.linkedNpcName}`
											: "",
										ev.linkedSceneName
											? `\n**Linked scene:** ${ev.linkedSceneName}`
											: "",
									]
										.filter(Boolean)
										.join(""),
									metadata: { day: ev.day, timeline: true },
									is_player_visible: false,
								});
							if (error) {
								console.error(
									"[SandboxInjector] Timeline insert failed:",
									title,
									error,
								);
							} else {
								timelineCount++;
							}
						}
					}
				}
			} catch (timelineErr) {
				console.error("[SandboxInjector] Timeline section error:", timelineErr);
			}

			// 7. Inject Warden-only Notes
			try {
				const notes = massiveSandboxModule.wardenNotes ?? [];
				if (notes.length > 0) {
					setInjectionState({
						isInjecting: true,
						progressString: `Sealing Warden Notes (0/${notes.length})...`,
					});

					if (isLocalMode()) {
						const existing = readLocalCampaignNotes(targetId);
						for (const note of notes) {
							if (existing.some((n) => n.title === note.title)) continue;
							existing.push({
								id: crypto.randomUUID(),
								campaign_id: targetId,
								user_id: wardenId,
								title: note.title,
								content: note.content,
								category: note.category,
								is_shared: false,
								created_at: nowIso(),
								updated_at: nowIso(),
							} satisfies CampaignNoteRow);
							wardenNoteCount++;
						}
						if (wardenNoteCount > 0) saveLocalCampaignNotes(targetId, existing);
					} else {
						for (const note of notes) {
							const { data: existing } = await supabase
								.from("campaign_notes")
								.select("id")
								.eq("campaign_id", targetId)
								.eq("title", note.title)
								.maybeSingle();
							if (existing) continue;
							const { error } = await supabase.from("campaign_notes").insert({
								campaign_id: targetId,
								user_id: wardenId,
								title: note.title,
								content: note.content,
								category: note.category,
								is_shared: false,
							});
							if (error) {
								console.error(
									"[SandboxInjector] Note insert failed:",
									note.title,
									error,
								);
							} else {
								wardenNoteCount++;
							}
						}
					}
				}
			} catch (noteErr) {
				console.error("[SandboxInjector] Warden note section error:", noteErr);
			}

			// 8. Inject NPC Characters (Warden-claimed, hidden from players)
			//
			// Each SandboxNPC becomes a `characters` row owned by the Warden with
			// a `[SANDBOX_NPC]` marker prefix in `notes`. The Characters tab
			// filter uses that marker to suppress these rows in player view
			// until a proper `character_type` column migration lands.
			try {
				const npcs = massiveSandboxModule.npcs ?? [];
				if (npcs.length > 0) {
					setInjectionState({
						isInjecting: true,
						progressString: `Binding NPC Roster to Warden (0/${npcs.length})...`,
					});

					const NPC_MARKER = "[SANDBOX_NPC]";

					if (isLocalMode()) {
						const existing = readLocalNpcCharacters(targetId);
						for (const npc of npcs) {
							if (existing.some((c) => c.name === npc.name)) continue;
							const now = nowIso();
							existing.push({
								id: crypto.randomUUID(),
								user_id: wardenId,
								name: npc.name,
								level: npc.level,
								job: npc.job,
								hp_current: npc.hp,
								hp_max: npc.hp,
								hp_temp: 0,
								armor_class: npc.ac,
								initiative: 0,
								proficiency_bonus: Math.floor((npc.level - 1) / 4) + 2,
								speed: 30,
								experience: 0,
								rift_favor_current: 0,
								rift_favor_max: 0,
								rift_favor_die: 0,
								shadow_energy_current: 0,
								shadow_energy_max: 0,
								hit_dice_current: npc.level,
								hit_dice_max: npc.level,
								hit_dice_size: 8,
								death_save_failures: 0,
								death_save_successes: 0,
								exhaustion_level: 0,
								languages: [],
								notes: [
									NPC_MARKER,
									`Faction: ${npc.faction}`,
									`Location: ${npc.location}`,
									"",
									"**Personality**",
									npc.personality,
									"",
									"**Motivation**",
									npc.motivation,
									"",
									"**Key Abilities**",
									...npc.keyAbilities.map((a) => `- ${a}`),
								].join("\n"),
								backstory: npc.backstory,
								background: npc.title,
								appearance: npc.description,
								stable: true,
								active_sovereign_id: null,
								agi: null,
								armor_proficiencies: null,
								base_class: npc.job,
								condition_immunities: null,
								conditions: null,
								gemini_state: null,
								immunities: null,
								int: null,
								monarch_overlays: null,
								path: null,
								portrait_url: `/generated/compendium/anomalies/${npc.id.replace("npc-", "")}.webp`,
								pre: null,
								regent_overlays: null,
								resistances: null,
								saving_throw_proficiencies: null,
								sense: null,
								senses: null,
								share_token: null,
								skill_expertise: null,
								skill_proficiencies: null,
								sovereign_id: null,
								str: null,
								tool_proficiencies: null,
								vit: null,
								vulnerabilities: null,
								weapon_proficiencies: null,
								created_at: now,
								updated_at: now,
							} as LocalCharacterRow);
							npcCharacterCount++;
						}
						if (npcCharacterCount > 0)
							saveLocalNpcCharacters(targetId, existing);
					} else {
						for (const npc of npcs) {
							const { data: existing } = await supabase
								.from("characters")
								.select("id")
								.eq("user_id", wardenId)
								.eq("name", npc.name)
								.maybeSingle();
							if (existing) continue;

							const { data: character, error } = await supabase
								.from("characters")
								.insert({
									user_id: wardenId,
									name: npc.name,
									level: npc.level,
									job: npc.job,
									base_class: npc.job,
									hp_current: npc.hp,
									hp_max: npc.hp,
									armor_class: npc.ac,
									proficiency_bonus: Math.floor((npc.level - 1) / 4) + 2,
									hit_dice_current: npc.level,
									hit_dice_max: npc.level,
									hit_dice_size: 8,
									background: npc.title,
									backstory: npc.backstory,
									appearance: npc.description,
									notes: [
										NPC_MARKER,
										`Faction: ${npc.faction}`,
										`Location: ${npc.location}`,
										"",
										"**Personality**",
										npc.personality,
										"",
										"**Motivation**",
										npc.motivation,
										"",
										"**Key Abilities**",
										...npc.keyAbilities.map((a) => `- ${a}`),
									].join("\n"),
								})
								.select("id")
								.single();

							if (error) {
								console.error(
									"[SandboxInjector] NPC character insert failed:",
									npc.name,
									error,
								);
								continue;
							}

							if (character?.id) {
								// Share back to campaign so it appears under the
								// Characters tab. shared_by=warden ensures the new
								// Warden-NPC filter in `CampaignCharacters` finds it.
								await supabase.from("campaign_character_shares").insert({
									campaign_id: targetId,
									character_id: character.id,
									shared_by: wardenId,
									permissions: "edit",
								});
								npcCharacterCount++;
							}
						}
					}
				}
			} catch (npcCharErr) {
				console.error(
					"[SandboxInjector] NPC character section error:",
					npcCharErr,
				);
			}

			// 9. Inject Encounters + Entries
			try {
				const encounters = massiveSandboxModule.encounters ?? [];
				if (encounters.length > 0) {
					setInjectionState({
						isInjecting: true,
						progressString: `Prepping Encounter Decks (0/${encounters.length})...`,
					});

					if (isLocalMode()) {
						const existingEnc = readLocalEncounters(targetId);
						const existingEntries = readLocalEncounterEntries(targetId);
						for (const enc of encounters) {
							let encRow = existingEnc.find((e) => e.name === enc.name);
							if (!encRow) {
								encRow = {
									id: crypto.randomUUID(),
									campaign_id: targetId,
									name: enc.name,
									description: enc.description,
									difficulty: {
										tier: enc.difficulty,
										hazards: enc.hazards,
										sceneRef: enc.sceneRef,
									},
									loot_summary: { rewards: enc.rewards },
									created_by: wardenId,
									updated_by: wardenId,
									created_at: nowIso(),
									updated_at: nowIso(),
								} satisfies CampaignEncounterRow;
								existingEnc.push(encRow);
								encounterCount++;
							}

							for (const m of enc.monsters) {
								const key = `${encRow.id}::${m.name}`;
								if (
									existingEntries.some(
										(e) => `${e.encounter_id}::${e.name}` === key,
									)
								)
									continue;
								existingEntries.push({
									id: crypto.randomUUID(),
									campaign_id: targetId,
									encounter_id: encRow.id,
									entry_kind: "monster",
									monster_id: null,
									name: m.name,
									quantity: m.quantity,
									source: { sandbox: true, notes: m.notes ?? null },
									stats: {
										hp: m.hp,
										ac: m.ac,
										initiative: m.initiative,
									},
									created_at: nowIso(),
								} satisfies CampaignEncounterEntryRow);
							}
						}
						if (encounterCount > 0) {
							saveLocalEncounters(targetId, existingEnc);
							saveLocalEncounterEntries(targetId, existingEntries);
						}
					} else {
						for (const enc of encounters) {
							const { data: existing } = await supabase
								.from("campaign_encounters")
								.select("id")
								.eq("campaign_id", targetId)
								.eq("name", enc.name)
								.maybeSingle();

							let encId = existing?.id;
							if (!encId) {
								const { data: inserted, error } = await supabase
									.from("campaign_encounters")
									.insert({
										campaign_id: targetId,
										name: enc.name,
										description: enc.description,
										difficulty: {
											tier: enc.difficulty,
											hazards: enc.hazards,
											sceneRef: enc.sceneRef,
										},
										loot_summary: { rewards: enc.rewards },
										created_by: wardenId,
										updated_by: wardenId,
									})
									.select("id")
									.single();
								if (error) {
									console.error(
										"[SandboxInjector] Encounter insert failed:",
										enc.name,
										error,
									);
									continue;
								}
								encId = inserted?.id;
								if (encId) encounterCount++;
							}
							if (!encId) continue;

							for (const m of enc.monsters) {
								const { data: existingEntry } = await supabase
									.from("campaign_encounter_entries")
									.select("id")
									.eq("encounter_id", encId)
									.eq("name", m.name)
									.maybeSingle();
								if (existingEntry) continue;
								const { error: entryErr } = await supabase
									.from("campaign_encounter_entries")
									.insert({
										campaign_id: targetId,
										encounter_id: encId,
										entry_kind: "monster",
										name: m.name,
										quantity: m.quantity,
										source: { sandbox: true, notes: m.notes ?? null },
										stats: { hp: m.hp, ac: m.ac, initiative: m.initiative },
									});
								if (entryErr) {
									console.error(
										"[SandboxInjector] Encounter entry insert failed:",
										m.name,
										entryErr,
									);
								}
							}
						}
					}
				}
			} catch (encErr) {
				console.error("[SandboxInjector] Encounter section error:", encErr);
			}

			// 10. Inject Quests, Factions, Loot Tables as wiki sub-categories
			//
			// These ride on the existing `campaign_wiki_articles` table with
			// distinct `category` values (quest / faction / loot) so no DB
			// migration is needed. A future pass can promote them to dedicated
			// tables without re-authoring the content.
			const injectWikiCollection = async <
				T extends { id?: string; title?: string; name?: string },
			>(
				items: T[],
				category: "quest" | "faction" | "loot",
				renderContent: (item: T) => string,
				progressLabel: string,
			): Promise<number> => {
				let count = 0;
				if (!items?.length) return 0;
				setInjectionState({
					isInjecting: true,
					progressString: `${progressLabel} (0/${items.length})...`,
				});

				if (isLocalMode()) {
					const existing = readLocalWikiArticles(targetId);
					for (const item of items) {
						const title =
							(item as { title?: string }).title ??
							(item as { name?: string }).name ??
							"Untitled";
						if (existing.some((w) => w.title === title)) continue;
						existing.push({
							id: crypto.randomUUID(),
							campaign_id: targetId,
							title,
							content: renderContent(item),
							category,
							is_public: true,
							created_at: nowIso(),
							updated_at: nowIso(),
							created_by: wardenId,
						});
						count++;
					}
					if (count > 0) saveLocalWikiArticles(targetId, existing);
				} else {
					for (const item of items) {
						const title =
							(item as { title?: string }).title ??
							(item as { name?: string }).name ??
							"Untitled";
						const { data: existing } = await supabase
							.from("campaign_wiki_articles")
							.select("id")
							.eq("campaign_id", targetId)
							.eq("title", title)
							.maybeSingle();
						if (existing) continue;
						const { error } = await supabase
							.from("campaign_wiki_articles")
							.insert({
								campaign_id: targetId,
								title,
								content: renderContent(item),
								category,
								is_public: true,
							});
						if (error) {
							console.error(
								"[SandboxInjector] wiki-collection insert failed:",
								title,
								error,
							);
						} else {
							count++;
						}
					}
				}
				return count;
			};

			try {
				questCount = await injectWikiCollection(
					massiveSandboxModule.quests ?? [],
					"quest",
					(q) =>
						[
							`**Rank:** ${q.rank}`,
							"",
							q.summary,
							"",
							"### Objectives",
							...q.objectives.map((o) => `- ${o}`),
							"",
							"### Completion Triggers",
							...q.completionTriggers.map((t) => `- ${t}`),
							"",
							"### Rewards",
							q.rewardNotes,
							q.linkedFactionId ? `\n**Faction:** ${q.linkedFactionId}` : "",
							q.linkedNpcName ? `**Key NPC:** ${q.linkedNpcName}` : "",
						].join("\n"),
					"Logging Quest Objectives",
				);
			} catch (qErr) {
				console.error("[SandboxInjector] Quest section error:", qErr);
			}

			try {
				factionCount = await injectWikiCollection(
					massiveSandboxModule.factions ?? [],
					"faction",
					(f) =>
						[
							`**${f.name}** — _${f.tagline}_`,
							`Emblem: ${f.emblem}`,
							"",
							f.description,
							"",
							`**Starting Reputation:** ${f.startingReputation}`,
							"",
							"### Reputation Tiers",
							...f.reputationThresholds.map(
								(r) => `- **${r.threshold} (${r.tier}):** ${r.unlocks}`,
							),
							"",
							"### Joining Benefits",
							...f.joiningBenefits.map((b) => `- ${b}`),
							f.enmities.length
								? `\n**Enemies:** ${f.enmities.join(", ")}`
								: "",
						].join("\n"),
					"Compiling Faction Dossiers",
				);
			} catch (fErr) {
				console.error("[SandboxInjector] Faction section error:", fErr);
			}

			try {
				lootCount = await injectWikiCollection(
					massiveSandboxModule.loot ?? [],
					"loot",
					(t) =>
						[
							`**Rank:** ${t.rank}`,
							"",
							t.description,
							"",
							"### Drop Table",
							...t.entries.map(
								(e) =>
									`- **${e.name}** (${e.rarity}, w${e.weight}): ${e.description}`,
							),
						].join("\n"),
					"Stocking Loot Tables",
				);
			} catch (lErr) {
				console.error("[SandboxInjector] Loot section error:", lErr);
			}

			// 11. Inject VTT custom assets — pin the 20 sandbox maps in the
			// campaign's vtt_assets so they surface in a "Module Maps"
			// section of the asset drawer.
			try {
				const scenes = massiveSandboxModule.scenes ?? [];
				if (scenes.length > 0) {
					const VTT_ASSETS_KEY = "vtt_assets";
					const assets = scenes
						.filter((s) => s.backgroundImage)
						.map((s) => ({
							id: `sandbox-map-${s.id}`,
							name: s.name,
							type: "map" as const,
							imageUrl: s.backgroundImage,
							thumbnailUrl: s.backgroundImage,
							campaignId: targetId,
							isCustom: false,
							uploadedBy: wardenId,
							uploadedAt: nowIso(),
							source: "sandbox",
						}));
					if (assets.length > 0) {
						if (isLocalMode()) {
							writeLocalToolState(`vtt-assets-${targetId}`, assets);
							assetCount = assets.length;
						} else {
							await saveCampaignToolState(
								targetId,
								wardenId,
								VTT_ASSETS_KEY,
								assets,
							);
							writeLocalToolState(`vtt-assets-${targetId}`, assets);
							assetCount = assets.length;
						}
					}
				}
			} catch (assetErr) {
				console.error("[SandboxInjector] Asset section error:", assetErr);
			}

			// 12. Inject VTT Audio Tracks — the sandbox defines audioTracks[]
			// per scene; previously dropped. Now they surface in the Audio
			// drawer once the warden opens a session.
			//
			// Guest mode: store per-campaign under a localStorage key so the
			// Audio drawer can hydrate when no real session_id exists.
			// Cloud: skipped here because vtt_audio_tracks requires a valid
			// active_sessions FK; the Warden can promote them once a live
			// session starts (follow-up item).
			try {
				const scenes = massiveSandboxModule.scenes ?? [];
				const audioRows: {
					id: string;
					scene_id?: string;
					name: string;
					url: string;
					type: "music" | "ambient" | "sfx";
				}[] = [];
				for (const s of scenes) {
					for (const track of s.audioTracks ?? []) {
						audioRows.push({
							id: crypto.randomUUID(),
							scene_id: s.id,
							name: track.name,
							url: track.url,
							type: track.name.toLowerCase().includes("music")
								? "music"
								: "ambient",
						});
					}
				}
				if (audioRows.length > 0) {
					writeLocalToolState(`vtt-audio-${targetId}`, audioRows);
					audioCount = audioRows.length;
				}
			} catch (audioErr) {
				console.error("[SandboxInjector] Audio section error:", audioErr);
			}

			const summary = [
				wikiCount > 0 ? `${wikiCount} wiki chapters` : null,
				sceneCount > 0 ? `${sceneCount} VTT maps` : null,
				npcCount > 0 ? `${npcCount} NPC wiki entries` : null,
				handoutCount > 0 ? `${handoutCount} handouts` : null,
				sessionCount > 0 ? `${sessionCount} sessions` : null,
				sessionLogCount > 0 ? `${sessionLogCount} session logs` : null,
				wardenNoteCount > 0 ? `${wardenNoteCount} warden notes` : null,
				npcCharacterCount > 0
					? `${npcCharacterCount} NPC character sheets`
					: null,
				encounterCount > 0 ? `${encounterCount} encounters` : null,
				questCount > 0 ? `${questCount} quests` : null,
				factionCount > 0 ? `${factionCount} factions` : null,
				lootCount > 0 ? `${lootCount} loot tables` : null,
				timelineCount > 0 ? `${timelineCount} timeline events` : null,
				assetCount > 0 ? `${assetCount} pinned maps` : null,
				audioCount > 0 ? `${audioCount} audio tracks` : null,
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

			// Invalidate queries with campaign-scoped keys so every Campaign
			// Management tab refetches immediately post-import: Wiki, Handouts,
			// Notes, Sessions + Session Logs, Encounters, Characters, and VTT
			// tool-state (scenes + assets).
			queryClient.invalidateQueries({
				queryKey: ["campaign_wiki_articles", targetId],
			});
			queryClient.invalidateQueries({
				queryKey: ["vtt_journal_entries", targetId],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaign_tool_states", targetId],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaigns", "sessions", targetId],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaigns", "session-logs", targetId],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaigns", targetId, "notes"],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaigns", targetId, "encounters"],
			});
			queryClient.invalidateQueries({
				queryKey: ["campaigns", targetId, "shared-characters"],
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
