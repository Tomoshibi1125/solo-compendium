import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { GlobalCharacterHUD } from "@/components/navigation/GlobalCharacterHUD";
import { NavBar } from "@/components/navigation/NavBar";
import { RiftOverlay } from "@/components/ui/RiftOverlay";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
	children: ReactNode;
	className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
	const location = useLocation();
	const isCharacterSheet = location.pathname.startsWith("/characters/");

	return (
		<div className="min-h-screen min-h-[100dvh] w-full flex bg-background selection:bg-primary/30 relative">
			{/* Global System Visual Effects */}
			<RiftOverlay />

			{/* Unified Sidebar (Rail/Drawer) */}
			<AppSidebar />

			<div className="flex-1 flex flex-col min-w-0 relative min-h-full">
				{/* The Header (NavBar) will be sticky at the top of this flex container */}
				<NavBar />

				{/* Global Character HUD (Sticky below NavBar) - Hidden on character sheets */}
				{!isCharacterSheet && <GlobalCharacterHUD />}

				{/* Main Content Area - Scrollable */}
				<main
					className={cn(
						"flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:py-8 transition-all duration-500 scroll-smooth",
						className,
					)}
				>
					<div className="container mx-auto max-w-7xl min-h-full flex flex-col">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
