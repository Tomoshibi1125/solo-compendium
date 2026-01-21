import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Sword, Sparkles, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { SystemSigilLogo } from '@/components/ui/SystemSigilLogo';
import { GatePortal } from '@/components/ui/GatePortal';
import { MONARCH_LABEL_PLURAL } from '@/lib/vernacular';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* High Detail Painterly System Ascendant Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image with painterly System Ascendant style */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              "image-set(url('/ui/landing-page-hero.avif') type('image/avif'), url('/ui/landing-page-hero.webp') type('image/webp'))",
            filter: 'brightness(0.3) saturate(1.2) contrast(1.1)',
          }}
        />
        {/* Overlay gradient for System Ascendant dark fantasy aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-b from-void-black/90 via-shadow-deep/80 to-void-black/90" />
        
        {/* Primary shadow energy orbs */}
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-radial from-shadow-blue/15 via-shadow-purple/8 to-transparent rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] bg-gradient-radial from-arise-violet/12 via-shadow-purple/6 to-transparent rounded-full blur-3xl animate-pulse-glow-delay-1s" />
        
        {/* Central divine presence */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-radial from-primary/8 via-shadow-purple/4 to-transparent rounded-full" />
        
        {/* Subtle grid overlay - System interface */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(hsl(var(--shadow-blue)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--shadow-blue)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Shadow particles - Ascend effect */}
      {[...Array(12)].map((_, i) => {
        const delay = i * 0.4;
        const top = 15 + Math.random() * 70;
        const left = 5 + Math.random() * 90;
        const size = 4 + Math.random() * 10;
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
          {/* System notification - Prime Architect's blessing */}
          <div className="inline-block mb-8 animate-slide-up">
            <SystemWindow variant="quest" className="px-6 py-2">
              <div className="flex items-center gap-2 text-accent font-heading">
                <Crown className="w-4 h-4" />
                <span className="text-sm tracking-wide">The Prime Architect reigns</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </SystemWindow>
          </div>

          {/* Prime Architect Logo - Supreme variant */}
          <div className="flex justify-center mb-8 animate-slide-up-delay-05s">
            <SystemSigilLogo size="xl" variant="supreme" className="drop-shadow-2xl" />
          </div>

          {/* Main heading - "ASCEND" */}
          <h1 className="font-arise text-5xl sm:text-6xl lg:text-7xl font-black mb-6 animate-slide-up-delay-1s">
            <span className="gradient-text-arise text-glow-arise block mb-2">ASCEND</span>
            <span className="gradient-text-shadow text-glow-purple">UMBRAL ASCENDANT</span>
            <br />
            <span className="gradient-text-system text-glow">SYSTEM ASCENDANT</span>
            <br />
            <span className="text-foreground/90 text-2xl sm:text-3xl lg:text-4xl font-display tracking-widest mt-4 block">
              5e Compendium
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-heading animate-slide-up-delay-2s leading-relaxed">
            In the post-reset timeline, where <span className="text-primary font-semibold">the Prime Architect</span> reigns, 
            awaken your Ascendant and navigate the Rifts. This System serves as your guide 
            through a world reborn under the <span className="text-shadow-purple font-semibold">Prime Architect's</span> eternal watchful gaze.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up-delay-3s">
            <Link to="/characters/new">
              <Button size="lg" className="gap-2 text-lg px-8 font-heading btn-umbral umbral-glow">
                <Zap className="w-5 h-5" />
                Awaken an Ascendant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/compendium">
              <Button variant="outline" size="lg" className="gap-2 text-lg px-8 font-heading border-shadow-purple/50 hover:border-shadow-purple hover:bg-shadow-purple/10">
                <BookOpen className="w-5 h-5" />
                Browse Compendium
              </Button>
            </Link>
          </div>

          {/* Feature cards - The System's Domain */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up-delay-4s">
            <FeatureCard
              icon={BookOpen}
              title="System Compendium"
              description={`Jobs, Powers, Relics, Monsters, and ${MONARCH_LABEL_PLURAL} - all knowledge preserved by the System`}
              graphic={<GatePortal rank="S" className="w-20 h-20 opacity-30" animated={false} />}
              accentColor="shadow-blue"
            />
            <FeatureCard
              icon={Users}
              title="Ascendant Awakening"
              description="Forge your Reawakened Ascendant with the System's divine guidance"
              graphic={<SystemSigilLogo size="md" className="opacity-30" />}
              accentColor="arise-violet"
            />
            <FeatureCard
              icon={Sword}
              title="The System's Tools"
              description="Rift generation, encounter building, and combat tracking under the System's domain"
              graphic={<GatePortal rank="SS" className="w-20 h-20 opacity-30" animated={false} />}
              accentColor="monarch-gold"
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
  accentColor?: 'shadow-blue' | 'arise-violet' | 'monarch-gold';
}

function FeatureCard({ icon: Icon, title, description, graphic, accentColor = 'shadow-blue' }: FeatureCardProps) {
  const accentClasses = {
    'shadow-blue': 'group-hover:border-shadow-blue/40 group-hover:shadow-[0_0_20px_hsl(var(--shadow-blue)/0.15)]',
    'arise-violet': 'group-hover:border-arise-violet/40 group-hover:shadow-[0_0_20px_hsl(var(--arise-violet)/0.15)]',
    'monarch-gold': 'group-hover:border-monarch-gold/40 group-hover:shadow-[0_0_20px_hsl(var(--monarch-gold)/0.15)]',
  };

  const iconAccent = {
    'shadow-blue': 'text-shadow-blue group-hover:drop-shadow-[0_0_8px_hsl(var(--shadow-blue)/0.5)]',
    'arise-violet': 'text-arise-violet group-hover:drop-shadow-[0_0_8px_hsl(var(--arise-violet)/0.5)]',
    'monarch-gold': 'text-monarch-gold group-hover:drop-shadow-[0_0_8px_hsl(var(--monarch-gold)/0.5)]',
  };

  return (
    <div className={`glass-card p-6 text-left transition-all duration-300 group relative overflow-hidden ${accentClasses[accentColor]}`}>
      {/* Background graphic */}
      {graphic && (
        <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-25 transition-opacity duration-300">
          {graphic}
        </div>
      )}
      
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className={`w-5 h-5 transition-all ${iconAccent[accentColor]}`} />
        </div>
        <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-foreground transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}



