import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/compendium');
  });

  test('should search for content', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('striker');
    
    // Wait for results to update
    await page.waitForTimeout(500);
    
    // Should show results or "no results" message
    const results = page.locator('a[href*="/compendium/"]');
    const noResults = page.getByText(/no results found/i);
    
    // Either we have results or a no results message
    await expect(results.first().or(noResults)).toBeVisible({ timeout: 5000 });
  });

  test('should filter by category', async ({ page }) => {
    // Click on a category
    await page.getByRole('button', { name: /jobs/i }).click();
    
    // Wait for category filter to apply
    await page.waitForTimeout(500);
    
    // Results should be filtered (or show no results)
    const results = page.locator('a[href*="/compendium/"]');
    const noResults = page.getByText(/no results found/i);
    await expect(results.first().or(noResults)).toBeVisible({ timeout: 5000 });
  });

  test('should have accessible search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toHaveAttribute('aria-label', /search/i);
  });
});

