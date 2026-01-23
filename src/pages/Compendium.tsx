import { useState, useEffect, useMemo } from 'react';
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
  Package,
  Dna,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { isSupabaseConfigured } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useFavorites } from '@/hooks/useFavorites';
import { CompendiumSidebar } from '@/components/compendium/CompendiumSidebar';
import { FilterChips } from '@/components/compendium/FilterChips';
import { SearchHistoryDropdown } from '@/components/compendium/SearchHistoryDropdown';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useFilterPersistence } from '@/hooks/useFilterPersistence';
import { parseSearchQuery } from '@/lib/searchOperators';
import { SkeletonLoader } from '@/components/compendium/SkeletonLoader';
import { EmptyState } from '@/components/compendium/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { GeminiProtocolGenerator } from '@/components/compendium/GeminiProtocolGenerator';
import { CompendiumImage } from '@/components/compendium/CompendiumImage';
import { staticDataProvider } from '@/data/compendium/staticDataProvider';
import type { StaticCompendiumEntry } from '@/data/compendium/staticDataProvider';
import { formatMonarchVernacular, MONARCH_LABEL, MONARCH_LABEL_PLURAL } from '@/lib/vernacular';
import { isSetupRouteEnabled } from '@/lib/setupAccess';

import { CompendiumEntry } from '@/hooks/useStartupData';

type SortOption = 'name-asc' | 'name-desc' | 'level-asc' | 'level-desc' | 'rarity-asc' | 'rarity-desc' | 'date-desc';

const categories = [
  { id: 'all', name: 'All', icon: Grid3X3 },
  
  // Character Foundation
  { id: 'backgrounds', name: 'Backgrounds', icon: Users },
  { id: 'jobs', name: 'Classes', icon: Swords },
  { id: 'paths', name: 'Paths', icon: GitBranch },
  { id: 'monarchs', name: MONARCH_LABEL_PLURAL, icon: Crown },
  
  // Abilities & Skills
  { id: 'feats', name: 'Feats', icon: Sparkles },
  { id: 'skills', name: 'Skills', icon: Dna },
  { id: 'powers', name: 'Powers', icon: Wand2 },
  { id: 'techniques', name: 'Techniques', icon: Package },
  
  // Magic & Equipment
  { id: 'spells', name: 'Spells', icon: ScrollText },
  { id: 'runes', name: 'Runes', icon: Gem },
  { id: 'relics', name: 'Relics', icon: Skull },
  { id: 'artifacts', name: 'Artifacts', icon: Crown },
  
  // World & Entities
  { id: 'monsters', name: 'Monsters', icon: Skull },
  { id: 'locations', name: 'Locations', icon: MapPin },
  { id: 'conditions', name: 'Conditions', icon: AlertTriangle },
  { id: 'shadow-soldiers', name: 'Umbral Legion', icon: Users },
  
  // Items
  { id: 'items', name: 'Items', icon: Package }
];

// Enhanced rarity colors with System Ascendant theme
const rarityColors: Record<string, string> = {
  'common': 'text-muted-foreground border-muted',
  'uncommon': 'text-accent border-accent/40',
  'rare': 'text-shadow-blue border-shadow-blue/40',
  'very_rare': 'text-shadow-purple border-shadow-purple/40',
  'legendary': 'text-monarch-gold border-monarch-gold/40 shadow-[0_0_8px_hsl(var(--monarch-gold)/0.3)]',
};

// Enhanced gate rank colors with System Ascendant theme
const gateRankColors: Record<string, string> = {
  'E': 'text-gate-e border-gate-e/40',
  'D': 'text-gate-d border-gate-d/40',
  'C': 'text-gate-c border-gate-c/40',
  'B': 'text-gate-b border-gate-b/40 shadow-[0_0_6px_hsl(var(--gate-b)/0.3)]',
  'A': 'text-gate-a border-gate-a/40 shadow-[0_0_8px_hsl(var(--gate-a)/0.4)]',
  'S': 'text-gate-s border-gate-s/40 shadow-[0_0_10px_hsl(var(--gate-s)/0.5)]',
  'SS': 'text-gate-ss border-gate-ss/40 shadow-[0_0_12px_hsl(var(--gate-ss)/0.6)]',
};

const rarityOrder: Record<string, number> = {
  'common': 1,
  'uncommon': 2,
  'rare': 3,
  'very_rare': 4,
  'legendary': 5,
};

const gateRanks = ['E', 'D', 'C', 'B', 'A', 'S', 'SS'];

const Compendium = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const parsedQuery = useMemo(() => parseSearchQuery(debouncedSearchQuery), [debouncedSearchQuery]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [minLevel, setMinLevel] = useState<number | ''>('');
  const [maxLevel, setMaxLevel] = useState<number | ''>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSourceBooks, setSelectedSourceBooks] = useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedGateRanks, setSelectedGateRanks] = useState<string[]>([]);
  const [showBossOnly, setShowBossOnly] = useState(false);
  const [showMiniBossOnly, setShowMiniBossOnly] = useState(false);
  const [minCR, setMinCR] = useState<number | ''>('');
  const [maxCR, setMaxCR] = useState<number | ''>('');
  const [showGeminiProtocol, setShowGeminiProtocol] = useState(false);
  const itemsPerPage = 24;
  
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const isE2E = import.meta.env.VITE_E2E === 'true';
  const setupRouteEnabled = isSetupRouteEnabled();
  const showSetup = !isSupabaseConfigured && setupRouteEnabled && !isE2E;

  // Fetch compendium data (using comprehensive static data loading)
  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['compendium', selectedCategory, parsedQuery.text, parsedQuery.operators, currentPage],
    queryFn: async () => {
      logger.debug('=== COMPREHENSIVE DATA LOADING ===');
      logger.debug('Query called with:', { 
        selectedCategory, 
        searchQuery: parsedQuery.text,
        isSupabaseConfigured
      });
      
      const allEntries: CompendiumEntry[] = [];

      // Always use static data provider for comprehensive loading
      logger.debug('Using comprehensive static data provider');
      
      // Use static data provider - fetch ALL categories for comprehensive loading
      const categories = ['backgrounds', 'jobs', 'paths', 'monarchs', 'feats', 'skills', 'powers', 'techniques', 'spells', 'runes', 'relics', 'artifacts', 'monsters', 'locations', 'conditions', 'shadow-soldiers', 'items'] as const;
      
      for (const category of categories) {
        if (selectedCategory === 'all' || selectedCategory === category) {
          logger.debug(`Fetching ${category} data...`);
          let data: StaticCompendiumEntry[] = [];
          
          try {
            switch (category) {
              case 'backgrounds':
                data = await staticDataProvider.getBackgrounds(parsedQuery.text);
                break;
              case 'jobs':
                data = await staticDataProvider.getJobs(parsedQuery.text);
                break;
              case 'paths':
                data = await staticDataProvider.getPaths(parsedQuery.text);
                break;
              case 'monarchs':
                data = await staticDataProvider.getMonarchs(parsedQuery.text);
                break;
              case 'feats':
                data = await staticDataProvider.getFeats(parsedQuery.text);
                break;
              case 'skills':
                data = await staticDataProvider.getSkills(parsedQuery.text);
                break;
              case 'powers':
                data = await staticDataProvider.getPowers(parsedQuery.text);
                break;
              case 'techniques':
                data = await staticDataProvider.getTechniques(parsedQuery.text);
                break;
              case 'spells':
                data = await staticDataProvider.getSpells(parsedQuery.text);
                break;
              case 'runes':
                data = await staticDataProvider.getRunes(parsedQuery.text);
                break;
              case 'relics':
                data = await staticDataProvider.getRelics(parsedQuery.text);
                break;
              case 'artifacts':
                data = await staticDataProvider.getArtifacts(parsedQuery.text);
                break;
              case 'monsters':
                data = await staticDataProvider.getMonsters(parsedQuery.text);
                break;
              case 'locations':
                data = await staticDataProvider.getLocations(parsedQuery.text);
                break;
              case 'conditions':
                data = await staticDataProvider.getConditions(parsedQuery.text);
                break;
              case 'shadow-soldiers':
                data = await staticDataProvider.getShadowSoldiers(parsedQuery.text);
                break;
              case 'items':
                data = await staticDataProvider.getItems(parsedQuery.text);
                break;
            }
            
            logger.debug(`Got ${data.length} ${category} entries`);
            
            allEntries.push(...data.map(item => ({
              id: item.id,
              name: item.display_name || item.name,
              type: category,
              description: item.description || 'No description available',
              rarity: item.rarity || 'common',
              tags: item.tags || [],
              created_at: item.created_at,
              source_book: item.source_book,
              image_url: item.image_url,
              isFavorite: favorites.has(`${category}:${item.id}`) || false,
              // Include type-specific fields
              ...(category === 'monsters' && {
                cr: item.cr,
                gate_rank: item.gate_rank,
                is_boss: item.is_boss,
              }),
              ...(category === 'powers' && {
                power_level: item.power_level,
                school: item.school,
              }),
              ...(category === 'runes' && {
                rune_type: item.rune_type,
                rune_category: item.rune_category,
                level: item.rune_level,
              }),
              ...(category === 'skills' && {
                ability: item.ability,
              }),
              ...(category === 'feats' && {
                prerequisites: item.prerequisites,
              }),
              ...(category === 'monarchs' && {
                title: item.title,
                theme: item.theme,
              }),
            })));
          } catch (error) {
            logger.error(`Error fetching ${category}:`, error);
          }
        }
      }

      logger.debug('=== TOTAL ENTRIES LOADED ===:', allEntries.length);
      return allEntries;
    },
    enabled: true, // Always enable this query since we have both Supabase and static data fallback
  });

  // Track search history
  const { addToHistory } = useSearchHistory();
  useEffect(() => {
    if (debouncedSearchQuery.trim() && entries.length > 0) {
      addToHistory(debouncedSearchQuery, {
        category: selectedCategory,
        rarities: selectedRarities,
        schools: selectedSchools,
      }, entries.length);
    }
  }, [debouncedSearchQuery, entries.length, selectedCategory, selectedRarities, selectedSchools, addToHistory]);

  // Persist filters
  const [filters, setFilters] = useFilterPersistence('compendium', {
    selectedCategory: 'all',
    viewMode: 'grid' as 'grid' | 'list',
    sortBy: 'name-asc' as SortOption,
    selectedRarities: [] as string[],
    minLevel: '' as number | '',
    maxLevel: '' as number | '',
    showFavoritesOnly: false,
    selectedSourceBooks: [] as string[],
    selectedSchools: [] as string[],
    selectedGateRanks: [] as string[],
    showBossOnly: false,
    showMiniBossOnly: false,
    minCR: '' as number | '',
    maxCR: '' as number | '',
  });

  // Load persisted filters on mount
  useEffect(() => {
    setSelectedCategory(filters.selectedCategory);
    setViewMode(filters.viewMode);
    setSortBy(filters.sortBy);
    setSelectedRarities(filters.selectedRarities);
    setMinLevel(filters.minLevel);
    setMaxLevel(filters.maxLevel);
    setShowFavoritesOnly(filters.showFavoritesOnly);
    setSelectedSourceBooks(filters.selectedSourceBooks);
    setSelectedSchools(filters.selectedSchools);
    setSelectedGateRanks(filters.selectedGateRanks);
    setShowBossOnly(filters.showBossOnly);
    setShowMiniBossOnly(filters.showMiniBossOnly);
    setMinCR(filters.minCR);
    setMaxCR(filters.maxCR);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- Intentional one-time hydration from localStorage-backed state.

  // Save filters when they change
  useEffect(() => {
    setFilters({
      selectedCategory,
      viewMode,
      sortBy,
      selectedRarities,
      minLevel,
      maxLevel,
      showFavoritesOnly,
      selectedSourceBooks,
      selectedSchools,
      selectedGateRanks,
      showBossOnly,
      showMiniBossOnly,
      minCR,
      maxCR,
    });
  }, [
    selectedCategory, viewMode, sortBy, selectedRarities, minLevel, maxLevel,
    showFavoritesOnly, selectedSourceBooks, selectedSchools, selectedGateRanks,
    showBossOnly, showMiniBossOnly, minCR, maxCR, setFilters
  ]);

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

    // Filter by power schools (for powers)
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

    // Filter by boss/mini-boss
    if (showBossOnly) {
      filtered = filtered.filter(e => e.is_boss === true);
    }
    if (showMiniBossOnly) {
      filtered = filtered.filter(e => e.tags?.includes('mini-boss') === true);
    }

    // Filter by named NPCs/bosses (if tag exists)
    // Named NPCs have 'named-npc' or 'named-boss' tags

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
  }, [entries, showFavoritesOnly, selectedSourceBooks, selectedSchools, selectedGateRanks, selectedRarities, minLevel, maxLevel, minCR, maxCR, showBossOnly, showMiniBossOnly, sortBy]);

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
    const displayName = formatMonarchVernacular(entry.name);
    
    if (wasFavorite) {
      toast({ title: 'Removed from favorites', description: `${displayName} has been removed from your favorites` });
    } else {
      toast({ title: 'Added to favorites', description: `${displayName} has been added to your favorites` });
    }
  };

  const handleExport = () => {
    const dataStr = formatMonarchVernacular(JSON.stringify(filteredAndSortedEntries, null, 2));
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compendium-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Export complete',
      description: `Exported ${filteredAndSortedEntries.length} entries.`,
    });
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    if (showFavoritesOnly) params.set('favorites', 'true');
    if (selectedSourceBooks.length > 0) params.set('sources', selectedSourceBooks.join(','));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link copied',
        description: 'Shareable link copied to clipboard.',
      });
    }).catch(() => {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    });
  };

  // Highlight search terms in text (sanitized)
  const highlightText = (text: string, query: string) => {
    const displayText = formatMonarchVernacular(text);
    const displayQuery = formatMonarchVernacular(query);
    if (!displayQuery.trim()) return displayText;
    const escapedQuery = displayQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = displayText.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === displayQuery.toLowerCase() ? (
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
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-system" role="heading">
            COMPENDIUM
          </h1>
          <p className="text-muted-foreground font-heading">
            Browse the complete System Ascendant 5e SRD ruleset — {filteredAndSortedEntries.length} {filteredAndSortedEntries.length === 1 ? 'entry' : 'entries'}
          </p>
        </header>

        {/* Search and Controls */}
        <section className="flex flex-col gap-4 mb-6" aria-label="Search and filters">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <Input
                  placeholder="Search... (e.g., fire damage, type:power, level:>3)"
                  aria-label="Search compendium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border focus:ring-2 focus:ring-primary"
                  autoComplete="off"
                  spellCheck="false"
                  title="Advanced search: type:jobs, level:>3, rarity:rare, school:evocation, cr:>5, tag:boss, source:core"
                />
              </div>
              <SearchHistoryDropdown
                onSelect={(query) => setSearchQuery(query)}
              />
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]" aria-label="Sort by">
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
        </section>

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
            showBossOnly={showBossOnly}
            onToggleBossOnly={() => setShowBossOnly(!showBossOnly)}
            showMiniBossOnly={showMiniBossOnly}
            onToggleMiniBossOnly={() => setShowMiniBossOnly(!showMiniBossOnly)}
          />

          {/* Results Grid */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-muted-foreground font-heading">
                Showing {paginatedEntries.length} of {filteredAndSortedEntries.length} {filteredAndSortedEntries.length === 1 ? 'result' : 'results'}
              </p>
              <div className="flex gap-2">
                <Dialog open={showGeminiProtocol} onOpenChange={setShowGeminiProtocol}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-primary/50 hover:border-primary hover:bg-primary/10"
                    >
                      <Dna className="w-4 h-4 text-primary" />
                      Gemini Protocol
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)]">
                    <DialogHeader>
                      <DialogTitle>Gemini Protocol</DialogTitle>
                      <DialogDescription>
                        Fuse Job, Path, and {MONARCH_LABEL} essences into a Sovereign overlay.
                      </DialogDescription>
                    </DialogHeader>
                    <GeminiProtocolGenerator />
                  </DialogContent>
                </Dialog>
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

            {showSetup ? (
              <SystemWindow title="SETUP REQUIRED" className="max-w-lg mx-auto">
                <div className="p-4 space-y-2">
                  <p className="text-destructive font-heading">Compendium data is unavailable</p>
                  <p className="text-sm text-muted-foreground">
                    Configure Supabase to load compendium content.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.assign('/setup')}
                    className="mt-4"
                  >
                    Go to Setup
                  </Button>
                </div>
              </SystemWindow>
            ) : isLoading ? (
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
                        <div className="mb-3">
                          <CompendiumImage
                            src={entry.image_url}
                            alt={entry.name}
                            size="thumbnail"
                            aspectRatio="square"
                            className="w-full"
                            fallbackIcon={(() => {
                              const IconMap: Record<string, typeof Swords> = {
                                jobs: Swords,
                                powers: Wand2,
                                relics: Gem,
                                monsters: Skull,
                                equipment: Package,
                              };
                              const Icon = IconMap[entry.type] || Package;
                              return <Icon className="w-8 h-8 text-muted-foreground" />;
                            })()}
                          />
                        </div>
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
                        <CompendiumImage
                          src={entry.image_url}
                          alt={entry.name}
                          size="thumbnail"
                          aspectRatio="square"
                          className="flex-shrink-0"
                          fallbackIcon={(() => {
                            const IconMap: Record<string, typeof Swords> = {
                              jobs: Swords,
                              powers: Wand2,
                              relics: Gem,
                              monsters: Skull,
                              equipment: Package,
                            };
                            const Icon = IconMap[entry.type] || Package;
                            return <Icon className="w-8 h-8 text-muted-foreground" />;
                          })()}
                        />
                        <span className={cn(
                          "text-xs font-display uppercase w-24 flex-shrink-0",
                          getRarityOrRankColor(entry)
                        )}>
                          {getRarityOrRankLabel(entry)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-semibold group-hover:text-primary transition-colors leading-tight">
                            {highlightText(entry.name, searchQuery)}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1 leading-relaxed">
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



