import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useEmbedded } from "../../contexts/EmbeddedContext";
import { useAccessibility } from "../../hooks/useAccessibility";
import { useWardenA } from "../../hooks/usePWA";
import { cn } from "../../lib/utils";
import { OfflineStatus, WardenAInstallPrompt } from "../pwa/PWAComponents";
import { CosmicBackground } from "../ui/CosmicBackground";
import { OfflineBanner } from "../ui/OfflineBanner";
import { WardenChatbot } from "../warden-directives/WardenChatbot";

interface LayoutProps {
	children?: React.ReactNode;
	className?: string;
	/**
	 * When true, removes the default horizontal/vertical padding on <main> so the
	 * page can render a full-viewport experience (used by VTT canvas pages).
	 */
	fullBleed?: boolean;
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
		path.startsWith("/warden-directives") ||
		path.startsWith("/warden-directives") ||
		path.startsWith("/admin")
	)
		return "warden";
	if (path.startsWith("/campaigns")) return "campaign";
	if (path.startsWith("/compendium") || path.startsWith("/favorites"))
		return "compendium";
	if (path.startsWith("/ascendant-tools") || path.startsWith("/dice"))
		return "player";
	if (path.startsWith("/characters")) return "character";
	if (path.startsWith("/auth") || path.startsWith("/login")) return "auth";
	if (path.startsWith("/homebrew") || path.startsWith("/marketplace"))
		return "compendium";
	if (path.startsWith("/profile")) return "player";
	return "character"; // default
}

export function Layout({ children, className, fullBleed }: LayoutProps) {
	const embedded = useEmbedded();
	const { reducedMotion, highContrast } = useAccessibility();
	const saZone = useSAZone();
	const {
		isInstallable,
		isInstalled,
		isOnline,
		installPrompt,
		syncQueueLength,
	} = useWardenA();

	const isMobile = useMediaQuery("(max-width: 768px)");
	const isTablet = useMediaQuery("(max-width: 1024px)");
	const isDesktop = !isMobile && !isTablet;

	// Responsive layout classes
	const layoutClasses = cn(
		"min-h-screen flex flex-col bg-background",
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
		<div className={cn(layoutClasses, "relative")} data-sa-zone={saZone}>
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

			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-background focus:text-foreground top-0 left-0"
			>
				Skip to content
			</a>
			<main
				id="main-content"
				tabIndex={-1}
				className={cn(
					"flex-1",
					!fullBleed && (isMobile ? "px-4 pt-6 pb-32" : "px-8 pt-8 pb-32"),
					fullBleed && "vtt-fullbleed",
				)}
			>
				{children || <Outlet />}
			</main>

			{/* WardenA Components */}
			<WardenAInstallPrompt
				isInstallable={isInstallable}
				isInstalled={isInstalled}
				onInstall={installPrompt}
			/>
			<OfflineStatus
				isOnline={isOnline}
				connectionType="unknown"
				syncQueueLength={syncQueueLength}
			/>

			{saZone === "warden" && <WardenChatbot />}
		</div>
	);
}
