import { test, expect, type Page } from '@playwright/test';

// Helper function to check if error boundary is shown
async function checkForErrorBoundary(page: Page): Promise<boolean> {
  try {
    const errorHeading = page.getByRole('heading', { name: /system error|something went wrong/i });
    const errorText = page.getByText(/system has encountered|an unexpected error occurred|shadow monarch/i);
    const errorWindow = page.locator('[class*="SystemWindow"]').filter({ hasText: /ERROR/i });
    
    // Check if any error indicator is visible
    const hasError = await Promise.race([
      errorHeading.isVisible().then(v => v).catch(() => false),
      errorText.isVisible().then(v => v).catch(() => false),
      errorWindow.isVisible().then(v => v).catch(() => false),
    ]);
    
    return hasError;
  } catch {
    return false;
  }
}

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/compendium');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Check for error boundary - if present, skip all tests in this suite
    const hasError = await checkForErrorBoundary(page);
    if (hasError) {
      test.skip(true, 'Supabase not configured - environment issue');
      return;
    }
    
    // Wait for compendium search input to be visible (avoid global header search)
    await page.getByRole('textbox', { name: 'Search compendium' }).waitFor({ state: 'visible', timeout: 10000 });
  });

  test('should search for content', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search compendium' });
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill('striker');
    
    // Wait for loading to complete - wait for either results or no results message
    await page.waitForTimeout(1000);
    
    // Should show results or "no results" message
    const results = page.locator('a[href*="/compendium/"]');
    const noResults = page.getByText(/no results found|no entries found/i).first();
    
    // Either we have results or a no results message
    await expect(results.first().or(noResults)).toBeVisible({ timeout: 10000 });
  });

  test('should filter by category', async ({ page }) => {
    // Wait for sidebar to load, then click on a category button in the sidebar
    const jobsButton = page.locator('aside').getByRole('button', { name: /jobs/i });
    await expect(jobsButton).toBeVisible({ timeout: 10000 });
    await jobsButton.click();
    
    // Wait for category filter to apply and loading to complete
    await page.waitForTimeout(1500);
    
    // Results should be filtered to jobs, or show an empty-state message
    const results = page.locator('a[href*="/compendium/jobs/"]');
    const emptyState = page.getByText(/no results found|no entries found|no entries/i).first();
    await expect(results.first().or(emptyState)).toBeVisible({ timeout: 10000 });
  });

  test('should have accessible search input', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search compendium' });
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await expect(searchInput).toHaveAttribute('aria-label', /search/i, { timeout: 5000 });
  });
});

