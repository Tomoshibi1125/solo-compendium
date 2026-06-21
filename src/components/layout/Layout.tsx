import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useEmbedded } from "../../contexts/EmbeddedContext";
import { useAccessibility } from "../../hooks/useAccessibility";
import { useWardenA } from "../../hooks/usePWA";
import { cn } from "../../lib/utils";
import { OfflineStatus, WardenAInstallPrompt } from "../pwa/PWAComponents";
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

// Derive RA zone from current route
function useRAZone(): string {
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
	const raZone = useRAZone();
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
		"min-h-screen flex flex-col bg-transparent",
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
				data-ra-zone={raZone}
			>
				{children || <Outlet />}
			</div>
		);
	}

	return (
		<div className={cn(layoutClasses, "relative")} data-ra-zone={raZone}>
			{/* Offline connectivity banner */}
			<OfflineBanner />
			{/* Global Cosmic Architecture removed to avoid double rendering with App.tsx */}

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
					// Bottom-nav clearance is owned by MainLayout's <main>; keep the
					// inner padding modest on mobile to avoid excessive dead space.
					!fullBleed && (isMobile ? "px-4 pt-6 pb-6" : "px-8 pt-8 pb-32"),
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

			{raZone === "warden" && <WardenChatbot />}
		</div>
	);
}
