import { Home, Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface VTTZoomHudProps extends HTMLAttributes<HTMLDivElement> {
	/** Current zoom multiplier (1 = 100%). */
	zoom: number;
	/** Minimum allowed zoom. Defaults to 0.5. */
	minZoom?: number;
	/** Maximum allowed zoom. Defaults to 2. */
	maxZoom?: number;
	/** Zoom step per +/− click. Defaults to 0.1. */
	step?: number;
	/** Change zoom to a specific value (will be clamped). */
	onRequestZoom: (nextZoom: number) => void;
	/** Fit the current scene to the viewport. */
	onFit?: () => void;
	/** Scroll the scene origin back into the viewport. */
	onRecenter?: () => void;
	/** Reset zoom to 1 (100%). Defaults to `onRequestZoom(1)`. */
	onReset?: () => void;
	/** Position anchor inside the map area. Defaults to `bottom-right`. */
	anchor?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
	/** Hide the Fit / Recenter / Reset buttons for a minimal −/%/+ only HUD. */
	minimal?: boolean;
}

const ANCHOR_CLASS: Record<NonNullable<VTTZoomHudProps["anchor"]>, string> = {
	"bottom-right": "bottom-3 right-3",
	"bottom-left": "bottom-3 left-3",
	"top-right": "top-3 right-3",
	"top-left": "top-3 left-3",
};

/**
 * Persistent floating zoom HUD rendered over the VTT canvas. Visible to both
 * Warden and Ascendant without opening any drawer. Matches DDB Maps /
 * Foundry / Roll20 bottom-right zoom convention.
 *
 * Keyboard parity: callers should also wire `+` / `-` / `0` / `Home` on the
 * map canvas. This component only renders the UI controls.
 */
export function VTTZoomHud({
	zoom,
	minZoom = 0.5,
	maxZoom = 2,
	step = 0.1,
	onRequestZoom,
	onFit,
	onRecenter,
	onReset,
	anchor = "bottom-right",
	minimal = false,
	className,
	...rest
}: VTTZoomHudProps) {
	const clamp = (value: number) =>
		Math.max(minZoom, Math.min(maxZoom, Math.round(value * 100) / 100));

	const handleZoomOut = () => onRequestZoom(clamp(zoom - step));
	const handleZoomIn = () => onRequestZoom(clamp(zoom + step));
	const handleReset = () => {
		if (onReset) {
			onReset();
		} else {
			onRequestZoom(1);
		}
	};

	return (
		<div
			data-testid="vtt-zoom-hud"
			className={cn(
				"absolute z-30 pointer-events-none",
				ANCHOR_CLASS[anchor],
				className,
			)}
			{...rest}
		>
			<div
				className={cn(
					"pointer-events-auto inline-flex items-center gap-0.5",
					"rounded-full border border-border/60",
					"bg-card/85 backdrop-blur-md shadow-[0_4px_14px_rgba(0,0,0,0.4)]",
					"px-1 py-1",
				)}
				role="toolbar"
				aria-label="Zoom controls"
			>
				<button
					type="button"
					data-testid="vtt-zoom-out"
					onClick={handleZoomOut}
					disabled={zoom <= minZoom + 0.0001}
					aria-label="Zoom out"
					title="Zoom out (−)"
					className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/80 hover:bg-muted/60 hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
				>
					<Minus className="w-3.5 h-3.5" aria-hidden />
				</button>
				<button
					type="button"
					data-testid="vtt-zoom-reset"
					onClick={handleReset}
					aria-label={`Zoom ${Math.round(zoom * 100)}% — click to reset`}
					title="Reset to 100% (0)"
					className="min-w-[44px] h-7 px-2 text-[11px] font-medium tabular-nums text-foreground/90 rounded-full hover:bg-muted/60 transition-colors"
				>
					{Math.round(zoom * 100)}%
				</button>
				<button
					type="button"
					data-testid="vtt-zoom-in"
					onClick={handleZoomIn}
					disabled={zoom >= maxZoom - 0.0001}
					aria-label="Zoom in"
					title="Zoom in (+)"
					className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/80 hover:bg-muted/60 hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
				>
					<Plus className="w-3.5 h-3.5" aria-hidden />
				</button>
				{!minimal && (onFit || onRecenter || onReset) && (
					<div className="mx-1 h-5 w-px bg-border/50" aria-hidden />
				)}
				{!minimal && onFit && (
					<button
						type="button"
						data-testid="vtt-zoom-fit"
						onClick={onFit}
						aria-label="Zoom to fit scene"
						title="Zoom to fit (Home)"
						className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-colors"
					>
						<Maximize2 className="w-3.5 h-3.5" aria-hidden />
					</button>
				)}
				{!minimal && onRecenter && (
					<button
						type="button"
						data-testid="vtt-zoom-recenter"
						onClick={onRecenter}
						aria-label="Recenter view"
						title="Recenter view"
						className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-colors"
					>
						<Home className="w-3.5 h-3.5" aria-hidden />
					</button>
				)}
				{!minimal && !onReset && (
					<button
						type="button"
						data-testid="vtt-zoom-reset-alt"
						onClick={handleReset}
						aria-label="Reset zoom to 100%"
						title="Reset zoom (0)"
						className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-colors"
					>
						<RotateCcw className="w-3.5 h-3.5" aria-hidden />
					</button>
				)}
			</div>
		</div>
	);
}
