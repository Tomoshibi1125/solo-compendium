import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VTTIconRailItem {
	id: string;
	icon: LucideIcon;
	label: string;
	testId?: string;
	disabled?: boolean;
	badge?: React.ReactNode;
}

export interface VTTIconRailProps {
	side: "left" | "right";
	items: VTTIconRailItem[];
	activeId: string | null;
	onSelect: (id: string | null) => void;
	className?: string;
	ariaLabel?: string;
}

/**
 * Narrow vertical icon rail (~48-56px) that toggles a single active drawer
 * per side. Clicking the currently-active icon closes the drawer. Renders
 * a tooltip-style label on hover via the native `title` attribute so the
 * rail stays extremely compact.
 */
export function VTTIconRail({
	side,
	items,
	activeId,
	onSelect,
	className,
	ariaLabel,
}: VTTIconRailProps) {
	return (
		<nav
			aria-label={
				ariaLabel ?? `${side === "left" ? "Left" : "Right"} tool rail`
			}
			data-testid={`vtt-rail-${side}`}
			className={cn(
				"vtt-rail flex flex-col items-center gap-1 py-2 w-12 sm:w-14",
				"bg-card/85 backdrop-blur-sm border border-border/40 rounded-lg",
				"shadow-[0_4px_18px_rgba(0,0,0,0.4)]",
				className,
			)}
		>
			{items.map((item) => {
				const Icon = item.icon;
				const isActive = activeId === item.id;
				return (
					<button
						type="button"
						key={item.id}
						data-testid={item.testId ?? `vtt-rail-${side}-${item.id}`}
						disabled={item.disabled}
						onClick={() => onSelect(isActive ? null : item.id)}
						title={item.label}
						aria-label={item.label}
						aria-pressed={isActive ? "true" : "false"}
						className={cn(
							"vtt-rail-btn relative inline-flex items-center justify-center",
							"w-10 h-10 sm:w-11 sm:h-11 rounded-md transition-all",
							"text-foreground/70 hover:text-foreground hover:bg-primary/10",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
							isActive &&
								"bg-primary/20 text-primary shadow-[0_0_14px_hsl(var(--primary)/0.35)]",
							item.disabled && "opacity-40 cursor-not-allowed hover:bg-transparent",
						)}
					>
						<Icon className="w-5 h-5" aria-hidden />
						{item.badge != null && (
							<span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[9px] font-bold text-primary-foreground inline-flex items-center justify-center">
								{item.badge}
							</span>
						)}
					</button>
				);
			})}
		</nav>
	);
}
