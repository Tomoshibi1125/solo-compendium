import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User, 
  Dice6,
  Heart,
  Menu,
  X,
  Swords,
  BookOpen,
  Users,
  FlaskConical,
  Store,
  Shield,
  Sparkles
} from 'lucide-react';
import { SystemSigilLogo } from '@/components/ui/SystemSigilLogo';
import { logger } from '@/lib/logger';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { cn } from '@/lib/utils';

type HeaderUser = {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
};

interface HeaderProps {
  user?: HeaderUser;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navLinkClass = (path: string) =>
    cn(
      "transition-colors hover:text-foreground/80",
      isActive(path) ? "text-foreground" : "text-foreground/60"
    );

  const mobileNavLinkClass = (path: string) =>
    cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[48px]",
      isActive(path)
        ? "bg-primary/10 text-primary border border-primary/20"
        : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
    );

  const handleLogout = () => {
    try {
      onLogout?.();
      navigate('/login');
    } catch (error) {
      logger.error('Error in navigation:', error);
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 min-h-[44px]" onClick={closeMobileMenu}>
            <SystemSigilLogo className="h-7 w-7 sm:h-8 sm:w-8" />
            <span className="hidden font-bold sm:inline-block text-sm">
              System Ascendant
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-5 text-sm font-medium">
            <Link to="/characters" className={navLinkClass("/characters")} aria-current={isActive("/characters") ? "page" : undefined}>Ascendants</Link>
            <Link to="/compendium" className={navLinkClass("/compendium")} aria-current={isActive("/compendium") ? "page" : undefined}>Compendium</Link>
            <Link to="/campaigns" className={navLinkClass("/campaigns")} aria-current={isActive("/campaigns") ? "page" : undefined}>Campaigns</Link>
            <Link to="/player-tools" className={navLinkClass("/player-tools")} aria-current={isActive("/player-tools") ? "page" : undefined}>Player Tools</Link>
            <Link to="/dm-tools" className={navLinkClass("/dm-tools")} aria-current={isActive("/dm-tools") ? "page" : undefined}>Warden Tools</Link>
            <Link to="/dice" className={cn(navLinkClass("/dice"), "flex items-center gap-1")} aria-current={isActive("/dice") ? "page" : undefined}>
              <Dice6 className="h-4 w-4" />Dice
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search - responsive width */}
            <GlobalSearch className="hidden sm:block w-48 lg:w-64 xl:w-80" />

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full min-h-[44px] min-w-[44px]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {(user.name || user.email?.split('@')[0] || 'U').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name || 'User'}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} size="sm" className="min-h-[44px]">
                Sign In
              </Button>
            )}

            {/* Mobile Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden min-h-[44px] min-w-[44px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          {/* Drawer */}
          <nav className="fixed top-14 right-0 bottom-0 w-72 sm:w-80 bg-background border-l border-border overflow-y-auto p-4 space-y-1 animate-in slide-in-from-right duration-200">
            {/* Mobile Search */}
            <div className="mb-4 sm:hidden">
              <GlobalSearch className="w-full" />
            </div>

            <Link to="/characters" className={mobileNavLinkClass("/characters")} onClick={closeMobileMenu}>
              <Swords className="h-4 w-4 flex-shrink-0" />Ascendants
            </Link>
            <Link to="/compendium" className={mobileNavLinkClass("/compendium")} onClick={closeMobileMenu}>
              <BookOpen className="h-4 w-4 flex-shrink-0" />Compendium
            </Link>
            <Link to="/campaigns" className={mobileNavLinkClass("/campaigns")} onClick={closeMobileMenu}>
              <Users className="h-4 w-4 flex-shrink-0" />Campaigns
            </Link>
            <Link to="/player-tools" className={mobileNavLinkClass("/player-tools")} onClick={closeMobileMenu}>
              <Sparkles className="h-4 w-4 flex-shrink-0" />Player Tools
            </Link>
            <Link to="/dm-tools" className={mobileNavLinkClass("/dm-tools")} onClick={closeMobileMenu}>
              <Shield className="h-4 w-4 flex-shrink-0" />Warden Tools
            </Link>

            <div className="h-px bg-border my-3" />

            <Link to="/dice" className={mobileNavLinkClass("/dice")} onClick={closeMobileMenu}>
              <Dice6 className="h-4 w-4 flex-shrink-0" />Dice Roller
            </Link>
            <Link to="/favorites" className={mobileNavLinkClass("/favorites")} onClick={closeMobileMenu}>
              <Heart className="h-4 w-4 flex-shrink-0" />Favorites
            </Link>
            <Link to="/homebrew" className={mobileNavLinkClass("/homebrew")} onClick={closeMobileMenu}>
              <FlaskConical className="h-4 w-4 flex-shrink-0" />Homebrew
            </Link>
            <Link to="/marketplace" className={mobileNavLinkClass("/marketplace")} onClick={closeMobileMenu}>
              <Store className="h-4 w-4 flex-shrink-0" />Marketplace
            </Link>

            {user && (
              <>
                <div className="h-px bg-border my-3" />
                <Link to="/profile" className={mobileNavLinkClass("/profile")} onClick={closeMobileMenu}>
                  <User className="h-4 w-4 flex-shrink-0" />Profile & Settings
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}



