import { expect, test } from "@playwright/test";
import { PlayerPage } from "./pages/PlayerPage";

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem("solo-compendium.guest.role", "ascendant");
		localStorage.setItem(
			"solo-compendium-analytics-consent",
			JSON.stringify({
				status: "rejected",
				version: 1,
				timestamp: Date.now(),
			}),
		);
	});
});

test("guest Ascendant character creation supports martial imprint choices", async ({
	page,
}) => {
	const player = new PlayerPage(page);
	const characterId = await player.createCharacterWithJob(
		"Guest Imprint Ascendant",
		/Destroyer/i,
	);

	expect(characterId).toMatch(/^local_/);
});

test("guest Ascendant character creation supports spellbook imprint choices", async ({
	page,
}) => {
	const player = new PlayerPage(page);
	const characterId = await player.createCharacterWithJob(
		"Guest Spellbook Ascendant",
		/Mage/i,
	);

	expect(characterId).toMatch(/^local_/);
});
