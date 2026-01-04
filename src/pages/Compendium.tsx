import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Grid3X3,
  List,
  Loader2,
  ArrowUpDown,
  Heart,
  Download,
  Share2,
  Swords,
  Wand2,
  Gem,
  Skull,
  ScrollText,
  Crown,
  GitBranch,
  Sparkles,
  Users,
  Package
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useFavorites } from '@/hooks/useFavorites';
import { CompendiumSidebar } from '@/components/compendium/CompendiumSidebar';
import { FilterChips } from '@/components/compendium/FilterChips';
import { useDebounce } from '@/hooks/useDebounce';
import { SkeletonLoader } from '@/components/compendium/SkeletonLoader';
import { EmptyState } from '@/components/compendium/EmptyState';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/hooks/use-toast';
import { useToastAction } from '@/hooks/useToastAction';
import { AnimatedList } from '@/components/ui/AnimatedList';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';

interface CompendiumEntry {
  id: string;
  name: string;
  type: 'jobs' | 'paths' | 'powers' | 'relics' | 'monsters' | 'backgrounds' | 'conditions' | 'monarchs' | 'feats' | 'skills' | 'equipment';
  rarity?: string;
  description: string;
  level?: number;
  cr?: string;
  gate_rank?: string;
  title?: string;
  prerequisites?: string;
  equipment_type?: string;
  ability?: string;
  tags?: string[];
  created_at?: string;
  isFavorite?: boolean;
  source_book?: string;
  source_kind?: string;
  school?: string;
}

type SortOption = 'name-asc' | 'name-desc' | 'level-asc' | 'level-desc' | 'rarity-asc' | 'rarity-desc' | 'date-desc';

const categories = [
  { id: 'all', name: 'All', icon: Grid3X3 },
  { id: 'jobs', name: 'Jobs', icon: Swords },
  { id: 'paths', name: 'Paths', icon: GitBranch },
  { id: 'monarchs', name: 'Monarchs', icon: Crown },
  { id: 'powers', name: 'Powers', icon: Wand2 },
  { id: 'relics', name: 'Relics', icon: Gem },
  { id: 'feats', name: 'Feats', icon: Sparkles },
  { id: 'monsters', name: 'Monsters', icon: Skull },
  { id: 'backgrounds', name: 'Backgrounds', icon: Users },
  { id: 'conditions', name: 'Conditions', icon: ScrollText },
  { id: 'skills', name: 'Skills', icon: Users },
  { id: 'equipment', name: 'Equipment', icon: Package },
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

const rarityOrder: Record<string, number> = {
  'common': 1,
  'uncommon': 2,
  'rare': 3,
  'very_rare': 4,
  'legendary': 5,
};

const spellSchools = [
  'Abjuration', 'Conjuration', 'Divination', 'Enchantment',
  'Evocation', 'Illusion', 'Necromancy', 'Transmutation'
];

const gateRanks = ['E', 'D', 'C', 'B', 'A', 'S'];

const Compendium = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [minLevel, setMinLevel] = useState<number | ''>('');
  const [maxLevel, setMaxLevel] = useState<number | ''>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSourceBooks, setSelectedSourceBooks] = useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedGateRanks, setSelectedGateRanks] = useState<string[]>([]);
  const [minCR, setMinCR] = useState<number | ''>('');
  const [maxCR, setMaxCR] = useState<number | ''>('');
  const itemsPerPage = 24;
  
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  // Fetch compendium data (using debounced search)
  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['compendium', selectedCategory, debouncedSearchQuery],
    queryFn: async () => {
      const allEntries: CompendiumEntry[] = [];

      try {
        // Fetch Jobs
        if (selectedCategory === 'all' || selectedCategory === 'jobs') {
          let query = supabase
            .from('compendium_jobs')
            .select('id, name, description, created_at, tags, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: jobs } = await query;
          if (jobs) {
            allEntries.push(...jobs.map(j => ({
              id: j.id,
              name: j.name,
              type: 'jobs' as const,
              description: j.description,
              rarity: 'legendary',
              tags: j.tags || [],
              created_at: j.created_at,
              source_book: j.source_book,
              source_kind: j.source_kind,
              isFavorite: favorites.has(`jobs:${j.id}`) || false,
            })));
          }
        }

        // Fetch Paths
        if (selectedCategory === 'all' || selectedCategory === 'paths') {
          let query = supabase
            .from('compendium_job_paths')
            .select('id, name, description, created_at, tags, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: paths } = await query;
          if (paths) {
            allEntries.push(...paths.map(p => ({
              id: p.id,
              name: p.name,
              type: 'paths' as const,
              description: p.description,
              rarity: 'rare',
              tags: p.tags || [],
              created_at: p.created_at,
              source_book: p.source_book,
              source_kind: p.source_kind,
              isFavorite: favorites.has(`paths:${p.id}`) || false,
            })));
          }
        }

        // Fetch Monarchs
        if (selectedCategory === 'all' || selectedCategory === 'monarchs') {
          let query = supabase
            .from('compendium_monarchs')
            .select('id, name, title, description, theme, created_at, tags, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: monarchs } = await query;
          if (monarchs) {
            allEntries.push(...monarchs.map(m => ({
              id: m.id,
              name: m.name,
              type: 'monarchs' as const,
              description: m.description,
              title: m.title,
              rarity: 'legendary',
              tags: m.tags || [],
              created_at: m.created_at,
              source_book: m.source_book,
              source_kind: m.source_kind,
              isFavorite: favorites.has(`monarchs:${m.id}`) || false,
            })));
          }
        }

        // Fetch Powers
        if (selectedCategory === 'all' || selectedCategory === 'powers') {
          let query = supabase
            .from('compendium_powers')
            .select('id, name, description, power_level, school, created_at, tags, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: powers } = await query;
          if (powers) {
            allEntries.push(...powers.map(p => ({
              id: p.id,
              name: p.name,
              type: 'powers' as const,
              description: p.description,
              level: p.power_level,
              school: p.school,
              rarity: p.power_level === 0 ? 'common' : p.power_level <= 2 ? 'uncommon' : p.power_level <= 4 ? 'rare' : p.power_level <= 6 ? 'very_rare' : 'legendary',
              tags: p.tags || [],
              created_at: p.created_at,
              source_book: p.source_book,
              source_kind: p.source_kind,
              isFavorite: favorites.has(`powers:${p.id}`) || false,
            })));
          }
        }

        // Fetch Relics
        if (selectedCategory === 'all' || selectedCategory === 'relics') {
          let query = supabase
            .from('compendium_relics')
            .select('id, name, description, rarity, item_type, created_at, tags, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: relics } = await query;
          if (relics) {
            allEntries.push(...relics.map(r => ({
              id: r.id,
              name: r.name,
              type: 'relics' as const,
              description: r.description,
              rarity: r.rarity,
              tags: r.tags || [],
              created_at: r.created_at,
              source_book: r.source_book,
              source_kind: r.source_kind,
              isFavorite: favorites.has(`relics:${r.id}`) || false,
            })));
          }
        }

        // Fetch Feats
        if (selectedCategory === 'all' || selectedCategory === 'feats') {
          let query = supabase
            .from('compendium_feats')
            .select('id, name, description, prerequisites, created_at, tags, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: feats } = await query;
          if (feats) {
            allEntries.push(...feats.map(f => ({
              id: f.id,
              name: f.name,
              type: 'feats' as const,
              description: f.description,
              prerequisites: f.prerequisites,
              rarity: 'uncommon',
              tags: f.tags || [],
              created_at: f.created_at,
              source_book: f.source_book,
              source_kind: f.source_kind,
              isFavorite: favorites.has(`feats:${f.id}`) || false,
            })));
          }
        }

        // Fetch Monsters
        if (selectedCategory === 'all' || selectedCategory === 'monsters') {
          let query = supabase
            .from('compendium_monsters')
            .select('id, name, description, cr, gate_rank, is_boss, created_at, tags, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: monsters } = await query;
          if (monsters) {
            allEntries.push(...monsters.map(m => ({
              id: m.id,
              name: m.name,
              type: 'monsters' as const,
              description: m.description || '',
              cr: m.cr,
              gate_rank: m.gate_rank,
              tags: m.tags || [],
              created_at: m.created_at,
              source_book: m.source_book,
              source_kind: m.source_kind,
              isFavorite: favorites.has(`monsters:${m.id}`) || false,
            })));
          }
        }

        // Fetch Backgrounds
        if (selectedCategory === 'all' || selectedCategory === 'backgrounds') {
          let query = supabase
            .from('compendium_backgrounds')
            .select('id, name, description, created_at, tags, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: backgrounds } = await query;
          if (backgrounds) {
            allEntries.push(...backgrounds.map(b => ({
              id: b.id,
              name: b.name,
              type: 'backgrounds' as const,
              description: b.description,
              tags: b.tags || [],
              created_at: b.created_at,
              source_book: b.source_book,
              source_kind: b.source_kind,
              isFavorite: favorites.has(`backgrounds:${b.id}`) || false,
            })));
          }
        }

        // Fetch Conditions
        if (selectedCategory === 'all' || selectedCategory === 'conditions') {
          let query = supabase
            .from('compendium_conditions')
            .select('id, name, description, created_at, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: conditions } = await query;
          if (conditions) {
            allEntries.push(...conditions.map(c => ({
              id: c.id,
              name: c.name,
              type: 'conditions' as const,
              description: c.description,
              created_at: c.created_at,
              source_book: c.source_book,
              source_kind: c.source_kind,
              isFavorite: favorites.has(`conditions:${c.id}`) || false,
            })));
          }
        }

        // Fetch Skills
        if (selectedCategory === 'all' || selectedCategory === 'skills') {
          let query = supabase
            .from('compendium_skills')
            .select('id, name, description, ability, created_at, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: skills } = await query;
          if (skills) {
            allEntries.push(...skills.map(s => ({
              id: s.id,
              name: s.name,
              type: 'skills' as const,
              description: s.description,
              ability: s.ability,
              created_at: s.created_at,
              source_book: s.source_book,
              source_kind: s.source_kind,
              isFavorite: favorites.has(`skills:${s.id}`) || false,
            })));
          }
        }

        // Fetch Equipment
        if (selectedCategory === 'all' || selectedCategory === 'equipment') {
          let query = supabase
            .from('compendium_equipment')
            .select('id, name, description, equipment_type, damage, armor_class, created_at, source_book, source_kind');
          
          if (debouncedSearchQuery.trim()) {
            query = query.or(`name.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }
          
          const { data: equipment } = await query;
          if (equipment) {
            allEntries.push(...equipment.map(e => ({
              id: e.id,
              name: e.name,
              type: 'equipment' as const,
              description: e.description || '',
              equipment_type: e.equipment_type,
              created_at: e.created_at,
              source_book: e.source_book,
              source_kind: e.source_kind,
              isFavorite: favorites.has(`equipment:${e.id}`) || false,
            })));
          }
        }

        return allEntries;
      } catch (err) {
        console.error('Error fetching compendium data:', err);
        throw err;
      }
    },
    enabled: true,
  });

  // Extract unique source books
  const sourceBooks = useMemo(() => {
    const books = new Set<string>();
    entries.forEach(e => {
      if (e.source_book) books.add(e.source_book);
    });
    return Array.from(books).sort();
  }, [entries]);

  // Filter and sort entries
  const filteredAndSortedEntries = useMemo(() => {
    let filtered = [...entries];

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(e => e.isFavorite);
    }

    // Filter by source books
    if (selectedSourceBooks.length > 0) {
      filtered = filtered.filter(e => e.source_book && selectedSourceBooks.includes(e.source_book));
    }

    // Filter by spell schools (for powers)
    if (selectedSchools.length > 0) {
      filtered = filtered.filter(e => e.school && selectedSchools.includes(e.school));
    }

    // Filter by gate ranks (for monsters)
    if (selectedGateRanks.length > 0) {
      filtered = filtered.filter(e => e.gate_rank && selectedGateRanks.includes(e.gate_rank));
    }

    // Filter by rarity
    if (selectedRarities.length > 0) {
      filtered = filtered.filter(e => e.rarity && selectedRarities.includes(e.rarity));
    }

    // Filter by level
    if (minLevel !== '') {
      filtered = filtered.filter(e => e.level !== undefined && e.level >= minLevel);
    }
    if (maxLevel !== '') {
      filtered = filtered.filter(e => e.level !== undefined && e.level <= maxLevel);
    }

    // Filter by CR
    if (minCR !== '') {
      filtered = filtered.filter(e => {
        if (!e.cr) return false;
        const crNum = parseFloat(e.cr);
        return !isNaN(crNum) && crNum >= minCR;
      });
    }
    if (maxCR !== '') {
      filtered = filtered.filter(e => {
        if (!e.cr) return false;
        const crNum = parseFloat(e.cr);
        return !isNaN(crNum) && crNum <= maxCR;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'level-asc':
          return (a.level || 0) - (b.level || 0);
        case 'level-desc':
          return (b.level || 0) - (a.level || 0);
        case 'rarity-asc':
          return (rarityOrder[a.rarity || 'common'] || 0) - (rarityOrder[b.rarity || 'common'] || 0);
        case 'rarity-desc':
          return (rarityOrder[b.rarity || 'common'] || 0) - (rarityOrder[a.rarity || 'common'] || 0);
        case 'date-desc':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [entries, showFavoritesOnly, selectedSourceBooks, selectedSchools, selectedGateRanks, selectedRarities, minLevel, maxLevel, minCR, maxCR, sortBy]);

  // Paginate results
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredAndSortedEntries.slice(start, end);
  }, [filteredAndSortedEntries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedEntries.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearchQuery, showFavoritesOnly, selectedSourceBooks, selectedSchools, selectedGateRanks, selectedRarities, minLevel, maxLevel, minCR, maxCR]);

  // Load URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) setSelectedCategory(params.get('category') || 'all');
    if (params.get('search')) setSearchQuery(params.get('search') || '');
    if (params.get('favorites') === 'true') setShowFavoritesOnly(true);
    if (params.get('sources')) {
      setSelectedSourceBooks(params.get('sources')?.split(',') || []);
    }
  }, []);

  // Get counts
  const counts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => {
      if (cat.id === 'all') {
        counts.all = entries.length;
      } else {
        counts[cat.id] = entries.filter(e => e.type === cat.id).length;
      }
    });
    return counts;
  }, [entries]);

  // Get favorite count
  const favoriteCount = useMemo(() => {
    return entries.filter(e => e.isFavorite).length;
  }, [entries]);

  // Build filter chips
  const filterChips = useMemo(() => {
    const chips: Array<{ id: string; label: string; value: string; onRemove: () => void }> = [];
    
    if (showFavoritesOnly) {
      chips.push({
        id: 'favorites',
        label: 'Favorites',
        value: 'Only',
        onRemove: () => setShowFavoritesOnly(false),
      });
    }
    
    selectedSourceBooks.forEach(book => {
      chips.push({
        id: `source-${book}`,
        label: 'Source',
        value: book,
        onRemove: () => setSelectedSourceBooks(selectedSourceBooks.filter(b => b !== book)),
      });
    });
    
    selectedSchools.forEach(school => {
      chips.push({
        id: `school-${school}`,
        label: 'School',
        value: school,
        onRemove: () => setSelectedSchools(selectedSchools.filter(s => s !== school)),
      });
    });
    
    selectedGateRanks.forEach(rank => {
      chips.push({
        id: `rank-${rank}`,
        label: 'Rank',
        value: `${rank}-Rank`,
        onRemove: () => setSelectedGateRanks(selectedGateRanks.filter(r => r !== rank)),
      });
    });
    
    selectedRarities.forEach(rarity => {
      chips.push({
        id: `rarity-${rarity}`,
        label: 'Rarity',
        value: rarity.replace('_', ' '),
        onRemove: () => setSelectedRarities(selectedRarities.filter(r => r !== rarity)),
      });
    });
    
    if (minLevel !== '' || maxLevel !== '') {
      chips.push({
        id: 'level',
        label: 'Level',
        value: `${minLevel || 0}-${maxLevel || 9}`,
        onRemove: () => {
          setMinLevel('');
          setMaxLevel('');
        },
      });
    }
    
    if (minCR !== '' || maxCR !== '') {
      chips.push({
        id: 'cr',
        label: 'CR',
        value: `${minCR || 0}-${maxCR || 30}`,
        onRemove: () => {
          setMinCR('');
          setMaxCR('');
        },
      });
    }
    
    return chips;
  }, [showFavoritesOnly, selectedSourceBooks, selectedSchools, selectedGateRanks, selectedRarities, minLevel, maxLevel, minCR, maxCR]);

  const handleClearAllFilters = () => {
    setShowFavoritesOnly(false);
    setSelectedSourceBooks([]);
    setSelectedSchools([]);
    setSelectedGateRanks([]);
    setSelectedRarities([]);
    setMinLevel('');
    setMaxLevel('');
    setMinCR('');
    setMaxCR('');
  };

  const handleSourceBookToggle = (book: string) => {
    if (selectedSourceBooks.includes(book)) {
      setSelectedSourceBooks(selectedSourceBooks.filter(b => b !== book));
    } else {
      setSelectedSourceBooks([...selectedSourceBooks, book]);
    }
  };

  const handleSchoolToggle = (school: string) => {
    if (selectedSchools.includes(school)) {
      setSelectedSchools(selectedSchools.filter(s => s !== school));
    } else {
      setSelectedSchools([...selectedSchools, school]);
    }
  };

  const handleGateRankToggle = (rank: string) => {
    if (selectedGateRanks.includes(rank)) {
      setSelectedGateRanks(selectedGateRanks.filter(r => r !== rank));
    } else {
      setSelectedGateRanks([...selectedGateRanks, rank]);
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

  const handleToggleFavorite = (e: React.MouseEvent, entry: CompendiumEntry) => {
    e.preventDefault();
    e.stopPropagation();
    const wasFavorite = favorites.has(`${entry.type}:${entry.id}`);
    toggleFavorite(entry.type, entry.id);
    
    if (wasFavorite) {
      showSuccess('Removed from favorites', `${entry.name} has been removed from your favorites`);
    } else {
      showSuccess('Added to favorites', `${entry.name} has been added to your favorites`);
    }
  };

  // Highlight search terms in text (sanitized)
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-primary/20 text-primary font-semibold" aria-label={`Search match: ${part}`}>{part}</mark>
      ) : part
    );
  };

  // Get unique schools from powers
  const availableSchools = useMemo(() => {
    const schools = new Set<string>();
    entries.forEach(e => {
      if (e.school) schools.add(e.school);
    });
    return Array.from(schools).sort();
  }, [entries]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-system">
            COMPENDIUM
          </h1>
          <p className="text-muted-foreground font-heading">
            Browse the complete Solo Leveling 5e ruleset — {filteredAndSortedEntries.length} {filteredAndSortedEntries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs, powers, relics, monsters... (Ctrl+K)"
                aria-label="Search compendium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border focus:ring-2 focus:ring-primary"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]" aria-label="Sort by">
                  <ArrowUpDown className="w-4 h-4 mr-2" aria-hidden="true" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="level-asc">Level (Low-High)</SelectItem>
                  <SelectItem value="level-desc">Level (High-Low)</SelectItem>
                  <SelectItem value="rarity-asc">Rarity (Low-High)</SelectItem>
                  <SelectItem value="rarity-desc">Rarity (High-Low)</SelectItem>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Chips */}
          {filterChips.length > 0 && (
            <FilterChips
              chips={filterChips}
              onClearAll={handleClearAllFilters}
            />
          )}

          {/* Search hint */}
          {searchQuery !== debouncedSearchQuery && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Searching...
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <CompendiumSidebar
            categories={categories.map(cat => ({ ...cat, count: counts[cat.id] }))}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sourceBooks={sourceBooks}
            selectedSourceBooks={selectedSourceBooks}
            onSourceBookToggle={handleSourceBookToggle}
            schools={availableSchools}
            selectedSchools={selectedSchools}
            onSchoolToggle={handleSchoolToggle}
            gateRanks={gateRanks}
            selectedGateRanks={selectedGateRanks}
            onGateRankToggle={handleGateRankToggle}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
            favoriteCount={favoriteCount}
          />

          {/* Results Grid */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-muted-foreground font-heading">
                Showing {paginatedEntries.length} of {filteredAndSortedEntries.length} {filteredAndSortedEntries.length === 1 ? 'result' : 'results'}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="gap-2"
                  disabled={filteredAndSortedEntries.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                  disabled={filteredAndSortedEntries.length === 0}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "flex flex-col gap-2"
              )}>
                <SkeletonLoader count={itemsPerPage} variant={viewMode} />
              </div>
            ) : error ? (
              <SystemWindow title="ERROR" className="max-w-lg mx-auto">
                <div className="p-4 space-y-2">
                  <p className="text-destructive font-heading">Failed to load compendium data</p>
                  <p className="text-sm text-muted-foreground">Please try refreshing the page or check your connection.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Reload Page
                  </Button>
                </div>
              </SystemWindow>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "flex flex-col gap-2"
              )}>
                {paginatedEntries.map((entry) => (
                  <Link
                    key={`${entry.type}-${entry.id}`}
                    to={`/compendium/${entry.type}/${entry.id}`}
                    className={cn(
                      "glass-card border hover:border-primary/30 transition-all duration-200 group relative",
                      "hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      viewMode === 'grid' ? "p-4" : "p-3 flex items-center gap-4",
                      getRarityOrRankColor(entry)
                    )}
                    aria-label={`View ${entry.name} details`}
                  >
                    <button
                      onClick={(e) => handleToggleFavorite(e, entry)}
                      className={cn(
                        "absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all duration-200",
                        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        entry.isFavorite
                          ? "text-amber-400 hover:text-amber-300 bg-amber-400/10"
                          : "text-muted-foreground hover:text-amber-400 opacity-0 group-hover:opacity-100 bg-background/80 backdrop-blur-sm"
                      )}
                      aria-label={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart className={cn("w-4 h-4 transition-all", entry.isFavorite && "fill-current")} />
                    </button>

                    {viewMode === 'grid' ? (
                      <>
                        <div className="flex items-start justify-between mb-2">
                          <span className={cn(
                            "text-xs font-display uppercase",
                            getRarityOrRankColor(entry)
                          )}>
                            {getRarityOrRankLabel(entry)}
                          </span>
                          <div className="flex items-center gap-2">
                            {entry.source_book && (
                              <Badge variant="outline" className="text-xs">
                                {entry.source_book}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground capitalize">
                              {entry.type}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {highlightText(entry.name, searchQuery)}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {highlightText(entry.description, searchQuery)}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          {entry.cr && (
                            <span>CR {entry.cr}</span>
                          )}
                          {entry.school && (
                            <span>• {entry.school}</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <span className={cn(
                          "text-xs font-display uppercase w-24 flex-shrink-0",
                          getRarityOrRankColor(entry)
                        )}>
                          {getRarityOrRankLabel(entry)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                            {highlightText(entry.name, searchQuery)}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {highlightText(entry.description, searchQuery)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {entry.source_book && (
                            <Badge variant="outline" className="text-xs">
                              {entry.source_book}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground capitalize">
                            {entry.type}
                          </span>
                        </div>
                      </>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && filteredAndSortedEntries.length === 0 && (
              <EmptyState
                type={showFavoritesOnly ? 'no-favorites' : searchQuery || filterChips.length > 0 ? 'no-results' : 'no-category'}
                searchQuery={searchQuery}
                onClearFilters={handleClearAllFilters}
                onClearSearch={() => setSearchQuery('')}
              />
            )}

            {/* Pagination */}
            {!isLoading && filteredAndSortedEntries.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredAndSortedEntries.length}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Compendium;
