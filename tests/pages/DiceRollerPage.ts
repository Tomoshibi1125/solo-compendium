import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Dice Roller at /dice.
 *
 * Selector strategy:
 *   1. data-testid – quick-roll-1d20, dice-roll-button
 *   2. role + name for toast/result verification
 */
export class DiceRollerPage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/dice');
    // Wait for the page to be interactive
    await this.page.getByTestId('dice-roll-button').waitFor({ state: 'visible', timeout: 10_000 });
  }

  /** Perform a quick d20 roll using the preset button. */
  async quickRollD20() {
    await this.page.getByTestId('quick-roll-1d20').click();
  }

  /**
   * Verify a roll result appeared in the ROLL HISTORY panel.
   * The dice roller page shows results in a "ROLL HISTORY" section, not as a toast.
   */
  async expectRollResult() {
    // The ROLL HISTORY panel contains the formula "1d20" alongside the numeric result
    const historyPanel = this.page.getByText(/ROLL HISTORY/i);
    await expect(historyPanel).toBeVisible({ timeout: 10_000 });

    // Verify at least one roll entry with "1d20" text exists
    const rollEntry = this.page.locator('text=1d20').first();
    await expect(rollEntry).toBeVisible({ timeout: 10_000 });
  }
}
