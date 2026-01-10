import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, Clock, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { SystemWindow } from '@/components/ui/SystemWindow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { useRecentItems } from '@/hooks/useRecentItems';
import { cn } from '@/lib/utils';
import { error as logError } from '@/lib/logger';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  description?: string;
  href: string;
}

type SearchRow = {
  id: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
};

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
        { table: 'compendium_runes', type: 'runes' },
        { table: 'compendium_relics', type: 'relics' },
        { table: 'compendium_equipment', type: 'equipment' },
        { table: 'compendium_monsters', type: 'monsters' },
        { table: 'compendium_monarchs', type: 'monarchs' },
        { table: 'compendium_sovereigns', type: 'sovereigns' },
        { table: 'compendium_backgrounds', type: 'backgrounds' },
        { table: 'compendium_conditions', type: 'conditions' },
        { table: 'compendium_shadow_soldiers', type: 'shadow-soldiers' },
        { table: 'compendium_feats', type: 'feats' },
        { table: 'compendium_skills', type: 'skills' },
      ] as const satisfies ReadonlyArray<{
        table: keyof Database['public']['Tables'];
        type: string;
      }>;

      // Use full-text search RPC functions when available, fallback to ILIKE
      const searchFunctions: Record<string, 'jobs' | 'powers' | 'relics' | 'monsters' | 'paths' | 'monarchs'> = {
        'compendium_jobs': 'jobs',
        'compendium_job_paths': 'paths',
        'compendium_powers': 'powers',
        'compendium_relics': 'relics',
        'compendium_monsters': 'monsters',
        'compendium_monarchs': 'monarchs',
      };

      for (const { table, type } of tables) {
        try {
          // Try full-text search via RPC if available
          const rpcType = searchFunctions[table];
          let data: SearchRow[] | null = null;

          if (rpcType && debouncedQuery.length > 2) {
            try {
              const { data: rpcData } = await supabase.rpc(`search_compendium_${rpcType}`, {
                search_text: debouncedQuery.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim(),
              });
              if (rpcData) {
                data = rpcData.slice(0, 5);
              }
            } catch (rpcError) {
              // Fallback to ILIKE if RPC fails
            }
          }

          // Fallback to ILIKE if RPC not available or failed
          if (!data) {
            const { data: ilikeData } = await supabase
              .from(table)
              .select('id, name, display_name, description')
              .or(`name.ilike.%${debouncedQuery}%,display_name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
              .limit(5);
            // Type guard to filter out error objects
            if (ilikeData && Array.isArray(ilikeData)) {
              const items = ilikeData as unknown[];
              const validItems = items.filter((item): item is SearchRow => {
                if (typeof item !== 'object' || item === null) return false;
                const obj = item as Record<string, unknown>;
                if (!('id' in obj) || !('name' in obj)) return false;
                if (typeof obj.id !== 'string' || typeof obj.name !== 'string') return false;
                return true;
              });
              data = validItems.length > 0 ? validItems : null;
            }
          }

          if (data && Array.isArray(data)) {
            allResults.push(...data.map((item: SearchRow) => ({
              id: item.id,
              name: item.display_name || item.name,
              type,
              description: item.description || undefined,
              href: `/compendium/${type}/${item.id}`,
            })));
          }
        } catch (error) {
          logError(`Error searching ${table}:`, error);
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
        logError('Error searching characters:', error);
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

