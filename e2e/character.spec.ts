import { test, expect } from '@playwright/test';

test.describe('Character Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to characters page', async ({ page }) => {
    await page.getByRole('link', { name: /characters/i }).click();
    await expect(page).toHaveURL(/\/characters/);
    await expect(page.getByRole('heading', { name: /my hunters/i })).toBeVisible();
  });

  test('should show character creation page', async ({ page }) => {
    await page.goto('/characters');
    await page.getByRole('link', { name: /new hunter/i }).click();
    await expect(page).toHaveURL(/\/characters\/new/);
    // Check for step progress indicator or any visible content
    await expect(page.locator('button, input, select').first()).toBeVisible();
  });

  test('should have character builder steps', async ({ page }) => {
    await page.goto('/characters/new');
    // Check for step indicators - use first() to handle multiple matches
    const stepTexts = ['Concept', 'Abilities', 'Job', 'Path', 'Background', 'Review'];
    for (const step of stepTexts) {
      await expect(page.getByText(step).first()).toBeVisible({ timeout: 3000 });
    }
  });
});

