/**
 * PWA service-worker registration — the single registration point
 * (vite.config.ts sets `injectRegister: null`, so nothing else registers).
 *
 * Production-only: dev servers don't emit sw.js. Registering also makes
 * `navigator.serviceWorker.ready` resolve, which usePushNotifications awaits —
 * the Profile push toggle was silently broken while no worker ever registered.
 */

import { toast } from "sonner";
import { Workbox } from "workbox-window";
import { warn as logWarn } from "./logger";

export function registerPwa(): void {
	if (!import.meta.env.PROD) return;
	if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

	const wb = new Workbox("/sw.js");

	// autoUpdate mode: a fresh worker takes control as soon as it installs;
	// offer a one-tap reload so the visible app swaps to the new build too.
	wb.addEventListener("controlling", (event) => {
		if (!event.isUpdate) return;
		toast("Update installed", {
			description: "Reload to switch to the newest version.",
			action: { label: "Reload", onClick: () => window.location.reload() },
			duration: 15000,
		});
	});

	wb.register().catch((error) => {
		logWarn("PWA service-worker registration failed:", error);
	});
}
