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
	const activeTokenHeading = page.getByText("ACTIVE TOKEN", { exact: true });
	const playerViewToggle = page.getByTestId("vtt-player-view-toggle");
	const tokenSearch = page.getByPlaceholder("Search tokens...");

	await expect(map).toBeVisible({ timeout: 20_000 });
	await expect(canvas).toBeVisible({ timeout: 20_000 });

	const openToolbox = async () => {
		await page.getByRole("tab", { name: /^Toolbox$/i }).click();
	};

	const placeAscendantToken = async (position: { x: number; y: number }) => {
		await openToolbox();
		await page.getByTestId("vtt-tokens-tab-library").click();
		await tokenSearch.fill("Ascendant (E-Rank)");
		await page
			.getByRole("button", { name: /Ascendant \(E-Rank\)/i })
			.first()
			.click();
		await canvas.click({ position });
		await tokenSearch.fill("");
	};

	await placeAscendantToken({ x: 125, y: 125 });

	await expect(activeTokenHeading).toBeVisible({ timeout: 10_000 });
	await expect(
		page.locator('input[value="Ascendant (E-Rank)"]').first(),
	).toBeVisible();

	await tokenSearch.click();
	await expect(tokenSearch).toBeFocused();
	await canvas.click({ position: { x: 125, y: 125 } });
	await page.keyboard.press("Delete");

	await expect(activeTokenHeading).toHaveCount(0, { timeout: 10_000 });

	await placeAscendantToken({ x: 225, y: 125 });

	await expect(activeTokenHeading).toBeVisible({ timeout: 10_000 });

	await page.getByTestId("vtt-new-scene").click();
	await expect(activeTokenHeading).toHaveCount(0, { timeout: 10_000 });

	await expect(playerViewToggle).toHaveText(/Simulate Player View/i);
	await playerViewToggle.click();
	await expect(playerViewToggle).toHaveText(/Exit Player View/i);
	await expect(
		page.getByRole("button", { name: /Back to Player Tools/i }),
	).toBeVisible({ timeout: 10_000 });
	await expect(page.getByTestId("vtt-new-scene")).toHaveCount(0);
	await expect(page).toHaveURL(new RegExp(`/campaigns/${campaignId}/vtt`, "i"));

	await playerViewToggle.click();
	await expect(playerViewToggle).toHaveText(/Simulate Player View/i);
	await expect(map).toBeVisible({ timeout: 10_000 });

	expect(pageErrors, pageErrors.join("\n")).toEqual([]);
});
