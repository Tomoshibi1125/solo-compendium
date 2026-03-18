import { expect, type Page } from "@playwright/test";

export class CompendiumPage {
	constructor(public page: Page) {}

	async dismissAnalyticsBanner() {
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

	async goto() {
		await this.page.goto("/compendium");
		await this.dismissAnalyticsBanner();
	}

	async verifyEntriesVisible() {
		const entry = this.page
			.locator('.compendium-entry, [data-testid="compendium-item"]')
			.first();
		return await entry.isVisible({ timeout: 10_000 }).catch(() => false);
	}

	async clickFirstEntry() {
		const entry = this.page
			.locator('.compendium-entry, [data-testid="compendium-item"]')
			.first();
		if (await entry.isVisible()) {
			await entry.click();
			return true;
		}
		return false;
	}

	async verifyDetailLoads() {
		await expect(
			this.page.locator(
				'.compendium-detail, [data-testid="compendium-detail"]',
			),
		).toBeVisible({ timeout: 10_000 });
	}

	async deepExercise() {
		await this.goto();

		// Search
		const searchInput = this.page.getByPlaceholder(/Search knowledge/i).first();
		if (await searchInput.isVisible()) {
			await searchInput.fill("test");
			await this.page.waitForTimeout(500);
		}

		// Categories
		const categories = ["Monarchs", "Items", "Spells", "Monsters"];
		for (const cat of categories) {
			const btn = this.page
				.getByRole("button", { name: new RegExp(cat, "i") })
				.first();
			if (await btn.isVisible()) {
				await btn.click();
				await this.page.waitForTimeout(300);
			}
		}

		// Toggle view modes
		const gridBtn = this.page.locator('button[value="grid"]').first();
		const listBtn = this.page.locator('button[value="list"]').first();
		if (await gridBtn.isVisible()) await gridBtn.click();
		if (await listBtn.isVisible()) await listBtn.click();

		// Sort
		const sortSelect = this.page.locator('button[role="combobox"]').first();
		if (await sortSelect.isVisible()) {
			await sortSelect.click();
			await this.page.keyboard.press("ArrowDown");
			await this.page.keyboard.press("Enter");
		}
	}
}
