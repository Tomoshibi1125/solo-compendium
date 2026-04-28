import { expect, test } from "@playwright/test";
import { PlayerPage } from "./pages/PlayerPage";

test("guest Ascendant character creation supports imprint choices", async ({
	page,
}) => {
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

	const player = new PlayerPage(page);
	const characterId = await player.createCharacterWithJob(
		"Guest Imprint Ascendant",
		/Destroyer/i,
	);

	expect(characterId).toMatch(/^local_/);
});
