import { expect, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { SharedPage } from "./pages/SharedPage";

/**
 * P1-2 — Configurable wall authoring (Foundry parity).
 *
 * Exercises the full wall-authoring lifecycle introduced in P1-2:
 *   1. Switch to the Wall tool via the `w` hotkey.
 *   2. Confirm the wall type radio appears + defaults to "wall".
 *   3. Click-drag on the map canvas → a wall segment is added to the
 *      scene and the placed-walls list reflects it.
 *   4. Switch the radio to "door" and draw a second segment.
 *   5. Delete one entry from the list → scene drops it.
 *   6. Click "Clear All Walls" → list returns to empty state.
 *
 * Guards regressions for `selectedTool === "wall"` mousedown/mouseup
 * wiring, drag-preview SVG overlay, and the
 * `addWallToScene / removeWallFromScene` scene-state helpers being
 * correctly composed at the page level.
 */
test("warden wall authoring: place, change type, and delete wall segments", async ({
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
		`VTT Wall Authoring ${Date.now()}`,
		"P1-2 wall authoring regression coverage",
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
		await expect(page.getByTestId("warden-tools-wall-panel")).toBeVisible({
			timeout: 5_000,
		});
	};

	// Click-drag helper using Playwright's mouse API. We need real
	// mousedown/mousemove/mouseup because the wall tool listens to the
	// full sequence, not a single click.
	const dragWall = async (
		from: { x: number; y: number },
		to: { x: number; y: number },
	) => {
		const box = await canvas.boundingBox();
		if (!box) throw new Error("canvas has no bounding box");
		await page.mouse.move(box.x + from.x, box.y + from.y);
		await page.mouse.down();
		await page.mouse.move(box.x + to.x, box.y + to.y, { steps: 10 });
		await page.mouse.up();
	};

	// ── 1. Switch to the Wall tool via hotkey ───────────────────────────
	await canvas.click({ position: { x: 50, y: 50 } });
	await page.keyboard.press("w");

	await openToolboxDrawer();
	const wallPanel = page.getByTestId("warden-tools-wall-panel");

	// Empty state + default radio selection
	await expect(wallPanel.getByText(/no walls placed/i)).toBeVisible();
	// The wall-type control is a styled <label> wrapping an sr-only radio
	// input; the selected option is indicated by the `border-primary` class
	// (there is no aria-checked on the label). See VTTEnhanced.tsx:5509.
	await expect(page.getByTestId("warden-tools-wall-type-wall")).toHaveClass(
		/border-primary/,
	);

	// Close the drawer so its overlay doesn't intercept drag events.
	await closeTransientOverlays();

	// ── 2. Draw the first wall (default type) ───────────────────────────
	await dragWall({ x: 120, y: 160 }, { x: 320, y: 160 });

	await openToolboxDrawer();
	await expect(
		wallPanel.locator('[data-testid^="warden-tools-placed-wall-"]'),
	).toHaveCount(1, { timeout: 5_000 });

	// ── 3. Switch to Door + draw a second wall ──────────────────────────
	await page.getByTestId("warden-tools-wall-type-door").click();
	await expect(page.getByTestId("warden-tools-wall-type-door")).toHaveClass(
		/border-primary/,
	);
	await closeTransientOverlays();

	await dragWall({ x: 120, y: 260 }, { x: 320, y: 260 });

	await openToolboxDrawer();
	const placedRows = wallPanel.locator(
		'[data-testid^="warden-tools-placed-wall-"]',
	);
	await expect(placedRows).toHaveCount(2, { timeout: 5_000 });
	// Second entry should be labeled "door". Scope to the placed rows so
	// the radio-button "Door" text doesn't cause a strict-mode collision.
	await expect(placedRows.filter({ hasText: /door/i })).toHaveCount(1);

	// ── 4. Delete a single wall via the list ────────────────────────────
	await wallPanel
		.locator('[data-testid^="warden-tools-delete-wall-"]')
		.first()
		.click();
	await expect(
		wallPanel.locator('[data-testid^="warden-tools-placed-wall-"]'),
	).toHaveCount(1, { timeout: 5_000 });

	// ── 5. Clear all walls ──────────────────────────────────────────────
	await page.getByTestId("warden-tools-clear-all-walls").click();
	await expect(wallPanel.getByText(/no walls placed/i)).toBeVisible({
		timeout: 5_000,
	});

	// ── Final sanity ────────────────────────────────────────────────────
	expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});
