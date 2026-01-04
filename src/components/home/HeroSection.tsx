import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Sword, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      {/* Shadow particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="shadow-particle"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 0.5}s`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
          }}
        />
      ))}

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

          {/* Main heading */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="gradient-text-shadow text-glow-purple">SHADOW MONARCH</span>
            <br />
            <span className="gradient-text-system text-glow">SOLO LEVELING</span>
            <br />
            <span className="text-foreground text-2xl sm:text-3xl lg:text-4xl">5e Compendium</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-heading animate-slide-up" style={{ animationDelay: '0.2s' }}>
            In the post-reset timeline, where Jinwoo reigns as the Supreme Deity, 
            awaken your Hunter and navigate the Gates. This System serves as your guide 
            through a world reborn under the Shadow Monarch's watchful gaze.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="gap-2 text-lg px-8 font-heading">
              <Users className="w-5 h-5" />
              Create a Hunter
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link to="/compendium">
              <Button variant="outline" size="lg" className="gap-2 text-lg px-8 font-heading">
                <BookOpen className="w-5 h-5" />
                Browse Compendium
              </Button>
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <FeatureCard
              icon={BookOpen}
              title="Shadow Compendium"
              description="Jobs, Powers, Relics, Monsters, and Monarchs — all knowledge preserved by the System"
            />
            <FeatureCard
              icon={Users}
              title="Hunter Awakening"
              description="Forge your Reawakened Hunter with the System's guidance"
            />
            <FeatureCard
              icon={Sword}
              title="Shadow Monarch's Tools"
              description="Gate generation, encounter building, and combat tracking under the Monarch's domain"
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
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass-card p-6 text-left hover:border-primary/30 transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-heading text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
