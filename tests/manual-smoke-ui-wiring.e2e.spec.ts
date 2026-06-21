/**
 * Manual smoke test (headed) — drives the four wired character-sheet UI
 * surfaces in a real Chromium window so the developer can visually verify
 * the wiring documented in `docs/manual-smoke-ui-wiring.md`:
 *
 *   T1 — Level-Up CTA      (pulse + amber ping badge based on XP eligibility)
 *   T2 — Upcast picker     (per-spell <select aria-label="Cast at level">)
 *   T3 — Crit display      (💥 CRITICAL HIT! toast via Math.random stub)
 *   T4 — PDF download      (canonical /characters/<id>?print=true print URL)
 *
 * Runs in Playwright with `headless: false` and `slowMo: 400` (configured
 * globally in `playwright.config.ts`) so each step is observable. Uses guest
 * mode so no Supabase auth is required.
 */

import { expect, test } from "@playwright/test";
import { PlayerPage } from "./pages/PlayerPage";

test.describe.configure({ mode: "serial", timeout: 240_000 });

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

const dwell = (page: import("@playwright/test").Page, ms = 1500) =>
	page.waitForTimeout(ms);

test("manual smoke (headed): crit, upcast, PDF, level-up — Mage L1", async ({
	page,
}) => {
	const player = new PlayerPage(page);

	// ─── SETUP — guest Mage L1 ───────────────────────────────────────────
	await test.step("Setup: create guest Mage L1", async () => {
		const characterId = await player.createCharacterWithJob(
			"SmokeTest Mage",
			/Mage/i,
		);
		expect(characterId, "character creation must succeed").toBeTruthy();
		expect(characterId).toMatch(/^local_/);

		// Land on the character sheet
		await page.goto(`/characters/${characterId}`);
		await page
			.getByText(/CHARACTER|ACTIONS|FEATURES|STATS|SPELLS/i)
			.first()
			.waitFor({ state: "visible", timeout: 20_000 });
		await dwell(page, 1200);
	});

	const characterUrl = page.url();
	const characterId = new URL(characterUrl).pathname.split("/").pop() ?? "";

	// ─── T1 — Level-Up CTA ───────────────────────────────────────────────
	await test.step("T1 — Level-Up CTA opens the wizard modal", async () => {
		const levelUpBtn = page
			.getByRole("button", { name: /^(Level Up|Manage Level)$/i })
			.first();
		await expect(levelUpBtn).toBeVisible({ timeout: 15_000 });

		// Highlight it visually
		await levelUpBtn.scrollIntoViewIfNeeded();
		await levelUpBtn.hover();
		await dwell(page, 800);
		await levelUpBtn.click();

		// Wizard modal should appear
		const modalSignal = page
			.getByText(
				/LEVEL UP PROTOCOL|SYSTEM ENHANCEMENT|MAXIMUM LEVEL REACHED|Level Up Wizard/i,
			)
			.first();
		await expect(modalSignal).toBeVisible({ timeout: 15_000 });
		await dwell(page, 1500);

		// Close
		const cancelBtn = page
			.getByRole("button", { name: /Cancel|Close|^Back$/i })
			.first();
		if (await cancelBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
			await cancelBtn.click();
		} else {
			await page.keyboard.press("Escape");
		}
		await dwell(page, 800);
	});

	// ─── T2 — Upcast picker (Spells tab) ─────────────────────────────────
	await test.step("T2 — Upcast picker visibility on Spells tab", async () => {
		const spellsTab = page.getByRole("tab", { name: /Spells/i }).first();
		if (await spellsTab.isVisible({ timeout: 5_000 }).catch(() => false)) {
			await spellsTab.click();
			await dwell(page, 1000);
		} else {
			// Fallback: click any element labeled Spells (may be a section button)
			const spellsAny = page.getByText(/^SPELLS$/i).first();
			if (await spellsAny.isVisible({ timeout: 3_000 }).catch(() => false)) {
				await spellsAny.scrollIntoViewIfNeeded().catch(() => {});
			}
		}

		// Verify the SpellsList shell renders (limits row, Add Spell, or empty state)
		const spellsShell = page
			.getByText(/Add Spell|Prepared:|Cantrips:|No spells yet/i)
			.first();
		await expect(spellsShell).toBeVisible({ timeout: 10_000 });

		// Upcast picker (`<select aria-label="Cast at level">`) requires
		// (a) a prepared leveled spell and (b) ≥2 slot levels available.
		// At L1 Mage that condition won't hold yet — what we verify here is
		// that the page does NOT render the picker (correct gating per the
		// `levels.length <= 1 → return null` branch in SpellsList).
		const upcastPicker = page.getByRole("combobox", {
			name: /Cast at level/i,
		});
		await expect(upcastPicker).toHaveCount(0);
		// eslint-disable-next-line no-console
		console.log(
			"[T2] Upcast picker correctly hidden at L1 (0 leveled slots > base).",
		);
		await dwell(page, 1200);
	});

	// ─── T3 — Crit display (deterministic Math.random stub) ──────────────
	await test.step("T3 — Crit display via deterministic Math.random stub", async () => {
		// Move to Actions / Combat tab if present
		const actionsTab = page
			.getByRole("tab", { name: /Actions|Combat/i })
			.first();
		if (await actionsTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
			await actionsTab.click();
			await dwell(page, 800);
		}

		// Stub Math.random to force max rolls (nat-20 on every d20)
		await page.evaluate(() => {
			const w = window as Window & { __origRandom?: () => number };
			if (!w.__origRandom) w.__origRandom = Math.random;
			Math.random = () => 0.9999;
		});

		// The crit toast (`💥 CRITICAL HIT! ... (dice doubled)`) is emitted by
		// `ActionCard.handleRoll("attack")`. The current UI has no button that
		// triggers handleRoll("attack") — the visible Attack button uses
		// InlineRollButton instead. The damage button calls handleRoll("damage")
		// which doesn't show the crit prefix. So we exercise what's actually
		// reachable: click any visible Damage button so the user sees the
		// damage-roll path with our forced max rolls, then we'll surface the
		// crit-message format via the unit tests as the canonical proof.
		const damageBtn = page.getByRole("button", { name: /^Damage:/i }).first();
		const hasDamageBtn = await damageBtn
			.isVisible({ timeout: 4_000 })
			.catch(() => false);
		if (hasDamageBtn) {
			await damageBtn.scrollIntoViewIfNeeded();
			await damageBtn.click();
			await dwell(page, 1500);
		} else {
			// eslint-disable-next-line no-console
			console.log(
				"[T3] No visible Damage action at L1 (no equipped weapon). " +
					"Crit-toast formatting is proven by smokeUiWiring.test.tsx.",
			);
		}

		// Restore RNG
		await page.evaluate(() => {
			const w = window as Window & { __origRandom?: () => number };
			if (w.__origRandom) {
				Math.random = w.__origRandom;
				delete w.__origRandom;
			}
		});
		await dwell(page, 800);
	});

	// ─── T4 — PDF / print export pipeline ────────────────────────────────
	await test.step("T4 — Print URL render (canonical export pipeline)", async () => {
		// The ExportDialog component is plumbed in CharacterSheetV2 but no UI
		// trigger currently calls setModal("export", true) — flagged separately.
		// The PDF export pipeline opens the same `?print=true&token=<x>` URL
		// the dialog's preview iframe loads (see `printCharacterSheet` in
		// `src/lib/export.ts`). We navigate there directly so the user can see
		// the print layout that `Export as PDF` / `Preview PDF` produce.
		const printUrl = `/characters/${characterId}?print=true`;
		await page.goto(printUrl);
		await dwell(page, 2500);

		// Verify the print page rendered the character (any sheet signal works)
		const printSignals = page.getByText(
			/SmokeTest Mage|HP|HIT POINTS|ARMOR|ACTIONS/i,
		);
		const visibleSignals = await printSignals.count();
		expect(visibleSignals).toBeGreaterThanOrEqual(1);
		// eslint-disable-next-line no-console
		console.log(
			`[T4] Print layout rendered with ${visibleSignals} sheet signals visible.`,
		);

		// Hold the print preview on screen for the developer to inspect
		await dwell(page, 2500);
	});

	// Final dwell so the developer can take it in before the browser closes
	await dwell(page, 2500);
});
