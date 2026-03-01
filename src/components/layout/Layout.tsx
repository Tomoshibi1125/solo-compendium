import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/authContext';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePWA } from '@/hooks/usePWA';
import { PWAInstallPrompt, OfflineStatus } from '@/components/pwa/PWAComponents';
import { WardenChatbot } from '@/components/dm-tools/WardenChatbot';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

// Module-level custom hook (must not be defined inside a component)
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      (media as MediaQueryList).addListener(listener);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
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
  if (path.startsWith('/dm-tools') || path.startsWith('/admin')) return 'dm';
  if (path.startsWith('/campaigns')) return 'campaign';
  if (path.startsWith('/compendium') || path.startsWith('/favorites')) return 'compendium';
  if (path.startsWith('/player-tools') || path.startsWith('/dice')) return 'player';
  if (path.startsWith('/characters')) return 'character';
  if (path.startsWith('/auth') || path.startsWith('/login')) return 'auth';
  if (path.startsWith('/homebrew') || path.startsWith('/marketplace')) return 'compendium';
  if (path.startsWith('/profile')) return 'player';
  return 'character'; // default
}

export function Layout({ children, className }: LayoutProps) {
  const { user, signOut } = useAuth();
  const { reducedMotion, highContrast } = useAccessibility();
  const saZone = useSAZone();
  const { isInstallable, isInstalled, isOnline, installPrompt, syncQueueLength } = usePWA();

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isDesktop = !isMobile && !isTablet;

  // Responsive layout classes
  const layoutClasses = cn(
    'min-h-screen bg-background',
    isMobile && 'mobile-layout',
    isTablet && 'tablet-layout',
    isDesktop && 'desktop-layout',
    className
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('reduce-motion', reducedMotion);
    root.classList.toggle('high-contrast', highContrast);
  }, [reducedMotion, highContrast]);

  return (
    <div className={cn(layoutClasses, "relative overflow-hidden")} data-sa-zone={saZone}>
      {/* Offline connectivity banner */}
      <OfflineBanner />
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        {!reducedMotion && (
          <>
            <div className="absolute inset-0 hex-grid-overlay opacity-[0.03]" />
            <div className="absolute inset-0 data-rain-overlay opacity-[0.02]" />
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-amethyst-purple/5 to-transparent" />
          </>
        )}
      </div>

      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header
        user={
          user
            ? {
              email: user.email,
              name: user.displayName ?? user.email?.split('@')[0] ?? 'User',
              avatar: user.avatar,
            }
            : undefined
        }
        onLogout={() => {
          void signOut();
        }}
      />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          "flex-1",
          isMobile ? "px-4 py-6" : "px-8 py-8"
        )}
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

      {saZone === 'dm' && <WardenChatbot />}
    </div>
  );
}
