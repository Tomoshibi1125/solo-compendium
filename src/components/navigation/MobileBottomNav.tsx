import { BookOpen, Menu, Sparkles, Swords, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

/**
 * Persistent thumb-reachable bottom navigation for phones & tablets (< lg).
 * Mirrors D&D Beyond's mobile tab navigation: the most-used destinations are one
 * tap away, and "More" opens the full sidebar drawer (AppSidebar) for everything
 * else. Hidden on desktop (>= lg), where the sidebar rail is always visible.
 */
const NAV_ITEMS = [
	{ title: "Characters", href: "/characters", icon: Swords },
	{ title: "Compendium", href: "/compendium", icon: BookOpen },
	{ title: "Campaigns", href: "/campaigns", icon: Users },
	{ title: "Tools", href: "/ascendant-tools", icon: Sparkles },
] as const;

const HIDDEN_PREFIXES = ["/login", "/auth", "/setup"];

export function MobileBottomNav() {
	const location = useLocation();
	const { setSidebarOpen } = useAppStore();
	const path = location.pathname;

	// Match NavBar's auth-page behaviour: no chrome on auth / landing routes.
	const hidden =
		path === "/" ||
		path === "/landing" ||
		HIDDEN_PREFIXES.some((p) => path.startsWith(p));
	if (hidden) return null;

	const isActive = (href: string) =>
		path === href || path.startsWith(`${href}/`);

	return (
		<nav
			aria-label="Primary"
			className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-primary/20 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
			style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
		>
			<div className="grid grid-cols-5">
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const active = isActive(item.href);
					return (
						<Link
							key={item.href}
							to={item.href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-1.5 px-1 text-[10px] font-heading tracking-wide transition-colors",
								active
									? "text-primary"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<Icon
								className={cn(
									"h-5 w-5 shrink-0",
									active && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]",
								)}
							/>
							<span className="truncate max-w-full">{item.title}</span>
						</Link>
					);
				})}
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					aria-label="Open full menu"
					className="flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-1.5 px-1 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-foreground transition-colors"
				>
					<Menu className="h-5 w-5 shrink-0" />
					<span>More</span>
				</button>
			</div>
		</nav>
	);
}
