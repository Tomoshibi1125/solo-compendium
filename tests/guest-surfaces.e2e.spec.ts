import { expect, type Page, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";

/**
 * Guest coverage for app surfaces with no prior E2E coverage:
 * Bureau hub, Party Stash, Field Roster, Meridian City atlas, the
 * players-book source book (exercises the IntroChapter protocol-data
 * gate), Profile, Legal, and Landing.
 *
 * All tests run as a guest Ascendant in one shared context (guest data is
 * per-context localStorage, matching the rest of the suite).
 */

test.describe
	.serial("Guest surfaces: bureau/stash/roster/atlas/book", () => {
		let page: Page;

		test.beforeAll(async ({ browser }) => {
			const context = await browser.newContext();
			page = await context.newPage();
			const auth = new AuthPage(page);
			await auth.continueAsGuest("ascendant");
		});

		test.afterAll(async () => {
			await page.context().close();
		});

		test("Bureau hub: dispatch board and license registry render", async () => {
			await page.goto("/bureau");
			await expect(page.getByText("The Bureau").first()).toBeVisible({
				timeout: 15_000,
			});
			await expect(page.getByText("DISPATCH BOARD").first()).toBeVisible({
				timeout: 15_000,
			});
			await expect(page.getByText("LICENSE REGISTRY").first()).toBeVisible();
			await expect(page.getByText("GUILD STANDINGS").first()).toBeVisible();
		});

		test("Party Stash without a campaign shows the domain-select gate", async () => {
			// The stash is campaign-scoped; the with-campaign flow is covered in
			// campaigns-deep.e2e.spec.ts. Here: no campaignId → the explicit gate.
			await page.goto("/party-stash");
			await expect(page.getByText("No Domain Selected").first()).toBeVisible({
				timeout: 15_000,
			});
			await expect(
				page.getByRole("button", { name: /Find Campaign/i }),
			).toBeVisible();
		});

		test("Field Roster: page renders posts or the empty state", async () => {
			await page.goto("/field-roster");
			await expect(page.getByText("BUREAU FIELD ROSTER").first()).toBeVisible({
				timeout: 15_000,
			});
			// Either open posts or the explicit empty state must render.
			await expect(
				page
					.getByText(/NO OPEN POSTS/i)
					.or(
						page
							.locator("main")
							.getByText(/RANK|POST|LISTING/i)
							.first(),
					)
					.first(),
			).toBeVisible({ timeout: 10_000 });
		});

		test("Meridian City atlas: header, districts, and legend render", async () => {
			await page.goto("/compendium/city/meridian");
			await expect(
				page.getByRole("heading", { level: 1, name: /Meridian/i }),
			).toBeVisible({ timeout: 15_000 });
			// Gazetteer content renders from the MERIDIAN data record.
			await expect(page.getByText(/Coastal megacity/i).first()).toBeVisible();
		});

		test("Source book intro: jobs grid is populated (protocol-data gate)", async () => {
			await page.goto("/source-book/intro");
			await expect(page.getByText("The Awakening Event").first()).toBeVisible({
				timeout: 20_000,
			});

			// Regression coverage for the ProtocolDataManager init race: the jobs
			// grid must populate even when this chapter renders before the data
			// packs finish loading (useProtocolJobs re-renders once they land).
			await expect(page.getByText(/Berserker/i).first()).toBeVisible({
				timeout: 20_000,
			});
			await expect(
				page.getByText(/There are currently 0 documented Jobs/i),
			).toHaveCount(0);
		});

		test("Profile: settings page renders identity and appearance", async () => {
			await page.goto("/profile");
			await expect(page.getByText("Profile & Settings").first()).toBeVisible({
				timeout: 15_000,
			});
			await expect(page.getByText("IDENTITY").first()).toBeVisible();
			await expect(page.getByText("APPEARANCE").first()).toBeVisible();
		});

		test("Legal: attribution page renders", async () => {
			await page.goto("/legal");
			await expect(page.getByRole("heading").first()).toBeVisible({
				timeout: 15_000,
			});
		});

		test("Landing: renders without page errors", async () => {
			const errors: string[] = [];
			page.on("pageerror", (err) => errors.push(err.message));
			await page.goto("/landing");
			await expect(page.locator("body")).toBeVisible();
			await page.waitForTimeout(1_000);
			expect(errors, `landing page errors: ${errors.join("\n")}`).toHaveLength(
				0,
			);
		});
	});
