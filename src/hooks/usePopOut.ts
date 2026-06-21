import { useCallback } from "react";

/**
 * Misty Pearl B2 — Pop-Out Windows.
 *
 * Opens a same-origin SPA route in a popup window for multi-monitor
 * setups (Foundry v14 parity). Because every rail panel's state is
 * already backed by Supabase realtime + TanStack Query, the popup
 * automatically stays in sync — no BroadcastChannel plumbing required.
 *
 * Returns `{ open }` — an idempotent opener. If a popup with the same
 * `name` already exists in this browser session, it's focused instead
 * of duplicated, so the user can't accidentally spawn six clones.
 *
 * Safe to call from any click handler. No-ops on SSR.
 */
interface UsePopOutOptions {
	/**
	 * Unique window name (also used as the popup target). Same name →
	 * same window across re-opens (focuses instead of duplicating).
	 */
	name: string;
	/** Path or absolute URL the popup loads. */
	path: string;
	/** Initial width in CSS pixels. Defaults to 520. */
	width?: number;
	/** Initial height in CSS pixels. Defaults to 760. */
	height?: number;
}

export function usePopOut(options: UsePopOutOptions) {
	const { name, path, width = 520, height = 760 } = options;

	const open = useCallback(() => {
		if (typeof window === "undefined") return null;
		const url = path.startsWith("http")
			? path
			: `${window.location.origin}${path.startsWith("/") ? "" : "/"}${path}`;
		const w = Math.max(320, Math.min(window.screen.availWidth || width, width));
		const h = Math.max(
			320,
			Math.min(window.screen.availHeight || height, height),
		);
		const left = Math.max(
			0,
			Math.round(((window.screen.availWidth ?? w) - w) / 2),
		);
		const top = Math.max(
			0,
			Math.round(((window.screen.availHeight ?? h) - h) / 3),
		);
		const features = [
			"popup=yes",
			`width=${w}`,
			`height=${h}`,
			`left=${left}`,
			`top=${top}`,
			"toolbar=no",
			"menubar=no",
			"location=no",
			"status=no",
			"resizable=yes",
			"scrollbars=yes",
		].join(",");
		const popup = window.open(url, name, features);
		if (popup) {
			try {
				popup.focus();
			} catch {
				// Cross-frame focus can throw in some browsers; safe to ignore.
			}
		}
		return popup;
	}, [name, path, width, height]);

	return { open } as const;
}
