import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Download, Copy } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const GATE_RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];
const GATE_THEMES = [
  'Shadow Realm', 'Elemental Chaos', 'Beast Domain', 'Construct Forge',
  'Abyssal Depths', 'Celestial Spire', 'Supreme Deity\'s Domain', 'Necromantic Lab',
  'Mana Nexus', 'Shadow Monarch\'s Memory', 'System Testing Ground', 'Post-Reset Fragment'
];
const GATE_BIOMES = [
  'Urban ruins', 'Dark forest', 'Underground caverns', 'Floating platforms',
  'Crystal caves', 'Shadow wasteland', 'Mana-infused jungle', 'Frozen tundra',
  'Volcanic depths', 'Sky fortress', 'Underwater ruins', 'Dimensional pocket'
];
const BOSS_TYPES = [
  'Shadow Monarch Fragment', 'System Guardian', 'Corrupted Hunter', 'Ancient Gate Beast',
  'Monarch\'s Shadow', 'Gate Core Manifestation', 'Time-Lost Entity', 'Dimensional Breach'
];
const COMPLICATIONS = [
  'Mana surge causes random effects', 'Gate structure shifts', 'Monster reinforcements',
  'Environmental hazard activates', 'Time distortion', 'Shadow corruption spreads',
  'Boss awakens early', 'Core instability', 'Mana depletion', 'Illusionary duplicates'
];

interface GeneratedGate {
  rank: string;
  theme: string;
  biome: string;
  boss: string;
  complications: string[];
  description: string;
}

function generateGate(rank?: string): GeneratedGate {
  const selectedRank = rank || GATE_RANKS[Math.floor(Math.random() * GATE_RANKS.length)];
  const theme = GATE_THEMES[Math.floor(Math.random() * GATE_THEMES.length)];
  const biome = GATE_BIOMES[Math.floor(Math.random() * GATE_BIOMES.length)];
  const boss = BOSS_TYPES[Math.floor(Math.random() * BOSS_TYPES.length)];
  const numComplications = Math.floor(Math.random() * 3) + 1;
  const complications = [...new Set(
    Array.from({ length: numComplications }, () =>
      COMPLICATIONS[Math.floor(Math.random() * COMPLICATIONS.length)]
    )
  )];

  const description = `A ${selectedRank}-Rank Gate manifesting as ${biome} within the ${theme}. The Gate's core is protected by ${boss}. ${complications.length > 0 ? `Complications: ${complications.join(', ')}.` : ''}`;

  return {
    rank: selectedRank,
    theme,
    biome,
    boss,
    complications,
    description,
  };
}

const GateGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRank, setSelectedRank] = useState<string>('');
  const [gate, setGate] = useState<GeneratedGate | null>(null);

  const handleGenerate = () => {
    const newGate = generateGate(selectedRank || undefined);
    setGate(newGate);
    toast({
      title: 'Gate Generated',
      description: `Generated a ${newGate.rank}-Rank Gate.`,
    });
  };

  const handleCopy = () => {
    if (!gate) return;
    const text = `GATE DETAILS\nRank: ${gate.rank}\nTheme: ${gate.theme}\nBiome: ${gate.biome}\nBoss: ${gate.boss}\nComplications: ${gate.complications.join(', ')}\n\n${gate.description}`;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Gate details copied to clipboard.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to System Tools
          </Button>
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-shadow">
            GATE GENERATOR
          </h1>
          <p className="text-muted-foreground font-heading">
            Generate random Gates with themes, biomes, bosses, and complications for your sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SystemWindow title="GENERATOR SETTINGS">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-display text-muted-foreground mb-2 block">
                    GATE RANK (Optional)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {GATE_RANKS.map((rank) => (
                      <Button
                        key={rank}
                        size="sm"
                        variant={selectedRank === rank ? 'default' : 'outline'}
                        onClick={() => setSelectedRank(selectedRank === rank ? '' : rank)}
                      >
                        {rank}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Leave empty for random rank
                  </p>
                </div>
                <Button
                  onClick={handleGenerate}
                  className="w-full gap-2"
                  size="lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate Gate
                </Button>
              </div>
            </SystemWindow>
          </div>

          <div className="lg:col-span-2">
            {gate ? (
              <div className="space-y-4">
                <SystemWindow title={`${gate.rank}-RANK GATE`}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-display text-muted-foreground">THEME</span>
                        <p className="font-heading text-lg">{gate.theme}</p>
                      </div>
                      <div>
                        <span className="text-xs font-display text-muted-foreground">BIOME</span>
                        <p className="font-heading text-lg">{gate.biome}</p>
                      </div>
                      <div>
                        <span className="text-xs font-display text-muted-foreground">BOSS</span>
                        <p className="font-heading text-lg">{gate.boss}</p>
                      </div>
                      <div>
                        <span className="text-xs font-display text-muted-foreground">RANK</span>
                        <Badge className="mt-1">{gate.rank}</Badge>
                      </div>
                    </div>

                    {gate.complications.length > 0 && (
                      <div>
                        <span className="text-xs font-display text-muted-foreground">COMPLICATIONS</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {gate.complications.map((comp, i) => (
                            <Badge key={i} variant="destructive">{comp}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-border">
                      <span className="text-xs font-display text-muted-foreground">DESCRIPTION</span>
                      <p className="text-sm text-muted-foreground mt-2">{gate.description}</p>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        onClick={handleCopy}
                        className="gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Details
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleGenerate}
                        className="gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </SystemWindow>
              </div>
            ) : (
              <SystemWindow title="NO GATE GENERATED">
                <div className="text-center py-12 text-muted-foreground">
                  <p>Click "Generate Gate" to create a random Gate</p>
                </div>
              </SystemWindow>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GateGenerator;

