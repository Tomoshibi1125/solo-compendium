import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Users, Sword, Shield, Dice6, Map, Settings, UsersRound, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShadowMonarchLogo } from '@/components/ui/ShadowMonarchLogo';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Compendium', href: '/compendium', icon: BookOpen },
  { name: 'Hunters', href: '/characters', icon: Users },
  { name: 'Campaigns', href: '/campaigns', icon: UsersRound },
  { name: 'System Tools', href: '/dm-tools', icon: Map },
  { name: 'Dice', href: '/dice', icon: Dice6 },
  { name: 'Admin', href: '/admin', icon: Settings },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-t-0 rounded-t-none border-b-shadow-blue/20">
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Shadow Monarch's Seal */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative monarch-presence">
                <ShadowMonarchLogo size="sm" variant="arise" className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="hidden sm:block">
                <span className="font-arise text-lg font-black gradient-text-supreme tracking-widest">
                  SOLO LEVELING
                </span>
                <span className="block text-xs text-muted-foreground font-heading -mt-1 tracking-wide">
                  Shadow Monarch's Domain
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-2xl mx-4">
              {/* Global Search */}
              <div className="flex-1 max-w-md">
                <GlobalSearch />
              </div>
              
              <div className="flex items-center gap-1">
                {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg font-heading text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary text-glow"
                        : "text-muted-foreground hover:text-foreground hover:text-primary/80"
                    )}
                  >
                    <span className="flex items-center gap-2 relative z-10">
                      <item.icon className={cn(
                        "w-4 h-4 transition-all duration-200",
                        isActive && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.7)]"
                      )} />
                      {item.name}
                    </span>
                    {isActive && (
                      <>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
                        <div className="absolute inset-0 bg-primary/5 rounded-lg -z-10" />
                      </>
                    )}
                  </Link>
                );
              })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link to="/characters/new">
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2 btn-shadow-monarch border-shadow-purple/40 hover:border-shadow-purple hover:bg-shadow-purple/10">
                  <Zap className="w-4 h-4" />
                  <span className="font-heading">Awaken Hunter</span>
                </Button>
              </Link>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-shadow-blue/20 animate-slide-up">
              <div className="flex flex-col gap-1">
                {navigation.map((item) => {
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg font-heading transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary shadow-[inset_0_0_10px_hsl(var(--primary)/0.1)]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn(
                        "w-5 h-5",
                        isActive && "drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]"
                      )} />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-shadow-blue/20">
                  <Link to="/characters/new" className="block">
                    <Button className="w-full gap-2 btn-shadow-monarch shadow-monarch">
                      <Zap className="w-4 h-4" />
                      Awaken Hunter
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

