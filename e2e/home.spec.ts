import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Solo Compendium|Solo Leveling/i);
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    const compendiumLink = page.getByRole('link', { name: 'Compendium', exact: true });
    await expect(compendiumLink).toBeVisible();
  });

  test('should navigate to compendium from home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Compendium', exact: true }).click();
    await expect(page).toHaveURL(/\/compendium/);
  });

  test('should navigate to characters from home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /characters/i }).click();
    await expect(page).toHaveURL(/\/characters/);
  });

  test('should have accessible main content', async ({ page }) => {
    await page.goto('/');
    const main = page.locator('main, [role="main"]');
    await expect(main.first()).toBeVisible();
  });
});

