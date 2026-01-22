import { test, expect } from '@playwright/test';

test('compendium loads and search input responds', async ({ page }) => {
  await page.goto('/compendium');
  await expect(page.getByRole('heading', { name: /compendium/i })).toBeVisible();

  const searchInput = page.getByLabel('Search compendium');
  await searchInput.fill('shadow');
  await expect(searchInput).toHaveValue('shadow');
});
