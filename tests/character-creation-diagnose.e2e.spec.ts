import { expect, type Page, test } from "@playwright/test";
import { PlayerPage } from "./pages/PlayerPage";

/**
 * Character Creation "Initialization Failed" diagnostic.
 *
 * Captures the raw POST `/rest/v1/characters` traffic (status + Postgres
 * `code`/`message`/`details`/`hint`), plus all console + page errors and the
 * rendered toast text, for the guest creation path: a local-only create that
 * must NOT touch the Supabase characters table — the systemic-vs-Supabase
 * baseline. (The signed-in variant was removed once verified manually; the
 * guest run still proves the wizard logic itself is sound.)
 *
 * Headed/trace/video/screenshot are provided by playwright.config.ts.
 */

const CHARACTERS_ENDPOINT = /\/rest\/v1\/characters(\?|$)/;

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
