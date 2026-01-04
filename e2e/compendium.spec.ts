import { test, expect } from '@playwright/test';

test.describe('Compendium', () => {
  test('should load compendium page', async ({ page }) => {
    await page.goto('/compendium');
    await expect(page.getByRole('heading', { name: /compendium/i })).toBeVisible();
  });

  test('should have search input', async ({ page }) => {
    await page.goto('/compendium');
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display categories', async ({ page }) => {
    await page.goto('/compendium');
    // Check for at least one category button
    const categories = page.locator('button').filter({ hasText: /jobs|powers|relics|monsters/i });
    await expect(categories.first()).toBeVisible();
  });
});

