import { DynamicStyle } from "@/components/ui/DynamicStyle";
import type { VTTPointerTrail } from "@/hooks/useVTTRealtime";
import { cn } from "@/lib/utils";

export interface VTTPointerOverlayProps {
	trails: VTTPointerTrail[];
	gridSize: number;
	zoom: number;
	className?: string;
}

/**
 * Renders the trailing-highlight "Point" tool (DDB parity): a fading sequence
 * of colored dots plus a current-position marker with the user's label.
 *
 * Every point's opacity is derived from its age relative to the newest point
 * so older samples fade out for a cursor-trail effect.
 */
export function VTTPointerOverlay({
	trails,
	gridSize,
	zoom,
	className,
}: VTTPointerOverlayProps) {
	if (!trails.length) return null;

	return (
		<div
			data-testid="vtt-pointer-overlay"
			className={cn("pointer-events-none absolute inset-0 z-30", className)}
			aria-hidden
		>
			{trails.map((trail) => {
				if (trail.trail.length === 0) return null;
				const newest = trail.trail[trail.trail.length - 1];
				const newestTime = newest.t;
				return (
					<div key={trail.userId}>
						{trail.trail.map((point, idx) => {
							const age = Math.max(0, newestTime - point.t);
							const opacity = Math.max(0, 1 - age / 800);
							if (opacity <= 0.05) return null;
							const px = (point.x + 0.5) * gridSize * zoom;
							const py = (point.y + 0.5) * gridSize * zoom;
							const size = Math.max(4, 12 - idx * 1.2);
							return (
								<DynamicStyle
									key={`${trail.userId}-${point.t}-${point.x}-${point.y}`}
									className="vtt-pointer-dot absolute rounded-full"
									vars={{
										"background-color": trail.color,
										left: `${px}px`,
										top: `${py}px`,
										width: `${size}px`,
										height: `${size}px`,
										opacity: String(opacity),
										transform: "translate(-50%, -50%)",
										"box-shadow": `0 0 ${Math.round(size)}px ${trail.color}`,
									}}
								/>
							);
						})}
						{/* User label anchored at the newest point. */}
						<DynamicStyle
							className="vtt-pointer-label absolute text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-card/90 border border-border/60 shadow-sm whitespace-nowrap"
							vars={{
								left: `${(newest.x + 0.5) * gridSize * zoom + 10}px`,
								top: `${(newest.y + 0.5) * gridSize * zoom - 8}px`,
								color: trail.color,
							}}
						>
							{trail.userName}
						</DynamicStyle>
					</div>
				);
			})}
		</div>
	);
}
