import { isSafeNextPath } from "@/lib/campaignInviteUtils";

export const AUTH_CALLBACK_PATH = "/auth/callback";
export const CANONICAL_PUBLIC_SITE_URL = "https://riftascendant.vercel.app";

const trimTrailingSlashes = (value: string): string =>
	value.replace(/\/+$/, "");

const normalizePublicSiteUrl = (value?: string | null): string | null => {
	const trimmed = value?.trim();
	if (!trimmed) return null;

	try {
		const url = new URL(trimmed);
		const path = trimTrailingSlashes(url.pathname).replace(
			/\/auth\/callback$/,
			"",
		);
		return trimTrailingSlashes(`${url.origin}${path === "/" ? "" : path}`);
	} catch {
		return null;
	}
};

const getRuntimeOrigin = (): string | null => {
	if (typeof window === "undefined") return null;
	return window.location.origin;
};

export const buildAuthCallbackUrl = ({
	publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL,
	origin = getRuntimeOrigin(),
	next,
}: {
	publicSiteUrl?: string | null;
	origin?: string | null;
	next?: string | null;
} = {}): string => {
	const baseUrl =
		normalizePublicSiteUrl(publicSiteUrl) ??
		normalizePublicSiteUrl(origin) ??
		CANONICAL_PUBLIC_SITE_URL;
	const url = new URL(AUTH_CALLBACK_PATH, `${baseUrl}/`);

	if (isSafeNextPath(next)) {
		url.searchParams.set("next", next);
	}

	return url.toString();
};
