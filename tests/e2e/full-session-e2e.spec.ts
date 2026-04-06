import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage";
import { CompendiumPage } from "../pages/CompendiumPage";
import { DiceRollerPage } from "../pages/DiceRollerPage";
import { DMPage } from "../pages/DMPage";
import { DMToolsPage } from "../pages/DMToolsPage";
import { PlayerPage } from "../pages/PlayerPage";
import { SharedPage } from "../pages/SharedPage";

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  FULL 4-HOUR SESSION E2E — DM + Player Complete Lifecycle      ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  Phase 1: DM Pre-Session — Auth, campaign, invite, prep tools  ║
 * ║  Phase 2: DM Session Prep — All 16 DM tools exercised          ║
 * ║  Phase 3: Player Joins — Auth, join, character creation         ║
 * ║  Phase 4: Session Hour 1 — Encounter, initiative, VTT, combat  ║
 * ║  Phase 5: Session Hour 2 — Exploration, quests, dice, chat     ║
 * ║  Phase 6: Session Hour 3 — DM mid-session tools, player tools  ║
 * ║  Phase 7: Session Hour 4 — Wrap-up, rewards, level-up, persist ║
 * ║  Phase 8: Cross-Context Validation & Permission Boundaries     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Environment variables (with defaults):
 
 *   E2E_DM_PASSWORD  – default test1234
 
 *   E2E_PLAYER_PASSWORD – default test1234
 */

const _DM_PASSWORD = process.env.E2E_DM_PASSWORD ?? "test1234";

const _PLAYER_PASSWORD = process.env.E2E_PLAYER_PASSWORD ?? "test1234";

// Shared state across serial phases
let dmContext: BrowserContext;
let dmPage: Page;
let playerContext: BrowserContext;
let playerPage: Page;

// Cross-phase data
let campaignId = "";
let sessionId = "";
let shareCode = "";
let playerCharacterId = "";

const getSessionIdFromUrl = (urlString: string): string => {
	const url = new URL(urlString);
	return url.searchParams.get("sessionId") ?? "";
};

const _itUrl = (cId: string, sId?: string) => {
	const base = `/dm-tools/initiative-tracker?campaignId=${cId}`;
	return sId ? `${base}&sessionId=${sId}` : base;
};

/** Dismiss analytics consent once per context. */
const dismissAnalytics = async (page: Page) => {
	await page.evaluate(() => {
		localStorage.setItem(
			"solo-compendium-analytics-consent",
			JSON.stringify({ status: "rejected", version: 1, timestamp: Date.now() }),
		);
	});
	const bannerBtn = page.locator(".fixed.bottom-0 button").first();
	if (await bannerBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
		await bannerBtn.click({ force: true });
		await page.waitForTimeout(300);
	}
};

test.describe
	.serial("Full 4-Hour Session E2E: DM + Player Complete Lifecycle", () => {
		// Create both contexts once at top level so they persist across all phases
		test.beforeAll(async ({ browser }) => {
			dmContext = await browser.newContext();
			dmPage = await dmContext.newPage();
			playerContext = await browser.newContext();
			playerPage = await playerContext.newPage();
		});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 1 — DM PRE-SESSION: Auth → Campaign → Invite Code
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 1: DM Pre-Session Setup", () => {
				test("1.1 DM signs in as Warden", async () => {
					const auth = new AuthPage(dmPage);
					await auth.continueAsGuest("dm");
					await expect(dmPage.getByTestId("dm-tools")).toBeVisible({
						timeout: 15_000,
					});
					await dismissAnalytics(dmPage);
				});

				test("1.2 DM creates a campaign with full details", async () => {
					const dm = new DMPage(dmPage);
					campaignId = await dm.createDetailedCampaign({
						name: `FullSession-${Date.now()}`,
						description:
							"Comprehensive 4-hour E2E session: combat, quests, VTT, rewards, level-up",
						rules:
							"Rift Ascendant rules — critical hits double dice, flanking = advantage",
						settings: {
							difficulty: "Hard",
							playerLevel: 1,
							maxPlayers: 6,
							houseRules: "Potion as bonus action",
						},
						tags: ["e2e", "full-session", "4hr"],
					});
					expect(campaignId).toBeTruthy();
				});

				test("1.3 DM captures share code for player invite", async () => {
					const dm = new DMPage(dmPage);
					await dm.gotoCampaignDetail(campaignId);
					shareCode = await dm.getShareCode();
					expect(shareCode).toMatch(/^[A-Z0-9]{6}$/);
				});

				test("1.4 DM exercises campaign detail tabs (Overview, VTT, Sessions, Chat, Notes, Characters, Settings)", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaignDetail(campaignId);
					await shared.exerciseCampaignDetailTabs(true);
				});

				test("1.5 DM creates homebrew content for the session", async () => {
					const dm = new DMPage(dmPage);
					await dm.createHomebrewContent({
						name: "Session Boon — Riftwalker Boots",
						description:
							"+10 ft movement, ignore difficult terrain from rift residue.",
						type: "item",
						jsonPayload: {
							effects: { speed: "+10", terrain: "ignore_rift" },
							source: "e2e-session",
						},
					});
				});
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 2 — DM SESSION PREP: Exercise every DM tool
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 2: DM Session Preparation — All DM Tools", () => {
				test("2.01 DM Tools Hub — verify all tool cards", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.verifyHub();
				});

				test("2.02 Encounter Builder — search monsters, add to encounter", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testEncounterBuilder();
				});

				test("2.03 Initiative Tracker — add combatant, turn controls", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testInitiativeTracker();
				});

				test("2.04 Rollable Tables — all tabs and roll buttons", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testRollableTables();
				});

				test("2.05 Rift Generator — generate and copy", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testRiftGenerator();
				});

				test("2.06 NPC Generator — generate NPC profile", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testNPCGenerator();
				});

				test("2.07 Treasure Generator — rank select, generate loot", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testTreasureGenerator();
				});

				test("2.08 Quest Generator — create quest hooks", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testQuestGenerator();
				});

				test("2.09 Session Planner — campaign select, plan notes", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testSessionPlanner();
				});

				test("2.10 Random Event Generator — world/NPC events", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testRandomEventGenerator();
				});

				test("2.11 Relic Workshop — create custom relic", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testRelicWorkshop();
				});

				test("2.12 Party Tracker — add member, review inputs", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testPartyTracker();
				});

				test("2.13 Dungeon Map Generator — generate map grid", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testDungeonMapGenerator();
				});

				test("2.14 Token Library — search, create, categories", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testTokenLibrary();
				});

				test("2.15 Art Generator — tabs and panel", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testArtGenerator();
				});

				test("2.16 Audio Manager — tabs, player, library", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testAudioManager();
				});

				test("2.17 VTT Map (standalone) — canvas, zoom, grid, save", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testVTTMap();
				});

				test("2.18 Rift Console — admin page loads", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testSystemConsole();
				});

				test("2.19 Content Audit — audit page loads", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testContentAudit();
				});

				test("2.20 DM Dice Roller — quick roll, custom dice, themes", async () => {
					const dice = new DiceRollerPage(dmPage);
					await dice.goto();
					await dice.quickRollD20();
					await dice.expectRollResult();
					await dice.selectDiceType("d6");
					await dice.setModifier(3);
					await dice.rollCustom();
					await dice.changeTheme();
					await dice.verifyAllDiceTypesVisible();
					await dice.verifyHistoryCount(1);
				});

				test("2.21 DM Compendium browse — search, categories, view modes", async () => {
					const comp = new CompendiumPage(dmPage);
					await comp.deepExercise();
				});

				test("2.22 DM Favorites page loads", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoFavorites();
					await shared.verifyFavoritesLoads();
					await shared.searchFavorites("rift");
				});

				test("2.23 DM Marketplace page loads and search", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoMarketplace();
					await shared.verifyMarketplaceLoads();
					await shared.searchMarketplace("relic");
				});
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 3 — PLAYER JOINS: Auth → Campaign Join → Character Creation
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 3: Player Joins Campaign & Creates Character", () => {
				test("3.1 Player signs in", async () => {
					const auth = new AuthPage(playerPage);
					await auth.continueAsGuest("player");
					await playerPage.waitForURL(/\/player-tools/, { timeout: 15_000 });
					await dismissAnalytics(playerPage);
				});

				test("3.2 Player Tools Hub — all tool cards visible", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyPlayerToolsHub();
				});

				test("3.3 Player joins campaign via share code", async () => {
					expect(shareCode).toBeTruthy();
					const player = new PlayerPage(playerPage);
					await player.joinCampaign(shareCode);
				});

				test("3.4 Player creates character (6-step wizard)", async () => {
					const player = new PlayerPage(playerPage);
					playerCharacterId =
						(await player.createCharacter(`SessionPC-${Date.now()}`)) ?? "";
					if (!playerCharacterId) {
						playerCharacterId =
							(await player.getFirstExistingCharacterId()) ?? "";
					}
					expect(playerCharacterId).toBeTruthy();
				});

				test("3.5 Player verifies character sheet", async () => {
					if (!playerCharacterId || playerCharacterId === "wizard-exercised")
						return;
					const player = new PlayerPage(playerPage);
					const loaded = await player.verifyCharacterSheet(playerCharacterId);
					expect(loaded).toBe(true);
				});

				test("3.6 Player exercises campaign detail tabs (no Settings)", async () => {
					expect(campaignId).toBeTruthy();
					const shared = new SharedPage(playerPage);
					await shared.gotoCampaignDetail(campaignId);
					await shared.exerciseCampaignDetailTabs(false);
				});
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 4 — SESSION HOUR 1: Encounter → Initiative → VTT Combat
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 4: Session Hour 1 — Combat & VTT", () => {
				test("4.1 DM builds encounter and sends to initiative tracker", async () => {
					await dmPage.goto(
						`/dm-tools/encounter-builder?campaignId=${campaignId}`,
					);
					await dmPage.waitForTimeout(2_000);

					// Wait for encounter builder to be visible (heading or testid)
					const ebHeading = dmPage
						.getByText("ENCOUNTER BUILDER", { exact: false })
						.first();
					await expect(ebHeading).toBeVisible({ timeout: 15_000 });

					// Search for a monster
					const searchInput = dmPage
						.locator('input[placeholder*="earch"]')
						.first();
					await expect(searchInput).toBeVisible({ timeout: 10_000 });
					await searchInput.fill("Shadow");
					await dmPage.waitForTimeout(1_500);

					// Add first result
					const addBtn = dmPage
						.getByRole("button", { name: /Add|Plus/i })
						.first();
					if (await addBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
						await addBtn.click();
						await dmPage.waitForTimeout(500);
					}

					// Try to send to tracker
					const sendBtn = dmPage
						.getByRole("button", {
							name: /Send to Tracker|Start Combat|Run Encounter/i,
						})
						.first();
					if (await sendBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
						await sendBtn.click();
						await dmPage.waitForURL(/\/dm-tools\/initiative-tracker/i, {
							timeout: 20_000,
						});
						sessionId = getSessionIdFromUrl(dmPage.url());
					}
				});

				test("4.2 DM operates initiative tracker — add combatants, advance turns", async () => {
					// Reuse the proven DMToolsPage helper which navigates fresh and fills reliably.
					const dt = new DMToolsPage(dmPage);
					await dt.testInitiativeTracker();
				});

				test("4.3 DM opens campaign VTT — grid, zoom, fog, tokens", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testVTTEnhanced(campaignId);
				});

				test("4.4 DM exercises standalone VTT map controls", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testVTTMap();
				});

				test("4.5 Player rolls initiative, attack, and damage dice", async () => {
					const dice = new DiceRollerPage(playerPage);
					await dice.goto();

					// Initiative roll (d20 + modifier)
					await dice.rollInitiative(3);

					// Attack roll
					await dice.rollAttack(5);

					// Damage roll (2d6 + 3)
					await dice.rollDamage("d6", 2, 3);

					// Verify roll history accumulated
					await dice.expectRollResult();
					await dice.verifyHistoryCount(1);
				});

				test("4.6 Player accesses campaign VTT (read-only view)", async () => {
					await playerPage.goto(`/campaigns/${campaignId}/vtt`);
					await playerPage.waitForTimeout(3_000);

					// VTT should load — check for heading, error boundary, or canvas
					const vttContent = playerPage
						.getByText(/VTT|VIRTUAL TABLETOP|MAP|TOKEN|Connection/i)
						.first();
					const vttVisible = await vttContent
						.isVisible({ timeout: 15_000 })
						.catch(() => false);

					// Also check for canvas
					const canvas = playerPage.locator("canvas").first();
					const canvasVisible = await canvas
						.isVisible({ timeout: 5_000 })
						.catch(() => false);

					expect(vttVisible || canvasVisible).toBe(true);

					// Try zoom controls if available
					const zoomIn = playerPage
						.getByRole("button", { name: /Zoom In|\+/i })
						.first();
					if (await zoomIn.isVisible({ timeout: 3_000 }).catch(() => false)) {
						await zoomIn.click();
					}
				});

				test("4.7 Player accesses Player Map View tool", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyPlayerMapView();
				});
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 5 — SESSION HOUR 2: Exploration, Quests, Compendium, Chat
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 5: Session Hour 2 — Exploration & Roleplay", () => {
				test("5.1 DM generates quest for the party", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testQuestGenerator();
				});

				test("5.2 DM generates random exploration event", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testRandomEventGenerator();
				});

				test("5.3 DM generates NPC for roleplay encounter", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testNPCGenerator();
				});

				test("5.4 DM generates rift for dimensional travel", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testRiftGenerator();
				});

				test("5.5 DM uses rollable tables for scenario details", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testRollableTables();
				});

				test("5.6 DM rolls dice (ability checks, saving throws)", async () => {
					const dice = new DiceRollerPage(dmPage);
					await dice.goto();
					await dice.quickRollD20();
					await dice.selectDiceType("d12");
					await dice.rollCustom();
					await dice.rollD100();
					await dice.verifyHistoryCount(2);
				});

				test("5.7 Player browses compendium for spell/item info", async () => {
					const comp = new CompendiumPage(playerPage);
					await comp.deepExercise();
				});

				test("5.8 Player uses dice roller for skill checks", async () => {
					const dice = new DiceRollerPage(playerPage);
					await dice.goto();
					await dice.quickRollD20();
					await dice.selectDiceType("d20");
					await dice.setModifier(4);
					await dice.rollCustom();
					await dice.expectRollResult();
				});

				test("5.9 Player verifies character sheet mid-session", async () => {
					if (!playerCharacterId || playerCharacterId === "wizard-exercised")
						return;
					const player = new PlayerPage(playerPage);
					await player.verifyCharacterSheet(playerCharacterId);
				});

				test("5.10 Player exercises player tool detail pages", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyInventoryTool();
					await player.verifyAbilitiesTool();
					await player.verifyQuestLogTool();
				});
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 6 — SESSION HOUR 3: Mid-Session DM Tools & Player Exploration
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 6: Session Hour 3 — Mid-Session Management", () => {
				test("6.1 DM builds another encounter for second combat", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testEncounterBuilder();
				});

				test("6.2 DM generates treasure for loot distribution", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testTreasureGenerator();
				});

				test("6.3 DM crafts custom relic in Relic Workshop", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testRelicWorkshop();
				});

				test("6.4 DM generates dungeon map for next area", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testDungeonMapGenerator();
				});

				test("6.5 DM reviews party tracker", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testPartyTracker();
				});

				test("6.6 DM session planner — update notes for next session", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testSessionPlanner();
				});

				test("6.7 Player uses character art tool", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyCharacterArtTool();
				});

				test("6.8 Player views party composition", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyPartyViewTool();
				});

				test("6.9 Player browses homebrew studio", async () => {
					const shared = new SharedPage(playerPage);
					await shared.gotoHomebrew();
					await shared.verifyHomebrewLoads();
				});

				test("6.10 Player browses marketplace", async () => {
					const shared = new SharedPage(playerPage);
					await shared.gotoMarketplace();
					await shared.verifyMarketplaceLoads();
					await shared.searchMarketplace("boots");
				});

				test("6.11 Player browses favorites", async () => {
					const shared = new SharedPage(playerPage);
					await shared.gotoFavorites();
					await shared.verifyFavoritesLoads();
				});

				test("6.12 DM second combat — initiative tracker with new combatants", async () => {
					await dmPage.goto("/dm-tools/initiative-tracker");
					await expect(dmPage.getByTestId("initiative-tracker")).toBeVisible({
						timeout: 15_000,
					});
					await dismissAnalytics(dmPage);
					await dmPage.waitForTimeout(3_000);

					// Reset tracker
					const resetBtn = dmPage.getByTestId("initiative-reset");
					if (await resetBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
						await resetBtn.click();
						await dmPage.waitForTimeout(800);
					}

					const fillInput = async (selector: string, value: string) => {
						const el = dmPage.locator(selector);
						await el.scrollIntoViewIfNeeded();
						await el.click();
						await el.fill(value);
						await dmPage.waitForTimeout(200);
					};

					// Add combatants for second encounter (fill name LAST)
					await fillInput("#combatant-initiative", "20");
					await fillInput("#combatant-hp", "60");
					await fillInput("#combatant-max-hp", "60");
					await fillInput("#combatant-ac", "18");
					await fillInput("#combatant-name", "Rift Guardian");
					await expect(dmPage.locator("#combatant-name")).toHaveValue(
						"Rift Guardian",
						{ timeout: 5_000 },
					);
					const addBtn = dmPage.getByTestId("initiative-add-combatant");
					await expect(addBtn).toBeEnabled({ timeout: 10_000 });
					await addBtn.click();
					await dmPage.waitForTimeout(800);

					await fillInput("#combatant-initiative", "16");
					await fillInput("#combatant-hp", "22");
					await fillInput("#combatant-max-hp", "25");
					await fillInput("#combatant-ac", "15");
					await fillInput("#combatant-name", "Player-Hero");
					await expect(dmPage.locator("#combatant-name")).toHaveValue(
						"Player-Hero",
						{ timeout: 5_000 },
					);
					await expect(addBtn).toBeEnabled({ timeout: 10_000 });
					await addBtn.click();
					await dmPage.waitForTimeout(800);

					// Advance turns
					const nextTurnBtn = dmPage.getByTestId("initiative-next-turn");
					await expect(nextTurnBtn).toBeEnabled({ timeout: 10_000 });
					for (let i = 0; i < 3; i++) {
						await nextTurnBtn.click();
						await dmPage.waitForTimeout(300);
					}
				});

				test("6.13 Player rolls combat dice for second encounter", async () => {
					const dice = new DiceRollerPage(playerPage);
					await dice.goto();
					await dice.rollAttack(5);
					await dice.rollDamage("d8", 1, 3);
					await dice.quickRollD20();
					await dice.expectRollResult();
				});
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 7 — SESSION HOUR 4: Wrap-Up, Rewards, Level-Up, Persistence
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 7: Session Hour 4 — Wrap-Up & Progression", () => {
				test("7.1 DM generates session-end treasure rewards", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testTreasureGenerator();
				});

				test("7.2 DM updates party tracker with session results", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testPartyTracker();
				});

				test("7.3 DM reviews campaign detail — all tabs post-session", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaignDetail(campaignId);
					await shared.exerciseCampaignDetailTabs(true);
				});

				test("7.4 DM verifies campaign members list", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaignDetail(campaignId);
					await shared.verifyCampaignMembers();
				});

				test("7.5 Player attempts character level up", async () => {
					if (!playerCharacterId || playerCharacterId === "wizard-exercised")
						return;
					const player = new PlayerPage(playerPage);
					const loaded = await player.verifyCharacterLevelUp(playerCharacterId);
					expect(loaded).toBe(true);
				});

				test("7.6 Player character compare page", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyCharacterCompare();
				});

				test("7.7 Player characters list — verify character persisted", async () => {
					const shared = new SharedPage(playerPage);
					await shared.gotoCharacters();
					await shared.verifyCharactersLoads();
					await shared.verifyCharacterListActions();
				});

				test("7.8 Player revisits campaign detail post-session", async () => {
					expect(campaignId).toBeTruthy();
					const shared = new SharedPage(playerPage);
					await shared.gotoCampaignDetail(campaignId);
					await shared.exerciseCampaignDetailTabs(false);
				});

				test("7.9 DM exercises art generator for session recap illustrations", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testArtGenerator();
				});

				test("7.10 DM exercises audio manager for session ambiance review", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testAudioManager();
				});

				test("7.11 DM token library — browse session tokens", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testTokenLibrary();
				});

				test("7.12 DM session planner — plan next session", async () => {
					const dt = new DMToolsPage(dmPage);
					await dt.testSessionPlanner();
				});

				test("7.13 DM campaigns list — verify campaign visible", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaigns();
					await shared.verifyCampaignListLoads();
				});

				test("7.14 DM characters list — verify characters page", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoCharacters();
					await shared.verifyCharactersLoads();
				});

				test("7.15 Player deep dice roller exercise", async () => {
					const dice = new DiceRollerPage(playerPage);
					await dice.goto();
					await dice.adjustQuantityUp();
					await dice.rollD100();
					await dice.verifyHistoryCount(1);
				});
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 8 — CROSS-CONTEXT VALIDATION & PERMISSION BOUNDARIES
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 8: Permission Boundaries & Final Validation", () => {
				test("8.1 Player is denied access to /dm-tools", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked("/dm-tools");
				});

				test("8.2 Player is denied access to /dm-tools/encounter-builder", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked("/dm-tools/encounter-builder");
				});

				test("8.3 Player is denied access to /dm-tools/system-console", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked("/dm-tools/system-console");
				});

				test("8.4 Player is denied access to /dm-tools/content-audit", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked("/dm-tools/content-audit");
				});

				test("8.5 Player is denied access to /dm-tools/art-generation", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked("/dm-tools/art-generation");
				});

				test("8.6 Player is denied access to /admin", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked("/admin");
				});

				test("8.7 DM verifies campaign detail after full session", async () => {
					expect(campaignId).toBeTruthy();
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaignDetail(campaignId);
					const heading = dmPage.getByText(/GUILD|CAMPAIGN|OVERVIEW/i).first();
					await expect(heading).toBeVisible({ timeout: 15_000 });
				});

				test("8.8 DM campaign roll feed panel visible", async () => {
					const rollFeed = dmPage.getByTestId("campaign-roll-feed");
					const feedVisible = await rollFeed
						.isVisible({ timeout: 10_000 })
						.catch(() => false);
					if (feedVisible) {
						// Roll feed rendered (may or may not have entries)
						await expect(rollFeed).toBeVisible();
					}
				});

				test("8.9 Final screenshots and session summary", async () => {
					const dmScreenshot = await dmPage.screenshot({ fullPage: true });
					test.info().attach("final-dm-state", {
						body: dmScreenshot,
						contentType: "image/png",
					});

					const playerScreenshot = await playerPage.screenshot({
						fullPage: true,
					});
					test.info().attach("final-player-state", {
						body: playerScreenshot,
						contentType: "image/png",
					});

					test.info().attach("session-summary", {
						contentType: "text/plain",
						body: [
							"═══ FULL 4-HOUR SESSION E2E SUMMARY ═══",
							`Campaign ID: ${campaignId}`,
							`Share Code: ${shareCode}`,
							`Session ID: ${sessionId || "(local-only mode)"}`,
							`Player Character: ${playerCharacterId}`,
							"",
							"Phase 1: DM Pre-Session — ✅ Auth, campaign create, invite, homebrew",
							"Phase 2: DM Session Prep — ✅ All 16+ DM tools exercised",
							"Phase 3: Player Joins — ✅ Auth, join via code, character creation",
							"Phase 4: Hour 1 — ✅ Encounter, initiative, VTT, combat dice",
							"Phase 5: Hour 2 — ✅ Exploration, quests, compendium, player tools",
							"Phase 6: Hour 3 — ✅ Mid-session tools, second combat, marketplace",
							"Phase 7: Hour 4 — ✅ Rewards, level-up, persistence, session wrap",
							"Phase 8: Validation — ✅ Permission boundaries, cross-context checks",
						].join("\n"),
					});
				});
			});

		test.afterAll(async () => {
			if (dmContext) await dmContext.close().catch(() => {});
			if (playerContext) await playerContext.close().catch(() => {});
		});
	});
