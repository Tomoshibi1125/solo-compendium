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
import { GATE_RANKS, TREASURE_TABLES, generateTreasure, type TreasureResult } from '@/lib/treasureGenerator';
import { cn } from '@/lib/utils';

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
    const text = `Rift Rank ${treasure.rank} Treasure:
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
            Back to Warden Tools
          </Button>
          <h1 className="font-arise text-4xl font-bold mb-2 gradient-text-shadow">
            TREASURE GENERATOR
          </h1>
          <p className="text-muted-foreground font-heading">
            Generate treasure hoards appropriate for each Rift Rank. Rewards scale with difficulty.
          </p>
        </div>

        <SystemWindow title="GENERATE TREASURE" className="mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="rank" className="mb-2 block">
                Rift Rank
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
              className="w-full btn-umbral"
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
              Treasure generation follows the Rift Rank system. Higher ranks yield significantly more valuable rewards.
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



