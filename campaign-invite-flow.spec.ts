import { test, expect } from '@playwright/test';

const DM_EMAIL = process.env.E2E_DM_EMAIL ?? 'dm@test.com';
const DM_PASSWORD = process.env.E2E_DM_PASSWORD ?? 'test1234';

const loginAsDM = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'solo-compendium-analytics-consent',
      JSON.stringify({ status: 'rejected', version: 1, timestamp: Date.now() })
    );
  });

  await page.goto('/login');
  await page.getByRole('button', { name: /Protocol Warden/i }).click();
  await page.getByTestId('email-input').fill(DM_EMAIL);
  await page.getByTestId('password-input').fill(DM_PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/\/dm-tools/, { timeout: 15000 });
};

test.describe('Campaign invite lifecycle', () => {
  test('creates an invite, revokes it, and shows revoked status on join page', async ({ page }) => {
    await loginAsDM(page);

    await page.goto('/campaigns');
    await page.getByRole('button', { name: /Create Guild/i }).click();
    await page.fill('#campaign-name', `Invite Lifecycle ${Date.now()}`);
    await page.fill('#campaign-description', 'Invite lifecycle verification campaign.');
    await page.getByRole('button', { name: /Establish Guild/i }).click();
    await page.waitForURL(/\/campaigns\/[a-z0-9-]+/i, { timeout: 15000 });

    await page.getByRole('tab', { name: /Settings/i }).click();

    await page.fill('#invite-revoke-reason', 'E2E revoke check');
    await page.getByTestId('campaign-invite-create').click();
    await expect(page.getByTestId('campaign-invite-join-code').first()).toBeVisible({ timeout: 10000 });

    const joinCode = (await page.getByTestId('campaign-invite-join-code').first().textContent())?.trim() ?? '';
    expect(joinCode).toMatch(/^[A-HJ-NP-Z2-9]{6,10}$/);

    await page.getByTestId('campaign-invite-revoke').first().click();
    await expect(page.getByTestId('campaign-invite-revoke').first()).toHaveText(/Revoked/i, { timeout: 10000 });

    await page.goto(`/campaigns/join/${joinCode}`);

    await expect(page.getByText(/INVITE FOUND/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/This invite has been revoked by the Protocol Warden\./i)).toBeVisible();

    const joinAction = page.getByRole('button', { name: /Join Campaign|Attach Character|Sign in to Join/i });
    await expect(joinAction).toBeDisabled();
  });
});
