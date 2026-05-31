import { useEffect, useRef, useState } from "react";
import { usePerformanceProfile } from "@/lib/performanceProfile";

export const GlobalEffects = () => {
	const [hasFinePointer, setHasFinePointer] = useState(false);
	const glowRef = useRef<HTMLDivElement | null>(null);
	const ambientRef = useRef<HTMLDivElement | null>(null);
	const rafRef = useRef<number | null>(null);
	const targetRef = useRef({ x: 0, y: 0 });
	const { fx } = usePerformanceProfile();

	const enablePointerGlow = hasFinePointer && fx.enablePointerGlow;

	useEffect(() => {
		if (typeof window === "undefined") return;
		const pointerQuery = window.matchMedia("(pointer: fine)");
		const updatePointer = () => setHasFinePointer(pointerQuery.matches);
		updatePointer();
		if (pointerQuery.addEventListener) {
			pointerQuery.addEventListener("change", updatePointer);
		} else {
			pointerQuery.addListener(updatePointer);
		}
		return () => {
			if (pointerQuery.removeEventListener) {
				pointerQuery.removeEventListener("change", updatePointer);
			} else {
				pointerQuery.removeListener(updatePointer);
			}
		};
	}, []);

	// Track pointer position for interactive effects (rAF throttled)
	useEffect(() => {
		if (!enablePointerGlow) return;

		const updateGlow = () => {
			rafRef.current = null;
			if (!glowRef.current) return;
			const { x, y } = targetRef.current;
			glowRef.current.style.transform = `translate3d(${x - 20}px, ${y - 20}px, 0)`;
		};

		const handlePointerMove = (event: PointerEvent) => {
			targetRef.current = { x: event.clientX, y: event.clientY };
			if (rafRef.current === null) {
				rafRef.current = window.requestAnimationFrame(updateGlow);
			}
		};

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		targetRef.current = { x: centerX, y: centerY };
		updateGlow();

		window.addEventListener("pointermove", handlePointerMove, {
			passive: true,
		});
		return () => {
			window.removeEventListener("pointermove", handlePointerMove);
			if (rafRef.current !== null) {
				window.cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
		};
	}, [enablePointerGlow]);

	useEffect(() => {
		if (!ambientRef.current) return;
		ambientRef.current.style.setProperty(
			"--ambient-opacity",
			String(fx.ambientOpacity),
		);
	}, [fx.ambientOpacity]);

	return (
		<>
			{/* Mouse Follow Effect */}
			{enablePointerGlow && (
				<div
					ref={glowRef}
					className="pointer-events-none fixed z-50 transition-transform duration-100 ease-out mouse-follow-glow"
				/>
			)}
			{/* Ambient Glow Effects */}
			<div
				ref={ambientRef}
				className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 ambient-glow-container"
			>
				<div className="ambient-glow-purple ambient-glow-1" />
				<div className="ambient-glow-blue ambient-glow-2" />
				<div className="ambient-glow-violet ambient-glow-3" />
			</div>
		</>
	);
};
