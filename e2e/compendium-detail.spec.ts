import { test, expect } from '@playwright/test';

test.describe('Compendium Detail Pages', () => {
  test('should navigate to compendium and open a detail page', async ({ page }) => {
    await page.goto('/compendium');
    
    // Wait for content to load
    await page.waitForSelector('a[href*="/compendium/"]', { timeout: 10000 });
    
    // Click first entry
    const firstEntry = page.locator('a[href*="/compendium/"]').first();
    const href = await firstEntry.getAttribute('href');
    await firstEntry.click();
    
    // Should be on detail page
    if (href) {
      await expect(page).toHaveURL(new RegExp(href.replace('/', '\\/')));
    }
    
    // Should have back button
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible();
  });

  test('should have shareable URL', async ({ page }) => {
    // This test assumes there's at least one entry in the database
    await page.goto('/compendium');
    await page.waitForSelector('a[href*="/compendium/"]', { timeout: 10000 });
    
    const firstEntry = page.locator('a[href*="/compendium/"]').first();
    const href = await firstEntry.getAttribute('href');
    
    if (href) {
      // Navigate directly to detail page
      await page.goto(href);
      await expect(page.getByRole('button', { name: /back/i })).toBeVisible();
    }
  });
});

