import type { ReactNode } from "react";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { GlobalCharacterHUD } from "@/components/navigation/GlobalCharacterHUD";
import { NavBar } from "@/components/navigation/NavBar";
import { SystemOverlay } from "@/components/ui/SystemOverlay";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
	children: ReactNode;
	className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
	return (
		<div className="min-h-screen flex bg-background selection:bg-primary/30 relative overflow-hidden">
			{/* Global System Visual Effects */}
			<SystemOverlay />

			{/* Unified Sidebar (Rail/Drawer) */}
			<AppSidebar />

			<div className="flex-1 flex flex-col min-w-0 relative h-full">
				{/* The Header (NavBar) will be sticky at the top of this flex container */}
				<NavBar />

				{/* Global Character HUD (Sticky below NavBar) */}
				<GlobalCharacterHUD />

				{/* Main Content Area - Scrollable */}
				<main
					className={cn(
						"flex-1 overflow-y-auto px-4 py-6 md:py-8 transition-all duration-500",
						className,
					)}
				>
					<div className="container mx-auto max-w-7xl">{children}</div>
				</main>
			</div>
		</div>
	);
}
