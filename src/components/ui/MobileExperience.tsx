import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Home,
  Search,
  Filter,
  Plus,
  Minus,
  Maximize2,
  Heart,
  Share,
  Download
} from 'lucide-react';

interface MobileExperienceProps {
  children: React.ReactNode;
  enableGestures?: boolean;
  enableHaptics?: boolean;
  enableOfflineMode?: boolean;
  enableReducedMotion?: boolean;
  customBreakpoints?: Record<string, number>;
}

interface TouchGesture {
  type: 'swipe' | 'pinch' | 'longPress' | 'doubleTap' | 'drag';
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  velocity?: { x: number; y: number };
}

interface HapticFeedback {
  type: 'light' | 'medium' | 'heavy';
  duration?: number;
}

const MobileExperience: React.FC<MobileExperienceProps> = ({
  children,
  enableGestures = true,
  enableHaptics = true,
  enableOfflineMode = false,
  enableReducedMotion = false,
  customBreakpoints
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [gestures, setGestures] = useState<TouchGesture[]>([]);

  // Default breakpoints
  const defaultBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  };

  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      return window.innerWidth < (breakpoints.md || 768);
    };

    setIsMobile(checkMobile());
    
    // Detect offline status
    const handleOffline = () => setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    // Set initial offline status
    setIsOffline(!navigator.onLine);
  }, [breakpoints, enableOfflineMode]);

  // Touch gesture handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (touch && touchStart) {
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const duration = Date.now() - (touchStart.timestamp || Date.now());
      const velocity = distance / duration;

      // Determine gesture type
      let gestureType: TouchGesture['type'] = 'tap';
      let direction: TouchGesture['direction'] | undefined;

      if (duration > 100 && distance > 10) {
        gestureType = 'swipe';
        direction = deltaX > 0 ? 'right' : deltaX < 0 ? 'left' : 'up';
      } else if (duration > 300 && distance > 50) {
        gestureType = 'longPress';
      } else if (duration < 300 && distance > 5) {
        gestureType = 'doubleTap';
      }

      const gesture: TouchGesture = {
        type: gestureType,
        direction,
        distance,
        velocity,
        timestamp: new Date()
      };

      setGestures(prev => [...prev.slice(-9), gesture]);
      setTouchStart(null);
    }
  }, [touchStart]);

  // Haptic feedback
  const triggerHaptic = useCallback((type: HapticFeedback['type'], duration = 100) => {
    if ('vibrate' in navigator && enableHaptics) {
      navigator.vibrate(duration);
    }
  }, [enableHaptics]);

  // Swipe actions
  const handleSwipe = useCallback((direction: TouchGesture['direction']) => {
    triggerHaptic('light', 50);
    
    // Handle swipe actions based on direction
    switch (direction) {
      case 'left':
        console.log('Swipe left detected');
        break;
      case 'right':
        console.log('Swipe right detected');
        break;
      case 'up':
        console.log('Swipe up detected');
        break;
      case 'down':
        console.log('Swipe down detected');
        break;
    }
  }, []);

  // Mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, [isMenuOpen]);

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter functionality
  const toggleFilter = useCallback((filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }, []);

  // Responsive utilities
  const useResponsive = () => {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getBreakpoint = useCallback(() => {
    const width = windowSize.width;
    
    for (const [name, value] of Object.entries(breakpoints)) {
      if (width >= value) {
        return name;
      }
    }
    return 'xs';
  }, [windowSize, breakpoints]);

  const isCurrentBreakpoint = useCallback((breakpoint: string) => {
    return getBreakpoint() === breakpoint;
  }, [getBreakpoint]);

  // Pull-to-refresh functionality
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const handlePullStart = useCallback((e: React.TouchEvent) => {
    setIsRefreshing(true);
    setPullDistance(0);
  }, []);

  const handlePullMove = useCallback((e: React.TouchEvent) => {
    if (touchStart) {
      const distance = e.touches[0].clientY - touchStart.y;
      setPullDistance(Math.abs(distance));
    }
  }, [touchStart]);

  const handlePullEnd = useCallback((e: React.TouchEvent) => {
    if (pullDistance > 100) {
      // Trigger refresh
      window.location.reload();
    }
    setIsRefreshing(false);
    setPullDistance(0);
  }, []);

  // Apply mobile optimizations
  useEffect(() => {
    if (enableReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }

    if (enableOfflineMode && isOffline) {
      document.documentElement.classList.add('offline-mode');
    } else {
      document.documentElement.classList.remove('offline-mode');
    }
  }, [enableReducedMotion, enableOfflineMode, isOffline]);

  return (
    <div className={cn(
      'mobile-experience',
      isMobile && 'mobile-device',
      isOffline && 'offline-mode',
      enableReducedMotion && 'reduce-motion'
    )}>
      {/* Mobile Header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-muted-foreground"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-lg font-semibold text-foreground">System Ascendant</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="fixed inset-0 top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-md">
                <nav className="flex flex-col p-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
                  <div className="space-y-1">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="absolute top-2 right-2 p-2 text-muted-foreground"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <a href="#main-content" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                      Home
                    </a>
                    <a href="#navigation" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                      Navigation
                    </a>
                    <a href="#characters" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
                      Characters
                    </a>
                  </div>
                </nav>
              </div>
            )}
          </header>
      )}

      {/* Pull-to-refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
            <span className="text-sm">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main 
        id="main-content"
        className={cn(
          "flex-1",
          isMobile ? "pt-20" : "pt-16"
        )}
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/40">
          <div className="flex items-center justify-around p-2">
            <button className="p-2 text-muted-foreground">
              <Home className="h-5 w-5" />
            </button>
            <button className="p-2 text-muted-foreground">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-muted-foreground">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileExperience;
