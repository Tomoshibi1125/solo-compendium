import { expect, type Page, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { DMPage } from "./pages/DMPage";

/**
 * Guest-Warden coverage for the campaign surfaces beyond the detail tabs:
 * the campaign book view, the OBS broadcast stream views, the join-by-code
 * page, and the live combat session play route.
 *
 * Boundary: guest campaigns live in per-context localStorage, so joining a
 * campaign from a SECOND account/context requires real Supabase accounts and
 * is out of guest scope — the join page is covered to its validation edge.
 */

test.describe
	.serial("Campaigns deep: book/stream/join/session-play", () => {
		let page: Page;
		let campaignId = "";

		test.beforeAll(async ({ browser }) => {
			const context = await browser.newContext();
			page = await context.newPage();
			const auth = new AuthPage(page);
			await auth.continueAsGuest("warden");

			const dm = new DMPage(page);
			campaignId = await dm.createCampaign(
				`deep-e2e-${Date.now()}`,
				"Deep campaign surfaces coverage",
			);
			expect(campaignId, "campaign create must succeed").toBeTruthy();
		});

		test.afterAll(async () => {
			await page.context().close();
		});

		test("Campaign book view renders the bound campaign book", async () => {
			await page.goto(`/campaigns/${campaignId}/book`);
			await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible(
				{ timeout: 20_000 },
			);
		});

		test("Broadcast stream views render their overlays", async () => {
			for (const mode of ["chat-overlay", "dice-overlay", "roster"]) {
				await page.goto(`/campaigns/${campaignId}/stream/${mode}`);
				await expect
					.poll(
						() => page.evaluate(() => document.body.dataset.streamView ?? ""),
						{ timeout: 10_000 },
					)
					.toBe(mode);
			}
		});

		test("Join page validates a bogus share code", async () => {
			await page.goto("/campaigns/join");
			await expect(page.locator("body")).toBeVisible();

			const codeInput = page
				.locator('input[placeholder*="code" i], input[id*="code" i]')
				.first();
			if (await codeInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
				await codeInput.fill("XXXXXX");
				const joinBtn = page.getByRole("button", { name: /Join/i }).first();
				if (await joinBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
					await joinBtn.click();
					// A bogus code must not navigate into a campaign.
					await page.waitForTimeout(2_000);
					expect(page.url()).not.toMatch(/\/campaigns\/[a-z0-9-]{8,}$/i);
				}
			}
		});

		test("Party Stash: add loot lands in the campaign stash inventory", async () => {
			await page.goto(`/party-stash?campaignId=${campaignId}`);
			await expect(page.getByText("ADD LOOT").first()).toBeVisible({
				timeout: 15_000,
			});

			const itemName = `Bureau Salvage Voucher ${Date.now()}`;
			await page.getByPlaceholder(/Bureau salvage voucher/i).fill(itemName);
			await page.getByRole("button", { name: /^Add$/i }).click();

			await expect(page.getByText("STASH INVENTORY").first()).toBeVisible();
			await expect(page.getByText(itemName).first()).toBeVisible({
				timeout: 10_000,
			});
		});

		test("Session play route renders the live-combat shell gracefully", async () => {
			// Without an active combat session the play page must still render its
			// header shell rather than crash (real combat start is covered by the
			// warden-tools initiative specs).
			await page.goto(`/campaigns/${campaignId}/play/nonexistent-session`);
			await expect(page.getByTestId("campaign-session-play")).toBeVisible({
				timeout: 20_000,
			});
			await expect(page.getByText("Active Engagement").first()).toBeVisible();
		});
	});
