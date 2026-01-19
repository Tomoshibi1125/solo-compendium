import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink, Trash2, Search, Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FavoriteItem {
  id: string;
  type: string;
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
  const { favorites, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);

  // Parse favorites into items
  useEffect(() => {
    const items: FavoriteItem[] = [];
    
    favorites.forEach((favoriteId) => {
      const [type, id] = favoriteId.split(':');
      if (type && id) {
        // This is a simplified version - in a real app you'd fetch from your data source
        items.push({
          id: favoriteId,
          type,
          name: id,
          displayName: id,
          description: `A ${type} from the compendium`,
          tags: [type],
          source_book: 'Core',
        });
      }
    });
    
    setFavoriteItems(items);
  }, [favorites]);

  // Filter items
  const filteredItems = favoriteItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Get unique types for filter
  const types = Array.from(new Set(favoriteItems.map(item => item.type)));

  const handleRemoveFavorite = (favoriteId: string) => {
    const [type, id] = favoriteId.split(':');
    if (type && id) {
      toggleFavorite(type, id);
      toast({
        title: 'Removed from favorites',
        description: 'Item has been removed from your favorites',
      });
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      monster: 'border-red-500/30 bg-red-500/10',
      power: 'border-blue-500/30 bg-blue-500/10',
      spell: 'border-purple-500/30 bg-purple-500/10',
      equipment: 'border-green-500/30 bg-green-500/10',
      feat: 'border-yellow-500/30 bg-yellow-500/10',
      skill: 'border-orange-500/30 bg-orange-500/10',
      background: 'border-gray-500/30 bg-gray-500/10',
      monarch: 'border-indigo-500/30 bg-indigo-500/10',
    };
    return colors[type] || 'border-border bg-muted';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 gradient-text-system">
            FAVORITES
          </h1>
          <p className="text-muted-foreground font-heading">
            Your favorite compendium entries — {favoriteItems.length} {favoriteItems.length === 1 ? 'item' : 'items'}
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
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredItems.length === 0 ? (
          <SystemWindow title="NO FAVORITES" className="max-w-lg mx-auto">
            <div className="p-4 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {favoriteItems.length === 0 
                  ? "You haven't added any favorites yet. Browse the compendium and click the heart icon to add items to your favorites."
                  : "No favorites match your search criteria."
                }
              </p>
              {favoriteItems.length === 0 && (
                <Link to="/compendium">
                  <Button>
                    Browse Compendium
                  </Button>
                </Link>
              )}
            </div>
          </SystemWindow>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <SystemWindow key={item.id} title={item.displayName || item.name} className="glass-card">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={cn("text-xs", getTypeColor(item.type))}>
                          {item.type}
                        </Badge>
                        {item.rarity && (
                          <Badge variant="secondary" className="text-xs">
                            {item.rarity}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{item.displayName || item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/compendium/${item.type}/${item.name}`}>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFavorite(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </SystemWindow>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
