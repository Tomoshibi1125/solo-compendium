import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";

const _PLAYER_PASSWORD = process.env.E2E_PLAYER_PASSWORD ?? "test1234";

test.describe
	.serial("Player persistence: reload restores state", () => {
		let playerContext: BrowserContext;
		let playerPage: Page;

		const createAuthedPlayerPage = async (browser: any) => {
			const context = await browser.newContext();
			const page = await context.newPage();
			const auth = new AuthPage(page);
			await auth.continueAsGuest("player");
			return { context, page };
		};

		const openFirstCharacterSheet = async (page: Page) => {
			await page.goto("/characters");
			const characterCard = page
				.locator('[data-testid="character-card"]')
				.first();
			await expect(characterCard).toBeVisible({ timeout: 15_000 });
			await characterCard.click();
			await expect(page).toHaveURL(/\/characters\//, { timeout: 20_000 });
			await expect(
				page.getByRole("button", { name: "Back to Characters" }),
			).toBeVisible({ timeout: 20_000 });
			await expect(page.getByText("HIT POINTS", { exact: true })).toBeVisible({
				timeout: 20_000,
			});
		};

		const getSpellSlotSummary = async (page: Page) => {
			const slotDecreaseCount = await page
				.locator('[data-testid^="spell-slot-decrease-tier-"]')
				.count();
			if (slotDecreaseCount === 0) {
				return { slotDecreaseCount, firstContainerText: null as string | null };
			}

			const slotDecreaseBtn = page
				.locator('[data-testid^="spell-slot-decrease-tier-"]')
				.first();
			await expect(slotDecreaseBtn).toBeVisible({ timeout: 10_000 });
			const slotContainer = slotDecreaseBtn.locator(
				'xpath=ancestor::div[contains(@class,"flex")]',
			);
			const firstContainerText = (await slotContainer.innerText()).trim();
			return { slotDecreaseCount, firstContainerText };
		};

		test.beforeAll(async ({ browser }) => {
			const session = await createAuthedPlayerPage(browser);
			playerContext = session.context;
			playerPage = session.page;

			// Navigate to character registry
			await playerPage.goto("/characters");

			// Wait for character registry to be visible - check for the heading text
			await expect(playerPage.locator("h1")).toContainText(
				"ASCENDANT REGISTRY",
				{ timeout: 15_000 },
			);
		});

		test.afterAll(async () => {
			await playerContext?.close();
		});

		test("character sheet: spell slots persist after reload", async ({
			browser,
		}) => {
			await openFirstCharacterSheet(playerPage);

			const initial = await getSpellSlotSummary(playerPage);
			if (initial.slotDecreaseCount === 0) {
				await playerPage.reload();
				await expect(
					playerPage.getByRole("button", { name: "Back to Characters" }),
				).toBeVisible({ timeout: 15_000 });
				const reloaded = await getSpellSlotSummary(playerPage);
				expect(reloaded.slotDecreaseCount).toBe(0);

				const newSession = await createAuthedPlayerPage(browser);
				try {
					await openFirstCharacterSheet(newSession.page);
					const fresh = await getSpellSlotSummary(newSession.page);
					expect(fresh.slotDecreaseCount).toBe(0);
				} finally {
					await newSession.context.close();
				}
				return;
			}

			const slotDecreaseBtn = playerPage
				.locator('[data-testid^="spell-slot-decrease-tier-"]')
				.first();
			await slotDecreaseBtn.click();
			await playerPage.waitForTimeout(1000);

			await playerPage.reload();
			await expect(
				playerPage.getByRole("button", { name: "Back to Characters" }),
			).toBeVisible({ timeout: 15_000 });
			const reloaded = await getSpellSlotSummary(playerPage);
			expect(reloaded.slotDecreaseCount).toBe(initial.slotDecreaseCount);
			expect(reloaded.firstContainerText).not.toBe(initial.firstContainerText);

			const newSession = await createAuthedPlayerPage(browser);
			try {
				await openFirstCharacterSheet(newSession.page);
				const fresh = await getSpellSlotSummary(newSession.page);
				expect(fresh.slotDecreaseCount).toBe(reloaded.slotDecreaseCount);
				expect(fresh.firstContainerText).toBe(reloaded.firstContainerText);
			} finally {
				await newSession.context.close();
			}
		});

		test("character sheet: resources/HP persist after reload", async ({
			browser,
		}) => {
			if (!playerPage.url().includes("/characters/")) {
				await openFirstCharacterSheet(playerPage);
			}

			await expect(
				playerPage.getByText("HIT POINTS", { exact: true }),
			).toBeVisible({ timeout: 15_000 });
			await expect(
				playerPage.locator('[data-testid="hp-current-display"]').first(),
			).toBeVisible({ timeout: 15_000 });

			const deltaInput = playerPage
				.locator('[data-testid="hp-delta-input"]')
				.first();
			await expect(deltaInput).toBeVisible({ timeout: 10_000 });

			const initialDisplayed = (
				await playerPage
					.locator('[data-testid="hp-current-display"]')
					.first()
					.innerText()
			).trim();
			await deltaInput.fill("1");
			await playerPage
				.locator('[data-testid="hp-damage-button"]')
				.first()
				.click();

			await playerPage.waitForTimeout(1000);

			await playerPage.reload();
			await expect(
				playerPage.getByRole("button", { name: "Back to Characters" }),
			).toBeVisible({ timeout: 15_000 });
			const reloadedDisplayed = (
				await playerPage
					.locator('[data-testid="hp-current-display"]')
					.first()
					.innerText()
			).trim();

			expect(reloadedDisplayed).not.toBe(initialDisplayed);

			// New browser context should also restore
			const newSession = await createAuthedPlayerPage(browser);
			try {
				await openFirstCharacterSheet(newSession.page);

				await expect(
					newSession.page.getByRole("button", { name: "Back to Characters" }),
				).toBeVisible({ timeout: 15_000 });
				const freshDisplayed = (
					await newSession.page
						.locator('[data-testid="hp-current-display"]')
						.first()
						.innerText()
				).trim();
				expect(freshDisplayed).toBe(reloadedDisplayed);
			} finally {
				await newSession.context.close();
			}
		});
	});
