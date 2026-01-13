import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => {
      try {
        setIsLoading(false);
      } catch (error) {
        console.error("Error setting loading state:", error);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
  
  // Accessibility features
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check for user preferences
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setIsHighContrast(highContrastQuery.matches);
    setReducedMotion(motionQuery.matches);
  }, []);

  if (isLoading) {
    return (
      <div className={layoutClasses}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={layoutClasses}>
      <Header />
      <main className={cn(
        "flex-1",
        isMobile ? "px-4 py-6" : "px-8 py-8"
      )}>
        {children || <Outlet />}
      </main>
    </div>
  );
}
