import { expect, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { SharedPage } from "./pages/SharedPage";

/**
 * Regression coverage for "guest warden running a first session":
 *   - Loads VTT as warden (NOT Simulate Player View).
 *   - Applies a library map to the active scene.
 *   - Verifies the Pixi host reports a rendered background.
 *   - Places a token, triggers scene mutations, and re-asserts the
 *     background is still rendered in Warden view.
 *   - Creates a new scene, applies a different map, and swaps back.
 *
 * Guards the bug where the Pixi stage would tear down and rebuild the
 * `bg` container on every scene/token change but the dedicated
 * background effect never re-ran, leaving the Warden staring at a
 * blank canvas until they toggled Simulate Player View.
 */
test("guest warden first session: map renders in Warden view across scene/token changes", async ({
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
		`Warden First Session ${Date.now()}`,
		"VTT warden-view background regression",
	);

	await page.goto(`/campaigns/${campaignId}/vtt`);
	await sharedPage.dismissAnalyticsBanner();

	await expect(page.getByTestId("vtt-interface")).toBeAttached({
		timeout: 20_000,
	});

	const map = page.getByTestId("vtt-map");
	const canvas = map.locator("canvas").first();
	const pixiHost = page.getByTestId("vtt-pixi-host");
	const playerViewToggle = page.getByTestId("vtt-player-view-toggle");

	await expect(map).toBeVisible({ timeout: 20_000 });
	await expect(canvas).toBeVisible({ timeout: 20_000 });
	await expect(pixiHost).toBeAttached({ timeout: 20_000 });

	// We must remain in Warden view the entire time — the bug only
	// manifested when the Warden *hadn't* simulated player view.
	await expect(playerViewToggle).toHaveText(/Simulate Player View/i);

	// ── Helpers ──────────────────────────────────────────────────────────
	// The asset browser thumbnails + preview "Use as Map/Token" buttons
	// let us apply maps and append tokens without ever needing to click
	// the Pixi canvas (which is wrapped in overflow scroll containers
	// that intercept Playwright's position-based clicks).
	const openAssets = async () => {
		await page.getByRole("tab", { name: /^Assets$/i }).first().click();
	};
	const assetSearch = page.getByPlaceholder(/Search .* assets/i).first();

	const applyAssetAs = async (
		searchTerm: string,
		buttonMatcher: RegExp,
		action: "map" | "token",
	) => {
		await openAssets();
		await expect(assetSearch).toBeVisible({ timeout: 10_000 });
		await assetSearch.fill("");
		await assetSearch.fill(searchTerm);
		await page.getByRole("button", { name: buttonMatcher }).first().click();
		const actionBtn = page
			.getByRole("button", {
				name: action === "map" ? /^Use as Map$/i : /^Place Token$/i,
			})
			.first();
		await expect(actionBtn).toBeVisible({ timeout: 10_000 });
		await actionBtn.click();
	};

	// ── 1. Apply a library map to Scene 1 ────────────────────────────────
	await applyAssetAs("Rift Keep", /Rift Keep/i, "map");

	// Wait for Pixi to load the texture and mark the host as bg-loaded.
	await expect(pixiHost).toHaveAttribute("data-bg-loaded", "true", {
		timeout: 20_000,
	});
	await expect(playerViewToggle).toHaveText(/Simulate Player View/i);

	// ── 2. Mutate the scene via additional tokens (regression guard) ─────
	// Appending tokens forces the Pixi main effect to tear down and
	// rebuild. Before the fix, this cleared the background container
	// and the dedicated bg effect never re-ran → blank map for the
	// Warden until Simulate Player View toggled.
	await applyAssetAs("Guard Token", /Guard Token Frame/i, "token");
	await expect(pixiHost).toHaveAttribute("data-bg-loaded", "true", {
		timeout: 15_000,
	});
	await expect(playerViewToggle).toHaveText(/Simulate Player View/i);

	await applyAssetAs("Boss Token", /Boss Token Frame/i, "token");
	await expect(pixiHost).toHaveAttribute("data-bg-loaded", "true", {
		timeout: 15_000,
	});
	await expect(playerViewToggle).toHaveText(/Simulate Player View/i);

	// ── 3. Create a second scene and apply a different map ───────────────
	// A freshly created scene has no backgroundImage so the bg-loaded
	// signal must be cleared, and applying a new map re-raises it.
	await page.getByRole("tab", { name: /^Scene$/i }).click();
	await page.getByTestId("vtt-new-scene").click();
	await expect(pixiHost).not.toHaveAttribute("data-bg-loaded", "true", {
		timeout: 5_000,
	});

	await applyAssetAs("Shadow Crypt", /Shadow Crypt/i, "map");
	await expect(pixiHost).toHaveAttribute("data-bg-loaded", "true", {
		timeout: 20_000,
	});

	// ── 4. Switch back to Scene 1 — background must still be present ─────
	// Applying a map via Use as Map renames the active scene to the map's
	// name, so the first scene is now "Rift Keep" and the second is
	// "Shadow Crypt".
	await page.getByRole("tab", { name: /^Scene$/i }).click();
	await page.getByTestId("vtt-scene-select-rift-keep").click();
	await expect(pixiHost).toHaveAttribute("data-bg-loaded", "true", {
		timeout: 15_000,
	});

	await page.getByTestId("vtt-scene-select-shadow-crypt").click();
	await expect(pixiHost).toHaveAttribute("data-bg-loaded", "true", {
		timeout: 15_000,
	});

	// ── Final sanity checks ──────────────────────────────────────────────
	await expect(playerViewToggle).toHaveText(/Simulate Player View/i);
	expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});
