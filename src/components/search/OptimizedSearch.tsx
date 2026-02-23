import { useState, useMemo, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search, Filter, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchOptions {
  category: string;
  rarity: string;
  source: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface OptimizedSearchProps {
  data: any[];
  onSearch: (results: any[], query: string) => void;
  onFilterChange?: (filters: SearchOptions) => void;
  placeholder?: string;
  className?: string;
}

// Virtual scrolling for large lists
const VirtualList = ({ 
  items, 
  itemHeight = 60, 
  containerHeight = 400,
  renderItem 
}: {
  items: any[];
  itemHeight?: number;
  containerHeight?: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const offsetY = visibleStart * itemHeight;
  
  return (
    <div 
      className="overflow-auto border rounded-md"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={visibleStart + index} style={{ height: itemHeight }}>
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fuzzy search implementation
const fuzzySearch = (query: string, items: any[], searchFields: string[]) => {
  if (!query.trim()) return items;
  
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(' ').filter(term => term.length > 0);
  
  return items.filter(item => {
    return queryTerms.every(term => 
      searchFields.some(field => {
        const fieldValue = item[field]?.toString().toLowerCase() || '';
        return fieldValue.includes(term);
      })
    );
  });
};

// Advanced filtering with caching
const useAdvancedFiltering = (data: any[], filters: SearchOptions) => {
  return useMemo(() => {
    let filtered = [...data];
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }
    
    // Rarity filter
    if (filters.rarity && filters.rarity !== 'all') {
      filtered = filtered.filter(item => item.rarity === filters.rarity);
    }
    
    // Source filter
    if (filters.source && filters.source !== 'all') {
      filtered = filtered.filter(item => item.source === filters.source);
    }
    
    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy] || '';
        const bVal = b[filters.sortBy] || '';
        
        const comparison = aVal.localeCompare(bVal);
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    return filtered;
  }, [data, filters]);
};

export const OptimizedSearch = ({ 
  data, 
  onSearch, 
  onFilterChange, 
  placeholder = "Search compendium...",
  className 
}: OptimizedSearchProps) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchOptions>({
    category: 'all',
    rarity: 'all',
    source: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchIndex, setSearchIndex] = useState(0);
  
  const debouncedQuery = useDebounce(query, 300);
  
  // Create search index for faster searching
  const searchIndexMap = useMemo(() => {
    const index = new Map();
    data.forEach((item, idx) => {
      const searchText = [
        item.name,
        item.description,
        item.category,
        item.tags?.join(' ') || ''
      ].join(' ').toLowerCase();
      index.set(idx, searchText);
    });
    return index;
  }, [data]);
  
  // Optimized search with indexing
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      onSearch(data, searchQuery);
      return;
    }
    
    const results: any[] = [];
    const queryLower = searchQuery.toLowerCase();
    
    // Use pre-built index for faster search
    searchIndexMap.forEach((searchText, idx) => {
      if (searchText.includes(queryLower)) {
        results.push(data[idx]);
      }
    });
    
    onSearch(results, searchQuery);
  }, [data, searchIndexMap, onSearch]);
  
  // Apply debounced search
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);
  
  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => {
    const categories = [...new Set(data.map(item => item.category).filter(Boolean))];
    const rarities = [...new Set(data.map(item => item.rarity).filter(Boolean))];
    const sources = [...new Set(data.map(item => item.source).filter(Boolean))];
    
    return { categories, rarities, sources };
  }, [data]);
  
  const handleFilterChange = (newFilters: Partial<SearchOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };
  
  const clearFilters = () => {
    setFilters({
      category: 'all',
      rarity: 'all',
      source: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setQuery('');
  };
  
  const activeFiltersCount = Object.values(filters).filter(val => val !== 'all').length;
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar with Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-20"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md border transition-colors",
                  "hover:bg-muted",
                  activeFiltersCount > 0 && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </button>
            </div>
          </div>
          
          {/* Search Stats */}
          <div className="mt-2 text-sm text-muted-foreground">
            {data.length > 0 && (
              <span>
                Searching through <strong>{data.length.toLocaleString()}</strong> items
                {query && <span> for "<strong>{query}</strong>"</span>}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange({ category: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Rarity Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rarity</label>
                <select
                  value={filters.rarity}
                  onChange={(e) => handleFilterChange({ rarity: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">All Rarities</option>
                  {filterOptions.rarities.map(rarity => (
                    <option key={rarity} value={rarity}>
                      {rarity}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Source Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <select
                  value={filters.source}
                  onChange={(e) => handleFilterChange({ source: e.target.value })}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="all">All Sources</option>
                  {filterOptions.sources.map(source => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <div className="flex gap-2">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                    className="flex-1 p-2 border rounded-md text-sm"
                  >
                    <option value="name">Name</option>
                    <option value="level">Level</option>
                    <option value="rarity">Rarity</option>
                    <option value="category">Category</option>
                  </select>
                  <button
                    onClick={() => handleFilterChange({ 
                      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                    })}
                    className="px-2 py-1 border rounded-md text-sm hover:bg-muted"
                  >
                    {filters.sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Search Suggestions */}
      {query && query.length > 2 && (
        <Card>
          <CardContent className="p-2">
            <div className="text-sm text-muted-foreground mb-2">Quick Suggestions:</div>
            <div className="flex flex-wrap gap-2">
              {['Destroyer', 'Mage', 'Longsword', 'Fireball', 'Healing Potion'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Performance monitoring hook
export const useSearchPerformance = () => {
  const [metrics, setMetrics] = useState({
    searchTime: 0,
    resultCount: 0,
    cacheHitRate: 0
  });
  
  const measureSearch = useCallback((searchFn: () => any[]) => {
    const start = performance.now();
    const results = searchFn();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      searchTime: end - start,
      resultCount: results.length
    }));
    
    return results;
  }, []);
  
  return { metrics, measureSearch };
};

export default OptimizedSearch;
