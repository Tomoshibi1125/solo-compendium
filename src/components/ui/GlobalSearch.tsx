import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, Clock, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { useRecentItems } from '@/hooks/useRecentItems';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  description?: string;
  href: string;
}

export function GlobalSearch({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [isOpen, setIsOpen] = useState(false);
  const { recentItems, addRecentItem } = useRecentItems();

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['global-search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];

      const allResults: SearchResult[] = [];

      // Search across all compendium types
      const tables = [
        { table: 'compendium_jobs', type: 'jobs' },
        { table: 'compendium_job_paths', type: 'paths' },
        { table: 'compendium_powers', type: 'powers' },
        { table: 'compendium_relics', type: 'relics' },
        { table: 'compendium_monsters', type: 'monsters' },
        { table: 'compendium_shadow_soldiers', type: 'shadow-soldiers' },
        { table: 'compendium_feats', type: 'feats' },
        { table: 'compendium_skills', type: 'skills' },
      ];

      for (const { table, type } of tables) {
        try {
          const { data } = await supabase
            .from(table)
            .select('id, name, description')
            .or(`name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
            .limit(5);

          if (data) {
            allResults.push(...data.map((item: { id: string; name: string; description?: string }) => ({
              id: item.id,
              name: item.name,
              type,
              description: item.description,
              href: `/compendium/${type}/${item.id}`,
            })));
          }
        } catch (error) {
          console.error(`Error searching ${table}:`, error);
        }
      }

      // Search characters
      try {
        const { data } = await supabase
          .from('characters')
          .select('id, name')
          .ilike('name', `%${debouncedQuery}%`)
          .limit(5);

        if (data) {
          allResults.push(...data.map((char: { id: string; name: string }) => ({
            id: char.id,
            name: char.name,
            type: 'characters',
            href: `/characters/${char.id}`,
          })));
        }
      } catch (error) {
        console.error('Error searching characters:', error);
      }

      return allResults.slice(0, 10);
    },
    enabled: debouncedQuery.length > 0,
  });

  const handleResultClick = (result: SearchResult) => {
    addRecentItem(result);
    navigate(result.href);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search everything... (Ctrl+K)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <SystemWindow title="SEARCH RESULTS" className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : query.trim() === '' ? (
              <div>
                {recentItems.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-heading text-muted-foreground">RECENT ITEMS</span>
                    </div>
                    <div className="space-y-1">
                      {recentItems.slice(0, 5).map((item) => (
                        <button
                          key={`${item.type}-${item.id}`}
                          onClick={() => handleResultClick(item)}
                          className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground text-center py-4">
                  Start typing to search...
                </p>
              </div>
            ) : results.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No results found for "{query}"
              </p>
            ) : (
              <div className="space-y-1">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading text-sm">{result.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                    {result.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {result.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </SystemWindow>
        </div>
      )}
    </div>
  );
}

