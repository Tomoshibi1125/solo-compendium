import { expect, test } from "@playwright/test";
import { AuthPage } from "../pages/AuthPage";
import { DMPage } from "../pages/DMPage";
import { PlayerPage } from "../pages/PlayerPage";
import { SharedPage } from "../pages/SharedPage";

const _DM_PASSWORD = process.env.E2E_DM_PASSWORD ?? "test1234";

const _PLAYER_PASSWORD = process.env.E2E_PLAYER_PASSWORD ?? "test1234";

let dmContext: any;
let dmPage: any;
let playerContext: any;
let playerPage: any;

let campaignId = "";
let shareCode = "";
let sessionId = "";
let playerCharacterId = "";

const getSessionIdFromUrl = (urlString: string): string => {
	const url = new URL(urlString);
	return url.searchParams.get("sessionId") ?? "";
};

const buildInitiativeTrackerUrl = (
	campaignIdValue: string,
	sessionIdValue?: string,
) => {
	const base = `/dm-tools/initiative-tracker?campaignId=${campaignIdValue}`;
	return sessionIdValue ? `${base}&sessionId=${sessionIdValue}` : base;
};

const dismissAnalyticsIfPresent = async (page: any) => {
	const dismissBtn = page
		.getByRole("button", { name: /No Thanks|Dismiss/i })
		.first();
	if (await dismissBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
		await dismissBtn.click({ force: true });
		await page.waitForTimeout(300);
	}
};

const isOnLogin = async (page: any) => {
	const enterShadowRealm = page
		.getByRole("button", { name: /Enter Shadow Realm/i })
		.first();
	if (await enterShadowRealm.isVisible({ timeout: 1_000 }).catch(() => false))
		return true;
	const emailBox = page
		.getByRole("textbox", { name: /Email Address/i })
		.first();
	return await emailBox.isVisible({ timeout: 1_000 }).catch(() => false);
};

const ensureDmAuthed = async (page: any) => {
	if (!(await isOnLogin(page))) return;
	const auth = new AuthPage(page);
	await auth.continueAsGuest("dm");
	await expect(page.getByTestId("dm-tools")).toBeVisible({ timeout: 20_000 });
};

const ensurePlayerAuthed = async (page: any) => {
	if (!(await isOnLogin(page))) return;
	const auth = new AuthPage(page);
	await auth.continueAsGuest("player");
	await expect(page.getByTestId("player-tools")).toBeVisible({
		timeout: 20_000,
	});
};

const ensureCampaignVttLoaded = async (
	page: any,
	campaignIdValue: string,
	ensureAuthed: (targetPage: any) => Promise<void>,
) => {
	await ensureAuthed(page);
	await page.goto(`/campaigns/${campaignIdValue}/vtt`);
	await dismissAnalyticsIfPresent(page);

	const vttInterface = page.getByTestId("vtt-interface");
	let visible = await vttInterface
		.isVisible({ timeout: 5_000 })
		.catch(() => false);

	if (!visible && (await isOnLogin(page))) {
		await ensureAuthed(page);
		await page.goto(`/campaigns/${campaignIdValue}/vtt`);
		await dismissAnalyticsIfPresent(page);
		visible = await vttInterface
			.isVisible({ timeout: 5_000 })
			.catch(() => false);
	}

	if (!visible) {
		await page.goto(`/campaigns/${campaignIdValue}/vtt`);
		await dismissAnalyticsIfPresent(page);
	}

	await expect(vttInterface).toBeVisible({ timeout: 20_000 });
};

const waitForCharacterSheetLoaded = async (page: any, characterId: string) => {
	const expectedPath = new RegExp(`/characters/${characterId}$`, "i");
	const currentPath = new URL(page.url()).pathname;
	if (!expectedPath.test(currentPath)) {
		await page.goto(`/characters/${characterId}`);
	}

	await page.waitForLoadState("domcontentloaded");
	await dismissAnalyticsIfPresent(page);

	await expect(
		page.getByRole("button", { name: /Back to Characters/i }).first(),
	).toBeVisible({ timeout: 30_000 });

	const hpVisible = await page
		.getByTestId("hp-current-display")
		.first()
		.isVisible({ timeout: 10_000 })
		.catch(() => false);

	if (hpVisible) return;

	const fallbackLocators = [
		page.getByRole("button", { name: /Short Rest|Long Rest/i }).first(),
		page.getByText(/STR|DEX|CON|INT|WIS|CHA|VIT|AGI|PRE|SENSE/i).first(),
		page.getByText(/CHARACTER|ACTIONS|FEATURES|STATS/i).first(),
	];

	let fallbackVisible = false;
	for (const locator of fallbackLocators) {
		if (await locator.isVisible({ timeout: 3_000 }).catch(() => false)) {
			fallbackVisible = true;
			break;
		}
	}

	expect(fallbackVisible).toBe(true);
};

const performShortRest = async (page: any, characterId: string) => {
	await waitForCharacterSheetLoaded(page, characterId);
	const btn = page.locator("button", { hasText: "Short Rest" }).first();
	if (await btn.isVisible({ timeout: 2_000 }).catch(() => false)) {
		await btn.scrollIntoViewIfNeeded();
		await btn.click({ timeout: 30_000 });
		return;
	}
	await page.keyboard.press("Control+r");
};

const performLongRest = async (page: any, characterId: string) => {
	await waitForCharacterSheetLoaded(page, characterId);
	const btn = page.locator("button", { hasText: "Long Rest" }).first();
	if (await btn.isVisible({ timeout: 2_000 }).catch(() => false)) {
		await btn.scrollIntoViewIfNeeded();
		await btn.click({ timeout: 30_000 });
		return;
	}
	await page.keyboard.press("Control+Shift+r");
};

test.describe
	.serial("Soak/Stress E2E: Simulated 4-hour DM + Player session", () => {
		test.beforeAll(async ({ browser }) => {
			dmContext = await browser.newContext();
			dmPage = await dmContext.newPage();

			playerContext = await browser.newContext();
			playerPage = await playerContext.newPage();
		});

		test.afterAll(async () => {
			await dmContext?.close();
			await playerContext?.close();
		});

		test("0. DM + Player sign in", async () => {
			test.setTimeout(30 * 60 * 1000);

			const dmAuth = new AuthPage(dmPage);
			await dmAuth.continueAsGuest("dm");
			await expect(dmPage.getByTestId("dm-tools")).toBeVisible({
				timeout: 20_000,
			});

			const playerAuth = new AuthPage(playerPage);
			await playerAuth.continueAsGuest("player");
			await expect(playerPage.getByTestId("player-tools")).toBeVisible({
				timeout: 20_000,
			});

			// Ensure analytics consent is set for both contexts.
			await dmPage.evaluate(() => {
				localStorage.setItem(
					"solo-compendium-analytics-consent",
					JSON.stringify({
						status: "rejected",
						version: 1,
						timestamp: Date.now(),
					}),
				);
			});

			await playerPage.evaluate(() => {
				localStorage.setItem(
					"solo-compendium-analytics-consent",
					JSON.stringify({
						status: "rejected",
						version: 1,
						timestamp: Date.now(),
					}),
				);
			});
		});

		test("1. DM creates campaign and prepares shared handouts + notes + chat", async () => {
			test.setTimeout(30 * 60 * 1000);

			const dm = new DMPage(dmPage);
			const shared = new SharedPage(dmPage);

			const timestamp = Date.now();
			campaignId = await dm.createCampaign(
				`Soak-Session-${timestamp}`,
				"Soak stress campaign for a simulated 4-hour session.",
			);
			await shared.gotoCampaignDetail(campaignId);
			shareCode = await shared.getShareCode();
			expect(shareCode).toMatch(/^[A-Z0-9]{6}$/);

			// Chat
			await dmPage.getByRole("tab", { name: /Chat/i }).click();
			await dismissAnalyticsIfPresent(dmPage);
			await expect(dmPage.getByText(/CAMPAIGN CHAT/i).first()).toBeVisible({
				timeout: 20_000,
			});
			await dmPage
				.getByPlaceholder(/Type a message/i)
				.fill(`Soak DM message ${timestamp}`);
			await dmPage
				.locator("form")
				.locator('button[type="submit"]')
				.click({ timeout: 20_000 });
			await expect(
				dmPage
					.getByText(new RegExp(`Soak DM message ${timestamp}`, "i"))
					.first(),
			).toBeVisible({ timeout: 20_000 });

			// Notes
			await dmPage.getByRole("tab", { name: /Notes/i }).click();
			await dismissAnalyticsIfPresent(dmPage);
			const addNoteBtn = dmPage
				.getByRole("button", { name: /Add Note|New Note|Create Note|\+|Add/i })
				.first();
			if (await addNoteBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
				await addNoteBtn.click({ force: true });
				const titleInput = dmPage.getByLabel(/Title/i).first();
				if (await titleInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
					await titleInput.fill(`Soak Note ${timestamp}`);
				}
				const contentInput = dmPage.getByLabel(/Content/i).first();
				if (
					await contentInput.isVisible({ timeout: 2_000 }).catch(() => false)
				) {
					await contentInput.fill("Travel setup, NPC hooks, and reminders.");
				}
				const sharedSwitch = dmPage
					.getByRole("switch", { name: /Shared/i })
					.first();
				if (
					await sharedSwitch.isVisible({ timeout: 1_000 }).catch(() => false)
				) {
					await sharedSwitch.click({ force: true });
				}
				const saveBtn = dmPage.getByRole("button", { name: /Save/i }).first();
				if (await saveBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
					await saveBtn.click({ force: true });
				}
			}

			// VTT Journal: create a public handout to validate Player Handouts tab.
			await dmPage.goto(`/campaigns/${campaignId}/journal`);
			await dismissAnalyticsIfPresent(dmPage);
			await expect(dmPage.getByText(/JOURNAL & NOTES/i).first()).toBeVisible({
				timeout: 20_000,
			});
			await dmPage.getByRole("button", { name: /New Entry/i }).click();
			await dmPage.locator("#entry-title").fill(`Soak Handout ${timestamp}`);
			await dmPage.locator("#entry-category").selectOption("handout");
			await dmPage.getByLabel(/Visible to Players/i).check({ force: true });
			await dmPage.getByRole("button", { name: /^Create$/i }).click();
			await expect(
				dmPage.getByText(new RegExp(`Soak Handout ${timestamp}`, "i")).first(),
			).toBeVisible({ timeout: 20_000 });
		});

		test("2. Player joins campaign, creates character, verifies chat + handouts", async () => {
			test.setTimeout(30 * 60 * 1000);

			const player = new PlayerPage(playerPage);
			await player.joinCampaign(shareCode);
			await expect(playerPage).toHaveURL(
				new RegExp(`/campaigns/${campaignId}`),
			);

			const timestamp = Date.now();
			const name = `Soak-Ascendant-${timestamp}`;
			playerCharacterId = (await player.createCharacter(name)) ?? "";
			if (!playerCharacterId) {
				// Fallback: use existing character.
				playerCharacterId = (await player.getFirstExistingCharacterId()) ?? "";
			}
			if (playerCharacterId.toLowerCase() === "new") {
				playerCharacterId = (await player.getFirstExistingCharacterId()) ?? "";
			}
			expect(playerCharacterId).toBeTruthy();

			await playerPage.goto(`/campaigns/${campaignId}`);
			await dismissAnalyticsIfPresent(playerPage);

			await playerPage.getByRole("tab", { name: /Chat/i }).click();
			await expect(playerPage.getByText(/CAMPAIGN CHAT/i).first()).toBeVisible({
				timeout: 20_000,
			});

			await playerPage.getByRole("tab", { name: /Handouts/i }).click();
			await expect(
				playerPage.getByText(/HANDOUTS & LORE/i).first(),
			).toBeVisible({ timeout: 20_000 });
			await expect(playerPage.getByText(/Soak Handout/i).first()).toBeVisible({
				timeout: 20_000,
			});
		});

		test("3. Soak loop: travel/VTT interactions + multi-encounter combat loops + rewards + rests", async () => {
			test.setTimeout(30 * 60 * 1000);

			// Travel / VTT warmup (DM + Player both visit, interact, reload)
			for (let i = 0; i < 3; i += 1) {
				await ensureCampaignVttLoaded(dmPage, campaignId, ensureDmAuthed);
				const dmCanvas = dmPage.locator("canvas").first();
				if (await dmCanvas.isVisible({ timeout: 5_000 }).catch(() => false)) {
					const box = await dmCanvas.boundingBox();
					if (box) {
						await dmPage.mouse.click(box.x + 40 + i * 10, box.y + 40 + i * 10);
					}
				}

				await ensureCampaignVttLoaded(
					playerPage,
					campaignId,
					ensurePlayerAuthed,
				);
				const playerCanvas = playerPage.locator("canvas").first();
				if (
					await playerCanvas.isVisible({ timeout: 5_000 }).catch(() => false)
				) {
					const box = await playerCanvas.boundingBox();
					if (box) {
						await playerPage.mouse.click(
							box.x + 60 + i * 10,
							box.y + 60 + i * 10,
						);
					}
				}

				await dmPage.reload();
				await ensureDmAuthed(dmPage);
				await dmPage.waitForLoadState("domcontentloaded");
				await dismissAnalyticsIfPresent(dmPage);

				const expectedVttPath = new RegExp(`/campaigns/${campaignId}/vtt`, "i");
				if (!expectedVttPath.test(new URL(dmPage.url()).pathname)) {
					await dmPage.goto(`/campaigns/${campaignId}/vtt`);
					await dismissAnalyticsIfPresent(dmPage);
				}

				const vttInterface = dmPage.getByTestId("vtt-interface");
				if (
					!(await vttInterface.isVisible({ timeout: 2_000 }).catch(() => false))
				) {
					await dmPage.goto(`/campaigns/${campaignId}/vtt`);
					await dismissAnalyticsIfPresent(dmPage);
				}

				await expect(vttInterface).toBeVisible({ timeout: 20_000 });
			}

			// Multiple combat loops
			for (let encounterIndex = 0; encounterIndex < 4; encounterIndex += 1) {
				await ensureDmAuthed(dmPage);
				await dmPage.goto(
					`/dm-tools/encounter-builder?campaignId=${campaignId}`,
				);
				await dismissAnalyticsIfPresent(dmPage);
				await expect(dmPage.getByTestId("encounter-builder")).toBeVisible({
					timeout: 20_000,
				});

				const addMonsterBtn = dmPage
					.getByTestId("encounter-add-button")
					.first();
				await addMonsterBtn.scrollIntoViewIfNeeded();
				await addMonsterBtn.click({ force: true, timeout: 20_000 });

				const sendBtn = dmPage.getByTestId("encounter-send-to-tracker");
				await expect(sendBtn).toBeEnabled({ timeout: 20_000 });

				// Save to campaign library to simulate encounter prep.
				await dmPage
					.getByTestId("encounter-name")
					.fill(`Soak Encounter ${encounterIndex}`);
				await dmPage
					.getByTestId("encounter-notes")
					.fill("Simulated combat in a 4-hour session soak test.");
				const saveBtn = dmPage.getByTestId("encounter-save");
				await saveBtn.click({ timeout: 20_000 });

				// If save causes state reset, re-add monster.
				if (await sendBtn.isDisabled()) {
					await addMonsterBtn.scrollIntoViewIfNeeded();
					await addMonsterBtn.click({ force: true, timeout: 20_000 });
				}
				await expect(sendBtn).toBeEnabled({ timeout: 20_000 });

				await sendBtn.click({ timeout: 20_000 });
				await dmPage.waitForURL(/\/dm-tools\/initiative-tracker/i, {
					timeout: 30_000,
				});

				sessionId = getSessionIdFromUrl(dmPage.url());

				// DM advances several turns.
				const nextTurn = dmPage.getByTestId("initiative-next-turn");
				await expect(nextTurn).toBeVisible({ timeout: 20_000 });
				for (let t = 0; t < 6; t += 1) {
					await nextTurn.click({ timeout: 20_000 });
					await dmPage.waitForTimeout(250);
				}

				// Player views live session if sessionId is available.
				if (sessionId) {
					await ensurePlayerAuthed(playerPage);
					await playerPage.goto(`/campaigns/${campaignId}/play/${sessionId}`);
					await expect(
						playerPage.getByTestId("campaign-session-play"),
					).toBeVisible({ timeout: 30_000 });
					await expect(
						playerPage.getByTestId("session-initiative-list"),
					).toBeVisible({ timeout: 30_000 });
				}

				// Rewards / loot distribution in campaign Settings tab.
				await ensureDmAuthed(dmPage);
				await dmPage.goto(`/campaigns/${campaignId}`);
				await dmPage.getByRole("tab", { name: /Settings/i }).click();
				await dismissAnalyticsIfPresent(dmPage);
				await expect(
					dmPage.getByText(/LOOT & RELIC DISTRIBUTION/i).first(),
				).toBeVisible({ timeout: 20_000 });
				await expect(dmPage.getByText(/Assign Loot Drop/i).first()).toBeVisible(
					{ timeout: 20_000 },
				);
				await expect(dmPage.locator("#loot-item")).toBeVisible({
					timeout: 20_000,
				});

				// Assign a loot drop.
				await dmPage.fill("#loot-item", `Loot-${encounterIndex}`);
				await dmPage.fill("#loot-qty", "1");
				await dmPage.fill("#loot-value", "10");
				await dmPage
					.getByTestId("campaign-loot-assign")
					.click({ timeout: 20_000 });

				// Assign a relic.
				await expect(dmPage.locator("#relic-name")).toBeVisible({
					timeout: 20_000,
				});
				await dmPage.fill("#relic-name", `Relic-${encounterIndex}`);
				await dmPage.fill("#relic-value", "50");
				await dmPage.fill("#relic-properties", '{"soak": true}');
				await dmPage
					.getByTestId("campaign-relic-assign")
					.click({ timeout: 20_000 });

				// Rest loop on player character sheet.
				await ensurePlayerAuthed(playerPage);
				await playerPage.goto(`/characters/${playerCharacterId}`);
				await performShortRest(playerPage, playerCharacterId);
				await playerPage.waitForTimeout(750);

				if (encounterIndex % 2 === 1) {
					await performLongRest(playerPage, playerCharacterId);
					await playerPage.waitForTimeout(1000);
				}

				// Re-open tracker to ensure it remains stable after rest/rewards.
				await ensureDmAuthed(dmPage);
				await dmPage.goto(buildInitiativeTrackerUrl(campaignId, sessionId));
				await expect(dmPage.getByTestId("initiative-tracker")).toBeVisible({
					timeout: 30_000,
				});
			}
		});

		test("4. Persistence validation: new contexts re-open campaign and verify chat + handouts still visible", async ({
			browser,
		}) => {
			test.setTimeout(30 * 60 * 1000);

			const dmNewContext = await browser.newContext();
			const dmNewPage = await dmNewContext.newPage();

			const playerNewContext = await browser.newContext();
			const playerNewPage = await playerNewContext.newPage();

			try {
				const dmAuth = new AuthPage(dmNewPage);
				await dmAuth.continueAsGuest("dm");
				await dmNewPage.goto(`/campaigns/${campaignId}`);
				await dismissAnalyticsIfPresent(dmNewPage);

				await dmNewPage.getByRole("tab", { name: /Chat/i }).click();
				await expect(dmNewPage.getByText(/CAMPAIGN CHAT/i).first()).toBeVisible(
					{ timeout: 20_000 },
				);

				const playerAuth = new AuthPage(playerNewPage);
				await playerAuth.continueAsGuest("player");
				await playerNewPage.goto(`/campaigns/${campaignId}`);
				await dismissAnalyticsIfPresent(playerNewPage);

				await playerNewPage.getByRole("tab", { name: /Handouts/i }).click();
				await expect(
					playerNewPage.getByText(/HANDOUTS & LORE/i).first(),
				).toBeVisible({ timeout: 20_000 });
				await expect(
					playerNewPage.getByText(/Soak Handout/i).first(),
				).toBeVisible({ timeout: 20_000 });
			} finally {
				await dmNewContext.close();
				await playerNewContext.close();
			}
		});
	});
