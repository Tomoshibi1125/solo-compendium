import { useCallback, useEffect, useState } from "react";
import { logger } from "@/lib/logger";

export type NotificationType = "info" | "success" | "warning" | "error";
export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface Notification {
	id: string;
	type: NotificationType;
	priority: NotificationPriority;
	title: string;
	message?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	read: boolean;
	createdAt: number;
	expiresAt?: number;
	category?: string; // e.g., 'character', 'campaign', 'rift'
}

const STORAGE_KEY = "solo-compendium-notifications";
const MAX_NOTIFICATIONS = 100;
const DEFAULT_EXPIRY_DAYS = 30;

/**
 * Window event dispatched whenever the local notification cache is written
 * out-of-band (e.g. by the standalone `notify()` bridge in `@/lib/notify`).
 * The hook below listens for it so the NavBar bell updates live instead of
 * only on remount. Defined here (not in notify.ts) to keep the dependency
 * one-directional: notify.ts imports from this module, not the reverse.
 */
export const NOTIFICATIONS_UPDATED_EVENT = "solo:notifications-updated";

/**
 * Load notifications from localStorage
 */
export function loadNotifications(): Notification[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const notifications = JSON.parse(stored) as Notification[];
		const now = Date.now();

		// Filter out expired notifications
		return notifications.filter((n) => {
			if (n.expiresAt && n.expiresAt < now) {
				return false;
			}
			return true;
		});
	} catch (error) {
		logger.error("Failed to load notifications:", error);
		return [];
	}
}

/**
 * Save notifications to localStorage
 */
export function saveNotifications(notifications: Notification[]): void {
	try {
		// Keep only the most recent notifications
		const toSave = notifications
			.sort((a, b) => b.createdAt - a.createdAt)
			.slice(0, MAX_NOTIFICATIONS);

		localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
	} catch (error) {
		logger.error("Failed to save notifications:", error);
	}
}

/**
 * Hook for managing notifications
 */
export function useNotifications() {
	const [notifications, setNotifications] = useState<Notification[]>(() =>
		loadNotifications(),
	);

	// Load notifications on mount
	useEffect(() => {
		const loaded = loadNotifications();
		setNotifications(loaded);
	}, []);

	// Live-refresh from the cache when an out-of-band producer (the `notify()`
	// bridge) or another tab writes notifications. Same-tab `localStorage`
	// writes don't fire `storage`, so the custom event covers the same-tab case.
	useEffect(() => {
		if (typeof window === "undefined") return;
		const refresh = () => setNotifications(loadNotifications());
		window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
		window.addEventListener("storage", refresh);
		return () => {
			window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refresh);
			window.removeEventListener("storage", refresh);
		};
	}, []);

	// Save notifications whenever they change
	useEffect(() => {
		saveNotifications(notifications);
	}, [notifications]);

	const addNotification = useCallback(
		(notification: Omit<Notification, "id" | "read" | "createdAt">) => {
			const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const now = Date.now();

			const newNotification: Notification = {
				...notification,
				id,
				read: false,
				createdAt: now,
				expiresAt:
					notification.expiresAt ||
					now + DEFAULT_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
			};

			setNotifications((prev) => [newNotification, ...prev]);
			return id;
		},
		[],
	);

	const markAsRead = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
	}, []);

	const markAllAsRead = useCallback(() => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	}, []);

	const removeNotification = useCallback((id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	}, []);

	const clearAll = useCallback(() => {
		setNotifications([]);
	}, []);

	const clearRead = useCallback(() => {
		setNotifications((prev) => prev.filter((n) => !n.read));
	}, []);

	const unreadCount = notifications.filter((n) => !n.read).length;

	return {
		notifications,
		unreadCount,
		addNotification,
		markAsRead,
		markAllAsRead,
		removeNotification,
		clearAll,
		clearRead,
	};
}
