import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { GlobalCharacterHUD } from "@/components/navigation/GlobalCharacterHUD";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { NavBar } from "@/components/navigation/NavBar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
	children: ReactNode;
	className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
	const location = useLocation();
	const isCharacterSheet = location.pathname.startsWith("/characters/");
	// Full-viewport VTT map routes render their own chrome; suppress the bottom
	// nav there so it never covers the map or the VTT's own bottom controls.
	const isFullBleedVtt = /\/vtt(-map|-enhanced)?(\/spectate)?$/.test(
		location.pathname,
	);

	return (
		<div className="min-h-[100dvh] w-full flex bg-transparent selection:bg-primary/30 relative">
			{/* Global System Visual Effects handled by CosmicBackground + GlobalEffects in App.tsx */}
			{/* Unified Sidebar (Rail/Drawer) */}
			<AppSidebar />

			<div className="flex-1 flex flex-col min-w-0 relative h-[100dvh]">
				{/* The Header (NavBar) will be sticky at the top of this flex container */}
				<NavBar />

				{/* Global Character HUD (Sticky below NavBar) - Hidden on character sheets */}
				{!isCharacterSheet && <GlobalCharacterHUD />}

				{/* Main Content Area - Scrollable (h-0 forces flex-1 to constrain, enabling overflow scroll) */}
				<main
					className={cn(
						"flex-1 h-0 overflow-y-auto overflow-x-hidden px-4 pt-6 md:pt-8 pb-24 lg:pb-8 transition-all duration-500 scroll-smooth",
						className,
					)}
				>
					<div className="container mx-auto max-w-7xl flex flex-col">
						{children}
					</div>
				</main>
			</div>

			{/* Thumb-reachable bottom nav (phones/tablets). Hidden on desktop and
			    on full-bleed VTT map routes. */}
			{!isFullBleedVtt && <MobileBottomNav />}
		</div>
	);
}
