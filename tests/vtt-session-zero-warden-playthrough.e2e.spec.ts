import { expect, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { SharedPage } from "./pages/SharedPage";

/**
 * Full Session Zero Warden playthrough — headed + screenshotted.
 *
 * Simulates a Warden preparing for, then running, Session 0 of "The Shadow of
 * the Regent" sandbox module end-to-end:
 *
 *   Session prep phase:
 *     - Create campaign + sandbox import
 *     - Wait for auto-populate across all stores
 *     - Read Sessions tab, open Session 0
 *     - Skim Warden Notes (DM secrets)
 *     - Skim Wiki (Day Zero lore)
 *     - Skim Handouts (Blank Slate Journal)
 *     - Skim Characters (Warden NPC roster)
 *
 *   Session 0 run phase:
 *     - Load the VTT, switch to a Day Zero / Memory-Care scene
 *     - Exercise zoom (+ / - / 0 / PageUp / PageDown)
 *     - Exercise right-click-drag pan
 *     - Confirm ctrl+wheel does NOT browser-zoom
 *     - Drop a library token on the scene (Warden add-asset while map visible)
 *     - Record a session log entry capturing the prep state
 *     - Simulate Player View briefly then return
 *
 * Screenshots for every phase land in `test-results/warden-session-zero/`.
 * Run headed:
 *   npx playwright test tests/vtt-session-zero-warden-playthrough.e2e.spec.ts \
 *     --headed --project=chromium
 */
test("warden session zero playthrough — prep + run Session 0 end-to-end", async ({
	page,
}) => {
	test.setTimeout(300_000);

	const authPage = new AuthPage(page);
	const sharedPage = new SharedPage(page);
	const pageErrors: string[] = [];
	page.on("pageerror", (err) => pageErrors.push(err.message));

	let shotIdx = 0;
	const shot = async (label: string) => {
		shotIdx += 1;
		const safe = label.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
		const name = `${String(shotIdx).padStart(2, "0")}-${safe}.png`;
		try {
			await page.screenshot({
				path: `test-results/warden-session-zero/${name}`,
				fullPage: false,
			});
		} catch (err) {
			console.warn(`[playthrough] screenshot failed for ${label}:`, err);
		}
	};

	let campaignId = "";

	await test.step("Phase 1 — Guest DM login", async () => {
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
		await page.fill("#campaign-name", `Session 0 Playthrough ${Date.now()}`);
		await page.fill(
			"#campaign-description",
			"Headed playthrough: session prep + Session 0 run as Warden.",
		);
		const importCheckbox = page.locator("#import-sandbox");
		await importCheckbox.click();
		await expect(importCheckbox).toHaveAttribute("data-state", "checked", {
			timeout: 5_000,
		});
		await shot("create-dialog-ready");
		await page.getByRole("button", { name: /^Establish Campaign$/i }).click();
		await page.waitForURL(/\/campaigns\/[a-z0-9-]+/i, { timeout: 20_000 });
		campaignId = new URL(page.url()).pathname.split("/").pop() ?? "";
		expect(campaignId).toBeTruthy();
		await shot("campaign-created");
	});

	await test.step("Phase 3 — Wait for auto-populate to complete", async () => {
		// Poll localStorage for the expected row counts across every store.
		await expect
			.poll(
				async () =>
					await page.evaluate((id) => {
						const read = (key: string) => {
							try {
								const raw = localStorage.getItem(key);
								return raw ? (JSON.parse(raw) as unknown[]).length : 0;
							} catch {
								return 0;
							}
						};
						return read(`solo-compendium.sessions.${id}`);
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
				logs: read(`solo-compendium.session-logs.${id}`),
				notes: read(`solo-compendium.campaign.${id}.notes`),
				encounters: read(`solo-compendium.encounters.${id}`),
				npcs: read(`solo-compendium.npc-characters.${id}`),
				assets: read(`vtt-assets-${id}`),
				audio: read(`vtt-audio-${id}`),
			};
		}, campaignId);
		console.log("[playthrough] autopopulate counts:", counts);
		expect(counts.wiki).toBeGreaterThanOrEqual(37);
		expect(counts.sessions).toBeGreaterThanOrEqual(5);
		expect(counts.notes).toBeGreaterThanOrEqual(5);
		expect(counts.npcs).toBeGreaterThanOrEqual(30);
		await shot("autopopulate-done");
	});

	await test.step("Phase 4 — Overview tab + Warden badge check", async () => {
		await page.goto(`/campaigns/${campaignId}`);
		await sharedPage.dismissAnalyticsBanner();
		// Warden-only Settings tab is the fastest proof we're DM.
		await expect(page.getByRole("tab", { name: /^Settings$/i })).toBeVisible({
			timeout: 10_000,
		});
		await shot("overview");
	});

	await test.step("Phase 5 — Sessions tab + verify Session 0 visible", async () => {
		await page.getByRole("tab", { name: /^Sessions$/i }).click();
		await expect(
			page.getByText(/Session 0.*Day Zero|Day Zero.*Memory-Care/i).first(),
		).toBeVisible({ timeout: 15_000 });
		// Also verify the recap log preview somewhere on the page — the
		// sandbox seeds a player-facing recap with "woke in a place that
		// was trying very hard to look like a hospital." Detection is
		// best-effort because the Sessions panel may collapse logs by
		// default; we don't fail the phase if only the title is shown.
		const previewVisible = await page
			.getByText(/Day Zero|Memory-Care|awakening|Bureau/i)
			.first()
			.isVisible({ timeout: 3_000 })
			.catch(() => false);
		console.log(`[playthrough] sessions preview visible: ${previewVisible}`);
		await shot("sessions-list");
	});

	await test.step("Phase 6 — Warden Notes tab", async () => {
		await page.getByRole("tab", { name: /^Notes$/i }).click();
		await expect(
			page
				.getByText(
					/Warden|Identity-Erosion|The Regent Wears|Pressure Clock|Secret/i,
				)
				.first(),
		).toBeVisible({ timeout: 15_000 });
		await shot("warden-notes");
	});

	await test.step("Phase 7 — Wiki tab (lore + faction + quest)", async () => {
		await page.getByRole("tab", { name: /^Wiki$/i }).click();
		await expect(
			page.getByText(/Day Zero|Gate Cascade|Bureau|Vermillion|Awoko/i).first(),
		).toBeVisible({ timeout: 15_000 });
		await shot("wiki-lore");
	});

	await test.step("Phase 8 — Handouts tab", async () => {
		await page.getByRole("tab", { name: /^Handouts$/i }).click();
		await expect(
			page.getByText(/Blank Slate|Bureau|Awoko|Warden/i).first(),
		).toBeVisible({ timeout: 15_000 });
		await shot("handouts");
	});

	await test.step("Phase 9 — Characters tab + Warden NPC roster", async () => {
		await page.getByRole("tab", { name: /^Characters$/i }).click();
		const roster = page.getByTestId("warden-npc-roster");
		await expect(roster).toBeVisible({ timeout: 15_000 });
		// At least a handful of canonical NPC names should be visible.
		await expect(
			roster.getByText(/Park|Lin|Yoon|Hayashi/i).first(),
		).toBeVisible();
		const cardCount = await page.getByTestId("warden-npc-card").count();
		console.log(`[playthrough] warden npc cards: ${cardCount}`);
		expect(cardCount).toBeGreaterThanOrEqual(10);
		await shot("characters-warden-npcs");
	});

	await test.step("Phase 10 — VTT load + Day Zero scene selection", async () => {
		await page.goto(`/campaigns/${campaignId}/vtt`);
		await sharedPage.dismissAnalyticsBanner();
		await expect(page.getByTestId("vtt-interface")).toBeAttached({
			timeout: 20_000,
		});
		await expect(page.getByTestId("vtt-map")).toBeVisible({
			timeout: 20_000,
		});
		await expect(page.getByTestId("vtt-pixi-host")).toBeAttached();
		await shot("vtt-initial-load");

		// Try to select a Day Zero / Bureau District / Memory-Care scene via
		// the scene-title dropdown. Fall back to the first menuitem if the
		// expected names aren't present.
		await page.getByTestId("vtt-scene-title").click();
		const dayZeroItem = page
			.getByRole("menuitem", {
				name: /Day Zero.*Diagnosed|Memory-Care Wing Exterior|Bureau District/i,
			})
			.first();
		if (await dayZeroItem.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await dayZeroItem.click();
		} else {
			await page.getByRole("menuitem").first().click();
		}
		await page.waitForTimeout(800);
		await expect(page.getByTestId("vtt-pixi-host")).toHaveAttribute(
			"data-bg-loaded",
			"true",
			{ timeout: 20_000 },
		);
		await shot("vtt-scene-loaded");
	});

	await test.step("Phase 11 — Zoom drill: +, PageUp, PageDown, 0", async () => {
		const map = page.getByTestId("vtt-map");
		await map.hover();
		await page.keyboard.press("Equal"); // "+"
		await page.waitForTimeout(250);
		await page.keyboard.press("Equal");
		await page.waitForTimeout(250);
		await shot("vtt-zoomed-in-plus");
		await page.keyboard.press("PageUp");
		await page.waitForTimeout(250);
		await shot("vtt-zoomed-in-pageup");
		await page.keyboard.press("PageDown");
		await page.waitForTimeout(250);
		await page.keyboard.press("Minus");
		await page.waitForTimeout(250);
		await shot("vtt-zoomed-out");
		await page.keyboard.press("Digit0");
		await page.waitForTimeout(250);
		await shot("vtt-zoom-reset");
	});

	await test.step("Phase 12 — Right-click-drag pan", async () => {
		const map = page.getByTestId("vtt-map");
		const box = await map.boundingBox();
		if (!box) throw new Error("map bounding box not available");
		const cx = box.x + box.width / 2;
		const cy = box.y + box.height / 2;
		await page.mouse.move(cx, cy);
		await page.mouse.down({ button: "right" });
		await page.mouse.move(cx - 40, cy - 20, { steps: 4 });
		await page.mouse.move(cx - 80, cy - 40, { steps: 4 });
		await page.mouse.up({ button: "right" });
		await page.waitForTimeout(300);
		// Token context menu must NOT be open (drag suppresses it).
		const menuOpen = await page
			.locator('[role="menu"]')
			.filter({ hasText: /Open Sheet|Remove Token/i })
			.first()
			.isVisible()
			.catch(() => false);
		expect(menuOpen).toBeFalsy();
		await shot("vtt-right-click-panned");
	});

	await test.step("Phase 13 — Ctrl+wheel must not browser-zoom", async () => {
		const preScroll = await page.evaluate(() => ({
			x: window.scrollX,
			y: window.scrollY,
		}));
		await page.evaluate(() => {
			const ev = new WheelEvent("wheel", {
				deltaY: 120,
				ctrlKey: true,
				bubbles: true,
				cancelable: true,
			});
			(
				document.querySelector(".vtt-shell") ??
				document.querySelector('[data-testid="vtt-interface"]') ??
				document.body
			).dispatchEvent(ev);
		});
		await page.waitForTimeout(200);
		const postScroll = await page.evaluate(() => ({
			x: window.scrollX,
			y: window.scrollY,
		}));
		expect(postScroll).toEqual(preScroll);
		await shot("vtt-ctrl-wheel-locked");
	});

	await test.step("Phase 14 — Warden adds a library token via Assets drawer", async () => {
		// Open Assets tab in the right drawer if present (VTTEnhanced layout).
		const assetsTab = page.getByRole("tab", { name: /^Assets$/i }).first();
		if (await assetsTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await assetsTab.click();
			const searchInput = page.getByPlaceholder(/Search .* assets/i).first();
			if (await searchInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await searchInput.fill("");
				await searchInput.fill("Guard Token");
				const assetBtn = page
					.getByRole("button", { name: /Guard Token Frame|Guard Token/i })
					.first();
				if (await assetBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
					await assetBtn.click();
					const placeBtn = page
						.getByRole("button", { name: /^Place Token$/i })
						.first();
					if (await placeBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
						await placeBtn.click();
						await page.waitForTimeout(600);
					}
				}
			}
		}
		// Regardless, the background must still be loaded after any mutation.
		await expect(page.getByTestId("vtt-pixi-host")).toHaveAttribute(
			"data-bg-loaded",
			"true",
			{ timeout: 15_000 },
		);
		await shot("vtt-after-token-add");
	});

	await test.step("Phase 15 — Add a session log entry (best-effort)", async () => {
		await page.goto(`/campaigns/${campaignId}`);
		await sharedPage.dismissAnalyticsBanner();
		await page.getByRole("tab", { name: /^Sessions$/i }).click();
		await page.waitForTimeout(500);
		// Sessions panel surfaces a log-add form. Its exact placeholders vary
		// across builds — try a couple of common patterns.
		const titleInput = page
			.getByPlaceholder(/Log title|Recap title|Entry title|Log Title|Title/i)
			.first();
		const contentInput = page
			.getByPlaceholder(/Content|Recap|Notes|Details|Log content/i)
			.first();
		let logged = false;
		if (await titleInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await titleInput.fill("Session 0 — Prep Complete");
			if (await contentInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
				await contentInput.fill(
					"Warden playthrough smoketest: lore reviewed, NPCs loaded, map ready. Ascendants may now awaken in the Memory-Care Wing.",
				);
			}
			const addBtn = page
				.getByRole("button", {
					name: /^(Add Log|Save Log|Add Entry|Log|Add)$/i,
				})
				.first();
			if (await addBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
				await addBtn.click();
				await page.waitForTimeout(800);
				logged = true;
			}
		}
		console.log(`[playthrough] session log added via form: ${logged}`);
		await shot("sessions-after-log-add");
	});

	await test.step("Phase 16 — Simulate Player View + return to Warden", async () => {
		await page.goto(`/campaigns/${campaignId}/vtt`);
		await sharedPage.dismissAnalyticsBanner();
		await expect(page.getByTestId("vtt-interface")).toBeAttached({
			timeout: 20_000,
		});
		const toggle = page.getByTestId("vtt-player-view-toggle");
		if (await toggle.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await toggle.click().catch(() => {});
			await page.waitForTimeout(800);
			await shot("vtt-player-view");
			// Flip back if the toggle is still reachable. Some builds render
			// the PlayerMapView inside an embedded shell that re-parents the
			// toggle, so we guard with a short timeout + catch.
			const toggleBack = page.getByTestId("vtt-player-view-toggle");
			if (await toggleBack.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await toggleBack.click({ timeout: 3_000 }).catch(() => {});
				await page.waitForTimeout(400);
			}
			await shot("vtt-back-to-warden");
		} else {
			await shot("vtt-player-view-toggle-absent");
		}
	});

	// No JS errors during the run.
	expect(
		pageErrors,
		`Page errors during playthrough:\n${pageErrors.join("\n")}`,
	).toEqual([]);
});
