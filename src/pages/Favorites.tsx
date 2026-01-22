import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink, Trash2, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { resolveRefs, isValidEntryType, type EntryType } from '@/lib/compendiumResolver';
import { formatMonarchVernacular, normalizeMonarchSearch } from '@/lib/vernacular';

interface FavoriteItem {
  id: string;
  entryId: string;
  type: EntryType;
  name: string;
  displayName?: string;
  description?: string;
  tags?: string[];
  source_book?: string;
  rarity?: string;
  gate_rank?: string;
  level?: number;
  cr?: string;
}

const Favorites = () => {
  const { favorites, toggleFavorite, isLoading: favoritesLoading } = useFavorites();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const canonicalQuery = normalizeMonarchSearch(searchQuery.toLowerCase());

  const favoriteKeys = useMemo(() => Array.from(favorites).sort(), [favorites]);
  const favoriteRefs = useMemo(
    () =>
      favoriteKeys
        .map((favoriteId) => {
          const [type, id] = favoriteId.split(':');
          if (!type || !id) return null;
          if (!isValidEntryType(type)) return null;
          return { type: type as EntryType, id };
        })
        .filter(Boolean) as Array<{ type: EntryType; id: string }>,
    [favoriteKeys]
  );

  const { data: favoriteItems = [], isLoading: favoritesDetailLoading } = useQuery({
    queryKey: ['favorite-items', favoriteKeys],
    queryFn: async () => {
      if (favoriteRefs.length === 0) return [];
      const resolved = await resolveRefs(favoriteRefs);
      return favoriteRefs
        .map((ref) => {
          const entry = resolved.get(`${ref.type}:${ref.id}`);
          if (!entry) return null;

          const entryData = entry as Record<string, unknown>;
          const displayName =
            typeof entryData.display_name === 'string' && entryData.display_name.trim()
              ? entryData.display_name
              : entry.name;
          const description =
            typeof entryData.description === 'string' ? entryData.description : undefined;
          const tags = Array.isArray(entryData.tags)
            ? entryData.tags.filter((tag) => typeof tag === 'string')
            : undefined;
          const sourceBook =
            typeof entryData.source_book === 'string' ? entryData.source_book : undefined;
          const rarity = typeof entryData.rarity === 'string' ? entryData.rarity : undefined;
          const gateRank =
            typeof entryData.gate_rank === 'string' ? entryData.gate_rank : undefined;
          const level = typeof entryData.level === 'number' ? entryData.level : undefined;
          const cr = typeof entryData.cr === 'string' ? entryData.cr : undefined;

          return {
            id: `${ref.type}:${ref.id}`,
            entryId: ref.id,
            type: ref.type,
            name: entry.name,
            displayName,
            description,
            tags,
            source_book: sourceBook,
            rarity,
            gate_rank: gateRank,
            level,
            cr,
          } as FavoriteItem;
        })
        .filter(Boolean) as FavoriteItem[];
    },
    enabled: favoriteRefs.length > 0,
  });

  const filteredItems = useMemo(
    () =>
      favoriteItems.filter((item) => {
        const matchesSearch =
          !searchQuery ||
          normalizeMonarchSearch(item.name.toLowerCase()).includes(canonicalQuery) ||
          normalizeMonarchSearch(item.displayName?.toLowerCase() || '').includes(canonicalQuery) ||
          normalizeMonarchSearch(item.description?.toLowerCase() || '').includes(canonicalQuery);

        const matchesType = filterType === 'all' || item.type === filterType;

        return matchesSearch && matchesType;
      }),
    [favoriteItems, searchQuery, filterType, canonicalQuery]
  );

  const types = useMemo(
    () => Array.from(new Set(favoriteItems.map((item) => item.type))).sort(),
    [favoriteItems]
  );

  const handleRemoveFavorite = (entryType: EntryType, entryId: string) => {
    toggleFavorite(entryType, entryId);
    toast({
      title: 'Removed from favorites',
      description: 'Item has been removed from your favorites',
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      monsters: 'border-red-500/30 bg-red-500/10',
      powers: 'border-blue-500/30 bg-blue-500/10',
      spells: 'border-purple-500/30 bg-purple-500/10',
      equipment: 'border-green-500/30 bg-green-500/10',
      feats: 'border-yellow-500/30 bg-yellow-500/10',
      skills: 'border-orange-500/30 bg-orange-500/10',
      backgrounds: 'border-gray-500/30 bg-gray-500/10',
      monarchs: 'border-indigo-500/30 bg-indigo-500/10',
      relics: 'border-amber-500/30 bg-amber-500/10',
      jobs: 'border-cyan-500/30 bg-cyan-500/10',
      paths: 'border-teal-500/30 bg-teal-500/10',
      runes: 'border-lime-500/30 bg-lime-500/10',
      sovereigns: 'border-rose-500/30 bg-rose-500/10',
      'shadow-soldiers': 'border-slate-500/30 bg-slate-500/10',
      items: 'border-emerald-500/30 bg-emerald-500/10',
      techniques: 'border-fuchsia-500/30 bg-fuchsia-500/10',
      artifacts: 'border-sky-500/30 bg-sky-500/10',
      locations: 'border-stone-500/30 bg-stone-500/10',
    };
    return colors[type] || 'border-border bg-muted';
  };

  const favoritesCount = favorites.size;
  const isBusy = favoritesLoading || favoritesDetailLoading;

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-system">
            FAVORITES
          </h1>
          <p className="text-muted-foreground font-heading">
            Your favorite compendium entries - {favoritesCount}{' '}
            {favoritesCount === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
              aria-label="Filter by type"
              title="Filter favorites by type"
            >
              <option value="all">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {formatMonarchVernacular(type.charAt(0).toUpperCase() + type.slice(1))}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {isBusy ? (
          <SystemWindow title="LOADING FAVORITES" className="max-w-lg mx-auto">
            <div className="p-4 text-center">
              <p className="text-muted-foreground">Loading your favorites...</p>
            </div>
          </SystemWindow>
        ) : filteredItems.length === 0 ? (
          <SystemWindow title="NO FAVORITES" className="max-w-lg mx-auto">
            <div className="p-4 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {favoritesCount === 0
                  ? "You haven't added any favorites yet. Browse the compendium and click the heart icon to add items to your favorites."
                  : 'No favorites match your search criteria.'}
              </p>
              {favoritesCount === 0 && (
                <Link to="/compendium">
                  <Button>Browse Compendium</Button>
                </Link>
              )}
            </div>
          </SystemWindow>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => {
              const typeLabel = formatMonarchVernacular(item.type.replace(/-/g, ' '));
              const displayType = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);

              return (
                <SystemWindow
                  key={item.id}
                  title={formatMonarchVernacular(item.displayName || item.name)}
                  className="glass-card"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={cn('text-xs', getTypeColor(item.type))}>
                            {displayType}
                          </Badge>
                          {item.rarity && (
                            <Badge variant="secondary" className="text-xs">
                              {formatMonarchVernacular(item.rarity)}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                          {formatMonarchVernacular(item.displayName || item.name)}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {formatMonarchVernacular(item.description)}
                          </p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {formatMonarchVernacular(tag)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/compendium/${item.type}/${item.entryId}`}>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveFavorite(item.type, item.entryId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </SystemWindow>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
