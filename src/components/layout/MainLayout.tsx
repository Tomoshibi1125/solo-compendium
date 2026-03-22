import type { ReactNode } from "react";
import { MobileHUD } from "@/components/CharacterSheet/MobileHUD";
import { GlobalCharacterHUD } from "@/components/navigation/GlobalCharacterHUD";
import { NavBar } from "@/components/navigation/NavBar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
	children: ReactNode;
	className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
	return (
		<div className="min-h-dvh flex flex-col bg-background selection:bg-primary/30">
			{/* Global Top Navigation */}
			<NavBar />

			{/* Persistent Character HUD (Desktop: Top, Mobile: Sticky) */}
			<GlobalCharacterHUD />

			{/* Main Content Area */}
			<main
				className={cn("flex-1 container mx-auto px-4 py-6 md:py-8", className)}
			>
				{children}
			</main>

			{/* Mobile Sticky Footer HUD (Visible only on mobile) */}
			<MobileHUD />

			{/* Spacer for sticky footer on mobile */}
			<div className="h-16 md:hidden pointer-events-none" />
		</div>
	);
}
