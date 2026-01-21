import { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface AdvancedSearchFilters {
  // Content Type
  contentTypes: string[];
  
  // Basic Filters
  rarities: string[];
  levels: { min: number; max: number };
  gateRanks: string[];
  
  // Spell Filters
  spellSchools: string[];
  spellComponents: string[];
  castingTimes: string[];
  durations: string[];
  ranges: string[];
  savingThrows: string[];
  
  // Monster Filters
  monsterTypes: string[];
  monsterSizes: string[];
  monsterAlignments: string[];
  challengeRatings: string[];
  
  // Equipment Filters
  equipmentTypes: string[];
  damageTypes: string[];
  weaponProperties: string[];
  armorTypes: string[];
  
  // Requirements
  abilityRequirements: string[];
  skillRequirements: string[];
  toolRequirements: string[];
  
  // Source
  sourceBooks: string[];
  settings: string[];
}

interface AdvancedSearchProps {
  filters: AdvancedSearchFilters;
  onFiltersChange: (filters: AdvancedSearchFilters) => void;
  className?: string;
}

const FILTER_OPTIONS = {
  contentTypes: [
    'spells', 'runes', 'relics', 'artifacts', 'monsters', 
    'locations', 'conditions', 'items', 'backgrounds', 'jobs', 'paths'
  ],
  rarities: ['common', 'uncommon', 'rare', 'very_rare', 'legendary'],
  gateRanks: ['E', 'D', 'C', 'B', 'A', 'S', 'SS'],
  spellSchools: [
    'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
    'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
  ],
  spellComponents: ['V', 'S', 'M', 'VSM', 'VS', 'VM'],
  castingTimes: [
    '1 action', '1 bonus action', '1 reaction', '1 minute', 
    '10 minutes', '1 hour', '8 hours', '24 hours'
  ],
  durations: [
    'Instantaneous', 'Concentration, up to 1 minute', 'Concentration, up to 10 minutes',
    'Concentration, up to 1 hour', 'Concentration, up to 8 hours', '1 round', '1 minute',
    '10 minutes', '1 hour', '8 hours', '24 hours', 'Until dispelled', 'Until dispelled or triggered'
  ],
  ranges: [
    'Self', 'Touch', '5 feet', '10 feet', '30 feet', '60 feet', '90 feet', 
    '120 feet', '150 feet', '300 feet', '500 feet', '1 mile', 'Sight', 'Unlimited'
  ],
  savingThrows: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
  monsterTypes: [
    'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental',
    'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'
  ],
  monsterSizes: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'],
  monsterAlignments: [
    'Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral',
    'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil', 'Unaligned'
  ],
  challengeRatings: [
    '0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '30'
  ],
  equipmentTypes: [
    'Weapon', 'Armor', 'Shield', 'Potion', 'Scroll', 'Wand', 'Rod', 'Staff',
    'Ring', 'Amulet', 'Bracers', 'Cloak', 'Boots', 'Gloves', 'Helm', 'Belt'
  ],
  damageTypes: [
    'Acid', 'Bludgeoning', 'Cold', 'Fire', 'Force', 'Lightning', 'Necrotic',
    'Piercing', 'Poison', 'Psychic', 'Radiant', 'Slashing', 'Thunder'
  ],
  weaponProperties: [
    'Ammunition', 'Finesse', 'Heavy', 'Light', 'Loading', 'Range', 'Reach',
    'Special', 'Thrown', 'Two-Handed', 'Versatile', 'Monk', 'Silvered'
  ],
  armorTypes: ['Light Armor', 'Medium Armor', 'Heavy Armor', 'Shield'],
  abilities: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'],
  skills: [
    'Athletics', 'Acrobatics', 'Sleight of Hand', 'Stealth', 'Arcana', 'History',
    'Investigation', 'Nature', 'Religion', 'Insight', 'Medicine', 'Perception',
    'Survival', 'Deception', 'Intimidation', 'Performance', 'Persuasion'
  ],
  tools: [
    "Artisan's Tools", "Musical Instrument", "Gaming Set", "Thieves' Tools",
    "Disguise Kit", "Forgery Kit", "Herbalism Kit", "Navigator's Tools", "Poisoner's Kit"
  ],
  sourceBooks: [
    "Player's Handbook", "Protocol Warden's Guide", "Monster Manual",
    "Xanathar's Guide to Everything", "Tasha's Cauldron of Everything",
    "Mordenkainen's Tome of Foes", "Volo's Guide to Monsters"
  ],
  settings: [
    'Forgotten Realms', 'Eberron', 'Ravnica', 'Theros', 'Strixhaven',
    'Wildemount', 'Exandria', 'Greyhawk', 'Dragonlance', 'Planescape'
  ]
};

export function AdvancedSearch({ filters, onFiltersChange, className }: AdvancedSearchProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    spells: false,
    monsters: false,
    equipment: false,
    requirements: false,
    source: false
  });

  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof AdvancedSearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: keyof AdvancedSearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      contentTypes: [],
      rarities: [],
      levels: { min: 1, max: 20 },
      gateRanks: [],
      spellSchools: [],
      spellComponents: [],
      castingTimes: [],
      durations: [],
      ranges: [],
      savingThrows: [],
      monsterTypes: [],
      monsterSizes: [],
      monsterAlignments: [],
      challengeRatings: [],
      equipmentTypes: [],
      damageTypes: [],
      weaponProperties: [],
      armorTypes: [],
      abilityRequirements: [],
      skillRequirements: [],
      toolRequirements: [],
      sourceBooks: [],
      settings: []
    });
    setSearchQuery('');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'levels') {
        if (value.min > 1 || value.max < 20) count++;
      } else if (Array.isArray(value)) {
        count += value.length;
      }
    });
    return count;
  }, [filters]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Search
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {activeFilterCount > 0 && (
              <Button size="sm" variant="outline" onClick={clearAllFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Query */}
        <div>
          <Label htmlFor="search-query">Search Query</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search-query"
              placeholder="Search by name, description, or properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content Types */}
        <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection('basic')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="font-medium">Content Types</span>
              {expandedSections.basic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {FILTER_OPTIONS.contentTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`content-${type}`}
                    checked={filters.contentTypes.includes(type)}
                    onCheckedChange={() => toggleArrayFilter('contentTypes', type)}
                  />
                  <Label htmlFor={`content-${type}`} className="capitalize">
                    {type.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Basic Filters */}
        <Collapsible open={expandedSections.basic} onOpenChange={() => toggleSection('basic')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="font-medium">Basic Filters</span>
              {expandedSections.basic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            {/* Rarities */}
            <div>
              <Label>Rarity</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {FILTER_OPTIONS.rarities.map((rarity) => (
                  <div key={rarity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rarity-${rarity}`}
                      checked={filters.rarities.includes(rarity)}
                      onCheckedChange={() => toggleArrayFilter('rarities', rarity)}
                    />
                    <Label htmlFor={`rarity-${rarity}`} className="capitalize">
                      {rarity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Range */}
            <div>
              <Label>Level Range</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label htmlFor="min-level" className="text-sm">Min</Label>
                  <Input
                    id="min-level"
                    type="number"
                    min="1"
                    max="20"
                    value={filters.levels.min}
                    onChange={(e) => updateFilter('levels', { ...filters.levels, min: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <Label htmlFor="max-level" className="text-sm">Max</Label>
                  <Input
                    id="max-level"
                    type="number"
                    min="1"
                    max="20"
                    value={filters.levels.max}
                    onChange={(e) => updateFilter('levels', { ...filters.levels, max: parseInt(e.target.value) || 20 })}
                  />
                </div>
              </div>
            </div>

            {/* Rift Ranks */}
            <div>
              <Label>Rift Rank</Label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
                {FILTER_OPTIONS.gateRanks.map((rank) => (
                  <div key={rank} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gate-${rank}`}
                      checked={filters.gateRanks.includes(rank)}
                      onCheckedChange={() => toggleArrayFilter('gateRanks', rank)}
                    />
                    <Label htmlFor={`gate-${rank}`}>{rank}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Spell Filters */}
        <Collapsible open={expandedSections.spells} onOpenChange={() => toggleSection('spells')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="font-medium">Spell Filters</span>
              {expandedSections.spells ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Schools</Label>
                <div className="space-y-2 mt-2">
                  {FILTER_OPTIONS.spellSchools.map((school) => (
                    <div key={school} className="flex items-center space-x-2">
                      <Checkbox
                        id={`school-${school}`}
                        checked={filters.spellSchools.includes(school)}
                        onCheckedChange={() => toggleArrayFilter('spellSchools', school)}
                      />
                      <Label htmlFor={`school-${school}`} className="text-sm">
                        {school}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Components</Label>
                <div className="space-y-2 mt-2">
                  {FILTER_OPTIONS.spellComponents.map((component) => (
                    <div key={component} className="flex items-center space-x-2">
                      <Checkbox
                        id={`component-${component}`}
                        checked={filters.spellComponents.includes(component)}
                        onCheckedChange={() => toggleArrayFilter('spellComponents', component)}
                      />
                      <Label htmlFor={`component-${component}`} className="text-sm">
                        {component}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Monster Filters */}
        <Collapsible open={expandedSections.monsters} onOpenChange={() => toggleSection('monsters')}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="font-medium">Monster Filters</span>
              {expandedSections.monsters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Types</Label>
                <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                  {FILTER_OPTIONS.monsterTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.monsterTypes.includes(type)}
                        onCheckedChange={() => toggleArrayFilter('monsterTypes', type)}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Sizes</Label>
                <div className="space-y-2 mt-2">
                  {FILTER_OPTIONS.monsterSizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={filters.monsterSizes.includes(size)}
                        onCheckedChange={() => toggleArrayFilter('monsterSizes', size)}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

