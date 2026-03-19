import { Briefcase, LayoutGrid, Scroll, Sparkles, Swords } from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "combat" | "powers" | "items" | "features" | "stats";

interface MobileHUDProps {
	activeTab?: TabType;
	onTabChange?: (tab: TabType) => void;
}

export function MobileHUD({
	activeTab = "combat",
	onTabChange,
}: MobileHUDProps) {
	const tabs = [
		{ id: "combat", label: "Combat", icon: Swords },
		{ id: "powers", label: "Powers", icon: Sparkles },
		{ id: "items", label: "Items", icon: Briefcase },
		{ id: "features", label: "Features", icon: Scroll },
		{ id: "stats", label: "Stats", icon: LayoutGrid },
	] as const;

	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-primary/20 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
			<div className="grid grid-cols-5 h-16">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;

					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => onTabChange?.(tab.id)}
							className={cn(
								"flex flex-col items-center justify-center gap-1 transition-all",
								isActive
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<div
								className={cn(
									"p-1 rounded-lg transition-all",
									isActive &&
										"bg-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.3)]",
								)}
							>
								<Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
							</div>
							<span className="text-[10px] font-system uppercase tracking-tighter font-bold">
								{tab.label}
							</span>
							{isActive && (
								<div className="absolute top-0 w-8 h-1 bg-primary rounded-full blur-[1px]" />
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
