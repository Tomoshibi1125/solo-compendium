import { useState, useEffect } from 'react';
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
  List,
  Users,
  Loader2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface CompendiumEntry {
  id: string;
  name: string;
  type: 'jobs' | 'powers' | 'relics' | 'monsters' | 'backgrounds' | 'conditions';
  rarity?: string;
  description: string;
  level?: number;
  cr?: string;
  gate_rank?: string;
}

const categories = [
  { id: 'all', name: 'All', icon: Grid3X3 },
  { id: 'jobs', name: 'Jobs', icon: Swords },
  { id: 'powers', name: 'Powers', icon: Wand2 },
  { id: 'relics', name: 'Relics', icon: Gem },
  { id: 'monsters', name: 'Monsters', icon: Skull },
  { id: 'backgrounds', name: 'Backgrounds', icon: Users },
  { id: 'conditions', name: 'Conditions', icon: ScrollText },
];

const rarityColors: Record<string, string> = {
  'common': 'text-muted-foreground border-muted',
  'uncommon': 'text-green-400 border-green-500/30',
  'rare': 'text-blue-400 border-blue-500/30',
  'very_rare': 'text-purple-400 border-purple-500/30',
  'legendary': 'text-amber-400 border-amber-500/30',
};

const gateRankColors: Record<string, string> = {
  'E': 'text-gray-400 border-gray-500/30',
  'D': 'text-green-400 border-green-500/30',
  'C': 'text-blue-400 border-blue-500/30',
  'B': 'text-purple-400 border-purple-500/30',
  'A': 'text-orange-400 border-orange-500/30',
  'S': 'text-red-400 border-red-500/30',
};

const Compendium = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [entries, setEntries] = useState<CompendiumEntry[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchCompendiumData();
  }, [selectedCategory, searchQuery]);

  const fetchCompendiumData = async () => {
    setLoading(true);
    const allEntries: CompendiumEntry[] = [];
    const newCounts: Record<string, number> = {};

    try {
      // Fetch Jobs
      if (selectedCategory === 'all' || selectedCategory === 'jobs') {
        const { data: jobs, count } = await supabase
          .from('compendium_jobs')
          .select('id, name, description', { count: 'exact' })
          .ilike('name', `%${searchQuery}%`);
        
        if (jobs) {
          allEntries.push(...jobs.map(j => ({
            id: j.id,
            name: j.name,
            type: 'jobs' as const,
            description: j.description,
            rarity: 'legendary', // Jobs are special
          })));
        }
        newCounts.jobs = count || 0;
      }

      // Fetch Powers
      if (selectedCategory === 'all' || selectedCategory === 'powers') {
        const { data: powers, count } = await supabase
          .from('compendium_powers')
          .select('id, name, description, power_level, school', { count: 'exact' })
          .ilike('name', `%${searchQuery}%`);
        
        if (powers) {
          allEntries.push(...powers.map(p => ({
            id: p.id,
            name: p.name,
            type: 'powers' as const,
            description: p.description,
            level: p.power_level,
            rarity: p.power_level === 0 ? 'common' : p.power_level <= 2 ? 'uncommon' : p.power_level <= 4 ? 'rare' : p.power_level <= 6 ? 'very_rare' : 'legendary',
          })));
        }
        newCounts.powers = count || 0;
      }

      // Fetch Relics
      if (selectedCategory === 'all' || selectedCategory === 'relics') {
        const { data: relics, count } = await supabase
          .from('compendium_relics')
          .select('id, name, description, rarity, item_type', { count: 'exact' })
          .ilike('name', `%${searchQuery}%`);
        
        if (relics) {
          allEntries.push(...relics.map(r => ({
            id: r.id,
            name: r.name,
            type: 'relics' as const,
            description: r.description,
            rarity: r.rarity,
          })));
        }
        newCounts.relics = count || 0;
      }

      // Fetch Monsters
      if (selectedCategory === 'all' || selectedCategory === 'monsters') {
        const { data: monsters, count } = await supabase
          .from('compendium_monsters')
          .select('id, name, description, cr, gate_rank, is_boss', { count: 'exact' })
          .ilike('name', `%${searchQuery}%`);
        
        if (monsters) {
          allEntries.push(...monsters.map(m => ({
            id: m.id,
            name: m.name,
            type: 'monsters' as const,
            description: m.description || '',
            cr: m.cr,
            gate_rank: m.gate_rank,
          })));
        }
        newCounts.monsters = count || 0;
      }

      // Fetch Backgrounds
      if (selectedCategory === 'all' || selectedCategory === 'backgrounds') {
        const { data: backgrounds, count } = await supabase
          .from('compendium_backgrounds')
          .select('id, name, description', { count: 'exact' })
          .ilike('name', `%${searchQuery}%`);
        
        if (backgrounds) {
          allEntries.push(...backgrounds.map(b => ({
            id: b.id,
            name: b.name,
            type: 'backgrounds' as const,
            description: b.description,
          })));
        }
        newCounts.backgrounds = count || 0;
      }

      // Fetch Conditions
      if (selectedCategory === 'all' || selectedCategory === 'conditions') {
        const { data: conditions, count } = await supabase
          .from('compendium_conditions')
          .select('id, name, description', { count: 'exact' })
          .ilike('name', `%${searchQuery}%`);
        
        if (conditions) {
          allEntries.push(...conditions.map(c => ({
            id: c.id,
            name: c.name,
            type: 'conditions' as const,
            description: c.description,
          })));
        }
        newCounts.conditions = count || 0;
      }

      setEntries(allEntries);
      setCounts(newCounts);
    } catch (error) {
      console.error('Error fetching compendium data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityOrRankColor = (entry: CompendiumEntry) => {
    if (entry.gate_rank) {
      return gateRankColors[entry.gate_rank] || 'border-border';
    }
    if (entry.rarity) {
      return rarityColors[entry.rarity] || 'border-border';
    }
    return 'border-border';
  };

  const getRarityOrRankLabel = (entry: CompendiumEntry) => {
    if (entry.gate_rank) {
      return `${entry.gate_rank}-Rank`;
    }
    if (entry.level !== undefined) {
      return entry.level === 0 ? 'Cantrip' : `Tier ${entry.level}`;
    }
    if (entry.rarity) {
      return entry.rarity.replace('_', ' ');
    }
    return entry.type;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-system">
            COMPENDIUM
          </h1>
          <p className="text-muted-foreground font-heading">
            Browse the complete Solo Leveling 5e ruleset — {Object.values(counts).reduce((a, b) => a + b, 0)} entries
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
                  const count = category.id === 'all' 
                    ? Object.values(counts).reduce((a, b) => a + b, 0)
                    : counts[category.id] || 0;
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
                      <span className="text-xs opacity-60">{count}</span>
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
                Showing {entries.length} results
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "flex flex-col gap-2"
              )}>
                {entries.map((entry) => (
                  <Link
                    key={`${entry.type}-${entry.id}`}
                    to={`/compendium/${entry.type}/${entry.id}`}
                    className={cn(
                      "glass-card border hover:border-primary/30 transition-all duration-200 group",
                      viewMode === 'grid' ? "p-4" : "p-3 flex items-center gap-4",
                      getRarityOrRankColor(entry)
                    )}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <span className={cn(
                            "text-xs font-display uppercase",
                            getRarityOrRankColor(entry)
                          )}>
                            {getRarityOrRankLabel(entry)}
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
                        {entry.cr && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            CR {entry.cr}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <span className={cn(
                          "text-xs font-display uppercase w-24 flex-shrink-0",
                          getRarityOrRankColor(entry)
                        )}>
                          {getRarityOrRankLabel(entry)}
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
            )}

            {!loading && entries.length === 0 && (
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
