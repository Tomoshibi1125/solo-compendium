import { test, expect } from '@playwright/test';

test.describe('Compendium Detail Pages', () => {
  test('should navigate to compendium and open a detail page', async ({ page }) => {
    await page.goto('/compendium');
    
    // Wait for page to load and content to appear
    // First wait for search input to ensure page is loaded
    await page.getByPlaceholder(/search/i).waitFor({ state: 'visible', timeout: 10000 });
    
    // Wait for content to load - either results or empty state
    // Check if there are any entries or if we get an empty state
    const hasResults = await page.locator('a[href*="/compendium/"]').count() > 0;
    const hasEmptyState = await page.getByText(/no entries found|no results found/i).isVisible().catch(() => false);
    
    // If no results, skip this test (database might be empty)
    if (!hasResults && !hasEmptyState) {
      // Wait a bit more for content to load
      await page.waitForTimeout(2000);
    }
    
    const firstEntry = page.locator('a[href*="/compendium/"]').first();
    const entryCount = await firstEntry.count();
    
    if (entryCount === 0) {
      // Skip test if no entries available - database might be empty
      test.skip(true, 'No compendium entries found in database');
      return;
    }
    
    const href = await firstEntry.getAttribute('href');
    await firstEntry.click();
    
    // Should be on detail page
    if (href) {
      await expect(page).toHaveURL(new RegExp(href.replace('/', '\\/')), { timeout: 10000 });
    }
    
    // Should have back button
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible({ timeout: 10000 });
  });

  test('should have shareable URL', async ({ page }) => {
    // This test assumes there's at least one entry in the database
    await page.goto('/compendium');
    
    // Wait for page to load
    await page.getByPlaceholder(/search/i).waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstEntry = page.locator('a[href*="/compendium/"]').first();
    const entryCount = await firstEntry.count();
    
    if (entryCount === 0) {
      // Skip test if no entries available - database might be empty
      test.skip(true, 'No compendium entries found in database');
      return;
    }
    
    const href = await firstEntry.getAttribute('href');
    
    if (href) {
      // Navigate directly to detail page
      await page.goto(href);
      await expect(page.getByRole('button', { name: /back/i })).toBeVisible({ timeout: 10000 });
    }
  });
});

