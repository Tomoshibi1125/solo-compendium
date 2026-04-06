import { useEffect, useRef } from "react";
import { usePerformanceProfile } from "@/lib/performanceProfile";

const runIdle = (callback: () => void) => {
	if (typeof window === "undefined") return 0;
	if (typeof window.requestIdleCallback === "function") {
		return window.requestIdleCallback(() => callback(), { timeout: 3500 });
	}
	return window.setTimeout(callback, 1200);
};

const cancelIdle = (id: number) => {
	if (typeof window === "undefined") return;
	if (typeof window.cancelIdleCallback === "function") {
		window.cancelIdleCallback(id);
		return;
	}
	window.clearTimeout(id);
};

const warmModules = () =>
	Promise.allSettled([
		import("@/lib/three/loaders").then(({ initThreeLoaders }) =>
			initThreeLoaders(),
		),
		import("@/components/dice/Dice3DScene"),
		import("@/pages/DiceRoller"),
		import("@/pages/warden-directives/VTTEnhanced"),
		import("@/pages/warden-directives/VTTMap"),
		import("@/pages/warden-directives/TokenLibrary"),
	]);

export default function PerformancePreload() {
	const { prefetch } = usePerformanceProfile();
	const ranRef = useRef(false);

	useEffect(() => {
		if (!prefetch || ranRef.current) return;
		ranRef.current = true;
		const idleId = runIdle(() => {
			void warmModules();
		});
		return () => cancelIdle(idleId);
	}, [prefetch]);

	return null;
}
