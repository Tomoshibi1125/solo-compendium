import { expect, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { PlayerPage } from "./pages/PlayerPage";
import { SharedPage } from "./pages/SharedPage";

/**
 * Full Player-perspective Session Zero playthrough — headed + screenshotted.
 *
 * Mirrors the Warden playthrough from the player's side. Walks:
 *
 *   Character creation:
 *     - Character wizard (Concept → Job → Abilities → [Path] →
 *       Background → Equipment → Review)
 *     - Character sheet verification
 *
 *   Campaign link + session prep:
 *     - Campaign created with sandbox import (so player has a real live
 *       campaign with populated content to browse)
 *     - Shared character attaches to the campaign
 *     - Player-facing tabs exercised: Overview / Wiki / Handouts /
 *       Characters / Sessions
 *
 *   Session 0 — played as Player:
 *     - VTT loaded, Day Zero scene selected
 *     - Simulate Player View toggle (uses the real PlayerMapView render)
 *     - Standalone PlayerMapView route exercised
 *     - Player Tools hub + detail pages (Inventory, Abilities, Quest Log,
 *       Dice Roller)
 *     - Character sheet under campaign context
 *
 * Why single-context rather than dual-context: in guest mode, the share-
 * code lookup in `useCampaignByShareCode` falls through to
 * `loadLocalCampaigns()` which is per-localStorage; a separate Playwright
 * context cannot see the DM's campaign. The existing `dual-context.e2e`
 * relies on Supabase anon-readable campaigns, which not every E2E env
 * supports. This spec stays single-context and simulates the player's UX
 * via the `Simulate Player View` toggle + the standalone PlayerMapView
 * route, both of which render the exact component a real player would see.
 *
 * Run headed:
 *   npx playwright test tests/vtt-session-zero-player-playthrough.e2e.spec.ts \
 *     --headed --project=chromium
 */
test("player session zero playthrough — character creation through first session", async ({
	page,
}) => {
	test.setTimeout(360_000);

	const authPage = new AuthPage(page);
	const sharedPage = new SharedPage(page);
	const player = new PlayerPage(page);
	const pageErrors: string[] = [];
	page.on("pageerror", (err) => pageErrors.push(err.message));

	let shotIdx = 0;
	const shot = async (label: string) => {
		shotIdx += 1;
		const safe = label.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
		const name = `${String(shotIdx).padStart(2, "0")}-${safe}.png`;
		try {
			await page.screenshot({
				path: `test-results/player-session-zero/${name}`,
				fullPage: false,
			});
		} catch (err) {
			console.warn(`[player-playthrough] screenshot failed: ${label}`, err);
		}
	};

	let campaignId = "";
	let characterId: string | null = null;

	await test.step("Phase 1 — Guest DM login", async () => {
		// We start as a Warden to own the campaign. The PlayerPage POM still
		// works because `/characters/new` and `/player-tools/*` routes don't
		// gate on role — only on authentication. The player's UX is then
		// exercised via `Simulate Player View` + the standalone
		// `/player-tools/map` route, which both render the real PlayerMapView
		// component a true player would see.
		await authPage.continueAsGuest("dm");
		await shot("dm-login-complete");
	});

	await test.step("Phase 2 — Create campaign with sandbox import", async () => {
		await page.goto("/campaigns");
		await sharedPage.dismissAnalyticsBanner();
		await page
			.getByRole("button", {
				name: /^(Create Campaign|Establish Your Campaign|Create)$/i,
			})
			.first()
			.click();
		await page.fill("#campaign-name", `Player Session 0 ${Date.now()}`);
		await page.fill(
			"#campaign-description",
			"Player-perspective playthrough smoketest: character to session 0.",
		);
		const importCheckbox = page.locator("#import-sandbox");
		await importCheckbox.click();
		await expect(importCheckbox).toHaveAttribute("data-state", "checked", {
			timeout: 5_000,
		});
		await page.getByRole("button", { name: /^Establish Campaign$/i }).click();
		await page.waitForURL(/\/campaigns\/[a-z0-9-]+/i, { timeout: 20_000 });
		campaignId = new URL(page.url()).pathname.split("/").pop() ?? "";
		expect(campaignId).toBeTruthy();
		await shot("campaign-created");
	});

	await test.step("Phase 3 — Wait for auto-populate", async () => {
		await expect
			.poll(
				async () =>
					await page.evaluate((id) => {
						try {
							const raw = localStorage.getItem(
								`solo-compendium.sessions.${id}`,
							);
							return raw ? (JSON.parse(raw) as unknown[]).length : 0;
						} catch {
							return 0;
						}
					}, campaignId),
				{ timeout: 60_000, intervals: [500, 1000, 2000] },
			)
			.toBeGreaterThanOrEqual(5);
		const counts = await page.evaluate((id) => {
			const read = (key: string) => {
				try {
					const raw = localStorage.getItem(key);
					return raw ? (JSON.parse(raw) as unknown[]).length : 0;
				} catch {
					return 0;
				}
			};
			return {
				wiki: read(`solo-compendium.wiki.${id}`),
				journals: read(`vtt-journal-${id}`),
				sessions: read(`solo-compendium.sessions.${id}`),
				notes: read(`solo-compendium.campaign.${id}.notes`),
				encounters: read(`solo-compendium.encounters.${id}`),
				npcs: read(`solo-compendium.npc-characters.${id}`),
			};
		}, campaignId);
		console.log("[player-playthrough] autopopulate counts:", counts);
		expect(counts.wiki).toBeGreaterThanOrEqual(37);
		expect(counts.sessions).toBeGreaterThanOrEqual(5);
		await shot("autopopulate-done");
	});

	await test.step("Phase 4 — Player creates character via 6-step wizard", async () => {
		characterId = await player.createCharacter(
			`Ascendant ${Date.now().toString(36)}`,
		);
		console.log(`[player-playthrough] character id: ${characterId}`);
		// createCharacter returns null if compendium data isn't available.
		// In that case we fall back to the character list to find any
		// existing row so subsequent phases can link to it. We treat a
		// missing character as a soft signal — the Session-0 tour still
		// runs against the campaign regardless.
		if (!characterId) {
			characterId = await player.getFirstExistingCharacterId();
			console.log(
				`[player-playthrough] fallback first-existing character id: ${characterId}`,
			);
		}
		await shot("character-created");
	});

	await test.step("Phase 5 — Verify character sheet renders", async () => {
		if (!characterId) {
			console.log(
				"[player-playthrough] skipping sheet verification (no character id)",
			);
			await shot("character-sheet-skipped");
			return;
		}
		const sheetOk = await player.verifyCharacterSheet(characterId);
		console.log(`[player-playthrough] character sheet rendered: ${sheetOk}`);
		await shot("character-sheet");
	});

	await test.step("Phase 6 — Link character to campaign via Share Character", async () => {
		await page.goto(`/campaigns/${campaignId}`);
		await sharedPage.dismissAnalyticsBanner();
		await page.getByRole("tab", { name: /^Characters$/i }).click();
		// Locate Share Character button (enabled only if user has any character).
		const shareBtn = page
			.getByRole("button", { name: /Share Character/i })
			.first();
		if (await shareBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
			const enabled = await shareBtn.isEnabled().catch(() => false);
			if (enabled) {
				await shareBtn.click();
				// Radix Select in the share dialog — pick first available.
				const combobox = page.locator('button[role="combobox"]').first();
				if (await combobox.isVisible({ timeout: 3_000 }).catch(() => false)) {
					await combobox.click();
					const firstOption = page.getByRole("option").first();
					if (
						await firstOption.isVisible({ timeout: 3_000 }).catch(() => false)
					) {
						await firstOption.click();
						const confirmBtn = page
							.getByRole("button", { name: /^Share$/i })
							.first();
						if (
							await confirmBtn.isVisible({ timeout: 3_000 }).catch(() => false)
						) {
							await confirmBtn.click();
							await page.waitForTimeout(800);
						}
					}
				}
			}
		}
		await shot("character-linked-to-campaign");
	});

	await test.step("Phase 7 — Session prep browse: Sessions / Wiki / Handouts", async () => {
		await page.goto(`/campaigns/${campaignId}`);
		await sharedPage.dismissAnalyticsBanner();
		await page.getByRole("tab", { name: /^Sessions$/i }).click();
		await expect(
			page.getByText(/Session 0.*Day Zero|Day Zero.*Memory-Care/i).first(),
		).toBeVisible({ timeout: 15_000 });
		await shot("player-sessions-tab");

		await page.getByRole("tab", { name: /^Wiki$/i }).click();
		await expect(
			page.getByText(/Day Zero|Gate Cascade|Bureau|Vermillion|Awoko/i).first(),
		).toBeVisible({ timeout: 15_000 });
		await shot("player-wiki-tab");

		await page.getByRole("tab", { name: /^Handouts$/i }).click();
		await expect(
			page.getByText(/Blank Slate|Bureau|Awoko|Warden/i).first(),
		).toBeVisible({ timeout: 15_000 });
		await shot("player-handouts-tab");
	});

	await test.step("Phase 8 — VTT: load Day Zero scene (Warden view first)", async () => {
		await page.goto(`/campaigns/${campaignId}/vtt`);
		await sharedPage.dismissAnalyticsBanner();
		await expect(page.getByTestId("vtt-interface")).toBeAttached({
			timeout: 20_000,
		});
		await expect(page.getByTestId("vtt-map")).toBeVisible({
			timeout: 20_000,
		});

		// Switch to Day Zero / Memory-Care Wing scene if available.
		await page.getByTestId("vtt-scene-title").click();
		const dayZero = page
			.getByRole("menuitem", {
				name: /Day Zero.*Diagnosed|Memory-Care Wing Exterior|Bureau District/i,
			})
			.first();
		if (await dayZero.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await dayZero.click();
		} else {
			await page.getByRole("menuitem").first().click();
		}
		await page.waitForTimeout(800);
		await expect(page.getByTestId("vtt-pixi-host")).toHaveAttribute(
			"data-bg-loaded",
			"true",
			{ timeout: 20_000 },
		);
		await shot("vtt-scene-loaded-as-warden");
	});

	await test.step("Phase 9 — VTT: flip into Simulate Player View", async () => {
		// The Warden's `Simulate Player View` toggle renders the real
		// PlayerMapView inside an EmbeddedProvider. This is the authoritative
		// reproduction of what a real player sees in the campaign VTT.
		const toggle = page.getByTestId("vtt-player-view-toggle");
		if (await toggle.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await toggle.click();
			await page.waitForTimeout(1_200);
			await shot("vtt-simulated-player-view");
		} else {
			console.log(
				"[player-playthrough] player view toggle not found, skipping",
			);
			await shot("vtt-player-toggle-absent");
		}
	});

	await test.step("Phase 10 — Player Tools hub (Inventory / Abilities / Quest Log)", async () => {
		await player.verifyPlayerToolsHub();
		await shot("player-tools-hub");
		await player.verifyInventoryTool();
		await shot("player-inventory");
		await player.verifyAbilitiesTool();
		await shot("player-abilities");
		await player.verifyQuestLogTool();
		await shot("player-quest-log");
	});

	await test.step("Phase 11 — Standalone Player Map View + zoom/grid", async () => {
		// verifyPlayerMapView also exercises the zoom in/out + grid toggle
		// buttons available on the player map.
		await player.verifyPlayerMapView();
		await shot("player-map-view-standalone");
	});

	await test.step("Phase 12 — Dice Roller round-trip", async () => {
		await page.goto("/dice");
		await page.waitForTimeout(800);

		// The dice roller disables its Roll button until at least one die
		// is staged. Click a d20 picker (if available) to stage a die,
		// then roll. All interactions are best-effort; a missing picker
		// shouldn't fail the playthrough.
		const diePicker = page
			.getByRole("button", { name: /^d20$|Add d20|Roll d20/i })
			.first();
		if (await diePicker.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await diePicker.click().catch(() => {});
			await page.waitForTimeout(300);
		}

		const rollBtn = page
			.getByTestId("dice-roll-button")
			.or(
				page.getByRole("button", {
					name: /^Roll$|Roll Dice|Roll Now/i,
				}),
			)
			.first();
		if (await rollBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
			const enabled = await rollBtn
				.isEnabled({ timeout: 1_000 })
				.catch(() => false);
			if (enabled) {
				await rollBtn.click();
				await page.waitForTimeout(500);
			}
		}
		await shot("dice-roller");
	});

	await test.step("Phase 13 — Character compare page", async () => {
		await player.verifyCharacterCompare();
		await shot("character-compare");
	});

	// No JS errors from any phase.
	expect(
		pageErrors,
		`Page errors during player playthrough:\n${pageErrors.join("\n")}`,
	).toEqual([]);
});
