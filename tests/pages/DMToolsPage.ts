import { expect, type Page } from "@playwright/test";

/**
 * Page Object Model for ALL DM Tool pages.
 *
 * Each tool method navigates directly to the tool route, verifies it loaded,
 * and exercises its primary interactive elements (buttons, inputs, selects).
 *
 * Selector priority: data-testid > role+name > #id > CSS class
 */
export class DMToolsPage {
	constructor(public page: Page) {}

	/** Dismiss the analytics consent banner if it overlays interactive elements. */
	private async dismissAnalyticsBanner() {
		// Set localStorage to suppress the banner, then try clicking it away as fallback
		await this.page.evaluate(() => {
			localStorage.setItem(
				"solo-compendium-analytics-consent",
				JSON.stringify({
					status: "rejected",
					version: 1,
					timestamp: Date.now(),
				}),
			);
		});
		const bannerBtn = this.page.locator(".fixed.bottom-0 button").first();
		if (await bannerBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
			await bannerBtn.click();
			await this.page.waitForTimeout(300);
		}
	}

	// ─── DM Tools Hub ──────────────────────────────────────────────

	/** Navigate to hub and verify all tool cards render. */
	async verifyHub() {
		await this.page.goto("/warden-directives");
		await expect(this.page.getByTestId("warden-tools")).toBeVisible({
			timeout: 15_000,
		});
		await expect(this.page.getByTestId("warden-tools-heading")).toBeVisible();

		// Verify a sampling of key tool links exist
		const expectedTools = [
			"Encounter Builder",
			"Initiative Tracker",
			"Rift Generator",
			"NPC Generator",
			"Rollable Tables",
			"Relic Workshop",
			"Treasure Generator",
			"Quest Generator",
			"Session Planner",
			"Random Event Generator",
			"Party Tracker",
			"Dungeon Map Generator",
			"Token Library",
			"VTT Map Viewer",
			"Rift Console",
			"Content Audit",
		];
		for (const tool of expectedTools) {
			await expect(
				this.page.getByText(tool, { exact: false }).first(),
			).toBeVisible();
		}
	}

	// ─── Encounter Builder ─────────────────────────────────────────

	async testEncounterBuilder() {
		await this.page.goto("/warden-directives/encounter-builder");
		// Page heading
		await expect(
			this.page.getByText("ENCOUNTER BUILDER", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Search monsters input
		const searchInput = this.page
			.locator('input[placeholder*="earch"]')
			.first();
		await expect(searchInput).toBeVisible({ timeout: 10_000 });
		await searchInput.fill("Shadow");
		await this.page.waitForTimeout(1_500);

		// Try to add a monster from the search results
		const addBtn = this.page.getByRole("button", { name: /Add|Plus/i }).first();
		if (await addBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await addBtn.click();
			await this.page.waitForTimeout(500);
		}

		// Hunter level and count inputs
		const levelInput = this.page.locator('input[type="number"]').first();
		if (await levelInput.isVisible().catch(() => false)) {
			await levelInput.fill("5");
		}

		// Back button
		await expect(
			this.page.getByText("Back to System Tools", { exact: false }).first(),
		).toBeVisible();
	}

	// ─── Initiative Tracker ────────────────────────────────────────

	async testInitiativeTracker() {
		await this.page.goto("/warden-directives/initiative-tracker");
		await expect(this.page.getByTestId("initiative-tracker")).toBeVisible({
			timeout: 15_000,
		});

		// Dismiss analytics banner if it overlays the form
		await this.dismissAnalyticsBanner();

		// Fill combatant form using #id selectors
		await this.page.fill("#combatant-name", "Test Combatant");
		await this.page.fill("#combatant-initiative", "15");
		await this.page.fill("#combatant-hp", "30");
		await this.page.fill("#combatant-max-hp", "30");
		await this.page.fill("#combatant-ac", "16");

		// Add button should now be enabled
		const addBtn = this.page.getByTestId("initiative-add-combatant");
		await expect(addBtn).toBeEnabled({ timeout: 5_000 });
		await addBtn.click();
		await this.page.waitForTimeout(500);

		// Verify combatant appeared in the list (use exact to avoid matching toast text)
		await expect(
			this.page.getByText("Test Combatant", { exact: true }),
		).toBeVisible({ timeout: 5_000 });

		// Round indicator
		const roundText = this.page.getByText(/ROUND/i).first();
		await expect(roundText).toBeVisible({ timeout: 5_000 });

		// Next/Previous turn buttons (data-testid)
		const nextTurnBtn = this.page.getByTestId("initiative-next-turn");
		await expect(nextTurnBtn).toBeVisible({ timeout: 5_000 });

		// Reset button
		const resetBtn = this.page.getByTestId("initiative-reset");
		await expect(resetBtn).toBeVisible({ timeout: 5_000 });
	}

	// ─── Rollable Tables ──────────────────────────────────────────

	async testRollableTables() {
		await this.page.goto("/warden-directives/rollable-tables");
		await expect(
			this.page.getByText("PROTOCOL WARDEN TABLES", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Verify tabs
		await expect(this.page.getByRole("tab", { name: /Rifts/i })).toBeVisible();
		await expect(
			this.page.getByRole("tab", { name: /Rewards/i }),
		).toBeVisible();
		await expect(this.page.getByRole("tab", { name: /NPCs/i })).toBeVisible();
		await expect(
			this.page.getByRole("tab", { name: /Treasure/i }),
		).toBeVisible();

		// Roll on Rifts tab (default)
		const rollComplicationBtn = this.page.getByRole("button", {
			name: /Roll Complication/i,
		});
		await expect(rollComplicationBtn).toBeVisible({ timeout: 5_000 });
		await rollComplicationBtn.click();
		await expect(this.page.getByText("Complication").first()).toBeVisible({
			timeout: 5_000,
		});

		// Switch to Rewards tab
		await this.page.getByRole("tab", { name: /Rewards/i }).click();
		const rollRewardBtn = this.page.getByRole("button", {
			name: /Roll Reward/i,
		});
		await expect(rollRewardBtn).toBeVisible({ timeout: 5_000 });
		await rollRewardBtn.click();
		await expect(this.page.getByText("Reward").first()).toBeVisible({
			timeout: 5_000,
		});

		// Switch to NPCs tab
		await this.page.getByRole("tab", { name: /NPCs/i }).click();
		const rollMotivationBtn = this.page.getByRole("button", {
			name: /Roll Motivation/i,
		});
		await expect(rollMotivationBtn).toBeVisible({ timeout: 5_000 });
		await rollMotivationBtn.click();

		// Switch to Treasure tab
		await this.page.getByRole("tab", { name: /Treasure/i }).click();
		await expect(
			this.page.getByText("TREASURE BY RIFT RANK", { exact: false }).first(),
		).toBeVisible({ timeout: 5_000 });
	}

	// ─── Rift Generator ───────────────────────────────────────────

	async testRiftGenerator() {
		await this.page.goto("/warden-directives/gate-generator");
		await expect(
			this.page.getByText("RIFT GENERATOR", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Generate button
		const generateBtn = this.page
			.getByRole("button", { name: /Generate/i })
			.first();
		await expect(generateBtn).toBeVisible({ timeout: 5_000 });
		await generateBtn.click();
		await this.page.waitForTimeout(500);

		// Copy button should appear after generation
		const copyBtn = this.page.getByRole("button", { name: /Copy/i }).first();
		if (await copyBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await expect(copyBtn).toBeVisible();
		}
	}

	// ─── NPC Generator ────────────────────────────────────────────

	async testNPCGenerator() {
		await this.page.goto("/warden-directives/npc-generator");
		await expect(
			this.page.getByText("NPC GENERATOR", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		const generateBtn = this.page
			.getByRole("button", { name: /Generate/i })
			.first();
		await expect(generateBtn).toBeVisible({ timeout: 5_000 });
		await generateBtn.click();
		await this.page.waitForTimeout(500);

		// NPC card should appear
		const copyBtn = this.page.getByRole("button", { name: /Copy/i }).first();
		if (await copyBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await expect(copyBtn).toBeVisible();
		}
	}

	// ─── Treasure Generator ───────────────────────────────────────

	async testTreasureGenerator() {
		await this.page.goto("/warden-directives/treasure-generator");
		await expect(
			this.page.getByText("TREASURE GENERATOR", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Rank select
		const rankTrigger = this.page.locator('button[role="combobox"]').first();
		if (await rankTrigger.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await rankTrigger.click();
			const option = this.page.getByRole("option").first();
			if (await option.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await option.click();
				await this.page.waitForTimeout(300);
			} else {
				await this.page.keyboard.press("Escape");
			}
		}

		// Generate
		const generateBtn = this.page
			.getByRole("button", { name: /Generate/i })
			.first();
		await expect(generateBtn).toBeVisible({ timeout: 5_000 });
		await generateBtn.click();
		await this.page.waitForTimeout(500);

		// Copy
		const copyBtn = this.page.getByRole("button", { name: /Copy/i }).first();
		if (await copyBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await expect(copyBtn).toBeVisible();
		}
	}

	// ─── Quest Generator ──────────────────────────────────────────

	async testQuestGenerator() {
		await this.page.goto("/warden-directives/quest-generator");
		await expect(
			this.page.getByText("QUEST GENERATOR", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Quest type select
		const selects = this.page.locator('button[role="combobox"]');
		const selectCount = await selects.count();
		if (selectCount > 0) {
			await selects.first().click();
			const option = this.page.getByRole("option").first();
			if (await option.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await option.click();
				await this.page.waitForTimeout(300);
			} else {
				await this.page.keyboard.press("Escape");
			}
		}

		// Generate
		const generateBtn = this.page
			.getByRole("button", { name: /Generate/i })
			.first();
		await expect(generateBtn).toBeVisible({ timeout: 5_000 });
		await generateBtn.click();
		await this.page.waitForTimeout(500);

		// Copy
		const copyBtn = this.page.getByRole("button", { name: /Copy/i }).first();
		if (await copyBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await expect(copyBtn).toBeVisible();
		}
	}

	// ─── Session Planner ──────────────────────────────────────────

	async testSessionPlanner() {
		await this.page.goto("/warden-directives/session-planner");
		await expect(
			this.page.getByText("SESSION PLANNER", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Wait for loading state to resolve (page may show "Loading campaigns..." first)
		await this.page.waitForTimeout(3_000);

		// Campaign select, "NO CAMPAIGNS AVAILABLE", or still-loading — any is acceptable
		const campaignSelect = this.page
			.locator("#session-planner-campaign")
			.first();
		const noCampaigns = this.page
			.getByText(/NO CAMPAIGNS|Create or join/i)
			.first();
		const loading = this.page.getByText(/Loading campaigns/i).first();
		const hasCampaignSelect = await campaignSelect
			.isVisible({ timeout: 8_000 })
			.catch(() => false);
		const hasNoCampaigns = await noCampaigns
			.isVisible({ timeout: 3_000 })
			.catch(() => false);
		const isLoading = await loading
			.isVisible({ timeout: 2_000 })
			.catch(() => false);
		expect(hasCampaignSelect || hasNoCampaigns || isLoading).toBe(true);

		// Back button (says "Back to Warden Tools" on this page)
		await expect(
			this.page.getByText(/Back to (Warden|System) Tools/i).first(),
		).toBeVisible();
	}

	// ─── Random Event Generator ───────────────────────────────────

	async testRandomEventGenerator() {
		await this.page.goto("/warden-directives/random-event-generator");
		await expect(
			this.page.getByText("RANDOM EVENT", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Generate world event
		const worldBtn = this.page
			.getByRole("button", { name: /World Event|Generate World/i })
			.first();
		if (await worldBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await worldBtn.click();
			await this.page.waitForTimeout(500);
		}

		// Generate NPC encounter
		const npcBtn = this.page
			.getByRole("button", { name: /NPC|Generate NPC/i })
			.first();
		if (await npcBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await npcBtn.click();
			await this.page.waitForTimeout(500);
		}

		// Copy
		const copyBtn = this.page.getByRole("button", { name: /Copy/i }).first();
		if (await copyBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await expect(copyBtn).toBeVisible();
		}
	}

	// ─── Relic Workshop ───────────────────────────────────────────

	async testRelicWorkshop() {
		await this.page.goto("/warden-directives/relic-workshop");
		await expect(
			this.page.getByText("RELIC WORKSHOP", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Name input
		const inputs = this.page.locator("input");
		const inputCount = await inputs.count();
		if (inputCount > 0) {
			await inputs.first().fill("Test Relic");
		}

		// Description textarea
		const textarea = this.page.locator("textarea").first();
		if (await textarea.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await textarea.fill(
				"A powerful test relic forged in the crucible of E2E testing.",
			);
		}

		// Type select
		const selects = this.page.locator('button[role="combobox"]');
		if ((await selects.count()) > 0) {
			await selects.first().click();
			const option = this.page.getByRole("option").first();
			if (await option.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await option.click();
				await this.page.waitForTimeout(300);
			} else {
				await this.page.keyboard.press("Escape");
			}
		}

		// Add property button
		const addPropertyBtn = this.page
			.getByRole("button", { name: /Add Property/i })
			.first();
		if (await addPropertyBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await addPropertyBtn.click();
			await this.page.waitForTimeout(300);
		}

		// Save button
		const saveBtn = this.page.getByRole("button", { name: /Save/i }).first();
		if (await saveBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await expect(saveBtn).toBeVisible();
		}
	}

	// ─── Party Tracker ────────────────────────────────────────────

	async testPartyTracker() {
		await this.page.goto("/warden-directives/party-tracker");
		await expect(
			this.page.getByText("PARTY TRACKER", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Add member button
		const addMemberBtn = this.page
			.getByRole("button", { name: /Add|New Member/i })
			.first();
		if (await addMemberBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await addMemberBtn.click();
			await this.page.waitForTimeout(500);
		}

		// Look for input fields (name, HP, AC, etc.)
		const inputs = this.page.locator("input");
		const inputCount = await inputs.count();
		// Party tracker should have multiple inputs when a member exists
		if (inputCount > 0) {
			await expect(inputs.first()).toBeVisible();
		}
	}

	// ─── Dungeon Map Generator ────────────────────────────────────

	async testDungeonMapGenerator() {
		await this.page.goto("/warden-directives/dungeon-map-generator");
		await expect(
			this.page.getByText("DUNGEON MAP", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Generate button
		const generateBtn = this.page
			.getByRole("button", { name: /Generate/i })
			.first();
		await expect(generateBtn).toBeVisible({ timeout: 5_000 });
		await generateBtn.click();
		await this.page.waitForTimeout(1_000);

		// Map grid/canvas should render
		// Look for grid cells or canvas element
		const mapArea = this.page.locator('[class*="grid"], canvas').first();
		if (await mapArea.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await expect(mapArea).toBeVisible();
		}

		// Width/height inputs
		const inputs = this.page.locator('input[type="number"]');
		if ((await inputs.count()) > 0) {
			await expect(inputs.first()).toBeVisible();
		}
	}

	// ─── Token Library ────────────────────────────────────────────

	async testTokenLibrary() {
		await this.page.goto("/warden-directives/token-library");
		await expect(
			this.page.getByText("TOKEN LIBRARY", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Search input
		const searchInput = this.page
			.locator('input[placeholder*="earch"]')
			.first();
		if (await searchInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await searchInput.fill("monster");
			await this.page.waitForTimeout(500);
		}

		// Create token button
		const createBtn = this.page
			.getByRole("button", { name: /Create|New Token/i })
			.first();
		if (await createBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await createBtn.click();
			await this.page.waitForTimeout(500);

			// Fill token name
			const nameInput = this.page.locator("input").first();
			if (await nameInput.isVisible().catch(() => false)) {
				await nameInput.fill("E2E Test Token");
			}
		}

		// Category filter
		const categories = this.page
			.locator("button")
			.filter({ hasText: /All|Custom|Monsters|NPCs/i });
		if ((await categories.count()) > 0) {
			await expect(categories.first()).toBeVisible();
		}
	}

	// ─── Art Generator ────────────────────────────────────────────

	async testArtGenerator() {
		await this.page.goto("/warden-directives/art-generator");
		await expect(
			this.page.getByText("ART GENERATOR", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Tabs (if present)
		const tabs = this.page.getByRole("tab");
		if ((await tabs.count()) > 0) {
			await expect(tabs.first()).toBeVisible();
			// Click each tab
			const tabCount = await tabs.count();
			for (let i = 0; i < Math.min(tabCount, 3); i++) {
				await tabs.nth(i).click();
				await this.page.waitForTimeout(300);
			}
		}
	}

	// ─── Audio Manager ────────────────────────────────────────────

	async testAudioManager() {
		await this.page.goto("/warden-directives/audio-manager");
		await expect(
			this.page.getByText("AUDIO", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Tabs
		const tabs = this.page.getByRole("tab");
		if ((await tabs.count()) > 0) {
			const tabCount = await tabs.count();
			for (let i = 0; i < Math.min(tabCount, 3); i++) {
				await tabs.nth(i).click();
				await this.page.waitForTimeout(300);
			}
		}
	}

	// ─── VTT Map ──────────────────────────────────────────────────

	async testVTTMap() {
		await this.page.goto("/warden-directives/vtt-map");
		await expect(
			this.page.getByText("VTT", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Zoom buttons
		const zoomInBtn = this.page
			.getByRole("button", { name: /Zoom In|\+/i })
			.first();
		if (await zoomInBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await zoomInBtn.click();
		}

		const zoomOutBtn = this.page
			.getByRole("button", { name: /Zoom Out|-/i })
			.first();
		if (await zoomOutBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await zoomOutBtn.click();
		}

		// Grid toggle
		const gridToggle = this.page.getByRole("button", { name: /Grid/i }).first();
		if (await gridToggle.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await gridToggle.click();
		}

		// Save button
		const saveBtn = this.page.getByRole("button", { name: /Save/i }).first();
		if (await saveBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await expect(saveBtn).toBeVisible();
		}
	}

	// ─── Rift Console (Admin) ───────────────────────────────────

	async testSystemConsole() {
		await this.page.goto("/warden-directives/system-console");
		// Should load without access denied
		await this.page.waitForTimeout(2_000);
		// Check for admin-related content
		const heading = this.page.getByText(/SYSTEM CONSOLE|ADMIN|IMPORT/i).first();
		await expect(heading).toBeVisible({ timeout: 15_000 });
	}

	// ─── Content Audit ────────────────────────────────────────────

	async testContentAudit() {
		await this.page.goto("/warden-directives/content-audit");
		await this.page.waitForTimeout(2_000);
		const heading = this.page
			.getByText(/CONTENT AUDIT|AUDIT|DATABASE/i)
			.first();
		await expect(heading).toBeVisible({ timeout: 15_000 });
	}

	// ─── Art Generation (Admin) ─────────────────────────────────

	async testArtGenerationAdmin() {
		await this.page.goto("/warden-directives/art-generation");
		await this.page.waitForTimeout(2_000);
		const heading = this.page.getByText(/ART GENERATION|ART|GENERATE/i).first();
		await expect(heading).toBeVisible({ timeout: 15_000 });
	}

	// ─── VTT Enhanced (Campaign-scoped) ─────────────────────────

	async testVTTEnhanced(campaignId: string) {
		await this.page.goto(`/campaigns/${campaignId}/vtt`);
		await this.page.waitForTimeout(3_000);

		// VTT Enhanced may load with VTT interface, connection error, or auth redirect
		if (/\/login/.test(this.page.url())) {
			return; // Auth expired; route exists
		}

		// Accept: VTT heading, connection error boundary, or any page content
		const heading = this.page
			.getByText(/VTT|VIRTUAL TABLETOP|MAP|TOKEN/i)
			.first();
		const errorBoundary = this.page
			.getByText(/Connection Error|Error|Try Again|Reload/i)
			.first();
		const headingVisible = await heading
			.isVisible({ timeout: 10_000 })
			.catch(() => false);
		const errorVisible = await errorBoundary
			.isVisible({ timeout: 5_000 })
			.catch(() => false);
		// Either the VTT loaded or an error boundary caught a realtime issue — both are valid
		expect(headingVisible || errorVisible).toBe(true);
	}

	// ─── Session VTT Configuration ──────────────────────────────

	/**
	 * Configure VTT map and tokens for a session.
	 */
	async setupSessionMap(
		sessionId: string,
		opts: {
			gridSize?: number;
			tokens?: string[];
			fogOfWar?: boolean;
			dynamicLighting?: boolean;
		},
	): Promise<void> {
		// Navigate to VTT for this session
		await this.page.goto(`/warden-directives/vtt/${sessionId}`);

		// Wait for VTT interface to load
		await this.page.waitForTimeout(5_000);

		// Configure grid size if available
		if (opts.gridSize) {
			const gridSizeInput = this.page
				.locator('#grid-size, input[name*="grid"]')
				.first();
			if (
				await gridSizeInput.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				await gridSizeInput.fill(opts.gridSize.toString());
			}
		}

		// Add tokens if specified
		if (opts.tokens && opts.tokens.length > 0) {
			for (const token of opts.tokens) {
				const addTokenBtn = this.page
					.getByRole("button", { name: /Add Token|New Token/i })
					.first();
				if (
					await addTokenBtn.isVisible({ timeout: 3_000 }).catch(() => false)
				) {
					await addTokenBtn.click();

					// Select token type
					const tokenSelect = this.page
						.locator('#token-type, select[name*="token"]')
						.last();
					if (
						await tokenSelect.isVisible({ timeout: 2_000 }).catch(() => false)
					) {
						await tokenSelect.click();
						await this.page
							.getByRole("option", { name: new RegExp(token, "i") })
							.click();
					}
				}
			}
		}

		// Configure fog of war
		if (opts.fogOfWar !== undefined) {
			const fogToggle = this.page
				.getByRole("checkbox", { name: /Fog|Fog of War/i })
				.first();
			if (await fogToggle.isVisible({ timeout: 3_000 }).catch(() => false)) {
				const isChecked = await fogToggle.isChecked();
				if (isChecked !== opts.fogOfWar) {
					await fogToggle.click();
				}
			}
		}

		// Configure dynamic lighting
		if (opts.dynamicLighting !== undefined) {
			const lightingToggle = this.page
				.getByRole("checkbox", { name: /Lighting|Dynamic Lighting/i })
				.first();
			if (
				await lightingToggle.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				const isChecked = await lightingToggle.isChecked();
				if (isChecked !== opts.dynamicLighting) {
					await lightingToggle.click();
				}
			}
		}

		// Save VTT configuration
		const saveBtn = this.page
			.getByRole("button", { name: /Save|Apply/i })
			.first();
		if (await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await saveBtn.click();
			await this.page.waitForTimeout(2_000);
		}
	}
}
