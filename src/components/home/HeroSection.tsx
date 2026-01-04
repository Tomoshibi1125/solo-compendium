import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Sword, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { ShadowMonarchLogo } from '@/components/ui/ShadowMonarchLogo';
import { GatePortal } from '@/components/ui/GatePortal';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow-delay-1s" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Shadow particles */}
      {[...Array(8)].map((_, i) => {
        const delay = i * 0.5;
        const top = 20 + Math.random() * 60;
        const left = 10 + Math.random() * 80;
        const size = 4 + Math.random() * 8;
        return (
          <div
            key={i}
            className="shadow-particle"
            style={{
              '--particle-top': `${top}%`,
              '--particle-left': `${left}%`,
              '--particle-delay': `${delay}s`,
              '--particle-size': `${size}px`,
            } as React.CSSProperties & {
              '--particle-top': string;
              '--particle-left': string;
              '--particle-delay': string;
              '--particle-size': string;
            }}
          />
        );
      })}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* System notification */}
          <div className="inline-block mb-8 animate-slide-up">
            <SystemWindow variant="quest" className="px-6 py-2">
              <div className="flex items-center gap-2 text-accent font-heading">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">The Shadow Monarch watches over this world</span>
              </div>
            </SystemWindow>
          </div>

          {/* Shadow Monarch Logo */}
          <div className="flex justify-center mb-8 animate-slide-up-delay-05s">
            <ShadowMonarchLogo size="lg" className="drop-shadow-2xl" />
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up-delay-1s">
            <span className="gradient-text-shadow text-glow-purple">SHADOW MONARCH</span>
            <br />
            <span className="gradient-text-system text-glow">SOLO LEVELING</span>
            <br />
            <span className="text-foreground text-2xl sm:text-3xl lg:text-4xl">5e Compendium</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-heading animate-slide-up-delay-2s">
            In the post-reset timeline, where Jinwoo reigns as the Supreme Deity, 
            awaken your Hunter and navigate the Gates. This System serves as your guide 
            through a world reborn under the Shadow Monarch's watchful gaze.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up-delay-3s">
            <Link to="/characters/new">
              <Button size="lg" className="gap-2 text-lg px-8 font-heading">
                <Users className="w-5 h-5" />
                Create a Hunter
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/compendium">
              <Button variant="outline" size="lg" className="gap-2 text-lg px-8 font-heading">
                <BookOpen className="w-5 h-5" />
                Browse Compendium
              </Button>
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up-delay-4s">
            <FeatureCard
              icon={BookOpen}
              title="Shadow Compendium"
              description="Jobs, Powers, Relics, Monsters, and Monarchs — all knowledge preserved by the System"
              graphic={<GatePortal rank="S" className="w-20 h-20 opacity-20" animated={false} />}
            />
            <FeatureCard
              icon={Users}
              title="Hunter Awakening"
              description="Forge your Reawakened Hunter with the System's guidance"
              graphic={<ShadowMonarchLogo size="md" className="opacity-20" />}
            />
            <FeatureCard
              icon={Sword}
              title="Shadow Monarch's Tools"
              description="Gate generation, encounter building, and combat tracking under the Monarch's domain"
              graphic={<GatePortal rank="A" className="w-20 h-20 opacity-20" animated={false} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  graphic?: React.ReactNode;
}

function FeatureCard({ icon: Icon, title, description, graphic }: FeatureCardProps) {
  return (
    <div className="glass-card p-6 text-left hover:border-primary/30 transition-colors group relative overflow-hidden">
      {/* Background graphic */}
      {graphic && (
        <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
          {graphic}
        </div>
      )}
      
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
