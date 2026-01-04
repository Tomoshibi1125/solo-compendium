import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Dice6, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Solo Leveling themed DMG tables
const GATE_COMPLICATIONS = [
  'Mana surge causes random power effects',
  'Gate structure shifts, changing layout',
  'Monster reinforcements arrive',
  'Environmental hazard activates (fire, ice, poison)',
  'Time distortion slows/speeds hunter team',
  'Shadow corruption spreads',
  'Gate boss awakens early',
  'Core instability causes tremors',
  'Mana depletion reduces power effectiveness',
  'Illusionary duplicates confuse hunters',
  'Gate rank increases mid-encounter',
  'Monster evolution triggers',
];

const GATE_REWARDS = [
  'Standard core yield',
  'Enhanced core (double value)',
  'Rare material drop',
  'Relic fragment',
  'System favor bonus',
  'Experience multiplier',
  'Unique monster part',
  'Gate completion bonus',
  'Hidden treasure cache',
  'Monarch blessing',
  'Skill point bonus',
  'Legendary core shard',
];

const GATE_HAZARDS = [
  'Mana vortex (random teleportation)',
  'Shadow trap (damage + condition)',
  'Collapsing structure',
  'Poisonous miasma',
  'Extreme temperature zone',
  'Gravity distortion',
  'Time dilation field',
  'Mana drain zone',
  'Monster spawning point',
  'Core radiation',
  'Dimensional rift',
  'System interference',
];

const NPC_MOTIVATIONS = [
  'Seeking power through Gates',
  'Protecting loved ones',
  'Revenge against monsters',
  'Researching Gate phenomena',
  'Building a hunter organization',
  'Seeking the Shadow Monarch',
  'Escaping past trauma',
  'Proving their worth',
  'Accumulating wealth',
  'Uncovering secrets',
  'Protecting humanity',
  'Achieving immortality',
];

const NPC_SECRETS = [
  'Former S-Rank hunter (lost power)',
  'Working for a Monarch',
  'Has a cursed relic',
  'Knows about the reset',
  'Is actually a monster',
  'Has System favor debt',
  'Betrayed their Hunter team',
  'Seeking forbidden knowledge',
  'Has a hidden Gate',
  'Is being hunted',
  'Knows the Supreme Deity personally',
  'Has a duplicate identity',
];

const GATE_THEMES = [
  'Shadow Realm (undead focus)',
  'Elemental Chaos (elemental focus)',
  'Beast Domain (animal focus)',
  'Construct Forge (construct focus)',
  'Abyssal Depths (fiend focus)',
  'Celestial Spire (celestial focus)',
  'Supreme Deity\'s Domain (shadow focus)',
  'Necromantic Lab (undead + construct)',
  'Mana Nexus (elemental + aberration)',
  'Shadow Monarch\'s Memory',
  'System Testing Ground',
  'Post-Reset Fragment',
];

const GATE_BIOMES = [
  'Urban ruins',
  'Dark forest',
  'Underground caverns',
  'Floating platforms',
  'Crystal caves',
  'Shadow wasteland',
  'Mana-infused jungle',
  'Frozen tundra',
  'Volcanic depths',
  'Sky fortress',
  'Underwater ruins',
  'Dimensional pocket',
];

const TREASURE_TIERS = {
  'E-Rank': [
    'Common relic (dormant)',
    'Basic materials',
    'Standard credits',
    'Minor consumables',
    'Low-tier equipment',
  ],
  'D-Rank': [
    'Uncommon relic (dormant)',
    'Quality materials',
    'Enhanced credits',
    'Useful consumables',
    'Mid-tier equipment',
  ],
  'C-Rank': [
    'Rare relic (dormant/awakened)',
    'Rare materials',
    'Significant credits',
    'Powerful consumables',
    'High-tier equipment',
  ],
  'B-Rank': [
    'Very rare relic (awakened)',
    'Exotic materials',
    'Large credit sum',
    'Legendary consumables',
    'Masterwork equipment',
  ],
  'A-Rank': [
    'Legendary relic (awakened/resonant)',
    'Legendary materials',
    'Massive credit sum',
    'Unique consumables',
    'Artifact equipment',
  ],
  'S-Rank': [
    'Sovereign relic (resonant)',
    'Sovereign materials',
    'Incredible credit sum',
    'System-granted consumables',
    'Sovereign equipment',
  ],
};

function rollDice(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

function rollTable<T>(table: T[]): T {
  return table[Math.floor(Math.random() * table.length)];
}

const RollableTables = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<Record<string, string>>({});

  const roll = (key: string, table: string[]) => {
    const result = rollTable(table);
    setResults(prev => ({ ...prev, [key]: result }));
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
            GATE MASTER'S TABLES
          </h1>
          <p className="text-muted-foreground font-heading">
            Rollable tables from the Gate Master's Guide, adapted for the post-reset world.
          </p>
        </div>

        <Tabs defaultValue="gates" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gates">Gates</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="npcs">NPCs</TabsTrigger>
            <TabsTrigger value="treasure">Treasure</TabsTrigger>
          </TabsList>

          <TabsContent value="gates" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SystemWindow title="GATE COMPLICATIONS">
                <div className="space-y-3">
                  <Button
                    onClick={() => roll('complication', GATE_COMPLICATIONS)}
                    className="w-full gap-2"
                  >
                    <Dice6 className="w-4 h-4" />
                    Roll Complication
                  </Button>
                  {results.complication && (
                    <div className="p-3 rounded border bg-muted/30">
                      <Badge variant="destructive" className="mb-2">Complication</Badge>
                      <p className="font-heading">{results.complication}</p>
                    </div>
                  )}
                </div>
              </SystemWindow>

              <SystemWindow title="GATE HAZARDS">
                <div className="space-y-3">
                  <Button
                    onClick={() => roll('hazard', GATE_HAZARDS)}
                    className="w-full gap-2"
                  >
                    <Dice6 className="w-4 h-4" />
                    Roll Hazard
                  </Button>
                  {results.hazard && (
                    <div className="p-3 rounded border bg-muted/30">
                      <Badge variant="destructive" className="mb-2">Hazard</Badge>
                      <p className="font-heading">{results.hazard}</p>
                    </div>
                  )}
                </div>
              </SystemWindow>

              <SystemWindow title="GATE THEMES">
                <div className="space-y-3">
                  <Button
                    onClick={() => roll('theme', GATE_THEMES)}
                    className="w-full gap-2"
                  >
                    <Dice6 className="w-4 h-4" />
                    Roll Theme
                  </Button>
                  {results.theme && (
                    <div className="p-3 rounded border bg-muted/30">
                      <Badge variant="secondary" className="mb-2">Theme</Badge>
                      <p className="font-heading">{results.theme}</p>
                    </div>
                  )}
                </div>
              </SystemWindow>

              <SystemWindow title="GATE BIOMES">
                <div className="space-y-3">
                  <Button
                    onClick={() => roll('biome', GATE_BIOMES)}
                    className="w-full gap-2"
                  >
                    <Dice6 className="w-4 h-4" />
                    Roll Biome
                  </Button>
                  {results.biome && (
                    <div className="p-3 rounded border bg-muted/30">
                      <Badge variant="secondary" className="mb-2">Biome</Badge>
                      <p className="font-heading">{results.biome}</p>
                    </div>
                  )}
                </div>
              </SystemWindow>
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4 mt-6">
            <SystemWindow title="GATE REWARDS">
              <div className="space-y-3">
                <Button
                  onClick={() => roll('reward', GATE_REWARDS)}
                  className="w-full gap-2"
                >
                  <Dice6 className="w-4 h-4" />
                  Roll Reward
                </Button>
                {results.reward && (
                  <div className="p-3 rounded border bg-muted/30">
                    <Badge variant="default" className="mb-2">Reward</Badge>
                    <p className="font-heading">{results.reward}</p>
                  </div>
                )}
              </div>
            </SystemWindow>
          </TabsContent>

          <TabsContent value="npcs" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SystemWindow title="NPC MOTIVATIONS">
                <div className="space-y-3">
                  <Button
                    onClick={() => roll('motivation', NPC_MOTIVATIONS)}
                    className="w-full gap-2"
                  >
                    <Dice6 className="w-4 h-4" />
                    Roll Motivation
                  </Button>
                  {results.motivation && (
                    <div className="p-3 rounded border bg-muted/30">
                      <Badge variant="secondary" className="mb-2">Motivation</Badge>
                      <p className="font-heading">{results.motivation}</p>
                    </div>
                  )}
                </div>
              </SystemWindow>

              <SystemWindow title="NPC SECRETS">
                <div className="space-y-3">
                  <Button
                    onClick={() => roll('secret', NPC_SECRETS)}
                    className="w-full gap-2"
                  >
                    <Dice6 className="w-4 h-4" />
                    Roll Secret
                  </Button>
                  {results.secret && (
                    <div className="p-3 rounded border bg-muted/30">
                      <Badge variant="destructive" className="mb-2">Secret</Badge>
                      <p className="font-heading">{results.secret}</p>
                    </div>
                  )}
                </div>
              </SystemWindow>
            </div>
          </TabsContent>

          <TabsContent value="treasure" className="space-y-4 mt-6">
            <SystemWindow title="TREASURE BY GATE RANK">
              <div className="space-y-4">
                {Object.entries(TREASURE_TIERS).map(([rank, items]) => (
                  <div key={rank} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-semibold">{rank} Gates</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => roll(`treasure-${rank}`, items)}
                        className="gap-2"
                      >
                        <Dice6 className="w-3 h-3" />
                        Roll
                      </Button>
                    </div>
                    {results[`treasure-${rank}`] && (
                      <div className="mt-2 p-2 rounded bg-muted/30">
                        <Badge variant="default" className="mb-1">{rank}</Badge>
                        <p className="font-heading text-sm">{results[`treasure-${rank}`]}</p>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {items.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </SystemWindow>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RollableTables;

