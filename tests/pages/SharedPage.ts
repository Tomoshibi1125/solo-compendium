import { expect, type Page } from "@playwright/test";

export class SharedPage {
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

	async createCampaign(name: string, description: string) {
		await this.page.goto("/campaigns");
		await this.dismissAnalyticsBanner();
		await this.page
			.getByRole("button", {
				name: /^(Create Campaign|Establish Your Campaign)$/i,
			})
			.first()
			.click();
		await this.page.fill("#campaign-name", name);
		await this.page.fill("#campaign-description", description);
		await this.page
			.getByRole("button", { name: /^Establish Campaign$/i })
			.click();
		await this.page.waitForURL(/\/campaigns\/[a-z0-9-]+/i, { timeout: 20_000 });
		const url = new URL(this.page.url());
		return url.pathname.split("/").pop() ?? "";
	}

	/**
	 * Read the campaign share code. It lives inside the CampaignInviteModal,
	 * opened from CAMPAIGN INFO's "Invite Ascendants" button — the modal is
	 * left open so {@link copyShareLink} can use its copy buttons.
	 */
	async getShareCode() {
		await this.page
			.getByRole("button", { name: /Invite Ascendants/i })
			.first()
			.click();
		const shareCodeEl = this.page.getByTestId("campaign-share-code");
		await expect(shareCodeEl).toBeVisible({ timeout: 10_000 });
		return (await shareCodeEl.textContent())?.trim() ?? "";
	}

	/** Click "Copy Join URL" in the invite modal, then close the modal. */
	async copyShareLink() {
		const copyBtn = this.page
			.getByRole("button", { name: /Copy Join URL/i })
			.first();
		if (await copyBtn.isVisible()) {
			await copyBtn.click();
		}
		await this.page.keyboard.press("Escape");
	}

	async gotoCharacters() {
		await this.page.goto("/characters");
		await this.dismissAnalyticsBanner();
	}

	async verifyCharactersLoads() {
		await expect(
			this.page
				.getByText(
					/Ascendant Roster|ASCENDANT REGISTRY|MY ASCENDANTS|CHARACTERS/i,
				)
				.first(),
		).toBeVisible({ timeout: 15_000 });
	}

	async verifyCharacterListActions() {
		// Roster header actions (Characters.tsx): "Awaken Ascendant" (labelled
		// "Create" on mobile), "Import", and "Party Stash". There is no
		// Compare button — compare lives at /characters/compare via ?ids=.
		const createBtn = this.page
			.getByRole("button", { name: /Awaken Ascendant|Create/i })
			.first();
		await expect(createBtn).toBeVisible();
		const importBtn = this.page
			.getByRole("button", { name: /Import/i })
			.first();
		await expect(importBtn).toBeVisible();
		const stashBtn = this.page
			.getByRole("button", { name: /Party Stash/i })
			.first();
		await expect(stashBtn).toBeVisible();
	}

	async gotoFavorites() {
		await this.page.goto("/favorites");
		await this.dismissAnalyticsBanner();
	}

	async verifyFavoritesLoads() {
		await expect(this.page.getByText(/FAVORITES/i).first()).toBeVisible({
			timeout: 15_000,
		});
	}

	async searchFavorites(query: string) {
		const searchInput = this.page.getByPlaceholder(/Search favorites/i);
		await searchInput.fill(query);
		await this.page.waitForTimeout(500);
	}

	async gotoHomebrew() {
		await this.page.goto("/homebrew");
		await this.dismissAnalyticsBanner();
	}

	async verifyHomebrewLoads() {
		await expect(this.page.getByTestId("homebrew-workbench")).toBeVisible({
			timeout: 15_000,
		});
	}

	async createHomebrewDraft(opts: {
		name: string;
		description: string;
		type: string;
	}) {
		await this.page.fill("#homebrew-name", opts.name);
		await this.page.fill("#homebrew-description", opts.description);
		await this.page.getByRole("button", { name: /Create Draft/i }).click();
	}

	async gotoMarketplace() {
		await this.page.goto("/marketplace");
		await this.dismissAnalyticsBanner();
	}

	async verifyMarketplaceLoads() {
		await expect(this.page.getByText(/MARKETPLACE/i).first()).toBeVisible({
			timeout: 15_000,
		});
	}

	async searchMarketplace(query: string) {
		const searchInput = this.page
			.getByPlaceholder(/Search marketplace listings/i)
			.first();
		await searchInput.fill(query);
		await this.page.waitForTimeout(500);
	}

	async gotoCampaignDetail(campaignId: string) {
		await this.page.goto(`/campaigns/${campaignId}`);
		await this.dismissAnalyticsBanner();
	}

	async exerciseCampaignDetailTabs(isDm: boolean) {
		const tabs = [
			"Overview",
			"Wiki",
			"Sessions",
			"Chat",
			"Notes",
			"Handouts",
			"Characters",
			"Guilds",
			"Activity",
		];
		if (isDm) tabs.push("Settings");

		for (const tab of tabs) {
			await this.page.getByRole("tab", { name: new RegExp(tab, "i") }).click();
			await this.page.waitForTimeout(500);
		}
	}

	async gotoCampaigns() {
		await this.page.goto("/campaigns");
		await this.dismissAnalyticsBanner();
	}

	async verifyCampaignListLoads() {
		await expect(
			this.page.getByText(/MY GUILDS|CAMPAIGNS/i).first(),
		).toBeVisible({ timeout: 15_000 });
	}

	async verifyCampaignMembers() {
		await this.page.getByRole("tab", { name: /Characters/i }).click();
		await expect(
			this.page.locator(".flex.items-center.justify-between").first(),
		).toBeVisible();
	}
}
