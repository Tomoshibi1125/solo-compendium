import { useState } from 'react';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompendiumFiltersProps {
  // Shadow Soldier specific filters
  selectedTiers?: number[];
  onTierToggle?: (tier: number) => void;
  showNamedOnly?: boolean;
  onToggleNamed?: () => void;
  showEliteOnly?: boolean;
  onToggleElite?: () => void;
  
  // General filters
  selectedRarities?: string[];
  onRarityToggle?: (rarity: string) => void;
  minLevel?: number | '';
  maxLevel?: number | '';
  onLevelChange?: (min: number | '', max: number | '') => void;
  minCR?: number | '';
  maxCR?: number | '';
  onCRChange?: (min: number | '', max: number | '') => void;
  selectedGateRanks?: string[];
  onGateRankToggle?: (rank: string) => void;
  
  // Category
  category?: string;
  className?: string;
}

export function CompendiumFilters({
  selectedTiers = [],
  onTierToggle,
  showNamedOnly = false,
  onToggleNamed,
  showEliteOnly = false,
  onToggleElite,
  selectedRarities = [],
  onRarityToggle,
  minLevel = '',
  maxLevel = '',
  onLevelChange,
  minCR = '',
  maxCR = '',
  onCRChange,
  selectedGateRanks = [],
  onGateRankToggle,
  category,
  className,
}: CompendiumFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = 
    selectedTiers.length > 0 ||
    showNamedOnly ||
    showEliteOnly ||
    selectedRarities.length > 0 ||
    minLevel !== '' ||
    maxLevel !== '' ||
    minCR !== '' ||
    maxCR !== '' ||
    selectedGateRanks.length > 0;

  const rarities = ['common', 'uncommon', 'rare', 'very_rare', 'legendary'];
  const gateRanks = ['E', 'D', 'C', 'B', 'A', 'S'];
  const tiers = [1, 2, 3, 4, 5];

  return (
    <SystemWindow 
      title="FILTERS" 
      className={cn(className, hasActiveFilters && "border-primary/30")}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-sm">FILTERS</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          <Filter className="w-3 h-3 mr-1" />
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      <div className="space-y-4">
        {/* Shadow Soldier Specific Filters */}
        {category === 'shadow-soldiers' && (
          <>
            <div>
              <Label className="text-xs font-heading mb-2 block">TIER</Label>
              <div className="flex flex-wrap gap-2">
                {tiers.map(tier => (
                  <Badge
                    key={tier}
                    variant={selectedTiers.includes(tier) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => onTierToggle?.(tier)}
                  >
                    Tier {tier}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="named-only"
                  checked={showNamedOnly}
                  onCheckedChange={onToggleNamed}
                />
                <Label htmlFor="named-only" className="text-sm cursor-pointer">
                  Named Shadows Only
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="elite-only"
                  checked={showEliteOnly}
                  onCheckedChange={onToggleElite}
                />
                <Label htmlFor="elite-only" className="text-sm cursor-pointer">
                  Elite Only
                </Label>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* General Filters */}
        {isExpanded && (
          <>
            {/* Rarity Filter */}
            <div>
              <Label className="text-xs font-heading mb-2 block">RARITY</Label>
              <div className="flex flex-wrap gap-2">
                {rarities.map(rarity => (
                  <Badge
                    key={rarity}
                    variant={selectedRarities.includes(rarity) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => onRarityToggle?.(rarity)}
                  >
                    {rarity.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Level Range */}
            {(category === 'powers' || category === 'all') && (
              <div>
                <Label className="text-xs font-heading mb-2 block">LEVEL RANGE</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minLevel}
                    onChange={(e) => onLevelChange?.(e.target.value ? parseInt(e.target.value) : '', maxLevel)}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxLevel}
                    onChange={(e) => onLevelChange?.(minLevel, e.target.value ? parseInt(e.target.value) : '')}
                    className="w-20"
                  />
                </div>
              </div>
            )}

            {/* CR Range */}
            {(category === 'monsters' || category === 'shadow-soldiers' || category === 'all') && (
              <div>
                <Label className="text-xs font-heading mb-2 block">CHALLENGE RATING</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.25"
                    placeholder="Min"
                    value={minCR}
                    onChange={(e) => onCRChange?.(e.target.value ? parseFloat(e.target.value) : '', maxCR)}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    step="0.25"
                    placeholder="Max"
                    value={maxCR}
                    onChange={(e) => onCRChange?.(minCR, e.target.value ? parseFloat(e.target.value) : '')}
                    className="w-20"
                  />
                </div>
              </div>
            )}

            {/* Gate Rank */}
            <div>
              <Label className="text-xs font-heading mb-2 block">GATE RANK</Label>
              <div className="flex flex-wrap gap-2">
                {gateRanks.map(rank => (
                  <Badge
                    key={rank}
                    variant={selectedGateRanks.includes(rank) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => onGateRankToggle?.(rank)}
                  >
                    {rank}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </SystemWindow>
  );
}

