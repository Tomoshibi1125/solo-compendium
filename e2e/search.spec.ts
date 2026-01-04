import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/compendium');
    // Wait for page to load - wait for search input to be visible
    await page.getByPlaceholder(/search/i).waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should search for content', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('striker');
    
    // Wait for loading to complete - wait for either results or no results message
    await page.waitForTimeout(1000);
    
    // Should show results or "no results" message
    const results = page.locator('a[href*="/compendium/"]');
    const noResults = page.getByText(/no results found|no entries found/i);
    
    // Either we have results or a no results message
    await expect(results.first().or(noResults)).toBeVisible({ timeout: 10000 });
  });

  test('should filter by category', async ({ page }) => {
    // Wait for sidebar to load, then click on a category button in the sidebar
    const jobsButton = page.locator('aside button').filter({ hasText: /^Jobs$/i });
    await expect(jobsButton).toBeVisible({ timeout: 10000 });
    await jobsButton.click();
    
    // Wait for category filter to apply and loading to complete
    await page.waitForTimeout(1000);
    
    // Results should be filtered (or show no results)
    const results = page.locator('a[href*="/compendium/"]');
    const noResults = page.getByText(/no results found|no entries found/i);
    await expect(results.first().or(noResults)).toBeVisible({ timeout: 10000 });
  });

  test('should have accessible search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await expect(searchInput).toHaveAttribute('aria-label', /search/i, { timeout: 5000 });
  });
});

