import type { PostHog } from "posthog-js";
import type { Json } from "@/integrations/supabase/types";

declare global {
	interface Window {
		posthog?: PostHog;
		plausible?: (
			eventName: string,
			options?: { props?: Record<string, Json | undefined> },
		) => void;
		supabaseConfigured?: boolean;
		webkitAudioContext?: typeof AudioContext;
		requestIdleCallback: (
			callback: (deadline: {
				didTimeout: boolean;
				timeRemaining: () => number;
			}) => void,
			options?: { timeout: number },
		) => number;
		cancelIdleCallback: (handle: number) => void;
	}
}
