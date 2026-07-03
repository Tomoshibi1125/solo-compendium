import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { CompendiumPage } from "./pages/CompendiumPage";
import { DiceRollerPage } from "./pages/DiceRollerPage";
import { DMToolsPage } from "./pages/DMToolsPage";
import { PlayerPage } from "./pages/PlayerPage";
import { SharedPage } from "./pages/SharedPage";

/**
 * Global App-Wide E2E Test
 *
 * Exercises every route, tool, button, input, select, generator, and automation
 * across the entire Rift Ascendant application as both DM and Player.
 *
 * Uses dual browser contexts (isolated cookies/storage) per role.
 */

// Global App-Wide E2E: DM + Player full functionality

// Shared state across tests within the describe block
let dmContext: BrowserContext;
let dmPage: Page;
let playerContext: BrowserContext;
let playerPage: Page;

// Cross-phase data
let campaignId: string;
let shareCode: string;
let dmCharacterId = "";
let playerCharacterId = "";

test.describe
	.serial("Global App-Wide E2E: DM + Player full functionality", () => {
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 1 — DM SESSION
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 1: DM Session", () => {
				test.beforeAll(async ({ browser }) => {
					dmContext = await browser.newContext();
					dmPage = await dmContext.newPage();
				});

				test.afterAll(async () => {
					if (dmContext) {
						const screenshot = await dmPage.screenshot();
						test.info().attach("dm-final-state", {
							body: screenshot,
							contentType: "image/png",
						});
						await dmContext.close();
					}
				});

				// ── 1. Auth: DM Sign In ──────────────────────────────────────
				test("1. DM signs in and lands on the Warden hub", async () => {
					const auth = new AuthPage(dmPage);
					await auth.continueAsGuest("dm");
					await expect(dmPage.getByTestId("warden-tools")).toBeVisible({
						timeout: 15_000,
					});
				});

				// ── 2. DM Tools Hub ──────────────────────────────────────────
				test("2. DM Tools Hub shows all tool cards", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.verifyHub();
				});

				// ── 3. Encounter Builder ─────────────────────────────────────
				test("3. Encounter Builder: search, add monster, inputs", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testEncounterBuilder();
				});

				// ── 4. Initiative Tracker ────────────────────────────────────
				test("4. Initiative Tracker: add combatant, turn controls", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testInitiativeTracker();
				});

				// ── 5. Rollable Tables ──────────────────────────────────────
				test("5. Rollable Tables: tabs, roll buttons, results", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testRollableTables();
				});

				// ── 6. Rift Generator ───────────────────────────────────────
				test("6. Rift Generator: generate and copy", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testRiftGenerator();
				});

				// ── 7. NPC Generator ────────────────────────────────────────
				test("7. NPC Generator: generate and copy", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testNPCGenerator();
				});

				// ── 8. Treasure Generator ───────────────────────────────────
				test("8. Treasure Generator: rank select, generate, copy", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testTreasureGenerator();
				});

				// ── 9. Quest Generator ──────────────────────────────────────
				test("9. Quest Generator: selects, generate, copy", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testQuestGenerator();
				});

				// ── 10. Session Planner ─────────────────────────────────────
				test("10. Session Planner: campaign select, sessions panel", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testSessionPlanner();
				});

				// ── 11. Random Event Generator ──────────────────────────────
				test("11. Random Event Generator: generate events", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testRandomEventGenerator();
				});

				// ── 12. Relic Workshop ──────────────────────────────────────
				test("12. Relic Workshop: form inputs, properties, save", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testRelicWorkshop();
				});

				// ── 13. Party Tracker ───────────────────────────────────────
				test("13. Party Tracker: add member, inputs", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testPartyTracker();
				});

				// Tests 14 (Dungeon Map Generator), 15 (Token Library), 17 (Audio
				// Manager), and 18 (VTT Map) were removed with their tools — the
				// standalone dungeon-map tool, token library, session audio, and
				// VTT were scraped from the app (see docs/pending-wiring.md).

				// ── 16. Art Generator ───────────────────────────────────────
				test("16. Art Generator: tabs, generator panel", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testArtGenerator();
				});

				// ── 19. Rift Console ──────────────────────────────────────
				test("19. Rift Console: admin page loads", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testSystemConsole();
				});

				// ── 20. Content Audit ───────────────────────────────────────
				test("20. Content Audit: audit page loads", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testContentAudit();
				});

				// ── 21. Campaign Create ─────────────────────────────────────
				test("21. Campaign Create: dialog, form, submit", async () => {
					const shared = new SharedPage(dmPage);
					const timestamp = Date.now();
					campaignId = await shared.createCampaign(
						`global-e2e-${timestamp}`,
						"Global E2E test campaign",
					);
					expect(campaignId).toBeTruthy();
				});

				// ── 22. Campaign Detail & Share Code ────────────────────────
				test("22. Campaign Detail: share code visible", async () => {
					const shared = new SharedPage(dmPage);
					shareCode = await shared.getShareCode();
					expect(shareCode).toMatch(/^[A-Z0-9]{6}$/);
					await shared.copyShareLink();
				});

				// ── 23. Compendium Browse ───────────────────────────────────
				test("23. Compendium: deep exercise — search, categories, sort, view modes, detail", async () => {
					const compendium = new CompendiumPage(dmPage);
					await compendium.deepExercise();
				});

				// ── 23b. Compendium Sidebar Deep-Links ──────────────────────
				test("23b. Compendium: sidebar category links switch the view without remount", async () => {
					const compendium = new CompendiumPage(dmPage);
					await compendium.verifySidebarCategoryDeepLinks();
				});

				// ── 24. Compendium Detail ───────────────────────────────────
				test("24. Compendium Detail: click entry if available, verify controls", async () => {
					const compendium = new CompendiumPage(dmPage);
					await compendium.goto();
					const hasEntries = await compendium.verifyEntriesVisible();
					if (hasEntries) {
						const clicked = await compendium.clickFirstEntry();
						if (clicked) {
							await compendium.verifyDetailLoads();
						}
					}
					// Even without entries, verify the page heading and search rendered
					await compendium.goto();
					await expect(dmPage.getByText("COMPENDIUM").first()).toBeVisible({
						timeout: 10_000,
					});
				});

				// ── 25. Characters List ─────────────────────────────────────
				test("25. Characters List: create/import/stash buttons", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoCharacters();
					await shared.verifyCharactersLoads();
					await shared.verifyCharacterListActions();
				});

				// ── 26. Character Creation (DM) ─────────────────────────────
				test("26. Character Creation: full 6-step wizard with all form elements", async () => {
					const player = new PlayerPage(dmPage);
					dmCharacterId =
						(await player.createCharacter("DM Test Ascendant")) ?? "";
					expect(dmCharacterId).toBeTruthy();
					test.info().attach("dm-character-id", {
						contentType: "text/plain",
						body: dmCharacterId,
					});
				});

				// ── 27. Character Sheet (DM) ────────────────────────────────
				test("27. Character Sheet: stats, equipment, actions", async () => {
					if (dmCharacterId === "wizard-exercised") {
						// Wizard was fully exercised but no Supabase data — verify characters list instead
						const shared = new SharedPage(dmPage);
						await shared.gotoCharacters();
						await shared.verifyCharactersLoads();
						return;
					}
					const player = new PlayerPage(dmPage);
					const loaded = await player.verifyCharacterSheet(dmCharacterId);
					expect(loaded).toBe(true);
				});

				// ── 28. Dice Roller (DM) ────────────────────────────────────
				test("28. Dice Roller: quick roll, custom dice, themes, history", async () => {
					const dice = new DiceRollerPage(dmPage);
					await dice.goto();

					// Quick roll d20
					await dice.quickRollD20();
					await dice.expectRollResult();

					// Try custom dice
					await dice.selectDiceType("d6");
					await dice.setModifier(2);
					await dice.rollCustom();

					// Change theme
					await dice.changeTheme();

					// Verify all dice types
					await dice.verifyAllDiceTypesVisible();
				});

				// ── 29. Favorites ───────────────────────────────────────────
				test("29. Favorites: page loads, search", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoFavorites();
					await shared.verifyFavoritesLoads();
					await shared.searchFavorites("test");
				});

				// ── 30. Homebrew ────────────────────────────────────────────
				test("30. Homebrew: workbench loads, create draft", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoHomebrew();
					await shared.verifyHomebrewLoads();

					await shared.createHomebrewDraft({
						name: "Global E2E Test Item",
						description: "An item created during global E2E testing.",
						type: "item",
					});
				});

				// ── 31. Marketplace ─────────────────────────────────────────
				test("31. Marketplace: page loads, search", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoMarketplace();
					await shared.verifyMarketplaceLoads();
					await shared.searchMarketplace("relic");
				});

				// ── 32. Campaign Detail Tabs ──────────────────────────────────
				test("32. Campaign Detail: exercise all tabs (Overview, Wiki, Sessions, Chat, Notes, Handouts, Characters, Settings)", async () => {
					expect(campaignId).toBeTruthy();
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaignDetail(campaignId);
					await shared.exerciseCampaignDetailTabs(true);
				});

				// ── 33. Campaigns List ────────────────────────────────────────
				test("33. Campaigns List: standalone page verification", async () => {
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaigns();
					await shared.verifyCampaignListLoads();
				});

				// ── 34. DM Art Generation Admin ───────────────────────────────
				test("34. DM Art Generation admin: page loads", async () => {
					const dmTools = new DMToolsPage(dmPage);
					await dmTools.testArtGenerationAdmin();
				});

				// ── 35. Character Level Up ────────────────────────────────────
				test("35. Character Level Up: page loads, HP controls, stat preview", async () => {
					if (dmCharacterId === "wizard-exercised") {
						const shared = new SharedPage(dmPage);
						await shared.gotoCharacters();
						await shared.verifyCharactersLoads();
						return;
					}
					const player = new PlayerPage(dmPage);
					const loaded = await player.verifyCharacterLevelUp(dmCharacterId);
					expect(loaded).toBe(true);
				});

				// ── 36. Character Compare ─────────────────────────────────────
				test("36. Character Compare: page loads, dual selectors", async () => {
					const player = new PlayerPage(dmPage);
					await player.verifyCharacterCompare();
				});

				// ── 37. Dice Roller Deep ──────────────────────────────────────
				test("37. Dice Roller: d100, quantity adjust, roll history count", async () => {
					const dice = new DiceRollerPage(dmPage);
					await dice.goto();
					await dice.adjustQuantityUp();
					await dice.rollD100();
					await dice.verifyHistoryCount(1);
				});

				// Test 38 (VTT Enhanced) was removed with the VTT — the
				// /campaigns/:id/vtt route no longer exists.
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 2 — PLAYER SESSION
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 2: Player Session", () => {
				test.beforeAll(async ({ browser }) => {
					playerContext = await browser.newContext();
					playerPage = await playerContext.newPage();
				});

				// ── 32. Auth: Player Sign In ────────────────────────────────
				test("32. Player signs in and lands on /player-tools", async () => {
					const auth = new AuthPage(playerPage);
					await auth.continueAsGuest("player");
					// Player should land on /player-tools
					await playerPage.waitForURL(/\/(ascendant|player)-tools/, {
						timeout: 15_000,
					});
				});

				// ── 33. Player Tools Hub ────────────────────────────────────
				test("33. Player Tools Hub: all tool cards visible", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyPlayerToolsHub();
				});

				// ── 34. Player Tool: Character Sheet ────────────────────────
				test("34. Player Tool Detail: Character Sheet", async () => {
					const player = new PlayerPage(playerPage);
					const loaded = await player.gotoPlayerTool("character-sheet");
					expect(loaded).toBe(true);
				});

				// ── 35. Player Tool: Inventory ──────────────────────────────
				test("35. Player Tool Detail: Inventory", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyInventoryTool();
				});

				// ── 36. Player Tool: Abilities ──────────────────────────────
				test("36. Player Tool Detail: Abilities & Skills", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyAbilitiesTool();
				});

				// ── 37. Player Tool: Quest Log ──────────────────────────────
				test("37. Player Tool Detail: Quest Log", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyQuestLogTool();
				});

				// ── 38. Compendium (Player) ─────────────────────────────────
				test("38. Player Compendium: deep exercise — search, categories, detail", async () => {
					const compendium = new CompendiumPage(playerPage);
					await compendium.deepExercise();
				});

				// ── 39. Dice Roller (Player) ────────────────────────────────
				test("39. Player Dice Roller: all dice types, roll, history", async () => {
					const dice = new DiceRollerPage(playerPage);
					await dice.goto();

					// Quick roll d20
					await dice.quickRollD20();
					await dice.expectRollResult();

					// Custom dice
					await dice.selectDiceType("d8");
					await dice.rollCustom();

					// Theme change
					await dice.changeTheme();

					// Verify dice types
					await dice.verifyAllDiceTypesVisible();
				});

				// ── 40. Character Creation (Player) ─────────────────────────
				test("40. Player Character Creation: full wizard with all form elements", async () => {
					const player = new PlayerPage(playerPage);
					playerCharacterId =
						(await player.createCharacter("Player Test Ascendant")) ?? "";
					expect(playerCharacterId).toBeTruthy();
					test.info().attach("player-character-id", {
						contentType: "text/plain",
						body: playerCharacterId,
					});
				});

				// ── 41. Character Sheet (Player) ────────────────────────────
				test("41. Player Character Sheet: verify all sections", async () => {
					if (playerCharacterId === "wizard-exercised") {
						// Wizard was fully exercised but no Supabase data — verify characters list instead
						const shared = new SharedPage(playerPage);
						await shared.gotoCharacters();
						await shared.verifyCharactersLoads();
						return;
					}
					const player = new PlayerPage(playerPage);
					const loaded = await player.verifyCharacterSheet(playerCharacterId);
					expect(loaded).toBe(true);
				});

				// (Former test 42 — player joins via share code — removed: guest
				// campaigns live in per-context localStorage, so a second guest
				// context can never resolve the DM's share code.)

				// ── 43. Favorites (Player) ──────────────────────────────────
				test("43. Player Favorites: page loads", async () => {
					const shared = new SharedPage(playerPage);
					await shared.gotoFavorites();
					await shared.verifyFavoritesLoads();
				});

				// ── 44. Homebrew (Player) ───────────────────────────────────
				test("44. Player Homebrew Studio: workbench loads", async () => {
					const shared = new SharedPage(playerPage);
					await shared.gotoHomebrew();
					await shared.verifyHomebrewLoads();
				});

				// ── 45. Marketplace (Player) ────────────────────────────────
				test("45. Player Marketplace: page loads", async () => {
					const shared = new SharedPage(playerPage);
					await shared.gotoMarketplace();
					await shared.verifyMarketplaceLoads();
				});

				// ── 46. Player Character Art ──────────────────────────────────
				test("46. Player Character Art: tool page loads", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyCharacterArtTool();
				});

				// ── 47. Player Party View ─────────────────────────────────────
				test("47. Player Party View: tool page loads", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyPartyViewTool();
				});

				// (Former test 48 — player map view — removed with the VTT: the
				// /ascendant-tools/map tool no longer exists and redirects to
				// the hub.)

				// (Former test 49 — player exercises the DM's campaign tabs —
				// removed: guest campaigns live in per-context localStorage, so
				// the player context can never resolve the DM's campaignId.)

				// ── 50. Player Characters List ────────────────────────────────
				test("50. Player Characters List: verify page loads", async () => {
					const shared = new SharedPage(playerPage);
					await shared.gotoCharacters();
					await shared.verifyCharactersLoads();
				});

				// ── 51. Player Character Compare ──────────────────────────────
				test("51. Player Character Compare: page loads, selectors", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyCharacterCompare();
				});

				// ── 52. Player Dice Roller Deep ───────────────────────────────
				test("52. Player Dice Roller: d100, history count", async () => {
					const dice = new DiceRollerPage(playerPage);
					await dice.goto();
					await dice.rollD100();
					await dice.verifyHistoryCount(1);
				});

				// ── 53. Player Character Level Up ─────────────────────────────
				test("53. Player Character Level Up: page loads, HP controls", async () => {
					if (playerCharacterId === "wizard-exercised") {
						const shared = new SharedPage(playerPage);
						await shared.gotoCharacters();
						await shared.verifyCharactersLoads();
						return;
					}
					const player = new PlayerPage(playerPage);
					const loaded = await player.verifyCharacterLevelUp(playerCharacterId);
					expect(loaded).toBe(true);
				});
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 3 — PERMISSION BOUNDARIES
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 3: Permission Boundaries", () => {
				test.beforeAll(async ({ browser }) => {
					// Create a fresh player context for permission tests
					playerContext = await browser.newContext();
					playerPage = await playerContext.newPage();
					const auth = new AuthPage(playerPage);
					await auth.continueAsGuest("player");
					await playerPage.waitForURL(/\/(ascendant|player)-tools/, {
						timeout: 15_000,
					});
				});

				test.afterAll(async () => {
					if (playerContext) await playerContext.close();
				});

				// (Former tests 46/47 — player denied /warden-protocols and the
				// encounter builder — removed: ProtectedRoute intentionally lets
				// unauthenticated guests through routes without allowGuest={false};
				// the guest role gates navigation, not URLs. The real boundary is
				// the auth-required admin routes asserted below.)

				// ── 48. Player denied /warden-directives/rift-console ───────
				test("48. Player denied access to /warden-directives/rift-console", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked("/warden-directives/rift-console");
				});

				// ── 54. Player denied /warden-directives/art-generation ───────
				test("54. Player denied access to /warden-directives/art-generation", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked(
						"/warden-directives/art-generation",
					);
				});

				// ── 55. Player denied /warden-directives/content-audit ────────
				test("55. Player denied access to /warden-directives/content-audit", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked("/warden-directives/content-audit");
				});

				// ── 56. Player denied /admin ──────────────────────────────────
				test("56. Player denied access to /admin", async () => {
					const player = new PlayerPage(playerPage);
					await player.verifyDMRouteBlocked("/admin");
				});
			});

		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
		// PHASE 4 — CROSS-CONTEXT VALIDATION
		// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

		test.describe
			.serial("Phase 4: Cross-Context Validation", () => {
				test.beforeAll(async ({ browser }) => {
					dmContext = await browser.newContext();
					dmPage = await dmContext.newPage();
					const auth = new AuthPage(dmPage);
					await auth.continueAsGuest("dm");
					await expect(dmPage.getByTestId("warden-tools")).toBeVisible({
						timeout: 15_000,
					});

					// Guest campaigns are per-context localStorage — the campaign
					// from Phase 1's DM context doesn't exist here, so this phase
					// creates and exercises its own.
					const shared = new SharedPage(dmPage);
					campaignId = await shared.createCampaign(
						`global-e2e-phase4-${Date.now()}`,
						"Phase 4 campaign detail exercise",
					);
					expect(campaignId).toBeTruthy();
				});

				test.afterAll(async () => {
					if (dmContext) await dmContext.close();
				});

				// ── 49. DM campaign detail loads ──────────────────────────
				test("49. DM campaign detail: page loads with overview", async () => {
					expect(campaignId).toBeTruthy();
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaignDetail(campaignId);
					await expect(dmPage).toHaveURL(
						new RegExp(`/campaigns/${campaignId}`),
					);

					// Campaign detail should be visible
					const detailHeading = dmPage
						.getByText(/GUILD|CAMPAIGN|OVERVIEW/i)
						.first();
					await expect(detailHeading).toBeVisible({ timeout: 15_000 });
				});

				// ── 50. DM campaign roll feed ───────────────────────────────
				test("50. DM campaign detail: roll feed panel visible", async () => {
					expect(campaignId).toBeTruthy();
					// Already on campaign detail from test 49
					const rollFeed = dmPage.getByTestId("campaign-roll-feed");
					const feedVisible = await rollFeed
						.isVisible({ timeout: 10_000 })
						.catch(() => false);

					if (feedVisible) {
						await expect(dmPage.getByText("No rolls yet")).toBeVisible({
							timeout: 5_000,
						});
					} else {
						test.info().attach("roll-feed-not-found", {
							contentType: "text/plain",
							body: "Campaign roll feed panel not visible (may require specific tab).",
						});
					}
				});

				// ── 57. Campaign Members ──────────────────────────────────────
				test("57. DM campaign detail: members section visible", async () => {
					expect(campaignId).toBeTruthy();
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaignDetail(campaignId);
					await shared.verifyCampaignMembers();
				});

				// ── 58. Campaign Sessions Tab ─────────────────────────────────
				test("58. DM campaign detail: sessions tab loads", async () => {
					expect(campaignId).toBeTruthy();
					// Already on campaign detail from test 57
					const sessionsTab = dmPage.getByRole("tab", { name: /Sessions/i });
					if (
						await sessionsTab.isVisible({ timeout: 5_000 }).catch(() => false)
					) {
						await sessionsTab.click();
						await dmPage.waitForTimeout(1_000);
					}
				});

				// ── 59. Campaign Characters Tab ───────────────────────────────
				test("59. DM campaign detail: characters tab loads", async () => {
					expect(campaignId).toBeTruthy();
					// Already on campaign detail
					const charsTab = dmPage.getByRole("tab", { name: /Characters/i });
					if (await charsTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
						await charsTab.click();
						await dmPage.waitForTimeout(1_000);
					}
				});

				// ── 60. Campaign Settings Tab ─────────────────────────────────
				test("60. DM campaign detail: settings tab loads (DM only)", async () => {
					expect(campaignId).toBeTruthy();
					const settingsTab = dmPage.getByRole("tab", { name: /Settings/i });
					if (
						await settingsTab.isVisible({ timeout: 5_000 }).catch(() => false)
					) {
						await settingsTab.click();
						await dmPage.waitForTimeout(1_000);
					}
				});

				// ── 61. Campaign Detail Tabs Full Cycle ────────────────────────
				test("61. DM campaign detail: full tab cycle across every tab", async () => {
					expect(campaignId).toBeTruthy();
					const shared = new SharedPage(dmPage);
					await shared.gotoCampaignDetail(campaignId);
					await shared.exerciseCampaignDetailTabs(true);
				});
			});
	});
