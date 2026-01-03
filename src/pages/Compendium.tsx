import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Swords, 
  Wand2, 
  Gem, 
  Skull, 
  ScrollText,
  Flame,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'all', name: 'All', icon: Grid3X3 },
  { id: 'jobs', name: 'Jobs', icon: Swords, count: 12 },
  { id: 'powers', name: 'Powers', icon: Wand2, count: 150 },
  { id: 'relics', name: 'Relics', icon: Gem, count: 500 },
  { id: 'monsters', name: 'Monsters', icon: Skull, count: 200 },
  { id: 'rules', name: 'Rules', icon: ScrollText, count: 25 },
  { id: 'gates', name: 'Gates', icon: Flame, count: 50 },
];

// Sample data for preview
const sampleEntries = [
  { id: '1', name: 'Shadow Monarch', type: 'jobs', rarity: 'legendary', description: 'Command the shadows and raise an army of the dead.' },
  { id: '2', name: 'Striker', type: 'jobs', rarity: 'common', description: 'A frontline combatant focused on damage dealing.' },
  { id: '3', name: 'Healer', type: 'jobs', rarity: 'common', description: 'A support specialist who restores allies and cleanses conditions.' },
  { id: '4', name: 'Assassin', type: 'jobs', rarity: 'common', description: 'A precision killer who strikes from the shadows.' },
  { id: '5', name: 'Mage', type: 'jobs', rarity: 'common', description: 'A wielder of arcane forces and elemental destruction.' },
  { id: '6', name: 'Tank', type: 'jobs', rarity: 'common', description: 'A defensive bulwark who protects allies and controls the battlefield.' },
  { id: '7', name: 'Blink Step', type: 'powers', rarity: 'uncommon', description: 'Teleport a short distance and gain advantage on your next attack.' },
  { id: '8', name: 'Shadow Exchange', type: 'powers', rarity: 'rare', description: 'Swap positions with a shadow soldier or ally.' },
  { id: '9', name: 'Ruler\'s Authority', type: 'powers', rarity: 'legendary', description: 'Command absolute dominion over shadows and the undead.' },
  { id: '10', name: 'Demon King\'s Longsword', type: 'relics', rarity: 'legendary', description: 'A blade of immense power once wielded by the Demon King.' },
  { id: '11', name: 'Stealth Cloak', type: 'relics', rarity: 'rare', description: 'Grants advantage on Stealth checks and limited invisibility.' },
  { id: '12', name: 'Red Gate', type: 'gates', rarity: 'very-rare', description: 'A high-rank Gate with extreme danger and valuable rewards.' },
];

const rarityColors: Record<string, string> = {
  'common': 'text-muted-foreground border-muted',
  'uncommon': 'text-green-400 border-green-500/30',
  'rare': 'text-blue-400 border-blue-500/30',
  'very-rare': 'text-purple-400 border-purple-500/30',
  'legendary': 'text-amber-400 border-amber-500/30',
};

const Compendium = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const location = useLocation();

  const filteredEntries = sampleEntries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-system">
            COMPENDIUM
          </h1>
          <p className="text-muted-foreground font-heading">
            Browse the complete Solo Leveling 5e ruleset
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search jobs, powers, relics, monsters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <SystemWindow title="CATEGORIES" className="sticky top-24">
              <nav className="space-y-1">
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg font-heading text-sm transition-colors",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.name}
                      </span>
                      {category.count && (
                        <span className="text-xs opacity-60">{category.count}</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </SystemWindow>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-heading">
                Showing {filteredEntries.length} results
              </p>
            </div>

            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                : "flex flex-col gap-2"
            )}>
              {filteredEntries.map((entry) => (
                <Link
                  key={entry.id}
                  to={`/compendium/${entry.type}/${entry.id}`}
                  className={cn(
                    "glass-card border hover:border-primary/30 transition-all duration-200 group",
                    viewMode === 'grid' ? "p-4" : "p-3 flex items-center gap-4",
                    rarityColors[entry.rarity]
                  )}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <span className={cn(
                          "text-xs font-display uppercase",
                          rarityColors[entry.rarity]
                        )}>
                          {entry.rarity.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {entry.type}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {entry.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.description}
                      </p>
                    </>
                  ) : (
                    <>
                      <span className={cn(
                        "text-xs font-display uppercase w-20",
                        rarityColors[entry.rarity]
                      )}>
                        {entry.rarity.replace('-', ' ')}
                      </span>
                      <h3 className="font-heading font-semibold flex-1 group-hover:text-primary transition-colors">
                        {entry.name}
                      </h3>
                      <span className="text-xs text-muted-foreground capitalize">
                        {entry.type}
                      </span>
                    </>
                  )}
                </Link>
              ))}
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-heading">No results found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Compendium;
