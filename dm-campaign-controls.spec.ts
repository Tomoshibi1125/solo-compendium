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

test.describe('DM campaign controls flow', () => {
  test('creates invite, saves encounter, deploys, and uses initiative tracker', async ({ page }) => {
    test.setTimeout(120000);

    await loginAsDM(page);

    await page.goto('/campaigns');
    await page.getByRole('button', { name: /Create Guild/i }).click();
    await page.fill('#campaign-name', `Protocol Test ${Date.now()}`);
    await page.fill('#campaign-description', 'DM campaign controls verification.');
    await page.getByRole('button', { name: /Establish Guild/i }).click();
    await page.waitForURL(/\/campaigns\/[a-z0-9-]+/i, { timeout: 15000 });

    const campaignId = new URL(page.url()).pathname.split('/').pop();
    expect(campaignId).toBeTruthy();

    await page.getByRole('tab', { name: /Settings/i }).click();
    await page.getByTestId('campaign-invite-create').click();
    await expect(page.getByRole('heading', { name: /Active Invites/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Join code/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('campaign-invite-copy').first()).toBeVisible({ timeout: 15000 });

    await page.fill('#failure-rate', '10');
    await page.fill('#failure-note', 'Test injection');
    await page.getByTestId('campaign-rules-save').click();
    const injectFailureButton = page.getByTestId('campaign-failure-inject');
    if (await injectFailureButton.isDisabled()) {
      await page.getByTestId('campaign-failure-toggle').click();
    }
    await expect(injectFailureButton).toBeEnabled({ timeout: 10000 });
    await injectFailureButton.click();
    await expect(page.getByTestId('campaign-rule-events')).toBeVisible({ timeout: 10000 });

    await page.goto(`/dm-tools/encounter-builder?campaignId=${campaignId}`);
    await expect(page.getByTestId('encounter-builder')).toBeVisible();
    await expect(page.getByTestId('encounter-add-button').first()).toBeVisible({ timeout: 10000 });
    const sendToTrackerButton = page.getByTestId('encounter-send-to-tracker');

    const analyticsDismiss = page.getByRole('button', { name: /No Thanks|Dismiss/i }).first();
    if (await analyticsDismiss.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await analyticsDismiss.click();
      await page.waitForTimeout(300);
    }

    const addMonsterBtn = page.getByTestId('encounter-add-button').first();
    await addMonsterBtn.scrollIntoViewIfNeeded();

    const monstersSummary = page.getByText(/MONSTERS \(\d+\)/i).first();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await addMonsterBtn.click({ timeout: 15_000, force: true });
      if (await monstersSummary.isVisible({ timeout: 1_500 }).catch(() => false)) break;
      await page.waitForTimeout(250);
    }

    await expect(monstersSummary).toBeVisible({ timeout: 15_000 });
    await expect(sendToTrackerButton).toBeEnabled({ timeout: 15_000 });
    await page.fill('#encounter-name', 'Rift Skirmish');
    await page.fill('#encounter-notes', 'Saved during E2E verification.');
    const saveEncounterButton = page.getByTestId('encounter-save');
    await saveEncounterButton.click();
    await expect(saveEncounterButton).toBeEnabled({ timeout: 15000 });

    if (await sendToTrackerButton.isDisabled()) {
      await addMonsterBtn.scrollIntoViewIfNeeded();
      await addMonsterBtn.click({ timeout: 15_000, force: true });
    }

    await expect(sendToTrackerButton).toBeEnabled({ timeout: 15_000 });
    await page.getByTestId('encounter-send-to-tracker').click();

    await page.waitForURL(/\/dm-tools\/initiative-tracker/i, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: /RIFT COMBAT TRACKER/i })).toBeVisible({ timeout: 10000 });
    await page.fill('#combatant-name', 'Test Combatant');
    await page.fill('#combatant-initiative', '12');
    await page.getByTestId('initiative-add-combatant').click({ force: true });
    await page.getByTestId('initiative-next-turn').click();

    await page.goto(`/campaigns/${campaignId}`);
    await expect(page.getByRole('tab', { name: /Settings/i })).toBeVisible({ timeout: 20000 });
    await page.getByRole('tab', { name: /Settings/i }).click();
    await expect(page.getByTestId('campaign-encounter-deploy').first()).toBeVisible({ timeout: 10000 });
    await page.getByTestId('campaign-encounter-deploy').first().click();
  });
});
