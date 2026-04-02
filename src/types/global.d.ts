interface Window {
	posthog?: {
		capture: (event: string, properties?: Record<string, unknown>) => void;
		identify: (userId: string, properties?: Record<string, unknown>) => void;
		reset: () => void;
	};
	requestIdleCallback: (
		callback: (deadline: {
			didTimeout: boolean;
			timeRemaining: () => number;
		}) => void,
		options?: { timeout: number },
	) => number;
	cancelIdleCallback: (handle: number) => void;
}
