import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useEmbedded } from "../../contexts/EmbeddedContext";
import { useAccessibility } from "../../hooks/useAccessibility";
import { useWardenA } from "../../hooks/usePWA";
import { cn } from "../../lib/utils";
import { OfflineStatus, WardenAInstallPrompt } from "../pwa/PWAComponents";
import { OfflineBanner } from "../ui/OfflineBanner";

interface LayoutProps {
	children?: React.ReactNode;
	className?: string;
	/**
	 * When true, removes the default horizontal/vertical padding on <main> so the
	 * page can render a full-viewport experience.
	 */
	fullBleed?: boolean;
}

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

function useRAZone(): string {
	const location = useLocation();
	const path = location.pathname;
	if (path.startsWith("/warden-directives") || path.startsWith("/admin"))
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
	return "character";
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
			<OfflineBanner />
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
					!fullBleed && (isMobile ? "px-4 pt-6 pb-6" : "px-8 pt-8 pb-32"),
					fullBleed && "layout-fullbleed",
				)}
			>
				{children || <Outlet />}
			</main>

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
		</div>
	);
}
