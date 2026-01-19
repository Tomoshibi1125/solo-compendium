import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 landing-hero-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black" />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[140px]" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <OptimizedImage
            src="/ui-art/shadow-soldier-emblem.webp"
            alt="Shadow Soldier Emblem"
            className="h-10 w-10 rounded-full border border-purple-500/60 shadow-lg shadow-purple-500/40"
            size="thumbnail"
          />
          <div className="leading-tight">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-200/70">Solo Compendium</p>
            <p className="font-arise text-lg tracking-widest">The System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" className="border-purple-500/60 text-purple-100 hover:border-purple-400">
              Login
            </Button>
          </Link>
          <Link to="/compendium">
            <Button className="btn-shadow-monarch">Browse Compendium</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-10 lg:flex-row lg:items-center">
          <div className="flex-1">
            <p className="mb-4 text-sm font-display uppercase tracking-[0.3em] text-purple-200/70">
              System status: online
            </p>
            <h1 className="font-arise text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              The System awaits your command.
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Access the complete Solo Leveling compendium. Manage hunters, explore gates, and master the shadows.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/login">
                <Button size="lg" className="btn-shadow-monarch">
                  Enter System
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/compendium">
                <Button size="lg" variant="outline" className="border-purple-500/60 text-purple-100 hover:border-purple-400">
                  Browse Compendium
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600/20 blur-3xl" />
              <OptimizedImage
                src="/ui-art/system-interface.webp"
                alt="System Interface"
                className="relative rounded-lg border border-purple-500/30 shadow-2xl shadow-purple-500/20"
                size="large"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-6 backdrop-blur-sm">
              <h3 className="font-arise text-xl font-semibold text-purple-200">3,218+ Assets</h3>
              <p className="mt-2 text-gray-400">Complete Solo Leveling compendium with monsters, items, spells, and more.</p>
            </div>
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-6 backdrop-blur-sm">
              <h3 className="font-arise text-xl font-semibold text-purple-200">Hunter Management</h3>
              <p className="mt-2 text-gray-400">Create and manage your hunters with full character sheets and progression.</p>
            </div>
            <div className="rounded-lg border border-purple-500/20 bg-purple-950/20 p-6 backdrop-blur-sm">
              <h3 className="font-arise text-xl font-semibold text-purple-200">Gate Exploration</h3>
              <p className="mt-2 text-gray-400">Explore dangerous gates and track your conquests in the shadow realm.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
