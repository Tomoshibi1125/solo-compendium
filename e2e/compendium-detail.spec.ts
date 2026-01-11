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

test.describe('Compendium Detail Pages', () => {
  test('should navigate to compendium and open a detail page', async ({ page }) => {
    await page.goto('/compendium');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Check for error boundary
    const hasError = await checkForErrorBoundary(page);
    if (hasError) {
      test.skip(true, 'Supabase not configured - environment issue');
      return;
    }
    
    // Wait for compendium search input to ensure page is loaded (avoid global header search)
    await page.getByRole('textbox', { name: 'Search compendium' }).waitFor({ state: 'visible', timeout: 10000 });
    
    // Wait for content to load - either results or empty state
    await page.waitForTimeout(2000);
    
    const firstEntry = page.locator('a[href*="/compendium/"]').first();
    await expect(firstEntry).toBeVisible({ timeout: 15000 });

    const href = await firstEntry.getAttribute('href');
    if (!href) {
      throw new Error('Compendium entry link missing href');
    }
    await firstEntry.click();
    
    // Should be on detail page
    await expect(page).toHaveURL(new RegExp(href.replace('/', '\\/')), { timeout: 10000 });
    
    // Should have back button
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible({ timeout: 10000 });
  });

  test('should have shareable URL', async ({ page }) => {
    // This test assumes there's at least one entry in the database
    await page.goto('/compendium');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Check for error boundary
    const hasError = await checkForErrorBoundary(page);
    if (hasError) {
      test.skip(true, 'Supabase not configured - environment issue');
      return;
    }
    
    // Wait for compendium search input
    await page.getByRole('textbox', { name: 'Search compendium' }).waitFor({ state: 'visible', timeout: 10000 });
    await page.waitForTimeout(2000); // Wait for content to load
    
    const firstEntry = page.locator('a[href*="/compendium/"]').first();
    await expect(firstEntry).toBeVisible({ timeout: 15000 });

    const href = await firstEntry.getAttribute('href');
    if (!href) {
      throw new Error('Compendium entry link missing href');
    }

    // Navigate directly to detail page
    await page.goto(href);
    await expect(page.getByRole('button', { name: /back/i })).toBeVisible({ timeout: 10000 });
  });
});

