import type { LucideIcon } from "lucide-react";
import {
	BookOpen,
	Briefcase,
	Dice6,
	Flag,
	Heart,
	Home,
	LayoutGrid,
	Map as MapIcon,
	MessageSquare,
	Scroll,
	Search,
	Shield,
	Sparkles,
	Swords,
	Users,
	Wand2,
	Wrench,
} from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSystemSound } from "@/hooks/useSystemSound";
import { cn } from "@/lib/utils";

// ─── Tab Definitions ──────────────────────────────────────────────────────────

interface BottomNavTab {
	id: string;
	label: string;
	icon: LucideIcon;
	/** If set, clicking navigates to this route instead of emitting a tab change */
	href?: string;
}

// Default / Home tabs
const HOME_TABS: BottomNavTab[] = [
	{ id: "home", label: "Home", icon: Home, href: "/landing" },
	{ id: "characters", label: "Ascendants", icon: Swords, href: "/characters" },
	{ id: "compendium", label: "Codex", icon: BookOpen, href: "/compendium" },
	{ id: "campaigns", label: "Campaigns", icon: Users, href: "/campaigns" },
	{ id: "dice", label: "Dice", icon: Dice6, href: "/dice" },
];

// Character Sheet tabs (maps to CharacterSheetV2 activeMobileTab values)
const CHARACTER_SHEET_TABS: BottomNavTab[] = [
	{ id: "actions", label: "Combat", icon: Swords },
	{ id: "powers", label: "Spells", icon: Sparkles },
	{ id: "inventory", label: "Items", icon: Briefcase },
	{ id: "features", label: "Feats", icon: Scroll },
	{ id: "stats", label: "Stats", icon: LayoutGrid },
];

// Compendium tabs (general navigation since sidebar handles categories)
const COMPENDIUM_TABS: BottomNavTab[] = [
	{ id: "compendium", label: "Browse", icon: Search, href: "/compendium" },
	{
		id: "characters",
		label: "Ascendants",
		icon: Swords,
		href: "/characters",
	},
	{ id: "favorites", label: "Favorites", icon: Heart, href: "/favorites" },
	{ id: "homebrew", label: "Homebrew", icon: Wand2, href: "/homebrew" },
	{ id: "dice", label: "Dice", icon: Dice6, href: "/dice" },
];

// Campaigns list tabs
const CAMPAIGNS_TABS: BottomNavTab[] = [
	{
		id: "campaigns",
		label: "Campaigns",
		icon: Users,
		href: "/campaigns",
	},
	{ id: "join", label: "Join", icon: Flag, href: "/campaigns/join" },
	{ id: "characters", label: "Ascendants", icon: Swords, href: "/characters" },
	{ id: "dice", label: "Dice", icon: Dice6, href: "/dice" },
	{
		id: "compendium",
		label: "Codex",
		icon: BookOpen,
		href: "/compendium",
	},
];

// Campaign detail tabs (campaign-specific)
const CAMPAIGN_DETAIL_TABS: BottomNavTab[] = [
	{ id: "overview", label: "Overview", icon: LayoutGrid },
	{ id: "chat", label: "Chat", icon: MessageSquare },
	{ id: "vtt", label: "Map", icon: MapIcon },
	{ id: "players", label: "Players", icon: Users },
	{ id: "journal", label: "Journal", icon: Scroll },
];

// Warden Protocol tabs
const WARDEN_TABS: BottomNavTab[] = [
	{
		id: "protocols",
		label: "Protocols",
		icon: Shield,
		href: "/warden-protocols",
	},
	{
		id: "encounters",
		label: "Encounters",
		icon: Swords,
		href: "/warden-protocols/encounter-builder",
	},
	{
		id: "npcs",
		label: "NPCs",
		icon: Users,
		href: "/warden-protocols/npc-generator",
	},
	{
		id: "maps",
		label: "Maps",
		icon: MapIcon,
		href: "/warden-protocols/dungeon-map-generator",
	},
	{
		id: "treasure",
		label: "Treasure",
		icon: Sparkles,
		href: "/warden-protocols/treasure-generator",
	},
];

// Player Tools tabs
const PLAYER_TOOLS_TABS: BottomNavTab[] = [
	{
		id: "tools",
		label: "Tools",
		icon: Wrench,
		href: "/player-tools",
	},
	{ id: "dice", label: "Dice", icon: Dice6, href: "/dice" },
	{ id: "characters", label: "Ascendants", icon: Swords, href: "/characters" },
	{
		id: "compendium",
		label: "Codex",
		icon: BookOpen,
		href: "/compendium",
	},
	{ id: "campaigns", label: "Campaigns", icon: Users, href: "/campaigns" },
];

// ─── Route Context Detection ───────────────────────────────────────────────

type NavContext =
	| "hidden"
	| "home"
	| "character-sheet"
	| "compendium"
	| "campaigns-list"
	| "campaign-detail"
	| "warden"
	| "player-tools";

function getNavContext(pathname: string): NavContext {
	// Hidden on auth / login / setup / character creation / dice roller full-screen
	if (
		pathname.startsWith("/login") ||
		pathname.startsWith("/auth") ||
		pathname.startsWith("/setup") ||
		pathname === "/characters/new"
	) {
		return "hidden";
	}

	// Character sheet: /characters/:id (but NOT /characters or /characters/new)
	if (
		/^\/characters\/[^/]+$/.test(pathname) &&
		pathname !== "/characters/new"
	) {
		return "character-sheet";
	}

	// Campaign detail: /campaigns/:id (but NOT /campaigns, /campaigns/join)
	if (
		/^\/campaigns\/[^/]+/.test(pathname) &&
		!pathname.startsWith("/campaigns/join")
	) {
		return "campaign-detail";
	}

	// Campaigns list
	if (pathname === "/campaigns" || pathname.startsWith("/campaigns/join")) {
		return "campaigns-list";
	}

	// Warden protocols
	if (
		pathname.startsWith("/warden-protocols") ||
		pathname.startsWith("/admin")
	) {
		return "warden";
	}

	// Compendium & related
	if (
		pathname.startsWith("/compendium") ||
		pathname.startsWith("/source-book") ||
		pathname.startsWith("/favorites") ||
		pathname.startsWith("/homebrew") ||
		pathname.startsWith("/marketplace")
	) {
		return "compendium";
	}

	// Player tools
	if (pathname.startsWith("/player-tools") || pathname === "/dice") {
		return "player-tools";
	}

	return "home";
}

function getTabsForContext(context: NavContext): BottomNavTab[] {
	switch (context) {
		case "character-sheet":
			return CHARACTER_SHEET_TABS;
		case "compendium":
			return COMPENDIUM_TABS;
		case "campaigns-list":
			return CAMPAIGNS_TABS;
		case "campaign-detail":
			return CAMPAIGN_DETAIL_TABS;
		case "warden":
			return WARDEN_TABS;
		case "player-tools":
			return PLAYER_TOOLS_TABS;
		case "home":
			return HOME_TABS;
		default:
			return HOME_TABS;
	}
}

function getActiveTabForContext(
	context: NavContext,
	pathname: string,
	tabs: BottomNavTab[],
	searchParams: URLSearchParams,
): string {
	// Character sheet: use the search params tab
	if (context === "character-sheet") {
		return searchParams.get("tab") || "actions";
	}

	// Campaign detail: derive from sub-path
	if (context === "campaign-detail") {
		if (pathname.includes("/vtt")) return "vtt";
		if (pathname.includes("/journal")) return "journal";
		if (pathname.includes("/play")) return "chat";
		return "overview";
	}

	// For navigation-based tabs, match by href
	const matched = tabs.find((t) => t.href && pathname.startsWith(t.href));
	if (matched) return matched.id;

	return tabs[0]?.id || "";
}

// ─── Component ──────────────────────────────────────────────────────────────

export function MobileBottomNav() {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { playBlip } = useSystemSound();
	const context = getNavContext(location.pathname);

	// Hidden on certain pages
	if (context === "hidden") return null;

	const tabs = getTabsForContext(context);
	const activeTab = getActiveTabForContext(
		context,
		location.pathname,
		tabs,
		searchParams,
	);

	const handleTabClick = (tab: BottomNavTab) => {
		// Premium: Haptic Feedback
		if (typeof navigator !== "undefined" && navigator.vibrate) {
			navigator.vibrate(10); // Subtle tick
		}

		// Premium: System SFX
		playBlip();

		if (tab.href) {
			// Navigation tab: route to the page
			navigate(tab.href);
		} else if (context === "character-sheet") {
			// Character sheet context: sync search params
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev);
					next.set("tab", tab.id);
					return next;
				},
				{ replace: true },
			);
		} else if (context === "campaign-detail") {
			// Campaign detail: navigate to sub-route
			const campaignMatch = location.pathname.match(/^\/campaigns\/([^/]+)/);
			if (campaignMatch) {
				const campaignId = campaignMatch[1];
				const subRoutes: Record<string, string> = {
					overview: `/campaigns/${campaignId}`,
					chat: `/campaigns/${campaignId}/play/latest`,
					vtt: `/campaigns/${campaignId}/vtt`,
					players: `/campaigns/${campaignId}`,
					journal: `/campaigns/${campaignId}/journal`,
				};
				const targetRoute = subRoutes[tab.id];
				if (targetRoute && targetRoute !== location.pathname) {
					navigate(targetRoute);
				}
			}
		}
	};

	return (
		<nav
			id="mobile-bottom-nav"
			className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-primary/20 shadow-[0_-4px_24px_rgba(0,0,0,0.6)] pb-safe animate-in slide-in-from-bottom duration-500"
			aria-label="Mobile navigation"
		>
			{/* Holographic scanning line */}
			<div className="absolute top-0 left-0 w-full h-[1px] bg-primary/30 animate-[scan_2s_linear_infinite] opacity-50 pointer-events-none" />

			<div className="grid grid-cols-5 h-16 relative">
				{tabs.map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;

					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => handleTabClick(tab)}
							className={cn(
								"relative flex flex-col items-center justify-center gap-0.5 transition-all min-h-[44px]",
								isActive
									? "text-primary"
									: "text-muted-foreground active:text-foreground",
							)}
							aria-current={isActive ? "page" : undefined}
							aria-label={tab.label}
						>
							{/* Active indicator bar */}
							{isActive && (
								<div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
							)}

							<div
								className={cn(
									"p-1 rounded-lg transition-all",
									isActive &&
										"bg-primary/15 shadow-[0_0_12px_hsl(var(--primary)/0.25)]",
								)}
							>
								<Icon className="w-5 h-5" />
							</div>
							<span className="text-[9px] font-mono uppercase tracking-wider font-bold leading-none">
								{tab.label}
							</span>
						</button>
					);
				})}
			</div>
		</nav>
	);
}
