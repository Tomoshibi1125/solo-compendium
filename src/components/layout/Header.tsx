import React from 'react';
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
  Heart
} from 'lucide-react';
import { SystemSigilLogo } from '@/components/ui/SystemSigilLogo';
import { logger } from '@/lib/logger';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { cn } from '@/lib/utils';

interface HeaderProps {
  user?: any;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navLinkClass = (path: string) =>
    cn(
      "transition-colors hover:text-foreground/80",
      isActive(path) ? "text-foreground" : "text-foreground/60"
    );

  const handleLogout = () => {
    try {
      onLogout?.();
      navigate('/login');
    } catch (error) {
      logger.error('Error in navigation:', error);
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <SystemSigilLogo className="h-8 w-8" />
          <span className="hidden font-bold sm:inline-block">
            System Ascendant
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            to="/player-tools"
            className={navLinkClass("/player-tools")}
            aria-current={isActive("/player-tools") ? "page" : undefined}
          >
            Player Tools
          </Link>
          <Link
            to="/characters"
            className={navLinkClass("/characters")}
            aria-current={isActive("/characters") ? "page" : undefined}
          >
            Ascendants
          </Link>
          <Link
            to="/compendium"
            className={navLinkClass("/compendium")}
            aria-current={isActive("/compendium") ? "page" : undefined}
          >
            Compendium
          </Link>
          <Link
            to="/campaigns"
            className={navLinkClass("/campaigns")}
            aria-current={isActive("/campaigns") ? "page" : undefined}
          >
            Campaigns
          </Link>
          <Link
            to="/dm-tools"
            className={navLinkClass("/dm-tools")}
            aria-current={isActive("/dm-tools") ? "page" : undefined}
          >
            Warden Tools
          </Link>
          <Link
            to="/dice"
            className={cn(navLinkClass("/dice"), "flex items-center gap-1")}
            aria-current={isActive("/dice") ? "page" : undefined}
          >
            <Dice6 className="h-4 w-4" />
            Dice
          </Link>
          <Link
            to="/favorites"
            className={cn(navLinkClass("/favorites"), "flex items-center gap-1")}
            aria-current={isActive("/favorites") ? "page" : undefined}
          >
            <Heart className="h-4 w-4" />
            Favorites
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Global Search */}
          <GlobalSearch className="w-80" />

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-3 w-3 rounded-full p-0" aria-label="Unread notifications" />
          </div>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.email?.split('@')[0] || 'User'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name || 'User'}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}



