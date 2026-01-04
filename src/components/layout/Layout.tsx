import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>
      
      <Header />
      <main className="flex-1 pt-16 relative z-10">
        {children}
      </main>
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-heading">
              <span className="text-shadow-energy">Shadow Monarch's Compendium</span> — In the post-reset world, knowledge is preserved by the System
            </p>
            <p className="text-xs text-muted-foreground font-display">
              Blessed by the <span className="text-hunter-gold">Shadow Monarch's</span> domain
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
