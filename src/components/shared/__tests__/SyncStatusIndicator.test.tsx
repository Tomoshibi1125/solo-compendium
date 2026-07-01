import type React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getSyncQueue = vi.fn();
const flushSyncQueue = vi.fn();
vi.mock("@/lib/syncManager", () => ({
	getSyncQueue: () => getSyncQueue(),
	flushSyncQueue: () => flushSyncQueue(),
}));

const notifySuccess = vi.fn();
const notifyError = vi.fn();
vi.mock("@/lib/notify", () => ({
	notifySuccess: (...args: unknown[]) => notifySuccess(...args),
	notifyError: (...args: unknown[]) => notifyError(...args),
}));

import { SyncStatusIndicator } from "@/components/shared/SyncStatusIndicator";

(
	globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const flush = async () => {
	await act(async () => {
		await Promise.resolve();
		await Promise.resolve();
		await Promise.resolve();
	});
};

const mount = (node: React.ReactElement) => {
	const container = document.createElement("div");
	document.body.appendChild(container);
	const root = createRoot(container);
	act(() => {
		root.render(node);
	});
	return {
		container,
		unmount: () =>
			act(() => {
				root.unmount();
			}),
	};
};

describe("SyncStatusIndicator", () => {
	beforeEach(() => {
		getSyncQueue.mockReset();
		flushSyncQueue.mockReset();
		notifySuccess.mockReset();
		notifyError.mockReset();
		Object.defineProperty(navigator, "onLine", {
			value: true,
			configurable: true,
		});
	});

	it("renders nothing when online with an empty queue", async () => {
		getSyncQueue.mockResolvedValue([]);
		const { container, unmount } = mount(<SyncStatusIndicator />);
		await flush();
		expect(container.textContent).toBe("");
		unmount();
	});

	it("shows the pending count when the queue is non-empty", async () => {
		getSyncQueue.mockResolvedValue([{ id: "1" }, { id: "2" }]);
		const { container, unmount } = mount(<SyncStatusIndicator />);
		await flush();
		expect(container.textContent).toContain("2 pending");
		unmount();
	});

	it("notifies success after a clean manual sync", async () => {
		getSyncQueue.mockResolvedValue([{ id: "1" }]);
		flushSyncQueue.mockResolvedValue({ success: 1, failed: 0, remaining: 0 });
		const { container, unmount } = mount(<SyncStatusIndicator />);
		await flush();
		const button = container.querySelector("button");
		await act(async () => {
			button?.click();
			await Promise.resolve();
			await Promise.resolve();
		});
		expect(notifySuccess).toHaveBeenCalledTimes(1);
		expect(notifyError).not.toHaveBeenCalled();
		unmount();
	});

	it("notifies an error when a manual sync leaves failures", async () => {
		getSyncQueue.mockResolvedValue([{ id: "1" }]);
		flushSyncQueue.mockResolvedValue({ success: 0, failed: 1, remaining: 1 });
		const { container, unmount } = mount(<SyncStatusIndicator />);
		await flush();
		const button = container.querySelector("button");
		await act(async () => {
			button?.click();
			await Promise.resolve();
			await Promise.resolve();
		});
		expect(notifyError).toHaveBeenCalledTimes(1);
		unmount();
	});
});
