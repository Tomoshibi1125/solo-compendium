import { useEffect, useState } from "react";

interface UseWardenAReturn {
	isInstallable: boolean;
	isInstalled: boolean;
	isOnline: boolean;
	installPrompt: () => Promise<void>;
	syncQueueLength: number;
}

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: string }>;
}

export function useWardenA(): UseWardenAReturn {
	const [isInstallable, setIsInstallable] = useState(false);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== "undefined" ? navigator.onLine : true,
	);
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [syncQueueLength, _setSyncQueueLength] = useState(0);

	useEffect(() => {
		// Check if app is already installed
		if (
			window.matchMedia("(display-mode: standalone)").matches ||
			(window.navigator as { standalone?: boolean }).standalone === true
		) {
			setIsInstalled(true);
		}

		// Listen for beforeinstallprompt event
		const handleBeforeInstallPrompt = (e: Event) => {
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later
			setDeferredPrompt(e as BeforeInstallPromptEvent);
			setIsInstallable(true);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		// Online/offline status
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Watch install state
		const handleAppInstalled = () => {
			setIsInstallable(false);
			setIsInstalled(true);
			setDeferredPrompt(null);
		};

		window.addEventListener("appinstalled", handleAppInstalled);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt,
			);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	const installPrompt = async () => {
		if (!deferredPrompt) return;

		// Show the prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		const { outcome } = await deferredPrompt.userChoice;

		if (outcome === "accepted") {
			setIsInstallable(false);
		}

		setDeferredPrompt(null);
	};

	return {
		isInstallable,
		isInstalled,
		isOnline,
		installPrompt,
		syncQueueLength, // In a real app with workbox, this would query IndexedDB or BackgroundSync API
	};
}
