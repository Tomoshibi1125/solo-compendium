import { test, expect } from '@playwright/test';

test('production journey: DM and player flows', async ({ browser }) => {
  const guildName = `QA Guild ${Date.now()}`;

  const dmContext = await browser.newContext();
  const dmPage = await dmContext.newPage();

  await dmPage.goto('/campaigns');
  await dmPage.getByRole('button', { name: /Create Guild/i }).click();
  await dmPage.getByLabel('Guild Name').fill(guildName);
  await dmPage.getByRole('button', { name: /Establish Guild/i }).click();
  await expect(dmPage).toHaveURL(/\/campaigns\/[0-9a-f-]+/i);
  await expect(dmPage.getByRole('heading', { name: new RegExp(guildName, 'i'), level: 1 })).toBeVisible();

  const shareCodeText = await dmPage.locator('span.font-mono.font-bold').first().textContent();
  const shareCode = (shareCodeText || '').trim();
  expect(shareCode).toHaveLength(6);

  await dmPage.getByRole('tab', { name: /^VTT$/i }).click();
  await dmPage.getByRole('link', { name: /Launch VTT/i }).click();
  await dmPage.locator('.vtt-scene-container').first().waitFor({ state: 'visible', timeout: 40000 });

  const sharedStorage = await dmContext.storageState();
  await dmContext.close();

  const playerContext = await browser.newContext({ storageState: sharedStorage });
  const playerPage = await playerContext.newPage();

  await playerPage.goto(`/campaigns/join/${shareCode}`);
  await expect(playerPage.getByText('CAMPAIGN FOUND')).toBeVisible();
  await playerPage.getByRole('button', { name: /Join Campaign/i }).click();
  await expect(playerPage).toHaveURL(/\/campaigns\/[0-9a-f-]+/i);
  await expect(playerPage.getByRole('heading', { name: new RegExp(guildName, 'i'), level: 1 })).toBeVisible();

  await playerPage.goto('/dice');
  await expect(playerPage.getByRole('heading', { name: /DICE ROLLER/i })).toBeVisible();
  await playerPage.getByRole('button', { name: '1d20', exact: true }).click();
  await expect(playerPage.getByText(/ROLL HISTORY/i)).toBeVisible();

  await playerContext.close();
});
