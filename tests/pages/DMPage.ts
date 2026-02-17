import { Page, expect } from '@playwright/test';

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

  // ─── Campaign creation ───────────────────────────────────────────

  /**
   * Create a new campaign from the /campaigns page.
   * @returns The campaign ID extracted from the resulting URL.
   */
  async createCampaign(name: string, description?: string): Promise<string> {
    await this.page.goto('/campaigns');

    // Open "Create Guild" dialog
    await this.page.getByRole('button', { name: /Create Guild/i }).click();

    // Fill form
    await this.page.fill('#campaign-name', name);
    if (description) {
      await this.page.fill('#campaign-description', description);
    }

    // Submit
    await this.page.getByRole('button', { name: /Establish Guild/i }).click();

    // Wait for navigation to /campaigns/:id
    await this.page.waitForURL(/\/campaigns\/[a-z0-9-]+/i, { timeout: 20_000 });

    const url = new URL(this.page.url());
    const campaignId = url.pathname.split('/').pop() ?? '';
    expect(campaignId).toBeTruthy();
    return campaignId;
  }

  /**
   * Extract the 6-character share code from the campaign detail page.
   * Must be called while on /campaigns/:id.
   */
  async getShareCode(): Promise<string> {
    // The share code is rendered as a bold mono span with tracking-widest
    const shareCodeEl = this.page.locator('.font-mono.font-bold.tracking-widest').first();
    await expect(shareCodeEl).toBeVisible({ timeout: 10_000 });
    const code = (await shareCodeEl.textContent())?.trim() ?? '';
    expect(code).toHaveLength(6);
    return code;
  }

  // ─── Homebrew creation ───────────────────────────────────────────

  /**
   * Create a homebrew content entry via the Homebrew Workbench at /homebrew.
   */
  async createHomebrewContent(opts: {
    name: string;
    description: string;
    type?: string; // 'job' | 'path' | 'relic' | 'spell' | 'item'
    jsonPayload?: Record<string, unknown>;
  }) {
    await this.page.goto('/homebrew');

    // Wait for the workbench to load
    await this.page.getByTestId('homebrew-workbench').waitFor({ state: 'visible', timeout: 15_000 });

    // Select content type if specified
    if (opts.type) {
      await this.page.locator('#homebrew-type').click();
      await this.page.getByRole('option', { name: new RegExp(opts.type, 'i') }).click();
    }

    // Fill name and description
    await this.page.fill('#homebrew-name', opts.name);
    await this.page.fill('#homebrew-description', opts.description);

    // Fill JSON payload
    if (opts.jsonPayload) {
      await this.page.fill('#homebrew-json', JSON.stringify(opts.jsonPayload, null, 2));
    }

    // Save (button text is "Create Draft" for new, "Update Draft" for existing)
    await this.page.getByRole('button', { name: /Create Draft|Update Draft/i }).click();

    // Wait for success toast — use the toast container's title element to avoid strict-mode violation
    // (multiple elements can match the text; the toast title is inside a div with specific classes)
    await this.page
      .locator('[data-state="open"]')
      .filter({ hasText: /Homebrew saved|Saved offline/i })
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });
  }

  // ─── Campaign detail inspection ──────────────────────────────────

  /** Navigate to a campaign detail page and wait for it to load. */
  async gotoCampaignDetail(campaignId: string) {
    await this.page.goto(`/campaigns/${campaignId}`);
    await this.page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  }

  /** Check that a given player/member name is visible on the campaign detail page. */
  async expectMemberVisible(memberName: string) {
    await expect(this.page.getByText(memberName, { exact: false })).toBeVisible({ timeout: 15_000 });
  }
}
