import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for Player-specific flows:
 *   – Join campaign via share code
 *   – Character creation wizard
 *
 * Selector strategy:
 *   1. #id / data-testid for form fields
 *   2. role + name for buttons
 *   3. CSS fallback
 */
export class PlayerPage {
  constructor(public page: Page) {}

  // ─── Join campaign ───────────────────────────────────────────────

  /**
   * Join a campaign using its 6-character share code.
   * Navigates directly to /campaigns/join/{shareCode} to trigger the lookup,
   * then clicks "Join Campaign" once the campaign is found.
   */
  async joinCampaign(shareCode: string) {
    // Navigate directly to the share code URL — this triggers useCampaignByShareCode
    await this.page.goto(`/campaigns/join/${shareCode}`);

    // Wait for "CAMPAIGN FOUND" window to appear (Supabase lookup can take a few seconds)
    await this.page
      .getByText(/CAMPAIGN FOUND/i)
      .waitFor({ state: 'visible', timeout: 30_000 });

    // Click "Join Campaign" button
    await this.page.getByRole('button', { name: /Join Campaign/i }).click();

    // Wait for navigation to /campaigns/:id (join success) — exclude /join/ paths
    await this.page.waitForURL(
      (url) => /\/campaigns\/[a-z0-9-]+$/i.test(url.pathname) && !url.pathname.includes('/join/'),
      { timeout: 20_000 },
    );
  }

  // ─── Character creation ──────────────────────────────────────────

  /**
   * Create a character through the 6-step wizard.
   * Steps: Concept → Abilities → Job → Path → Background → Review.
   *
   * Fills name, uses standard-array defaults for abilities,
   * picks first-available job/background, and submits.
   *
   * @returns The character ID from the resulting URL, or `null` if
   *          character creation could not complete (e.g., no compendium data).
   */
  async createCharacter(name: string): Promise<string | null> {
    try {
      return await this._createCharacterImpl(name);
    } catch {
      // Character creation failed (likely missing compendium data or timeout)
      return null;
    }
  }

  private async _createCharacterImpl(name: string): Promise<string | null> {
    await this.page.goto('/characters/new');

    const clickNext = async () => {
      const btn = this.page.getByRole('button', { name: /^Next$/i });
      await expect(btn).toBeEnabled({ timeout: 10_000 });
      await btn.click();
      await this.page.waitForTimeout(600);
    };

    /** Open a Radix Select trigger and pick the first option (with retries). */
    const selectFirstOption = async (retries = 3): Promise<boolean> => {
      const trigger = this.page.locator('button[role="combobox"]').first();
      const triggerVisible = await trigger.isVisible({ timeout: 10_000 }).catch(() => false);
      if (!triggerVisible) return false;

      for (let attempt = 0; attempt < retries; attempt++) {
        await trigger.click();
        const option = this.page.getByRole('option').first();
        const visible = await option.isVisible({ timeout: 5_000 }).catch(() => false);
        if (visible) {
          await option.click();
          await this.page.waitForTimeout(400);
          return true;
        }
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(2_000);
      }
      return false; // No options available
    };

    // ── Step 1: Concept — fill name ────────────────────────────
    await this.page.getByTestId('character-name').waitFor({ state: 'visible', timeout: 10_000 });
    await this.page.getByTestId('character-name').fill(name);
    await clickNext();

    // ── Step 2: Abilities — standard array is default, just proceed
    const stdArrayBtn = this.page.getByRole('button', { name: /Standard Array/i });
    if (await stdArrayBtn.isVisible().catch(() => false)) {
      await stdArrayBtn.click();
      await this.page.waitForTimeout(300);
    }
    await clickNext();

    // ── Step 3: Job — select first available job ───────────────
    const jobSelected = await selectFirstOption();
    if (!jobSelected) {
      // No compendium jobs available — cannot complete character creation
      return null;
    }

    // Some jobs require skill selection — check if skill checkboxes appeared
    const skillCheckboxes = this.page.locator('button[role="checkbox"]');
    const skillCount = await skillCheckboxes.count();
    if (skillCount > 0) {
      const toSelect = Math.min(skillCount, 2);
      for (let i = 0; i < toSelect; i++) {
        const cb = skillCheckboxes.nth(i);
        const isChecked = await cb.getAttribute('data-state');
        if (isChecked !== 'checked') {
          await cb.click();
          await this.page.waitForTimeout(200);
        }
      }
    }
    await clickNext();

    // ── Step 4: Path — optional, select first if available, or just proceed
    const pathTrigger = this.page.locator('button[role="combobox"]').first();
    if (await pathTrigger.isVisible().catch(() => false)) {
      await pathTrigger.click();
      const pathOption = this.page.getByRole('option').first();
      if (await pathOption.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await pathOption.click();
        await this.page.waitForTimeout(300);
      } else {
        await this.page.keyboard.press('Escape');
      }
    }
    await clickNext();

    // ── Step 5: Background — select first available ────────────
    const bgSelected = await selectFirstOption();
    if (!bgSelected) {
      return null; // No backgrounds available
    }
    await clickNext();

    // ── Step 6: Review — click "Create Character" ──────────────
    const createBtn = this.page.getByRole('button', { name: /Create Character/i });
    await expect(createBtn).toBeEnabled({ timeout: 10_000 });
    await createBtn.click();

    // Wait for navigation to /characters/:id
    await this.page.waitForURL(/\/characters\/[a-z0-9-]+/i, { timeout: 30_000 });

    const charId = new URL(this.page.url()).pathname.split('/').pop() ?? '';
    expect(charId).toBeTruthy();
    return charId;
  }
}
