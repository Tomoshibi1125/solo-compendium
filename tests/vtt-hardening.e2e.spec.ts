import { expect, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { SharedPage } from "./pages/SharedPage";

test("campaign VTT smoke: token selection delete scene clear and player view", async ({
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
		`VTT Smoke ${Date.now()}`,
		"Focused VTT regression coverage",
	);

	await page.goto(`/campaigns/${campaignId}/vtt`);
	await sharedPage.dismissAnalyticsBanner();

	await expect(page).toHaveURL(new RegExp(`/campaigns/${campaignId}/vtt`, "i"));
	await expect(page.getByTestId("vtt-interface")).toBeAttached({
		timeout: 20_000,
	});

	const map = page.getByTestId("vtt-map");
	const canvas = map.locator("canvas").first();
	const pixiHost = page.getByTestId("vtt-pixi-host");
	const activeTokenHeading = page.getByText("ACTIVE TOKEN", { exact: true });
	const playerViewToggle = page.getByTestId("vtt-player-view-toggle");
	const tokenSearch = page.getByPlaceholder("Search tokens...");
	const rendererFallback = page.getByText("Renderer fallback active");
	const radixOverlay = page.locator('[data-state="open"][aria-hidden="true"]');

	await expect(map).toBeVisible({ timeout: 20_000 });
	await expect(canvas).toBeVisible({ timeout: 20_000 });
	await expect(pixiHost).toHaveAttribute("data-renderer-status", "ready", {
		timeout: 20_000,
	});
	await expect(rendererFallback).toBeHidden();

	const openToolbox = async () => {
		await page.getByRole("button", { name: /^Toolbox$/i }).click();
	};

	const closeTransientOverlays = async () => {
		for (let i = 0; i < 3; i++) {
			if ((await radixOverlay.count()) === 0) return;
			await page.keyboard.press("Escape");
			await page.waitForTimeout(150);
		}
		await expect(radixOverlay).toHaveCount(0, { timeout: 5_000 });
	};

	const placeAscendantToken = async (position: { x: number; y: number }) => {
		await openToolbox();
		await page
			.getByRole("dialog", { name: /^Toolbox$/i })
			.getByRole("tab", { name: /^Tokens$/i })
			.click();
		await page.getByTestId("vtt-tokens-tab-library").click();
		await tokenSearch.fill("Ascendant (E-Rank)");
		await page
			.getByRole("button", { name: /Ascendant \(E-Rank\)/i })
			.first()
			.click();
		await closeTransientOverlays();
		await canvas.click({ position });
	};

	await placeAscendantToken({ x: 125, y: 125 });
	await page.getByRole("button", { name: /^Selected Token$/i }).click();

	await expect(activeTokenHeading).toBeVisible({ timeout: 10_000 });
	await expect(
		page.locator('input[value="Ascendant (E-Rank)"]').first(),
	).toBeVisible();

	await closeTransientOverlays();
	await canvas.click({ position: { x: 125, y: 125 } });
	await page.keyboard.press("Delete");

	await expect(activeTokenHeading).toHaveCount(0, { timeout: 10_000 });

	await placeAscendantToken({ x: 225, y: 125 });
	await page.getByRole("button", { name: /^Selected Token$/i }).click();

	await expect(activeTokenHeading).toBeVisible({ timeout: 10_000 });

	await closeTransientOverlays();
	await page.getByTestId("vtt-new-scene").click();
	await expect(activeTokenHeading).toHaveCount(0, { timeout: 10_000 });

	await expect(playerViewToggle).toHaveText(/^Player View$/i);
	await playerViewToggle.click();
	// Entering player view swaps to the embedded player layout, which hides
	// warden-only chrome: the player-view toggle itself unmounts and the
	// New Scene control disappears. The toggle's absence is the robust
	// cross-route signal (isWarden = isActualWarden && !simulatePlayerView,
	// VTTEnhanced.tsx:1045).
	await expect(playerViewToggle).toHaveCount(0, { timeout: 10_000 });
	await expect(page.getByTestId("vtt-new-scene")).toHaveCount(0);
	await expect(page).toHaveURL(new RegExp(`/campaigns/${campaignId}/vtt`, "i"));

	expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});

test("warden can move tokens via arrow keys and canvas drag", async ({
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
		`VTT Move ${Date.now()}`,
		"Token movement regression",
	);

	await page.goto(`/campaigns/${campaignId}/vtt`);
	await sharedPage.dismissAnalyticsBanner();

	await expect(page.getByTestId("vtt-interface")).toBeAttached({
		timeout: 20_000,
	});

	const map = page.getByTestId("vtt-map");
	const canvas = map.locator("canvas").first();
	const pixiHost = page.getByTestId("vtt-pixi-host");
	const tokenPanel = page.getByTestId("vtt-active-token-panel");
	const tokenSearch = page.getByPlaceholder("Search tokens...");
	const rendererFallback = page.getByText("Renderer fallback active");
	const radixOverlay = page.locator('[data-state="open"][aria-hidden="true"]');

	await expect(map).toBeVisible({ timeout: 20_000 });
	await expect(canvas).toBeVisible({ timeout: 20_000 });
	await expect(pixiHost).toHaveAttribute("data-renderer-status", "ready", {
		timeout: 20_000,
	});
	await expect(rendererFallback).toBeHidden();

	const closeTransientOverlays = async () => {
		for (let i = 0; i < 3; i++) {
			if ((await radixOverlay.count()) === 0) return;
			await page.keyboard.press("Escape");
			await page.waitForTimeout(150);
		}
		await expect(radixOverlay).toHaveCount(0, { timeout: 5_000 });
	};

	// ── Place a token via the Toolbox ────────────────────────────────────
	await page.getByRole("button", { name: /^Toolbox$/i }).click();
	await page
		.getByRole("dialog", { name: /^Toolbox$/i })
		.getByRole("tab", { name: /^Tokens$/i })
		.click();
	await page.getByTestId("vtt-tokens-tab-library").click();
	await tokenSearch.fill("Ascendant (E-Rank)");
	await page
		.getByRole("button", { name: /Ascendant \(E-Rank\)/i })
		.first()
		.click();
	await closeTransientOverlays();

	// Click canvas at a known position to place the token.
	// Default gridSize=50, zoom auto-fits but we target a spot well inside
	// the viewport so it maps to a deterministic grid cell.
	await canvas.click({ position: { x: 125, y: 125 } });

	// Helper: open the Selected Token rail and read grid position
	const selectedTokenBtn = page.getByRole("button", {
		name: /^Selected Token$/i,
	});
	const readTokenPos = async (): Promise<{ x: number; y: number }> => {
		await selectedTokenBtn.click();
		await expect(tokenPanel).toBeVisible({ timeout: 10_000 });
		const pos = await tokenPanel.getAttribute("data-active-token-pos");
		expect(pos).toBeTruthy();
		const [x, y] = pos!.split(",").map(Number);
		// Close the dialog so keyboard shortcuts work (inputs steal focus).
		// Then blur the active element so isVttShortcutTarget doesn't block
		// arrow keys when focus rests on a button.
		const closeBtn = page
			.getByRole("dialog", { name: /Selected Token/i })
			.getByRole("button", { name: /Close/i });
		if (await closeBtn.isVisible().catch(() => false)) {
			await closeBtn.click();
		}
		await page.evaluate(() => {
			(document.activeElement as HTMLElement | null)?.blur();
		});
		return { x, y };
	};

	// Confirm initial placement
	const start = await readTokenPos();

	// ── 1. Arrow-key nudge ───────────────────────────────────────────────
	// readTokenPos() closes the dialog so no input has focus. activeTokenId
	// remains set because closing the drawer does not clear it.

	// Press Right arrow → token.x should increase by 1
	await page.keyboard.press("ArrowRight");
	await page.waitForTimeout(200);
	const afterRight = await readTokenPos();
	expect(afterRight.x).toBe(start.x + 1);
	expect(afterRight.y).toBe(start.y);

	// Press Down arrow → token.y should increase by 1
	await page.keyboard.press("ArrowDown");
	await page.waitForTimeout(200);
	const afterDown = await readTokenPos();
	expect(afterDown.x).toBe(start.x + 1);
	expect(afterDown.y).toBe(start.y + 1);

	// Press Left arrow → token.x should decrease by 1
	await page.keyboard.press("ArrowLeft");
	await page.waitForTimeout(200);
	const afterLeft = await readTokenPos();
	expect(afterLeft.x).toBe(start.x);
	expect(afterLeft.y).toBe(start.y + 1);

	// Press Up arrow → token.y should decrease by 1
	await page.keyboard.press("ArrowUp");
	await page.waitForTimeout(200);
	const afterUp = await readTokenPos();
	expect(afterUp.x).toBe(start.x);
	expect(afterUp.y).toBe(start.y);

	// ── 2. Multi-step arrow-key movement ────────────────────────────────
	// Move the token several squares in one direction to confirm cumulative
	// movement works and the position tracks correctly.
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("ArrowDown");
	await page.waitForTimeout(200);
	const afterMultiMove = await readTokenPos();
	expect(afterMultiMove.x).toBe(start.x + 2);
	expect(afterMultiMove.y).toBe(start.y + 1);

	// ── Final checks ─────────────────────────────────────────────────────
	await expect(rendererFallback).toBeHidden();
	expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});

test("warden can drag a token to a new cell and pan the map", async ({
	page,
}) => {
	test.setTimeout(120_000);

	const authPage = new AuthPage(page);
	const sharedPage = new SharedPage(page);
	const pageErrors: string[] = [];
	page.on("pageerror", (error) => pageErrors.push(error.message));

	await authPage.continueAsGuest("dm");
	const campaignId = await sharedPage.createCampaign(
		`VTT Drag ${Date.now()}`,
		"Token drag + viewport pan parity",
	);
	await page.goto(`/campaigns/${campaignId}/vtt`);
	await sharedPage.dismissAnalyticsBanner();

	await expect(page.getByTestId("vtt-interface")).toBeAttached({
		timeout: 20_000,
	});
	const map = page.getByTestId("vtt-map");
	const canvas = map.locator("canvas").first();
	const pixiHost = page.getByTestId("vtt-pixi-host");
	const tokenPanel = page.getByTestId("vtt-active-token-panel");
	const tokenSearch = page.getByPlaceholder("Search tokens...");
	const radixOverlay = page.locator('[data-state="open"][aria-hidden="true"]');

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
		await expect(radixOverlay).toHaveCount(0, { timeout: 5_000 });
	};
	const readTokenPos = async (): Promise<{ x: number; y: number }> => {
		await page.getByRole("button", { name: /^Selected Token$/i }).click();
		await expect(tokenPanel).toBeVisible({ timeout: 10_000 });
		const pos = await tokenPanel.getAttribute("data-active-token-pos");
		expect(pos).toBeTruthy();
		const [x, y] = pos!.split(",").map(Number);
		const closeBtn = page
			.getByRole("dialog", { name: /Selected Token/i })
			.getByRole("button", { name: /Close/i });
		if (await closeBtn.isVisible().catch(() => false)) {
			await closeBtn.click();
		}
		await page.evaluate(() => {
			(document.activeElement as HTMLElement | null)?.blur();
		});
		return { x, y };
	};

	// Place a token near the top-left of the viewport.
	await page.getByRole("button", { name: /^Toolbox$/i }).click();
	await page
		.getByRole("dialog", { name: /^Toolbox$/i })
		.getByRole("tab", { name: /^Tokens$/i })
		.click();
	await page.getByTestId("vtt-tokens-tab-library").click();
	await tokenSearch.fill("Ascendant (E-Rank)");
	await page
		.getByRole("button", { name: /Ascendant \(E-Rank\)/i })
		.first()
		.click();
	await closeTransientOverlays();
	await canvas.click({ position: { x: 150, y: 150 } });

	const start = await readTokenPos();

	// ── Smooth drag: press on the token, drag right, release. The commit is a
	// single snapped grid position (no per-frame cell churn). ──────────────
	const box = await canvas.boundingBox();
	if (!box) throw new Error("canvas bounding box not available");
	await page.mouse.move(box.x + 150, box.y + 150);
	await page.mouse.down();
	await page.mouse.move(box.x + 250, box.y + 150, { steps: 8 });
	await page.mouse.move(box.x + 400, box.y + 150, { steps: 8 });
	await page.mouse.up();
	await page.waitForTimeout(300);

	const afterDrag = await readTokenPos();
	expect(afterDrag.x).toBeGreaterThan(start.x); // dragged to the right
	expect(Number.isInteger(afterDrag.x)).toBe(true); // snapped to a cell
	expect(Number.isInteger(afterDrag.y)).toBe(true);

	// ── Pan: zoom to max so the scene overflows, then middle-mouse drag and
	// confirm the viewport scrolled. ───────────────────────────────────────
	await map.hover();
	for (let i = 0; i < 8; i++) {
		await page.keyboard.press("Equal");
	}
	await page.waitForTimeout(300);
	const scrollBefore = await map.evaluate((el) => ({
		x: el.scrollLeft,
		y: el.scrollTop,
	}));
	await page.mouse.move(box.x + 300, box.y + 200);
	await page.mouse.down({ button: "middle" });
	await page.mouse.move(box.x + 120, box.y + 80, { steps: 10 });
	await page.mouse.up({ button: "middle" });
	await page.waitForTimeout(300);
	const scrollAfter = await map.evaluate((el) => ({
		x: el.scrollLeft,
		y: el.scrollTop,
	}));
	expect(
		scrollAfter.x !== scrollBefore.x || scrollAfter.y !== scrollBefore.y,
	).toBeTruthy();

	await expect(page.getByText("Renderer fallback active")).toBeHidden();
	expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});
