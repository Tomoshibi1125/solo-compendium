import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Skip to main content link - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Supreme Deity's Domain - Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Primary shadow orbs */}
        <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-gradient-radial from-shadow-blue/6 via-shadow-purple/3 to-transparent rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-arise-violet/5 via-shadow-purple/2 to-transparent rounded-full blur-3xl animate-pulse-glow-delay-1s" />
        <div className="absolute top-1/2 right-1/3 w-[350px] h-[350px] bg-gradient-radial from-shadow-purple/4 via-transparent to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
        {/* Subtle grid pattern - System interface */}
        <div 
          className="absolute inset-0 opacity-[0.012]" 
          style={{
            backgroundImage: `linear-gradient(hsl(var(--shadow-blue)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--shadow-blue)) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} 
        />
      </div>
      
      <Header />
      <main id="main-content" className="flex-1 pt-16 relative z-10" tabIndex={-1}>
        {children}
      </main>
      
      {/* Footer - The System's signature */}
      <footer className="border-t border-shadow-blue/20 bg-card/60 backdrop-blur-xl relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-heading">
              <span className="text-shadow-purple">Shadow Monarch's Compendium</span> — In the post-reset world, knowledge is preserved by the <span className="text-primary">System</span>
            </p>
            <p className="text-xs text-muted-foreground font-display tracking-widest">
              BLESSED BY THE <span className="gradient-text-monarch">SHADOW MONARCH'S</span> DOMAIN
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

