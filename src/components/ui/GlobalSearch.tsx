import { useState } from 'react';
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
import { normalizeSearchText } from '@/lib/fullTextSearch';
import { formatMonarchVernacular, normalizeMonarchSearch } from '@/lib/vernacular';
import { error as logError } from '@/lib/logger';
import { filterRowsBySourcebookAccess } from '@/lib/sourcebookAccess';

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
  source_book?: string | null;
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
      const canonicalQuery = normalizeMonarchSearch(debouncedQuery);
      const searchTerms = canonicalQuery === debouncedQuery ? [debouncedQuery] : [debouncedQuery, canonicalQuery];

      // Search across all compendium types
      const tables = [
        { table: 'compendium_jobs', type: 'jobs', hasSourceBook: true },
        { table: 'compendium_job_paths', type: 'paths', hasSourceBook: true },
        { table: 'compendium_powers', type: 'powers', hasSourceBook: true },
        { table: 'compendium_runes', type: 'runes', hasSourceBook: true },
        { table: 'compendium_relics', type: 'relics', hasSourceBook: true },
        { table: 'compendium_equipment', type: 'equipment', hasSourceBook: true },
        { table: 'compendium_monsters', type: 'monsters', hasSourceBook: true },
        { table: 'compendium_monarchs', type: 'monarchs', hasSourceBook: true },
        { table: 'compendium_sovereigns', type: 'sovereigns', hasSourceBook: true },
        { table: 'compendium_backgrounds', type: 'backgrounds', hasSourceBook: true },
        { table: 'compendium_conditions', type: 'conditions', hasSourceBook: false },
        { table: 'compendium_shadow_soldiers', type: 'shadow-soldiers', hasSourceBook: false },
        { table: 'compendium_feats', type: 'feats', hasSourceBook: true },
        { table: 'compendium_skills', type: 'skills', hasSourceBook: true },
      ] as const satisfies ReadonlyArray<{
        table: keyof Database['public']['Tables'];
        type: string;
        hasSourceBook: boolean;
      }>;

      for (const { table, type, hasSourceBook } of tables) {
        try {
          const preparedQuery = normalizeSearchText(debouncedQuery);
          if (!preparedQuery) {
            continue;
          }

          const ilikeFilters = searchTerms
            .map((term) =>
              `name.ilike.%${term}%,display_name.ilike.%${term}%,description.ilike.%${term}%`
            )
            .join(',');
          const selectColumns = hasSourceBook
            ? 'id, name, display_name, description, source_book'
            : 'id, name, display_name, description';

          const { data: ilikeData, error: ilikeError } = await supabase
            .from(table)
            .select(selectColumns)
            .or(ilikeFilters)
            .limit(5);

          if (ilikeError) {
            logError(`Error searching ${table}:`, ilikeError);
            continue;
          }

          if (!ilikeData || !Array.isArray(ilikeData)) {
            continue;
          }

          const items = ilikeData as unknown[];
          const validItems = items.filter((item): item is SearchRow => {
            if (typeof item !== 'object' || item === null) return false;
            const obj = item as Record<string, unknown>;
            if (!('id' in obj) || !('name' in obj)) return false;
            if (typeof obj.id !== 'string' || typeof obj.name !== 'string') return false;
            return true;
          });

          const filteredItems = hasSourceBook
            ? await filterRowsBySourcebookAccess(validItems, (item) => item.source_book)
            : validItems;

          if (filteredItems.length > 0) {
            allResults.push(...filteredItems.map((item: SearchRow) => ({
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
                            <span>{formatMonarchVernacular(item.name)}</span>
                            <Badge variant="outline" className="text-xs">
                              {formatMonarchVernacular(item.type)}
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
                      <span className="font-heading text-sm">{formatMonarchVernacular(result.name)}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatMonarchVernacular(result.type)}
                      </Badge>
                    </div>
                    {result.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {formatMonarchVernacular(result.description)}
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

