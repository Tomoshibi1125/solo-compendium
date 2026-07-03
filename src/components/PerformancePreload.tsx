import { useEffect, useRef } from "react";
import { cancelIdle, runIdle } from "@/lib/idle";
import { usePerformanceProfile } from "@/lib/performanceProfile";

const warmModules = () =>
	Promise.allSettled([
		import("@/lib/three/loaders").then(({ initThreeLoaders }) =>
			initThreeLoaders(),
		),
		import("@/components/dice/Dice3DScene"),
		import("@/pages/DiceRoller"),
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
