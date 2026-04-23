import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VTTMobileTabBarItem {
	id: string;
	icon: LucideIcon;
	label: string;
	testId?: string;
	badge?: React.ReactNode;
}

export interface VTTMobileTabBarProps {
	items: VTTMobileTabBarItem[];
	activeId: string | null;
	onSelect: (id: string | null) => void;
	className?: string;
	ariaLabel?: string;
}

/**
 * Fixed bottom tab bar for the mobile VTT experience. Each item is a full
 * height touch target (>=44px) that opens a bottom-sheet drawer. Tapping
 * the active item closes it. Lives above safe-area insets for iOS.
 */
export function VTTMobileTabBar({
	items,
	activeId,
	onSelect,
	className,
	ariaLabel,
}: VTTMobileTabBarProps) {
	return (
		<nav
			aria-label={ariaLabel ?? "VTT mobile tab bar"}
			data-testid="vtt-mobile-tabbar"
			className={cn(
				"vtt-mobile-tabbar fixed bottom-0 left-0 right-0 z-40",
				"flex border-t border-border/40 bg-card/95 backdrop-blur-md",
				"pb-[env(safe-area-inset-bottom)]",
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
						data-testid={item.testId ?? `vtt-mobile-tab-${item.id}`}
						onClick={() => onSelect(isActive ? null : item.id)}
						aria-label={item.label}
						aria-pressed={isActive ? "true" : "false"}
						className={cn(
							"relative flex flex-1 flex-col items-center justify-center gap-0.5",
							"min-h-[56px] text-[10px] uppercase tracking-wider",
							"transition-colors",
							isActive
								? "text-primary bg-primary/10"
								: "text-foreground/70 hover:text-foreground",
						)}
					>
						<Icon className="w-5 h-5" aria-hidden />
						<span>{item.label}</span>
						{item.badge != null && (
							<span className="absolute top-1 right-4 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[9px] font-bold text-primary-foreground inline-flex items-center justify-center">
								{item.badge}
							</span>
						)}
					</button>
				);
			})}
		</nav>
	);
}
