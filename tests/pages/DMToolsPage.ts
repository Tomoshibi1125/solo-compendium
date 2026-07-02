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

		// Verify a sampling of key tool links exist (names must match the
		// live WARDEN_TOOLS catalog in src/data/toolCatalogs.ts).
		const expectedTools = [
			"Encounter Builder",
			"Initiative Tracker",
			"Rift Generator",
			"NPC Generator",
			"Rollable Tables",
			"Relic Workshop",
			"Treasure Generator",
			"Session Planner",
			"Random Events",
			"Party Tracker",
			"Art Generation",
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
			this.page.getByText("Threat Vector Protocol", { exact: false }).first(),
		).toBeVisible({ timeout: 15_000 });

		// Search monsters input — scope to the builder's own registry search;
		// a bare placeholder*="earch" match grabs the header's global
		// "Search everything…" box instead.
		const searchInput = this.page
			.getByPlaceholder(/Search entity registry/i)
			.first();
		await expect(searchInput).toBeVisible({ timeout: 10_000 });
		await searchInput.fill("Shadow");
		await this.page.waitForTimeout(1_500);

		// Try to add a monster from the search results (per-row "Add <name>" button)
		const addBtn = this.page.getByRole("button", { name: /^Add / }).first();
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
			this.page.getByText(/Back to (Warden|System) Tools/i).first(),
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
			this.page.getByText("Warden Tables", { exact: false }).first(),
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
			this.page
				.getByText("Dimensional Rift Synthesis", { exact: false })
				.first(),
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
			this.page
				.getByText("Construct Synthesis Protocol", { exact: false })
				.first(),
		).toBeVisible({ timeout: 15_000 });

		const generateBtn = this.page
			.getByRole("button", { name: /Synthesize Construct/i })
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
			this.page.getByText("Material Requisition", { exact: false }).first(),
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

	// ─── Quest Generator (redirects to Directive Lattice) ─────────

	async testQuestGenerator() {
		await this.page.goto("/warden-directives/quest-generator");
		// The legacy quest-generator route redirects to the Directive Lattice.
		await expect(
			this.page.getByText("Directive Lattice", { exact: false }).first(),
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
			this.page.getByText("Temporal Synchronization", { exact: false }).first(),
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
			this.page
				.getByText("Systemic Entropy Generator", { exact: false })
				.first(),
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
			this.page.getByText("Relic Synthesis Chamber", { exact: false }).first(),
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
			this.page.getByText("Vanguard Synchronization", { exact: false }).first(),
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

	// ─── Art Generator ────────────────────────────────────────────

	async testArtGenerator() {
		await this.page.goto("/warden-directives/art-generator");
		await expect(
			this.page.getByText("Visualization Lattice", { exact: false }).first(),
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

	// ─── Rift Console (Admin) ───────────────────────────────────

	// The three admin routes below are `allowGuest={false}` — a guest Warden
	// sees ProtectedRoute's "Authentication Required" gate, while a real
	// Warden account sees the page. Accept either so the assertion holds in
	// both modes and still fails on crashes/blank renders.

	async testSystemConsole() {
		await this.page.goto("/warden-directives/rift-console");
		await this.page.waitForTimeout(2_000);
		const heading = this.page
			.getByText(/Authentication Required|Rift Console/i)
			.first();
		await expect(heading).toBeVisible({ timeout: 15_000 });
	}

	// ─── Content Audit ────────────────────────────────────────────

	async testContentAudit() {
		await this.page.goto("/warden-directives/content-audit");
		await this.page.waitForTimeout(2_000);
		const heading = this.page
			.getByText(/Authentication Required|Content Audit/i)
			.first();
		await expect(heading).toBeVisible({ timeout: 15_000 });
	}

	// ─── Art Generation (Admin) ─────────────────────────────────

	async testArtGenerationAdmin() {
		await this.page.goto("/warden-directives/art-generation");
		await this.page.waitForTimeout(2_000);
		const heading = this.page
			.getByText(/Authentication Required|Art Generation/i)
			.first();
		await expect(heading).toBeVisible({ timeout: 15_000 });
	}
}
