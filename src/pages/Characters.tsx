import { Link } from 'react-router-dom';
import { Plus, User, Settings, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { StatBlock } from '@/components/ui/StatBlock';
import { cn } from '@/lib/utils';

// Sample character data
const sampleCharacters = [
  {
    id: '1',
    name: 'Jin-Woo Sung',
    job: 'Shadow Monarch',
    level: 15,
    hp: { current: 145, max: 145 },
    ac: 18,
    initiative: 7,
  },
  {
    id: '2',
    name: 'Cha Hae-In',
    job: 'Striker',
    level: 12,
    hp: { current: 98, max: 110 },
    ac: 16,
    initiative: 5,
  },
];

const Characters = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2 gradient-text-system">
              MY HUNTERS
            </h1>
            <p className="text-muted-foreground font-heading">
              Create and manage your Solo Leveling 5e characters
            </p>
          </div>
          <Link to="/characters/new">
            <Button className="gap-2 font-heading">
              <Plus className="w-4 h-4" />
              New Hunter
            </Button>
          </Link>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleCharacters.map((character) => (
            <Link
              key={character.id}
              to={`/characters/${character.id}`}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <h3 className="font-heading text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                {character.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Level {character.level} {character.job}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded bg-muted/30">
                  <span className="text-xs text-muted-foreground block">HP</span>
                  <span className={cn(
                    "font-display font-bold",
                    character.hp.current < character.hp.max * 0.5 && "text-destructive"
                  )}>
                    {character.hp.current}/{character.hp.max}
                  </span>
                </div>
                <div className="text-center p-2 rounded bg-muted/30">
                  <span className="text-xs text-muted-foreground block">AC</span>
                  <span className="font-display font-bold">{character.ac}</span>
                </div>
                <div className="text-center p-2 rounded bg-muted/30">
                  <span className="text-xs text-muted-foreground block">Init</span>
                  <span className="font-display font-bold">+{character.initiative}</span>
                </div>
              </div>
            </Link>
          ))}

          {/* New Character Card */}
          <Link
            to="/characters/new"
            className="glass-card p-6 border-dashed hover:border-primary/50 transition-all duration-200 flex flex-col items-center justify-center min-h-[200px] group"
          >
            <div className="w-14 h-14 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-4 group-hover:border-primary/50 transition-colors">
              <Plus className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="font-heading text-muted-foreground group-hover:text-foreground transition-colors">
              Create New Hunter
            </p>
          </Link>
        </div>

        {/* Character Builder Preview */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold mb-4 gradient-text-shadow">
            CHARACTER BUILDER
          </h2>
          <SystemWindow title="STEP-BY-STEP CREATION" variant="quest">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {['Concept', 'Abilities', 'Job', 'Path', 'Background', 'Equipment', 'Powers'].map((step, i) => (
                <div key={step} className="text-center">
                  <div className="w-10 h-10 mx-auto rounded-full bg-muted flex items-center justify-center font-display text-sm mb-2">
                    {i + 1}
                  </div>
                  <span className="text-xs font-heading text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              The character builder guides you through each step, showing live previews of your derived stats
              and validating your choices against the rules.
            </p>
            <Link to="/characters/new" className="inline-block mt-4">
              <Button className="gap-2 font-heading">
                <Plus className="w-4 h-4" />
                Start Building
              </Button>
            </Link>
          </SystemWindow>
        </div>
      </div>
    </Layout>
  );
};

export default Characters;
