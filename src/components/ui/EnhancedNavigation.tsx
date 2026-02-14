import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  BookOpen,
  Dices,
  Crown,
  Map,
  Compass,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  requiresDM?: boolean;
  external?: boolean;
}

const EnhancedNavigation = () => {
  const { user, signOut, isDM, isPlayer } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for mobile navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items based on user role
  const getNavigationItems = (): NavigationItem[] => {
    const commonItems = [
      {
        title: 'Dashboard',
        href: '/player-tools',
        icon: Home,
        description: 'Main dashboard'
      },
      {
        title: 'Compendium',
        href: '/compendium',
        icon: BookOpen,
        description: 'Browse rules and content'
      },
      {
        title: 'Dice Roller',
        href: '/dice',
        icon: Dices,
        description: 'Roll dice with modifiers'
      }
    ];

    const playerItems = [
      ...commonItems,
      {
        title: 'Characters',
        href: '/characters',
        icon: Users,
        badge: 'Manage',
        description: 'Create and manage characters'
      }
    ];

    const dmItems = [
      {
        title: 'DM Tools',
        href: '/dm-tools',
        icon: Shield,
        badge: 'Pro',
        description: 'Complete DM toolkit'
      },
      {
        title: 'Campaigns',
        href: '/campaigns',
        icon: Map,
        description: 'Manage campaigns'
      },
      {
        title: 'Encounter Builder',
        href: '/dm-tools/encounter-builder',
        icon: Compass,
        description: 'Create encounters'
      },
      {
        title: 'Relic Workshop',
        href: '/dm-tools/relic-workshop',
        icon: Sparkles,
        description: 'Forge powerful relics'
      },
      ...commonItems
    ];

    if (isDM()) return dmItems;
    if (isPlayer()) return playerItems;
    return commonItems;
  };

  const navigationItems = getNavigationItems();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 transition-all duration-300",
      isScrolled && "shadow-lg"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group transition-transform hover:scale-105"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:from-primary/90 group-hover:to-primary transition-all duration-300">
              <Crown className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                System Ascendant
              </h1>
              <p className="text-xs text-muted-foreground">
                5e SRD Companion
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              const isDisabled = item.requiresDM && !isDM();

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-primary/20">
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isDM() && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center">
                        <Shield className="h-2 w-2 text-destructive-foreground" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 border-b border-border">
                    <p className="text-sm font-medium text-foreground">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    {isDM() && (
                      <Badge variant="secondary" className="mt-1 w-fit">
                        Protocol Warden
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/characters" className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Characters</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-md">
          <div className="flex flex-col p-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              const isDisabled = item.requiresDM && !isDM();

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 w-full",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 flex-shrink-0">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default EnhancedNavigation;
