import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { PlayerPage } from "./pages/PlayerPage";

/**
 * Guest persistence: reloading the tab must restore character state.
 *
 * Guest data lives in this browser context's localStorage ("Guest mode saves
 * data only in this browser"), so the contract under test is same-context
 * reload persistence — cross-context restore is a real-account (Supabase)
 * feature and is intentionally out of scope here.
 */

test.describe
	.serial("Ascendant persistence: reload restores state", () => {
		let playerContext: BrowserContext;
		let playerPage: Page;

		// StatusHeader HP block ("HIT_POINTS  current / max"). The sheet renders
		// desktop AND mobile (`md:hidden`) layouts into the DOM, so filter to
		// the visible instance.
		const hpBlock = (page: Page) =>
			page.locator("button:visible").filter({ hasText: "HIT_POINTS" }).first();

		// The loaded sheet has no back button — anchor on the rest controls and
		// the StatusHeader HP block, which are always in the header.
		const waitForSheet = async (page: Page) => {
			await expect(
				page.getByRole("button", { name: /Short Rest/i }).first(),
			).toBeVisible({ timeout: 20_000 });
			await expect(hpBlock(page)).toBeVisible({ timeout: 20_000 });
		};

		const openFirstCharacterSheet = async (page: Page) => {
			await page.goto("/characters");
			const characterCard = page
				.locator('[data-testid="character-card"]')
				.first();
			await expect(characterCard).toBeVisible({ timeout: 15_000 });
			await characterCard.click();
			await expect(page).toHaveURL(/\/characters\//, { timeout: 20_000 });
			await waitForSheet(page);
		};

		// The spell-slot rows live in the ABILITIES window's Resources sub-tab,
		// which only mounts once the sheet's main Abilities tab is active (the
		// sheet defaults to Actions). The mobile layout duplicates the tab
		// labels in the DOM, so filter to the visible triggers.
		const openResourcesSubTab = async (page: Page) => {
			await page
				.getByRole("tab", { name: /^Abilities$/i })
				.filter({ visible: true })
				.first()
				.click();
			await page
				.getByRole("tab", { name: /Resources/i })
				.filter({ visible: true })
				.first()
				.click();
		};

		// First POWER SLOTS row ("Tier N  current / max  …controls").
		const firstSlotRow = (page: Page) =>
			page
				.locator("div.justify-between")
				.filter({
					has: page.locator('[data-testid^="spell-slot-decrease-tier-"]'),
				})
				.first();

		const readSlotCounts = async (page: Page) => {
			const text = (await firstSlotRow(page).innerText()).replace(/\s+/g, " ");
			const match = text.match(/(\d+)\s*\/\s*(\d+)/);
			expect(
				match,
				`slot row should show current/max (got "${text}")`,
			).toBeTruthy();
			return {
				current: Number(match?.[1]),
				max: Number(match?.[2]),
			};
		};

		const readHp = async (page: Page) => {
			const text = (await hpBlock(page).innerText()).replace(/\s+/g, " ");
			const match = text.match(/(\d+)\s*\/\s*(\d+)/);
			expect(
				match,
				`HP block should show current/max (got "${text}")`,
			).toBeTruthy();
			return { current: Number(match?.[1]), max: Number(match?.[2]) };
		};

		test.beforeAll(async ({ browser }) => {
			playerContext = await browser.newContext();
			playerPage = await playerContext.newPage();
			const auth = new AuthPage(playerPage);
			await auth.continueAsGuest("player");

			// A fresh guest context has an empty roster — seed a caster so the
			// spell-slot test exercises its real branch.
			const player = new PlayerPage(playerPage);
			const characterId = await player.createCharacterWithJob(
				"Persistence Mage",
				/Mage/i,
			);
			expect(characterId, "guest character creation must succeed").toBeTruthy();

			await playerPage.goto("/characters");
			await expect(playerPage.locator("h1")).toContainText("Ascendant Roster", {
				timeout: 15_000,
			});
		});

		test.afterAll(async () => {
			await playerContext?.close();
		});

		test("character sheet: spell slots persist after reload", async () => {
			await openFirstCharacterSheet(playerPage);
			await openResourcesSubTab(playerPage);

			const decreaseBtn = playerPage
				.locator('[data-testid^="spell-slot-decrease-tier-"]')
				.first();
			await expect(decreaseBtn).toBeVisible({ timeout: 15_000 });

			const initial = await readSlotCounts(playerPage);
			expect(
				initial.current,
				"fresh caster should have unspent slots",
			).toBeGreaterThan(0);

			await decreaseBtn.click();
			await expect
				.poll(async () => (await readSlotCounts(playerPage)).current, {
					timeout: 10_000,
				})
				.toBe(initial.current - 1);

			await playerPage.reload();
			await waitForSheet(playerPage);
			await openResourcesSubTab(playerPage);

			// Poll: the slots panel briefly renders seeded/max values before the
			// persisted row hydrates (async rune-bonus computation), so a direct
			// read races the UI even though the localStorage write is synchronous.
			await expect
				.poll(async () => (await readSlotCounts(playerPage)).current, {
					timeout: 10_000,
				})
				.toBe(initial.current - 1);
			const reloaded = await readSlotCounts(playerPage);
			expect(reloaded.max).toBe(initial.max);
		});

		test("character sheet: resources/HP persist after reload", async () => {
			if (!playerPage.url().includes("/characters/")) {
				await openFirstCharacterSheet(playerPage);
			}

			const initial = await readHp(playerPage);
			expect(
				initial.current,
				"character should start above 0 HP",
			).toBeGreaterThan(0);

			// HP block opens the "Manage Hit Points" dialog (it closes itself
			// after applying damage or healing).
			await hpBlock(playerPage).click();
			const dialog = playerPage.getByRole("dialog");
			await expect(dialog.getByText("Manage Hit Points")).toBeVisible({
				timeout: 10_000,
			});
			await dialog.getByPlaceholder(/Enter amount/i).fill("1");
			await dialog.getByRole("button", { name: "Damage" }).click();
			await expect(dialog).not.toBeVisible({ timeout: 10_000 });

			await expect
				.poll(async () => (await readHp(playerPage)).current, {
					timeout: 10_000,
				})
				.toBe(initial.current - 1);

			await playerPage.reload();
			await waitForSheet(playerPage);

			const reloaded = await readHp(playerPage);
			expect(reloaded.current).toBe(initial.current - 1);
			expect(reloaded.max).toBe(initial.max);
		});

		test("mobile navigation and character sheet remain usable", async ({
			browser,
		}) => {
			test.setTimeout(180_000);
			const mobileContext = await browser.newContext({
				baseURL: "http://localhost:8080",
				viewport: { width: 390, height: 844 },
				isMobile: true,
				hasTouch: true,
				storageState: await playerContext.storageState(),
			});
			const mobilePage = await mobileContext.newPage();
			const assertNoHorizontalOverflow = async () => {
				const diagnostics = await mobilePage.evaluate(() => {
					const outsideViewport = Array.from(
						document.querySelectorAll(
							'a[href], button, input, select, textarea, [role="button"], [role="tab"]',
						),
					).filter((element) => {
						const rect = element.getBoundingClientRect();
						if (rect.width <= 0 || element.getClientRects().length === 0)
							return false;
						let ancestor: Element | null = element;
						while (ancestor && ancestor !== document.body) {
							const overflowX = getComputedStyle(ancestor).overflowX;
							if (overflowX === "auto" || overflowX === "scroll") return false;
							ancestor = ancestor.parentElement;
						}
						return rect.left < -1 || rect.right > window.innerWidth + 1;
					});
					return {
						pageOverflow:
							document.documentElement.scrollWidth - window.innerWidth,
						offenders: outsideViewport.slice(0, 8).map((element) => ({
							tag: element.tagName,
							className: (element as HTMLElement).className?.toString(),
							left: Math.round(element.getBoundingClientRect().left),
							right: Math.round(element.getBoundingClientRect().right),
						})),
					};
				});
				expect(
					diagnostics.pageOverflow,
					`page should not horizontally overflow: ${JSON.stringify(diagnostics)}`,
				).toBeLessThanOrEqual(1);
				expect(
					diagnostics.offenders,
					`visible content should stay inside the viewport: ${JSON.stringify(diagnostics)}`,
				).toEqual([]);
			};
			const openMoreMenu = async () => {
				await mobilePage
					.getByRole("button", { name: "Open full menu" })
					.click();
				await expect(
					mobilePage.getByTestId("mobile-navigation-drawer"),
				).toBeVisible();
			};
			const navDrawer = () =>
				mobilePage.getByTestId("mobile-navigation-drawer");

			try {
				await mobilePage.goto("/ascendant-tools");
				await expect(
					mobilePage.locator('nav[aria-label="Primary"]'),
				).toBeVisible();
				await assertNoHorizontalOverflow();

				// Selecting a drawer route closes it, including a query-only change
				// while already on the Compendium page.
				await openMoreMenu();
				await mobilePage
					.locator('a[href="/compendium?category=paths"]')
					.filter({ visible: true })
					.first()
					.click();
				await expect(mobilePage).toHaveURL(/\/compendium\?category=paths/);
				await expect(navDrawer()).toBeHidden();
				await openMoreMenu();
				await mobilePage
					.locator('a[href="/compendium?category=anomalies"]')
					.filter({ visible: true })
					.first()
					.click();
				await expect(mobilePage).toHaveURL(/\/compendium\?category=anomalies/);
				await expect(navDrawer()).toBeHidden();

				// The More drawer also closes when choosing the Dice action.
				await openMoreMenu();
				await mobilePage.getByRole("button", { name: "Dice Roller" }).click();
				await expect(navDrawer()).toBeHidden();

				// Smoke the primary mobile routes at each agreed phone width.
				for (const width of [360, 390, 430]) {
					await mobilePage.setViewportSize({ width, height: 844 });
					for (const route of [
						"/characters",
						"/compendium",
						"/campaigns",
						"/ascendant-tools",
					]) {
						await mobilePage.goto(route);
						await expect(
							mobilePage.locator('nav[aria-label="Primary"]'),
						).toBeVisible();
						await assertNoHorizontalOverflow();
					}
				}

				await mobilePage.setViewportSize({ width: 390, height: 844 });
				await openFirstCharacterSheet(mobilePage);
				const visibleStatusLabel = mobilePage
					.locator(".character-status-label")
					.filter({ visible: true })
					.first();
				await expect(visibleStatusLabel).toBeVisible();
				const statusLabelFont = await visibleStatusLabel.evaluate((element) =>
					Number.parseFloat(getComputedStyle(element).fontSize),
				);
				expect(statusLabelFont).toBeGreaterThanOrEqual(12);
				const statusLabelContrast = await visibleStatusLabel.evaluate(
					(element) => {
						const parseColor = (color: string) => {
							const channels = color.match(/[\d.]+/g)?.map(Number) ?? [];
							return channels.length >= 3
								? [channels[0], channels[1], channels[2]]
								: [0, 0, 0];
						};
						const foregroundStyle = getComputedStyle(element);
						const backgroundStyle = getComputedStyle(
							element.parentElement ?? element,
						);
						const foreground = parseColor(foregroundStyle.color);
						const background = parseColor(backgroundStyle.backgroundColor);
						const alpha = Number(
							foregroundStyle.color.match(
								/rgba?\([^/]+[,/]\s*([\d.]+)\s*\)/,
							)?.[1] ?? 1,
						);
						const blended = foreground.map((channel, index) =>
							Math.round(channel * alpha + background[index] * (1 - alpha)),
						);
						const luminance = (channels: number[]) => {
							const linear = channels.map((channel) => {
								const value = channel / 255;
								return value <= 0.04045
									? value / 12.92
									: ((value + 0.055) / 1.055) ** 2.4;
							});
							return (
								0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
							);
						};
						const foregroundLuminance = luminance(blended);
						const backgroundLuminance = luminance(background);
						return (
							(Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
							(Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
						);
					},
				);
				expect(statusLabelContrast).toBeGreaterThanOrEqual(4.5);
				const undersizedSheetControls = await mobilePage
					.locator(
						".sheet-themed-root button, .sheet-themed-root input, .sheet-themed-root select, .sheet-themed-root textarea",
					)
					.evaluateAll((elements) =>
						elements
							.filter((element) => {
								const rect = element.getBoundingClientRect();
								return (
									getComputedStyle(element).visibility !== "hidden" &&
									rect.width > 0 &&
									rect.height > 0 &&
									(rect.height < 44 ||
										(element.hasAttribute("aria-label") && rect.width < 44))
								);
							})
							.map((element) => ({
								tag: element.tagName,
								label: element.getAttribute("aria-label"),
								width: Math.round(element.getBoundingClientRect().width),
								height: Math.round(element.getBoundingClientRect().height),
							})),
					);
				expect(undersizedSheetControls).toEqual([]);
				await assertNoHorizontalOverflow();

				const mobileTabs = [
					"Combat",
					"Abilities",
					"Items",
					"Feats",
					"Bio",
					"Notes",
					"Extras",
					"Stats",
				];
				for (const tabName of mobileTabs) {
					const tab = mobilePage
						.getByRole("tab", { name: tabName, exact: true })
						.filter({ visible: true })
						.first();
					await tab.click();
					await expect(tab).toHaveAttribute("aria-selected", "true");
					await assertNoHorizontalOverflow();
				}

				// A horizontal gesture advances the swipeable sheet content.
				const combatTab = mobilePage
					.getByRole("tab", { name: "Combat", exact: true })
					.filter({ visible: true })
					.first();
				await combatTab.click();
				const gestureArea = mobilePage.locator(
					".character-sheet-mobile-content",
				);
				const gestureBounds = await gestureArea.boundingBox();
				expect(gestureBounds).toBeTruthy();
				if (gestureBounds) {
					const y = gestureBounds.y + Math.min(40, gestureBounds.height / 2);
					const pointerEvent = {
						pointerId: 1,
						pointerType: "touch",
						isPrimary: true,
						clientY: y,
					};
					await gestureArea.dispatchEvent("pointerdown", {
						...pointerEvent,
						clientX: gestureBounds.x + gestureBounds.width * 0.8,
						buttons: 1,
					});
					await gestureArea.dispatchEvent("pointermove", {
						...pointerEvent,
						clientX: gestureBounds.x + gestureBounds.width * 0.2,
						buttons: 1,
					});
					await gestureArea.dispatchEvent("pointerup", {
						...pointerEvent,
						clientX: gestureBounds.x + gestureBounds.width * 0.2,
						buttons: 0,
					});
					await expect(
						mobilePage
							.getByRole("tab", { name: "Abilities", exact: true })
							.filter({ visible: true })
							.first(),
					).toHaveAttribute("aria-selected", "true");
				}

				// HP management opens within the phone viewport and remains operable.
				await hpBlock(mobilePage).click();
				const hpDialog = mobilePage.getByRole("dialog").filter({
					hasText: "Manage Hit Points",
				});
				await expect(hpDialog).toBeVisible();
				const dialogBounds = await hpDialog.boundingBox();
				expect(dialogBounds).toBeTruthy();
				if (dialogBounds) {
					expect(dialogBounds.x).toBeGreaterThanOrEqual(0);
					expect(dialogBounds.x + dialogBounds.width).toBeLessThanOrEqual(391);
				}
				await hpDialog.getByPlaceholder(/Enter amount/i).fill("1");
				await hpDialog.getByRole("button", { name: "Damage" }).click();
				await expect(hpDialog).toBeHidden();

				// Landscape/tablet-width sweep and a desktop rail regression check.
				await mobilePage.setViewportSize({ width: 844, height: 390 });
				await assertNoHorizontalOverflow();
				await expect(
					mobilePage.locator('nav[aria-label="Primary"]'),
				).toBeVisible();
				await playerPage.setViewportSize({ width: 1280, height: 800 });
				await expect(playerPage.locator("aside").first()).toBeVisible();
			} finally {
				await mobileContext.close();
			}
		});
	});
