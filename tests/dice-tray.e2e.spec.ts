import { expect, test } from "@playwright/test";

test.describe("Unified dice tray", () => {
	test("opens through the legacy route and rolls from the global overlay", async ({
		page,
	}) => {
		await page.goto("/dice");
		await expect(page).toHaveURL(/\/landing$/);
		await expect(
			page.getByRole("heading", { name: "Digital Dice" }),
		).toBeVisible();

		await page.getByRole("button", { name: "d20", exact: true }).click();
		await page.getByTestId("dice-tray-roll-button").click();
		await expect(page.getByTestId("dice-tray-result-total")).toBeVisible({
			timeout: 10_000,
		});

		await page.getByRole("tab", { name: /history/i }).click();
		await expect(page.getByText("Recent rolls")).toBeVisible();

		await page.getByRole("tab", { name: /sets/i }).click();
		await page.getByRole("button", { name: "Frost Regent" }).click();
		await page
			.getByRole("switch", { name: "Use instant dice results" })
			.click();

		await page.keyboard.press("Escape");
		await expect(
			page.getByRole("heading", { name: "Digital Dice" }),
		).not.toBeVisible();
	});
});
