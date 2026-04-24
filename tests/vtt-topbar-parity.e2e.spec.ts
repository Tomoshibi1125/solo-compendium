import { expect, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { SharedPage } from "./pages/SharedPage";

/**
 * Phase 3 VTT parity: verifies the compact top bar, persistent zoom HUD,
 * layer quick-switch, pointer tool hotkey, and Game Log drawer tab all
 * render and respond as expected inside the Warden VTT view.
 */
test("VTT parity: top bar, zoom HUD, layer switch, pointer tool, game log", async ({
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
		`VTT Parity ${Date.now()}`,
		"Top bar / zoom / layer / pointer / log parity smoke",
	);

	await page.goto(`/campaigns/${campaignId}/vtt`);
	await sharedPage.dismissAnalyticsBanner();

	await expect(page.getByTestId("vtt-interface")).toBeAttached({
		timeout: 20_000,
	});
	const map = page.getByTestId("vtt-map");
	await expect(map).toBeVisible({ timeout: 20_000 });

	// --- Compact top bar with pointer-events-none guard ---
	const topBar = page.getByTestId("vtt-topbar");
	await expect(topBar).toBeVisible();
	await expect(topBar).toHaveClass(/pointer-events-none/);

	// --- Persistent zoom HUD is rendered over the canvas ---
	const zoomHud = page.getByTestId("vtt-zoom-hud");
	await expect(zoomHud).toBeVisible();
	const zoomIn = page.getByTestId("vtt-zoom-in");
	const zoomFit = page.getByTestId("vtt-zoom-fit");
	await expect(zoomIn).toBeVisible();
	await expect(page.getByTestId("vtt-zoom-out")).toBeVisible();
	await expect(zoomFit).toBeVisible();

	// Zoom percent (rendered inside vtt-zoom-reset) should update when
	// clicking + / -.
	const zoomReset = page.getByTestId("vtt-zoom-reset");
	const initialPct = (await zoomReset.textContent())?.trim() ?? "100%";
	await zoomIn.click();
	await expect(zoomReset).not.toHaveText(initialPct);
	await zoomFit.click();
	await expect(zoomReset).toBeVisible();

	// --- Layer quick-switch renders all four layers and responds to clicks ---
	const layerBar = page.getByTestId("vtt-layer-quick-switch");
	await expect(layerBar).toBeVisible();
	for (const id of [0, 1, 2, 3]) {
		await expect(page.getByTestId(`vtt-layer-select-${id}`)).toBeVisible();
	}
	// Token layer starts active.
	await expect(page.getByTestId("vtt-layer-select-1")).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	// `]` cycles forward.
	await map.click({ position: { x: 300, y: 300 } });
	await page.keyboard.press("]");
	await expect(page.getByTestId("vtt-layer-select-2")).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	await page.keyboard.press("[");
	await expect(page.getByTestId("vtt-layer-select-1")).toHaveAttribute(
		"aria-pressed",
		"true",
	);

	// --- Pointer tool (X) is wired into the toolbox ---
	await page.keyboard.press("x");
	// The toolbox tab contains the pointer tool button; confirming the hotkey
	// doesn't throw is enough for the smoke. (Switching back to select so we
	// don't leak pointer broadcasts into the rest of the test.)
	await page.keyboard.press("s");

	// --- Game Log drawer tab opens the feed ---
	const gameLogRail = page.getByTestId("vtt-rail-right-log");
	await expect(gameLogRail).toBeVisible();
	await gameLogRail.click();
	await expect(page.getByTestId("campaign-roll-feed")).toBeVisible({
		timeout: 5_000,
	});

	expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});
