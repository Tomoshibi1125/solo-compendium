import { expect, type Page, test } from "@playwright/test";
import { AuthPage } from "./pages/AuthPage";
import { PlayerPage } from "./pages/PlayerPage";

/**
 * Character Creation "Initialization Failed" diagnostic.
 *
 * Reproduces the signed-in "An unknown error occurred during awakening" toast
 * and unmasks the real Supabase result by capturing the raw POST
 * `/rest/v1/characters` response (status + Postgres `code`/`message`/`details`/
 * `hint`), plus all console + page errors and the rendered toast text.
 *
 * Two paths:
 *   - Guest (no creds, always runs): local-only create that must NOT touch the
 *     Supabase characters table — the systemic-vs-Supabase baseline.
 *   - Signed-in (needs `E2E_TEST_PASSWORD`): reproduces the failure and prints
 *     the captured root-cause code that selects the Phase 2 fix branch.
 *
 * Headed/trace/video/screenshot are provided by playwright.config.ts.
 */

const CHARACTERS_ENDPOINT = /\/rest\/v1\/characters(\?|$)/;

const TEST_EMAIL = process.env.E2E_TEST_EMAIL ?? "test@test.com";
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD;

interface CapturedCharacterResponse {
	method: string;
	url: string;
	status: number;
	requestBody: string | null;
	body: string;
}

interface Diagnostics {
	consoleLogs: string[];
	pageErrors: string[];
	characterResponses: CapturedCharacterResponse[];
	flush: () => Promise<void>;
}

function attachDiagnostics(page: Page): Diagnostics {
	const consoleLogs: string[] = [];
	const pageErrors: string[] = [];
	const characterResponses: CapturedCharacterResponse[] = [];
	const pending: Promise<void>[] = [];

	page.on("console", (msg) => {
		consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
	});

	page.on("pageerror", (err) => {
		pageErrors.push(err.stack ?? err.message);
	});

	page.on("response", (response) => {
		const url = response.url();
		if (!CHARACTERS_ENDPOINT.test(url)) return;
		const request = response.request();
		const method = request.method();
		const status = response.status();
		const requestBody = request.postData();
		pending.push(
			response
				.text()
				.then((body) => {
					characterResponses.push({
						method,
						url,
						status,
						requestBody,
						body,
					});
				})
				.catch(() => {
					characterResponses.push({
						method,
						url,
						status,
						requestBody,
						body: "<unreadable response body>",
					});
				}),
		);
	});

	return {
		consoleLogs,
		pageErrors,
		characterResponses,
		flush: async () => {
			await Promise.allSettled(pending);
		},
	};
}

/**
 * Read the persistent creation-outcome toast text (title + description).
 * Toasts use a long `TOAST_REMOVE_DELAY`, so they survive long enough to read
 * after the create attempt settles.
 */
async function readToastText(page: Page): Promise<string> {
	const outcomeToast = page
		.locator("ol li")
		.filter({
			hasText:
				/Initialization Failed|Awakening failed|Unit Awakened|setup warnings/i,
		})
		.first();
	if (await outcomeToast.isVisible({ timeout: 8_000 }).catch(() => false)) {
		return (await outcomeToast.innerText().catch(() => "")).trim();
	}
	const anyToast = page.locator("ol li").first();
	if (await anyToast.isVisible({ timeout: 2_000 }).catch(() => false)) {
		return (await anyToast.innerText().catch(() => "")).trim();
	}
	return "";
}

function reportDiagnostics(
	label: string,
	diag: Diagnostics,
	toastText: string,
): void {
	const charPosts = diag.characterResponses.filter((r) => r.method === "POST");
	const lines: string[] = [];
	lines.push(`\n===== character-creation diagnose: ${label} =====`);
	lines.push(`toast: ${toastText || "<none captured>"}`);
	lines.push(
		`characters POST responses: ${charPosts.length} (all characters responses: ${diag.characterResponses.length})`,
	);
	for (const r of charPosts) {
		lines.push(`  POST ${r.status} ${r.url}`);
		if (r.requestBody) lines.push(`  request: ${r.requestBody}`);
		lines.push(`  response: ${r.body}`);
	}
	const errorLogs = diag.consoleLogs.filter((l) =>
		/\[error\]|useCreateCharacter|initialization failed|PGRST|23503|42703|42501|23502/i.test(
			l,
		),
	);
	if (errorLogs.length) {
		lines.push(`console (error-relevant) (${errorLogs.length}):`);
		for (const l of errorLogs.slice(0, 30)) lines.push(`  ${l}`);
	}
	if (diag.pageErrors.length) {
		lines.push(`page errors (${diag.pageErrors.length}):`);
		for (const e of diag.pageErrors.slice(0, 10)) lines.push(`  ${e}`);
	}
	lines.push("================================================\n");
	console.log(lines.join("\n"));
}

test("guest character creation stays local and never hits the Supabase characters insert", async ({
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

	const diag = attachDiagnostics(page);
	const player = new PlayerPage(page);

	const characterId = await player.createCharacterWithJob(
		"Diagnose Guest Ascendant",
		/Destroyer/i,
	);

	const toastText = await readToastText(page);
	await diag.flush();
	reportDiagnostics("guest", diag, toastText);

	await page
		.screenshot({
			path: "test-results/character-creation-diagnose/guest.png",
			fullPage: true,
		})
		.catch(() => {});

	// Guest mode persists locally and must never POST to the characters table.
	const guestPostFailures = diag.characterResponses.filter(
		(r) => r.method === "POST" && r.status >= 400,
	);
	expect(
		guestPostFailures,
		`guest create unexpectedly hit a failing characters POST: ${JSON.stringify(
			guestPostFailures,
		)}`,
	).toHaveLength(0);

	// A successful local create proves the wizard logic itself is sound, so a
	// signed-in failure isolates to Supabase (schema/RLS/FK), not the UI flow.
	expect(
		characterId,
		`guest character creation failed (toast: "${toastText}")`,
	).toMatch(/^local_/);
});

test("signed-in character creation surfaces the real Supabase characters insert result", async ({
	page,
}) => {
	test.skip(
		!TEST_PASSWORD,
		"Set E2E_TEST_PASSWORD (account E2E_TEST_EMAIL, default test@test.com) to run the signed-in diagnostic.",
	);
	test.setTimeout(150_000);

	await page.addInitScript(() => {
		localStorage.setItem(
			"solo-compendium-analytics-consent",
			JSON.stringify({
				status: "rejected",
				version: 1,
				timestamp: Date.now(),
			}),
		);
	});

	const diag = attachDiagnostics(page);
	const auth = new AuthPage(page);

	const signedIn = await auth.signIn(
		TEST_EMAIL,
		TEST_PASSWORD as string,
		"ascendant",
	);
	expect(
		signedIn,
		`could not sign in as ${TEST_EMAIL} — check E2E_TEST_PASSWORD and that the account is confirmed`,
	).toBe(true);

	const player = new PlayerPage(page);
	const characterId = await player.createCharacterWithJob(
		"Diagnose Signed Ascendant",
		/Destroyer/i,
	);

	const toastText = await readToastText(page);
	await diag.flush();
	reportDiagnostics("signed-in", diag, toastText);

	await page
		.screenshot({
			path: "test-results/character-creation-diagnose/signed-in.png",
			fullPage: true,
		})
		.catch(() => {});

	const charPosts = diag.characterResponses.filter((r) => r.method === "POST");
	expect(
		charPosts.length,
		"expected at least one POST /rest/v1/characters while signed in",
	).toBeGreaterThan(0);

	// The failing POST body carries the exact Postgres code/message that selects
	// the Phase 2 fix branch (FK 23503 / missing column 42703 / RLS 42501 / NOT
	// NULL 23502). On a healthy DB this stays empty and create navigates away.
	const failingPosts = charPosts.filter((r) => r.status >= 400);
	const capturedRootCause = failingPosts
		.map((r) => `${r.status} ${r.body}`)
		.join("\n");

	expect(
		failingPosts,
		`characters insert failed for ${TEST_EMAIL}.\nCaptured root cause:\n${
			capturedRootCause || "<none>"
		}\nToast: ${toastText}`,
	).toHaveLength(0);

	expect(
		characterId,
		`signed-in create did not return a character id (toast: "${toastText}")`,
	).toBeTruthy();
});
