import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Skip to main content link - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Supreme Deity's Domain - Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Primary shadow orbs - Responsive sizing */}
        <div className="absolute top-1/4 left-1/5 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-radial from-shadow-blue/6 via-shadow-purple/3 to-transparent rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-gradient-radial from-arise-violet/5 via-shadow-purple/2 to-transparent rounded-full blur-3xl animate-pulse-glow-delay-1s" />
        <div className="absolute top-1/2 right-1/3 w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] md:w-[280px] md:h-[280px] lg:w-[350px] lg:h-[350px] bg-gradient-radial from-shadow-purple/4 via-transparent to-transparent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        
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
      <main id="main-content" className="flex-1 pt-16 sm:pt-16 relative z-10 overflow-x-hidden" tabIndex={-1}>
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
      
      {/* Footer - The System's signature */}
      <footer className="border-t border-shadow-blue/20 bg-card/60 backdrop-blur-xl relative z-10 w-full">
        <div className="container mx-auto px-4 py-6 max-w-full">
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

