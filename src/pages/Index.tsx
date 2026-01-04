import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickAccessSection } from '@/components/home/QuickAccessSection';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Sparkles, Zap, Shield, Target } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <QuickAccessSection />
      
      {/* System Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-secondary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text-gold text-glow-gold">SYSTEM FEATURES</span>
            </h2>
            <p className="text-muted-foreground font-heading max-w-xl mx-auto">
              In this world reset by the Shadow Monarch, embrace your awakening with tools 
              blessed by the System and guided by Jinwoo's will.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <SystemWindow title="CHARACTER AUTOMATION" className="h-full">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold mb-1">Derived Stats</h4>
                    <p className="text-sm text-muted-foreground">
                      AC, HP, saves, skills, and proficiency automatically calculated from your choices.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold mb-1">System Favor</h4>
                    <p className="text-sm text-muted-foreground">
                      Track your Hunter's connection to the System, a resource granted by the Shadow Monarch's domain.
                    </p>
                  </div>
                </div>
              </div>
            </SystemWindow>

            <SystemWindow title="COMBAT READY" variant="alert" className="h-full">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold mb-1">Attack Cards</h4>
                    <p className="text-sm text-muted-foreground">
                      Roll to-hit and damage with one click. Modifiers and riders applied automatically.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold mb-1">Condition Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply conditions with automatic effect modifiers. Never forget a penalty again.
                    </p>
                  </div>
                </div>
              </div>
            </SystemWindow>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card-glow max-w-3xl mx-auto p-8 sm:p-12 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4 gradient-text-shadow">
              READY TO AWAKEN?
            </h2>
            <p className="text-muted-foreground font-heading mb-6 max-w-lg mx-auto">
              In this world reborn under the Shadow Monarch's watch, begin your journey as a Hunter. 
              Explore the compendium of knowledge preserved by the System, or forge your path 
              through the Gates that scar this new reality.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/characters/new" 
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-8 py-3 font-heading font-semibold hover:bg-primary/90 transition-colors"
              >
                Create Your Hunter
              </a>
              <a 
                href="/compendium" 
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background/50 px-8 py-3 font-heading font-semibold hover:bg-muted transition-colors"
              >
                Explore Compendium
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
