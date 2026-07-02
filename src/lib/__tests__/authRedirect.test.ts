import { describe, expect, it } from "vitest";
import {
	AUTH_CALLBACK_PATH,
	buildAuthCallbackUrl,
	buildPasswordResetRedirectUrl,
	CANONICAL_PUBLIC_SITE_URL,
	PASSWORD_RESET_PATH,
} from "@/lib/authRedirect";

describe("auth redirect URL construction", () => {
	it("uses the configured Rift Ascendant production URL for email verification", () => {
		expect(
			buildAuthCallbackUrl({
				publicSiteUrl: "https://riftascendant.vercel.app/",
				origin: "https://dead-preview.example",
			}),
		).toBe(`https://riftascendant.vercel.app${AUTH_CALLBACK_PATH}`);
	});

	it("falls back to the current app origin instead of the legacy dead URL", () => {
		expect(
			buildAuthCallbackUrl({
				publicSiteUrl: "",
				origin: "https://preview-riftascendant.vercel.app",
			}),
		).toBe("https://preview-riftascendant.vercel.app/auth/callback");
	});

	it("does not duplicate the callback path when the configured URL already includes it", () => {
		expect(
			buildAuthCallbackUrl({
				publicSiteUrl: "https://riftascendant.vercel.app/auth/callback",
				origin: null,
			}),
		).toBe("https://riftascendant.vercel.app/auth/callback");
	});

	it("preserves safe next paths and rejects external next targets", () => {
		expect(
			buildAuthCallbackUrl({
				publicSiteUrl: "https://riftascendant.vercel.app",
				next: "/campaigns/join/ABC123",
			}),
		).toBe(
			"https://riftascendant.vercel.app/auth/callback?next=%2Fcampaigns%2Fjoin%2FABC123",
		);

		expect(
			buildAuthCallbackUrl({
				publicSiteUrl: "https://riftascendant.vercel.app",
				next: "https://evil.example/phish",
			}),
		).toBe("https://riftascendant.vercel.app/auth/callback");
	});

	it("uses the canonical production URL when no runtime origin is available", () => {
		expect(
			buildAuthCallbackUrl({
				publicSiteUrl: null,
				origin: null,
			}),
		).toBe(`${CANONICAL_PUBLIC_SITE_URL}/auth/callback`);
	});
});

describe("password reset redirect URL", () => {
	it("lands recovery emails on /reset-password with the same site-URL precedence", () => {
		expect(
			buildPasswordResetRedirectUrl({
				publicSiteUrl: "https://riftascendant.vercel.app/",
				origin: "https://dead-preview.example",
			}),
		).toBe(`https://riftascendant.vercel.app${PASSWORD_RESET_PATH}`);

		expect(
			buildPasswordResetRedirectUrl({
				publicSiteUrl: "",
				origin: "https://preview-riftascendant.vercel.app",
			}),
		).toBe("https://preview-riftascendant.vercel.app/reset-password");

		expect(
			buildPasswordResetRedirectUrl({ publicSiteUrl: null, origin: null }),
		).toBe(`${CANONICAL_PUBLIC_SITE_URL}/reset-password`);
	});
});
