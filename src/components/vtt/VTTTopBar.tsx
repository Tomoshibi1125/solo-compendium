import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface VTTTopBarProps {
	/** Left side: typically back button + scene name. */
	left?: ReactNode;
	/** Right side: typically status badges + action buttons. */
	right?: ReactNode;
	className?: string;
}

/**
 * Floating top bar rendered over the VTT canvas. Thin (40-44px) and
 * translucent so as much of the map as possible stays visible. Uses
 * pointer-events-auto on children only so the canvas underneath remains
 * fully interactive outside the bar.
 */
export function VTTTopBar({ left, right, className }: VTTTopBarProps) {
	return (
		<div
			data-testid="vtt-topbar"
			className={cn(
				"vtt-topbar absolute top-2 left-2 right-2 z-30",
				"flex items-center justify-between gap-2",
				"px-3 py-1.5 rounded-lg",
				"bg-card/80 backdrop-blur-md border border-border/40",
				"shadow-[0_4px_18px_rgba(0,0,0,0.45)]",
				"pointer-events-auto",
				className,
			)}
		>
			<div className="flex items-center gap-2 min-w-0 flex-1">{left}</div>
			<div className="flex items-center gap-1 shrink-0">{right}</div>
		</div>
	);
}
