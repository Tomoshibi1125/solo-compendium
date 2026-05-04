import { expect, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { SharedPage } from "./pages/SharedPage";

/**
 * P1-1 — Configurable light authoring (Foundry parity).
 *
 * Exercises the full light-authoring lifecycle introduced in P1-1:
 *   1. Switch to the Light tool via the `l` hotkey.
 *   2. Click the map canvas → light configuration dialog opens.
 *   3. Save → a placed light appears in the toolbox "Placed Lights" panel.
 *   4. Edit → dialog reopens with the saved values, modify and save.
 *   5. Delete → the entry disappears and the panel shows the empty state.
 *
 * Guards regressions for `selectedTool === "light"` canvas wiring,
 * `LightSourceConfigDialog` state seeding, and the
 * `addLightToScene / updateLightInScene / removeLightFromScene`
 * scene-state helpers being correctly composed at the page level.
 */
test("warden light authoring: place, edit, and delete a configurable light", async ({
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
		`VTT Light Authoring ${Date.now()}`,
		"P1-1 light authoring regression coverage",
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

	const openToolboxDrawer = async () => {
		await page.getByTestId("vtt-rail-left-toolbox").click();
		await expect(page.getByTestId("warden-tools-light-panel")).toBeVisible({
			timeout: 5_000,
		});
	};

	// ── 1. Switch to the Light tool via hotkey ───────────────────────────
	// Click somewhere inert (the canvas) to ensure focus is on the page
	// surface and not on a text input, then press `l`.
	await canvas.click({ position: { x: 50, y: 50 } });
	await page.keyboard.press("l");

	// Open the toolbox drawer to confirm the Light authoring panel renders
	// with the empty state.
	await openToolboxDrawer();
	await expect(
		page.getByTestId("warden-tools-light-panel").getByText(/no lights/i),
	).toBeVisible();

	// Close the drawer so its overlay doesn't intercept canvas clicks.
	await closeTransientOverlays();

	// ── 2. Click the canvas → dialog opens ───────────────────────────────
	await canvas.click({ position: { x: 220, y: 180 } });

	const dialog = page.getByTestId("light-source-config-dialog");
	await expect(dialog).toBeVisible({ timeout: 10_000 });

	// ── 3. Fill the form and save ────────────────────────────────────────
	const nameInput = page.getByTestId("light-source-name-input");
	await expect(nameInput).toBeVisible();
	await nameInput.fill("");
	await nameInput.fill("Sconce A");

	// Tweak the bright radius so we can verify edit-mode pre-fill later.
	const brightInput = page.getByTestId("light-source-bright-input");
	await brightInput.fill("");
	await brightInput.fill("4");

	await page.getByTestId("light-source-save-button").click();
	await expect(dialog).toBeHidden({ timeout: 5_000 });

	// ── 4. Verify the light appears in the toolbox list ──────────────────
	await openToolboxDrawer();
	const lightPanel = page.getByTestId("warden-tools-light-panel");
	await expect(lightPanel.getByText("Sconce A").first()).toBeVisible({
		timeout: 5_000,
	});

	// ── 5. Edit it via the list ──────────────────────────────────────────
	// The Edit / Delete buttons carry `aria-label="Edit light <name>"`
	// which overrides the visible text as the accessible name, so we
	// target via the deterministic testid prefix.
	await lightPanel
		.locator('[data-testid^="warden-tools-edit-light-"]')
		.first()
		.click();
	await expect(dialog).toBeVisible({ timeout: 5_000 });

	// Pre-fill assertion: bright radius should still be 4.
	await expect(brightInput).toHaveValue("4");

	// Rename and save.
	await nameInput.fill("");
	await nameInput.fill("Sconce A (renamed)");
	await page.getByTestId("light-source-save-button").click();
	await expect(dialog).toBeHidden({ timeout: 5_000 });

	// Re-open the drawer (saving may have caused it to stay open or not
	// depending on Radix focus restoration; either way we re-open to
	// re-anchor on the panel) and confirm the new label is rendered.
	if (!(await lightPanel.isVisible().catch(() => false))) {
		await openToolboxDrawer();
	}
	await expect(lightPanel.getByText(/Sconce A \(renamed\)/i)).toBeVisible({
		timeout: 5_000,
	});

	// ── 6. Delete via the list ───────────────────────────────────────────
	await lightPanel
		.locator('[data-testid^="warden-tools-delete-light-"]')
		.first()
		.click();
	await expect(lightPanel.getByText(/no lights/i)).toBeVisible({
		timeout: 5_000,
	});

	// ── Final sanity ─────────────────────────────────────────────────────
	expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});
