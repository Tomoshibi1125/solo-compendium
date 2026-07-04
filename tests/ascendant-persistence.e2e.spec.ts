import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { PlayerPage } from "./pages/PlayerPage";

/**
 * Guest persistence: reloading the tab must restore character state.
 *
 * Guest data lives in this browser context's localStorage ("Guest mode saves
 * data only in this browser"), so the contract under test is same-context
 * reload persistence — cross-context restore is a real-account (Supabase)
 * feature and is intentionally out of scope here.
 */

test.describe
	.serial("Ascendant persistence: reload restores state", () => {
		let playerContext: BrowserContext;
		let playerPage: Page;

		// StatusHeader HP block ("HIT_POINTS  current / max"). The sheet renders
		// desktop AND mobile (`md:hidden`) layouts into the DOM, so filter to
		// the visible instance.
		const hpBlock = (page: Page) =>
			page.locator("button:visible").filter({ hasText: "HIT_POINTS" }).first();

		// The loaded sheet has no back button — anchor on the rest controls and
		// the StatusHeader HP block, which are always in the header.
		const waitForSheet = async (page: Page) => {
			await expect(
				page.getByRole("button", { name: /Short Rest/i }).first(),
			).toBeVisible({ timeout: 20_000 });
			await expect(hpBlock(page)).toBeVisible({ timeout: 20_000 });
		};

		const openFirstCharacterSheet = async (page: Page) => {
			await page.goto("/characters");
			const characterCard = page
				.locator('[data-testid="character-card"]')
				.first();
			await expect(characterCard).toBeVisible({ timeout: 15_000 });
			await characterCard.click();
			await expect(page).toHaveURL(/\/characters\//, { timeout: 20_000 });
			await waitForSheet(page);
		};

		// The spell-slot rows live in the ABILITIES window's Resources sub-tab,
		// which only mounts once the sheet's main Abilities tab is active (the
		// sheet defaults to Actions). The mobile layout duplicates the tab
		// labels in the DOM, so filter to the visible triggers.
		const openResourcesSubTab = async (page: Page) => {
			await page
				.getByRole("tab", { name: /^Abilities$/i })
				.filter({ visible: true })
				.first()
				.click();
			await page
				.getByRole("tab", { name: /Resources/i })
				.filter({ visible: true })
				.first()
				.click();
		};

		// First POWER SLOTS row ("Tier N  current / max  …controls").
		const firstSlotRow = (page: Page) =>
			page
				.locator("div.justify-between")
				.filter({
					has: page.locator('[data-testid^="spell-slot-decrease-tier-"]'),
				})
				.first();

		const readSlotCounts = async (page: Page) => {
			const text = (await firstSlotRow(page).innerText()).replace(/\s+/g, " ");
			const match = text.match(/(\d+)\s*\/\s*(\d+)/);
			expect(
				match,
				`slot row should show current/max (got "${text}")`,
			).toBeTruthy();
			return {
				current: Number(match?.[1]),
				max: Number(match?.[2]),
			};
		};

		const readHp = async (page: Page) => {
			const text = (await hpBlock(page).innerText()).replace(/\s+/g, " ");
			const match = text.match(/(\d+)\s*\/\s*(\d+)/);
			expect(
				match,
				`HP block should show current/max (got "${text}")`,
			).toBeTruthy();
			return { current: Number(match?.[1]), max: Number(match?.[2]) };
		};

		test.beforeAll(async ({ browser }) => {
			playerContext = await browser.newContext();
			playerPage = await playerContext.newPage();
			const auth = new AuthPage(playerPage);
			await auth.continueAsGuest("player");

			// A fresh guest context has an empty roster — seed a caster so the
			// spell-slot test exercises its real branch.
			const player = new PlayerPage(playerPage);
			const characterId = await player.createCharacterWithJob(
				"Persistence Mage",
				/Mage/i,
			);
			expect(characterId, "guest character creation must succeed").toBeTruthy();

			await playerPage.goto("/characters");
			await expect(playerPage.locator("h1")).toContainText("Ascendant Roster", {
				timeout: 15_000,
			});
		});

		test.afterAll(async () => {
			await playerContext?.close();
		});

		test("character sheet: spell slots persist after reload", async () => {
			await openFirstCharacterSheet(playerPage);
			await openResourcesSubTab(playerPage);

			const decreaseBtn = playerPage
				.locator('[data-testid^="spell-slot-decrease-tier-"]')
				.first();
			await expect(decreaseBtn).toBeVisible({ timeout: 15_000 });

			const initial = await readSlotCounts(playerPage);
			expect(
				initial.current,
				"fresh caster should have unspent slots",
			).toBeGreaterThan(0);

			await decreaseBtn.click();
			await expect
				.poll(async () => (await readSlotCounts(playerPage)).current, {
					timeout: 10_000,
				})
				.toBe(initial.current - 1);

			await playerPage.reload();
			await waitForSheet(playerPage);
			await openResourcesSubTab(playerPage);

			// Poll: the slots panel briefly renders seeded/max values before the
			// persisted row hydrates (async rune-bonus computation), so a direct
			// read races the UI even though the localStorage write is synchronous.
			await expect
				.poll(async () => (await readSlotCounts(playerPage)).current, {
					timeout: 10_000,
				})
				.toBe(initial.current - 1);
			const reloaded = await readSlotCounts(playerPage);
			expect(reloaded.max).toBe(initial.max);
		});

		test("character sheet: resources/HP persist after reload", async () => {
			if (!playerPage.url().includes("/characters/")) {
				await openFirstCharacterSheet(playerPage);
			}

			const initial = await readHp(playerPage);
			expect(
				initial.current,
				"character should start above 0 HP",
			).toBeGreaterThan(0);

			// HP block opens the "Manage Hit Points" dialog (it closes itself
			// after applying damage or healing).
			await hpBlock(playerPage).click();
			const dialog = playerPage.getByRole("dialog");
			await expect(dialog.getByText("Manage Hit Points")).toBeVisible({
				timeout: 10_000,
			});
			await dialog.getByPlaceholder(/Enter amount/i).fill("1");
			await dialog.getByRole("button", { name: "Damage" }).click();
			await expect(dialog).not.toBeVisible({ timeout: 10_000 });

			await expect
				.poll(async () => (await readHp(playerPage)).current, {
					timeout: 10_000,
				})
				.toBe(initial.current - 1);

			await playerPage.reload();
			await waitForSheet(playerPage);

			const reloaded = await readHp(playerPage);
			expect(reloaded.current).toBe(initial.current - 1);
			expect(reloaded.max).toBe(initial.max);
		});
	});
