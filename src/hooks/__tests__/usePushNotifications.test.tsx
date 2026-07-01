import type React from "react";
import { act, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	type UsePushNotificationsReturn,
	usePushNotifications,
} from "@/hooks/usePushNotifications";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mount = (element: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(element);
	});
	return () => {
		act(() => {
			root.unmount();
		});
		container.remove();
	};
};

const tick = async () => {
	await act(async () => {
		await Promise.resolve();
	});
};

function Probe({
	onReady,
}: {
	onReady: (api: UsePushNotificationsReturn) => void;
}) {
	const api = usePushNotifications();
	const last = useRef<UsePushNotificationsReturn | null>(null);
	last.current = api;
	useEffect(() => {
		onReady(last.current as UsePushNotificationsReturn);
	});
	return null;
}

describe("usePushNotifications", () => {
	const originalNotification = (globalThis as Record<string, unknown>)
		.Notification;

	afterEach(() => {
		(globalThis as Record<string, unknown>).Notification = originalNotification;
		vi.restoreAllMocks();
	});

	it("reports unsupported and denies when the Notification API is missing", async () => {
		delete (globalThis as Record<string, unknown>).Notification;
		const captured: { api: UsePushNotificationsReturn | null } = { api: null };
		const unmount = mount(
			<Probe
				onReady={(a) => {
					captured.api = a;
				}}
			/>,
		);
		await tick();
		expect(captured.api?.isSupported).toBe(false);
		await expect(captured.api?.requestPermission()).resolves.toBe("denied");
		unmount();
	});

	it("requests permission and reflects the granted result when supported", async () => {
		const requestPermission = vi.fn(async () => "granted" as const);
		(globalThis as Record<string, unknown>).Notification = {
			permission: "default",
			requestPermission,
		};
		Object.defineProperty(navigator, "serviceWorker", {
			configurable: true,
			value: { ready: Promise.resolve({ showNotification: vi.fn() }) },
		});
		const captured: { api: UsePushNotificationsReturn | null } = { api: null };
		const unmount = mount(
			<Probe
				onReady={(a) => {
					captured.api = a;
				}}
			/>,
		);
		await tick();
		expect(captured.api?.isSupported).toBe(true);
		await act(async () => {
			await captured.api?.requestPermission();
		});
		expect(requestPermission).toHaveBeenCalledTimes(1);
		expect(captured.api?.permission).toBe("granted");
		unmount();
	});
});
