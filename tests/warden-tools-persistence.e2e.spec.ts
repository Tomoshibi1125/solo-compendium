import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";

const _DM_PASSWORD = process.env.E2E_DM_PASSWORD ?? "test1234";

test.describe
	.serial("Warden tools persistence: reload restores state", () => {
		let dmContext: BrowserContext;
		let dmPage: Page;

		test.beforeAll(async ({ browser }) => {
			dmContext = await browser.newContext();
			dmPage = await dmContext.newPage();

			const auth = new AuthPage(dmPage);
			await auth.continueAsGuest("dm");
			await expect(dmPage.getByTestId("warden-tools")).toBeVisible({
				timeout: 15_000,
			});
		});

		test.afterAll(async () => {
			await dmContext?.close();
		});

		test("rollable tables: tab + last roll persist after reload", async () => {
			await dmPage.goto("/warden-directives/rollable-tables");
			await expect(
				dmPage.getByRole("heading", { name: /Warden Tables/i }).first(),
			).toBeVisible({ timeout: 15_000 });

			// Wait for initial tool-state hydration to settle so immediate saves are not skipped.
			await expect
				.poll(async () => {
					return await dmPage.evaluate(() =>
						localStorage.getItem(
							"solo-compendium.Warden-tools.rollable-tables.v1",
						),
					);
				})
				.not.toBeNull();
			await dmPage.waitForTimeout(500);

			// Switch to Rewards and roll.
			await dmPage.getByRole("tab", { name: /Rewards/i }).click();
			const rollRewardBtn = dmPage.getByRole("button", {
				name: /Roll Reward/i,
			});
			await expect(rollRewardBtn).toBeVisible({ timeout: 5_000 });
			await rollRewardBtn.click();

			const rewardBadge = dmPage.getByText("Reward").first();
			await expect(rewardBadge).toBeVisible({ timeout: 5_000 });

			// Wait for local mirror to be updated before reloading.
			await expect
				.poll(async () => {
					return await dmPage.evaluate(() => {
						const raw = localStorage.getItem(
							"solo-compendium.Warden-tools.rollable-tables.v1",
						);
						if (!raw) return null;
						try {
							return JSON.parse(raw) as {
								activeTab?: string;
								results?: Record<string, string>;
							};
						} catch {
							return null;
						}
					});
				})
				.toMatchObject({ activeTab: "rewards" });

			await expect
				.poll(async () => {
					return await dmPage.evaluate(() => {
						const raw = localStorage.getItem(
							"solo-compendium.Warden-tools.rollable-tables.v1",
						);
						if (!raw) return "";
						try {
							const parsed = JSON.parse(raw) as {
								results?: Record<string, string>;
							};
							return parsed.results?.["rift-rewards"] ?? "";
						} catch {
							return "";
						}
					});
				})
				.not.toBe("");

			// Ensure debounce has time to flush before reload.
			await dmPage.waitForTimeout(600);
			await dmPage.reload();

			await expect(
				dmPage.getByRole("heading", { name: /Warden Tables/i }).first(),
			).toBeVisible({ timeout: 15_000 });

			// Rewards tab should still be active (Roll Reward button visible without re-clicking the tab).
			await expect(
				dmPage.getByRole("button", { name: /Roll Reward/i }),
			).toBeVisible({ timeout: 15_000 });

			// Rolled reward panel should still be present.
			await expect(dmPage.getByText("Reward").first()).toBeVisible({
				timeout: 5_000,
			});
		});

		// The Rift and Treasure generator persistence cases were removed with
		// those tools under RA-18.
	});
