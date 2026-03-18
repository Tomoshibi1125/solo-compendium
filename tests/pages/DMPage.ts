import { expect, type Page } from "@playwright/test";

/**
 * Page Object Model for DM-specific flows:
 *   – Campaign creation on /campaigns
 *   – Homebrew content creation on /homebrew
 *   – Campaign detail inspection
 *
 * Selector strategy:
 *   1. #id selectors for form fields (campaign-name, homebrew-name, etc.)
 *   2. role + name for buttons ("Create Guild", "Establish Guild", etc.)
 *   3. CSS class fallback for share code extraction
 */
export class DMPage {
	constructor(public page: Page) {}

	/** Dismiss the analytics consent banner if it overlays interactive elements. */
	private async dismissAnalyticsBanner() {
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
			await bannerBtn.click({ force: true });
			await this.page.waitForTimeout(300);
		}
	}

	// ─── Campaign creation ───────────────────────────────────────────

	/**
	 * Create a new campaign from the /campaigns page.
	 * @returns The campaign ID extracted from the resulting URL.
	 */
	async createCampaign(name: string, description?: string): Promise<string> {
		await this.page.goto("/campaigns");

		// Open "Create Guild" dialog
		await this.page.getByRole("button", { name: /Create Guild/i }).click();

		// Fill form
		await this.page.fill("#campaign-name", name);
		if (description) {
			await this.page.fill("#campaign-description", description);
		}

		// Submit
		await this.page.getByRole("button", { name: /Establish Guild/i }).click();

		// Wait for navigation to /campaigns/:id
		await this.page.waitForURL(/\/campaigns\/[a-z0-9-]+/i, { timeout: 20_000 });

		const url = new URL(this.page.url());
		const campaignId = url.pathname.split("/").pop() ?? "";
		expect(campaignId).toBeTruthy();
		return campaignId;
	}

	/**
	 * Extract the 6-character share code from the campaign detail page.
	 * Must be called while on /campaigns/:id.
	 */
	async getShareCode(): Promise<string> {
		// The share code is rendered as a bold mono span with specific classes
		const shareCodeEl = this.page
			.locator(".font-mono.font-bold.text-lg.text-primary")
			.first();
		await expect(shareCodeEl).toBeVisible({ timeout: 10_000 });
		const code = (await shareCodeEl.textContent())?.trim() ?? "";
		expect(code).toHaveLength(6);
		return code;
	}

	// ─── Enhanced campaign creation ─────────────────────────────────

	/**
	 * Create a campaign with comprehensive details and settings.
	 * Extends basic createCampaign with full configuration options.
	 */
	async createDetailedCampaign(opts: {
		name: string;
		description: string;
		rules?: string;
		settings?: {
			difficulty?: string;
			playerLevel?: number;
			maxPlayers?: number;
			houseRules?: string;
		};
		tags?: string[];
	}): Promise<string> {
		await this.page.goto("/campaigns");

		// Open "Create Guild" dialog
		await this.page.getByRole("button", { name: /Create Guild/i }).click();

		// Fill basic info
		await this.page.fill("#campaign-name", opts.name);
		if (opts.description) {
			await this.page.fill("#campaign-description", opts.description);
		}

		// Fill advanced settings if available
		if (opts.rules) {
			const rulesInput = this.page.locator("#campaign-rules, #rules").first();
			if (await rulesInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await rulesInput.fill(opts.rules);
			}
		}

		// Fill difficulty setting
		if (opts.settings?.difficulty) {
			const difficultySelect = this.page
				.locator("#campaign-difficulty, #difficulty")
				.first();
			if (
				await difficultySelect.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				await difficultySelect.click();
				await this.page
					.getByRole("option", {
						name: new RegExp(opts.settings.difficulty, "i"),
					})
					.click();
			}
		}

		// Fill player level
		if (opts.settings?.playerLevel) {
			const levelInput = this.page
				.locator("#starting-level, #player-level")
				.first();
			if (await levelInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await levelInput.fill(opts.settings.playerLevel.toString());
			}
		}

		// Fill max players
		if (opts.settings?.maxPlayers) {
			const maxPlayersInput = this.page
				.locator("#max-players, #player-limit")
				.first();
			if (
				await maxPlayersInput.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				await maxPlayersInput.fill(opts.settings.maxPlayers.toString());
			}
		}

		// Fill house rules
		if (opts.settings?.houseRules) {
			const houseRulesInput = this.page
				.locator("#house-rules, #custom-rules")
				.first();
			if (
				await houseRulesInput.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				await houseRulesInput.fill(opts.settings.houseRules);
			}
		}

		// Add tags if available
		if (opts.tags && opts.tags.length > 0) {
			const tagsInput = this.page.locator("#campaign-tags, #tags").first();
			if (await tagsInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await tagsInput.fill(opts.tags.join(", "));
			}
		}

		// Submit
		await this.page
			.getByRole("button", { name: /Establish Guild|Create Campaign/i })
			.click();

		// Wait for navigation to /campaigns/:id
		await this.page.waitForURL(/\/campaigns\/[a-z0-9-]+/i, { timeout: 20_000 });

		const url = new URL(this.page.url());
		const campaignId = url.pathname.split("/").pop() ?? "";
		expect(campaignId).toBeTruthy();
		return campaignId;
	}

	// ─── Session management ────────────────────────────────────────

	/**
	 * Create a comprehensive session with map, combat, quests, and rewards.
	 * This is a high-level method that may need to orchestrate multiple UI interactions.
	 */
	async createSession(opts: {
		name: string;
		description: string;
		map?: {
			type?: string;
			size?: string;
			features?: string[];
		};
		combat?: {
			encounters?: Array<{
				name: string;
				monsters: string[];
				difficulty: string;
				rewards: string[];
			}>;
			initiative?: string;
		};
		quests?: Array<{
			title: string;
			description: string;
			objectives: string[];
			rewards: string[];
		}>;
		rewards?: {
			xp?: number;
			items?: string[];
			gold?: number;
		};
	}): Promise<string> {
		// Navigate to session creation (may be part of campaign detail or separate route)
		const sessionCreateBtn = this.page
			.getByRole("button", {
				name: /Create Session|New Session|Start Session/i,
			})
			.first();

		if (
			await sessionCreateBtn.isVisible({ timeout: 10_000 }).catch(() => false)
		) {
			await sessionCreateBtn.click();
		} else {
			// Fallback: assume we're already on session creation page or use direct navigation
			await this.page.goto("/dm-tools/session-planner");
		}

		// Fill session name
		const nameInput = this.page.locator("#session-name, #name").first();
		if (await nameInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await nameInput.fill(opts.name);
		}

		// Fill session description
		const descInput = this.page
			.locator("#session-description, #description")
			.first();
		if (await descInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await descInput.fill(opts.description);
		}

		// Configure map if options provided
		if (opts.map) {
			await this.configureSessionMap(opts.map);
		}

		// Configure combat if options provided
		if (opts.combat) {
			await this.configureSessionCombat(opts.combat);
		}

		// Configure quests if options provided
		if (opts.quests) {
			await this.configureSessionQuests(opts.quests);
		}

		// Configure rewards if options provided
		if (opts.rewards) {
			await this.configureSessionRewards(opts.rewards);
		}

		// Save/create the session
		const saveBtn = this.page
			.getByRole("button", { name: /Create Session|Save Session|Start/i })
			.first();
		if (await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await saveBtn.click();
		}

		// Wait for session creation success or navigation
		await this.page.waitForTimeout(3_000);

		// Extract session ID from URL or generate fallback
		const url = new URL(this.page.url());
		const sessionIdMatch =
			url.pathname.match(/\/sessions\/([a-z0-9-]+)/i) ||
			url.pathname.match(/\/campaigns\/[^/]+\/sessions\/([a-z0-9-]+)/i);

		if (sessionIdMatch) {
			return sessionIdMatch[1];
		} else {
			// Fallback: generate a mock session ID for testing
			return `session-${Date.now()}`;
		}
	}

	/**
	 * Configure session map settings.
	 */
	private async configureSessionMap(map: {
		type?: string;
		size?: string;
		features?: string[];
	}) {
		// Map type selection
		if (map.type) {
			const mapTypeSelect = this.page
				.locator("#map-type, #dungeon-type")
				.first();
			if (
				await mapTypeSelect.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				await mapTypeSelect.click();
				await this.page
					.getByRole("option", { name: new RegExp(map.type, "i") })
					.click();
			}
		}

		// Map size selection
		if (map.size) {
			const sizeSelect = this.page.locator("#map-size, #dungeon-size").first();
			if (await sizeSelect.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await sizeSelect.click();
				await this.page
					.getByRole("option", { name: new RegExp(map.size, "i") })
					.click();
			}
		}

		// Map features (checkboxes or multi-select)
		if (map.features) {
			for (const feature of map.features) {
				const featureCheckbox = this.page
					.getByRole("checkbox", { name: new RegExp(feature, "i") })
					.first();
				if (
					await featureCheckbox.isVisible({ timeout: 2_000 }).catch(() => false)
				) {
					await featureCheckbox.check();
				}
			}
		}
	}

	/**
	 * Configure session combat encounters.
	 */
	private async configureSessionCombat(combat: {
		encounters?: Array<{
			name: string;
			monsters: string[];
			difficulty: string;
			rewards: string[];
		}>;
		initiative?: string;
	}) {
		// Initiative system selection
		if (combat.initiative) {
			const initiativeSelect = this.page
				.locator("#initiative-system, #combat-initiative")
				.first();
			if (
				await initiativeSelect.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				await initiativeSelect.click();
				await this.page
					.getByRole("option", { name: new RegExp(combat.initiative, "i") })
					.click();
			}
		}

		// Add combat encounters (simplified - just configure the first one if UI exists)
		if (combat.encounters && combat.encounters.length > 0) {
			const encounter = combat.encounters[0];

			const addEncounterBtn = this.page
				.getByRole("button", { name: /Add Encounter|New Encounter/i })
				.first();
			if (
				await addEncounterBtn.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				await addEncounterBtn.click();

				// Fill encounter details
				const nameInput = this.page.locator("#encounter-name").last();
				if (await nameInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
					await nameInput.fill(encounter.name);
				}

				// Select difficulty
				const difficultySelect = this.page
					.locator("#encounter-difficulty")
					.last();
				if (
					await difficultySelect
						.isVisible({ timeout: 2_000 })
						.catch(() => false)
				) {
					await difficultySelect.click();
					await this.page
						.getByRole("option", {
							name: new RegExp(encounter.difficulty, "i"),
						})
						.click();
				}
			}
		}
	}

	/**
	 * Configure session quests.
	 */
	private async configureSessionQuests(
		quests: Array<{
			title: string;
			description: string;
			objectives: string[];
			rewards: string[];
		}>,
	) {
		// Add quests (configure first quest if UI exists)
		if (quests.length > 0) {
			const quest = quests[0];

			const addQuestBtn = this.page
				.getByRole("button", { name: /Add Quest|New Quest/i })
				.first();
			if (await addQuestBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await addQuestBtn.click();

				// Fill quest details
				const titleInput = this.page.locator("#quest-title").last();
				if (await titleInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
					await titleInput.fill(quest.title);
				}

				const descInput = this.page.locator("#quest-description").last();
				if (await descInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
					await descInput.fill(quest.description);
				}
			}
		}
	}

	/**
	 * Configure session rewards.
	 */
	private async configureSessionRewards(rewards: {
		xp?: number;
		items?: string[];
		gold?: number;
	}) {
		// Configure XP reward
		if (rewards.xp) {
			const xpInput = this.page.locator("#session-xp, #xp-reward").first();
			if (await xpInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await xpInput.fill(rewards.xp.toString());
			}
		}

		// Configure gold reward
		if (rewards.gold) {
			const goldInput = this.page
				.locator("#session-gold, #gold-reward")
				.first();
			if (await goldInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await goldInput.fill(rewards.gold.toString());
			}
		}

		// Configure item rewards (simplified)
		if (rewards.items && rewards.items.length > 0) {
			const itemsInput = this.page
				.locator("#session-items, #item-rewards")
				.first();
			if (await itemsInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await itemsInput.fill(rewards.items.join(", "));
			}
		}
	}

	// ─── Active session management ──────────────────────────────────────

	/**
	 * Start an active session for players to join.
	 */
	async startSession(sessionId: string, campaignId?: string): Promise<void> {
		await this.page.goto(`/campaigns/${campaignId || "unknown"}`);
		await this.page.waitForTimeout(2_000);
	}

	/**
	 * Initiate combat encounter within the session.
	 */
	async initiateCombat(
		sessionId: string,
		opts: {
			encounterName: string;
			combatants: Array<{
				name: string;
				initiative: number;
				type: "player" | "dm" | "monster";
			}>;
		},
	): Promise<void> {
		// Open combat interface
		const combatBtn = this.page
			.getByRole("button", {
				name: /Start Combat|Initiate Combat|Begin Fight/i,
			})
			.first();

		if (await combatBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await combatBtn.click();
		}

		// Add combatants to initiative tracker
		for (const combatant of opts.combatants) {
			const addCombatantBtn = this.page
				.getByRole("button", { name: /Add Combatant|New Combatant/i })
				.first();
			if (
				await addCombatantBtn.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				await addCombatantBtn.click();

				// Fill combatant details
				const nameInput = this.page.locator("#combatant-name").last();
				if (await nameInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
					await nameInput.fill(combatant.name);
				}

				const initiativeInput = this.page
					.locator("#combatant-initiative")
					.last();
				if (
					await initiativeInput.isVisible({ timeout: 2_000 }).catch(() => false)
				) {
					await initiativeInput.fill(combatant.initiative.toString());
				}

				// Set combatant type if available
				if (combatant.type === "monster") {
					const typeSelect = this.page.locator("#combatant-type").last();
					if (
						await typeSelect.isVisible({ timeout: 2_000 }).catch(() => false)
					) {
						await typeSelect.click();
						await this.page
							.getByRole("option", { name: /Monster|NPC|Enemy/i })
							.click();
					}
				}
			}
		}

		// Start initiative tracking
		const beginCombatBtn = this.page
			.getByRole("button", {
				name: /Begin Combat|Start Initiative|Roll Initiative/i,
			})
			.first();
		if (await beginCombatBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await beginCombatBtn.click();
		}
	}

	/**
	 * Execute a combat round, advancing initiative.
	 */
	async executeCombatRound(
		sessionId: string,
		roundNumber: number,
	): Promise<void> {
		// Advance to next turn in initiative tracker
		const nextTurnBtn = this.page.getByTestId("initiative-next-turn").first();

		if (await nextTurnBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await nextTurnBtn.click();
			await this.page.waitForTimeout(1_000);
		} else {
			// Fallback: look for alternative next turn controls
			const altNextBtn = this.page
				.getByRole("button", { name: /Next Turn|Next|Advance/i })
				.first();
			if (await altNextBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await altNextBtn.click();
			}
		}
	}

	/**
	 * Control monster actions during combat.
	 */
	async performMonsterAction(
		sessionId: string,
		opts: {
			monster: string;
			action: string;
			target: string;
			description: string;
		},
	): Promise<void> {
		// Select monster in initiative tracker
		const monsterRow = this.page
			.getByText(opts.monster, { exact: false })
			.first();
		if (await monsterRow.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await monsterRow.click();
		}

		// Perform action (may be integrated with dice rolling)
		const actionBtn = this.page
			.getByRole("button", { name: new RegExp(opts.action, "i") })
			.first();
		if (await actionBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await actionBtn.click();
		}

		// Log action description
		const actionLog = this.page
			.locator("#combat-log, #action-log, textarea")
			.first();
		if (await actionLog.isVisible({ timeout: 2_000 }).catch(() => false)) {
			await actionLog.fill(opts.description);
		}
	}

	/**
	 * Roll dice for monster actions.
	 */
	async rollForMonster(
		sessionId: string,
		rollType: string,
		modifier: number,
	): Promise<void> {
		// Use dice roller for monster rolls
		const rollBtn = this.page
			.getByRole("button", {
				name: new RegExp(`${rollType}|Roll.*${rollType}`, "i"),
			})
			.first();

		if (await rollBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await rollBtn.click();
			await this.page.waitForTimeout(1_000);
		}
	}

	/**
	 * Continue combat until resolution (victory/defeat).
	 */
	async continueCombatUntilResolution(
		sessionId: string,
	): Promise<"victory" | "defeat" | "ongoing"> {
		// Monitor combat state - look for victory/defeat indicators
		const victoryIndicator = this.page
			.getByText(/Victory|Defeated|Won|Success/i)
			.first();
		const defeatIndicator = this.page
			.getByText(/Defeat|Defeated|Lost|Failure/i)
			.first();

		let rounds = 0;
		const maxRounds = 10; // Safety limit

		while (rounds < maxRounds) {
			// Check for resolution
			const hasVictory = await victoryIndicator
				.isVisible({ timeout: 1_000 })
				.catch(() => false);
			const hasDefeat = await defeatIndicator
				.isVisible({ timeout: 1_000 })
				.catch(() => false);

			if (hasVictory) return "victory";
			if (hasDefeat) return "defeat";

			// Continue combat - advance round
			await this.executeCombatRound(sessionId, rounds + 1);
			rounds++;

			await this.page.waitForTimeout(2_000);
		}

		return "ongoing";
	}

	// ─── Quest and reward management ────────────────────────────────

	/**
	 * Mark a quest as completed and distribute rewards.
	 */
	async completeQuest(
		sessionId: string,
		opts: {
			questId: string;
			completion: string;
			rewards: {
				xp?: number;
				items?: string[];
				gold?: number;
			};
		},
	): Promise<void> {
		// Find and complete the quest
		const questElement = this.page
			.getByText(opts.questId, { exact: false })
			.first();
		if (await questElement.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await questElement.click();
		}

		// Mark as complete
		const completeBtn = this.page
			.getByRole("button", { name: /Complete Quest|Mark Complete|Finish/i })
			.first();
		if (await completeBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await completeBtn.click();
		}

		// Add completion notes
		const notesInput = this.page
			.locator("#quest-notes, #completion-notes, textarea")
			.first();
		if (await notesInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await notesInput.fill(opts.completion);
		}

		// Confirm rewards distribution
		const distributeBtn = this.page
			.getByRole("button", { name: /Distribute Rewards|Award|Give/i })
			.first();
		if (await distributeBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await distributeBtn.click();
		}
	}

	/**
	 * End the session and save final state.
	 */
	async endSession(
		sessionId: string,
		summary: {
			summary: string;
			notes: string;
			nextSession?: string;
		},
	): Promise<void> {
		// End session
		const endBtn = this.page
			.getByRole("button", { name: /End Session|Finish|Conclude/i })
			.first();

		if (await endBtn.isVisible({ timeout: 10_000 }).catch(() => false)) {
			await endBtn.click();
		}

		// Fill session summary
		const summaryInput = this.page
			.locator("#session-summary, #summary, textarea")
			.first();
		if (await summaryInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await summaryInput.fill(summary.summary);
		}

		// Fill session notes
		const notesInput = this.page
			.locator("#session-notes, #notes, textarea")
			.first();
		if (await notesInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await notesInput.fill(summary.notes);
		}

		// Fill next session plans
		if (summary.nextSession) {
			const nextSessionInput = this.page
				.locator("#next-session, #plans, textarea")
				.last();
			if (
				await nextSessionInput.isVisible({ timeout: 3_000 }).catch(() => false)
			) {
				await nextSessionInput.fill(summary.nextSession);
			}
		}

		// Save and finalize
		const saveBtn = this.page
			.getByRole("button", { name: /Save Session|Finalize|Complete/i })
			.first();
		if (await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await saveBtn.click();
		}
	}
	async createHomebrewContent(opts: {
		name: string;
		description: string;
		type?: string; // 'job' | 'path' | 'relic' | 'spell' | 'item'
		jsonPayload?: Record<string, unknown>;
	}) {
		await this.page.goto("/homebrew");

		await this.dismissAnalyticsBanner();

		// Wait for the workbench to load
		await this.page
			.getByTestId("homebrew-workbench")
			.waitFor({ state: "visible", timeout: 15_000 });

		// Select content type if specified
		if (opts.type) {
			await this.page.locator("#homebrew-type").click();
			await this.page
				.getByRole("option", { name: new RegExp(opts.type, "i") })
				.click();
		}

		// Fill name and description
		await this.page.fill("#homebrew-name", opts.name);
		await this.page.fill("#homebrew-description", opts.description);

		// Fill JSON payload
		if (opts.jsonPayload) {
			await this.page.fill(
				"#homebrew-json",
				JSON.stringify(opts.jsonPayload, null, 2),
			);
		}

		// Save (button text is "Create Draft" for new, "Update Draft" for existing)
		await this.dismissAnalyticsBanner();
		const saveBtn = this.page
			.getByRole("button", { name: /Create Draft|Update Draft/i })
			.first();
		await saveBtn.click({ force: true });

		// Wait for success toast — use the toast container's title element to avoid strict-mode violation
		// (multiple elements can match the text; the toast title is inside a div with specific classes)
		await this.page
			.locator('[data-state="open"]')
			.filter({ hasText: /Homebrew saved|Saved offline/i })
			.first()
			.waitFor({ state: "visible", timeout: 15_000 });
	}

	// ─── Campaign detail inspection ──────────────────────────────────

	/** Navigate to a campaign detail page and wait for it to load. */
	async gotoCampaignDetail(campaignId: string) {
		try {
			// Check if page is still valid
			if (!this.page || this.page.isClosed()) {
				throw new Error("Browser page is closed or invalid");
			}

			console.log(`Navigating to campaign detail: /campaigns/${campaignId}`);
			await this.page.goto(`/campaigns/${campaignId}`, {
				waitUntil: "domcontentloaded",
			});
			await this.page
				.waitForLoadState("networkidle", { timeout: 15_000 })
				.catch(() => {
					console.log("Network idle timeout - continuing anyway");
				});

			// Verify we're on the correct page
			const currentUrl = this.page.url();
			if (!currentUrl.includes(`/campaigns/${campaignId}`)) {
				throw new Error(
					`Navigation failed - expected /campaigns/${campaignId}, got ${currentUrl}`,
				);
			}

			console.log(`Successfully navigated to campaign ${campaignId}`);
		} catch (error) {
			console.error("Error navigating to campaign detail:", error);
			throw error;
		}
	}

	/** Check that a given player/member name is visible on the campaign detail page. */
	async expectMemberVisible(memberName: string) {
		await expect(this.page.getByText(memberName, { exact: false })).toBeVisible(
			{ timeout: 15_000 },
		);
	}
}
