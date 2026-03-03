import { useEffect, useState } from "react";

interface UsePushNotificationsReturn {
	isSupported: boolean;
	permission: NotificationPermission;
	requestPermission: () => Promise<NotificationPermission>;
	sendNotification: (title: string, options?: NotificationOptions) => void;
}

export function usePushNotifications(): UsePushNotificationsReturn {
	const [isSupported, setIsSupported] = useState(false);
	const [permission, setPermission] =
		useState<NotificationPermission>("default");

	useEffect(() => {
		// Check if notifications are supported
		const supported = "Notification" in window && "serviceWorker" in navigator;
		setIsSupported(supported);

		if (supported) {
			setPermission(Notification.permission);
		}
	}, []);

	const requestPermission = async (): Promise<NotificationPermission> => {
		if (!isSupported) {
			console.warn("Push notifications are not supported in this browser.");
			return "denied";
		}

		try {
			const newPermission = await Notification.requestPermission();
			setPermission(newPermission);
			return newPermission;
		} catch (error) {
			console.error("Error requesting notification permission:", error);
			return "denied";
		}
	};

	const sendNotification = (title: string, options?: NotificationOptions) => {
		if (!isSupported) {
			console.warn("Push notifications are not supported.");
			return;
		}

		if (permission === "granted") {
			try {
				// Try to use service worker to show notification (works on mobile PWA)
				navigator.serviceWorker.ready
					.then((registration) => {
						registration.showNotification(title, {
							icon: "/icon-192x192.png",
							badge: "/icon-192x192.png",
							...options,
						});
					})
					.catch(() => {
						// Fallback to standard notification (works on desktop)
						new Notification(title, {
							icon: "/icon-192x192.png",
							...options,
						});
					});
			} catch (error) {
				console.error("Error sending notification:", error);
			}
		} else {
			console.warn(
				"Notification permission not granted. Current status:",
				permission,
			);
		}
	};

	return {
		isSupported,
		permission,
		requestPermission,
		sendNotification,
	};
}
