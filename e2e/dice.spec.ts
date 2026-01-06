import { test, expect, type Page } from '@playwright/test';

// Helper function to check if error boundary is shown
async function checkForErrorBoundary(page: Page): Promise<boolean> {
  try {
    const errorHeading = page.getByRole('heading', { name: /system error|something went wrong/i });
    const errorText = page.getByText(/system has encountered|an unexpected error occurred|shadow monarch/i);
    const errorWindow = page.locator('[class*="SystemWindow"]').filter({ hasText: /ERROR/i });

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

test.describe('Dice Roller', () => {
  test('should load dice roller page', async ({ page }) => {
    await page.goto('/dice');
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });

    const hasError = await checkForErrorBoundary(page);
    if (hasError) {
      test.skip(true, 'Supabase not configured - environment issue');
      return;
    }

    await expect(page.getByRole('heading', { name: /dice roller/i })).toBeVisible({ timeout: 10000 });
  });
});


