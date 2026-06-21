import type { Page } from "@playwright/test";

// Canonical roles plus legacy aliases ("dm"/"player") that older specs still use.
export type Role = "warden" | "ascendant" | "dm" | "player";

function normalizeRole(role: Role): "warden" | "ascendant" {
	if (role === "warden" || role === "dm") return "warden";
	return "ascendant";
}

/**
 * Page Object Model for the Login page.
 *
 * Selector strategy (ordered by preference):
 *   1. data-testid  – email-input, password-input
 *   2. role + name  – role selection buttons
 *   3. CSS          – button[type="submit"]
 */
export class AuthPage {
	constructor(public page: Page) {}

	/** Dismiss analytics consent banner via localStorage (matches existing E2E pattern). */
	async dismissAnalytics() {
		await this.page.context().addInitScript(() => {
			localStorage.setItem(
				"solo-compendium-analytics-consent",
				JSON.stringify({
					status: "rejected",
					version: 1,
					timestamp: Date.now(),
				}),
			);
		});
	}

	async goto() {
		await this.page.goto("/login");
	}

	/** Continue as guest with the chosen role (no Supabase account required). */
	async continueAsGuest(role: Role) {
		const canonical = normalizeRole(role);
		await this.dismissAnalytics();
		await this.goto();

		// Select role (this sets the role state in Login.tsx)
		if (canonical === "warden") {
			await this.page
				.getByRole("button", { name: /Select Warden role/i })
				.click();
		} else {
			await this.page
				.getByRole("button", { name: /Select Ascendant role/i })
				.click();
		}

		// Click the specific guest button
		const buttonText = `Continue as Guest (${canonical === "warden" ? "Warden" : "Ascendant"})`;
		await this.page
			.getByRole("button", { name: buttonText, exact: true })
			.click();

		// Accept either the new /ascendant-tools route or the legacy /player-tools
		// redirect target while the rename rolls out across specs.
		const expectedUrl =
			canonical === "warden"
				? /\/warden-(protocols|directives)/
				: /\/(ascendant|player)-tools/;
		await this.page.waitForURL(expectedUrl, { timeout: 15_000 });
	}

	/**
	 * Sign in with an existing Supabase email/password account.
	 *
	 * Mirrors {@link continueAsGuest}'s role selection, then fills the email
	 * form (`email-input` / `password-input`) and submits ("Enter the Rift").
	 * Returns `true` once the post-login redirect lands away from `/login`,
	 * or `false` if the login form surfaced an error / did not navigate
	 * (e.g. bad credentials, backend not configured) so the caller can
	 * decide how to handle the failure rather than throwing.
	 */
	async signIn(
		email: string,
		password: string,
		role: Role = "ascendant",
	): Promise<boolean> {
		const canonical = normalizeRole(role);
		await this.dismissAnalytics();
		await this.goto();

		if (canonical === "warden") {
			await this.page
				.getByRole("button", { name: /Select Warden role/i })
				.click();
		} else {
			await this.page
				.getByRole("button", { name: /Select Ascendant role/i })
				.click();
		}

		await this.page.getByTestId("email-input").fill(email);
		await this.page.getByTestId("password-input").fill(password);

		await this.page.getByRole("button", { name: /Enter the Rift/i }).click();

		try {
			await this.page.waitForURL((url) => !url.pathname.startsWith("/login"), {
				timeout: 30_000,
			});
			return true;
		} catch {
			return false;
		}
	}
}
