/**
 * requestIdleCallback with a setTimeout fallback (Safari/iOS lacks rIC).
 * Used to push non-critical boot work (prefetch, cache warming) off the
 * critical path so first paint and interaction win.
 */
export const runIdle = (callback: () => void, timeoutMs = 3500) => {
	if (typeof window === "undefined") return 0;
	if (typeof window.requestIdleCallback === "function") {
		return window.requestIdleCallback(() => callback(), { timeout: timeoutMs });
	}
	return window.setTimeout(callback, 1200);
};

export const cancelIdle = (id: number) => {
	if (typeof window === "undefined") return;
	if (typeof window.cancelIdleCallback === "function") {
		window.cancelIdleCallback(id);
		return;
	}
	window.clearTimeout(id);
};
