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
				dmPage.getByText("PROTOCOL WARDEN TABLES", { exact: false }).first(),
			).toBeVisible({ timeout: 15_000 });

			// Wait for initial tool-state hydration to settle so immediate saves are not skipped.
			await expect
				.poll(async () => {
					return await dmPage.evaluate(() =>
						localStorage.getItem("solo-compendium.dm-tools.rollable-tables.v1"),
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
							"solo-compendium.dm-tools.rollable-tables.v1",
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
							"solo-compendium.dm-tools.rollable-tables.v1",
						);
						if (!raw) return "";
						try {
							const parsed = JSON.parse(raw) as {
								results?: Record<string, string>;
							};
							return parsed.results?.reward ?? "";
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
				dmPage.getByText("PROTOCOL WARDEN TABLES", { exact: false }).first(),
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

		test("rift generator: selected rank + last rift persist after reload", async () => {
			await dmPage.goto("/warden-directives/gate-generator");
			await expect(
				dmPage.getByText("RIFT GENERATOR", { exact: false }).first(),
			).toBeVisible({ timeout: 15_000 });

			// Wait for initial tool-state hydration to settle.
			await expect
				.poll(async () => {
					return await dmPage.evaluate(() =>
						localStorage.getItem("solo-compendium.dm-tools.gate-generator.v1"),
					);
				})
				.not.toBeNull();
			await dmPage.waitForTimeout(500);

			const rankButton = dmPage.getByRole("button", { name: /^C$/ }).first();
			await expect(rankButton).toBeVisible({ timeout: 10_000 });
			await rankButton.click();

			const generateBtn = dmPage.getByRole("button", {
				name: /Generate Rift/i,
			});
			await expect(generateBtn).toBeVisible({ timeout: 10_000 });
			await generateBtn.click();

			// Wait for local mirror to capture selected rank + rift.
			await expect
				.poll(async () => {
					return await dmPage.evaluate(() => {
						const raw = localStorage.getItem(
							"solo-compendium.dm-tools.gate-generator.v1",
						);
						if (!raw) return null;
						try {
							return JSON.parse(raw) as {
								selectedRank?: string;
								rift?: unknown;
							};
						} catch {
							return null;
						}
					});
				})
				.toMatchObject({ selectedRank: "C" });

			await expect
				.poll(async () => {
					return await dmPage.evaluate(() => {
						const raw = localStorage.getItem(
							"solo-compendium.dm-tools.gate-generator.v1",
						);
						if (!raw) return false;
						try {
							const parsed = JSON.parse(raw) as {
								rift?: { description?: string } | null;
							};
							return Boolean(parsed.rift?.description);
						} catch {
							return false;
						}
					});
				})
				.toBe(true);

			await dmPage.reload();
			await expect(
				dmPage.getByText("RIFT GENERATOR", { exact: false }).first(),
			).toBeVisible({ timeout: 15_000 });

			// UI should show the generated details.
			await expect(
				dmPage.getByRole("button", { name: /Copy Details/i }),
			).toBeVisible({ timeout: 15_000 });
		});

		test("treasure generator: selected rank + last treasure persist after reload", async () => {
			await dmPage.goto("/warden-directives/treasure-generator");
			await expect(
				dmPage.getByText("TREASURE GENERATOR", { exact: false }).first(),
			).toBeVisible({ timeout: 15_000 });

			// Wait for initial tool-state hydration to settle.
			await expect
				.poll(async () => {
					return await dmPage.evaluate(() =>
						localStorage.getItem(
							"solo-compendium.dm-tools.treasure-generator.v1",
						),
					);
				})
				.not.toBeNull();
			await dmPage.waitForTimeout(500);

			// Open rank select and choose Rank B.
			const rankTrigger = dmPage.locator('button[role="combobox"]').first();
			await expect(rankTrigger).toBeVisible({ timeout: 10_000 });
			await rankTrigger.click();
			const rankBOption = dmPage.getByRole("option", { name: /Rank B/i });
			if (await rankBOption.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await rankBOption.click();
			} else {
				await dmPage
					.getByText(/Rank B/i)
					.first()
					.click();
			}
			await dmPage.waitForTimeout(300);

			const generateBtn = dmPage.getByRole("button", {
				name: /Generate Treasure/i,
			});
			await expect(generateBtn).toBeVisible({ timeout: 10_000 });
			await generateBtn.click();

			// Wait for local mirror to capture selected rank + treasure.
			await expect
				.poll(async () => {
					return await dmPage.evaluate(() => {
						const raw = localStorage.getItem(
							"solo-compendium.dm-tools.treasure-generator.v1",
						);
						if (!raw) return null;
						try {
							return JSON.parse(raw) as {
								selectedRank?: string;
								treasure?: unknown;
							};
						} catch {
							return null;
						}
					});
				})
				.toMatchObject({ selectedRank: "B" });

			await expect
				.poll(async () => {
					return await dmPage.evaluate(() => {
						const raw = localStorage.getItem(
							"solo-compendium.dm-tools.treasure-generator.v1",
						);
						if (!raw) return false;
						try {
							const parsed = JSON.parse(raw) as {
								treasure?: { gold?: number } | null;
							};
							return typeof parsed.treasure?.gold === "number";
						} catch {
							return false;
						}
					});
				})
				.toBe(true);

			await dmPage.reload();
			await expect(
				dmPage.getByText("TREASURE GENERATOR", { exact: false }).first(),
			).toBeVisible({ timeout: 15_000 });

			// UI should show a generated treasure and copy button.
			await expect(
				dmPage.getByRole("button", { name: /Copy Details/i }),
			).toBeVisible({ timeout: 15_000 });
		});
	});
