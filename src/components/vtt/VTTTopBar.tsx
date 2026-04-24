import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface VTTTopBarProps {
	/** Left side: typically back button + scene name. */
	left?: ReactNode;
	/** Right side: typically status badges + action buttons. */
	right?: ReactNode;
	/**
	 * When true, the bar fades and shrinks its background while idle so the map
	 * underneath stays visible. Hover / focus / pointer-inside restores full
	 * opacity. Defaults to true — matches DDB Maps and Foundry behavior.
	 */
	autoHide?: boolean;
	/** Milliseconds of idle before fading. Defaults to 2200 ms. */
	idleMs?: number;
	className?: string;
}

/**
 * Floating top bar rendered over the VTT canvas. Thin (~36 px) and translucent
 * so the map below stays visible. The outer container is `pointer-events-none`
 * — only the left/right inner groups receive pointer events. This lets the
 * canvas under the empty gap stay fully interactive (fixes the earlier bug
 * where the entire bar rectangle stole clicks/wheel events).
 */
export function VTTTopBar({
	left,
	right,
	autoHide = true,
	idleMs = 2200,
	className,
}: VTTTopBarProps) {
	const [isIdle, setIsIdle] = useState(false);
	const idleTimerRef = useRef<number | null>(null);
	const barRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!autoHide) {
			setIsIdle(false);
			return;
		}
		const scheduleIdle = () => {
			if (idleTimerRef.current !== null) {
				window.clearTimeout(idleTimerRef.current);
			}
			idleTimerRef.current = window.setTimeout(() => {
				setIsIdle(true);
			}, idleMs);
		};
		const wake = () => {
			setIsIdle(false);
			scheduleIdle();
		};

		scheduleIdle();
		window.addEventListener("pointermove", wake, { passive: true });
		window.addEventListener("keydown", wake);
		return () => {
			window.removeEventListener("pointermove", wake);
			window.removeEventListener("keydown", wake);
			if (idleTimerRef.current !== null) {
				window.clearTimeout(idleTimerRef.current);
			}
		};
	}, [autoHide, idleMs]);

	return (
		<div
			ref={barRef}
			data-testid="vtt-topbar"
			data-idle={autoHide ? (isIdle ? "true" : "false") : undefined}
			className={cn(
				"vtt-topbar absolute top-2 left-2 right-2 z-30",
				"flex items-center justify-between gap-2",
				"px-2 py-1 rounded-md",
				"border border-border/40",
				"transition-[opacity,background-color,backdrop-filter] duration-300",
				// Outer container does NOT capture pointer events — empty gap
				// between left/right passes through to the canvas.
				"pointer-events-none",
				autoHide && isIdle
					? "opacity-40 bg-card/25 backdrop-blur-sm shadow-none"
					: "opacity-100 bg-card/80 backdrop-blur-md shadow-[0_4px_18px_rgba(0,0,0,0.45)]",
				className,
			)}
			onPointerEnter={() => setIsIdle(false)}
		>
			{/* Only the inner flex groups receive pointer events. */}
			<div className="pointer-events-auto flex items-center gap-2 min-w-0 flex-1">
				{left}
			</div>
			<div className="pointer-events-auto flex items-center gap-1 shrink-0">
				{right}
			</div>
		</div>
	);
}
