import { expect, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { SharedPage } from "./pages/SharedPage";

/**
 * P1-4 — Persistent / pinned AoE templates (Foundry parity).
 *
 * Exercises the new measurement-pin lifecycle:
 *   1. Switch to the Measure tool via the `m` hotkey.
 *   2. Click the canvas once to start a measurement.
 *   3. Move the cursor → measurement HUD updates (Pin button visible).
 *   4. Click Pin → drawing materializes as a kind=`"aoe"` VTTDrawing
 *      via the dedicated `data-aoe-id` element.
 *   5. Open the Toolbox Measure sub-panel → "Clear AoE Templates (1)"
 *      button is enabled.
 *   6. Click it → all pinned templates removed and the button
 *      re-disables (count: 0).
 *
 * Guards regressions for `createAoeFromMeasurement`,
 * `handlePinMeasurement`, the cone render path, and the
 * "Clear AoE Templates" Toolbox button.
 */
test("warden AoE pin lifecycle: pin a measurement, confirm scene drawing, clear all", async ({
	page,
}) => {
	test.setTimeout(120_000);

	const authPage = new AuthPage(page);
	const sharedPage = new SharedPage(page);
	const pageErrors: string[] = [];

	page.on("pageerror", (error) => {
		pageErrors.push(error.message);
	});

	await authPage.continueAsGuest("dm");

	const campaignId = await sharedPage.createCampaign(
		`VTT AoE Pin ${Date.now()}`,
		"P1-4 persistent AoE template regression coverage",
	);

	await page.goto(`/campaigns/${campaignId}/vtt`);
	await sharedPage.dismissAnalyticsBanner();

	await expect(page.getByTestId("vtt-interface")).toBeAttached({
		timeout: 20_000,
	});

	const map = page.getByTestId("vtt-map");
	const canvas = map.locator("canvas").first();
	const pixiHost = page.getByTestId("vtt-pixi-host");
	const radixOverlay = page.locator('[data-state="open"][aria-hidden="true"]');

	await expect(map).toBeVisible({ timeout: 20_000 });
	await expect(canvas).toBeVisible({ timeout: 20_000 });
	await expect(pixiHost).toHaveAttribute("data-renderer-status", "ready", {
		timeout: 20_000,
	});

	const closeTransientOverlays = async () => {
		for (let i = 0; i < 3; i++) {
			if ((await radixOverlay.count()) === 0) return;
			await page.keyboard.press("Escape");
			await page.waitForTimeout(150);
		}
	};

	// ── 1. Switch to the Measure tool via hotkey ────────────────────────
	// Click somewhere inert first to ensure focus is on the page surface.
	await canvas.click({ position: { x: 50, y: 50 } });
	await page.keyboard.press("m");

	// ── 2. Start a measurement (single click), then move the cursor ─────
	const box = await canvas.boundingBox();
	if (!box) throw new Error("canvas has no bounding box");

	// First click: sets measurementStart at this position.
	await canvas.click({ position: { x: 200, y: 200 } });

	// Mouse-move to a different position to set measurementEnd.
	await page.mouse.move(box.x + 350, box.y + 200);
	await page.waitForTimeout(150);

	// ── 3. Pin button is now visible. Click it ──────────────────────────
	const pinButton = page.getByTestId("vtt-pin-measurement");
	await expect(pinButton).toBeVisible({ timeout: 5_000 });
	await pinButton.click();

	// Pin closes the measurement HUD; the Pin button should disappear.
	await expect(pinButton).toBeHidden({ timeout: 5_000 });

	// ── 4. Confirm the AoE drawing is in the scene ──────────────────────
	// Pinned drawings are rendered with a `data-aoe-id` attribute.
	await expect(page.locator("[data-aoe-id]")).toHaveCount(1, {
		timeout: 5_000,
	});

	// ── 5. Open the Toolbox Measure sub-panel ───────────────────────────
	await page.getByTestId("vtt-rail-left-toolbox").click();
	const clearButton = page.getByTestId("warden-tools-clear-aoe-templates");
	await expect(clearButton).toBeVisible({ timeout: 5_000 });
	// The button label encodes the count.
	await expect(clearButton).toContainText(/Clear AoE Templates \(1\)/i);
	await expect(clearButton).toBeEnabled();

	// ── 6. Clear all pinned templates ───────────────────────────────────
	await clearButton.click();
	await expect(clearButton).toContainText(/Clear AoE Templates \(0\)/i, {
		timeout: 5_000,
	});
	await expect(clearButton).toBeDisabled();

	// Drawing element should be gone from the scene as well.
	await closeTransientOverlays();
	await expect(page.locator("[data-aoe-id]")).toHaveCount(0, {
		timeout: 5_000,
	});

	// ── Final sanity ────────────────────────────────────────────────────
	expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});
