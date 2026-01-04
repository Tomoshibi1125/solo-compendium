import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground font-heading">
              Shadow Monarch's Compendium — In the post-reset world, knowledge is preserved by the System
            </p>
            <p className="text-xs text-muted-foreground">
              Blessed by the Shadow Monarch's domain
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
