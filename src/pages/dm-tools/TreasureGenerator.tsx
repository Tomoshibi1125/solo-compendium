import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Copy, Gem, Coins, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const GATE_RANKS = ['E', 'D', 'C', 'B', 'A', 'S'] as const;

interface TreasureResult {
  rank: string;
  gold: number;
  items: string[];
  materials: string[];
  relics: string[];
  description: string;
}

const TREASURE_TABLES: Record<string, {
  goldRange: [number, number];
  itemChance: number;
  materialChance: number;
  relicChance: number;
  items: string[];
  materials: string[];
  relics: string[];
}> = {
  E: {
    goldRange: [10, 50],
    itemChance: 0.3,
    materialChance: 0.2,
    relicChance: 0,
    items: ['Basic Potion', 'Low-Grade Mana Crystal', 'Rusty Dagger', 'Simple Bandage', 'Torch', 'Rope'],
    materials: ['Common Monster Core', 'Basic Ore', 'Weak Mana Fragment'],
    relics: [],
  },
  D: {
    goldRange: [50, 200],
    itemChance: 0.5,
    materialChance: 0.4,
    relicChance: 0.1,
    items: ['Healing Potion', 'Mana Potion', 'Iron Sword', 'Leather Armor', 'Basic Relic Fragment', 'Mana-infused Rope'],
    materials: ['Monster Core', 'Iron Ore', 'Mana Crystal Fragment', 'Shadow Essence'],
    relics: ['Broken Relic Fragment'],
  },
  C: {
    goldRange: [200, 500],
    itemChance: 0.6,
    materialChance: 0.5,
    relicChance: 0.15,
    items: ['Greater Healing Potion', 'Greater Mana Potion', 'Steel Weapon', 'Chain Armor', 'Relic Fragment', 'Enchanted Item'],
    materials: ['Greater Monster Core', 'Steel Ingot', 'Refined Mana Crystal', 'Shadow Essence (Purified)', 'Gate Fragment'],
    relics: ['Incomplete Relic', 'Relic Shard'],
  },
  B: {
    goldRange: [500, 1500],
    itemChance: 0.7,
    materialChance: 0.6,
    relicChance: 0.25,
    items: ['Superior Healing Potion', 'Superior Mana Potion', 'Masterwork Weapon', 'Plate Armor', 'Relic Component', 'Rare Enchanted Item'],
    materials: ['Elite Monster Core', 'Mithril Ingot', 'Pure Mana Crystal', 'Shadow Essence (Crystallized)', 'Gate Fragment (Large)'],
    relics: ['Partial Relic', 'Relic Core'],
  },
  A: {
    goldRange: [1500, 5000],
    itemChance: 0.8,
    materialChance: 0.7,
    relicChance: 0.4,
    items: ['Ultimate Healing Potion', 'Ultimate Mana Potion', 'Legendary Weapon Blueprint', 'Legendary Armor Blueprint', 'Relic Fragment (Large)', 'Epic Enchanted Item'],
    materials: ['Boss Monster Core', 'Adamantite Ingot', 'Perfect Mana Crystal', 'Shadow Essence (Perfect)', 'Gate Fragment (Massive)', 'Supreme Deity\'s Blessing Fragment'],
    relics: ['Near-Complete Relic', 'Relic Heart'],
  },
  S: {
    goldRange: [5000, 20000],
    itemChance: 1.0,
    materialChance: 0.9,
    relicChance: 0.6,
    items: ['Divine Healing Elixir', 'Divine Mana Elixir', 'Artifact Weapon Blueprint', 'Artifact Armor Blueprint', 'Complete Relic Fragment', 'Legendary Enchanted Item'],
    materials: ['S-Rank Monster Core', 'Divine Metal', 'Divine Mana Crystal', 'Shadow Essence (Divine)', 'Gate Core Fragment', 'Supreme Deity\'s Blessing'],
    relics: ['Complete Relic', 'Relic Soul', 'Shadow Monarch Fragment'],
  },
};

function generateTreasure(rank: string): TreasureResult {
  const table = TREASURE_TABLES[rank];
  if (!table) {
    return {
      rank,
      gold: 0,
      items: [],
      materials: [],
      relics: [],
      description: `Invalid rank: ${rank}`,
    };
  }

  // Calculate gold
  const gold = Math.floor(
    Math.random() * (table.goldRange[1] - table.goldRange[0] + 1) + table.goldRange[0]
  );

  // Generate items
  const items: string[] = [];
  const numItems = Math.random() < table.itemChance ? (rank === 'S' ? 2 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 2)) : 0;
  for (let i = 0; i < numItems; i++) {
    const item = table.items[Math.floor(Math.random() * table.items.length)];
    if (!items.includes(item)) {
      items.push(item);
    }
  }

  // Generate materials
  const materials: string[] = [];
  const numMaterials = Math.random() < table.materialChance ? 1 + Math.floor(Math.random() * 2) : 0;
  for (let i = 0; i < numMaterials; i++) {
    const material = table.materials[Math.floor(Math.random() * table.materials.length)];
    if (!materials.includes(material)) {
      materials.push(material);
    }
  }

  // Generate relics
  const relics: string[] = [];
  const numRelics = Math.random() < table.relicChance ? 1 : 0;
  for (let i = 0; i < numRelics; i++) {
    const relic = table.relics[Math.floor(Math.random() * table.relics.length)];
    if (!relics.includes(relic)) {
      relics.push(relic);
    }
  }

  // Generate description
  const descriptions: string[] = [];
  descriptions.push(`Gate Rank ${rank} treasure hoard containing ${gold} gold pieces.`);
  
  if (items.length > 0) {
    descriptions.push(`Items found: ${items.join(', ')}.`);
  }
  
  if (materials.length > 0) {
    descriptions.push(`Materials recovered: ${materials.join(', ')}.`);
  }
  
  if (relics.length > 0) {
    descriptions.push(`Relics discovered: ${relics.join(', ')} — these are particularly valuable and rare!`);
  }

  if (items.length === 0 && materials.length === 0 && relics.length === 0) {
    descriptions.push('Only gold was found in this hoard.');
  }

  return {
    rank,
    gold,
    items,
    materials,
    relics,
    description: descriptions.join(' '),
  };
}

const TreasureGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRank, setSelectedRank] = useState<string>('C');
  const [treasure, setTreasure] = useState<TreasureResult | null>(null);

  const handleGenerate = () => {
    const result = generateTreasure(selectedRank);
    setTreasure(result);
  };

  const handleCopy = () => {
    if (!treasure) return;
    const text = `Gate Rank ${treasure.rank} Treasure:
Gold: ${treasure.gold}
${treasure.items.length > 0 ? `Items: ${treasure.items.join(', ')}\n` : ''}${treasure.materials.length > 0 ? `Materials: ${treasure.materials.join(', ')}\n` : ''}${treasure.relics.length > 0 ? `Relics: ${treasure.relics.join(', ')}\n` : ''}
${treasure.description}`;
    
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Treasure details copied to clipboard.',
    });
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      E: 'text-green-400 border-green-400/30 bg-green-400/10',
      D: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
      C: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
      B: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
      A: 'text-red-400 border-red-400/30 bg-red-400/10',
      S: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
    };
    return colors[rank] || colors.C;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dm-tools')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to DM Tools
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            TREASURE GENERATOR
          </h1>
          <p className="text-muted-foreground font-heading">
            Generate treasure hoards appropriate for each Gate Rank. Rewards scale with difficulty.
          </p>
        </div>

        <SystemWindow title="GENERATE TREASURE" className="mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="rank" className="mb-2 block">
                Gate Rank
              </Label>
              <Select value={selectedRank} onValueChange={setSelectedRank}>
                <SelectTrigger id="rank">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GATE_RANKS.map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      Rank {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full btn-shadow-monarch"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Treasure
            </Button>
          </div>
        </SystemWindow>

        {treasure && (
          <SystemWindow title={`RANK ${treasure.rank} TREASURE`} className="mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={cn('text-lg px-4 py-2', getRankColor(treasure.rank))}>
                  Rank {treasure.rank}
                </Badge>
                <div className="flex items-center gap-2 text-2xl font-arise text-amber-400">
                  <Coins className="w-6 h-6" />
                  {treasure.gold.toLocaleString()} gold
                </div>
              </div>

              {treasure.items.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-primary" />
                    Items ({treasure.items.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {treasure.items.map((item, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {treasure.materials.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Materials ({treasure.materials.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {treasure.materials.map((material, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm bg-blue-400/10 border-blue-400/30">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {treasure.relics.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Relics ({treasure.relics.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {treasure.relics.map((relic, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm bg-purple-400/20 border-purple-400/50 text-purple-300">
                        {relic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground font-heading leading-relaxed">
                  {treasure.description}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Details
                </Button>
                <Button
                  onClick={handleGenerate}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </SystemWindow>
        )}

        <SystemWindow title="TREASURE GUIDE" variant="quest">
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground font-heading">
              Treasure generation follows the Gate Rank system. Higher ranks yield significantly more valuable rewards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GATE_RANKS.map((rank) => {
                const table = TREASURE_TABLES[rank];
                return (
                  <div key={rank} className={cn('p-3 rounded-lg border', getRankColor(rank))}>
                    <div className="font-heading font-semibold mb-1">Rank {rank}</div>
                    <div className="text-xs text-muted-foreground">
                      Gold: {table.goldRange[0]}-{table.goldRange[1]} | Items: {Math.round(table.itemChance * 100)}% | Materials: {Math.round(table.materialChance * 100)}% | Relics: {Math.round(table.relicChance * 100)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SystemWindow>
      </div>
    </Layout>
  );
};

export default TreasureGenerator;

