import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Sword } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { CosmicBackground } from '@/components/ui/CosmicBackground';
import { SystemHologram } from '@/components/ui/SystemHologram';
import EnhancedCard from '@/components/ui/EnhancedCard';
import { SystemHeading, SystemText, DataStreamText } from '@/components/ui/SystemText';
import { RiftStatusIndicator } from '@/components/ui/RiftStatusIndicator';
import { SovereignAuthorityDisplay } from '@/components/ui/SovereignAuthorityDisplay';

const Landing = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2500); // 2.5s boot sequence
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-primary/30 selection:text-primary">
      {/* System Initialization Overlay */}
      {isInitializing && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(155,109,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(155,109,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="relative z-10 font-system tracking-widest text-primary drop-shadow-[0_0_10px_currentColor] animate-pulse">
            <h1 className="text-4xl uppercase mb-4 text-center">System Integration</h1>
            <div className="h-1 w-64 bg-primary/20 rounded-full overflow-hidden border border-primary/40 relative">
              <div className="absolute top-0 bottom-0 left-0 bg-primary animate-[shimmer_2s_ease-out_forwards] w-full" style={{ transformOrigin: 'left', animationName: 'progress' }} />
            </div>
            <style>{`
              @keyframes progress {
                0% { transform: scaleX(0); }
                40% { transform: scaleX(0.4); }
                60% { transform: scaleX(0.4); }
                100% { transform: scaleX(1); }
              }
            `}</style>
            <p className="mt-4 text-xs font-mono text-center opacity-70 animate-pulse">Synchronizing magical cores...</p>
          </div>
        </div>
      )}

      {/* System Ascendant Cosmic Background */}
      <CosmicBackground variant="gate" intensity="medium" animated />

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 landing-hero-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-black" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <OptimizedImage
            src="/ui-art/shadow-soldier-emblem.webp"
            alt="Umbral Legionnaire Emblem"
            className="h-10 w-10 rounded-full border border-gate-s/60 shadow-lg shadow-gate-s/40"
            size="thumbnail"
          />
          <div className="leading-tight">
            <SystemText variant="system" size="xs" className="uppercase tracking-[0.2em] opacity-80">
              System Ascendant
            </SystemText>
            <SystemText variant="sovereign" size="lg" dimensional>
              The System
            </SystemText>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="gate-e" className="border-gate-e/60 text-gate-e hover:border-gate-e">
              Login
            </Button>
          </Link>
          <Link to="/compendium">
            <Button variant="arise" className="font-semibold">
              Browse Compendium
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-10 lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="mb-6">
              <DataStreamText variant="system" speed="slow" className="text-sm uppercase tracking-[0.3em] opacity-80">
                System status: online
              </DataStreamText>
            </div>
            <SystemHeading level={1} variant="sovereign" dimensional className="leading-tight">
              The System awaits your command.
            </SystemHeading>
            <SystemText variant="body" size="lg" className="mt-4 text-gray-300">
              Access the complete System Ascendant compendium. Manage ascendants, explore rifts, and master the shadows.
            </SystemText>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/login">
                <Button variant="arise" size="lg" className="font-system tracking-widest uppercase font-bold text-base h-12 hover:shadow-[0_0_40px_hsl(var(--arise-violet)/0.8)] shadow-[0_0_15px_hsl(var(--arise-violet)/0.4)]">
                  Enter System
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/compendium">
                <Button variant="outline" size="lg" className="h-12 border-primary/50 text-primary font-system uppercase tracking-wider backdrop-blur-sm hover:bg-primary/20 hover:text-white shadow-[inset_0_0_10px_hsl(var(--primary)/0.2)]">
                  Browse Compendium
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              {/* System Hologram Display */}
              <SystemHologram
                variant="sovereign"
                title="SYSTEM CORE"
                className="mb-8 relative shadow-[0_0_50px_hsl(var(--primary)/0.2)] group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="space-y-4 font-mono">
                  <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                    <SystemText variant="system" size="sm" className="uppercase tracking-widest text-primary/70">Rift Stability</SystemText>
                    <SystemText variant="gate" size="sm" className="font-bold drop-shadow-[0_0_5px_currentColor]">98.7%</SystemText>
                  </div>
                  <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                    <SystemText variant="system" size="sm" className="uppercase tracking-widest text-primary/70">Authority Level</SystemText>
                    <SystemText variant="sovereign" size="sm" className="font-system font-bold tracking-widest drop-shadow-[0_0_8px_currentColor]">MONARCH</SystemText>
                  </div>
                  <div className="flex justify-between items-center border-b border-primary/20 pb-2">
                    <SystemText variant="system" size="sm" className="uppercase tracking-widest text-primary/70">Active Ascendants</SystemText>
                    <SystemText variant="rift" size="sm" className="font-bold drop-shadow-[0_0_5px_currentColor]">1,247</SystemText>
                  </div>
                </div>
              </SystemHologram>

              {/* Enhanced Image Display */}
              <div className="relative">
                <div className="absolute inset-0 bg-gate-national/20 blur-3xl animate-dimensional-pulse" />
                <OptimizedImage
                  src="/ui-art/system-interface.webp"
                  alt="System Interface"
                  className="relative rounded-lg border border-gate-s/30 shadow-2xl shadow-gate-s/20"
                  size="large"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="grid gap-8 md:grid-cols-3">
            <EnhancedCard
              variant="gate"
              title="3,218+ Assets"
              description="Complete System Ascendant compendium with monsters, items, spells, and more."
              icon={<Sword className="h-6 w-6" />}
              interactive
              onClick={() => {/* Navigate to compendium */ }}
              className="hover:scale-[1.03] transition-all duration-300"
            />
            <EnhancedCard
              variant="sovereign"
              title="Ascendant Management"
              description="Create and manage your ascendants with full character sheets and progression."
              icon={<Shield className="h-6 w-6" />}
              interactive
              onClick={() => {/* Navigate to characters */ }}
              className="hover:scale-[1.03] transition-all duration-300"
            />
            <EnhancedCard
              variant="rift"
              title="Rift Exploration"
              description="Explore dangerous rifts and track your conquests in the shadow realm."
              icon={<Zap className="h-6 w-6" />}
              interactive
              onClick={() => {/* Navigate to campaigns */ }}
              className="hover:scale-[1.03] transition-all duration-300"
            />
          </div>
        </section>

        {/* Sovereign Authority Showcase */}
        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="text-center mb-12">
            <SystemHeading level={2} variant="sovereign" dimensional>
              Experience True Power
            </SystemHeading>
            <SystemText variant="body" size="lg" className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Ascend to sovereignty, master dimensional rifts, and command the shadows in the ultimate tabletop RPG experience.
            </SystemText>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Rift Status Display */}
            <div className="space-y-4">
              <SystemHeading level={3} variant="gate" className="text-center">
                Dimensional Control
              </SystemHeading>
              <RiftStatusIndicator
                stability={87}
                tier="s"
                coordinates={{
                  x: 42.7,
                  y: -13.8,
                  z: 8.2,
                  dimension: 'SHADOW PRIME'
                }}
                showCoordinates
                className="w-full"
              />
            </div>

            {/* Sovereign Authority Display */}
            <div className="space-y-4">
              <SystemHeading level={3} variant="sovereign" className="text-center">
                Sovereign Dominion
              </SystemHeading>
              <SovereignAuthorityDisplay
                authority={94}
                tier="monarch"
                domain="UMBRAL EMPIRE"
                decrees={47}
                vassals={128}
                className="w-full"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <SystemText variant="system" size="sm" className="mb-6 opacity-80">
              Join the ranks of sovereigns and rift masters
            </SystemText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button variant="monarch" size="lg" className="font-semibold px-8">
                  Claim Your Sovereignty
                </Button>
              </Link>
              <Link to="/compendium">
                <Button variant="gate-national" size="lg" className="border-gate-national/60 text-gate-national hover:border-gate-national px-8">
                  Explore the System
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;




