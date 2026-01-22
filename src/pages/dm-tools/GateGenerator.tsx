import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Copy } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { formatMonarchVernacular } from '@/lib/vernacular';

const RIFT_RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];
const RIFT_THEMES = [
  'Shadow Realm', 'Elemental Chaos', 'Beast Domain', 'Construct Forge',
  'Abyssal Depths', 'Celestial Spire', 'Prime Architect\'s Domain', 'Necromantic Lab',
  'Mana Nexus', 'Umbral Monarch\'s Memory', 'System Testing Ground', 'Post-Reset Fragment'
];
const RIFT_BIOMES = [
  'Urban ruins', 'Dark forest', 'Underground caverns', 'Floating platforms',
  'Crystal caves', 'Shadow wasteland', 'Mana-infused jungle', 'Frozen tundra',
  'Volcanic depths', 'Sky fortress', 'Underwater ruins', 'Dimensional pocket'
];
const BOSS_TYPES = [
  'Umbral Monarch Fragment', 'System Guardian', 'Corrupted Ascendant', 'Ancient Rift Beast',
  'Monarch\'s Shadow', 'Rift Core Manifestation', 'Time-Lost Entity', 'Dimensional Breach'
];
const COMPLICATIONS = [
  'Mana surge causes random effects', 'Rift structure shifts', 'Monster reinforcements',
  'Environmental hazard activates', 'Time distortion', 'Shadow corruption spreads',
  'Boss awakens early', 'Core instability', 'Mana depletion', 'Illusionary duplicates'
];

interface GeneratedRift {
  rank: string;
  theme: string;
  biome: string;
  boss: string;
  complications: string[];
  description: string;
}

function generateRift(rank?: string): GeneratedRift {
  const selectedRank = rank || RIFT_RANKS[Math.floor(Math.random() * RIFT_RANKS.length)];
  const theme = formatMonarchVernacular(RIFT_THEMES[Math.floor(Math.random() * RIFT_THEMES.length)]);
  const biome = RIFT_BIOMES[Math.floor(Math.random() * RIFT_BIOMES.length)];
  const boss = formatMonarchVernacular(BOSS_TYPES[Math.floor(Math.random() * BOSS_TYPES.length)]);
  const numComplications = Math.floor(Math.random() * 3) + 1;
  const complications = [...new Set(
    Array.from({ length: numComplications }, () =>
      COMPLICATIONS[Math.floor(Math.random() * COMPLICATIONS.length)]
    )
  )].map(formatMonarchVernacular);

  const description = formatMonarchVernacular(
    `A ${selectedRank}-Rank Rift manifesting as ${biome} within the ${theme}. The Rift's core is protected by ${boss}. ${complications.length > 0 ? `Complications: ${complications.join(', ')}.` : ''}`
  );

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
  const [rift, setRift] = useState<GeneratedRift | null>(null);

  const handleGenerate = () => {
    const newRift = generateRift(selectedRank || undefined);
    setRift(newRift);
    toast({
      title: 'Rift Generated',
      description: `Generated a ${newRift.rank}-Rank Rift.`,
    });
  };

  const handleCopy = () => {
    if (!rift) return;
    const text = `RIFT DETAILS\nRank: ${rift.rank}\nTheme: ${rift.theme}\nBiome: ${rift.biome}\nBoss: ${rift.boss}\nComplications: ${rift.complications.join(', ')}\n\n${rift.description}`;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Rift details copied to clipboard.',
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
            RIFT GENERATOR
          </h1>
          <p className="text-muted-foreground font-heading">
            Generate random rifts with themes, biomes, bosses, and complications for your sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SystemWindow title="GENERATOR SETTINGS">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-display text-muted-foreground mb-2 block">
                    RIFT RANK (Optional)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {RIFT_RANKS.map((rank) => (
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
                  Generate Rift
                </Button>
              </div>
            </SystemWindow>
          </div>

          <div className="lg:col-span-2">
            {rift ? (
              <div className="space-y-4">
                <SystemWindow title={`${rift.rank}-RANK RIFT`}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-display text-muted-foreground">THEME</span>
                        <p className="font-heading text-lg">{rift.theme}</p>
                      </div>
                      <div>
                        <span className="text-xs font-display text-muted-foreground">BIOME</span>
                        <p className="font-heading text-lg">{rift.biome}</p>
                      </div>
                      <div>
                        <span className="text-xs font-display text-muted-foreground">BOSS</span>
                        <p className="font-heading text-lg">{rift.boss}</p>
                      </div>
                      <div>
                        <span className="text-xs font-display text-muted-foreground">RANK</span>
                        <Badge className="mt-1">{rift.rank}</Badge>
                      </div>
                    </div>

                    {rift.complications.length > 0 && (
                      <div>
                        <span className="text-xs font-display text-muted-foreground">COMPLICATIONS</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {rift.complications.map((comp, i) => (
                            <Badge key={i} variant="destructive">{comp}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-border">
                      <span className="text-xs font-display text-muted-foreground">DESCRIPTION</span>
                      <p className="text-sm text-muted-foreground mt-2">{rift.description}</p>
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
              <SystemWindow title="NO RIFT GENERATED">
                <div className="text-center py-12 text-muted-foreground">
                  <p>Click "Generate Rift" to create a random Rift</p>
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


