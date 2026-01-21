import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/authContext';
import { useAccessibility } from '@/hooks/useAccessibility';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  const { user, signOut } = useAuth();
  const { reducedMotion, highContrast } = useAccessibility();

  // Complete responsive design system
  const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);
    
    useEffect(() => {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      
      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };
      
      if (media.addEventListener) {
        media.addEventListener('change', listener);
      } else {
        media.addListener(listener);
      }
      
      return () => {
        if (media.removeEventListener) {
          media.removeEventListener('change', listener);
        } else {
          media.removeListener(listener);
        }
      };
    }, [query]);
    
    return matches;
  };
  
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
    <div className={layoutClasses}>
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
    </div>
  );
}
