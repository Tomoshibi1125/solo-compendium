import { Page } from '@playwright/test';

export type Role = 'dm' | 'player';

/**
 * Page Object Model for the Login page.
 *
 * Selector strategy (ordered by preference):
 *   1. data-testid  – email-input, password-input
 *   2. role + name  – role selection buttons
 *   3. CSS          – button[type="submit"]
 */
export class AuthPage {
  constructor(public page: Page) {}

  /** Dismiss analytics consent banner via localStorage (matches existing E2E pattern). */
  async dismissAnalytics() {
    await this.page.addInitScript(() => {
      localStorage.setItem(
        'solo-compendium-analytics-consent',
        JSON.stringify({ status: 'rejected', version: 1, timestamp: Date.now() }),
      );
    });
  }

  async goto() {
    await this.page.goto('/login');
  }

  /** Sign in with email/password and a role. Waits for post-login navigation. */
  async signIn(email: string, password: string, role: Role) {
    await this.dismissAnalytics();
    await this.goto();

    // Select role
    if (role === 'dm') {
      await this.page.getByRole('button', { name: /Protocol Warden/i }).click();
    } else {
      await this.page.getByRole('button', { name: /Player/i }).first().click();
    }

    // Fill credentials
    await this.page.getByTestId('email-input').fill(email);
    await this.page.getByTestId('password-input').fill(password);

    // Submit and wait for navigation
    await this.page.locator('button[type="submit"]').click();

    const expectedUrl = role === 'dm' ? /\/dm-tools/ : /\/player-tools/;
    await this.page.waitForURL(expectedUrl, { timeout: 20_000 });
  }

  /** Continue as guest with the chosen role (no Supabase account required). */
  async continueAsGuest(role: Role) {
    await this.dismissAnalytics();
    await this.goto();

    // Select role
    if (role === 'dm') {
      await this.page.getByRole('button', { name: /Protocol Warden/i }).click();
    } else {
      await this.page.getByRole('button', { name: /Player/i }).first().click();
    }

    // Click guest button
    await this.page
      .getByRole('button', { name: new RegExp(`Continue as Guest.*${role === 'dm' ? 'Protocol Warden' : 'Player'}`, 'i') })
      .click();

    const expectedUrl = role === 'dm' ? /\/dm-tools/ : /\/player-tools/;
    await this.page.waitForURL(expectedUrl, { timeout: 15_000 });
  }
}
