import { test, expect } from '@playwright/test';

test.describe('Compendium', () => {
  test('should load compendium page', async ({ page }) => {
    await page.goto('/compendium');
    // Wait for the heading to be visible
    await expect(page.getByRole('heading', { name: /compendium/i })).toBeVisible({ timeout: 10000 });
  });

  test('should have search input', async ({ page }) => {
    await page.goto('/compendium');
    // Wait for search input to be visible (it should appear immediately, but wait for page load)
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible({ timeout: 10000 });
  });

  test('should display categories', async ({ page }) => {
    await page.goto('/compendium');
    // Wait for the sidebar to load - categories are in the sidebar
    // Look for category buttons in the sidebar (they contain category names like "Jobs", "Powers", etc.)
    const categories = page.locator('aside button').filter({ hasText: /^(All|Jobs|Paths|Monarchs|Powers|Relics|Feats|Monsters|Backgrounds|Conditions|Skills|Equipment)$/i });
    await expect(categories.first()).toBeVisible({ timeout: 10000 });
  });
});

