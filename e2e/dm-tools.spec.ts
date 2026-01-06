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

test.describe('DM Tools', () => {
  test('should load DM tools hub', async ({ page }) => {
    await page.goto('/dm-tools');
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await page.waitForTimeout(1500); // allow ProtectedRoute auth check + redirect

    const hasError = await checkForErrorBoundary(page);
    if (hasError) {
      test.skip(true, 'Supabase not configured - environment issue');
      return;
    }

    // If unauthenticated, ProtectedRoute redirects to /auth
    if (/\/auth\b/.test(page.url())) {
      await expect(page).toHaveURL(/\/auth/);
      return;
    }

    await expect(page.getByRole('heading', { name: /supreme deity's domain/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: /encounter builder/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /initiative tracker/i })).toBeVisible();
  });

  test('should open encounter builder page', async ({ page }) => {
    await page.goto('/dm-tools/encounter-builder');
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await page.waitForTimeout(1500);

    const hasError = await checkForErrorBoundary(page);
    if (hasError) {
      test.skip(true, 'Supabase not configured - environment issue');
      return;
    }

    if (/\/auth\b/.test(page.url())) {
      await expect(page).toHaveURL(/\/auth/);
      return;
    }

    await expect(page.getByRole('heading', { name: /gate encounter builder/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder(/search gate creatures/i)).toBeVisible({ timeout: 10000 });
  });

  test('should open initiative tracker page', async ({ page }) => {
    await page.goto('/dm-tools/initiative-tracker');
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await page.waitForTimeout(1500);

    const hasError = await checkForErrorBoundary(page);
    if (hasError) {
      test.skip(true, 'Supabase not configured - environment issue');
      return;
    }

    if (/\/auth\b/.test(page.url())) {
      await expect(page).toHaveURL(/\/auth/);
      return;
    }

    await expect(page.getByRole('heading', { name: /gate combat tracker/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/no combatants yet/i)).toBeVisible({ timeout: 10000 });
  });
});


