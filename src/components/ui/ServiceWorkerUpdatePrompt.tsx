/**
 * Service Worker Update Prompt
 *
 * Prompts users when a new build is stuck in the "waiting" state.
 * Observes the single registration made in lib/pwa.ts (production only) —
 * this component must NOT register /sw.js itself: dev servers answer that
 * URL with index.html (console MIME error) and double registration blurs
 * the documented single-registration-point contract.
 */

import { RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { logger } from "@/lib/logger";

export function ServiceWorkerUpdatePrompt() {
	const [updateAvailable, setUpdateAvailable] = useState(false);
	const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
		null,
	);

	useEffect(() => {
		if (!import.meta.env.PROD) return;
		if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
			return;
		}

		let active = true;
		let updateInterval: ReturnType<typeof setInterval> | null = null;
		let removeUpdateFoundListener: (() => void) | null = null;

		const surfaceWaiting = (registration: ServiceWorkerRegistration) => {
			if (!active) return;
			// Only an UPDATE has a controller; first installs activate silently.
			if (registration.waiting && navigator.serviceWorker.controller) {
				setWaitingWorker(registration.waiting);
				setUpdateAvailable(true);
			}
		};

		// lib/pwa.ts owns registration; attach once it is active.
		navigator.serviceWorker.ready
			.then((registration) => {
				if (!active) return;

				surfaceWaiting(registration);

				const handleUpdateFound = () => {
					const installing = registration.installing;
					if (!installing) return;
					installing.addEventListener("statechange", () => {
						if (installing.state === "installed") {
							surfaceWaiting(registration);
						}
					});
				};
				registration.addEventListener("updatefound", handleUpdateFound);
				removeUpdateFoundListener = () =>
					registration.removeEventListener("updatefound", handleUpdateFound);

				// Check for updates periodically (every hour)
				updateInterval = setInterval(
					() => {
						void registration.update();
					},
					60 * 60 * 1000,
				);
			})
			.catch((error) => {
				logger.warn("[SW] Waiting for service worker failed:", error);
			});

		return () => {
			active = false;
			if (updateInterval) {
				clearInterval(updateInterval);
			}
			if (removeUpdateFoundListener) {
				removeUpdateFoundListener();
			}
		};
	}, []);

	const handleUpdate = () => {
		if (waitingWorker) {
			// Send skip waiting message
			waitingWorker.postMessage({ type: "SKIP_WAITING" });

			// Wait for the new service worker to activate, then reload
			waitingWorker.addEventListener("statechange", (e) => {
				const sw = e.target as ServiceWorker;
				if (sw.state === "activated") {
					setUpdateAvailable(false);
					setWaitingWorker(null);
					window.location.reload();
				}
			});

			// Fallback: If statechange takes too long or doesn't fire
			setTimeout(() => {
				setUpdateAvailable(false);
				window.location.reload();
			}, 1000);
		} else {
			// Fallback: If no waiting worker is found (e.g. already skipped waiting), just reload
			setUpdateAvailable(false);
			window.location.reload();
		}
	};

	const handleDismiss = () => {
		setUpdateAvailable(false);
	};

	return (
		<Dialog open={updateAvailable} onOpenChange={setUpdateAvailable}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Available</DialogTitle>
					<DialogDescription>
						A new version of Rift Ascendant is available. Would you like to
						update now?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={handleDismiss}>
						<X className="w-4 h-4 mr-2" />
						Later
					</Button>
					<Button onClick={handleUpdate}>
						<RefreshCw className="w-4 h-4 mr-2" />
						Update Now
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
