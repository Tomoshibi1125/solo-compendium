import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
	OfflineStatus,
	PWAInstallPrompt,
} from "@/components/pwa/PWAComponents";
import { CosmicBackground } from "@/components/ui/CosmicBackground";
import { OfflineBanner } from "@/components/ui/OfflineBanner";
import { WardenChatbot } from "@/components/warden-protocols/WardenChatbot";
import { useEmbedded } from "@/contexts/EmbeddedContext";
import { useAccessibility } from "@/hooks/useAccessibility";
import { usePWA } from "@/hooks/usePWA";
import { cn } from "@/lib/utils";

interface LayoutProps {
	children?: React.ReactNode;
	className?: string;
}

// Module-level custom hook (must not be defined inside a component)
function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(() =>
		typeof window !== "undefined" ? window.matchMedia(query).matches : false,
	);

	useEffect(() => {
		const media = window.matchMedia(query);
		setMatches(media.matches);
		const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
		if (media.addEventListener) {
			media.addEventListener("change", listener);
		} else {
			(media as MediaQueryList).addListener(listener);
		}
		return () => {
			if (media.removeEventListener) {
				media.removeEventListener("change", listener);
			} else {
				(media as MediaQueryList).removeListener(listener);
			}
		};
	}, [query]);

	return matches;
}

// Derive SA zone from current route
function useSAZone(): string {
	const location = useLocation();
	const path = location.pathname;
	if (
		path.startsWith("/warden-protocols") ||
		path.startsWith("/warden-protocols") ||
		path.startsWith("/admin")
	)
		return "warden";
	if (path.startsWith("/campaigns")) return "campaign";
	if (path.startsWith("/compendium") || path.startsWith("/favorites"))
		return "compendium";
	if (path.startsWith("/player-tools") || path.startsWith("/dice"))
		return "player";
	if (path.startsWith("/characters")) return "character";
	if (path.startsWith("/auth") || path.startsWith("/login")) return "auth";
	if (path.startsWith("/homebrew") || path.startsWith("/marketplace"))
		return "compendium";
	if (path.startsWith("/profile")) return "player";
	return "character"; // default
}

export function Layout({ children, className }: LayoutProps) {
	const embedded = useEmbedded();
	const { reducedMotion, highContrast } = useAccessibility();
	const saZone = useSAZone();
	const {
		isInstallable,
		isInstalled,
		isOnline,
		installPrompt,
		syncQueueLength,
	} = usePWA();

	const isMobile = useMediaQuery("(max-width: 768px)");
	const isTablet = useMediaQuery("(max-width: 1024px)");
	const isDesktop = !isMobile && !isTablet;

	// Responsive layout classes
	const layoutClasses = cn(
		"min-h-dvh bg-background",
		isMobile && "mobile-layout",
		isTablet && "tablet-layout",
		isDesktop && "desktop-layout",
		className,
	);

	useEffect(() => {
		if (typeof document === "undefined") return;
		const root = document.documentElement;
		root.classList.toggle("reduce-motion", reducedMotion);
		root.classList.toggle("high-contrast", highContrast);
	}, [reducedMotion, highContrast]);

	if (embedded) {
		return (
			<div
				className={cn("relative overflow-hidden w-full", className)}
				data-sa-zone={saZone}
			>
				{children || <Outlet />}
			</div>
		);
	}

	return (
		<div
			className={cn(layoutClasses, "relative overflow-hidden")}
			data-sa-zone={saZone}
		>
			{/* Offline connectivity banner */}
			<OfflineBanner />
			{/* Global Cosmic Architecture */}
			<div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
				<CosmicBackground
					variant="shadow"
					intensity="low"
					animated={!reducedMotion}
				/>
			</div>

			<a href="#main-content" className="skip-link">
				Skip to content
			</a>
			<main
				id="main-content"
				tabIndex={-1}
				className={cn("flex-1", isMobile ? "px-4 py-6" : "px-8 py-8")}
			>
				{children || <Outlet />}
			</main>

			{/* PWA Components */}
			<PWAInstallPrompt
				isInstallable={isInstallable}
				isInstalled={isInstalled}
				onInstall={installPrompt}
			/>
			<OfflineStatus
				isOnline={isOnline}
				connectionType="unknown"
				syncQueueLength={syncQueueLength}
			/>

			{saZone === "PW" && <WardenChatbot />}
		</div>
	);
}
